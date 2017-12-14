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
		
		this.fetch_orders_fields = new Fields(
			'final_sum',
			'sum', {
				event: {
					fields: new Fields('dates')
				}
			}
		);
		
		this.fetch_order_fields = new Fields(
			'payment_type',
			'registration_fields', {
				event: {
					fields: new Fields(
						'accept_bitcoins',
						'location'
					)
				},
				tickets: {
					fields: new Fields(
						'ticket_type',
						'number'
					)
				}
			}
		);
		
		this.block_scroll = false;
		
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
			
			$(this).data('order_uuid', _orders[i].uuid);
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
		
		return this.fetching_data_defer = this.orders.fetch(this.fetch_orders_fields, 12, '-created_at');
	};
	/**
	 *
	 * @param {string} uuid
	 */
	MyOrdersPage.prototype.selectOrderItem = function(uuid) {
		var self = this,
			order = this.orders.getByID(uuid);
		
		if (empty(order)) {
			order = new OneOrder(uuid);
		}
		
		function renderOrder() {
			self.$detail_wrapper.html(tmpl('my-orders-order-detail-info', {
				order_number: formatTicketNumber(order.number),
				pay_info: MyOrdersPage.buildPayInfo(order),
				pay_button: (function(order) {
					var $buttons = $();
					
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
							
							$buttons = $buttons.add(__APP.BUILD.helpLink(HelpCenterConnection.ARTICLE.HOW_TO_PAY_FROM_LEGAL_ENTITY, 'Как оплатить со счета компании'));
							
							return $buttons;
						}
						case OneOrder.ORDER_STATUSES.PAYED:
						case OneOrder.ORDER_STATUSES.PAYED_LEGAL_ENTITY:
						case OneOrder.ORDER_STATUSES.WAITING_PAYMENT_LEGAL_ENTITY: {
							if (
								(order.status_type_code === OneOrder.ORDER_STATUSES.PAYED
								 && order.payment_type === OneOrder.PAYMENT_PROVIDERS.LEGAL_ENTITY_PAYMENT)
								|| order.status_type_code === OneOrder.ORDER_STATUSES.PAYED_LEGAL_ENTITY
								|| order.status_type_code === OneOrder.ORDER_STATUSES.WAITING_PAYMENT_LEGAL_ENTITY
							) {
								$buttons = __APP.BUILD.externalLink({
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
										__C.CLASSES.SIZES.WIDE
									],
									attributes: {
										target: '__blank'
									}
								});
							}
							
							if (order.payment_type === OneOrder.PAYMENT_PROVIDERS.LEGAL_ENTITY_PAYMENT) {
								$buttons = $buttons.add(__APP.BUILD.externalLink({
									title: 'Универсальный передаточный документ',
									page: '/api/v1' + OneOrder.ENDPOINT.LEGAL_ENTITY_UTD.format({
										event_id: order.event.id,
										order_uuid: order.uuid
									}),
									classes: [
										'orders_page_pay_button',
										__C.CLASSES.COMPONENT.BUTTON,
										__C.CLASSES.COLORS.FRANKLIN,
										__C.CLASSES.HOOKS.RIPPLE,
										__C.CLASSES.SIZES.WIDE
									],
									attributes: {
										target: '__blank'
									}
								}));
							}
							
							return $buttons;
						}
						default: {
							
							return '';
						}
					}
				})(order),
				event_title: AbstractAppInspector.build.title('Событие'),
				event: AbstractAppInspector.build.event(order.event),
				tickets_title: AbstractAppInspector.build.title('Билеты'),
				tickets: OneOrder.isGreenStatus(order.status_type_code) ? AbstractAppInspector.build.tickets(order.tickets, true) : 'Билетов нет'
			}));
			
			self.$registration_fields_wrapper.html(tmpl('my-orders-order-registration-fields', {
				registration_fields_title: AbstractAppInspector.build.title('Анкета'),
				registration_fields: __APP.BUILD.registrationFields(order.registration_fields)
			}));
			
			self.$detail_wrapper.find('.PayButton').on('click.Pay', function() {
				Payment.doPayment('order-' + order.uuid, order.final_sum);
			});
			
			self.$detail_wrapper.find('.LegalEntityPaymentButton').on('click.PayByLegalEntity', function() {
				__APP.changeState('/event/' + order.event.id + '/order/' + order.uuid + '/from_legal_entity');
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
		}
		
		if (!empty(order.tickets)) {
			renderOrder();
		} else {
			this.$detail_wrapper.html(__APP.BUILD.floatingLoader());
			this.$registration_fields_wrapper.html('');
			order.fetch(this.fetch_order_fields).then(function() {
				renderOrder();
			}).catch(function() {
				self.$detail_wrapper.html('');
			});
		}
	};
	/**
	 *
	 * @param {jQuery} $orders
	 *
	 * @return {jQuery}
	 */
	MyOrdersPage.prototype.bindSelectOrder = function($orders) {
		var self = this;
		
		$orders.on('click.SelectOrder', function() {
			var $this = $(this);
			
			$orders.not($this).removeClass('-item_selected');
			$this.addClass('-item_selected');
			
			self.selectOrderItem($this.data('order_uuid'));
		});
		
		return $orders;
	};
	
	MyOrdersPage.prototype.init = function() {
		var self = this,
			$orders_wrapper = this.$wrapper.find('.OrdersWrapper');
		
		$orders_wrapper.scrollbar({
			onScroll: function(y) {
				var $loader;
				
				if (y.scroll + 200 >= y.maxScroll && !self.block_scroll) {
					self.block_scroll = true;
					$loader = __APP.BUILD.loaderBlock($orders_wrapper);
					self.orders.fetch(self.fetch_orders_fields, 5, '-created_at').then(function(orders) {
						$loader.remove();
						if (orders.length) {
							self.block_scroll = false;
							self.$wrapper.find('.OrdersWrapper').append(self.bindSelectOrder(MyOrdersPage.orderItemsBuilder(orders)));
						}
					});
				}
			}
		});
		this.$wrapper.find('.Scroll').not('.OrdersWrapper').scrollbar();
		
		this.bindSelectOrder(this.$orders);
	};
	
	MyOrdersPage.prototype.render = function() {
		var parsed_uri = parseUri(location);
		
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
		
		if (parsed_uri.queryKey['uuid']) {
			this.selectOrderItem(parsed_uri.queryKey['uuid']);
		}
		
		this.init();
		
	};
	
	return MyOrdersPage;
}()));