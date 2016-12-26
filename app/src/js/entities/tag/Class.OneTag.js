/**
 * @requires ../Class.OneEntity.js
 */
/**
 *
 * @constructor
 * @augments OneEntity
 * @param {(string|number)} [tag_id]
 * @param {boolean} [is_loading_continuous]
 */
function OneTag(tag_id, is_loading_continuous) {
	this.id = tag_id ? tag_id : 0;
	this.name = '';
	
	if (tag_id && is_loading_continuous) {
		this.loading = true;
		this.fetchTag(function() {
			this.loading = false;
			$(window).trigger('fetch.OneTag');
		});
	}
}
OneTag.extend(OneEntity);
/**
 *
 * @param {(string|number)} tag_id
 * @param {AJAXCallback} [success]
 * @returns {jqPromise}
 */
OneTag.fetchTag = function(tag_id, success) {
	return __APP.SERVER.getData('/api/v1/tags/' + tag_id, {}, success);
};
/**
 *
 * @param {AJAXCallback} [success]
 * @returns {jqPromise}
 */
OneTag.prototype.fetchTag = function(success) {
	var self = this;
	return this.constructor.fetchTag(self.id, function(data) {
		self.setData(data[0]);
		if (success && typeof success == 'function') {
			success.call(self, data[0]);
		}
	});
};