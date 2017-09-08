/**
 * @requires Class.AdminEventPage.js
 */
/**
 *
 * @class AdminEventSalesPage
 * @extends AdminEventPage
 */
AdminEventSalesPage = extending(AdminEventPage, (function() {
	/**
	 *
	 * @param {(string|number)} event_id
	 *
	 * @constructor
	 * @constructs AdminEventSalesPage
	 *
	 * @property {(string|number)} id
	 * @property {OneEvent} event
	 * @property {Fields} event_fields
	 */
	function AdminEventSalesPage(event_id) {
		AdminEventPage.call(this, event_id);
		
		this.event_fields.add(
			'dates',
			'orders_count',
			'tickets_count',
			'sold_tickets_count',
			'registration_till',
			'registration_approvement_required',
			'created_at', {
				ticket_types: {
					fields: new Fields(
						'price',
						'sell_start_date',
						'sell_end_date',
						'amount'
					)
				}
			}
		);
		
		Object.defineProperties(this, {
			page_title_obj: {
				get: function() {
					
					return [{
						title: 'Организации',
						page: '/admin'
					}, {
						title: this.event.organization_short_name,
						page: '/admin/organization/' + this.event.organization_id
					}, this.event.title + ' - продажи'];
				}
			}
		});
	}
	/**
	 *
	 * @param {jQuery} $wrapper
	 * @param {string} title
	 * @param {object} data
	 * @param {object} [additional_options]
	 */
	AdminEventSalesPage.prototype.buildCharts = function($wrapper, title, data, additional_options) {
		var area_chart_options = $.extend(true, {}, this.highchart_defaults, {
				chart: {
					type: 'areaspline',
					plotBackgroundColor: '#fcfcfc',
					plotBorderColor: '#ebebeb',
					plotBorderWidth: 1
				},
				colors: [__C.COLORS.FRANKLIN, __C.COLORS.MUTED_80, __C.COLORS.ACCENT, __C.COLORS.MUTED, __C.COLORS.MUTED_50, __C.COLORS.MUTED_30],
				title: {
					align: 'left',
					margin: 20
				},
				legend: {
					enabled: true,
					align: 'left',
					itemStyle: {color: __C.COLORS.TEXT, cursor: 'pointer', fontSize: '14px', fontWeight: '500', y: 0},
					itemMarginTop: 24,
					itemMarginBottom: 5,
					symbolHeight: 18,
					symbolWidth: 18,
					symbolRadius: 9,
					itemDistance: 42,
					x: 30
				},
				plotOptions: {
					series: {
						states: {
							hover: {
								lineWidth: 2
							}
						}
					},
					areaspline: {
						fillOpacity: 0.5,
						marker: {
							enabled: false,
							symbol: 'circle',
							radius: 2,
							states: {
								hover: {
									enabled: true
								}
							}
						},
						dataGrouping: {
							dateTimeLabelFormats: {
								millisecond: ['%b %e, %H:%M:%S.%L', '%b %e, %H:%M:%S.%L', '-%H:%M:%S.%L'],
								second: ['%b %e, %H:%M:%S', '%b %e, %H:%M:%S', '-%H:%M:%S'],
								minute: ['%b %e, %H:%M', '%b %e, %H:%M', '-%H:%M'],
								hour: ['%b %e, %H:%M', '%b %e, %H:%M', '-%H:%M'],
								day: ['%b %e, %Y', '%b %e', '-%b %e, %Y'],
								week: ['%b %e, %Y', '%b %e', '-%b %e, %Y'],
								month: ['%B %Y', '%B', '-%B %Y'],
								year: ['%Y', '%Y', '-%Y']
							}
						}
					}
				},
				tooltip: {
					headerFormat: '<b>{point.key}</b><br/>',
					positioner: function(labelWidth, labelHeight) {
						return {
							x: this.chart.plotLeft,
							y: this.chart.plotTop
						};
					},
					shadow: false,
					shape: 'square',
					valueDecimals: 0,
					xDateFormat: '%e %b %Y',
					shared: true
				},
				scrollbar: {enabled: false},
				navigator: {
					outlineColor: '#ebebeb',
					outlineWidth: 1,
					maskInside: false,
					maskFill: 'rgba(245, 245, 245, 0.66)',
					handles: {
						backgroundColor: '#9fa7b6',
						borderColor: '#fff'
					},
					xAxis: {
						gridLineWidth: 0,
						labels: {
							align: 'left',
							reserveSpace: true,
							style: {
								color: '#888'
							},
							x: 0,
							y: null
						}
					}
				},
				rangeSelector: {
					buttonTheme: {
						width: null,
						height: 22,
						fill: 'none',
						stroke: 'none',
						r: 14,
						style: {
							color: __C.COLORS.MUTED_80,
							fontSize: '13px',
							fontWeight: '400',
							textTransform: 'uppercase',
							dominantBaseline: 'middle'
						},
						states: {
							hover: {
								fill: __C.COLORS.MUTED_50,
								style: {
									color: '#fff'
								}
							},
							select: {
								fill: __C.COLORS.MUTED_80,
								style: {
									color: '#fff',
									fontWeight: '400'
								}
							}
						}
					},
					buttons: [{
						type: 'day',
						count: 7,
						text: "\xa0\xa0\xa0Неделя\xa0\xa0\xa0"
					}, {
						type: 'month',
						count: 1,
						text: "\xa0\xa0\xa0Месяц\xa0\xa0\xa0"
					}, {
						type: 'year',
						count: 1,
						text: "\xa0\xa0\xa0Год\xa0\xa0\xa0"
					}, {
						type: 'all',
						text: "\xa0\xa0\xa0Все\xa0время\xa0\xa0\xa0"
					}],
					allButtonsEnabled: true,
					selected: 2,
					labelStyle: {
						display: 'none'
					},
					inputEnabled: false
				},
				xAxis: {
					gridLineWidth: 1,
					gridLineDashStyle: 'dash',
					type: 'datetime',
					showEmpty: false,
					tickPosition: 'inside',
					dateTimeLabelFormats: {
						minute: '%H:%M',
						hour: '%H:%M',
						day: '%e %b',
						week: '%e %b',
						month: '%b %y',
						year: '%Y'
					}
				},
				yAxis: {
					allowDecimals: false,
					floor: 0,
					min: 0,
					gridLineDashStyle: 'dash',
					opposite: false,
					title: {
						text: false
					}
				}
			}, additional_options),
			field_data = {
				title: {text: title}
			};
		
		field_data.series = data;
		
		$wrapper.highcharts('StockChart', $.extend(true, {}, area_chart_options, field_data));
	};
	
	AdminEventSalesPage.prototype.render = function() {
		var first_event_date_split = moment(this.event.first_event_date).calendar().split(' '),
			formatted_dates = formatDates(this.event.dates),
			$charts;
		
		if (this.event.ticketing_locally) {
			$charts = tmpl('admin-event-sales-chart', {
				classes: 'TicketsSellingChart'
			});
		}
		
		$charts = $charts.add(tmpl('admin-event-sales-chart', {
			classes: 'RegisteredChart'
		}));
		
		$charts.html(__APP.BUILD.loaderBlock());
		
		this.buildCharts($charts.filter('.TicketsSellingChart'), 'Выручка', {});
		this.buildCharts($charts.filter('.RegisteredChart'), 'Динамика заказов', {});
		
		this.$wrapper.html(tmpl('admin-event-sales-page', {
			title: this.event.title,
			first_event_date_day: first_event_date_split[0],
			first_event_date_month: first_event_date_split[1].capitalize(),
			charts: $charts,
			formatted_dates: formatted_dates.map(function(date_and_time_obj) {
			
				return date_and_time_obj.date + ' ' + date_and_time_obj.time;
			}).join(', '),
			registration_dates: displayDateRange(this.event.created_at, this.event.registration_till),
			sales_settings_button: __APP.BUILD.linkButton({
				title: 'Настройки продаж',
				page: '/admin/event/'+ this.event.id +'/edit',
				classes: [
					__C.CLASSES.COLORS.NEUTRAL_ACCENT,
					__C.CLASSES.HOOKS.RIPPLE
				]
			}),
			ticket_types: tmpl('admin-event-sales-ticket-type', this.event.ticket_types.map(function(ticket_type) {
				
				return {
					name: ticket_type.name,
					dates: displayDateRange(ticket_type.sell_start_date, ticket_type.sell_end_date),
					price: ticket_type.formatPrice(),
					stamp: ticket_type.sold >= ticket_type.amount ? __APP.BUILD.stamp('Распродано') : null,
					progress_bar: new ProgressBar(ticket_type.amount, ticket_type.sold, {
						classes: [
							AbstractProgressBar.MODIFICATORS.WITH_LABEL,
							AbstractProgressBar.MODIFICATORS.SIZE.TALL,
							__C.CLASSES.UNIVERSAL_STATES.SLIGHTLY_ROUNDED
						]
					})
				};
			}))
		}));
	};
	
	return AdminEventSalesPage;
}()));