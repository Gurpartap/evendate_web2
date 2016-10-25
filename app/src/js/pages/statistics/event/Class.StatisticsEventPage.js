/**
 * @requires ../Class.StatisticsPage.js
 */
/**
 *
 * @constructor
 * @augments StatisticsPage
 * @param {(string|number)} event_id
 */
function StatisticsEventPage(event_id) {
	StatisticsPage.apply(this, arguments);
	this.id = event_id;
	this.event = new OneEvent(this.id);
}
StatisticsEventPage.extend(StatisticsPage);