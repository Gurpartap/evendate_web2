/**
 * @requires ../Class.OneEntity.js
 * @requires ../../data_models/registration_field/Class.RegistrationFieldsCollection.js
 */
/**
 * @class OneEvent
 * @extends OneEntity
 */
OneEvent = extending(OneEntity, (function() {
	/**
	 *
	 * @constructor
	 * @constructs OneEvent
	 * @param {(string|number)} [event_id]
	 * @param {boolean} [is_loading_continuous]
	 */
	function OneEvent(event_id, is_loading_continuous) {
		this.id = event_id ? event_id : 0;
		this.title = '';
		this.description = '';
		this.location = '';
		this.latitude = '';
		this.longitude = '';
		this.is_online = false;
		this.detail_info_url = '';
		this.can_edit = false;
		this.registration_required = false;
		this.registration_limit_count = 0;
		this.registration_locally = false;
		this.registration_till = '';
		this.registration_approved = false;
		this.registration_approvement_required = false;
		this.registered_count = 0;
		this.registered_users = new UsersCollection();
		this.registration_fields = new RegistrationFieldsCollection();
		this.organization_id = 0;
		this.organization_short_name = '';
		this.image_vertical_url = '';
		this.image_horizontal_url = '';
		this.image_horizontal_large_url = '';
		this.image_horizontal_small_url = '';
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
		this.public_at = null;
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
	 * @returns {jqPromise}
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
	 * @param {function} [error]
	 * @returns {jqPromise}
	 */
	OneEvent.createEvent = function(new_event_data, success, error) {
		return __APP.SERVER.addData('/api/v1/events/', new_event_data, true, success, error);
	};
	/**
	 *
	 * @param {(string|number)} event_id
	 * @param {OneEventCreateEventData} data
	 * @param {OneEventCreateEventCallback} [success]
	 * @param {function} [error]
	 * @returns {jqPromise}
	 */
	OneEvent.updateEvent = function(event_id, data, success, error) {
		return __APP.SERVER.updateData('/api/v1/events/' + event_id, data, true, success, error);
	};
	/**
	 *
	 * @param {(string|number)} event_id
	 * @param {(OneEvent.STATUS|Array<OneEvent.STATUS>)} status
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
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
		return __APP.SERVER.updateData('/api/v1/events/' + event_id + '/status', data, false, function() {
			if (success && typeof success == 'function') {
				success.call(self, data);
			}
		});
	};
	/**
	 *
	 * @param {(string|number)} event_id
	 * @param {function} [success]
	 * @returns {jqPromise}
	 */
	OneEvent.addFavored = function(event_id, success) {
		return __APP.SERVER.addData('/api/v1/events/' + event_id + '/favorites', {}, false, success);
	};
	/**
	 *
	 * @param {(string|number)} event_id
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	OneEvent.deleteFavored = function(event_id, success) {
		return __APP.SERVER.deleteData('/api/v1/events/' + event_id + '/favorites', {}, success);
	};
	/**
	 *
	 * @param {(string|number)} event_id
	 * @param {string} notification_type
	 * @param {function} [success]
	 * @returns {jqPromise}
	 */
	OneEvent.addEventNotification = function(event_id, notification_type, success) {
		return __APP.SERVER.addData('/api/v1/events/' + event_id + '/notifications', {notification_type: notification_type}, false, success);
	};
	/**
	 *
	 * @param {(string|number)} event_id
	 * @param {string} notification_uuid
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	OneEvent.deleteEventNotification = function(event_id, notification_uuid, success) {
		return __APP.SERVER.deleteData('/api/v1/events/' + event_id + '/notifications/' + notification_uuid, {}, success);
	};
	/**
	 *
	 * @param {(string|number)} event_id
	 * @param {object} registration_fields
	 * @param {AJAXCallback} [success]
	 * @return {jqPromise}
	 */
	OneEvent.registerToEvent = function(event_id, registration_fields, success) {
		return __APP.SERVER.addData('/api/v1/events/' + event_id + '/orders', {
			registration_fields: registration_fields,
			tickets: [{count: 1}]
		}, true, success);
	};
	/**
	 *
	 * @param {(Fields|string|Array)} fields
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
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
	 * @param {function} [error]
	 * @returns {jqPromise}
	 */
	OneEvent.prototype.createEvent = function(data, success, error) {
		var self = this;
		return this.constructor.createEvent(data, function(response_data) {
			self.setData(data);
			self.id = response_data.event_id;
			if (success && typeof success == 'function') {
				success.call(self, data);
			}
		}, error);
	};
	/**
	 *
	 * @param {OneEventCreateEventData} data
	 * @param {OneEventCreateEventCallback} [success]
	 * @param {function} [error]
	 * @returns {jqPromise}
	 */
	OneEvent.prototype.updateEvent = function(data, success, error) {
		var self = this;
		return this.constructor.updateEvent(self.id, data, function(response_data) {
			self.setData(data);
			if (success && typeof success == 'function') {
				success.call(self, data);
			}
		}, error);
	};
	/**
	 *
	 * @param {(OneEvent.STATUS|Array<OneEvent.STATUS>)} status
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
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
	 * @returns {jqPromise}
	 */
	OneEvent.prototype.addNotification = function(notification_type, success) {
		return this.constructor.addEventNotification(this.id, notification_type, success);
	};
	/**
	 *
	 * @param {string} notification_uuid
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	OneEvent.prototype.deleteNotification = function(notification_uuid, success) {
		return this.constructor.deleteEventNotification(this.id, notification_uuid, success);
	};
	/**
	 *
	 * @param {object} registration_fields
	 * @param {AJAXCallback} [success]
	 * @return {jqPromise}
	 */
	OneEvent.prototype.registerToEvent = function(registration_fields, success) {
		return this.constructor.registerToEvent(this.id, registration_fields, success);
	};
	
	return OneEvent;
}()));