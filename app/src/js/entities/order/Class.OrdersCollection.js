/**
 * @requires ../Class.EntitiesCollection.js
 * @requires Class.OneOrder.js
 */
/**
 *
 * @class OrdersCollection
 * @extends EntitiesCollection
 */
OrdersCollection = extending(EntitiesCollection, (function() {
	/**
	 *
	 * @constructor
	 * @constructs OrdersCollection
	 */
	function OrdersCollection() {
		EntitiesCollection.call(this);
	}
	
	OrdersCollection.prototype.collection_of = OneOrder;
	
	OrdersCollection.ENDPOINT = Object.freeze({
		ORDER: '/events/orders'
	});
	
	
	return OrdersCollection;
}()));