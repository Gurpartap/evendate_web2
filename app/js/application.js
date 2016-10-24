/**
 * @typedef {object} AJAXData
 * @property {(Array|string|undefined)} [fields]
 * @property {(string|undefined)} [format=json] Sets the response format. Can be xml or json. Default: json
 * @property {(boolean|undefined)} [download=false] If flag is TRUE server will set additional headers to make response downloadble in browser. Default: false
 * @property {(boolean|undefined)} [nude_data=false] If nude_data is TRUE server response with only data, without status code and description. Default: false
 * @property {(number|undefined)} [offset] Use offset to set how many elements you want to skip. Default: 0
 * @property {(number|undefined)} [length] Sets the items count server will return in response. Default: 100
 * @property {(string|undefined)} [order_by]
 */
/**
 * @typedef {function(({}|Array<{}>))} AJAXCallback
 */
/**
 *
 * @interface
 */
function EntityInterface() {}
/**
 *
 * @param {(Array|object)} data
 * @returns {EntityInterface}
 */
EntityInterface.prototype.setData = function(data) {};

/**
 *
 * @abstract
 * @implements EntityInterface
 */
function OneEntity() {}
/**
 *
 * @param {(Array|object)} data
 * @returns {OneEntity}
 */
OneEntity.prototype.setData = function(data) {
	var field;
	if (Array.isArray(data)) {
		data = data[0];
	}
	for (field in data) {
		if (this[field] instanceof EntitiesCollection) {
			this[field].setData(data[field]);
		} else {
			this[field] = data[field];
		}
	}
	return this;
};


/**
 *
 * @abstract
 * @augments Array
 * @implements EntityInterface
 */
function EntitiesCollection() {}
EntitiesCollection.extend(Array);
EntitiesCollection.prototype.collection_of = OneEntity;
/**
 *
 * @param {(Array|object)} data
 * @returns {EntitiesCollection}
 */
EntitiesCollection.prototype.setData = function(data) {
	data = data instanceof Array ? data : [data];
	this.push.apply(this, data);
	return this;
};
/**
 *
 * @param {(string|number)} id
 * @returns {(OneEntity|null)}
 */
EntitiesCollection.prototype.getByID = function(id) {
	for (var i = 0; i < this.length; i++) {
		if (this[i].id == id) {
			return this[i];
		}
	}
	return null;
};
/**
 *
 * @param {(string|number)} id
 * @returns {boolean}
 */
EntitiesCollection.prototype.has = function(id) {
	return this.getByID(id) instanceof OneEntity;
};
/**
 *
 * @param {...object} element
 * @returns {number}
 */
EntitiesCollection.prototype.push = function(element) {
	for (var i = 0; i < arguments.length; i++) {
		if (!arguments[i].id || (arguments[i].id && !this.has(arguments[i].id))) {
			this[this.length++] = arguments[i] instanceof this.collection_of ? arguments[i] : (new this.collection_of()).setData(arguments[i]);
		}
	}
	return this.length;
};
/**
 *
 * @param {(string|number)} id
 * @returns {Array<OneEntity>}
 */
EntitiesCollection.prototype.remove = function(id) {
	if (this.has(id)) {
		return this.splice(this.indexOf(this.getByID(id)), 1);
	}
	return [];
};


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
	return __APP.SERVER.addData('/api/v1/events/', JSON.stringify(new_event_data), success);
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
	return __APP.SERVER.addData('/api/v1/events/' + event_id + '/favorites', {}, success);
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
	return __APP.SERVER.addData('/api/v1/events/' + event_id + '/notifications', {notification_type: notification_type}, success);
};
/**
 *
 * @param {(string|number)} event_id
 * @param {string} notification_uuid
 * @param {AJAXCallback} [success]
 * @returns {jqXHR}
 */
