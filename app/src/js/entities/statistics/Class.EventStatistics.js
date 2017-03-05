/**
 * @requires Class.Statistics.js
 */
/**
 *
 * @class EventStatistics
 * @extends Statistics
 */
EventStatistics = extending(Statistics, (function() {
	/**
	 *
	 * @param {(string|number)} event_id
	 * @constructor
	 * @constructs EventStatistics
	 *
	 * @property {Array<StatisticsUnit>} open_site
	 * @property {Array<StatisticsUnit>} view_detail
	 * @property {Array<StatisticsConversionUnit>} open_conversion
	 * @property {Array<StatisticsConversionUnit>} fave_conversion
	 * @property {Object} dynamics
	 * @property  {Array<StatisticsConversionUnit>} dynamics.fave_conversion
	 * @property  {Array<StatisticsConversionUnit>} dynamics.open_conversion
	 */
	function EventStatistics(event_id) {
		Statistics.apply(this);
		
		this.id = event_id;
		this.entity = Statistics.ENTITIES.EVENT;
		
		this.open_site = [];
		this.view_detail = [];
		
		this.open_conversion = [];
		this.fave_conversion = [];
		this.dynamics.fave_conversion = [];
		this.dynamics.open_conversion = [];
	}
	
	return EventStatistics;
}()));