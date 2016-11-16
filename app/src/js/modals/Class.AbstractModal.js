/**
 * @class
 */
AbstractModal = (function() {
	/**
	 *
	 * @param {{
	 *    content: ?(string|jQuery),
	 *    [title]: string,
	 *    [type]: string,
	 *    [classes]: ?(Array<string>|string),
	 *    [content_classes]: ?(Array<string>|string),
	 *    [width]: number,
	 *    [footer]: ?jQuery
	 * }} props
	 * @constructor
	 */
	function AbstractModal(props) {
		this.id = 0;
		this.title = props.title;
		this.type = props.type ? props.type : 'Std';
		this.content = props.content;
		/**
		 *
		 * @type {jQuery}
		 */
		this.modal = __APP.BUILD.modal(props);
		__APP.MODALS.pushModal(this);
	}
	
	/**
	 *
	 * @final
	 */
	AbstractModal.prototype.__show = function() {
		var self = this;
		
		__APP.MODALS.modal_wrapper.append(this.modal);
		$('body').addClass('-open_modal');
		
		__APP.MODALS.hideCurrent();
		__APP.MODALS.active_modal = this;
		
		this.modal.addClass('-faded').removeClass(__C.CLASSES.NEW_HIDDEN);
		__APP.MODALS.modal_destroyer.adjustHeight(this.modal.height());
		this.modal.trigger('modal.show');
		setTimeout(function() {
			self.modal.removeClass('-faded');
		}, 200);
		
		__APP.MODALS.modal_destroyer.off('click.CloseModal').on('click.CloseModal', function() {
			$(this).off('click.CloseModal');
			__APP.MODALS.hideCurrent();
		});
		this.modal.find('.CloseModal').off('click.CloseModal').on('click.CloseModal', function() {
			__APP.MODALS.hideCurrent();
		});
		$(document).off('keyup.CloseModal').on('keyup.CloseModal', function(event) {
			if (event.keyCode == 27) {
				$(this).off('keyup.CloseModal');
				__APP.MODALS.hideCurrent();
			}
		});
		
	};
	/**
	 *
	 * @final
	 */
	AbstractModal.prototype.__hide = function() {
		var self = this;
		__APP.MODALS.modal_destroyer.off('click.CloseModal');
		$(document).off('keyup.CloseModal');
		__APP.MODALS.active_modal = undefined;
		this.modal.find('.CloseModal').off('click.CloseModal');
		this.modal.addClass('-faded');
		setTimeout(function() {
			self.modal.addClass(__C.CLASSES.NEW_HIDDEN);
			self.modal.trigger('modal.close');
		}, 200);
	};
	
	AbstractModal.prototype.show = function() {
		this.__show();
	};
	
	AbstractModal.prototype.hide = function() {
		this.__hide();
	};
	
	AbstractModal.prototype.destroy = function() {
		this.hide();
		__APP.MODALS.modal_wrapper.trigger('modal.beforeDestroy');
		this.modal.remove();
		for (var key in __APP.MODALS.collection) {
			if (__APP.MODALS.collection[key] == this) {
				delete __APP.MODALS.collection[key];
			}
		}
		__APP.MODALS.modal_wrapper.trigger('modal.afterDestroy');
	};
	
	return AbstractModal;
}());