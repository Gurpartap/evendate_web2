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
	 * @param {(string|number)} [event_id=0]
	 *
	 * @constructor
	 * @constructs OrdersCollection
	 *
	 * @property {(string|number)} event_id
	 */
	function OrdersCollection(event_id) {
		EntitiesCollection.call(this);
		
		this.event_id = setDefaultValue(event_id, 0);
	}
	
	OrdersCollection.prototype.collection_of = OneOrder;
	/**
	 *
	 * @param {string} uuid
	 * @return {(OneOrder|undefined)}
	 */
	OrdersCollection.prototype.getByUUID = function(uuid) {
		var found = this.filter(function(element) {
			return element.uuid === uuid;
		});
		
		return found.shift();
	};
	
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
	/**
	 *
	 * @param {(Fields|string)} [fields]
	 * @param {number} [length]
	 * @param {(string|Array)} [order_by]
	 * @param {AJAXCallback} [success]
	 */
	OrdersCollection.prototype.fetchOrders = function(fields, length, order_by, success) {
		var self = this;
		
		return OrdersCollection.fetchOrders(this.event_id, {
			fields: fields || undefined,
			offset: this.length,
			length: length || undefined,
			order_by: order_by || undefined
		}, function(data) {
			self.setData(data);
			if (success && typeof success == 'function') {
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
	OrdersCollection.prototype.fetchAllOrders = function(orders_count, fields, order_by, success) {
		var self = this,
			orders = [],
			laps = Math.ceil(orders_count / 100);
		
		this.empty();
		
		return __APP.SERVER.multipleAjax.apply(__APP.SERVER, (new Array(laps)).fill(true).map(function(el, i) {
			
			return OrdersCollection.fetchOrders(self.event_id, {
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
	
	return OrdersCollection;
}()));