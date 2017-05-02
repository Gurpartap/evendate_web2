/**
 * @requires ../Class.Page.js
 */
/**
 *
 * @abstract
 * @class AbstractEditEventPage
 * @extends Page
 */
AbstractEditEventPage = extending(Page, (function() {
	/**
	 *
	 * @constructor
	 * @constructs AbstractEditEventPage
	 */
	function AbstractEditEventPage() {
		Page.call(this);
		
		this.event = new OneEvent();
		this.state_name = 'admin';
		this.organization_id = null;
	}
	
	AbstractEditEventPage.lastRegistrationCustomFieldId = 0;
	
	/**
	 *
	 * @param {RegistrationFieldModel|Array<RegistrationFieldModel>|RegistrationFieldsCollection} [registration_data]
	 * @return {jQuery}
	 */
	AbstractEditEventPage.buildRegistrationCustomField = function(registration_data) {
		registration_data = registration_data ? (registration_data instanceof Array ? registration_data : [registration_data]) : [{}];
		var $fields;
		
		$fields = tmpl('edit-event-registration-custom-field', registration_data.filter(function(data) {
			if (RegistrationFieldModel.isCustomField(data)) {
				data.id = data.id ? data.id : AbstractEditEventPage.lastRegistrationCustomFieldId++;
				return true;
			}
			return false;
		}));
		registration_data.forEach(function(data) {
			if (data.required) {
				$fields.find('#edit_event_registration_'+data.id+'_custom_field_required').prop('checked', true);
			}
			if (data.type) {
				$fields.find('#edit_event_registration_'+data.id+'_custom_field_'+data.type+'_type').prop('checked', true);
			}
		});
		$fields.find('.RemoveRegistrationCustomField').on('click.RemoveRegistrationCustomField', function() {
			$(this).closest('.RegistrationCustomField').remove();
		});
		$fields.find('.RegistrationCustomFieldLabel, .RegistrationCustomFieldType').on('change.RemoveRegistrationFieldUUID', function() {
			$(this).closest('.RegistrationCustomField').find('.RegistrationCustomFieldUUID').val('');
		});
		
		return $fields;
	};
	
	AbstractEditEventPage.prototype.init = function() {
		var PAGE = this,
			$main_tabs = PAGE.$wrapper.find('.EditEventPageTabs'),
			$bottom_nav_buttons = PAGE.$wrapper.find('.edit_event_buttons').children(),
			$next_page_button = $bottom_nav_buttons.filter('#edit_event_next_page'),
			$prev_page_button = $bottom_nav_buttons.filter('#edit_event_prev_page'),
			$submit_button = $bottom_nav_buttons.filter('#edit_event_submit');
		
		/**
		 *
		 * @param {jQuery} $input
		 */
		function convertToNumericInput($input) {
			if($input.is('input')) {
				$input.inputmask({
					alias: 'numeric',
					autoGroup: false,
					digits: 2,
					digitsOptional: true,
					allowPlus: false,
					allowMinus: false,
					rightAlign: false
				});
			} else {
				$input = $input.find('input');
				if($input.length) {
					convertToNumericInput($input);
				}
			}
		}
		
		bindDatePickers(PAGE.$wrapper);
		bindTimeInput(PAGE.$wrapper);
		bindSelect2(PAGE.$wrapper);
		bindTabs(PAGE.$wrapper);
		bindControlSwitch(PAGE.$wrapper);
		bindCallModal(PAGE.$wrapper);
		bindLimitInputSize(PAGE.$wrapper);
		bindRippleEffect(PAGE.$wrapper);
		bindFileLoadButton(PAGE.$wrapper);
		ImgLoader.init(PAGE.$wrapper);
		(function initEditEventMainCalendar() {
			//TODO: Refactor this!! Make it more readable
			var $selected_days_text = PAGE.$wrapper.find('.EventSelectedDaysText'),
				$selected_days_table_rows = PAGE.$wrapper.find('.SelectedDaysRows'),
				MainCalendar = new Calendar('.EventDatesCalendar', {
					weekday_selection: true,
					month_selection: true,
					min_date: moment().format(__C.DATE_FORMAT)
				}),
				AddRowDatePicker = PAGE.$wrapper.find('.AddDayToTable').data('datepicker'),
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
				var $output = $(),
					today = moment().format(__C.DATE_FORMAT);
				if (Array.isArray(selected_days)) {
					selected_days.forEach(function(day) {
						$output = $output.add(tmpl('selected-table-day', {
							date: day,
							formatted_date: day.split('-').reverse().join('.'),
							today: today
						}));
					});
				}
				else {
					$output = tmpl('selected-table-day', {
						date: selected_days,
						formatted_date: selected_days.split('-').reverse().join('.'),
						today: today
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
						$fucking_table.remove(classes.join(', '));
						$fucking_table = $fucking_table.not(classes.join(', '));
					}
					else {
						$fucking_table.remove('.TableDay_' + MainCalendar.last_selected_days);
						$fucking_table = $fucking_table.not('.TableDay_' + MainCalendar.last_selected_days);
					}
				}
				
				doTheFuckingSort($fucking_table, $selected_days_table_rows);
				
				//TODO: Do not forget to rename 'fucking' names
				//TODO: Please, don't forget to rename 'fucking' names
				
			}
			
			buildTable(MainCalendar.selected_days);
			PAGE.$wrapper.find('.SelectedDaysRows').toggleStatus('disabled');
			
			MainCalendar.$calendar.on('days-changed.displayFormattedText', displayFormattedText);
			MainCalendar.$calendar.on('days-changed.buildTable', BuildSelectedDaysTable);
			
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
				if (selected_id && !selected_address) {
					return __APP.changeState('/', true, true);
				}
				
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
		
		bindCollapsing(PAGE.$wrapper);
		
		$main_tabs = $main_tabs.resolveInstance();
		
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
			$this.closest('.form_group').find('input').val($this.data('default_address')).trigger('input');
		});
		
		PAGE.$wrapper.find('#edit_event_is_online').off('change.OnlineEvent').on('change.OnlineEvent', function() {
			PAGE.$wrapper.find('#edit_event_placepicker').prop('required', !$(this).prop('checked'));
		});
		
		PAGE.$wrapper.find('#edit_event_free').off('change.FreeEvent').on('change.FreeEvent', function() {
			PAGE.$wrapper.find('.MinPrice').toggleStatus('disabled');
		});
		
		convertToNumericInput(PAGE.$wrapper.find('.MinPrice'));
		convertToNumericInput(PAGE.$wrapper.find('#edit_event_registration_limit_count'));
		
		PAGE.$wrapper.find('.AddRegistrationCustomField').off('click.AddRegistrationCustomField').on('click.AddRegistrationCustomField', function() {
			AbstractEditEventPage.buildRegistrationCustomField().insertBefore($(this));
		});
		
		PAGE.$wrapper.find('.RegistrationPreview').on('click.RegistrationPreview', function() {
			var form_data = $(this).closest('form').serializeForm(),
				event = new OneEvent(),
				modal;
			
			form_data.registration_fields = (new RegistrationFieldsCollection()).setData(form_data.registration_fields.sort().map(function(field) {
				return {
					uuid: guid(),
					type: form_data['registration_'+field+'_field_type'],
					label: form_data['registration_'+field+'_field_label'] || RegistrationFieldModel.DEFAULT_LABEL[form_data['registration_'+field+'_field_type'].toUpperCase()],
					required: form_data['registration_'+field+'_field_required']
				};
			}));
			event.setData(form_data);
			
			modal = new PreviewRegistrationModal(event);
			modal.show();
		});
		
		$main_tabs.on('change.tabs', function() {
			if($main_tabs.currentTabsIndex === 0){
				$prev_page_button.addClass(__C.CLASSES.HIDDEN);
			} else {
				$prev_page_button.removeClass(__C.CLASSES.HIDDEN);
			}
			if ($main_tabs.currentTabsIndex === $main_tabs.tabsCount - 1) {
				$next_page_button.addClass(__C.CLASSES.HIDDEN);
				$submit_button.removeClass(__C.CLASSES.HIDDEN);
			} else {
				$next_page_button.removeClass(__C.CLASSES.HIDDEN);
				$submit_button.addClass(__C.CLASSES.HIDDEN);
			}
		});
		
		$next_page_button.off('click.nextPage').on('click.nextPage', function() {
			$main_tabs.nextTab();
		});
		
		$prev_page_button.off('click.nextPage').on('click.prevPage', function() {
			$main_tabs.prevTab();
		});
		
		$submit_button.off('click.Submit').on('click.Submit', function submitEditEvent() {
			var $form = PAGE.$wrapper.find("#edit-event-form"),
				/**
				 * @type {Calendar} MainCalendar
				 */
				MainCalendar = PAGE.$wrapper.find('.EventDatesCalendar').resolveInstance(),
				$event_tags = $form.find('input.EventTags'),
				form_data = $form.serializeForm(),
				is_edit = !!(PAGE.event.id),
				send_data,
				is_form_valid,
				$loader = $();
			
			is_form_valid = (function validation($form, Calendar) {
				var is_valid = true,
					$times = $form.find('#edit_event_different_time').prop('checked') ? $form.find('[class^="TableDay_"]') : $form.find('.MainTime');
				
				function failSubmit($element, is_form_valid, error_message){
					var $cut_tab,
						$Tabs;
					if(is_form_valid){
						$cut_tab = $element.parents('.TabsBody:last');
						$Tabs = $cut_tab.closest('.Tabs').resolveInstance();
						$Tabs.setToTab($Tabs.find('.TabsBodyWrapper:first').children().index($cut_tab));
						scrollTo($element, 400, function() {
							showNotifier({text: error_message, status: false});
						});
					}
					handleErrorField($element);
					return false;
				}
				
				$form.find(':required').not($form.find(':disabled')).each(function() {
					var $this = $(this);
					
					if ($this.val().trim() === '') {
						is_valid = failSubmit($this, is_valid, 'Заполните все обязательные поля');
					} else if ($this.hasClass('LimitSize') && $this.val().trim().length > $this.data('maxlength')) {
						is_valid = failSubmit($this, is_valid, 'Количество символов превышает установленное значение');
					}
				});
				
				if (!Calendar.selected_days.length) {
					is_valid = failSubmit(Calendar.$calendar, is_valid, 'Выберите даты для события');
				}
				
				$times.each(function() {
					var $row = $(this),
						$inputs = $row.find('.StartHours, .StartMinutes, .EndHours, .EndMinutes'),
						start = $row.find('.StartHours').val().trim() + $row.find('.StartMinutes').val().trim(),
						end = $row.find('.EndHours').val().trim() + $row.find('.EndMinutes').val().trim();
					
					$inputs.each(function() {
						var $input = $(this);
						if ($input.val().trim() === '') {
							is_valid = failSubmit($input, is_valid, 'Заполните время события');
						}
					});
					if (is_valid && start > end) {
						is_valid = failSubmit($row, is_valid, 'Начальное время не может быть позже конечного');
					}
				});
				
				if ($event_tags.val().trim() === '') {
					is_valid = failSubmit($event_tags.siblings('.EventTags'), is_valid, 'Необходимо выбрать хотя бы один тэг');
				}
				
				if (form_data.registration_limit_by_quantity && (!form_data.registration_fields || !form_data.registration_fields.length)) {
					is_valid = failSubmit($form.find('#edit_event_registration_fields'), is_valid, 'Должно быть выбрано хотя бы одно поле регистрации в анкете');
				}
				
				if (!is_edit) {
					$form.find('.DataUrl').each(function() {
						var $this = $(this);
						if ($this.val().trim() === "") {
							is_valid = failSubmit($this.closest('.ImgLoadWrap'), is_valid, 'Пожалуйста, добавьте к событию обложку');
						}
					});
				}
				
				return is_valid;
			})($form, MainCalendar);
			
			function afterSubmit() {
				PAGE.$wrapper.removeClass(__C.CLASSES.STATUS.DISABLED);
				$loader.remove();
				__APP.changeState('/event/' + PAGE.event.id);
			}
			
			function onError(e) {
				PAGE.$wrapper.removeClass(__C.CLASSES.STATUS.DISABLED);
				$loader.remove();
				console.error(e);
				console.log({
					MainCalendar: MainCalendar,
					send_data: send_data,
					form_data: form_data
				});
			}
			
			if (is_form_valid) {
				PAGE.$wrapper.addClass(__C.CLASSES.STATUS.DISABLED);
				$loader = __APP.BUILD.overlayLoader(PAGE.$view);
				try {
					send_data = {
						event_id: parseInt(form_data.event_id) ? parseInt(form_data.event_id) : null,
						title: form_data.title.trim(),
						organization_id: form_data.organization_id,
						description: form_data.description.trim(),
						is_online: form_data.is_online,
						location: form_data.location && form_data.location.trim() ? form_data.location.trim() : null,
						detail_info_url: form_data.detail_info_url ? form_data.detail_info_url.trim() : null,
						image_horizontal: form_data.image_horizontal,
						filenames: {horizontal: form_data.filename_horizontal},
						is_free: form_data.is_free,
						min_price: form_data.is_free ? null : form_data.min_price
					};
					
					send_data.registration_required = form_data.registration_required;
					if (form_data.registration_required) {
						if (form_data.registration_limit_by_date) {
							send_data.registration_till = moment(
								form_data.registration_till_date + 'T' +
								form_data.registration_till_time_hours + ':' +
								form_data.registration_till_time_minutes + ':00'
							).tz('UTC').format();
						}
						
						if (form_data.registration_limit_by_quantity) {
							send_data.registration_locally = true;
							send_data.registration_limit_count = form_data.registration_limit_count;
						}
						
						if (form_data.registration_fields && form_data.registration_fields.length) {
							send_data.registration_locally = true;
							send_data.registration_fields = (new RegistrationFieldsCollection()).setData(form_data.registration_fields.map(function(id) {
								var field = new RegistrationFieldModel();
								
								field.required = form_data['registration_' + id + '_field_required'];
								if (form_data['registration_' + id + '_field_uuid']) {
									field.uuid = form_data['registration_' + id + '_field_uuid'];
								}
								if (form_data['registration_' + id + '_field_type']) {
									field.type = form_data['registration_' + id + '_field_type'];
								}
								if (form_data['registration_' + id + '_field_label']) {
									field.label = form_data['registration_' + id + '_field_label'].trim();
								}
								
								return field;
							})).getArrayCopy();
						}
					}
					
					if(form_data.tags){
						send_data.tags = form_data.tags.split(',');
					}
					
					send_data.delayed_publication = form_data.delayed_publication;
					if (form_data.delayed_publication) {
						send_data.public_at = moment(
							form_data.public_at_date + 'T' +
							form_data.public_at_time_hours + ':' +
							form_data.public_at_time_minutes + ':00'
						).tz('UTC').format();
					}
					
					send_data.different_time = form_data.different_time;
					send_data.dates = new DateModelsCollection();
					if (form_data.different_time) {
						PAGE.$wrapper.find('.SelectedDaysRows').children().each(function(i, row) {
							var $row = $(row);
							send_data.dates.push((new DateModel()).setData({
								event_date: $row.find('.DatePicker').data('selected_day'),
								start_time: $row.find('.StartHours').val() + ':' + $row.find('.StartMinutes').val(),
								end_time: $row.find('.EndHours').val() + ':' + $row.find('.EndMinutes').val()
							}));
						});
					} else {
						MainCalendar.selected_days.forEach(function(day) {
							send_data.dates.push((new DateModel()).setData({
								event_date: day,
								start_time: form_data.start_hours + ':' + form_data.start_minutes,
								end_time: form_data.end_hours + ':' + form_data.end_minutes
							}));
						});
					}
					send_data.dates = send_data.dates.getArrayCopy();
					
					if (is_edit) {
						PAGE.event.updateEvent(send_data, afterSubmit, onError);
					} else {
						PAGE.event.createEvent(send_data, afterSubmit, onError);
					}
				} catch (e) {
					onError(e);
				}
			}
		});
	};
	
	AbstractEditEventPage.prototype.render = function() {
		var PAGE = this,
			is_edit = !!PAGE.event.id,
			page_vars = $.extend(true, {}, Object.getProps(PAGE.event), {
				event_id: PAGE.event.id ? PAGE.event.id : undefined,
				public_at_data_label: 'Дата',
				current_date: moment().format(__C.DATE_FORMAT),
				tomorrow_date: moment().add(1, 'd').format(__C.DATE_FORMAT),
				button_text: is_edit ? 'Сохранить' : 'Опубликовать'
			}),
			registration_props = {
				registration_limit_count: PAGE.event.registration_limit_count,
				registration_till_display_date: 'Дата',
				tomorrow_date: page_vars.tomorrow_date,
				predefined_field: tmpl('edit-event-registration-predefined-field', [
					{id: AbstractEditEventPage.lastRegistrationCustomFieldId++, type: 'email', name: 'E-mail', description: 'Текстовое поле для ввода адреса электронной почты'},
					{id: AbstractEditEventPage.lastRegistrationCustomFieldId++, type: 'first_name', name: 'Имя', description: 'Текстовое поле для ввода имени'},
					{id: AbstractEditEventPage.lastRegistrationCustomFieldId++, type: 'last_name', name: 'Фамилия', description: 'Текстовое поле для ввода фамилии'},
					{id: AbstractEditEventPage.lastRegistrationCustomFieldId++, type: 'phone_number', name: 'Номер телефона', description: 'Текстовое поля для ввода номера телефона'}
				])
			};
		
		if (!checkRedirect('event/add', (this.organization_id ? '/add/event/to/' + this.organization_id : '/add/event'))) {
			return null;
		}
		
		if (PAGE.event.registration_required) {
			if (PAGE.event.registration_till) {
				var m_registration_till = moment.unix(PAGE.event.registration_till);
				registration_props = $.extend(registration_props, {
					registration_till_display_date: m_registration_till.format(__LOCALES.ru_RU.DATE.DATE_FORMAT),
					registration_till_date: m_registration_till.format(__C.DATE_FORMAT),
					registration_till_time_hours: m_registration_till.format('HH'),
					registration_till_time_minutes: m_registration_till.format('mm')
				});
			}
		}
		
		if (PAGE.event.public_at != null) {
			var m_public_at = moment.unix(PAGE.event.public_at);
			page_vars.public_at_data = m_public_at.format('YYYY-MM-DD');
			page_vars.public_at_data_label = m_public_at.format('DD.MM.YYYY');
			page_vars.public_at_time_hours = m_public_at.format('HH');
			page_vars.public_at_time_minutes = m_public_at.format('mm');
		}
		
		PAGE.$wrapper.html(tmpl('edit-event-page', $.extend(page_vars, {
			date_picker: tmpl('edit-event-datepicker', {
				today: page_vars.current_date
			}),
			cover_picker: tmpl('edit-event-cover-picker', {
				image_horizontal_url: PAGE.event.image_horizontal_url,
				image_horizontal_filename: getFilenameFromURL(PAGE.event.image_horizontal_url)
			}),
			registration: tmpl('edit-event-registration', registration_props)
		})));
		
		PAGE.init();
		
		if(page_vars.public_at != null) {
			PAGE.$wrapper.find('#edit_event_delayed_publication').prop('checked', true).trigger('change');
		}
		
		this.renderRest(page_vars);
	};
	
	AbstractEditEventPage.prototype.renderRest = function(page_vars) {};
	
	return AbstractEditEventPage;
}()));