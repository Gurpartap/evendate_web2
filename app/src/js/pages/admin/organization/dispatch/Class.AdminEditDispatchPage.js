/**
 * @requires Class.AdminAbstractDispatchPage.js
 */
/**
 *
 * @class AdminEditDispatchPage
 * @extends AdminAbstractDispatchPage
 */
AdminEditDispatchPage = extending(AdminAbstractDispatchPage, (function() {
	/**
	 *
	 * @param {number} organization_id
	 * @param {string} uuid
	 *
	 * @constructor
	 * @constructs AdminEditDispatchPage
	 *
	 * @property {Fields} dispatch_fields
	 */
	function AdminEditDispatchPage(organization_id, uuid) {
		AdminAbstractDispatchPage.call(this, organization_id);
		
		this.dispatch = new OneAbstractDispatch(uuid);
		this.dispatch_fields = new Fields(
			'message_text',
			'url',
			'notification_time'
		);
		
		Object.defineProperty(this, 'page_title_obj', {
			get: function() {
				
				return this.dispatch.title + ' - редактирование';
			}
		});
	}
	
	AdminEditDispatchPage.prototype.fetchData = function() {
		var self = this;
		
		return this.fetching_data_defer = this.dispatch.fetch(this.dispatch_fields).done(function(dispatch) {
			self.dispatch = dispatch;
		});
	};
	
	AdminEditDispatchPage.prototype.fetchEvents = function() {
		var self = this;
		
		if (!this.dispatch.done) {
			this.events_defer = this.events.fetchOrganizationsEvents(this.organization_id, {
				future: true,
				order_by: 'nearest_event_date'
			}, ServerConnection.MAX_ENTITIES_LENGTH);
		} else if (this.dispatch.done && this.dispatch instanceof OneEventDispatch) {
			this.events_defer = (new OneEvent(this.dispatch.event_id)).fetchEvent().then(function(event) {
				self.events.setData([event]);
			});
		} else {
			this.events_defer.resolve();
		}
		
		return this.events_defer;
	};
	/**
	 *
	 * @param {jQuery} $event_select
	 */
	AdminEditDispatchPage.prototype.initEventSelect = function($event_select) {
		if (!this.events.length || this.dispatch.done) {
			$event_select.prop('disabled', true);
		}
		initSelect2($event_select);
		
		if (this.dispatch instanceof OneEventDispatch) {
			$event_select.select2('val', this.dispatch.event_id);
		}
	};
	
	AdminEditDispatchPage.prototype.init = function() {
		AdminAbstractDispatchPage.prototype.init.call(this);
		
		if (this.dispatch.is_push) {
			this.$wrapper.find('.DispatchTypePushInput').prop('checked', true);
		}
		
		if (this.dispatch.done) {
			this.$wrapper.find('form').prop('readonly', true).find('.SaveDispatch').prop('disabled', true);
		}
	};
	
	AdminEditDispatchPage.prototype.preRender = function() {};
	
	return AdminEditDispatchPage;
}()));