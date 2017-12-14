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
		
		Object.defineProperty(this, 'uuid', {
			get() {
				
				return CryptoJS.MD5([
					this.user_id,
					this.organization_id,
					this.type_code,
					this.entity,
					this.created_at
				].join('-')).toString();
			}
		});
	}
	
	return OneOrganizationActivity;
}()));