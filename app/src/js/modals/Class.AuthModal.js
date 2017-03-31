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
	 *
	 * @constructor
	 * @constructs AuthModal
	 */
	function AuthModal(redirect_to) {
		AbstractModal.call(this);
		this.content = tmpl('modal-auth-content', {
			heading: 'Войдите через социальную сеть, чтобы совершить это действие'
		});
		this.redirect_to = redirect_to;
	}
	
	/**
	 *
	 * @return {AuthModal}
	 */
	AuthModal.prototype.render = function() {
		this.__render({
			classes: ['-size_tiny'],
			content_classes: ['-align_center']
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
				var network = $(this).data('auth_network'),
					url = __APP.AUTH_URLS[network];
				
				if (yaCounter32442130) {
					yaCounter32442130.reachGoal(network.toUpperCase() + 'AuthStart');
				}
				url = url + (url.indexOf('?') ? '&' : '?') + 'redirect_to=' + encodeURIComponent(self.redirect_to);
				if (isNotDesktop()) {
					window.location.href = url;
				} else {
					window.open(url, network.toUpperCase() + '_AUTH_WINDOW', 'status=1,toolbar=0,menubar=0&height=500,width=700');
				}
				e.preventDefault();
			});
		});
		
		bindRippleEffect(this.modal);
		
		return this;
	};
	
	
	return AuthModal;
}()));