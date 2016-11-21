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
	 * @param image_src
	 * @param cropper_options
	 * @constructor
	 */
	function CropperModal(image_src, cropper_options) {
		if (image_src) {
			cropper_options = typeof cropper_options == 'object' ? cropper_options : {};
			AbstractModal.call(this, {
				content: tmpl('modal-cropper-content', {image_src: this.image_src}),
				type: 'CropperModal',
				classes: ['-size_wide'],
				content_classes: ['-no_padding', 'img_holder'],
				footer: tmpl('modal-footer', {
					footer_buttons: $()
						.add(tmpl('button', {classes: '-color_primary CropButton RippleEffect', title: 'Кадрировать'}))
						.add(tmpl('button', {classes: '-color_default DestroyCropButton RippleEffect', title: 'Отмена'}))
				})
			});
			this.image_src = image_src;
			
			this.cropper = this.modal.find('.Cropper');
			this.crop_button = this.modal.find('.CropButton');
			this.destroy_crop_button = this.modal.find('.DestroyCropButton');
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
	
	
	CropperModal.prototype.show = function() {
		var self = this;
		
		self.cropper.on('load', function() {
			self.cropper.cropper(self.options);
		}).attr('src', self.image_src);
		
		self.__show();
		
		self.modal.on('modal.beforeDestroy', function() {
			self.cropper.cropper('destroy');
			self.crop_button.off('click.Crop');
			self.destroy_crop_button.off('click.DestroyCrop');
		});
		
		self.crop_button.off('click.Crop').on('click.Crop', function() {
			self.crop();
			__APP.MODALS.hideCurrent();
		});
		self.destroy_crop_button.off('click.DestroyCrop').on('click.DestroyCrop', function() {
			__APP.MODALS.hideCurrent();
		});
	};
	
	CropperModal.prototype.crop = function() {
		var self = this;
		self.initer.trigger('crop', [self.cropper.cropper('getCroppedCanvas').toDataURL(), self.cropper.cropper('getData')]);
	};
	
	return CropperModal;
}()));