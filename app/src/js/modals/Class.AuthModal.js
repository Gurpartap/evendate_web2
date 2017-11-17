/**
 * @requires Class.AbstractModal.js
 */
/**
 * @class
 * @extends AbstractModal
 */
AuthModal = extending(AbstractModal, (function() {
	/**
	 *
	 * @param {string} [redirect_to]
	 * @param {object} [options]
	 *
	 * @constructor
	 * @constructs AuthModal
	 *
	 * @property {object} [options]
	 * @property {string} options.note
	 * @property {string} redirect_to
	 */
	function AuthModal(redirect_to, options) {
		AbstractModal.call(this);
		this.options = options || {};
		this.redirect_to = redirect_to;
	}
	/**
	 *
	 * @return {AuthModal}
	 */
	AuthModal.prototype.render = function(props) {
		var self = this;
		
		this.content = tmpl('modal-auth-content', (function() {
			var props = {};
			
			if (self.options.note) {
				props.note = self.options.note;
			}
			
			return props;
		}()));
		
		this.__render({
			classes: [__C.CLASSES.FLOATING_MATERIAL],
			width: 480
		});
		
		return this;
	};
	/**
	 *
	 * @return {AuthModal}
	 */
	AuthModal.prototype.init = function() {
		var self = this;
		
		this.modal.find('.AuthButton').each(function() {
			$(this).on('click', function (e) {
				__APP.USER.auth($(this).data('auth_network'), self.redirect_to);
				
				e.preventDefault();
			});
		});
		
		this.__init();
		
		bindRippleEffect(this.modal);
		bindHelpLink(this.modal);
		
		return this;
	};
	
	
	return AuthModal;
}()));