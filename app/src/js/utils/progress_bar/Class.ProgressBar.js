/**
 * @requires Class.AbstractProgressBar.js
 */
/**
 *
 * @class ProgressBar
 * @extends AbstractProgressBar
 */
ProgressBar = extending(AbstractProgressBar, (function() {
	/**
	 *
	 * @param {number} [overall]
	 * @param {number} [number]
	 * @param {buildProps} [options]
	 *
	 * @constructor
	 * @constructs ProgressBar
	 *
	 * @property {Object} options
	 * @property {number} number
	 * @property {number} overall
	 * @property {number} percentage
	 * @property {jQuery} $strip
	 */
	function ProgressBar(overall, number, options) {
		AbstractProgressBar.call(this, (function(options) {
			var _options = Object.assign({}, options);
			
			_options.dataset = setDefaultValue(options.dataset, {});
			_options.dataset[AbstractProgressBar.STRINGS.NUMBER] = number || 0;
			_options.dataset[AbstractProgressBar.STRINGS.OVERALL] = overall || 0;
			
			return _options;
		}(options)));
		
		this.number = parseInt(number);
		this.overall = parseInt(overall);
		
		Object.defineProperty(this, 'percentage', {
			get: function() {
				
				return (this.number / this.overall) * 100;
			},
			set: function(val) {
				
				return (parseFloat(val) * this.overall) / 100;
			}
		});
		this.__setWidth();
	}
	
	/**
	 *
	 * @param {number} number
	 */
	ProgressBar.prototype.set = function(number) {
		this.number = parseInt(number);
		
		this.attr('data-' + AbstractProgressBar.STRINGS.NUMBER, this.number);
		this.__setWidth();
	};
	
	/**
	 *
	 * @param {number} max
	 */
	ProgressBar.prototype.setMax = function(max) {
		this.attr('data-' + AbstractProgressBar.STRINGS.OVERALL, max);
		this.overall = parseFloat(max);
		this.__setWidth();
	};
	
	return ProgressBar;
}()));