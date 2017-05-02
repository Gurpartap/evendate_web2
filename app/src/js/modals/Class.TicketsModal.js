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
	 * @param {(ExtendedTicketsCollection|Array<OneExtendedTicket>|OneExtendedTicket)} tickets
	 * @constructor
	 * @constructs TicketsModal
	 *
	 * @property {ExtendedTicketsCollection} tickets
	 * @property {string} ticket_uuid
	 * @property {boolean} is_ticket_exists
	 */
	function TicketsModal(tickets) {
		AbstractModal.call(this);
		
		if (tickets instanceof ExtendedTicketsCollection) {
			this.tickets = tickets;
		} else if (tickets instanceof Array || tickets instanceof OneExtendedTicket) {
			this.tickets = new ExtendedTicketsCollection();
			this.tickets.setData(tickets);
		} else {
			throw Error('Constructor needs instance of OneExtendedTicket class to create new instance of TicketsModal');
		}
		//this.width = 450;
	}
	/**
	 *
	 * @return {TicketsModal}
	 */
	TicketsModal.prototype.render = function(){
		var self = this;
		
		this.content = tmpl('modal-ticket-content', Builder.normalizeTicketProps(this.tickets).map(function(props, i) {
			var data = self.tickets[i].order.payed_at || self.tickets[i].created_at;
			
			props.cover_width = 450;
			props.card_classes.push('-ticket_extended', __C.CLASSES.FLOATING_MATERIAL);
			
			return $.extend(props, {
				cover_height: 253,
				number_formatted: formatTicketNumber(self.tickets[i].number),
				payed_at_formatted: (self.tickets[i].order.payed_at ? 'Куплен ' : 'Приобретен ') + moment.unix(data).format(__LOCALES.ru_RU.DATE.DATE_TIME_FORMAT),
				price_formatted: +self.tickets[i].price ? formatCurrency(self.tickets[i].price, ' ', '.', '', 'руб.') : 'Бесплатно'
			});
		}));
		
		this.__render({
			//width: this.width,
			content_classes: [__C.CLASSES.MODAL_STATES.NO_PADDING]
		});
		
		return this;
	};
	
	return TicketsModal;
}()));