/**
 * @requires Class.AbstractModal.js
 */
/**
 *
 * @class BitcoinModal
 * @extends AbstractModal
 */
BitcoinModal = extending(AbstractModal, (function() {
	/**
	 *
	 * @param {(OneEvent|number)} event
	 * @param {(OneOrder|string)} order
	 *
	 * @constructor
	 * @constructs BitcoinModal
	 */
	function BitcoinModal(event, order) {
		var deferreds = [];
		
		AbstractModal.call(this);
		
		this.title = 'Оплата через Bitcoin';
		
		this.event = new OneEvent();
		this.order = new OneOrder();
		this.fetching_promise = $.Deferred().promise();
		this.render_deferred = $.Deferred();
		
		if (event instanceof OneEvent) {
			this.event.setData(event);
		} else if (typeof event === 'number') {
			this.event.id = event;
		}
		
		if (order instanceof OneOrder) {
			this.order.setData(order);
		} else if (typeof order === 'string') {
			this.order.event_id = this.event.id;
			this.order.uuid = order;
		}
		
		this.address = null;
		this.amount = null;
		
		
		deferreds.push(this.order.fetchBitcoinData());
		
		if (empty(event) || typeof event === 'number') {
			deferreds.push(this.event.fetchEvent());
		}
		if (empty(order) || typeof order === 'string') {
			deferreds.push(this.order.fetchOrder());
		}
		
		this.fetching_promise = __APP.SERVER.multipleAjax.apply(__APP.SERVER, deferreds);
		
	}
	
	/**
	 *
	 * @param props
	 */
	BitcoinModal.prototype.render = function(props) {
		var self = this;
		
		this.fetching_promise.done(function(bitcoin_data) {
			self.amount = bitcoin_data.amount;
			self.address = bitcoin_data.address;
			
			self.content = tmpl('modal-bitcoin-content', {
				order_number: formatTicketNumber(self.order.number),
				ticket_types: tmpl('modal-bitcoin-ticket-type-row', []),
				event_id: self.event.id,
				order_uuid: self.order.uuid,
				bitcoin_amount: self.amount,
				bitcoin_address: self.address
			});
			
			self.__render({
				classes: [__C.CLASSES.FLOATING_MATERIAL],
				width: 480,
				content_classes: [__C.CLASSES.MODAL_STATES.NO_PADDING],
				footer_buttons: __APP.BUILD.button({
					classes: [
						__C.CLASSES.COLORS.MARGINAL,
						__C.CLASSES.HOOKS.CLOSE_MODAL,
						__C.CLASSES.HOOKS.RIPPLE
					],
					title: 'Готово'
				})
			});
			
			self.render_deferred.resolve();
		});
		
		return this;
	};
	
	BitcoinModal.prototype.show = function() {
		var self = this;
		
		this.render();
		
		this.render_deferred.done(function() {
			self.__show();
		});
		
		return this;
	};
	
	return BitcoinModal;
}()));