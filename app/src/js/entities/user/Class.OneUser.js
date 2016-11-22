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
		 * @constructs FriendsActivitiesCollection
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
		 * @returns {jqXHR}
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
		 * @returns {jqXHR}
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
			return UsersActivitiesCollection.fetch(this.user_id, ajax_data, function(data) {
				self.setData(data);
				if (success && typeof success == 'function') {
					success.call(self, data);
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
		this.activities = new UsersActivitiesCollection(user_id);
		
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
	 * @returns {jqXHR}
	 */
	OneUser.fetchUserActivity = function(user_id, fields, success) {
		return UsersActivitiesCollection.fetch(user_id, {fields: fields}, success);
	};
	/**
	 *
	 * @param {(Array|string)} [fields]
	 * @param {AJAXCallback} [success]
	 * @returns {jqXHR}
	 */
	OneUser.prototype.fetchUser = function(fields, success) {
		var self = this,
			user_jqXHR;
		fields = setDefaultValue(fields, []);
		
		function afterFetch(data) {
			data = data instanceof Array ? data[0] : data;
			self.setData(data);
			if (success && typeof success == 'function') {
				success.call(self, data);
			}
		}
		
		if(fields.includes('activities')){
			user_jqXHR = OneAbstractUser.fetchUser(self.id, fields);
			
			__APP.SERVER.multipleAjax(user_jqXHR, OneUser.fetchUserActivity(self.id, []), function(user_data, activity_data) {
				user_data[0].activities = activity_data;
				afterFetch(user_data);
			});
		} else {
			user_jqXHR = OneAbstractUser.fetchUser(self.id, fields, function(data) {
				afterFetch(data);
			});
		}
		return user_jqXHR;
	};
	/**
	 *
	 * @param {(Array|string)} [fields]
	 * @param {AJAXData} [subscriptions_ajax_data]
	 * @param {AJAXCallback} [success]
	 * @returns {jqXHR}
	 */
	OneUser.prototype.fetchUserWithSubscriptions = function(fields, subscriptions_ajax_data, success) {
		var self = this;
		fields = typeof fields == 'string' ? fields.split(',') : fields ? fields : [];
		if (subscriptions_ajax_data) {
			subscriptions_ajax_data.fields = subscriptions_ajax_data.fields.join(',');
			fields.push('subscriptions' + JSON.stringify($.extend({}, subscriptions_ajax_data, {offset: self.subscriptions.length})));
		} else {
			fields.push('subscriptions' + JSON.stringify({
					fields: self.subscriptions_fields.join(','),
					offset: self.subscriptions.length
				}));
		}
		return OneAbstractUser.fetchUser(self.id, fields, function(data) {
			self.setData(data);
			if (success && typeof success == 'function') {
				success.call(self, data[0]);
			}
		});
	};
	
	return OneUser;
}()));