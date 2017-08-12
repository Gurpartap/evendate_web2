/**
 * @requires ../../entities/Class.EntitiesCollection.js
 * @requires Class.PromocodeModel.js
 */
/**
 *
 * @class PromocodeModelsCollection
 * @extends EntitiesCollection
 */
PromocodeModelsCollection = extending(EntitiesCollection, (function() {
	/**
	 *
	 * @constructor
	 * @constructs PromocodeModelsCollection
	 */
	function PromocodeModelsCollection() {
		EntitiesCollection.call(this);
	}
	PromocodeModelsCollection.prototype.collection_of = PromocodeModel;
	
	return PromocodeModelsCollection;
}()));