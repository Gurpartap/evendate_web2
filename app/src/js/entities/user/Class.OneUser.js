/**
 * @requires ../Class.OneEntity.js
 * @requires ../activity/Class.UsersActivitiesCollection.js
 */
/**
 * @class OneUser
 * @extends OneEntity
 */
OneUser = extending(OneEntity, (function() {
	/**
	 *
	 * @param {(string|number)} [user_id]
	 * @constructs OneUser
	 */
	function OneUser(user_id) {
		var self = this;
		
		this.id = setDefaultValue(user_id, 0);
		this.first_name = '';
		this.last_name = '';
		this.middle_name = '';
		/**
		 *
		 * @type {OneUser.GENDER}
		 */
		this.gender = '';
		this.avatar_url = '';
		this.type = '';
		this.is_friend = false;
		this.is_editor = false;
		this.blurred_image_url = '';
		this.link = '';
		/**
		 *
		 * @type {Array<OneUser.ACCOUNTS>}
		 */
		this.accounts = [];
		/**
		 *
		 * @type {Object<OneUser.ACCOUNTS, string>}
		 */
		this.accounts_links = {};
		Object.defineProperty(this, 'full_name', {
			enumerable: true,
			get: function() {
				return self.first_name + ' ' + self.last_name;
			}
		});
		this.subscriptions = new OrganizationsCollection();
		this.favored = new FavoredEventsCollection();
		this.actions = new UsersActivitiesCollection(user_id);
	}
	OneUser.prototype.subscriptions_fields = ['img_small_url', 'subscribed_count', 'new_events_count', 'actual_events_count'];
	Object.freeze(OneUser.prototype.subscriptions_fields);
	/**
	 * @const
	 * @enum {string}
	 */
	OneUser.ROLE = {
		UNAUTH: 'unauth',
		USER: 'user',
		MODERATOR: 'moderator',
		ADMIN: 'admin'
	};
	/**
	 * @const
	 * @enum {string}
	 */
	OneUser.GENDER = {
		MALE: 'male',
		FEMALE: 'female',
		NEUTRAL: 'neutral'
	};
	/**
	 * @const
	 * @enum {string}
	 */
	OneUser.ACCOUNTS = {
		VK: 'vk',
		GOOGLE: 'google',
		FACEBOOK: 'facebook'
	};
	/**
	 *
	 * @param {(string|number)} user_id
	 * @param {(Array|string)} [fields]
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	OneUser.fetchUser = function(user_id, fields, success) {
		return __APP.SERVER.getData('/api/v1/users/' + user_id, {fields: fields}, success);
	};
	/**
	 *
	 * @param {(string|number)} user_id
	 * @param {AJAXData} [data]
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	OneUser.fetchFavored = function(user_id, data, success) {
		return __APP.SERVER.getData('/api/v1/users/' + user_id + '/favorites', data, success);
	};
	/**
	 *
	 * @param {(string|number)} user_id
	 * @param {AJAXData} [data]
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	OneUser.fetchSubscriptions = function(user_id, data, success) {
		return __APP.SERVER.getData('/api/v1/users/' + user_id + '/subscriptions', data, success);
	};
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
	/**
	 * Returns highest role in privileges set
	 * @param {Array<Privilege>} privileges
	 * @returns {OneUser.ROLE}
	 */
	OneUser.recognizeRole = function(privileges) {
		var role = OneUser.ROLE.USER;
		privileges.forEach(function(privilege) {
			if (privilege.role_id == 1 || privilege.name == OneUser.ROLE.ADMIN)
				role = OneUser.ROLE.ADMIN;
			if ((privilege.role_id == 2 || privilege.name == OneUser.ROLE.MODERATOR) && role !== OneUser.ROLE.ADMIN)
				role = OneUser.ROLE.MODERATOR;
		});
		return role ? role : OneUser.ROLE.UNAUTH;
	};
	/**
	 *
	 * @param {(Array|string)} [fields]
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	OneUser.prototype.fetchUser = function(fields, success) {
		var self = this;
		fields = setDefaultValue(fields, []);
		
		return OneUser.fetchUser(self.id, fields, function(data) {
			data = data instanceof Array ? data[0] : data;
			self.setData(data);
			if (success && typeof success == 'function') {
				success.call(self, data);
			}
		});
	};
	/**
	 *
	 * @param {AJAXData} [data]
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	OneUser.prototype.fetchFavored = function(data, success) {
		var self = this;
		data.offset = this.favored.length;
		return OneUser.fetchFavored(self.id, data).done(function(favored) {
			self.favored.setData(favored);
			if (success && typeof success == 'function') {
				success.call(self, self.favored.last_pushed);
			}
		}).promise();
	};
	/**
	 *
	 * @param {AJAXData} [data]
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	OneUser.prototype.fetchSubscriptions = function(data, success) {
		var self = this;
		data.offset = this.favored.length;
		return OneUser.fetchSubscriptions(self.id, data).done(function(subscriptions) {
			self.subscriptions.setData(subscriptions);
			if (success && typeof success == 'function') {
				success.call(self, self.subscriptions.last_pushed);
			}
		}).promise();
	};
	
	Object.freeze(OneUser.ROLE);
	Object.freeze(OneUser.GENDER);
	Object.freeze(OneUser.ACCOUNTS);
	return OneUser;
}()));