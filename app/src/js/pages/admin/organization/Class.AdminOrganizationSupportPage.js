/**
 * @requires Class.AdminOrganizationPage.js
 */
/**
 *
 * @class AdminOrganizationSupportPage
 * @extends AdminOrganizationPage
 */
AdminOrganizationSupportPage = extending(AdminOrganizationPage, (function() {
	/**
	 *
	 * @param {(string|number)} org_id
	 * @constructor
	 * @constructs AdminOrganizationSupportPage
	 */
	function AdminOrganizationSupportPage(org_id) {
		AdminOrganizationPage.apply(this, arguments);
	}
	
	AdminOrganizationSupportPage.prototype.render = function() {};
	
	return AdminOrganizationSupportPage;
}()));