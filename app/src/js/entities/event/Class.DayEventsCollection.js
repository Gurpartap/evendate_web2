/**
 * @requires Class.EventsCollection.js
 */
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