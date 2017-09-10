/**
 * @requires Class.EventStatisticsCollection.js
 */
/**
 *
 * @class EventFinanceStatisticsCollection
 * @extends EventStatisticsCollection
 */
EventFinanceStatisticsCollection = extending(EventStatisticsCollection, (function() {
	/**
	 *
	 * @param {number} event_id
	 * @param {string} field
	 *
	 * @constructor
	 * @constructs EventFinanceStatisticsCollection
	 *
	 * @property {number} event_id
	 * @property {string} field
	 */
	function EventFinanceStatisticsCollection(event_id, field) {
		EventStatisticsCollection.call(this, event_id, field);
	}
	
	/**
	 *
	 * @param {number} event_id
	 * @param {Fields} fields
	 * @param {AJAXCallback} [success]
	 */
	EventFinanceStatisticsCollection.fetchStatistics = function(event_id, fields, success) {
		
		return __APP.SERVER.getData(EventStatisticsCollection.ENDPOINT.FINANCE.format({event_id: event_id}), {
			fields: fields
		}, success);
	};
	
	return EventFinanceStatisticsCollection;
}()));