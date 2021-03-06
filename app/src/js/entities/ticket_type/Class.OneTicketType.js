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
	 * @property {?boolean} is_selling
	 * @property {?number} sell_start_date
	 * @property {?number} sell_end_date
	 * @property {?(string|number)} start_after_ticket_type_code
	 * @property {?number} amount
	 * @property {?number} sold_count
	 * @property {?number} min_count_per_user
	 * @property {?number} max_count_per_user
	 * @property {?number} promocode
	 * @property {?number} promocode_effort
	 */
	function OneTicketType(event_id, uuid) {
		var self = this;
		
		this.uuid = setDefaultValue(uuid, null);
		this.event_id = setDefaultValue(event_id, null);
		this.type_code = null;
		this.name = null;
		this.comment = null;
		this.price = null;
		this.is_selling = null;
		this.sell_start_date = null;
		this.sell_end_date = null;
		this.start_after_ticket_type_code = null;
		this.amount = null;
		this.sold_count = null;
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
	 * @param {string} [after = руб.]
	 * @param {string} [before]
	 * @param {string} [separator =  ]
	 * @param {string} [decimal_separator = .]
	 *
	 * @return {string}
	 */
	OneTicketType.prototype.formatPrice = function(after, before, separator, decimal_separator) {
		
		return parseInt(this.price) === 0 ? 'Бесплатно' : formatCurrency(this.price, separator, decimal_separator, before, after || 'руб.');
	};
	
	/**
	 *
	 * @param {(string|number)} event_id
	 * @param {(string|number)} uuid
	 * @param {(Fields|string)} [fields]
	 * @param {AJAXCallback} [success]
	 *
	 * @return {Promise}
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
	 * @return {Promise}
	 */
	OneTicketType.prototype.fetchOrder = function(fields, success) {
		var self = this;
		
		return OneTicketType.fetchTicketType(this.event_id, this.uuid, fields, function(data) {
			self.setData(data);
			if (isFunction(success)) {
				success.call(self, data);
			}
		});
	};
	
	return OneTicketType;
}()));