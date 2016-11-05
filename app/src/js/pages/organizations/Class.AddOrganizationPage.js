/**
 * @requires Class.EditOrganizationPage.js
 */
/**
 *
 * @constructor
 * @augments EditOrganizationPage
 */
function AddOrganizationPage() {
	EditOrganizationPage.apply(this);
	this.page_title = 'Новая организация';
}
AddOrganizationPage.extend(EditOrganizationPage);