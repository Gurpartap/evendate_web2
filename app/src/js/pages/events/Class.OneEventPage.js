/**
 * @requires ../Class.Page.js
 */
/**
 *
 * @constructor
 * @augments Page
 * @param {(string|number)} event_id
 */
function OneEventPage(event_id) {
	Page.apply(this);
	
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
	this.is_loading = true;
	this.event = new OneEvent(event_id);
	this.event.fetchEvent(this.fields, Page.triggerRender);
}
OneEventPage.extend(Page);
/**
 *
 * @param {Array} raw_notifications
 * @param {OneEvent.id} event_id
 * @param {OneEvent.last_event_date} last_date
 * @return {jQuery}
 */
OneEventPage.buildNotifications = function(raw_notifications, event_id, last_date) {
	var m_today = moment(),
		all_notifications = {
			'notification-before-quarter-of-hour': {
				label: 'За 15 минут',
				moment: moment.unix(last_date).subtract(15, 'minutes').unix()
			},
			'notification-before-three-hours': {
				label: 'За 3 часа',
				moment: moment.unix(last_date).subtract(3, 'hours').unix()
			},
			'notification-before-day': {
				label: 'За день',
				moment: moment.unix(last_date).subtract(1, 'days').unix()
			},
			'notification-before-three-days': {
				label: 'За 3 дня',
				moment: moment.unix(last_date).subtract(3, 'days').unix()
			},
			'notification-before-week': {
				label: 'За неделю',
				moment: moment.unix(last_date).subtract(1, 'week').unix()
			}
		},
		$notifications = $(),
		current_notifications = {},
		i = 0;
	for (var notif in raw_notifications) {
		if (raw_notifications.hasOwnProperty(notif)) {
			current_notifications[raw_notifications[notif].notification_type] = raw_notifications[notif];
		}
	}
	
	for (var notification in all_notifications) {
		
		if (all_notifications.hasOwnProperty(notification)) {
			var is_disabled = moment.unix(all_notifications[notification].moment).isBefore(m_today),
				data = {
					id: 'event_notify_' + (++i),
					classes: ['ToggleNotification'],
					name: 'notification_time',
					label: all_notifications[notification].label,
					attributes: {
						value: notification
					},
					dataset: {
						event_id: event_id
					}
				};
			
			if (current_notifications[notification]) {
				is_disabled = is_disabled || current_notifications[notification].done || !current_notifications[notification].uuid;
				if (current_notifications[notification].uuid) {
					data.dataset.uuid = current_notifications[notification].uuid;
				}
				data.attributes.checked = true;
			}
			if (is_disabled) {
				data.unit_classes = ['-status_disabled'];
				data.attributes.disabled = true;
			}
			$notifications = $notifications.add(__APP.BUILD.checkbox(data))
		}
	}
	return $notifications;
};

OneEventPage.prototype.init = function() {
	var PAGE = this;
	bindAddAvatar(PAGE.$wrapper);
	trimAvatarsCollection(PAGE.$wrapper);
	bindRippleEffect(PAGE.$wrapper);
	bindDropdown(PAGE.$wrapper);
	//bindShareButtons(PAGE.$wrapper);
	Modal.bindCallModal(PAGE.$wrapper);
	bindCollapsing(PAGE.$wrapper);
	bindPageLinks(PAGE.$wrapper);
	
	PAGE.$wrapper.find('.ToggleNotification').each(function() {
		var $this = $(this);
		
		$this.on('change', function() {
			$this.prop('disabled', true);
			if ($this.prop('checked')) {
				PAGE.event.addNotification($this.val(), function(data) {
					$this.data('uuid', data.uuid);
					$this.prop('disabled', false);
				});
			} else {
				PAGE.event.deleteNotification($this.data('uuid'), function() {
					$this.data('uuid', undefined);
					$this.prop('disabled', false);
				});
			}
		})
	});
	
	PAGE.$wrapper.find('.CancelEvent').on('click.CancelEvent', function() {
		PAGE.event.changeEventStatus(OneEvent.STATUS.CANCEL, function() {
			PAGE.$wrapper.find('.event_canceled_cap').removeClass('-hidden');
		});
	});
	
	PAGE.$wrapper.find('.CancelCancellation').on('click.CancelCancellation', function() {
		PAGE.event.changeEventStatus(OneEvent.STATUS.BRING_BACK, function() {
			PAGE.$wrapper.find('.event_canceled_cap').addClass('-hidden');
		});
	});
	
	PAGE.$wrapper.find('.ExternalLink').on('click.sendStat', function() {
		storeStat(PAGE.event.id, __C.STATS.EVENT_ENTITY, __C.STATS.EVENT_OPEN_SITE);
	});
	
	PAGE.$wrapper.find('.EventMap').on('click.sendStat', function() {
		storeStat(PAGE.event.id, __C.STATS.EVENT_ENTITY, __C.STATS.EVENT_OPEN_MAP);
	});
};

