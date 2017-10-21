/**
 * @requires ../organizations/Class.AbstractFeedbackPage.js
 */
/**
 *
 * @class NotAvailableOrderPage
 * @extends AbstractFeedbackPage
 */
NotAvailableOrderPage = extending(AbstractFeedbackPage, (function() {
	/**
	 *
	 * @param {number} organization_id
	 * @param {OneEvent} event
	 *
	 * @constructor
	 * @constructs NotAvailableOrderPage
	 *
	 * @property {OneEvent} event
	 * @property {OneOrganization} organization
	 */
	function NotAvailableOrderPage(organization_id, event) {
		var self = this;
		
		AbstractFeedbackPage.call(this, organization_id);
		
		this.event = event;
		
		Object.defineProperties(this, {
			page_title: {
				get: function() {
					
					return (self.event.ticketing_locally ? 'Заказ билетов на событие ' : 'Регистрация на событие ') + self.event.title;
				}
			}
		});
	}
	/**
	 *
	 * @return {jqPromise}
	 */
	NotAvailableOrderPage.prototype.fetchData = Page.prototype.fetchData;
	
	NotAvailableOrderPage.prototype.afterFormSend = function() {
		this.$wrapper.find('.FeedbackFormWrapper').html(__APP.BUILD.linkButton({
			title: 'Вернуться к событию',
			page: '/event/{event_id}'.format({event_id: this.event.id}),
			classes: [
				__C.CLASSES.COLORS.ACCENT
			]
		}));
	};
	
	NotAvailableOrderPage.prototype.preRender = function() {
		AbstractFeedbackPage.prototype.preRender.call(this);
		
		this.render_vars.header = tmpl('organization-feedback-header', {
			header: 'Регистрация на событие окончена'
		});
		
		this.render_vars.sub_header = tmpl('organization-feedback-sub-header', {
			sub_header: 'Что-то пошло не так? Дайте знать нам и организаторам события.'
		});
	};
	
	return NotAvailableOrderPage;
}()));