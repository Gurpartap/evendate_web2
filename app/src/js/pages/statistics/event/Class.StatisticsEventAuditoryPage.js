/**
 * @requires Class.StatisticsEventPage.js
 */
/**
 *
 * @class StatisticsEventAuditoryPage
 * @extends StatisticsEventPage
 */
StatisticsEventAuditoryPage = extending(StatisticsEventPage, (function() {
	/**
	 *
	 * @constructor
	 * @constructs StatisticsEventAuditoryPage
	 * @param {(string|number)} event_id
	 */
	function StatisticsEventAuditoryPage(event_id) {
		StatisticsEventPage.apply(this, arguments);
	}
	
	StatisticsEventAuditoryPage.prototype.render = function() {};
	
	return StatisticsEventAuditoryPage;
}()));