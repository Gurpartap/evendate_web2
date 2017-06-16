/**
 * @requires ../../entities/Class.OneEntity.js
 */
/**
 *
 * @class DateModel
 * @extends OneEntity
 */
DateModel = extending(OneEntity, (function() {
	/**
	 *
	 * @constructor
	 * @constructs DateModel
	 *
	 * @property {(string|timestamp)} event_date
	 * @property {string} start_time
	 * @property {string} end_time
	 */
	function DateModel() {
		this.event_date = '';
		this.start_time = '';
		this.end_time = '';
	}
	
	return DateModel;
}()));