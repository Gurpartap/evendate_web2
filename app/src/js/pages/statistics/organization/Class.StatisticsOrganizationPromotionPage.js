/**
 * @requires Class.StatisticsOrganizationPage.js
 */
/**
 *
 * @class StatisticsOrganizationPromotionPage
 * @extends StatisticsOrganizationPage
 */
StatisticsOrganizationPromotionPage = extending(StatisticsOrganizationPage, (function() {
	/**
	 *
	 * @param {(string|number)} org_id
	 * @constructor
	 * @constructs StatisticsOrganizationPromotionPage
	 */
	function StatisticsOrganizationPromotionPage(org_id) {
		StatisticsOrganizationPage.apply(this, arguments);
	}
	
	StatisticsOrganizationPromotionPage.prototype.render = function() {};
	
	return StatisticsOrganizationPromotionPage;
}()));