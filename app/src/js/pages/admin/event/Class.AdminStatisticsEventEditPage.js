/**
 * @requires Class.AdminEventPage.js
 */
/**
 *
 * @class AdminStatisticsEventEditPage
 * @extends AdminEventPage
 */
AdminStatisticsEventEditPage = extending(AdminEventPage, (function() {
	/**
	 *
	 * @constructor
	 * @constructs AdminStatisticsEventEditPage
	 * @param {(string|number)} event_id
	 */
	function AdminStatisticsEventEditPage(event_id) {
		AdminEventPage.apply(this, arguments);
	}
	
	AdminStatisticsEventEditPage.prototype.render = function() {};
	
	return AdminStatisticsEventEditPage;
}()));