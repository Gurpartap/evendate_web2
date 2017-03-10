/**
 * @requires Class.EventsCollection.js
 */
/**
 *
 * @class PastEventsCollection
 * @extends EventsCollection
 */
PastEventsCollection = extending(EventsCollection, (function() {
	/**
	 *
	 * @constructor
	 * @constructs PastEventsCollection
	 */
	function PastEventsCollection() {
		EventsCollection.call(this);
	}
	/**
	 *
	 * @override
	 */
	PastEventsCollection.fetchOrganizationsEvents = function(organization_id, data, success) {
		data.till = moment().format(__C.DATE_FORMAT);
		data.order_by = '-last_event_date';
		return EventsCollection.fetchOrganizationsEvents(organization_id, data, success);
	};
	
	return PastEventsCollection;
}()));