/**
 * @requires Class.OneUser.js
 */
/**
 *
 * @constructor - Implements singleton
 * @augments OneUser
 */
function CurrentUser() {
	if (typeof CurrentUser.instance === 'object') {
		return CurrentUser.instance;
	}
	OneUser.apply(this, ['me']);
	this.friends = new UsersCollection();
	CurrentUser.instance = this;
}
CurrentUser.extend(OneUser);
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
/**
 *
 * @param {(Array|string)} [fields]
 * @param {AJAXData} [subscriptions_ajax_data]
 * @param {AJAXCallback} [success]
 * @returns {jqXHR}
 */
CurrentUser.prototype.fetchUserWithSubscriptions = function(fields, subscriptions_ajax_data, success) {
	var self = this;
	subscriptions_ajax_data = $.extend({fields: self.subscriptions_fields}, subscriptions_ajax_data, {
		offset: self.subscriptions.length
	});
	return OneUser.fetchUser(self.id, fields, function(data) {
		data = data[0];
		OrganizationsCollection.fetchSubscribedOrganizations(subscriptions_ajax_data, function(organizations) {
			data.subscriptions = organizations;
			self.setData(data);
			if (success && typeof success == 'function') {
				success.call(self, data);
			}
		});
	});
};