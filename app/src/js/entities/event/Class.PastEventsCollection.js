/**
 * @requires Class.EventsCollection.js
 */
/**
 *
 * @constructor
 * @augments EventsCollection
 */
function PastEventsCollection() {}
PastEventsCollection.extend(EventsCollection);
/**
 *
 * @override
 */
PastEventsCollection.fetchOrganizationsEvents = function(organization_id, data, success) {
	data.till = moment().format(__C.DATE_FORMAT);
	data.order_by = '-last_event_date';
	return EventsCollection.fetchOrganizationsEvents(organization_id, data, success);
};