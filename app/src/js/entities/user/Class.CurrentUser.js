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
	 * @class FriendsActivitiesCollection
	 * @extends AbstractActivitiesCollection
	 */
	var FriendsActivitiesCollection = extending(AbstractActivitiesCollection, (function() {
		/**
		 *
		 * @constructs FriendsActivitiesCollection
		 */
		function FriendsActivitiesCollection() {}
		/**
		 *
		 * @param {AJAXData} data
		 * @param {AJAXCallback} [success]
		 * @returns {jqXHR}
		 */
		FriendsActivitiesCollection.fetch = function(data, success) {
			data = AbstractActivitiesCollection.setDefaultData(data);
			data.fields = data.fields.merge(['user']);
			return __APP.SERVER.getData('/api/v1/users/feed', data, success);
		};
		/**
		 *
		 * @param {(Array|string)} [fields]
		 * @param {(number|string)} [length]
		 * @param {string} [order_by]
		 * @param {AJAXCallback} [success]
		 * @returns {jqXHR}
		 */
		FriendsActivitiesCollection.prototype.fetch = function(fields, length, order_by, success) {
			var self = this,
				ajax_data = {
					fields: fields,
					offset: this.length,
					length: length
				};
			if (order_by) {
				ajax_data.order_by = order_by;
			}
			return FriendsActivitiesCollection.fetch(ajax_data, function(data) {
				self.setData(data);
				if (success && typeof success == 'function') {
					success.call(self, data);
				}
			});
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
		this.friends = new UsersCollection();
		this.friends_activities = new FriendsActivitiesCollection();
		CurrentUser.instance = this;
	}
	/**
	 *
	 * @param {AJAXData} [data]
	 * @param {AJAXCallback} [success]
	 * @return {jqXHR}
	 */
	CurrentUser.fetchFriends = function(data, success){
		return __APP.SERVER.getData('/api/v1/users/friends', data, success);
	};
	/**
	 *
	 * @param {(Array|string)} [fields]
	 * @param {AJAXCallback} [success]
	 * @returns {jqXHR}
	 */
	CurrentUser.prototype.fetchUser = function(fields, success) {
		var self = this;
		fields = setDefaultValue(fields, []);
		
		return OneAbstractUser.fetchUser('me', fields, function(data) {
			data = data instanceof Array ? data[0] : data;
			self.setData(data);
			if (success && typeof success == 'function') {
				success.call(self, data);
			}
		});
	};
	/**
	 *
	 * @param {AJAXData} [ajax_data]
	 * @param {AJAXCallback} [success]
	 * @returns {jqXHR}
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
	 * @param {(Array|string)} [fields]
	 * @param {AJAXData} [subscriptions_ajax_data]
	 * @param {AJAXCallback} [success]
	 * @returns {jqXHR}
	 */
	CurrentUser.prototype.fetchUserWithSubscriptions = function(fields, subscriptions_ajax_data, success) {
		var self = this,
			user_XHR = OneAbstractUser.fetchUser('me', fields);
		subscriptions_ajax_data = $.extend({fields: self.subscriptions_fields}, subscriptions_ajax_data, {
			offset: self.subscriptions.length
		});
		__APP.SERVER.multipleAjax(user_XHR, OrganizationsCollection.fetchSubscribedOrganizations(subscriptions_ajax_data), function(user_data, subscriptions_data) {
			user_data = user_data[0];
			user_data.subscriptions = subscriptions_data;
			self.setData(user_data);
			if (success && typeof success == 'function') {
				success.call(self, user_data);
			}
		});
		return user_XHR;
	};
	/**
	 *
	 * @returns {jqXHR}
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
	 * @returns {(jqXHR|null)}
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
	 * @returns {(jqXHR|null)}
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