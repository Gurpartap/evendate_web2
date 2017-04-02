/**
 * @requires Class.AdminOrganizationPage.js
 */
/**
 *
 * @class AdminOrganizationSettingsPage
 * @extends AdminOrganizationPage
 */
AdminOrganizationSettingsPage = extending(AdminOrganizationPage, (function() {
	/**
	 *
	 * @param {(string|number)} org_id
	 * @constructor
	 * @constructs AdminOrganizationSettingsPage
	 */
	function AdminOrganizationSettingsPage(org_id) {
		AdminOrganizationPage.apply(this, arguments);
	}
	
	AdminOrganizationSettingsPage.prototype.render = function() {};
	
	return AdminOrganizationSettingsPage;
}()));