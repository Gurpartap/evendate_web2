/**
 * @requires ../entities/Class.OneEntity.js
 */
/**
 *
 * @class OrganizationModel
 * @extends OneEntity
 */
OrganizationModel = extending(OneEntity, (function() {
	/**
	 *
	 * @param {(OneOrganization|object)} [data]
	 *
	 * @constructor
	 * @constructs OrganizationModel
	 *
	 * @property {?string} name
	 * @property {?string} short_name
	 * @property {?string} description
	 * @property {?string} site_url
	 * @property {?string} default_address
	 * @property {?string} vk_url
	 * @property {?string} facebook_url
	 * @property {?string} type_id
	 * @property {?string} background
	 * @property {?string} logo
	 * @property {?string} detail_info_url
	 * @property {?string} email
	 * @property {?string} city_id
	 * @property {?string} country_id
	 * @property {?boolean} is_private
	 * @property {?string} brand_color
	 * @property {?string} brand_color_accent
	 */
	function OrganizationModel(data) {
		this.organization_id = null;
		this.name = null;
		this.short_name = null;
		this.description = null;
		this.site_url = null;
		this.default_address = null;
		this.vk_url = null;
		this.facebook_url = null;
		this.type_id = null;
		this.background = null;
		this.background_filename = null;
		this.logo = null;
		this.logo_filename = null;
		this.detail_info_url = null;
		this.email = null;
		this.city_id = null;
		this.country_id = null;
		this.is_private = null;
		this.brand_color = null;
		this.brand_color_accent = null;
		
		if (data) {
			setData(this, data);
		}
	}
	
	/**
	 *
	 * @param {OrganizationModel} obj
	 * @param {(OneOrganization|object)} data
	 * @returns {OrganizationModel}
	 */
	function setData(obj, data) {
		var field;
		
		for (field in data) {
			if (data.hasOwnProperty(field)) {
				if (obj.hasOwnProperty(field)) {
					obj[field] = data[field];
				} else {
					switch (field) {
						case 'background_img_url': {
							if (isBase64(data[field])) {
								obj.background = data[field];
							}
							break;
						}
						case 'img_url': {
							if (isBase64(data[field])) {
								obj.logo = data[field];
							}
							break;
						}
						case 'city': {
							obj.city_id = data[field] instanceof OneCity ? data[field].id : data[field];
							break;
						}
						case 'country': {
							obj.country_id = data[field].id;
							break;
						}
					}
				}
			}
		}
		
		return obj;
	}
	/**
	 *
	 * @param {(Array|object)} data
	 * @returns {OrganizationModel}
	 */
	OrganizationModel.prototype.setData = function(data) {
		
		return setData(this, data);
	};
	/**
	 *
	 * @returns {string}
	 */
	OrganizationModel.prototype.toString = function() {
		
		return JSON.stringify(this);
	};
	
	return OrganizationModel;
}()));