/**
 * @requires ../Class.OneEntity.js
 */
/**
 *
 * @class OneTag
 * @extends OneEntity
 */
OneTag = extending(OneEntity, function() {
	/**
	 *
	 * @param {(string|number)} [tag_id]
	 * @param {boolean} [is_loading_continuous]
	 * @constructor
	 * @constructs OneTag
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
	/**
	 *
	 * @param {(string|number)} tag_id
	 * @param {AJAXCallback} [success]
	 * @returns {Promise}
	 */
	OneTag.fetchTag = function(tag_id, success) {
		return __APP.SERVER.getData('/api/v1/tags/' + tag_id, {}, success);
	};
	/**
	 *
	 * @param {AJAXCallback} [success]
	 * @returns {Promise}
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
	
	return OneTag;
}());