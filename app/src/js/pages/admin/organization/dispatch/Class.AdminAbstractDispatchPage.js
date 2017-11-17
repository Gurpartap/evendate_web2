/**
 * @requires ../../Class.AdminPage.js
 */
/**
 *
 * @class AdminAbstractDispatchPage
 * @extends AdminPage
 */
AdminAbstractDispatchPage = extending(AdminPage, (function() {
	/**
	 *
	 * @param {number} organization_id
	 *
	 * @constructor
	 * @constructs AdminAbstractDispatchPage
	 *
	 * @property {OneAbstractDispatch} dispatch
	 * @property {EventsCollection} events
	 * @property {jqPromise} events_defer
	 */
	function AdminAbstractDispatchPage(organization_id) {
		AdminPage.call(this);
		
		this.organization_id = organization_id;
		this.dispatch = new OneAbstractDispatch();
		this.events = new EventsCollection();
		this.events_defer = $.Deferred();
		this.is_disabled = !this.dispatch.is_active || this.dispatch.done;
	}
	
	AdminAbstractDispatchPage.prototype.gatherSendData = function() {
		var form_data = this.$wrapper.serializeForm();
		
		return {
			uuid: form_data.uuid,
			event_id: +form_data.event_id === 0 || isNaN(+form_data.event_id) ? null : form_data.event_id,
			organization_id: form_data.organization_id,
			is_email: form_data.dispatch_type === 'is_email',
			is_push: form_data.dispatch_type === 'is_push',
			is_sms: form_data.is_sms === true,
			title: form_data.title,
			subject: form_data.subject,
			message_text: form_data.message_text,
			url: form_data.url,
			is_active: true,
			notification_time: (function() {
				if (form_data.notification_send_now) {
					
					return moment().tz('UTC').format();
				}
				
				return moment(form_data.notification_date + ' ' + form_data.notification_time).tz('UTC').format();
			})()
		};
	};
	
	AdminAbstractDispatchPage.prototype.preRender = function() {
	
	};
	
	AdminAbstractDispatchPage.prototype.fetchEvents = function() {
		
		return this.events_defer.resolve();
	};
	/**
	 * @abstract
	 * @param {jQuery} $event_select
	 */
	AdminAbstractDispatchPage.prototype.initEventSelect = function($event_select) {};
	
	
	AdminAbstractDispatchPage.prototype.init = function() {
		var self = this;
		
		this.events_defer.done(function() {
			self.initEventSelect(self.$wrapper.find('.EventsSelect').append(__APP.BUILD.option(self.events.map(function(event) {
				
				return {
					val: event.id,
					display_name: event.title
				};
			}))));
		});
		
		this.$wrapper.find('.SaveDispatch').on('click.SaveDispatch', function() {
			var send_data = self.gatherSendData(),
				is_form_valid;
			
			is_form_valid = (function validation($form) {
				var is_valid = true;
				
				$form.find(':required').not($form.find(':disabled')).each(function() {
					var $this = $(this);
					
					if ($this.val().trim() === '') {
						scrollTo($this, 400, function() {
							showNotifier({text: 'Заполните все обязательные поля', status: false});
						});
						is_valid = false;
					} else if ($this.hasClass('LimitSize') && $this.val().trim().length > $this.data('maxlength')) {
						scrollTo($this, 400, function() {
							showNotifier({text: 'Количество символов превышает установленное значение', status: false});
						});
						is_valid = false;
					}
				});
				
				return is_valid;
			})(self.$wrapper.find('form'));
			
			if (is_form_valid) {
				OneAbstractDispatch.factory(send_data).save().done(function() {
					showNotifier({
						text: 'Рассылка успешно создана',
						status: true
					});
					
					__APP.changeState('admin/organization/{organization_id}/dispatches'.format({organization_id: self.organization_id}));
				});
			}
		});
		
		bindControlSwitch(this.$wrapper);
		initWysiwyg(this.$wrapper);
	};
	
	
	AdminAbstractDispatchPage.prototype.render = function() {
		this.fetchEvents();
		
		this.$wrapper.html(tmpl('admin-dispatch-page', {
			uuid: this.dispatch.uuid,
			organization_id: this.organization_id,
			page_title: this.dispatch.title || this.page_title,
			dispatch_title_input: __APP.BUILD.input({
				placeholder: 'Например: Спонсорская кампания',
				name: 'title',
				value: this.dispatch.title || '',
				required: true
			}, ['form_input']),
			dispatch_subject_input: __APP.BUILD.input({
				name: 'subject',
				placeholder: 'Тема для письма',
				value: this.dispatch.subject || '',
				required: true
			}, ['form_input']),
			dispatch_content_input: __APP.BUILD.textarea({
				name: 'message_text',
				required: true
			}, ['form_textarea', 'Wysiwyg'], escapeHtml(this.dispatch.message_text) || ''),
			email_help: __APP.BUILD.helpLink(HelpCenterConnection.ARTICLE.DISPATCHES, 'Как сделать рассылку для пользователей'),
			dispatch_datepicker: __APP.BUILD.formUnit({
				name: 'notification_date',
				type: 'date',
				value: this.dispatch.notification_time ? moment(this.dispatch.notification_time).format(__C.DATE_FORMAT) : undefined,
				dataset: {
					format: function(date) {
						
						return date.calendar(null, __LOCALE.DATE.CALENDAR_DATE_WITH_YEAR);
					}
				},
				required: true,
			}),
			dispatch_timepicker: __APP.BUILD.formUnit({
				type: 'time',
				name: 'notification_time',
				value: this.dispatch.notification_time ? moment(this.dispatch.notification_time).format(__C.TIME_FORMAT) : '',
				required: true
			}),
			notification_send_now_checkbox: __APP.BUILD.checkbox({
				id: 'dispatch_notification_send_now',
				label: 'Разослать немедленно',
				name: 'notification_send_now',
				classes: ['Switch'],
				dataset: {
					switch_id: 'notification_time'
				}
			}),
			submit_button: __APP.BUILD.button({
				title: 'Сохранить',
				classes: [
					'SaveDispatch',
					__C.CLASSES.COLORS.ACCENT,
					__C.CLASSES.SIZES.HUGE
				]
			})
		}));
		
		this.init();
	};
	
	return AdminAbstractDispatchPage;
}()));