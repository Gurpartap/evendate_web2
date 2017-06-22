/**
 * @requires Class.AbstractOrdersCollection.js
 */
/**
 *
 * @class EventOrdersCollection
 * @extends AbstractOrdersCollection
 */
EventOrdersCollection = extending(AbstractOrdersCollection, (function() {
	/**
	 *
	 * @param {(string|number)} [event_id=0]
	 *
	 * @constructor
	 * @constructs EventOrdersCollection
	 *
	 * @property {(string|number)} event_id
	 */
	function EventOrdersCollection(event_id) {
		AbstractOrdersCollection.call(this, event_id);
	}
	
	/**
	 *
	 * @param {(string|number)} event_id
	 * @param {AJAXData} [ajax_data]
	 * @param {AJAXCallback} [success]
	 *
	 * @return {jqPromise}
	 */
	EventOrdersCollection.fetchOrders = function(event_id, ajax_data, success) {
		return __APP.SERVER.getData('/api/v1/statistics/events/' + event_id + '/orders', ajax_data, success);
	};
	
	return EventOrdersCollection;
}()));