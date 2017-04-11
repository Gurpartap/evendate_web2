/**
 * @requires Class.AbstractEditEventPage.js
 */
/**
 *
 * @class AddEventPage
 * @extends AbstractEditEventPage
 */
AddEventPage = extending(AbstractEditEventPage, (function() {
	/**
	 *
	 * @param {(string|number)} [org_id]
	 * @constructor
	 * @constructs AddEventPage
	 */
	function AddEventPage(org_id) {
		AbstractEditEventPage.call(this);
		this.page_title = 'Добавить событие';
		this.organization_id = org_id;
	}
	
	return AddEventPage;
}()));