/**
 * @requires ../Class.EntitiesCollection.js
 * @requires Class.OneAbstractStatistic.js
 */
/**
 *
 * @abstract
 * @class AbstractStatisticsCollection
 * @extends EntitiesCollection
 */
AbstractStatisticsCollection = extending(EntitiesCollection, (function() {
	/**
	 *
	 * @param {string} field
	 *
	 * @constructor
	 * @constructs AbstractStatisticsCollection
	 *
	 * @property {string} field
	 */
	function AbstractStatisticsCollection(field) {
		EntitiesCollection.call(this);
		
		Object.defineProperty(this, 'field', {
			get: function() {
				
				return field;
			}
		});
	}
	
	AbstractStatisticsCollection.prototype.collection_of = OneAbstractStatistic;
	/**
	 * @const
	 * @enum {string}
	 */
	AbstractStatisticsCollection.SCALES = {
		MINUTE: 'minute',
		HOUR: 'hour',
		DAY: 'day',
		WEEK: 'week',
		MONTH: 'month',
		YEAR: 'year',
		OVERALL: 'overall'
	};
	/**
	 *
	 * @abstract
	 *
	 * @param {Fields} fields
	 * @param {AJAXCallback} [success]
	 *
	 * @returns jqPromise
	 */
	AbstractStatisticsCollection.fetchStatistics = function(fields, success) {};
	/**
	 *
	 * @abstract
	 *
	 * @param {AbstractStatisticsCollection.SCALES} [scale]
	 * @param {string} [since]
	 * @param {string} [till]
	 * @param {AJAXCallback} [success]
	 *
	 * @returns jqPromise
	 */
	AbstractStatisticsCollection.prototype.fetch = function(scale, since, till, success) {};
	
	return AbstractStatisticsCollection;
}()));