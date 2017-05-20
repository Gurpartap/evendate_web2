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
		 * @returns {jqPromise}
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
	 * @return {jqPromise}
	 */
	CurrentUser.fetchFriends = function(data, success){
		return __APP.SERVER.getData('/api/v1/users/friends', data, success);
	};
	/**
	 *
	 * @param {(Fields|Array|string)} [fields]
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	CurrentUser.prototype.fetchUser = function(fields, success) {
		var self = this,
			promise = OneUser.fetchUser('me', fields),
			afterAjax = function(data) {
				data = data instanceof Array ? data[0] : data;
				self.setData(data);
				if (success && typeof success == 'function') {
					success.call(self, data);
				}
			};
		fields = setDefaultValue(fields, []);
		
		if(fields.hasOwnProperty('friends')) {
			return __APP.SERVER.multipleAjax(promise, this.fetchFriends(fields.friends)).done(function(user_data, friends_data) {
				user_data = user_data instanceof Array ? user_data[0] : user_data;
				user_data.friends = friends_data;
				afterAjax(user_data);
			}).promise();
		}
		return promise.done(afterAjax).promise();
	};
	/**
	 *
	 * @param {AJAXData} [ajax_data]
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	CurrentUser.prototype.fetchFriends = function(ajax_data, success) {
		var self = this;
		ajax_data = $.extend(ajax_data, {
			offset: self.friends.length
		});
		return CurrentUser.fetchFriends(ajax_data, function(data) {
			self.friends.setData(data);
			if (success && typeof success == 'function') {
				success.call(self, self.friends.last_pushed);
			}
		});
	};
	/**
	 *
	 * @returns {jqPromise}
	 */
	CurrentUser.prototype.logout = function() {
		return $.ajax({
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
	 * @returns {(jqPromise|null)}
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
	 * @returns {(jqPromise|null)}
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