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
}());