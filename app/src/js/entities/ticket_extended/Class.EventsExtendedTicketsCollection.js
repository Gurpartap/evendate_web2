/**
 * @requires ../event/Class.OneEvent.js
 * @requires Class.ExtendedTicketsCollection.js
 */
/**
 *
 * @class EventsExtendedTicketsCollection
 * @extends ExtendedTicketsCollection
 */
EventsExtendedTicketsCollection = extending(ExtendedTicketsCollection, (function() {
	/**
	 *
	 * @param {(string|number)} [event_id]
	 *
	 * @constructor
	 * @constructs ExtendedTicketsCollection
	 *
	 * @property {(string|number)} event_id
	 */
	function EventsExtendedTicketsCollection(event_id) {
		ExtendedTicketsCollection.call(this);
		
		Object.defineProperty(this, 'event_id', {
			value: event_id
		});
	}
	
	/**
	 *
	 * @param {(string|number)} event_id
	 * @param {(Fields|string|Array)} [fields]
	 * @param {AJAXCallback} [success]
	 *
	 * @return {Promise}
	 */
	EventsExtendedTicketsCollection.fetchTickets = function(event_id, fields, success){
		
		return OneEvent.fetchEvent(event_id, ExtendedTicketsCollection.convertTicketFieldsToEventAjaxData(fields).fields, success);
	};
	/**
	 *
	 * @param {(Fields|string)} [fields]
	 * @param {number} [length]
	 * @param {(string|Array)} [order_by]
	 * @param {AJAXCallback} [success]
	 *
	 * @return {Promise}
	 */
	EventsExtendedTicketsCollection.prototype.fetchTickets = function(fields, length, order_by, success) {
		var self = this;
		
		return EventsExtendedTicketsCollection.fetchTickets(this.event_id, fields).then(function(data) {
			self.setData(ExtendedTicketsCollection.extractTicketsFromEvent(data));
			if (isFunction(success)) {
				success.call(self, self.__last_pushed);
			}
			
			return self.__last_pushed;
		});
	};
	
	
	return EventsExtendedTicketsCollection;
}()));