/**
 * @requires Class.StatisticsOrganizationPage.js
 */
/**
 *
 * @constructor
 * @augments StatisticsOrganizationPage
 * @param {(string|number)} org_id
 */
function StatisticsOrganizationSettingsPage(org_id) {
	StatisticsOrganizationPage.apply(this, arguments);
}
StatisticsOrganizationSettingsPage.extend(StatisticsOrganizationPage);

StatisticsOrganizationSettingsPage.prototype.render = function() {};