OneEvent.deleteEventNotification = function(event_id, notification_uuid, success) {
	return __APP.SERVER.deleteData('/api/v1/events/' + event_id + '/notifications' + notification_uuid, {}, success);
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


/**
 * @typedef {AJAXData} EventsCollectionAJAXData
 * @property {string} [date]
 * @property {string} [query]
 * @property {boolean} [statistics]
 * @property {boolean} [canceled_shown]
 * @property {boolean} [future]
 * @property {boolean} [is_delayed]
 * @property {boolean} [is_canceled]
 * @property {string} [since]
 * @property {string} [till]
 * @property {string} [changed_since]
 * @property {string} [tags]
 * @property {string} [title]
 * @property {boolean} [strict]
 * @property {(string|number)} [organization_id]
 * @property {string} [bounds]
 * @property {string} [point]
 */
/**
 * @typedef {function(Array<OneEvent>)} EventsCollectionAJAXCallback
 */
/**
 *
 * @constructor
 * @augments EntitiesCollection
 */
function EventsCollection() {}
EventsCollection.extend(EntitiesCollection);
EventsCollection.prototype.collection_of = OneEvent;
/**
 * @const
 * @enum {string}
 */
EventsCollection.KIND = {
	MY: 'my',
	FAVORED: 'favored',
	RECOMMENDED: 'recommended'
};
/**
 *
 * @param {EventsCollectionAJAXData} data
 * @param {EventsCollectionAJAXCallback} [success]
 * @returns {jqXHR}
 */
EventsCollection.fetchEvents = function(data, success) {
	return __APP.SERVER.getData('/api/v1/events/', data, success);
};
/**
 *
 * @param {EventsCollectionAJAXData} data
 * @param {EventsCollectionAJAXCallback} [success]
 * @returns {jqXHR}
 */
EventsCollection.fetchMyEvents = function(data, success) {
	return __APP.SERVER.getData('/api/v1/events/my', data, success);
};
/**
 *
 * @param {EventsCollectionAJAXData} data
 * @param {EventsCollectionAJAXCallback} [success]
 * @returns {jqXHR}
 */
EventsCollection.fetchFavoredEvents = function(data, success) {
	return __APP.SERVER.getData('/api/v1/events/favorites', data, success);
};
/**
 *
 * @param {EventsCollectionAJAXData} data
 * @param {EventsCollectionAJAXCallback} [success]
 * @returns {jqXHR}
 */
EventsCollection.fetchRecommendedEvents = function(data, success) {
	return __APP.SERVER.getData('/api/v1/events/recommendations', data, success);
};
/**
 *
 * @param {(number|string)} organization_id
 * @param {EventsCollectionAJAXData} data
 * @param {EventsCollectionAJAXCallback} [success]
 * @returns {jqXHR}
 */
EventsCollection.fetchOrganizationsEvents = function(organization_id, data, success) {
	return __APP.SERVER.getData('/api/v1/events/', $.extend({}, data, {organization_id: organization_id}), success);
};
/**
 *
 * @param {EventsCollection.KIND} [kind]
 * @param {EventsCollectionAJAXData} [data]
 * @param {(number|string)} [length]
 * @param {EventsCollectionAJAXCallback} [success]
 * @returns {jqXHR}
 */
EventsCollection.prototype.fetchEvents = function(kind, data, length, success) {
	var self = this,
		method_name = 'fetchEvents',
		ajax_data = $.extend({}, data, {
			offset: this.length,
			length: length
		});
	switch (kind) {
		default: {
			method_name = 'fetchEvents';
			break;
		}
		case EventsCollection.KIND.MY: {
			method_name = 'fetchMyEvents';
			break;
		}
		case EventsCollection.KIND.FAVORED: {
			method_name = 'fetchFavoredEvents';
			break;
		}
		case EventsCollection.KIND.RECOMMENDED: {
			method_name = 'fetchRecommendedEvents';
			break;
		}
	}
	return this.constructor[method_name](ajax_data, function(data) {
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
 * @param {EventsCollectionAJAXCallback} [success]
 * @returns {jqXHR}
 */
EventsCollection.prototype.fetchFeed = function(fields, length, success) {
	var self = this,
		ajax_data = {
			fields: fields,
			offset: this.length,
			length: length
		};
	return this.constructor.fetchEvents(ajax_data, function(data) {
		self.setData(data);
		if (success && typeof success == 'function') {
			success.call(self, data);
		}
	});
};
/**
 *
 * @param {(number|string)} organization_id
 * @param {EventsCollectionAJAXData} [data]
 * @param {(number|string)} [length]
 * @param {EventsCollectionAJAXCallback} [success]
 * @returns {jqXHR}
 */
EventsCollection.prototype.fetchOrganizationsEvents = function(organization_id, data, length, success) {
	var self = this,
		ajax_data = $.extend({}, data, {
			offset: this.length,
			length: length
		});
	return this.constructor.fetchOrganizationsEvents(organization_id, ajax_data, function(data) {
		self.setData(data);
		if (success && typeof success == 'function') {
			success.call(self, data);
		}
	});
};
/**
 *
 * @param {(number|string)} organization_id
 * @param {(Array|string)} [fields]
 * @param {(number|string)} [length]
 * @param {EventsCollectionAJAXCallback} [success]
 * @returns {jqXHR}
 */
EventsCollection.prototype.fetchOrganizationsFeed = function(organization_id, fields, length, success) {
	var self = this,
		ajax_data = {
			fields: fields,
			offset: this.length,
			length: length
		};
	return this.constructor.fetchOrganizationsEvents(organization_id, ajax_data, function(data) {
		self.setData(data);
		if (success && typeof success == 'function') {
			success.call(self, data);
		}
	});
};

/**
 *
 * @constructor
 * @augments EventsCollection
 */
function ActualEventsCollection() {}
ActualEventsCollection.extend(EventsCollection);
/**
 *
 * @override
 */
ActualEventsCollection.fetchEvents = function(data, success) {
	data.fields = data.fields ? Array.isArray(data.fields) ? data.fields : data.fields.split(',') : [];
	data.fields.push('actuality');
	data.future = true;
	data.order_by = '-actuality';
	return EventsCollection.fetchMyEvents(data, success);
};

/**
 *
 * @constructor
 * @augments EventsCollection
 */
function TimelineEventsCollection() {}
TimelineEventsCollection.extend(EventsCollection);
/**
 *
 * @override
 */
TimelineEventsCollection.fetchEvents = function(data, success) {
	data.future = true;
	return EventsCollection.fetchMyEvents(data, success);
};

/**
 *
 * @constructor
 * @augments EventsCollection
 */
function FavoredEventsCollection() {}
FavoredEventsCollection.extend(EventsCollection);
/**
 *
 * @override
 */
FavoredEventsCollection.fetchEvents = function(data, success) {
	data.future = true;
	return EventsCollection.fetchFavoredEvents(data, success);
};

/**
 *
 * @constructor
 * @augments EventsCollection
 */
function RecommendedEventsCollection() {}
RecommendedEventsCollection.extend(EventsCollection);
/**
 *
 * @override
 */
RecommendedEventsCollection.fetchEvents = function(data, success) {
	data.future = true;
	data.order_by = '-rating';
	return EventsCollection.fetchRecommendedEvents(data, success);
};

/**
 *
 * @constructor
 * @augments EventsCollection
 */
function FriendsEventsCollection() {}
FriendsEventsCollection.extend(EventsCollection);
/**
 *
 * @override
 */
FriendsEventsCollection.fetchEvents = function(data, success) {
	data.fields = data.fields ? Array.isArray(data.fields) ? data.fields : data.fields.split(',') : [];
	data.fields.push('favored_friends_count');
	data.future = true;
	data.order_by = '-favored_friends_count';
	return EventsCollection.fetchMyEvents(data, success);
};

/**
 *
 * @constructor
 * @augments EventsCollection
 * @param {string} date
 */
function DayEventsCollection(date) {
	if (!date)
		throw Error('DayEventsCollection must have date parameter');
	this.date = date;
}
DayEventsCollection.extend(EventsCollection);
/**
 *
 * @param {string} date
 * @param {EventsCollectionAJAXData} data
 * @param {AJAXCallback} [success]
 * @returns {jqXHR}
 */
DayEventsCollection.fetchEvents = function(date, data, success) {
	data.future = false;
	data.date = date;
	return EventsCollection.fetchMyEvents(data, success);
};
/**
 *
 * @override
 */
DayEventsCollection.prototype.fetchFeed = function(fields, length, success) {
	var self = this,
		ajax_data = {
			fields: fields,
			offset: this.length,
			length: length
		};
	return this.constructor.fetchEvents(this.date, ajax_data, function(data) {
		self.setData(data);
		if (success && typeof success == 'function') {
			success.call(self, data);
		}
	});
};

/**
 *
 * @constructor
 * @augments EventsCollection
 */
function FutureEventsCollection() {}
FutureEventsCollection.extend(EventsCollection);
/**
 *
 * @override
 */
FutureEventsCollection.fetchOrganizationsEvents = function(organization_id, data, success) {
	data.future = true;
	data.order_by = 'nearest_event_date';
	return EventsCollection.fetchOrganizationsEvents(organization_id, data, success);
};

/**
 *
 * @constructor
 * @augments EventsCollection
 */
function PastEventsCollection() {}
PastEventsCollection.extend(EventsCollection);
/**
 *
 * @override
 */
PastEventsCollection.fetchOrganizationsEvents = function(organization_id, data, success) {
	data.till = moment().format(__C.DATE_FORMAT);
	data.order_by = '-last_event_date';
	return EventsCollection.fetchOrganizationsEvents(organization_id, data, success);
};

/**
 *
 * @constructor
 * @augments EventsCollection
 */
function DelayedEventsCollection() {}
DelayedEventsCollection.extend(EventsCollection);
/**
 *
 * @override
 */
DelayedEventsCollection.fetchOrganizationsEvents = function(organization_id, data, success) {
	data.fields = data.fields ? Array.isArray(data.fields) ? data.fields : data.fields.split(',') : [];
	data.fields.push('public_at');
	data.is_delayed = true;
	data.is_canceled = false;
	data.order_by = 'public_at';
	return EventsCollection.fetchOrganizationsEvents(organization_id, data, success);
};

/**
 *
 * @constructor
 * @augments EventsCollection
 */
function CanceledEventsCollection() {}
CanceledEventsCollection.extend(EventsCollection);
/**
 *
 * @override
 */
CanceledEventsCollection.fetchOrganizationsEvents = function(organization_id, data, success) {
	data.fields = data.fields ? Array.isArray(data.fields) ? data.fields : data.fields.split(',') : [];
	data.fields.push('updated_at');
	data.is_canceled = true;
	data.order_by = '-updated_at';
	return EventsCollection.fetchOrganizationsEvents(organization_id, data, success);
};


/**
 *
 * @constructor
 * @augments OneEntity
 */
function OneDate() {
	this.event_date = '';
	this.id = 0;
	this.start_time = '';
	this.end_time = '';
	this.event_id = 0;
	this.organization_id = 0;
	this.events_count = 0;
	this.favored_count = 0;
}
OneDate.extend(OneEntity);


/**
 * @typedef {AJAXData} DatesCollectionAJAXData
 * @property {string} [month]
 * @property {string} [since]
 * @property {string} [till]
 * @property {(number|string)} [organization_id]
 * @property {(number|string)} [event_id]
 * @property {boolean} [unique]
 * @property {boolean} [my]
 */
/**
 *
 * @constructor
 * @augments EntitiesCollection
 */
function DatesCollection() {}
DatesCollection.prototype.collection_of = OneDate;
DatesCollection.extend(EntitiesCollection);
/**
 *
 * @param {DatesCollectionAJAXData} ajax_data
 * @param {AJAXCallback} [success]
 * @returns {jqXHR}
 */
DatesCollection.fetchDates = function(ajax_data, success) {
	return __APP.SERVER.getData('/api/v1/events/dates', ajax_data, success);
};


/**
 *
 * @constructor
 * @augments OneEntity
 * @param {(string|number)} [tag_id]
 * @param {boolean} [is_loading_continuous]
 */
function OneTag(tag_id, is_loading_continuous) {
	this.id = tag_id ? tag_id : 0;
	this.name = '';
	
	if (tag_id && is_loading_continuous) {
		this.loading = true;
		this.fetchTag(function() {
			this.loading = false;
			$(window).trigger('fetch.OneTag');
		});
	}
}
OneTag.extend(OneEntity);
/**
 *
 * @param {(string|number)} tag_id
 * @param {AJAXCallback} [success]
 * @returns {jqXHR}
 */
OneTag.fetchTag = function(tag_id, success) {
	return __APP.SERVER.getData('/api/v1/tags/' + tag_id, {}, success);
};
/**
 *
 * @param {AJAXCallback} [success]
 * @returns {jqXHR}
 */
OneTag.prototype.fetchTag = function(success) {
	var self = this;
	return this.constructor.fetchTag(self.id, function(data) {
		self.setData(data[0]);
		if (success && typeof success == 'function') {
			success.call(self, data[0]);
		}
	});
};


/**
 * @typedef {AJAXData} TagsCollectionAJAXData
 * @property {string} name
 * @property {(string|number)} event_id
 * @property {string} used_since
 * @property {string} used_till
 */
/**
 *
 * @constructor
 * @augments EntitiesCollection
 */
function TagsCollection() {}
TagsCollection.extend(EntitiesCollection);
TagsCollection.prototype.collection_of = OneTag;
/**
 *
 * @param {AJAXData} data
 * @param {AJAXCallback} [success]
 * @returns {jqXHR}
 */
TagsCollection.fetchTags = function(data, success) {
	return __APP.SERVER.getData('/api/v1/tags/', data, success);
};
/**
 *
 * @param {TagsCollectionAJAXData} data
 * @param {AJAXCallback} [success]
 * @returns {jqXHR}
 */
TagsCollection.prototype.fetchTags = function(data, success) {
	var self = this;
	return this.constructor.fetchTags(data, function(data) {
		self.setData(data);
		if (success && typeof success == 'function') {
			success.call(self, data);
		}
	});
};


/**
 * @typedef {object} Privilege
 * @property {number} role_id
 * @property {OneUser.ROLE} name
 */
/**
 *
 * @constructor
 * @augments OneEntity
 * @param {(string|number)} [organization_id]
 * @param {boolean} [is_loading_continuous]
 */
function OneOrganization(organization_id, is_loading_continuous) {
	this.id = organization_id || 0;
	this.short_name = '';
	this.description = '';
	this.img_url = '';
	this.img_small_url = '';
	this.background_img_url = '';
	this.background_medium_img_url = '';
	this.type_id = 0;
	this.type_name = '';
	this.site_url = '';
	this.default_address = '';
	this.is_subscribed = false;
	this.subscribed_count = 0;
	this.subscribed = new UsersCollection();
	/**
	 * @type {Array<Privilege>}
	 */
	this.privileges = [];
	this.role = '';
	this.staff = new UsersCollection();
	
	if (organization_id && is_loading_continuous) {
		this.loading = true;
		this.fetchOrganization([], function() {
			this.loading = false;
			$(window).trigger('fetch.OneOrganization');
		});
	}
}
OneOrganization.extend(OneEntity);
/**
 *
 * @param {(string|number)} org_id
 * @param {(string|Array)} fields
 * @param {AJAXCallback} [success]
 * @returns {jqXHR}
 */
OneOrganization.fetchOrganization = function(org_id, fields, success) {
	return __APP.SERVER.getData('/api/v1/organizations/' + org_id, {fields: fields}, success);
};
/**
 * @typedef {AJAXData} OneOrganizationCreateOrganizationData
 * @property {string} [name]
 * @property {string} [short_name]
 * @property {string} [description]
 * @property {string} [site_url]
 * @property {string} [default_address]
 * @property {string} [vk_url]
 * @property {string} [facebook_url]
 * @property {string} [type_id]
 * @property {string} [background]
 * @property {string} [logo]
 * @property {string} [detail_info_url]
 * @property {string} [email]
 */
/**
 * @typedef {function({
 *   organization_id: number
 * })} OneOrganizationCreateOrganizationCallback
 */
/**
 *
 * @param {OneOrganizationCreateOrganizationData} new_organization_data
 * @param {OneOrganizationCreateOrganizationCallback} [success]
 * @returns {jqXHR}
 */
OneOrganization.createOrganization = function(new_organization_data, success) {
	return __APP.SERVER.addData('/api/v1/organizations/', JSON.stringify(new_organization_data), success);
};
/**
 *
 * @param {(string|number)} organization_id
 * @param {OneOrganizationCreateOrganizationData} organization_data
 * @param {OneOrganizationCreateOrganizationCallback} [success]
 * @returns {jqXHR}
 */
OneOrganization.updateOrganization = function(organization_id, organization_data, success) {
	return __APP.SERVER.updateData('/api/v1/organizations/' + organization_id, JSON.stringify(organization_data), success);
};
/**
 *
 * @param {(string|number)} org_id
 * @param {AJAXCallback} [success]
 * @returns {jqXHR}
 */
OneOrganization.subscribeOrganization = function(org_id, success) {
	return __APP.SERVER.addData('/api/v1/organizations/' + org_id + '/subscriptions', {}, success);
};
/**
 *
 * @param {(string|number)} org_id
 * @param {AJAXCallback} [success]
 * @returns {jqXHR}
 */
OneOrganization.unsubscribeOrganization = function(org_id, success) {
	return __APP.SERVER.deleteData('/api/v1/organizations/' + org_id + '/subscriptions', {}, success);
};
/**
 *
 * @param {(string|Array)} fields
 * @param {AJAXCallback} [success]
 * @returns {jqXHR}
 */
OneOrganization.prototype.fetchOrganization = function(fields, success) {
	var self = this;
	return this.constructor.fetchOrganization(self.id, fields, function(data) {
		self.role = data[0].privileges ? OneUser.recognizeRole(data[0].privileges) : '';
		self.setData(data);
		if (success && typeof success == 'function') {
			success.call(self, self);
		}
	});
};
/**
 *
 * @param {OneOrganizationCreateOrganizationData} new_organization_data
 * @param {OneOrganizationCreateOrganizationCallback} [success]
 * @returns {jqXHR}
 */
OneOrganization.prototype.createOrganization = function(new_organization_data, success) {
	var self = this;
	return OneOrganization.createOrganization(new_organization_data, function(response_data) {
		self.setData(new_organization_data);
		self.id = response_data.organization_id;
		if (success && typeof success == 'function') {
			success.call(self, self);
		}
	});
};
/**
 *
 * @param {OneOrganizationCreateOrganizationData} organization_data
 * @param {OneOrganizationCreateOrganizationCallback} [success]
 * @returns {jqXHR}
 */
OneOrganization.prototype.updateOrganization = function(organization_data, success) {
	var self = this;
	return OneOrganization.updateOrganization(self.id, organization_data, function(response_data) {
		self.setData(organization_data);
		if (success && typeof success == 'function') {
			success.call(self, self);
		}
	});
};
/**
 *
 * @param {AJAXCallback} [success]
 * @returns {jqXHR}
 */
OneOrganization.prototype.subscribe = function(success) {
	var self = this;
	return this.constructor.subscribeOrganization(this.id, function(data) {
		this.is_subscribed = true;
		this.subscribed_count++;
		if (success && typeof success == 'function') {
			success.call(self, data);
		}
	});
};
/**
 *
 * @param {AJAXCallback} [success]
 * @returns {jqXHR}
 */
OneOrganization.prototype.unsubscribe = function(success) {
	var self = this;
	return this.constructor.unsubscribeOrganization(this.id, function(data) {
		this.is_subscribed = false;
		this.subscribed_count = this.subscribed_count ? this.subscribed_count - 1 : this.subscribed_count;
		if (success && typeof success == 'function') {
			success.call(self, data);
		}
	});
};


/**
 *
 * @constructor
 * @augments EntitiesCollection
 */
function OrganizationsCollection() {}
OrganizationsCollection.extend(EntitiesCollection);
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
 * @returns {jqXHR}
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
 * @returns {jqXHR}
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


/**
 *
 * @constructor
 * @augments OneEntity
 * @param {(string|number)} [category_id]
 * @param {boolean} [is_loading_continuous]
 */
function OneCategory(category_id, is_loading_continuous) {
	this.id = category_id ? category_id : 0;
	this.name = '';
	this.order_position = 0;
	this.organizations = new OrganizationsCollection();
	
	if (category_id && is_loading_continuous) {
		this.loading = true;
		this.fetchCategory([], function() {
			this.loading = false;
			$(window).trigger('fetch.OneCategory');
		});
	}
}
OneCategory.extend(OneEntity);
/**
 *
 * @param {(string|number)} category_id
 * @param {AJAXData} data
 * @param {AJAXCallback} [success]
 * @return {jqXHR}
 */
OneCategory.fetchCategory = function(category_id, data, success) {
	return __APP.SERVER.getData('/api/v1/organizations/types', $.extend({}, data, {id: category_id}), success);
};
/**
 *
 * @param {(Array|string)} fields
 * @param {AJAXCallback} [success]
 * @return {jqXHR}
 */
OneCategory.prototype.fetchCategory = function(fields, success) {
	var self = this;
	return this.constructor.fetchCategory(self.id, fields, function(data) {
		self.setData(data);
		if (success && typeof success == 'function') {
			success.call(self, data[0]);
		}
	});
};


/**
 *
 * @constructor
 * @augments EntitiesCollection
 */
function CategoriesCollection() {}
CategoriesCollection.extend(EntitiesCollection);
CategoriesCollection.prototype.collection_of = OneCategory;
/**
 *
 * @param {AJAXData} data
 * @param {AJAXCallback} [success]
 */
CategoriesCollection.fetchCategories = function(data, success) {
	return __APP.SERVER.getData('/api/v1/organizations/types', data, success);
};
/**
 *
 * @param {AJAXData} data
 * @param {(number|string)} [length]
 * @param {AJAXCallback} [success]
 */
CategoriesCollection.prototype.fetchCategories = function(data, length, success) {
	var self = this,
		ajax_data = $.extend({}, data, {
			offset: this.length,
			length: length
		});
	return this.constructor.fetchCategories(ajax_data, function(data) {
		self.setData(data);
		if (success && typeof success == 'function') {
			success.call(self, data);
		}
	});
};
/**
 *
 * @param {AJAXData} categories_ajax_data
 * @param {AJAXData} orgs_ajax_data
 * @param {(number|string)} [length]
 * @param {AJAXCallback} [success]
 */
CategoriesCollection.prototype.fetchCategoriesWithOrganizations = function(categories_ajax_data, orgs_ajax_data, length, success) {
	var self = this,
		ajax_data = $.extend({}, categories_ajax_data, {
			offset: this.length,
			length: length
		}),
		org_field = 'organizations' + JSON.stringify(__APP.SERVER.validateData(orgs_ajax_data));
	if (!ajax_data.fields) {
		ajax_data.fields = [];
	} else if (!Array.isArray(ajax_data.fields)) {
		ajax_data.fields = ajax_data.fields.split(',');
	}
	ajax_data.fields.push(org_field);
	return this.constructor.fetchCategories(ajax_data, function(data) {
		self.setData(data);
		if (success && typeof success == 'function') {
			success.call(self, data);
		}
	});
};


/**
 *
 * @constructor
 * @augments OneEntity
 * @param {(string|number)} [user_id]
 * @param {boolean} [is_loading_continuous]
 */
function OneUser(user_id, is_loading_continuous) {
	this.id = user_id ? user_id : 0;
	this.first_name = '';
	this.last_name = '';
	this.middle_name = '';
	this.gender = '';
	this.avatar_url = '';
	this.type = '';
	this.is_friend = false;
	this.is_editor = false;
	this.blurred_image_url = '';
	this.link = '';
	this.subscriptions = new OrganizationsCollection();
	/**
	 * @type {Array<OneUser.ACCOUNTS>}
	 */
	this.accounts = [];
	
	if (user_id && is_loading_continuous) {
		this.loading = true;
		this.fetchUser([], function() {
			this.loading = false;
			$(window).trigger('fetch.OneUser');
		});
	}
}
OneUser.extend(OneEntity);
/**
 * @const
 * @enum {string}
 */
OneUser.ACCOUNTS = {
	VK: 'vk',
	FACEBOOK: 'facebook',
	GOOGLE: 'google'
};
/**
 * @const
 * @enum {string}
 */
OneUser.ROLE = {
	USER: 'user',
	MODERATOR: 'moderator',
	ADMIN: 'admin'
};

Object.defineProperty(OneUser.prototype, 'subscriptions_fields', {
	enumerable: false,
	value: ['img_small_url', 'subscribed_count', 'new_events_count', 'actual_events_count']
});
/**
 * Returns highest role in privileges set
 * @param {Array<Privilege>} privileges
 * @returns {OneUser.ROLE}
 */
OneUser.recognizeRole = function(privileges) {
	var role = OneUser.ROLE.USER;
	privileges.forEach(function(privilege) {
		if (privilege.role_id == 1 || privilege.name == OneUser.ROLE.ADMIN)
			role = OneUser.ROLE.ADMIN;
		if ((privilege.role_id == 2 || privilege.name == OneUser.ROLE.MODERATOR) && role !== OneUser.ROLE.ADMIN)
			role = OneUser.ROLE.MODERATOR;
	});
	return role;
};
/**
 *
 * @param {(string|number)} user_id
 * @param {(Array|string)} [fields]
 * @param {AJAXCallback} [success]
 * @returns {jqXHR}
 */
OneUser.fetchUser = function(user_id, fields, success) {
	return __APP.SERVER.getData('/api/v1/users/' + user_id, fields || (Array.isArray(fields) && fields.length) ? {fields: fields} : {}, success);
};
/**
 *
 * @param {(Array|string)} [fields]
 * @param {AJAXCallback} [success]
 * @returns {jqXHR}
 */
OneUser.prototype.fetchUser = function(fields, success) {
	var self = this;
	return OneUser.fetchUser(self.id, fields, function(data) {
		self.setData(data);
		if (success && typeof success == 'function') {
			success.call(self, data[0]);
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
OneUser.prototype.fetchUserWithSubscriptions = function(fields, subscriptions_ajax_data, success) {
	var self = this;
	fields = typeof fields == 'string' ? fields.split(',') : fields ? fields : [];
	if (subscriptions_ajax_data) {
		subscriptions_ajax_data.fields = subscriptions_ajax_data.fields.join(',');
		fields.push('subscriptions' + JSON.stringify($.extend({}, subscriptions_ajax_data, {offset: self.subscriptions.length})));
	} else {
		fields.push('subscriptions' + JSON.stringify({
				fields: self.subscriptions_fields.join(','),
				offset: self.subscriptions.length
			}));
	}
	return OneUser.fetchUser(self.id, fields, function(data) {
		self.setData(data);
		if (success && typeof success == 'function') {
			success.call(self, data[0]);
		}
	});
};


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
	CurrentUser.instance = this;
}
CurrentUser.extend(OneUser);
/**
 *
 * @returns {jqXHR}
 */
CurrentUser.prototype.logout = function() {
	return __APP.SERVER.AJAX(__APP.SERVER.AJAX_METHOD.GET, '/index.php', {logout: true}, function() {
		window.location = '/';
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


/**
 * @typedef {AJAXData} UsersCollectionAJAXData
 * @property {string} [first_name]
 * @property {string} [last_name]
 * @property {string} [name]
 */
/**
 *
 * @constructor
 * @augments EntitiesCollection
 */
function UsersCollection() {}
UsersCollection.extend(EntitiesCollection);
UsersCollection.prototype.collection_of = OneUser;
/**
 * Returns specified staff by role. Mixing additional_fields if needed.
 * @param {OneUser.ROLE} role
 * @param {(Array<OneUser>|UsersCollection)} staff
 * @param {object} [additional_fields]
 * @return {(Array<OneUser>|UsersCollection|Array<object>)}
 */
UsersCollection.getSpecificStaff = function(role, staff, additional_fields) {
	var specific_staff = [];
	staff.forEach(function(man) {
		if (man.role == role) {
			specific_staff.push($.extend(true, {
				name: man.first_name + ' ' + man.last_name
			}, man, additional_fields))
		}
	});
	return specific_staff;
};
/**
 *
 * @param {UsersCollectionAJAXData} data
 * @param {AJAXCallback} [success]
 * @returns {jqXHR}
 */
UsersCollection.fetchUsers = function(data, success) {
	return __APP.SERVER.getData('/api/v1/users/', data, success);
};
/**
 *
 * @param {UsersCollectionAJAXData} data
 * @param {AJAXCallback} [success]
 * @returns {jqXHR}
 */
UsersCollection.fetchFriends = function(data, success) {
	return __APP.SERVER.getData('/api/v1/users/friends/', data, success);
};
/**
 *
 * @param {(string|number)} event_id
 * @param {UsersCollectionAJAXData} ajax_data
 * @param {AJAXCallback} [success]
 * @returns {jqXHR}
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
 * @returns {jqXHR}
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
 * @returns {jqXHR}
 */
UsersCollection.fetchOrganizationStaff = function(org_id, ajax_data, success) {
	return __APP.SERVER.getData('/api/v1/organizations/' + org_id + '/staff/', ajax_data, success);
};
/**
 * Returns specified staff by role. Mixing additional_fields if needed.
 * @param {OneUser.ROLE} role
 * @param {object} [additional_fields]
 * @return {(Array<OneUser>|UsersCollection|Array<object>)}
 */
UsersCollection.prototype.getSpecificStaff = function(role, additional_fields) {
	var specific_staff = [];
	this.forEach(function(man) {
		if (man.role == role) {
			specific_staff.push($.extend(true, {
				name: man.first_name + ' ' + man.last_name
			}, man, additional_fields))
		}
	});
	return specific_staff;
};
/**
 *
 * @param {UsersCollectionAJAXData} [data]
 * @param {(number|string)} [length]
 * @param {AJAXCallback} [success]
 * @this Array<OneUser>
 * @returns {jqXHR}
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
 * @param {(Array|string)} [fields]
 * @param {(number|string)} [length]
 * @param {string} [order_by]
 * @param {AJAXCallback} [success]
 * @returns {jqXHR}
 */
UsersCollection.prototype.fetchFriends = function(fields, length, order_by, success) {
	var self = this,
		ajax_data = {
			fields: fields,
			offset: this.length,
			length: length
		};
	if (order_by) {
		ajax_data.order_by = order_by;
	}
	return UsersCollection.fetchFriends(ajax_data, function(data) {
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
 * @returns {jqXHR}
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
 * @returns {jqXHR}
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
 * @returns {jqXHR}
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


/**
 *
 * @abstract
 * @augments OneEntity
 */
function OneActivity() {
	this.stat_type_id = 0;
	this.event_id = 0;
	this.event = new OneEvent(this.event_id);
	this.organization_id = 0;
	this.organization = new OneOrganization(this.organization_id);
	this.user_id = 0;
	this.user = new OneUser(this.user_id);
	this.entity = '';
	this.type_code = '';
	this.created_at = 0;
}
OneActivity.extend(OneEntity);


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


/**
 * @typedef {function({
 *   [events]: Array<OneEvent>,
 *   [organizations]: Array<OneOrganization>
 * })} SearchResultsAJAXCallback
 */
/**
 *
 * @constructor
 * @augments OneEntity
 * @param {string} query_string
 */
function SearchResults(query_string) {
	this.query_string = query_string;
	this.events = new EventsCollection();
	this.organizations = new OrganizationsCollection();
}
SearchResults.extend(OneEntity);
/**
 *
 * @param {string} query_string
 * @returns {{ [q]: {string}, [tags]: {string} }}
 */
SearchResults.sanitizeQueryVar = function(query_string) {
	var data = {};
	if (query_string.indexOf('#') === 0) {
		data.tags = query_string.replace('#', '');
	} else {
		data.q = query_string;
	}
	return data;
};
/**
 *
 * @param {string} query_string
 * @param {AJAXData} [ajax_data]
 * @param {SearchResultsAJAXCallback} [success]
 * @returns {jqXHR}
 */
SearchResults.fetchEventsAndOrganizations = function(query_string, ajax_data, success) {
	return __APP.SERVER.getData('/api/v1/search/', $.extend({}, SearchResults.sanitizeQueryVar(query_string), ajax_data), success);
};
/**
 *
 * @param {AJAXData} [events_ajax_data]
 * @param {function(organizations: Array<OneEvent>)} [success]
 * @returns {jqXHR}
 */
SearchResults.prototype.fetchEvents = function(events_ajax_data, success) {
	var self = this,
		ajax_data = {
			fields: 'events' + JSON.stringify($.extend({}, __APP.SERVER.validateData(events_ajax_data), {offset: this.events.length}))
		};
	
	return SearchResults.fetchEventsAndOrganizations(self.query_string, ajax_data, function(data) {
		self.setData(data);
		if (success && typeof success == 'function') {
			success.call(self, data.events);
		}
	});
};
/**
 *
 * @param {AJAXData} [organizations_ajax_data]
 * @param {function(organizations: Array<OneOrganization>)} [success]
 * @returns {jqXHR}
 */
SearchResults.prototype.fetchOrganizations = function(organizations_ajax_data, success) {
	var self = this,
		ajax_data = {
			fields: 'organizations' + JSON.stringify($.extend({}, __APP.SERVER.validateData(organizations_ajax_data), {offset: this.organizations.length}))
		};
	
	return SearchResults.fetchEventsAndOrganizations(self.query_string, ajax_data, function(data) {
		self.setData(data);
		if (success && typeof success == 'function') {
			success.call(self, data.organizations);
		}
	});
};
/**
 *
 * @param {AJAXData} [events_ajax_data]
 * @param {AJAXData} [organizations_ajax_data]
 * @param {SearchResultsAJAXCallback} [success]
 * @returns {jqXHR}
 */
SearchResults.prototype.fetchEventsAndOrganizations = function(events_ajax_data, organizations_ajax_data, success) {
	var self = this,
		ajax_data = {fields: []};
	if (events_ajax_data) {
		ajax_data.fields.push('events' + JSON.stringify($.extend({}, __APP.SERVER.validateData(events_ajax_data), {offset: this.events.length})));
	}
	if (organizations_ajax_data && !SearchResults.sanitizeQueryVar(self.query_string).tags) {
		ajax_data.fields.push('organizations' + JSON.stringify($.extend({}, __APP.SERVER.validateData(organizations_ajax_data), {offset: this.organizations.length})));
	}
	return SearchResults.fetchEventsAndOrganizations(self.query_string, ajax_data, function(data) {
		self.setData(data);
		if (success && typeof success == 'function') {
			success.call(self, data);
		}
	});
};


/**
 * @typedef {object} StatisticsUnit
 * @property {number} time_value
 * @property {number} value
 */
/**
 * @typedef {StatisticsUnit} StatisticsConversionUnit
 * @property {number} to
 * @property {number} with
 */
/**
 * @typedef {object} StatisticsAudience
 * @property {Array<{name: {string}, count: {number}}>} devices
 * @property {Array<{gender: {?string}, count: {number}}>} gender
 */
/**
 * @typedef {object} StatisticsStdData
 * @property {Statistics.SCALES} scale
 * @property {string} since
 * @property {string} till
 */
/**
 *
 * @constructor
 * @implements EntityInterface
 */
function Statistics() {
	this.id = 0;
	/**
	 * @type {Array<StatisticsUnit>}
	 */
	this.view = [];
	/**
	 * @type {Array<StatisticsUnit>}
	 */
	this.fave = [];
	/**
	 * @type {Array<StatisticsUnit>}
	 */
	this.unfave = [];
	/**
	 * @type {Array<StatisticsUnit>}
	 */
	this.notifications_sent = [];
	
	this.dynamics = {
		/**
		 * @type {Array<StatisticsUnit>}
		 */
		view: [],
		/**
		 * @type {Array<StatisticsUnit>}
		 */
		fave: []
	};
}
/**
 *
 * @param {(Array|object)} data
 * @returns {Statistics}
 */
Statistics.prototype.setData = function(data) {
	return $.extend(true, this, (data instanceof Array) ? data[0] : data);
};
/**
 * @const
 * @enum {string}
 */
Statistics.SCALES = {
	MINUTE: 'minute',
	HOUR: 'hour',
	DAY: 'day',
	WEEK: 'week',
	MONTH: 'month',
	YEAR: 'year',
	OVERALL: 'overall'
};
/**
 * @const
 * @enum {string}
 */
Statistics.ENTITIES = {
	EVENT: 'events',
	ORGANIZATION: 'organizations'
};
/**
 * @static
 * @param {Statistics.ENTITIES} entity
 * @param {(string|number)} id
 * @param {Statistics.SCALES} scale
 * @param {(string|object|boolean)} range
 * @param {string} range.since
 * @param {string} [range.till]
 * @param {(Array<string>|object<string, StatisticsStdData>)} statistics_fields
 * @param {?StatisticsStdData} [dynamics_ajax_data]
 * @param {(Array<string>|string)} [dynamics_ajax_data.fields]
 * @param {function} [success]
 * @return {jqXHR}
 */
Statistics.fetchStatistics = function(entity, id, scale, range, statistics_fields, dynamics_ajax_data, success) {
	var data = {
		scale: scale,
		fields: []
	};
	if (statistics_fields instanceof Array) {
		data.fields = data.fields.concat(statistics_fields);
	} else {
		$.each(statistics_fields, function(field, options) {
			if (Object.getOwnPropertyNames(options).length) {
				data.fields.push(field + JSON.stringify(options));
			} else {
				data.fields.push(field);
			}
		});
	}
	if (dynamics_ajax_data) {
		data.fields.push('dynamics' + JSON.stringify(__APP.SERVER.validateData(dynamics_ajax_data)));
	}
	
	switch (typeof range) {
		case 'string': {
			if (range) data.since = range;
			break;
		}
		case 'object': {
			if (range.since) data.since = range.since;
			if (range.till) data.till = range.till;
			break;
		}
		default:
		case 'boolean': { break; }
	}
	
	return __APP.SERVER.getData('/api/v1/statistics/' + entity + '/' + id, data, success);
};
/**
 *
 * @param {Statistics.SCALES} scale
 * @param {(string|object|boolean)} range
 * @param {string} range.since
 * @param {string} [range.till]
 * @param {object<string, StatisticsStdData>} statistics_fields
 * @param {?object} dynamics_ajax_data
 * @param {Statistics.SCALES} [dynamics_ajax_data.scale]
 * @param {string} [dynamics_ajax_data.since]
 * @param {string} [dynamics_ajax_data.till]
 * @param {function} [success]
 * @return {jqXHR}
 */
Statistics.prototype.fetchStatistics = function(scale, range, statistics_fields, dynamics_ajax_data, success) {
	var self = this;
	return this.constructor.fetchStatistics(this.id, scale, range, statistics_fields, dynamics_ajax_data, function(data) {
		self.setData(data);
		if (success && typeof success == 'function') {
			success.call(self, data);
		}
	});
};

/**
 *
 * @constructor
 * @augments Statistics
 * @param {(string|number)} event_id
 */
function EventStatistics(event_id) {
	Statistics.apply(this);
	this.id = event_id;
	/**
	 * @type {Array<StatisticsUnit>}
	 */
	this.open_site = [];
	/**
	 * @type {Array<StatisticsUnit>}
	 */
	this.view_detail = [];
	/**
	 * @type {Array<StatisticsConversionUnit>}
	 */
	this.open_conversion = [];
	/**
	 * @type {Array<StatisticsConversionUnit>}
	 */
	this.fave_conversion = [];
	/**
	 * @type {Array<StatisticsConversionUnit>}
	 */
	this.dynamics.fave_conversion = [];
	/**
	 * @type {Array<StatisticsConversionUnit>}
	 */
	this.dynamics.open_conversion = [];
}
EventStatistics.extend(Statistics);
/**
 *
 * @param {(string|number)} id
 * @param {Statistics.SCALES} scale
 * @param {(string|object|boolean)} range
 * @param {string} range.since
 * @param {string} [range.till]
 * @param {object<string, StatisticsStdData>} statistics_fields
 * @param {?object} dynamics_ajax_data
 * @param {Statistics.SCALES} [dynamics_ajax_data.scale]
 * @param {string} [dynamics_ajax_data.since]
 * @param {string} [dynamics_ajax_data.till]
 * @param {function} [success]
 * @return {jqXHR}
 */
EventStatistics.fetchStatistics = function(id, scale, range, statistics_fields, dynamics_ajax_data, success) {
	return Statistics.fetchStatistics(Statistics.ENTITIES.EVENT, id, scale, range, statistics_fields, dynamics_ajax_data, success);
};

/**
 *
 * @constructor
 * @augments Statistics
 * @param {(string|number)} organization_id
 */
function OrganizationsStatistics(organization_id) {
	Statistics.apply(this);
	this.id = organization_id;
	/**
	 * @type {Array<StatisticsUnit>}
	 */
	this.subscribe = [];
	/**
	 * @type {Array<StatisticsUnit>}
	 */
	this.unsubscribe = [];
	/**
	 * @type {Array<StatisticsConversionUnit>}
	 */
	this.conversion = [];
	/**
	 * @type {StatisticsAudience}
	 */
	this.audience = {};
	/**
	 * @type {Array<StatisticsUnit>}
	 */
	this.dynamics.subscribe = [];
	/**
	 * @type {Array<StatisticsConversionUnit>}
	 */
	this.dynamics.conversion = [];
}
OrganizationsStatistics.extend(Statistics);
/**
 *
 * @param {(string|number)} id
 * @param {Statistics.SCALES} scale
 * @param {(string|object|boolean)} range
 * @param {string} range.since
 * @param {string} [range.till]
 * @param {object<string, StatisticsStdData>} statistics_fields
 * @param {?object} dynamics_ajax_data
 * @param {Statistics.SCALES} [dynamics_ajax_data.scale]
 * @param {string} [dynamics_ajax_data.since]
 * @param {string} [dynamics_ajax_data.till]
 * @param {function} [success]
 * @return {jqXHR}
 */
OrganizationsStatistics.fetchStatistics = function(id, scale, range, statistics_fields, dynamics_ajax_data, success) {
	return Statistics.fetchStatistics(Statistics.ENTITIES.ORGANIZATION, id, scale, range, statistics_fields, dynamics_ajax_data, success);
};