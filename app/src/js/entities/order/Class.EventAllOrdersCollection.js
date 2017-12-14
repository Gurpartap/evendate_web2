/**
 * @requires Class.AbstractEventOrdersCollection.js
 */
/**
 *
 * @class EventAllOrdersCollection
 * @extends AbstractEventOrdersCollection
 */
EventAllOrdersCollection = extending(AbstractEventOrdersCollection, (function() {
	/**
	 *
	 * @param {(string|number)} [event_id=0]
	 *
	 * @constructor
	 * @constructs EventAllOrdersCollection
	 *
	 * @property {(string|number)} event_id
	 */
	function EventAllOrdersCollection(event_id) {
		AbstractEventOrdersCollection.call(this, event_id);
	}
	
	/**
	 *
	 * @param {(string|number)} event_id
	 * @param {AJAXData} [ajax_data]
	 * @param {AJAXCallback} [success]
	 *
	 * @return {Promise}
	 */
	EventAllOrdersCollection.fetchOrders = function(event_id, ajax_data, success) {
		return __APP.SERVER.getData('/api/v1/statistics/events/' + event_id + '/orders', ajax_data, success);
	};
	/**
	 *
	 * @param {ServerExports.EXPORT_EXTENSION} [format=xlsx]
	 *
	 * @return {Promise}
	 */
	EventAllOrdersCollection.prototype.export = function(format) {
		
		return (new ServerExports()).eventOrders(this.event_id, format);
	};
	
	
	return EventAllOrdersCollection;
}()));