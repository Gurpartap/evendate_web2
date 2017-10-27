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
		var self = this,
			fields = [
				'id',
				'title',
				'description',
				'location',
				'detail_info_url',
				'organization_id',
				'image_horizontal_url'
			];
		
		Page.call(this);
		
		this.event = new OneEvent();
		this.state_name = 'admin';
		
		this.MainCalendar = null;
		
		this.my_organizations = new OrganizationsCollection();
		this.my_organizations_fields = new Fields('default_address', {
				tariff: {
					fields: new Fields(
						'available_additional_notifications',
						'available_event_publications',
						'event_publications'
					)
				}
			});
		
		this.render_vars = {
			organization_options: null,
			start_time: null,
			end_time: null,
			min_price_input: null,
			image_horizontal_filename: null,
			
			registration_help: null,
			registration_till_date_select: null,
			registration_till_time_input: null,
			registration_limit_count_input: null,
			registration_limit_help: null,
			registration_predefined_fields: null,
			registration_custom_fields: null,
			
			ticket_types: null,
			tickets_help: null,
			add_ticket_type_button: null,
			booking_time_input: null,
			promocodes: null,
			add_promocode_button: null,
			
			public_at_date_select: null,
			public_at_time_input: null,
			additional_notification_date_select: null,
			additional_notification_time_input: null,
			push_help: null,
			vk_image_base64: null,
			vk_image_filename: null,
			vk_image_url: null,
			vk_post_link: null,
			
			button_text: null
		};
		
		fields.forEach(function(field) {
			Object.defineProperty(self.render_vars, field, {
				enumerable: true,
				get: function() {
					
					return self.event[field];
				}
			});
		});
		
		Object.defineProperties(this.render_vars, {
			organizations_wrapper_classes: {
				enumerable: true,
				get: function() {
					
					return (self.my_organizations.length < 2) ? __C.CLASSES.HIDDEN : '';
				}
			},
			current_date: {
				enumerable: true,
				get: function() {
					
					return moment().format(__C.DATE_FORMAT);
				}
			}
		});
		
		Object.defineProperties(this, {
			organization_id: {
				get: function() {
					return self.event.organization_id;
				},
				set: function(val) {
					self.event.organization_id = val;
				}
			},
			is_edit: {
				get: function() {
					return !!self.event.id;
				}
			}
		});
	}
	
	AbstractEditEventPage.lastRegistrationFieldId = 0;
	AbstractEditEventPage.lastTicketTypeRowId = 0;
	AbstractEditEventPage.lastPromocodeRowId = 0;
	/**
	 *
	 * @param {RegistrationFieldModel|Array<RegistrationFieldModel>|RegistrationFieldModelsCollection} [registration_data]
	 * @return {jQuery}
	 */
	AbstractEditEventPage.registrationCustomFieldBuilder = function(registration_data) {
		registration_data = registration_data ? (registration_data instanceof Array ? registration_data : [registration_data]) : [{}];
		var $fields;
		
		$fields = tmpl('edit-event-registration-custom-field', registration_data.filter(function(data) {
			if (RegistrationFieldModel.isCustomField(data)) {
				data.id = data.id ? data.id : AbstractEditEventPage.lastRegistrationFieldId++;
				return true;
			}
			return false;
		}).map(function(data) {
			
			return $.extend({}, data, {
				registration_custom_field_values: (data.values && data.values.length) ? AbstractEditEventPage.registrationCustomFieldValuesBuilder(data.id, data.values) : ''
			});
		}));
		
		initSelect2($fields.find('.RegistrationCustomFieldType'), {
			dropdownCssClass: 'form_select2_drop form_select2_drop_no_search'
		}).on('change.SelectRegistrationCustomFieldType', function() {
			var $this = $(this),
				$field = $this.closest('.RegistrationCustomField'),
				$values_wrap = $field.find('.RegistrationCustomFieldValues');
			
			switch ($this.val()) {
				case RegistrationFieldModel.TYPES.ADDITIONAL_TEXT:
				case RegistrationFieldModel.TYPES.EXTENDED_CUSTOM: {
					$values_wrap.html('');
					break;
				}
				case RegistrationFieldModel.TYPES.SELECT:
				case RegistrationFieldModel.TYPES.SELECT_MULTI: {
					if ($values_wrap.is(':empty')) {
						$values_wrap.html(AbstractEditEventPage.registrationCustomFieldValuesBuilder($field.find('.RegistrationFieldId').val()));
					}
					break;
				}
			}
		});
		
		registration_data.forEach(function(data) {
			if (data.required) {
				$fields.find('#edit_event_registration_'+data.id+'_custom_field_required').prop('checked', true);
			}
			if (data.type) {
				$fields.find('#edit_event_registration_'+data.id+'_field_type').select2('val', data.type);
			}
		});
		$fields.find('.RegistrationCustomFieldLabel, .RegistrationCustomFieldType').on('change.RemoveRegistrationFieldUUID', function() {
			$(this).closest('.RegistrationCustomField').find('.RegistrationCustomFieldUUID').val('');
		});
		
		return $fields;
	};
	/**
	 *
	 * @param {number} field_id
	 * @param {Array<RegistrationSelectFieldValue>|RegistrationSelectFieldValue} values
	 *
	 * @return {jQuery}
	 */
	AbstractEditEventPage.registrationCustomFieldValuesBuilder = function(field_id, values) {
		var _values = values instanceof Array ? values : [],
			$values = tmpl('edit-event-registration-custom-field-values', {
				id: field_id,
				values: AbstractEditEventPage.registrationCustomFieldValueBuilder(field_id, _values),
				last_value_id: _values.length
			});
		
		$values.find('.AddValue').on('click.AddValue', function() {
			var last_value_id = +$values.data('last_value_id') + 1,
				$new_value = AbstractEditEventPage.registrationCustomFieldValueBuilder(field_id, {
					value: 'Вариант '+last_value_id,
					value_id: last_value_id
				});
			
			$values.find('.RegistrationCustomFieldValuesWrapper').append($new_value);
			$values.data('last_value_id', last_value_id);
			$new_value.find('.ValueInput').focus().get(0).select();
		});
		
		return $values;
	};
	/**
	 *
	 * @param {number} field_id
	 * @param {Array<RegistrationSelectFieldValue>|RegistrationSelectFieldValue} values
	 *
	 * @return {jQuery}
	 */
	AbstractEditEventPage.registrationCustomFieldValueBuilder = function(field_id, values) {
		var _values = values instanceof Array ? values : values ? [values] : [],
			$value = tmpl('edit-event-registration-custom-field-value', _values.map(function(value, i) {
				
				return {
					id: field_id,
					value_id: value.value_id || i,
					value_uuid: value.uuid,
					checkbox_radio: __APP.BUILD.checkbox({
						attributes: {
							disabled: true
						}
					}),
					input: __APP.BUILD.input({
						name: 'registration_' +field_id+ '_field_' +(value.value_id || i)+ '_value',
						value: value.value
					}, ['edit_event_registration_custom_field_value_input', 'form_input', '-flat', 'ValueInput'])
				};
			}));
		
		$value.find('.RemoveValue').on('click.RemoveValue', function() {
			$(this).closest('.RegistrationFieldValue').remove();
		});
		
		return $value;
	};
	
	/**
	 *
	 * @param {OneTicketType|Array<OneTicketType>|TicketTypesCollection} [ticket_types]
	 *
	 * @return {jQuery}
	 */
	AbstractEditEventPage.ticketTypeRowsBuilder = function(ticket_types) {
		var _ticket_types = ticket_types ? (ticket_types instanceof Array ? ticket_types : [ticket_types]) : [new OneTicketType()],
			$rows = tmpl('edit-event-tickets-row', _ticket_types.map(function(ticket_type) {
				var row_id = ++AbstractEditEventPage.lastTicketTypeRowId;
				
				return {
					row_num: row_id,
					uuid: ticket_type.uuid,
					type_code: ticket_type.type_code || randomString(),
					name_input: __APP.BUILD.formUnit({
						id: 'event_edit_ticket_type_' + row_id + '_name',
						classes: ['TicketTypeName'],
						name: 'ticket_type_' + row_id + '_name',
						value: ticket_type.name || '',
						placeholder: 'Название типа билета',
						required: true
					}).on('input', function() {
						
						AbstractEditEventPage.checkTicketTypeSellAfter($(this).closest('.TicketTypes'));
					}),
					amount_input: __APP.BUILD.formUnit({
						id: 'event_edit_ticket_type_' + row_id + '_amount',
						name: 'ticket_type_' + row_id + '_amount',
						value: empty(ticket_type.amount) ? '' : ticket_type.amount,
						placeholder: 0,
						required: true
					}),
					price_input: __APP.BUILD.formUnit({
						id: 'event_edit_ticket_type_' + row_id + '_price',
						name: 'ticket_type_' + row_id + '_price',
						value: empty(ticket_type.price) ? '' : ticket_type.price,
						placeholder: 0,
						required: true
					}),
					comment_form_unit: __APP.BUILD.formUnit({
						label: 'Описание типа билетов',
						type: 'textarea',
						name: 'ticket_type_{row_num}_comment'.format({row_num: row_id}),
						value: ticket_type.comment,
						placeholder: 'Описание типа билетов (опционально)',
						helptext: 'Краткое описание типа билетов, объясняющее пользователям отличие этого типа от других'
					}),
					tickets_sell_start_date_checkbox: __APP.BUILD.formUnit({
						id: 'event_edit_ticket_type_' + row_id + '_start_by_date',
						label: 'По дате',
						type: 'checkbox',
						name: 'ticket_type_' + row_id + '_start_by_date',
						dataset: {
							switch_id: 'ticket_type_' + row_id + '_start_by_date'
						},
						classes: ['TicketTypeStartByDateSwitch', 'Switch'],
						unit_classes: ['-inline']
					}),
					tickets_sell_start_date_select: __APP.BUILD.formUnit({
						type: 'date',
						name: 'ticket_type_' + row_id + '_sell_start_date',
						value: ticket_type.sell_start_date ? unixTimestampToISO(ticket_type.sell_start_date) : undefined,
						dataset: {
							format: function(date) {
								
								return date.calendar(null, __LOCALE.DATE.CALENDAR_DATE_WITH_YEAR);
							}
						}
					}),
					tickets_sell_start_after_checkbox: __APP.BUILD.formUnit({
						id: 'event_edit_ticket_type_' + row_id + '_start_after',
						label: 'По окончании продаж билета',
						type: 'checkbox',
						name: 'ticket_type_' + row_id + '_start_after',
						dataset: {
							switch_id: 'ticket_type_' + row_id + '_start_after'
						},
						classes: ['TicketTypeStartAfterSwitch', 'Switch'],
						unit_classes: ['-inline']
					}),
					tickets_sell_start_after_select: __APP.BUILD.select([], {
						name: 'ticket_type_' + row_id + '_start_after_code'
					}, 'TicketTypeSellAfter', null, ticket_type.start_after_ticket_type_code),
					tickets_sell_end_date_select: __APP.BUILD.formUnit({
						label: 'Дата',
						type: 'date',
						name: 'ticket_type_' + row_id + '_sell_end_date',
						value: ticket_type.sell_end_date ? unixTimestampToISO(ticket_type.sell_end_date) : undefined,
						unit_classes: ['-inline'],
						dataset: {
							format: function(date) {
								
								return date.calendar(null, __LOCALE.DATE.CALENDAR_DATE_WITH_YEAR);
							}
						}
					}),
					tickets_by_order_min_amount_input: __APP.BUILD.formUnit({
						id: 'event_edit_ticket_type_' + row_id + '_min_count_per_user',
						type: 'number',
						label: 'Минимум',
						name: 'ticket_type_' + row_id + '_min_count_per_user',
						value: ticket_type.min_count_per_user || 0,
						unit_classes: ['-inline'],
						required: true,
						attributes: {
							size: 6
						}
					}),
					tickets_by_order_max_amount_input: __APP.BUILD.formUnit({
						id: 'event_edit_ticket_type_' + row_id + '_max_count_per_user',
						type: 'number',
						label: 'Максимум',
						name: 'ticket_type_' + row_id + '_max_count_per_user',
						value: ticket_type.max_count_per_user || 30,
						unit_classes: ['-inline'],
						attributes: {
							size: 6
						}
					}),
					close_expanded_button: __APP.BUILD.actionButton({
						title: 'Скрыть настройки',
						classes: ['-color_marginal', 'TicketTypeHideButton']
					}).on('click.HideTicketType', function() {
						$(this).closest('.CollapsingWrapper').resolveInstance().closeCollapsing();
					})
				};
			}));
		
		bindControlSwitch($rows);
		bindCollapsing($rows);
		bindPageLinks($rows);
		
		$rows.not('.ExpandRow').each(function(i) {
			var $row = $(this),
				$expanded_row = $row.next('.ExpandRow');
			
			$row.data('ticket_type', _ticket_types[i]);
			$row.find('.TicketTypeExpandButton').on('click.ExpandTicketType', function() {
				$expanded_row.siblings('.ExpandRow').find('.CollapsingWrapper').each(function() {
					$(this).resolveInstance().closeCollapsing();
				});
				$expanded_row.find('.CollapsingWrapper').resolveInstance().toggleCollapsing();
			});
			
			$row.find('.TicketTypeDeleteButton').on('click.DeleteTicketType', function() {
				var $parent = $row.parent();
				
				$expanded_row.remove();
				$row.remove();
				
				if (!$parent.children().length) {
					$parent.append(tmpl('edit-event-tickets-row-empty'));
				}
				AbstractEditEventPage.checkTicketTypeSellAfter($parent.closest('.TicketTypes'));
			});
			
		});
		
		$rows.filter('.ExpandRow').each(function(i) {
			var $expanded_row = $(this);
			
			$expanded_row.data('ticket_type', _ticket_types[i]);
			
			if (_ticket_types[i].sell_start_date) {
				$expanded_row.find('.TicketTypeStartByDateSwitch').prop('checked', true).trigger('change');
			}
			if (_ticket_types[i].promocode) {
				$expanded_row.find('.TicketTypePromoSwitch').prop('checked', true).trigger('change');
			}
			
		});
		
		return $rows;
	};
	/**
	 *
	 * @param {(PromocodeModel|Array<PromocodeModel>|PromocodeModelsCollection)} [promocodes]
	 *
	 * @return {jQuery}
	 */
	AbstractEditEventPage.promocodeRowsBuilder = function(promocodes) {
		var _promocodes = promocodes ? (promocodes instanceof Array ? promocodes : [promocodes]) : [new PromocodeModel()],
			$rows;
		
		$rows = tmpl('edit-event-promocode-row', _promocodes.map(function(promocode) {
			var row_id = ++AbstractEditEventPage.lastPromocodeRowId,
				is_enabled = promocode.enabled !== false;
			
			return {
				id: row_id,
				uuid: promocode.uuid,
				code_input: __APP.BUILD.formUnit({
					name: 'promocode_'+row_id+'_code',
					value: promocode.code,
					placeholder: 'Введите промокод',
					readonly: is_enabled ? undefined : true,
					classes: ['PromocodeFormInput'],
					required: true
				}),
				effort_input: __APP.BUILD.inputNumber({
					name: 'promocode_'+row_id+'_effort',
					value: promocode.effort,
					placeholder: '0',
					readonly: is_enabled ? undefined : true,
					required: true
				}, ['PromocodeFormInput']),
				type_switch: __APP.BUILD.switch('event_edit_promocode_'+row_id+'_is_fixed', 'promocode_'+row_id+'_is_fixed', promocode.is_fixed),
				service_control: promocode.uuid ?
				                 __APP.BUILD.switch('event_edit_promocode_'+row_id+'_enabled', 'promocode_'+row_id+'_enabled', promocode.enabled, null, ['PromocodeDisable']) :
				                 __APP.BUILD.button({
					                 title: '×',
					                 classes: [
					                 	'event_edit_row_delete_button',
					                  __C.CLASSES.COMPONENT.ACTION,
					                  __C.CLASSES.UNIVERSAL_STATES.EMPTY,
					                  'PromocodeDeleteButton'
					                 ]
				                 }),
				
				use_limit_form_unit: __APP.BUILD.formUnit({
					label: 'Лимит использований',
					name: 'promocode_' + row_id + '_use_limit',
					value: promocode.use_limit,
					placeholder: 0,
					helptext: 'Укажите здесь сколько раз можно использовать этот промокод. Оставьте поле пустым, если не хотите ставить ограничений'
				}),
				promocode_start_date_select: __APP.BUILD.formUnit({
					type: 'date',
					name: 'promocode_' + row_id + '_start_date',
					value: promocode.start_date ? unixTimestampToISO(promocode.start_date) : undefined,
					dataset: {
						format: function(date) {
							
							return date.calendar(null, __LOCALE.DATE.CALENDAR_DATE_WITH_YEAR);
						}
					}
				}),
				promocode_end_date_select: __APP.BUILD.formUnit({
					type: 'date',
					name: 'promocode_' + row_id + '_end_date',
					value: promocode.end_date ? unixTimestampToISO(promocode.end_date) : undefined,
					dataset: {
						format: function(date) {
							
							return date.calendar(null, __LOCALE.DATE.CALENDAR_DATE_WITH_YEAR);
						}
					}
				})
			};
		}));
		
		bindControlSwitch($rows);
		bindCollapsing($rows);
		
		$rows.find('.PromocodeDeleteButton').on('click.DeletePromocode', function() {
			var $row = $(this).closest('.PromocodeRow');
			
			$row = $row.add($row.next('.ExpandedPromocodeRow'));
			$row.remove();
		});
		
		$rows.find('.PromocodeExpandButton').on('click.ExpandPromocode', function() {
			var $row = $(this).closest('.PromocodeRow'),
				$expand_row = $row.next('.ExpandedPromocodeRow');
			
			$rows.filter('.ExpandedPromocodeRow').not($expand_row).find('.CollapsingWrapper').each(function() {
				$(this).resolveInstance().closeCollapsing();
			});
			
			$expand_row.find('.CollapsingWrapper').resolveInstance().toggleCollapsing();
		});
		
		$rows.find('.PromocodeDisable').on('click.DisablePromocode', '.FormSwitchInput', function() {
			var $row = $(this).closest('.PromocodeRow'),
				$inputs;
			
			$row = $row.add($row.next('.ExpandedPromocodeRow'));
			$inputs = $row.find('.PromocodeFormInput');
			
			if (this.checked) {
				$inputs.removeAttr('readonly');
			} else {
				$inputs.attr('readonly', true);
			}
		});
	
		return $rows;
	};
	/**
	 *
	 * @param {jQuery} $wrapper - .TicketTypes
	 */
	AbstractEditEventPage.checkTicketTypeSellAfter = function($wrapper) {
		var $sell_after_selects = $wrapper.find('select.TicketTypeSellAfter'),
			$ticket_types = $wrapper.children('tbody').children().not('.ExpandRow'),
			options = [];
		$ticket_types.each(function(i) {
			var $ticket_type = $(this);
			
			options.push({
				display_name: $ticket_type.find('.TicketTypeName').val() || 'Тип билета ' + (i+1),
				val: $ticket_type.find('.TicketTypeCode').val()
			});
		});
		
		$sell_after_selects.each(function() {
			var $this = $(this),
				this_type_code = $this.closest('tr').prev().find('.TicketTypeCode').val(),
				selected = $this.select2('val');
			
			$this.select2('destroy');
			$this.html(__APP.BUILD.option(options.filter(function(option) {
				
				return option.val !== this_type_code;
			})));
			
			initSelect2($this);
			
			$this.select2('val', selected);
		});
		
		if ($sell_after_selects.length < 2) {
			$wrapper.find('.TicketTypeSellAfterFieldset').attr('disabled', true);
		} else {
			$wrapper.find('.TicketTypeSellAfterFieldset').removeAttr('disabled');
		}
		
		if ($sell_after_selects.length > 0) {
			$wrapper.closest('.EditEventForm').find('.EmailTicketing').removeClass(__C.CLASSES.HIDDEN);
		} else {
			$wrapper.closest('.EditEventForm').find('.EmailTicketing').addClass(__C.CLASSES.HIDDEN);
		}
	};
	
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
				filenames: {
					horizontal: form_data.filename_horizontal
				},
				is_free: !!form_data.is_free,
				vk_post: !!form_data.vk_post,
				min_price: form_data.is_free ? null : form_data.min_price,
				delayed_publication: !!form_data.delayed_publication,
				registration_required: !!form_data.registration_required,
				registration_locally: !!form_data.registration_locally,
				registration_approvement_required: !!form_data.registration_approvement_required,
				email_texts: {
					payed: form_data.email_payed_text || null,
					approved: form_data.email_approved_text || null,
					not_approved: form_data.email_not_approved_text || null,
					after_event: form_data.email_after_event_text || null
				}
			};
		
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
		
		if (form_data.registration_required) {
			
			if (form_data.registration_limit_by_date) {
				send_data.registration_till = moment(form_data.registration_till_date + (form_data.registration_till_time ? ' ' +	form_data.registration_till_time : '')).tz('UTC').format();
			}
			
			if (form_data.registration_limit_by_quantity) {
				send_data.registration_limit_count = form_data.registration_limit_count;
			}
			
			if (form_data.registration_fields && form_data.registration_fields.length) {
				send_data.registration_fields = (new RegistrationFieldModelsCollection()).setData(form_data.registration_fields.map(function(id) {
					var field = new RegistrationFieldModel();
					
					if (form_data['registration_' + id + '_field_type']) {
						field.type = form_data['registration_' + id + '_field_type'];
					}
					
					field.required = form_data['registration_' + id + '_field_required'];
					if (form_data['registration_' + id + '_field_uuid']) {
						field.uuid = form_data['registration_' + id + '_field_uuid'];
					}
					if (form_data['registration_' + id + '_field_label']) {
						field.label = form_data['registration_' + id + '_field_label'].trim();
					}
					if (form_data['registration_' + id + '_field_order_number']) {
						field.order_number = form_data['registration_' + id + '_field_order_number'] || null;
					}
					
					if (form_data['registration_' + id + '_field_values']) {
						field.values = form_data['registration_' + id + '_field_values'].map(function(value_id) {
							var value = new RegistrationSelectFieldValue();
							
							value.value = form_data['registration_' +id+ '_field_' +value_id+ '_value'];
							value.uuid = setDefaultValue(form_data['registration_' +id+ '_field_' +value_id+ '_value_uuid'], null);
							
							return value;
						});
					}
					
					return field;
				})).getArrayCopy();
			}
		}
		
		if(form_data.tags){
			send_data.tags = form_data.tags.split(',');
		}
		
		if (form_data.ticket_types) {
			send_data.ticket_types = (form_data.ticket_types instanceof Array ? form_data.ticket_types : [form_data.ticket_types]).map(function(id) {
				
				return {
					uuid: form_data['ticket_type_' + id + '_uuid'] || null,
					name: form_data['ticket_type_' + id + '_name'],
					comment: form_data['ticket_type_' + id + '_comment'],
					type_code: form_data['ticket_type_' + id + '_type_code'],
					amount: form_data['ticket_type_' + id + '_amount'],
					price: form_data['ticket_type_' + id + '_price'],
					start_after_ticket_type_code: form_data['ticket_type_' + id + '_start_after_ticket_type_code'] || null,
					sell_start_date: form_data['ticket_type_' + id + '_start_by_date'] ? form_data['ticket_type_' + id + '_sell_start_date'] : null,
					sell_end_date: form_data['ticket_type_' + id + '_sell_end_date'] || null,
					min_count_per_user: form_data['ticket_type_' + id + '_min_count_per_user'],
					max_count_per_user: form_data['ticket_type_' + id + '_max_count_per_user']
				};
			});
			send_data.ticketing_locally = true;
			send_data.booking_time = +form_data.booking_time === 0 ? 1 : form_data.booking_time;
			
			send_data.accept_bitcoins = form_data.accept_bitcoins;
		}
		
		if (form_data.promocodes) {
			send_data.promocodes = (form_data.promocodes instanceof Array ? form_data.promocodes : [form_data.promocodes]).map(function(id) {
				
				return {
					uuid: form_data['promocode_' + id + '_uuid'] || null,
					code: form_data['promocode_' + id + '_code'],
					effort: form_data['promocode_' + id + '_effort'],
					is_fixed: form_data['promocode_' + id + '_is_fixed'],
					is_percentage: !form_data['promocode_' + id + '_is_fixed'],
					enabled: form_data['promocode_' + id + '_enabled'] !== false,
					
					use_limit: form_data['promocode_' + id + '_use_limit'] || 100000,
					start_date: form_data['promocode_' + id + '_start_date'] || null,
					end_date: form_data['promocode_' + id + '_end_date'] || null,
				};
			});
		}
		
		if (form_data.delayed_publication) {
			send_data.public_at = moment(form_data.public_at_date + ' ' + form_data.public_at_time).tz('UTC').format();
		}
		
		if (form_data.additional_notification) {
			send_data.additional_notification_time = moment(form_data.additional_notification_date + ' ' + form_data.additional_notification_time).tz('UTC').format();
		}
		
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
		
		if (organization.tariff.events_publication_left <= 5) {
			$available_event_publications_wrapper.removeClass(__C.CLASSES.HIDDEN);
			$available_event_publications_wrapper.find('.AvailableEventPublications').text(organization.tariff.events_publication_left);
		} else {
			$available_event_publications_wrapper.addClass(__C.CLASSES.HIDDEN);
		}
		$form_overall_fields.attr('disabled', (organization.tariff.events_publication_left <= 0 && !self.is_edit));
	};
	
	AbstractEditEventPage.prototype.initCrossPosting = function() {
		var self = this;
		
		function formatVKPost() {
			var data = self.gatherSendData(),
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
			
			
			self.$wrapper.find('.VKPostText').val(post_text);
		}
		
		this.$wrapper.find('.OnChangeCrossPost').on('change.crossPostingToVK', formatVKPost);
		this.MainCalendar.$calendar.on('change:days.crossPostingToVK', formatVKPost);
		this.$wrapper.find('.VKPostText').one('click', function() {
			self.deInitCrossPosting();
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
					
					$vk_preview.attr('src', src);
					$vk_src.val(src);
					$vk_file_name.val($file_name.val());
				});
			
			mutation_observer.observe($src.get(0), {
				attributes: true
			});
		})();
	};
	
	AbstractEditEventPage.prototype.deInitCrossPosting = function() {
		this.$wrapper.find('.OnChangeCrossPost').off('change.crossPostingToVK');
		this.MainCalendar.$calendar.off('change:days.crossPostingToVK');
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
			__APP.changeState('/event/' + PAGE.event.id);
		}
		
		function always() {
			PAGE.$wrapper.removeClass(__C.CLASSES.STATUS.DISABLED);
			$loader.remove();
		}
		
		if (is_form_valid) {
			PAGE.$wrapper.addClass(__C.CLASSES.STATUS.DISABLED);
			$loader = __APP.BUILD.overlayLoader(PAGE.$view);
			try {
				send_data = this.gatherSendData();
				if (is_edit) {
					PAGE.event.updateEvent(send_data, afterSubmit).always(always);
				} else {
					PAGE.event.createEvent(send_data, afterSubmit).always(always);
				}
			} catch (e) {
				ServerConnection.stdErrorHandler(e);
			}
		}
	};
	
	
	AbstractEditEventPage.prototype.init = function() {
		var PAGE = this,
			$main_tabs = PAGE.$wrapper.find('.EditEventPageTabs'),
			$bottom_nav_buttons = PAGE.$wrapper.find('.EditEventBottomButtons').children(),
			$next_page_button = $bottom_nav_buttons.filter('.EditEventNextPageButton'),
			$prev_page_button = $bottom_nav_buttons.filter('.EditEventPrevPageButton'),
			$submit_button = $bottom_nav_buttons.filter('.EditEventSubmitButton'),
			$sortable_custom_fields = PAGE.$wrapper.find('.RegistrationFields');
		
		bindDatePickers(PAGE.$wrapper);
		bindSelect2(PAGE.$wrapper);
		bindTabs(PAGE.$wrapper);
		bindHelpLink(PAGE.$wrapper);
		bindControlSwitch(PAGE.$wrapper);
		bindCallModal(PAGE.$wrapper);
		bindLimitInputSize(PAGE.$wrapper);
		bindRippleEffect(PAGE.$wrapper);
		bindFileLoadButton(PAGE.$wrapper);
		ImgLoader.init(PAGE.$wrapper);
		
		initSelect2(PAGE.$wrapper.find('.EditEventOrganizationsSelect')).on('change', function() {
			PAGE.organization_id = +this.value;
			PAGE.checkTariffAvailabilities(PAGE.organization_id);
		}).select2('val', PAGE.organization_id);
		initSelect2(PAGE.$wrapper.find('.EventTags'), {
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
			}
		});
		
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
				min_date: moment().format(__C.DATE_FORMAT),
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
					
					return tmpl('selected-table-day', days.map(function(day, i) {
						
						return {
							date: day,
							formatted_date: moment(day).calendar(null, __LOCALE.DATE.CALENDAR_DATE_WITH_YEAR),
							start_time: __APP.BUILD.formUnit({
								name: 'start_time',
								type: 'time',
								classes: ['StartTime']
							}),
							end_time: __APP.BUILD.formUnit({
								name: 'end_time',
								type: 'time',
								classes: ['EndTime']
							})
						};
					}));
				}
				
				$output = buildTableRow(selected_days);
				bindRemoveRow($output);
				
				$fucking_table = $fucking_table.add($output);
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
		
		(function checkVkPublicationAbility() {
			if (__APP.USER.accounts.contains(OneUser.ACCOUNTS.VK)) {
				__APP.SERVER.dealAjax(AsynchronousConnection.HTTP_METHODS.GET, '/api/v1/organizations/vk_groups').done(function(groups) {
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
		PAGE.$wrapper.find('.Placepicker').placepicker();
		
		PAGE.$wrapper.find('.EditEventDefaultAddress').off('click.defaultAddress').on('click.defaultAddress', function() {
			PAGE.$wrapper.find('.Placepicker').val(PAGE.my_organizations.getByID(PAGE.organization_id).default_address).trigger('input').trigger('change');
		});
		
		PAGE.$wrapper.find('.EditEventIsOnline').off('change.OnlineEvent').on('change.OnlineEvent', function() {
			PAGE.$wrapper.find('#edit_event_placepicker').prop('required', !$(this).prop('checked'));
		});
		
		function reorder() {
			$sortable_custom_fields.find('.RegistrationFieldOrderNumber').val('').filter(function(){
				
				return $(this).closest(':disabled').length === 0;
			}).each(function(i) {
				$(this).val(i+1);
			});
		}
		
		$sortable_custom_fields = PAGE.$wrapper.find('.RegistrationFields').sortable({
			scroll : true,
			animation: 150,
			draggable: '.Draggable',
			handle: '.DragHandle',
			filter: '.RemoveRegistrationCustomField',
			onFilter: function(e) {
				$(e.item).closest('.RegistrationCustomField').remove();
				reorder();
			},
			onEnd: reorder
		});
		
		$sortable_custom_fields.find('.PredefinedFieldSwitch').on('change', reorder);
		
		PAGE.$wrapper.find('.AddRegistrationCustomField').off('click.AddRegistrationCustomField').on('click.AddRegistrationCustomField', function() {
			$sortable_custom_fields.append(AbstractEditEventPage.registrationCustomFieldBuilder());
			reorder();
		});
		
		PAGE.$wrapper.find('.RegistrationLocallySwitch').off('change.EmailRegistrationLocallySwitch').on('change.EmailRegistrationLocallySwitch', function() {
			PAGE.$wrapper.find('.EmailRegistration').toggleClass(__C.CLASSES.HIDDEN);
		});
		
		PAGE.$wrapper.find('.RegistrationPreview').on('click.RegistrationPreview', function() {
			var $this = $(this),
				form_data = $(this).closest('fieldset').serializeForm(),
				registration_fields = new RegistrationFieldModelsCollection(),
				event = new OneEvent(),
				modal = $this.data('modal');
			
			if (form_data.registration_fields) {
				registration_fields.setData(form_data.registration_fields.map(function(field) {
					
					return {
						uuid: guid(),
						type: form_data['registration_'+field+'_field_type'],
						label: form_data['registration_'+field+'_field_label'] || RegistrationFieldModel.DEFAULT_LABEL[form_data['registration_'+field+'_field_type'].toUpperCase()],
						required: form_data['registration_'+field+'_field_required'],
						order_number: form_data['registration_'+field+'_field_order_number'],
						values: form_data['registration_'+field+'_field_values'] ? form_data['registration_'+field+'_field_values'].map(function(value_id) {
							var value = new RegistrationSelectFieldValue();
							
							value.value = form_data['registration_' +field+ '_field_' +value_id+ '_value'];
							value.uuid = form_data['registration_' +field+ '_field_' +value_id+ '_value_uuid'] || guid();
							
							return value;
						}) : null
					};
				})).sortByOrder();
			}
			form_data.registration_fields = registration_fields;
			event.setData(form_data);
			
			if (modal instanceof PreviewRegistrationModal) {
				modal.destroy();
			}
			
			modal = new PreviewRegistrationModal(event);
			$this.data('modal', modal);
			modal.show();
		});
		
		AbstractEditEventPage.checkTicketTypeSellAfter(PAGE.$wrapper.find('.TicketTypes'));
		
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
	
	AbstractEditEventPage.prototype.preRender = function() {
		var self = this,
			m_registration_till = moment.unix(this.event.registration_till),
			m_public_at = moment.unix(this.event.public_at),
			additional_notification = this.event.notifications.getByID(OneNotification.NOTIFICATIN_TYPES.ADDITIONAL_FOR_ORGANIZATION),
			m_additional_notification_time = additional_notification ? moment.unix(additional_notification.notification_time) : null;
		
		this.render_vars.organization_options = __APP.BUILD.option(this.my_organizations.map(function(organization) {
			
			return {
				val: organization.id,
				dataset: {
					organization: organization,
					'image-url': organization.img_url,
					'default-address': organization.default_address
				},
				display_name: organization.name
			};
		}));
		
		this.render_vars.start_time = __APP.BUILD.formUnit({
			label: 'Начало',
			id: 'edit_event_start_time',
			name: 'start_time',
			type: 'time',
			classes: ['StartTime', 'OnChangeCrossPost'],
			unit_classes: ['-inline'],
			value: this.event.dates.length ? this.event.dates[0].start_time : undefined,
			required: true
		});
		
		this.render_vars.end_time = __APP.BUILD.formUnit({
			label: 'Конец',
			id: 'edit_event_end_time',
			name: 'end_time',
			type: 'time',
			classes: ['EndTime'],
			unit_classes: ['-inline'],
			value: this.event.dates.length ? this.event.dates[0].end_time : undefined
		});
		
		this.render_vars.min_price_input = __APP.BUILD.formUnit({
			label: 'Цена от',
			id: 'edit_event_min_price',
			name: 'min_price',
			type: 'number',
			unit_classes: ['-inline', 'MinPrice'],
			classes: ['OnChangeCrossPost'],
			value: this.event.min_price,
			placeholder: 'Минимальная цена'
		});
		
		
		
		this.render_vars.registration_help = __APP.BUILD.helpLink(HelpCenterConnection.ARTICLE.HOW_TO_ENABLE_REGISTRATION, 'Как включить регистрацию');
		
		this.render_vars.registration_till_date_select = __APP.BUILD.formUnit({
			label: 'Дата окончания регистрации',
			name: 'registration_till_date',
			type: 'date',
			value: this.event.registration_till ? m_registration_till.format(__C.DATE_FORMAT) : undefined,
			required: true,
			unit_classes: ['-inline'],
			attributes: {
				class: 'OnChangeCrossPost'
			},
			dataset: {
				format: function(date) {
					
					return date.calendar(null, __LOCALE.DATE.CALENDAR_DATE_WITH_YEAR);
				},
				selected_day: this.event.registration_till ? m_registration_till.format(__C.DATE_FORMAT) : '',
				min_date: moment().add(1, 'd').format(__C.DATE_FORMAT)
			}
		});
		
		this.render_vars.registration_till_time_input = __APP.BUILD.formUnit({
			label: 'Время',
			id: 'edit_event_registration_till_time',
			type: 'time',
			name: 'registration_till_time',
			value: this.event.registration_till ? m_registration_till.format(__C.TIME_FORMAT) : undefined,
			classes: ['OnChangeCrossPost'],
			unit_classes: ['-inline'],
			required: true
		});
		
		this.render_vars.registration_limit_count_input = __APP.BUILD.formUnit({
			label: 'Максимальное кол-во',
			id: 'edit_event_registration_limit_count',
			name: 'registration_limit_count',
			type: 'number',
			unit_classes: ['-inline', 'RegistrationQuantity'],
			value: this.event.registration_limit_count,
			placeholder: '3 000',
			required: true
		});
		
		this.render_vars.registration_limit_help = __APP.BUILD.helpLink(HelpCenterConnection.ARTICLE.MEMBERS_LIMITATION, 'Как установить лимит участников события');
		
		this.render_vars.registration_predefined_fields = tmpl('edit-event-registration-predefined-field', [
			{
				id: AbstractEditEventPage.lastRegistrationFieldId++,
				order_number: AbstractEditEventPage.lastRegistrationFieldId,
				type: 'last_name',
				name: 'Фамилия',
				description: 'Текстовое поле для ввода фамилии'
			},
			{
				id: AbstractEditEventPage.lastRegistrationFieldId++,
				order_number: AbstractEditEventPage.lastRegistrationFieldId,
				type: 'first_name',
				name: 'Имя',
				description: 'Текстовое поле для ввода имени'
			},
			{
				id: AbstractEditEventPage.lastRegistrationFieldId++,
				order_number: AbstractEditEventPage.lastRegistrationFieldId,
				type: 'email',
				name: 'E-mail',
				description: 'Текстовое поле для ввода адреса электронной почты'
			},
			{
				id: AbstractEditEventPage.lastRegistrationFieldId++,
				order_number: AbstractEditEventPage.lastRegistrationFieldId,
				type: 'phone_number',
				name: 'Номер телефона',
				description: 'Текстовое поля для ввода номера телефона'
			}
		]);
		
		
		this.render_vars.auto_price_change_help = __APP.BUILD.helpLink(HelpCenterConnection.ARTICLE.DYNAMIC_PRICING, 'Как организовать автоматическое изменение цен');
		
		this.render_vars.tickets_help = __APP.BUILD.helpLink(HelpCenterConnection.ARTICLE.TICKETS, 'Как выглядит электронный билет');
		
		this.render_vars.add_ticket_type_button = __APP.BUILD.actionButton({
			title: 'Добавить билет',
			classes: [__C.CLASSES.COLORS.ACCENT, __C.CLASSES.ICON_CLASS, __C.CLASSES.ICONS.PLUS]
		}).on('click.AddTicketTypeRow', function() {
			var $table = self.$wrapper.find('.TicketTypes'),
				$collapsings = $table.find('.ExpandRow').find('.CollapsingWrapper');
			
			if ($table.find('tbody').length === 0) {
				$table.append($('<tbody></tbody>'));
			}
			
			$table = $table.find('tbody');
			
			if ($table.children().length === 1 && $table.children().hasClass('EmptyRow')) {
				$table.html(AbstractEditEventPage.ticketTypeRowsBuilder());
			} else {
				$table.append(AbstractEditEventPage.ticketTypeRowsBuilder());
			}
			AbstractEditEventPage.checkTicketTypeSellAfter($table);
			
			if ($collapsings.length) {
				$collapsings.each(function() {
					$(this).resolveInstance().closeCollapsing();
				});
			}
		});
		
		this.render_vars.booking_time_input = __APP.BUILD.formUnit({
			label: 'Срок брони билета',
			label_classes: ['help_link', 'HelpLink'],
			label_dataset: {
				article_id: HelpCenterConnection.ARTICLE.BOOKING
			},
			id: 'edit_event_booking_time',
			name: 'booking_time',
			type: 'number',
			helptext: 'Количество часов, в течении которых участник может оплатить свой заказ',
			value: this.event.booking_time || 1,
			required: true,
			attributes: {
				size: 2
			}
		});
		
		this.render_vars.add_promocode_button = __APP.BUILD.actionButton({
			title: 'Добавить промокод',
			classes: [__C.CLASSES.COLORS.ACCENT, __C.CLASSES.ICON_CLASS, __C.CLASSES.ICONS.PLUS]
		}).on('click.AddPromocodeRow', function() {
			var $table = self.$wrapper.find('.Promocodes');
			
			if ($table.find('tbody').length === 0) {
				$table.append($('<tbody></tbody>'));
			}
			
			$table = $table.find('tbody');
			
			if ($table.children().length === 1 && $table.children().hasClass('EmptyRow')) {
				$table.html(AbstractEditEventPage.promocodeRowsBuilder());
			} else {
				$table.append(AbstractEditEventPage.promocodeRowsBuilder());
			}
		});
		
		
		
		this.render_vars.email_payed_form_unit = __APP.BUILD.formUnit({
			label: 'Сообщение при успешной оплате заказа',
			id: 'edit_event_email_payed_form_unit',
			name: 'email_payed_text',
			type: 'textarea',
			value: this.event.email_texts.payed
		});
		
		this.render_vars.email_approved_form_unit = __APP.BUILD.formUnit({
			label: 'Сообщение при подтверждении заявки',
			id: 'edit_event_email_approved_form_unit',
			name: 'email_approved_text',
			type: 'textarea',
			value: this.event.email_texts.approved
		});
		
		this.render_vars.email_not_approved_form_unit = __APP.BUILD.formUnit({
			label: 'Сообщение при отказе в заявке',
			id: 'edit_event_email_not_approved_form_unit',
			name: 'email_not_approved_text',
			type: 'textarea',
			value: this.event.email_texts.not_approved
		});
		
		this.render_vars.email_after_event_form_unit = __APP.BUILD.formUnit({
			label: 'Сообщение после окончания события',
			id: 'edit_event_email_after_event_form_unit',
			name: 'email_after_event_text',
			type: 'textarea',
			value: this.event.email_texts.after_event
		});
		
		
		
		this.render_vars.public_at_date_select = __APP.BUILD.formUnit({
			label: 'Дата',
			name: 'public_at_date',
			type: 'date',
			value: this.event.public_at ? m_public_at.format(__C.DATE_FORMAT) : undefined,
			required: true,
			unit_classes: ['-inline'],
			dataset: {
				format: function(date) {
					
					return date.calendar(null, __LOCALE.DATE.CALENDAR_DATE_WITH_YEAR);
				},
				min_date: moment().format(__C.DATE_FORMAT)
			}
		});
		
		this.render_vars.public_at_time_input = __APP.BUILD.formUnit({
			label: 'Время',
			id: 'edit_event_public_at_time',
			name: 'public_at_time',
			type: 'time',
			unit_classes: ['-inline'],
			value: this.event.public_at ? m_public_at.format(__C.TIME_FORMAT) : undefined,
			required: true
		});
		
		this.render_vars.additional_notification_date_select = __APP.BUILD.formUnit({
			label: 'Дата',
			name: 'additional_notification_date',
			type: 'date',
			value: additional_notification ? m_additional_notification_time.format(__C.DATE_FORMAT) : undefined,
			required: true,
			unit_classes: ['-inline'],
			dataset: {
				format: function(date) {
					
					return date.calendar(null, __LOCALE.DATE.CALENDAR_DATE_WITH_YEAR);
				},
				min_date: moment().format(__C.DATE_FORMAT)
			}
		});
		
		this.render_vars.additional_notification_time_input = __APP.BUILD.formUnit({
			label: 'Время',
			id: 'edit_event_additional_notification_time',
			name: 'additional_notification_time',
			type: 'time',
			unit_classes: ['-inline'],
			value: additional_notification ? m_additional_notification_time.format(__C.TIME_FORMAT) : undefined,
			required: true
		});
		
		this.render_vars.push_help = __APP.BUILD.helpLink(HelpCenterConnection.ARTICLE.HOW_PUSH_WORKS, 'Как работают push-уведомления');
		
		this.render_vars.crossposting_help = __APP.BUILD.helpLink(HelpCenterConnection.ARTICLE.CROSSPOSTING_VK, 'Как публиковать в VK');
	};
	
	AbstractEditEventPage.prototype.render = function() {
		if (__APP.USER.isLoggedOut()) {
			__APP.changeState('/feed/actual', true, true);
			return null;
		}
		
		if (!checkRedirect('event/add', (this.organization_id ? '/add/event/to/' + this.organization_id : '/add/event'))) {
			return null;
		}
		
		if (this.organization_id && !this.my_organizations.has(this.organization_id)) {
			return __APP.changeState('/', true, true);
		}
		
		this.organization_id = this.organization_id ? this.organization_id : this.my_organizations[0].id;
		
		this.$wrapper.html(tmpl('edit-event-page', this.render_vars));
		
		this.init();
	};
	
	return AbstractEditEventPage;
}()));