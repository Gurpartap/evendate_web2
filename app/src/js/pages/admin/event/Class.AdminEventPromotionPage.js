/**
 * @requires Class.AdminEventPage.js
 */
/**
 *
 * @class AdminEventPromotionPage
 * @extends AdminEventPage
 */
AdminEventPromotionPage = extending(AdminEventPage, (function() {
	/**
	 *
	 * @constructor
	 * @constructs AdminEventPromotionPage
	 * @param {(string|number)} event_id
	 */
	function AdminEventPromotionPage(event_id) {
		AdminEventPage.apply(this, arguments);
	}
	
	AdminEventPromotionPage.prototype.render = function() {};
	
	return AdminEventPromotionPage;
}()));