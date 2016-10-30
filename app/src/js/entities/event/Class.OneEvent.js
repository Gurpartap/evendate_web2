/**
 * @requires ../Class.OneEntity.js
 */
/**
 *
 * @constructor
 * @augments OneEntity
 * @param {(string|number)} [event_id]
 * @param {boolean} [is_loading_continuous]
 */
function OneEvent(event_id, is_loading_continuous) {
	this.id = event_id ? event_id : 0;
	this.title = '';
	this.description = '';
	this.location = '';
	this.detail_info_url = '';
	this.can_edit = false;
	this.registration_required = false;
	this.registration_till = '';
	this.organization_id = 0;
	this.organization_short_name = '';
	this.image_vertical_url = '';
	this.image_horizontal_url = '';
	this.image_horizontal_large_url = '';
	this.organization_logo_small_url = '';
	this.is_free = false;
	this.min_price = 0;
	this.first_event_date = null;
	this.last_event_date = null;
	this.nearest_event_date = null;
	this.is_same_time = false;
	this.dates = new DatesCollection();
	this.tags = new TagsCollection();
	this.notifications = [];
	this.favored = new UsersCollection();
	this.favored_users_count = 0;
	this.is_favorite = false;
	this.canceled = false;
	this.loading = false;
	
	if (event_id && is_loading_continuous) {
		this.loading = true;
		this.fetchEvent([], function() {
			this.loading = false;
			$(window).trigger('fetch.OneEvent');
		});
	}
}
OneEvent.extend(OneEntity);
/**
 * @const
 * @enum {string}
 */
OneEvent.STATUS = {
	CANCEL: 'cancel',
	BRING_BACK: 'bring_back',
	HIDE: 'hide',
	SHOW: 'show'
};
/**
 *
 * @param {(string|number)} event_id
 * @param {(string|Array)} [fields]
 * @param {AJAXCallback} [success]
 * @returns {jqXHR}
 */
OneEvent.fetchEvent = function(event_id, fields, success) {
	return __APP.SERVER.getData('/api/v1/events/' + event_id, fields || (Array.isArray(fields) && fields.length) ? {fields: fields} : {}, success);
};
/**
 * @typedef {function({
 *   event_id: number
 * })} OneEventCreateEventCallback
 */
/**
 * @typedef {object} OneEventCreateEventData
 * @property {string} [title]
 * @property {string} [description]
 * @property {string} [location]
 * @property {integer} [organization_id]
 * @property {object} [location_object]
 * @property {number} [location_object.latitude]
 * @property {number} [location_object.longitude]
 * @property {number} [longitude]
 * @property {number} [latitude]
 * @property {string} [image_horizontal]
 * @property {string} [detail_info_url]
 * @property {DatesCollection} [dates]
 * @property {Array<(string|number)>} [tags]
 */
/**
 *
 * @param {OneEventCreateEventData} new_event_data
 * @param {OneEventCreateEventCallback} [success]
 * @returns {jqXHR}
 */
OneEvent.createEvent = function(new_event_data, success) {
	return __APP.SERVER.addData('/api/v1/events/', JSON.stringify(new_event_data), true, success);
};
/**
 *
 * @param {(string|number)} event_id
 * @param {OneEventCreateEventData} data
 * @param {OneEventCreateEventCallback} [success]
 * @returns {jqXHR}
 */
OneEvent.updateEvent = function(event_id, data, success) {
	return __APP.SERVER.updateData('/api/v1/events/' + event_id, JSON.stringify(data), success);
};
/**
 *
 * @param {(string|number)} event_id
 * @param {(OneEvent.STATUS|Array<OneEvent.STATUS>)} status
 * @param {AJAXCallback} [success]
 * @returns {jqXHR}
 */
