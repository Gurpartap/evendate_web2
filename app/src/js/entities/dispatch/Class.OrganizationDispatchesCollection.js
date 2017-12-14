/**
 *
 * @class OrganizationDispatchesCollection
 * @extends DispatchesCollection
 */
OrganizationDispatchesCollection = extending(DispatchesCollection, (function() {
	/**
	 *
	 * @param {number} organization_id
	 *
	 * @constructor
	 * @constructs OrganizationDispatchesCollection
	 *
	 * @property {number} organization_id
	 */
	function OrganizationDispatchesCollection(organization_id) {
		DispatchesCollection.call(this);
		
		Object.defineProperty(this, 'organization_id', {
			value: organization_id
		});
	}
	/**
	 *
	 * @param {(Fields|string)} [fields]
	 * @param {number} [length]
	 * @param {(string|Array)} [order_by]
	 *
	 * @return {Promise}
	 */
	OrganizationDispatchesCollection.prototype.fetch = function(fields, length, order_by) {
		var self = this;
	
		return DispatchesCollection.fetchDispatches({
			organization_id: this.organization_id,
			fields: fields || undefined,
			offset: this.length,
			length: length || undefined,
			order_by: order_by || undefined
		}).then(function(data) {
			self.setData(data);
			
			return self.__last_pushed;
		});
	};
	
	return OrganizationDispatchesCollection;
}()));