/**
 * @requires Class.AbstractStatisticsCollection.js
 * @requires Class.OneConversionStatistic.js
 */
/**
 *
 * @class ConversionStatisticsCollection
 * @extends AbstractStatisticsCollection
 */
ConversionStatisticsCollection = extending(AbstractStatisticsCollection, (function() {
	/**
	 *
	 * @param {string} field
	 *
	 * @constructor
	 * @constructs ConversionStatisticsCollection
	 *
	 * @property {string} field
	 */
	function ConversionStatisticsCollection(field) {
		AbstractStatisticsCollection.call(this, field);
	}
	
	ConversionStatisticsCollection.prototype.collection_of = OneConversionStatistic;
	/**
	 * @abstract
	 * @inheritDoc
	 */
	ConversionStatisticsCollection.prototype.fetch = function(scale, since, till, success) {};
	
	return ConversionStatisticsCollection;
}()));