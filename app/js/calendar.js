/**
 * Created by Инал on 20.06.2015.
 */

"use strict";

var paceOptions = {
	ajax: false, // disabled
	document: false, // disabled
	eventLag: false, // disabled
	elements: {},
	search_is_active: false,
	search_query: null,
	search_xhr: null
	},
	__C = {
		TEXTS:{
			REMOVE_FAVORITE: 'Удалить из избранного',
			ADD_FAVORITE: 'В избранное',
			SUBSCRIBERS:{
				NOM: ' подписчик',
				GEN: ' подписчика',
				PLU: ' подписчиков'
			},
			FAVORED:{
				NOM: ' участник',
				GEN: ' участника',
				PLU: ' участников'
			},
			ADD_SUBSCRIPTION: 'Подписаться',
			REMOVE_SUBSCRIPTION: 'Отписаться'
		},
		DATA_NAMES:{
			DATE: 'date'
		},
		CLASSES: {
			ACTIVE: 'active',
			NO_BORDERS: 'no-borders',
			SUBSCRIBE_ADD: 'btn-pink-empty',
			SUBSCRIBE_DELETE: 'btn-pink',
			DISABLED: 'disabled',
			HIDDEN: 'hidden'
		},
		DATE_FORMAT: 'YYYY-MM-DD'
	},
	__STATES = {
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


String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
};

var MODAL_OFFSET = 185,
	EVENT_MODAL_WIDTH = 660,
	_selected_month = moment();

/**
 * Возвращает единицу измерения с правильным окончанием
 *
 * @param {Number} num      Число
 * @param {Object} cases    Варианты слова {nom: 'час', gen: 'часа', plu: 'часов'}
 * @return {String}
 */
function getUnitsText(num, cases) {
	num = Math.abs(num);

	var word = '';

	if (num.toString().indexOf('.') > -1) {
		word = cases.GEN;
	} else {
		word = (
			num % 10 == 1 && num % 100 != 11
				? cases.NOM
				: num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20)
				? cases.GEN
				: cases.PLU
		);
	}

	return word;
}

function getTagsString(tags){
	var _tags = [];
	if (tags instanceof Array == false) return null;
	tags.forEach(function(tag){
		_tags.push(tag.name);
	});
	return _tags.join(', ');
}

function toggleFavorite($btn, $view, refresh){
	var $liked_count = $btn.parents('.tl-panel-block').find('.liked-users-count-number'),
		$liked_count_text = $btn.parents('.tl-panel-block').find('.liked-users-count-text'),
		_event_id = $btn.data('event-id'),
		_date = $btn.parents('.tl-panel-block').data(__C.DATA_NAMES.DATE),
		params = {
			url: '/api/events/favorites/',
			type: 'POST',
			data: {
				event_id: _event_id
			}
		};

	$btn.toggleClass(__C.CLASSES.NO_BORDERS);
	$btn.text($btn.hasClass(__C.CLASSES.NO_BORDERS) ? __C.TEXTS.REMOVE_FAVORITE : __C.TEXTS.ADD_FAVORITE);
	$view.find('.timeline-' + _event_id + '-' + _date).toggleClass(__C.CLASSES.ACTIVE);

	var new_count;
	if (!$btn.hasClass(__C.CLASSES.NO_BORDERS)){
		params.type = 'DELETE';
		params.url = '/api/events/favorites/' + $btn.data('event-id');
		new_count = parseInt($liked_count.text()) - 1;
		$liked_count.text(new_count);
	}else{
		new_count = parseInt($liked_count.text()) + 1;
		$liked_count.text(new_count);
	}
	$liked_count_text.text(getUnitsText(new_count, __C.TEXTS.FAVORED));

	$.ajax(params)
		.always(function(){
			setDaysWithEvents();
			if (window.location.pathname.replace('/', '') == 'favorites' && refresh == true){
				__STATES.refreshState();
			}
		});
}

function bindEventHandlers(){

	var $view = $('.screen-view:not(.hidden)');
	$view.find('.tl-part:not(.tl-header)').each(function(){
		var $this = $(this);
		$this.height($view.find('.event-' + $this.data('event-id') + '-' + $this.data(__C.DATA_NAMES.DATE)).outerHeight());
	});

	$view.find('.more-info-btn').off('click').on('click', function(){
		var $panel_block = $(this).parents('.tl-panel-block');
		$panel_block.toggleClass('closed');
		$view.find('.timeline-' + $panel_block.data('event-id') + '-' + $panel_block.data(__C.DATA_NAMES.DATE))
			.height($panel_block.outerHeight());
	});

	$view.find('.add-to-favorites').on('click', function(){
		toggleFavorite($(this), $view)
	});


	$view.find('.organization-in-event').on('click', function(){
		showOrganizationalModal($(this).data('organization-id'));
	});

	$view.find('.likes-block').on('click', function(){
		var $this = $(this);
		if ($this.find('.all-friends li').length == 0) return;
		$this.toggleClass('open');
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
	})
}

