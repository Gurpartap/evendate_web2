/**
 * @requires ../Class.EntitiesCollection.js
 * @requires Class.OneCity.js
 */
/**
 *
 * @class CitiesCollection
 * @extends EntitiesCollection
 */
CitiesCollection = extending(EntitiesCollection, (function() {
	/**
	 *
	 * @constructor
	 * @constructs CitiesCollection
	 */
	function CitiesCollection() {}
	
	CitiesCollection.prototype.collection_of = OneCity;
	/**
	 *
	 * @param {AJAXData} data
	 * @param {AJAXCallback} success
	 * @return {jqPromise}
	 */
	CitiesCollection.fetchCities = function(data, success) {
		return __APP.SERVER.getData('/api/v1/organizations/cities', data, success);
	};
	/**
	 *
	 * @param {(Fields|Array|string)} [fields]
	 * @param {number} [length]
	 * @param {string} [order_by]
	 * @param {function} [success]
	 * @return {jqPromise}
	 */
	CitiesCollection.prototype.fetchCities = function(fields, length, order_by, success) {
		var self = this;
		return CitiesCollection.fetchCities({
			fields: fields,
			offset: this.length,
			length: length,
			order_by: order_by || undefined
		}, function(data) {
			self.setData(data);
			if (success && typeof success == 'function') {
				success.call(self, self.last_pushed);
			}
		});
	};
	
	return CitiesCollection;
}()));