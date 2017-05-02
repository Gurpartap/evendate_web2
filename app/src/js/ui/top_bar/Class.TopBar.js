/**
 * @requires Class.AbstractTopBar.js
 */
/**
 * @class
 * @extends AbstractTopBar
 */
TopBar = extending(AbstractTopBar, (function () {
	/**
	 *
	 * @constructor
	 * @constructs TopBar
	 */
	function TopBar() {
		AbstractTopBar.call(this);
	}
	
	TopBar.prototype.init = function () {
		AbstractTopBar.prototype.init.call(this);
	};
	
	return TopBar;
}()));