/**
 * @requires ../Class.OneEntity.js
 */
/**
 * @class OneAbstractUser
 * @extends OneEntity
 */
OneAbstractUser = extending(OneEntity, (function() {
	/**
	 *
	 * @param {(string|number)} [user_id]
	 * @constructs OneAbstractUser
	 */
	function OneAbstractUser(user_id) {
		var self = this;
		
		this.id = setDefaultValue(user_id, 0);
		this.first_name = '';
		this.last_name = '';
		this.middle_name = '';
		/**
		 *
		 * @type {OneAbstractUser.GENDER}
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
		 * @type {Array<OneAbstractUser.ACCOUNTS>}
		 */
		this.accounts = [];
		/**
		 *
		 * @type {Object<OneAbstractUser.ACCOUNTS, string>}
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
		this.actions = new AbstractActivitiesCollection();
	}
	OneAbstractUser.prototype.subscriptions_fields = ['img_small_url', 'subscribed_count', 'new_events_count', 'actual_events_count'];
	Object.freeze(OneAbstractUser.prototype.subscriptions_fields);
	/**
	 * @const
	 * @enum {string}
	 */
	OneAbstractUser.ROLE = {
		UNAUTH: 'unauth',
		USER: 'user',
		MODERATOR: 'moderator',
		ADMIN: 'admin'
	};
	/**
	 * @const
	 * @enum {string}
	 */
	OneAbstractUser.GENDER = {
		MALE: 'male',
		FEMALE: 'female',
		NEUTRAL: 'neutral'
	};
	/**
	 * @const
	 * @enum {string}
	 */
	OneAbstractUser.ACCOUNTS = {
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
	OneAbstractUser.fetchUser = function(user_id, fields, success) {
		return __APP.SERVER.getData('/api/v1/users/' + user_id, {fields: fields}, success);
	};
	/**
	 * Returns highest role in privileges set
	 * @param {Array<Privilege>} privileges
	 * @returns {OneAbstractUser.ROLE}
	 */
	OneAbstractUser.recognizeRole = function(privileges) {
		var role = OneAbstractUser.ROLE.USER;
		privileges.forEach(function(privilege) {
			if (privilege.role_id == 1 || privilege.name == OneAbstractUser.ROLE.ADMIN)
				role = OneAbstractUser.ROLE.ADMIN;
			if ((privilege.role_id == 2 || privilege.name == OneAbstractUser.ROLE.MODERATOR) && role !== OneAbstractUser.ROLE.ADMIN)
				role = OneAbstractUser.ROLE.MODERATOR;
		});
		return role ? role : OneAbstractUser.ROLE.UNAUTH;
	};
	/**
	 *
	 * @param {(Array|string)} [fields]
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	OneAbstractUser.prototype.fetchUser = function(fields, success) {
		var self = this;
		fields = setDefaultValue(fields, []);
		
		return OneAbstractUser.fetchUser(self.id, fields, function(data) {
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
	OneAbstractUser.prototype.fetchFavored = function(data, success) {
		var self = this;
		data.offset = this.favored.length;
		return OneAbstractUser.fetchUser(self.id, new Fields({favored: data})).done(function(data) {
			data = data instanceof Array ? data[0] : data;
			self.setData({favored: data.favored});
			if (success && typeof success == 'function') {
				success.call(self, data.favored);
			}
		});
	};
	
	Object.freeze(OneAbstractUser.ROLE);
	Object.freeze(OneAbstractUser.GENDER);
	Object.freeze(OneAbstractUser.ACCOUNTS);
	return OneAbstractUser;
}()));