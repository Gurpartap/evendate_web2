/**
 * @requires Class.OrdersCollection.js
 */
/**
 *
 * @class MyOrdersCollection
 * @extends OrdersCollection
 */
MyOrdersCollection = extending(OrdersCollection, (function() {
	/**
	 *
	 * @constructor
	 * @constructs MyOrdersCollection
	 */
	function MyOrdersCollection() {
		ExtendedOrdersCollection.call(this);
	}
	
	/**
	 *
	 * @param {AJAXData} ajax_data
	 *
	 * @return {Promise}
	 */
	MyOrdersCollection.fetchOrders = function(ajax_data) {
		
		return __APP.SERVER.getData(OrdersCollection.ENDPOINT.ORDER, ajax_data);
	};
	/**
	 *
	 * @param {Fields} [fields]
	 * @param {number} [length]
	 * @param {(Array<string>|string)} [order_by]
	 *
	 * @return {Promise}
	 */
	MyOrdersCollection.prototype.fetch = function(fields, length, order_by) {
		var self = this;
		
		return MyOrdersCollection.fetchOrders({
			fields: fields || undefined,
			offset: this.length || undefined,
			length: length || undefined,
			order_by: order_by || undefined
		}).then(function(orders) {
			self.setData(orders);
			
			return self.__last_pushed;
		});
	};
	/**
	 *
	 * @param {Fields} [fields]
	 * @param {(Array<string>|string)} [order_by]
	 *
	 * @return {Promise}
	 */
	MyOrdersCollection.prototype.fetchAll = function(fields, order_by) {
		var self = this;
		
		return MyOrdersCollection.fetchOrders({
			fields: fields || undefined,
			offset: 0,
			length: ServerConnection.MAX_ENTITIES_LENGTH,
			order_by: order_by || undefined
		}).then(function(orders) {
			self.setData(orders);
			
			return self.__last_pushed;
		});
	};
	
	
	return MyOrdersCollection;
}()));