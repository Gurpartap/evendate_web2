/**
 * @requires ../Class.Page.js
 */
/**
 *
 * @constructor
 * @augments Page
 * @param {(string|number)} [event_id]
 */
function RedactEventPage(event_id) {
	Page.apply(this);
	this.page_title = 'Редактирование события';
	this.is_loading = false;
	
	this.fields = [
		'image_horizontal_large_url',
		'favored{fields:"is_friend",order_by:"-is_friend",length:10}',
		'favored_users_count',
		'is_favorite',
		'notifications{fields:"notification_type,done"}',
		'description',
		'location',
		'can_edit',
		'registration_required',
		'registration_till',
		'is_free',
		'min_price',
		'organization_logo_small_url',
		'organization_short_name',
		'is_same_time',
		'dates{length:0,fields:"start_time,end_time"}',
		'tags',
		'detail_info_url',
		'canceled'
	];
	this.event = new OneEvent(event_id);
	if (event_id) {
		this.is_loading = true;
		this.event.fetchEvent(this.fields, Page.triggerRender);
	}
}
RedactEventPage.extend(Page);

/**
 *
 * @param {jQuery} $context
 * @param {string} source
 * @param {string} filename
 */
RedactEventPage.handleImgUpload = function($context, source, filename) {
	var $parent = $context.closest('.EditEventImgLoadWrap'),
		$preview = $parent.find('.EditEventImgPreview'),
		$file_name_text = $parent.find('.FileNameText'),
		$file_name = $parent.find('.FileName'),
		$data_url = $parent.find('.DataUrl'),
		$button = $parent.find('.CallModal');
	
	$preview.attr('src', source);
	$file_name_text.html('Загружен файл:<br>' + filename);
	$file_name.val(filename);
	$button
		.data('source_img', source)
		.on('crop', function(event, cropped_src, crop_data) {
			$preview.attr('src', cropped_src);
			$button.data('crop_data', crop_data);
			$data_url.val('data.source').data('source', $preview.attr('src')).trigger('change');
		})
		.trigger('click.CallModal');
};

RedactEventPage.prototype.formatVKPost = function() {
	var PAGE = this,
		$post = PAGE.$wrapper.find('#edit_event_vk_post'),
		$title = PAGE.$wrapper.find('#edit_event_title'),
		$calendar = PAGE.$wrapper.find('.EventDatesCalendar').data('calendar'),
		$place = PAGE.$wrapper.find('#edit_event_placepicker'),
		$description = PAGE.$wrapper.find('#edit_event_description'),
		$is_free = PAGE.$wrapper.find('#edit_event_free'),
		$min_price = PAGE.$wrapper.find('#edit_event_min_price'),
		$is_required = PAGE.$wrapper.find('#edit_event_registration_required'),
		$registration_till = PAGE.$wrapper.find('.RegistrationTill'),
		$tags = PAGE.$wrapper.find('.EventTags'),
		tags = [],
		$link = PAGE.$wrapper.find('#edit_event_url'),
		post_text = '';
	
	post_text += $title.val() ? $title.val() + '\n\n' : '';
	
	if ($calendar.selected_days) {
		post_text += ($calendar.selected_days.length > 1) ? 'Дата начала: ' : 'Начало: ';
		post_text += moment($calendar.selected_days[0]).format('D MMMM YYYY');
		if ($calendar.selected_days.length == 1) {
			var $main_time_inputs = PAGE.$wrapper.find('.MainTime').find('input');
			post_text += $main_time_inputs.eq(0).val() ? ' в ' + parseInt($main_time_inputs.eq(0).val()) : '';
			post_text += $main_time_inputs.eq(1).val() ? ':' + $main_time_inputs.eq(1).val() : '';
		}
	}
	if ($is_required.prop('checked')) {
		var $inputs = $registration_till.find('input');
		if ($inputs.eq(0).val()) {
			post_text += ' (регистрация заканчивается: ' + moment($inputs.eq(0).val()).format('D MMMM YYYY');
			post_text += $inputs.eq(1).val() ? ' в ' + parseInt($inputs.eq(1).val()) : '';
			post_text += $inputs.eq(2).val() ? ':' + $inputs.eq(2).val() : '';
			post_text += ')\n';
		} else {
			post_text += '\n';
		}
	} else {
		post_text += '\n';
	}
	post_text += $place.val() ? $place.val() + '\n\n' : '';
	post_text += $description.val() ? $description.val() + '\n\n' : '';
	
	if (!$is_free.prop('checked')) {
		post_text += $min_price.val() ? 'Цена от ' + $min_price.val() + '\n\n' : '';
	}
	
	$tags.find('.select2-search-choice').each(function(i, tag) {
		tags.push('#' + $(tag).text().trim());
	});
	post_text += tags ? tags.join(' ') + '\n\n' : '';
	
	if ($link.val()) {
		post_text += $link.val()
	} else if (PAGE.event.id) {
		post_text += 'https://evendate.ru/event/' + PAGE.event.id;
	}
	
	$post.val(post_text);
};

