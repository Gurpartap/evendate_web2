/**
 * @requires Class.EventsCollection.js
 */
/**
 *
 * @constructor
 * @augments EventsCollection
 */
function FutureEventsCollection() {}
FutureEventsCollection.extend(EventsCollection);
/**
 *
 * @override
 */
FutureEventsCollection.fetchOrganizationsEvents = function(organization_id, data, success) {
	data.future = true;
	data.order_by = 'nearest_event_date';
	return EventsCollection.fetchOrganizationsEvents(organization_id, data, success);
};