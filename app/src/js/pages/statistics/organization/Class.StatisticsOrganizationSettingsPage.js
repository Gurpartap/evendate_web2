/**
 * @requires Class.StatisticsOrganizationPage.js
 */
/**
 *
 * @class StatisticsOrganizationSettingsPage
 * @extends StatisticsOrganizationPage
 */
StatisticsOrganizationSettingsPage = extending(StatisticsOrganizationPage, (function() {
	/**
	 *
	 * @param {(string|number)} org_id
	 * @constructor
	 * @constructs StatisticsOrganizationSettingsPage
	 */
	function StatisticsOrganizationSettingsPage(org_id) {
		StatisticsOrganizationPage.apply(this, arguments);
	}
	
	StatisticsOrganizationSettingsPage.prototype.render = function() {};
	
	return StatisticsOrganizationSettingsPage;
}()));