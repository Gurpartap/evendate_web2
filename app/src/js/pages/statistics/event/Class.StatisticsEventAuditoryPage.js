/**
 * @requires Class.StatisticsEventPage.js
 */
/**
 *
 * @constructor
 * @augments StatisticsEventPage
 * @param {(string|number)} event_id
 */
function StatisticsEventAuditoryPage(event_id) {
	StatisticsEventPage.apply(this, arguments);
}
StatisticsEventAuditoryPage.extend(StatisticsEventPage);

StatisticsEventAuditoryPage.prototype.render = function() {};