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
				var pairs = [];
				
				switch (self.order.status_type_code) {
					case OneOrder.ORDER_STATUSES.PAYED:
					case OneOrder.ORDER_STATUSES.PAYED_LEGAL_ENTITY: {
						pairs.push({
							key: 'Сумма заказа',
							value: formatCurrency(self.order.sum, ' ', '.', '', '₽')
						});
						
						if (self.order.promocode) {
							pairs.push({
								key: 'Промокод',
								value: self.order.promocode.code
							},  {
								key: 'Скидка с промокода',
								value: formatCurrency(self.order.promocode.effort, ' ', '.', '', self.order.promocode.is_fixed ? '₽' : '%')
							});
						}
						
						pairs.push({
							key: 'Итоговая сумма',
							value: formatCurrency(self.order.final_sum, ' ', '.', '', '₽')
						},  {
							key: 'Способ оплаты',
							value: OneOrder.PAYMENT_PROVIDERS_TEXT[self.order.payment_type].toLowerCase()
						},  {
							key: 'Комиссия за способ оплаты',
							value: formatCurrency(self.order.final_sum - self.order.shop_sum_amount, ' ', '.', '', '₽')
						});
						
						return __APP.BUILD.pairList(pairs);
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