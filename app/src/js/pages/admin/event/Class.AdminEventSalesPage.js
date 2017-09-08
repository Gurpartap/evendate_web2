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
	
	AdminEventSalesPage.prototype.render = function() {
		var first_event_date_split = moment(this.event.first_event_date).calendar().split(' '),
			formatted_dates = formatDates(this.event.dates);
		
		this.$wrapper.html(tmpl('admin-event-sales-page', {
			title: this.event.title,
			first_event_date_day: first_event_date_split[0],
			first_event_date_month: first_event_date_split[1].capitalize(),
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
			})),
			withdraw_funds_button: __APP.BUILD.button({
				title: 'Вывести средства',
				classes: [
					__C.CLASSES.COLORS.NEUTRAL_ACCENT,
					__C.CLASSES.HOOKS.RIPPLE
				]
			})
		}));
	};
	
	return AdminEventSalesPage;
}()));