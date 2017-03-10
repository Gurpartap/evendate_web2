/**
 * @requires Class.EventsCollection.js
 */
/**
 *
 * @class FavoredEventsCollection
 * @extends EventsCollection
 */
FavoredEventsCollection = extending(EventsCollection, (function() {
	/**
	 *
	 * @constructor
	 * @constructs FavoredEventsCollection
	 */
	function FavoredEventsCollection() {}
	/**
	 *
	 * @override
	 */
	FavoredEventsCollection.fetchEvents = function(data, success) {
		data.future = true;
		return EventsCollection.fetchFavoredEvents(data, success);
	};
	
	return FavoredEventsCollection;
}()));