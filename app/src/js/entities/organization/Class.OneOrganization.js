/**
 * @requires ../Class.OneEntity.js
 */
/**
 * @typedef {object} Privilege
 * @property {number} role_id
 * @property {OneAbstractUser.ROLE} name
 */
/**
 *
 * @constructor
 * @augments OneEntity
 * @param {(string|number)} [organization_id]
 * @param {boolean} [is_loading_continuous]
 */
function OneOrganization(organization_id, is_loading_continuous) {
	this.id = organization_id || 0;
	this.short_name = '';
	this.description = '';
	this.img_url = '';
	this.img_small_url = '';
	this.background_img_url = '';
	this.background_medium_img_url = '';
	this.type_id = 0;
	this.type_name = '';
	this.site_url = '';
	this.default_address = '';
	this.events = new EventsCollection();
	this.is_subscribed = false;
	this.subscribed_count = 0;
	this.subscribed = new UsersCollection();
	/**
	 * @type {Array<Privilege>}
	 */
	this.privileges = [];
	this.role = '';
	this.staff = new UsersCollection();
	
	if (organization_id && is_loading_continuous) {
		this.loading = true;
		this.fetchOrganization([], function() {
			this.loading = false;
			$(window).trigger('fetch.OneOrganization');
		});
	}
}
OneOrganization.extend(OneEntity);
/**
 *
 * @param {(string|number)} org_id
 * @param {(string|Array)} fields
 * @param {AJAXCallback} [success]
 * @returns {jqXHR}
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
 * @param {OneOrganizationCreateOrganizationData} new_organization_data
 * @param {OneOrganizationCreateOrganizationCallback} [success]
 * @returns {jqXHR}
 */
OneOrganization.createOrganization = function(new_organization_data, success) {
	return __APP.SERVER.addData('/api/v1/organizations/', JSON.stringify(new_organization_data), true, success);
};
/**
 *
 * @param {(string|number)} organization_id
 * @param {OneOrganizationCreateOrganizationData} organization_data
 * @param {OneOrganizationCreateOrganizationCallback} [success]
 * @returns {jqXHR}
 */
OneOrganization.updateOrganization = function(organization_id, organization_data, success) {
	return __APP.SERVER.updateData('/api/v1/organizations/' + organization_id, JSON.stringify(organization_data), success);
};
/**
 *
 * @param {(string|number)} org_id
 * @param {AJAXCallback} [success]
 * @returns {jqXHR}
 */
OneOrganization.subscribeOrganization = function(org_id, success) {
	return __APP.SERVER.addData('/api/v1/organizations/' + org_id + '/subscriptions', {}, false, success);
};
/**
 *
 * @param {(string|number)} org_id
 * @param {AJAXCallback} [success]
 * @returns {jqXHR}
 */
OneOrganization.unsubscribeOrganization = function(org_id, success) {
	return __APP.SERVER.deleteData('/api/v1/organizations/' + org_id + '/subscriptions', {}, success);
};
/**
 *
 * @param {(Array|object)} data
 * @returns {OneEntity}
 */
OneOrganization.prototype.setData = function(data) {
	OneEntity.prototype.setData.call(this, data);
	this.role = OneAbstractUser.recognizeRole(this.privileges);
	return this;
};
/**
 *
 * @param {(string|Array)} fields
 * @param {AJAXCallback} [success]
 * @returns {jqXHR}
 */
OneOrganization.prototype.fetchOrganization = function(fields, success) {
	var self = this;
	return this.constructor.fetchOrganization(self.id, fields, function(data) {
		self.setData(data);
		if (success && typeof success == 'function') {
			success.call(self, self);
		}
	});
};
/**
 *
 * @param {(string|Array)} fields
 * @param {AJAXData} [events_ajax_data]
 * @param {AJAXCallback} [success]
 * @returns {jqXHR}
 */
OneOrganization.prototype.fetchOrganizationWithEvents = function(fields, events_ajax_data, success) {
	var _fields = fields;
	_fields = _fields instanceof Array ? _fields : _fields.split(',');
	_fields.push('events'.appendAjaxData(events_ajax_data));
	return this.fetchOrganization(fields, success);
};
/**
 *
 * @param {OneOrganizationCreateOrganizationData} new_organization_data
 * @param {OneOrganizationCreateOrganizationCallback} [success]
 * @returns {jqXHR}
 */
OneOrganization.prototype.createOrganization = function(new_organization_data, success) {
	var self = this;
	return OneOrganization.createOrganization(new_organization_data, function(response_data) {
		self.setData(new_organization_data);
		self.id = response_data.organization_id;
		if (success && typeof success == 'function') {
			success.call(self, self);
		}
	});
};
/**
 *
 * @param {OneOrganizationCreateOrganizationData} organization_data
 * @param {OneOrganizationCreateOrganizationCallback} [success]
 * @returns {jqXHR}
 */
OneOrganization.prototype.updateOrganization = function(organization_data, success) {
	var self = this;
	return OneOrganization.updateOrganization(self.id, organization_data, function(response_data) {
		self.setData(organization_data);
		if (success && typeof success == 'function') {
			success.call(self, self);
		}
	});
};
/**
 *
 * @param {AJAXCallback} [success]
 * @returns {jqXHR}
 */
OneOrganization.prototype.subscribe = function(success) {
	var self = this;
	return this.constructor.subscribeOrganization(this.id, function(data) {
		this.is_subscribed = true;
		this.subscribed_count++;
		if (success && typeof success == 'function') {
			success.call(self, data);
		}
	});
};
/**
 *
 * @param {AJAXCallback} [success]
 * @returns {jqXHR}
 */
OneOrganization.prototype.unsubscribe = function(success) {
	var self = this;
	return this.constructor.unsubscribeOrganization(this.id, function(data) {
		this.is_subscribed = false;
		this.subscribed_count = this.subscribed_count ? this.subscribed_count - 1 : this.subscribed_count;
		if (success && typeof success == 'function') {
			success.call(self, data);
		}
	});
};