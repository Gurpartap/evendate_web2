/**
 * @requires Class.AbstractOrdersCollection.js
 */
/**
 *
 * @class OrdersCollection
 * @extends AbstractOrdersCollection
 */
OrdersCollection = extending(AbstractOrdersCollection, (function() {
	/**
	 *
	 * @param {(string|number)} [event_id=0]
	 *
	 * @constructor
	 * @constructs OrdersCollection
	 *
	 * @property {(string|number)} event_id
	 */
	function OrdersCollection(event_id) {
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
	OrdersCollection.fetchOrders = function(event_id, ajax_data, success) {
		return __APP.SERVER.getData('/api/v1/events/' + event_id + '/orders', ajax_data, success);
	};
	
	return OrdersCollection;
}()));