/**
 * @requires Class.Statistics.js
 */
/**
 *
 * @constructor
 * @augments Statistics
 * @param {(string|number)} organization_id
 */
function OrganizationsStatistics(organization_id) {
	Statistics.apply(this);
	this.id = organization_id;
	/**
	 * @type {Array<StatisticsUnit>}
	 */
	this.subscribe = [];
	/**
	 * @type {Array<StatisticsUnit>}
	 */
	this.unsubscribe = [];
	/**
	 * @type {Array<StatisticsConversionUnit>}
	 */
	this.conversion = [];
	/**
	 * @type {StatisticsAudience}
	 */
	this.audience = {};
	/**
	 * @type {Array<StatisticsUnit>}
	 */
	this.dynamics.subscribe = [];
	/**
	 * @type {Array<StatisticsConversionUnit>}
	 */
	this.dynamics.conversion = [];
}
OrganizationsStatistics.extend(Statistics);
/**
 *
 * @param {(string|number)} id
 * @param {Statistics.SCALES} scale
 * @param {(string|object|boolean)} range
 * @param {string} range.since
 * @param {string} [range.till]
 * @param {object<string, StatisticsStdData>} statistics_fields
 * @param {?object} dynamics_ajax_data
 * @param {Statistics.SCALES} [dynamics_ajax_data.scale]
 * @param {string} [dynamics_ajax_data.since]
 * @param {string} [dynamics_ajax_data.till]
 * @param {function} [success]
 * @return {jqPromise}
 */
OrganizationsStatistics.fetchStatistics = function(id, scale, range, statistics_fields, dynamics_ajax_data, success) {
	return Statistics.fetchStatistics(Statistics.ENTITIES.ORGANIZATION, id, scale, range, statistics_fields, dynamics_ajax_data, success);
};