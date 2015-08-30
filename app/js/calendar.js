/**
 * Created by Инал on 20.06.2015.
 */

paceOptions = {
	ajax: false, // disabled
	document: false, // disabled
	eventLag: false, // disabled
	elements: {},
	search_is_active: false,
	search_query: null,
	search_xhr: null
};

var __C = {
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
		SUBSCRIBE_ADD: 'btn-default empty',
		SUBSCRIBE_DELETE: 'btn-danger',
		DISABLED: 'disabled'
	},
	DATE_FORMAT: 'YYYY-MM-DD'
};

var MODAL_OFFSET = 185,
	MODAL_FOOTER_HEIGHT = 65,
	events_page_number = 0,
	favorites_page_number = 0,
	_events = {},
	_favorite_events = {},
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

function setSelectedMenu(class_name){
	$('.nav .mb-compose-button')
		.removeClass(__C.CLASSES.ACTIVE)
		.filter('.' + class_name)
		.addClass(__C.CLASSES.ACTIVE);

	if (class_name != 'search'){
		$('.search-input').val('');
	}

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
		var $btn = $(this),
			$liked_count = $btn.parents('.tl-panel-block').find('.liked-users-count-number'),
			$liked_count_text = $btn.parents('.tl-panel-block').find('.liked-users-count-text'),
			_event_id = $btn.data('event-id'),
			_date = $btn.parents('.tl-panel-block').data(__C.DATA_NAMES.DATE),
			params = {
				url: '/api/events/favorites/',
				type: 'POST',
				data: {
					event_id: _event_id,
					event_date: _date
				},
				success: showNotifier
			};

		$btn.toggleClass(__C.CLASSES.NO_BORDERS);
		$btn.text($btn.hasClass(__C.CLASSES.NO_BORDERS) ? __C.TEXTS.REMOVE_FAVORITE : __C.TEXTS.ADD_FAVORITE);
		$view.find('.timeline-' + _event_id + '-' + _date).toggleClass(__C.CLASSES.ACTIVE);

		var new_count;
		if (!$btn.hasClass(__C.CLASSES.NO_BORDERS)){
			params.type = 'DELETE';
			params.url = '/api/events/favorites/' + $btn.data('event-id');
			params.success = null;
			new_count = parseInt($liked_count.text()) - 1;
			$liked_count.text(new_count);
		}else{
			new_count = parseInt($liked_count.text()) + 1;
			$liked_count.text(new_count);
		}
		$liked_count_text.text(getUnitsText(new_count, __C.TEXTS.FAVORED));

		$.ajax(params);
	});


	$view.find('.organization-in-event').on('click', function(){
		showOrganizationalModal($(this).data('organization-id'));
	});

	$view.find('.social-links i').on('click', function(){
		var $this = $(this),
			$block = $this.parents('.tl-panel-block'),
			_type = $this.data('share-type');
		window.open($block.data('share')[_type], 'SHARE_WINDOW',
			'status=1,toolbar=0,menubar=0&height=300,width=500');
	});
}

function walkEventActiveDates(events, cb){
	events.forEach(function(event){
		var m_event_start_date = moment(event.event_start_date),
			m_event_end_date = moment(event.event_end_date),
			end_date = m_event_end_date.format(__C.DATE_FORMAT),
			current_date = m_event_start_date,
			event_date;
		do{
			if (current_date.unix() < moment().unix()){
				current_date.add(1, 'days');
			}else{
				event_date = current_date.format(__C.DATE_FORMAT);
				if (cb && cb instanceof Function){
					cb(event, event_date);
				}
				current_date.add(1, 'days');
			}
		}while(end_date != event_date && current_date.unix() < m_event_end_date.unix());
	});
}

function normalizeEventsArray(events, events_type){
	walkEventActiveDates(events, function(event, event_date){
		if (!window[events_type].hasOwnProperty(event_date)){
			window[events_type][event_date] = {
				events: {},
				count: 0
			};
		}
		var event_clone = $.extend(true, {}, event);
		event_clone.date = event_date;
		event_clone.is_favorite = event.favorite_dates.indexOf(event_date) != -1;
		event_clone.favorite_this_day_friends = event.favorite_friends.hasOwnProperty(event_date) ? event['favorite_friends'][event_date] : [];

		if (window[events_type][event_date].events.hasOwnProperty('_' + event_clone.id) == false){
			if (events_type == '_favorite_events' && event_clone.is_favorite == false){
				return true;
			}
			window[events_type][event_date].events['_' + event_clone.id] = event_clone;
			window[events_type][event_date].count++;
		}
	});
}

