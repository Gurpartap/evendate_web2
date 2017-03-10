/**
 * @requires Class.StatisticsOrganizationPage.js
 */
/**
 *
 * @class StatisticsOrganizationSupportPage
 * @extends StatisticsOrganizationPage
 */
StatisticsOrganizationSupportPage = extending(StatisticsOrganizationPage, (function() {
	/**
	 *
	 * @param {(string|number)} org_id
	 * @constructor
	 * @constructs StatisticsOrganizationSupportPage
	 */
	function StatisticsOrganizationSupportPage(org_id) {
		StatisticsOrganizationPage.apply(this, arguments);
	}
	
	StatisticsOrganizationSupportPage.prototype.render = function() {};
	
	return StatisticsOrganizationSupportPage;
}()));