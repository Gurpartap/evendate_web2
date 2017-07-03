/**
 * @requires Class.TicketsCollection.js
 */
/**
 *
 * @abstract
 * @class AbstractEventTicketsCollection
 * @extends TicketsCollection
 */
AbstractEventTicketsCollection = extending(TicketsCollection, (function() {
	/**
	 *
	 * @param {(string|number)} [event_id=0]
	 *
	 * @constructor
	 * @constructs AbstractEventTicketsCollection
	 *
	 * @property {(string|number)} event_id
	 */
	function AbstractEventTicketsCollection(event_id) {
		TicketsCollection.call(this);
		
		Object.defineProperty(this, 'event_id', {
			value: setDefaultValue(event_id, -1)
		});
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
	AbstractEventTicketsCollection.fetchTickets = function(event_id, ajax_data, success) {
		
		return $.Deferred().promise();
	};
	/**
	 *
	 * @param {(Fields|string)} [fields]
	 * @param {number} [length]
	 * @param {(string|Array)} [order_by]
	 * @param {AJAXCallback} [success]
	 *
	 * @return {jqPromise}
	 */
	AbstractEventTicketsCollection.prototype.fetchTickets = function(fields, length, order_by, success) {
		var self = this;
		
		return this.constructor.fetchTickets(this.event_id, {
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
	
	return AbstractEventTicketsCollection;
}()));