function buildMyTimeline(res, events_type){
	normalizeEventsArray(res.data, events_type);

	var $tl_outer_wrap = $('.screen-view:not(.hidden) .tl-outer-wrap'),
		$blocks_wrapper = $('.screen-view:not(.hidden) .blocks-outer-wrap'),
		events_count = 0;

	$.each(window[events_type], function(day_date, value){
		if (value.count == 0) return true;
		events_count++;
		var $day_wrapper = $blocks_wrapper.find('.events-' + day_date),
			$timeline_wrapper = $tl_outer_wrap.find('.timeline-' + day_date),
			m_date = moment(day_date, __C.DATE_FORMAT);
		if ($day_wrapper.length == 0){
			$day_wrapper = tmpl('events-day-wrapper', {
				day_name: m_date.format('dddd'),
				day_number: m_date.format('DD'),
				month_name: m_date.format('MMMM'),
				events_count: value.count,
				date: m_date.format(__C.DATE_FORMAT)
			}).appendTo($blocks_wrapper);

			$timeline_wrapper = tmpl('timeline-day', {
				day_short_name: m_date.format('ddd').toUpperCase(),
				day_number: m_date.format('DD'),
				month_number: m_date.format('MM'),
				date: day_date
			}).appendTo($tl_outer_wrap);
		}
		$.each(value.events, function(_key, event){
			$day_wrapper.find('.event-' + event.id + '-' + day_date).remove();
			$timeline_wrapper.find('.timeline-' + event.id + '-' + day_date).remove();
			event = generateEventAttributes(event);

			event.date = day_date;
			var $event = tmpl('event-item', event);
			$event.data('share', {
				'vk': tmpl('vk-share-link', event).attr('href'),
				'facebook': tmpl('facebook-share-link', event).attr('href'),
				'twitter': tmpl('twitter-share-link', event).attr('href')
			});
			$day_wrapper.append($event);
			$timeline_wrapper.append(tmpl('timeline-event', event));
		});
	});

	if (events_type == '_events'){
		if (events_count == 0){
			$tl_outer_wrap.addClass('hidden');
			$('.main-row').addClass('hidden');
			$('.sad-eve').removeClass('hidden');
		}else{
			$tl_outer_wrap.removeClass('hidden');
			$('.main-row').removeClass('hidden');
			$('.sad-eve').addClass('hidden');
		}
	}
	bindEventHandlers();

}

function generateEventAttributes(event){
	event.date =  moment(event.event_start_date).format(__C.DATE_FORMAT);
	event.begin_time = moment(event.begin_time, 'HH:mm:ss').format('HH:mm');
	event.end_time = moment(event.end_time, 'HH:mm:ss').format('HH:mm');
	event.time = event.begin_time == '00:00' && event.end_time == '00:00' ? ' Весь день': event.begin_time + ' - ' + event.end_time;

	event.favorite_btn_class = event.is_favorite ? __C.CLASSES.NO_BORDERS : '';
	event.favorite_btn_text = event.is_favorite ? __C.TEXTS.REMOVE_FAVORITE : __C.TEXTS.ADD_FAVORITE;
	event.timeline_favorite_class = event.is_favorite ? __C.CLASSES.ACTIVE : '';
	event.favored_text = getUnitsText(event.liked_users_count, __C.TEXTS.FAVORED);
	return event;
}

function showFavoriteEvents(){
	setSelectedMenu('show-favorites-btn');

	var $view = $('.favorites-app');
	$('.screen-view').addClass('hidden');
	$view.removeClass('hidden');

	$view.find('.blocks-outer-wrap').empty();
	$view.find('.tl-block').remove();

	favorites_page_number = 0;
	$.ajax({
		url: '/api/events/favorites',
		data: {
			page: favorites_page_number
		},
		success: function(res){
			buildMyTimeline(res, '_favorite_events');
		}
	});
}

//TODO: Прицепить к кнопке
function showSettingsModal(){
	var $modal = $('#settings-modal');
	$modal.remove();

	$.ajax({
		url: '/api/users/my/settings',
		type: 'GET',
		success: function(res){
			$modal = tmpl('settings-modal', res.data);
		}
	});
}

function buildSearchResults(res){
	var $events_wrapper = $('.search-events').empty(),
		$organizations_wrapper = $('.search-organizations').empty();

	res.data.events.forEach(function(event){
		$events_wrapper.append(tmpl('search-event-item', generateEventAttributes(event)));
	});

	res.data.organizations.forEach(function(organization){
		$organizations_wrapper.append(tmpl('organization-search-item', organization));
	});


}

