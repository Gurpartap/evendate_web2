/**
 * @requires Class.AbstractEventOrdersCollection.js
 */
/**
 *
 * @class EventMyOrdersCollection
 * @extends AbstractEventOrdersCollection
 */
EventMyOrdersCollection = extending(AbstractEventOrdersCollection, (function() {
	/**
	 *
	 * @param {(string|number)} [event_id=0]
	 *
	 * @constructor
	 * @constructs EventMyOrdersCollection
	 *
	 * @property {(string|number)} event_id
	 */
	function EventMyOrdersCollection(event_id) {
		AbstractEventOrdersCollection.call(this, event_id);
	}
	
	/**
	 *
	 * @param {(string|number)} event_id
	 * @param {AJAXData} [ajax_data]
	 * @param {AJAXCallback} [success]
	 *
	 * @return {jqPromise}
	 */
	EventMyOrdersCollection.fetchOrders = function(event_id, ajax_data, success) {
		
		return __APP.SERVER.getData('/api/v1/events/' + event_id + '/orders', ajax_data, success);
	};
	
	return EventMyOrdersCollection;
}()));