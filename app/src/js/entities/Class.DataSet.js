/**
 *
 * @class DataSet
 * @extends Array
 */
DataSet = extending(Array, (function() {
	/**
	 *
	 * @constructor
	 * @constructs DataSet
	 *
	 * @property {Object<(string|number), Data>} __lookup
	 * @property {Array<Data>} __last_pushed
	 */
	function DataSet() {
		Object.defineProperties(this, {
			__lookup: {
				value: {},
				writable: true,
				enumerable: false,
				configurable: false
			},
			__last_pushed: {
				value: []
			}
		});
	}
	
	classEscalation(DataSet,
		/**
		 * @lends DataSet.prototype
		 */
		{
			collection_of: Data,
			/**
			 *
			 * @param {(Array|object)} data
			 *
			 * @returns {DataSet}
			 */
			setData: function(data) {
				data = data instanceof Array ? data : [data];
				this.push.apply(this, data);
				
				return this;
			},
			/**
			 *
			 * @param {(string|number)} id
			 *
			 * @returns {(Data|null)}
			 */
			getByID: function(id) {
				
				return this.__lookup.hasOwnProperty(id) ? this.__lookup[id] : null;
			},
			/**
			 *
			 * @param {(string|number)} id
			 *
			 * @returns {boolean}
			 */
			has: function(id) {
				
				return this.getByID(id) instanceof Data;
			},
			/**
			 *
			 * @param {...object} element
			 *
			 * @returns {number}
			 */
			push: function(element) {
				var item,
					ID_PROP_NAME = this.collection_of.prototype.ID_PROP_NAME,
					entities = arguments;
				
				this.__last_pushed.splice(0);
				
				for (var i = 0, entity = entities[i]; i < entities.length; entity = entities[++i]) {
					if (empty(entity[ID_PROP_NAME]) || (!empty(entity[ID_PROP_NAME]) && !this.has(entity[ID_PROP_NAME]))) {
						if (entity instanceof this.collection_of) {
							item = entity;
						} else {
							if (typeof this.collection_of.factory === 'function') {
								item = this.collection_of.factory(entity);
							} else {
								item = (new this.collection_of()).setData(entity);
							}
						}
						this.__last_pushed.push(item);
						this[this.length++] = item;
						if (!empty(item[ID_PROP_NAME])) {
							this.__lookup[item[ID_PROP_NAME]] = item;
						}
						this.createAdditionalLookup(item);
					}
				}
				
				return this.length;
			},
			/**
			 *
			 * @param {(string|number)} id
			 *
			 * @returns {(OneEntity|null)}
			 */
			pull: function(id) {
				var entity;
				
				if (this.has(id)) {
					entity = this.getByID(id);
					this.remove(id);
					
					return entity;
				}
				
				return null;
			},
			createAdditionalLookup: function() {},
			emptyAdditionalLookup: function() {},
			/**
			 *
			 * @return {Array}
			 */
			getArrayCopy: function() {
				
				return this.map(function(el) {
					return el;
				})
			},
			/**
			 *
			 * @return {PlainArray}
			 */
			toPlainArray: function() {
				
				return toPlainArray(this);
			},
			/**
			 *
			 * @param {(string|number)} id
			 *
			 * @returns {Array<Data>}
			 */
			remove: function(id) {
				if (this.has(id)) {
					delete this.__lookup[id];
					
					return this.splice(this.indexOf(this.getByID(id)), 1);
				}
				
				return [];
			},
			/**
			 *
			 * @return {DataSet}
			 */
			empty: function() {
				this.__last_pushed.splice(0, this.__last_pushed.length);
				this.__lookup = {};
				this.emptyAdditionalLookup();
				this.splice(0, this.length);
				
				return this;
			},
			/**
			 *
			 * @param {string} key
			 * @param {boolean} [ascending=false]
			 *
			 * @return {DataSet}
			 */
			sortBy: function(key, ascending) {
				var key_spliced = key.split('.');
				
				this.sort(function(a, b) {
					var cur_a = mergeObjects({}, a),
						cur_b = mergeObjects({}, b);
					
					key_spliced.forEach(function(key) {
						cur_a = typeof cur_a[key] === 'object' ? mergeObjects({}, cur_a[key]) : cur_a[key];
						cur_b = typeof cur_b[key] === 'object' ? mergeObjects({}, cur_b[key]) : cur_b[key];
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
			},
			/**
			 *
			 * @return {string}
			 */
			toString: function() {
				
				return JSON.stringify(this);
			}
		}
	);
	
	return DataSet;
}()));