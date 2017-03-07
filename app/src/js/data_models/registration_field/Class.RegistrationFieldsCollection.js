/**
 * @requires ../../entities/Class.EntitiesCollection.js
 * @requires Class.RegistrationFieldModel.js
 */
/**
 *
 * @class RegistrationFieldsCollection
 * @extends EntitiesCollection
 */
RegistrationFieldsCollection = extending(EntitiesCollection, (function() {
	/**
	 *
	 * @constructor
	 * @constructs RegistrationFieldsCollection
	 */
	function RegistrationFieldsCollection() {
		EntitiesCollection.call(this);
	}
	RegistrationFieldsCollection.prototype.collection_of = RegistrationFieldModel;
	
	return RegistrationFieldsCollection;
}()));