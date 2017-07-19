/**
 * @requires Class.ExtendedOrdersCollection.js
 */
/**
 *
 * @class MyOrdersCollection
 * @extends ExtendedOrdersCollection
 */
MyOrdersCollection = extending(ExtendedOrdersCollection, (function() {
	/**
	 *
	 * @constructor
	 * @constructs MyOrdersCollection
	 */
	function MyOrdersCollection() {
		ExtendedOrdersCollection.call(this);
	}
	
	MyOrdersCollection.fetchOrders = function(ajax_data, success) {
		ajax_data = ajax_data ? ajax_data : {};
		
		return EventsCollection.fetchEvents($.extend({}, ExtendedOrdersCollection.convertFieldsToAjaxData(ajax_data.fields), {
			length: ajax_data.length,
			offset: ajax_data.offset,
			registered: true
		}), function(events) {
			if (isFunction(success)) {
				success(ExtendedOrdersCollection.convertToExtendedOrders(events));
			}
		}).then(ExtendedOrdersCollection.convertToExtendedOrders);
	};
	
	MyOrdersCollection.prototype.fetchOrders = function(fields, length, order_by, success) {
		var self = this,
			events_length = this.__events_length;
		
		this.__events_length += length || 20;
		
		return MyOrdersCollection.fetchOrders({
			fields: fields || undefined,
			offset: events_length,
			length: length || 20,
			order_by: order_by || undefined
		}, function(orders) {
			self.setData(orders);
			
			if (isFunction(success)) {
				success.call(self, self.last_pushed);
			}
		});
	};
	
	MyOrdersCollection.prototype.fetchAllOrders = function(fields, order_by, success) {
		var self = this;
		
		this.__events_length = ServerConnection.MAX_ENTITIES_LENGTH;
		
		return MyOrdersCollection.fetchOrders({
			fields: fields || undefined,
			offset: 0,
			length: ServerConnection.MAX_ENTITIES_LENGTH,
			order_by: order_by || undefined
		}, function(orders) {
			self.setData(orders);
			
			if (isFunction(success)) {
				success.call(self, self.last_pushed);
			}
		});
	};
	
	
	return MyOrdersCollection;
}()));