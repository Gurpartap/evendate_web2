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
	 * @return {Promise}
	 */
	AbstractEventTicketsCollection.fetchTickets = function(event_id, ajax_data, success) {
		
		return Promise.resolve();
	};
	/**
	 *
	 * @param {(Fields|string)} [fields]
	 * @param {number} [length]
	 * @param {(string|Array)} [order_by]
	 * @param {AJAXCallback} [success]
	 *
	 * @return {Promise}
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
				success.call(self, self.__last_pushed);
			}
		});
	};
	/**
	 *
	 * @param {(Fields|string)} [fields]
	 * @param {object} [filters]
	 * @param {(string|Array)} [order_by]
	 * @param {AJAXCallback} [success]
	 *
	 * @return {Promise}
	 */
	AbstractEventTicketsCollection.prototype.fetchAllTickets = function(fields, filters, order_by, success) {
		var self = this;
		
		this.empty();
		
		return this.constructor.fetchTickets(this.event_id, Object.assign({
			fields: fields || undefined,
			offset: 0,
			length: ServerConnection.MAX_ENTITIES_LENGTH,
			order_by: order_by || undefined
		}, filters), function(data) {
			self.setData(data);
			if (isFunction(success)) {
				success.call(self, self.__last_pushed);
			}
		}).then(function() {
			
			return self.__last_pushed;
		});
	};
	
	return AbstractEventTicketsCollection;
}()));