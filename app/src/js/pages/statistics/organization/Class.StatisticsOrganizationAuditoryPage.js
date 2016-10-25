/**
 * @requires Class.StatisticsOrganizationPage.js
 */
/**
 *
 * @constructor
 * @augments StatisticsOrganizationPage
 * @param {(string|number)} org_id
 */
function StatisticsOrganizationAuditoryPage(org_id) {
	StatisticsOrganizationPage.apply(this, arguments);
}
StatisticsOrganizationAuditoryPage.extend(StatisticsOrganizationPage);

StatisticsOrganizationAuditoryPage.prototype.render = function() {};