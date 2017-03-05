/**
 * @requires Class.StatisticsEventPage.js
 */
/**
 *
 * @class StatisticsEventEditPage
 * @extends StatisticsEventPage
 */
StatisticsEventEditPage = extending(StatisticsEventPage, (function() {
	/**
	 *
	 * @constructor
	 * @constructs StatisticsEventEditPage
	 * @param {(string|number)} event_id
	 */
	function StatisticsEventEditPage(event_id) {
		StatisticsEventPage.apply(this, arguments);
	}
	
	StatisticsEventEditPage.prototype.render = function() {};
	
	return StatisticsEventEditPage;
}()));