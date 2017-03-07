/**
 * @requires Class.EventsCollection.js
 */
/**
 *
 * @class RecommendedEventsCollection
 * @extends EventsCollection
 */
RecommendedEventsCollection = extending(EventsCollection, (function() {
	/**
	 *
	 * @constructor
	 * @constructs RecommendedEventsCollection
	 */
	function RecommendedEventsCollection() {}
	/**
	 *
	 * @override
	 */
	RecommendedEventsCollection.fetchEvents = function(data, success) {
		data.future = true;
		data.order_by = '-rating';
		return EventsCollection.fetchRecommendedEvents(data, success);
	};
	
	return RecommendedEventsCollection;
}()));