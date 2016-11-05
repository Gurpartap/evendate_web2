/**
 * @requires Class.EventsCollection.js
 */
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