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
	 * @param {string} event_title
	 * @param {RegistrationFieldsCollection|Array<RegistrationFieldModel>} registration_fields
	 * @constructor
	 * @constructs RegistrationModal
	 */
	function RegistrationModal(event_title, registration_fields) {
		RegistrationModal.call(this, event_title, registration_fields);
	}
	/**
	 *
	 * @return {RegistrationModal}
	 */
	RegistrationModal.prototype.init = function() {
		bindRippleEffect(this.content);
		this.__init();
		
		return this;
	};
	
	return RegistrationModal;
}()));