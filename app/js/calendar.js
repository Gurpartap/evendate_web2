/**
 * Created by Инал on 20.06.2015.
 */

"use strict";

String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
};

var MODAL_OFFSET = 185,
	EVENT_MODAL_WIDTH = 660,
	_selected_month = moment(),
	__pages_length = 10,
	organizations_loaded = false,
	organizations_refreshing_count = 0;


function getTagsString(tags){
	var _tags = [];
	if (tags instanceof Array == false) return null;
	tags.forEach(function(tag){
		_tags.push(tag.name);
	});
	return _tags.join(', ');
}

function bindEventHandlers(){

	var $view = $('.screen-view:not(.hidden)');
	$view.find('.tl-part:not(.tl-header)').each(function(){
		var $this = $(this);
		$this.height($view.find('.event-' + $this.data('event-id') + '-' + $this.data(__C.DATA_NAMES.DATE)).outerHeight());
	});

	$view.find('.more-info-btn').off('click').on('click', function(){
		var $panel_block = $(this).parents('.tl-panel-block'),
			$panel_wrapper = $panel_block.find('.tl-event-wrapper'),
			event_id = $panel_block.data('event-id');

		if($panel_block.hasClass('closed')){
			$panel_block.removeClass('closed');
			$panel_block.animate({height: $panel_wrapper.height() + 30}, 500, "easeOutBack", function(){
				$panel_block.addClass('opened');
				after();
			});
		} else {
			$panel_block.removeClass('opened').addClass('closed').animate({height: $panel_wrapper.height() + 30}, 500, "easeInBack", after);
		}
		function after(){
			$view.find('.timeline-' + $panel_block.data('event-id') + '-' + $panel_block.data(__C.DATA_NAMES.DATE))
				.animate({height: $panel_block.outerHeight()}, 500);

			storeStat(event_id, __C.STATS.EVENT_ENTITY, __C.STATS.EVENT_VIEW_DETAIL);
		}
	});

	$view.find('.add-to-favorites').on('click', function(){
		toggleFavorite($(this), $view)
	});

	$view.find('.organization-in-event').on('click', function(){
		showOrganizationalModal($(this).data('organization-id'));
	});

	$view.find('.likes-block').on('click', function(){
		var $this = $(this),
			$event = $this.parents('.tl-panel-block'),
			$all_friends = $('.friends-event-' + $event.data('event-id'));

		if ($all_friends.hasClass('open')){
			$all_friends
				.removeClass('open')
				.addClass('hidden')
				.remove();
		}else{
			$all_friends.remove();
			$all_friends = $event.data('friends');
			if ($all_friends.find('li').length == 0) return;

			$all_friends
				.removeClass('hidden')
				.addClass('open')
				.css({
					top: $this.offset().top + $this.height() + 'px',
					left: $this.find('.user-img-wrapper:first').offset().left - $this.width() + 'px'
				})
				.prependTo($event.parent().addClass('open'));
		}
	});

	$view.find('.social-links i').on('click', function(){
		var $this = $(this),
			$block = $this.parents('.tl-panel-block'),
			_type = $this.data('share-type');
		window.open($block.data('share')[_type], 'SHARE_WINDOW',
			'status=1,toolbar=0,menubar=0&height=300,width=500');
	});

	$view.find('.btn-edit').on('click', function(){
		var $this = $(this),
			event_id = $this.data('event-id');
		showEditEventModal(event_id);
	});

	$view.find('.event-hide-button').on('click', function(){
		var $panel_block = $(this).parents('.tl-panel-block'),
			event = {id: $panel_block.data('event-id'), date: $panel_block.data(__C.DATA_NAMES.DATE)},
			$placeholder = tmpl('removed-event-placeholder', event);

		$panel_block.css({overflow: 'hidden'}).animate({height: 100, opacity: 0}, 300, "easeInBack", function(){
			$panel_block.hide().after($placeholder);
			$placeholder.find('.btn-cancel-remove').one('click', undoRemoveEvent);
		});
		$view.find('.timeline-' + $panel_block.data('event-id') + '-' + $panel_block.data(__C.DATA_NAMES.DATE))
			.animate({height: 100}, 300, "easeInBack");

		$.ajax({
			url: '/api/events/' + event.id + '/status?hidden=1',
			type: 'PUT'
		});
	});

	$view.find('.external-link').on('click', function(){
		var $panel_block = $(this).parents('.tl-panel-block'),
			event_id = $panel_block.data('event-id');
		storeStat(event_id, __C.STATS.EVENT_ENTITY, __C.STATS.EVENT_OPEN_SITE);
	});

	function undoRemoveEvent(e){
		var $this = $(e.target),
			$placeholder = $this.parents('.tl-panel-block-placeholder'),
			event_id = $placeholder.data('event-id'),
			event_date = $placeholder.data('date'),
			$panel_block = $view.find('.event-' + event_id + '-' + event_date),
			$panel_wrapper = $panel_block.find('.tl-event-wrapper'),
			$tl_block = $view.find('.timeline-' + event_id + '-' + event_date);

		$placeholder.remove();
		$panel_block.show();
		$tl_block.animate({height: $panel_wrapper.height() + 30}, 300, "easeOutBack");
		$panel_block.animate({height: $panel_wrapper.height() + 30, opacity: 1}, 300, "easeOutBack", function(){
			$panel_block.css({overflow: 'visible'});
		});
		$.ajax({
			url: '/api/events/' + event.id + '/status?hidden=0',
			type: 'PUT'
		});

	}
}

