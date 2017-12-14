/**
 * @requires Class.AbstractEventTicketsCollection.js
 */
/**
 *
 * @class EventMyTicketsCollection
 * @extends AbstractEventTicketsCollection
 */
EventMyTicketsCollection = extending(AbstractEventTicketsCollection, (function() {
	/**
	 *
	 * @param {(string|number)} [event_id=0]
	 *
	 * @constructor
	 * @constructs EventMyTicketsCollection
	 *
	 * @property {(string|number)} event_id
	 */
	function EventMyTicketsCollection(event_id) {
		AbstractEventTicketsCollection.call(this, event_id);
	}
	/**
	 *
	 * @param {(string|number)} event_id
	 * @param {AJAXData} [ajax_data]
	 * @param {AJAXCallback} [success]
	 *
	 * @return {Promise}
	 */
	EventMyTicketsCollection.fetchTickets = function(event_id, ajax_data, success) {
		
		return __APP.SERVER.getData('/api/v1/events/' + event_id + '/tickets', ajax_data, success);
	};
	
	return EventMyTicketsCollection;
}()));