function handleSearch(query){
	if (paceOptions.search_is_active){
		paceOptions.search_xhr.abort();
	}

	paceOptions.search_is_active = true;
	paceOptions.search_query = query;
	setSelectedMenu('search');

	var $view = $('.search-app');
	$('.screen-view').addClass('hidden');
	$view.removeClass('hidden');


	paceOptions.search_xhr = $.ajax({
		url: '/api/search/',
		data: {
			q: paceOptions.search_query
		},
		success: function(res){
			paceOptions.search_is_active = false;
			paceOptions.search_xhr = null;
			if (paceOptions.search_query == res.data.query){
				buildSearchResults(res);
			}
		}
	});
}

function clearEvents(){
	_events = {};
	$('#blocks-outer-wrap div, #tl-outer-wrap div').remove();
	events_page_number = 0;
}

/**
 *
 * @param state
 * @param entity_id ID подписки или ID организации в зависимости от типа совершаемого события
 * @param callback
 */
function toggleSubscriptionState(state, entity_id, callback){
	var options = (state == false) ? {
		url: 'api/subscriptions/' + entity_id,
		type: 'DELETE',
		success: callback
	} : {
		url: 'api/subscriptions/',
		data:{organization_id: entity_id},
		type: 'POST',
		success: callback
	};

	$.ajax(options);
}

function hideOrganizationItem(org_id){
	var $organization_item = $('.animated.organization-' + org_id).addClass('bounceOutLeft');
	setTimeout(function(){
		$organization_item.remove()
	}, 1000);
}

function showAllOrganizations(){
	setSelectedMenu('show-organizations-btn');
	var $view = $('.organizations-app').empty();
	$('.screen-view').addClass('hidden');
	$view.removeClass('hidden');
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
			$div.appendTo($view);
			$div.find('.subscribe-btn').on('click', function(){
				clearEvents();
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
						showNotifier(res);
						printSubscribedOrganizations();
					});
				}
			});
		}
	})
}

function getEventsList(){
	$.ajax({
		url: '/api/events/my?page=' + events_page_number,
		success: function(res){
			buildMyTimeline(res, '_events');
		}
	});
}

function showOrganizationalModal(organization_id){
	$.ajax({
		url: 'api/organizations/' + organization_id + '?with_events=true',
		success: function(res){
			var $events = $('<div>'),
				$friends = tmpl('subscribed-users-row', {
					subscribed_count: res.data.subscribed_count,
					subscribed_count_text: getUnitsText(res.data.subscribed_count, __C.TEXTS.SUBSCRIBERS)
				}),
				$body = $('body'),
				$modal = $('#organization-modal');
			if (res.data && res.data.hasOwnProperty('events')){
				res.data.events.forEach(function(event){
					$events.append(tmpl('short-event', event));
				});

				res.data.subscribed_friends.forEach(function(friend){
					$friends.prepend(tmpl('subscribed-friend', friend));
				});


				$modal.remove();
				res.data.events = $events;
				res.data.subscribed_friends = $friends;

				$modal = tmpl('organization-modal', $.extend(true, res.data, {
					subscribe_btn_text: res.data.is_subscribed ? __C.TEXTS.REMOVE_SUBSCRIPTION : __C.TEXTS.ADD_SUBSCRIPTION,
					subscribe_btn_class: res.data.is_subscribed ? __C.CLASSES.SUBSCRIBE_DELETE : __C.CLASSES.SUBSCRIBE_ADD
				}));

				$modal.find('.modal-subscribe-btn').on('click', function(){
					var $btn = $(this),
						org_id = $btn.data('organization-id'),
						sub_id = $btn.data('subscription-id');
					if ($btn.hasClass(__C.CLASSES.DISABLED)) return true;

					$btn.addClass(__C.CLASSES.DISABLED);

					if ($btn.hasClass(__C.CLASSES.SUBSCRIBE_DELETE)){
						toggleSubscriptionState(false, sub_id, function(res){
							$btn
								.toggleClass(__C.CLASSES.SUBSCRIBE_DELETE + ' ' +
									__C.CLASSES.SUBSCRIBE_ADD + ' ' +
									__C.CLASSES.DISABLED)
								.text(__C.TEXTS.ADD_SUBSCRIPTION);
							showNotifier(res);
							hideOrganizationItem(org_id);
							clearEvents();
							getEventsList();
						});
					}else{
						toggleSubscriptionState(true, org_id, function(res){
							$btn
								.toggleClass(__C.CLASSES.SUBSCRIBE_DELETE + ' ' +
								__C.CLASSES.SUBSCRIBE_ADD + ' ' +
								__C.CLASSES.DISABLED)
								.text(__C.TEXTS.REMOVE_SUBSCRIPTION);
							showNotifier(res);
							printSubscribedOrganizations();
						});
					}
				});

				var modal_height = window.innerHeight - MODAL_OFFSET + MODAL_FOOTER_HEIGHT;
				$modal
					.appendTo($body)
					.on('shown.bs.modal', function(){
						var events_block_height =
							modal_height
							- $modal.find('.modal-header').outerHeight()
							- $modal.find('.organization-content-header').outerHeight()
							- $modal.find('.organization-info').outerHeight()
							- 20;
						events_block_height = events_block_height < 110 ? 110 : events_block_height ;
						$modal
							.find('.last-events-list>div')
							.css('max-height', events_block_height + 'px')
							.slimscroll({
								height: events_block_height
							});
					})
					.modal();

			}
		}
	});
}

