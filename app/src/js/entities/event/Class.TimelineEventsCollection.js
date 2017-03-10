/**
 * @requires Class.EventsCollection.js
 */
/**
 *
 * @class TimelineEventsCollection
 * @extends EventsCollection
 */
TimelineEventsCollection = extending(EventsCollection, (function() {
	/**
	 *
	 * @constructor
	 * @constructs TimelineEventsCollection
	 */
	function TimelineEventsCollection() {
		EventsCollection.call(this);
	}
	/**
	 *
	 * @override
	 */
	TimelineEventsCollection.fetchEvents = function(data, success) {
		data.future = true;
		return EventsCollection.fetchMyEvents(data, success);
	};
	
	return TimelineEventsCollection;
}()));