RedactEventPage.prototype.toggleVkImg = function() {
	var PAGE = this,
		$wrap = PAGE.$wrapper.find('#edit_event_vk_publication').find('.EditEventImgLoadWrap'),
		$left_block = $wrap.children().eq(0),
		$right_block = $wrap.children().eq(1);
	
	if (!$left_block.hasClass('-hidden')) {
		$right_block.find('.LoadImg').off('change.ToggleVkImg').one('change.ToggleVkImg', function() {
			PAGE.toggleVkImg();
		});
		$right_block.find('.Text').text('Добавить картинку');
	} else {
		$right_block.find('.LoadImg').off('change.ToggleVkImg');
		$right_block.find('.Text').text('Изменить');
	}
	$left_block.toggleClass('-hidden');
	$right_block.toggleClass('-align_center');
};

RedactEventPage.prototype.init = function() {
	var PAGE = this;
	
	function submitEditEvent() {
		var $form = PAGE.$wrapper.find("#edit-event-form"),
			data = {
				event_id: null,
				title: null,
				image_horizontal: null,
				organization_id: null,
				location: null,
				description: null,
				detail_info_url: null,
				different_time: null,
				dates: null,
				tags: null,
				registration_required: null,
				registration_till: null,
				is_free: null,
				min_price: null,
				delayed_publication: null,
				public_at: null,
				filenames: {
					horizontal: null
				}
			},
			form_data = $form.serializeForm(),
			tags = form_data.tags ? form_data.tags.split(',') : null,
			is_edit = !!(PAGE.event.id),
			is_form_valid = true,
			$times = $form.find('#edit_event_different_time').prop('checked') ? $form.find('[class^="TableDay_"]') : $form.find('.MainTime');
		
		function afterSubmit() {
			if ($form.find('#edit_event_to_public_vk').prop('checked')) {
				socket.emit('vk.post', {
					guid: data.vk_group,
					event_id: PAGE.event.id,
					message: data.vk_post,
					image: {
						base64: data.vk_image_src,
						filename: data.vk_image_filename
					},
					link: data.detail_info_url
				});
			}
			__APP.changeState('/event/' + PAGE.event.id);
		}
		
		function onError() {
			PAGE.$wrapper.removeClass('-faded');
		}
		
		$form.find(':required').not(':disabled').each(function() {
			var $this = $(this),
				max_length = $this.data('maxlength');
			if ($this.val() === "" || (max_length && $this.val().length > max_length)) {
				if (is_form_valid) {
					$('body').stop().animate({scrollTop: Math.ceil($this.offset().top - 150)}, 1000, 'swing');
				}
				handleErrorField($this);
				is_form_valid = false;
			}
		});
		
		$times.each(function() {
			var $row = $(this),
				start = $row.find('.StartHours').val() + $row.find('.StartMinutes').val(),
				end = $row.find('.EndHours').val() + $row.find('.EndMinutes').val();
			if (start > end) {
				if (is_form_valid) {
					$('body').stop().animate({scrollTop: Math.ceil($row.offset().top - 150)}, 1000, 'swing');
				}
				showNotifier({text: 'Начальное время не может быть меньше конечного', status: false});
				is_form_valid = false;
			}
		});
		
		if (!is_edit) {
			$form.find('.DataUrl').each(function() {
				var $this = $(this);
				if ($this.val() === "") {
					if (is_form_valid) {
						$('body').stop().animate({scrollTop: Math.ceil($this.closest('.EditEventImgLoadWrap').offset().top - 150)}, 1000, 'swing', function() {
							showNotifier({text: 'Пожалуйста, добавьте к событию обложку', status: false})
						});
					}
					is_form_valid = false;
				}
			});
		}
		
		if (is_form_valid) {
			$.extend(true, data, form_data);
			
			data.tags = tags;
			data.filenames = {
				horizontal: data.filename_horizontal
			};
			if (data.registration_required) {
				data.registration_till = "" + data.registration_till_date + 'T' + data.registration_till_time_hours + ':' + data.registration_till_time_minutes + ':00'
			}
			if (data.delayed_publication) {
				data.public_at = "" + data.public_at_date + 'T' + data.public_at_time_hours + ':' + data.public_at_time_minutes + ':00'
			}
			
			data.dates = [];
			if (data.different_time) {
				var selected_days_rows = $('.SelectedDaysRows').children();
				
				selected_days_rows.each(function() {
					var $this = $(this);
					data.dates.push({
						event_date: $this.find('.DatePicker').data('selected_day'),
						start_time: $this.find('.StartHours').val() + ':' + $this.find('.StartMinutes').val(),
						end_time: $this.find('.EndHours').val() + ':' + $this.find('.EndMinutes').val()
					});
				});
			} else {
				var MainCalendar = $('.EventDatesCalendar').data('calendar'),
					$main_time = $('.MainTime'),
					start_time = $main_time.find('.StartHours').val() + ':' + $main_time.find('.StartMinutes').val(),
					end_time = $main_time.find('.EndHours').val() + ':' + $main_time.find('.EndMinutes').val();
				
				MainCalendar.selected_days.forEach(function(day) {
					data.dates.push({
						event_date: day,
						start_time: start_time,
						end_time: end_time
					})
				});
			}
			
			PAGE.$wrapper.addClass('-faded');
			try {
				if (is_edit) {
					PAGE.event.updateEvent(data, afterSubmit, onError);
				} else {
					PAGE.event.createEvent(data, afterSubmit, onError);
				}
			} catch (e) {
				PAGE.$wrapper.removeClass('-faded');
				console.error(e);
			}
		}
	}
	
	bindDatePickers(PAGE.$wrapper);
	bindTimeInput(PAGE.$wrapper);
	bindSelect2(PAGE.$wrapper);
	bindTabs(PAGE.$wrapper);
	__APP.MODALS.bindCallModal(PAGE.$wrapper);
	bindLimitInputSize(PAGE.$wrapper);
	bindRippleEffect(PAGE.$wrapper);
	bindFileLoadButton(PAGE.$wrapper);
	(function bindLoadByURLButton() {
		$('.LoadByURLButton').not('-Handled_LoadByURLButton').on('click', function() {
			var $this = $(this),
				$input = $('#' + $this.data('load_input'));
			$this.data('url', $input.val());
			window.current_load_button = $this;
			socket.emit('image.getFromURL', $input.val());
			window.paceOptions = {
				catchupTime: 10000,
				maxProgressPerFrame: 1,
				ghostTime: Number.MAX_SAFE_INTEGER,
				checkInterval: {
					checkInterval: 10000
				},
				eventLag: {
					minSamples: 1,
					sampleCount: 30000000,
					lagThreshold: 0.1
				}
			}; //хз зачем, все равно не работает
			Pace.restart();
		}).addClass('-Handled_LoadByURLButton');
	})();
	(function initEditEventMainCalendar() {
		//TODO: Refactor this!! Make it more readable
		var $selected_days_text = PAGE.$wrapper.find('.EventSelectedDaysText'),
			$selected_days_table_rows = PAGE.$wrapper.find('.SelectedDaysRows'),
			MainCalendar = new Calendar('.EventDatesCalendar', {
				weekday_selection: true,
				month_selection: true,
				min_date: moment().format(__C.DATE_FORMAT)
			}),
			dates = {},
			genitive_month_names = {
				'январь': 'января',
				'февраль': 'февраля',
				'март': 'марта',
				'апрель': 'апреля',
				'май': 'мая',
				'июнь': 'июня',
				'июль': 'июля',
				'август': 'августа',
				'сентябрь': 'сентября',
				'октябрь': 'октября',
				'ноябрь': 'ноября',
				'декабрь': 'декабря'
			},
			$fucking_table = $();
		MainCalendar.init();
		MainCalendar.$calendar.on('days-changed.displayFormattedText', displayFormattedText);
		
		function bindRemoveRow($parent) {
			$parent.find('.RemoveRow').not('.-Handled_RemoveRow').each(function(i, elem) {
				$(elem).on('click', function() {
					MainCalendar.deselectDays($(this).closest('tr').data('date'));
				}).addClass('-Handled_RemoveRow');
			});
		}
		
		function displayFormattedText() {
			dates = {};
			MainCalendar.selected_days.forEach(function(date, i, days) {
				var _date = moment(date);
				
				if (typeof dates[_date.month()] === 'undefined') {
					dates[_date.month()] = {};
					dates[_date.month()].selected_days = [];
					dates[_date.month()].month_name = genitive_month_names[_date.format('MMMM')];
				}
				dates[_date.month()].selected_days.push(_date.date());
			});
			
			$selected_days_text.empty().removeClass('hidden');
			if (Object.keys(dates).length) {
				$.each(dates, function(i, elem) {
					$selected_days_text.append($('<p>').text(elem.selected_days.join(', ') + ' ' + elem.month_name))
				});
			} else {
				$selected_days_text.html('<p>Даты не выбраны</p>');
			}
		}
		
		function doTheFuckingSort($rows, $parent) {
			$rows.sort(function(a, b) {
				var an = $(a).data('date'),
					bn = $(b).data('date');
				
				if (an > bn) return 1;
				else if (an < bn) return -1;
				else return 0;
			});
			$rows.detach().appendTo($parent);
		}
		
		function buildTable(selected_days) {
			//TODO: BUG. On multiple selection (month or weekday) duplicates appearing in table.
			//TODO: Bind time on building table
			var $output = $();
			if (Array.isArray(selected_days)) {
				selected_days.forEach(function(day) {
					$output = $output.add(tmpl('selected-table-day', {
						date: day,
						formatted_date: day.split('-').reverse().join('.')
					}));
				});
			}
			else {
				$output = tmpl('selected-table-day', {
					date: selected_days,
					formatted_date: selected_days.split('-').reverse().join('.')
				});
			}
			bindDatePickers($output);
			bindTimeInput($output);
			bindRemoveRow($output);
			
			$fucking_table = $fucking_table.add($output);
			$output.find('.DatePicker').each(function() {
				var DP = $(this).data('datepicker');
				DP.$datepicker.on('date-picked', function() {
					MainCalendar.deselectDays(DP.prev_selected_day).selectDays(DP.selected_day);
					doTheFuckingSort($fucking_table, $selected_days_table_rows)
				});
			});
			doTheFuckingSort($fucking_table, $selected_days_table_rows);
		}
		
		function BuildSelectedDaysTable() {
			if (MainCalendar.last_action === 'select') {
				buildTable(MainCalendar.last_selected_days);
			}
			else if (MainCalendar.last_action === 'deselect') {
				if (Array.isArray(MainCalendar.last_selected_days)) {
					var classes = [];
					MainCalendar.last_selected_days.forEach(function(day) {
						classes.push('.TableDay_' + day);
					});
					$fucking_table.detach(classes.join(', '));
					$fucking_table = $fucking_table.not(classes.join(', '));
				}
				else {
					$fucking_table.detach('.TableDay_' + MainCalendar.last_selected_days);
					$fucking_table = $fucking_table.not('.TableDay_' + MainCalendar.last_selected_days);
				}
			}
			
			doTheFuckingSort($fucking_table, $selected_days_table_rows);
			
			//TODO: Do not forget to rename 'fucking' names
			//TODO: Please, don't forget to rename 'fucking' names
			
		}
		
		PAGE.$wrapper.find('#edit_event_different_time').on('change', function() {
			var $table_wrapper = PAGE.$wrapper.find('#edit_event_selected_days_wrapper'),
				$table_content = $table_wrapper.children();
			if ($(this).prop('checked')) {
				buildTable(MainCalendar.selected_days);
				$table_wrapper.height($table_content.height()).one('transitionend', function() {
					$table_wrapper.css({
						'height': 'auto',
						'overflow': 'visible'
					})
				});
				MainCalendar.$calendar.on('days-changed.buildTable', BuildSelectedDaysTable);
			} else {
				$table_wrapper.css({
					'height': $table_content.height(),
					'overflow': 'hidden'
				}).height(0);
				$fucking_table.remove();
				MainCalendar.$calendar.off('days-changed.buildTable');
			}
			PAGE.$wrapper.find('.MainTime').toggleStatus('disabled');
		});
		
		var AddRowDatePicker = PAGE.$wrapper.find('.AddDayToTable').data('datepicker');
		AddRowDatePicker.$datepicker.on('date-picked', function() {
			MainCalendar.selectDays(AddRowDatePicker.selected_day);
		});
		
	})();
	(function initOrganization(selected_id) {
		OrganizationsCollection.fetchMyOrganizations(['admin', 'moderator'], {fields: ['default_address']}, function(data) {
			var $wrapper = $('.EditEventOrganizations'),
				organizations_options = $(),
				$default_address_button = PAGE.$wrapper.find('.EditEventDefaultAddress'),
				$select = $wrapper.find('#edit_event_organization'),
				selected_address;
			
			data.forEach(function(organization) {
				if (organization.id == selected_id) {
					selected_address = organization.default_address;
				}
				organizations_options = organizations_options.add(tmpl('option', {
					val: organization.id,
					data: "data-image-url='" + organization.img_url + "' data-default-address='" + organization.default_address + "'",
					display_name: organization.name
				}));
			});
			
			$select.append(organizations_options).select2({
				containerCssClass: 'form_select2',
				dropdownCssClass: 'form_select2_drop'
			}).on('change', function() {
				$default_address_button.data('default_address', $(this).children(":selected").data('default-address'));
			});
			if (selected_id) {
				$select.select2('val', selected_id);
				$default_address_button.data('default_address', selected_address);
			} else {
				$default_address_button.data('default_address', data[0].default_address);
			}
			if (organizations_options.length > 1) {
				$wrapper.removeClass('-hidden');
			} else {
				$wrapper.addClass('-hidden');
			}
		});
	})(PAGE.event.organization_id);
	(function checkVkPublicationAbility() {
		if (__APP.USER.accounts.indexOf("vk") !== -1) {
			socket.emit('vk.getGroupsToPost', __APP.USER.id);
			PAGE.$wrapper
				.find(
					'#edit_event_title,' +
					'#edit_event_placepicker,' +
					'#edit_event_description,' +
					'#edit_event_free,' +
					'#edit_event_min_price,' +
					'#edit_event_registration_required,' +
					'#edit_event_url,' +
					'.EventTags'
				)
				.add('.RegistrationTill input')
				.add('.MainTime input')
				.on('change.FormatVkPost', function() { PAGE.formatVKPost(); });
			PAGE.$wrapper.find('.EventDatesCalendar').data('calendar').$calendar.on('days-changed.FormatVkPost', function() { PAGE.formatVKPost(); });
		} else {
			PAGE.$wrapper.find('#edit_event_to_public_vk').toggleStatus('disabled');
		}
	})();
	
	//TODO: perepilit' placepicker
	PAGE.$wrapper.find(".Placepicker").placepicker();
	
	PAGE.$wrapper.find('.EventTags').select2({
		tags: true,
		width: '100%',
		placeholder: "Выберите до 5 тегов",
		maximumSelectionLength: 5,
		maximumSelectionSize: 5,
		tokenSeparators: [',', ';'],
		multiple: true,
		createSearchChoice: function(term, data) {
			if ($(data).filter(function() {
					return this.text.localeCompare(term) === 0;
				}).length === 0) {
				return {
					id: term,
					text: term
				};
			}
		},
		ajax: {
			url: '/api/v1/tags/',
			dataType: 'JSON',
			data: function(term, page) {
				return {
					name: term // search term
				};
			},
			results: function(data) {
				var _data = [];
				data.data.forEach(function(value) {
					value.text = value.name;
					_data.push(value);
				});
				return {
					results: _data
				}
			}
		},
		containerCssClass: "form_select2",
		dropdownCssClass: "form_select2_drop"
	});
	
	PAGE.$wrapper.find('.EditEventDefaultAddress').off('click.defaultAddress').on('click.defaultAddress', function() {
		var $this = $(this);
		$this.closest('.form_group').find('input').val($this.data('default_address'))
	});
	
	PAGE.$wrapper.find('#edit_event_delayed_publication').off('change.DelayedPublication').on('change.DelayedPublication', function() {
		PAGE.$wrapper.find('.DelayedPublication').toggleStatus('disabled');
	});
	
	PAGE.$wrapper.find('#edit_event_registration_required').off('change.RequireRegistration').on('change.RequireRegistration', function() {
		PAGE.$wrapper.find('.RegistrationTill').toggleStatus('disabled');
	});
	
	PAGE.$wrapper.find('#edit_event_free').off('change.FreeEvent').on('change.FreeEvent', function() {
		PAGE.$wrapper.find('.MinPrice').toggleStatus('disabled');
	});
	
	PAGE.$wrapper.find('.MinPrice').find('input').inputmask({
		'alias': 'numeric',
		'autoGroup': false,
		'digits': 2,
		'digitsOptional': true,
		'placeholder': '0',
		'rightAlign': false
	});
	
	PAGE.$wrapper.find('.LoadImg').off('change.LoadImg').on('change.LoadImg', function(e) {
		var $this = $(e.target),
			files = e.target.files,
			reader;
		
		if (files.length == 0) return false;
		for (var i = 0, f; f = files[i]; i++) {
			reader = new FileReader();
			if (!f.type.match('image.*'))  continue;
			reader.onload = (function(the_file) {
				return function(e) {
					RedactEventPage.handleImgUpload($this, e.target.result, the_file.name);
				};
			})(f);
			reader.readAsDataURL(f);
		}
		
	});
	
	PAGE.$wrapper.find('#edit_event_to_public_vk').off('change.PublicVK').on('change.PublicVK', function() {
		var $vk_post_wrapper = PAGE.$wrapper.find('#edit_event_vk_publication'),
			$vk_post_content = $vk_post_wrapper.children();
		if ($(this).prop('checked')) {
			$vk_post_wrapper.height($vk_post_content.height());
		} else {
			$vk_post_wrapper.height(0);
		}
		$vk_post_wrapper.toggleStatus('disabled');
		
		$vk_post_content.find('.DeleteImg').off('click.DeleteImg').on('click.DeleteImg', function() {
			$(this).closest('.EditEventImgLoadWrap').find('input').val('').end().find('img').attr('src', '');
			PAGE.toggleVkImg();
		})
		
	});
	
	PAGE.$wrapper.find('#edit_event_submit').off('click.Submit').on('click.Submit', submitEditEvent);
};

