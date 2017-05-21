/**
 * @requires Class.OneEntity.js
 */
/**
 *
 * @abstract
 * @class EntitiesCollection
 * @extends Array
 * @implements EntityInterface
 */
EntitiesCollection = extending(Array, (function() {
	/**
	 *
	 * @constructor
	 * @constructs EntitiesCollection
	 *
	 * @property {Object<(string|number), OneEntity>} __lookup
	 * @property {Array<OneEntity>} last_pushed
	 */
	function EntitiesCollection() {
		Object.defineProperties(this, {
			__lookup: {
				value: {},
				writable: true,
				enumerable: false,
				configurable: false
			},
			'last_pushed': {
				value: []
			}
		});
	}
	EntitiesCollection.prototype.ID_PROP_NAME = 'id';
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
		return this.__lookup.hasOwnProperty(id) ? this.__lookup[id] : null;
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
		var item;
		this.last_pushed.splice(0);
		for (var i = 0; i < arguments.length; i++) {
			if (!arguments[i][this.ID_PROP_NAME] || (arguments[i][this.ID_PROP_NAME] && !this.has(arguments[i][this.ID_PROP_NAME]))) {
				item = (arguments[i] instanceof this.collection_of) ? arguments[i] : (new this.collection_of()).setData(arguments[i]);
				this.last_pushed.push(item);
				this[this.length++] = item;
				if (arguments[i][this.ID_PROP_NAME]) {
					this.__lookup[arguments[i][this.ID_PROP_NAME]] = item;
				}
			}
		}
		return this.length;
	};
	/**
	 *
	 * @return {Array}
	 */
	EntitiesCollection.prototype.getArrayCopy = function() {
		return this.map(function(el) {
			return el;
		})
	};
	/**
	 *
	 * @param {(string|number)} id
	 * @returns {Array<OneEntity>}
	 */
	EntitiesCollection.prototype.remove = function(id) {
		if (this.has(id)) {
			delete this.__lookup[id];
			return this.splice(this.indexOf(this.getByID(id)), 1);
		}
		return [];
	};
	/**
	 *
	 * @return {EntitiesCollection}
	 */
	EntitiesCollection.prototype.empty = function() {
		this.last_pushed.splice(0, this.last_pushed.length);
		this.__lookup = {};
		this.splice(0, this.length);
		
		return this;
	};
	
	return EntitiesCollection;
}()));