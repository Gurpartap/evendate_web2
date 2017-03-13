/**
 * @requires ../Class.EntitiesCollection.js
 * @requires Class.OneTicketType.js
 */
/**
 *
 * @class TicketsCollection
 * @extends EntitiesCollection
 */
TicketsCollection = extending(EntitiesCollection, (function() {
	/**
	 *
	 * @param {(string|number)} [event_id=0]
	 *
	 * @constructor
	 * @constructs TicketsCollection
	 *
	 * @property {(string|number)} event_id
	 */
	function TicketsCollection(event_id) {
		EntitiesCollection.call(this);
		
		this.event_id = setDefaultValue(event_id, 0);
	}
	
	TicketsCollection.prototype.collection_of = OneTicket;
	
	/**
	 *
	 * @param {(string|number)} event_id
	 * @param {AJAXData} [ajax_data]
	 * @param {AJAXCallback} [success]
	 *
	 * @return {jqPromise}
	 */
	TicketsCollection.fetchTickets = function(event_id, ajax_data, success) {
		return __APP.SERVER.getData('/api/v1/events/' + event_id + '/tickets', ajax_data, success);
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
	TicketsCollection.prototype.fetchTickets = function(fields, length, order_by, success) {
		var self = this;
		
		return TicketsCollection.fetchTickets(this.event_id, {
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
	
	return TicketsCollection;
}()));