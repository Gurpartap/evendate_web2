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
	 *
	 * @constructor
	 * @constructs OrderAppInspector
	 *
	 * @property {OneOrder} order
	 *
	 */
	function OrderAppInspector(order) {
		
		this.order = order;
		this.title = 'Заказ ' + formatTicketNumber(order.number);
		this.$content = tmpl('order-app-inspector', {
			orderer: AbstractAppInspector.build.avatarBlock(order.user),
			status_block: __APP.BUILD.orderStatusBlock(order.status_type_code),
			tickets_title: AbstractAppInspector.build.title('Билеты'),
			tickets: AbstractAppInspector.build.tickets(order.tickets),
			registration_form_title: AbstractAppInspector.build.title('Анкета регистрации')
		});
		
		AbstractAppInspector.call(this);
	}
	
	
	
	return OrderAppInspector;
}()));