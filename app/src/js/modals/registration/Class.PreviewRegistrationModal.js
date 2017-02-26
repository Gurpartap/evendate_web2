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
		var self = this;
		AbstractModal.call(this);
		this.title = 'Регистрация';
		this.content = tmpl('modal-registration-content', {
			modal_id: this.id,
			required_star: tmpl('required-star'),
			event_title: event_title,
			fields: $.makeSet(registration_fields.map(function(field) {
				return self.buildRegistrationField(field);
			}))
		});
	}
	/**
	 *
	 * @return {PreviewRegistrationModal}
	 */
	PreviewRegistrationModal.prototype.render = function() {
		this.__render({
			width: 400
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
		var data = {
			modal_id: this.id,
			uuid: field.uuid,
			type: field.type,
			label: field.label,
			required: field.required ? 'required' : '',
			required_star: field.required ? tmpl('required-star') : ''
		};
		
		switch (field.type) {
			case RegistrationFieldModel.TYPES.EXTENDED_CUSTOM: {
				return tmpl('modal-registration-textarea-field', data);
			}
			default: {
				data.description = (function(type) {
					switch (type) {
						case RegistrationFieldModel.TYPES.EMAIL: return 'На почту Вам поступит сообщение с подтверждением регистрации';
						case RegistrationFieldModel.TYPES.FIRST_NAME: return 'Используйте настоящее имя для регистрации';
						case RegistrationFieldModel.TYPES.LAST_NAME: return 'Используйте настоящюю фамилию для регистрации';
						default: return '';
					}
				})(field.type);
				return tmpl('modal-registration-input-field', data);
			}
		}
	};
	
	return PreviewRegistrationModal;
}()));