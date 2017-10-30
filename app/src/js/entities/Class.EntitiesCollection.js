/**
 * @requires Class.DataSet.js
 * @requires Class.OneEntity.js
 */
/**
 *
 * @abstract
 * @class EntitiesCollection
 * @extends DataSet
 * @implements EntityInterface
 */
EntitiesCollection = extending(DataSet, (function() {
	/**
	 *
	 * @constructor
	 * @constructs EntitiesCollection
	 *
	 * @property {Object<(string|number), OneEntity>} __lookup
	 * @property {Array<OneEntity>} __last_pushed
	 */
	function EntitiesCollection() {
		DataSet.call(this);
	}
	EntitiesCollection.prototype.collection_of = OneEntity;
	
	return EntitiesCollection;
}()));