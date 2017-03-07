/**
 * @requires Class.EventsCollection.js
 */
/**
 *
 * @class CanceledEventsCollection
 * @extends EventsCollection
 */
CanceledEventsCollection = extending(EventsCollection, (function() {
	/**
	 *
	 * @constructor
	 * @constructs CanceledEventsCollection
	 */
	function CanceledEventsCollection() {
		EventsCollection.call(this);
	}
	/**
	 *
	 * @override
	 */
	CanceledEventsCollection.fetchOrganizationsEvents = function(organization_id, data, success) {
		data.fields = data.fields ? (typeof data.fields === 'string') ? data.fields.split(',') : data.fields : [];
		data.fields.push('updated_at');
		data.is_canceled = true;
		data.order_by = '-updated_at';
		return EventsCollection.fetchOrganizationsEvents(organization_id, data, success);
	};
	
	return CanceledEventsCollection;
}()));