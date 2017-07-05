/**
 * @requires ../Class.Page.js
 */
/**
 *
 * @class EventPage
 * @extends Page
 */
EventPage = extending(Page, (function() {
	/**
	 *
	 * @constructor
	 * @constructs EventPage
	 * @param {(string|number)} event_id
	 */
	function EventPage(event_id) {
		Page.apply(this);

		this.event = new OneEvent(event_id);
	}
	
	EventPage.fields = new Fields([
		'image_horizontal_medium_url',
		'image_horizontal_large_url',
		'favored_users_count',
		'is_favorite',
		'description',
		'location',
		'latitude',
		'longitude',
		'is_online',
		'can_edit',
		'is_free',
		'min_price',
		'organization_logo_small_url',
		'organization_short_name',
		'is_same_time',
		'tags',
		'detail_info_url',
		'canceled',
		'public_at',
		'is_registered',
		'registration_required',
		'registration_approvement_required',
		'registration_till',
		'registration_limit_count',
		'registration_locally',
		'registration_fields',
		'registration_available',
		'registration_approved',
		'registered_count',
		'registered'
	], {
		dates: {
			length: 0,
			fields: new Fields('start_time', 'end_time')
		},
		favored: {
			fields: new Fields('is_friend'),
			order_by: '-is_friend',
			length: 10
		},
		notifications: {
			fields: new Fields('notification_type', 'done')
		},
		orders: {
			fields: new Fields('created_at')
		},
		tickets: {
			fields: new Fields('created_at', 'number', 'ticket_type')
		}
	});
	
	/**
	 *
	 * @param {OneEvent} event
	 * @return {jQuery}
	 */
	EventPage.buildNotifications = function(event) {
		var m_today = moment(),
			all_notifications = {},
			current_notifications = {},
			i = 0;
		
		all_notifications[OneNotification.NOTIFICATIN_TYPES.BEFORE_QUARTER_OF_HOUR] = {
			label: 'За 15 минут',
			moment: moment.unix(event.last_event_date).subtract(15, 'minutes').unix()
		};
		all_notifications[OneNotification.NOTIFICATIN_TYPES.BEFORE_THREE_HOURS] = {
			label: 'За 3 часа',
			moment: moment.unix(event.last_event_date).subtract(3, 'hours').unix()
		};
		all_notifications[OneNotification.NOTIFICATIN_TYPES.BEFORE_DAY] = {
			label: 'За день',
			moment: moment.unix(event.last_event_date).subtract(1, 'days').unix()
		};
		all_notifications[OneNotification.NOTIFICATIN_TYPES.BEFORE_THREE_DAYS] = {
			label: 'За 3 дня',
			moment: moment.unix(event.last_event_date).subtract(3, 'days').unix()
		};
		all_notifications[OneNotification.NOTIFICATIN_TYPES.BEFORE_WEEK] = {
			label: 'За неделю',
			moment: moment.unix(event.last_event_date).subtract(1, 'week').unix()
		};
		
		for (var notif in event.notifications) {
			if (event.notifications.hasOwnProperty(notif)) {
				current_notifications[event.notifications[notif].notification_type] = event.notifications[notif];
			}
		}
		
		return __APP.BUILD.checkbox(Object.keys(all_notifications).map(function(notification) {
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
						event_id: event.id
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
				data.unit_classes = [__C.CLASSES.STATUS.DISABLED];
				data.attributes.disabled = true;
			}
			
			return data;
		})).each(function() {
			$(this).on('change', ':checkbox', function() {
				var $this = $(this);
				
				$this.prop('disabled', true);
				if ($this.prop('checked')) {
					event.addNotification($this.val(), function(data) {
						$this.data('uuid', data.uuid);
						$this.prop('disabled', false);
					});
				} else {
					event.deleteNotification($this.data('uuid'), function() {
						$this.data('uuid', undefined);
						$this.prop('disabled', false);
					});
				}
			});
		});
	};
	
	EventPage.prototype.fetchData = function() {
		return this.fetching_data_defer = this.event.fetchEvent(EventPage.fields);
	};
	
	EventPage.prototype.init = function() {
		var PAGE = this;
		trimAvatarsCollection(PAGE.$wrapper);
		bindRippleEffect(PAGE.$wrapper);
		bindDropdown(PAGE.$wrapper);
		//bindShareButtons(PAGE.$wrapper);
		__APP.MODALS.bindCallModal(PAGE.$wrapper);
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
				PAGE.$wrapper.find('.event_canceled_cap').removeClass(__C.CLASSES.HIDDEN);
			});
		});
		
		PAGE.$wrapper.find('.CancelCancellation').on('click.CancelCancellation', function() {
			PAGE.event.changeEventStatus(OneEvent.STATUS.BRING_BACK, function() {
				PAGE.$wrapper.find('.event_canceled_cap').addClass(__C.CLASSES.HIDDEN);
			});
		});
		
		PAGE.$wrapper.find('.ExternalLink').on('click.sendStat', function() {
			storeStat(PAGE.event.id, __C.STATS.EVENT_ENTITY, __C.STATS.EVENT_OPEN_SITE);
		});
		
		PAGE.$wrapper.find('.EventMap').on('click.sendStat', function() {
			storeStat(PAGE.event.id, __C.STATS.EVENT_ENTITY, __C.STATS.EVENT_OPEN_MAP);
		});
	};
	
	EventPage.prototype.render = function() {
		
		var PAGE = this,
			cover_width = 630,
			this_event = PAGE.event,
			avatars_collection_classes = [
				__C.CLASSES.UNIVERSAL_STATES.ROUNDED,
				__C.CLASSES.UNIVERSAL_STATES.BORDERED,
				__C.CLASSES.SIZES.SMALL,
				__C.CLASSES.HOOKS.ADD_AVATAR.COLLECTION,
				__C.CLASSES.HOOKS.CALL_MODAL
			],
			$action_buttons = new DropDown('event-edit-notifications', '', {
				classes: [
					__C.CLASSES.UNIVERSAL_STATES.EMPTY,
					__C.CLASSES.UNIVERSAL_STATES.ROUNDED,
					__C.CLASSES.SIZES.LOW,
					__C.CLASSES.ICON_CLASS,
					__C.CLASSES.ICONS.BELL_O,
					__C.CLASSES.COLORS.NEUTRAL,
					__C.CLASSES.HOOKS.RIPPLE,
					__C.CLASSES.HOOKS.DROPDOWN_BUTTON
				]
			}, {
				width: 190,
				position: {
					x: 'center',
					y: 6
				}
			}, {
				notifications: EventPage.buildNotifications(this.event)
			}),
			$event_additional_fields = $(),
			$event_additional_information = $(),
			organization = new OneOrganization(this_event.organization_id);

		organization.setData({
			short_name: this_event.organization_short_name,
			img_url: this_event.organization_logo_small_url
		});
		
		__APP.changeTitle(this_event.title);
		if (this_event.is_favorite) {
			avatars_collection_classes.push(__C.CLASSES.HOOKS.ADD_AVATAR.STATES.SHIFTED);
		}

		if (this_event.registration_locally || this_event.ticketing_locally) {
			$action_buttons = $action_buttons.add(new AddToFavoriteButton(this_event.id, {
				is_add_avatar: true,
				is_checked: this_event.is_favorite,
				classes: [
					__C.CLASSES.UNIVERSAL_STATES.EMPTY,
					__C.CLASSES.SIZES.LOW,
					__C.CLASSES.UNIVERSAL_STATES.ROUNDED,
					__C.CLASSES.HOOKS.RIPPLE
				],
				labels: null,
				colors: {
					unchecked: __C.CLASSES.COLORS.NEUTRAL_ACCENT,
					unchecked_hover: __C.CLASSES.COLORS.NEUTRAL_ACCENT
				}
			}));
			
			if (this_event.ticketing_locally) {
				
			} else {
				$action_buttons = $action_buttons.add(new RegisterButton(this_event, {
					classes: [
						'event_main_action_button',
						__C.CLASSES.SIZES.LOW,
						__C.CLASSES.UNIVERSAL_STATES.ROUNDED,
						__C.CLASSES.HOOKS.RIPPLE
					],
					colors: {
						unchecked: __C.CLASSES.COLORS.NEUTRAL_ACCENT,
						unchecked_hover: __C.CLASSES.COLORS.NEUTRAL_ACCENT
					}
				}));
			}
		} else {
			$action_buttons = $action_buttons.add(new AddToFavoriteButton(this_event.id, {
				is_add_avatar: true,
				is_checked: this_event.is_favorite,
				classes: [
					'event_main_action_button',
					__C.CLASSES.SIZES.LOW,
					__C.CLASSES.UNIVERSAL_STATES.ROUNDED,
					__C.CLASSES.HOOKS.RIPPLE
				],
				colors: {
					unchecked: __C.CLASSES.COLORS.NEUTRAL_ACCENT,
					unchecked_hover: __C.CLASSES.COLORS.NEUTRAL_ACCENT
				}
			}));
		}
		
		if (this_event.registration_required) {
			$event_additional_information = $event_additional_information.add(tmpl('event-additional-info', {
				classes: __C.CLASSES.TEXT_COLORS.ACCENT + ' ' + __C.CLASSES.UNIVERSAL_STATES.UPPERCASE,
				text: (this_event.registration_till ? 'Регистрация до ' + moment.unix(this_event.registration_till).calendar(null, __LOCALES.ru_RU.DATE.CALENDAR_DATE_TIME) : 'Регистрация обязательна')
			}));
		}
		
		if (!this_event.is_free) {
			$event_additional_information = $event_additional_information.add(tmpl('event-additional-info', {
				classes: __C.CLASSES.TEXT_COLORS.ACCENT,
				text: 'от ' + (this_event.min_price ? formatCurrency(this_event.min_price) : '0') + ' руб.'
			}));
		}
		
		if (this_event.is_online) {
			$event_additional_information = $event_additional_information.add(tmpl('event-additional-info', {
				classes: __C.CLASSES.TEXT_COLORS.ACCENT,
				text: 'Online'
			}));
		}
		
		if (this_event.is_same_time) {
			$event_additional_fields = $event_additional_fields.add(tmpl('event-additional-field', {
				key: 'Время',
				value: displayTimeRange(this_event.dates[0].start_time, this_event.dates[0].end_time)
			}));
		} else {
			$event_additional_fields = $event_additional_fields.add(tmpl('event-date-time', {
				date_times: tmpl('event-date-time-row', formatDates(this_event.dates, {
					date: '{D} {MMMMs}',
					time: '{T}'
				}, this_event.is_same_time))
			}));
		}
		if (this_event.location) {
			$event_additional_fields = $event_additional_fields.add(tmpl('event-additional-field', {
				key: 'Место',
				value: this_event.location
			}));
		}
		$event_additional_fields = $event_additional_fields.add(tmpl('event-additional-field', {
			key: 'Теги',
			value: __APP.BUILD.tags(this_event.tags)
		}));
		
		if (this_event.detail_info_url) {
			$event_additional_fields = $event_additional_fields.add(tmpl('event-detail-link', {detail_info_url: this_event.detail_info_url}));
		}
		
		PAGE.$wrapper.html(tmpl('event-page', $.extend({}, this_event, {
			cover_width: cover_width,
			action_buttons: $action_buttons,
			avatars_collection: __APP.BUILD.avatarCollection(this_event.favored, 6, {
				dataset: {
					modal_type: 'favors',
					modal_event_id: this_event.id
				},
				classes: avatars_collection_classes,
				counter_classes: [
					__C.CLASSES.SIZES.X30,
					__C.CLASSES.UNIVERSAL_STATES.BORDERED,
					__C.CLASSES.COLORS.MARGINAL,
					__C.CLASSES.HOOKS.ADD_AVATAR.STATES.CASTABLE
				]
			}, this_event.favored_users_count),
			event_map: this_event.location ? tmpl('event-map', {location_sanitized: encodeURI(this_event.location)}) : '',
			event_edit_functions: this_event.can_edit ? tmpl('event-edit-functions', this_event) : '',
			event_additional_info: $event_additional_information,
			canceled: this_event.canceled ? '' : __C.CLASSES.HIDDEN,
			organization_avatar_block: __APP.BUILD.avatarBlocks(organization, {
				block_classes: [__C.CLASSES.SIZES.SMALL],
				is_link: true,
				entity: __C.ENTITIES.ORGANIZATION
			}),
			event_additional_fields: $event_additional_fields,
			cancel_cancellation: this_event.can_edit ? tmpl('button', {
					classes: __C.CLASSES.COLORS.PRIMARY + ' ' + __C.CLASSES.HOOKS.RIPPLE + ' CancelCancellation',
					title: 'Вернуть событие'
				}) : ''
		})));
		
		if (this_event.is_same_time) {
			var m_nearest_date = this_event.nearest_event_date ? moment.unix(this_event.nearest_event_date) : moment.unix(this_event.first_event_date);
			PAGE.calendar = new Calendar(PAGE.$wrapper.find('.EventCalendar'), {
				classes: {
					wrapper_class: 'feed_calendar_wrapper',
					td_class: 'event_calendar_day',
					table_class: 'feed_calendar_table'
				},
				selection_type: Calendar.SELECTION_TYPES.MULTI,
				disable_selection: true
			});
			PAGE.calendar
				.init()
				.setMonth(m_nearest_date.format('M'), m_nearest_date.format('YYYY'))
				.selectDays(
					this_event.dates.map(function(date) {
						return moment.unix(date.event_date).format(__C.DATE_FORMAT)
					})
				);
		}
		
		if(__APP.USER.id === -1){
			$('.DropdownButton, .DropdownBox').remove();
		}
		
		PAGE.init();
	};
	
	return EventPage;
}()));
