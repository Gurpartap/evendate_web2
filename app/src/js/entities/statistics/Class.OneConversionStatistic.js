/**
 *
 * @abstract
 * @class OneConversionStatistic
 * @extends OneAbstractStatistic
 */
OneConversionStatistic = extending(OneAbstractStatistic, (function() {
	/**
	 *
	 * @constructor
	 * @constructs OneConversionStatistic
	 *
	 * @property {?number} to
	 * @property {?number} with
	 * @property {?number} value
	 * @property {?timestamp} time_value
	 */
	function OneConversionStatistic() {
		OneAbstractStatistic.call(this);
		
		this.to = null;
		this.with = null;
	}
	
	return OneConversionStatistic;
}()));