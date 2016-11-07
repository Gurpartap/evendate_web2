/**
 * @requires ../Class.EntitiesCollection.js
 * @requires Class.OneActivity.js
 */
/**
 *
 * @constructor
 * @augments EntitiesCollection
 */
function ActivitiesCollection() {}
ActivitiesCollection.extend(EntitiesCollection);
ActivitiesCollection.prototype.collection_of = OneActivity;
/**
 *
 * @param {(string|number)} user_id
 * @param {AJAXData} data
 * @param {AJAXCallback} [success]
 * @returns {jqXHR}
 */
ActivitiesCollection.fetchUserActions = function(user_id, data, success) {
	return __APP.SERVER.getData('/api/v1/users/' + user_id + '/actions', data, success);
};
/**
 *
 * @param {AJAXData} data
 * @param {AJAXCallback} [success]
 * @returns {jqXHR}
 */
ActivitiesCollection.fetchFriendsActions = function(data, success) {
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
ActivitiesCollection.prototype.fetchUserActions = function(fields, length, order_by, success) {
	var self = this,
		ajax_data = {
			fields: fields,
			offset: this.length,
			length: length
		};
	if (order_by) {
		ajax_data.order_by = order_by;
	}
	return this.constructor.fetchUserActions(ajax_data, function(data) {
		self.setData(data);
		if (success && typeof success == 'function') {
			success.call(self, data);
		}
	});
};
/**
 *
 * @param {(Array|string)} [fields]
 * @param {(number|string)} [length]
 * @param {string} [order_by]
 * @param {AJAXCallback} [success]
 * @returns {jqXHR}
 */
ActivitiesCollection.prototype.fetchFriendsActions = function(fields, length, order_by, success) {
	var self = this,
		ajax_data = {
			fields: fields,
			offset: this.length,
			length: length
		};
	if (order_by) {
		ajax_data.order_by = order_by;
	}
	return this.constructor.fetchFriendsActions(ajax_data, function(data) {
		self.setData(data);
		if (success && typeof success == 'function') {
			success.call(self, data);
		}
	});
};