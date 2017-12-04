/**
 * @requires Class.AbstractModal.js
 */
/**
 * @class TicketsModal
 * @extends AbstractModal
 */
TicketsModal = extending(AbstractModal, (function() {
	/**
	 *
	 * @param {(TicketsCollection|Array<OneTicket>|OneTicket|string)} tickets
	 * @constructor
	 * @constructs TicketsModal
	 *
	 * @property {TicketsCollection} tickets
	 * @property {string} ticket_uuid
	 * @property {{event_id: string, uuid: string}} fetch_needed
	 */
	function TicketsModal(tickets) {
		AbstractModal.call(this);
		
		this.fetch_ticket_data = null;
		
		if (tickets instanceof TicketsCollection) {
			this.tickets = tickets;
		} else if (tickets instanceof Array || tickets instanceof OneTicket) {
			this.tickets = new TicketsCollection();
			this.tickets.setData(tickets);
		} else if (!empty(tickets) && tickets.event_id && tickets.uuid) {
			this.tickets = new TicketsCollection();
			this.fetch_ticket_data = tickets;
		} else {
			throw Error('Constructor needs instance of OneExtendedTicket class to create new instance of TicketsModal');
		}
	}
	
	TicketsModal.NECESSARY_FIELDS = new Fields(
		'created_at',
		'number',
		'ticket_type',
		'order', {
			event: {
				fields: new Fields(
					'dates',
					'is_same_time',
					'location'
				)
			}
		}
	);
	
	TicketsModal.prototype.fetchData = function() {
		var self = this,
			ticket;
		
		if (this.fetch_ticket_data) {
			ticket = new OneTicket(this.fetch_ticket_data.event_id, this.fetch_ticket_data.uuid);
			
			return ticket.fetch(TicketsModal.NECESSARY_FIELDS).then(function() {
				self.tickets.push(ticket);
			});
		}
		
		return AbstractModal.prototype.fetchData.call(this);
	};
	/**
	 *
	 * @return {TicketsModal}
	 */
	TicketsModal.prototype.render = function(props){
		var self = this;
		
		this.content = tmpl('modal-ticket-content', Builder.normalizeTicketProps(this.tickets).map(function(props, i) {
			var data = self.tickets[i].order.payed_at || self.tickets[i].created_at;
			
			props.cover_width = 480;
			props.card_classes.push('-ticket_extended', __C.CLASSES.FLOATING_MATERIAL);
			
			return $.extend(props, {
				cover_height: 269,
				event_id: self.tickets[i].event.id,
				ticket_uuid: self.tickets[i].uuid,
				number_formatted: formatTicketNumber(self.tickets[i].number),
				payed_at_formatted: moment.unix(data).format(__LOCALES.ru_RU.DATE.DATE_TIME_FORMAT),
				price_formatted: +self.tickets[i].price ? formatCurrency(self.tickets[i].price, ' ', '.', '', '₽') : 'Бесплатно'
			});
		}));
		
		this.__render({
			content_classes: [__C.CLASSES.MODAL_STATES.NO_PADDING]
		});
		
		return this;
	};
	
	return TicketsModal;
}()));