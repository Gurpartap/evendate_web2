/**
 * @requires Class.OrganizationStatisticsCollection.js
 */
/**
 *
 * @class OrganizationFinanceStatisticsCollection
 * @extends OrganizationStatisticsCollection
 */
OrganizationFinanceStatisticsCollection = extending(OrganizationStatisticsCollection, (function() {
	/**
	 *
	 * @param {number} org_id
	 * @param {string} field
	 *
	 * @constructor
	 * @constructs OrganizationFinanceStatisticsCollection
	 *
	 * @property {number} org_id
	 * @property {string} field
	 */
	function OrganizationFinanceStatisticsCollection(org_id, field) {
		OrganizationStatisticsCollection.call(this, org_id, field);
	}
	
	/**
	 *
	 * @param {number} org_id
	 * @param {Fields} fields
	 * @param {AJAXCallback} [success]
	 */
	OrganizationFinanceStatisticsCollection.fetchStatistics = function(org_id, fields, success) {
		
		return __APP.SERVER.getData(OrganizationStatisticsCollection.ENDPOINT.FINANCE.format({org_id: org_id}), {
			fields: fields
		}, success);
	};
	
	return OrganizationFinanceStatisticsCollection;
}()));