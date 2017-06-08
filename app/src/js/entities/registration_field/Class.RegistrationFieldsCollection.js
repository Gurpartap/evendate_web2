/**
 * @requires ../Class.EntitiesCollection.js
 * @requires Class.RegistrationField.js
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
	 *
	 * @property {Object<RegistrationFieldModel.TYPES, Array<RegistrationField>>} __types
	 */
	function RegistrationFieldsCollection() {
		EntitiesCollection.call(this);
		
		Object.defineProperties(this, {
			__types: {
				value: {},
				writable: true,
				enumerable: false,
				configurable: false
			}
		});
		
		for ( var type_name in RegistrationFieldModel.TYPES ) {
			if (RegistrationFieldModel.TYPES.hasOwnProperty(type_name)) {
				this.__types[RegistrationFieldModel.TYPES[type_name]] = [];
			}
		}
		Object.freeze(this.__types);
	}
	RegistrationFieldsCollection.prototype.collection_of = RegistrationField;
	/**
	 *
	 * @param {RegistrationField} entity
	 */
	RegistrationFieldsCollection.prototype.createAdditionalLookup = function(entity) {
		if (entity instanceof RegistrationField) {
			this.__types[entity.type].push(entity);
		}
	};
	
	return RegistrationFieldsCollection;
}()));