RedactEventPage.prototype.render = function() {
	var PAGE = this,
		is_edit = !!PAGE.event.id,
		page_vars = {
			event_id: PAGE.event.id ? PAGE.event.id : undefined,
			public_at_data_label: 'Дата',
			registration_till_data_label: 'Дата',
			current_date: moment().format(__C.DATE_FORMAT),
			tomorrow_date: moment().add(1, 'd').format(__C.DATE_FORMAT)
		};
	
	
	if(__APP.USER.id === -1){
		__APP.changeState('/feed/actual', true, true);
		return null;
	}
	
	function selectDates($view, raw_dates) {
		var MainCalendar = $view.find('.EventDatesCalendar').data('calendar'),
			$table_rows = $view.find('.SelectedDaysRows'),
			dates = [];
		raw_dates.forEach(function(date) {
			date.event_date = moment.unix(date.event_date).format('YYYY-MM-DD');
			dates.push(date.event_date);
		});
		MainCalendar.selectDays(dates);
		raw_dates.forEach(function(date) {
			var $day_row = $table_rows.find('.TableDay_' + date.event_date),
				start_time = date.start_time.split(':'),
				end_time = date.end_time ? date.end_time.split(':') : [];
			$day_row.find('.StartHours').val(start_time[0]);
			$day_row.find('.StartMinutes').val(start_time[1]);
			if (end_time.length) {
				$day_row.find('.EndHours').val(end_time[0]);
				$day_row.find('.EndMinutes').val(end_time[1]);
			}
		});
	}
	
	function selectTags($view, tags) {
		var selected_tags = [];
		tags.forEach(function(tag) {
			selected_tags.push({
				id: parseInt(tag.id),
				text: tag.name
			});
		});
		
		$view.find('#event_tags').select2('data', selected_tags);
	}
	
	function initVkImgCopying() {
		var $vk_wrapper = PAGE.$wrapper.find('#edit_event_vk_publication');
		PAGE.$wrapper.find('#edit_event_image_horizontal_src').on('change.CopyToVkImg', function() {
			var $wrap = $(this).closest('.EditEventImgLoadWrap'),
				$vk_wrap = PAGE.$wrapper.find('#edit_event_vk_publication'),
				$vk_preview = $vk_wrap.find('.EditEventImgPreview'),
				$vk_button = $vk_wrap.find('.CallModal'),
				$vk_$data_url = $vk_wrap.find('#edit_event_vk_image_src'),
				$button_orig = $wrap.find('.CallModal'),
				src = $(this).data('source');
			
			if (!PAGE.$wrapper.find('.edit_event_vk_right_block').hasClass('-align_center')) {
				PAGE.toggleVkImg();
			}
			$vk_$data_url.val('data.source').data('source', src);
			$vk_preview.attr('src', src);
			$vk_wrap.find('#edit_event_vk_image_filename').val(PAGE.$wrapper.find('#edit_event_image_horizontal_filename').val());
			$vk_button
				.data('crop_data', $button_orig.data('crop_data'))
				.data('source_img', $button_orig.data('source_img'))
				.on('crop', function(event, cropped_src, crop_data) {
					$vk_preview.attr('src', cropped_src);
					$vk_button.data('crop_data', crop_data);
					$vk_$data_url.data('source', $vk_preview.attr('src')).trigger('change');
				});
			
		});
		$vk_wrapper.find('.FileLoadButton, .CallModal, .DeleteImg').on('click.OffCopying', function() {
			PAGE.$wrapper.find('#edit_event_image_horizontal_src').off('change.CopyToVkImg');
		});
	}
	
	if (!is_edit) {
		page_vars.header_text = 'Новое событие';
		page_vars.button_text = 'Опубликовать';
		PAGE.$wrapper.html(tmpl('edit-event-page', page_vars));
		PAGE.init();
		PAGE.toggleVkImg();
		initVkImgCopying();
	} else {
		page_vars.header_text = 'Редактирование события';
		page_vars.button_text = 'Сохранить';
		if (PAGE.event.public_at !== null) {
			var m_public_at = moment(PAGE.event.public_at);
			page_vars.public_at_data = m_public_at.format('YYYY-MM-DD');
			page_vars.public_at_data_label = m_public_at.format('DD.MM.YYYY');
			page_vars.public_at_time_hours = m_public_at.format('HH');
			page_vars.public_at_time_minutes = m_public_at.format('mm');
		}
		if (PAGE.event.registration_required) {
			var m_registration_till = moment.unix(PAGE.event.registration_till);
			page_vars.registration_till_data = m_registration_till.format('YYYY-MM-DD');
			page_vars.registration_till_data_label = m_registration_till.format('DD.MM.YYYY');
			page_vars.registration_till_time_hours = m_registration_till.format('HH');
			page_vars.registration_till_time_minutes = m_registration_till.format('mm');
		}
		if (PAGE.event.image_horizontal_url) {
			page_vars.image_horizontal_filename = PAGE.event.image_horizontal_url.split('/').reverse()[0];
			page_vars.vk_image_url = PAGE.event.image_horizontal_url;
			page_vars.vk_image_filename = page_vars.image_horizontal_filename;
		}
		if (PAGE.event.vk_image_url) {
			page_vars.vk_image_url = PAGE.event.vk_image_url;
			page_vars.vk_image_filename = PAGE.event.vk_image_url.split('/').reverse()[0];
		}
		
		page_vars = $.extend(true, {}, PAGE.event, page_vars);
		PAGE.$wrapper.html(tmpl('edit-event-page', page_vars));
		PAGE.init();
		
		if (PAGE.event.is_same_time) {
			var $day_row = PAGE.$wrapper.find('.MainTime'),
				start_time = PAGE.event.dates[0].start_time.split(':'),
				end_time = PAGE.event.dates[0].end_time ? PAGE.event.dates[0].end_time.split(':') : [];
			$day_row.find('.StartHours').val(start_time[0]);
			$day_row.find('.StartMinutes').val(start_time[1]);
			if (end_time.length) {
				$day_row.find('.EndHours').val(end_time[0]);
				$day_row.find('.EndMinutes').val(end_time[1]);
			}
		} else {
			PAGE.$wrapper.find('#edit_event_different_time').prop('checked', true).trigger('change');
		}
		selectDates(PAGE.$wrapper, PAGE.event.dates);
		selectTags(PAGE.$wrapper, PAGE.event.tags);
		
		if (PAGE.event.image_horizontal_url) {
			toDataUrl(PAGE.event.image_horizontal_url, function(base64_string) {
				PAGE.$wrapper.find('#edit_event_image_horizontal_src').val(base64_string ? base64_string : null);
			});
			PAGE.$wrapper.find('.CallModal').removeClass('-hidden').on('crop', function(event, cropped_src, crop_data) {
				var $button = $(this),
					$parent = $button.closest('.EditEventImgLoadWrap'),
					$preview = $parent.find('.EditEventImgPreview'),
					$data_url = $parent.find('.DataUrl');
				$data_url.val('data.source').data('source', $preview.attr('src')).trigger('change');
				$preview.attr('src', cropped_src);
				$button.data('crop_data', crop_data);
			});
		}
		if (page_vars.vk_image_url) {
			toDataUrl(page_vars.vk_image_url, function(base64_string) {
				PAGE.$wrapper.find('#edit_event_vk_image_src').val(base64_string ? base64_string : null);
			});
		} else {
			PAGE.toggleVkImg();
		}
		
		if (!PAGE.event.is_free) {
			PAGE.$wrapper.find('#edit_event_free').prop('checked', false).trigger('change');
			PAGE.$wrapper.find('#edit_event_min_price').val(PAGE.event.min_price);
		}
		if (PAGE.event.registration_required) {
			PAGE.$wrapper.find('#edit_event_registration_required').prop('checked', true).trigger('change');
		}
		if (PAGE.event.public_at !== null) {
			PAGE.$wrapper.find('#edit_event_delayed_publication').prop('checked', true).trigger('change');
		}
		PAGE.formatVKPost();
	}
};