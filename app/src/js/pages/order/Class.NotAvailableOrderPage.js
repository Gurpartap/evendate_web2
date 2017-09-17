/**
 * @requires ../Class.Page.js
 */
/**
 *
 * @class NotAvailableOrderPage
 * @extends Page
 */
NotAvailableOrderPage = extending(Page, (function() {
	/**
	 *
	 * @param {OneEvent} event
	 *
	 * @constructor
	 * @constructs NotAvailableOrderPage
	 *
	 * @property {OneEvent} event
	 */
	function NotAvailableOrderPage(event) {
		var self = this;
		
		Page.call(this);
		
		this.event = event;
		
		this.render_vars = {
			name_field: null,
			email_field: null,
			phone_field: null,
			message_field: null,
			submit_button: null
		};
		
		Object.defineProperties(this, {
			page_title: {
				get: function() {
					
					return (self.event.ticketing_locally ? 'Заказ билетов на событие ' : 'Регистрация на событие ') + self.event.title;
				}
			}
		});
	}
	
	NotAvailableOrderPage.prototype.disablePage = function(message) {
		this.$wrapper.find('.OrderForm').remove();
		
		this.$wrapper.find('.OrderFormWrapper').append(__APP.BUILD.cap(tmpl('order-overlay-cap-content', {
			message: message,
			return_button: __APP.BUILD.link({
				page: '/event/' + this.event.id,
				title: 'Вернуться на страницу события',
				classes: [
					__C.CLASSES.COMPONENT.BUTTON,
					__C.CLASSES.COLORS.PRIMARY
				]
			})
		})));
	};
	
	NotAvailableOrderPage.prototype.init = function() {
		var self = this,
			$form = this.$wrapper.find('.FeedbackForm'),
			$form_wrapper = this.$wrapper.find('.FeedbackFormWrapper'),
			$loader;
		
		this.render_vars.submit_button.on('click.SendFeedback', function() {
			if (isFormValid($form)) {
				$form_wrapper.addClass(__C.CLASSES.HIDDEN);
				$loader = __APP.BUILD.loaderBlock();
				$form_wrapper.after($loader);
				self.event.organization.sendFeedback($form.serializeForm()).always(function() {
					$loader.remove();
				}).done(function() {
					showNotifier({text: 'Сообщение успешно отправлено', status: true});
					$form_wrapper.html(__APP.BUILD.linkButton({
						title: 'Вернуться к событию',
						page: '/event/{event_id}'.format({event_id: self.event.id}),
						classes: [
							__C.CLASSES.COLORS.ACCENT
						]
					}));
					$form_wrapper.removeClass(__C.CLASSES.HIDDEN);
				});
			}
		});
	};
	
	NotAvailableOrderPage.prototype.preRender = function() {
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
	
	NotAvailableOrderPage.prototype.render = function() {
		
		this.$wrapper.html(tmpl('order-page-disabled', this.render_vars));
		
		this.init();
	};
	
	return NotAvailableOrderPage;
}()));