/**
 * @requires Class.Modal.js
 */
function CropperModal(image_src, cropper_options) {
	if (image_src) {
		this.image_src = image_src;
		this.title = 'Кадрирование';
		this.content = tmpl('modal-cropper-content', {image_src: this.image_src});
		
		this.modal = tmpl('modal', {
			modal_type: 'CropperModal',
			modal_title: tmpl('modal-title', {title: this.title}),
			modal_content: this.content,
			modal_footer: tmpl('modal-footer', {
				footer_buttons: $()
					.add(tmpl('button', {classes: '-color_primary CropButton RippleEffect', title: 'Кадрировать'}))
					.add(tmpl('button', {classes: '-color_default DestroyCropButton RippleEffect', title: 'Отмена'}))
			})
		});
		this.cropper = this.modal.find('.Cropper');
		this.crop_button = this.modal.find('.CropButton');
		this.destroy_crop_button = this.modal.find('.DestroyCropButton');
		cropper_options = typeof cropper_options == 'object' ? cropper_options : {};
		this.options = $.extend({
			viewMode: 1,
			zoomable: false,
			zoomOnWheel: false
		}, cropper_options);
		Modal.pushModal(this);
	} else {
		throw Error('To initiate cropper you need to pass image source (image_src)')
	}
}
CropperModal.extend(Modal);


CropperModal.prototype.show = function() {
	var self = this;
	
	self.cropper.on('load', function() {
		self.cropper.cropper(self.options)
	}).attr('src', self.image_src);
	
	self.__superCall('show');
	
	self.modal.on('modal.beforeDestroy', function() {
		self.cropper.cropper('destroy');
		self.crop_button.off('click.Crop');
		self.destroy_crop_button.off('click.DestroyCrop');
	});
	
	self.crop_button.off('click.Crop').on('click.Crop', function() {
		self.crop();
		Modal.hide();
	});
	self.destroy_crop_button.off('click.DestroyCrop').on('click.DestroyCrop', function() {
		Modal.hide();
	});
};

CropperModal.prototype.crop = function() {
	var self = this;
	self.initer.trigger('crop', [self.cropper.cropper('getCroppedCanvas').toDataURL(), self.cropper.cropper('getData')]);
};