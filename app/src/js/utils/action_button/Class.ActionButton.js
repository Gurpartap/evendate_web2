/**
 *
 * @abstract
 * @class ActionButton
 * @extends jQuery
 */
ActionButton = extendingJQuery((function() {
	/**
	 *
	 * @constructor
	 * @constructs ActionButton
	 * @param {object} [options]
	 */
	function ActionButton(options) {
		options = options ? options : {};
		var self = this;
		
		this.options = $.extend(true, {
			classes: [],
			icons: null,
			colors: null,
			labels: null
		}, this.options, options);
				
		this.has_icon = options.hasOwnProperty('has_icon') ? !!options.has_icon : true;
		this.is_checked = !!options.is_checked;
		this.is_add_avatar = !!options.is_add_avatar;
		
		if (this.has_icon) {
			this.options.classes.push(this.icon_class);
		} else {
			this.options.icons = {};
		}
		
		this.options.icons = this.options.icons ? this.options.icons : {};
		this.options.colors = this.options.colors ? this.options.colors : {};
		this.options.labels = this.options.labels ? this.options.labels : {};
		
		this.classes = {};
		$.each(ActionButton.STATES, function(field, state_name) {
			self.classes[state_name] = []
				.concat(self.options.icons ? self.options.icons[state_name] : [])
				.concat(self.options.colors ? self.options.colors[state_name] : [])
				.join(' ');
		});
		
		jQuery.fn.init.call(this, __APP.BUILD.button(this.is_checked ? {
				classes: this.options.classes.concat(this.classes[ActionButton.STATES.CHECKED]).concat(this.checked_state_class ? this.checked_state_class  : []),
				title: this.options.labels[ActionButton.STATES.CHECKED]
			} : {
				classes: this.options.classes.concat(this.classes[ActionButton.STATES.UNCHECKED]),
				title: this.options.labels[ActionButton.STATES.UNCHECKED]
			}
		));
		
		this.data('instance', this);
		this.initiate();
	}
	
	/**
	 *
	 * @event ActionButton:change
	 * @type function
	 * @param {string} state
	 * @param {ActionButton} button
	 */
	/**
	 *
	 * @enum {string}
	 */
	ActionButton.STATES = {
		CHECKED: 'checked',
		UNCHECKED: 'unchecked',
		CHECKED_HOVER: 'checked_hover',
		UNCHECKED_HOVER: 'unchecked_hover'
	};
	
	/**
	 * @param {jQuery} $context
	 */
	function addAvatar($context) {
		var $wrapper = $context.closest('.'+__C.CLASSES.HOOKS.ADD_AVATAR.ANCESTOR),
			$collection = $wrapper.find('.'+__C.CLASSES.HOOKS.ADD_AVATAR.COLLECTION),
			$favored_count = $wrapper.find('.'+__C.CLASSES.HOOKS.ADD_AVATAR.QUANTITY),
			$avatars = $collection.find('.avatar'),
			amount = $avatars.length;
		
		if ($collection.data('max_amount') >= amount) {
			if ($collection.hasClass(__C.CLASSES.HOOKS.ADD_AVATAR.STATES.SHIFTED)) {
				$collection.removeClass(__C.CLASSES.HOOKS.ADD_AVATAR.STATES.SHIFTED);
				$collection.width(amount == 1 ? 0 : ($avatars.outerWidth() * (amount - 1)) - (6 * (amount - 2)));
			} else {
				$collection.addClass(__C.CLASSES.HOOKS.ADD_AVATAR.STATES.SHIFTED);
				$collection.width(($avatars.outerWidth() * amount) - (6 * (amount - 1)));
			}
		} else {
			if ($favored_count.length) {
				var current_count = parseInt($favored_count.text());
				if ($collection.hasClass(__C.CLASSES.HOOKS.ADD_AVATAR.STATES.SHIFTED)) {
					$favored_count.text(current_count - 1);
					if (current_count - 1 <= 0) {
						$favored_count.parent().addClass(__C.CLASSES.HOOKS.ADD_AVATAR.STATES.CAST);
					}
				} else {
					$favored_count.text(current_count + 1);
					$favored_count.parent().removeClass(__C.CLASSES.HOOKS.ADD_AVATAR.STATES.CAST);
				}
			}
			$collection.toggleClass(__C.CLASSES.HOOKS.ADD_AVATAR.STATES.SHIFT+' '+__C.CLASSES.HOOKS.ADD_AVATAR.STATES.SHIFTED);
		}
	}
	
	ActionButton.prototype.checked_state_class = '';
	ActionButton.prototype.icon_class = __C.CLASSES.ICON_CLASS;
	
	ActionButton.prototype.onClick = function() {};
	/**
	 * @fires ActionButton:change
	 */
	ActionButton.prototype.afterCheck = function() {
		var is_hovered = this.is(':hover');
		
		this.is_checked = true;
		this
			.removeClass(''.concat(this.classes[ActionButton.STATES.UNCHECKED_HOVER], ' ', this.classes[ActionButton.STATES.UNCHECKED]))
			.addClass(''.concat(this.classes[is_hovered ? ActionButton.STATES.CHECKED_HOVER : ActionButton.STATES.CHECKED], ' ', this.checked_state_class))
			.children('.'+__C.CLASSES.HOOKS.TEXT).text(this.options.labels[is_hovered ? ActionButton.STATES.CHECKED_HOVER : ActionButton.STATES.CHECKED])
			.trigger('ActionButton:change', [
				'checked',
				this
			]);
	};
	/**
	 * @fires ActionButton:change
	 */
	ActionButton.prototype.afterUncheck = function() {
		var is_hovered = this.is(':hover');
		
		this.is_checked = false;
		this
			.removeClass(''.concat(this.classes[ActionButton.STATES.CHECKED_HOVER], ' ', this.classes[ActionButton.STATES.CHECKED], ' ', this.checked_state_class))
			.addClass(''.concat(this.classes[is_hovered ? ActionButton.STATES.UNCHECKED_HOVER : ActionButton.STATES.UNCHECKED]))
			.children('.'+__C.CLASSES.HOOKS.TEXT).text(this.options.labels[is_hovered ? ActionButton.STATES.UNCHECKED_HOVER : ActionButton.STATES.UNCHECKED])
			.trigger('ActionButton:change', [
				'unchecked',
				this
			]);
	};
	/**
	 * @abstract
	 *
	 * @return {AbstractModal}
	 */
	ActionButton.prototype.showAuthModal = function() {
		var modal;
		
		if (!(modal = this.data('modal'))) {
			modal = new AuthModal(null, {
				note: 'Для выполнения этого действия, нужно войти через социальную сеть'
			});
			this.data('modal', modal);
		}
		
		return modal.show();
	};
	
	
	ActionButton.prototype.initiate = function() {
		var self = this;
		
		this
			.on('mouseenter.HoverActionButton', function() {
				self
					.removeClass(self.classes[self.is_checked ? ActionButton.STATES.CHECKED : ActionButton.STATES.UNCHECKED])
					.addClass(self.classes[self.is_checked ? ActionButton.STATES.CHECKED_HOVER : ActionButton.STATES.UNCHECKED_HOVER]);
				self.children('.'+__C.CLASSES.HOOKS.TEXT).text(self.options.labels[self.is_checked ? ActionButton.STATES.CHECKED_HOVER : ActionButton.STATES.UNCHECKED_HOVER]);
			})
			
			.on('mouseleave.LeaveActionButton', function() {
				self
					.removeClass(self.classes[self.is_checked ? ActionButton.STATES.CHECKED_HOVER : ActionButton.STATES.UNCHECKED_HOVER])
					.addClass(self.classes[self.is_checked ? ActionButton.STATES.CHECKED : ActionButton.STATES.UNCHECKED]);
				self.children('.'+__C.CLASSES.HOOKS.TEXT).text(self.options.labels[self.is_checked ? ActionButton.STATES.CHECKED : ActionButton.STATES.UNCHECKED]);
			})
			
			.on('click.Action', function() {
				if (__APP.USER.isLoggedOut()) {
					return self.showAuthModal();
				}
				self.onClick();
				
				if(self.is_add_avatar){
					addAvatar(self);
				}
				if (window.askToSubscribe instanceof Function) {
					window.askToSubscribe();
				}
			});
	};
	
	
	return ActionButton;
}()));