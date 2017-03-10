/**
 * @requires Class.StatisticsEventPage.js
 */
/**
 *
 * @class StatisticsEventPromotionPage
 * @extends StatisticsEventPage
 */
StatisticsEventPromotionPage = extending(StatisticsEventPage, (function() {
	/**
	 *
	 * @constructor
	 * @constructs StatisticsEventPromotionPage
	 * @param {(string|number)} event_id
	 */
	function StatisticsEventPromotionPage(event_id) {
		StatisticsEventPage.apply(this, arguments);
	}
	
	StatisticsEventPromotionPage.prototype.render = function() {};
	
	return StatisticsEventPromotionPage;
}()));