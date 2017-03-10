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
			(new AuthModal()).show();
		});
		AbstractTopBar.prototype.init.call(this);
	};
	
	return TopBarNoAuth;
}()));