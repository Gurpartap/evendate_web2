/**
 * @requires ../Class.EntitiesCollection.js
 * @requires Class.OneExtendedTicket.js
 */
/**
 *
 * @class ExtendedTicketsCollection
 * @extends EntitiesCollection
 */
ExtendedTicketsCollection = extending(EntitiesCollection, (function() {
	/**
	 *
	 * @constructor
	 * @constructs ExtendedTicketsCollection
	 */
	function ExtendedTicketsCollection() {
		EntitiesCollection.call(this);
	}
	
	ExtendedTicketsCollection.prototype.collection_of = OneExtendedTicket;
	/**
	 *
	 * @param {(Fields|Array|string|undefined)} [fields]
	 *
	 * @return {AJAXData}
	 */
	ExtendedTicketsCollection.convertTicketFieldsToEventAjaxData = function(fields) {
		fields = fields ? Fields.parseFields(fields) : new Fields();
		var events_ajax_data = {},
			events_fields;
		
		if (fields.has('event')) {
			events_ajax_data = fields.pull('event');
		}
		
		events_fields = new Fields({tickets: {fields: fields}});
		
		if (events_ajax_data.fields) {
			events_ajax_data.fields = Fields.parseFields(events_ajax_data.fields);
			events_ajax_data.fields.push(events_fields);
		} else {
			events_ajax_data.fields = events_fields;
		}
		
		return events_ajax_data;
	};
	/**
	 *
	 * @param {OneEvent} event
	 * @return {ExtendedTicketsCollection}
	 */
	ExtendedTicketsCollection.extractTicketsFromEvent = function(event) {
		var _event = new OneEvent(),
			tickets = new ExtendedTicketsCollection();
		
		_event.setData(event);
		tickets.setData(_event.tickets.map(function(ticket) {
			return $.extend({}, ticket, {
				event_id: _event.id,
				event: _event
			});
		}));
		
		return tickets;
	};
	
	
	return ExtendedTicketsCollection;
}()));