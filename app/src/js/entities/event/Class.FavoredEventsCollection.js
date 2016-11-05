/**
 * @requires Class.EventsCollection.js
 */
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