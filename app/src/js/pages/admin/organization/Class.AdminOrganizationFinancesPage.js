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
	 */
	function AdminOrganizationFinancesPage(org_id) {
		AdminOrganizationPage.call(this, org_id);
		
		this.organization_fields.add();
		
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
	
	AdminOrganizationFinancesPage.prototype.init = function() {
		this.render_vars.withdraw_funds_button.on('click.ShowAddTransactionModal', function() {
		
		});
	};
	
	AdminOrganizationFinancesPage.prototype.preRender = function() {
		this.render_vars.withdraw_funds_button = __APP.BUILD.button({
			title: 'Вывести средства',
			classes: [
				__C.CLASSES.HOOKS.RIPPLE,
				__C.CLASSES.COLORS.NEUTRAL_ACCENT
			]
		});
		this.render_vars.transactions_loader = __APP.BUILD.floatingLoader();
		this.render_vars.orders_loader = __APP.BUILD.loaderBlock();
		this.render_vars.events_loader = __APP.BUILD.floatingLoader();
	};
	
	AdminOrganizationFinancesPage.prototype.render = function() {
		var self = this,
			data_tables_opts = {
				paging: true,
				dom: 't<"data_tables_pagination"p>',
				language: {
					url: __LOCALE.DATATABLES_URL
				}
			};
		
		this.$wrapper.html(tmpl('admin-organization-finances-page', this.render_vars));
		
		this.transactionsTable = this.$wrapper.find('.TransactionStoryTable').eq(0).DataTable(data_tables_opts);
		
		this.eventsTable = this.$wrapper.find('.EventsFinancesTable').eq(0).DataTable(data_tables_opts);
		
		this.organization.events.fetchOrganizationsFeed(this.organization.id, new Fields(), ServerConnection.MAX_ENTITIES_LENGTH).done(function(events) {
			self.eventsTable.rows.add(tmpl('admin-organization-finances-event-row', self.organization.events.map(function(event) {
				
				return {
					title: __APP.BUILD.link({
						title: event.title,
						page: '/admin/event/{event_id}'.format({event_id: event.id})
					}),
					sum: '',
					total_sum: ''
				}
			}))).draw();
			
			self.render_vars.events_loader.remove();
		});
	};
	
	return AdminOrganizationFinancesPage;
}()));