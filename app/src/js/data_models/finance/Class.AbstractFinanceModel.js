/**
 * @requires ../../entities/Class.OneEntity.js
 */
/**
 *
 * @abstract
 * @class AbstractFinanceModel
 * @extends OneEntity
 */
AbstractFinanceModel = extending(OneEntity, (function() {
	/**
	 *
	 * @constructor
	 * @constructs AbstractFinanceModel
	 *
	 * @property {?number} total_income
	 * @property {?number} withdraw_available
	 * @property {?number} processing_commission_value
	 * @property {?number} processing_commission
	 * @property {?number} evendate_commission_value
	 * @property {StatisticsCollection} ticket_dynamics
	 * @property {StatisticsCollection} income_dynamics
	 */
	function AbstractFinanceModel() {
		OneEntity.call(this);
		
		this.total_income = null;
		this.withdraw_available = null;
		this.processing_commission_value = null;
		this.processing_commission = null;
		this.evendate_commission_value = null;
		this.ticket_dynamics = new StatisticsCollection('ticket_dynamics');
		this.income_dynamics = new StatisticsCollection('ticket_dynamics');
	}
	
	return AbstractFinanceModel;
}()));