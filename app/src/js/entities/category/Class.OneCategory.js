/**
 * @requires ../Class.OneEntity.js
 */
/**
 *
 * @constructor
 * @augments OneEntity
 * @param {(string|number)} [category_id]
 * @param {boolean} [is_loading_continuous]
 */
function OneCategory(category_id, is_loading_continuous) {
	this.id = category_id ? category_id : 0;
	this.name = '';
	this.order_position = 0;
	this.organizations = new OrganizationsCollection();
	
	if (category_id && is_loading_continuous) {
		this.loading = true;
		this.fetchCategory([], function() {
			this.loading = false;
			$(window).trigger('fetch.OneCategory');
		});
	}
}
OneCategory.extend(OneEntity);
/**
 *
 * @param {(string|number)} category_id
 * @param {AJAXData} data
 * @param {AJAXCallback} [success]
 * @return {jqXHR}
 */
OneCategory.fetchCategory = function(category_id, data, success) {
	return __APP.SERVER.getData('/api/v1/organizations/types', $.extend({}, data, {id: category_id}), success);
};
/**
 *
 * @param {(Array|string)} fields
 * @param {AJAXCallback} [success]
 * @return {jqXHR}
 */
OneCategory.prototype.fetchCategory = function(fields, success) {
	var self = this;
	return this.constructor.fetchCategory(self.id, fields, function(data) {
		self.setData(data);
		if (success && typeof success == 'function') {
			success.call(self, data[0]);
		}
	});
};