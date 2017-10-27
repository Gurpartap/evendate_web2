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
			entities = Array.prototype.slice.call(arguments);
		
		this.__last_pushed.splice(0);
		
		entities.forEach(function(entity) {
			self.__last_pushed.push(self[self.length++] = (entity instanceof self.collection_of) ? entity : (new self.collection_of()).setData(entity));
		});
		//this.sortByType();
		
		return this.length;
	};
	
	RegistrationFieldModelsCollection.prototype.sortByType = function() {
		var types_queue = [
			RegistrationFieldModel.TYPES.LAST_NAME,
			RegistrationFieldModel.TYPES.FIRST_NAME,
			RegistrationFieldModel.TYPES.EMAIL
		];
		
		this.sort(function(a, b) {
			var a_i = types_queue.indexOf(a.type),
				b_i = types_queue.indexOf(b.type);
			
			if (a_i === -1 && b_i !== -1) {
				return 1;
			} else if (a_i !== -1 && b_i === -1) {
				return -1;
			} else if (a_i === b_i) {
				return 0;
			} else if (a_i < b_i) {
				return -1;
			} else if (a_i > b_i) {
				return 1;
			}
			
			return 0;
		});
		
		return this;
	};
	
	RegistrationFieldModelsCollection.prototype.sortByOrder = function() {
		this.sort(function(a, b) {
			
			return a.order_number - b.order_number;
		});
		
		return this;
	};
	
	return RegistrationFieldModelsCollection;
}()));