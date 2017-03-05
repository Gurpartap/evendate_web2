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
	 *
	 * @property {(number|string)} id
	 * @property {string} ?first_name
	 * @property {string} ?last_name
	 * @property {string} ?middle_name
	 * @property {string} ?full_name
	 * @property {OneUser.GENDER} ?gender
	 * @property {string} ?avatar_url
	 * @property {string} ?blurred_image_url
	 * @property {string} ?link
	 * @property {string} ?type
	 * @property {string} ?role
	 * @property {boolean} ?is_friend
	 * @property {boolean} ?is_editor
	 *
	 * @property {Array<OneUser.ACCOUNTS>} accounts
	 * @property {Object<OneUser.ACCOUNTS, string>} accounts_links
	 * @property {string} ?vk_uid
	 * @property {string} ?google_uid
	 * @property {string} ?facebook_uid
	 *
	 * @property {OrganizationsCollection} subscriptions
	 * @property {FavoredEventsCollection} favored
	 * @property {UsersActivitiesCollection} actions
	 */
	function OneUser(user_id) {
		var self = this;
		
		this.id = setDefaultValue(user_id, 0);
		this.first_name = null;
		this.last_name = null;
		this.middle_name = null;
		this.gender = null;
		this.avatar_url = null;
		this.blurred_image_url = null;
		this.link = null;
		this.type = null;
		this.role = null;
		this.is_friend = null;
		this.is_editor = null;
		
		this.accounts = [];
		this.accounts_links = {};
		this.vk_uid = null;
		this.google_uid = null;
		this.facebook_uid = null;
		
		this.subscriptions = new OrganizationsCollection();
		this.favored = new FavoredEventsCollection();
		this.actions = new UsersActivitiesCollection(user_id);
		
		Object.defineProperty(this, 'full_name', {
			enumerable: true,
			get: function() {
				return self.first_name + ' ' + self.last_name;
			}
		});
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
	Object.freeze(OneUser.ROLE);
	/**
	 * @const
	 * @enum {string}
	 */
	OneUser.GENDER = {
		MALE: 'male',
		FEMALE: 'female',
		NEUTRAL: 'neutral'
	};
	Object.freeze(OneUser.GENDER);
	/**
	 * @const
	 * @enum {string}
	 */
	OneUser.ACCOUNTS = {
		VK: 'vk',
		GOOGLE: 'google',
		FACEBOOK: 'facebook'
	};
	Object.freeze(OneUser.ACCOUNTS);
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
		data.offset = this.subscriptions.length;
		return OneUser.fetchSubscriptions(self.id, data).done(function(subscriptions) {
			self.subscriptions.setData(subscriptions);
			if (success && typeof success == 'function') {
				success.call(self, self.subscriptions.last_pushed);
			}
		}).promise();
	};
	
	return OneUser;
}()));