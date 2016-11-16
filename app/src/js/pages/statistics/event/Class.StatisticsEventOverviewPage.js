/**
 * @requires Class.StatisticsEventPage.js
 */
/**
 *
 * @constructor
 * @augments StatisticsEventPage
 * @param {(string|number)} event_id
 */
function StatisticsEventOverviewPage(event_id) {
	StatisticsEventPage.apply(this, arguments);
	
	this.graphics_stats = new EventStatistics(this.id);
	this.scoreboards_stats = new EventStatistics(this.id);
	this.is_loading = true;
	this.event.fetchEvent([
		'image_horizontal_medium_url',
		'organization_short_name',
		'favored_users_count',
		'is_same_time',
		'dates'
	], Page.triggerRender);
}
StatisticsEventOverviewPage.extend(StatisticsEventPage);

StatisticsEventOverviewPage.prototype.render = function() {
	var PAGE = this;
	
	if(__APP.USER.id === -1){
		__APP.changeState('/feed/actual', true, true);
		return null;
	}
	__APP.changeTitle([{
		title: 'Организации',
		page: '/statistics'
	}, {
		title: this.event.organization_short_name,
		page: '/statistics/organization/' + this.event.organization_id
	}, this.event.title]);
	
	this.$wrapper.html(tmpl('eventstat-overview', $.extend(true, {}, this.event, {
		dates_block: tmpl('eventstat-overview-datetime', {
			date: displayDateRange(this.event.first_event_date, this.event.last_event_date),
			time: this.event.is_same_time ? displayTimeRange(this.event.dates[0].start_time, this.event.dates[0].end_time) : 'Разное время'
		})
	})));
	this.$wrapper.find('.EventStatAreaCharts').children('.AreaChart').html(tmpl('loader'));
	
	this.scoreboards_stats.fetchStatistics(Statistics.SCALES.OVERALL, false, ['view', 'fave', 'open_site', 'fave_conversion', 'open_conversion'], null, function(data) {
		var scoreboards_data = {numbers: {}};
		$.each(data, function(field, stats) {
			scoreboards_data.numbers[field] = stats[0].value
		});
		PAGE.updateScoreboards(PAGE.$wrapper.find('.EventstatsScoreboards'), scoreboards_data, {
			'fave': 'Добавлений в избранное',
			'view': 'Просмотров события'
		}, ['fave', 'view']);
		PAGE.updateScoreboards(PAGE.$wrapper.find('.EventstatsBigScoreboards'), scoreboards_data, {
			'view': 'Просмотров',
			'open_site': 'Открытий',
			'open_conversion': 'Конверсия открытий',
			'fave': 'Добавлений',
			'fave_conversion': 'Конверсия добавлений'
		}, ['view', 'open_site', 'open_conversion', 'fave', 'fave_conversion'], 'big');
	});
	
	this.graphics_stats.fetchStatistics(Statistics.SCALES.DAY, moment(__APP.EVENDATE_BEGIN, 'DD-MM-YYYY').format(), ['view', 'fave', 'open_site', 'fave_conversion', 'open_conversion'], null, function(data) {
		PAGE.buildAreaCharts(data, {
			rangeSelector: {
				selected: 1
			}
		});
	});
	
	__APP.MODALS.bindCallModal(PAGE.$wrapper);
	bindPageLinks(PAGE.$wrapper);
};