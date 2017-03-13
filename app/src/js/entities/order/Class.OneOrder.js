/**
 * @requires ../Class.OneEntity.js
 */
/**
 *
 * @class OneOrder
 * @extends OneEntity
 */
OneOrder = extending(OneEntity, (function() {
	/**
	 *
	 * @param {(string|number)} [event_id]
	 * @param {(string|number)} [uuid]
	 *
	 * @constructor
	 * @constructs
	 *
	 * @property {?(string|number)} uuid
	 * @property {?(string|number)} user_id
	 * @property {?string} order_content
	 * @property {?boolean} is_canceled
	 * @property {?number} status_id
	 * @property {?OneOrder.TICKET_STATUSES} status_type_code
	 * @property {?TEXTS.TICKET_STATUSES} status_name
	 * @property {?number} created_at
	 * @property {?number} updated_at
	 * @property {?number} payed_at
	 * @property {?number} canceled_at
	 *
	 * @property {TicketsCollection} tickets
	 * @property {OneUser} user
	 */
	function OneOrder(event_id, uuid) {
		var self = this;
		
		this.uuid = setDefaultValue(uuid, 0);
		this.event_id = setDefaultValue(event_id, 0);
		this.order_content = null;
		this.is_canceled = null;
		this.status_id = null;
		this.status_type_code = null;
		this.created_at = null;
		this.updated_at = null;
		this.payed_at = null;
		this.canceled_at = null;
		
		this.tickets = new TicketsCollection();
		this.user_id = null;
		this.user = new OneUser();
		
		Object.defineProperty(this, 'status_name', {
			get: function() {
				for( var prop in OneOrder.TICKET_STATUSES ) {
					if( OneOrder.TICKET_STATUSES.hasOwnProperty(prop) && OneOrder.TICKET_STATUSES[ prop ] === self.status_type_code )
						return __LOCALES.ru_RU.TEXTS.TICKET_STATUSES[ prop ];
				}
			}
		});
	}
	
	/**
	 *
	 * @enum {string}
	 */
	OneOrder.TICKET_STATUSES = {
		WAITING_FOR_PAYMENT: 'waiting_for_payment',
		PAYED: 'payed',
		RETURNED_BY_ORGANIZATION: 'returned_by_organization',
		WITHOUT_PAYMENT: 'without_payment',
		PAYMENT_CANCELED_AUTO: 'payment_canceled_auto',
		PAYMENT_CANCELED_BY_CLIENT: 'payment_canceled_by_client',
		RETURNED_BY_CLIENT: 'returned_by_client',
		COMPLETED: 'completed',
		IS_PENDING: 'is_pending',
		APPROVED: 'approved',
		REJECTED: 'rejected'
	};
	/**
	 *
	 * @param {(string|number)} event_id
	 * @param {(string|number)} uuid
	 * @param {(Fields|string)} [fields]
	 * @param {AJAXCallback} [success]
	 *
	 * @return {jqPromise}
	 */
	OneOrder.fetchOrder = function(event_id, uuid, fields, success) {
		return __APP.SERVER.getData('/api/v1/events/' + event_id + '/orders/' + uuid, {
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
	OneOrder.prototype.fetchOrder = function(fields, success) {
		var self = this;
		return OneOrder.fetchOrder(this.event_id, this.uuid, fields, function(data) {
			self.setData(data);
			if (success && typeof success == 'function') {
				success.call(self, data);
			}
		});
	};
	
	return OneOrder;
}()));