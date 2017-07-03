/**
 *
 * @class DropDown
 * @extends jQuery
 */
DropDown = extendingJQuery((function() {
	/**
	 * @typedef {object} DropDownOptions
	 * @property {?(string|number)} width
	 * @property {?object} position
	 * @property {?(string|number)} position.x
	 * @property {?(string|number)} position.y
	 */
	/**
	 *
	 * @param {string} dropdown_id
	 * @param {string} title
	 * @param {object} [build_props]
	 * @param {Array<string>} [build_props.classes]
	 * @param {Object<string, string>} [build_props.attributes]
	 * @param {Object<string, string>} [build_props.dataset]
	 * @param {DropDownOptions} [options]
	 * @param {object} [dropdown_variables]
	 *
	 * @constructor
	 * @constructs DropDown
	 *
	 * @property {DropDownOptions} options
	 * @property {jQuery} dropdown
	 */
	function DropDown(dropdown_id, title, build_props, options, dropdown_variables) {
		this.options = options || {};
		
		build_props = Builder.normalizeBuildProps(build_props);
		
		jQuery.fn.init.call(this, tmpl('button', {
			title: title,
			classes: build_props.classes,
			attributes: build_props.attributes
		}));
		this.data(build_props.dataset);
		
		this.dropdown = tmpl('dropdown-' + dropdown_id, dropdown_variables);
		
		this.data('instance', this);
	}
	
	DropDown.prototype.initiate = function() {
		var self = this;
		
		this.addClass(__C.CLASSES.HOOKS.HANDLED + __C.CLASSES.HOOKS.DROPDOWN_BUTTON);
		
		$('body').append(this.dropdown).one('Page:change/start', function() {
			self.destroy();
		});
		
		this.on('click.OpenDropDown', function() {
			self.openDropdown();
		});
	};
	
	DropDown.prototype.openDropdown = function() {
		var self = this,
			button_pos = this.offset();
		
		this.dropdown.addClass(__C.CLASSES.SHOW);
		this.addClass('-dropdown_active');
		
		if (!empty(this.options.width)) {
			if (this.options.width === 'self') {
				this.dropdown.width(this.outerWidth());
			} else if (isFinite(this.options.width) || isPercentageString(this.options.width)) {
				this.dropdown.width(this.options.width);
			}
		}
		
		if (!empty(this.options.position)) {
			if (!empty(this.options.position.x)) {
				this.dropdown.css('left', (function(pos, left_position, button_width, dropdow_width) {
					if (pos === 'center') {
						
						return (left_position + button_width / 2) - dropdow_width / 2;
					} else if (isFinite(pos)) {
						
						return (left_position + button_width) + pos;
					}
				}(this.options.position.x, button_pos.left, this.outerWidth(), this.dropdown.outerWidth())));
			}
			
			if (!empty(this.options.position.y)) {
				this.dropdown.css('top', (function(pos, top_position, button_height, dropdow_height) {
					if (pos === 'center') {
						
						return (top_position + button_height / 2) - dropdow_height / 2;
					} else if (isFinite(pos)) {
						
						return (top_position + button_height) + pos;
					}
				}(this.options.position.y, button_pos.top, this.outerHeight(), this.dropdown.outerHeight())));
			}
		}
		
		$('body').on('mousedown.CloseDropdown', function(e) {
			if (!$(e.target).closest(self.dropdown).length) {
				self.closeDropdown();
			}
		});
		
		$(document).on('keyup.CloseDropdown', function(e) {
			if (isKeyPressed(e, __C.KEY_CODES.ESC)) {
				self.closeDropdown();
			}
		});
	};
	
	DropDown.prototype.closeDropdown = function() {
		$('body').off('mousedown.CloseDropdown');
		$(document).off('keyup.CloseDropdown');
		this.dropdown.removeClass(__C.CLASSES.SHOW);
		this.removeClass('-dropdown_active');
	};
	
	DropDown.prototype.destroy = function() {
		this.closeDropdown();
		this.dropdown.remove();
		this.remove();
	};
	
	
	return DropDown;
}()));