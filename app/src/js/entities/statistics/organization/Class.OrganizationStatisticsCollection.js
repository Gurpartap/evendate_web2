/**
 * @requires ../Class.StatisticsCollection.js
 */
/**
 *
 * @class OrganizationStatisticsCollection
 * @extends StatisticsCollection
 */
OrganizationStatisticsCollection = extending(StatisticsCollection, (function() {
	/**
	 *
	 * @param {number} org_id
	 * @param {string} field
	 *
	 * @constructor
	 * @constructs OrganizationStatisticsCollection
	 *
	 * @property {number} org_id
	 * @property {string} field
	 */
	function OrganizationStatisticsCollection(org_id, field) {
		StatisticsCollection.call(this, field);
		
		Object.defineProperty(this, 'org_id', {
			get: function() {
				
				return org_id;
			}
		});
	}
	
	OrganizationStatisticsCollection.ENDPOINT = Object.freeze({
		ORGANIZATION: '/statistics/organizations/{org_id}',
		FINANCE: '/statistics/organizations/{org_id}/finance'
	});
	
	/**
	 *
	 * @param {number} org_id
	 * @param {Fields} fields
	 * @param {AJAXCallback} [success]
	 *
	 * @returns Promise
	 */
	OrganizationStatisticsCollection.fetchStatistics = function(org_id, fields, success) {
		
		return __APP.SERVER.getData(OrganizationStatisticsCollection.ENDPOINT.ORGANIZATION.format({org_id: org_id}), {
			fields: fields
		}, success);
	};
	/**
	 *
	 * @inheritDoc
	 */
	OrganizationStatisticsCollection.prototype.fetch = function(scale, since, till, success) {
		var self = this,
			fields_obj = {};
		
		fields_obj[this.field] = Object.assign({
			scale: scale,
			since: since,
			till: till
		});
		
		return this.constructor.fetchStatistics(this.org_id, new Fields(fields_obj), function(data) {
			self.setData(data[self.field]);
			
			if (isFunction(success)) {
				success.call(self, self.__last_pushed);
			}
		});
	};
	
	return OrganizationStatisticsCollection;
}()));