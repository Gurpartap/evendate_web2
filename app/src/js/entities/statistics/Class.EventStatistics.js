/**
 * @requires Class.Statistics.js
 */
/**
 *
 * @constructor
 * @augments Statistics
 * @param {(string|number)} event_id
 */
function EventStatistics(event_id) {
	Statistics.apply(this);
	this.id = event_id;
	/**
	 * @type {Array<StatisticsUnit>}
	 */
	this.open_site = [];
	/**
	 * @type {Array<StatisticsUnit>}
	 */
	this.view_detail = [];
	/**
	 * @type {Array<StatisticsConversionUnit>}
	 */
	this.open_conversion = [];
	/**
	 * @type {Array<StatisticsConversionUnit>}
	 */
	this.fave_conversion = [];
	/**
	 * @type {Array<StatisticsConversionUnit>}
	 */
	this.dynamics.fave_conversion = [];
	/**
	 * @type {Array<StatisticsConversionUnit>}
	 */
	this.dynamics.open_conversion = [];
}
EventStatistics.extend(Statistics);
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
 * @return {jqXHR}
 */
EventStatistics.fetchStatistics = function(id, scale, range, statistics_fields, dynamics_ajax_data, success) {
	return Statistics.fetchStatistics(Statistics.ENTITIES.EVENT, id, scale, range, statistics_fields, dynamics_ajax_data, success);
};