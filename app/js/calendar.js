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
			event_id = $panel_block.data('event-id');
		$panel_block.toggleClass('closed');
		$view.find('.timeline-' + $panel_block.data('event-id') + '-' + $panel_block.data(__C.DATA_NAMES.DATE))
			.height($panel_block.outerHeight());

		storeStat(event_id, __C.STATS.EVENT_ENTITY, __C.STATS.EVENT_VIEW_DETAIL);
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

	$view.find('.external-link').on('click', function(){
		var $panel_block = $(this).parents('.tl-panel-block'),
			event_id = $panel_block.data('event-id');
		storeStat(event_id, __C.STATS.EVENT_ENTITY, __C.STATS.EVENT_OPEN_SITE);
	});
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
		params_array = ['utm_source=Evendate', 'utm_campaign='+encodeURIComponent(event.title), 'utm_medium=affilate'];

	_a.href = event.detail_info_url;

	if (_a.search != ''){
		_url += '&' + params_array.join('&')
	}else{
		_url += '?' + params_array.join('&')
	}

	event.detail_info_url = _url;
	event.can_edit_hidden = event.can_edit != 1 ? 'hidden':'';

	event.friends = $('<div>');
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
			setDaysWithEvents();
			var for_prevent = callback(res);
			if (__STATES.getCurrentState() == 'timeline'){
				__STATES.refreshState();
			}
			if (--organizations_refreshing_count == 0 && __STATES.getCurrentState() == 'organizations' && for_prevent != false){
				__STATES.refreshState();
			}
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

function walkEventActiveDates(events, cb){
	events.forEach(function(event){
		var m_event_start_date = moment(event.event_start_date),
			m_event_end_date = moment(event.event_end_date),
			end_date = m_event_end_date.format(__C.DATE_FORMAT),
			current_date = m_event_start_date,
			event_date; // event should be only one time in object
		do{

			if (current_date.unix() < moment(moment().format('YYYY-MM-DD') + ' 00:00:00').unix()){
				current_date.add(1, 'days');
			}else{
				event_date = current_date.format(__C.DATE_FORMAT);
				if (cb && cb instanceof Function){
					cb(event, event_date);
				}
				current_date.add(1, 'days');
			}
		}while(end_date != event_date && current_date.unix() <= m_event_end_date.unix());
	});
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

	res.data.sort(compare);

	res.data.forEach(function(value) {
		var m_date;
		if (filter_date != null){
			m_date = moment(filter_date, __C.DATE_FORMAT);
		}else if (value.event_start_date == null){
			m_date = moment(value.dates_range[0]);
		} else if (moment(value.event_start_date).unix() < moment().unix() && filter_date == null){
			m_date = moment();
		}else if (moment(value.event_start_date).unix() < moment().unix() && filter_date != null){
			m_date = moment(filter_date, __C.DATE_FORMAT);
		}else{
			m_date = moment(value.event_start_date);
		}
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
		$event.appear(function() {
			storeStat(event.id, __C.STATS.EVENT_ENTITY, __C.STATS.EVENT_VIEW);
		}, {accY: 100})
	});

	if (res.data.length == 0) {
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
	setDaysWithEvents();
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
}

function OrganizationsList($view, $content_block){
	$.ajax({
		url: 'api/organizations/?with_subscriptions=true',
		success: function(res){
			var _organizations_by_types = {},
				$categories = $view.find('.new-organizations-categories-wrapper'),
				$organizations = $view.find('.new-organizations-list');
			res.data.forEach(function(organization){
				var _key = '_' + organization.type_id;
				if (!_organizations_by_types.hasOwnProperty(_key)){
					_organizations_by_types[_key] = {type_name: organization.type_name, organizations: [], count: 0, type_id: organization.type_id};
				}
				_organizations_by_types[_key].organizations.push(organization);
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
					$organizations.empty();
					type.organizations.forEach(function(organization){
						if(organization.is_subscribed){
							organization.btn_type_class = 'empty';
							organization.btn_text = 'Отписаться';
						}else{
							organization.btn_type_class = 'pink';
							organization.btn_text = 'Подписаться';
						}
						organization.subscribed_count_text = getUnitsText(organization.subscribed_count, __C.TEXTS.SUBSCRIBERS);
						var $organization = tmpl('new-organization-item', organization);
						$organization.find('.organization-img, .heading>span').on('click', function(){
							showOrganizationalModal(organization.id)
						});
						$organizations.append($organization);
					});



					$organizations.find('.subscribe-btn').on('click', function(){
						//debugger;
						organizations_refreshing_count++;
						var $btn = $(this),
							to_delete_state = $btn.hasClass('btn-empty'),
							sub_id = $btn.data('subscription-id'),
							org_id = $btn.data('organization-id');
						if ($btn.hasClass(__C.CLASSES.DISABLED)) return;

						$btn.
							toggleClass('btn-empty btn-pink disabled');

						if (to_delete_state){
							$btn.find('span').text('Подписаться');
							toggleSubscriptionState(false, sub_id, function(res){
								$btn.removeClass(__C.CLASSES.DISABLED);
								hideOrganizationItem(org_id);
								return false;
							});
						}else{
							$btn.find('span').text('Отписаться');
							toggleSubscriptionState(true, org_id, function(res){
								$btn.data('subscription-id', res.data.subscription_id);
								$btn.removeClass(__C.CLASSES.DISABLED);
								printSubscribedOrganizations();
								return false;
							});
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
	})
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
}

function hideOrganizationItem(org_id){
	var $organization_item = $('.animated.organization-' + org_id).addClass('fadeOutLeftBig');
	setTimeout(function(){
		$organization_item.remove();
	}, 1000);
}

function printSubscribedOrganizations(){
	var $list = $('.organizations-list');
	$.ajax({
		'url': 'api/organizations/?with_subscriptions=true',
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
			walkEventActiveDates(res.data, function(event, event_date){
				var add_has_favorites = event.is_favorite ? 'has-favorites' : '';
				$('.td-day[data-date="' + event_date + '"]')
					.addClass('click-able')
					.addClass(add_has_favorites)
					.removeClass(__C.CLASSES.DISABLED);
				__STATES[event_date] = OneDay;
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
				}while(curr_month_clone.day() != 0)
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
				}while(curr_month_clone.day() != 0)
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
			setDaysWithEvents();
		}

		function selectToday(){
			$('.td-day.today').addClass(__C.CLASSES.ACTIVE);
		}


		function bindMonthArrows(){
			$('.next-button').on('click', function(){
				setMonth('next');
				renderTable();
			});
			$('.prev-button').on('click', function(){
				setMonth('prev');
				renderTable();
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
			if (__STATES.hasOwnProperty(page)){
				var $content_block = $('[data-controller="'  + __STATES[page].name + '"]'),
					$view = $content_block.parents('.screen-view');
				$view = $view.length == 1 ? $view : $content_block;
				$('.screen-view').not($view).addClass(__C.CLASSES.HIDDEN);
				$view.removeClass(__C.CLASSES.HIDDEN);
				__STATES[page]($view, $content_block);
			}else{
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
		renderState();

		$('.show-organizations-btn').on('click', function(){
			History.pushState({page: 'organizations'}, 'Каталог организаций', 'organizations');
		});
		$('.show-timeline-btn').on('click', function(){
			History.pushState({page: 'timeline'}, 'Моя лента', 'timeline');
		})

		var $list = $('.organizations-list');
		$list.slimscroll({height: window.innerHeight - $list.offset().top});
});