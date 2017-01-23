/**
 * @requires EntityInterface.js
 * @requires Class.Fields.js
 */
/**
 *
 * @abstract
 * @implements EntityInterface
 */
function OneEntity() {}
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
		if (this[field] instanceof EntitiesCollection || this[field] instanceof OneEntity) {
			this[field].setData(data[field]);
		} else {
			this[field] = data[field];
		}
	}
	return this;
};