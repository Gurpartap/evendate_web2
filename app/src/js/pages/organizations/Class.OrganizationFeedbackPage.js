/**
 * @requires Class.AbstractFeedbackPage.js
 */
/**
 *
 * @class OrganizationFeedbackPage
 * @extends AbstractFeedbackPage
 */
OrganizationFeedbackPage = extending(AbstractFeedbackPage, (function() {
	/**
	 *
	 * @param {number} organization_id
	 *
	 * @constructor
	 * @constructs OrganizationFeedbackPage
	 *
	 * @property {OneOrganization} organization
	 */
	function OrganizationFeedbackPage(organization_id) {
		var self = this;
		
		AbstractFeedbackPage.call(this, organization_id);
		
		Object.defineProperties(this, {
			page_title: {
				get: function() {
					
					return 'Связь с организатором ' + self.organization.short_name;
				}
			}
		});
	}
	
	OrganizationFeedbackPage.prototype.afterFormSend = function() {
		
		__APP.changeState(isDirectInstance(__APP.PREVIOUS_PAGE, Page) ? '/organization/{org_id}'.format({
			org_id: this.organization.id
		}) : __APP.PREVIOUS_PAGE.location.path);
	};
	
	OrganizationFeedbackPage.prototype.preRender = function() {
		AbstractFeedbackPage.prototype.preRender.call(this);
		
		this.render_vars.header = tmpl('organization-feedback-header', {
			header: 'Связь с организатором'
		});
		
		this.render_vars.sub_header = tmpl('organization-feedback-sub-header', {
			sub_header: 'Что-то пошло не так? Дайте знать нам и организаторам события.'
		});
		
		this.render_vars.additional_fields = $();
		
		this.render_vars.additional_fields = this.render_vars.additional_fields.add(
			__APP.BUILD.input({
				type: 'hidden',
				name: 'Название страницы',
				value: isDirectInstance(__APP.PREVIOUS_PAGE, Page) ? null : __APP.PREVIOUS_PAGE.page_title
			})
		);
		
		this.render_vars.additional_fields = this.render_vars.additional_fields.add(
			__APP.BUILD.input({
				type: 'hidden',
				name: 'URL',
				value: isDirectInstance(__APP.PREVIOUS_PAGE, Page) ? '{origin}/organization/{org_id}'.format({
					origin: this.location.wo_path,
					org_id: this.organization.id
				}) : __APP.PREVIOUS_PAGE.location.source
			})
		);
	};
	
	return OrganizationFeedbackPage;
}()));