/**
 * @requires Class.AbstractProgressBar.js
 */
/**
 *
 * @class PercentageProgressBar
 * @extends AbstractProgressBar
 */
PercentageProgressBar = extending(AbstractProgressBar, (function() {
	/**
	 *
	 * @param {number} [percentage]
	 * @param {buildProps} [options]
	 *
	 * @constructor
	 * @constructs PercentageProgressBar
	 *
	 * @property {Object} options
	 * @property {number} percentage
	 * @property {jQuery} $strip
	 */
	function PercentageProgressBar(percentage, options) {
		AbstractProgressBar.call(this, (function(options) {
			var _options = Object.assign({}, options);
			
			_options.dataset = setDefaultValue(options.dataset, {});
			_options.dataset[AbstractProgressBar.STRINGS.PERCENTAGE] = percentage || 0;
			
			return _options;
		}(options)));
		
		this.percentage = parseFloat(percentage);
		this.__setWidth();
	}
	
	/**
	 *
	 * @param {number} number
	 */
	PercentageProgressBar.prototype.set = function(number) {
		this.percentage = parseFloat(number);
		this.attr('data-' + AbstractProgressBar.STRINGS.PERCENTAGE, this.percentage);
		this.__setWidth();
	};
	
	return PercentageProgressBar;
}()));