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
		Object.defineProperty(this, 'full_name', {
			enumerable: true,
			get: function() {
				return self.first_name + ' ' + self.last_name;
			}
		});
		this.subscriptions = new OrganizationsCollection();
		
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
		FACEBOOK: 'facebook',
		GOOGLE: 'google'
	};
	/**
	 *
	 * @param {(string|number)} user_id
	 * @param {(Array|string)} [fields]
	 * @param {AJAXCallback} [success]
	 * @returns {jqXHR}
	 */
	OneAbstractUser.fetchUser = function(user_id, fields, success) {
		return __APP.SERVER.getData('/api/v1/users/' + user_id, fields || (Array.isArray(fields) && fields.length) ? {fields: fields} : {}, success);
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
	
	Object.freeze(OneAbstractUser.ROLE);
	Object.freeze(OneAbstractUser.GENDER);
	Object.freeze(OneAbstractUser.ACCOUNTS);
	return OneAbstractUser;
}()));