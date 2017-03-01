/**
 * @requires Class.PreviewRegistrationModal.js
 */
/**
 * @class RegistrationModal
 * @extends PreviewRegistrationModal
 */
RegistrationModal = extending(PreviewRegistrationModal, (function() {
	
	/**
	 *
	 * @param {(string|number)} event_id
	 * @param {string} event_title
	 * @param {RegistrationFieldsCollection|Array<RegistrationFieldModel>} registration_fields
	 * @constructor
	 * @constructs RegistrationModal
	 */
	function RegistrationModal(event_id, event_title, registration_fields) {
		PreviewRegistrationModal.call(this, event_title, registration_fields);
		this.event_id = event_id;
	}
	/**
	 *
	 * @return {RegistrationModal}
	 */
	RegistrationModal.prototype.init = function() {
		
		
		this.content.find('.RegisterButton').on('click.Register', function() {
			var $form = $(this).closest('.RegistrationModalForm'),
				send_data;
			
			
			if (isFormValid($form)) {
				send_data = $form.serializeForm();
				console.log(send_data);
			}
		});
		bindRippleEffect(this.content);
		this.__init();
		
		return this;
	};
	
	return RegistrationModal;
}()));