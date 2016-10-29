/**
 * @requires Class.StatisticsOrganizationPage.js
 */
/**
 *
 * @constructor
 * @augments StatisticsOrganizationPage
 * @param {(string|number)} org_id
 */
function StatisticsOrganizationOverviewPage(org_id) {
	StatisticsOrganizationPage.apply(this, arguments);
	this.graphics_stats = new OrganizationsStatistics(this.id);
	this.other_stats = new OrganizationsStatistics(this.id);
	this.is_loading = true;
	this.organization.fetchOrganizationWithEvents([
		'description',
		'img_medium_url',
		'default_address',
		'staff',
		'privileges'
	], {
		length: 3,
		future: true,
		is_canceled: true,
		is_delayed: true,
		fields: [
			'organization_short_name',
			'public_at'
		],
		order_by: 'nearest_event_date'
	}, Page.triggerRender);
}
StatisticsOrganizationOverviewPage.extend(StatisticsOrganizationPage);
/**
 *
 * @param {string} title
 * @param staff
 * @return {jQuery}
 */
StatisticsOrganizationOverviewPage.buildStaffBlock = function(title, staff) {
	if (staff.length) {
		return tmpl('orgstat-staff-block', {
			title: title,
			avatars: __APP.BUILD.avatarBlocks(staff)
		});
	} else {
		return tmpl('orgstat-staff-block', {hidden: __C.CLASSES.NEW_HIDDEN});
	}
};

StatisticsOrganizationOverviewPage.prototype.buildAreaCharts = function() {
	var self = this;
	StatisticsPage.prototype.buildAreaCharts.call(self, {
		subscribe_unsubscribe: self.graphics_stats.subscribe.map(function(el, i) {
			return {
				time_value: el.time_value,
				subscribe: el.value,
				unsubscribe: self.graphics_stats.unsubscribe[i].value
			}
		}),
		view: self.graphics_stats.view,
		conversion: self.graphics_stats.conversion
	});
};

StatisticsOrganizationOverviewPage.prototype.buildPieChart = function($container, data) {
	var pie_chart_options = {
		chart: {
			type: 'pie',
			height: 200,
			style: {
				fontFamily: 'inherit',
				fontSize: 'inherit'
			}
		},
		colors: [__C.COLORS.FRANKLIN, __C.COLORS.ACCENT, __C.COLORS.MUTED, __C.COLORS.MUTED_80, __C.COLORS.MUTED_50, __C.COLORS.MUTED_30],
		tooltip: {
			pointFormat: '<b>{point.percentage:.1f}%</b>'
		},
		plotOptions: {
			pie: {
				center: [45, '50%'],
				allowPointSelect: true,
				cursor: 'pointer',
				size: 120,
				dataLabels: {
					distance: -35,
					defer: false,
					formatter: function() {
						return this.percentage > 15 ? Math.round(this.percentage) + '%' : null;
					},
					style: {"color": "#fff", "fontSize": "20px", "fontWeight": "300", "textShadow": "none"},
					y: -6
				},
				showInLegend: true
			}
		},
		legend: {
			align: 'right',
			verticalAlign: 'top',
			layout: 'vertical',
			width: 100,
			symbolHeight: 0,
			symbolWidth: 0,
			itemMarginBottom: 5,
			labelFormatter: function() {
				return '<span style="color: ' + this.color + '">' + this.name + '</span>'
			},
			itemStyle: {cursor: 'pointer', fontSize: '14px', fontWeight: '500'},
			y: 12
		}
	};
	
	function pieChartSeriesNormalize(raw_data) {
		var STD_NAMES = {
			"browser": "Браузер",
			"android": "Аndroid",
			"ios": "iOS",
			"female": "Женщины",
			"male": "Мужчины",
			"other": "Остальные",
			null: "Не указано"
		};
		return [{
			data: raw_data.map(function(line, i) {
				return {
					name: line.name ? STD_NAMES[line.name] : STD_NAMES[line.gender],
					y: line.count
				}
			})
		}];
	}
	
	$container.highcharts($.extend(true, {}, this.highchart_defaults, pie_chart_options, {series: pieChartSeriesNormalize(data)}));
};

