/**
 * @requires ../Class.OneEntity.js
 */
/**
 *
 * @class OneTicketType
 * @extends OneEntity
 */
OneTicketType = extending(OneEntity, (function() {
	/**
	 *
	 * @param {(string|number)} [event_id]
	 * @param {(string|number)} [uuid]
	 *
	 * @constructor
	 * @constructs OneTicketType
	 *
	 * @property {?(string|number)} uuid
	 * @property {?(string|number)} event_id
	 * @property {?string} type_code
	 * @property {?string} name
	 * @property {?string} comment
	 * @property {?number} price
	 * @property {?number} sell_start_date
	 * @property {?number} sell_end_date
	 * @property {?(string|number)} start_after_ticket_type_uuid
	 * @property {?number} amount
	 * @property {?number} min_count_per_user
	 * @property {?number} max_count_per_user
	 * @property {?number} promocode
	 * @property {?number} promocode_effort
	 */
	function OneTicketType(event_id, uuid) {
		var self = this;
		
		this.uuid = setDefaultValue(uuid, 0);
		this.event_id = setDefaultValue(event_id, 0);
		this.type_code = null;
		this.name = null;
		this.comment = null;
		this.price = null;
		this.sell_start_date = null;
		this.sell_end_date = null;
		this.start_after_ticket_type_uuid = null;
		this.amount = null;
		this.min_count_per_user = null;
		this.max_count_per_user = null;
		this.promocode = null;
		this.promocode_effort = null;
		
		Object.defineProperties(this, {
			formatted_sell_start_date: {
				get: function() {
					
					return self.sell_start_date ? moment.unix(self.sell_start_date).format(__LOCALE.DATE.DATE_FORMAT) : '';
				}
			},
			formatted_sell_end_date: {
				get: function() {
					
					return self.sell_end_date ? moment.unix(self.sell_end_date).format(__LOCALE.DATE.DATE_FORMAT) : '';
				}
			}
		});
	}
	
	OneTicketType.prototype.ID_PROP_NAME = 'uuid';
	
	/**
	 *
	 * @param {(string|number)} event_id
	 * @param {(string|number)} uuid
	 * @param {(Fields|string)} [fields]
	 * @param {AJAXCallback} [success]
	 *
	 * @return {jqPromise}
	 */
	OneTicketType.fetchTicketType = function(event_id, uuid, fields, success) {
		return __APP.SERVER.getData('/api/v1/events/' + event_id + '/ticket_types/' + uuid, {
			fields: fields
		}, success);
	};
	/**
	 *
	 * @param {(Fields|string)} [fields]
	 * @param {AJAXCallback} [success]
	 *
	 * @return {jqPromise}
	 */
	OneTicketType.prototype.fetchOrder = function(fields, success) {
		var self = this;
		
		return OneTicketType.fetchTicketType(this.event_id, this.uuid, fields, function(data) {
			self.setData(data);
			if (success && typeof success == 'function') {
				success.call(self, data);
			}
		});
	};
	
	return OneTicketType;
}()));