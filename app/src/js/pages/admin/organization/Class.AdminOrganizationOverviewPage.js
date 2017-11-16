/**
 * @requires Class.AdminOrganizationPage.js
 */
/**
 *
 * @class AdminOrganizationOverviewPage
 * @extends AdminOrganizationPage
 */
AdminOrganizationOverviewPage = extending(AdminOrganizationPage, (function() {
	/**
	 *
	 * @param {(string|number)} org_id
	 *
	 * @constructor
	 * @constructs AdminOrganizationOverviewPage
	 *
	 * @property {OneOrganization} organization
	 */
	function AdminOrganizationOverviewPage(org_id) {
		AdminOrganizationPage.call(this, org_id);
		this.graphics_stats = new OrganizationsStatistics(this.id);
		this.other_stats = new OrganizationsStatistics(this.id);
		
		this.organization_fields = new Fields(
			'description',
			'img_medium_url',
			'default_address',
			'staff',
			'privileges', {
				events: {
					length: 3,
					filters: 'future=true,is_canceled=false,is_delayed=true',
					fields: new Fields('organization_short_name',	'public_at'),
					order_by: 'nearest_event_date'
				}
			}
		);
	}
	/**
	 *
	 * @param {(string|number)} org_id
	 * @param {string} title
	 * @param staff
	 * @param {OneUser.ROLE} user_role
	 * @return {jQuery}
	 */
	AdminOrganizationOverviewPage.buildStaffBlock = function(org_id, title, staff, user_role) {
		if (staff.length) {
			return tmpl('orgstat-overview-sidebar-wrapper-title', {title: title}).add(__APP.BUILD.staffAvatarBlocks(org_id, staff, {
				is_link: true,
				entity: __C.ENTITIES.USER,
				avatar_classes: [__C.CLASSES.SIZES.X40, __C.CLASSES.UNIVERSAL_STATES.ROUNDED]
			}, user_role === OneUser.ROLE.ADMIN));
		}
		return $();
	};
	
	AdminOrganizationOverviewPage.prototype.buildAreaCharts = function() {
		var self = this;
		AdminPage.prototype.buildAreaCharts.call(self, {
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
	
	AdminOrganizationOverviewPage.prototype.buildPieChart = function($container, data) {
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
						inside: false,
						distance: -35,
						overflow: 'none',
						crop: false,
						defer: false,
						formatter: function() {
							return this.percentage > 15 ? Math.round(this.percentage) + '%' : null;
						},
						useHTML: true,
						style: {
							'color': '#fff',
							'fontSize': '16px',
							'fontWeight': '300',
							'textShadow': 'none',
							'textOutline': 'none',
							'textOverflow': 'none'
						},
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
				symbolPadding: 15,
				symbolHeight: 0,
				symbolWidth: 0,
				itemMarginBottom: 5,
				labelFormatter: function() {
					return '<span style="color: ' + this.color + '">' + this.name + '</span>'
				},
				useHTML: true,
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
		
		$container.highcharts($.extend(true, {}, AdminPage.HIGHCHART_DEFAULT_OPTIONS, pie_chart_options, {series: pieChartSeriesNormalize(data)}));
	};
	
	AdminOrganizationOverviewPage.prototype.render = function() {
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
			storage_data_name = 'org_stats_' + this.id + '_data',
			storage_until_name = 'org_stats_' + this.id + '_until',
			is_cached_data_actual = moment.unix(sessionStorage.getItem(storage_until_name)).isAfter(moment());
		
		
		if (!checkRedirect('overview', '/admin/organization/'+this.organization.id+'/overview', true)) {
			return null;
		}
		
		this.renderHeaderTabs();
		__APP.changeTitle([{
			title: 'Организации',
			page: '/admin'
		}, this.organization.short_name]);
		
		function extendStaffProps(staff) {
			return $.extend({}, staff, {
				is_link: true,
				avatar_classes: ['-size_40x40', '-rounded']
			});
		}
		
		
		this.$wrapper.html(tmpl('orgstat-overview', $.extend(true, {}, this.organization, {
			avatar_block: __APP.BUILD.avatarBlocks(this.organization, {
				entity: __C.ENTITIES.ORGANIZATION,
				block_classes: ['-stack']
			}),
			staff_block: AdminOrganizationOverviewPage.buildStaffBlock(this.organization.id, 'Администраторы', this.organization.admins.map(extendStaffProps), this.organization.role)
			                                          .add(AdminOrganizationOverviewPage.buildStaffBlock(this.organization.id, 'Модераторы', this.organization.moderators.map(extendStaffProps), this.organization.role)),
			event_blocks: this.organization.events.length ? tmpl('orgstat-overview-sidebar-wrapper', {
				content: tmpl('orgstat-overview-sidebar-wrapper-title', {title: 'Предстоящие события'})
					.add(tmpl('orgstat-event-block', this.organization.events.map(function(event) {
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
					})))
			}) : ''
		})));
		
		if (is_cached_data_actual) {
			this.graphics_stats.setData(JSON.parse(sessionStorage.getItem(storage_data_name)));
			this.buildAreaCharts();
		} else {
			this.$wrapper.find('.OrgStatAreaCharts').children('.AreaChart').append(tmpl('loader'));
			this.graphics_stats.fetchStatistics(Statistics.SCALES.DAY, moment(__APP.EVENDATE_BEGIN, 'DD-MM-YYYY').format(), ['view', 'subscribe', 'unsubscribe', 'conversion'], null, function() {
				sessionStorage.setItem(storage_data_name, JSON.stringify(PAGE.graphics_stats));
				sessionStorage.setItem(storage_until_name, moment().add(15, 'm').unix());
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
	
	return AdminOrganizationOverviewPage;
}()));