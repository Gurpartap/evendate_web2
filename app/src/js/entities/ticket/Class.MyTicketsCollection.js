/**
 * @requires Class.ExtendedTicketsCollection.js
 */
/**
 *
 * @class MyTicketsCollection
 * @extends ExtendedTicketsCollection
 */
MyTicketsCollection = extending(ExtendedTicketsCollection, (function() {
	/**
	 *
	 * @constructor
	 * @constructs MyTicketsCollection
	 */
	function MyTicketsCollection() {
		ExtendedTicketsCollection.call(this);
	}
	
	/**
	 *
	 * @param {AJAXData} [ajax_data]
	 * @param {AJAXCallback} [success]
	 *
	 * @return {jqPromise}
	 */
	MyTicketsCollection.fetchTickets = function(ajax_data, success) {
		ajax_data = ajax_data ? ajax_data : {};
		var events_ajax_data = {},
			event_fields;
		
		if (ajax_data.fields) {
			ajax_data.fields = Fields.parseFields(ajax_data.fields);
			if (ajax_data.fields.has('event')) {
				events_ajax_data = ajax_data.fields.pull('event');
			}
		}
		
		events_ajax_data.length = ajax_data.length;
		events_ajax_data.offset = ajax_data.offset;
		ajax_data.length = 0;
		ajax_data.offset = undefined;
		event_fields = new Fields({tickets: ajax_data});
		if (events_ajax_data.fields) {
			events_ajax_data.fields = Fields.parseFields(events_ajax_data.fields);
			events_ajax_data.fields.push(event_fields);
		} else {
			events_ajax_data.fields = event_fields;
		}
		events_ajax_data.registered = true;
		
		return __APP.SERVER.getData('/api/v1/events', events_ajax_data, success);
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
	MyTicketsCollection.prototype.fetchTickets = function(fields, length, order_by, success) {
		var self = this;
		
		return MyTicketsCollection.fetchTickets({
			fields: fields || undefined,
			offset: this.length,
			length: length || undefined,
			order_by: order_by || undefined
		}).then(function(data) {
			self.setData(OneExtendedTicket.extractTicketFromData(data));
			if (success && typeof success == 'function') {
				success.call(self, self.last_pushed);
			}
			return self.last_pushed;
		});
	};
	
	return MyTicketsCollection;
}())); 