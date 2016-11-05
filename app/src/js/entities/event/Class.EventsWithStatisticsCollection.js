/**
 * @requires Class.EventsCollection.js
 * @requires Class.OneEventWithStatistics.js
 */
/**
 *
 * @constructor
 * @augments EventsCollection
 */
function EventsWithStatisticsCollection() {}
EventsWithStatisticsCollection.extend(EventsCollection);
EventsWithStatisticsCollection.prototype.collection_of = OneEventWithStatistics;
/**
 *
 * @param {EventsCollectionAJAXData} data
 * @param {EventsCollectionAJAXCallback} [success]
 * @returns {jqXHR}
 */
EventsWithStatisticsCollection.fetchEvents = function(data, success) {
	data.statistics = true;
	return __APP.SERVER.getData('/api/v1/events/', data, success);
};
/**
 *
 * @param {EventsCollectionAJAXData} data
 * @param {EventsCollectionAJAXCallback} [success]
 * @returns {jqXHR}
 */
EventsWithStatisticsCollection.fetchMyEvents = function(data, success) {
	data.statistics = true;
	return __APP.SERVER.getData('/api/v1/events/my', data, success);
};
/**
 *
 * @param {EventsCollectionAJAXData} data
 * @param {EventsCollectionAJAXCallback} [success]
 * @returns {jqXHR}
 */
EventsWithStatisticsCollection.fetchFavoredEvents = function(data, success) {
	data.statistics = true;
	return __APP.SERVER.getData('/api/v1/events/favorites', data, success);
};
/**
 *
 * @param {EventsCollectionAJAXData} data
 * @param {EventsCollectionAJAXCallback} [success]
 * @returns {jqXHR}
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
 * @returns {jqXHR}
 */
EventsWithStatisticsCollection.fetchOrganizationsEvents = function(organization_id, data, success) {
	data.statistics = true;
	return __APP.SERVER.getData('/api/v1/events/', $.extend({}, data, {organization_id: organization_id}), success);
};