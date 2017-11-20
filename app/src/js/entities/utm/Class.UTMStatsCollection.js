/**
 * @requires ../Class.EntitiesCollection.js
 * @requires Class.OneUTMStat.js
 */
/**
 *
 * @class UTMStatsCollection
 * @extends EntitiesCollection
 */
UTMStatsCollection = extending(EntitiesCollection, (function() {
	/**
	 *
	 * @constructor
	 * @constructs UTMStatsCollection
	 */
	function UTMStatsCollection() {
		EntitiesCollection.call(this);
	}
	
	UTMStatsCollection.prototype.collection_of = OneUTMStat;
	
	UTMStatsCollection.ENDPOINT = Object.freeze({
		UTM: '/statistics/events/{event_id}/utm'
	});
	
	/**
	 *
	 * @param {number} event_id
	 * @param {AJAXData} [ajax_data]
	 *
	 * @return {jqPromise}
	 */
	UTMStatsCollection.fetchEventUTMStats = function(event_id, ajax_data) {
		
		return __APP.SERVER.getData(UTMStatsCollection.ENDPOINT.UTM.format({event_id: event_id}), ajax_data);
	};
	
	return UTMStatsCollection;
}()));