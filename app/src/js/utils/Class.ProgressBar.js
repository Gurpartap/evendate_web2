/**
 *
 * @class ProgressBar
 * @extends jQuery
 */
ProgressBar = extendingJQuery((function() {
	/**
	 *
	 * @param {object} data
	 * @param {number} [data.NUMBER]
	 * @param {number} [data.OVERALL]
	 * @param {number} [data.PERCENTAGE]
	 * @param {buildProps} [options]
	 *
	 * @constructor
	 * @constructs ProgressBar
	 */
	function ProgressBar(data, options) {
		var datas = {};
		
		Object.keys(ProgressBar.STRINGS).forEach(function(string) {
			if (data[string] != null) {
				datas[ProgressBar.STRINGS[string]] = data[string];
			}
		});
		jQuery.fn.init.call(this, tmpl('progress-bar', $.extend(true, Builder.normalizeBuildProps(options), {
			dataset: datas
		})));
		this.options = options;
		this.$strip = this.find('.ProgressBarComplete');
		
		this.data($.extend({
			instance: this
		}, options.dataset));
		
		if (data.NUMBER != null && data.OVERALL != null) {
			setWidth(this.$strip, (data.NUMBER / data.OVERALL) * 100);
		} else if (data.PERCENTAGE != null) {
			setWidth(this.$strip, data.PERCENTAGE);
		}
		
	}
	
	ProgressBar.STRINGS = {
		NUMBER: 'abs_number',
		OVERALL: 'abs_of',
		PERCENTAGE: 'percentage'
	};
	
	/**
	 *
	 * @param {jQuery} $obj
	 * @param {(string|number)} width
	 */
	function setWidth($obj, width) {
		$obj.width( Math.roundTo(width, 3) + ($.isNumeric(width) ? '%' : '') );
	}
	
	/**
	 *
	 * @param {(string|number)} number
	 */
	ProgressBar.prototype.set = function(number) {
		var data = this.data();
		
		if ($.isNumeric(number)) {
			this.attr('data-' + ProgressBar.STRINGS.NUMBER, number);
			this.data(ProgressBar.STRINGS.NUMBER, number);
			setWidth(this.$strip, (number / data[ProgressBar.STRINGS.OVERALL]) * 100);
		} else {
			if (data[ProgressBar.STRINGS.NUMBER] && data[ProgressBar.STRINGS.OVERALL]) {
				this.attr('data-' + ProgressBar.STRINGS.NUMBER, data[ProgressBar.STRINGS.NUMBER] = ((data[ProgressBar.STRINGS.OVERALL] * parseFloat(number) / 100) ));
				this.data(ProgressBar.STRINGS.NUMBER, data[ProgressBar.STRINGS.NUMBER]);
			} else {
				this.attr('data-' + ProgressBar.STRINGS.PERCENTAGE, data[ProgressBar.STRINGS.PERCENTAGE] = parseFloat(number));
				this.data(ProgressBar.STRINGS.PERCENTAGE, data[ProgressBar.STRINGS.PERCENTAGE]);
			}
			setWidth(this.$strip, number);
		}
	};
	/**
	 *
	 * @param {number} number
	 */
	ProgressBar.prototype.setMax = function(number) {
		var data = this.data();
		
		this.attr('data-' + ProgressBar.STRINGS.OVERALL, number);
		this.data(ProgressBar.STRINGS.OVERALL, number);
		setWidth(this.$strip, (data[ProgressBar.STRINGS.NUMBER] / number) * 100);
	};
	
	
	return ProgressBar;
}()));