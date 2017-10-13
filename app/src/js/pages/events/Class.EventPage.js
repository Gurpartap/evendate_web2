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
		var self = this,
			render_fields = [
				'title',
				'description',
				'image_horizontal_url'
			];
		
		Page.call(this);

		this.event = new OneEvent(event_id);
		
		this.render_vars = {
			cover_width: 630,
			avatars_collection: null,
			action_button: null,
			event_map: null,
			event_edit_functions: null,
			event_additional_info: null,
			organization_avatar_block: null,
			event_additional_fields: null,
			overlay_cap: null
		};
		
		this.calendar = null;
		
		render_fields.forEach(function(field) {
			Object.defineProperty(self.render_vars, field, {
				enumerable: true,
				get: function() {
					
					return self.event[field];
				}
			});
		});
		
		this.$overlay_cap = $();
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
		'has_landing',
		'is_registered',
		'registration_locally',
		'registration_available',
		'registration_required',
		'registration_approvement_required',
		'registration_till',
		'registration_limit_count',
		'registration_fields',
		'registration_approved',
		'registered_count',
		'registered',
		'ticketing_locally',
		'ticketing_available'
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
			fields: new Fields(
				'created_at',
				'order_content'
			)
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
				PAGE.$wrapper.find('.EventPage').append(PAGE.$overlay_cap);
			});
		});
		
		PAGE.$wrapper.find('.ExternalLink').on('click.sendStat', function() {
			storeStat(PAGE.event.id, __C.STATS.EVENT_ENTITY, __C.STATS.EVENT_OPEN_SITE);
		});
		
		PAGE.$wrapper.find('.EventMap').on('click.sendStat', function() {
			storeStat(PAGE.event.id, __C.STATS.EVENT_ENTITY, __C.STATS.EVENT_OPEN_MAP);
		});
	};
	
	EventPage.prototype.preRender = function() {
		var self = this;
		
		
		this.$overlay_cap = __APP.BUILD.overlayCap($('<p>Организатор отменил событие</p>'));
		
		if (this.event.can_edit) {
			this.$overlay_cap.find('.CapWrapper').append(bindRippleEffect(__APP.BUILD.button({
				title: 'Вернуть событие',
				classes: [
					__C.CLASSES.COLORS.PRIMARY,
					__C.CLASSES.HOOKS.RIPPLE
				]
			}).on('click.CancelCancellation', function() {
				self.event.changeEventStatus(OneEvent.STATUS.BRING_BACK, function() {
					self.$overlay_cap.detach();
				});
			})));
		}
		
		if (this.event.can_edit) {
			this.render_vars.event_functions = tmpl('event-functions', {
				functions: (function() {
					var $function,
						default_classes = [
							'event_function_button',
							__C.CLASSES.SIZES.WIDE,
							__C.CLASSES.ICON_CLASS
						];
					
					$function = __APP.BUILD.actionLink({
						page: '/admin/event/{event_id}/edit'.format({event_id: self.event.id}),
						title: 'Редактировать событие',
						classes: default_classes.concat([
							__C.CLASSES.COLORS.MARGINAL,
							__C.CLASSES.ICONS.PENCIL
						])
					});
					
					$function = $function.add(__APP.BUILD.externalLink({
						page: '/event_landing/?id={event_id}&edit=true'.format({event_id: self.event.id}),
						title: self.event.has_landing ? 'Изменить лендинг' : 'Создать лендинг',
						classes: default_classes.concat([
							__C.CLASSES.COLORS.MARGINAL,
							__C.CLASSES.COMPONENT.ACTION,
							'fa-file-text'
						]),
						attributes: {
							target: '__blank'
						}
					}));
					
					if (self.event.registration_approvement_required) {
						$function = $function.add(__APP.BUILD.actionLink({
							page: '/admin/event/{event_id}/requests'.format({event_id: self.event.id}),
							title: 'Просмотреть заявки',
							classes: default_classes.concat([
								__C.CLASSES.COLORS.MARGINAL,
								__C.CLASSES.ICONS.USER_PLUS
							])
						}, {
							page: '/admin/event/{event_id}/check_in'.format({event_id: self.event.id}),
							title: 'Контроль входа',
							classes: default_classes.concat([
								__C.CLASSES.COLORS.MARGINAL,
								'fa-calendar-check-o'
							])
						}));
					}
					
					$function = $function.add(__APP.BUILD.actionButton({
						title: 'Контроль входа',
						classes: default_classes.concat([
							'DropdownButton',
							__C.CLASSES.COLORS.NEUTRAL,
							__C.CLASSES.ICONS.TIMES_CIRCLE
						]),
						dataset: {
							'dd-width': 'self',
							dropdown: 'cancel_event'
						}
					}));
					
					return $function;
				}())
			});
		}
		
		if (this.event.ticketing_locally || this.event.registration_locally) {
			this.render_vars.event_action = new OrderButton(this.event, {
				classes: [
					'event_main_action_button',
					__C.CLASSES.SIZES.BIG,
					__C.CLASSES.HOOKS.RIPPLE
				],
				colors: {
					unchecked: __C.CLASSES.COLORS.ACCENT,
					unchecked_hover: __C.CLASSES.COLORS.ACCENT
				}
			});
		}
		
		if (!__APP.USER.isLoggedOut()) {
			this.render_vars.event_notifications_button = new DropDown('event-edit-notifications', 'Напоминания', {
				classes: [
					__C.CLASSES.ICON_CLASS,
					__C.CLASSES.ICONS.BELL_O,
					__C.CLASSES.COLORS.MARGINAL_PRIMARY,
					__C.CLASSES.HOOKS.RIPPLE,
					__C.CLASSES.HOOKS.DROPDOWN_BUTTON
				]
			}, {
				width: 190,
				position: {
					x: 'center',
					y: 3
				}
			}, {
				notifications: EventPage.buildNotifications(this.event)
			});
		}
		
		this.render_vars.action_button = new AddToFavoriteButton(this.event.id, {
			is_add_avatar: true,
			is_checked: this.event.is_favorite,
			labels: null,
			classes: [
				__C.CLASSES.UNIVERSAL_STATES.EMPTY,
				__C.CLASSES.HOOKS.RIPPLE
			],
			colors: {
				unchecked: __C.CLASSES.COLORS.DEFAULT,
				unchecked_hover: __C.CLASSES.COLORS.DEFAULT
			}
		});
		
		this.render_vars.avatars_collection = __APP.BUILD.avatarCollection(this.event.favored, 4, {
			dataset: {
				modal_type: 'favors',
				modal_event_id: this.event.id
			},
			classes: [
				__C.CLASSES.UNIVERSAL_STATES.ROUNDED,
				__C.CLASSES.SIZES.SMALL,
				__C.CLASSES.HOOKS.ADD_AVATAR.COLLECTION,
				__C.CLASSES.HOOKS.CALL_MODAL,
				this.event.is_favorite ? __C.CLASSES.HOOKS.ADD_AVATAR.STATES.SHIFTED : ''
			],
			counter_classes: [
				__C.CLASSES.SIZES.X30,
				__C.CLASSES.COLORS.MARGINAL,
				__C.CLASSES.HOOKS.ADD_AVATAR.STATES.CASTABLE
			]
		}, this.event.favored_users_count);
		
		this.render_vars.event_additional_info = $();
		
		if (this.event.registration_required) {
			this.render_vars.event_additional_info = this.render_vars.event_additional_info.add(
				tmpl('event-additional-info', {
					text: (this.event.registration_till ? 'Регистрация до ' + moment.unix(this.event.registration_till).calendar(null, __LOCALES.ru_RU.DATE.CALENDAR_DATE_TIME) : 'Регистрация обязательна')
				})
			);
		}
		
		if (!this.event.is_free) {
			this.render_vars.event_additional_info = this.render_vars.event_additional_info.add(
				tmpl('event-additional-info', {
					text: 'от ' + (this.event.min_price ? formatCurrency(this.event.min_price) : '0') + ' руб.'
				})
			);
		}
		
		if (this.event.is_online) {
			this.render_vars.event_additional_info = this.render_vars.event_additional_info.add(
				tmpl('event-additional-info', {
					text: 'Online'
				})
			);
		}
		
		
		this.render_vars.event_additional_fields = $();
		
		if (this.event.is_same_time) {
			this.render_vars.event_additional_fields = this.render_vars.event_additional_fields.add(
				tmpl('event-additional-field', {
					key: 'Время',
					value: displayTimeRange(this.event.dates[0].start_time, this.event.dates[0].end_time)
				})
			);
		} else {
			this.render_vars.event_additional_fields = this.render_vars.event_additional_fields.add(
				tmpl('event-date-time', {
					date_times: tmpl('event-date-time-row', formatDates(this.event.dates, {
						date: '{D} {MMMMs}',
						time: '{T}'
					}, this.event.is_same_time))
				})
			);
		}
		
		if (this.event.location) {
			this.render_vars.event_additional_fields = this.render_vars.event_additional_fields.add(
				tmpl('event-additional-field', {
					key: 'Место',
					value: tmpl('event-map', {
						location_sanitized: encodeURI(this.event.location),
						location: this.event.location
					})
				})
			);
		}
		
		this.render_vars.event_additional_fields = this.render_vars.event_additional_fields.add(
			tmpl('event-additional-field', {
				key: 'Теги',
				value: __APP.BUILD.tags(this.event.tags)
			})
		);
		
		this.render_vars.event_additional_fields = this.render_vars.event_additional_fields.add(
			tmpl('event-additional-field', {
				key: 'Поделиться',
				value: __APP.BUILD.shareLinks({
					url: encodeURIComponent(window.location),
					title: this.event.title,
					image_url: this.event.image_horizontal_url
				}, [__C.SOCIAL_NETWORKS.VK, __C.SOCIAL_NETWORKS.TWITTER, __C.SOCIAL_NETWORKS.GOOGLE, __C.SOCIAL_NETWORKS.FACEBOOK])
			})
		);
		
		if (this.event.detail_info_url) {
			this.render_vars.event_additional_fields = this.render_vars.event_additional_fields.add(
				tmpl('event-detail-link', {detail_info_url: this.event.detail_info_url})
			);
		}
		
		this.render_vars.organization_avatar_block = __APP.BUILD.avatarBlocks(this.event.organization, {
			block_classes: [__C.CLASSES.SIZES.SMALL],
			is_link: true,
			entity: __C.ENTITIES.ORGANIZATION
		});
		
		if (this.event.canceled) {
			this.render_vars.overlay_cap = this.$overlay_cap;
		}
	};
	
	EventPage.prototype.render = function() {
		var PAGE = this,
			this_event = PAGE.event,
			m_nearest_date = this.event.nearest_event_date ? moment.unix(this.event.nearest_event_date) : moment.unix(this.event.first_event_date);
		
		__APP.changeTitle(this_event.title);
		
		this.$wrapper.html(tmpl('event-page', this.render_vars));
		
		if (this.event.is_same_time) {
			this.calendar = new Calendar(this.$wrapper.find('.EventCalendar'), {
				classes: {
					wrapper_class: 'feed_calendar_wrapper',
					td_class: 'event_calendar_day',
					table_class: 'feed_calendar_table'
				},
				selection_type: Calendar.SELECTION_TYPES.MULTI,
				disable_selection: true
			});
			this.calendar
				.init()
				.setMonth(m_nearest_date.format('M'), m_nearest_date.format('YYYY'))
				.selectDays(
					this.event.dates.map(function(date) {
						
						return moment.unix(date.event_date).format(__C.DATE_FORMAT)
					})
				);
		}
		
		
		this.init();
	};
	
	return EventPage;
}()));
