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
	 * @property {OneEventWithFinances} event
	 * @property {Fields} event_fields
	 * @property {DataTable.Api} promocodesTable
	 * @property {boolean} has_promocodes
	 */
	function AdminEventSalesPage(event_id) {
		AdminEventPage.call(this, event_id);
		
		this.event = new OneEventWithFinances(event_id);
		
		this.event_fields.add(
			'sum_amount',
			'sold_count',
			'checked_out_count',
			'total_income',
			'withdraw_available',
			'processing_commission_value',
			'processing_commission',
			'evendate_commission_value',
			'ticket_dynamics',
			'income_dynamics',
			'dates',
			'orders_count',
			'tickets_count',
			'sold_tickets_count',
			'registration_till',
			'registration_approvement_required',
			'created_at', {
				ticket_types: {
					fields: new Fields(
						'sold_count',
						'price',
						'sell_start_date',
						'sell_end_date',
						'amount'
					)
				},
				promocodes: {
					fields: new Fields(
						'use_limit',
						'use_count',
						'total_effort'
					)
				}
			}
		);
		
		this.promocodesTable = null;
		
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
			},
			has_promocodes: {
				get: function() {
					
					return this.event.promocodes.length !== 0;
				}
			}
		});
	}
	
	AdminEventSalesPage.prototype.initPromocodesTable = function() {
		this.promocodesTable = this.$wrapper.find('.PromocodesTable').DataTable({
			paging: false,
			columns: [
				{data: 'code'},
				{
					data: function(promocode, type, val, meta) {
						switch (type) {
							case 'display': {
								
								return formatCurrency(promocode.effort, ' ', '.', '', promocode.is_fixed ? '₽' : '%');
							}
						}
						
						return promocode.effort;
					},
					orderable: false
				},
				{
					data: function(promocode, type, val, meta) {
						switch (type) {
							case 'sort': {
								
								return promocode.start_date;
							}
						}
						
						return displayDateRange(promocode.start_date, promocode.end_date);
					}
				},
				{
					data: function(promocode, type, val, meta) {
						switch (type) {
							case 'display': {
								
								return promocode.use_count + (promocode.use_limit && promocode.use_limit !== 100000 ? ' / ' + promocode.use_limit : '');
							}
						}
						
						return promocode.use_count;
					}
				},
				{
					data: function(promocode, type, val, meta) {
						switch (type) {
							case 'display': {
								
								return formatCurrency(promocode.total_effort, ' ', '.', '', '₽');
							}
						}
						
						return promocode.total_effort;
					}
				}
			],
			dom: 't',
			language: {
				url: __LOCALE.DATATABLES_URL
			},
			footerCallback: function ( row, promocodes, start, end, display ) {
				var total_sum = promocodes.reduce(function(sum, promocode) {
					
					return sum + promocode.total_effort;
				}, 0);
				
				$( this.api().table().footer() ).find('.EffortTotalSum').html(formatCurrency(total_sum, ' ', '.', '', '₽'));
			}
		});
	};
	
	AdminEventSalesPage.prototype.render = function() {
		var self = this,
			first_event_date_split = moment.unix(this.event.first_event_date).calendar(null, {
				sameDay: __C.MOMENTJS_CALENDAR.DATE_AND_MONTH,
				nextDay: __C.MOMENTJS_CALENDAR.DATE_AND_MONTH,
				nextWeek: __C.MOMENTJS_CALENDAR.DATE_AND_MONTH,
				lastDay: __C.MOMENTJS_CALENDAR.DATE_AND_MONTH,
				lastWeek: __C.MOMENTJS_CALENDAR.DATE_AND_MONTH,
				sameElse: __C.MOMENTJS_CALENDAR.DATE_AND_MONTH
			}).split(' '),
			formatted_dates = formatDates(this.event.dates),
			dynamics_filters = {
				scale: AbstractStatisticsCollection.SCALES.DAY,
				since: moment.unix(this.event.created_at).format(__C.DATE_FORMAT),
				till: moment().format(__C.DATE_FORMAT)
			},
			dynamics_fields = new Fields({
				ticket_dynamics: dynamics_filters
			}),
			additional_chart_options = {
				legend: {
					enabled: false
				}
			},
			$charts = $();
		
		if (this.event.ticketing_locally) {
			$charts = tmpl('admin-event-sales-chart', {
				classes: 'TicketsSellingChart'
			});
			dynamics_fields.push({
				income_dynamics: dynamics_filters
			});
		}
		
		$charts = $charts.add(tmpl('admin-event-sales-chart', {
			classes: 'RegisteredChart'
		}));
		
		$charts.html(__APP.BUILD.loaderBlock());
		
		this.$wrapper.html(tmpl('admin-event-sales-page', {
			title: this.event.title,
			sold_count: this.event.sold_count,
			sum_amount: this.event.sum_amount,
			orders_count: this.event.orders_count,
			checked_out_count: this.event.checked_out_count,
			total_income: formatCurrency(this.event.total_income, ' ', '.', '', '₽'),
			withdraw_available: formatCurrency(this.event.withdraw_available, ' ', '.', '', '₽'),
			processing_commission_value: formatCurrency(this.event.processing_commission_value, ' ', '.', '', '₽'),
			processing_commission: this.event.processing_commission || 4,
			evendate_commission_value: formatCurrency(this.event.evendate_commission_value, ' ', '.', '', '₽'),
			first_event_date_day: first_event_date_split[0],
			first_event_date_month: first_event_date_split[1].capitalize(),
			charts: $charts,
			promocodes: this.has_promocodes ? tmpl('admin-event-sales-promocodes') : '',
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
					stamp: ticket_type.sold_count >= ticket_type.amount ? __APP.BUILD.stamp('Распродано') : null,
					progress_bar: new ProgressBar(ticket_type.amount, ticket_type.sold_count, {
						classes: [
							AbstractProgressBar.MODIFICATORS.WITH_LABEL,
							AbstractProgressBar.MODIFICATORS.SIZE.TALL,
							__C.CLASSES.UNIVERSAL_STATES.SLIGHTLY_ROUNDED
						]
					})
				};
			})),
			withdraw_funds_button: __APP.BUILD.linkButton({
				title: 'Финансы организации',
				page: '/admin/organization/{org_id}/finances'.format({org_id: this.event.organization_id}),
				classes: [
					__C.CLASSES.COLORS.NEUTRAL_ACCENT
				]
			})
		}));
		
		if (this.has_promocodes) {
			this.initPromocodesTable();
			this.promocodesTable.rows.add(this.event.promocodes).column(-1).order('desc').draw();
		}
		
		this.event.fetchEvent(dynamics_fields, function() {
			AdminPage.buildStockChart($charts.filter('.TicketsSellingChart'), 'Выручка', [{
				name: 'Выручка',
				data: AdminPage.areaChartSeriesNormalize(self.event.income_dynamics)
			}], additional_chart_options);
			AdminPage.buildStockChart($charts.filter('.RegisteredChart'), 'Динамика заказов', [{
				name: 'Количество заказов',
				data: AdminPage.areaChartSeriesNormalize(self.event.ticket_dynamics)
			}], additional_chart_options);
		});
	};
	
	return AdminEventSalesPage;
}()));