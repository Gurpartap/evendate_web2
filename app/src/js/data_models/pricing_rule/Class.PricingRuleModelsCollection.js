/**
 * @requires ../Class.AbstractDataModelsCollection.js
 */
/**
 *
 * @class PricingRuleModelsCollection
 * @extends AbstractDataModelsCollection
 */
PricingRuleModelsCollection = extending(AbstractDataModelsCollection, (function() {
	/**
	 *
	 * @constructor
	 * @constructs PricingRuleModelsCollection
	 *
	 * @property {Array<PricingRuleModel>}
	 */
	function PricingRuleModelsCollection() {
		AbstractDataModelsCollection.call(this);
		
		Object.defineProperty(this, 'enabled_rules', {
			get: function() {
				
				return this.filter(function(rule) {
					
					return rule.enabled;
				});
			}
		});
	}
	PricingRuleModelsCollection.prototype.collection_of = PricingRuleModel;
	
	return PricingRuleModelsCollection;
}()));