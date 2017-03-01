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
	 * @param {string} event_title
	 * @param {RegistrationFieldsCollection|Array<RegistrationFieldModel>} registration_fields
	 * @constructor
	 * @constructs PreviewRegistrationModal
	 */
	function PreviewRegistrationModal(event_title, registration_fields) {
		AbstractModal.call(this);
		this.event_id = '';
		this.title = 'Регистрация';
		this.event_title = event_title;
		this.registration_fields = registration_fields;
	}
	/**
	 *
	 * @return {PreviewRegistrationModal}
	 */
	PreviewRegistrationModal.prototype.render = function() {
		var self = this;
		this.__render({
			width: 400,
			content: tmpl('modal-registration-content', {
				modal_id: this.id,
				event_id: this.event_id,
				required_star: tmpl('required-star'),
				event_title: this.event_title,
				fields: $.makeSet(this.registration_fields.map(self.buildRegistrationField))
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
		this.__init();
		
		return this;
	};
	/**
	 *
	 * @param {RegistrationFieldModel} field
	 * @return {jQuery}
	 */
	PreviewRegistrationModal.prototype.buildRegistrationField = function(field) {
		return __APP.BUILD.formInput({
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
	};
	
	return PreviewRegistrationModal;
}()));