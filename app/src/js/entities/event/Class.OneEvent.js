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
	 * @param {(string|number)} [event_id=0]
	 * @param {boolean} [is_loading_continuous]
	 *
	 *
	 * @property {number} id
	 * @property {?string} title
	 * @property {?string} description
	 *
	 * @property {?string} location
	 * @property {?string} latitude
	 * @property {?string} longitude
	 * @property {?boolean} is_online
	 *
	 * @property {?string} detail_info_url
	 *
	 * @property {OrdersCollection} orders
	 *
	 * @property {?boolean} ticketing_locally
	 * @property {TicketsCollection} tickets
	 * @property {TicketTypesCollection} ticket_types
	 *
	 * @property {?boolean} registration_locally
	 * @property {?boolean} registration_available
	 * @property {?boolean} registration_required
	 * @property {?number} registration_limit_count
	 * @property {?string} registration_till
	 * @property {?string} registration_approve_status
	 * @property {?boolean} registration_approvement_required
	 * @property {?boolean} is_registered
	 * @property {?number} registered_count
	 * @property {UsersCollection} registered_users
	 * @property {RegistrationFieldsCollection} registration_fields
	 *
	 * @property {?number} organization_id
	 * @property {?string} organization_short_name
	 * @property {?string} organization_logo_large_url
	 * @property {?string} organization_logo_medium_url
	 * @property {?string} organization_logo_small_url
	 *
	 * @property {?string} image_vertical_url
	 * @property {?string} image_horizontal_url
	 * @property {?string} image_horizontal_large_url
	 * @property {?string} image_horizontal_medium_url
	 * @property {?string} image_horizontal_small_url
	 *
	 * @property {?boolean} is_free
	 * @property {?number} min_price
	 *
	 * @property {DatesCollection} dates
	 * @property {?boolean} is_same_time
	 * @property {?number} first_event_date
	 * @property {?number} last_event_date
	 * @property {?number} nearest_event_date
	 *
	 * @property {TagsCollection} tags
	 *
	 * @property {Array} notifications
	 *
	 * @property {UsersCollection} favored
	 * @property {?number} favored_users_count
	 * @property {?number} favored_friends_count
	 * @property {?boolean} is_favorite
	 *
	 * @property {?number} public_at
	 * @property {?boolean} canceled
	 * @property {?boolean} can_edit
	 *
	 * @property {?number} actuality
	 *
	 * @property {?number} creator_id
	 * @property {?number} created_at
	 * @property {?number} updated_at
	 */
	function OneEvent(event_id, is_loading_continuous) {
		this.id = event_id ? event_id : 0;
		this.title = null;
		this.description = null;
		
		this.location = null;
		this.latitude = null;
		this.longitude = null;
		this.is_online = null;
		
		this.detail_info_url = null;
		
		this.orders = new OrdersCollection(event_id);
		
		this.ticketing_locally = null;
		this.tickets = new TicketsCollection(event_id);
		this.ticket_types = new TicketTypesCollection(event_id);
		
		this.registration_locally = null;
		this.registration_available = null;
		this.registration_required = null;
		this.registration_limit_count = null;
		this.registration_till = null;
		this.registration_approve_status = null;
		this.registration_approvement_required = null;
		this.is_registered = null;
		this.registered_count = null;
		this.registered_users = new UsersCollection();
		this.registration_fields = new RegistrationFieldsCollection();
		
		this.organization_id = null;
		this.organization_short_name = null;
		this.organization_logo_large_url = null;
		this.organization_logo_medium_url = null;
		this.organization_logo_small_url = null;
		
		this.image_vertical_url = null;
		this.image_horizontal_url = null;
		this.image_horizontal_large_url = null;
		this.image_horizontal_medium_url = null;
		this.image_horizontal_small_url = null;
		
		this.is_free = null;
		this.min_price = null;
		
		this.dates = new DatesCollection();
		this.is_same_time = null;
		this.first_event_date = null;
		this.last_event_date = null;
		this.nearest_event_date = null;
		
		this.tags = new TagsCollection();
		
		this.notifications = [];
		
		this.favored = new UsersCollection();
		this.favored_users_count = null;
		this.favored_friends_count = null;
		this.is_favorite = null;
		
		this.public_at = null;
		this.canceled = null;
		this.can_edit = null;
		
		this.actuality = null;
		
		this.creator_id = null;
		this.created_at = null;
		this.updated_at = null;
		
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
			tickets: [{
				uuid: null,
				count: 1
			}]
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