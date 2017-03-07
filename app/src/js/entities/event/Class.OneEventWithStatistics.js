/**
 * @requires Class.OneEvent.js
 */
/**
 *
 * @class OneEventWithStatistics
 * @extends OneEvent
 */
OneEventWithStatistics = extending(OneEvent, (function() {
	/**
	 *
	 * @param {(string|number)} [event_id]
	 * @param {boolean} [is_loading_continuous]
	 * @constructor
	 * @constructs OneEventWithStatistics
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
	
	return OneEventWithStatistics;
}()));