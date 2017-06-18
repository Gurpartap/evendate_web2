/**
 * @requires Class.RegistrationFieldModel.js
 */

/**
 * @class RegistrationSelectFieldModel
 * @extends RegistrationFieldModel
 */
RegistrationSelectFieldModel = extending(RegistrationFieldModel, (function() {
	/**
	 *
	 * @class RegistrationSelectFieldValue
	 */
	RegistrationSelectFieldValue = (function() {
		/**
		 *
		 * @param {(string|number)} [value]
		 *
		 * @constructor
		 * @constructs RegistrationSelectFieldValue
		 *
		 * @property {?(string|number)} value
		 * @property {?string} uuid
		 */
		function RegistrationSelectFieldValue(value) {
			this.value = setDefaultValue(value, null);
			this.uuid = null;
		}
		
		return RegistrationSelectFieldValue;
	});
	/**
	 *
	 * @constructor
	 * @constructs RegistrationFieldModel
	 *
	 * @property {Array<RegistrationSelectFieldValue>} values
	 */
	function RegistrationSelectFieldModel() {
		RegistrationFieldModel.call(this);
		this.values = [];
	}
	
	RegistrationSelectFieldModel.isCustomField = RegistrationFieldModel.isCustomField;
	
	return RegistrationSelectFieldModel;
}()));