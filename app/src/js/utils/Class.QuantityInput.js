/**
 *
 * @class QuantityInput
 * @extends jQuery
 */
QuantityInput = extendingJQuery((function() {
	/**
	 *
	 * @param {HTMLAttributes} [attributes]
	 * @param {object} [options]
	 * @param {number} [options.max]
	 * @param {number} [options.min]
	 *
	 * @constructor
	 * @constructs QuantityInput
	 *
	 * @property {jQuery} plus
	 * @property {jQuery} input
	 * @property {jQuery} minus
	 * @property {number} value
	 * @property {object} [options]
	 * @property {number} [options.max]
	 * @property {number} [options.min]
	 */
	function QuantityInput(attributes, options) {
		options = $.extend({
			min: 0
		}, options);
		var $plus_button,
			$minus_button,
			$input,
			self = this,
			value = (options.min && options.min > 0) ? options.min : 0;
		
		$plus_button = __APP.BUILD.button({
			title: '+',
			classes: [
				'QuantityInputPlus',
				'quantity_input_button',
				__C.CLASSES.COLORS.DEFAULT,
			  __C.CLASSES.HOOKS.RIPPLE
			],
			attributes: {
				tabindex: -1
			}
		});
		
		$minus_button = __APP.BUILD.button({
			title: '–',
			classes: [
				'QuantityInputMinus',
				'quantity_input_button',
				__C.CLASSES.COLORS.DEFAULT,
				__C.CLASSES.HOOKS.RIPPLE
			],
			attributes: {
				tabindex: -1
			}
		});
		
		$input = __APP.BUILD.inputNumber($.extend({
			value: value
		}, attributes), [
			'quantity_input'
		], null, {
			min: options.min,
			max: options.max || null
		});
		
		jQuery.fn.init.call(this, tmpl('quantity-input', {
			minus_button: $minus_button,
			input: $input,
			plus_button: $plus_button
		}));
		
		this.options = options;
		
		bindRippleEffect($plus_button);
		bindRippleEffect($minus_button);
		
		this.plus = $plus_button;
		this.input = $input;
		this.minus = $minus_button;
		
		if (!empty(this.options.min) && value <= this.options.min) {
			this.input.val(this.options.min);
			this.disableMinus();
		}
		
		if (!empty(this.options.max) && value >= this.options.max) {
			this.input.val(this.options.max);
			this.disablePlus();
		}
		
		Object.defineProperty(this, 'value', {
			get: function() {
			
				return +self.input.val();
			},
			set: function(val) {
				
				return self.input.val(val);
			}
		});
		
		this.data('instance', this);
		
		this.initiate();
	}
	
	QuantityInput.prototype.activatePlus = function() {
		this.plus.removeAttr('disabled');
	};
	
	QuantityInput.prototype.disablePlus = function() {
		this.plus.attr('disabled', true);
	};
	
	QuantityInput.prototype.activateMinus = function() {
		this.minus.removeAttr('disabled');
	};
	
	QuantityInput.prototype.disableMinus = function() {
		this.minus.attr('disabled', true);
	};
	
	QuantityInput.prototype.check = function(val) {
		val = empty(val) ? this.input.val() : val;
		
		if (!empty(this.options.max) && val >= this.options.max) {
			this.disablePlus();
		} else {
			this.activatePlus();
		}
		
		if (!empty(this.options.min) && val <= this.options.min) {
			this.disableMinus();
		} else {
			this.activateMinus();
		}
	};
	
	QuantityInput.prototype.decrement = function() {
		var val = +this.input.val();
		
		this.check(val - 1);
		if (!empty(this.options.min)) {
			if (val - 1 < this.options.min) {
				return false;
			}
		}
		this.input.val(val - 1).trigger('QuantityInput::change', [val - 1, val]);
	};
	
	QuantityInput.prototype.increment = function() {
		var val = +this.input.val();
		
		this.check(val + 1);
		if (!empty(this.options.max)) {
			if (val + 1 > this.options.max) {
				return false;
			}
		}
		this.input.val(val + 1).trigger('QuantityInput::change', [val + 1, val]);
	};
	
	QuantityInput.prototype.initiate = function() {
		var self = this;
		
		this.plus.on('click.PlusQuantity', function() {
			self.increment();
		});
		
		this.minus.on('click.MinusQuantity', function() {
			self.decrement();
		});
		
		this.input.on('input', function() {
			self.input.trigger('QuantityInput::change', [self.input.val()]);
			self.check();
		}).on('change', function() {
			self.input.trigger('QuantityInput::change', [self.input.val()]);
		});
		
	};
	
	
	return QuantityInput;
}()));