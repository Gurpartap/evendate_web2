/**
 * @requires ../Class.EntitiesCollection.js
 * @requires Class.OneExtendedOrder.js
 */
/**
 *
 * @class ExtendedOrdersCollection
 * @extends EntitiesCollection
 */
ExtendedOrdersCollection = extending(EntitiesCollection, (function() {
	/**
	 *
	 * @constructor
	 * @constructs ExtendedOrdersCollection
	 *
	 * @property {number} __events_length
	 */
	function ExtendedOrdersCollection() {
		EntitiesCollection.call(this);
		
		Object.defineProperties(this, {
			__events_length: {
				writable: true,
				value: 0
			}
		});
	}
	
	ExtendedOrdersCollection.prototype.collection_of = OneExtendedOrder;
	/**
	 *
	 * @param events
	 * @return {*}
	 */
	ExtendedOrdersCollection.convertToExtendedOrders = function(events) {
		
		return events.reduce(function(orders_bundle, event) {
			
			return orders_bundle.concat(event.orders ? event.orders.reduce(function(event_orders_bundle, order) {
				order.event = event;
				event_orders_bundle.push(order);
				
				return event_orders_bundle;
			}, []) : []);
		}, []);
	};
	/**
	 *
	 * @param {(Fields|Array|string|undefined)} [fields]
	 *
	 * @return {AJAXData}
	 */
	ExtendedOrdersCollection.convertFieldsToAjaxData = function(fields) {
		fields = fields ? Fields.parseFields(fields) : new Fields();
		var events_ajax_data = {},
			events_fields;
		
		if (fields.has('event')) {
			events_ajax_data = fields.pull('event');
		}
		
		events_fields = new Fields({orders: {fields: fields}});
		
		if (events_ajax_data.fields) {
			events_ajax_data.fields = Fields.parseFields(events_ajax_data.fields);
			events_ajax_data.fields.push(events_fields);
		} else {
			events_ajax_data.fields = events_fields;
		}
		
		return events_ajax_data;
	};
	
	return ExtendedOrdersCollection;
}()));