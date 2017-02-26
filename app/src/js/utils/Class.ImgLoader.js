/**
 * @class ImgLoader
 */
ImgLoader = (function() {
	/**
	 *
	 * @constructor
	 * @construct ImgLoader
	 */
	function ImgLoader() {}
	
	/**
	 *
	 * @type {?jQuery}
	 */
	ImgLoader.current_load_context = null;
	/**
	 *
	 * @param {jQuery} [$parent]
	 */
	ImgLoader.init = function($parent) {
		$parent = $parent ? $parent : $('body');
		
		$parent.find('.ImgLoadWrap').each(function() {
			var $parent = $(this),
				$img_source = $parent.find('.ImgSrc'),
				$img_preview = $parent.find('.ImgPreview');
			
			
			$img_source.off('change.CroppedPreview').on('change.CroppedPreview', function() {
				$img_preview.attr('src', this.value);
			});
			
			if ($img_preview.attr('src')) {
				$parent.find('.CropperButton').removeClass(__C.CLASSES.NEW_HIDDEN);
			}
			
			$parent.find('.LoadImg').off('change.LoadImg').on('change.LoadImg', function(e) {
				var files = e.target.files,
					reader;
				
				if (files.length == 0)
					return false;
				
				for (var i = 0, file; file = files[i]; i++) {
					reader = new FileReader();
					reader.onload = (function(file) {
						return function(onload_event) {
							var data_url = onload_event.target.result;
							ImgLoader.handleImgUpload($parent, data_url, file.name);
						};
					})(file);
					reader.readAsDataURL(file);
				}
			});
			
			$parent.find('.LoadByURLButton').not('-Handled_LoadByURLButton').on('click.LoadByURL', function() {
				ImgLoader.current_load_context = $parent;
				socket.emit('image.getFromURL', $parent.find('.LoadByURLAddress').val());
				Pace.restart();
			}).addClass('-Handled_LoadByURLButton');
			
			$parent.find('.CropperButton').off('click.CallCropper').on('click.CallCropper', function() {
				ImgLoader.callImgCropper($parent,	$parent.data('src') ? $parent.data('src') : $img_source.val());
			});
			
		});
	};
	/**
	 * @param {jQuery} $context
	 * @param {string} source
	 * @return {CropperModal}
	 */
	ImgLoader.callImgCropper = function($context, source) {
		var $parent = $context.closest('.ImgLoadWrap'),
			$img_source = $parent.find('.ImgSrc'),
			cropper_modal = $parent.data('modal');
		
		if(cropper_modal && cropper_modal.image_src != source) {
			cropper_modal.destroy();
		}
		if(!cropper_modal || cropper_modal.image_src != source) {
			$parent.data('src', source);
			cropper_modal = new CropperModal(source, {
				'aspectRatio': eval($parent.data('aspect_ratio'))
			});
			$parent.data('modal', cropper_modal);
		}
		
		cropper_modal.show();
		
		cropper_modal.modal.on('crop', function(event, cropped_src) {
			$img_source.val(cropped_src).trigger('change');
		});
		
		return cropper_modal;
	};
	/**
	 *
	 * @param {jQuery} $context
	 * @param {string} source
	 * @param {string} filename
	 */
	ImgLoader.handleImgUpload = function($context, source, filename) {
		var $parent = $context.closest('.ImgLoadWrap');
		
		$parent.data('src', source);
		$parent.find('.FileName').val(filename);
		$parent.find('.CropperButton').removeClass(__C.CLASSES.NEW_HIDDEN);
		
		ImgLoader.callImgCropper($parent, source);
	};
	
	return ImgLoader;
}());