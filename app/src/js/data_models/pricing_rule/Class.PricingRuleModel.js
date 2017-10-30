/**
 * @requires ../Class.AbstractDataModel.js
 */
/**
 *
 * @class PricingRuleModel
 * @extends AbstractDataModel
 */
PricingRuleModel = extending(AbstractDataModel, (function() {
	/**
	 *
	 * @constructor
	 * @constructs PricingRuleModel
	 *
	 * @property {?string} uuid
	 * @property {?string} name
	 * @property {?PricingRuleModel.TYPE} type_code
	 * @property {?number} effort
	 * @property {?number} min_count
	 * @property {?number} max_count
	 * @property {?boolean} is_percentage
	 * @property {?boolean} is_fixed
	 * @property {?boolean} enabled
	 */
	function PricingRuleModel() {
		OneEntity.call(this);
		
		this.uuid = null;
		this.name = null;
		this.type_code = null;
		this.effort = null;
		this.min_count = null;
		this.max_count = null;
		this.is_percentage = null;
		this.is_fixed = null;
		this.enabled = null;
	}
	
	PricingRuleModel.prototype.ID_PROP_NAME = 'uuid';
	/**
	 *
	 * @enum {string}
	 */
	PricingRuleModel.TYPE = Object.freeze({
		ORDER_SUM_BETWEEN: 'order_sum_between',
		TICKETS_COUNT_BETWEEN: 'tickets_count_between',
		USER_ORDER_SUM_BETWEEN: 'user_orders_sum_between',
		USER_ORDER_COUNT_BETWEEN: 'user_orders_count_between'
	});
	
	return PricingRuleModel;
}()));