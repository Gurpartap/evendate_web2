$(document).ready(function(){

	var _files = {
			vertical: null,
			horizontal: null
		},
		_file_names = {
			vertical: null,
			horizontal: null
		};

	function handleFileSelect(evt) {
		var file_orientation = $(evt.target).is('#filestyle-0') ? 'vertical' : 'horizontal',
			aspect_ratio = file_orientation == 'vertical' ? 7 / 10 : 10 / 7,
			CUTTER_HEIGHT = 600,
			CUTTER_WIDTH = 600,
			$label_btn = $('label.' + file_orientation + '-btn'),
			$canvas_wrapper = $('.image-cropper-wrapper')
				.height(window.innerHeight)
				.width(window.innerWidth)
				.addClass('hidden'),
			$btn = $('.img-crop-btn').addClass('disabled').off('click'),
			$cancel_btn = $('.img-crop-cancel').addClass('disabled').off('click'),
			$image_cutter = $('.image-cutter').css({
				height: CUTTER_HEIGHT,
				width: CUTTER_WIDTH
			}),
			$image = $image_cutter.find('img'),
			$loader = $('.whirl.image-cropper').removeClass('hidden');
		$image.addClass('hidden');

		var files = evt.target.files; // FileList object
		for(var i = 0, f; f = files[i]; i++) {
			if (!f.type.match('image.*')) {
				continue;
			}
			if (f.size / 1024 > 4096){
				showNotifier({status: false, text: 'Извините, максимально допустимый размер изображения - 4 МБ. Уменьште изображение.'});
				return;
			}
			var reader = new FileReader();
			reader.onload = (function(the_file) {
				return function(e) {
					$canvas_wrapper.removeClass('hidden');
					$image_cutter.css({
						'left': (window.innerWidth - CUTTER_WIDTH) / 2,
						'top': (window.innerHeight - CUTTER_HEIGHT) / 2
					});
					_files[file_orientation] = e.target.result;
					_file_names[file_orientation] = the_file.name;


					$image.attr('src', _files[file_orientation]).removeClass('hidden');
					$image.cropper('destroy');

					$image.cropper({
						data: {
							x: 420,
							y: 60,
							width: CUTTER_WIDTH,
							height: CUTTER_HEIGHT
						},
						strict: false,
						responsive: false,
						checkImageOrigin: false,

						modal: false,
						guides: true,
						highlight: true,
						background: true,

						autoCrop: true,
						autoCropArea: 0.5,
						dragCrop: true,
						movable: true,
						rotatable: true,
						zoomable: true,
						touchDragZoom: true,
						mouseWheelZoom: true,
						cropBoxMovable: true,
						cropBoxResizable: true,
						doubleClickToggle: true,

						minCanvasWidth: 320,
						minCanvasHeight: 180,
						minCropBoxWidth: 160,
						minCropBoxHeight: 90,
						minContainerWidth: 320,
						minContainerHeight: 180,

						aspectRatio: aspect_ratio,
						preview: '.img-preview'
					});


					$loader.addClass('hidden');
					$image.removeClass('hidden');

					$btn.removeClass('disabled').on('click', function(){
						var result = $image.cropper('getCroppedCanvas', {
							width: $label_btn.width()
						});
						$image.cropper('destroy').addClass('hidden');
						$btn.addClass('disabled').off('click');

						$label_btn
							.css('padding-top', '0px')
							.html(result);
						$canvas_wrapper.addClass('hidden');
					});

				};
			})(f);
			reader.readAsDataURL(f);
		}
	}


	$('#filestyle-0').on('change', handleFileSelect);
	$('#filestyle-1').on('change', handleFileSelect);


	$('.create-event-btn').on('click', function(){
		var $canvas = $('.image-preview-canvas canvas'),
			send_data = {
				files: _files,
				file_names: _file_names,
				cropped_file: $canvas.length != 0 ? $canvas.get(0).toDataURL() : null
			};

		if (_files != null || _file_names != null){
			if ($canvas.length == 0){
				alert('Извините, но выбранное изображение необходимо кадрировать');
				return;
			}
		}
		$('#create-event-form').find('input,textarea').each(function(){
			var $input = $(this);
			if ($input.attr('type') == 'file') return true;
			send_data[$input.attr('name')] = $input.val();
		});
		$.ajax({
			url: 'api/events/',
			data: JSON.stringify(send_data),
			contentType: 'application/json',
			type: 'POST',
			success: function(res){
				alert(res.text);
			}
		})
	});
});