/**
 * @requires ../Class.Page.js
 */
/**
 *
 * @class AbstractFeedbackPage
 * @extends Page
 */
AbstractFeedbackPage = extending(Page, (function() {
	/**
	 *
	 * @param {number} organization_id
	 *
	 * @constructor
	 * @constructs AbstractFeedbackPage
	 *
	 * @property {OneOrganization} organization
	 */
	function AbstractFeedbackPage(organization_id) {
		Page.call(this);
		
		this.organization = new OneOrganization(organization_id);
		this.fields = new Fields();
		
		this.render_vars = {
			header: null,
			sub_header: null,
			name_field: null,
			email_field: null,
			phone_field: null,
			message_field: null,
			submit_button: null
		};
	}
	/**
	 *
	 * @return {jqPromise}
	 */
	AbstractFeedbackPage.prototype.fetchData = function() {
		
		return this.fetching_data_defer = this.organization.fetchOrganization(this.fields);
	};
	
	AbstractFeedbackPage.prototype.afterFormSend = function() {};
	
	AbstractFeedbackPage.prototype.init = function() {
		var self = this,
			$form = this.$wrapper.find('.FeedbackForm'),
			$form_wrapper = this.$wrapper.find('.FeedbackFormWrapper'),
			$loader;
		
		this.render_vars.submit_button.on('click.SendFeedback', function() {
			if (isFormValid($form)) {
				$form_wrapper.addClass(__C.CLASSES.HIDDEN);
				$loader = __APP.BUILD.loaderBlock();
				$form_wrapper.after($loader);
				self.organization.sendFeedback($form.serializeForm()).always(function() {
					$loader.remove();
				}).done(function() {
					showNotifier({text: 'Сообщение успешно отправлено', status: true});
					self.afterFormSend();
					$form_wrapper.removeClass(__C.CLASSES.HIDDEN);
				});
			}
		});
	};
	
	AbstractFeedbackPage.prototype.preRender = function() {
		this.render_vars.name_field = __APP.BUILD.formUnit({
			label: 'Ваше имя',
			id: 'order_page_feedback_form_name',
			name: 'name',
			value: __APP.USER.full_name,
			placeholder: 'Имя',
			helptext: 'Чтобы мы знали как в вам обращаться',
			required: true
		});
		
		this.render_vars.email_field = __APP.BUILD.formUnit({
			label: 'Ваш e-mail',
			id: 'order_page_feedback_form_email',
			name: 'email',
			value: __APP.USER.email,
			placeholder: 'E-mail',
			helptext: 'Чтобы мы знали как с вами связаться',
			required: true
		});
		
		this.render_vars.phone_field = __APP.BUILD.formUnit({
			label: 'Ваш телефон',
			id: 'order_page_feedback_form_phone',
			name: 'phone',
			placeholder: 'Номер телефона',
			helptext: 'Будем звонить только в экстренных случаях!'
		});
		
		this.render_vars.message_field = __APP.BUILD.formUnit({
			label: 'Сообщение',
			id: 'order_page_feedback_form_message',
			name: 'message',
			type: 'textarea',
			placeholder: 'Сообщите нам, если что-то пошло не так, либо если у вас есть какие-то пожелания',
			required: true
		});
		
		this.render_vars.submit_button = __APP.BUILD.button({
			title: 'Отправить',
			classes: [
				__C.CLASSES.COLORS.ACCENT,
				'SendFeedbackButton'
			]
		});
	};
	
	AbstractFeedbackPage.prototype.render = function() {
		
		this.$wrapper.html(tmpl('organization-feedback-page', this.render_vars));
		
		this.init();
	};
	
	return AbstractFeedbackPage;
}()));