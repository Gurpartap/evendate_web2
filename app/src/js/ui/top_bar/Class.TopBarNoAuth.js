/**
 * @requires Class.AbstractTopBar.js
 */
/**
 * @class
 * @extends AbstractTopBar
 */
TopBarNoAuth = extending(AbstractTopBar, (function () {
	/**
	 *
	 * @constructor
	 * @constructs TopBarNoAuth
	 */
	function TopBarNoAuth() {
		AbstractTopBar.call(this);
	}
	
	TopBarNoAuth.prototype.init = function () {
		this.$main_header.find('.LoginButton').on('click', function() {
			cookies.removeItem('auth_command');
			cookies.removeItem('auth_entity_id');
			(new AuthModal(location.href)).show();
		});
		AbstractTopBar.prototype.init.call(this);
	};
	
	return TopBarNoAuth;
}()));