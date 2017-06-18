/**
 * @requires ../Class.EntitiesCollection.js
 * @requires Class.OneOrder.js
 */
/**
 *
 * @abstract
 * @class AbstractOrdersCollection
 * @extends EntitiesCollection
 */
AbstractOrdersCollection = extending(EntitiesCollection, (function() {
	/**
	 *
	 * @param {(string|number)} [event_id=0]
	 *
	 * @constructor
	 * @constructs AbstractOrdersCollection
	 *
	 * @property {(string|number)} event_id
	 */
	function AbstractOrdersCollection(event_id) {
		EntitiesCollection.call(this);
		
		this.event_id = setDefaultValue(event_id, 0);
	}
	
	AbstractOrdersCollection.prototype.collection_of = OneOrder;
	
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
	AbstractOrdersCollection.fetchOrders = function(event_id, ajax_data, success) {
		return $.promise();
	};
	/**
	 *
	 * @param {(Fields|string)} [fields]
	 * @param {number} [length]
	 * @param {(string|Array)} [order_by]
	 * @param {AJAXCallback} [success]
	 */
	AbstractOrdersCollection.prototype.fetchOrders = function(fields, length, order_by, success) {
		var self = this;
		
		return this.constructor.fetchOrders(this.event_id, {
			fields: fields || undefined,
			offset: this.length,
			length: length || undefined,
			order_by: order_by || undefined
		}, function(data) {
			self.setData(data);
			if (isFunction(success)) {
				success.call(self, self.last_pushed);
			}
		});
	};
	/**
	 *
	 * @param {number} orders_count
	 * @param {(Fields|Array<string>|string)} [fields]
	 * @param {(Array<string>|string)} [order_by]
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	AbstractOrdersCollection.prototype.fetchAllOrders = function(orders_count, fields, order_by, success) {
		var self = this,
			orders = [],
			laps = Math.ceil(orders_count / 100);
		
		this.empty();
		
		return __APP.SERVER.multipleAjax.apply(__APP.SERVER, (new Array(laps)).fill(true).map(function(el, i) {
			
			return self.constructor.fetchOrders(self.event_id, {
				fields: fields || undefined,
				offset: i * 100,
				order_by: order_by || undefined
			}).then(function(chunk) {
				
				orders = orders.concat(chunk);
				
				return chunk;
			});
		})).then(function() {
			self.setData(orders);
			
			if (isFunction(success)) {
				success.call(self, self.last_pushed);
			}
			
			return self.last_pushed;
		});
	};
	
	return AbstractOrdersCollection;
}()));