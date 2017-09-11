/**
 * @class Fields
 */
Fields = (function() {
	/**
	 * @class FieldsProps
	 */
	var FieldsProps = (function() {
		/**
		 *
		 * @constructs Field
		 * @param {Object} [obj]
		 */
		function FieldsProps(obj) {
			var field;
			for(field in obj){
				this[field] = obj[field];
			}
		}
		
		Object.defineProperties(FieldsProps.prototype, {
			toString: {
				value: function() {
					var self = this,
						props = Object.props(this),
						output = {};
					
					if (props.length === 0)
						return '';
					
					props.forEach(function(prop) {
						output[prop] = (self[prop] instanceof Array || self[prop] instanceof Fields) ? self[prop].toString() : self[prop];
					});
					
					
					return JSON.stringify(output);
				}
			},
			merge: {
				value: function(obj) {
					return $.extend(this, obj);
				}
			}
		});
		
		return FieldsProps;
	}());
	/**
	 *
	 * @param {...(Object|Array|string)} [obj]
	 *
	 * @constructor
	 * @constructs Fields
	 */
	function Fields(obj) {
		this.push.apply(this, arguments);
		
		Object.defineProperty(this, 'length', {
			configurable: true,
			enumerable: false,
			writable: true,
			value: 0
		});
	}
	
	/**
	 *
	 * @param {(string|Array)} fields
	 *
	 * @return {{}}
	 */
	function parseFields(fields){
		var parsed_fields = {};
		
		if(!(fields instanceof Array)){
			fields = fields.replace(/\s+/g, '').match(/(\w+\{[^}]+}|\w+)/g);
		}
		
		fields.forEach(function(field) {
			var split = field.split('{'),
				subset = {};
			if(split.length > 1){
				subset = JSON.parse('{' + split[1].replace(/(\w+):/g, function(str, m1) {return '"'+m1+'":';}));
				if(subset.fields){
					subset.fields = new (Function.prototype.bind.apply(Fields, [null].concat(subset.fields.split(','))))();
				}
				if(subset.order_by){
					subset.order_by = subset.order_by.split(',');
				}
			}
			parsed_fields[split[0]] = subset;
		});
		
		return parsed_fields;
	}
	
	/**
	 *
	 * @param {(string|Array|Fields)} fields
	 *
	 * @return {Fields}
	 */
	Fields.parseFields = function(fields){
		if (fields instanceof Fields) {
			
			return fields.copy();
		}
		
		return new Fields(parseFields(fields));
	};
	
	classEscalation(Fields, function() {
		/**
		 *
		 * @lends Fields.prototype
		 */
		var methods = {
			/**
			 * Getting field by name
			 *
			 * @param {string} field_name
			 *
			 * @return {(FieldsProps|null)}
			 */
			get: function(field_name) {
				if (this.has(field_name)) {
					
					return this[field_name];
				}
				
				return null;
			},
			/**
			 *
			 * @param {...(string|Array<string>|Object<string, *>)} field_name
			 * @param {...FieldsProps} [field_props]
			 *
			 * @return {Fields}
			 */
			push: function(field_name, field_props) {
				var args = Array.prototype.splice.call(arguments, 0),
					field,
					parsed_obj = {};
				
				if (typeof field_name === 'string' && field_props instanceof FieldsProps) {
					if (this.has(field_name)) {
						this[field_name].merge(field_props);
					} else {
						this[field_name] = field_props;
						this.length++;
					}
				} else {
					args.forEach(function(arg) {
						if(typeof arg === 'string'){
							parsed_obj[arg] = {};
						} else if (arg instanceof Array) {
							arg.forEach(function(field) {
								parsed_obj[field] = {};
							});
						} else if (arg instanceof Object) {
							Object.props(arg).forEach(function(field) {
								parsed_obj[field] = arg[field];
							});
						}
					});
					
					for(field in parsed_obj){
						if (this.has(field)) {
							this[field].merge(parsed_obj[field]);
						} else {
							this[field] = new FieldsProps(parsed_obj[field]);
							this.length++;
						}
					}
				}
				
				return this;
			},
			/**
			 * Pulling out field by name
			 *
			 * @param {string} field_name
			 *
			 * @return {(FieldsProps|null)}
			 */
			pull: function(field_name) {
				var field = this.get(field_name);
				
				this.delete(field_name);
				
				return field;
			},
			/**
			 * Checks if field exists by field`s name
			 *
			 * @param {string} field_name
			 *
			 * @return {boolean}
			 */
			has: function(field_name) {
				
				return typeof this[field_name] !== 'undefined';
			},
			/**
			 * Deleting field by name
			 *
			 * @param {string} field_name
			 *
			 * @return {boolean}
			 */
			delete: function(field_name) {
				if (this.has(field_name)) {
					this.length--;
					
					return delete this[field_name];
				}
				
				return false;
			},
			/**
			 * Returns copy of current object
			 *
			 * @return {Fields}
			 */
			copy: function() {
				
				return new Fields(this);
			},
			/**
			 *
			 * @param {function(field_name: string, filters: FieldsProps, fields: Fields)} callback
			 *
			 * @return {Fields}
			 */
			forEach: function(callback) {
				var field_name;
				
				for (field_name in this) {
					if (this.hasOwnProperty(field_name) && !isFunction(this[field_name])) {
						callback(field_name, this[field_name], this);
					}
				}
				
				return this;
			},
			/**
			 *
			 * @return {?string}
			 */
			toString: function() {
				var self = this,
					fields = Object.props(this);
				
				if (fields.length === 0)
					return undefined;
				
				return fields.map(function(field_name) {
					return field_name + self[field_name];
				}).join(',');
			}
		};
		
		methods.add = methods.push;
		
		return methods;
	});
	
	return Fields;
}());