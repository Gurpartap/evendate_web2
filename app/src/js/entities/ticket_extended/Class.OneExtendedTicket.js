/**
 * @requires ../ticket/Class.OneTicket.js
 */
/**
 * @class OneExtendedTicket
 * @extends OneTicket
 */
OneExtendedTicket = extending(OneTicket, (function() {
	/**
	 *
	 * @param {(string|number)} [event_id]
	 * @param {(string|number)} [uuid]
	 *
	 * @constructor
	 * @constructs OneExtendedTicket
	 *
	 * @property {?(string|number)} uuid
	 * @property {?(string|number)} event_id
	 * @property {?(string|number)} user_id
	 * @property {?string} type_code
	 * @property {?string} ticket_type_uuid
	 * @property {?string} ticket_order_uuid
	 * @property {?boolean} status
	 * @property {?TEXTS.TICKET_STATUSES} status_name
	 * @property {?OneExtendedTicket.TICKET_STATUSES} status_type_code
	 * @property {?boolean} checked_out
	 * @property {?(string|number)} price
	 * @property {?(string|number)} number
	 * @property {?timestamp} created_at
	 *
	 * @property {OneTicketType} ticket_type
	 * @property {OneOrder} order
	 * @property {OneUser} user
	 * @property {OneEvent} event
	 */
	function OneExtendedTicket(event_id, uuid) {
		var self = this;
		OneTicket.call(this, event_id, uuid);
		
		this.event = new OneEvent(event_id);
		
		Object.defineProperties(this, {
			status_name: {
				get: function() {
					for( var prop in OneExtendedTicket.TICKET_STATUSES ) {
						if( OneExtendedTicket.TICKET_STATUSES.hasOwnProperty(prop) && OneExtendedTicket.TICKET_STATUSES[ prop ] === self.order.status_type_code )
							return __LOCALES.ru_RU.TEXTS.TICKET_STATUSES[ prop ];
					}
					return '';
				}
			},
			status_type_code: {
				get: function() {
					return self.order.status_type_code;
				}
			}
		});
	}
	
	OneExtendedTicket.TICKET_STATUSES = $.extend({
		USED: 'used'
	}, OneOrder.EXTENDED_ORDER_STATUSES);
	/**
	 *
	 * @param {Array} data
	 * @return {Array}
	 */
	OneExtendedTicket.extractTicketFromData = function(data) {
		return data.map(function(event) {
			var ticket_data = event.tickets.length === 1 ? event.tickets.shift() : event.tickets,
				order_data = ticket_data.order,
				ticket_type_data = ticket_data.ticket_type;
			
			if (!order_data && event.orders) {
				order_data = event.orders.reduce(function(found_order, order) {
					return found_order ? found_order : (order.uuid === ticket_data.ticket_order_uuid ? order : false);
				}, false);
			}
			if (!ticket_type_data && event.ticket_types) {
				ticket_type_data = event.ticket_types.reduce(function(found_ticket_type, ticket_type) {
					return found_ticket_type ? found_ticket_type : (ticket_type.uuid === ticket_data.ticket_type_uuid ? ticket_type : false);
				}, false);
			}
			
			return $.extend(ticket_data, {
				event: event,
				order: order_data,
				ticket_type: ticket_type_data
			});
		});
	};
	/**
	 *
	 * @param {OneEvent} event
	 * @return {OneExtendedTicket}
	 */
	OneExtendedTicket.extractTicketFromEvent = function(event) {
		var _event = new OneEvent(),
			ticket = new OneExtendedTicket(event.id);
		
		_event.setData(event);
		ticket.setData($.extend(_event.tickets[0], {
			event: _event,
			event_id: _event.id,
			order: _event.orders.getByUUID(_event.tickets[0].ticket_order_uuid)
		}));
		
		return ticket;
	};
	/**
	 *
	 * @param {(string|number)} event_id
	 * @param {(string|number)} uuid
	 * @param {(Fields|string)} [fields]
	 * @param {AJAXCallback} [success]
	 *
	 * @return {jqPromise}
	 */
	OneExtendedTicket.fetchTicket = function(event_id, uuid, fields, success) {
		var event_ajax_data;
		
		fields = Fields.parseFields(fields);
		
		event_ajax_data = $.extend(true, {}, fields.pull('event'), {
			fields: new Fields({
				tickets: {
					filters: 'uuid=' + uuid,
					fields: fields
				}
			})
		});
		
		return __APP.SERVER.getData('/api/v1/events/' + event_id, event_ajax_data, success);
	};
	/**
	 *
	 * @param {(Fields|string)} [fields]
	 * @param {AJAXCallback} [success]
	 *
	 * @return {jqPromise}
	 */
	OneExtendedTicket.prototype.fetchTicket = function(fields, success) {
		var self = this;
		
		return OneExtendedTicket.fetchTicket(this.event_id, this.uuid, fields, function(data) {
			var ticket_data = OneExtendedTicket.extractTicketFromData(data);
			self.setData(ticket_data);
			if (success && typeof success === 'function') {
				success.call(self, ticket_data);
			}
		});
	};
	
	return OneExtendedTicket;
}()));