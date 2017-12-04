/**
 * @requires ../Class.EntitiesCollection.js
 * @requires Class.OneTicketType.js
 */
/**
 *
 * @class TicketTypesCollection
 * @extends EntitiesCollection
 */
TicketTypesCollection = extending(EntitiesCollection, (function() {
	/**
	 *
	 * @param {(string|number)} [event_id=0]
	 *
	 * @constructor
	 * @constructs TicketTypesCollection
	 *
	 * @property {(string|number)} event_id
	 */
	function TicketTypesCollection(event_id) {
		EntitiesCollection.call(this);
		
		this.event_id = setDefaultValue(event_id, 0);
	}
	
	TicketTypesCollection.prototype.collection_of = OneTicketType;
	
	/**
	 *
	 * @param {(string|number)} event_id
	 * @param {AJAXData} [ajax_data]
	 * @param {AJAXCallback} [success]
	 *
	 * @return {Promise}
	 */
	TicketTypesCollection.fetchTicketTypes = function(event_id, ajax_data, success) {
		return __APP.SERVER.getData('/api/v1/events/' + event_id + '/ticket_types', ajax_data, success);
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
	TicketTypesCollection.prototype.fetchTicketTypes = function(fields, length, order_by, success) {
		var self = this;
		
		return TicketTypesCollection.fetchTicketTypes(this.event_id, {
			fields: fields || undefined,
			offset: this.length,
			length: length || undefined,
			order_by: order_by || undefined
		}, function(data) {
			self.setData(data);
			if (success && typeof success == 'function') {
				success.call(self, self.__last_pushed);
			}
		});
	};
	
	return TicketTypesCollection;
}()));