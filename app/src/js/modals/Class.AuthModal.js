/**
 * @requires Class.AbstractModal.js
 */
/**
 * @class
 * @extends AbstractModal
 */
AuthModal = extending(AbstractModal, (function() {
	
	function AuthModal() {
		AbstractModal.call(this);
	}
	
	return AuthModal;
}()));