StatisticsOrganizationOverviewPage.prototype.render = function() {
	var PAGE = this,
		stat_dynamics = {
			scale: Statistics.SCALES.WEEK,
			fields: [
				'subscribe',
				'view',
				'fave',
				'conversion'
			]
		},
		staffs_additional_fields = {
			is_link: true,
			avatar_classes: ['-size_40x40', '-rounded']
		},
		storage_data_name = 'org_stats_' + this.id + '_data',
		storage_until_name = 'org_stats_' + this.id + '_until',
		is_cached_data_actual = moment.unix(window.sessionStorage.getItem(storage_until_name)).isAfter(moment());
	
	if (!window.location.pathname.contains('overview')) {
		__APP.changeState(window.location.pathname+'/overview', true);
	}
	this.renderHeaderTabs();
	__APP.changeTitle([{
		title: 'Организации',
		page: '/statistics'
	}, this.organization.short_name]);
	
	this.$wrapper.html(tmpl('orgstat-overview', $.extend(true, {}, this.organization, {
		staff_block: StatisticsOrganizationOverviewPage.buildStaffBlock('Администраторы', this.organization.staff.getSpecificStaff(OneUser.ROLE.ADMIN, staffs_additional_fields))
			.add(StatisticsOrganizationOverviewPage.buildStaffBlock('Модераторы', this.organization.staff.getSpecificStaff(OneUser.ROLE.MODERATOR, staffs_additional_fields))),
		event_blocks: tmpl('orgstat-event-block', this.organization.events.map(function(event) {
			var badges = [];
			if (event.canceled)
				badges.push({title: 'Отменено'});
			if (event.public_at && moment.unix(event.public_at).isBefore())
				badges.push({title: 'Не опубликовано'});
			
			return {
				id: event.id,
				title: event.title,
				organization_short_name: event.organization_short_name,
				day: moment.unix(event.first_event_date).format("D"),
				month: moment.unix(event.first_event_date).format("MMM"),
				badges: tmpl('orgstat-event-block-badge', badges)
			};
		}))
	})));
	
	if (is_cached_data_actual) {
		this.graphics_stats.setData(JSON.parse(window.sessionStorage.getItem(storage_data_name)));
		this.buildAreaCharts();
	} else {
		this.$wrapper.find('.OrgStatAreaCharts').children('.AreaChart').append(tmpl('loader'));
		this.graphics_stats.fetchStatistics(Statistics.SCALES.DAY, moment(__APP.EVENDATE_BEGIN, 'DD-MM-YYYY').format(), ['view', 'subscribe', 'unsubscribe', 'conversion'], null, function() {
			window.sessionStorage.setItem(storage_data_name, JSON.stringify(PAGE.graphics_stats));
			window.sessionStorage.setItem(storage_until_name, moment().add(15, 'm').unix());
			PAGE.buildAreaCharts();
		});
	}
	
	this.other_stats.fetchStatistics(Statistics.SCALES.OVERALL, false, ['subscribe', 'view', 'fave', 'conversion', 'audience'], stat_dynamics, function(stat_data) {
		var scoreboards_data = {numbers: {}, dynamics: {}};
		
		$.each(stat_data.dynamics, function(field, dynamics) {
			scoreboards_data.dynamics[field] = dynamics[0].value;
			scoreboards_data.numbers[field] = stat_data[field][0].value;
		});
		PAGE.buildPieChart(PAGE.$wrapper.find('.GenderPieChart'), this.audience.gender);
		PAGE.buildPieChart(PAGE.$wrapper.find('.DevicePieChart'), this.audience.devices);
		
		PAGE.updateScoreboards(PAGE.$wrapper.find('.Scoreboards'), scoreboards_data, {
			'subscribe': 'Подписчиков организатора',
			'fave': 'Добавлений в избранное',
			'view': 'Просмотров организатора',
			'conversion': 'Конверсия открытий/подписок'
		}, ['subscribe', 'fave', 'view', 'conversion']);
		
	});
	
	bindRippleEffect(this.$wrapper);
	bindPageLinks(this.$wrapper);
};