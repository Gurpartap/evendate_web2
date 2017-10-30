/**
 * @requires ../entities/Class.DataSet.js
 */
/**
 *
 * @class AbstractDataModelsCollection
 * @extends DataSet
 */
AbstractDataModelsCollection = extending(DataSet, (function() {
	/**
	 *
	 * @constructor
	 * @constructs AbstractDataModelsCollection
	 */
	function AbstractDataModelsCollection() {
		DataSet.call(this);
	}
	AbstractDataModelsCollection.prototype.collection_of = AbstractDataModel;
	
	return AbstractDataModelsCollection;
}()));