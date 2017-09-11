/**
 * @requires Class.AbstractFinanceModel.js
 */
/**
 *
 * @class OrganizationFinanceModel
 * @extends AbstractFinanceModel
 */
OrganizationFinanceModel = extending(AbstractFinanceModel, (function() {
	/**
	 *
	 * @param {number} organization_id
	 *
	 * @constructor
	 * @constructs OrganizationFinanceModel
	 *
	 * @property {?number} total_income
	 * @property {?number} withdraw_available
	 * @property {?number} processing_commission_value
	 * @property {?number} processing_commission
	 * @property {?number} evendate_commission_value
	 * @property {?WithdrawModelsCollection} withdraws
	 * @property {OrganizationFinanceStatisticsCollection} ticket_dynamics
	 * @property {OrganizationFinanceStatisticsCollection} income_dynamics
	 */
	function OrganizationFinanceModel(organization_id) {
		AbstractFinanceModel.call(this);
		
		this.withdraws = new WithdrawModelsCollection(organization_id);
		this.ticket_dynamics = new OrganizationFinanceStatisticsCollection(organization_id, 'ticket_dynamics');
		this.income_dynamics = new OrganizationFinanceStatisticsCollection(organization_id, 'income_dynamics');
	}
	
	return OrganizationFinanceModel;
}()));