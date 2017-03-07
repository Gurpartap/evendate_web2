/**
 * @requires Class.AbstractModal.js
 */
/**
 * @class
 * @extends AbstractModal
 */
CropperModal = extending(AbstractModal, (function() {
	/**
	 *
	 * @param {string} image_src
	 * @param {object} [cropper_options]
	 * @constructor
	 * @constructs CropperModal
	 */
	function CropperModal(image_src, cropper_options) {
		AbstractModal.call(this);
		if (image_src) {
			cropper_options = typeof cropper_options == 'object' ? cropper_options : {};
			this.image_src = image_src;
			this.content = tmpl('modal-cropper-content', {
				image_src: this.image_src
			});
			this.options = $.extend({
				viewMode: 1,
				responsive: false,
				scalable: false,
				zoomable: false,
				zoomOnWheel: false
			}, cropper_options);
		} else {
			throw Error('To initiate cropper you need to pass image source (image_src)')
		}
	}
	/**
	 *
	 * @return {CropperModal}
	 */
	CropperModal.prototype.render = function() {
		var self = this,
			$image = this.content;
		
		this.__render({
			classes: ['-size_wide'],
			content_classes: ['-no_padding', 'img_holder'],
			footer_buttons: tmpl('button', [
				{classes: '-color_primary CropButton RippleEffect', title: 'Кадрировать'},
				{classes: '-color_default DestroyCropButton RippleEffect', title: 'Отмена'}
			])
		});
		
		$image.on('load', function() {
			$image.cropper(self.options);
		}).attr('src', this.image_src);
		
		return this;
	};
	/**
	 *
	 * @return {CropperModal}
	 */
	CropperModal.prototype.init = function() {
		var self = this;
		
		this.modal.find('.CropButton').on('click.Crop', function() {
			self.crop();
			self.hide();
		});
		this.modal.find('.DestroyCropButton').on('click.DestroyCrop', function() {
			self.hide();
		});
		
		return this;
	};
	/**
	 * @protected
	 * @return {CropperModal}
	 */
	CropperModal.prototype.destroyNested = function() {
		this.content.cropper('destroy');
		this.modal.find('.CropButton').off('click.Crop');
		this.modal.find('.DestroyCropButton').off('click.DestroyCrop');
		
		return this;
	};
	/**
	 *
	 * @return {CropperModal}
	 */
	CropperModal.prototype.crop = function() {
		this.modal.trigger('crop', [this.content.cropper('getCroppedCanvas').toDataURL()]);
		
		return this;
	};
	
	return CropperModal;
}()));