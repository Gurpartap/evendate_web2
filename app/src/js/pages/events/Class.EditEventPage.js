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
		return this.fetching_data_defer = this.event.fetchEvent(EventPage.fields);
	};
	
	EditEventPage.prototype.renderRest = function(page_vars) {
		var PAGE = this;
		
		(function selectDates($view, raw_dates, is_same_time) {
			var MainCalendar = $view.find('.EventDatesCalendar').data('calendar'),
				start_time = raw_dates[0].start_time.split(':'),
				end_time = raw_dates[0].end_time ? raw_dates[0].end_time.split(':') : [],
				$table_rows = $view.find('.SelectedDaysRows'),
				dates = [],
				$day_row;
			
			if (is_same_time) {
				$day_row = $view.find('.MainTime');
				$day_row.find('.StartHours').val(start_time[0]);
				$day_row.find('.StartMinutes').val(start_time[1]);
				if (end_time.length) {
					$day_row.find('.EndHours').val(end_time[0]);
					$day_row.find('.EndMinutes').val(end_time[1]);
				}
			} else {
				PAGE.$wrapper.find('#edit_event_different_time').prop('checked', true).trigger('change');
			}
			
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