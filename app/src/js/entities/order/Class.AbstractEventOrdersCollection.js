/**
 * @requires Class.OrdersCollection.js
 */
/**
 *
 * @abstract
 * @class AbstractEventOrdersCollection
 * @extends OrdersCollection
 */
AbstractEventOrdersCollection = extending(OrdersCollection, (function() {
	/**
	 *
	 * @param {(string|number)} [event_id=0]
	 *
	 * @constructor
	 * @constructs AbstractEventOrdersCollection
	 *
	 * @property {(string|number)} event_id
	 */
	function AbstractEventOrdersCollection(event_id) {
		OrdersCollection.call(this);
		
		this.event_id = setDefaultValue(event_id, 0);
	}
	/**
	 *
	 * @abstract
	 *
	 * @param {(string|number)} event_id
	 * @param {AJAXData} [ajax_data]
	 * @param {AJAXCallback} [success]
	 *
	 * @return {jqPromise}
	 */
	AbstractEventOrdersCollection.fetchOrders = function(event_id, ajax_data, success) {
		return $.promise();
	};
	/**
	 *
	 * @param {(Fields|string)} [fields]
	 * @param {number} [length]
	 * @param {(string|Array)} [order_by]
	 * @param {AJAXCallback} [success]
	 *
	 * @returns {jqPromise}
	 */
	AbstractEventOrdersCollection.prototype.fetchOrders = function(fields, length, order_by, success) {
		var self = this;
		
		return this.constructor.fetchOrders(this.event_id, {
			fields: fields || undefined,
			offset: this.length,
			length: length || undefined,
			order_by: order_by || undefined
		}, function(data) {
			self.setData(data);
			if (isFunction(success)) {
				success.call(self, self.__last_pushed);
			}
		});
	};
	/**
	 *
	 * @param {(Fields|Array<string>|string)} [fields]
	 * @param {(Array<string>|string)} [order_by]
	 * @param {AJAXCallback} [success]
	 *
	 * @returns {jqPromise}
	 */
	AbstractEventOrdersCollection.prototype.fetchAllOrders = function(fields, order_by, success) {
		var self = this;
		
		this.empty();
		
		return this.constructor.fetchOrders(this.event_id, {
			fields: fields || undefined,
			offset: 0,
			length: ServerConnection.MAX_ENTITIES_LENGTH,
			order_by: order_by || undefined
		}, function(data) {
			self.setData(data);
			if (isFunction(success)) {
				success.call(self, self.__last_pushed);
			}
		}).then(function() {
			
			return self.__last_pushed;
		});
	};
	
	
	return AbstractEventOrdersCollection;
}()));