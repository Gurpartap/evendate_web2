/**
 * @requires Class.AbstractModal.js
 */
/**
 * @class
 * @extends AbstractModal
 */
MediaModal = extending(AbstractModal, (function() {
	function MediaModal(src, format) {
		if (src) {
			if (format == 'image') {
				this.content = tmpl('modal-image-media-content', {src: src});
			} else {
				
			}
			AbstractModal.call(this, {
				content: this.content,
				type: 'MediaModal',
				classes: ['-size_responsive'],
				content_classes: ['img_holder', '-no_padding', 'ModalContent']
			});
			this.src = src;
			this.format = format ? format : 'image';
			this.modal.on('modal.show', function() {
				__APP.MODALS.modal_wrapper.addClass('-blackened');
			});
			this.modal.on('modal.close', function() {
				__APP.MODALS.modal_wrapper.removeClass('-blackened');
			});
		} else {
			throw Error('To open media you need to pass media source (src)')
		}
	}
	
	/**
	 * @lends MediaModal
	 */
	MediaModal.prototype.show = function() {
		var self = this;
		self.modal.find('img').on('load', function() {
			__APP.MODALS.modal_destroyer.adjustHeight(self.modal.height());
		});
		self.__show();
	};
	
	return MediaModal;
}()));