/**
 * @requires ../../data_models/promocode/Class.PromocodeModel.js
 */
/**
 *
 * @class OnePromocode
 * @extends PromocodeModel
 */
OnePromocode = extending(PromocodeModel, (function() {
	/**
	 *
	 * @param {number} [event_id]
	 * @param {string} [uuid]
	 *
	 * @constructor
	 * @constructs OnePromocode
	 *
	 * @property {string} ?uuid
	 * @property {(number|string)} ?event_id
	 * @property {string} ?code
	 * @property {boolean} ?is_fixed
	 * @property {boolean} ?is_percentage
	 * @property {(number|string)} ?effort
	 * @property {(number|string)} ?use_limit
	 * @property {timestamp} ?start_date
	 * @property {timestamp} ?end_date
	 * @property {boolean} ?enabled
	 *
	 * @property {timestamp} ?created_at
	 * @property {timestamp} ?updated_at
	 */
	function OnePromocode(event_id, uuid) {
		PromocodeModel.call(this);
		
		this.event_id = setDefaultValue(event_id, null);
		this.uuid = setDefaultValue(uuid, null);
	}
	
	/**
	 *
	 * @param {number} event_id
	 * @param {string} code
	 * @param {Fields} [fields]
	 * @param {AJAXCallback} [success]
	 * @param {function} [error]
	 *
	 * @return {jqPromise}
	 */
	OnePromocode.fetchPromocodebyCodeName = function(event_id, code, fields, success, error) {
		
		return __APP.SERVER.getData('/api/v1/events/'+event_id+'/promocodes', {
			code: code,
			fields: fields
		}, success, error);
	};
	/**
	 *
	 * @param {string} code
	 * @param {Fields} [fields]
	 * @param {AJAXCallback} [success]
	 * @param {function} [error]
	 *
	 * @return {jqPromise}
	 */
	OnePromocode.prototype.fetchPromocodebyCodeName = function(code, fields, success, error) {
		var self = this;
	
		return OnePromocode.fetchPromocodebyCodeName(this.event_id, code, fields, function(data) {
			self.setData(data);
			
			if (isFunction(success)) {
				success.call(self, data);
			}
		}, error);
	};
	
	return OnePromocode;
}()));