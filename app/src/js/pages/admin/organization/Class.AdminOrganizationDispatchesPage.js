/**
 * @requires Class.AdminOrganizationPage.js
 */
/**
 *
 * @class AdminOrganizationDispatchesPage
 * @extends AdminOrganizationPage
 */
AdminOrganizationDispatchesPage = extending(AdminOrganizationPage, (function() {
	/**
	 *
	 * @param {(string|number)} org_id
	 *
	 * @constructor
	 * @constructs AdminOrganizationDispatchesPage
	 */
	function AdminOrganizationDispatchesPage(org_id) {
		AdminOrganizationPage.call(this, org_id);
		
		this.dispatches = new OrganizationDispatchesCollection(org_id);
		
		this.dispatches_fields = new Fields(
			'event',
			'notification_time'
		);
		
		Object.defineProperty(this, 'page_title_obj', {
			get: function() {
				
				return [{
					title: 'Организации',
					page: '/admin'
				}, this.organization.short_name + ' - рассылки'];
			}
		});
	}
	
	/**
	 *
	 * @param {DispatchesCollection|Array<OneAbstractDispatch>|OneAbstractDispatch} dispatches
	 *
	 * @return {jQuery}
	 */
	AdminOrganizationDispatchesPage.prototype.dispatchBuilder = function(dispatches) {
		var self = this;
	
		return tmpl('admin-dispatch-item', (dispatches instanceof Array ? dispatches : [dispatches]).map(function(dispatch) {
		
			return {
				name: dispatch.title,
				done_text: dispatch.done ? __APP.BUILD.text({
					content: 'Отправлено',
					classes: [
						__C.CLASSES.TEXT_WEIGHT.BOLDER,
						__C.CLASSES.UNIVERSAL_STATES.UPPERCASE,
						__C.CLASSES.TEXT_COLORS.MUTED_50
					]
				}) : '',
				date: moment(dispatch.notification_time).calendar(null, __LOCALE.DATE.CALENDAR_DATE_TIME),
				type: dispatch.is_email ? 'Email-рассылка' : ('Push-уведомления' + dispatch.is_sms ? ' с СМС сообщениями' : ''),
				event_link: dispatch instanceof OneEventDispatch ? __APP.BUILD.actionLink({
					title: dispatch.event.title,
					page: '/event/{id}'.format({id: dispatch.event.id}),
					classes: [__C.CLASSES.COLORS.ACCENT]
				}) : '-',
				service_action_buttons: __APP.BUILD.actionLink({
					page: '/admin/organization/{organization_id}/dispatch/{uuid}'.format({
						organization_id: self.organization.id,
						uuid: dispatch.uuid
					}),
					title: dispatch.done ? 'Подробнее' : 'Редактировать',
					classes: [
						__C.CLASSES.COLORS.ACCENT
					]
				})
			};
		}));
	};
	
	AdminOrganizationDispatchesPage.prototype.render = function() {
		var self = this,
			promise;
		
		promise = this.dispatches.fetch(this.dispatches_fields, ServerConnection.MAX_ENTITIES_LENGTH, 'notification_time');
		
		this.$wrapper.html(tmpl('admin-dispatches-page', {
			add_dispatch_button: __APP.BUILD.linkButton({
				page: '/admin/organization/{id}/add/dispatch/'.format({id: this.organization.id}),
				title: 'Создать рассылку',
				classes: [
					__C.CLASSES.COLORS.ACCENT,
					__C.CLASSES.ICON_CLASS,
					__C.CLASSES.ICONS.ENVELOPE
				]
			})
		}));
		
		promise.done(function() {
			self.$wrapper.find('.DispatchesWrapper').append(self.dispatches.length ? self.dispatchBuilder(self.dispatches) : __APP.BUILD.cap('Вы пока не создали ни одну рассылку'));
		});
	};
	
	return AdminOrganizationDispatchesPage;
}()));