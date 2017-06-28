/**
 * @requires Class.AbstractModal.js
 */
/**
 * @class BuyTicketsModal
 * @extends AbstractModal
 */
BuyTicketsModal = extending(AbstractModal, (function() {
	/**
	 *
	 * @param {OneEvent} event
	 *
	 * @constructor
	 * @constructs BuyTicketsModal
	 */
	function BuyTicketsModal(event) {
		AbstractModal.call(this);
		this.event = event;
		this.title = 'Покупка билета';
	}
	
	/**
	 *
	 * @return {BuyTicketsModal}
	 */
	BuyTicketsModal.prototype.render = function() {
		this.__render({
			classes: [__C.CLASSES.FLOATING_MATERIAL],
			width: 450,
			content: tmpl('modal-buy-tickets-content', {
			
			})
		});
		
		return this;
	};
	/**
	 *
	 * @return {BuyTicketsModal}
	 */
	BuyTicketsModal.prototype.init = function() {
		var self = this;
		
		
		return this;
	};
	
	
	return BuyTicketsModal;
}()));