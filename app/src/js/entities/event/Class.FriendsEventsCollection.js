/**
 * @requires Class.EventsCollection.js
 */
/**
 *
 * @constructor
 * @augments EventsCollection
 */
function FriendsEventsCollection() {}
FriendsEventsCollection.extend(EventsCollection);
/**
 *
 * @override
 */
FriendsEventsCollection.fetchEvents = function(data, success) {
	data.fields = data.fields ? Array.isArray(data.fields) ? data.fields : data.fields.split(',') : [];
	data.fields.push('favored_friends_count');
	data.future = true;
	data.order_by = '-favored_friends_count';
	return EventsCollection.fetchMyEvents(data, success);
};