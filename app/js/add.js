var BACKSPACE_CODE = 8,
	DELETE_CODE = 46,
	_files = {
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
	_cropper_data = {
		vertical: null,
		horizontal: null
	}
	_location = null,
	$text_length = $('.textarea-length-text');



var daterange_settings =
{
	singleDatePicker: true,
	locale: {
		format: 'DD/MM/YYYY',
		applyLabel: 'Выбрать',
		cancelLabel: 'Отмена',
		firstDay: 0,
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
};

function showNotifier(response){
	$.notify({
		'message': response.text,
		'pos': response.pos ? response.pos : 'top-right',
		'status': response.status ? 'success' : 'danger'
	});
}

function bindDatepickerChanger(){
	$('.change-date-range-type').on('click', function(){
		var $this = $(this);
		$this.siblings('btn').removeClass('btn-pink').addClass('btn-pink-empty');
		$this.addClass('btn-pink').removeClass('btn-pink-empty');
		daterange_settings.singleDatePicker = $this.data('single-date');
		$('input.daterange').daterangepicker(daterange_settings).click();
		bindDatepickerChanger();
	});
}

function bindModalEvents(){
	var $text_length = $('.textarea-length-text');

	function handleFileSelect(evt){
		if (evt.target.files.length == 0) return false;
		var file_orientation = $(evt.target).is('#filestyle-0') ? 'vertical' : 'horizontal',
			aspect_ratio = file_orientation == 'vertical' ? 7 / 10 : 10 / 7,
			CUTTER_HEIGHT = window.innerHeight - 150,
			CUTTER_WIDTH = window.innerWidth - 150,
			$label_btn = $('label.' + file_orientation + '-btn'),
			$canvas_wrapper = $('.image-cropper-wrapper')
				.height(window.innerHeight)
				.width(window.innerWidth)
				.removeClass('hidden'),
			$btn = $('.img-crop-btn').addClass('disabled').off('click').addClass(__C.CLASSES.HIDDEN),
			$cancel_btn = $('.img-crop-cancel').addClass('disabled').off('click').addClass(__C.CLASSES.HIDDEN),
			$image_cutter = $('.image-cutter').css({
				height: CUTTER_HEIGHT,
				width: CUTTER_WIDTH
			}),
			$image = $image_cutter.find('img'),
			$loader = $('.whirl.image-cropper').removeClass('hidden'),
			cropper_options = {
				data: _cropper_data[file_orientation],
				strict: true,
				responsive: false,
				checkImageOrigin: false,

				modal: true,
				guides: true,
				highlight: false,
				background: false,
				dragCrop: true,
				movable: true,
				rotatable: true,
				zoomable: false,
				touchDragZoom: true,
				mouseWheelZoom: true,
				cropBoxMovable: true,
				cropBoxResizable: true,
				doubleClickToggle: true,

				minCanvasWidth: 400,
				minCanvasHeight: 600,
				minCropBoxWidth: 400,
				minCropBoxHeight: 600,
				minContainerWidth: 400,
				minContainerHeight: 600,

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
			cropper_options.data = _cropper_data[file_orientation];
			$image.cropper(cropper_options);

			$loader.addClass('hidden');
			$image.removeClass('hidden');


			$cancel_btn.removeClass('disabled').on('click', function(){
				$canvas_wrapper.addClass('hidden');
			});
			$btn.removeClass('disabled').off('click').on('click', function(){
				var result = $image.cropper('getCroppedCanvas', {
					width: file_orientation == 'vertical' ? 400 : 600
				});
				_cropped_files[file_orientation] = result.toDataURL();
				_cropper_data[file_orientation] = $image.cropper('getData');
				$image.cropper('destroy').addClass('hidden');
				$btn.addClass('disabled').off('click');

				$label_btn
					.css('padding-top', '0px')
					.html('<img src="' + result.toDataURL() + '">');

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
					$btn.removeClass(__C.CLASSES.HIDDEN);
					$cancel_btn.removeClass(__C.CLASSES.HIDDEN);
				};
			})(f);
			reader.readAsDataURL(f);
		}
	}


	$('.organizations.to-select2').select2({
		width: '100%'
	});
	$('.tags.to-select2').select2({
		placeholder: "Выберите до 5 тегов",
		width: '100%',
		maximumSelectionLength: 5,
		multiple: true,
		createSearchChoice: function() {
			return null;
		}
	});


	$('input.daterange').daterangepicker(daterange_settings);
	bindDatepickerChanger();

	function timeKeyup(e){
		var input_number = $(this).data('input-number'),
			next_field,
			svalue = String(this.value);
		if (svalue.length == 2){
			next_field = input_number + 1;
		}else if (svalue.length == 0 && (e.which == DELETE_CODE || e.which == BACKSPACE_CODE)){
			next_field = input_number - 1;
		}
		$('.input-' + next_field).focus();


	}

	$('input.input-hours').inputmask('Regex', {
		regex: "([01]?[0-9]|2[0-3])"
	}).on('keyup', timeKeyup);
	$('input.input-minutes').inputmask('Regex', {
		regex: "[0-5][0-9]"
	}).on('keyup', timeKeyup);

	$('textarea.description').on('input', function(){
		var $this = $(this),
			text_length = $this.val().length;
		if (text_length == 500){
			$text_length.addClass('text-danger');
			$this.parents('.form-group').addClass('has-error');
		}else{
			$text_length.removeClass('text-danger');
			$this.parents('.form-group').removeClass('has-error');
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
		var $this = $(this),
			send_data = {
				files: _cropped_files,
				file_names: _file_names,
				geo: _location
			},
			to_send_flag = true,
			event_id = $this.data('event-id'),
			url, type;

		if ($this.hasClass(__C.CLASSES.DISABLED)) return false;

		if ((_files['vertical'] == null || _files['horizontal'] == null) && event_id == undefined){
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
			showNotifier({status: false, text: 'Укажите описание события'});
			to_send_flag = false;
		}
		if (send_data['address'] == ''){
			showNotifier({status: false, text: 'Укажите адрес события'});
			to_send_flag = false;
		}


		if (to_send_flag == false) return false;

		$this.addClass(__C.CLASSES.DISABLED);

		if (event_id){
			type = 'PUT';
			url = 'api/events/' + event_id;
		}else{
			type = 'POST';
			url = 'api/events/';
		}

		$.ajax({
			url: url,
			data: JSON.stringify(send_data),
			contentType: 'application/json',
			type: type,
			success: function(res){
				$this.removeClass(__C.CLASSES.DISABLED);
				if (res.status){
					$('#modal-add-event').modal('hide');
					showNotifier(res);
					if (__STATES.getCurrentState() != 'organizations'){
						__STATES.refreshState();
					}
				}else{
					showNotifier(res);
				}
			}
		})
	});
}

function showAddEventModal(callback){
	$.ajax({
		url: 'api/tags/all',
		success: function(res){
			var _tag_options = $('<optgroup></optgroup>'),
				_organizations_options = $('<optgroup></optgroup>'),
				hidden_organizations = '';
			res.data.tags.forEach(function(tag){
				_tag_options.append(tmpl('tag-option',tag));
			});

			if (res.data.organizations.length > 1){
				res.data.organizations.forEach(function(organization){
					_organizations_options.append(tmpl('organization-option',organization));
				});
			}else{
				hidden_organizations = 'hidden';
			}

			var $body = $('body'),
				modal_height = window.innerHeight - MODAL_OFFSET,
				$modal = $('#modal-add-event');


			$modal.remove();
			$modal = tmpl('add-event-modal', {
				tags: _tag_options,
				organizations: _organizations_options,
				hidden_organizations: hidden_organizations
			});
			$modal.find('.full-day').on('change', function(){
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
				.appendTo($body);
			bindModalEvents();

			$modal.on('hide.bs.modal', function(){
					$('input.daterange').data('daterangepicker').hide();
				})
				.modal({
					backdrop: 'static'
				});

			if (callback instanceof Function){
				callback($modal);
			}
		}
	});
}

function showEditEventModal(event_id){
	$.ajax({
		url: '/api/events/' + event_id,
		success: function(res) {
			if (res.status == false) return showNotifier(res);
			if (res.data.length != 1) return showNotifier({status: false, text: 'Событие не найдено'});

			var _event = res.data[0],
				zero_dates = '00:00:00';
			showAddEventModal(function($modal){

				$modal.find('[name="title"]').val(_event.title);
				$modal.find('[name="detail-info-url"]').val(_event.detail_info_url);
				$modal.find('.description').val(_event.description);
				$modal.find('.textarea-length-text').text(_event.description.length + '/500');
				$modal.find('#placepicker-add').val(_event.location);
				$modal.find('.organizations.to-select2').select2('val', _event.organization_id);

				if (_event.begin_time == zero_dates && _event.end_time == zero_dates){
					$modal.find('.full-day').prop('checked', true).trigger('change');
				}else{
					var begin_time = moment(_event.begin_time, 'HH:mm:ss'),
						end_time = moment(_event.end_time, 'HH:mm:ss');
					$modal.find('[name="begin-hours"]').val(begin_time.format('HH'));
					$modal.find('[name="begin-minutes"]').val(begin_time.format('mm'));
					$modal.find('[name="end-hours"]').val(end_time.format('HH'));
					$modal.find('[name="end-minutes"]').val(end_time.format('mm'));
				}

				var start_date = moment(_event.event_start_date),
					end_date = moment(_event.event_end_date);

				$('input.daterange')
					.daterangepicker($.extend(daterange_settings, {
						singleDatePicker: start_date.format(__C.DATE_FORMAT) == end_date.format(__C.DATE_FORMAT),
						startDate: start_date,
						endDate: end_date
					}, true));
				bindDatepickerChanger();

				$modal
					.find('.create-event-btn')
					.text('Сохранить')
					.data('event-id', event_id);

				try{
					_location = JSON.parse(_event.location_object);
					if (_location.hasOwnProperty('coordinates')){
						$('.placepicker')
							.attr('data-latitude', _location.coordinates.G)
							.attr('data-longitude', _location.coordinates.K)
							.placepicker('reload');
					}
				}catch(e){
					console.log(e);
				}

				try{
					var notifications = JSON.parse(_event.notifications_schema_json);
					$.each(notifications, function(key, value){
						$modal.find('[name="' + key + '"]')
							.prop('checked', value);
					});
				}catch(e){
					console.log(e);
				}

				$modal.find('.vertical-btn')
					.css('padding-top', '0px')
					.html('<img src="' + _event.image_vertical_url + '">');

				$modal.find('.horizontal-btn')
					.css('padding-top', '0px')
					.html('<img src="' + _event.image_horizontal_url + '">');

				var selected_tags = [];
				_event.tags.forEach(function(tag){
					selected_tags.push(tag.id);
				});
				$modal
					.find('.to-select2.tags')
					.select2('val', selected_tags);
			})
		}
	})
}