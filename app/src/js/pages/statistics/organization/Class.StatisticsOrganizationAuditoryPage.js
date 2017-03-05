/**
 * @requires Class.StatisticsOrganizationPage.js
 */
/**
 *
 * @class StatisticsOrganizationAuditoryPage
 * @extends StatisticsOrganizationPage
 */
StatisticsOrganizationAuditoryPage = extending(StatisticsOrganizationPage, (function() {
	/**
	 *
	 * @param {(string|number)} org_id
	 * @constructor
	 * @constructs StatisticsOrganizationAuditoryPage
	 */
	function StatisticsOrganizationAuditoryPage(org_id) {
		StatisticsOrganizationPage.apply(this, arguments);
	}
	
	StatisticsOrganizationAuditoryPage.prototype.render = function() {};
	
	return StatisticsOrganizationAuditoryPage;
}()));