function generateEventAttributes(event){

	var st_date = event.event_start_date == null ? moment(event.dates_range[0]) :moment(event.event_start_date),
		end_date = moment(event.event_end_date);

	event.date =  event.event_start_date != null
		? moment(event.event_start_date).format(__C.DATE_FORMAT)
		: moment(event.dates_range[0]).format(__C.DATE_FORMAT);
	event.tags_text = getTagsString(event.tags);

	event.begin_time = moment(event.begin_time, 'HH:mm:ss').format('HH:mm');

	if (event.end_time == null){
		event.time = event.begin_time;
	}else{
		event.end_time = moment(event.end_time, 'HH:mm:ss').format('HH:mm');
		if (event.begin_time == '00:00' && event.end_time == '00:00'){
			event.time = ' Весь день';
		}else{
			event.time = event.begin_time + ' - ' + event.end_time;
		}
	}

	event.tags_block = $('<div>');

	event.tags.forEach(function(tag){
		event.tags_block.append(tmpl('event-tag', tag));
	});



	event.begin_time_for_timeline = event.begin_time == '00:00' && event.end_time == '00:00' ? '': event.begin_time;
	if (event.event_start_date == null || event.event_end_date == null){
		event.one_day = event.dates_range.length == 1;
		event.dates = st_date.format('DD MMMM') ;
		event.short_dates = [];
		event.dates = [];
		var date_format = event.dates_range.length == 1 ? 'DD MMMM' : 'DD/MM';
		event.dates_range.forEach(function(val){
			event.dates.push(moment(val).format(date_format));
			event.short_dates.push(moment(val).format('DD/MM'));
		});
		event.dates = event.dates.join(', ') ;
		event.short_dates = event.short_dates.join(', ') ;
		event.day_name = st_date.format('dddd');
	}else{
		event.dates = end_date.format('DD MMMM') ;
		event.short_dates = end_date.format('DD/MM') ;
		event.day_name = end_date.format('dddd');
		if (end_date.format(__C.DATE_FORMAT) != st_date.format(__C.DATE_FORMAT)){
			event.one_day = false;
			if (end_date.format('MM') == st_date.format('MM')){
				event.dates = st_date.format('DD') + ' - ' + end_date.format('DD MMMM');
			}else{
				event.dates = st_date.format('DD MMMM') + ' - ' + end_date.format('DD MMMM')
			}
			event.short_dates = st_date.format('DD/MM') + ' - ' + end_date.format('DD/MM')
		}else{
			event.one_day = true;
		}
	}



	var _a = document.createElement('a'),
		_url = event.detail_info_url,
		params_array = [];//['utm_source=Evendate', 'utm_campaign='+encodeURIComponent(event.title), 'utm_medium=affilate'];

	_a.href = event.detail_info_url;

	if (_a.search != ''){
		//_url += '&' + params_array.join('&')
	}else{
		//_url += '?' + params_array.join('&')
	}

	event.detail_info_url = _url;
	event.can_edit_hidden = event.can_edit != 1 ? 'hidden':'';

	event.friends = $('<div>').addClass("liked-users");
	event.all_friends = tmpl('liked-dropdown-wrapper', {event_id: event.id});

	var short_firends_count = 0;
	if (event.favorite_friends != undefined){
		event.favorite_friends.forEach(function(user){
			if (short_firends_count < 5){
				event.friends.append(tmpl('liked-user', user));
			}
			event.all_friends.append(tmpl('liked-dropdown-item', user))
		})
	}

	event.favorite_btn_class = event.is_favorite ? __C.CLASSES.NO_BORDERS : '';
	event.favorite_btn_text = event.is_favorite ? __C.TEXTS.REMOVE_FAVORITE : __C.TEXTS.ADD_FAVORITE;
	event.timeline_favorite_class = event.is_favorite ? __C.CLASSES.ACTIVE : '';
	event.favored_text = getUnitsText(event.liked_users_count, __C.TEXTS.FAVORED);
	return event;
}

