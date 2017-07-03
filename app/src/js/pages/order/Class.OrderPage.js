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
	 */
	function OrderPage(event_id) {
		var self = this;
		
		Page.call(this);
		this.event = new OneEvent(event_id);
		this.event_fields = EventPage.fields.copy().add(
			'ticketing_locally',
			'registration_locally', {
				ticket_types: {
					fields: new Fields('price')
				}
			}
		);
		
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
	 * @param {(RegistrationFieldModel|RegistrationSelectFieldModel)} field
	 * @return {jQuery}
	 */
	OrderPage.buildRegistrationField = function(field) {
		switch (field.type) {
			case RegistrationFieldModel.TYPES.SELECT: {
				
				return (function(props, values) {
					
					return tmpl('form-unit', Builder.normalizeBuildProps($.extend(true, {}, props, {
						label: tmpl('label', Builder.normalizeBuildProps({
							id: props.id,
							label: props.label
						})),
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
					})));
				}({
					id: 'registration_form_' + field.uuid,
					name: field.uuid,
					unit_classes: ['Registration' + field.type.toCamelCase('_') + 'Field'],
					classes: [
						'form_select2',
						'ToSelect2'
					],
					label: $('<span>'+ field.label +'</span>').add((field.required ? tmpl('required-star') : $())),
					required: field.required
				}, field.values instanceof Array ? field.values : []));
			}
			case RegistrationFieldModel.TYPES.SELECT_MULTI: {
				
				return (function(props, values) {
					
					return tmpl('form-unit', Builder.normalizeBuildProps($.extend(true, {}, props, {
						unit_classes: props.classes,
						label: tmpl('label', Builder.normalizeBuildProps({
							id: props.id + '_label',
							label: props.label
						})),
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
				}({
					id: 'registration_form_' + field.uuid,
					type: 'checkbox',
					name: field.uuid,
					classes: ['Registration' + field.type.toCamelCase('_') + 'Field'],
					label: $('<span>'+ field.label +'</span>').add((field.required ? tmpl('required-star') : $())),
					required: field.required
				}, field.values instanceof Array ? field.values : []));
			}
			default: {
				
				return __APP.BUILD.formUnit({
					id: 'registration_form_' + this.id + '_' + field.uuid,
					type: field.type === RegistrationFieldModel.TYPES.EXTENDED_CUSTOM ? 'textarea' : field.type,
					name: field.uuid,
					classes: ['Registration' + field.type.toCamelCase('_') + 'Field'],
					label: $('<span>'+ field.label +'</span>').add((field.required ? tmpl('required-star') : $())),
					placeholder: field.label,
					required: field.required,
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
				});
			}
		}
	};
	
	OrderPage.prototype.init = function() {
		bindControlSwitch(this.$wrapper);
		initSelect2(this.$wrapper.find('.ToSelect2'), {
			dropdownCssClass: 'form_select2_drop form_select2_drop_no_search'
		});
	};
	
	OrderPage.prototype.preRender = function() {
		var common_main_button_props = {
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
						quantity_input: '',
						description: ticket_type.comment,
						type_price: ticket_type.price,
						sum_price: 0
					};
				})),
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
		this.preRender();
		
		this.$wrapper.html(tmpl('order-page', this.render_vars));
		
		this.init();
	};
	
	return OrderPage;
}()));