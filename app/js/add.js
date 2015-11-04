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
	},
	_location = null,
	$text_length = $('.textarea-length-text');

var daterange_settings = {
	singleDatePicker: true,
	locale: {
		format: 'DD/MM/YYYY',
		applyLabel: 'Выбрать',
		cancelLabel: 'Отмена',
		firstDay: 1,
		daysOfWeek: [
			'Вс', 'Пн','Вт','Ср','Чт','Пт','Сб'
		],
		rightDaysOfWeek: ['Пн','Вт','Ср','Чт','Пт','Сб', 'Вс'],
		monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
	},
	startDate: moment(),
	endDate: moment(),
	minDate: moment(),
	maxDate: moment().add(6, 'months'),
	applyClass: 'btn-pink',
	cancelClass: 'btn-pink-empty'
},
	select2_settings = {
		tags: true,
		placeholder: "Выберите до 5 тегов",
		//width: '100%',
		maximumSelectionLength: 5,
		multiple: true,
		ajax: {
			url: '/api/tags/search',
			dataType: 'JSON',
			processResults: function(data) {
				var _data = [];
				data.data.forEach(function(value){
					value.text = value.name;
					_data.push(value);
				});
				return {
					results: _data
				}
			}
		}
	};

function showNotifier(response){
	$.notify({
		'message': response.text,
		'pos': response.pos ? response.pos : 'top-right',
		'status': response.status ? 'success' : 'danger'
	});
}


function updateInputText($el){
	var daterangepicker = $el.data('daterangepicker');
	if (daterangepicker.singleDatePicker){
		var dates = $el.data('dates'),
			_dates_array = [],
			text = '';
		if (dates){
			dates.forEach(function(date){
				date = moment(date);
				_dates_array.push(date.format('DD/MM'));
			});
			text = _dates_array.join(', ')
		}
	}else{

	}
	$el.val(text);
}

