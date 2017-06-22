/**
 * @requires ../../entities/Class.OneEntity.js
 */

/**
 * @typedef {object} RegistrationFieldLike
 * @property {string} type
 * @property {boolean} required
 * @property {?string} label
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
		this.uuid = null;
		/**
		 *
		 * @type {RegistrationFieldModel.TYPES}
		 */
		this.type = null;
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
		ADDITIONAL_TEXT: 'additional_text',
		CUSTOM: 'custom',
		EXTENDED_CUSTOM: 'extended_custom',
		SELECT: 'select',
		SELECT_MULTI: 'select_multi'
	};
	/**
	 *
	 * @enum {string}
	 */
	RegistrationFieldModel.DEFAULT_LABEL = {
		EMAIL: 'E-mail',
		FIRST_NAME: 'Имя',
		LAST_NAME: 'Фамилия',
		PHONE_NUMBER: 'Номер телефона',
		ADDITIONAL_TEXT: 'Дополнительное текстовое поле',
		CUSTOM: 'Дополнительное текстовое поле',
		EXTENDED_CUSTOM: 'Дополнительное текстовое поле',
		SELECT: 'Выбор одного варианта',
		SELECT_MULTI: 'Выбор нескольких вариантов'
	};
	
	/**
	 *
	 * @param {(RegistrationFieldModel|RegistrationFieldLike)} field
	 * @return {boolean}
	 */
	RegistrationFieldModel.isCustomField = function(field) {
		switch (field.type) {
			case RegistrationFieldModel.TYPES.EMAIL:
			case RegistrationFieldModel.TYPES.FIRST_NAME:
			case RegistrationFieldModel.TYPES.LAST_NAME:
			case RegistrationFieldModel.TYPES.PHONE_NUMBER: return false;
			default:
			case RegistrationFieldModel.TYPES.CUSTOM:
			case RegistrationFieldModel.TYPES.EXTENDED_CUSTOM:
			case RegistrationFieldModel.TYPES.ADDITIONAL_TEXT:
			case RegistrationFieldModel.TYPES.SELECT:
			case RegistrationFieldModel.TYPES.SELECT_MULTI: return true;
		}
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