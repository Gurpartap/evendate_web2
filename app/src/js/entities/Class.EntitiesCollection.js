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
		var item,
			ID_PROP_NAME = this.collection_of.prototype.ID_PROP_NAME,
			entities = arguments;
		
		this.last_pushed.splice(0);
		
		for (var i = 0, entity = entities[i]; i < entities.length; entity = entities[++i]) {
			if (!entity[ID_PROP_NAME] || (entity[ID_PROP_NAME] && !this.has(entity[ID_PROP_NAME]))) {
				item = (entity instanceof this.collection_of) ? entity : (new this.collection_of()).setData(entity);
				this.last_pushed.push(item);
				this[this.length++] = item;
				if (item[ID_PROP_NAME]) {
					this.__lookup[item[ID_PROP_NAME]] = item;
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