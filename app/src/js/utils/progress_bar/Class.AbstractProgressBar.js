/**
 *
 * @class AbstractProgressBar
 * @extends jQuery
 */
AbstractProgressBar = extendingJQuery((function() {
	/**
	 *
	 * @param {buildProps} [options]
	 *
	 * @constructor
	 * @constructs AbstractProgressBar
	 *
	 * @property {Object} options
	 * @property {number} percentage
	 * @property {jQuery} $strip
	 */
	function AbstractProgressBar(options) {
		options = setDefaultValue(options, {});
		
		jQuery.fn.init.call(this, tmpl('progress-bar', Builder.normalizeBuildProps(options)));
		
		this.percentage = 0;
		this.options = options;
		this.$strip = this.find('.ProgressBarComplete');
		
		this.data('instance', this);
	}
	
	AbstractProgressBar.STRINGS = {
		NUMBER: 'abs_number',
		OVERALL: 'abs_of',
		PERCENTAGE: 'percentage'
	};
	
	AbstractProgressBar.MODIFICATORS = {
		SIZE: {
			TALL: '-size_tall'
		},
		WITH_LABEL: '-with_label'
	};
	/**
	 *
	 * @protected
	 */
	AbstractProgressBar.prototype.__setWidth = function() {
		if (this.percentage === 100) {
			this.addClass(__C.CLASSES.COLORS.ACCENT);
		} else {
			this.removeClass(__C.CLASSES.COLORS.ACCENT);
		}
		
		return this.$strip.width( Math.roundTo(this.percentage, 3) + '%' );
	};
	
	AbstractProgressBar.prototype.set = function() {};
	
	return AbstractProgressBar;
}()));