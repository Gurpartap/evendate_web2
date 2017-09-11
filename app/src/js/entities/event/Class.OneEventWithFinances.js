/**
 * @requires Class.OneEvent.js
 */
/**
 *
 * @class OneEventWithFinances
 * @extends OneEvent
 */
OneEventWithFinances = extending(OneEvent, (function() {
	/**
	 *
	 * @constructor
	 * @constructs OneEventWithFinances
	 *
	 * @inheritDoc OneEvent
	 *
	 * @property {?number} sum_amount
	 * @property {?number} sold_count
	 * @property {?number} checked_out_count
	 * @property {?number} total_income
	 * @property {?number} withdraw_available
	 * @property {?number} processing_commission_value
	 * @property {?number} processing_commission
	 * @property {?number} evendate_commission_value
	 * @property {EventFinanceStatisticsCollection} ticket_dynamics
	 * @property {EventFinanceStatisticsCollection} income_dynamics
	 */
	function OneEventWithFinances(event_id) {
		OneEvent.call(this, event_id);
		
		this.sum_amount = null;
		this.sold_count = null;
		this.checked_out_count = null;
		this.total_income = null;
		this.withdraw_available = null;
		this.processing_commission_value = null;
		this.processing_commission = null;
		this.evendate_commission_value = null;
		this.ticket_dynamics = new EventFinanceStatisticsCollection(event_id, 'ticket_dynamics');
		this.income_dynamics = new EventFinanceStatisticsCollection(event_id, 'income_dynamics');
	}
	
	OneEventWithFinances.FINANCE_FIELDS = [
		'sum_amount',
		'sold_count',
		'checked_out_count',
		'total_income',
		'withdraw_available',
		'processing_commission_value',
		'processing_commission',
		'evendate_commission_value',
		'ticket_dynamics',
		'income_dynamics'
	];
	/**
	 *
	 * @param {(string|number)} event_id
	 * @param {Fields} [fields]
	 * @param {AJAXCallback} [success]
	 *
	 * @returns {jqPromise}
	 */
	OneEventWithFinances.fetchEvent = function(event_id, fields, success) {
		var finance_fields = new Fields();
		
		fields = new Fields(fields);
		
		fields.forEach(function(field) {
			if (OneEventWithFinances.FINANCE_FIELDS.contains(field)) {
				finance_fields.add(field, fields.pull(field));
			}
		});
		
		if (finance_fields.length) {
			
			return __APP.SERVER.multipleAjax(
				__APP.SERVER.getData('/api/v1/events/{event_id}'.format({event_id: event_id}), {fields: fields}),
				__APP.SERVER.getData(EventStatisticsCollection.ENDPOINT.FINANCE.format({event_id: event_id}), {fields: finance_fields})
			).done(function(event_data, finances_data) {
				if (isFunction(success)) {
					success(Object.assign({}, (event_data instanceof Array ? event_data[0] : event_data), finances_data));
				}
			});
		}
		
		return __APP.SERVER.getData('/api/v1/events/' + event_id, {fields: new Fields(fields)}, success);
	};
	
	return OneEventWithFinances;
}()));