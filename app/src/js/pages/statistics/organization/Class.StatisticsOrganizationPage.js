/**
 * @requires ../Class.StatisticsPage.js
 */
/**
 * @abstract
 * @class StatisticsOrganizationPage
 * @extends StatisticsPage
 */
StatisticsOrganizationPage = extending(StatisticsPage, (function() {
	/**
	 *
	 * @param {(string|number)} org_id
	 * @constructor
	 * @constructs StatisticsOrganizationPage
	 */
	function StatisticsOrganizationPage(org_id) {
		StatisticsPage.apply(this);
		this.id = org_id;
		this.organization = new OneOrganization(this.id);
		this.with_header_tabs = true;
	}
	
	StatisticsOrganizationPage.prototype.fetchData = function() {
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
	
	StatisticsOrganizationPage.prototype.renderHeaderTabs = function(){
		__APP.renderHeaderTabs([
			{title: 'Обзор', page: '/statistics/organization/'+this.id+'/overview'},
			{title: 'События', page: '/statistics/organization/'+this.id+'/events'}
		]);
	};
	
	return StatisticsOrganizationPage;
}()));