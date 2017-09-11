/**
 * @requires Class.AbstractFinanceModel.js
 */
/**
 *
 * @class EventFinanceModel
 * @extends AbstractFinanceModel
 */
EventFinanceModel = extending(AbstractFinanceModel, (function() {
	/**
	 *
	 * @param {number} event_id
	 *
	 * @constructor
	 * @constructs EventFinanceModel
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
	function EventFinanceModel(event_id) {
		AbstractFinanceModel.call(this);
		
		this.sum_amount = null;
		this.sold_count = null;
		this.checked_out_count = null;
		this.ticket_dynamics = new EventFinanceStatisticsCollection(event_id, 'ticket_dynamics');
		this.income_dynamics = new EventFinanceStatisticsCollection(event_id, 'income_dynamics');
	}
	
	return EventFinanceModel;
}()));