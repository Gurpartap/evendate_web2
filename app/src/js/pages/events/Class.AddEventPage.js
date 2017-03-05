/**
 * @requires Class.RedactEventPage.js
 */
/**
 *
 * @class AddEventPage
 * @extends RedactEventPage
 */
AddEventPage = extending(RedactEventPage, (function() {
	/**
	 *
	 * @param {(string|number)} [org_id]
	 * @constructor
	 * @constructs AddEventPage
	 */
	function AddEventPage(org_id) {
		RedactEventPage.apply(this);
		this.page_title = 'Добавить событие';
		this.organization_id = org_id;
	}
	
	return AddEventPage;
}()));