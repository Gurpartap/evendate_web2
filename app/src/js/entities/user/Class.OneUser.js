/**
 * @requires Class.OneAbstractUser.js
 * @requires ../activity/Class.AbstractActivitiesCollection.js
 */
/**
 * @class OneUser
 * @extends OneAbstractUser
 */
OneUser = extending(OneAbstractUser, (function() {
	/**
	 * @class UsersActivitiesCollection
	 * @extends AbstractActivitiesCollection
	 */
	var UsersActivitiesCollection = extending(AbstractActivitiesCollection, (function() {
		/**
		 *
		 * @constructs UsersActivitiesCollection
		 * @param {(string|number)} [user_id]
		 */
		function UsersActivitiesCollection(user_id) {
			Object.defineProperty(this, 'user_id', {value: user_id});
		}
		/**
		 *
		 * @param {(string|number)} user_id
		 * @param {AJAXData} data
		 * @param {AJAXCallback} [success]
		 * @returns {jqPromise}
		 */
		UsersActivitiesCollection.fetch = function(user_id, data, success) {
			data = AbstractActivitiesCollection.setDefaultData(data);
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
			return this.constructor.fetch(this.user_id, ajax_data, function(data) {
				self.setData(data);
				if (success && typeof success == 'function') {
					success.call(self, (new self.constructor()).setData(data));
				}
			});
		};
		
		return UsersActivitiesCollection;
	}()));
	/**
	 *
	 * @constructs OneUser
	 * @param {(string|number)} [user_id]
	 * @param {boolean} [is_loading_continuous]
	 */
	function OneUser(user_id, is_loading_continuous) {
		OneAbstractUser.call(this, user_id);
		
		/**
		 * @type {Array<OneAbstractUser.ACCOUNTS>}
		 */
		this.accounts = [];
		this.actions = new UsersActivitiesCollection(user_id);
		
		if (user_id && is_loading_continuous) {
			this.loading = true;
			this.fetchUser([], function() {
				this.loading = false;
				$(window).trigger('fetch.OneUser');
			});
		}
	}
	/**
	 *
	 * @param {(string|number)} user_id
	 * @param {(Array|string)} [fields]
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	OneUser.fetchUserActivity = function(user_id, fields, success) {
		return UsersActivitiesCollection.fetch(user_id, {fields: fields}, success);
	};
	
	return OneUser;
}()));