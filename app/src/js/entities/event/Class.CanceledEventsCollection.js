/**
 * @requires Class.EventsCollection.js
 */
/**
 *
 * @constructor
 * @augments EventsCollection
 */
function CanceledEventsCollection() {}
CanceledEventsCollection.extend(EventsCollection);
/**
 *
 * @override
 */
CanceledEventsCollection.fetchOrganizationsEvents = function(organization_id, data, success) {
	data.fields = data.fields ? Array.isArray(data.fields) ? data.fields : data.fields.split(',') : [];
	data.fields.push('updated_at');
	data.is_canceled = true;
	data.order_by = '-updated_at';
	return EventsCollection.fetchOrganizationsEvents(organization_id, data, success);
};