function initDayChooserCalendar(month, $el){

	var _now = new Date(),
		current_month = moment(),
		today_date = current_month.format('YYYY-MM-DD'),
		old_dates = $el.data('dates');

	function getDay(m_day, classes){
		var is_disabled, is_today, day_format = m_day.format('YYYY-MM-DD'),
			_dates = $el.data('dates'), is_active;
		is_disabled = m_day._d < _now ? 'disabled': '';
		is_today = day_format == today_date ? 'today' : '';
		is_active = _dates && _dates.indexOf(day_format) != -1 ? __C.CLASSES.ACTIVE : '';
		return '<td data-date="' + day_format + '" class="day ' + ['week-day-' + m_day.day(),day_format, is_active, is_disabled, is_today, classes].join(' ') + '">' + m_day.date() + '</td>';
	}

	function generateHead(moment_month){
		var _head = '<thead><tr>',
			month_name = moment_month.format('MMMM YYYY').capitalize();

		if (moment_month.startOf('month') > current_month.startOf('month')){
			_head += '<th class="prev available"><i class="fa fa-chevron-left glyphicon glyphicon-chevron-left"></i></th>';
		}else{
			_head += '<th></th>';
		}

		_head += '<th colspan="5" class="month">' + month_name + '</th>';

		if (moment_month.startOf('month') <= current_month.startOf('month').add(6, 'months')){
			_head += '<th class="next available"><i class="fa fa-chevron-right glyphicon glyphicon-chevron-right"></i></th>';
		}else{
			_head += '<th></th>';
		}

		_head += '<tr>';
		daterange_settings.locale.rightDaysOfWeek.forEach(function(name, index){
			_head += '<th class="day-title" data-week-day="' + (index + 1) +'">' + name + '</th>';
		});
		_head += '</tr></thead>';

		return _head;
	}

	function generateBody(days){
		var rows = [],
			one_row = [];
		days.forEach(function(day){
			one_row.push(day);
			if (one_row.length == 7){
				rows.push('<tr>' + one_row.join('') + '</tr>');
				one_row = [];
			}
		});
		return rows.join('');
	}

	function createCalendar(type, moment_first_day){
		moment_first_day = moment_first_day.startOf('month');

		var reference_moment = moment_first_day.clone(),
			start_month = moment_first_day.clone(),
			days_in_month = moment_first_day.daysInMonth(),
			days = [];
		for(var k = 0; k < days_in_month; k++){
			days.push(getDay(moment_first_day));
			moment_first_day.add(1, 'days');
		}
		moment_first_day.add(-1, 'days'); // back to start month

		do{
			moment_first_day.add(1, 'days');
			days.push(getDay(moment_first_day, 'next-month'));
		}while(moment_first_day.day() != 0)

		while(start_month.day() != 1){
			start_month.add(-1, 'days');
			days.unshift(getDay(start_month, 'prev-month'));
		}

		var _footer = '';

		if (type == 'right'){
			_footer = '<div class="ranges pull-right">' +
				'<div class="range_inputs">' +
				'<button class="applySingleBtn btn btn-sm btn-pink" type="button">Выбрать</button>' +
				'<button class="cancelSingleBtn btn btn-sm btn-pink-empty" type="button">Отмена</button>' +
				'</div>' +
				'</div>';
		}

		return '<div class="calendar no-max-width ' + type + '" data-month=' + reference_moment.format('YYYY-MM-DD') +'><div class="calendar-table no-border">' +
			'<table class="table-condensed">' +
				generateHead(reference_moment) +
			generateBody(days) +
			'</table>' +
			'</div>'
				+ _footer +
			'</div>';
	}


	function bindCalendarEvents($calendar){

		var daterangepicker = $el.data('daterangepicker');

		$calendar.find('.day').off('click').on('click', function(){
			var $this = $(this);
			if ($this.hasClass(__C.CLASSES.DISABLED) == false){
				$this.toggleClass(__C.CLASSES.ACTIVE);
			}
			var dates = $el.data('dates'),
				_date = $this.data('date');
			if (!dates){
				dates = [];
			}
			if ($this.hasClass(__C.CLASSES.ACTIVE)){
				dates.push(_date);
			}else{
				dates.splice(dates.indexOf(_date), 1);
			}
			$el.data('dates', dates);

			updateInputText($el);

		});
		$calendar.find('.day-title').off('click').on('click', function(){
			var $this = $(this);
			$this.parents('.calendar').find('.week-day-' + $this.data('week-day')+ ':not(.next-month,.prev-month,.disabled)').click();
		});
		$calendar.find('.next').off('click').on('click', function(){
			initDayChooserCalendar(month, $el);
		});
		$calendar.find('.prev').off('click').on('click', function(){
			initDayChooserCalendar(month.add(-2, 'months'), $el);
		});


		$('.applySingleBtn').off('click').on('click', function(){
			daterangepicker.hide();

		});

		$('.cancelSingleBtn').off('click').on('click', function(){
			daterangepicker.hide()
		});
	}


	if (month == null){
		month = moment();
	}

	var $calendar = $(createCalendar('right', month)),
		$picker = $('.daterangepicker');

	$picker.find('.calendar').remove();
	$picker.append($calendar);
	bindCalendarEvents($calendar);
	updateInputText($el);
}

function bindDatepickerChanger(){
	debugger;
	var
		$input = $('input.daterange');
	$('.change-date-range-type').off('click').on('click', function(){
		var $this = $(this);
		daterange_settings.singleDatePicker = $this.data('single-date');

		$input.data('single-date', daterange_settings.singleDatePicker);

		if (daterange_settings.singleDatePicker){
			$input.daterangepicker(daterange_settings);
			$input.data('daterangepicker').show(null, true);
			initDayChooserCalendar(null, $input);
		}else{
			$input.daterangepicker(daterange_settings);
			$input.data('daterangepicker').show();
		}
		bindDatepickerChanger();
		$('.change-date-range-type[data-single-date="' + daterange_settings.singleDatePicker + '"]').addClass('btn-pink').removeClass('btn-pink-empty');
		$('.change-date-range-type[data-single-date="' + !daterange_settings.singleDatePicker + '"]').removeClass('btn-pink').addClass('btn-pink-empty');
	});
}

