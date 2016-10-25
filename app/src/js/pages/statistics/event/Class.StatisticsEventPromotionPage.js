/**
 * @requires Class.StatisticsEventPage.js
 */
/**
 *
 * @constructor
 * @augments StatisticsEventPage
 * @param {(string|number)} event_id
 */
function StatisticsEventPromotionPage(event_id) {
	StatisticsEventPage.apply(this, arguments);
}
StatisticsEventPromotionPage.extend(StatisticsEventPage);

StatisticsEventPromotionPage.prototype.render = function() {};