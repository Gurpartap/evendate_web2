/**
 * @requires ../Class.EntitiesCollection.js
 * @requires Class.OneEvent.js
 */
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
 * @class EventsCollection
 * @extends EntitiesCollection
 */
EventsCollection = extending(EntitiesCollection, (function() {
	/**
	 *
	 * @constructor
	 * @constructs EventsCollection
	 */
	function EventsCollection() {
		EntitiesCollection.call(this);
	}
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
	 * @returns {jqPromise}
	 */
	EventsCollection.fetchEvents = function(data, success) {
		return __APP.SERVER.getData('/api/v1/events/', data, success);
	};
	/**
	 *
	 * @param {EventsCollectionAJAXData} data
	 * @param {EventsCollectionAJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	EventsCollection.fetchMyEvents = function(data, success) {
		return __APP.SERVER.getData('/api/v1/events/my', data, success);
	};
	/**
	 *
	 * @param {EventsCollectionAJAXData} data
	 * @param {EventsCollectionAJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	EventsCollection.fetchFavoredEvents = function(data, success) {
		return __APP.SERVER.getData('/api/v1/events/favorites', data, success);
	};
	/**
	 *
	 * @param {EventsCollectionAJAXData} data
	 * @param {EventsCollectionAJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	EventsCollection.fetchRecommendedEvents = function(data, success) {
		return __APP.SERVER.getData('/api/v1/events/recommendations', data, success);
	};
	/**
	 *
	 * @param {(number|string)} organization_id
	 * @param {EventsCollectionAJAXData} data
	 * @param {EventsCollectionAJAXCallback} [success]
	 * @returns {jqPromise}
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
	 * @returns {jqPromise}
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
				success.call(self, self.last_pushed);
			}
		});
	};
	/**
	 *
	 * @param {(Array|string)} [fields]
	 * @param {(number|string)} [length]
	 * @param {EventsCollectionAJAXCallback} [success]
	 * @returns {jqPromise}
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
				success.call(self, self.last_pushed);
			}
		});
	};
	/**
	 *
	 * @param {(number|string)} organization_id
	 * @param {EventsCollectionAJAXData} [data]
	 * @param {(number|string)} [length]
	 * @param {EventsCollectionAJAXCallback} [success]
	 * @returns {jqPromise}
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
				success.call(self, self.last_pushed);
			}
		});
	};
	/**
	 *
	 * @param {(number|string)} organization_id
	 * @param {(Array|string)} [fields]
	 * @param {(number|string)} [length]
	 * @param {EventsCollectionAJAXCallback} [success]
	 * @returns {jqPromise}
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
				success.call(self, self.last_pushed);
			}
		});
	};
	
	return EventsCollection;
}()));