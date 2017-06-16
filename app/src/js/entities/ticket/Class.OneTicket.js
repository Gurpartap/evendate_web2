/**
 * @requires ../Class.OneEntity.js
 */
/**
 *
 * @class OneTicket
 * @extends OneEntity
 */
OneTicket = extending(OneEntity, (function() {
	/**
	 *
	 * @param {(string|number)} [event_id]
	 * @param {(string|number)} [uuid]
	 *
	 * @constructor
	 * @constructs OneTicket
	 *
	 * @property {?(string|number)} uuid
	 * @property {?(string|number)} event_id
	 * @property {?(string|number)} user_id
	 * @property {?string} type_code
	 * @property {?string} ticket_type_uuid
	 * @property {?string} ticket_order_uuid
	 * @property {?boolean} status
	 * @property {?boolean} checkout
	 * @property {?(string|number)} price
	 * @property {?(string|number)} number
	 * @property {?timestamp} created_at
	 *
	 * @property {OneTicketType} ticket_type
	 * @property {OneOrder} order
	 * @property {OneUser} user
	 */
	function OneTicket(event_id, uuid) {
		this.uuid = setDefaultValue(uuid, 0);
		this.event_id = setDefaultValue(event_id, 0);
		this.user_id = null;
		this.type_code = null;
		this.ticket_type_uuid = null;
		this.ticket_order_uuid = null;
		this.status = null;
		this.checkout = null;
		this.price = null;
		this.number = null;
		this.ticket_type = new OneTicketType();
		this.order = new OneOrder();
		this.user = new OneUser();
		
		this.created_at = null;
	}
	OneTicket.prototype.ID_PROP_NAME = 'uuid';
	
	/**
	 *
	 * @param {(string|number)} event_id
	 * @param {(string|number)} uuid
	 * @param {(Fields|string)} [fields]
	 * @param {AJAXCallback} [success]
	 *
	 * @return {jqPromise}
	 */
	OneTicket.fetchTicket = function(event_id, uuid, fields, success) {
		return __APP.SERVER.getData('/api/v1/events/' + event_id + '/tickets/' + uuid, {
			fields: fields
		}, success);
	};
	/**
	 *
	 * @param {(string|number)} event_id
	 * @param {(string|number)} uuid
	 * @param {AJAXCallback} [success]
	 * @return {jqPromise}
	 */
	OneTicket.check = function(event_id, uuid, success) {
		return __APP.SERVER.updateData('/api/v1/statistics/events/' + event_id + '/tickets/' + uuid, {
			checkout: true
		}, false, success);
	};
	/**
	 *
	 * @param {(string|number)} event_id
	 * @param {(string|number)} uuid
	 * @param {AJAXCallback} [success]
	 * @return {jqPromise}
	 */
	OneTicket.uncheck = function(event_id, uuid, success) {
		return __APP.SERVER.updateData('/api/v1/statistics/events/' + event_id + '/tickets/' + uuid, {
			checkout: false
		}, false, success);
	};
	/**
	 *
	 * @param {(Fields|string)} [fields]
	 * @param {AJAXCallback} [success]
	 *
	 * @return {jqPromise}
	 */
	OneTicket.prototype.fetchTicket = function(fields, success) {
		var self = this;
		
		return OneTicket.fetchTicket(this.event_id, this.uuid, fields, function(data) {
			self.setData(data);
			if (success && typeof success === 'function') {
				success.call(self, data);
			}
		});
	};
	/**
	 *
	 * @param {AJAXCallback} [success]
	 *
	 * @return {jqPromise}
	 */
	OneTicket.prototype.check = function(success) {
		var self = this;
		
		return OneTicket.check(this.event_id, this.uuid, function() {
			self.checkout = true;
			if (success && typeof success === 'function') {
				success.call(self, self);
			}
		});
	};
	/**
	 *
	 * @param {AJAXCallback} [success]
	 *
	 * @return {jqPromise}
	 */
	OneTicket.prototype.uncheck = function(success) {
		var self = this;
		
		return OneTicket.uncheck(this.event_id, this.uuid, function() {
			self.checkout = false;
			if (success && typeof success === 'function') {
				success.call(self, self);
			}
		});
	};
	
	return OneTicket;
}()));