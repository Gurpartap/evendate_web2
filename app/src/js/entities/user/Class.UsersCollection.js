/**
 * @requires ../Class.EntitiesCollection.js
 * @requires Class.OneUser.js
 */
/**
 * @typedef {AJAXData} UsersCollectionAJAXData
 * @property {string} [first_name]
 * @property {string} [last_name]
 * @property {string} [name]
 */
/**
 *
 * @class UsersCollection
 * @extends EntitiesCollection
 */
UsersCollection = extending(EntitiesCollection, (function() {
	/**
	 *
	 * @constructor
	 * @constructs UsersCollection
	 */
	function UsersCollection() {
		EntitiesCollection.call(this);
	}
	UsersCollection.prototype.collection_of = OneUser;
	/**
	 * Returns specified staff by role. Mixing additional_fields if needed.
	 * @param {OneUser.ROLE} role
	 * @param {(Array<OneUser>|UsersCollection)} staff
	 * @return {Array<OneUser>}
	 */
	UsersCollection.getSpecificStaff = function(role, staff) {
		
		return staff.filter(function(man) {
			return man.role === role;
		});
	};
	/**
	 *
	 * @param {UsersCollectionAJAXData} data
	 * @param {AJAXCallback} [success]
	 * @returns {Promise}
	 */
	UsersCollection.fetchUsers = function(data, success) {
		return __APP.SERVER.getData('/api/v1/users/', data, success);
	};
	/**
	 *
	 * @param {(string|number)} event_id
	 * @param {UsersCollectionAJAXData} ajax_data
	 * @param {AJAXCallback} [success]
	 * @returns {Promise}
	 */
	UsersCollection.fetchEventFavorites = function(event_id, ajax_data, success) {
		return __APP.SERVER.getData('/api/v1/events/' + event_id, {fields: 'favored'.appendAjaxData(__APP.SERVER.validateData(ajax_data))}, function(data) {
			if (ajax_data.length && ajax_data.offset) {
				ajax_data.offset += ajax_data.length;
			}
			if (success && typeof success == 'function') {
				success(data[0].favored);
			}
		});
	};
	/**
	 *
	 * @param {(string|number)} org_id
	 * @param {UsersCollectionAJAXData} ajax_data
	 * @param {AJAXCallback} [success]
	 * @returns {Promise}
	 */
	UsersCollection.fetchOrganizationSubscribers = function(org_id, ajax_data, success) {
		return __APP.SERVER.getData('/api/v1/organizations/' + org_id, {fields: 'subscribed'.appendAjaxData(__APP.SERVER.validateData(ajax_data))}, function(data) {
			if (ajax_data.length && ajax_data.offset) {
				ajax_data.offset += ajax_data.length;
			}
			if (success && typeof success == 'function') {
				success(data[0].subscribed);
			}
		});
	};
	/**
	 *
	 * @param {(string|number)} org_id
	 * @param {UsersCollectionAJAXData} ajax_data
	 * @param {AJAXCallback} [success]
	 * @returns {Promise}
	 */
	UsersCollection.fetchOrganizationStaff = function(org_id, ajax_data, success) {
		return __APP.SERVER.getData('/api/v1/organizations/' + org_id + '/staff/', ajax_data, success);
	};
	/**
	 * Returns specified staff by role. Mixing additional_fields if needed.
	 * @param {OneUser.ROLE} role
	 * @return {Array<OneUser>}
	 */
	UsersCollection.prototype.getSpecificStaff = function(role) {
		
		return UsersCollection.getSpecificStaff(role, this);
	};
	/**
	 *
	 * @param {UsersCollectionAJAXData} [data]
	 * @param {(number|string)} [length]
	 * @param {AJAXCallback} [success]
	 * @this Array<OneUser>
	 * @returns {Promise}
	 */
	UsersCollection.prototype.fetchUsers = function(data, length, success) {
		var self = this,
			ajax_data = $.extend(data, {
				offset: this.length,
				length: length
			});
		return UsersCollection.fetchUsers(ajax_data, function(data) {
			self.setData(data);
			if (success && typeof success == 'function') {
				success.call(self, data);
			}
		});
	};
	/**
	 *
	 * @param {(string|number)} event_id
	 * @param {(number|string)} length
	 * @param {UsersCollectionAJAXData} [data]
	 * @param {AJAXCallback} [success]
	 * @returns {Promise}
	 */
	UsersCollection.prototype.fetchEventFavorites = function(event_id, length, data, success) {
		var self = this,
			ajax_data = $.extend({}, data, {
				offset: this.length,
				length: length
			});
		return UsersCollection.fetchEventFavorites(event_id, ajax_data, function(data) {
			self.setData(data);
			if (success && typeof success == 'function') {
				success.call(self, data);
			}
		});
	};
	/**
	 *
	 * @param {(string|number)} org_id
	 * @param {(number|string)} length
	 * @param {UsersCollectionAJAXData} [data]
	 * @param {AJAXCallback} [success]
	 * @returns {Promise}
	 */
	UsersCollection.prototype.fetchOrganizationSubscribers = function(org_id, length, data, success) {
		var self = this,
			ajax_data = $.extend({}, data, {
				offset: this.length,
				length: length
			});
		return this.constructor.fetchOrganizationSubscribers(org_id, ajax_data, function(data) {
			self.setData(data);
			if (success && typeof success == 'function') {
				success.call(self, data);
			}
		});
	};
	/**
	 *
	 * @param {(string|number)} org_id
	 * @param {(number|string)} length
	 * @param {UsersCollectionAJAXData} [data]
	 * @param {AJAXCallback} [success]
	 * @returns {Promise}
	 */
	UsersCollection.prototype.fetchOrganizationStaff = function(org_id, length, data, success) {
		var self = this,
			ajax_data = $.extend({}, data, {
				offset: this.length,
				length: length
			});
		return UsersCollection.fetchOrganizationStaff(org_id, ajax_data, function(data) {
			self.setData(data);
			if (success && typeof success == 'function') {
				success.call(self, data);
			}
		});
	};
	
	return UsersCollection;
})());