OneEvent.changeEventStatus = function(event_id, status, success) {
	var data = {};
	status = Array.isArray(status) ? status : [status];
	status.forEach(function(el) {
		switch (el) {
			case OneEvent.STATUS.CANCEL: {
				data.canceled = true;
				break;
			}
			case OneEvent.STATUS.BRING_BACK: {
				data.canceled = false;
				break;
			}
			case OneEvent.STATUS.HIDE: {
				data.hidden = true;
				break;
			}
			case OneEvent.STATUS.SHOW: {
				data.hidden = false;
				break;
			}
		}
	});
	return __APP.SERVER.updateData('/api/v1/events/' + event_id + '/status', data, function() {
		if (success && typeof success == 'function') {
			success.call(self, data);
		}
	});
};
/**
 *
 * @param {(string|number)} event_id
 * @param {function} [success]
 * @returns {jqXHR}
 */
OneEvent.addFavored = function(event_id, success) {
	return __APP.SERVER.addData('/api/v1/events/' + event_id + '/favorites', {}, false, success);
};
/**
 *
 * @param {(string|number)} event_id
 * @param {AJAXCallback} [success]
 * @returns {jqXHR}
 */
OneEvent.deleteFavored = function(event_id, success) {
	return __APP.SERVER.deleteData('/api/v1/events/' + event_id + '/favorites', {}, success);
};
/**
 *
 * @param {(string|number)} event_id
 * @param {string} notification_type
 * @param {function} [success]
 * @returns {jqXHR}
 */
OneEvent.addEventNotification = function(event_id, notification_type, success) {
	return __APP.SERVER.addData('/api/v1/events/' + event_id + '/notifications', {notification_type: notification_type}, false, success);
};
/**
 *
 * @param {(string|number)} event_id
 * @param {string} notification_uuid
 * @param {AJAXCallback} [success]
 * @returns {jqXHR}
 */
OneEvent.deleteEventNotification = function(event_id, notification_uuid, success) {
	return __APP.SERVER.deleteData('/api/v1/events/' + event_id + '/notifications/' + notification_uuid, {}, success);
};
/**
 *
 * @param {(string|Array)} fields
 * @param {AJAXCallback} [success]
 * @returns {jqXHR}
 */
OneEvent.prototype.fetchEvent = function(fields, success) {
	var self = this;
	return this.constructor.fetchEvent(self.id, fields, function(data) {
		self.setData(data[0]);
		if (success && typeof success == 'function') {
			success.call(self, data[0]);
		}
	});
};
/**
 *
 * @param {OneEventCreateEventData} data
 * @param {OneEventCreateEventCallback} [success]
 * @returns {jqXHR}
 */
OneEvent.prototype.createEvent = function(data, success) {
	var self = this;
	return this.constructor.createEvent(data, function(response_data) {
		self.setData(data);
		self.id = response_data.event_id;
		if (success && typeof success == 'function') {
			success.call(self, data);
		}
	});
};
/**
 *
 * @param {OneEventCreateEventData} data
 * @param {OneEventCreateEventCallback} [success]
 * @returns {jqXHR}
 */
OneEvent.prototype.updateEvent = function(data, success) {
	var self = this;
	return this.constructor.updateEvent(self.id, data, function(response_data) {
		self.setData(data);
		if (success && typeof success == 'function') {
			success.call(self, data);
		}
	});
};
/**
 *
 * @param {(OneEvent.STATUS|Array<OneEvent.STATUS>)} status
 * @param {AJAXCallback} [success]
 * @returns {jqXHR}
 */
OneEvent.prototype.changeEventStatus = function(status, success) {
	var self = this;
	return this.constructor.changeEventStatus(self.id, status, function(data) {
		self.setData(data);
		if (success && typeof success == 'function') {
			success.call(self, data);
		}
	});
};
/**
 *
 * @param {string} notification_type
 * @param {function} [success]
 * @returns {jqXHR}
 */
OneEvent.prototype.addNotification = function(notification_type, success) {
	return this.constructor.addEventNotification(this.id, notification_type, success);
};
/**
 *
 * @param {string} notification_uuid
 * @param {AJAXCallback} [success]
 * @returns {jqXHR}
 */
OneEvent.prototype.deleteNotification = function(notification_uuid, success) {
	return this.constructor.deleteEventNotification(this.id, notification_uuid, success);
};