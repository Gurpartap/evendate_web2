/**
 * @requires ../../entities/Class.EntitiesCollection.js
 * @requires Class.WithdrawModel.js
 */
/**
 *
 * @class WithdrawModelsCollection
 * @extends EntitiesCollection
 */
WithdrawModelsCollection = extending(EntitiesCollection, (function() {
	/**
	 *
	 * @constructor
	 * @constructs WithdrawModelsCollection
	 */
	function WithdrawModelsCollection(organization_id) {
		EntitiesCollection.call(this);
		
		Object.defineProperty(this, 'org_id', {
			get: function() {
				
				return organization_id;
			}
		});
	}
	
	WithdrawModelsCollection.prototype.collection_of = WithdrawModel;
	
	/**
	 *
	 * @param {number} organization_id
	 * @param {Fields} [fields]
	 * @param {AJAXCallback} [success]
	 *
	 * @returns jqPromise
	 */
	WithdrawModelsCollection.fetchWithdraws = function(organization_id, fields, success) {
		
		return __APP.SERVER.getData(OrganizationStatisticsCollection.ENDPOINT.FINANCE.format({org_id: organization_id}), {
			fields: new Fields({
				withdraws: {
					fields: new Fields(fields)
				}
			})
		}, success);
	};
	/**
	 *
	 * @param {Fields} [fields]
	 * @param {AJAXCallback} [success]
	 *
	 * @returns jqPromise
	 */
	WithdrawModelsCollection.prototype.fetch = function(fields, success) {
		var self = this;
		
		return WithdrawModelsCollection.fetchWithdraws(this.org_id, fields, function(data) {
			self.setData(data['withdraws']);
			
			if (isFunction(success)) {
				success.call(self, self.__last_pushed);
			}
		});
	};
	
	return WithdrawModelsCollection;
}()));