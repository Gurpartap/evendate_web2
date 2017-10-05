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
			if (empty(entity[ID_PROP_NAME]) || (!empty(entity[ID_PROP_NAME]) && !this.has(entity[ID_PROP_NAME]))) {
				item = (entity instanceof this.collection_of) ? entity : (new this.collection_of()).setData(entity);
				this.last_pushed.push(item);
				this[this.length++] = item;
				if (!empty(item[ID_PROP_NAME])) {
					this.__lookup[item[ID_PROP_NAME]] = item;
				}
				this.createAdditionalLookup(item);
			}
		}
		
		return this.length;
	};
	
	EntitiesCollection.prototype.createAdditionalLookup = function() {};
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
	/**
	 *
	 * @param {string} key
	 * @param {boolean} [ascending=false]
	 *
	 * @return {EntitiesCollection}
	 */
	EntitiesCollection.prototype.sortBy = function(key, ascending) {
		var key_spliced = key.split('.');
		
		this.sort(function(a, b) {
			var cur_a = Object.assign({}, a),
				cur_b = Object.assign({}, b);
			
			key_spliced.forEach(function(key) {
				cur_a = typeof cur_a[key] === 'object' ? Object.assign({}, cur_a[key]) : cur_a[key];
				cur_b = typeof cur_b[key] === 'object' ? Object.assign({}, cur_b[key]) : cur_b[key];
			});
			
			if (isFinite(cur_a) && isFinite(cur_b)) {
				
				return ascending ? cur_a - cur_b : cur_b - cur_a;
			} else {
				
				if (cur_a.name > cur_b.name) {
					
					return ascending ? 1 : -1;
				}
				if (cur_a.name < cur_b.name) {
					
					return ascending ? -1 : 1;
				}
				
				return 0;
			}
		});
		
		return this;
	};
	
	return EntitiesCollection;
}()));