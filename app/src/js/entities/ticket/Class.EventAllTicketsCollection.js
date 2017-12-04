/**
 * @requires Class.AbstractEventTicketsCollection.js
 */
/**
 *
 * @class EventAllTicketsCollection
 * @extends AbstractEventTicketsCollection
 */
EventAllTicketsCollection = extending(AbstractEventTicketsCollection, (function() {
	/**
	 * @param {(string|number)} event_id
	 *
	 * @constructor
	 * @constructs EventAllTicketsCollection
	 */
	function EventAllTicketsCollection(event_id) {
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
	EventAllTicketsCollection.fetchTickets = function(event_id, ajax_data, success) {
		ajax_data = ajax_data ? ajax_data : {};
		
		return __APP.SERVER.getData('/api/v1/statistics/events/'+event_id+'/tickets', ajax_data, success);
	};
	/**
	 *
	 * @param {ServerExports.EXPORT_EXTENSION} [format=xlsx]
	 *
	 * @return {Promise}
	 */
	EventAllTicketsCollection.prototype.export = function(format) {
		
		return (new ServerExports()).eventTickets(this.event_id, format);
	};
	
	return EventAllTicketsCollection;
}())); 