function generateEventAttributes(event){

	var st_date = moment(event.event_start_date),
		end_date = moment(event.event_end_date);

	event.date =  moment(event.event_start_date).format(__C.DATE_FORMAT);
	event.tags_text = getTagsString(event.tags);
	event.begin_time = moment(event.begin_time, 'HH:mm:ss').format('HH:mm');
	event.end_time = moment(event.end_time, 'HH:mm:ss').format('HH:mm');
	event.time = event.begin_time == '00:00' && event.end_time == '00:00' ? ' Весь день': event.begin_time + ' - ' + event.end_time;
	event.dates = end_date.format('DD MMMM') ;
	event.day_name = end_date.format('dddd');
	if (end_date.format(__C.DATE_FORMAT) != st_date.format(__C.DATE_FORMAT)){
		event.one_day = false;
		if (end_date.format('MM') == st_date.format('MM')){
			event.dates = st_date.format('DD') + ' - ' + end_date.format('DD MMMM')
		}else{
			event.dates = st_date.format('DD MMMM') + ' - ' + end_date.format('DD MMMM')
		}
	}else{
		event.one_day = true;
	}
	event.friends = $('<div>');
	event.all_friends = tmpl('liked-dropdown-wrapper', {});

	event.can_edit_hidden = event.can_edit != 1 ? 'hidden':'';

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
	var options = (state == false) ? {
		url: 'api/subscriptions/' + entity_id,
		type: 'DELETE',
		success: function(res){
			setDaysWithEvents();
			callback(res);
		}
	} : {
		url: 'api/subscriptions/',
		data:{organization_id: entity_id},
		type: 'POST',
		success: function(res){
			setDaysWithEvents();
			callback(res);
			if (__STATES.getCurrentState() == 'timeline' || __STATES.getCurrentState() == 'organizations'){
				__STATES.refreshState();
			}
		}
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

function printEventsInTimeline($view, res){
	var $tl_outer_wrap = $view.find('.tl-outer-wrap'),
		$blocks_wrapper = $view.find('.blocks-outer-wrap');

	res.data.forEach(function(value) {
		var m_date = moment(value.event_start_date).unix() < moment().unix()
				? moment() : moment(value.event_start_date),
			day_date = m_date.format(__C.DATE_FORMAT);
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
		$day_wrapper.append($event);
		$timeline_wrapper.append(tmpl('timeline-event', event));
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
				$div = $('<div>');
			res.data.forEach(function(organization){
				var _key = '_' + organization.type_id;
				if (!_organizations_by_types.hasOwnProperty(_key)){
					_organizations_by_types[_key] = {type_name: organization.type_name, organizations: []};
				}
				_organizations_by_types[_key].organizations.push(organization);
			});
			$.each(_organizations_by_types, function(key, type){
				var $wrapper = tmpl('organization-type-wrapper', type),
					$organizations = $wrapper.find('.organizations');
				type.organizations.forEach(function(organization){
					if(organization.subscribed != true){
						organization.btn_type_class = 'success';
						organization.btn_type_icon = 'check';
					}else{
						organization.btn_type_class = 'pink';
						organization.btn_type_icon = 'close';
					}
					var $organization = tmpl('organization-item', organization);
					$organization.find('.organization-img').on('click', function(){
						showOrganizationalModal(organization.id)
					});
					$organizations.append($organization)
				});
				$div.append($wrapper)
			});
			$view.html($div);
			$div.find('.subscribe-btn').on('click', function(){
				var $btn = $(this),
					to_delete_state = !$btn.hasClass('btn-success'),
					sub_id = $btn.data('subscription-id'),
					org_id = $btn.data('organization-id');
				if ($btn.hasClass(__C.CLASSES.DISABLED)) return;

				$btn.
					toggleClass('btn-success btn-pink disabled')
					.find('i')
					.toggleClass('fa-check fa-close');

				if (to_delete_state){
					toggleSubscriptionState(false, sub_id, function(res){
						$btn.removeClass(__C.CLASSES.DISABLED);
						hideOrganizationItem(org_id);
					});
				}else{
					toggleSubscriptionState(true, org_id, function(res){
						$btn.data('subscription-id', res.data.subscription_id);
						$btn.removeClass(__C.CLASSES.DISABLED);
						printSubscribedOrganizations();
					});
				}
			});
			$view.find('.load-more-btn').removeClass(__C.CLASSES.HIDDEN);
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
		}
	});
}


function OneDay($view, $content_block){
	$view.find('.panel-default,.tl-block').remove();
	var date = __STATES.getCurrentState();
	$.ajax({
		url: 'api/events/my?date=' + date,
		type: 'GET',
		dataType: 'JSON',
		success: function(res){
			printEventsInTimeline($view, res);
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
		$organization_item.remove()
	}, 1000);
}

function printSubscribedOrganizations(){
	var $list = $('.organizations-list');
	$.ajax({
		'url': 'api/organizations/?with_subscriptions=true',
		success: function(res){
			res.data.forEach(function(organization){
				if (organization.subscribed && $list.find('.organization-' + organization.id).length == 0){
					tmpl('organizations-item', organization)
						.addClass('fadeInLeftBig')
						.appendTo($list)
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
			type: 'short'
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
		})
		$('.show-timeline-btn').on('click', function(){
			History.pushState({page: 'timeline'}, 'Моя лента', 'timeline');
		})
});