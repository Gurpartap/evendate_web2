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
		((window.innerHeight > 800) ? this.$sidebar.find('.SidebarOrganizationsScroll') : this.$sidebar.find('.SidebarScroll')).scrollbar({
			disableBodyScroll: true
		});
	};
	
	AbstractSidebar.prototype.updateSubscriptions = function () {};
	
	return AbstractSidebar;
}());