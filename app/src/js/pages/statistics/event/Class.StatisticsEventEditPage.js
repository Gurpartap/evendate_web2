/**
 * @requires Class.StatisticsEventPage.js
 */
/**
 *
 * @constructor
 * @augments StatisticsEventPage
 * @param {(string|number)} event_id
 */
function StatisticsEventEditPage(event_id) {
	StatisticsEventPage.apply(this, arguments);
}
StatisticsEventEditPage.extend(StatisticsEventPage);

StatisticsEventEditPage.prototype.render = function() {};