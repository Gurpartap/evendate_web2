$(document).ready(function(){

	var _files = {
			vertical: null,
			horizontal: null
		},
		_cropped_files = {
			vertical: null,
			horizontal: null
		},
		_file_names = {
			vertical: null,
			horizontal: null
		},
		_location = null,
		$text_length = $('.textarea-length-text');

	function bindModalEvents(){
	$text_length = $('.textarea-length-text');

	function handleFileSelect(evt){
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
			$loader = $('.whirl.image-cropper').removeClass('hidden'),
			cropper_options = {
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
			};
		$image.addClass('hidden');

		function cropImage(e, the_file){
			$canvas_wrapper.removeClass('hidden');
			$image_cutter.css({
				'left': (window.innerWidth - CUTTER_WIDTH) / 2,
				'top': (window.innerHeight - CUTTER_HEIGHT) / 2
			});
			_files[file_orientation] = e.target.result;
			_file_names[file_orientation] = the_file.name;

			$image.attr('src', _files[file_orientation]).removeClass('hidden');
			$image.cropper('destroy');
			$image.cropper(cropper_options);
			$loader.addClass('hidden');
			$image.removeClass('hidden');


			$cancel_btn.removeClass('disabled').on('click', function(){
				$canvas_wrapper.addClass('hidden');
			});
			$btn.removeClass('disabled').off('click').on('click', function(){
				var result = $image.cropper('getCroppedCanvas', {
					width: $label_btn.width()
				});
				_cropped_files[file_orientation] = result.toDataURL();
				$image.cropper('destroy').addClass('hidden');
				$btn.addClass('disabled').off('click');

				$label_btn
					.css('padding-top', '0px')
					.html(result);

				$('.crop-again.' + file_orientation)
					.removeClass('hidden')
					.off('click')
					.on('click', function(){
						cropImage(e, the_file);
					});

				$canvas_wrapper.addClass('hidden');
			});

		}

		var files = evt.target.files; // FileList object
		$canvas_wrapper.removeClass('hidden');
		$image_cutter.css({
			'left': (window.innerWidth - CUTTER_WIDTH) / 2,
			'top': (window.innerHeight - CUTTER_HEIGHT) / 2
		});
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
					cropImage(e, the_file);
				};
			})(f);
			reader.readAsDataURL(f);
		}
	}



	$('.tags.to-select2').select2({
		placeholder: "Выберите до 5 тегов",
		width: '100%',
		maximumSelectionLength: 5,
		multiple: true,
		createSearchChoice: function() {
			return null;
		}
	});



		$('input.daterange').daterangepicker(
			{
				locale: {
					format: 'DD/MM/YYYY',
					applyLabel: 'Выбрать',
					cancelLabel: 'Отмена',
					firstDay: 1,
					daysOfWeek: [
						'Пн','Вт','Ср','Чт','Пт','Сб','Вс'
					],
					monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
				},
				startDate: moment(),
				endDate: moment(),
				minDate: moment(),
				maxDate: moment().add(3, 'months'),
				applyClass: 'btn-pink',
				cancelClass: 'btn-pink-empty'
			},
			function(start, end, label) {
				console.log(start, end, label)
			});

		$('input.input-hours').inputmask('Regex', {
			regex: "([01]?[0-9]|2[0-3])"
		});
		$('input.input-minutes').inputmask('Regex', {
			regex: "[0-5][0-9]"
		});

	$('textarea.description').on('input', function(){
		var text_length = $(this).val().length;
		if (text_length == 500){
			$text_length.addClass('text-danger');
		}else{
			$text_length.removeClass('text-danger');
		}
		$text_length.text(text_length + '/500');
	});

	$('.notification-time').on('change', function(e){
		var selected_count = $('.notification-time:checked').length,
			$not_checked = $('.notification-time:not(:checked)');
		if (selected_count == 2){
			$not_checked.attr('disabled', 'disabled');
		}else{
			$not_checked.removeAttr('disabled');
		}
	});

	$('#filestyle-0').on('change', handleFileSelect);
	$('#filestyle-1').on('change', handleFileSelect);


	$(".placepicker").placepicker({
		placeChanged: function(e){
			_location = {
				formatted_address: e.formatted_address,
				id: e.id,
				place_id: e.place_id,
				coordinates: e.geometry.location
			};
		}
	});

	$('.create-event-btn').on('click', function(){
		var send_data = {
				files: _cropped_files,
				file_names: _file_names,
				geo: _location
		},
			to_send_flag = true;

		if (_files['vertical'] == null || _files['horizontal'] == null ){
			showNotifier({status: false, text: 'Извините, у события должна присутствовать обложка'});
			return;
		}

		$('#create-event-form').find('input,textarea,select').each(function(){
			var $input = $(this);
			if ($input.attr('type') == 'file') return true;
			if ($input.attr('type') == 'checkbox') {
				send_data[$input.attr('name')] = $input.is(':checked');
			}else if ($input.hasClass('daterange')){
				send_data[$input.attr('name') + '-start'] = $input.data('daterangepicker').startDate.format('YYYY-MM-DD');
				send_data[$input.attr('name') + '-end'] = $input.data('daterangepicker').endDate.format('YYYY-MM-DD');
			}else{
				send_data[$input.attr('name')] = $input.val();
			}
		});
		send_data['full-day'] = $('.full-day').is(':checked');

		if (send_data['full-day'] != true){
			if (send_data['begin-hours'] == '' || send_data['begin-minutes'] == ''){
				showNotifier({status: false, text: 'Укажите время начала события'});
				to_send_flag = false;
			}
			if (send_data['end-hours'] == '' || send_data['end-minutes'] == ''){
				showNotifier({status: false, text: 'Укажите время окончания события'});
				to_send_flag = false;
			}
		}
		if (send_data['title'] == ''){
			showNotifier({status: false, text: 'Укажите название события'});
			to_send_flag = false;
		}
		if (send_data['description'] == ''){
			showNotifier({status: false, text: 'Укажите название события'});
			to_send_flag = false;
		}
		if (send_data['address'] == ''){
			showNotifier({status: false, text: 'Укажите адрес события'});
			to_send_flag = false;
		}


		if (to_send_flag == false) return false;

				$.ajax({
			url: 'api/events/',
			data: JSON.stringify(send_data),
			contentType: 'application/json',
			type: 'POST',
			success: function(res){
				if (res.status){

				}else{

				}
			}
		})
	});
}

	function showAddEventModal(){
		$.ajax({
			url: 'api/tags/all',
			success: function(res){
				var _tag_options = $('<optgroup></optgroup>');
				res.data.forEach(function(tag){
					_tag_options.append(tmpl('tag-option',tag));
				});


				var $body = $('body'),
					modal_height = window.innerHeight - MODAL_OFFSET,
					$modal = $('#modal-add-event');


				$modal.remove();
				$modal = tmpl('add-event-modal', {
					tags: _tag_options
				});
				$modal.find('.full-day').on('change', function(e){
					if ($(this).is(':checked')){
						$('.input-hours,.input-minutes')
							.attr('disabled', 'true')
					}else{

						$('.input-hours,.input-minutes')
							.removeAttr('disabled')
					}
				});
				$modal
					.find('.modal-body')
					.slimScroll({
						height: modal_height
					});
				$modal
					.appendTo($body)
					.on('shown.bs.modal', bindModalEvents)
					.on('hide.bs.modal', function(){
						$('input.daterange').data('daterangepicker').hide();
					})
					.modal();
			}
		});
	}

	$('.create-event-menu-btn').on('click', showAddEventModal)
});