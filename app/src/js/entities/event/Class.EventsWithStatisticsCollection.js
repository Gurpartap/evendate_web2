/**
 * @requires Class.EventsCollection.js
 * @requires Class.OneEventWithStatistics.js
 */
/**
 *
 * @class EventsWithStatisticsCollection
 * @extends EventsCollection
 */
EventsWithStatisticsCollection = extending(EventsCollection, (function() {
	/**
	 *
	 * @constructor
	 * @constructs EventsWithStatisticsCollection
	 */
	function EventsWithStatisticsCollection() {
		EventsCollection.call(this);
	}
	EventsWithStatisticsCollection.prototype.collection_of = OneEventWithStatistics;
	/**
	 *
	 * @param {EventsCollectionAJAXData} data
	 * @param {EventsCollectionAJAXCallback} [success]
	 * @returns {Promise}
	 */
	EventsWithStatisticsCollection.fetchEvents = function(data, success) {
		data.statistics = true;
		return __APP.SERVER.getData('/api/v1/events/', data, success);
	};
	/**
	 *
	 * @param {EventsCollectionAJAXData} data
	 * @param {EventsCollectionAJAXCallback} [success]
	 * @returns {Promise}
	 */
	EventsWithStatisticsCollection.fetchMyEvents = function(data, success) {
		data.statistics = true;
		return __APP.SERVER.getData('/api/v1/events/my', data, success);
	};
	/**
	 *
	 * @param {EventsCollectionAJAXData} data
	 * @param {EventsCollectionAJAXCallback} [success]
	 * @returns {Promise}
	 */
	EventsWithStatisticsCollection.fetchFavoredEvents = function(data, success) {
		data.statistics = true;
		return __APP.SERVER.getData('/api/v1/events/favorites', data, success);
	};
	/**
	 *
	 * @param {EventsCollectionAJAXData} data
	 * @param {EventsCollectionAJAXCallback} [success]
	 * @returns {Promise}
	 */
	EventsWithStatisticsCollection.fetchRecommendedEvents = function(data, success) {
		data.statistics = true;
		return __APP.SERVER.getData('/api/v1/events/recommendations', data, success);
	};
	/**
	 *
	 * @param {(number|string)} organization_id
	 * @param {EventsCollectionAJAXData} data
	 * @param {EventsCollectionAJAXCallback} [success]
	 * @returns {Promise}
	 */
	EventsWithStatisticsCollection.fetchOrganizationsEvents = function(organization_id, data, success) {
		data.statistics = true;
		return __APP.SERVER.getData('/api/v1/events/', $.extend({}, data, {organization_id: organization_id}), success);
	};
	
	return EventsWithStatisticsCollection;
}()));