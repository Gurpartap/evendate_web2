/**
 * @requires ../Class.EntitiesCollection.js
 * @requires Class.OneExtendedTicket.js
 */
/**
 *
 * @class ExtendedTicketsCollection
 * @extends EntitiesCollection
 */
ExtendedTicketsCollection = extending(EntitiesCollection, (function() {
	/**
	 *
	 * @constructor
	 * @constructs ExtendedTicketsCollection
	 */
	function ExtendedTicketsCollection() {
		EntitiesCollection.call(this);
	}
	
	ExtendedTicketsCollection.prototype.collection_of = OneExtendedTicket;
	/**
	 *
	 * @param {OneEvent} event
	 * @return {ExtendedTicketsCollection}
	 */
	ExtendedTicketsCollection.extractTicketsFromEvent = function(event) {
		var _event = new OneEvent(),
			tickets = new ExtendedTicketsCollection();
		
		_event.setData(event);
		tickets.setData(_event.tickets.map(function(ticket) {
			return $.extend({}, ticket, {
				event_id: _event.id,
				event: _event
			});
		}));
		
		return tickets;
	};
	
	return ExtendedTicketsCollection;
}()));