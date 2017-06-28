/**
 * @requires ../Class.AbstractModal.js
 */
/**
 * @class PreviewRegistrationModal
 * @extends AbstractModal
 */
PreviewRegistrationModal = extending(AbstractModal, (function() {
	
	/**
	 *
	 * @param {OneEvent} event
	 * @constructor
	 * @constructs PreviewRegistrationModal
	 */
	function PreviewRegistrationModal(event) {
		AbstractModal.call(this);
		this.event = event;
		this.title = 'Регистрация';
	}
	/**
	 *
	 * @return {PreviewRegistrationModal}
	 */
	PreviewRegistrationModal.prototype.render = function() {
		var self = this;
		
		this.__render({
			classes: ['material', '-floating'],
			width: 400,
			content: tmpl('modal-registration-content', {
				modal_id: this.id,
				required_star: tmpl('required-star'),
				event_title: this.event.title,
				fields: $.makeSet(this.event.registration_fields.map(self.buildRegistrationField.bind(self)))
			})
		});
		
		return this;
	};
	/**
	 *
	 * @return {PreviewRegistrationModal}
	 */
	PreviewRegistrationModal.prototype.init = function() {
		this.content.find('.RegisterButton').prop('disabled', true);
		initSelect2(this.content.find('.ToSelect2'), {
			dropdownCssClass: 'form_select2_drop form_select2_drop_no_search'
		});
		this.__init();
		
		return this;
	};
	/**
	 *
	 * @param {(RegistrationFieldModel|RegistrationSelectFieldModel)} field
	 * @return {jQuery}
	 */
	PreviewRegistrationModal.prototype.buildRegistrationField = function(field) {
		var self = this;
		
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
					id: 'registration_form_' + self.id + '_' + field.uuid,
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
					id: 'registration_form_' + self.id + '_' + field.uuid,
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
	
	return PreviewRegistrationModal;
}()));