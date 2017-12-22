/**
 * @requires Class.AdminEventPage.js
 */
/**
 *
 * @class AdminEventUTMTagsPage
 * @extends AdminEventPage
 */
AdminEventUTMTagsPage = extending(AdminEventPage, (function() {
	/**
	 *
	 * @param {number} event_id
	 *
	 * @constructor
	 * @constructs AdminEventUTMTagsPage
	 *
	 * @property {EventUTMStatsCollection} utm_stats
	 * @property {Promise} utm_stats_promise
	 * @property {DataTable.Api} utmTable
	 */
	function AdminEventUTMTagsPage(event_id) {
		AdminEventPage.call(this, event_id);
		
		this.utm_stats = new EventUTMStatsCollection(event_id);
		this.utm_stats_promise = Promise;
		this.utmTable = null;
		
		Object.defineProperty(this, 'page_title_obj', {
			get: function() {
				
				return [{
					title: 'Организации',
					page: '/admin'
				}, {
					title: this.event.organization_short_name,
					page: '/admin/organization/' + this.event.organization_id
				}, this.event.title + ' - UTM метки'];
			}
		});
	}
	
	AdminEventUTMTagsPage.prototype.preRender = function() {
		this.utm_stats_promise = this.utm_stats.fetch();
	};
	
	AdminEventUTMTagsPage.prototype.initUTMTable = function() {
		this.utmTable = this.$wrapper.find('.UTMTable').DataTable({
			paging: false,
			columns: [
				{data: 'utm_source'},
				{data: 'utm_medium'},
				{data: 'utm_campaign'},
				{data: 'utm_content'},
				{data: 'utm_term'},
				{data: 'open_count'},
                {data: 'tickets_count'},
                {data: 'orders_count'},
				{
					data: function(utm, type, val, meta) {
						switch (type) {
							case 'display': {
								return formatCurrency(utm.orders_sum, ' ', '.', '', '₽');
							}
						}
						
						return utm.orders_sum;
					}
				}
			],
			dom: 't',
			language: {
				url: __LOCALE.DATATABLES_URL
			}
		});
	};
	
	AdminEventUTMTagsPage.prototype.render = function() {
		var self = this;
		
		this.$wrapper.html(tmpl('event-admin-utm-page'));
		
		this.initUTMTable();
		this.utm_stats_promise.then(function() {
			self.utmTable.rows.add(self.utm_stats).order([5, 'desc']).draw();
		});
	};
	
	return AdminEventUTMTagsPage;
}()));