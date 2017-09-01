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
				var network = $(this).data('auth_network'),
					parsed_url,
					parsed_redirect,
					redirect_query,
					query,
					url;
				
				
				if (window.yaCounter32442130) {
					window.yaCounter32442130.reachGoal(network.toUpperCase() + 'AuthStart');
				}
				
				if (self.redirect_to) {
					parsed_url = parseUri(__APP.AUTH_URLS[network]);
					parsed_redirect = parseUri(decodeURIComponent(parsed_url.queryKey['redirect_uri']));
					
					query = Object.keys(parsed_url.queryKey).reduce(function(query, key) {
						if (key !== 'redirect_uri') {
							query.push(key + '=' + parsed_url.queryKey[key]);
						}
						
						return query;
					}, []);
					redirect_query = parsed_redirect.query.split('&');
					redirect_query.push('redirect_to=' + self.redirect_to);
					
					query.push('redirect_uri=' + encodeURIComponent(parsed_redirect.wo_query + '?' + redirect_query.join('&')));
					
					url = parsed_url.wo_query + '?' + query.join('&');
				} else {
					url = __APP.AUTH_URLS[network];
				}
				
				if (isNotDesktop()) {
					window.location.href = url;
				} else {
					window.open(url, network.toUpperCase() + '_AUTH_WINDOW', 'status=1,toolbar=0,menubar=0&height=500,width=700');
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