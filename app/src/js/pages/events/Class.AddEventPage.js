/**
 * @requires Class.RedactEventPage.js
 */
/**
 *
 * @constructor
 * @augments RedactEventPage
 * @param {(string|number)} [org_id]
 */
function AddEventPage(org_id) {
	RedactEventPage.apply(this);
	this.page_title = 'Добавить событие';
	this.organization_id = org_id;
}
AddEventPage.extend(RedactEventPage);