/**
 * Нажатие на кнопку подписаться/отписаться
 * @param state
 * @param entity_id ID подписки или ID организации в зависимости от типа совершаемого события
 * @param callback
 */
function toggleSubscriptionState(state, entity_id, callback){
	var cb = function(res){
			var for_prevent = callback(res);
			if (__STATES.getCurrentState() == 'timeline'){
				__STATES.refreshState();
			}
			//if (--organizations_refreshing_count == 0 && __STATES.getCurrentState() == 'organizations' && for_prevent != false){
			//	__STATES.refreshState();
			//}
		},

		options = (state == false) ? {
			url: 'api/subscriptions/' + entity_id,
			type: 'DELETE',
			success: cb
		} : {
			url: 'api/subscriptions/',
			data: {organization_id: entity_id},
			type: 'POST',
			success: cb
		};
	$.ajax(options);
}

function printEventsInTimeline($view, res, filter_date){
	var $tl_outer_wrap = $view.find('.tl-outer-wrap'),
		$blocks_wrapper = $view.find('.blocks-outer-wrap');

	function compare(a,b) {
		if (a.dates_range.length < b.dates_range.length)
			return -1;
		if (a.dates_range.length > b.dates_range.length)
			return 1;
		return 0;
	}

	//res.data.sort(compare);

	res.data.forEach(function(value) {
		var m_date;
		if (filter_date != null){
			m_date = moment(filter_date, __C.DATE_FORMAT);
		}
		//else if (value.event_start_date == null){
		//	m_date = moment(value.dates_range[0]);
		//} else if (moment(value.event_start_date).unix() < moment().unix() && filter_date == null){
		//	m_date = moment();
		//}else if (moment(value.event_start_date).unix() < moment().unix() && filter_date != null){
		//	m_date = moment(filter_date, __C.DATE_FORMAT);
		//}else{
		//	m_date = moment(value.event_start_date);
		//}
		else{
			m_date = moment(value.nearest_event_date);
		}

		//console.log(m_date);

		var day_date = m_date.format(__C.DATE_FORMAT);
		var $day_wrapper = $blocks_wrapper.find('.events-' + day_date),
			$timeline_wrapper = $tl_outer_wrap.find('.timeline-' + day_date);

		if ($day_wrapper.length == 0) {
			$day_wrapper = tmpl('events-day-wrapper', {
				day_name: m_date.format('dddd').capitalize(),
				day_number: m_date.format('DD MMMM'),
				events_count: 1,
				date: m_date.format(__C.DATE_FORMAT)
			}).data('events-count', 1).appendTo($blocks_wrapper);

			$timeline_wrapper = tmpl('timeline-day', {
				day_short_name: m_date.format('ddd').capitalize(),
				day_number: m_date.format('DD'),
				month_number: m_date.format('MM'),
				month_name: m_date.format('DD MMMM'),
				date: day_date
			}).appendTo($tl_outer_wrap);
		}else{
			$day_wrapper
				.data('events-count', $day_wrapper.data('events-count') + 1)
				.find('.events-count')
				.text($day_wrapper.data('events-count'));
		}

		$day_wrapper.find('.event-' + value.id + '-' + day_date).remove();
		$timeline_wrapper.find('.timeline-' + value.id + '-' + day_date).remove();
		var event = generateEventAttributes(value);

		var $event = tmpl('event-item', event);
		$event.data('share', {
			'vk': tmpl('vk-share-link', event).attr('href'),
			'facebook': tmpl('facebook-share-link', event).attr('href'),
			'twitter': tmpl('twitter-share-link', event).attr('href')
		});
		$event.data('friends', event.all_friends);
		$day_wrapper.append($event);
		$timeline_wrapper.append(tmpl('timeline-event', event));
		$event.height($event.height());
		$event.css({"max-height": 'none'});
		$event.appear(function() {
			storeStat(event.id, __C.STATS.EVENT_ENTITY, __C.STATS.EVENT_VIEW);
		}, {accY: 100})
	});

	if (res.data.length == 0 || res.data.length < __pages_length) {
		//$view.find('.main-row').addClass(__C.CLASSES.HIDDEN);
		$view.find('.load-more-btn').addClass(__C.CLASSES.HIDDEN);
		$view.find('.sad-eve').removeClass(__C.CLASSES.HIDDEN);
	} else {
		//$view.find('.main-row').removeClass(__C.CLASSES.HIDDEN);
		$view.find('.load-more-btn')
			.removeClass(__C.CLASSES.HIDDEN)
			.find('.btn').removeClass(__C.CLASSES.DISABLED);
		$view.find('.sad-eve').addClass(__C.CLASSES.HIDDEN);
	}
	if ($tl_outer_wrap.find('.tl-block').length != 0){
		$tl_outer_wrap.removeClass(__C.CLASSES.HIDDEN);
	}else{
		$tl_outer_wrap.addClass(__C.CLASSES.HIDDEN);
	}
	bindEventHandlers();
}

