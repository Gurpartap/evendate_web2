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
	 * @property {OneEvent} event
	 * @property {OneOrder} order
	 * @property {OneUser} user
	 */
	function OneTicket(event_id, uuid) {
		var self = this;
		
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
		this.event = new OneEvent();
		this.ticket_type = new OneTicketType();
		this.order = new OneOrder();
		this.user = new OneUser();
		
		this.created_at = null;
		
		Object.defineProperties(this, {
			status_name: {
				get: function() {
					
					return localeFromNamespace(self.order.status_type_code, OneTicket.TICKET_STATUSES, __LOCALES.ru_RU.TEXTS.TICKET_STATUSES);
				}
			},
			status_type_code: {
				get: function() {
					
					return self.order.status_type_code;
				}
			}
		});
	}
	OneTicket.prototype.ID_PROP_NAME = 'uuid';
	
	OneTicket.TICKET_STATUSES = Object.freeze(mergeObjects({
		USED: 'used'
	}, OneOrder.EXTENDED_ORDER_STATUSES));
	
	OneTicket.ENDPOINT = Object.freeze({
		TICKET: '/events/tickets/{ticket_uuid}',
		ADMIN_TICKET: '/statistics/events/{event_id}/tickets/{ticket_uuid}'
	});
	
	/**
	 *
	 * @param {(string|number)} event_id
	 * @param {(string|number)} uuid
	 * @param {(Fields|string)} [fields]
	 *
	 * @return {Promise}
	 */
	OneTicket.fetchTicket = function(event_id, uuid, fields) {
		
		return __APP.SERVER.getData(OneTicket.ENDPOINT.TICKET.format({
			ticket_uuid: uuid
		}), {
			fields: fields
		});
	};
	/**
	 *
	 * @param {(string|number)} event_id
	 * @param {(string|number)} uuid
	 *
	 * @return {Promise}
	 */
	OneTicket.check = function(event_id, uuid) {
		
		return __APP.SERVER.updateData(OneTicket.ENDPOINT.ADMIN_TICKET.format({
			ticket_uuid: uuid
		}), {
			checkout: true
		}, false);
	};
	/**
	 *
	 * @param {(string|number)} event_id
	 * @param {(string|number)} uuid
	 *
	 * @return {Promise}
	 */
	OneTicket.uncheck = function(event_id, uuid) {
		
		return __APP.SERVER.updateData(OneTicket.ENDPOINT.ADMIN_TICKET.format({
			ticket_uuid: uuid
		}), {
			checkout: false
		}, false);
	};
	/**
	 *
	 * @param {(string|number)} event_id
	 * @param {(string|number)} uuid
	 *
	 * @return {Promise}
	 */
	OneTicket.exportTicket = function(event_id, uuid) {
		
		return (new ServerExports()).eventTicket(event_id, uuid);
	};
	/**
	 *
	 * @param {(string|number)} uuid
	 *
	 * @return {boolean} false
	 */
	OneTicket.openTicketPage = function(uuid) {
		
		return __APP.changeState('/ticket/{ticket_uuid}'.format({ticket_uuid: uuid}));
	};
	/**
	 *
	 * @param {(Fields|string)} [fields]
	 *
	 * @return {Promise}
	 */
	OneTicket.prototype.fetch = function(fields) {
		var self = this;
		
		return OneTicket.fetchTicket(this.event_id, this.uuid, fields).then(function(data) {
			self.setData(data);
			
			return data;
		});
	};
	/**
	 *
	 * @return {Promise}
	 */
	OneTicket.prototype.check = function() {
		var self = this;
		
		return OneTicket.check(this.event_id, this.uuid).then(function() {
			self.checkout = true;
			
			return self;
		});
	};
	/**
	 *
	 * @return {Promise}
	 */
	OneTicket.prototype.uncheck = function() {
		var self = this;
		
		return OneTicket.uncheck(this.event_id, this.uuid).then(function() {
			self.checkout = false;
			
			return self;
		});
	};
	/**
	 *
	 * @return {Promise}
	 */
	OneTicket.prototype.export = function() {
		
		return OneTicket.exportTicket(this.event_id, this.uuid);
	};
	/**
	 *
	 *
	 * @return {boolean} false
	 */
	OneTicket.prototype.openPage = function() {
		
		return OneTicket.openTicketPage(this.uuid);
	};
	
	return OneTicket;
}()));