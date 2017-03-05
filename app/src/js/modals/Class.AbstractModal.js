/**
 * @requires Class.Modals.js
 */
/**
 * @class
 * @abstract
 */
AbstractModal = (function() {
	/**
	 * @abstract
	 * @constructor
	 * @param {AbstractModal.STYLES} [style]
	 * @property {jQuery} modal
	 * @property {jQuery} content_wrapper
	 * @property {(string|jQuery)} content
	 * @property {boolean} block_scroll
	 */
	function AbstractModal(style) {
		this.id = 0;
		this.title = '';
		this.type = this.constructor.name;
		this.style = style ? style : AbstractModal.STYLES.NONE;
		this.modal = $();
		this.content_wrapper = $();
		this.content = '';
		this.scrollTop = 0;
		
		this.wrapper_is_scrollable = false;
		this.content_is_scrollable = false;
		this.is_upload_disabled = false;
		this.is_rendered = false;
		this.is_inited = false;
		this.is_shown = false;
		
		__APP.MODALS.collection.push(this);
	}
	
	/**
	 * @type {jQuery}
	 */
	AbstractModal.prototype.modal_wrapper = (new Modals()).modal_wrapper;
	
	Object.defineProperty(AbstractModal.prototype, 'block_scroll', {
		get: function() {
			return AbstractModal.prototype.modal_wrapper.data('block_scroll');
		},
		set: function(value) {
			return AbstractModal.prototype.modal_wrapper.data('block_scroll', value);
		}
	});
	
	AbstractModal.hideCurrent = function() {
		if (__APP.MODALS.active_modal) {
			__APP.MODALS.active_modal.hide();
		}
	};
	/**
	 *
	 * @enum {integer}
	 */
	AbstractModal.STYLES = {
		NONE: 0,
		OK_ONLY: 1,
		OK_CANCEL: 2,
		ABORT_RETRY_IGNORE: 3,
		YES_NO_CANCEL: 4,
		YES_NO: 5,
		RETRY_CANCEL: 6,
		CRITICAL: 10,
		QUESTION: 11,
		EXCLAMATION: 12,
		INFORMATION: 13
	};
	Object.freeze(AbstractModal.STYLES);
	
	
	/**
	 *
	 * @final
	 * @protected
	 * @param {object} [props]
	 * @param {(Array<string>|string)} [props.classes]
	 * @param {(Array<string>|string)} [props.content_classes]
	 * @param {(number|string)} [props.width]
	 * @param {(number|string)} [props.height]
	 * @param {jQuery} [props.header]
	 * @param {jQuery} [props.footer]
	 * @param {jQuery} [props.footer]
	 * @param {jQuery} [props.footer_buttons]
	 * @param {Object<string, *>} [props.dataset]
	 * @param {Object<string, (string|number|boolean)>} [props.attributes]
	 * @return {AbstractModal}
	 */
	AbstractModal.prototype.__render = function(props) {
		var $footer_buttons;
		
		switch (this.style) {
			case AbstractModal.STYLES.OK_ONLY: {
				$footer_buttons = __APP.BUILD.button({
					classes: ['-color_primary', 'CloseModal', 'RippleEffect'],
					title: 'OK'
				});
				break;
			}
			case AbstractModal.STYLES.OK_CANCEL: {
				$footer_buttons = __APP.BUILD.button({
					classes: ['-color_primary', 'CloseModal', 'RippleEffect'],
					title: 'OK'
				}, {
					classes: ['-color_default', 'CloseModal', 'RippleEffect'],
					title: 'Отмена'
				});
				break;
			}
			case AbstractModal.STYLES.ABORT_RETRY_IGNORE: {
				$footer_buttons = __APP.BUILD.button({
					classes: ['-color_marginal_bubble_gum', 'CloseModal', 'RippleEffect'],
					title: 'Прервать'
				}, {
					classes: ['-color_default', 'CloseModal', 'RippleEffect'],
					title: 'Повтор'
				}, {
					classes: ['-color_default', 'CloseModal', 'RippleEffect'],
					title: 'Пропустить'
				});
				break;
			}
			case AbstractModal.STYLES.YES_NO_CANCEL: {
				$footer_buttons = __APP.BUILD.button({
					classes: ['-color_marginal_franklin', 'CloseModal', 'RippleEffect'],
					title: 'Да'
				}, {
					classes: ['-color_marginal_bubble_gum', 'CloseModal', 'RippleEffect'],
					title: 'Нет'
				}, {
					classes: ['-color_default', 'CloseModal', 'RippleEffect'],
					title: 'Отмена'
				});
				break;
			}
			case AbstractModal.STYLES.YES_NO: {
				$footer_buttons = __APP.BUILD.button({
					classes: ['-color_marginal_franklin', 'CloseModal', 'RippleEffect'],
					title: 'Да'
				}, {
					classes: ['-color_marginal_bubble_gum', 'CloseModal', 'RippleEffect'],
					title: 'Нет'
				});
				break;
			}
			case AbstractModal.STYLES.RETRY_CANCEL: {
				$footer_buttons = __APP.BUILD.button({
					classes: ['-color_default', 'CloseModal', 'RippleEffect'],
					title: 'Повтор'
				}, {
					classes: ['-color_default', 'CloseModal', 'RippleEffect'],
					title: 'Отмена'
				});
				break;
			}
		}
		
		this.modal = __APP.BUILD.modal($.extend({
			type: this.type,
			title: this.title,
			content: this.content,
			footer_buttons: $footer_buttons
		}, props));
		this.content_wrapper = this.modal.find('.ModalContent');
		
		this.is_rendered = true;
		
		if (!this.content) {
			this.content = this.content_wrapper.children();
		}
		
		return this;
	};
	
	/**
	 * @final
	 * @protected
	 * @return {AbstractModal}
	 */
	AbstractModal.prototype.__init = function() {
		var self = this;
		
		function handleScrollToBottom(self) {
			if(!self.is_upload_disabled && !self.block_scroll) {
				self.block_scroll = true;
				self.onScrollToBottom(function() {
					self.block_scroll = false;
					self.adjustDestroyerHeight();
				});
			}
		}
		
		if (!this.is_rendered) {
			console.error('Modal has not been rendered yet');
			return this;
		}
		
		this.modal.find('.CloseModal').on('click.CloseModal', function() {
			AbstractModal.hideCurrent();
		});
		$(document).on('keyup.CloseModal', function(event) {
			if (event.keyCode == 27) {
				$(this).off('keyup.CloseModal');
				AbstractModal.hideCurrent();
			}
		});
		
		if (this.wrapper_is_scrollable && this.onScrollToBottom != AbstractModal.prototype.onScrollToBottom) {
			this.modal_wrapper.on('scroll', function() {
				if (self.modal_wrapper.height() + self.modal_wrapper.scrollTop() >= self.modal.height()) {
					handleScrollToBottom(self);
				}
			});
		}
		
		if (this.content_is_scrollable) {
			this.content.scrollbar({
				onScroll: this.onScrollToBottom != AbstractModal.prototype.onScrollToBottom ? function(y) {
					if (y.scroll == y.maxScroll) {
						handleScrollToBottom(self);
					}
				} : undefined
			});
			
			this.modal.on('modal:disappear', function() {
				self.content.scrollTop(0);
			});
		}
		
		this.is_inited = true;
		
		return this;
	};
	
	/**
	 *
	 * @final
	 * @protected
	 * @return {AbstractModal}
	 */
	AbstractModal.prototype.__show = function() {
		var self = this;
		
		if (!this.is_rendered)
			return this.render().show();
		
		AbstractModal.hideCurrent();
		$('body').addClass('-open_modal');
		__APP.MODALS.active_modal = this;
		
		this.modal_wrapper.append(this.modal.addClass('-faded').removeClass(__C.CLASSES.HIDDEN));
		this.adjustDestroyerHeight();
		
		this.modal.trigger('modal:show');
		setTimeout(function() {
			self.modal.removeClass('-faded');
			self.modal_wrapper.scrollTop(self.scrollTop);
			self.modal.trigger('modal:appear');
			self.is_shown = true;
		}, 200);
		
		if (!this.is_inited) {
			this.init();
		}
		
		return this;
	};
	/**
	 *
	 * @final
	 * @protected
	 * @return {AbstractModal}
	 */
	AbstractModal.prototype.__hide = function() {
		var self = this;
		
		this.scrollTop = this.modal_wrapper.scrollTop();
		$(document).off('keyup.CloseModal');
		
		$('body').removeClass('-open_modal');
		
		__APP.MODALS.active_modal = undefined;
		
		this.modal.addClass('-faded');
		this.modal.trigger('modal:disappear');
		setTimeout(function() {
			self.modal.addClass(__C.CLASSES.HIDDEN).trigger('modal:close');
			self.is_shown = false;
		}, 200);
		
		return this;
	};
	
	/**
	 * @param {Function} callback
	 * @return {AbstractModal}
	 */
	AbstractModal.prototype.onScrollToBottom = function(callback){
		callback.call(this);
		
		return this;
	};
	/**
	 *
	 * @return {AbstractModal}
	 */
	AbstractModal.prototype.adjustDestroyerHeight = function(){
		__APP.MODALS.modal_destroyer.adjustHeight(this.modal.outerHeight(true));
		
		return this;
	};
	/**
	 *
	 * @return {AbstractModal}
	 */
	AbstractModal.prototype.render = function(){
		return this.__render();
	};
	/**
	 * @return {AbstractModal}
	 */
	AbstractModal.prototype.init = function() {
		return this.__init();
	};
	/**
	 * @return {AbstractModal}
	 */
	AbstractModal.prototype.show = function() {
		return this.__show();
	};
	/**
	 *
	 * @return {AbstractModal}
	 */
	AbstractModal.prototype.hide = function() {
		return this.__hide();
	};
	/**
	 * @protected
	 * @return {AbstractModal}
	 */
	AbstractModal.prototype.destroyNested = function() {
		return this;
	};
	/**
	 *
	 * @return {AbstractModal}
	 */
	AbstractModal.prototype.destroy = function() {
		var index = __APP.MODALS.collection.indexOf(this);
		this.hide();
		__APP.MODALS.modal_wrapper.trigger('modal.beforeDestroy');
		this.destroyNested();
		this.modal.remove();
		if (index != -1) {
			__APP.MODALS.collection.splice(index, 1);
		}
		__APP.MODALS.modal_wrapper.trigger('modal.afterDestroy');
		
		return this;
	};
	
	return AbstractModal;
}());