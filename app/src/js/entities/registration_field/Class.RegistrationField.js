/**
 * @requires ../Class.OneEntity.js
 */
/**
 * @class RegistrationField
 * @extends OneEntity
 */
RegistrationField = extending(OneEntity, (function() {
	/**
	 *
	 * @constructor
	 * @constructs RegistrationField
	 *
	 * @property {?string} form_field_uuid
	 * @property {?string} form_field_label
	 * @property {?RegistrationField.TYPES} form_field_type
	 * @property {?number} form_field_type_id
	 * @property {?boolean} form_field_required
	 * @property {?string} value
	 * @property {?Array<RegistrationSelectFieldValue>} values
	 *
	 * @property {?string} uuid
	 * @property {?string} label
	 * @property {?RegistrationField.TYPES} type
	 * @property {?boolean} required
	 *
	 * @property {?timestamp} created_at
	 * @property {?timestamp} updated_at
	 */
	function RegistrationField() {
		var self = this;
		
		this.form_field_uuid = null;
		this.form_field_label = null;
		this.form_field_type = null;
		this.form_field_type_id = null;
		this.form_field_required = null;
		this.value = null;
		this.values = [];
		
		this.created_at = null;
		this.updated_at = null;
		
		Object.defineProperties(this, {
			uuid: {
				get: function() {
					return self.form_field_uuid;
				},
				set: function(val) {
					return self.form_field_uuid = val;
				}
			},
			label: {
				get: function() {
					return self.form_field_label;
				},
				set: function(val) {
					return self.form_field_label = val;
				}
			},
			type: {
				get: function() {
					return self.form_field_type;
				},
				set: function(val) {
					return self.form_field_type = val;
				}
			},
			required: {
				get: function() {
					return self.form_field_required;
				},
				set: function(val) {
					return self.form_field_required = val;
				}
			}
		});
	}
	
	RegistrationField.prototype.ID_PROP_NAME = 'form_field_uuid';
	/**
	 *
	 * @alias RegistrationFieldModel.TYPES
	 */
	RegistrationField.TYPES = RegistrationFieldModel.TYPES;
	/**
	 *
	 * @alias RegistrationFieldModel.DEFAULT_LABEL
	 */
	RegistrationField.DEFAULT_LABEL = RegistrationFieldModel.DEFAULT_LABEL;
	/**
	 *
	 * @param {(RegistrationField|RegistrationFieldLike)} field
	 *
	 * @return {boolean}
	 */
	RegistrationField.isCustomField = RegistrationFieldModel.isCustomField;
	
	
	return RegistrationField;
}()));