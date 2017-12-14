/**
 * @requires Class.OneUser.js
 */
/**
 * @singleton
 * @class CurrentUser
 * @extends OneUser
 */
CurrentUser = extending(OneUser, (function() {
	/**
	 * @class FriendsActivitiesCollection
	 * @extends UsersActivitiesCollection
	 */
	var FriendsActivitiesCollection = extending(UsersActivitiesCollection, (function() {
		/**
		 *
		 * @constructs FriendsActivitiesCollection
		 */
		function FriendsActivitiesCollection() {}
		/**
		 *
		 * @param {AJAXData} data
		 * @param {AJAXCallback} [success]
		 * @returns {Promise}
		 */
		FriendsActivitiesCollection.fetch = function(data, success) {
			data = UsersActivitiesCollection.setDefaultData(data);
			data.fields = data.fields.merge(['user']);
			return __APP.SERVER.getData('/api/v1/users/feed', data, success);
		};
		
		return FriendsActivitiesCollection;
	}()));
	/**
	 *
	 * @constructor
	 * @constructs CurrentUser
	 *
	 * @property {(number|string)} id
	 * @property {string} ?first_name
	 * @property {string} ?last_name
	 * @property {string} ?middle_name
	 * @property {string} ?full_name
	 * @property {OneUser.GENDER} ?gender
	 * @property {string} ?avatar_url
	 * @property {string} ?blurred_image_url
	 * @property {string} ?link
	 * @property {string} ?type
	 * @property {string} ?role
	 * @property {string} ?email
	 * @property {boolean} ?is_friend
	 * @property {boolean} ?is_editor
	 *
	 * @property {Array<OneUser.ACCOUNTS>} accounts
	 * @property {Object<OneUser.ACCOUNTS, string>} accounts_links
	 * @property {string} ?vk_uid
	 * @property {string} ?google_uid
	 * @property {string} ?facebook_uid
	 *
	 * @property {OrganizationsCollection} subscriptions
	 * @property {FavoredEventsCollection} favored
	 * @property {UsersActivitiesCollection} actions
	 *
	 * @property {OneCity} selected_city
	 * @property {UsersCollection} friends
	 * @property {FriendsActivitiesCollection} friends_activities
	 */
	function CurrentUser() {
		if (typeof CurrentUser.instance === 'object') {
			return CurrentUser.instance;
		}
		OneUser.call(this, 'me');
		
		this.selected_city = new OneCity();
		this.friends = new UsersCollection();
		this.friends_activities = new FriendsActivitiesCollection();
		
		CurrentUser.instance = this;
	}
	/**
	 *
	 * @param {AJAXData} [data]
	 * @param {AJAXCallback} [success]
	 * @return {Promise}
	 */
	CurrentUser.fetchFriends = function(data, success){
		
		return __APP.SERVER.getData('/api/v1/users/friends', data, success);
	};
	/**
	 *
	 * @param {(Fields|Array|string)} [fields]
	 * @param {AJAXCallback} [success]
	 *
	 * @returns {Promise}
	 */
	CurrentUser.prototype.fetchUser = function(fields, success) {
		var self = this,
			promise = OneUser.fetchUser('me', fields),
			afterAjax = function(data) {
				data = data instanceof Array ? data[0] : data;
				self.setData(data);
				if (isFunction(success)) {
					success.call(self, data);
				}
				
				return data;
			};
		
		fields = setDefaultValue(fields, []);
		
		if(fields.hasOwnProperty('friends')) {
			
			return Promise.all([promise, this.fetchFriends(fields.friends)]).then(([user_data, friends_data]) => {
				user_data = user_data instanceof Array ? user_data[0] : user_data;
				user_data.friends = friends_data;
				
				return afterAjax(user_data);
			});
		}
		
		return promise.then(afterAjax);
	};
	/**
	 *
	 * @param {AJAXData} [ajax_data]
	 * @param {AJAXCallback} [success]
	 * @returns {Promise}
	 */
	CurrentUser.prototype.fetchFriends = function(ajax_data, success) {
		
		return CurrentUser.fetchFriends({...ajax_data, offset: this.friends.length}).then(data => {
			this.friends.setData(data);
			if (isFunction(success)) {
				success.call(this, this.friends.__last_pushed);
			}
			
			return this.friends.__last_pushed;
		});
	};
	/**
	 *
	 * @param {__C.SOCIAL_NETWORKS} social_network
	 * @param {string} [redirect_after]
	 */
	CurrentUser.prototype.auth = function(social_network, redirect_after) {
		if (__APP.YA_METRIKA) {
			__APP.YA_METRIKA.reachGoal(social_network.toUpperCase() + 'AuthStart');
		}
		
		if (redirect_after) {
			try {
				window.localStorage.setItem('redirect_after_auth', redirect_after);
			} catch (e) {}
		}
		
		if (isNotDesktop() && !__APP.IS_WIDGET) {
			window.location.href = __APP.AUTH_URLS[social_network];
		} else {
			window.open(__APP.AUTH_URLS[social_network], social_network.toUpperCase() + '_AUTH_WINDOW', 'status=1,toolbar=0,menubar=0&height=500,width=700');
		}
	};
	
	CurrentUser.prototype.logout = function() {
		
		$.ajax({
			url: '/index.php',
			data: {logout: true},
			complete: function() {
				window.location = '/';
			}
		});
	};
	/**
	 *
	 * @return {boolean}
	 */
	CurrentUser.prototype.isLoggedOut = function() {
		return this.id === -1;
	};
	/**
	 *
	 * @param {(number|string)} [organization_id]
	 * @param {AJAXCallback} [success]
	 * @returns {(Promise|null)}
	 */
	CurrentUser.prototype.subscribeToOrganization = function(organization_id, success) {
		var self = this;
		if (!self.subscriptions.has(organization_id)) {
			OneOrganization.fetchOrganization(organization_id, self.subscriptions_fields, function(organization) {
				self.subscriptions.push(organization[0]);
				if (success && typeof success == 'function') {
					success.call(self, organization);
				}
			});
			return OneOrganization.subscribeOrganization(organization_id);
		} else {
			console.warn('Current user is already subscribed to this organization');
			return null;
		}
	};
	/**
	 *
	 * @param {(number|string)} [organization_id]
	 * @param {AJAXCallback} [success]
	 * @returns {(Promise|null)}
	 */
	CurrentUser.prototype.unsubscribeFromOrganization = function(organization_id, success) {
		var self = this;
		if (self.subscriptions.has(organization_id)) {
			return OneOrganization.unsubscribeOrganization(organization_id, function() {
				self.subscriptions.remove(organization_id);
				if (success && typeof success == 'function') {
					success.call(self, organization_id);
				}
			});
		} else {
			console.warn('Current user isn`t subscribed to this organization');
			return null;
		}
	};
	
	return CurrentUser;
}()));