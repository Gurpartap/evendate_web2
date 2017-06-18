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
	 *
	 * @property {OneEvent} event
	 * @property {string} state_name
	 * @property {?(string|number)} organization_id
	 * @property {?Calendar} MainCalendar
	 * @property {OrganizationsCollection} my_organizations
	 * @property {Fields} my_organizations_fields
	 * @property {boolean} is_edit
	 */
	function AbstractEditEventPage() {
		var self = this;
		
		Page.call(this);
		
		this.event = new OneEvent();
		this.state_name = 'admin';
		this.organization_id = null;
		
		this.MainCalendar = null;
		
		this.my_organizations = new OrganizationsCollection();
		this.my_organizations_fields = new Fields(
			'default_address', {
				tariff: {
					fields: new Fields(
						'available_event_publications',
						'available_additional_notifications'
					)
				}
			}
		);
		
		Object.defineProperty(this, 'is_edit', {
			get: function() {
				return !!self.event.id;
			}
		});
	}
	
	AbstractEditEventPage.lastRegistrationCustomFieldId = 0;
	
	AbstractEditEventPage.prototype.fetchData = function() {
		return this.fetching_data_defer = this.my_organizations.fetchMyOrganizations(['admin', 'moderator'], this.my_organizations_fields);
	};
	/**
	 *
	 * @return {OneEventCreateEventData}
	 */
	AbstractEditEventPage.prototype.gatherSendData = function() {
		var form_data = this.$wrapper.find('.EditEventForm').serializeForm(),
			send_data =  {
				event_id: parseInt(form_data.event_id) ? parseInt(form_data.event_id) : null,
				title: form_data.title ? form_data.title.trim() : '',
				organization_id: form_data.organization_id,
				description: form_data.description ? form_data.description.trim() : '',
				different_time: !!form_data.different_time,
				dates: new DateModelsCollection(),
				is_online: !!form_data.is_online,
				location: form_data.location && form_data.location.trim() ? form_data.location.trim() : null,
				detail_info_url: form_data.detail_info_url ? form_data.detail_info_url.trim() : null,
				image_horizontal: form_data.image_horizontal,
				filenames: {horizontal: form_data.filename_horizontal},
				is_free: !!form_data.is_free,
				vk_post: !!form_data.vk_post,
				min_price: form_data.is_free ? null : form_data.min_price,
				delayed_publication: !!form_data.delayed_publication,
				registration_required: !!form_data.registration_required,
				registration_locally: !!form_data.registration_locally,
				registration_approvement_required: !!form_data.registration_approvement_required
			};
		
		if (form_data.registration_required) {
			
			if (form_data.registration_limit_by_date) {
				send_data.registration_till = moment(form_data.registration_till_date + ' ' +	form_data.registration_till_time).tz('UTC').format();
			}
			
			if (form_data.registration_limit_by_quantity) {
				send_data.registration_limit_count = form_data.registration_limit_count;
			}
			
			if (form_data.registration_fields && form_data.registration_fields.length) {
				send_data.registration_fields = (new RegistrationFieldModelsCollection()).setData(form_data.registration_fields.map(function(id) {
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
		
		if (form_data.delayed_publication) {
			send_data.public_at = moment(form_data.public_at_date + ' ' + form_data.public_at_time).tz('UTC').format();
		}
		
		if (form_data.additional_notification) {
			send_data.additional_notification_time = moment(form_data.additional_notification_date + ' ' + form_data.additional_notification_time).tz('UTC').format();
		}
		
		if (form_data.different_time) {
			if (!(form_data.event_date instanceof Array)) {
				form_data.event_date = [form_data.event_date];
				form_data.start_time = [form_data.start_time];
				form_data.end_time = [form_data.end_time];
			}
			
			send_data.dates.setData(form_data.event_date.map(function(date, i) {
				
				return {
					event_date: date,
					start_time: form_data.start_time[i],
					end_time: form_data.end_time[i]
				};
			}));
		} else {
			send_data.dates.setData(this.MainCalendar.selected_days.map(function(day) {
				
				return {
					event_date: day,
					start_time: form_data.start_time,
					end_time: form_data.end_time
				};
			}));
		}
		send_data.dates = send_data.dates.getArrayCopy();
		
		if (form_data.vk_post) {
			send_data.vk = {
				guid: form_data.vk_guid,
				image: form_data.vk_image,
				filename: form_data.vk_filename,
				description: form_data.vk_description
			}
		}
		
		return send_data;
	};
	/**
	 *
	 * @param {RegistrationFieldModel|Array<RegistrationFieldModel>|RegistrationFieldModelsCollection} [registration_data]
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
	
	AbstractEditEventPage.prototype.checkTariffAvailabilities = function() {
		var self = this,
			organization = self.my_organizations.getByID(self.organization_id),
			$form_overall_fields = self.$wrapper.find('.FormOverallFields'),
			$additional_notification_switch = self.$wrapper.find('.AdditionalNotificationSwitch'),
			$available_event_publications_wrapper = self.$wrapper.find('.AvailableEventPublicationsWrapper');
		
		if (organization.tariff.available_additional_notifications) {
			$additional_notification_switch.prop('disabled', false);
			$additional_notification_switch.closest('.AdditionalNotificationSwitchParent').removeClass(__C.CLASSES.STATUS.DISABLED);
			self.$wrapper.find('.BuySubscriptionLink').addClass(__C.CLASSES.HIDDEN);
		} else {
			if ($additional_notification_switch.prop('checked')) {
				$additional_notification_switch.prop('checked', false).trigger('change');
			}
			$additional_notification_switch.prop('disabled', true);
			$additional_notification_switch.closest('.AdditionalNotificationSwitchParent').addClass(__C.CLASSES.STATUS.DISABLED);
			self.$wrapper.find('.BuySubscriptionLink').removeClass(__C.CLASSES.HIDDEN).attr('href', '/admin/organization/'+ self.organization_id +'/settings#change_tariff');
		}
		
		if (organization.tariff.available_event_publications <= 5) {
			$available_event_publications_wrapper.removeClass(__C.CLASSES.HIDDEN);
			$available_event_publications_wrapper.find('.AvailableEventPublications').text(organization.tariff.available_event_publications);
		} else {
			$available_event_publications_wrapper.addClass(__C.CLASSES.HIDDEN);
		}
		$form_overall_fields.attr('disabled', (organization.tariff.available_event_publications <= 0 && !self.is_edit));
	};
	
	
	
	AbstractEditEventPage.prototype.initCrossPosting = function() {
		var self = this;
		
		this.$wrapper.find('.OnChangeCrossPost').on('change.crossPostingToVK', function() {
			self.formatVKPost();
		});
		this.MainCalendar.$calendar.on('change:days.crossPostingToVK', function() {
			self.formatVKPost();
		});
		this.$wrapper.find('.VKPostText').one('dblclick', function() {
			self.deInitCrossPosting();
			$(this).removeAttr('readonly');
		});
		
		(function initVKImageCoping() {
			var $wrapper = self.$wrapper.find('.EventEditHorizontalImageHolder'),
				$src = $wrapper.find('.ImgSrc'),
				$file_name = $wrapper.find('.FileName'),
				$vk_wrapper = self.$wrapper.find('.EditEventVKImageHolder'),
				$vk_preview = $vk_wrapper.find('.ImgPreview'),
				$vk_src = $vk_wrapper.find('.ImgSrc'),
				$vk_file_name = $vk_wrapper.find('.FileName'),
				mutation_observer = new MutationObserver(function() {
					var src = $src.val();
					
					$vk_preview.attr('src', $src.val());
					$vk_src.val($src.val());
					$vk_file_name.val($file_name.val());
				});
			
			mutation_observer.observe($src.get(0), {
				attributes: true
			})
		})();
	};
	
	AbstractEditEventPage.prototype.deInitCrossPosting = function() {
		this.$wrapper.find('.OnChangeCrossPost').off('change.crossPostingToVK');
		this.MainCalendar.$calendar.off('change:days.crossPostingToVK');
	};
	
	AbstractEditEventPage.prototype.formatVKPost = function() {
		var data = this.gatherSendData(),
			post_text = '',
			m_registration_till;
		
		post_text += data.title ? data.title + '\n\n' : '';
		
		if (data.dates && data.dates.length) {
			post_text += (data.dates.length > 1) ? 'Дата начала: ' : 'Начало: ';
			post_text += moment(data.dates[0].event_date).format('D MMMM YYYY');
			
			if (data.dates.length === 1 && data.dates[0].start_time) {
				post_text += ' в ' + data.dates[0].start_time;
			}
		}
		
		if (data.registration_required && data.registration_till) {
			m_registration_till = moment(data.registration_till);
			post_text += ' (регистрация заканчивается: ' + m_registration_till.format('D MMMM YYYY') + ' в ' + m_registration_till.format('HH:mm') + ')\n';
		} else {
			post_text += '\n';
		}
		
		
		post_text += data.location ? data.location + '\n\n' : '';
		post_text += data.description ? data.description + '\n\n' : '';
		
		if (!data.is_free) {
			post_text += data.min_price ? 'Цена от ' + data.min_price + '\n\n' : '';
		}
		
		
		if (data.detail_info_url) {
			post_text += data.detail_info_url;
		} else if (data.event_id) {
			post_text += 'https://evendate.ru/event/' + data.event_id;
		}
		
		
		this.$wrapper.find('.VKPostText').val(post_text);
	};
	
	
	AbstractEditEventPage.prototype.submitForm = function() {
		var PAGE = this,
			$form = PAGE.$wrapper.find(".EditEventForm"),
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
					$inputs = $row.find('.StartTime, .EndTime'),
					start = $inputs.filter('.StartTime').inputmask('unmaskedvalue'),
					end = $inputs.filter('.EndTime').inputmask('unmaskedvalue');
				
				$inputs.each(function() {
					var $input = $(this);
					if ($input.val() === '') {
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
		})($form, PAGE.MainCalendar);
		
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
				MainCalendar: PAGE.MainCalendar,
				send_data: send_data,
				form_data: form_data
			});
		}
		
		if (is_form_valid) {
			PAGE.$wrapper.addClass(__C.CLASSES.STATUS.DISABLED);
			$loader = __APP.BUILD.overlayLoader(PAGE.$view);
			try {
				send_data = this.gatherSendData();
				if (is_edit) {
					PAGE.event.updateEvent(send_data, afterSubmit, onError);
				} else {
					PAGE.event.createEvent(send_data, afterSubmit, onError);
				}
			} catch (e) {
				onError(e);
			}
		}
	};
	
	
	AbstractEditEventPage.prototype.init = function() {
		var PAGE = this,
			$main_tabs = PAGE.$wrapper.find('.EditEventPageTabs'),
			$bottom_nav_buttons = PAGE.$wrapper.find('.EditEventBottomButtons').children(),
			$next_page_button = $bottom_nav_buttons.filter('.EditEventNextPageButton'),
			$prev_page_button = $bottom_nav_buttons.filter('.EditEventPrevPageButton'),
			$submit_button = $bottom_nav_buttons.filter('.EditEventSubmitButton');
		
		bindDatePickers(PAGE.$wrapper);
		bindSelect2(PAGE.$wrapper);
		bindTabs(PAGE.$wrapper);
		bindControlSwitch(PAGE.$wrapper);
		bindCallModal(PAGE.$wrapper);
		bindLimitInputSize(PAGE.$wrapper);
		bindRippleEffect(PAGE.$wrapper);
		bindFileLoadButton(PAGE.$wrapper);
		ImgLoader.init(PAGE.$wrapper);
		
		PAGE.checkTariffAvailabilities(PAGE.organization_id);
		
		(function initEditEventMainCalendar() {
			//TODO: Refactor this!! Make it more readable
			var $selected_days_text = PAGE.$wrapper.find('.EventSelectedDaysText'),
				$selected_days_table_rows = PAGE.$wrapper.find('.SelectedDaysRows'),
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
			
			PAGE.MainCalendar = new Calendar('.EventDatesCalendar', {
				weekday_selection: true,
				month_selection: true,
				min_date: moment().format(__C.DATE_FORMAT)
			});
			PAGE.MainCalendar.init();
			
			function bindRemoveRow($parent) {
				$parent.find('.RemoveRow').not('.-Handled_RemoveRow').each(function(i, elem) {
					$(elem).on('click', function() {
						PAGE.MainCalendar.deselectDays($(this).closest('tr').data('date'));
					}).addClass('-Handled_RemoveRow');
				});
			}
			
			function displayFormattedText() {
				dates = {};
				PAGE.MainCalendar.selected_days.forEach(function(date, i, days) {
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
				var $output;
				
				/**
				 *
				 * @param {(Array<string>|string)} days
				 * @return {jQuery}
				 */
				function buildTableRow(days) {
					days = days instanceof Array ? days : [days];
					var today = moment().format(__C.DATE_FORMAT);
					
					return tmpl('selected-table-day', days.map(function(day, i) {
						
						return {
							date: day,
							formatted_date: day.split('-').reverse().join('.'),
							today: today,
							start_time: __APP.BUILD.formInput({
								name: 'start_time',
								type: 'time',
								classes: ['StartTime']
							}),
							end_time: __APP.BUILD.formInput({
								name: 'end_time',
								type: 'time',
								classes: ['EndTime']
							})
						};
					}));
				}
				
				$output = buildTableRow(selected_days);
				bindDatePickers($output);
				bindRemoveRow($output);
				
				$fucking_table = $fucking_table.add($output);
				$output.find('.DatePicker').each(function() {
					var DP = $(this).data('datepicker');
					DP.$datepicker.on('date-picked', function() {
						PAGE.MainCalendar.deselectDays(DP.prev_selected_day).selectDays(DP.selected_day);
						doTheFuckingSort($fucking_table, $selected_days_table_rows)
					});
				});
				doTheFuckingSort($fucking_table, $selected_days_table_rows);
			}
			
			function BuildSelectedDaysTable() {
				if (PAGE.MainCalendar.last_action === 'select') {
					buildTable(PAGE.MainCalendar.last_selected_days);
				}
				else if (PAGE.MainCalendar.last_action === 'deselect') {
					if (Array.isArray(PAGE.MainCalendar.last_selected_days)) {
						var classes = [];
						
						PAGE.MainCalendar.last_selected_days.forEach(function(day) {
							classes.push('.TableDay_' + day);
						});
						$fucking_table.remove(classes.join(', '));
						$fucking_table = $fucking_table.not(classes.join(', '));
					}
					else {
						$fucking_table.remove('.TableDay_' + PAGE.MainCalendar.last_selected_days);
						$fucking_table = $fucking_table.not('.TableDay_' + PAGE.MainCalendar.last_selected_days);
					}
				}
				
				doTheFuckingSort($fucking_table, $selected_days_table_rows);
				
				//TODO: Do not forget to rename 'fucking' names
				//TODO: Please, don't forget to rename 'fucking' names
				
			}
			
			buildTable(PAGE.MainCalendar.selected_days);
			PAGE.$wrapper.find('.SelectedDaysRows').toggleStatus('disabled');
			
			PAGE.MainCalendar.$calendar.on('change:days.displayFormattedText', displayFormattedText);
			PAGE.MainCalendar.$calendar.on('change:days.buildTable', BuildSelectedDaysTable);
			
			AddRowDatePicker.$datepicker.on('date-picked', function() {
				PAGE.MainCalendar.selectDays(AddRowDatePicker.selected_day);
			});
			
		})();
		
		(function initOrganization() {
			var $select = PAGE.$wrapper.find('.EditEventOrganizationsSelect');
			
			$select.select2({
				containerCssClass: 'form_select2',
				dropdownCssClass: 'form_select2_drop'
			}).on('change', function() {
				PAGE.organization_id = +this.value;
				PAGE.checkTariffAvailabilities(PAGE.organization_id);
			});
			
			$select.select2('val', PAGE.organization_id);
			
		})();
		
		(function checkVkPublicationAbility() {
			if (__APP.USER.accounts.contains(OneUser.ACCOUNTS.VK)) {
				__APP.SERVER.dealAjax(ServerConnection.HTTP_METHODS.GET, '/api/v1/organizations/vk_groups').done(function(groups) {
					var $vk_group_select = PAGE.$wrapper.find('select.VkGroupsSelect');
					
					$vk_group_select.append(__APP.BUILD.option(groups.map(function(group) {
						
						return {
							val: group.gid,
							display_name: group.name,
							dataset: {
								img: group.photo
							}
						};
					}))).trigger('change');
					
					if (groups.length === 1) {
						$vk_group_select.prop('disabled', true).after(__APP.BUILD.input({
							type: 'hidden',
							name: 'vk_guid',
							value: $vk_group_select.val()
						}));
					}
					
					PAGE.initCrossPosting();
				});
			}
		})();
		
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
			PAGE.$wrapper.find('.Placepicker').val(PAGE.my_organizations.getByID(PAGE.organization_id).default_address).trigger('input').trigger('change');
		});
		
		PAGE.$wrapper.find('.EditEventIsOnline').off('change.OnlineEvent').on('change.OnlineEvent', function() {
			PAGE.$wrapper.find('#edit_event_placepicker').prop('required', !$(this).prop('checked'));
		});
		
		PAGE.$wrapper.find('.AddRegistrationCustomField').off('click.AddRegistrationCustomField').on('click.AddRegistrationCustomField', function() {
			AbstractEditEventPage.buildRegistrationCustomField().insertBefore($(this));
		});
		
		PAGE.$wrapper.find('.RegistrationPreview').on('click.RegistrationPreview', function() {
			var form_data = $(this).closest('form').serializeForm(),
				event = new OneEvent(),
				modal;
			
			form_data.registration_fields = (new RegistrationFieldModelsCollection()).setData(form_data.registration_fields.sort().map(function(field) {
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
		
		$main_tabs.on('tabs:change', function() {
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
		
		$next_page_button.off('click.nextPage').on('click.nextPage', $main_tabs.nextTab);
		
		$prev_page_button.off('click.nextPage').on('click.prevPage', $main_tabs.prevTab);
		
		$submit_button.off('click.Submit').on('click.Submit', function submitEditEvent() {
			PAGE.submitForm();
		});
	};
	
	AbstractEditEventPage.prototype.render = function() {
		var PAGE = this,
			is_edit = !!PAGE.event.id,
			$organizations_wrapper,
			page_vars = $.extend(true, {}, Object.getProps(PAGE.event), {
				event_id: PAGE.event.id ? PAGE.event.id : undefined,
				public_at_data_label: 'Дата',
				additional_notification_data_label: 'Дата',
				current_date: moment().format(__C.DATE_FORMAT),
				tomorrow_date: moment().add(1, 'd').format(__C.DATE_FORMAT),
				button_text: is_edit ? 'Сохранить' : 'Опубликовать',
				additional_notification: PAGE.event.notifications.getByID(OneNotification.NOTIFICATIN_TYPES.ADDITIONAL_FOR_ORGANIZATION)
			}),
			m_registration_till = moment.unix(PAGE.event.registration_till),
			m_public_at = moment.unix(PAGE.event.public_at),
			registration_props = {
				registration_till_display_date: 'Дата',
				registration_till_time_input: __APP.BUILD.formInput({
					label: 'Время',
					id: 'edit_event_registration_till_time',
					type: 'time',
					name: 'registration_till_time',
					value: PAGE.event.registration_till ? m_registration_till.format('HH:mm') : undefined,
					classes: ['OnChangeCrossPost'],
					unit_classes: ['-inline'],
					required: true
				}),
				registration_limit_count_input: __APP.BUILD.formInput({
					label: 'Максимальное кол-во',
					id: 'edit_event_registration_limit_count',
					name: 'registration_limit_count',
					type: 'number',
					unit_classes: ['-inline', 'RegistrationQuantity'],
					value: PAGE.event.registration_limit_count,
					placeholder: '3 000',
					required: true
				}),
				tomorrow_date: page_vars.tomorrow_date,
				predefined_field: tmpl('edit-event-registration-predefined-field', [
					{id: AbstractEditEventPage.lastRegistrationCustomFieldId++, type: 'email', name: 'E-mail', description: 'Текстовое поле для ввода адреса электронной почты'},
					{id: AbstractEditEventPage.lastRegistrationCustomFieldId++, type: 'first_name', name: 'Имя', description: 'Текстовое поле для ввода имени'},
					{id: AbstractEditEventPage.lastRegistrationCustomFieldId++, type: 'last_name', name: 'Фамилия', description: 'Текстовое поле для ввода фамилии'},
					{id: AbstractEditEventPage.lastRegistrationCustomFieldId++, type: 'phone_number', name: 'Номер телефона', description: 'Текстовое поля для ввода номера телефона'}
				])
			},
			m_additional_notification_time;
		
		if (__APP.USER.isLoggedOut()) {
			__APP.changeState('/feed/actual', true, true);
			return null;
		}
		
		if (!checkRedirect('event/add', (this.organization_id ? '/add/event/to/' + this.organization_id : '/add/event'))) {
			return null;
		}
		
		if ((PAGE.event.organization_id && !PAGE.my_organizations.has(PAGE.event.organization_id)) || (PAGE.organization_id && !PAGE.my_organizations.has(PAGE.organization_id))) {
			return __APP.changeState('/', true, true);
		}
		
		if (PAGE.event.registration_required) {
			if (PAGE.event.registration_till) {
				registration_props = $.extend(registration_props, {
					registration_till_display_date: m_registration_till.format(__LOCALES.ru_RU.DATE.DATE_FORMAT),
					registration_till_date: m_registration_till.format(__C.DATE_FORMAT)
				});
			}
		}
		
		if (PAGE.event.public_at != null) {
			page_vars.public_at_data = m_public_at.format(__C.DATE_FORMAT);
			page_vars.public_at_data_label = m_public_at.format(__LOCALE.DATE.DATE_FORMAT);
		}
		
		if (page_vars.additional_notification) {
			m_additional_notification_time = moment.unix(page_vars.additional_notification.notification_time);
			page_vars.additional_notification_data = m_additional_notification_time.format(__C.DATE_FORMAT);
			page_vars.additional_notification_data_label = m_additional_notification_time.format(__LOCALE.DATE.DATE_FORMAT);
		}
		
		PAGE.organization_id = PAGE.organization_id ? PAGE.organization_id : PAGE.my_organizations[0].id;
		
		PAGE.$wrapper.html(tmpl('edit-event-page', $.extend(page_vars, {
			organization_options: __APP.BUILD.option(PAGE.my_organizations.map(function(organization) {
				
				return {
					val: organization.id,
					dataset: {
						organization: organization,
						'image-url': organization.img_url,
						'default-address': organization.default_address
					},
					display_name: organization.name
				};
			})),
			date_picker: tmpl('edit-event-datepicker', {
				start_time: __APP.BUILD.formInput({
					label: 'Начало',
					id: 'edit_event_start_time',
					name: 'start_time',
					type: 'time',
					classes: ['StartTime', 'OnChangeCrossPost'],
					unit_classes: ['-inline'],
					value: PAGE.event.dates.length ? PAGE.event.dates[0].start_time : undefined,
					required: true
				}),
				end_time: __APP.BUILD.formInput({
					label: 'Конец',
					id: 'edit_event_end_time',
					name: 'end_time',
					type: 'time',
					classes: ['EndTime'],
					unit_classes: ['-inline'],
					value: PAGE.event.dates.length ? PAGE.event.dates[0].end_time : undefined
				}),
				today: page_vars.current_date
			}),
			min_price_input: __APP.BUILD.formInput({
				label: 'Цена от',
				id: 'edit_event_min_price',
				name: 'min_price',
				type: 'number',
				unit_classes: ['-inline', 'MinPrice'],
				classes: ['OnChangeCrossPost'],
				value: PAGE.event.min_price,
				placeholder: 'Минимальная цена'
			}),
			cover_picker: tmpl('edit-event-cover-picker', {
				image_horizontal_url: PAGE.event.image_horizontal_url,
				image_horizontal_filename: getFilenameFromURL(PAGE.event.image_horizontal_url)
			}),
			registration: tmpl('edit-event-registration', registration_props),
			public_at_time_input: __APP.BUILD.formInput({
				label: 'Время',
				id: 'edit_event_public_at_time',
				name: 'public_at_time',
				type: 'time',
				unit_classes: ['-inline'],
				value: PAGE.event.public_at ? m_public_at.format('HH:mm') : undefined,
				required: true
			}),
			additional_notification_time_input: __APP.BUILD.formInput({
				label: 'Время',
				id: 'edit_event_additional_notification_time',
				name: 'additional_notification_time',
				type: 'time',
				unit_classes: ['-inline'],
				value: page_vars.additional_notification ? m_additional_notification_time.format('HH:mm') : undefined,
				required: true
			}),
			organization_id: PAGE.organization_id || PAGE.event.organization_id,
			vk_post_link: PAGE.event.vk_post_link ? __APP.BUILD.actionLink(
				PAGE.event.vk_post_link,
				'Страница публикации во Вконтакте',
				[__C.CLASSES.COLORS.ACCENT, '-no_uppercase'],
				{},
				{target: '_blank'}
			) : ''
		})));
		
		$organizations_wrapper = PAGE.$wrapper.find('.EditEventOrganizations');
		if (PAGE.my_organizations.length > 1) {
			$organizations_wrapper.removeClass(__C.CLASSES.HIDDEN);
		} else {
			$organizations_wrapper.addClass(__C.CLASSES.HIDDEN);
		}
		
		PAGE.init();
		
		this.renderRest(page_vars);
	};
	
	AbstractEditEventPage.prototype.renderRest = function(page_vars) {};
	
	return AbstractEditEventPage;
}()));