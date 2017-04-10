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
	 * @constructor
	 * @constructs AdminEventPage
	 * @param {(string|number)} event_id
	 */
	function AdminEventPage(event_id) {
		AdminPage.call(this);
		this.id = event_id;
		this.event = new OneEvent(this.id);
		
		this.with_header_tabs = true;
	}
	
	AdminEventPage.prototype.renderHeaderTabs = function(){
		__APP.renderHeaderTabs([
			{title: 'Обзор', page: '/admin/event/'+this.id+'/overview'},
			{title: 'Редактирование', page: '/admin/event/'+this.id+'/edit'}
		]);
	};
	
	return AdminEventPage;
}()));