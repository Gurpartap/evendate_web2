/**
 * @requires Class.AbstractStatisticsCollection.js
 * @requires Class.OneStatistic.js
 */
/**
 *
 * @abstract
 * @class StatisticsCollection
 * @extends AbstractStatisticsCollection
 */
StatisticsCollection = extending(AbstractStatisticsCollection, (function() {
	/**
	 *
	 * @param {string} field
	 *
	 * @constructor
	 * @constructs StatisticsCollection
	 *
	 * @property {string} field
	 */
	function StatisticsCollection(field) {
		AbstractStatisticsCollection.call(this, field);
	}
	
	StatisticsCollection.prototype.collection_of = OneStatistic;
	/**
	 * @abstract
	 * @inheritDoc
	 */
	StatisticsCollection.prototype.fetch = function(scale, since, till, success) {};
	
	return StatisticsCollection;
}()));