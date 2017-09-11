/**
 * @requires Class.AdminOrganizationPage.js
 */
/**
 *
 * @class AdminOrganizationFinancesPage
 * @extends AdminOrganizationPage
 */
AdminOrganizationFinancesPage = extending(AdminOrganizationPage, (function() {
	/**
	 *
	 * @param {(string|number)} org_id
	 *
	 * @constructor
	 * @constructs AdminOrganizationFinancesPage
	 *
	 * @property {(number|string)} id
	 * @property {Fields} organization_fields
	 * @property {OneOrganization} organization
	 * @property {?DataTable.Api} transactionsTable
	 * @property {?DataTable.Api} eventsTable
	 */
	function AdminOrganizationFinancesPage(org_id) {
		AdminOrganizationPage.call(this, org_id);
		
		this.organization_fields.add(
			'created_at', {
				finance: {
					fields: new Fields(
						'total_income',
						'withdraw_available',
						'processing_commission',
						'processing_commission_value',
						'evendate_commission_value'
					)
				}
			}
		);
		
		this.transactionsTable = null;
		this.eventsTable = null;
		
		this.render_vars = {
			withdraw_funds_button: null,
			transactions_loader: null,
			orders_loader: null,
			events_loader: null
		};
		
		Object.defineProperty(this, 'page_title_obj', {
			get: function() {
				
				return [{
					title: 'Организации',
					page: '/admin'
				}, this.organization.short_name + ' - финансы'];
			}
		});
	}
	
	/**
	 *
	 * @param {(WithdrawModelsCollection|Array<WithdrawModel>|WithdrawModel)} withdraws
	 *
	 * @return {jQuery}
	 */
	AdminOrganizationFinancesPage.transactionRowBuilder = function(withdraws) {
	
		return tmpl('admin-organization-finances-transaction-row', (withdraws instanceof Array ? withdraws : [withdraws]).map(function(withdraw) {
			
			return {
				date_timestamp: withdraw.created_at,
				date: moment.unix(withdraw.created_at).format(__LOCALE.DATE.DATE_FORMAT),
				staff_block: __APP.BUILD.avatarBlocks(withdraw.user, {
					entity: __C.ENTITIES.USER,
					avatar_classes: [__C.CLASSES.SIZES.X30, __C.CLASSES.UNIVERSAL_STATES.ROUNDED]
				}),
				sum: formatCurrency(withdraw.sum, ' ', '.', '', '₽'),
				status: withdraw.status_description,
				comment: withdraw.comment
			};
		}));
	};
	/**
	 *
	 * @param {(WithdrawModelsCollection|Array<WithdrawModel>|WithdrawModel)} withdraws
	 *
	 * @return {DataTable.Api}
	 */
	AdminOrganizationFinancesPage.prototype.appendWithdraw = function(withdraws) {
		
		return this.transactionsTable.rows.add(AdminOrganizationFinancesPage.transactionRowBuilder(withdraws)).draw();
	};
	
	AdminOrganizationFinancesPage.prototype.init = function() {
		var self = this;
		
		this.render_vars.withdraw_funds_button.on('click.ShowAddTransactionModal', function() {
			(new WithdrawModal(self.organization)).show();
		});
	};
	
	AdminOrganizationFinancesPage.prototype.preRender = function() {
		this.render_vars.total_income = formatCurrency(this.organization.finance.total_income, ' ', '.', '', '₽');
		this.render_vars.withdraw_available = formatCurrency(this.organization.finance.withdraw_available, ' ', '.', '', '₽');
		this.render_vars.processing_commission_value = formatCurrency(this.organization.finance.processing_commission_value, ' ', '.', '', '₽');
		this.render_vars.evendate_commission_value = formatCurrency(this.organization.finance.evendate_commission_value, ' ', '.', '', '₽');
		this.render_vars.processing_commission = this.organization.finance.processing_commission || 4;
		this.render_vars.withdraw_funds_button = __APP.BUILD.button({
			title: 'Вывести средства',
			classes: [
				__C.CLASSES.HOOKS.RIPPLE,
				__C.CLASSES.COLORS.NEUTRAL_ACCENT
			]
		});
		this.render_vars.transactions_loader = __APP.BUILD.floatingLoader();
		this.render_vars.charts = tmpl('admin-organization-finances-chart', [{
			classes: 'TicketsSellingChart'
		}, {
			classes: 'OrdersChart'
		}]);
		this.render_vars.events_loader = __APP.BUILD.floatingLoader();
	};
	
	AdminOrganizationFinancesPage.prototype.render = function() {
		var self = this,
			events_fields = new Fields({
				finance: {
					fields: new Fields(
						'total_income',
						'withdraw_available'
					)
				}
			}),
			withdraw_fields = new Fields(
				'user',
				'created_at'
			),
			dynamics_filters = {
				scale: AbstractStatisticsCollection.SCALES.DAY,
				since: moment.unix(this.organization.created_at).format(__C.DATE_FORMAT),
				till: moment().format(__C.DATE_FORMAT)
			},
			data_tables_opts = {
				paging: true,
				dom: 't<"data_tables_pagination"p>',
				language: {
					url: __LOCALE.DATATABLES_URL
				}
			},
			additional_chart_options = {
				legend: {
					enabled: false
				}
			},
			$chars;
		
		this.$wrapper.html(tmpl('admin-organization-finances-page', this.render_vars));
		
		$chars = this.$wrapper.find('.AreaChart');
		$chars.append(__APP.BUILD.loaderBlock());
		
		this.transactionsTable = this.$wrapper.find('.TransactionStoryTable').eq(0).DataTable(data_tables_opts);
		
		this.eventsTable = this.$wrapper.find('.EventsFinancesTable').eq(0).DataTable(data_tables_opts);
		
		this.organization.finance.withdraws.fetch(withdraw_fields).done(function() {
			self.appendWithdraw(self.organization.finance.withdraws);
			
			self.render_vars.transactions_loader.remove();
		});
		
		this.organization.finance.income_dynamics.fetch(dynamics_filters.scale, dynamics_filters.since, dynamics_filters.till).done(function() {
			AdminPage.buildStockChart($chars.filter('.TicketsSellingChart'), 'Выручка', [{
				name: 'Выручка',
				data: AdminPage.areaChartSeriesNormalize(self.organization.finance.income_dynamics)
			}], additional_chart_options);
		});
		
		this.organization.finance.ticket_dynamics.fetch(dynamics_filters.scale, dynamics_filters.since, dynamics_filters.till).done(function() {
			AdminPage.buildStockChart($chars.filter('.OrdersChart'), 'Динамика продаж', [{
				name: 'Количество заказов',
				data: AdminPage.areaChartSeriesNormalize(self.organization.finance.ticket_dynamics)
			}], additional_chart_options);
		});
		
		this.organization.events.fetchOrganizationsFeed(this.organization.id, events_fields, ServerConnection.MAX_ENTITIES_LENGTH).done(function() {
			self.eventsTable.rows.add(tmpl('admin-organization-finances-event-row', self.organization.events.map(function(event) {
				
				return {
					title: __APP.BUILD.link({
						title: event.title,
						page: '/admin/event/{event_id}/sales'.format({event_id: event.id})
					}),
					sum: formatCurrency(event.finance.total_income, ' ', '.', '', '₽'),
					total_sum: formatCurrency(event.finance.withdraw_available, ' ', '.', '', '₽')
				}
			}))).draw();
			
			self.render_vars.events_loader.remove();
		});
		
		this.init();
	};
	
	return AdminOrganizationFinancesPage;
}()));