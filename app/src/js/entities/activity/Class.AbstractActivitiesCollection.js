/**
 * @requires ../Class.EntitiesCollection.js
 * @requires Class.OneEventActivity.js
 * @requires Class.OneOrganizationActivity.js
 */
/**
 * @class AbstractActivitiesCollection
 * @extends EntitiesCollection
 */
AbstractActivitiesCollection = extending(EntitiesCollection, (function() {
	/**
	 *
	 * @constructs AbstractActivitiesCollection
	 */
	function AbstractActivitiesCollection() {}
	Object.defineProperty(AbstractActivitiesCollection.prototype, 'collection_of', {value: OneAbstractActivity});
	
	AbstractActivitiesCollection.setDefaultData = function(data) {
		if(typeof data.fields === 'string'){
			data.fields = data.fields.split(',');
		} else if (!(data.fields instanceof Array)) {
			data.fields = [];
		}
		data.fields = data.fields.merge([
			'created_at',
			'type_code',
			'event',
			'organization'.appendAjaxData({
				fields: ['img_small_url']
			})
		]);
		data.order_by = setDefaultValue(data.order_by, '-created_at');
		data.length = setDefaultValue(data.length, 20);
		return data;
	};
	/**
	 *
	 * @param {...object} element
	 * @returns {number}
	 */
	AbstractActivitiesCollection.prototype.push = function(element) {
		for (var i = 0; i < arguments.length; i++) {
			if(arguments[i] instanceof this.collection_of){
				this[this.length] = arguments[i];
			} else if (arguments[i].event_id != undefined) {
				this[this.length] = (new OneEventActivity()).setData(arguments[i]);
			} else if (arguments[i].organization_id != undefined) {
				this[this.length] = (new OneOrganizationActivity()).setData(arguments[i]);
			}
			this.length++;
		}
		return this.length;
	};
	
	return AbstractActivitiesCollection;
}()));