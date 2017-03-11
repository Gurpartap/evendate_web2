/**
 * @requires Class.EventsCollection.js
 */
/**
 *
 * @class DelayedEventsCollection
 * @extends EventsCollection
 */
DelayedEventsCollection = extending(EventsCollection, (function() {
	/**
	 *
	 * @constructor
	 * @constructs DelayedEventsCollection
	 */
	function DelayedEventsCollection() {
		EventsCollection.call(this);
	}
	/**
	 *
	 * @override
	 */
	DelayedEventsCollection.fetchOrganizationsEvents = function(organization_id, data, success) {
		data.fields = data.fields ? (typeof data.fields === 'string') ? data.fields.split(',') : data.fields : [];
		data.fields.push('public_at');
		data.is_delayed = true;
		data.is_canceled = false;
		data.order_by = 'public_at';
		return EventsCollection.fetchOrganizationsEvents(organization_id, data, success);
	};
	
	return DelayedEventsCollection;
}()));