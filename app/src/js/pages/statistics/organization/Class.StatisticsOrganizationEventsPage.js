/**
 * @requires Class.StatisticsOrganizationPage.js
 */
/**
 *
 * @constructor
 * @augments StatisticsOrganizationPage
 * @param {(string|number)} org_id
 */
function StatisticsOrganizationEventsPage(org_id) {
	StatisticsOrganizationPage.apply(this, arguments);
	
	this.block_scroll = false;
	this.future_events_data = {
		future: true,
		canceled_shown: true
	};
	this.past_events_data = {
		canceled_shown: true,
		order_by: '-first_event_date'
	};
	this.future_events = new EventsWithStatisticsCollection();
	this.past_events = new EventsWithStatisticsCollection();
}
StatisticsOrganizationEventsPage.extend(StatisticsOrganizationPage);


StatisticsOrganizationEventsPage.buildEventRows = function(events, date_field) {
	var $events = tmpl('orgstat-events-row', events.map(function(event) {
		return $.extend({}, event, {
			date: moment.unix(event[date_field]).format(__LOCALES.ru_RU.DATE.DATE_FORMAT),
			timestamp: event[date_field],
			conversion: Math.round(event.view == 0 ? (event.view_detail * 100 / event).view : 0) + '%'
		});
	}));
	bindPageLinks($events);
	return $events;
};

StatisticsOrganizationEventsPage.prototype.fetchData = function() {
	return this.fetching_data_defer = this.organization.fetchOrganization([]);
};

StatisticsOrganizationEventsPage.prototype.render = function() {
	var this_page = this,
		$window = $(window),
		$past_events_wrapper,
		past_events_tablesort;
	
	if(__APP.USER.id === -1){
		__APP.changeState('/feed/actual', true, true);
		return null;
	}
	
	this.renderHeaderTabs();
	__APP.changeTitle([{
		title: 'Организации',
		page: '/statistics'
	}, this.organization.short_name + ' - события']);
	
	this.$wrapper.html(tmpl('orgstat-events-page'));
	
	this.future_events.fetchOrganizationsEvents(this.organization.id, this.future_events_data, 0, function() {
		if(this.length){
			this_page.$wrapper.find('.OrgStatFutureEventsWrapper').html(tmpl('orgstat-events-wrapper', {
				title: 'Предстоящие события',
				rows: StatisticsOrganizationEventsPage.buildEventRows(this_page.future_events, 'nearest_event_date')
			})).find('table').tablesort();
		}
	});
	
	this.past_events.fetchOrganizationsEvents(this.organization.id, this.past_events_data, 30, function() {
		if(this.length){
			$past_events_wrapper = this_page.$wrapper.find('.OrgStatPastEventsWrapper');
			$past_events_wrapper.html(tmpl('orgstat-events-wrapper', {
				title: 'Прошедшие события',
				rows: StatisticsOrganizationEventsPage.buildEventRows(this_page.past_events, 'first_event_date')
			}));
			past_events_tablesort = $past_events_wrapper.find('table').tablesort();
			
			$window.on('scroll.uploadEvents', function() {
				if ($window.height() + $window.scrollTop() + 200 >= $(document).height() && !this_page.block_scroll) {
					this_page.block_scroll = true;
					
					this_page.past_events.fetchOrganizationsEvents(this_page.organization.id, this_page.past_events_data, 30, function(events) {
						this_page.block_scroll = false;
						if (events.length) {
							$past_events_wrapper.find('tbody').append(StatisticsOrganizationEventsPage.buildEventRows(events, 'first_event_date'));
							past_events_tablesort.refresh();
						} else {
							$(window).off('scroll.uploadEvents');
						}
					})
				}
			})
		}
	});
};