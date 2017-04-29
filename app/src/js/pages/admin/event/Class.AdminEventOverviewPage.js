/**
 * @requires Class.AdminEventPage.js
 */
/**
 *
 * @class AdminEventOverviewPage
 * @extends AdminEventPage
 */
AdminEventOverviewPage = extending(AdminEventPage, (function() {
	/**
	 *
	 * @constructor
	 * @constructs AdminEventOverviewPage
	 * @param {(string|number)} event_id
	 */
	function AdminEventOverviewPage(event_id) {
		AdminEventPage.apply(this, arguments);
		
		this.graphics_stats = new EventStatistics(this.id);
		this.scoreboards_stats = new EventStatistics(this.id);
		this.event_fields.add(new Fields(
			'favored_users_count',
			'is_same_time',
			'dates'
		));
	}
	
	AdminEventOverviewPage.prototype.render = function() {
		var PAGE = this;
		
		this.renderHeaderTabs();
		__APP.changeTitle([{
			title: 'Организации',
			page: '/admin'
		}, {
			title: this.event.organization_short_name,
			page: '/admin/organization/' + this.event.organization_id
		}, this.event.title]);
		
		if (!checkRedirect('overview', '/admin/event/'+this.event.id+'/overview', true)) {
			return null;
		}
		
		this.$wrapper.html(tmpl('eventstat-overview', $.extend(true, {}, this.event, {
			cover_width: 280,
			dates_block: tmpl('eventstat-overview-datetime', {
				date: displayDateRange(this.event.first_event_date, this.event.last_event_date),
				time: this.event.is_same_time ? displayTimeRange(this.event.dates[0].start_time, this.event.dates[0].end_time) : 'Разное время'
			})
		})));
		this.$wrapper.find('.EventStatAreaCharts').children('.AreaChart').html(tmpl('loader'));
		
		this.scoreboards_stats.fetchStatistics(Statistics.SCALES.OVERALL, false, ['notifications_sent', 'view', 'fave', 'view_detail', 'fave_conversion', 'open_conversion'], null, function(data) {
			var scoreboards_data = {numbers: {}};
			$.each(data, function(field, stats) {
				scoreboards_data.numbers[field] = stats[0].value
			});
			PAGE.updateScoreboards(PAGE.$wrapper.find('.EventstatsScoreboards'), scoreboards_data, {
				'fave': 'Добавлений в избранное',
				'view': 'Просмотров события'
			}, ['fave', 'view']);
			PAGE.updateScoreboards(PAGE.$wrapper.find('.EventstatsBigScoreboards'), scoreboards_data, {
				'notifications_sent': 'Уведомлений отправлено',
				'view': 'Просмотров',
				'view_detail': 'Открытий',
				'open_conversion': 'Конверсия открытий',
				'fave': 'Добавлений',
				'fave_conversion': 'Конверсия добавлений'
			}, ['notifications_sent', 'view', 'view_detail', 'open_conversion', 'fave', 'fave_conversion'], 'big');
		});
		
		this.graphics_stats.fetchStatistics(Statistics.SCALES.DAY, moment(__APP.EVENDATE_BEGIN, 'DD-MM-YYYY').format(), ['notifications_sent', 'view', 'fave', 'view_detail', 'fave_conversion', 'open_conversion'], null, function(data) {
			PAGE.buildAreaCharts(data, {
				rangeSelector: {
					selected: 1
				}
			});
		});
		
		__APP.MODALS.bindCallModal(PAGE.$wrapper);
		bindPageLinks(PAGE.$wrapper);
	};
	
	return AdminEventOverviewPage;
}()));