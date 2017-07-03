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
		Page.call(this);
		this.event = new OneEvent(event_id);
	}
	
	OrderPage.prototype.fetchData = function() {
		
		return this.fetching_data_defer = this.event.fetchEvent(EventPage.fields);
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
	
	};
	
	OrderPage.prototype.preRender = function() {
		var common_main_button_props = {
			classes: ['MainActionButton']
		};
		
		this.render_vars.title = (event.ticketing_locally ? 'Заказ билетов на событие ' : 'Регистрация на событие ') + this.event.title;
		if (this.event.ticketing_locally) {
			this.render_vars.tickets_selling = tmpl('order-tickets-selling', {
				ticket_types: tmpl('order-ticket-type'),
				overall_price: null
			});
		}
		if (this.event.registration_locally) {
			this.render_vars.registration = tmpl('order-registration', {
				registration_fields: OrderPage.buildRegistrationField.apply(this, this.event.registration_fields)
			});
		}
		this.render_vars.main_action_button = event.ticketing_locally ? __APP.BUILD.button($.extend(true, {}, common_main_button_props, {
			title: 'Заплатить через Яндекс'
		})) : __APP.BUILD.button($.extend(true, {}, common_main_button_props, {
			title: 'Зарегистрироваться'
		}));
	};
	
	OrderPage.prototype.render = function() {
		
		this.$wrapper.html(tmpl('order-page', this.render_vars));
		
		this.init();
	};
	
	return OrderPage;
}()));