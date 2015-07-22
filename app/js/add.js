$(document).ready(function(){

	var _file = null, _file_name = null;

	function handleFileSelect(evt) {
		var $canvas_wrapper = $('.image-preview-canvas').addClass('hidden'),
			$btn = $('.img-crop-btn').addClass('disabled').off('click'),
			$panel = $('.img-preview-panel').removeClass('hidden'),
			$image = $('.event-img-container img'),
			$pulser = $('.img-loading-pulse').removeClass('hidden');
		$image.addClass('hidden');
		var files = evt.target.files; // FileList object
		for(var i = 0, f; f = files[i]; i++) {
			if (!f.type.match('image.*')) {
				continue;
			}
			if (f.size / 1024 > 4096){
				alert('Извините, максимально допустимый развер изображения - 4 МБ. Уменьште изображение.');
				return;
			}
			var reader = new FileReader();
			reader.onload = (function(the_file) {
				return function(e) {
					_file = e.target.result;
					_file_name = the_file.name;


					$image.attr('src', _file).removeClass('hidden');
					$image.cropper('destroy');
					$image.cropper({
						data: {
							x: 420,
							y: 60,
							width: 640,
							height: 360
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

						aspectRatio: 7 / 10,
						preview: '.img-preview'
					});


					$pulser.addClass('hidden');
					$image.removeClass('hidden');
					$btn.removeClass('disabled').on('click', function(){
						var result = $image.cropper('getCroppedCanvas', {
							width: 500
						});
						$image.cropper('destroy').addClass('hidden');
						$btn.addClass('disabled').off('click');
						$canvas_wrapper.html(result).removeClass('hidden');

					});
				};
			})(f);
			reader.readAsDataURL(f);
		}
	}


	$('#filestyle-0').on('change', handleFileSelect);
	var options = {
		locale: 'ru'
		},
		$cal1 = $('#datetimepicker1'),
		$cal2 = $('#datetimepicker2');

	$cal1.datetimepicker(options).on("dp.change", function (e) {
		$cal2.data("DateTimePicker").minDate(e.date);
	});
	$cal2.datetimepicker(options).on("dp.change", function (e) {
		$cal1.data("DateTimePicker").minDate(e.date);
	});
	$('#map-canvas').locationpicker({
		location: {latitude: 55.755826, longitude: 37.6173},
		radius: 1,
		inputBinding: {
			latitudeInput: $('#latitute'),
			longitudeInput: $('#longitude'),
			radiusInput: null,
			locationNameInput: $('#event-place')
		},
		enableAutocomplete: true,
		onchanged: function(currentLocation) {
			console.log("Location changed. New location (" + currentLocation.latitude + ", " + currentLocation.longitude + ")");
		}
	});
	$('.btn-toggle-map').on('click', function(){
		var $map = $('#map-canvas');
		$map.toggleClass('hidden');
		$(this).toggleClass('active');
	});

	$('.create-event-btn').on('click', function(){
		var $canvas = $('.image-preview-canvas canvas'),
			send_data = {
				file: _file,
				file_name: _file_name,
				cropped_file: $canvas.length != 0 ? $canvas.get(0).toDataURL() : null,
				event_start_date: $cal1.data('DateTimePicker').date().format('YYYY-MM-DD HH:mm:ss'),
				event_end_date: $cal2.data('DateTimePicker').date().format('YYYY-MM-DD HH:mm:ss')
			};

		if (_file != null || _file_name != null){
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