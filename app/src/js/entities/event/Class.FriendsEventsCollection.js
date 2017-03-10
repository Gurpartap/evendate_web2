/**
 * @requires Class.EventsCollection.js
 */
/**
 *
 * @class FriendsEventsCollection
 * @extends EventsCollection
 */
FriendsEventsCollection = extending(EventsCollection, (function() {
	/**
	 *
	 * @constructor
	 * @constructs FriendsEventsCollection
	 */
	function FriendsEventsCollection() {}
	/**
	 *
	 * @override
	 */
	FriendsEventsCollection.fetchEvents = function(data, success) {
		data.fields = data.fields ? (typeof data.fields === 'string') ? data.fields.split(',') : data.fields : [];
		data.fields.push('favored_friends_count');
		data.future = true;
		data.order_by = '-favored_friends_count';
		return EventsCollection.fetchMyEvents(data, success);
	};
	
	return FriendsEventsCollection;
}()));