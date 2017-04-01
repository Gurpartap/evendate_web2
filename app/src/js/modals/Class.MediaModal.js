/**
 * @requires Class.AbstractModal.js
 */
/**
 * @class
 * @extends AbstractModal
 */
MediaModal = extending(AbstractModal, (function() {
	/**
	 *
	 * @param {string} src
	 * @param {string} format
	 * @constructor
	 * @constructs MediaModal
	 */
	function MediaModal(src, format) {
		AbstractModal.call(this);
		if (src) {
			if (format === 'image') {
				this.content = tmpl('modal-image-media-content', {src: src});
			} else {
				
			}
			this.src = src;
			this.format = format ? format : 'image';
		} else {
			throw Error('To open media you need to pass media source (src)')
		}
	}
	
	/**
	 *
	 * @return {MediaModal}
	 */
	MediaModal.prototype.render = function(){
		this.__render({
			classes: [__C.CLASSES.FLOATING_MATERIAL, __C.CLASSES.MODAL_STATES.SIZE.RESPONSIVE],
			content_classes: [__C.CLASSES.IMG_HOLDER, __C.CLASSES.MODAL_STATES.NO_PADDING]
		});
		
		return this;
	};
	
	/**
	 *
	 * @return {MediaModal}
	 */
	MediaModal.prototype.show = function() {
		var self = this;
		this.content.on('load', function() {
			self.adjustDestroyerHeight();
		});
		this.__show();
		
		return this;
	};
	
	return MediaModal;
}()));