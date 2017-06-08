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
	 * @param {(Array<OneTicket>|...OneTicket|EventsTicketsCollection)} ticket
	 *
	 * @return {jQuery}
	 */
	AppInspectorComponents.prototype.tickets = function(ticket) {
		var tickets;
		
		if (arguments.length > 1) {
			tickets = [].slice.call(arguments)
		} else {
			tickets = ticket instanceof Array ? ticket : [ticket]
		}
		
		return tmpl('app-inspector-ticket', tickets.map(function(ticket) {
			
			return {
				number: formatTicketNumber(ticket.number),
				price: ticket.price ? ticket.price : 'Бесплатно',
				name: ticket.ticket_type.name,
				footer: !ticket.checkout ? '' : tmpl('app-inspector-ticket-footer')
			};
		}));
	};
	
	
	return AppInspectorComponents;
}());