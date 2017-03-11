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
	 * @param {...object} element
	 * @returns {number}
	 */
	UsersActivitiesCollection.prototype.push = function(element) {
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
	/**
	 *
	 * @param {(string|number)} user_id
	 * @param {AJAXData} data
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	UsersActivitiesCollection.fetch = function(user_id, data, success) {
		data = UsersActivitiesCollection.setDefaultData(data);
		return __APP.SERVER.getData('/api/v1/users/' + user_id + '/actions', data, success);
	};
	/**
	 *
	 * @param {(Array|string)} [fields]
	 * @param {(number|string)} [length]
	 * @param {string} [order_by]
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	UsersActivitiesCollection.prototype.fetch = function(fields, length, order_by, success) {
		var self = this,
			ajax_data = {
				fields: fields,
				offset: this.length,
				length: length
			};
		if (order_by) {
			ajax_data.order_by = order_by;
		}
		return this.constructor.fetch(this.user_id, ajax_data).then(function(data) {
			self.setData(data);
			return (new self.constructor()).setData(data);
		});
	};
	
	return UsersActivitiesCollection;
}()));