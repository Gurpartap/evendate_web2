/**
 * @requires ../Class.OneEntity.js
 * @requires ../../data_models/registration_field/Class.RegistrationFieldModelsCollection.js
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
	 * @constructs OneOrder
	 *
	 * @property {?(string|number)} uuid
	 * @property {?(string|number)} user_id
	 * @property {?(string|number)} event_id
	 * @property {?(string|number)} number
	 * @property {?string} order_content
	 * @property {?boolean} is_canceled
	 * @property {?number} status_id
	 * @property {?(OneOrder.ORDER_STATUSES|OneOrder.EXTENDED_ORDER_STATUSES)} status_type_code
	 * @property {?TEXTS.TICKET_STATUSES} status_name
	 * @property {?(string|number)} sum
	 *
	 * @property {?timestamp} created_at
	 * @property {?timestamp} updated_at
	 * @property {?timestamp} payed_at
	 * @property {?timestamp} canceled_at
	 *
	 * @property {?Moment} m_created_at
	 * @property {?Moment} m_updated_at
	 * @property {?Moment} m_payed_at
	 * @property {?Moment} m_canceled_at
	 *
	 * @property {TicketsCollection} tickets
	 * @property {RegistrationFieldsCollection} registration_fields
	 * @property {OneUser} user
	 */
	function OneOrder(event_id, uuid) {
		var self = this;
		
		this.uuid = setDefaultValue(uuid, 0);
		this.event_id = setDefaultValue(event_id, 0);
		this.number = null;
		this.order_content = null;
		this.is_canceled = null;
		this.status_id = null;
		this.status_type_code = null;
		this.sum = null;
		
		this.created_at = null;
		this.updated_at = null;
		this.payed_at = null;
		this.canceled_at = null;
		
		this.tickets = new TicketsCollection();
		this.registration_fields = new RegistrationFieldsCollection();
		this.user_id = null;
		this.user = new OneUser();
		
		
		Object.defineProperties(this, {
			status_name: {
				get: function() {
					return localeFromNamespace(self.status_type_code, OneOrder.EXTENDED_ORDER_STATUSES, __LOCALES.ru_RU.TEXTS.TICKET_STATUSES);
				}
			},
			m_created_at: {
				get: function() {
					
					return moment.unix(self.created_at)
				}
			},
			m_updated_at: {
				get: function() {
					
					return moment.unix(self.updated_at)
				}
			},
			m_payed_at: {
				get: function() {
					
					return moment.unix(self.payed_at)
				}
			},
			m_canceled_at: {
				get: function() {
					
					return moment.unix(self.canceled_at)
				}
			}
		});
	}
	
	OneOrder.prototype.ID_PROP_NAME = 'uuid';
	
	/**
	 *
	 * @enum {string}
	 */
	OneOrder.ORDER_STATUSES = {
		WAITING_FOR_PAYMENT: 'waiting_for_payment',
		IS_PENDING: 'is_pending',
		
		APPROVED: 'approved',
		PAYED: 'payed',
		WITHOUT_PAYMENT: 'without_payment',
		
		RETURNED_BY_ORGANIZATION: 'returned_by_organization',
		RETURNED_BY_CLIENT: 'returned_by_client',
		REJECTED: 'rejected'
	};
	/**
	 *
	 * @enum {string}
	 */
	OneOrder.EXTENDED_ORDER_STATUSES = $.extend({
		PAYMENT_CANCELED_AUTO: 'payment_canceled_auto',
		PAYMENT_CANCELED_BY_CLIENT: 'payment_canceled_by_client'
	}, OneOrder.ORDER_STATUSES);
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
	 * @param {(string|number)} event_id
	 * @param {(string|number)} uuid
	 * @param {(OneOrder.ORDER_STATUSES|OneOrder.EXTENDED_ORDER_STATUSES)} new_status
	 * @param {AJAXCallback} [success]
	 *
	 * @return {jqPromise}
	 */
	OneOrder.changeStatus = function(event_id, uuid, new_status, success) {
		
		return __APP.SERVER.updateData('/api/v1/events/' + event_id + '/orders/' + uuid, {
			status: new_status
		}, false, success);
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
		
		return this.constructor.fetchOrder(this.event_id, this.uuid, fields, function(data) {
			self.setData(data);
			if (isFunction(success)) {
				success.call(self, data);
			}
		});
	};
	/**
	 *
	 * @param {(OneOrder.ORDER_STATUSES|OneOrder.EXTENDED_ORDER_STATUSES)} new_status
	 * @param {AJAXCallback} [success]
	 *
	 * @return {jqPromise}
	 */
	OneOrder.prototype.changeStatus = function(new_status, success) {
		var self = this;
		
		return OneOrder.changeStatus(this.event_id, this.uuid, new_status, function() {
			self.status_type_code = new_status;
			
			if (isFunction(success)) {
				success.call(self, self);
			}
		});
	};
	
	return OneOrder;
}()));