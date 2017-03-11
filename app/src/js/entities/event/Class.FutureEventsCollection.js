/**
 * @requires Class.EventsCollection.js
 */
/**
 *
 * @class FutureEventsCollection
 * @extends EventsCollection
 */
FutureEventsCollection = extending(EventsCollection, (function() {
	/**
	 *
	 * @constructor
	 * @constructs FutureEventsCollection
	 */
	function FutureEventsCollection() {
		EventsCollection.call(this);
	}
	/**
	 *
	 * @override
	 */
	FutureEventsCollection.fetchOrganizationsEvents = function(organization_id, data, success) {
		data.future = true;
		data.order_by = 'nearest_event_date';
		return EventsCollection.fetchOrganizationsEvents(organization_id, data, success);
	};
	
	return FutureEventsCollection;
}()));