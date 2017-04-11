/**
 * @requires Class.AbstractEditOrganizationPage.js
 */
/**
 *
 * @class AddOrganizationPage
 * @extends AbstractEditOrganizationPage
 */
AddOrganizationPage = extending(AbstractEditOrganizationPage, (function() {
	/**
	 *
	 * @constructor
	 * @constructs AddOrganizationPage
	 */
	function AddOrganizationPage() {
		AbstractEditOrganizationPage.call(this);
		this.page_title = 'Новая организация';
		this.adding_is_over = false;
	}
	
	AddOrganizationPage.prototype.destroy = function() {
		var data = this.$wrapper.find('#add-organization-form').serializeForm(),
			$sidebar_nav = $('.SidebarNav');
		
		if (!this.adding_is_over) {
			if (!$sidebar_nav.find('.ContinueRegistration').length) {
				$sidebar_nav.prepend(__APP.BUILD.link({
					page: '/add/organization',
					title: 'Продолжить регистрацию',
					classes: ['sidebar_navigation_item', 'SidebarNavItem', 'ContinueRegistration']
				}));
				bindPageLinks($sidebar_nav);
			}
			try {
				sessionStorage.setItem('organization_info', JSON.stringify({
					city_id: data.city_id,
					type_id: data.type_id,
					name: data.name,
					short_name: data.short_name,
					email: data.email,
					site_url: data.site_url,
					default_address: data.default_address,
					description: data.description,
					facebook_url: data.facebook_url,
					vk_url: data.vk_url
				}));
			} catch (e) {}
		}
	};
	
	AddOrganizationPage.prototype.renderRest = function() {
		var additional_fields,
			local_storage;
		
		try {
			local_storage = JSON.parse(sessionStorage.getItem('organization_info') ? sessionStorage.getItem('organization_info') : localStorage.getItem('organization_info'));
			sessionStorage.removeItem('organization_info');
		} catch (e) {
			local_storage = {}
		}
		
		additional_fields = $.extend({
			header_text: this.page_title
		}, local_storage, true);
		
		this.$wrapper.html(tmpl('add-organization-page', additional_fields));
	};
	
	return AddOrganizationPage;
}()));