/**
 * @requires ../../entities/Class.EntitiesCollection.js
 * @requires Class.DateModel.js
 */
/**
 *
 * @class DateModelsCollection
 * @extends EntitiesCollection
 */
DateModelsCollection = extending(EntitiesCollection, (function() {
	/**
	 *
	 * @constructor
	 * @constructs DateModelsCollection
	 */
	function DateModelsCollection() {}
	DateModelsCollection.prototype.collection_of = DateModel;
	
	return DateModelsCollection;
}()));