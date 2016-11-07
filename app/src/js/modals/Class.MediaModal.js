/**
 * @requires Class.Modal.js
 */
function MediaModal(src, format) {
	if (src) {
		this.src = src;
		this.format = format ? format : 'image';
		this.title = '';
		if (format == 'image') {
			this.content = tmpl('modal-image-media-content', {src: this.src});
		} else {
			
		}
		
		this.modal = tmpl('modal', {
			modal_type: 'MediaModal',
			modal_content_classes: '-no_padding ModalContent',
			modal_content: this.content
		});
		this.modal.on('modal.show', function() {
			Modal.modal_wrapper.addClass('-blackened');
		});
		this.modal.on('modal.close', function() {
			Modal.modal_wrapper.removeClass('-blackened');
		});
		Modal.pushModal(this);
	} else {
		throw Error('To open media you need to pass media source (src)')
	}
}
MediaModal.extend(Modal);

MediaModal.prototype.show = function() {
	var self = this,
		$window = $(window),
		window_max_w = $window.width() * 0.8,
		$media, real_w, real_h;
	
	self.modal.on('modal.show', function() {
		switch (this.format) {
			default:
			case 'image': {
				function onLoad() {
					real_w = $media.width();
					real_h = $media.height();
					
					self.modal.width((real_w > window_max_w) ? window_max_w : real_w);
					self.modal.height((real_w > window_max_w) ? (window_max_w * real_h / real_w) : real_h);
					$media.wrap($('<div>').addClass('img_holder'));
					self.adjustDestroyer();
				}
				
				$media = self.modal.find('img');
				if ($media.width()) {
					onLoad();
				} else {
					$media.on('load', onLoad)
				}
			}
		}
	});
	self.__superCall('show');
};