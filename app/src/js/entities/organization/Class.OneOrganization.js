/**
 * @requires ../Class.OneEntity.js
 *
 * @requires ../../data_models/Class.TariffModel.js
 * @requires ../../data_models/finance/Class.OrganizationFinanceModel.js
 */
/**
 * @typedef {object} Privilege
 * @property {number} role_id
 * @property {OneUser.ROLE} name
 */
/**
 *
 * @class OneOrganization
 * @extends OneEntity
 */
OneOrganization = extending(OneEntity, (function() {
	/**
	 *
	 * @param {(string|number)} [organization_id=0]
	 * @param {boolean} [is_loading_continuous]
	 * @constructor
	 * @constructs OneOrganization
	 *
	 * @property {number} id
	 * @property {?string} name
	 * @property {?string} short_name
	 * @property {?string} description
	 *
	 * @property {?string} img_url
	 * @property {?string} img_small_url
	 * @property {?string} img_medium_url
	 * @property {?string} logo_large_url
	 * @property {?string} logo_small_url
	 * @property {?string} logo_medium_url
	 *
	 * @property {?string} background_img_url
	 * @property {?string} background_small_img_url
	 * @property {?string} background_medium_img_url
	 *
	 * @property {?number} type_id
	 * @property {?string} type_name
	 *
	 * @property {?string} site_url
	 * @property {?string} default_address
	 * @property {EventsCollection} events
	 *
	 * @property {?number} subscription_id
	 * @property {?boolean} is_subscribed
	 * @property {?number} subscribed_count
	 * @property {UsersCollection} subscribed
	 *
	 * @property {Array<Privilege>} privileges
	 * @property {?OneUser.ROLE} role
	 * @property {TariffModel} tariff
	 * @property {OrganizationFinanceModel} finance
	 *
	 * @property {UsersCollection} staff
	 * @property {Array<OneUser>} admins
	 * @property {Array<OneUser>} moderators
	 *
	 * @property {?string} email
	 * @property {?boolean} is_new
	 * @property {?number} new_events_count
	 * @property {?number} actual_events_count
	 *
	 * @property {?boolean} is_private
	 * @property {?string} brand_color
	 * @property {?OneCity} city
	 * @property {?} country
	 *
	 * @property {?string} vk_url
	 * @property {?string} facebook_url
	 *
	 * @property {?boolean} status
	 *
	 * @property {?timestamp} created_at
	 * @property {?timestamp} updated_at
	 *
	 * @property {boolean} loading
	 */
	function OneOrganization(organization_id, is_loading_continuous) {
		var self = this;
		
		this.id = organization_id || 0;
		this.name = null;
		this.short_name = null;
		this.description = null;
		this.img_url = null;
		this.img_small_url = null;
		this.img_medium_url = null;
		this.background_img_url = null;
		this.background_small_img_url = null;
		this.background_medium_img_url = null;
		this.type_id = null;
		this.type_name = null;
		this.site_url = null;
		this.default_address = null;
		this.events = new EventsCollection();
		
		this.subscription_id = null;
		this.is_subscribed = null;
		this.subscribed_count = null;
		this.subscribed = new UsersCollection();
		this.privileges = [];
		this.finance = new OrganizationFinanceModel(organization_id);
		
		this.is_private = null;
		this.brand_color = null;
		this.tariff = new TariffModel();
		this.city = new OneCity();
		this.country = null;
		
		this.email = null;
		this.staff = new UsersCollection();
		this.status = null;
		
		this.is_new = null;
		this.new_events_count = null;
		this.actual_events_count = null;
		
		this.vk_url = null;
		this.facebook_url = null;
		
		this.created_at = null;
		this.updated_at = null;
		
		Object.defineProperties(this, {
			'role': {
				get: function() {
					return OneUser.recognizeRole(self.privileges);
				}
			},
			'admins': {
				get: function() {
					return self.staff.getSpecificStaff(OneUser.ROLE.ADMIN);
				}
			},
			'moderators': {
				get: function() {
					
					return self.staff.getSpecificStaff(OneUser.ROLE.MODERATOR);
				}
			},
			'logo_large_url': {
				get: function() {
					
					return self.img_url;
				},
				set: function(val) {
					
					return self.img_url = val;
				}
			},
			'logo_medium_url': {
				get: function() {
					
					return self.img_medium_url;
				},
				set: function(val) {
					
					return self.img_medium_url = val;
				}
			},
			'logo_small_url': {
				get: function() {
					
					return self.img_small_url;
				},
				set: function(val) {
					
					return self.img_small_url = val;
				}
			}
		});
		
		this.loading = false;
		if (organization_id && is_loading_continuous) {
			this.loading = true;
			this.fetchOrganization([], function() {
				this.loading = false;
				$(window).trigger('fetch.OneOrganization');
			});
		}
	}
	
	OneOrganization.ENDPOINT = Object.freeze({
		WITHDRAW: '/organizations/{org_id}/withdraws'
	});
	/**
	 *
	 * @param {(string|number)} org_id
	 * @param {(Fields|string|Array)} [fields]
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	OneOrganization.fetchOrganization = function(org_id, fields, success) {
		return __APP.SERVER.getData('/api/v1/organizations/' + org_id, {fields: fields}, success);
	};
	/**
	 * @typedef {AJAXData} OneOrganizationCreateOrganizationData
	 * @property {string} [name]
	 * @property {string} [short_name]
	 * @property {string} [description]
	 * @property {string} [site_url]
	 * @property {string} [default_address]
	 * @property {string} [vk_url]
	 * @property {string} [facebook_url]
	 * @property {string} [type_id]
	 * @property {string} [background]
	 * @property {string} [logo]
	 * @property {string} [detail_info_url]
	 * @property {string} [email]
	 */
	/**
	 * @typedef {function({
 *   organization_id: number
 * })} OneOrganizationCreateOrganizationCallback
	 */
	/**
	 *
	 * @param {OrganizationModel} new_organization_data
	 * @param {OneOrganizationCreateOrganizationCallback} [success]
	 * @param {function} [error]
	 * @returns {jqPromise}
	 */
	OneOrganization.createOrganization = function(new_organization_data, success, error) {
		return __APP.SERVER.addData('/api/v1/organizations/', new_organization_data, true, success, error);
	};
	/**
	 *
	 * @param {(string|number)} organization_id
	 * @param {OrganizationModel} organization_data
	 * @param {OneOrganizationCreateOrganizationCallback} [success]
	 * @param {function} [error]
	 * @returns {jqPromise}
	 */
	OneOrganization.updateOrganization = function(organization_id, organization_data, success, error) {
		return __APP.SERVER.updateData('/api/v1/organizations/' + organization_id, organization_data, true, success, error);
	};
	/**
	 *
	 * @param {(string|number)} org_id
	 * @param {(string|number)} user_id
	 * @param {OneUser.ROLE} role
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	OneOrganization.addStaff = function(org_id, user_id, role, success) {
		return __APP.SERVER.addData('/api/v1/organizations/' + org_id + '/staff', {
			user_id: user_id,
			role: role
		}, false, success);
	};
	/**
	 *
	 * @param {(string|number)} org_id
	 * @param {(string|number)} user_id
	 * @param {OneUser.ROLE} role
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	OneOrganization.removeStaff = function(org_id, user_id, role, success) {
		return __APP.SERVER.deleteData('/api/v1/organizations/' + org_id + '/staff', {
			user_id: user_id,
			role: role
		}, success);
	};
	/**
	 *
	 * @param {(string|number)} org_id
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	OneOrganization.subscribeOrganization = function(org_id, success) {
		return __APP.SERVER.addData('/api/v1/organizations/' + org_id + '/subscriptions', {}, false, success);
	};
	/**
	 *
	 * @param {(string|number)} org_id
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	OneOrganization.unsubscribeOrganization = function(org_id, success) {
		return __APP.SERVER.deleteData('/api/v1/organizations/' + org_id + '/subscriptions', {}, success);
	};
	/**
	 *
	 * @param {number} org_id
	 * @param {number} amount
	 * @param {string} [comment]
	 * @param {AJAXCallback} [success]
	 *
	 * @return {jqPromise}
	 */
	OneOrganization.requestWithdrawFunds = function(org_id, amount, comment, success) {
		
		return __APP.SERVER.addData(OneOrganization.ENDPOINT.WITHDRAW.format({org_id: org_id}), {
			sum: amount,
			comment: comment
		}, false, success);
	};
	/**
	 *
	 * @param {(Fields|string|Array)} [fields]
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	OneOrganization.prototype.fetchOrganization = function(fields, success) {
		var self = this;
		return OneOrganization.fetchOrganization(self.id, fields, function(data) {
			self.setData(data);
			if (isFunction(success)) {
				success.call(self, self);
			}
		});
	};
	/**
	 *
	 * @param {OrganizationModel} new_organization_data
	 * @param {OneOrganizationCreateOrganizationCallback} [success]
	 * @param {function} [error]
	 * @returns {jqPromise}
	 */
	OneOrganization.prototype.createOrganization = function(new_organization_data, success, error) {
		var self = this;
		return OneOrganization.createOrganization(new_organization_data, function(response_data) {
			self.setData(new_organization_data);
			self.id = response_data.organization_id;
			if (isFunction(success)) {
				success.call(self, self);
			}
		}, error);
	};
	/**
	 *
	 * @param {OrganizationModel} organization_data
	 * @param {OneOrganizationCreateOrganizationCallback} [success]
	 * @param {function} [error]
	 * @returns {jqPromise}
	 */
	OneOrganization.prototype.updateOrganization = function(organization_data, success, error) {
		var self = this;
		return OneOrganization.updateOrganization(self.id, organization_data, function(response_data) {
			self.setData(organization_data);
			if (isFunction(success)) {
				success.call(self, self);
			}
		}, error);
	};
	/**
	 *
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	OneOrganization.prototype.subscribe = function(success) {
		var self = this;
		return this.constructor.subscribeOrganization(this.id, function(data) {
			this.is_subscribed = true;
			this.subscribed_count++;
			if (isFunction(success)) {
				success.call(self, data);
			}
		});
	};
	/**
	 *
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	OneOrganization.prototype.unsubscribe = function(success) {
		var self = this;
		return this.constructor.unsubscribeOrganization(this.id, function(data) {
			this.is_subscribed = false;
			this.subscribed_count = this.subscribed_count ? this.subscribed_count - 1 : this.subscribed_count;
			if (isFunction(success)) {
				success.call(self, data);
			}
		});
	};
	/**
	 *
	 * @param {(string|number)} user_id
	 * @param {OneUser.ROLE} role
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	OneOrganization.prototype.addStaff = function(user_id, role, success) {
		var self = this,
			user = new OneUser(user_id);
		
		return __APP.SERVER.multipleAjax(OneOrganization.addStaff(this.id, user_id, role), user.fetchUser(new Fields())).done(function(org_data, user_data) {
			self.staff.setData(user);
			if (isFunction(success)) {
				success.call(self, user);
			}
		}).promise();
	};
	/**
	 *
	 * @param {(string|number)} user_id
	 * @param {OneUser.ROLE} role
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	OneOrganization.prototype.removeStaff = function(user_id, role, success) {
		var self = this;
		
		return OneOrganization.removeStaff(this.id, user_id, role, function() {
			if (isFunction(success)) {
				success.call(self, self.staff.remove(user_id));
			}
		});
	};
	/**
	 *
	 * @param {number} amount
	 * @param {string} [comment]
	 * @param {AJAXCallback} [success]
	 *
	 * @return {jqPromise}
	 */
	OneOrganization.prototype.requestWithdrawFunds = function(amount, comment, success) {
		var self = this;
		
		return OneOrganization.requestWithdrawFunds(this.id, amount, comment, function(data) {
			self.finance.withdraws.setData(data);
			
			if (isFunction(success)) {
				success.call(self, self.finance.withdraws.last_pushed);
			}
		});
	};
	
	
	return OneOrganization;
}()));