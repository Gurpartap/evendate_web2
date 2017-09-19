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
	 * @param {boolean} [is_hideable]
	 *
	 * @constructor
	 * @constructs AuthModal
	 */
	function AuthModal(redirect_to, is_hideable) {
		AbstractModal.call(this);
		this.content = tmpl('modal-auth-content', {
			heading: 'Войдите через социальную сеть, чтобы совершить это действие'
		});
		this.redirect_to = redirect_to;
		
		if (is_hideable === false) {
			this.hide = function() {};
		}
	}
	
	/**
	 *
	 * @return {AuthModal}
	 */
	AuthModal.prototype.render = function(props) {
		this.__render({
			classes: [__C.CLASSES.FLOATING_MATERIAL, __C.CLASSES.MODAL_STATES.SIZE.TINY],
			content_classes: [__C.CLASSES.ALIGN.CENTER]
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
				var network = $(this).data('auth_network');
				
				if (window.yaCounter32442130) {
					window.yaCounter32442130.reachGoal(network.toUpperCase() + 'AuthStart');
				}
				
				if (self.redirect_to) {
					try {
						window.localStorage.setItem('redirect_after_auth', self.redirect_to);
					} catch (e) {}
				}
				
				if (isNotDesktop() && !__APP.IS_WIDGET) {
					window.location.href = __APP.AUTH_URLS[network];
				} else {
					window.open(__APP.AUTH_URLS[network], network.toUpperCase() + '_AUTH_WINDOW', 'status=1,toolbar=0,menubar=0&height=500,width=700');
				}
				e.preventDefault();
			});
		});
		
		this.__init();
		
		bindRippleEffect(this.modal);
		
		return this;
	};
	
	
	return AuthModal;
}()));