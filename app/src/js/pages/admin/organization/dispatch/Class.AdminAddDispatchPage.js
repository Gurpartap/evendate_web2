/**
 * @requires Class.AdminAbstractDispatchPage.js
 */
/**
 *
 * @class AdminAddDispatchPage
 * @extends AdminAbstractDispatchPage
 */
AdminAddDispatchPage = extending(AdminAbstractDispatchPage, (function() {
	/**
	 *
	 * @param {number} organization_id
	 *
	 * @constructor
	 * @constructs AdminAddDispatchPage
	 */
	function AdminAddDispatchPage(organization_id) {
		AdminAbstractDispatchPage.call(this, organization_id);
		this.page_title = 'Создание рассылки';
	}
	
	AdminAddDispatchPage.prototype.fetchEvents = function() {
		
		return this.events_defer = this.events.fetchOrganizationsEvents(this.organization_id, {
			future: true,
			order_by: 'nearest_event_date'
		}, ServerConnection.MAX_ENTITIES_LENGTH);
	};
	/**
	 *
	 * @param {jQuery} $event_select
	 */
	AdminAddDispatchPage.prototype.initEventSelect = function($event_select) {
		if (!this.events.length) {
			$event_select.prop('disabled', true);
		}
		initSelect2($event_select);
	};
	
	AdminAddDispatchPage.prototype.init = function() {
		AdminAbstractDispatchPage.prototype.init.call(this);
	};
	
	return AdminAddDispatchPage;
}()));