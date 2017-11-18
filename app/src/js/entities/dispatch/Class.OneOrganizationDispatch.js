/**
 *
 * @class OneOrganizationDispatch
 * @extends OneAbstractDispatch
 */
OneOrganizationDispatch = extending(OneAbstractDispatch, (function() {
	/**
	 *
	 * @param {string} [uuid]
	 * @param {number} [organization_id]
	 *
	 * @constructor
	 * @constructs OneOrganizationDispatch
	 *
	 * @property {?number} organization_id
	 */
	function OneOrganizationDispatch(uuid, organization_id) {
		OneAbstractDispatch.call(this, uuid);
		
		this.organization_id = setDefaultValue(organization_id, null);
	}
	
	OneOrganizationDispatch.prototype.convertToPostObject = function(data) {
		var post_data = OneAbstractDispatch.convertToPostObject(data);
		
		post_data.organization_id = data.organization_id;
		
		return post_data;
	};
	
	return OneOrganizationDispatch;
}()));