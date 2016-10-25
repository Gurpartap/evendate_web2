/**
 * @requires ../Class.EntitiesCollection.js
 * @requires Class.OneCategory.js
 */
/**
 *
 * @constructor
 * @augments EntitiesCollection
 */
function CategoriesCollection() {}
CategoriesCollection.extend(EntitiesCollection);
CategoriesCollection.prototype.collection_of = OneCategory;
/**
 *
 * @param {AJAXData} data
 * @param {AJAXCallback} [success]
 */
CategoriesCollection.fetchCategories = function(data, success) {
	return __APP.SERVER.getData('/api/v1/organizations/types', data, success);
};
/**
 *
 * @param {AJAXData} data
 * @param {(number|string)} [length]
 * @param {AJAXCallback} [success]
 */
CategoriesCollection.prototype.fetchCategories = function(data, length, success) {
	var self = this,
		ajax_data = $.extend({}, data, {
			offset: this.length,
			length: length
		});
	return this.constructor.fetchCategories(ajax_data, function(data) {
		self.setData(data);
		if (success && typeof success == 'function') {
			success.call(self, data);
		}
	});
};
/**
 *
 * @param {AJAXData} categories_ajax_data
 * @param {AJAXData} orgs_ajax_data
 * @param {(number|string)} [length]
 * @param {AJAXCallback} [success]
 */
CategoriesCollection.prototype.fetchCategoriesWithOrganizations = function(categories_ajax_data, orgs_ajax_data, length, success) {
	var self = this,
		ajax_data = $.extend({}, categories_ajax_data, {
			offset: this.length,
			length: length
		}),
		org_field = 'organizations' + JSON.stringify(__APP.SERVER.validateData(orgs_ajax_data));
	if (!ajax_data.fields) {
		ajax_data.fields = [];
	} else if (!Array.isArray(ajax_data.fields)) {
		ajax_data.fields = ajax_data.fields.split(',');
	}
	ajax_data.fields.push(org_field);
	return this.constructor.fetchCategories(ajax_data, function(data) {
		self.setData(data);
		if (success && typeof success == 'function') {
			success.call(self, data);
		}
	});
};