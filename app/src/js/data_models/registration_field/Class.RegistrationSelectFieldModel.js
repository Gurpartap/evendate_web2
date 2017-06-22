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