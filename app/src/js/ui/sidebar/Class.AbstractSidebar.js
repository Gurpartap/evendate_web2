/**
 * @abstract
 * @class
 */
AbstractSidebar = (function () {
	/**
	 *
	 * @constructor
	 * @constructs AbstractSidebar
	 */
	function AbstractSidebar() {
		this.$sidebar = $('#main_sidebar');
		this.$subscribed_orgs = this.$sidebar.find('.SidebarOrganizationsList');
		this.$nav_items = this.$sidebar.find('.SidebarNavItem');
	}
	
	AbstractSidebar.prototype.init = function () {
		this.$sidebar.find('.SidebarNav').addClass('-items_' + this.$nav_items.not('.-hidden').length);
		this.$sidebar.find('.SidebarScroll').scrollbar();
	};
	
	AbstractSidebar.prototype.updateSubscriptions = function () {};
	/**
	 *
	 * @param {string} [pathname]
	 */
	AbstractSidebar.prototype.activateNavItem = function (pathname) {
		pathname = pathname || window.location.pathname;
		
		this.$nav_items
			.removeClass(__C.CLASSES.ACTIVE)
			.filter(function() {
				
				return pathname.indexOf(this.getAttribute('href')) === 0;
			})
			.addClass(__C.CLASSES.ACTIVE);
	};
	
	return AbstractSidebar;
}());