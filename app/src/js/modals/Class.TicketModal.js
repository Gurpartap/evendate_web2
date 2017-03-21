/**
 * @requires Class.AbstractModal.js
 */
/**
 * @class TicketModal
 * @extends AbstractModal
 */
TicketModal = extending(AbstractModal, (function() {
	/**
	 *
	 * @param {(OneExtendedTicket|string)} ticket
	 * @constructor
	 * @constructs TicketModal
	 *
	 * @property {OneExtendedTicket} ticket
	 * @property {string} ticket_uuid
	 * @property {boolean} is_ticket_exists
	 */
	function TicketModal(ticket) {
		var build_props,
			date;
		
		AbstractModal.call(this);
		if (ticket instanceof OneExtendedTicket) {
			this.ticket = ticket;
			this.is_ticket_exists = true;
		} else if (typeof ticket === 'string') {
			this.ticket = new OneExtendedTicket(ticket);
			this.is_ticket_exists = false;
		} else {
			throw Error('Constructor needs instance of OneExtendedTicket class to create new instance of TicketModal');
		}
		this.width = 450;
		
		build_props = Builder.normalizeTicketProps(ticket).shift();
		build_props.card_classes.push('-ticket_extended');
		
		date = ticket.order.payed_at || ticket.created_at;
		this.content = tmpl('modal-ticket-content', $.extend(build_props, {
			number_formatted: formatTicketNumber(ticket.number),
			payed_at_formatted: (ticket.order.payed_at ? 'Куплен ' : 'Приобретен ') + moment.unix(date).format(__LOCALES.ru_RU.DATE.DATE_TIME_FORMAT),
			price_formatted: +ticket.price ? formatCurrency(ticket.price, ' ', '.', '', 'руб.') : 'Беплатно'
		}));
	}
	/**
	 *
	 * @return {TicketModal}
	 */
	TicketModal.prototype.render = function(){
		this.__render({
			width: this.width,
			content_classes: [__C.CLASSES.MODAL_STATES.NO_PADDING]
		});
		
		return this;
	};
	/**
	 *
	 * @return {TicketModal}
	 */
	TicketModal.prototype.show = function(){
		var self = this;
		
		if (!this.is_ticket_exists) {
			this.ticket.fetchTicket(new Fields('created_at', 'number', 'ticket_type', {
				order: {
					fields: new Fields('created_at')
				},
				event: {
					fields: new Fields('dates', 'is_same_time', 'image_horizontal_medium_url', 'location')
				}
			})).done(function() {
				self.is_ticket_exists = true;
				self.__show();
			});
		} else {
			this.__show();
		}
		
		return this;
	};
	
	return TicketModal;
}()));