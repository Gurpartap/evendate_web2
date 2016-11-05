/**
 * @requires Class.EventsCollection.js
 */
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