/**
 * @requires ../Class.Page.js
 */
/**
 *
 * @class MyOrdersPage
 * @extends Page
 */
MyOrdersPage = extending(Page, (function() {
	/**
	 *
	 * @constructor
	 * @constructs MyOrdersPage
	 */
	function MyOrdersPage() {
		Page.call(this);
		this.page_title = 'Мои заказы';
		
		this.orders = new MyOrdersCollection();
		
		this.fetch_order_fields = new Fields(
			'registration_fields',
			'sum', {
				tickets: {
					fields: new Fields('ticket_type')
				}
			}
		);
		
		this.$orders = $();
		this.$detail_wrapper = $();
		this.$registration_fields_wrapper = $();
	}
	
	/**
	 *
	 * @param {(OneExtendedOrder|Array<OneExtendedOrder>|ExtendedOrdersCollection)} orders
	 *
	 * @return {jQuery}
	 */
	MyOrdersPage.orderItemsBuilder = function(orders) {
		var _orders = orders instanceof Array ? orders : [orders];
		
		return tmpl('my-orders-order-unit', _orders.map(function(order) {
			
			return {
				order_number: formatTicketNumber(order.number),
				order_datetime: moment.unix(order.created_at).calendar(__LOCALE.DATE.CALENDAR_DATE_TIME),
				event_title: order.event.title,
				order_footer: MyOrdersPage.buildPayInfo(order)
			};
		})).each(function(i) {
			
			$(this).data('order', _orders[i]);
		});
	};
	/**
	 *
	 * @param {OneOrder} order
	 * @return {(jQuery|string)}
	 */
	MyOrdersPage.buildPayInfo = function(order) {
	
		return order.sum ? order.payed_at ? tmpl('my-orders-order-unit-paid-footer', {
			paid_at_datetime: moment.unix(order.payed_at).format(__LOCALE.DATE.DATE_TIME_FORMAT),
			formatted_price: formatCurrency(order.sum)
		}) : tmpl('my-orders-order-unit-no-paid-footer') : '';
	};
	
	MyOrdersPage.prototype.fetchData = function() {
		
		return this.fetching_data_defer = this.orders.fetchAllOrders(this.fetch_order_fields);
	};
	
	MyOrdersPage.prototype.init = function() {
		var self = this;
		
		this.$wrapper.find('.Scroll').scrollbar();
		this.$orders.on('click.SelectOrder', function() {
			var $this = $(this),
				order = $this.data('order');
			
			self.$orders.not($this).removeClass('-item_selected');
			$this.addClass('-item_selected');
			
			self.$detail_wrapper.html(tmpl('my-orders-order-detail-info', {
				order_number: formatTicketNumber(order.number),
				pain_info: MyOrdersPage.buildPayInfo(order),
				pay_button: order.event.ticketing_locally ? __APP.BUILD.button({
					title: 'Заплатить через Яндекс',
					classes: [
						'-color_yandex',
						__C.CLASSES.HOOKS.RIPPLE,
						'PayButton',
						__C.CLASSES.SIZES.HUGE,
						__C.CLASSES.UNIVERSAL_STATES.NO_UPPERCASE
					]
				}).on('click.Pay', function() {
					Payment.doPayment(order.uuid, order.sum);
				}) : '',
				event_title: AbstractAppInspector.build.title('Событие'),
				event: AbstractAppInspector.build.event(order.event),
				tickets_title: AbstractAppInspector.build.title('Билеты'),
				tickets: AbstractAppInspector.build.tickets(order.tickets)
			}));
			
			self.$registration_fields_wrapper.html(tmpl('my-orders-order-registration-fields', {
				registration_fields_title: AbstractAppInspector.build.title('Анкета'),
				registration_fields: __APP.BUILD.registrationFields(order.registration_fields)
			}));
		});
		
	};
	
	MyOrdersPage.prototype.render = function() {
		if(__APP.USER.isLoggedOut()){
			__APP.changeState('/', true, true);
			return null;
		}
		
		this.orders.sortBy('created_at');
		
		this.$wrapper.html(tmpl('my-orders-page', {
			orders: (this.$orders = MyOrdersPage.orderItemsBuilder(this.orders)),
			order_detail: __APP.BUILD.cap('Выберите заказ, чтобы посмотреть детальную информацию о ней'),
			order_registration_fields: __APP.BUILD.cap('Выберите заказ, чтобы посмотреть детальную информацию о ней')
		}));
		
		this.$detail_wrapper = this.$wrapper.find('.OrderDetailInfo');
		this.$registration_fields_wrapper = this.$wrapper.find('.OrderRegistrationFields');
		
		this.init();
		
	};
	
	return MyOrdersPage;
}()));