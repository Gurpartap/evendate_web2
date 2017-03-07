/**
 * @requires Class.EventsCollection.js
 */
/**
 *
 * @class ActualEventsCollection
 * @extends EventsCollection
 */
ActualEventsCollection = extending(EventsCollection, (function() {
	/**
	 *
	 * @constructor
	 * @constructs ActualEventsCollection
	 */
	function ActualEventsCollection() {}
	/**
	 *
	 * @override
	 */
	ActualEventsCollection.fetchEvents = function(data, success) {
		data.fields = data.fields ? (typeof data.fields === 'string') ? data.fields.split(',') : data.fields : [];
		data.fields.push('actuality');
		data.future = true;
		data.order_by = '-actuality';
		
		return EventsCollection.fetchMyEvents(data, success);
	};
	
	return ActualEventsCollection;
}()));