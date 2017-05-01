/**
 * @requires Class.EventsTicketsCollection.js
 */
/**
 *
 * @class AdminEventsTicketsCollection
 * @extends EventsTicketsCollection
 */
AdminEventsTicketsCollection = extending(EventsTicketsCollection, (function() {
	/**
	 * @param {(string|number)} event_id
	 *
	 * @constructor
	 * @constructs AdminEventsTicketsCollection
	 */
	function AdminEventsTicketsCollection(event_id) {
		EventsTicketsCollection.call(this, event_id);
	}
	
	/**
	 *
	 * @param {(string|number)} event_id
	 * @param {AJAXData} [ajax_data]
	 * @param {AJAXCallback} [success]
	 *
	 * @return {jqPromise}
	 */
	AdminEventsTicketsCollection.fetchTickets = function(event_id, ajax_data, success) {
		ajax_data = ajax_data ? ajax_data : {};
		
		return __APP.SERVER.getData('/api/v1/statistics/events/'+event_id+'/tickets', ajax_data, success);
	};
	/**
	 *
	 * @param {(Fields|string)} [fields]
	 * @param {number} [length]
	 * @param {(string|Array)} [order_by]
	 * @param {AJAXCallback} [success]
	 *
	 * @return {jqPromise}
	 */
	AdminEventsTicketsCollection.prototype.fetchTickets = function(fields, length, order_by, success) {
		var self = this;
		
		return AdminEventsTicketsCollection.fetchTickets(this.event_id, {
			fields: fields || undefined,
			offset: this.length,
			length: length || undefined,
			order_by: order_by || undefined
		}, function(data) {
			self.setData(data);
			if (success && typeof success === 'function') {
				success.call(self, self.last_pushed);
			}
		});
	};
	
	return AdminEventsTicketsCollection;
}())); 