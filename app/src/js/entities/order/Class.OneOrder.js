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
	 * @param {string} [uuid=null]
	 * @param {(string|number)} [event_id=0]
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
	 * @property {OneEvent} event
	 * @property {PromocodeModel} promocode
	 * @property {TicketsCollection} tickets
	 * @property {RegistrationFieldsCollection} registration_fields
	 * @property {OneUser} user
	 */
	function OneOrder(uuid, event_id) {
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
		
		this.event = new OneEvent(event_id);
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
	
	OneOrder.ENDPOINT = Object.freeze({
		ORDER: '/events/orders/{order_uuid}',
		EVENT_ORDER: '/events/{event_id}/orders/{order_uuid}',
		LEGAL_ENTITY: '/events/{event_id}/orders/{order_uuid}/legal_entity',
		LEGAL_ENTITY_CONTRACT: '/events/{event_id}/orders/{order_uuid}/legal_entity/contract',
		LEGAL_ENTITY_UTD: '/events/{event_id}/orders/{order_uuid}/legal_entity/utd',
		BITCOIN: '/events/{event_id}/orders/{order_uuid}/bitcoin'
	});
	
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
		PAYED_LEGAL_ENTITY: 'payed_legal_entity',
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
		PC: 'PC',
		AC: 'AC',
		MC: 'MC',
		GP: 'GP',
		EP: 'EP',
		WM: 'WM',
		SB: 'SB',
		MP: 'MP',
		AB: 'AB',
		MASTER_PASS: 'MA',
		PB: 'PB',
		QIWI_WALLET: 'QW',
		KV: 'KV',
		BITCOIN: 'BTC',
		LEGAL_ENTITY_PAYMENT: 'LEP',
		OTHER: 'OTH',
	};
	/**
	 *
	 * @enum {string}
	 */
	OneOrder.PAYMENT_PROVIDERS_TEXT = {
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
			case OneOrder.EXTENDED_ORDER_STATUSES.PAYED_LEGAL_ENTITY:
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
	 * @param {string} uuid
	 * @param {(Fields|string)} [fields]
	 *
	 * @return {Promise}
	 */
	OneOrder.fetchOrder = function(uuid, fields) {
		
		return __APP.SERVER.getData(OneOrder.ENDPOINT.ORDER.format({
			order_uuid: uuid
		}), {
			fields: fields
		});
	};
	/**
	 *
	 * @param {(string|number)} event_id
	 * @param {string} uuid
	 * @param {(OneOrder.ORDER_STATUSES|OneOrder.EXTENDED_ORDER_STATUSES)} new_status
	 * @param {AJAXCallback} [success]
	 *
	 * @return {Promise}
	 */
	OneOrder.changeStatus = function(event_id, uuid, new_status, success) {
		
		return __APP.SERVER.updateData(OneOrder.ENDPOINT.EVENT_ORDER.format({
			order_uuid: uuid,
			event_id: event_id
		}), {
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
	 * @return {Promise}
	 */
	OneOrder.makeLegalEntityPayment = function(event_id, uuid, data, success) {
		
		return __APP.SERVER.addData(OneOrder.ENDPOINT.LEGAL_ENTITY.format({
			order_uuid: uuid,
			event_id: event_id
		}), data, true, success);
	};
	/**
	 *
	 * @param {(string|number)} event_id
	 * @param {string} uuid
	 * @param {LegalEntitySendData} data
	 * @param {AJAXCallback} [success]
	 *
	 * @return {Promise}
	 */
	OneOrder.updateLegalEntityPayment = function(event_id, uuid, data, success) {
		
		return __APP.SERVER.updateData(OneOrder.ENDPOINT.LEGAL_ENTITY.format({
			order_uuid: uuid,
			event_id: event_id
		}), data, true, success);
	};
	/**
	 *
	 * @param {(string|number)} event_id
	 * @param {string} order_uuid
	 * @param {AJAXCallback} [success]
	 *
	 * @return {Promise}
	 */
	OneOrder.fetchBitcoinData = function(event_id, order_uuid, success) {
		
		return __APP.SERVER.addData(OneOrder.ENDPOINT.BITCOIN.format({
			order_uuid: uuid,
			event_id: event_id
		}), null, false, success);
	};
	/**
	 *
	 * @param {(Fields|string)} [fields]
	 *
	 * @return {Promise}
	 */
	OneOrder.prototype.fetch = function(fields) {
		var self = this;
		
		return this.constructor.fetchOrder(this.uuid, fields).then(function(data) {
			self.setData(data);
			
			return self;
		});
	};
	/**
	 *
	 * @param {(OneOrder.ORDER_STATUSES|OneOrder.EXTENDED_ORDER_STATUSES)} new_status
	 * @param {AJAXCallback} [success]
	 *
	 * @return {Promise}
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
	 * @return {Promise}
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
	 * @return {Promise}
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
	 * @return {Promise}
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