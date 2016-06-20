/**
 * Created by Инал on 20.06.2015.
 */

"use strict";

var organizations_loaded = false,
	organizations_refreshing_count = 0,
	__STATES = {
		event: OneEvent,
		feed: Feed,
		organizations: OrganizationsList,
		organization: Organization,
		onboarding: Onboarding,
		search: Search,
		friends: Friends,
		edit_event: EditEvent,
		refreshState: function(){
			var page = this.getCurrentState(),
				$view = $('.screen-view:not(.hidden)');
			this[page]($view, $view.find('[data-controller]'));
		},
		getCurrentState: function(){
			return window.location.pathname.split('/')[1];
		}
	};

/* PAGE CONTROLLERS */
function Feed($view, $content_block){
	var $window = $(window),
		$wrapper = $view.find('.page_wrapper'),
		feed_state = History.getState().data.feed_state,
		feed_state_id = $wrapper.data('feed_state_id') ? $wrapper.data('feed_state_id') : 0,
		feed_date = History.getState().data.date,
		current_offset = 0,
		ajax_url,
		ajax_data = {
			future: true
		},
		fields = [
			'image_horizontal_large_url',
			'organization_name',
			'organization_short_name',
			'organization_logo_small_url',
			'dates',
			'favored_users_count',
			'is_favorite',
			'favored{fields:"is_friend",order_by:"-is_friend",length:10}',
			'registration_required',
			'registration_till',
			'is_free',
			'min_price'
		],
		header_tabs = [
			{
				label: 'Актуальные',
				dataset: {
					page: 'feed',
					feed_state: 'actual',
					title: 'Мероприятия'
				},
				classes: ['Controller']
			},
			{
				label: 'По времени',
				dataset: {
					page: 'feed',
					feed_state: 'timeline',
					title: 'Мероприятия'
				},
				classes: ['Controller']
			},
			{
				label: 'Избранные',
				dataset: {
					page: 'feed',
					feed_state: 'favored',
					title: 'Избранные'
				},
				classes: ['Controller']
			},
			{
				label: 'Рекомендованные',
				dataset: {
					page: 'feed',
					feed_state: 'recommendations',
					title: 'Рекомендованные'
				},
				classes: ['Controller']
			}
		];

	switch(feed_state){
		case 'timeline': {
			ajax_url = '/api/v1/events/my';
			break;
		}
		case 'friends': {
			ajax_url = '/api/v1/events/my';
			ajax_data.order_by = '-favored_friends_count';
			fields.push('favored_friends_count');
			break;
		}
		case 'favored': {
			ajax_url = '/api/v1/events/favorites';
			break;
		}
		case 'recommendations': {
			ajax_url = '/api/v1/events/recommendations';
			ajax_data.order_by = '-rating';
			break;
		}
		default: {
			if(feed_date){
				feed_state = 'day';
				ajax_url = '/api/v1/events/my';
				ajax_data.date = feed_date;
				ajax_data.future = false;
				break;
			}
		}
		case 'actual': {
			feed_state = 'actual';
			ajax_url = '/api/v1/events/my';
			ajax_data.order_by = '-actuality';
			fields.push('actuality');
			break;
		}
	}

	ajax_data.fields = fields.join(',');

	function bindEventsEvents($parent){
		bindAddAvatar($parent);
		trimAvatarsCollection($parent);
		bindRippleEffect($parent);
		bindDropdown($parent);
		Modal.bindCallModal($parent);
		bindControllers($parent);

		$parent.find('.Subscribe').not('.-Handled_Subscribe').each(function(){
			new SubscribeButton($(this), {
				labels: {
					subscribe: 'В избранное',
					unsubscribe: 'Отписаться',
					subscribed: 'В избранном'
				},
				colors: {
					subscribe: '-color_neutral_accent',
					unsubscribe: '-color_accent',
					subscribed: '-color_accent'
				},
				icons: {
					subscribe: 'fa-star-o',
					subscribed: 'fa-star'
				}
			});
		}).addClass('-Handled_Subscribe');

		$parent.find('.HideEvent').not('.-Handled_HideEvent').each(function(){
			var $this = $(this),
				$event = $this.parents('.FeedEvent'),
				event_id = $this.data("event-id");

			$this.on('click', function(){
				$event.addClass('-cancel');
				$.ajax({
					url: '/api/v1/events/'+event_id+'/status',
					data: {
						hidden: true
					},
					method: 'PUT',
					success: function(res){
						ajaxHandler(res, function(data, text){
							$event.after(tmpl('button', {
								classes: '-color_neutral ReturnEvent',
								title: 'Вернуть событие',
								dataset: 'data-event-id="'+event_id+'"'
							}));
							$event.siblings('.ReturnEvent').not('.-Handled_ReturnEvent').on('click', function(){
								var $remove_button = $(this);
								$.ajax({
									url: '/api/v1/events/'+event_id+'/status',
									data: {
										hidden: false
									},
									method: 'PUT',
									success: function(res){
										ajaxHandler(res, function(data, text){
											$remove_button.remove();
											$event.removeClass('-cancel');
										}, ajaxErrorHandler)
									}
								});
							}).addClass('-Handled_ReturnEvent');
						}, ajaxErrorHandler)
					}
				});
			});
		}).addClass('-Handled_HideEvent');
	}

	function initFeedPage($parent){
		var MainCalendar = new Calendar($parent.find('.FeedCalendar'), {
			classes: {
				wrapper_class: 'feed_calendar_wrapper',
				table_class: 'feed_calendar_table',
				thead_class: 'feed_calendar_thead',
				tbody_class: 'feed_calendar_tbody',
				th_class: 'feed_calendar_th',
				td_class: 'feed_calendar_td',
				td_disabled: '-disabled'
			}
		});
		MainCalendar.init();
		if(feed_date){
			MainCalendar.setMonth(feed_date.split('-')[1]).selectDays(feed_date);
		}
		setDaysWithEvents(MainCalendar);
		MainCalendar.$calendar.on('month-changed', function(){
			bindControllers(MainCalendar.$calendar);
			setDaysWithEvents(MainCalendar);
		});
		bindEventsEvents($parent);
	}

	function uploadMoreEvents(length, offset, success){
		var $events = $();
		ajax_data.length = length;
		ajax_data.offset = offset;
		$.ajax({
			url: ajax_url,
			data: ajax_data,
			method: 'GET',
			success: function(res){
				ajaxHandler(res, function(data, text){
					data.forEach(function(event){
						var $subscribers = buildAvatarCollection(event.favored, 4),
							avatars_collection_classes = [],
							favored_users_count = ($subscribers.length <= 4) ? 0 : event.favored_users_count - 4,
							$event;

						if(event.is_favorite){
							avatars_collection_classes.push('-subscribed');
							if($subscribers.length > 4){
								avatars_collection_classes.push('-shift');
							}
						}

						event.subscribe_button_classes = event.is_favorite ? ['fa-star', '-color_accent', '-Subscribed'].join(' ') : ['fa-star-o', '-color_neutral_accent'].join(' ');
						event.subscribe_button_text = event.is_favorite ? 'В избранном' : 'В избранное';
						event.subscribers = $subscribers;
						event.avatars_collection_classes = avatars_collection_classes.join(' ');
						event.favored_users_show = favored_users_count ? '' : '-cast';
						event.favored_users_count = favored_users_count;

						if(event.nearest_event_date){
							event.feed_event_infos = tmpl('feed-event-info', {text: moment.unix(event.nearest_event_date).format('D MMMM, HH:mm')});
						} else {
							var time = event.dates[0].start_time.split(':');
							time.pop();
							event.feed_event_infos = tmpl('feed-event-info', {text: moment.unix(event.dates[0].event_date).format('D MMMM')+', '+time.join(':')});
						}
						if(event.registration_required){
							event.feed_event_infos = event.feed_event_infos.add(tmpl('feed-event-info', {text: 'Регистрация до '+moment.unix(event.registration_till).format('D MMMM, HH:mm')}));
						}
						if(event.is_free){
							event.feed_event_infos = event.feed_event_infos.add(tmpl('feed-event-info', {text: 'Бесплатно'}));
						} else {
							event.feed_event_infos = event.feed_event_infos.add(tmpl('feed-event-info', {text: 'Цена от '+(event.min_price ? event.min_price : 0) +' руб.'}));
						}

						$event = tmpl('feed-event', event);
						$event.appear(function() {
							storeStat(event.id, __C.STATS.EVENT_ENTITY, __C.STATS.EVENT_VIEW);
						}, {accY: 100});

						$events = $events.add($event);
					});
					if(success && typeof success == 'function'){
						success($events);
					}
				}, ajaxErrorHandler)
			}
		});
	}
	$wrapper.empty().data('feed_state_id', ++feed_state_id);

	$window.off('scroll');
	renderHeaderTabs(header_tabs);
	uploadMoreEvents(10, current_offset, function($events){
		if($wrapper.data('feed_state_id') == feed_state_id){
			$wrapper.append(tmpl('feed-event-wrapper', {feed_events: $events}));
			$wrapper.append(tmpl('feed-event-vulcan', {event_cards: ''}));
			initFeedPage($wrapper);

			$window.data('block_scroll', false);
			if($events.length){
				$window.on('scroll.upload'+feed_state.capitalize()+'Events', function(){
					if($window.height() + $window.scrollTop() + 200 >= $(document).height() && !$window.data('block_scroll')){
						$window.data('block_scroll', true);
						uploadMoreEvents(10, current_offset+=10, function($events){
							if($events.length){
								$wrapper.find('.FeedEvents').append($events);
								bindEventsEvents($events);
							} else {
								$wrapper.find('.FeedEvents').append(tmpl('feed-no-event', {
									image_url: '/app/img/sad_eve.png',
									text: 'Как насчет того, чтобы подписаться на организации?'
								}));
								$window.off('scroll.upload'+feed_state.capitalize()+'Events');
							}
							$window.data('block_scroll', false);
						});
					}
				});
			} else {
				$wrapper.find('.FeedEvents').append(tmpl('feed-no-event', {
					image_url: '/app/img/sad_eve.png',
					text: 'Как насчет того, чтобы подписаться на организации?'
				}));
			}
		}

	});
	initFeedPage($view);
}

