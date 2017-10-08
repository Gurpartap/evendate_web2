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
			'final_sum',
			'sum', {
				event: {
					fields: new Fields(
						'accept_bitcoins',
						'dates',
						'nearest_event_date',
						'is_same_time',
						'location',
						'ticketing_locally'
					)
				},
				tickets: {
					fields: new Fields(
						'ticket_type',
						'created_at',
						'number',
						'order'
					)
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
		var color = 'success',
			text = localeFromNamespace(order.status_type_code, OneOrder.EXTENDED_ORDER_STATUSES, __LOCALE.TEXTS.TICKET_STATUSES);
		
		if (OneOrder.isRedStatus(order.status_type_code)) {
			color = 'error';
		} else if (OneOrder.isYellowStatus(order.status_type_code)) {
			color = 'warning';
		}
		
		if (order.final_sum !== null && order.payed_at) {
			text = 'Оплачен '+moment.unix(order.payed_at).format(__LOCALE.DATE.DATE_TIME_FORMAT)+' — '+formatCurrency(order.final_sum)+' руб.'
		}
		
		return tmpl('my-orders-order-unit-footer', {
			text: text,
			color: color
		});
	};
	
	MyOrdersPage.prototype.fetchData = function() {
		
		return this.fetching_data_defer = this.orders.fetchAllOrders(this.fetch_order_fields);
	};
	
	MyOrdersPage.prototype.init = function() {
		var self = this,
		parsed_uri = parseUri(location),
		$selected_order = $();
		
		this.$wrapper.find('.Scroll').scrollbar();
		this.$orders.on('click.SelectOrder', function() {
			var $this = $(this),
				order = $this.data('order'),
				$tickets = AbstractAppInspector.build.tickets(order.tickets);
			
			self.$orders.not($this).removeClass('-item_selected');
			$this.addClass('-item_selected');
			
			self.$detail_wrapper.html(tmpl('my-orders-order-detail-info', {
				order_number: formatTicketNumber(order.number),
				pain_info: MyOrdersPage.buildPayInfo(order),
				pay_button: (function(order) {
					var $buttons;
					
					switch (order.status_type_code) {
						case OneOrder.ORDER_STATUSES.WAITING_FOR_PAYMENT: {
							$buttons = __APP.BUILD.button({
								title: 'Заплатить через Яндекс',
								classes: [
									'orders_page_pay_button',
									__C.CLASSES.COLORS.YANDEX,
									__C.CLASSES.HOOKS.RIPPLE,
									'PayButton',
									__C.CLASSES.SIZES.HUGE,
									__C.CLASSES.SIZES.WIDE,
									__C.CLASSES.UNIVERSAL_STATES.NO_UPPERCASE
								]
							}, {
								title: 'Оплатить через юр. лицо',
								classes: [
									'orders_page_pay_button',
									__C.CLASSES.COLORS.MARGINAL_PRIMARY,
									__C.CLASSES.TEXT_WEIGHT.LIGHTER,
									__C.CLASSES.HOOKS.RIPPLE,
									'LegalEntityPaymentButton',
									__C.CLASSES.SIZES.WIDE,
									__C.CLASSES.SIZES.BIG,
									__C.CLASSES.UNIVERSAL_STATES.NO_UPPERCASE
								]
							});
							
							if (order.event.accept_bitcoins) {
								$buttons = $buttons.add(__APP.BUILD.button({
									title: 'Заплатить через Bitcoin',
									classes: [
										'orders_page_pay_button',
										__C.CLASSES.COLORS.MARGINAL_PRIMARY,
										__C.CLASSES.TEXT_WEIGHT.LIGHTER,
										__C.CLASSES.HOOKS.RIPPLE,
										'BitcoinPaymentButton',
										__C.CLASSES.SIZES.WIDE,
										__C.CLASSES.SIZES.BIG,
										__C.CLASSES.UNIVERSAL_STATES.NO_UPPERCASE
									]
								}));
							}
							
							return $buttons;
						}
						case OneOrder.ORDER_STATUSES.PAYED_LEGAL_ENTITY:
						case OneOrder.ORDER_STATUSES.WAITING_PAYMENT_LEGAL_ENTITY: {
							
							return __APP.BUILD.externalLink({
								title: 'Договор-счет',
								page: '/api/v1' + OneOrder.ENDPOINT.LEGAL_ENTITY_CONTRACT.format({
									event_id: order.event.id,
									order_uuid: order.uuid
								}),
								classes: [
									'orders_page_pay_button',
									__C.CLASSES.COMPONENT.BUTTON,
									__C.CLASSES.COLORS.ACCENT,
									__C.CLASSES.HOOKS.RIPPLE,
									__C.CLASSES.SIZES.WIDE,
									__C.CLASSES.SIZES.HUGE
								],
								attributes: {
									target: '__blank'
								}
							});
						}
						default: {
							
							return '';
						}
					}
				})(order),
				event_title: AbstractAppInspector.build.title('Событие'),
				event: AbstractAppInspector.build.event(order.event),
				tickets_title: AbstractAppInspector.build.title('Билеты'),
				tickets: order.tickets.length ? $tickets : 'Билетов нет'
			}));
			
			$tickets.on('click.OpenTicket', function() {
				var $this = $(this),
					ticket = OneExtendedTicket.createFrom($this.data('ticket'), order.event);
				
				if (!$this.data('modal')) {
					$this.data('modal', new TicketsModal(ticket));
				}
				$this.data('modal').show();
				
			});
			
			self.$registration_fields_wrapper.html(tmpl('my-orders-order-registration-fields', {
				registration_fields_title: AbstractAppInspector.build.title('Анкета'),
				registration_fields: __APP.BUILD.registrationFields(order.registration_fields)
			}));
			
			self.$detail_wrapper.find('.PayButton').on('click.Pay', function() {
				Payment.doPayment('order-' + order.uuid, order.final_sum);
			});
			
			self.$detail_wrapper.find('.LegalEntityPaymentButton').on('click.PayByLegalEntity', function() {
				__APP.changeState('event/' + order.event.id + '/order/' + order.uuid + '/from_legal_entity');
			});
			
			self.$detail_wrapper.find('.BitcoinPaymentButton').on('click.BitcoinPayment', function() {
				var $this = $(this),
					modal = $this.data('modal');
				
				if (!modal) {
					modal = new BitcoinModal(order.event, order);
					$this.data('modal', modal);
				}
				
				modal.show();
			});
		});
		
		if (parsed_uri.queryKey['uuid']) {
			$selected_order = this.$orders.filter(function() {
				
				return $(this).data('order').uuid === parsed_uri.queryKey['uuid'];
			});
			
			if ($selected_order.length) {
				$selected_order.trigger('click.SelectOrder');
			}
		}
		
	};
	
	MyOrdersPage.prototype.render = function() {
		if (__APP.USER.isLoggedOut()) {
			var auth_modal = new AuthModal(window.location.href, {
				note: 'Войдите чтобы увидеть список ваших заказов'
			});
			
			auth_modal.is_hidable = false;
			
			return auth_modal.show();
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