function bindModalEvents(){
	debugger;
	var $text_length = $('.textarea-length-text');

	function handleFileSelect(evt){
		if (evt.target.files.length == 0) return false;
		var $target = $(evt.target),
			file_orientation = $target.is('#filestyle-0') ? 'vertical' : 'horizontal',
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
				zoomable: true,
				touchDragZoom: true,
				mouseWheelZoom: true,
				cropBoxMovable: true,
				cropBoxResizable: true,
				doubleClickToggle: true,

				wheelZoomRatio: 0.05,
				minCanvasWidth: 400,
				minCanvasHeight: 600,
				minCropBoxWidth: 400,
				minCropBoxHeight: 600,
				minContainerWidth: 400,
				minContainerHeight: 600,

				zoom: function(a, b, c){
					console.log(a, b, c);
				},

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
				$target.wrap('<form>').closest('form').get(0).reset();
				$target.unwrap();
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
			if (f.size / 1024 > 10240){
				showNotifier({status: false, text: 'Извините, максимально допустимый размер изображения - 10 МБ. Уменьште изображение.'});
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

	$('.organizations.to-select2').select2({
		width: '100%',
		templateResult: function(state){
			if (!state.id) { return state.text; }
			var $state_element = $(state.element);

			return $('<span><img src="' + $state_element.data('image-url') + '" class="img-30" /> ' + state.text + '</span>');
		}
	});
	$('.tags.to-select2').select2(select2_settings);

	$('.to-select2.tags').siblings('.select2').find('input').css('width', '100%');

	var $range_input = $('input.daterange'),
		$date_range = $range_input.on('keydown', function(e){
			e.preventDefault();
			return false;
		}).daterangepicker(daterange_settings);
	bindDatepickerChanger();


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
				if ($input.data('single-date')){
					send_data['dates'] = $input.data('dates');
					send_data[$input.attr('name') + '-start'] = null;
					send_data[$input.attr('name') + '-end'] = null;
				}else{
					send_data['dates'] = null;
					send_data[$input.attr('name') + '-start'] = $input.data('daterangepicker').startDate.format('YYYY-MM-DD');
					send_data[$input.attr('name') + '-end'] = $input.data('daterangepicker').endDate.format('YYYY-MM-DD');
				}
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
			if (send_data['end-hours'] == '' && send_data['end-minutes'] == ''){
				//showNotifier({status: false, text: 'Укажите время окончания события'});
				//to_send_flag = false;
				send_data['end-hours'] = null;
				send_data['end-minutes'] = null;
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

		if ((send_data['dates'] != null && send_data['dates'].length == 0) && (send_data['date-start'] == null || send_data['date-start'] == null)){
			showNotifier({status: false, text: 'Укажите дату события'});
			to_send_flag = false;
		}

		console.log(send_data);


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
		});
	});
}

function showAddEventModal(callback){
	$.ajax({
		url: 'api/tags/all',
		success: function(res){
			var _organizations_options = $('<optgroup></optgroup>'),
				hidden_organizations = '';

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
					end_date = moment(_event.event_end_date),
					is_single = start_date.format(__C.DATE_FORMAT) == end_date.format(__C.DATE_FORMAT) || _event.event_start_date == null || _event.event_end_date == null,
					$input = $('input.daterange')

				$input
					.data('dates', _event.dates_range)
					.data('single-date', is_single)
					.daterangepicker($.extend(daterange_settings, {
						singleDatePicker: is_single,
						startDate: _event.event_start_date == null ? null : start_date,
						endDate: _event.event_end_date == null ? null :  end_date
					}));

				bindDatepickerChanger();

				updateInputText($input);

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

				var selected_tags = [],
					$tags_input = $modal.find('.to-select2.tags');
				_event.tags.forEach(function(tag){
					selected_tags.push({
						id: tag.id,
						text: tag.name
					});
				});
				var _settings = $.extend(select2_settings, {
						initSelection: function (element, callback) {
							callback(selected_tags);
						}
					}, true);
				$tags_input.select2('destroy');
				$tags_input
					.select2(_settings);
				$tags_input.siblings('.select2').find('input').css('width', '100%');
			})
		}
	})
}