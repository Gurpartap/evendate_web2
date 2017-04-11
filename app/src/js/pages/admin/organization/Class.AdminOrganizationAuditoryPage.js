/**
 * @requires Class.AdminOrganizationPage.js
 */
/**
 *
 * @class AdminOrganizationAuditoryPage
 * @extends AdminOrganizationPage
 */
AdminOrganizationAuditoryPage = extending(AdminOrganizationPage, (function() {
	/**
	 *
	 * @param {(string|number)} org_id
	 * @constructor
	 * @constructs AdminOrganizationAuditoryPage
	 */
	function AdminOrganizationAuditoryPage(org_id) {
		AdminOrganizationPage.apply(this, arguments);
	}
	
	AdminOrganizationAuditoryPage.prototype.render = function() {};
	
	return AdminOrganizationAuditoryPage;
}()));