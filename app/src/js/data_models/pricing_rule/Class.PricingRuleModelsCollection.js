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
	 */
	function PricingRuleModelsCollection() {
		AbstractDataModelsCollection.call(this);
	}
	PricingRuleModelsCollection.prototype.collection_of = PricingRuleModel;
	
	return PricingRuleModelsCollection;
}()));