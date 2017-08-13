/**
 *
 * @class AppInspectorComponents
 */
AppInspectorComponents = (function() {
	/**
	 *
	 * @constructor
	 * @constructs AppInspectorComponents
	 */
	function AppInspectorComponents() {
		if (typeof AppInspectorComponents.instance === 'object')
			return AppInspectorComponents.instance;
		
		AppInspectorComponents.instance = this;
	}
	
	/**
	 *
	 * @param {OneUser} user
	 *
	 * @return {jQuery}
	 */
	AppInspectorComponents.prototype.avatarBlock = function(user) {
		return bindPageLinks(__APP.BUILD.avatarBlocks(user, {
			is_link: true,
			entity: __C.ENTITIES.USER,
			avatar_classes: [__C.CLASSES.SIZES.X50, __C.CLASSES.UNIVERSAL_STATES.ROUNDED]
		}));
	};
	/**
	 *
	 * @param {(*|string)} title
	 *
	 * @return {jQuery}
	 */
	AppInspectorComponents.prototype.title = function(title) {
		return tmpl('app-inspector-title', {
			title: title
		});
	};
	/**
	 *
	 * @param {(Array<OneTicket>|...OneTicket|TicketsCollection)} tickets
	 *
	 * @return {jQuery}
	 */
	AppInspectorComponents.prototype.tickets = function(tickets) {
		var _tickets;
		
		if (arguments.length > 1) {
			_tickets = [].slice.call(arguments)
		} else {
			_tickets = tickets instanceof Array ? tickets : [tickets]
		}
		
		return tmpl('app-inspector-ticket', _tickets.map(function(ticket) {
			
			return {
				fields: tmpl('fields-wrapper', [
					{
						classes: '-columns_2',
						fields: tmpl('field', [
							{name: 'Номер', value: formatTicketNumber(ticket.number)},
							{name: 'Цена', value: ticket.price ? ticket.price : 'Бесплатно'}
						])
					},
					{
						classes: '-field_big',
						fields: tmpl('field', {name: 'Название', value: ticket.ticket_type.name})
					}
				]),
				footer: !ticket.checkout ? '' : tmpl('app-inspector-ticket-footer')
			};
		})).each(function(i, el) {
			$(el).data('ticket', _tickets[i]);
		});
	};
	/**
	 *
	 * @param {OneEvent} event
	 *
	 * @return {jQuery}
	 */
	AppInspectorComponents.prototype.event = function(event) {
		
		return bindPageLinks(tmpl('app-inspector-event', event));
	};
	
	return AppInspectorComponents;
}());