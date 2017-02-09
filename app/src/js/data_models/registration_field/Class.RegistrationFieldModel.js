/**
 * @requires ../../entities/Class.OneEntity.js
 */
/**
 * @class RegistrationFieldModel
 * @extends OneEntity
 */
RegistrationFieldModel = extending(OneEntity, (function() {
	/**
	 *
	 * @constructor
	 * @constructs RegistrationFieldModel
	 */
	function RegistrationFieldModel() {
		/**
		 *
		 * @type {RegistrationFieldModel.TYPES}
		 */
		this.type = '';
		this.label = null;
		this.required = false;
	}
	/**
	 *
	 * @enum {string}
	 */
	RegistrationFieldModel.TYPES = {
		EMAIL: 'email',
		FIRST_NAME: 'first_name',
		LAST_NAME: 'last_name',
		PHONE_NUMBER: 'phone_number',
		ADDITIONAL_TEXT: 'additional_text'
	};
	
	RegistrationFieldModel.prototype.setData = function(data) {
		var field;
		if (Array.isArray(data)) {
			data = data[0];
		}
		for (field in data) {
			if (data.hasOwnProperty(field) && this.hasOwnProperty(field)) {
				this[field] = data[field];
			}
		}
		return this;
	};
	
	return RegistrationFieldModel;
}()));