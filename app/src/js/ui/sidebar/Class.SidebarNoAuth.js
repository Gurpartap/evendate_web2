/**
 * @requires Class.AbstractSidebar.js
 */
/**
 * @class
 * @extends AbstractSidebar
 */
SidebarNoAuth = extending(AbstractSidebar, (function () {
	/**
	 *
	 * @constructor
	 * @constructs SidebarNoAuth
	 */
	function SidebarNoAuth() {
		AbstractSidebar.call(this);
	}
	
	SidebarNoAuth.prototype.init = function () {
		this.$sidebar.find('.SidebarOrganizationsScroll').addClass(__C.CLASSES.HIDDEN);
		AbstractSidebar.prototype.init.call(this);
	};
	
	return SidebarNoAuth;
}()));