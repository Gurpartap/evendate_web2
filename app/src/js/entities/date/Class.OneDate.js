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