function OneEvent($view, $content_block){
	var $wrapper = $view.find('.page_wrapper'),
		event_id = (History.getState().data.page ? History.getState().data.page : window.location.pathname).split('/').reverse()[0];

	function initEventPage($parent){
		bindAddAvatar($parent);
		trimAvatarsCollection($parent);
		bindRippleEffect($parent);
		bindDropdown($parent);
		//bindShareButtons($parent);
		Modal.bindCallModal($parent);
		bindCollapsing($parent);
		initNotifications($parent);
		bindControllers($parent);

		$parent.find('.Subscribe').not('.-Handled_Subscribe').each(function(){
			new SubscribeButton($(this), {
				labels: {
					subscribe: 'Добавить в избранное',
					subscribed: 'В избранном'
				},
				colors: {
					subscribe: '-color_neutral_accent',
					unsubscribe: '-color_accent',
					subscribed: '-color_accent'
				},
				icons: {
					subscribe: 'fa-star-o',
					subscribed: 'fa-star'
				}
			});
		}).addClass('-Handled_Subscribe');

		$parent.find('.CancelEvent').on('click.CancelEvent', function(){
			$.ajax({
				url: '/api/v1/events/'+event_id+'/status',
				method: 'PUT',
				data: {canceled: true},
				success: function(res){
					ajaxHandler(res, function(data, text){
						$parent.find('.event_canceled_cap').removeClass('-hidden');
					}, ajaxErrorHandler)
				}
			});
		});

		$parent.find('.CancelCancellation').on('click.CancelCancellation', function(){
			$.ajax({
				url: '/api/v1/events/'+event_id+'/status',
				method: 'PUT',
				data: {canceled: false},
				success: function(res){
					ajaxHandler(res, function(data, text){
						$parent.find('.event_canceled_cap').addClass('-hidden');
					}, ajaxErrorHandler)
				}
			});
		});

		$parent.find('.ExternalLink').on('click.sendStat', function(){
			storeStat(event_id, __C.STATS.EVENT_ENTITY, __C.STATS.EVENT_OPEN_SITE);
		});

		$parent.find('.EventMap').on('click.sendStat', function(){
			storeStat(event_id, __C.STATS.EVENT_ENTITY, __C.STATS.EVENT_OPEN_MAP);
		});
	}

	function initNotifications($parent){
		$parent = $parent ? $parent : $('body');
		$parent.find('.ToggleNotification').each(function(){
			var $this = $(this),
				url, method;

			$this.on('change', function(){
				$this.prop('disabled', true);
				if($this.prop('checked')){
					url = '/api/v1/events/'+$this.data('event_id')+'/notifications';
					method = 'POST';
				} else {
					url = '/api/v1/events/'+$this.data('event_id')+'/notifications/'+$this.data('uuid');
					method = 'DELETE';
				}
				$.ajax({
					url: url,
					method: method,
					data: {notification_type: $this.val()},
					success: function(res){
						ajaxHandler(res, function(data, text){
							if(data.uuid){
								$this.data('uuid', data.uuid);
							} else {
								$this.data('uuid', undefined);
							}
							$this.prop('disabled', false);
						}, ajaxErrorHandler)
					}
				});
			})
		});
	}

	function buildNotifications(raw_notifications, event_id, last_date){
		var m_today = moment(),
			m_last_date = moment.unix(last_date),
			all_notifications = {
				'notification-now': {
					label: 'За 15 минут',
					moment: m_last_date.subtract(15, 'minutes').unix()
				},
				'notification-before-three-hours':  {
					label: 'За 3 часа',
					moment: m_last_date.subtract(3, 'hours').unix()
				},
				'notification-before-day': {
					label: 'За день',
					moment: m_last_date.subtract(1, 'days').unix()
				},
				'notification-before-three-days': {
					label: 'За 3 дня',
					moment: m_last_date.subtract(3, 'days').unix()
				},
				'notification-before-week': {
					label: 'За неделю',
					moment: m_last_date.subtract(1, 'week').unix()
				}
			},
			$notifications = $(),
			current_notifications = {},
			i = 0;
		for(var notif in raw_notifications){
			if(raw_notifications.hasOwnProperty(notif)){
				current_notifications[raw_notifications[notif].notification_type] = raw_notifications[notif];
			}
		}

		for(var notification in all_notifications){

			if(all_notifications.hasOwnProperty(notification)){
				var is_disabled = moment.unix(all_notifications[notification].moment).isBefore(m_today),
					data = {
						id: 'event_notify_'+(++i),
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

				if(current_notifications[notification]){
					is_disabled = is_disabled || current_notifications[notification].done || !current_notifications[notification].uuid;
					if(current_notifications[notification].uuid){
						data.dataset.uuid = current_notifications[notification].uuid;
					}
					data.attributes.checked = true;
				}
				if(is_disabled){
					data.unit_classes = ['-status_disabled'];
					data.attributes.disabled = true;
				}
				$notifications = $notifications.add(buildRadioOrCheckbox('checkbox', data))
			}
		}
		return $notifications;
	}

	function formatDates(dates){
		var prev_day,
			range = [],
			dates_obj = {},
			output = [],
			genitive_month_names = [
				'января',
				'февраля',
				'марта',
				'апреля',
				'мая',
				'июня',
				'июля',
				'августа',
				'сентября',
				'октября',
				'ноября',
				'декабря'
			];

		if(dates.length == 1){
			return [moment.unix(dates[0].event_date).format('LL')];
		}

		dates.forEach(function(date, i){
			var this_day = moment.unix(date.event_date);
			if(!dates_obj.hasOwnProperty(this_day.year())){
				dates_obj[this_day.year()] = {};
			}
			if(!dates_obj[this_day.year()].hasOwnProperty(this_day.month())){
				dates_obj[this_day.year()][this_day.month()] = [];
			}

			if(!prev_day){
				range = [this_day.format('D')];
			} else {
				if(this_day.month() == prev_day.month() && prev_day.diff(this_day, 'days') == -1){
					range.push(this_day.format('D'));
				} else {
					dates_obj[prev_day.year()][prev_day.month()].push(range.length == 1 ? range.shift() : range.shift()+'-'+range.pop());
					range = [this_day.format('D')];
				}
			}

			if(i === dates.length - 1){
				dates_obj[this_day.year()][this_day.month()].push(range.length == 1 ? range.shift() : range.shift()+'-'+range.pop());
			} else {
				prev_day = this_day;
			}
		});

		for(var year in dates_obj){
			if(dates_obj.hasOwnProperty(year)){
				for(var month in dates_obj[year]){
					if(dates_obj[year].hasOwnProperty(month)){
						output.push(dates_obj[year][month].join(', ')+' '+genitive_month_names[month]+' '+year+' г.');
					}
				}
			}
		}


		return output;
	}

	$wrapper.empty();

	$.ajax({
		url: '/api/v1/events/'+event_id+'?fields=image_horizontal_large_url,favored{fields:"is_friend",order_by:"-is_friend",length:10},favored_users_count,is_favorite,notifications{fields:"notification_type,done"},description,location,can_edit,registration_required,registration_till,is_free,min_price,organization_logo_small_url,organization_short_name,is_same_time,dates{fields:"start_time,end_time"},tags,detail_info_url,canceled',
		method: 'GET',
		success: function(res){
			ajaxHandler(res, function(data, text){
				data = data[0];
				var $subscribers = buildAvatarCollection(data.favored, 6),
					avatars_collection_classes = [],
					favored_users_count = ($subscribers.length <= 6) ? 0 : data.favored_users_count - 6;

				if(data.is_favorite){
					avatars_collection_classes.push('-subscribed');
					if($subscribers.length > 4){
						avatars_collection_classes.push('-shift');
					}
				}

				data.subscribe_button_classes = data.is_favorite ? ['fa-check', '-color_accent', '-Subscribed'].join(' ') : ['fa-plus', '-color_neutral_accent'].join(' ');
				data.subscribe_button_text = data.is_favorite ? 'В избранном' : 'Добавить в избранное';
				data.subscribers = $subscribers;
				data.avatars_collection_classes = avatars_collection_classes.join(' ');
				data.favored_users_show = favored_users_count ? '' : '-cast';
				data.favored_users_count = favored_users_count;
				data.notifications = buildNotifications(data.notifications, event_id, data.last_event_date);
				data.location_sanitized = encodeURI(data.location);

				data.event_edit_functions = data.can_edit ? tmpl('event-edit-functions', data) : '';
				data.event_registration_information = data.registration_required ? tmpl('event-registration-info', {registration_till: moment.unix(data.registration_till).format('D MMMM')}) : '';
				data.event_price_information = data.is_free ? '' : tmpl('event-price-info', {min_price: data.min_price ? data.min_price : '0'});
				data.canceled = data.canceled ? '' : '-hidden';

				data.event_additional_fields = $();
				if(data.is_same_time){
					data.event_additional_fields = data.event_additional_fields.add(tmpl('event-additional-info', {
						key: 'Дата',
						value: $(formatDates(data.dates).map(function(elem){return $('<span>').addClass('event_date').text(elem);})).map(function(){return this.toArray();})
					}));
					data.event_additional_fields = data.event_additional_fields.add(tmpl('event-additional-info', {
						key: 'Время',
						value: (data.dates[0].start_time == '00:00:00' && data.dates[0].end_time == '00:00:00') ? 'Весь день' : data.dates[0].start_time.split(':').slice(0,2).join(':') + ' - ' + data.dates[0].end_time.split(':').slice(0,2).join(':')
					}));
				} else {
					var date_times = $();
					data.dates.forEach(function(date){
						date_times = date_times.add(tmpl('event-date-time-row', {
							date: moment.unix(date.event_date).format('D MMMM'),
							start_time: date.start_time.split(':').slice(0,2).join(':'),
							end_time: date.end_time.split(':').slice(0,2).join(':')
						}));
					});
					data.event_additional_fields = data.event_additional_fields.add(tmpl('event-date-time', {date_times: date_times}));
				}
				data.event_additional_fields = data.event_additional_fields = data.event_additional_fields.add(tmpl('event-additional-info', {
					key: 'Место',
					value: data.location
				}));
				data.event_additional_fields = data.event_additional_fields = data.event_additional_fields.add(tmpl('event-additional-info', {
					key: 'Теги',
					value: data.tags.map(function(tag){
						return tag.name.toLowerCase();
					}).join(', ')
				}));
				if(data.detail_info_url){
					data.event_additional_fields = data.event_additional_fields = data.event_additional_fields.add(tmpl('event-detail-link', {detail_info_url: data.detail_info_url}));
				}
/*
				data.share_block = $();
				data.share_block = data.share_block.add(tmpl('vk-share-button', data));
				data.share_block = data.share_block.add(tmpl('facebook-share-button', data));
				data.share_block = data.share_block.add(tmpl('twitter-share-button', data));*/
				data.cancel_cancellation = data.can_edit ? tmpl('button', {
					classes: '-color_primary RippleEffect CancelCancellation',
					title: 'Вернуть событие'
				}) : '';


				$wrapper.append(tmpl('event-page', data));
				initEventPage($view);
			}, ajaxErrorHandler)
		}
	});

}

function OrganizationsList($view, $content_block){
	if (__STATES.getCurrentState() == 'organizations' && organizations_loaded) return;
	$.ajax({
		url: '/api/v1/organizations?fields=is_subscribed,subscribed_count',
		success: function(res){
			organizations_loaded = true;
			var _organizations_by_types = {},
				$categories = $view.find('.new-organizations-categories-wrapper'),
				$organizations = $view.find('.new-organizations-list');
			res.data.forEach(function(organization){
				var _key = '_' + organization.type_id;
				if (!_organizations_by_types.hasOwnProperty(_key)){
					_organizations_by_types[_key] = {type_name: organization.type_name, organizations: {}, count: 0, type_order: parseInt(organization.organization_type_order), type_id: organization.type_id};
				}
				_organizations_by_types[_key].organizations['_' + organization.id] = organization;
				_organizations_by_types[_key].count++;
			});

			var sorted_keys = Object.keys(_organizations_by_types).sort(function(a,b){
				return _organizations_by_types[a].type_order - _organizations_by_types[b].type_order;
			});

			$categories.empty();

			sorted_keys.forEach(function(key){
				var type = _organizations_by_types[key],
					$category = tmpl('new-organizations-category', type);

				$category.data('organizations', type.organizations).on('click', function(){
					var $this = $(this);
					$this.siblings().removeClass('active');
					$this.addClass('active');
					History.pushState({page: 'organizations?type=' + type.type_id}, type.type_name, 'organizations?type=' + type.type_id);
					$organizations.empty();
					$.each(type.organizations, function(_id, organization){
						if(organization.is_subscribed){
							organization.btn_type_class = 'empty';
							organization.btn_text = 'Отписаться';
						}else{
							organization.btn_type_class = 'pink';
							organization.btn_text = 'Подписаться';
						}
						organization.subscribed_count_text = getUnitsText(organization.subscribed_count, __C.TEXTS.SUBSCRIBERS);
						var $organization = tmpl('new-organization-item', organization).data('organization', organization);

						$organizations.append($organization);
						bindControllers($organizations);
					});

					$organizations.find('.subscribe-btn').on('click', function(){
						organizations_refreshing_count++;
						var $btn = $(this),
							to_delete_state = $btn.hasClass('btn-empty'),
							sub_id = $btn.data('subscription-id'),
							org_id = $btn.data('organization-id');
						if ($btn.hasClass(__C.CLASSES.DISABLED)) return;

						type.organizations['_' + org_id].is_subscribed = !to_delete_state;

						$btn.
							toggleClass('btn-empty btn-pink disabled');

						if (to_delete_state){
							$btn.find('span').text('Подписаться');
							toggleSubscriptionState(false, org_id, function(){});
							$btn.removeClass(__C.CLASSES.DISABLED);
							hideSidebarOrganization(org_id);
							return false;
						}else{
							$btn.find('span').text('Отписаться');
							toggleSubscriptionState(true, org_id, function(res){
								$btn.data('subscription-id', res.data.subscription_id);
								return false;
							});

							$btn.removeClass(__C.CLASSES.DISABLED);
							renderSidebarOrganizations([$btn.parents('.new-organization').data('organization')], bindControllers);
						}
					});
				});
				$categories.append($category);
			});
			$view.find('.new-organizations-categories-wrapper').slimscroll({
				height: window.innerHeight - $('.new-organizations-categories-wrapper').offset().top - 50
			});
			var selected_type = searchToObject().type ? searchToObject().type : 1;
			$view.find('.new-category.type-' + selected_type).click();
			bindControllers($view);
		}
	});
}

function Organization($view, $content_block){
	var organization_id = (History.getState().data.page ? History.getState().data.page : window.location.pathname).split('/').reverse()[0],
		url = '/api/v1/organizations/'+organization_id;

	function bindEventsEvents($parent){
		bindRippleEffect($parent);
		bindAddAvatar($parent);
		trimAvatarsCollection($parent);

		$parent.find('.Subscribe').not('.-Handled_Subscribe').each(function(){
			new SubscribeButton($(this), {
				labels: {
					subscribe: 'Добавить в избранное',
					subscribed: 'В избранном'
				},
				colors: {
					subscribe: '-color_neutral_accent',
					unsubscribe: '-color_accent',
					subscribed: '-color_accent'
				}
			});
		}).addClass('-Handled_Subscribe');

		bindControllers($parent);
	}

	function initOrganizationPage($parent){
		bindTabs($parent);
		//placeAvatarDefault($parent.find('.organization_info_page'));

		new SubscribeButton($('.OrganizationSubscribe'), {
			colors: {
				subscribe: '-color_accent',
				unsubscribe: '-color_neutral',
				subscribed: '-color_neutral'
			}
		});
		bindEventsEvents($parent);

		$parent.find('.Tabs').on('change.tabs', function(){
			$(window).off('scroll.uploadFutureEvents scroll.uploadPastEvents');
			bindUploadEventsOnScroll($(this).find('.TabsBody.-active'));
		});

		$parent.find('.ExternalPage').on('click.sendStat', function(){
			storeStat(organization_id, __C.STATS.ORGANIZATION_ENTITY, __C.STATS.ORGANIZATION_OPEN_SITE);
		});
	}

	function buildSubscribers(subscribers, is_first, $scrollbar){
		var $subscribers = $(),
			last_is_fiends = false;

		if(typeof $scrollbar != 'undefined'){
			last_is_fiends = $scrollbar.find('.subscriber').eq(-1).data('is_friend') == true;
		}

		subscribers.forEach(function(subscriber, i){
			if((is_first && !i) || last_is_fiends != subscriber.is_friend){
				$subscribers = $subscribers.add(tmpl('subscriber-divider', {label: subscriber.is_friend ? 'Друзья' : 'Все подписчики'}));
				last_is_fiends = subscriber.is_friend;
			}
			$subscribers = $subscribers.add(tmpl('subscriber', {
				id: subscriber.id,
				is_friend: subscriber.is_friend,
				avatar_url: subscriber.avatar_url,
				name: [subscriber.first_name, subscriber.last_name].join(' ')
			}));
		});
		//placeAvatarDefault($subscribers);

		return $subscribers;
	}

	function uploadMoreSubscribers($wrapper){
		var offset = $wrapper.data('next_offset');
		$.ajax({
			url: url,
			method: 'GET',
			data: {
				fields: 'subscribed{fields:"is_friend",order_by:"-is_friend,first_name",length:10,offset:'+offset+'}'
			},
			success: function(res){
				ajaxHandler(res, function(data){
					if(data[0].subscribed.length){
						var $subscribers = buildSubscribers(data[0].subscribed, false, $wrapper);
						$wrapper.append($subscribers);
						$wrapper.data('next_offset', offset+10);
					} else {
						$wrapper.off('scroll.onScroll');
					}
					bindControllers($wrapper);
				}, ajaxErrorHandler)
			}
		});
	}

	function buildEvents(events, is_future, $wrapper){
		var $events = $(),
			last_date = false;

		if(typeof $wrapper != 'undefined'){
			last_date = $wrapper.find('.subscriber').eq(-1).data('date');
		}

		events.forEach(function(event){
			var m_event_date = is_future ? moment.unix(event.nearest_event_date) : moment.unix(event.last_event_date),
				m_today = moment(),
				$subscribers = buildAvatarCollection(event.favored, 4),
				times = [],
				avatars_collection_classes = [],
				favored_users_count = ($subscribers.length <= 4) ? 0 : event.favored_users_count - 4,
				$event;
			if(last_date != m_event_date.format(__C.DATE_FORMAT)){
				var display_date,
					diff = m_event_date.diff(m_today, 'days', true);

				switch(true){
					case (-2 < diff && diff <= -1):
						display_date = 'Вчера'; break;
					case (-1 < diff && diff <= 0):
						display_date = 'Сегодня'; break;
					case (0 < diff && diff <= 1):
						display_date = 'Завтра'; break;
					default:
						display_date = m_event_date.format('D MMMM');
				}
				$events = $events.add(tmpl('organization-feed-divider', {
					formatted_date: display_date,
					date: m_event_date.format(__C.DATE_FORMAT)
				}));
				last_date = m_event_date.format(__C.DATE_FORMAT);
			}
			event.dates.forEach(function(date){
				if(moment.unix(date.event_date).format(__C.DATE_FORMAT) == m_event_date.format(__C.DATE_FORMAT)){
					if(date.start_time == date.end_time && date.start_time == '00:00:00' ) {
						times.push('Весь день');
					} else if(date.end_time){
						times.push(date.start_time.substr(0, 5)+' - '+date.end_time.substr(0, 5));
					} else {
						times.push(date.start_time.substr(0, 5));
					}
				}
			});
			if(event.is_favorite){
				avatars_collection_classes.push('-subscribed');
				if($subscribers.length > 4){
					avatars_collection_classes.push('-shift');
				}
			}
			$event = tmpl('organization-feed-event', $.extend({}, event, {
				subscribe_button_classes: event.is_favorite ? ['fa-check', '-color_accent', '-Subscribed'].join(' ') : ['fa-plus', '-color_neutral_accent'].join(' '),
				subscribe_button_text: event.is_favorite ? 'В избранном' : 'Добавить в избранное',
				date: m_event_date.format(__C.DATE_FORMAT),
				subscribers: $subscribers,
				avatars_collection_classes: avatars_collection_classes.join(' '),
				favored_users_show: favored_users_count ? '' : '-cast',
				favored_users_count: favored_users_count,
				time: times.join('; ')
			}));
			$event.appear(function() {
				storeStat(event.id, __C.STATS.EVENT_ENTITY, __C.STATS.EVENT_VIEW);
			}, {accY: 100});
			$events = $events.add($event);
		});

		return $events;
	}

	function uploadEvents($wrapper, is_future, onSuccess){
		var offset = $wrapper.data('next_offset') ? $wrapper.data('next_offset') : 0,
			data = {
				length: 10,
				offset: offset,
				organization_id: organization_id,
				fields: 'image_horizontal_medium_url,favored_users_count,is_favorite,favored{length:5},dates',
				order_by: is_future ? 'nearest_event_date' : '-last_event_date'
			};
		if(is_future){
			data.future = 'true'
		} else {
			data.till = moment().format(__C.DATE_FORMAT);
		}
		$.ajax({
			url: '/api/v1/events/',
			method: 'GET',
			data: data,
			success: function(res){
				ajaxHandler(res, function(data){
					var $events = $();
					if(data.length){
						$events = buildEvents(data, is_future, $wrapper);
						$wrapper.append($events);
						$wrapper.data('next_offset', offset+10);
					} else {
						var scroll_event = is_future ? 'scroll.uploadFutureEvents' : 'scroll.uploadPastEvents';
						$wrapper.append('<p class="organization_feed_text">Больше событий нет :(</p>');
						$wrapper.data('disable_upload', true);
						$(window).off(scroll_event);
					}
					if(typeof onSuccess == 'function'){
						onSuccess($events);
					}
					if($wrapper.hasClass(__C.CLASSES.NEW_ACTIVE)){
						$wrapper.parent().height($wrapper.height());
					}
				}, ajaxErrorHandler)
			}
		});
	}

	function bindUploadEventsOnScroll($wrapper){
		var $window = $(window),
			$document = $(document),
			is_future = $wrapper.hasClass('FutureEvents'),
			scroll_event = is_future ? 'scroll.uploadFutureEvents' : 'scroll.uploadPastEvents';

		$window.data('block_scroll', false);
		if(!$wrapper.data('disable_upload')){
			$window.on(scroll_event, function(){
				if($window.height() + $window.scrollTop() + 200 >= $document.height() && !$window.data('block_scroll')){
					$window.data('block_scroll', true);
					uploadEvents($wrapper, is_future, function($events){
						bindEventsEvents($events);
						$window.data('block_scroll', false);
					});
				}
			});
		}
	}

	$view.find('.page_wrapper').empty();
	$('.SidebarOrganizationsList').find('[data-organization_id="'+organization_id+'"]').find('.OrganizationCounter').addClass('-hidden');
	$.ajax({
		url: url,
		method: 'GET',
		data: {
			fields: 'img_small_url,description,site_url,is_subscribed,default_address,subscribed_count,subscribed{fields:"is_friend",order_by:"-is_friend,first_name",length:10}'
		},
		success: function(res){
			ajaxHandler(res, function(data){
				var $page_wrapper = $view.find('.page_wrapper'),
					$past_events_wrapper,
					$future_events_wrapper;

				data = data[0];

				$page_wrapper.append(tmpl('organization-info-page', $.extend({
					subscribe_button_classes: data.is_subscribed ? ['fa-check', '-color_neutral', '-Subscribed'].join(' ') : ['fa-plus', '-color_accent'].join(' '),
					subscribe_button_text: data.is_subscribed ? 'Подписан' : 'Подписаться',
					has_address: data.default_address ? '' : '-hidden'
				}, data)));

				$past_events_wrapper = $view.find('.PastEvents');
				$future_events_wrapper = $view.find('.FutureEvents');

				uploadEvents($future_events_wrapper, true, function($events){
					uploadEvents($past_events_wrapper, false, function($events){
						initOrganizationPage($view);
					});
					bindUploadEventsOnScroll($future_events_wrapper);
				});

				$page_wrapper.append(tmpl('organization-subscribers-page', {
					subscribers_count: data.subscribed_count,
					subscribers: buildSubscribers(data.subscribed, true)
				}));

				var $subscribers_scroll = $view.find('.SubscribersScroll');
				$subscribers_scroll.data('next_offset', 10);
				$subscribers_scroll.scrollbar({
					disableBodyScroll: true,
					onScroll: function(y, x){
						if(y.scroll == y.maxScroll){
							uploadMoreSubscribers($subscribers_scroll);
						}
					}
				});

			}, ajaxErrorHandler);
		}
	});

}

function Search($view, $content_block){
	$view.find('.tl-outer-wrap').addClass(__C.CLASSES.HIDDEN);
	var _search = searchToObject();
	if (_search.hasOwnProperty('q')){
		$('#search_bar_input').val(_search.q);
	}
	_search['fields'] = 'events{fields:"detail_info_url,is_favorite,nearest_event_date,can_edit,location,favored_users_count,organization_name,organization_short_name,organization_logo_small_url,description,favored,is_same_time,tags,dates",filters:"future=true"},organizations{fields:"subscribed_count"}';
	$.ajax({
		url: '/api/v1/search/',
		data: _search,
		success: function(res){
			var $events_wrapper = $view.find('.search-events').empty(),
				$organizations_wrapper = $view.find('.search-organizations').empty();

			res.data.events.forEach(function(event){
				var $event = tmpl('search-event-item', generateEventAttributes(event));

				$event.data('share', {
					'vk': tmpl('vk-share-link', event).attr('href'),
					'facebook': tmpl('facebook-share-link', event).attr('href'),
					'twitter': tmpl('twitter-share-link', event).attr('href')
				});
				$events_wrapper.append($event);
			});

			res.data.organizations.forEach(function(organization){
				organization.subscribed_count_text = getUnitsText(organization.subscribed_count, __C.TEXTS.SUBSCRIBERS);
				var $organization = tmpl('organization-search-item', organization);
				$organizations_wrapper.append($organization);
				bindControllers($organizations_wrapper);
			});

			if (res.data.events.length == 0){
				$events_wrapper.append(tmpl('search-no-events', {}));
			}
			if (res.data.organizations == 0){
				$organizations_wrapper.append(tmpl('search-no-organizations', {}));
			}

			bindEventHandlers();

			$organizations_wrapper.slimscroll({
				height: window.innerHeight - $('.header').height()
			});
			$organizations_wrapper
				.css({
					width: '350px'
				})
				.parent().css({
					position: 'fixed',
					width: '350px'
				});
		}
	});
}

function OneFriend($view, $content_block){
	var friend_id = __STATES.getCurrentState().split('-')[1],
		$content = $view.find('.one-friend-main-content'),
		page_number = 0;
	$view.find('.friends-main-content').addClass(__C.CLASSES.HIDDEN);
	$content.removeClass(__C.CLASSES.HIDDEN).empty();

	function getFriendFeed(){
		var $load_btn = $content.find('.load-more-btn');
		if (page_number == 0){
			$content.find('.friend-events-block').remove();
		}
		$.ajax({
			url: '/api/v1/users/' + friend_id + '/actions?fields=entity,created_at,user,type_code,event{fields:"organization_logo_small_url,image_square_vertical_url,organization_short_name"},organization{fields:"subscribed_count,img_medium_url"}&&order_by=-created_at&length=10&offset=' + (10 * page_number++),
			success: function(res){
				var hide_btn = false;
				if ((res.data.length == 0 && page_number != 1) || (res.data.length < 10 && res.data.length > 0)){
					$load_btn.addClass(__C.CLASSES.HIDDEN);
					hide_btn = true;
				}else if (res.data.length == 0 && page_number == 1){
					$load_btn.before(tmpl('no-activity', {}));
					$load_btn.addClass(__C.CLASSES.HIDDEN);
					hide_btn = true;
				}
				var cards_by_users = {};
				res.data.forEach(function(stat){
					var date = moment.unix(stat.created_at),
						ent = stat[stat.entity],
						key = [stat.entity, stat.stat_type_id, stat.user.id, date.format('DD.MM')].join('-');
					if (cards_by_users.hasOwnProperty(key) == false){
						cards_by_users[key] = {
							user: stat.user,
							entity: stat.entity,
							type_code: stat.type_code,
							date: date.format(__C.DATE_FORMAT) == moment().format(__C.DATE_FORMAT) ? 'Сегодня': date.format('DD.MM'),
							action_name: __C.ACTION_NAMES[stat.type_code][0].capitalize(),
							first_name: stat.user.first_name,
							avatar_url: stat.user.avatar_url,
							friend_id: stat.user.id,
							last_name: stat.user.last_name,
							entities: []
						};
					}

					cards_by_users[key].entities.push(ent);
				});

				$.each(cards_by_users, function(key, value){
					var $card = tmpl('friends-feed-card-short', value),
						item_tmpl_name = value.entity == __C.ENTITIES.EVENT ? 'friends-feed-event' : 'friends-feed-organization';

					value.entities.forEach(function(ent){
						$card.append(tmpl(item_tmpl_name, ent));
					});
					$load_btn.before($card);
				});
				if (!hide_btn){
					$load_btn.removeClass(__C.CLASSES.HIDDEN).find('.btn').removeClass(__C.CLASSES.DISABLED);
				}
				$load_btn.off('click').on('click', getFriendFeed);
				bindFeedEvents($view);
			}
		});
	}

	$.ajax({
		url: '/api/v1/users/' + friend_id + '?fields=subscriptions',
		success: function(res){
			$content.append(tmpl('friends-page-header', res.data[0]));
			$content.find('.friend-user-link').on('click', function(){
				window.open(res.data[0].link, '_blank');
			});

			if (res.data[0].subscriptions.length == 0){
				tmpl('no-subscriptions', {}, $content.find('.one-friend-subscriptions'));
			}else{
				tmpl('friends-subscription', res.data[0].subscriptions, $content.find('.one-friend-subscriptions'))
			}


			$content.find('.friend-subscription-block').each(function(index){
				var $this = $(this);
				setTimeout(function(){
					$this.fadeIn(300);
				}, index * 40 + 500);
			});
			$content.find('.user-btn').on('click', function(){
				var $this = $(this);
				$this.addClass(__C.CLASSES.ACTIVE);
				$this.siblings().removeClass(__C.CLASSES.ACTIVE);
				$content.find('.' + $this.data('tab'))
					.removeClass(__C.CLASSES.HIDDEN)
					.siblings()
					.addClass(__C.CLASSES.HIDDEN);
			});

			$view.find('.back-to-friends-list').on('click', function(){
				History.pushState({page: 'friends'}, 'Мои друзья', 'friends');
			});
			getFriendFeed();
		}
	});


	calculateMargins($view);
}

function Friends($view, $content_block){
	var page_number = 0;
	function getFeed(){
		if (page_number == 0){
			$view.find('.friend-events-block').remove();
		}
		$.ajax({
			url: '/api/v1/users/feed?fields=entity,created_at,user,type_code,event{fields:"organization_logo_small_url,image_square_vertical_url,organization_short_name"},organization{fields:"subscribed_count,img_medium_url"}&&order_by=-created_at&length=10&offset=' + (10 * page_number++),
			success: function(res){
				var cards_by_users = {};
				res.data.forEach(function(stat){
					var date = moment.unix(stat.created_at),
						ent = stat[stat.entity],
						key = [stat.entity, stat.stat_type_id, stat.user.id, date.format('DD.MM')].join('-');
					if (cards_by_users.hasOwnProperty(key) == false){
						cards_by_users[key] = {
							user: stat.user,
							entity: stat.entity,
							type_code: stat.type_code,
							date: date.format(__C.DATE_FORMAT) == moment().format(__C.DATE_FORMAT) ? 'Сегодня': date.format('DD.MM'),
							action_name: __C.ACTION_NAMES[stat.type_code][0],
							first_name: stat.user.first_name,
							friend_id: stat.user.id,
							avatar_url: stat.user.avatar_url,
							last_name: stat.user.last_name,
							entities: []
						};
					}
					cards_by_users[key].entities.push(ent);
				});

				$.each(cards_by_users, function(key, value){
					var $card = tmpl('friends-feed-card', value),
						item_tmpl_name = value.entity == __C.ENTITIES.EVENT ? 'friends-feed-event' : 'friends-feed-organization';

					value.entities.forEach(function(ent){
						$card.append(tmpl(item_tmpl_name, ent));
					});
					$load_btn.before($card);
				});
				$load_btn.removeClass(__C.CLASSES.HIDDEN).find('.btn').removeClass(__C.CLASSES.DISABLED);
				calculateMargins($view);
				bindFeedEvents($view);
			}
		});
	}



	var $main_content = $view.find('.friends-main-content').removeClass(__C.CLASSES.HIDDEN),
		$friends_right_list = $view.find('.friends-right-bar'),
		$load_btn = $view.find('.load-more-btn').addClass(__C.CLASSES.HIDDEN),
		$user_content = $view.find('.one-friend-main-content').addClass(__C.CLASSES.HIDDEN);


	getFriendsList($friends_right_list, function(res){});
	$load_btn.find('.btn').on('click', getFeed);
	getFeed();
}

function EditEvent($view, $content_block){
	var $wrapper = $view.find('.page_wrapper'),
		event_id = History.getState().data.eventId;

	function initEditEventPage($view){

		function bindLoadByURLButton(){
			$('.LoadByURLButton').not('-Handled_LoadByURLButton').on('click', function(){
				var $this = $(this),
					$input = $('#'+$this.data('load_input'));
				$this.data('url', $input.val());
				window.current_load_button = $this;
				socket.emit('image.getFromURL', $input.val());
				window.paceOptions = {
					catchupTime : 10000,
					maxProgressPerFrame:1,
					ghostTime: Number.MAX_SAFE_INTEGER,
					checkInterval :{
						checkInterval: 10000
					},
					eventLag : {
						minSamples: 1,
						sampleCount: 30000000,
						lagThreshold: 0.1
					}
				}; //хз зачем, все равно не работает
				Pace.restart();
			}).addClass('-Handled_LoadByURLButton');
		}

		function handleImgUpload($context, source, filename){
			var $parent = $context.closest('.EditEventImgLoadWrap'),
				$preview = $parent.find('.EditEventImgPreview'),
				$file_name_text = $parent.find('.FileNameText'),
				$file_name = $parent.find('.FileName'),
				$data_url = $parent.find('.DataUrl'),
				$button = $parent.find('.CallModal');

			$preview.attr('src', source);
			$file_name_text.html('Загружен файл:<br>'+filename);
			$file_name.val(filename);
			$button
				.data('source_img', source)
				.on('crop', function(event, cropped_src, crop_data){
					$preview.attr('src', cropped_src);
					$button.data('crop_data', crop_data);
					$data_url.val('data.source').data('source', $preview.attr('src')).trigger('change');
				})
				.trigger('click.CallModal');
		}

		function initEditEventMainCalendar($view){
			//TODO: Refactor this!! Make it more readable

			var $selected_days_text = $view.find('.EventSelectedDaysText'),
				$selected_days_table_rows = $view.find('.SelectedDaysRows'),
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



			function bindRemoveRow($parent){
				$parent.find('.RemoveRow').not('.-Handled_RemoveRow').each(function(i, elem){
					$(elem).on('click', function(){
						MainCalendar.deselectDays($(this).closest('tr').data('date'));
					}).addClass('-Handled_RemoveRow');
				});
			}

			function displayFormattedText(){
				dates = {};
				MainCalendar.selected_days.forEach(function(date, i, days){
					var _date = moment(date);

					if(typeof dates[_date.month()] === 'undefined'){
						dates[_date.month()] = {};
						dates[_date.month()].selected_days = [];
						dates[_date.month()].month_name = genitive_month_names[_date.format('MMMM')];
					}
					dates[_date.month()].selected_days.push(_date.date());
				});

				$selected_days_text.empty().removeClass('hidden');
				if(Object.keys(dates).length){
					$.each(dates, function(i, elem){
						$selected_days_text.append($('<p>').text(elem.selected_days.join(', ') + ' ' + elem.month_name))
					});
				} else {
					$selected_days_text.html('<p>Даты не выбраны</p>');
				}
			}

			function doTheFuckingSort($rows, $parent){
				$rows.sort(function(a,b){
					var an = $(a).data('date'),
						bn = $(b).data('date');

					if(an > bn) return 1;
					else if(an < bn) return -1;
					else return 0;
				});
				$rows.detach().appendTo($parent);
			}

			function buildTable(selected_days){
				//TODO: BUG. On multiple selection (month or weekday) duplicates appearing in table.
				//TODO: Bind time on building table
				var $output = $();
				if(Array.isArray(selected_days)){
					selected_days.forEach(function(day){
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
				$output.find('.DatePicker').each(function(){
					var DP = $(this).data('datepicker');
					DP.$datepicker.on('date-picked', function(){
						MainCalendar.deselectDays(DP.prev_selected_day).selectDays(DP.selected_day);
						doTheFuckingSort($fucking_table, $selected_days_table_rows)
					});
				});
				doTheFuckingSort($fucking_table, $selected_days_table_rows);
			}

			function BuildSelectedDaysTable(){
				if(MainCalendar.last_action === 'select'){
					buildTable(MainCalendar.last_selected_days);
				}
				else if(MainCalendar.last_action === 'deselect'){
					if(Array.isArray(MainCalendar.last_selected_days)){
						var classes = [];
						MainCalendar.last_selected_days.forEach(function(day){
							classes.push('.TableDay_'+day);
						});
						$fucking_table.detach(classes.join(', '));
						$fucking_table = $fucking_table.not(classes.join(', '));
					}
					else {
						$fucking_table.detach('.TableDay_'+MainCalendar.last_selected_days);
						$fucking_table = $fucking_table.not('.TableDay_'+MainCalendar.last_selected_days);
					}
				}

				doTheFuckingSort($fucking_table, $selected_days_table_rows);

				//TODO: Do not forget to rename 'fucking' names
				//TODO: Please, don't forget to rename 'fucking' names

			}

			$view.find('#edit_event_different_time').on('change', function(){
				var $table_wrapper = $view.find('#edit_event_selected_days_wrapper'),
					$table_content = $table_wrapper.children();
				if($(this).prop('checked')){
					buildTable(MainCalendar.selected_days);
					$table_wrapper.height($table_content.height()).one('transitionend', function(){
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
				$view.find('.MainTime').toggleStatus('disabled');
			});

			var AddRowDatePicker = $view.find('.AddDayToTable').data('datepicker');
			AddRowDatePicker.$datepicker.on('date-picked', function(){
				MainCalendar.selectDays(AddRowDatePicker.selected_day);
			});

		}

		bindDatePickers($view);
		bindTimeInput($view);
		bindSelect2($view);
		bindTabs($view);
		limitInputSize();
		bindRippleEffect();
		bindFileLoadButton();
		bindLoadByURLButton();
		initEditEventMainCalendar($view);

		//TODO: perepilit' placepicker
		$view.find(".Placepicker").placepicker();

		$view.find('.EventTags').select2({
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
				data: function (term, page) {
					return {
						name: term // search term
					};
				},
				results: function(data) {
					var _data = [];
					data.data.forEach(function(value){
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

		$view.find('.EditEventDefaultAddress').off('click.defaultAddress').on('click.defaultAddress', function(){
			var $this = $(this);
			$this.closest('.form_group').find('input').val($this.data('default_address'))
		});

		$view.find('#edit_event_delayed_publication').off('change.DelayedPublication').on('change.DelayedPublication', function(){
			$view.find('.DelayedPublication').toggleStatus('disabled');
		});

		$view.find('#edit_event_registration_required').off('change.RequireRegistration').on('change.RequireRegistration', function(){
			$view.find('.RegistrationTill').toggleStatus('disabled');
		});

		$view.find('#edit_event_free').off('change.FreeEvent').on('change.FreeEvent', function(){
			$view.find('.MinPrice').toggleStatus('disabled');
		});

		$view.find('.MinPrice').find('input').inputmask({
			'alias': 'numeric',
			'autoGroup': false,
			'digits': 2,
			'digitsOptional': true,
			'placeholder': '0',
			'rightAlign': false
		});

		socket.on('image.getFromURLDone', function(response){
			if(response.error){
				showNotifier({text: response.error, status: false});
			} else {
				handleImgUpload(window.current_load_button, response.data, response.filename);
			}
		});

		$view.find('.LoadImg').off('change.LoadImg').on('change.LoadImg', function(e){
			var $this = $(e.target),
				files = e.target.files;

			if (files.length == 0) return false;
			for(var i = 0, f; f = files[i]; i++) {
				var reader = new FileReader();
				if (!f.type.match('image.*'))	continue;
				reader.onload = (function(the_file) {
					return function(e) {
						handleImgUpload($this, e.target.result, the_file['name']);
					};
				})(f);
				reader.readAsDataURL(f);
			}

		});

		$view.find('#edit_event_to_public_vk').off('change.PublicVK').on('change.PublicVK', function(){
			var $vk_post_wrapper = $view.find('#edit_event_vk_publication'),
				$vk_post_content = $vk_post_wrapper.children();
			if($(this).prop('checked')){
				$vk_post_wrapper.height($vk_post_content.height());
			} else {
				$vk_post_wrapper.height(0);
			}
			$vk_post_wrapper.toggleStatus('disabled');

			$vk_post_content.find('.DeleteImg').off('click.DeleteImg').on('click.DeleteImg', function(){
				$(this).closest('.EditEventImgLoadWrap').find('input').val('').end().find('img').attr('src', '');
				toggleVkImg();
			})

		});

		$view.find('#edit_event_submit').off('click.Submit').on('click.Submit', submitEditEvent);

	}


	socket.on('vk.getGroupsToPostDone', function(response){
		if(response.error){
			showNotifier({text: response.error, status: false});
		} else {
			var data = response.data.response,
				$groups = $view.find('#edit_event_vk_groups');
			if(data.length || data[0]){
				data.splice(0,1);
				data.forEach(function(option){
					$groups.append(tmpl('option', {
						val: option.gid,
						display_name: option.name,
						data: "data-img='"+option.photo+"'"
					}));
				});
				initSelect2($groups);
			} else {
				$view.find('#edit_event_to_public_vk').toggleStatus('disabled').prop('checked', false).trigger('change');
			}
		}
	});

	socket.on('vk.post.error', function(response){
		console.log(response);
		showNotifier({text: 'Не удалось опубликовать событие в группе vk. Пожалуйста, попробуйте еще раз.', status: false});
	});

	function initOrganization(selected_id){
		$.ajax({
			url: '/api/v1/organizations',
			method: 'GET',
			data: {
				privileges: 'can_add',
				fields: 'default_address'
			},
			success: function(res){
				ajaxHandler(res, function(data){
					var $wrapper = $('.EditEventOrganizations'),
						organizations_options = $(),
						$default_address_button = $view.find('.EditEventDefaultAddress'),
						$select = $wrapper.find('#edit_event_organization'),
						selected_address;

					data.forEach(function(organization){
						if(organization.id == selected_id){
							selected_address = organization.default_address;
						}
						organizations_options = organizations_options.add(tmpl('option', {
							val: organization.id,
							data: "data-image-url='"+organization.img_url+"' data-default-address='"+organization.default_address+"'",
							display_name: organization.name
						}));
					});

					$select.append(organizations_options).select2({
						containerCssClass: 'form_select2',
						dropdownCssClass: 'form_select2_drop'
					}).on('change', function(){
						$default_address_button.data('default_address', $(this).children(":selected").data('default-address'));
					});
					if(selected_id){
						$select.select2('val', selected_id);
						$default_address_button.data('default_address', selected_address);
					} else {
						$default_address_button.data('default_address', data[0].default_address);
					}
					if(organizations_options.length > 1){
						$wrapper.removeClass('-hidden');
					} else {
						$wrapper.addClass('-hidden');
					}
				}, ajaxErrorHandler)
			}
		});
	}

	function toggleVkImg(){
		var $wrap = $view.find('#edit_event_vk_publication').find('.EditEventImgLoadWrap'),
			$left_block = $wrap.children().eq(0),
			$right_block = $wrap.children().eq(1);

		if(!$left_block.hasClass('-hidden')){
			$right_block.find('.LoadImg').off('change.ToggleVkImg').one('change.ToggleVkImg', toggleVkImg);
			$right_block.find('.Text').text('Добавить картинку');
		} else {
			$right_block.find('.LoadImg').off('change.ToggleVkImg');
			$right_block.find('.Text').text('Изменить');
		}
		$left_block.toggleClass('-hidden');
		$right_block.toggleClass('-h_centering');
	}

	function selectDates($view, raw_dates){
		var	MainCalendar = $view.find('.EventDatesCalendar').data('calendar'),
			$table_rows = $view.find('.SelectedDaysRows'),
			dates = [];
		raw_dates.forEach(function(date){
			date.event_date = moment.unix(date.event_date).format('YYYY-MM-DD');
			dates.push(date.event_date);
		});
		MainCalendar.selectDays(dates);
		raw_dates.forEach(function(date){
			var $day_row = $table_rows.find('.TableDay_'+date.event_date),
				start_time = date.start_time.split(':'),
				end_time = date.end_time ? date.end_time.split(':') : [];
			$day_row.find('.StartHours').val(start_time[0]);
			$day_row.find('.StartMinutes').val(start_time[1]);
			if(end_time.length){
				$day_row.find('.EndHours').val(end_time[0]);
				$day_row.find('.EndMinutes').val(end_time[1]);
			}
		});
	}

	function selectTags($view, tags){
		var	selected_tags = [];
		tags.forEach(function(tag){
			selected_tags.push({
				id: parseInt(tag.id),
				text: tag.name
			});
		});

		$view.find('#event_tags').select2('data', selected_tags);
	}

	function initVkImgCopying(){
		var $vk_wrapper = $view.find('#edit_event_vk_publication');
		$view.find('#edit_event_image_horizontal_src').on('change.CopyToVkImg', function(){
			var $wrap = $(this).closest('.EditEventImgLoadWrap'),
				$vk_wrap = $view.find('#edit_event_vk_publication'),
				$vk_preview = $vk_wrap.find('.EditEventImgPreview'),
				$vk_button = $vk_wrap.find('.CallModal'),
				$vk_$data_url = $vk_wrap.find('#edit_event_vk_image_src'),
				$button_orig = $wrap.find('.CallModal'),
				src = $(this).data('source');

			if(!$view.find('.edit_event_vk_right_block').hasClass('-h_centering')){
				toggleVkImg();
			}
			$vk_$data_url.val('data.source').data('source', src);
			$vk_preview.attr('src', src);
			$vk_wrap.find('#edit_event_vk_image_filename').val($view.find('#edit_event_image_horizontal_filename').val());
			$vk_button
				.data('crop_data', $button_orig.data('crop_data'))
				.data('source_img', $button_orig.data('source_img'))
				.on('crop', function(event, cropped_src, crop_data){
					$vk_preview.attr('src', cropped_src);
					$vk_button.data('crop_data', crop_data);
					$vk_$data_url.data('source', $vk_preview.attr('src')).trigger('change');
				});

		});
		$vk_wrapper.find('.FileLoadButton, .CallModal, .DeleteImg').on('click.OffCopying', function(){
			$view.find('#edit_event_image_horizontal_src').off('change.CopyToVkImg');
		});
	}

	function formatVKPost(){
		var $post = $view.find('#edit_event_vk_post'),
			$title = $view.find('#edit_event_title'),
			$calendar = $view.find('.EventDatesCalendar').data('calendar'),
			$place = $view.find('#edit_event_placepicker'),
			$description = $view.find('#edit_event_description'),
			$is_free = $view.find('#edit_event_free'),
			$min_price = $view.find('#edit_event_min_price'),
			$is_required = $view.find('#edit_event_registration_required'),
			$registration_till = $view.find('.RegistrationTill'),
			$tags = $view.find('.EventTags'),
			tags = [],
			$link = $view.find('#edit_event_url'),
			post_text = '';

		post_text +=$title.val() ? $title.val() + '\n\n' : '';

		if($calendar.selected_days){
			post_text += ($calendar.selected_days.length > 1) ? 'Дата начала: ' : 'Начало: ';
			post_text += moment($calendar.selected_days[0]).format('D MMMM YYYY');
			if($calendar.selected_days.length == 1){
				var $main_time_inputs = $view.find('.MainTime').find('input');
				post_text += $main_time_inputs.eq(0).val() ? ' в ' + parseInt($main_time_inputs.eq(0).val()) : '';
				post_text += $main_time_inputs.eq(1).val() ? ':' + $main_time_inputs.eq(1).val() : '';
			}
		}
		if($is_required.prop('checked')){
			var $inputs = $registration_till.find('input');
			if($inputs.eq(0).val()){
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

		if(!$is_free.prop('checked')){
			post_text += $min_price.val() ? 'Цена от ' + $min_price.val() + '\n\n' : '';
		}

		$tags.find('.select2-search-choice').each(function(i,tag){
			tags.push('#' + $(tag).text().trim());
		});
		post_text += tags ? tags.join(' ') + '\n\n' : '';

		if($link.val()){
			post_text += $link.val()
		} else if(event_id) {
			post_text += 'http://evendate.ru/event.php?id='+event_id;
		}

		$post.val(post_text);
	}

	function checkVkPublicationAbility(){
		if(__USER.accounts.indexOf("vk") !== -1){
			socket.emit('vk.getGroupsToPost', __USER.id);
			$view
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
				.on('change.FormatVkPost', formatVKPost);
			$view.find('.EventDatesCalendar').data('calendar').$calendar.on('days-changed.FormatVkPost', formatVKPost);
		} else {
			$view.find('#edit_event_to_public_vk').toggleStatus('disabled');
		}
	}

	function submitEditEvent(){
		function formValidation($form, for_edit){
			var is_valid = true,
				$times = $form.find('#edit_event_different_time').prop('checked') ? $form.find('[class^="TableDay_"]') : $form.find('.MainTime');

			$form.find(':required').not(':disabled').each(function(){
				var $this = $(this),
					max_length = $this.data('maxlength');
				if($this.val() === "" || (max_length && $this.val().length > max_length)){
					if(is_valid){
						$('body').stop().animate({scrollTop: Math.ceil($this.offset().top - 150)}, 1000, 'swing');
					}
					handleErrorField($this);
					is_valid = false;
				}
			});

			$times.each(function(){
				var $row = $(this),
					start = $row.find('.StartHours').val()+$row.find('.StartMinutes').val(),
					end = $row.find('.EndHours').val()+$row.find('.EndMinutes').val();
				if(start > end){
					if(is_valid){
						$('body').stop().animate({scrollTop: Math.ceil($row.offset().top - 150)}, 1000, 'swing');
					}
					showNotifier({text: 'Начальное время не может быть меньше конечного', status: false});
					is_valid = false;
				}
			});

			if(!for_edit){
				$form.find('.DataUrl').each(function(){
					var $this = $(this);
					if($this.val() === ""){
						if(is_valid){
							$('body').stop().animate({scrollTop: Math.ceil($this.closest('.EditEventImgLoadWrap').offset().top - 150)}, 1000, 'swing', function(){
								showNotifier({text: 'Пожалуйста, добавьте к событию обложку', status: false})
							});
						}
						is_valid = false;
					}
				});
			}
			return is_valid;
		}

		var $form = $view.find("#edit-event-form"),
			data = {
				event_id: null,
				title: null,
				image_vertical: null,
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
					vertical: null,
					horizontal: null
				}
			},
			form_data = $form.serializeForm(),
			tags = form_data.tags ? form_data.tags.split(',') : null,
			url = form_data.event_id ? '/api/v1/events/'+form_data.event_id : '/api/v1/events/',
			method = form_data.event_id ? 'PUT' : 'POST',
			valid_form = formValidation($form, !!(form_data.event_id));

		if(valid_form){
			$.extend(true, data, form_data);

			data.tags = tags;
			data.filenames = {
				vertical: data.filename_vertical,
				horizontal: data.filename_horizontal
			};
			if(data.registration_required){
				data.registration_till = ""+data.registration_till_date+'T'+data.registration_till_time_hours+':'+data.registration_till_time_minutes+':00'
			}
			if(data.delayed_publication){
				data.public_at = ""+data.public_at_date+'T'+data.public_at_time_hours+':'+data.public_at_time_minutes+':00'
			}

			data.dates = [];
			if(data.different_time){
				var	selected_days_rows = $('.SelectedDaysRows').children();

				selected_days_rows.each(function(){
					var $this = $(this);
					data.dates.push({
						event_date: $this.find('.DatePicker').data('selected_day'),
						start_time: $this.find('.StartHours').val() + ':' + $this.find('.StartMinutes').val(),
						end_time: $this.find('.EndHours').val() + ':' + $this.find('.EndMinutes').val()
					});
				});
			} else {
				var	MainCalendar = $('.EventDatesCalendar').data('calendar'),
					$main_time = $('.MainTime'),
					start_time = $main_time.find('.StartHours').val() + ':' + $main_time.find('.StartMinutes').val(),
					end_time = $main_time.find('.EndHours').val() + ':' + $main_time.find('.EndMinutes').val();

				MainCalendar.selected_days.forEach(function(day){
					data.dates.push({
						event_date: day,
						start_time: start_time,
						end_time: end_time
					})
				});
			}


			$.ajax({
				url: url,
				data: JSON.stringify(data),
				contentType: 'application/json',
				method: method,
				success: function(res){
					ajaxHandler(res, function(res_data){/*
						if(data.event_id){
							$('body').stop().animate({scrollTop:0}, 1000, 'swing', function() {
								showNotification('Событие успешно обновлено', 3000);
							});
						} else {
							$view.find('#edit_event_event_id').val(res_data.event_id);
							$('body').stop().animate({scrollTop:0}, 1000, 'swing', function() {
								showNotification('Событие успешно добавлено', 3000);
							});
						}*/

						if($view.find('#edit_event_to_public_vk').prop('checked')){
							socket.emit('vk.post', {
								guid: data.vk_group,
								event_id: data.event_id ? data.event_id : res_data.event_id,
								message: data.vk_post,
								image: {
									base64: data.vk_image_src,
									filename : data.vk_image_filename
								},
								link: data.detail_info_url
							});
						}
						window.location = '/event/'+res_data.event_id;

					}, function(res){
						if(res.text){
							showNotifier({text: res.text, status: false});
						} else {
							ajaxErrorHandler(res);
						}
					});
				}
			});
		}

	}

	$wrapper.empty();
	var additional_fields = {
		event_id: event_id,
		header_text: 'Новое событие',
		public_at_data_label: 'Дата',
		registration_till_data_label: 'Дата',
		current_date: moment().format(__C.DATE_FORMAT),
		tomorrow_date: moment().add(1, 'd').format(__C.DATE_FORMAT)
	};
	if(typeof event_id === 'undefined'){
		$wrapper.html(tmpl('edit-event-page', additional_fields));
		initEditEventPage($view);
		Modal.bindCallModal($view);
		initOrganization();
		checkVkPublicationAbility();
		toggleVkImg();
		initVkImgCopying();
	} else {
		var url = '/api/v1/events/'+event_id;
		$.ajax({
			url: url,
			method: 'GET',
			data: {
				fields: 'location,description,tags,nearest_event_date,detail_info_url,public_at,registration_required,registration_till,is_free,min_price,is_same_time,dates{length:0,fields:"start_time,end_time"}'
			},
			success: function(res){
				ajaxHandler(res, function(data){
					data = Array.isArray(data) ? data[0] : data;
					additional_fields.header_text = 'Редактирование события';
					if(data.public_at !== null){
						var m_public_at = moment(data.public_at);
						additional_fields.public_at_data = m_public_at.format('YYYY-MM-DD');
						additional_fields.public_at_data_label = m_public_at.format('DD.MM.YYYY');
						additional_fields.public_at_time_hours = m_public_at.format('HH');
						additional_fields.public_at_time_minutes = m_public_at.format('mm');
					}
					if(data.registration_required){
						var m_registration_till = moment.unix(data.registration_till);
						additional_fields.registration_till_data = m_registration_till.format('YYYY-MM-DD');
						additional_fields.registration_till_data_label = m_registration_till.format('DD.MM.YYYY');
						additional_fields.registration_till_time_hours = m_registration_till.format('HH');
						additional_fields.registration_till_time_minutes = m_registration_till.format('mm');
					}
					if(data.image_vertical_url){
						additional_fields.image_vertical_filename = data.image_vertical_url.split('/').reverse()[0];
					}
					if(data.image_horizontal_url){
						additional_fields.image_horizontal_filename = data.image_horizontal_url.split('/').reverse()[0];
						additional_fields.vk_image_url = data.image_horizontal_url;
						additional_fields.vk_image_filename = additional_fields.image_horizontal_filename;
					}
					if(data.vk_image_url){
						additional_fields.vk_image_url = data.vk_image_url;
						additional_fields.vk_image_filename = data.vk_image_url.split('/').reverse()[0];
					}

					$.extend(true, data, additional_fields);
					$wrapper.html(tmpl('edit-event-page', data));

					initEditEventPage($view);
					initOrganization(data.organization_id);
					checkVkPublicationAbility();

					if(data.is_same_time){
						var $day_row = $view.find('.MainTime'),
							start_time = data.dates[0].start_time.split(':'),
							end_time = data.dates[0].end_time ? data.dates[0].end_time.split(':') : [];
						$day_row.find('.StartHours').val(start_time[0]);
						$day_row.find('.StartMinutes').val(start_time[1]);
						if(end_time.length){
							$day_row.find('.EndHours').val(end_time[0]);
							$day_row.find('.EndMinutes').val(end_time[1]);
						}
					} else {
						$view.find('#edit_event_different_time').prop('checked', true).trigger('change');
					}
					selectDates($view, data.dates);
					selectTags($view, data.tags);
					if(data.image_vertical_url && data.image_horizontal_url){
						$view.find('.CallModal').removeClass('-hidden').on('crop', function(event, cropped_src, crop_data){
							var $button = $(this),
								$parent = $button.closest('.EditEventImgLoadWrap'),
								$preview = $parent.find('.EditEventImgPreview'),
								$data_url = $parent.find('.DataUrl');
							$data_url.val('data.source').data('source', $preview.attr('src')).trigger('change');
							$preview.attr('src', cropped_src);
							$button.data('crop_data', crop_data);
						});
					}
					Modal.bindCallModal($view);

					if(data.image_vertical_url){
						toDataUrl(data.image_vertical_url, function(base64_string){
							$view.find('#edit_event_image_vertical_src').val(base64_string ? base64_string : null);
						});
					}
					if(data.image_horizontal_url){
						toDataUrl(data.image_horizontal_url, function(base64_string){
							$view.find('#edit_event_image_horizontal_src').val(base64_string ? base64_string : null);
						});
					}
					if(additional_fields.vk_image_url){
						toDataUrl(additional_fields.vk_image_url, function(base64_string){
							$view.find('#edit_event_vk_image_src').val(base64_string ? base64_string : null);
						});
					}
					else {
						toggleVkImg();
					}


					if(!data.is_free){
						$view.find('#edit_event_free').prop('checked', false).trigger('change');
						$view.find('#edit_event_min_price').val(data.min_price);
					}
					if(data.registration_required){
						$view.find('#edit_event_registration_required').prop('checked', true).trigger('change');
					}
					if(data.public_at !== null){
						$view.find('#edit_event_delayed_publication').prop('checked', true).trigger('change');
					}

					formatVKPost();

				}, ajaxErrorHandler);
			}
		});
	}

}

function Onboarding($view, $content_block){
	/* onboarding */
	var $wrapper = $view.find(".page_wrapper"),
		scroll_rec = 0;

	function organisationSubscriptions($parent) {
		$parent.find(".OnboardingOrgItem").not('.-Handled_OnboardingOrgItem').on('click', function(){
			var $this = $(this);
			$.ajax({
				url: '/api/v1/organizations/'+$this.data("organization_id")+'/subscriptions',
				method: $this.hasClass(__C.CLASSES.NEW_ACTIVE) ? 'DELETE' : 'POST',
				success: function(res){
					ajaxHandler(res, function(data){}, ajaxErrorHandler)
				}
			});
			$this.toggleClass(__C.CLASSES.NEW_ACTIVE);
		}).addClass('-Handled_OnboardingOrgItem');
	}

	$wrapper.empty();
	$.ajax({
		url: '/api/v1/organizations/recommendations',
		method: 'GET',
		data: {
			length: 10,
			offset: 0
		},
		success: function(res){
			ajaxHandler(res, function(data){
				$wrapper.append(tmpl("onboarding-main", {recommendation_items: tmpl("onboarding-recommendation", data)}));
				$wrapper.find(".RecommendationsScrollbar").scrollbar({
					onScroll: function(y, x){
						console.log(y.scroll == y.maxScroll);
						if(y.scroll == y.maxScroll){
							$.ajax({
								url: '/api/v1/organizations/recommendations',
								method: 'GET',
								data: {
									length: 10,
									offset: scroll_rec+=10
								},
								success: function(res){
									ajaxHandler(res, function(data){
										$wrapper.find(".RecommendationsWrapper").eq(1).append(tmpl("onboarding-recommendation", data));
										organisationSubscriptions($wrapper);
									}, ajaxErrorHandler)
								}
							});
						}
					}
				});
				organisationSubscriptions($wrapper);
				bindRippleEffect($wrapper);
				bindControllers($wrapper);
				$wrapper.find('.Controller').on('click', function(){
					renderSidebarOrganizations(null, bindControllers);
				});
			}, ajaxErrorHandler)
		}
	});
}




function ajaxHandler(result, success, error){
	error = typeof error !== 'undefined' ? error : function(){
		console.log(result);
		showNotifier({text: 'Упс, что-то пошло не так', status: false});
	};
	success = typeof success !== 'function' ? function(){} : success;
	try {
		if(result.status){
			success(result.data, result.text);
		} else {
			error(result);
		}
	} catch(e){
		error(e);
	}
}

function ajaxErrorHandler(event, jqxhr, settings, thrownError){
	var args = Array.prototype.slice.call(arguments);
	console.group('ajax error');
	args.forEach(function(arg){
		console.log(arg);
	});
	console.groupEnd();
	if(jqxhr && jqxhr.responseJSON && jqxhr.responseJSON.text){
		showNotifier({text: jqxhr.responseJSON.text, status: false});
	} else if(event.text) {
		showNotifier({text: event.text, status: false});
	} else {
		showNotifier({text: 'Упс, что-то пошло не так', status: false});
	}
}

$(document)
	.ajaxStart(function(){
		Pace.restart()
	})
	.ajaxError(ajaxErrorHandler)
	.ready(function(){

		function renderState(){
			var state = History.getState(),
				page_split = __STATES.getCurrentState().split('/'),
				page = page_split[0];

			$(window).off('scroll');
			$(window).data('disable_upload', false);

			$('#page_title').text(state.title);
			$('#main_header').removeClass('-with_tabs');
			if(state.hash.indexOf('friend-') !== -1){
				var $friends_app = $('.friends-app');
				$('.screen-view').addClass(__C.CLASSES.HIDDEN);
				$friends_app.removeClass(__C.CLASSES.HIDDEN).addClass(__C.CLASSES.ACTIVE);
				getFriendsList($friends_app.find('.friends-right-bar'), function(){
					$('.friend-item.' + state.data.page).addClass(__C.CLASSES.ACTIVE).siblings().removeClass(__C.CLASSES.ACTIVE);
				});
				OneFriend($friends_app);
			}
			else if(__STATES.hasOwnProperty(page)) {
				var $content_block = $('[data-controller="'  + __STATES[page].name + '"]'),
					$view = $content_block.closest('.screen-view');
				$('.screen-view').not($view).addClass(__C.CLASSES.HIDDEN);
				$view.removeClass(__C.CLASSES.HIDDEN);
				__STATES[page]($view, $content_block);
			}
			else{
				console.error('PAGE RENDERING ERROR');
			}
			if (page != 'search'){
				$('#search_bar_input').val('');
			}
			$('[data-page]').removeClass(__C.CLASSES.NEW_ACTIVE);
			if(page == 'feed'){
				$('.SidebarNavItem[data-page="' + page + '"]').addClass(__C.CLASSES.NEW_ACTIVE);
				$('[data-feed_state="' + state.data.feed_state + '"]').addClass(__C.CLASSES.NEW_ACTIVE);
			} else {
				$('[data-page="' + page + '"]').addClass(__C.CLASSES.NEW_ACTIVE);
			}
		}

		function initSidebar(){
			var $sidebar = $('#main_sidebar'),
				$sidebar_nav = $sidebar.find('.SidebarNav'),
				$sidebar_nav_items = $sidebar_nav.find('.SidebarNavItem');

			$sidebar_nav.addClass('-items_'+$sidebar_nav_items.not('.-hidden').length);

			renderSidebarOrganizations(null, function($list){
				((window.innerHeight > 800) ? $('.SidebarOrganizationsScroll') : $('.SidebarScroll')).scrollbar({
					disableBodyScroll: true
				});
				bindControllers($list);
			});
		}
		function initTopBar(){
			var $main_header = $('#main_header');

			$main_header.find('#search_bar_input').on('keypress', function(e){
				if (e.which == 13){
					History.pushState({page: 'search'}, 'Поиск: ' + this.value, '/search?q=' + encodeURIComponent(this.value));
				}
			});

			$main_header.find('#user_bar').on('click.openUserBar', function(){
				var $this = $(this),
					$document = $(document);
				$this.addClass('-open');
				$document.on('click.closeUserBar', function(e){
					if(!$(e.target).parents('#user_bar').length){
						$document.off('click.closeUserBar');
						$this.removeClass('-open');
					}
				})
			});
			$main_header.find('.LogoutButton').on('click', function(){
				$.ajax({
					url: '/index.php?logout=true',
					method: 'GET',
					success: function(){
						window.location.href = '/';
					}
				});
			});
			bindRippleEffect($main_header);
			bindControllers($main_header);
		}

		History.Adapter.bind(window, 'statechange', renderState);

		initSidebar();
		initTopBar();
		$.ajax({
			url: '/api/v1/users/me',
			method: 'GET',
			success: function(res){
				ajaxHandler(res, function(data){
					window.__USER = data[0];
					bindControllers();
					renderState();
				}, ajaxErrorHandler);
			}
		});
	});