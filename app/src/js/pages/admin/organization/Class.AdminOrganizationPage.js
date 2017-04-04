/**
 * @requires ../Class.AdminPage.js
 */
/**
 * @abstract
 * @class AdminOrganizationPage
 * @extends AdminPage
 */
AdminOrganizationPage = extending(AdminPage, (function() {
	/**
	 *
	 * @param {(string|number)} org_id
	 * @constructor
	 * @constructs AdminOrganizationPage
	 */
	function AdminOrganizationPage(org_id) {
		AdminPage.apply(this);
		this.id = org_id;
		this.organization = new OneOrganization(this.id);
		this.with_header_tabs = true;
	}
	
	AdminOrganizationPage.prototype.fetchData = function() {
		return this.fetching_data_defer = this.organization.fetchOrganization([
			'description',
			'img_medium_url',
			'default_address',
			'staff',
			'privileges',
			'events'.appendAjaxData({
				length: 3,
				future: true,
				is_canceled: true,
				is_delayed: true,
				fields: [
					'organization_short_name',
					'public_at'
				],
				order_by: 'nearest_event_date'
			})
		]);
	};
	
	AdminOrganizationPage.prototype.renderHeaderTabs = function(){
		__APP.renderHeaderTabs([
			{title: 'Обзор', page: '/admin/organization/'+this.id+'/overview'},
			{title: 'События', page: '/admin/organization/'+this.id+'/events'},
			{title: 'Настройки', page: '/admin/organization/'+this.id+'/settings'}
		]);
	};
	
	return AdminOrganizationPage;
}()));