/* PAGE CONTROLLERS */
function MyTimeline($view, $content_block){
	$view.find('.tl-outer-wrap').addClass(__C.CLASSES.HIDDEN);
	var $load_btn = $view.find('.load-more-btn').addClass(__C.CLASSES.HIDDEN).data('page-number', 0),
		getEvents = function(){
			var page_number = $load_btn.data('page-number');
			$load_btn.data('page-number', page_number + 1);
			$.ajax({
				url: '/api/events/my?page=' + page_number,
				success: function(res){
					printEventsInTimeline($view, res);
				}
			});
		};

	$view.find('.panel-default,.tl-block').remove();
	$load_btn.find('.btn').on('click', getEvents);
	getEvents();
	setDaysWithEvents();
}

function OrganizationsList($view, $content_block){

	if (__STATES.getCurrentState() == 'organizations' && organizations_loaded) return;
	$.ajax({
		url: 'api/organizations/?with_subscriptions=true&without_friends=true',
		success: function(res){
			organizations_loaded = true;
			var _organizations_by_types = {},
				$categories = $view.find('.new-organizations-categories-wrapper'),
				$organizations = $view.find('.new-organizations-list');
			res.data.forEach(function(organization){
				var _key = '_' + organization.type_id;
				if (!_organizations_by_types.hasOwnProperty(_key)){
					_organizations_by_types[_key] = {type_name: organization.type_name, organizations: {}, count: 0, type_id: organization.type_id};
				}
				_organizations_by_types[_key].organizations['_' + organization.id] = organization;
				_organizations_by_types[_key].count++;
			});

			var sorted_keys = Object.keys(_organizations_by_types).sort(function(a,b){
				return _organizations_by_types[b].count - _organizations_by_types[a].count
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
						$organization.find('.organization-img, .heading>span').on('click', function(){
							showOrganizationalModal(organization.id)
						});
						$organizations.append($organization);
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
							toggleSubscriptionState(false, sub_id, function(){});
							$btn.removeClass(__C.CLASSES.DISABLED);
							hideOrganizationItem(org_id);
							return false;
						}else{
							$btn.find('span').text('Отписаться');
							toggleSubscriptionState(true, org_id, function(res){
								$btn.data('subscription-id', res.data.subscription_id);
								return false;
							});

							$btn.removeClass(__C.CLASSES.DISABLED);
							printSubscribedOrganizations([$btn.parents('.new-organization').data('organization')]);
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
			bindOnClick();
		}
	});
	setDaysWithEvents();
}

function FavoredEvents($view, $content_block){
	$view.find('.tl-outer-wrap').addClass(__C.CLASSES.HIDDEN);
	var $load_btn = $view.find('.load-more-btn').addClass(__C.CLASSES.HIDDEN).data('page-number', 0),
		getEvents = function(){
			var page_number = $load_btn.data('page-number');
			$load_btn.data('page-number', page_number + 1);
			$.ajax({
				url: '/api/events/favorites?page=' + page_number,
				success: function(res){
					printEventsInTimeline($view, res);
				}
			});
		};

	$view.find('.panel-default,.tl-block').remove();
	$load_btn.find('.btn').on('click', getEvents);
	getEvents();
	setDaysWithEvents();
}

function Search($view, $content_block){
	$view.find('.tl-outer-wrap').addClass(__C.CLASSES.HIDDEN);
	var _search = searchToObject();
	if (_search.hasOwnProperty('q')){
		$('.search-input').val(_search.q);
	}
	$.ajax({
		url: '/api/search/',
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
				$organization.on('click', function(){
					showOrganizationalModal(organization.id);
				})
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
	setDaysWithEvents();
}

function bindFeedEvents($view){
	$view.find('.feed-clickable').off('click').on('click', function(){
		var $this = $(this);
		if ($this.data('organization-id')){
			showOrganizationalModal($this.data('organization-id'));
		}else if ($this.data('event-id')){
			window.open('/event.php?id=' + $this.data('event-id'), '_blank');
		}else if ($this.data('friend-id')){
			History.pushState({page: 'friend-' + $this.data('friend-id')}, $this.text(), 'friend-' + $this.data('friend-id'));
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
			url: 'api/users/friends?friends=true&actions=true&length=20&friend_id=' + friend_id + '&page=' + page_number++,
			success: function(res){
				if ((res.data.length == 0 && page_number != 1) || res.data.length < 20){
					$load_btn.addClass(__C.CLASSES.HIDDEN);
					return;
				}
				var cards_by_users = {};
				res.data.forEach(function(stat){
					var date = moment(stat.created_at),
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
				$load_btn.removeClass(__C.CLASSES.HIDDEN).find('.btn').removeClass(__C.CLASSES.DISABLED);
				$load_btn.off('click').on('click', getFriendFeed);
				bindFeedEvents($view);
			}
		});
	}

	$.ajax({
		url: '/api/users/friends/',
		data: {
			subscriptions: true,
			friend_id: friend_id,
			with_friend_info: true
		},
		success: function(res){
			$content.append(tmpl('friends-page-header', res.data.user));
			tmpl('friends-subscription', res.data.subscriptions, $content.find('.one-friend-subscriptions'))
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

function getFriendsList($friends_right_list, cb){
	$.ajax({
		url: '/api/users/friends?page=0&length=500',
		success: function(res){
			$friends_right_list.find('.friends-list').empty();
			$friends_right_list.removeClass(__C.CLASSES.HIDDEN);
			tmpl('friend-item', res.data, $friends_right_list.find('.friends-list'));
			res.data.forEach(function(friend){
				__STATES['friend-' + friend.id] = OneFriend;
			});
			$friends_right_list.find('.friends-count').text(res.data.length);
			$friends_right_list.find('.friend-item').off('click').on('click', function(){
				var $this = $(this);
				$this.siblings().removeClass(__C.CLASSES.ACTIVE);
				$this.addClass(__C.CLASSES.ACTIVE);
				History.pushState({page: 'friend-' + $this.data('friend-id')}, $this.data('name'), 'friend-' + $this.data('friend-id'));
			});
			if ($friends_right_list.height() > window.innerHeight - 200){
				$friends_right_list.find('.friends-list').slimscroll({
					height: window.innerHeight - 200,
					width: '100%'
				});
			}

			if (cb) cb();
		}
	});
}

function calculateMargins($view){
	var $main_content = $view.find('.friends-main-content'),
		$friends_right_list = $view.find('.friends-right-bar'),
		$user_content = $view.find('.one-friend-main-content'),
		view_width = $view.width(),
		content_width = $main_content.width() == 0 ? $user_content.width() : $main_content.width(),
		friends_right_list_width = $friends_right_list.width(),
		DISTANCE_BETWEEN = 150,
		_margin = (view_width - content_width - friends_right_list_width - DISTANCE_BETWEEN) / 2;

	$main_content.css('margin-left', _margin + 'px');
	$friends_right_list.css('margin-left', _margin + content_width + DISTANCE_BETWEEN + 'px');
	$user_content.css('margin-left', _margin + 'px');
}

function Friends($view, $content_block){
	var page_number = 0;
	function getFeed(){
		if (page_number == 0){
			$view.find('.friend-events-block').remove();
		}
		$.ajax({
			url: 'api/users/feed?length=20&page=' + page_number++,
			success: function(res){
				var cards_by_users = {};
				res.data.forEach(function(stat){
					var date = moment(stat.created_at),
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

function OneDay($view, $content_block){
	$view.find('.panel-default,.tl-block').remove();
	var date = __STATES.getCurrentState();
	$.ajax({
		url: 'api/events/my',
		data: {
			date: date,
			length: 100
		},
		type: 'GET',
		dataType: 'JSON',
		success: function(res){
			printEventsInTimeline($view, res, date);
			$view.find('.tl-outer-wrap ').css('visibility', 'hidden');
			var active_date = moment(date, __C.DATE_FORMAT);
			$('.day-events-header .day-name').text(active_date.format('dddd').capitalize() + ', ' +
				active_date.format('DD MMMM'));
		}
	});
	setDaysWithEvents();
}

function hideOrganizationItem(org_id){
	var $organization_item = $('.animated.organization-' + org_id).addClass('fadeOutLeftBig');
	setTimeout(function(){
		$organization_item.remove();
	}, 1000);
}

function printSubscribedOrganizations(organization){
	var $list = $('.organizations-list');
	if (organization){
		if ($list.find('.organization-' + organization.id).length == 0){
			tmpl('organizations-item', organization)
				.addClass('fadeInLeftBig')
				.prependTo($list)
				.on('click', function(){
					showOrganizationalModal($(this).data('organization-id'));
				});
		}
	}else{
		$.ajax({
			'url': 'api/subscriptions/my',
			success: function(res){
				res.data.forEach(function(organization){
					if (organization.is_subscribed && $list.find('.organization-' + organization.id).length == 0){
						tmpl('organizations-item', organization)
							.addClass('fadeInLeftBig')
							.prependTo($list)
							.on('click', function(){
								showOrganizationalModal($(this).data('organization-id'));
							});
					}
				});
			}
		});
	}
}

function setDaysWithEvents(){
	$.ajax({
		url: '/api/events/my',
		data: {
			since_date: _selected_month.startOf('month').format(__C.DATE_FORMAT),
			till_date: _selected_month.endOf('month').format(__C.DATE_FORMAT),
			type: 'short',
			page: 0,
			length: 500
		},
		success: function(res){
			$('.td-day').removeClass('click-able has-favorites').addClass(__C.CLASSES.DISABLED);
			var _now = moment();
			res.data.forEach(function(event){
				event.dates_range.forEach(function(event_date){
					var m_date = moment(event_date),
						_event_date = m_date.format(__C.DATE_FORMAT),
						add_has_favorites = event.is_favorite && _now < m_date ? 'has-favorites' : '';
					$('.td-day[data-date="' + _event_date + '"]')
						.addClass('click-able')
						.addClass(add_has_favorites)
						.removeClass(__C.CLASSES.DISABLED);
					__STATES[event_date] = OneDay;
				})
			});

			bindOnClick();
		}
	});
}

function bindOnClick(){
	$('[data-page], a[data-controller]').off('click.pageRender').on('click.pageRender', function(){
		var $this = $(this),
			page_name = $this.data('page'),
			controller_name = $this.data('controller');
		if ($this.hasClass(__C.CLASSES.DISABLED)) return true;
		if (page_name != undefined){
			History.pushState({page: page_name}, $this.data('title') ? $this.data('title'): $this.text(), page_name);
		}else{
			if (window[controller_name] != undefined && window[controller_name] instanceof Function){
				window[controller_name]();
			}
		}
	});
}

$(document)
	.ajaxStart(function(){
		Pace.restart()
	})
	.ready(function(){

		window.__STATES = {
			timeline: MyTimeline,
			organizations: OrganizationsList,
			favorites: FavoredEvents,
			search: Search,
			friends: Friends,
			refreshState: function(){
				var page = this.getCurrentState(),
					$view = $('.screen-view:not(.hidden)');
				this[page]($view, $view.find('[data-controller]'));
			},
			getCurrentState: function(){
				return window.location.pathname.replace('/', '');
			}
		};

		//Отрисовака календаря
		(function(){
			var current_month = moment(),
				$calendar = $('#calendar-table'),
				_today = moment(),
				$month_name = $('#month-name');

			function setMonth(next){
				if (next == 'prev' || next == 'next'){
					current_month = current_month.add(next == 'next' ? 1 : -1, 'months');
				}else if (next == 'current'){
					current_month = moment();
					selectToday();
				}else{
					current_month = current_month.add(next, 'months');
				}
				_selected_month = current_month;
			}

			function deleteDays(){
				$calendar.find('.calendar-days-line').remove();
			}

			function setMonthName(){
				$month_name.text(current_month.lang('ru').format("MMMM YYYY").capitalize());
			}

			function buildTable(){
				var days_count = current_month.daysInMonth(),
					first_day_in_month = current_month.date(1).day(),
					last_day_in_month = current_month.date(days_count).day(),
					td_days = [],
					today;
				for (var day = 1; day <= days_count; day++){
					current_month.date(day);
					today = current_month.format(__C.DATE_FORMAT) == _today.format(__C.DATE_FORMAT) ? 'today' : '';
					td_days.push(tmpl('calendar-day', {
						number: current_month.date(),
						day_number: current_month.day(),
						today: today,
						date: current_month.format(__C.DATE_FORMAT),
						date_text: current_month.format('DD MMMM YYYY')
					}));
					__STATES[current_month.format(__C.DATE_FORMAT)] = OneDay;
				}
				var curr_month_clone = moment(current_month._d);
				if (first_day_in_month != 1){
					curr_month_clone.add(-1, 'months');
					curr_month_clone.date(curr_month_clone.daysInMonth());
					do{
						td_days.unshift(tmpl('calendar-day', {
							number: curr_month_clone.date(),
							day_number: curr_month_clone.day(),
							today: 'not-this-month'
						}));
						curr_month_clone.add(-1, 'days');
					}while(curr_month_clone.day() != 0);
				}

				if (last_day_in_month != 0){
					curr_month_clone = moment(current_month._d);
					do{
						curr_month_clone.add(1, 'days');
						td_days.push(tmpl('calendar-day', {
							number: curr_month_clone.date(),
							day_number: curr_month_clone.day(),
							today: 'not-this-month'
						}));
					}while(curr_month_clone.day() != 0);
				}
				var $tbody = $('<tbody>'),
					tds_in_tr = 0,
					trs_count = 0,
					$trs = [tmpl('calendar-line', {})];
				for(var i = 0; i < td_days.length; i++){
					if (tds_in_tr == 7 ){
						$trs.push(tmpl('calendar-line', {}));
						tds_in_tr = 0;
						trs_count++;
					}
					$trs[trs_count].append(td_days[i]);
					tds_in_tr++;
				}
				$trs.forEach(function(item){
					$tbody.append(item);
				});
				if ($trs.length == 5){ //5 weeks in month
					$calendar.parents('.panel-body').css('margin-bottom', '43px');
				}else{  //6 weeks in month
					$calendar.parents('.panel-body').css('margin-bottom', '0px');
				}
				$calendar.append($tbody);
			}

			function clickSelectedDate(){
				$('.td-day.' + __C.CLASSES.ACTIVE).click();
			}

			function renderTable(){
				deleteDays();
				buildTable();
				setMonthName();
				clickSelectedDate();
			}

			function selectToday(){
				$('.td-day.today').addClass(__C.CLASSES.ACTIVE);
			}


			function bindMonthArrows(){
				$('.next-button').on('click', function(){
					setMonth('next');
					renderTable();
					setDaysWithEvents();
				});
				$('.prev-button').on('click', function(){
					setMonth('prev');
					renderTable();
					setDaysWithEvents();
				});
			}

			$('.fc-today-button').on('click', function(){
				setMonth('current');
				renderTable();
				selectToday();
			});

			bindMonthArrows();
			renderTable();
			selectToday();


		})(jQuery, window, undefined);

		function renderState(){
			var state = History.getState(),
				page = __STATES.getCurrentState();
			if (__STATES.hasOwnProperty(page) && state.hash.indexOf('friend-') == -1){
				var $content_block = $('[data-controller="'  + __STATES[page].name + '"]'),
					$view = $content_block.parents('.screen-view');
				$view = $view.length == 1 ? $view : $content_block;
				$('.screen-view').not($view).addClass(__C.CLASSES.HIDDEN);
				$view.removeClass(__C.CLASSES.HIDDEN);
				__STATES[page]($view, $content_block);
			}else if (state.hash.indexOf('friend-') != -1){
				var $friends_app = $('.friends-app');
				$friends_app.removeClass(__C.CLASSES.HIDDEN).addClass(__C.CLASSES.ACTIVE);
				getFriendsList($friends_app.find('.friends-right-bar'), function(){
					$('.friend-item.' + state.data.page).addClass(__C.CLASSES.ACTIVE).siblings().removeClass(__C.CLASSES.ACTIVE);
				});
				OneFriend($friends_app);
			}
			else{
				console.error('PAGE RENDERING ERROR');
			}
			if (page != 'search'){
				$('.search-input').val('');
			}
			$('[data-page]').removeClass(__C.CLASSES.ACTIVE);
			$('[data-page="' + page + '"]').addClass(__C.CLASSES.ACTIVE);
		}

		History.Adapter.bind(window,'statechange',function(){ // Note: We are using statechange instead of popstate
			renderState(); // Note: We are using History.getState() instead of event.state\
		});


		bindOnClick();
		$('.log-out-icon').on('click', function(){
			window.location.href = 'index.php?logout=true';
		});
		$('.search-input')
			.on('keypress', function(e){
				if (e.which == 13){
					History.pushState({page: 'search'}, 'Поиск: ' + this.value, 'search?q=' + encodeURIComponent(this.value));
				}
			});
		printSubscribedOrganizations();
		setDaysWithEvents();
		renderState();

		$('.show-organizations-btn').on('click', function(){
			History.pushState({page: 'organizations'}, 'Каталог организаций', 'organizations');
		});
		$('.show-timeline-btn').on('click', function(){
			History.pushState({page: 'timeline'}, 'Моя лента', 'timeline');
		});

		var $list = $('.organizations-list');
		if (window.innerHeight > 800){
			$list.slimscroll({height: window.innerHeight - $list.offset().top});
		}else{
			$('.sidebar').slimscroll({
				height: window.innerHeight
			})
		}
	});