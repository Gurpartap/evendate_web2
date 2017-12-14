/**
 * @requires Class.UTMStatsCollection.js
 */
/**
 *
 * @class EventUTMStatsCollection
 * @extends UTMStatsCollection
 */
EventUTMStatsCollection = extending(UTMStatsCollection, (function() {
	/**
	 *
	 * @param {number} event_id
	 *
	 * @constructor
	 * @constructs EventUTMStatsCollection
	 *
	 * @property {number} event_id
	 */
	function EventUTMStatsCollection(event_id) {
		UTMStatsCollection.call(this);
		
		Object.defineProperty(this, 'event_id', {
			value: event_id
		});
	}
	/**
	 *
	 * @param {(Fields|string)} [fields]
	 * @param {number} [length]
	 * @param {(string|Array)} [order_by]
	 *
	 * @return {Promise}
	 */
	EventUTMStatsCollection.prototype.fetch = function(fields, length, order_by) {
		var self = this;
		
		return UTMStatsCollection.fetchEventUTMStats(this.event_id, {
			fields: fields || undefined,
			offset: this.length,
			length: length || undefined,
			order_by: order_by || undefined
		}).then(function(data) {
			self.setData(data);
			
			return self.__last_pushed;
		});
	};
	
	return EventUTMStatsCollection;
}()));