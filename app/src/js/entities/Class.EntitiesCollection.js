/**
 * @requires Class.OneEntity.js
 */
/**
 *
 * @abstract
 * @augments Array
 * @implements EntityInterface
 */
function EntitiesCollection() {
	Object.defineProperty(this, 'last_pushed', {
		value: [],
		writable: true,
		enumerable: false,
		configurable: false
	});
}
EntitiesCollection.extend(Array);
EntitiesCollection.prototype.collection_of = OneEntity;
/**
 *
 * @param {(Array|object)} data
 * @returns {EntitiesCollection}
 */
EntitiesCollection.prototype.setData = function(data) {
	data = data instanceof Array ? data : [data];
	this.push.apply(this, data);
	return this;
};
/**
 *
 * @param {(string|number)} id
 * @returns {(OneEntity|null)}
 */
EntitiesCollection.prototype.getByID = function(id) {
	for (var i = 0; i < this.length; i++) {
		if (this[i].id == id) {
			return this[i];
		}
	}
	return null;
};
/**
 *
 * @param {(string|number)} id
 * @returns {boolean}
 */
EntitiesCollection.prototype.has = function(id) {
	return this.getByID(id) instanceof OneEntity;
};
/**
 *
 * @param {...object} element
 * @returns {number}
 */
EntitiesCollection.prototype.push = function(element) {
	this.last_pushed = [];
	for (var i = 0; i < arguments.length; i++) {
		if (!arguments[i].id || (arguments[i].id && !this.has(arguments[i].id))) {
			this.last_pushed.push(this[this.length++] = arguments[i] instanceof this.collection_of ? arguments[i] : (new this.collection_of()).setData(arguments[i]));
		}
	}
	return this.length;
};
/**
 *
 * @param {(string|number)} id
 * @returns {Array<OneEntity>}
 */
EntitiesCollection.prototype.remove = function(id) {
	if (this.has(id)) {
		return this.splice(this.indexOf(this.getByID(id)), 1);
	}
	return [];
};