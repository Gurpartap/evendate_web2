/**
 * @requires Class.EventsCollection.js
 */
/**
 *
 * @class DayEventsCollection
 * @extends EventsCollection
 */
DayEventsCollection = extending(EventsCollection, (function() {
	/**
	 *
	 * @param {string} date
	 * @constructor
	 * @construct DayEventsCollection
	 */
	function DayEventsCollection(date) {
		if (!date)
			throw Error('DayEventsCollection must have date parameter');
		EventsCollection.call(this);
		this.date = date;
	}
	/**
	 *
	 * @param {string} date
	 * @param {EventsCollectionAJAXData} data
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	DayEventsCollection.fetchEvents = function(date, data, success) {
		data.date = date;
		return EventsCollection.fetchMyEvents(data, success);
	};
	/**
	 *
	 * @override
	 */
	DayEventsCollection.prototype.fetchFeed = function(fields, length, filters, success) {
		var self = this,
			ajax_data = $.extend({
				fields: fields,
				offset: this.length,
				length: length
			}, filters);
		
		return this.constructor.fetchEvents(this.date, ajax_data, function(data) {
			self.setData(data);
			if (isFunction(success)) {
				success.call(self, data);
			}
		});
	};
	
	return DayEventsCollection;
}()));