/**
 * @requires Class.AdminEventPage.js
 * @requires ../../events/Class.EditEventPage.js
 */
/**
 *
 * @class AdminEventEditPage
 * @extends EditEventPage
 * @extends AdminEventPage
 */
AdminEventEditPage = extending(EditEventPage, AdminEventPage, (function() {
	/**
	 *
	 * @param {(string|number)} event_id
	 *
	 * @constructor
	 * @constructs AdminEventEditPage
	 */
	function AdminEventEditPage(event_id) {
		var self = this;
		
		EditEventPage.call(this, event_id);
		AdminEventPage.call(this, event_id);
		
		this.event_fields = EventPage.fields.copy().add(AdminEventPage.fields, EditEventPage.fields);
		
		Object.defineProperty(this, 'page_title_obj', {
			get: function() {
				return [{
					title: 'Организации',
					page: '/admin'
				}, {
					title: self.event.organization_short_name,
					page: '/admin/organization/' + self.event.organization_id
				}, self.event.title + ' - редактирование'];
			}
		});
	}
	
	return AdminEventEditPage;
}()));

AdminEventEditPage.prototype.renderHeaderTabs = AdminEventPage.prototype.renderHeaderTabs;
AdminEventEditPage.prototype.init = EditEventPage.prototype.init;