/**
 * @requires ../Class.EntitiesCollection.js
 * @requires Class.OneEventActivity.js
 * @requires Class.OneOrganizationActivity.js
 */
/**
 * @class UsersActivitiesCollection
 * @extends EntitiesCollection
 */
UsersActivitiesCollection = extending(EntitiesCollection, (function() {
	/**
	 *
	 * @constructs UsersActivitiesCollection
	 */
	function UsersActivitiesCollection(user_id) {
		EntitiesCollection.call(this);
		Object.defineProperty(this, 'user_id', {value: user_id});
	}
	Object.defineProperty(UsersActivitiesCollection.prototype, 'collection_of', {value: OneAbstractActivity});
	
	UsersActivitiesCollection.setDefaultData = function(data) {
		if(typeof data.fields === 'string'){
			data.fields = data.fields.split(',');
		} else if (!(data.fields instanceof Array)) {
			data.fields = [];
		}
		data.fields = data.fields.merge([
			'created_at',
			'type_code',
			'event',
			'organization'
		]);
		data.order_by = setDefaultValue(data.order_by, '-created_at');
		data.length = setDefaultValue(data.length, 20);
		return data;
	};
	/**
	 *
	 * @param {(string|number)} user_id
	 * @param {AJAXData} data
	 * @param {AJAXCallback} [success]
	 * @returns {Promise}
	 */
	UsersActivitiesCollection.fetch = function(user_id, data, success) {
		data = UsersActivitiesCollection.setDefaultData(data);
		return __APP.SERVER.getData('/api/v1/users/' + user_id + '/actions', data, success);
	};
	/**
	 *
	 * @param {(Fields|Array|string)} [fields]
	 * @param {(number|string)} [length]
	 * @param {string} [order_by]
	 * @param {AJAXCallback} [success]
	 * @returns {Promise}
	 */
	UsersActivitiesCollection.prototype.fetch = function(fields, length, order_by, success) {
		var ajax_data = {
				fields: fields,
				offset: this.length,
				length: length
			};
		
		if (order_by) {
			ajax_data.order_by = order_by;
		}
		return this.constructor.fetch(this.user_id, ajax_data).then(data => {
			this.setData(data);
			
			return (new this.constructor()).setData(data);
		});
	};
	
	return UsersActivitiesCollection;
}()));