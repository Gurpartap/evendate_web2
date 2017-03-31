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
	 * @constructs Fields
	 * @param {...(Object|Array|string)} [obj]
	 */
	function Fields(obj) {
		this.add.apply(this, arguments);
	}
	
	Object.defineProperty(Fields.prototype, 'toString', {
		value: function() {
			var self = this,
				fields = Object.props(this);
			
			if (fields.length === 0)
				return undefined;
			
			return fields.map(function(field_name) {
				return field_name + self[field_name];
			}).join(',');
		}
	});
	
	/**
	 *
	 * @param {(string|Array)} fields
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
	 * @return {Fields}
	 */
	Fields.parseFields = function(fields){
		if (fields instanceof Fields)
			return fields.copy();
		return new Fields(parseFields(fields));
	};
	/**
	 * Getting field by name
	 *
	 * @param {string} field_name
	 * @return {(FieldsProps|null)}
	 */
	Fields.prototype.get = function(field_name) {
		if (this.has(field_name))
			return this[field_name];
		return null;
	};
	/**
	 *
	 * @param {...(string|Array<string>|Object<string, *>)} field_name
	 * @return {Fields}
	 */
	Fields.prototype.push = Fields.prototype.add = function() {
		var args = Array.prototype.splice.call(arguments, 0),
			field,
			parsed_obj = {};
		
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
			}
		}
		
		return this;
	};
	/**
	 * Pulling out field by name
	 *
	 * @param {string} field_name
	 * @return {(FieldsProps|null)}
	 */
	Fields.prototype.pull = function(field_name) {
		var field = this.get(field_name);
		this.delete(field_name);
		
		return field;
	};
	/**
	 * Checks if field exists by field`s name
	 *
	 * @param {string} field_name
	 * @return {boolean}
	 */
	Fields.prototype.has = function(field_name) {
		return typeof this[field_name] !== 'undefined';
	};
	/**
	 * Deleting field by name
	 *
	 * @param {string} field_name
	 * @return {boolean}
	 */
	Fields.prototype.delete = function(field_name) {
		if (this.has(field_name))
			return delete this[field_name];
		return false;
	};
	/**
	 * Returns copy of current object
	 *
	 * @return {Fields}
	 */
	Fields.prototype.copy = function() {
		return new Fields(this);
	};
	
	return Fields;
}());