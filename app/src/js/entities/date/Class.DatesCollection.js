/**
 * @requires ../Class.EntitiesCollection.js
 * @requires Class.OneDate.js
 */
/**
 * @typedef {AJAXData} DatesCollectionAJAXData
 * @property {string} [month]
 * @property {string} [since]
 * @property {string} [till]
 * @property {(number|string)} [organization_id]
 * @property {(number|string)} [event_id]
 * @property {boolean} [unique]
 * @property {boolean} [my]
 */
/**
 *
 * @constructor
 * @augments EntitiesCollection
 */
function DatesCollection() {}
DatesCollection.prototype.collection_of = OneDate;
DatesCollection.extend(EntitiesCollection);
/**
 *
 * @param {DatesCollectionAJAXData} ajax_data
 * @param {AJAXCallback} [success]
 * @returns {jqPromise}
 */
DatesCollection.fetchDates = function(ajax_data, success) {
	return __APP.SERVER.getData('/api/v1/events/dates', ajax_data, success);
};