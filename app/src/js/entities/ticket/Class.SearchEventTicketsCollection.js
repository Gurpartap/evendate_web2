/**
 * @requires Class.EventAllTicketsCollection.js
 */
/**
 *
 * @class SearchEventTicketsCollection
 * @extends EventAllTicketsCollection
 */
SearchEventTicketsCollection = extending(EventAllTicketsCollection, (function() {
	/**
	 * @param {(string|number)} query_string
	 * @param {(string|number)} event_id
	 *
	 * @constructor
	 * @constructs SearchEventTicketsCollection
	 */
	function SearchEventTicketsCollection(query_string, event_id) {
		EventAllTicketsCollection.call(this, event_id);
		this.query_string = query_string;
	}
	
	/**
	 *
	 * @param {(string|number)} query_string
	 * @param {(string|number)} event_id
	 * @param {AJAXData} [ajax_data]
	 * @param {AJAXCallback} [success]
	 *
	 * @return {jqPromise}
	 */
	SearchEventTicketsCollection.fetchTickets = function(query_string, event_id, ajax_data, success) {
		ajax_data = ajax_data ? ajax_data : {};
		
		if ($.isNumeric(query_string)) {
			ajax_data.number = query_string;
		} else {
			ajax_data.user_name = query_string;
		}
		
		return EventAllTicketsCollection.fetchTickets(event_id, ajax_data, success);
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
	SearchEventTicketsCollection.prototype.fetchTickets = function(fields, length, order_by, success) {
		var self = this;
		
		return SearchEventTicketsCollection.fetchTickets(this.query_string, this.event_id, {
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
	
	return SearchEventTicketsCollection;
}())); 