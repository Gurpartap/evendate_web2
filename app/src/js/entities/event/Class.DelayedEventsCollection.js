/**
 * @requires Class.EventsCollection.js
 */
/**
 *
 * @constructor
 * @augments EventsCollection
 */
function DelayedEventsCollection() {}
DelayedEventsCollection.extend(EventsCollection);
/**
 *
 * @override
 */
DelayedEventsCollection.fetchOrganizationsEvents = function(organization_id, data, success) {
	data.fields = data.fields ? Array.isArray(data.fields) ? data.fields : data.fields.split(',') : [];
	data.fields.push('public_at');
	data.is_delayed = true;
	data.is_canceled = false;
	data.order_by = 'public_at';
	return EventsCollection.fetchOrganizationsEvents(organization_id, data, success);
};