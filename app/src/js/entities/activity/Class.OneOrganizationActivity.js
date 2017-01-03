/**
 * @requires Class.OneAbstractActivity.js
 */
/**
 * @class OneOrganizationActivity
 * @extends OneAbstractActivity
 */
OneOrganizationActivity = extending(OneAbstractActivity, (function() {
	/**
	 *
	 * @constructs OneOrganizationActivity
	 */
	function OneOrganizationActivity() {
		OneAbstractActivity.call(this);
		this.organization_id = 0;
		this.organization = new OneOrganization(this.organization_id);
	}
	
	return OneOrganizationActivity;
}()));