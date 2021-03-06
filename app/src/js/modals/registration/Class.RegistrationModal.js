/**
 * @requires Class.PreviewRegistrationModal.js
 */
/**
 * @deprecated
 * @class RegistrationModal
 * @extends PreviewRegistrationModal
 */
RegistrationModal = extending(PreviewRegistrationModal, (function() {
	
	/**
	 *
	 * @param {OneEvent} event
	 * @constructor
	 * @constructs RegistrationModal
	 */
	function RegistrationModal(event) {
		PreviewRegistrationModal.call(this, event);
	}
	/**
	 *
	 * @return {RegistrationModal}
	 */
	RegistrationModal.prototype.init = function() {
		var self = this;
		
		this.content.find('.RegisterButton').on('click.Register', function() {
			var $register_button = $(this),
				$form = $register_button.closest('.RegistrationModalForm');
			
			$register_button.attr('disabled', true);
			if (isFormValid($form)) {
				OneEvent.registerToEvent(self.event.id, $form.serializeForm('array').map(function(field) {
					
					return {
						uuid: field.name,
						value: field.value
					};
				}))
					.then(function() {
						self.modal.trigger('registration:success');
						self.hide();
					});
			}
			$register_button.removeAttr('disabled');
		});
		this.content.find('.RegistrationFirstNameField').val(__APP.USER.first_name);
		this.content.find('.RegistrationLastNameField').val(__APP.USER.last_name);
		this.content.find('.RegistrationEmailField').val(__APP.USER.email);
		
		bindRippleEffect(this.content);
		initSelect2(this.content.find('.ToSelect2'), {
			dropdownCssClass: 'form_select2_drop form_select2_drop_no_search'
		});
		this.__init();
		
		return this;
	};
	
	return RegistrationModal;
}()));