/**
 * @requires Class.AbstractAppInspector.js
 */
/**
 *
 * @class OrderAppInspector
 * @extends AbstractAppInspector
 */
OrderAppInspector = extending(AbstractAppInspector, (function() {
	/**
	 *
	 * @param {OneOrder} order
	 * @param {OneEvent} event
	 *
	 * @constructor
	 * @constructs OrderAppInspector
	 *
	 * @property {OneOrder} order
	 * @property {OneEvent} event
	 *
	 */
	function OrderAppInspector(order, event) {
		var self = this;
		
		this.order = order;
		this.event = event;
		this.title = 'Заказ ' + formatTicketNumber(this.order.number);
		this.$content = tmpl('order-app-inspector', {
			orderer: AbstractAppInspector.build.avatarBlock(this.order.user),
			payment_info: (function(){
				
				switch (self.order.status_type_code) {
					case OneOrder.ORDER_STATUSES.PAYED:
					case OneOrder.ORDER_STATUSES.PAYED_LEGAL_ENTITY: {
						
						return __APP.BUILD.pairList({
							'Сумма заказа': formatCurrency(self.order.sum, ' ', '.', '', '₽'),
							'Скидка с промокода': self.order.promocode ? formatCurrency(self.order.promocode.effort, ' ', '.', '', self.order.promocode.is_fixed ? '₽' : '%') : '—',
							'Итоговая сумма': formatCurrency(self.order.final_sum, ' ', '.', '', '₽'),
							'Способ оплаты': OneOrder.PAYMENT_PROVIDERS[self.order.payment_type].toLowerCase(),
							'Комиссия за способ оплаты': formatCurrency(self.order.final_sum - self.order.shop_sum_amount, ' ', '.', '', '₽')
						});
					}
					default: {
						
						return '';
					}
				}
			})(),
			status_block: __APP.BUILD.orderStatusBlock(this.order.status_type_code),
			tickets_title: AbstractAppInspector.build.title('Билеты'),
			tickets: AbstractAppInspector.build.tickets(this.order.tickets),
			registration_form_title: AbstractAppInspector.build.title('Анкета регистрации'),
			registration_fields: __APP.BUILD.registrationFields(this.order.registration_fields),
			event_title: AbstractAppInspector.build.title('Событие'),
			event: AbstractAppInspector.build.event(this.event)
		});
		
		AbstractAppInspector.call(this);
	}
	
	
	
	return OrderAppInspector;
}()));