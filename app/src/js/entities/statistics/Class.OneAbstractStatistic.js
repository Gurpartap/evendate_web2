/**
 * @requires ../Class.OneEntity.js
 */
/**
 *
 * @abstract
 * @class OneAbstractStatistic
 * @extends OneEntity
 */
OneAbstractStatistic = extending(OneEntity, (function() {
	/**
	 *
	 * @constructor
	 * @constructs OneAbstractStatistic
	 *
	 * @property {?number} value
	 * @property {?timestamp} time_value
	 */
	function OneAbstractStatistic() {
		OneEntity.call(this);
		
		this.value = null;
		this.time_value = null;
	}
	
	return OneAbstractStatistic;
}()));