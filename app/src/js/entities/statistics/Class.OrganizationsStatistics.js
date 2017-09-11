/**
 * @requires Class.Statistics.js
 */
/**
 *
 * @deprecated
 * @class OrganizationsStatistics
 * @extends Statistics
 */
OrganizationsStatistics = extending(Statistics, (function() {
	/**
	 *
	 * @param {(string|number)} organization_id
	 * @constructor
	 * @constructs OrganizationsStatistics
	 *
	 * @property {Array<StatisticsUnit>} subscribe
	 * @property {Array<StatisticsUnit>} unsubscribe
	 * @property {Array<StatisticsConversionUnit>} conversion
	 * @property {StatisticsAudience} audience
	 * @property {Object} dynamics
	 * @property  {Array<StatisticsUnit>} dynamics.subscribe
	 * @property  {Array<StatisticsConversionUnit>} dynamics.conversion
	 */
	function OrganizationsStatistics(organization_id) {
		Statistics.apply(this);
		
		this.id = organization_id;
		this.entity = Statistics.ENTITIES.ORGANIZATION;
		
		this.subscribe = [];
		this.unsubscribe = [];
		this.conversion = [];
		this.audience = {};
		
		this.dynamics.subscribe = [];
		this.dynamics.conversion = [];
	}
	
	return OrganizationsStatistics;
}()));