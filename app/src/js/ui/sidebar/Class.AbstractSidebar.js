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
		this.$subscribed_orgs = $('.SidebarOrganizationsList');
	}
	
	AbstractSidebar.prototype.init = function () {
		this.$sidebar.find('.SidebarNav').addClass('-items_' + this.$sidebar.find('.SidebarNavItem').not('.-hidden').length);
		this.$sidebar.find('.SidebarScroll').scrollbar();
	};
	
	AbstractSidebar.prototype.updateSubscriptions = function () {};
	
	return AbstractSidebar;
}());