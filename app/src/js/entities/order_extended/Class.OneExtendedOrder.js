/**
 * @requires ../order/Class.OneOrder.js
 */
/**
 *
 * @class OneExtendedOrder
 * @extends OneOrder
 */
OneExtendedOrder = extending(OneOrder, (function() {
	/**
	 *
	 * @param {(string|number)} [event_id]
	 * @param {(string|number)} [uuid]
	 *
	 * @constructor
	 * @constructs OneExtendedOrder
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
	 * @property {OneEvent} event
	 */
	function OneExtendedOrder(event_id, uuid) {
		OneOrder.call(this, event_id, uuid);
		
		this.event = new OneEvent(this.event_id);
	}
	
	/**
	 *
	 * @param event
	 * @param uuid
	 * @return {*}
	 */
	OneExtendedOrder.convertToExtended = function(event, uuid) {
		var order = event.orders.reduce(function(maybe_right_order, current_order) {
			if (!empty(maybe_right_order)) {
				
				return maybe_right_order;
			}
			
			return current_order.uuid === uuid ? current_order : maybe_right_order;
		}, {});
		
		order.event = event;
		
		return order;
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
	OneExtendedOrder.fetchOrder = function(event_id, uuid, fields, success) {
		fields = Fields.parseFields(fields);
		
		return OneEvent.fetchEvent(event_id, $.extend(true, {}, fields.pull('event'), {
			fields: new Fields({
				orders: {
					filters: 'uuid=' + uuid,
					fields: fields
				}
			})
		}), function(events) {
			if (isFunction(success)) {
				success(OneExtendedOrder.convertToExtended(events[0], uuid));
			}
		}).then(function(events) {
			
			return OneExtendedOrder.convertToExtended(events[0], uuid);
		});
	};
	
	return OneExtendedOrder;
}()));