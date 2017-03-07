/**
 * @requires ../Class.EntitiesCollection.js
 * @requires Class.OneOrganization.js
 */
/**
 *
 * @class OrganizationsCollection
 * @extends EntitiesCollection
 */
OrganizationsCollection = extending(EntitiesCollection, (function() {
	/**
	 *
	 * @constructor
	 * @constructs OrganizationsCollection
	 */
	function OrganizationsCollection() {}
	OrganizationsCollection.prototype.collection_of = OneOrganization;
	/**
	 *
	 * @param {AJAXData} data
	 * @param {AJAXCallback} [success]
	 */
	OrganizationsCollection.fetchSubscribedOrganizations = function(data, success) {
		return __APP.SERVER.getData('/api/v1/organizations/subscriptions', data, success);
	};
	/**
	 *
	 * @param {(string|Array)} [roles]
	 * @param {AJAXData} [data]
	 * @param {AJAXCallback} [success]
	 */
	OrganizationsCollection.fetchMyOrganizations = function(roles, data, success) {
		roles = Array.isArray(roles) ? roles.join(',') : roles;
		return __APP.SERVER.getData('/api/v1/organizations/', $.extend({}, data, {roles: roles}), success);
	};
	/**
	 *
	 * @param {AJAXData} data
	 * @param {AJAXCallback} [success]
	 */
	OrganizationsCollection.fetchRecommendations = function(data, success) {
		return __APP.SERVER.getData('/api/v1/organizations/recommendations', data, success);
	};
	/**
	 *
	 * @param {(Array|string)} [fields]
	 * @param {(number|string)} [length]
	 * @param {string} [order_by]
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	OrganizationsCollection.prototype.fetchSubscribedOrganizations = function(fields, length, order_by, success) {
		var self = this,
			ajax_data = {
				fields: fields,
				offset: this.length,
				length: length,
				order_by: order_by || undefined
			};
		return this.constructor.fetchSubscribedOrganizations(ajax_data, function(data) {
			self.setData(data);
			if (success && typeof success == 'function') {
				success.call(self, data);
			}
		});
	};
	/**
	 *
	 * @param {(Array<string>|string)} roles
	 * @param {(Array<string>|string)} [fields]
	 * @param {(number|string)} [length]
	 * @param {string} [order_by]
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	OrganizationsCollection.prototype.fetchMyOrganizations = function(roles, fields, length, order_by, success) {
		var self = this,
			ajax_data = {
				fields: fields,
				length: length,
				offset: this.length,
				order_by: order_by || undefined
			};
		return OrganizationsCollection.fetchMyOrganizations(roles, ajax_data, function(data) {
			self.setData(data);
			if (success && typeof success == 'function') {
				success.call(self, data);
			}
		});
	};
	
	return OrganizationsCollection;
}()));