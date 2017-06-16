/**
 * @requires EntityInterface.js
 * @requires Class.Fields.js
 */
/**
 *
 * @abstract
 * @class
 * @implements EntityInterface
 */
OneEntity = (function() {
	/**
	 *
	 * @constructor
	 * @constructs OneEntity
	 */
	function OneEntity() {}
	
	OneEntity.prototype.ID_PROP_NAME = 'id';
	/**
	 *
	 * @param {(Array|object)} data
	 * @returns {OneEntity}
	 */
	OneEntity.prototype.setData = function(data) {
		var field;
		if (Array.isArray(data)) {
			data = data[0];
		}
		for (field in data) {
			if (data.hasOwnProperty(field) && this.hasOwnProperty(field)) {
				if ((this[field] instanceof EntitiesCollection || this[field] instanceof OneEntity) && data[field] != null) {
					this[field].setData(data[field]);
				} else {
					this[field] = data[field];
				}
			}
		}
		return this;
	};
	
	return OneEntity;
}());
