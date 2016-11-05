/**
 * @requires Class.EventsCollection.js
 */
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