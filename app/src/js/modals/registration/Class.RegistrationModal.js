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
					.always(function() {
						$register_button.removeAttr('disabled');
					})
					.done(function() {
						self.modal.trigger('registration:success');
						self.hide();
					});
			} else {
				$register_button.removeAttr('disabled');
			}
		});
		
		bindRippleEffect(this.content);
		this.__init();
		
		return this;
	};
	
	return RegistrationModal;
}()));