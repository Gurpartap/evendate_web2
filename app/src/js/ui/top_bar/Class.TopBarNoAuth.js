/**
 * @requires Class.AbstractTopBar.js
 */
/**
 * @class
 * @extends AbstractTopBar
 */
var TopBarNoAuth = extending(AbstractTopBar, (function () {
	function TopBarNoAuth() {
		AbstractTopBar.call(this);
	}
	TopBarNoAuth.prototype.init = function () {
		this.$main_header.find('#user_bar').addClass(__C.CLASSES.NEW_HIDDEN);
		AbstractTopBar.prototype.init.call(this);
	};
	return TopBarNoAuth;
}()));