function printSubscribedOrganizations(){
	var $list = $('.organizations-list').empty(),
		$loader = $('.organizations-loading').show();
	$.ajax({
		'url': 'api/organizations/?with_subscriptions=true',
		success: function(res){
			$list.empty();
			$loader.hide();
			res.data.forEach(function(organization){
				if (organization.subscribed){
					tmpl('organizations-item', organization)
						.appendTo($list)
						.on('click', function(){
							showOrganizationalModal($(this).data('organization-id'));
						});
				}
			});
		}
	});
}

function showNotifier(response){
	$.notify({
		'message': response.text,
		'pos': response.pos ? response.pos : 'top-right',
		'status': response.status ? 'success' : 'danger'
	});
}

function showTimeline(){
	getEventsList();
	setSelectedMenu('show-my-timeline-btn');
	var $view = $('.calendar-app');
	$('.screen-view').addClass('hidden');
	$view.removeClass('hidden');
}


function setDaysWithEvents(){
	$.ajax({
		url: '/api/events/search',
		data: {
			since_date: _selected_month.startOf('month').format(__C.DATE_FORMAT),
			till_date: _selected_month.endOf('month').format(__C.DATE_FORMAT),
			type: 'short'
		},
		success: function(res){
			walkEventActiveDates(res.data, function(event, event_date){
				$('.td-day[data-date="' + event_date + '"]').addClass('click-able');
			});
		}
	});
}

$(document)
	.ajaxStart(function(){
		Pace.restart()
	})
	.ready(function(){

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
			$month_name.text(current_month.lang('ru').format("MMMM YYYY"));
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
					date: current_month.format(__C.DATE_FORMAT)
				}))
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

		function bindOnClickEvents(){
			var $day_events = $('.day-events'),
				$no_events_text = $('.no-events-text'),
				$loading = $('.events-loading-pulse');
			$('.td-day').on('click', function(){
				var $this = $(this);
				$('#events-list-date').text(moment($this.data(__C.DATA_NAMES.DATE)).locale('ru').format('DD MMMM YYYY'));
				$('.td-day').removeClass('selected');
				$this.addClass('selected');
				$day_events.find(':not(.no-events-text)').remove();
				$loading.show();
				$no_events_text.addClass('hidden');
				$.ajax({
					url: 'api/events/' + $this.data(__C.DATA_NAMES.DATE),
					type: 'GET',
					dataType: 'JSON',
					success: function(res){
						//TODO: Сделать нажатие на клик
					}
				});
			});
		}

		function clickSelectedDate(){
			$('.td-day.selected').click();
		}

		function renderTable(){
			deleteDays();
			buildTable();
			setMonthName();
			bindOnClickEvents();
			clickSelectedDate();
			setDaysWithEvents();
		}

		function selectToday(){
			$('.td-day.today').addClass('selected');
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

		$('.show-organizations-btn').on('click', showAllOrganizations);
		$('.show-my-timeline-btn').on('click', showTimeline);
		$('.show-favorites-btn').on('click', showFavoriteEvents);

	$('.log-out-icon').on('click', function(){
		window.location.href = '../../index.php';
	});
		$('.search-input')
			.on('input', function(e){
				handleSearch(this.value);
			})
			.on('keypress', function(e){
			if (e.which == 13){
				handleSearch(this.value);
			}
		});
	printSubscribedOrganizations();
	getEventsList();
});