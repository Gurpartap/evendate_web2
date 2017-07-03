/**
 * @requires ../../entities/Class.EntitiesCollection.js
 * @requires Class.InterestModel.js
 */
/**
 *
 * @class InterestModelsCollection
 * @extends EntitiesCollection
 */
InterestModelsCollection = extending(EntitiesCollection, (function() {
	/**
	 *
	 * @constructor
	 * @constructs InterestModelsCollection
	 */
	function InterestModelsCollection() {
		EntitiesCollection.call(this);
	}
	InterestModelsCollection.prototype.collection_of = InterestModel;
	
	return InterestModelsCollection;
}()));