/**
 * @requires ../../data_models/date/Class.DateModel.js
 */
/**
 *
 * @class OneDate
 * @extends DateModel
 */
OneDate = extending(DateModel, (function() {
	/**
	 *
	 * @constructor
	 * @constructs OneDate
	 *
	 * @property {number} id
	 * @property {number} event_id
	 * @property {number} organization_id
	 * @property {number} events_count
	 * @property {number} favored_count
	 * @property {timestamp} event_date
	 * @property {string} start_time
	 * @property {string} end_time
	 */
	function OneDate() {
		DateModel.call(this);
		this.id = 0;
		this.event_id = 0;
		this.organization_id = 0;
		this.events_count = 0;
		this.favored_count = 0;
	}
	return OneDate;
}()));