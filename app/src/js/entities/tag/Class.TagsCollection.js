/**
 * @requires ../Class.EntitiesCollection.js
 * @requires Class.OneTag.js
 */
/**
 * @typedef {AJAXData} TagsCollectionAJAXData
 * @property {string} name
 * @property {(string|number)} event_id
 * @property {string} used_since
 * @property {string} used_till
 */
/**
 *
 * @constructor
 * @augments EntitiesCollection
 */
function TagsCollection() {}
TagsCollection.extend(EntitiesCollection);
TagsCollection.prototype.collection_of = OneTag;
/**
 *
 * @param {AJAXData} data
 * @param {AJAXCallback} [success]
 * @returns {jqXHR}
 */
TagsCollection.fetchTags = function(data, success) {
	return __APP.SERVER.getData('/api/v1/tags/', data, success);
};
/**
 *
 * @param {TagsCollectionAJAXData} data
 * @param {AJAXCallback} [success]
 * @returns {jqXHR}
 */
TagsCollection.prototype.fetchTags = function(data, success) {
	var self = this;
	return this.constructor.fetchTags(data, function(data) {
		self.setData(data);
		if (success && typeof success == 'function') {
			success.call(self, data);
		}
	});
};