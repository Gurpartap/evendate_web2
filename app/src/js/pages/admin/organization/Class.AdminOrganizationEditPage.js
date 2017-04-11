/**
 * @requires Class.AdminOrganizationPage.js
 * @requires ../../organizations/Class.EditOrganizationPage.js
 */
/**
 *
 * @class AdminOrganizationEditPage
 * @extends EditOrganizationPage
 * @extends AdminOrganizationPage
 */
AdminOrganizationEditPage = extending(EditOrganizationPage, AdminOrganizationPage, (function() {
	/**
	 *
	 * @param {(string|number)} organization_id
	 *
	 * @constructor
	 * @constructs AdminOrganizationEditPage
	 */
	function AdminOrganizationEditPage(organization_id) {
		var self = this;
		
		EditOrganizationPage.call(this, organization_id);
		AdminOrganizationPage.call(this, organization_id);
		
		Object.defineProperty(this, 'page_title_obj', {
			get: function() {
				return [{
					title: 'Организации',
					page: '/admin'
				}, self.organization.short_name + ' - редактирование'];
			}
		});
	}
	
	return AdminOrganizationEditPage;
}()));

AdminOrganizationEditPage.prototype.renderHeaderTabs = AdminOrganizationPage.prototype.renderHeaderTabs;