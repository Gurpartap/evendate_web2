/**
 * @requires Class.OneAbstractUser.js
 * @requires ../activity/Class.AbstractActivitiesCollection.js
 */
/**
 * @class CurrentUser
 * @extends OneAbstractUser
 */
CurrentUser = extending(OneAbstractUser, (function() {
	/**
	 * @class CurrentUsersActivitiesCollection
	 * @extends AbstractActivitiesCollection
	 */
	var CurrentUsersActivitiesCollection = extending(AbstractActivitiesCollection, (function() {
		/**
		 *
		 * @constructs CurrentUsersActivitiesCollection
		 */
		function CurrentUsersActivitiesCollection() {}
		/**
		 *
		 * @param {AJAXData} data
		 * @param {AJAXCallback} [success]
		 * @returns {jqPromise}
		 */
		CurrentUsersActivitiesCollection.fetch = function(data, success) {
			var self = true;
			data = AbstractActivitiesCollection.setDefaultData(data);
			return __APP.SERVER.getData('/api/v1/users/me/', {fields: 'actions'.appendAjaxData(data)}, function(user_data) {
				user_data = user_data instanceof Array ? user_data[0] : user_data;
				if (success && typeof success == 'function') {
					success.call(self, user_data.actions);
				}
			});
		};
		/**
		 *
		 * @param {(Array|string)} [fields]
		 * @param {(number|string)} [length]
		 * @param {string} [order_by]
		 * @param {AJAXCallback} [success]
		 * @returns {jqPromise}
		 */
		CurrentUsersActivitiesCollection.prototype.fetch = function(fields, length, order_by, success) {
			var self = this,
				ajax_data = {
					fields: fields,
					offset: this.length,
					length: length
				};
			if (order_by) {
				ajax_data.order_by = order_by;
			}
			return this.constructor.fetch(ajax_data, function(data) {
				self.setData(data);
				if (success && typeof success == 'function') {
					success.call(self, (new self.constructor()).setData(data));
				}
			});
		};
		
		return CurrentUsersActivitiesCollection;
	}()));
	/**
	 * @class FriendsActivitiesCollection
	 * @extends AbstractActivitiesCollection
	 */
	var FriendsActivitiesCollection = extending(CurrentUsersActivitiesCollection, (function() {
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
			data = AbstractActivitiesCollection.setDefaultData(data);
			data.fields = data.fields.merge(['user']);
			return __APP.SERVER.getData('/api/v1/users/feed', data, success);
		};
		
		return FriendsActivitiesCollection;
	}()));
	/**
	 *
	 * @constructs - Implements singleton
	 * @augments OneAbstractUser
	 */
	function CurrentUser() {
		if (typeof CurrentUser.instance === 'object') {
			return CurrentUser.instance;
		}
		OneAbstractUser.apply(this, ['me']);
		this.actions = new CurrentUsersActivitiesCollection();
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
	 * @param {AJAXData} [data]
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	CurrentUser.fetchUserActivity = function(data, success) {
		return CurrentUsersActivitiesCollection.fetch(data, success);
	};
	/**
	 *
	 * @param {(Array|string)} [fields]
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	CurrentUser.prototype.fetchUser = function(fields, success) {
		var self = this,
			promise = OneAbstractUser.fetchUser('me', fields),
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
		return OneAbstractUser.fetchUser('me', fields).done(afterAjax).promise();
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
			self.setData({friends: data});
			if (success && typeof success == 'function') {
				success.call(self, data);
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