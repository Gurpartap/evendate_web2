/**
 * @requires ../Class.StatisticsCollection.js
 */
/**
 *
 * @class EventStatisticsCollection
 * @extends StatisticsCollection
 */
EventStatisticsCollection = extending(StatisticsCollection, (function() {
	/**
	 *
	 * @param {number} event_id
	 * @param {string} field
	 *
	 * @constructor
	 * @constructs EventStatisticsCollection
	 *
	 * @property {number} event_id
	 * @property {string} field
	 */
	function EventStatisticsCollection(event_id, field) {
		StatisticsCollection.call(this, field);
		
		Object.defineProperty(this, 'event_id', {
			get: function() {
				
				return event_id;
			}
		});
	}
	
	EventStatisticsCollection.ENDPOINT = Object.freeze({
		EVENT: '/statistics/events/{event_id}',
		FINANCE: '/statistics/events/{event_id}/finance'
	});
	
	/**
	 *
	 * @param {number} event_id
	 * @param {Fields} fields
	 * @param {AJAXCallback} [success]
	 */
	EventStatisticsCollection.fetchStatistics = function(event_id, fields, success) {
		
		return __APP.SERVER.getData(EventStatisticsCollection.ENDPOINT.EVENT.format({event_id: event_id}), {
			fields: fields
		}, success);
	};
	/**
	 *
	 * @inheritDoc
	 */
	EventStatisticsCollection.prototype.fetch = function(scale, since, till, success) {
		var self = this,
			fields_obj = {};
		
		fields_obj[this.field] = Object.assign({
			scale: scale,
			since: since,
			till: till
		});
		
		return this.constructor.fetchStatistics(this.event_id, new Fields(fields_obj), function(data) {
			self.setData(data[self.field]);
			
			if (isFunction(success)) {
				success.call(self, self.last_pushed);
			}
		});
	};
	
	return EventStatisticsCollection;
}()));