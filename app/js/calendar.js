/**
 * Created by Инал on 20.06.2015.
 */

paceOptions = {
	ajax: false, // disabled
	document: false, // disabled
	eventLag: false, // disabled
	elements: {}
};
var MODAL_OFFSET = 200;

function bindEventHandlers(){
	$('.more-info-btn').off('click').on('click', function(){
		$(this).parents('.tl-panel-block').toggleClass('closed');
	});
}

function showOrganizationalModal(organization_id){
	$.ajax({
		url: 'api/organizations/' + organization_id + '?with_events=true',
		success: function(res){
			var $events = $('<div>'),
				$body = $('body'),
				$modal = $('#organization-modal');
			if (res.data && res.data.hasOwnProperty('events')){
				res.data.events.forEach(function(event){
					$events.append(tmpl('short-event', event));
				});
				$modal.remove();
				res.data.events = $events;
				$modal = tmpl('organization-modal', res.data);
				var modal_height = window.innerHeight - MODAL_OFFSET + 70;
				$modal.find('.modal-body').css('max-height', modal_height);
				$modal
					.appendTo($body)
					.on('shown.bs.modal', function(){
						var events_block_height = modal_height
							- $modal.find('.modal-header').outerHeight()
							- $modal.find('.organization-content-header').outerHeight()
							- $modal.find('.organization-info').outerHeight();
						events_block_height = events_block_height < 110 ? 110 : events_block_height ;
						$modal.find('.last-events-list>div')
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

$(document).ready(function(){

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
				today = current_month.format('YYYY-MM-DD') == _today.format('YYYY-MM-DD') ? 'today' : '';
				td_days.push(tmpl('calendar-day', {
					number: current_month.date(),
					day_number: current_month.day(),
					today: today,
					date: current_month.format('YYYY-MM-DD')
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
			$calendar.append($tbody);
		}

		function bindOnClickEvents(){
			var $day_events = $('.day-events'),
				$no_events_text = $('.no-events-text'),
				$loading = $('.events-loading-pulse');
			$('.td-day').on('click', function(){
				var $this = $(this);
				$('#events-list-date').text(moment($this.data('date')).locale('ru').format('DD MMMM YYYY'));
				$('.td-day').removeClass('selected');
				$this.addClass('selected');
				$day_events.find(':not(.no-events-text)').remove();
				$loading.show();
				$no_events_text.addClass('hidden');
				$.ajax({
					url: 'api/events/' + $this.data('date'),
					type: 'GET',
					dataType: 'JSON',
					success: function(res){
						$loading.hide();
						$('.events-count').text('всего событий: ' + res.data.length);
						if (res.data == null || res.data.length == 0){
							$no_events_text.removeClass('hidden');
						}else{
							res.data.forEach(function(value){
								value.start_date = moment(value.event_start_date).locale('ru').format('DD MMMM YYYY HH:mm');
								value.end_date = moment(value.event_end_date).locale('ru').format('DD MMMM YYYY HH:mm');
								$day_events.append(tmpl('event', value));
							});
						}
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
		}

		function selectToday(){
			$('.td-day.today').click()
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


		$('.add-event-modal .modal-body')
			.slimScroll({
				height: window.innerHeight - MODAL_OFFSET
			});
	})(jQuery, window, undefined);


	$('.exit-btn').on('click', function(){
		window.location.href = 'index.html';
	});

	function bindSubscribeBtn($btn){
		$btn.on('click', function(){

			if ($btn.hasClass('disabled')) return;

			var sub_id = $btn.data('subscription-id'),
				org_id = $btn.data('organization-id');
			$btn.
				toggleClass('btn-success btn-danger disabled');
			if ($btn.hasClass('btn-success')){
				$btn.text('Подписаться');
				$.ajax({
					url: 'api/subscriptions/' + sub_id,
					type: 'DELETE',
					success: function(res){
						$btn.removeClass('disabled');
						showNotifier(res);
					}
				});
			}else{
				$btn.text('Отписаться');
				$.ajax({
					url: 'api/subscriptions/',
					data:{
						organization_id: org_id
					},
					type: 'POST',
					success: function(res){
						$btn.removeClass('disabled');
						showNotifier(res)
					}
				});
			}
		});
	}

	$('input.daterange').daterangepicker(
		{
			locale: {
				format: 'DD/MM/YYYY',
				applyLabel: 'Выбрать',
				cancelLabel: 'Отмена',
				firstDay: 1,
				daysOfWeek: [
					'Пн','Вт','Ср','Чт','Пт','Сб','Вс'
				],
				monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
			},
			startDate: moment(),
			endDate: moment(),
			minDate: moment(),
			maxDate: moment().add(3, 'months'),
			applyClass: 'btn-pink',
			cancelClass: 'btn-pink-empty'
		},
		function(start, end, label) {
			console.log(start, end, label)
		});

	$('input.input-hours').inputmask('Regex', {
		regex: "([01]?[0-9]|2[0-3])"
	});
	$('input.input-minutes').inputmask('Regex', {
		regex: "[0-5][0-9]"
	});
	$(".placepicker").placepicker();
	printSubscribedOrganizations();
	bindEventHandlers();
});