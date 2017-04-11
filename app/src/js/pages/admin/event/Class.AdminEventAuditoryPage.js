/**
 * @requires Class.AdminEventPage.js
 */
/**
 *
 * @class AdminEventAuditoryPage
 * @extends AdminEventPage
 */
AdminEventAuditoryPage = extending(AdminEventPage, (function() {
	/**
	 *
	 * @constructor
	 * @constructs AdminEventAuditoryPage
	 * @param {(string|number)} event_id
	 */
	function AdminEventAuditoryPage(event_id) {
		AdminEventPage.apply(this, arguments);
	}
	
	AdminEventAuditoryPage.prototype.render = function() {};
	
	return AdminEventAuditoryPage;
}()));