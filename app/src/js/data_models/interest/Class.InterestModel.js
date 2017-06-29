/**
 * @requires ../../entities/Class.OneEntity.js
 */
/**
 *
 * @class InterestModel
 * @extends OneEntity
 */
InterestModel = extending(OneEntity, (function() {
	/**
	 *
	 * @constructor
	 * @constructs InterestModel
	 *
	 * @property {?number} topic_id
	 * @property {?string} topic_name
	 * @property {?float} value
	 * @property {?timestamp} updated_at
	 */
	function InterestModel() {
		this.topic_id = setDefaultValue(this.topic_id, 0);
		this.topic_name = null;
		this.value = null;
		this.updated_at = null;
	}
	InterestModel.prototype.ID_PROP_NAME = 'topic_id';
	
	return InterestModel;
}()));