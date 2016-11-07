/**
 * @requires Class.OneEvent.js
 */
/**
 *
 * @constructor
 * @augments OneEvent
 * @param {(string|number)} [event_id]
 * @param {boolean} [is_loading_continuous]
 */
function OneEventWithStatistics(event_id, is_loading_continuous) {
	OneEvent.apply(this, arguments);
	this.view = 0;
	this.view_detail = 0;
	this.fave = 0;
	this.unfave = 0;
	this.open_site = 0;
	this.notifications_sent = 0;
}
OneEventWithStatistics.extend(OneEvent);