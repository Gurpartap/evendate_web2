/**
 * @requires ../../entities/Class.EntitiesCollection.js
 * @requires Class.RegistrationFieldModel.js
 */
/**
 *
 * @class RegistrationFieldModelsCollection
 * @extends EntitiesCollection
 */
RegistrationFieldModelsCollection = extending(EntitiesCollection, (function() {
	/**
	 *
	 * @constructor
	 * @constructs RegistrationFieldModelsCollection
	 */
	function RegistrationFieldModelsCollection() {
		EntitiesCollection.call(this);
	}
	RegistrationFieldModelsCollection.prototype.collection_of = RegistrationFieldModel;
	/**
	 *
	 * @param {...object} element
	 * @returns {number}
	 */
	RegistrationFieldModelsCollection.prototype.push = function(element) {
		var self = this,
			entities = Array.prototype.slice.call(arguments),
			types = [
				RegistrationFieldModel.TYPES.FIRST_NAME,
				RegistrationFieldModel.TYPES.LAST_NAME,
				RegistrationFieldModel.TYPES.EMAIL,
				RegistrationFieldModel.TYPES.PHONE_NUMBER,
				RegistrationFieldModel.TYPES.ADDITIONAL_TEXT,
				RegistrationFieldModel.TYPES.CUSTOM,
				RegistrationFieldModel.TYPES.EXTENDED_CUSTOM
			];
		
		this.last_pushed.splice(0);
		
		types.forEach(function(type) {
			entities.forEach(function(entity) {
				if (entity.type == type) {
					self.last_pushed.push(self[self.length++] = (entity instanceof self.collection_of) ? entity : (new self.collection_of()).setData(entity));
				} else if (entity.type === RegistrationFieldModel.TYPES.SELECT || entity.type === RegistrationFieldModel.TYPES.SELECT_MULTI) {
					self.last_pushed.push(self[self.length++] = (entity instanceof RegistrationSelectFieldModel) ? entity : (new RegistrationSelectFieldModel()).setData(entity));
				}
			});
		});
		
		return this.length;
	};
	
	return RegistrationFieldModelsCollection;
}()));