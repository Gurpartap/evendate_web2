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
		
		Object.defineProperty(FieldsProps.prototype, 'toString', {
			value: function() {
				var output = {},
					prop;
				for (prop in this) {
					if (this.hasOwnProperty(prop)) {
						if (this[prop] instanceof Array) {
							output[prop] = this[prop].join(',');
						} else if (this[prop] instanceof Fields) {
							output[prop] = this[prop].toString();
						} else {
							output[prop] = this[prop];
						}
					}
				}
				return JSON.stringify(output);
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
			var fields = [],
				field;
			for(field in this){
				if(this.hasOwnProperty(field)){
					if(Object.keys(this[field]).length){
						fields.push(field+this[field]);
					} else {
						fields.push(field);
					}
				}
			}
			return fields.join(',');
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
	 * @param {(string|Array)} fields
	 * @return {Fields}
	 */
	Fields.parseFields = function(fields){
		return new Fields(parseFields(fields));
	};
	
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
				for(field in arg) {
					parsed_obj[field] = arg[field];
				}
			}
		});
		
		for(field in parsed_obj){
			this[field] = new FieldsProps(parsed_obj[field]);
		}
		
		return this;
	};
	
	return Fields;
}());