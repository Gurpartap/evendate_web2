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
	 */
	function DateModel() {
		this.event_date = '';
		this.start_time = '';
		this.end_time = '';
	}
	
	return DateModel;
}()));