OneEventPage.prototype.render = function() {
	var PAGE = this,
		$subscribers = __APP.BUILD.avatars(PAGE.event.favored, 6),
		avatars_collection_classes = [],
		favored_users_count = ($subscribers.length <= 6) ? 0 : PAGE.event.favored_users_count - 6,
		$event_additional_fields = $();
	
	__APP.changeTitle(PAGE.event.title);
	if (PAGE.event.is_favorite) {
		avatars_collection_classes.push('-subscribed');
		if ($subscribers.length > 4) {
			avatars_collection_classes.push('-shift');
		}
	}
	
	if (PAGE.event.is_same_time) {
		$event_additional_fields = $event_additional_fields.add(tmpl('event-additional-info', {
			key: 'Время',
			value: displayTimeRange(PAGE.event.dates[0].start_time, PAGE.event.dates[0].end_time)
		}));
	} else {
		$event_additional_fields = $event_additional_fields.add(tmpl('event-date-time', {
			date_times: tmpl('event-date-time-row', formatDates(PAGE.event.dates, {
				date: '{D} {MMMMs}',
				time: '{T}'
			}, PAGE.event.is_same_time))
		}));
	}
	$event_additional_fields = $event_additional_fields.add(tmpl('event-additional-info', {
		key: 'Место',
		value: PAGE.event.location
	}));
	$event_additional_fields = $event_additional_fields.add(tmpl('event-additional-info', {
		key: 'Теги',
		value: __APP.BUILD.tags(PAGE.event.tags)
	}));
	
	if (PAGE.event.detail_info_url) {
		$event_additional_fields = $event_additional_fields.add(tmpl('event-detail-link', {detail_info_url: PAGE.event.detail_info_url}));
	}
	
	PAGE.$wrapper.html(tmpl('event-page', $.extend({}, PAGE.event, {
		add_to_favorite_button: new AddToFavoriteButton(PAGE.event.id, PAGE.event.is_favorite, {
			classes: ['event_favourite_button', '-size_low', '-rounded', 'AddAvatar', 'RippleEffect']
		}),
		subscribers: $subscribers,
		avatars_collection_classes: avatars_collection_classes.join(' '),
		favored_users_show: favored_users_count ? '' : '-cast',
		favored_users_count: favored_users_count,
		notifications: OneEventPage.buildNotifications(PAGE.event.notifications, PAGE.event.id, PAGE.event.last_event_date),
		location_sanitized: encodeURI(PAGE.event.location),
		event_edit_functions: PAGE.event.can_edit ? tmpl('event-edit-functions', PAGE.event) : '',
		event_registration_information: PAGE.event.registration_required ? tmpl('event-registration-info', {registration_till: moment.unix(PAGE.event.registration_till).format('D MMMM')}) : '',
		event_price_information: PAGE.event.is_free ? '' : tmpl('event-price-info', {min_price: PAGE.event.min_price ? formatCurrency(PAGE.event.min_price) : '0'}),
		canceled: PAGE.event.canceled ? '' : '-hidden',
		event_additional_fields: $event_additional_fields,
		cancel_cancellation: PAGE.event.can_edit ? tmpl('button', {
			classes: '-color_primary RippleEffect CancelCancellation',
			title: 'Вернуть событие'
		}) : ''
	})));
	
	if (PAGE.event.is_same_time) {
		var m_nearest_date = PAGE.event.nearest_event_date ? moment.unix(PAGE.event.nearest_event_date) : moment.unix(PAGE.event.first_event_date);
		PAGE.calendar = new Calendar(PAGE.$wrapper.find('.EventCalendar'), {
			classes: {
				wrapper_class: 'feed_calendar_wrapper',
				td_class: 'event_calendar_day'
			},
			selection_type: Calendar.SELECTION_TYPES.MULTI,
			disable_selection: true
		});
		PAGE.calendar
			.init()
			.setMonth(m_nearest_date.format('M'), m_nearest_date.format('YYYY'))
			.selectDays(
				PAGE.event.dates.map(function(date) {
					return moment.unix(date.event_date).format(__C.DATE_FORMAT)
				})
			);
	}
	
	PAGE.init();
};