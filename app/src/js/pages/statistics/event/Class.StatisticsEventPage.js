/**
 * @requires ../Class.StatisticsPage.js
 */
/**
 *
 * @class StatisticsEventPage
 * @extends StatisticsPage
 */
StatisticsEventPage = extending(StatisticsPage, (function() {
	/**
	 *
	 * @constructor
	 * @constructs StatisticsEventPage
	 * @param {(string|number)} event_id
	 */
	function StatisticsEventPage(event_id) {
		StatisticsPage.apply(this, arguments);
		this.id = event_id;
		this.event = new OneEvent(this.id);
	}
	
	return StatisticsEventPage;
}()));