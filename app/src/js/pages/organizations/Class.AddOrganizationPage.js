/**
 * @requires Class.EditOrganizationPage.js
 */
/**
 *
 * @class AddOrganizationPage
 * @extends EditOrganizationPage
 */
AddOrganizationPage = extending(EditOrganizationPage, (function() {
	/**
	 *
	 * @constructor
	 * @constructs AddOrganizationPage
	 */
	function AddOrganizationPage() {
		EditOrganizationPage.apply(this);
		this.page_title = 'Новая организация';
	}
	
	return AddOrganizationPage;
}()));