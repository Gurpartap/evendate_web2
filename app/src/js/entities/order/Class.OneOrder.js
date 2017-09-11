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
	 * @param {(string|number)} [event_id=0]
	 * @param {string} [uuid=null]
	 *
	 * @constructor
	 * @constructs OneOrder
	 *
	 * @property {string}  uuid
	 * @property {?(string|number)} user_id
	 * @property {?(string|number)} event_id
	 * @property {?(string|number)} number
	 * @property {?object} order_content
	 * @property {?boolean} is_canceled
	 * @property {?number} status_id
	 * @property {?(OneOrder.ORDER_STATUSES|OneOrder.EXTENDED_ORDER_STATUSES)} status_type_code
	 * @property {?TEXTS.TICKET_STATUSES} status_name
	 * @property {?(string|number)} sum
	 * @property {?(string|number)} final_sum
	 * @property {?number} shop_sum_amount
	 * @property {?string} payment_type
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
	 * @property {PromocodeModel} promocode
	 * @property {TicketsCollection} tickets
	 * @property {RegistrationFieldsCollection} registration_fields
	 * @property {OneUser} user
	 */
	function OneOrder(event_id, uuid) {
		var self = this;
		
		this.uuid = setDefaultValue(uuid, null);
		this.event_id = setDefaultValue(event_id, 0);
		this.number = null;
		this._order_content = null;
		this.is_canceled = null;
		this.status_id = null;
		this.status_type_code = null;
		this.sum = null;
		this.final_sum = null;
		this.shop_sum_amount = null;
		this.payment_type = null;
		
		this.created_at = null;
		this.updated_at = null;
		this.payed_at = null;
		this.canceled_at = null;
		
		this.promocode = new PromocodeModel();
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
			},
			order_content: {
				get: function() {
					
					return JSON.parse(self._order_content || '{}');
				},
				set: function(value) {
					
					if (typeof value === 'string') {
						return self._order_content = value;
					} else if (typeof value === 'object' && value !== null) {
						return self._order_content = JSON.stringify(value);
					}
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
		WAITING_PAYMENT_LEGAL_ENTITY: 'order_waiting_for_payment_legal_entity',
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
	 * @enum {string}
	 */
	OneOrder.PAYMENT_PROVIDERS = {
		PC: 'Яндекс.Деньги',
		AC: 'Банковская карта',
		MC: 'Баланс телефона',
		GP: 'Наличные',
		EP: 'ЕРИП (Беларусь)',
		WM: 'WebMoney',
		SB: 'Сбербанк Онлайн',
		MP: 'Мобильный терминал (mPOS)',
		AB: 'Альфа-Клик',
		MA: 'MasterPass',
		PB: 'Интернет-банк Промсвязьбанка',
		QW: 'QIWI Wallet',
		KV: 'КупиВкредит',
		BTC: 'Bitcoin',
		LEP: 'Через юрлицо',
		OTH: 'Иное'
	};
	
	OneOrder.isGreenStatus = function(status) {
		switch (status) {
			case OneOrder.EXTENDED_ORDER_STATUSES.APPROVED:
			case OneOrder.EXTENDED_ORDER_STATUSES.PAYED:
			case OneOrder.EXTENDED_ORDER_STATUSES.WITHOUT_PAYMENT: return true;
			
			default: return false;
		}
	};
	
	OneOrder.isYellowStatus = function(status) {
		switch (status) {
			case OneOrder.EXTENDED_ORDER_STATUSES.WAITING_PAYMENT_LEGAL_ENTITY:
			case OneOrder.EXTENDED_ORDER_STATUSES.WAITING_FOR_PAYMENT:
			case OneOrder.EXTENDED_ORDER_STATUSES.IS_PENDING: return true;
			
			default: return false;
		}
	};
	
	OneOrder.isRedStatus = function(status) {
		switch (status) {
			case OneOrder.EXTENDED_ORDER_STATUSES.PAYMENT_CANCELED_BY_CLIENT:
			case OneOrder.EXTENDED_ORDER_STATUSES.RETURNED_BY_ORGANIZATION:
			case OneOrder.EXTENDED_ORDER_STATUSES.PAYMENT_CANCELED_AUTO:
			case OneOrder.EXTENDED_ORDER_STATUSES.RETURNED_BY_CLIENT:
			case OneOrder.EXTENDED_ORDER_STATUSES.REJECTED: return true;
			
			default: return false;
		}
	};
	
	OneOrder.isDisabledStatus = function(status) {
		switch (status) {
			case OneOrder.EXTENDED_ORDER_STATUSES.IS_PENDING:
			case OneOrder.EXTENDED_ORDER_STATUSES.WAITING_PAYMENT_LEGAL_ENTITY:
			case OneOrder.EXTENDED_ORDER_STATUSES.WAITING_FOR_PAYMENT:
			case OneOrder.EXTENDED_ORDER_STATUSES.PAYMENT_CANCELED_AUTO:
			case OneOrder.EXTENDED_ORDER_STATUSES.PAYMENT_CANCELED_BY_CLIENT:
			case OneOrder.EXTENDED_ORDER_STATUSES.RETURNED_BY_ORGANIZATION:
			case OneOrder.EXTENDED_ORDER_STATUSES.RETURNED_BY_CLIENT:
			case OneOrder.EXTENDED_ORDER_STATUSES.REJECTED: return true;
			
			default: return false;
		}
	};
	/**
	 *
	 * @param {(string|number)} event_id
	 * @param {string} uuid
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
	 * @param {string} uuid
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
	 * @typedef {object} LegalEntitySendData
	 * @property {string} participants
	 * @property {string} company_name
	 * @property {string} company_inn
	 * @property {string} company_kpp
	 * @property {string} company_address
	 * @property {string} company_zipcode
	 * @property {string} bank_name
	 * @property {string} bank_bik
	 * @property {string} bank_correspondent_account
	 * @property {string} bank_payment_account
	 * @property {string} signer_full_name
	 * @property {string} signer_position
	 * @property {string} contact_full_name
	 * @property {string} contact_email
	 * @property {string} contact_phone_number
	 */
	/**
	 *
	 * @param {(string|number)} event_id
	 * @param {string} uuid
	 * @param {LegalEntitySendData} data
	 * @param {AJAXCallback} [success]
	 *
	 * @return {jqPromise}
	 */
	OneOrder.makeLegalEntityPayment = function(event_id, uuid, data, success) {
		
		return __APP.SERVER.addData('/api/v1/events/'+event_id+'/orders/'+uuid+'/legal_entity', data, true, success);
	};
	/**
	 *
	 * @param {(string|number)} event_id
	 * @param {string} uuid
	 * @param {LegalEntitySendData} data
	 * @param {AJAXCallback} [success]
	 *
	 * @return {jqPromise}
	 */
	OneOrder.updateLegalEntityPayment = function(event_id, uuid, data, success) {
		
		return __APP.SERVER.updateData('/api/v1/events/'+event_id+'/orders/'+uuid+'/legal_entity', data, true, success);
	};
	/**
	 *
	 * @param {(string|number)} event_id
	 * @param {string} order_uuid
	 * @param {AJAXCallback} [success]
	 *
	 * @return {jqPromise}
	 */
	OneOrder.fetchBitcoinData = function(event_id, order_uuid, success) {
		
		return __APP.SERVER.addData('/api/v1/events/' + event_id + '/orders/' + order_uuid + '/bitcoin', null, false, success);
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
	
	/**
	 *
	 * @param {LegalEntitySendData} data
	 * @param {AJAXCallback} [success]
	 *
	 * @return {jqPromise}
	 */
	OneOrder.prototype.makeLegalEntityPayment = function(data, success) {
		var self = this;
		
		return OneOrder.makeLegalEntityPayment(this.event_id, this.uuid, data, function() {
			
			if (isFunction(success)) {
				success.call(self, self);
			}
		});
	};
	
	/**
	 *
	 * @param {LegalEntitySendData} data
	 * @param {AJAXCallback} [success]
	 *
	 * @return {jqPromise}
	 */
	OneOrder.prototype.updateLegalEntityPayment = function(data, success) {
		var self = this;
		
		return OneOrder.updateLegalEntityPayment(this.event_id, this.uuid, data, function() {
			
			if (isFunction(success)) {
				success.call(self, self);
			}
		});
	};
	/**
	 * @callback BitcoinDataCB
	 * @param {object} data
	 * @param {number} data.amount
	 * @param {string} data.address
	 */
	/**
	 *
	 * @param {BitcoinDataCB} [success]
	 *
	 * @return {jqPromise}
	 */
	OneOrder.prototype.fetchBitcoinData = function(success) {
		var self = this;
		
		return OneOrder.fetchBitcoinData(this.event_id, this.uuid, function(data) {
			
			if (isFunction(success)) {
				success.call(self, data);
			}
		});
	};
	
	return OneOrder;
}()));