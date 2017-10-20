/**
 * @requires Class.AbstractEditEventPage.js
 */
/**
 *
 * @class AddEventPage
 * @extends AbstractEditEventPage
 */
AddEventPage = extending(AbstractEditEventPage, (function() {
	/**
	 *
	 * @param {(string|number)} [org_id]
	 * @constructor
	 * @constructs AddEventPage
	 */
	function AddEventPage(org_id) {
		AbstractEditEventPage.call(this);
		this.page_title = 'Добавить событие';
		this.organization_id = org_id;
	}
	
	AddEventPage.prototype.preRender = function() {
		AbstractEditEventPage.prototype.preRender.call(this);
		
		this.render_vars.button_text = 'Опубликовать';
		
		this.render_vars.ticket_types = tmpl('edit-event-tickets-row-empty');
	};
	
	AddEventPage.prototype.init = function() {
		AbstractEditEventPage.prototype.init.call(this);
		
		this.$wrapper.find('.RemoveEventWrapper').addClass(__C.CLASSES.HIDDEN);
		this.$wrapper.find('.ReturnEventWrapper').addClass(__C.CLASSES.HIDDEN);
	};
	
	return AddEventPage;
}()));