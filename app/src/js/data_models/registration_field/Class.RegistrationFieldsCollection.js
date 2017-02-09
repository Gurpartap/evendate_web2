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
	function RegistrationFieldsCollection() {}
	RegistrationFieldsCollection.prototype.collection_of = RegistrationFieldModel;
	
	return RegistrationFieldsCollection;
}()));