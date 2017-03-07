/**
 * @requires ../Class.OneEntity.js
 */
/**
 *
 * @class OneCategory
 * @extends OneEntity
 */
OneCategory = extending(OneEntity, (function() {
	/**
	 *
	 * @param {(string|number)} [category_id]
	 * @param {boolean} [is_loading_continuous]
	 * @constructor
	 * @constructs OneCategory
	 *
	 * @property {(number|string)} id
	 * @property {string} ?name
	 * @property {number} ?order_position
	 * @property {OrganizationsCollection} organizations
	 */
	function OneCategory(category_id, is_loading_continuous) {
		this.id = setDefaultValue(category_id, 0);
		this.name = null;
		this.order_position = null;
		this.organizations = new OrganizationsCollection();
		
		this.loading = false;
		if (category_id && is_loading_continuous) {
			this.loading = true;
			this.fetchCategory([], function() {
				this.loading = false;
				$(window).trigger('fetch.OneCategory');
			});
		}
	}
	/**
	 *
	 * @param {(string|number)} category_id
	 * @param {AJAXData} data
	 * @param {AJAXCallback} [success]
	 * @return {jqPromise}
	 */
	OneCategory.fetchCategory = function(category_id, data, success) {
		return __APP.SERVER.getData('/api/v1/organizations/types', $.extend({}, data, {id: category_id}), success);
	};
	/**
	 *
	 * @param {(Array|string)} fields
	 * @param {AJAXCallback} [success]
	 * @return {jqPromise}
	 */
	OneCategory.prototype.fetchCategory = function(fields, success) {
		var self = this;
		return this.constructor.fetchCategory(self.id, {fields: fields}, function(data) {
			self.setData(data);
			if (success && typeof success == 'function') {
				success.call(self, data[0]);
			}
		});
	};
	
	return OneCategory;
}()));