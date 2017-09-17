/**
 * @requires ../Class.AdminPage.js
 */
/**
 *
 * @class AdminEventPage
 * @extends AdminPage
 */
AdminEventPage = extending(AdminPage, (function() {
	/**
	 *
	 * @param {(string|number)} event_id
	 *
	 * @constructor
	 * @constructs AdminEventPage
	 *
	 * @property {(string|number)} id
	 * @property {OneEvent} event
	 * @property {Fields} event_fields
	 */
	function AdminEventPage(event_id) {
		AdminPage.call(this);
		this.id = event_id;
		this.event = new OneEvent(this.id);
		this.event_fields = AdminEventPage.fields.copy();
		
		this.with_header_tabs = true;
	}
	
	AdminEventPage.fields = new Fields(
		'organization_short_name',
		'ticketing_locally',
		'registration_locally',
		'registration_approvement_required'
	);
	
	AdminEventPage.prototype.fetchData = function() {
		
		return this.fetching_data_defer = this.event.fetchEvent(this.event_fields);
	};
	
	AdminEventPage.prototype.renderHeaderTabs = function() {
		var tabs = [];
		
		tabs.push({title: 'Обзор', page: '/admin/event/'+this.id+'/overview'});
		if (this.event.registration_approvement_required) {
			tabs.push({title: 'Заявки', page: '/admin/event/'+this.id+'/requests'});
		}
		if (this.event.registration_locally || this.event.ticketing_locally) {
			tabs.push({title: 'Продажи', page: '/admin/event/'+this.id+'/sales'});
			tabs.push({title: 'Заказы', page: '/admin/event/'+this.id+'/orders'});
			tabs.push({title: 'Контроль входа', page: '/admin/event/'+this.id+'/check_in'});
		}
		tabs.push({title: 'Редактирование', page: '/admin/event/'+this.id+'/edit'});
		
		return tabs;
	};
	
	return AdminEventPage;
}()));