/**
 * @requires Class.AbstractEditOrganizationPage.js
 */
/**
 *
 * @class EditOrganizationPage
 * @extends AbstractEditOrganizationPage
 */
EditOrganizationPage = extending(AbstractEditOrganizationPage, (function() {
	/**
	 *
	 * @param {(string|number)} [organization_id]
	 * @constructor
	 * @constructs EditOrganizationPage
	 */
	function EditOrganizationPage(organization_id) {
		AbstractEditOrganizationPage.call(this);
		this.page_title = 'Редактировать организацию';
		this.organization = new OneOrganization(organization_id);
		
		this.adding_is_over = true;
	}
	
	EditOrganizationPage.prototype.fetchData = function() {
		var cities_promise = this.cities.fetchCities(null, 0, 'local_name');
		
		if (this.organization.id) {
			return this.fetching_data_defer = __APP.SERVER.multipleAjax(cities_promise, this.organization.fetchOrganization(this.fields));
		}
		
		return this.fetching_data_defer = cities_promise;
	};
	
	EditOrganizationPage.prototype.renderRest = function() {
		var self = this,
			additional_fields;
		
		if (this.organization.role === OneUser.ROLE.USER) {
			debugger;
			return __APP.changeState('/', true, true);
		}
		
		this.adding_is_over = true;
		additional_fields = $.extend(true, {}, this.organization);
		
		additional_fields.header_text = this.page_title;
		
		if (additional_fields.background_img_url) {
			additional_fields.background_filename = additional_fields.background_img_url.split('/').reverse()[0];
		}
		if (additional_fields.img_url) {
			additional_fields.logo_filename = additional_fields.img_url.split('/').reverse()[0];
		}
		
		additional_fields.branding_help = __APP.BUILD.helpLink(HelpCenterConnection.ARTICLE.SITE_DESIGN, 'Как настроить дизайн страницы организации');
		
		this.$wrapper.html(tmpl('add-organization-page', additional_fields));
		
		
		if (additional_fields.img_url) {
			toDataUrl(additional_fields.img_url, function(base64_string) {
				self.$wrapper.find('#add_organization_img_src').val(base64_string ? base64_string : null);
			});
		}
		if (additional_fields.background_img_url) {
			toDataUrl(additional_fields.background_img_url, function(base64_string) {
				self.$wrapper.find('#add_organization_background_src').val(base64_string ? base64_string : null);
			});
		}
	};
	
	return EditOrganizationPage;
}()));