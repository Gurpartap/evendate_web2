/**
 * @requires Class.StatisticsOrganizationPage.js
 */
/**
 *
 * @constructor
 * @augments StatisticsOrganizationPage
 * @param {(string|number)} org_id
 */
function StatisticsOrganizationEventsPage(org_id) {
	StatisticsOrganizationPage.apply(this, arguments);
}
StatisticsOrganizationEventsPage.extend(StatisticsOrganizationPage);

StatisticsOrganizationEventsPage.prototype.render = function() {};