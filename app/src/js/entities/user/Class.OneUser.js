/**
 * @requires ../Class.OneEntity.js
 */
/**
 *
 * @constructor
 * @augments OneEntity
 * @param {(string|number)} [user_id]
 * @param {boolean} [is_loading_continuous]
 */
function OneUser(user_id, is_loading_continuous) {
	var self = this;
	this.id = user_id ? user_id : 0;
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
	Object.defineProperty(this, 'full_name', {
		get: function() {
			return self.first_name + ' ' + self.last_name;
		}
	});
	this.subscriptions = new OrganizationsCollection();
	/**
	 * @type {Array<OneUser.ACCOUNTS>}
	 */
	this.accounts = [];
	
	if (user_id && is_loading_continuous) {
		this.loading = true;
		this.fetchUser([], function() {
			this.loading = false;
			$(window).trigger('fetch.OneUser');
		});
	}
}
OneUser.extend(OneEntity);
/**
 * @const
 * @enum {string}
 */
OneUser.ACCOUNTS = {
	VK: 'vk',
	FACEBOOK: 'facebook',
	GOOGLE: 'google'
};
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

Object.defineProperty(OneUser.prototype, 'subscriptions_fields', {
	value: ['img_small_url', 'subscribed_count', 'new_events_count', 'actual_events_count']
});
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
 * @param {(string|number)} user_id
 * @param {(Array|string)} [fields]
 * @param {AJAXCallback} [success]
 * @returns {jqXHR}
 */
OneUser.fetchUser = function(user_id, fields, success) {
	return __APP.SERVER.getData('/api/v1/users/' + user_id, fields || (Array.isArray(fields) && fields.length) ? {fields: fields} : {}, success);
};
/**
 *
 * @param {(Array|string)} [fields]
 * @param {AJAXCallback} [success]
 * @returns {jqXHR}
 */
OneUser.prototype.fetchUser = function(fields, success) {
	var self = this;
	return OneUser.fetchUser(self.id, fields, function(data) {
		self.setData(data);
		if (success && typeof success == 'function') {
			success.call(self, data[0]);
		}
	});
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
	return OneUser.fetchUser(self.id, fields, function(data) {
		self.setData(data);
		if (success && typeof success == 'function') {
			success.call(self, data[0]);
		}
	});
};