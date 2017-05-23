/**
 * @requires Class.AbstractEditEventPage.js
 */
/**
 *
 * @class EditEventPage
 * @extends AbstractEditEventPage
 */
EditEventPage = extending(AbstractEditEventPage, (function() {
	/**
	 *
	 * @param {(string|number)} [event_id]
	 * @constructor
	 * @constructs EditEventPage
	 */
	function EditEventPage(event_id) {
		AbstractEditEventPage.call(this);
		this.page_title = 'Редактирование события';
		this.event = new OneEvent(event_id);
	}
	
	EditEventPage.prototype.fetchData = function() {
		return this.fetching_data_defer = __APP.SERVER.multipleAjax(
			this.event.fetchEvent(EventPage.fields),
			this.my_organizations.fetchMyOrganizations(['admin', 'moderator'], this.my_organizations_fields)
		);
	};
	
	EditEventPage.prototype.renderRest = function(page_vars) {
		var PAGE = this;
		
		(function selectDates($view, raw_dates, is_same_time) {
			var MainCalendar = $view.find('.EventDatesCalendar').data('calendar'),
				$table_rows = $view.find('.SelectedDaysRows');
			
			if (!is_same_time) {
				PAGE.$wrapper.find('#edit_event_different_time').prop('checked', true).trigger('change');
			}
			
			MainCalendar.selectDays(raw_dates.map(function(date) {
				
				return moment.unix(date.event_date).format(__C.DATE_FORMAT)
			}));
			
			raw_dates.forEach(function(date) {
				var $day_row = $table_rows.find('.TableDay_' + moment.unix(date.event_date).format(__C.DATE_FORMAT));
				
				$day_row.find('.StartTime').val(date.start_time);
				if (date.end_time.length) {
					$day_row.find('.EndTime').val(date.end_time);
				}
			});
		})(PAGE.$wrapper, PAGE.event.dates, PAGE.event.is_same_time);
		
		(function selectTags($view, tags) {
			var selected_tags = [];
			tags.forEach(function(tag) {
				selected_tags.push({
					id: parseInt(tag.id),
					text: tag.name
				});
			});
			
			$view.find('#event_tags').select2('data', selected_tags);
		})(PAGE.$wrapper, PAGE.event.tags);
		
		if (PAGE.event.image_horizontal_url) {
			toDataUrl(PAGE.event.image_horizontal_url, function(base64_string) {
				PAGE.$wrapper.find('#edit_event_image_horizontal_source').val(base64_string ? base64_string : null);
			});
		}
		
		if (!PAGE.event.is_free) {
			PAGE.$wrapper.find('#edit_event_free').prop('checked', false).trigger('change');
			PAGE.$wrapper.find('#edit_event_min_price').val(PAGE.event.min_price);
		}
		if (PAGE.event.registration_required) {
			PAGE.$wrapper.find('#edit_event_registration_required').prop('checked', true).trigger('change');
			if (PAGE.event.registration_locally) {
				PAGE.$wrapper.find('#edit_event_registration_locally').prop('checked', true).trigger('change');
			} else {
				PAGE.$wrapper.find('#edit_event_registration_side').prop('checked', true).trigger('change');
			}
			if (PAGE.event.registration_till) {
				PAGE.$wrapper.find('#edit_event_registration_limit_by_date').prop('checked', true).trigger('change');
			}
			if (PAGE.event.registration_limit_count) {
				PAGE.$wrapper.find('#edit_event_registration_limit_by_quantity').prop('checked', true).trigger('change');
			}
			if (page_vars.registration_fields && page_vars.registration_fields.length) {
				PAGE.$wrapper.find('.AddRegistrationCustomField').before(AbstractEditEventPage.buildRegistrationCustomField(page_vars.registration_fields.filter(function(field) {
					var is_custom_field = RegistrationFieldModel.isCustomField(field);
					if (!is_custom_field) {
						PAGE.$wrapper.find('#edit_event_registration_'+field.type+'_field_uuid').val(field.uuid);
						PAGE.$wrapper.find('#edit_event_registration_'+field.type+'_field_enable').prop('checked', true).trigger('change');
						if (field.required) {
							PAGE.$wrapper.find('#edit_event_registration_'+field.type+'_field_required').prop('checked', true);
						}
					}
					
					return is_custom_field;
				})));
			}
		}
		if (page_vars.public_at == null) {
			PAGE.$wrapper.find('#edit_event_delayed_publication').toggleStatus('disabled');
		}
	};
	
	return EditEventPage;
}()));