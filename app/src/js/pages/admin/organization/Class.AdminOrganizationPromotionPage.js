/**
 * @requires Class.AdminOrganizationPage.js
 */
/**
 *
 * @class AdminOrganizationPromotionPage
 * @extends AdminOrganizationPage
 */
AdminOrganizationPromotionPage = extending(AdminOrganizationPage, (function() {
	/**
	 *
	 * @param {(string|number)} org_id
	 * @constructor
	 * @constructs AdminOrganizationPromotionPage
	 */
	function AdminOrganizationPromotionPage(org_id) {
		AdminOrganizationPage.apply(this, arguments);
	}
	
	AdminOrganizationPromotionPage.prototype.render = function() {};
	
	return AdminOrganizationPromotionPage;
}()));