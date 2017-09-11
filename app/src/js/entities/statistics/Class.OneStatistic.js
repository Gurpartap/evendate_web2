/**
 * @requires Class.OneAbstractStatistic.js
 */
/**
 *
 * @class OneStatistic
 * @extends OneAbstractStatistic
 */
OneStatistic = extending(OneAbstractStatistic, (function() {
	/**
	 *
	 * @constructor
	 * @constructs OneStatistic
	 *
	 * @property {?number} value
	 * @property {?timestamp} time_value
	 */
	function OneStatistic() {
		OneAbstractStatistic.call(this);
	}
	
	return OneStatistic;
}()));