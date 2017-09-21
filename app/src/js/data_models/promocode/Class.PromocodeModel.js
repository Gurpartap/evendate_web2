/**
 * @requires ../../entities/Class.OneEntity.js
 */
/**
 *
 * @class PromocodeModel
 * @extends OneEntity
 */
PromocodeModel = extending(OneEntity, (function() {
	/**
	 *
	 * @constructor
	 * @constructs PromocodeModel
	 *
	 * @property {?string} uuid
	 * @property {?number} event_id
	 * @property {?string} code
	 * @property {?boolean} is_fixed
	 * @property {?boolean} is_percentage
	 * @property {?number} effort
	 * @property {?number| use_limit
	 * @property {?timestamp} start_date
	 * @property {?timestamp} end_date
	 * @property {?boolean} enabled
	 *
	 * @property {?timestamp} created_at
	 * @property {?timestamp} updated_at
	 */
	function PromocodeModel() {
		this.uuid = null;
		this.event_id = null;
		this.code = null;
		this.is_fixed = null;
		this.is_percentage = null;
		this.effort = null;
		this.use_limit = null;
		this.start_date = null;
		this.end_date = null;
		this.enabled = null;
		
		this.created_at = null;
		this.updated_at = null;
	}
	PromocodeModel.prototype.ID_PROP_NAME = 'uuid';
	
	return PromocodeModel;
}()));