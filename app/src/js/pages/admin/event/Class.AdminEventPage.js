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
		AdminPage.apply(this, arguments);
		this.id = event_id;
		this.event = new OneEvent(this.id);
	}
	
	return AdminEventPage;
}()));