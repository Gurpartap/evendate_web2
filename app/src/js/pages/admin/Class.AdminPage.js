/**
 * @requires ../Class.Page.js
 */
/**
 *
 * @abstract
 * @class AdminPage
 * @extends Page
 */
AdminPage = extending(Page, (function() {
	/**
	 *
	 * @constructor
	 * @constructs AdminPage
	 */
	function AdminPage() {
		Page.apply(this);
		this.state_name = 'admin';
	}
	
	/**
	 *
	 * @const
	 */
	AdminPage.HIGHCHART_DEFAULT_OPTIONS = Object.freeze({
		chart: {
			backgroundColor: null,
			plotBorderWidth: null,
			plotShadow: false,
			style: {
				fontFamily: 'inherit',
				fontSize: 'inherit'
			}
		},
		title: {
			text: false
		},
		credits: {
			enabled: false
		}
	});
	/**
	 *
	 * @const
	 */
	AdminPage.HIGHSTOCK_AREA_OPTIONS = Object.freeze($.extend(true, {}, AdminPage.HIGHCHART_DEFAULT_OPTIONS, {
		chart: {
			type: 'areaspline',
			plotBackgroundColor: '#fcfcfc',
			plotBorderColor: '#ebebeb',
			plotBorderWidth: 1,
			spacingBottom: 25
		},
		colors: [__C.COLORS.FRANKLIN, __C.COLORS.MUTED_80, __C.COLORS.ACCENT, __C.COLORS.MUTED, __C.COLORS.MUTED_50, __C.COLORS.MUTED_30],
		title: {
			align: 'left',
			style: {
				'font-size': '1.25rem',
				'font-weight': 500
			},
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
			outlineWidth: 0,
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
	}));
	/**
	 *
	 * @param {StatisticsCollection} raw_data
	 *
	 * @returns Array<Array>
	 */
	AdminPage.areaChartSeriesNormalize = function(raw_data) {
		
		return raw_data.sortBy('time_value', true).map(function(point) {
			
			return [moment.unix(point.time_value).valueOf(), point.value];
		});
	};
	/**
	 *
	 * @param {jQuery} $wrapper
	 * @param {string} title
	 * @param {object} series
	 * @param {object} [additional_options]
	 */
	AdminPage.buildStockChart = function($wrapper, title, series, additional_options) {
		
		$wrapper.highcharts('StockChart', $.extend(true, {}, AdminPage.HIGHSTOCK_AREA_OPTIONS, {
			title: {
				text: title
			},
			series: series
		}, additional_options));
	};
	/**
	 *
	 * @deprecated
	 * @param {object} raw_data
	 * @returns {object}
	 */
	AdminPage.prototype.areaChartSeriesNormalize = function(raw_data) {
		var CONVERSATIONS = {
				open_conversion: {
					with: 'open_site',
					to: 'view'
				},
				fave_conversion: {
					with: 'fave',
					to: 'open_site'
				},
				conversion: {
					with: 'subscribe',
					to: 'view'
				}
			},
			COMPARISONS = {
				subscribe_unsubscribe: {
					subscribe: 'subscribe',
					unsubscribe: 'unsubscribe'
				}
			},
			STD_NAMES = {
				'notifications_sent': 'Отправлено уведомлений',
				'view': 'Просмотры',
				'view_detail': 'Открытий страницы события из ленты Evendate',
				'conversion': 'Конверсия',
				'subscribe': 'Подписалось',
				'unsubscribe': 'Отписалось',
				'open_site': 'Открытий страницы события',
				'open_conversion': 'Конверсия просмотра события в ленте к открытию страницы события',
				'fave': 'Кол-во пользователей, которые добавили событие в избранное',
				'fave_conversion': 'Конверсия открытия страницы события к добавлениям в избранное'
			},
			HIDDEN_SERIES_OPTIONS = {
				showInLegend: false,
				lineWidth: 0,
				fillOpacity: 0,
				states: {
					hover: {
						enabled: false
					}
				}
			},
			output = {};
		
		function dataNormalize(raw_data, field, value_field_name) {
			return {
				name: STD_NAMES[field],
				data: raw_data.map(function(line, i) {
					return [moment.unix(line.time_value).valueOf(), line[value_field_name]];
				})
			}
		}
		
		
		$.each(raw_data, function(key, data){
			output[key] = [];
			if(CONVERSATIONS.hasOwnProperty(key)){
				output[key].push($.extend(true, { tooltip: {valueSuffix: ' %'} }, dataNormalize(data, key, 'value')));
				$.each(CONVERSATIONS[key], function(field_key, field) {
					output[key].push($.extend(true, {}, HIDDEN_SERIES_OPTIONS, dataNormalize(data, field, field_key)));
				})
			}
			else if(COMPARISONS.hasOwnProperty(key)) {
				$.each(COMPARISONS[key], function(field_key, field) {
					output[key].push(dataNormalize(data, field, field_key));
				})
			}
			else {
				output[key].push(dataNormalize(data, key, 'value'));
			}
		});
		
		return output;
	};
	/**
	 *
	 * @deprecated
	 * @param {object} data
	 * @param {object} [additional_options]
	 */
	AdminPage.prototype.buildAreaCharts = function(data, additional_options) {
		var self = this,
			normalized_series = self.areaChartSeriesNormalize(data),
			FIELDS = {
				notifications_sent: {
					title: 'Отправлено уведомлений пользователям',
					wrapper_class: 'NotificationsSentAreaChart'
				},
				view: {
					title: 'Просмотры',
					wrapper_class: 'ViewAreaChart'
				},
				view_detail: {
					title: 'Открытий страницы события',
					wrapper_class: 'ViewDetailAreaChart'
				},
				open_site: {
					title: 'Открытий страницы события из ленты Evendate',
					wrapper_class: 'OpenSiteAreaChart'
				},
				open_conversion: {
					title: 'Конверсия просмотров/открытий',
					wrapper_class: 'OpenConversionsAreaChart'
				},
				fave: {
					title: 'Добавлений в избранное',
					wrapper_class: 'FaveAreaChart'
				},
				fave_conversion: {
					title: 'Конверсия открытий/добавлений в избранное',
					wrapper_class: 'FaveConversionsAreaChart'
				},
				subscribe_unsubscribe: {
					title: 'Подписчики',
					wrapper_class: 'SubscriberAreaChart'
				},
				conversion: {
					title: 'Конверсия просмотров/подписок',
					wrapper_class: 'ConversionAreaChart'
				}
			},
			FILL_COLORS = [
				['rgba(35, 215, 146, 0.18)', 'rgba(101, 101, 101, 0.6)', 'rgba(101, 101, 101, 0.6)'],
				['rgba(35, 215, 146, 0.09)', 'rgba(101, 101, 101, 0.6)', 'rgba(101, 101, 101, 0.6)']
			],
			area_chart_options = $.extend(true, {}, AdminPage.HIGHCHART_DEFAULT_OPTIONS, {
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
			}, additional_options);
		
		$.each(normalized_series, function(key) {
			var field_data = {
				title: {text: FIELDS[key].title}
			};
			
			field_data.series = normalized_series[key].map(function(series_unit, i) {
				if (series_unit.fillOpacity !== 0) {
					return $.extend(true, {}, series_unit, {
						fillColor: {
							linearGradient: {x1: 0, x2: 0, y1: 0, y2: 1},
							stops: FILL_COLORS.map(function(colors_set, j) {
								return [j, colors_set[i]];
							})
						}
					})
				}
				return series_unit;
			});
			
			if (key == 'conversion' || key == 'open_conversion' || key == 'fave_conversion') {
				field_data.yAxis = {
					max: 100,
					labels: {
						format: '{value}%'
					}
				};
			}
			
			self.$wrapper.find('.' + FIELDS[key].wrapper_class).highcharts('StockChart', $.extend(true, {}, area_chart_options, field_data));
		});
	};
	/**
	 *
	 * @param {jQuery} $scoreboards_wrapper
	 * @param {object} data
	 * @param {object} data.numbers
	 * @param {object} [data.dynamics]
	 * @param {object} [titles]
	 * @param {Array} [order]
	 * @param {string} [size="normal"]
	 */
	AdminPage.prototype.updateScoreboards = function($scoreboards_wrapper, data, titles, order, size) {
		var with_dynamics = !!data.dynamics;
		if (!order)
			order = Object.keys(titles);
		
		order.forEach(function(field) {
			var scoreboard_type = 'Scoreboard' + field.toCamelCase('_'),
				$scoreboard = $scoreboards_wrapper.find('.' + scoreboard_type),
				measure;
			
			switch (field) {
				case 'conversion':
				case 'open_conversion':
				case 'fave_conversion': {
					measure = '%';
					break;
				}
			}
			
			if (!$scoreboard.length) {
				$scoreboard = tmpl(with_dynamics ? 'scoreboard-with-dynamics' : 'scoreboard', {
					type: scoreboard_type,
					title: titles[field],
					size: size ? '-size_' + size : '-size_normal',
					number: 0 + measure,
					dynamic_by_week: 0 + measure
				}, $scoreboards_wrapper)
			}
			
			if (data.numbers[field] !== undefined) {
				$scoreboard.find('.ScoreboardNumber').animateNumber({
					number: Math.round(data.numbers[field]),
					suffix: measure
				}, 2000, 'easeOutSine');
			}
			
			if (with_dynamics) {
				if (data.dynamics[field] !== undefined) {
					$scoreboard
						.find('.ScoreboardDynamic')
						.animateNumber({
							number: Math.round(data.dynamics[field]),
							prefix: data.dynamics[field] == 0 ? undefined : (data.dynamics[field] > 0 ? '+' : '-'),
							suffix: measure
						}, 2000, 'easeOutSine')
						.siblings('label')
						.removeClass('fa-caret-up -text_color_franklin fa-caret-down -text_color_bubblegum')
						.addClass(data.dynamics[field] == 0 ? '' : (data.dynamics[field] > 0 ? 'fa-caret-up -text_color_franklin' : 'fa-caret-down -text_color_bubblegum'));
				}
			}
		});
	};
	
	return AdminPage;
}()));