/**
 * @requires ../Class.Page.js
 */
/**
 *
 * @class OrderPage
 */
OrderPage = extending(Page, (function() {
	/**
	 *
	 * @param {(number|string)} event_id
	 *
	 * @constructor
	 * @constructs OrderPage
	 *
	 * @property {OneEvent} event
	 * @property {Fields} event_fields
	 */
	function OrderPage(event_id) {
		var self = this;
		
		Page.call(this);
		this.event = new OneEvent(event_id);
		this.event_fields = EventPage.fields.copy().add({
			ticket_types: {
				fields: new Fields(
					'comment',
					'price',
					'sell_start_date',
					'sell_end_date',
					'min_count_per_user',
					'max_count_per_user'
				)
			}
		});
		
		Object.defineProperty(this, 'page_title', {
			get: function() {
				
				return (self.event.ticketing_locally ? 'Заказ билетов на событие ' : 'Регистрация на событие ') + self.event.title;
			}
		});
	}
	
	OrderPage.prototype.fetchData = function() {
		
		return this.fetching_data_defer = this.event.fetchEvent(this.event_fields);
	};
	/**
	 *
	 * @param {RegistrationFieldModel} field
	 * @return {jQuery}
	 */
	OrderPage.buildRegistrationField = function(field) {
		var default_props = {
			id: 'registration_form_' + field.uuid,
			name: field.uuid,
			unit_classes: ['Registration' + field.type.toCamelCase('_') + 'Field'],
			label: $('<span>'+ field.label +'</span>').add((field.required ? tmpl('required-star') : $())),
			required: field.required
		};
		
		switch (field.type) {
			case RegistrationFieldModel.TYPES.SELECT: {
				
				return (function(props, values) {
					
					return tmpl('form-unit', Builder.normalizeBuildProps({
						unit_classes: props.unit_classes,
						label: tmpl('label', {
							id: props.id,
							label: props.label
						}),
						form_element: __APP.BUILD.select(
							values.map(function(value) {
								
								return {
									display_name: value.value,
									val: value.uuid || guid()
								}
							}), {
								id: props.id,
								name: props.name,
								required: props.required
							}, props.classes
						)
					}));
				}($.extend({}, default_props, {classes: ['form_select2', 'ToSelect2']}), field.values instanceof Array ? field.values : []));
			}
			case RegistrationFieldModel.TYPES.SELECT_MULTI: {
				
				return (function(props, values) {
					
					return tmpl('form-unit', Builder.normalizeBuildProps($.extend(true, {}, props, {
						unit_classes: props.classes,
						label: tmpl('label', {
							id: props.id + '_label',
							label: props.label
						}),
						form_element: __APP.BUILD.checkbox.apply(__APP.BUILD, values.map(function(value) {
							
							return {
								id: 'registration_field_value_' + (value.uuid || guid()),
								name: props.name,
								label: value.value,
								attributes: {
									value: value.uuid || guid(),
									required: props.required
								}
							};
						}))
					})));
				}($.extend({}, default_props, {type: 'checkbox'}), field.values instanceof Array ? field.values : []));
			}
			default: {
				
				return __APP.BUILD.formUnit($.extend({}, default_props, {
					type: field.type === RegistrationFieldModel.TYPES.EXTENDED_CUSTOM ? 'textarea' : field.type,
					placeholder: field.label,
					helptext: (function(type) {
						switch (type) {
							case RegistrationFieldModel.TYPES.EMAIL:
								return 'На почту Вам поступит сообщение с подтверждением регистрации';
							case RegistrationFieldModel.TYPES.FIRST_NAME:
								return 'Используйте настоящее имя для регистрации';
							case RegistrationFieldModel.TYPES.LAST_NAME:
								return 'Используйте настоящюю фамилию для регистрации';
							default:
								return '';
						}
					})(field.type)
				}));
			}
		}
	};
	
	OrderPage.prototype.disablePage = function(message) {
		var self = this;
		
		this.$wrapper.find('.OrderFormWrapper').addClass(__C.CLASSES.DISABLED).attr('disabled', true);
		
		this.$wrapper.find('.OrderPage').append(__APP.BUILD.overlayCap(tmpl('order-overlay-cap-content', {
			message: message,
			return_button: __APP.BUILD.link({
				page: '/event/' + this.event.id,
				title: 'Вернуться на страницу события',
				classes: [
					__C.CLASSES.COMPONENT.BUTTON,
					__C.CLASSES.COLORS.PRIMARY
				]
			})
		})));
	};
	
	OrderPage.prototype.init = function() {
		var self = this;
		
		bindControlSwitch(this.$wrapper);
		initSelect2(this.$wrapper.find('.ToSelect2'), {
			dropdownCssClass: 'form_select2_drop form_select2_drop_no_search'
		});
		
		this.$wrapper.find('.RegistrationFirstNameField').find('input').val(__APP.USER.first_name);
		this.$wrapper.find('.RegistrationLastNameField').find('input').val(__APP.USER.last_name);
		this.$wrapper.find('.RegistrationEmailField').find('input').val(__APP.USER.email);
		
		function countTicketTypeSum($ticket_type) {
			var $sum = $ticket_type.find('.TicketTypeSum'),
				value = $ticket_type.find('.QuantityInput').resolveInstance().value;
			
			if (value > 0) {
				$sum.removeClass(__C.CLASSES.HIDDEN);
			} else {
				$sum.addClass(__C.CLASSES.HIDDEN);
			}
			
			$ticket_type.find('.TicketTypeSumText').text($ticket_type.data('ticket_type').price * value);
		}
		
		function countTotalSum() {
			self.$wrapper.find('.TicketsOverallSum').text(Array.prototype.reduce.call(self.$wrapper.find('.TicketTypeSumText'), function(sum, ticket_type_sum) {
				
				return sum + +ticket_type_sum.innerHTML;
			}, 0));
		}
		
		this.$wrapper.find('.QuantityInput').on('QuantityInput::change', function(e, value) {
			countTicketTypeSum($(this).closest('.TicketType'));
			countTotalSum();
		});
		
		this.$wrapper.find('.TicketType').each(function() {
			countTicketTypeSum($(this));
		});
		countTotalSum();
		
		this.$wrapper.find('.MainActionButton').on('click.MakeOrder', function() {
			var $main_action_button = $(this),
				$form = self.$wrapper.find('.OrderForm');
			
			if (__APP.USER.isLoggedOut()) {
				(new AuthModal(window.location.href)).show();
			} else {
				$main_action_button.attr('disabled', true);
				if (isFormValid($form)) {
					
					self.event.makeOrder(
						self.$wrapper.find('.OrderFields').serializeForm('array').reduce(function(bundle, field) {
							if (+field.value) {
								bundle.push({
									uuid: field.name,
									count: +field.value
								});
							}
							
							return bundle;
						}, []),
						self.$wrapper.find('.RegistrationFields').serializeForm('array').map(function(field) {
							
							return {
								uuid: field.name,
								value: field.value
							};
						})
					).always(function() {
						$main_action_button.removeAttr('disabled');
					}).done(function(data) {
						if (self.event.ticketing_locally && data.sum !== 0) {
							Payment.doPayment('order-' + data.order.uuid, data.sum, window.location.origin + '/event/' + self.event.id);
						} else {
							__APP.changeState('/event/'+self.event.id);
							showNotifier({text: 'Регистрация прошла успешно', status: true});
						}
					});
				} else {
					$main_action_button.removeAttr('disabled');
				}
			}
		});
	};
	
	OrderPage.prototype.preRender = function() {
		var self = this,
			common_main_button_props = {
				classes: [
					,
					__C.CLASSES.HOOKS.RIPPLE,
					'MainActionButton',
					__C.CLASSES.SIZES.HUGE,
					__C.CLASSES.UNIVERSAL_STATES.NO_UPPERCASE
				]
			};
		
		if (this.event.ticketing_locally) {
			this.render_vars.tickets_selling = tmpl('order-tickets-selling', {
				ticket_types: tmpl('order-ticket-type', this.event.ticket_types.map(function(ticket_type) {
					
					return {
						name: ticket_type.name,
						quantity_input: new QuantityInput({
							name: ticket_type.uuid
						}, {
							min: ticket_type.min_count_per_user || 0,
							max: ticket_type.max_count_per_user || ticket_type.amount || 30
						}),
						description: ticket_type.comment,
						type_price: ticket_type.price,
						sum_price: 0
					};
				})).each(function(i) {
					$(this).data('ticket_type', self.event.ticket_types[i]);
				}),
				overall_price: 0
			});
		}
		
		if (this.event.registration_locally) {
			this.render_vars.registration = tmpl('order-registration', {
				registration_fields: $.makeSet(this.event.registration_fields.map(OrderPage.buildRegistrationField))
			});
		}
		
		this.render_vars.main_action_button = this.event.ticketing_locally ? __APP.BUILD.button($.extend(true, {}, common_main_button_props, {
			title: 'Заплатить через Яндекс',
			classes: ['-color_yandex']
		})) : __APP.BUILD.button($.extend(true, {}, common_main_button_props, {
			title: 'Зарегистрироваться',
			classes: [__C.CLASSES.COLORS.ACCENT]
		}));
	};
	
	OrderPage.prototype.render = function() {
		if (__APP.USER.isLoggedOut()) {
			return (new AuthModal(window.location.href, false)).show();
		}
		this.preRender();
		
		this.$wrapper.html(tmpl('order-page', this.render_vars));
		
		if (this.event.ticketing_locally) {
			if (!this.event.ticketing_available) {
				this.disablePage('Заказ билетов на событие невозможен');
			}
		} else {
			if (this.event.registration_locally && !this.event.registration_available) {
				this.disablePage('Регистрация на событие не доступно');
			}
		}
		
		this.init();
	};
	
	return OrderPage;
}()));