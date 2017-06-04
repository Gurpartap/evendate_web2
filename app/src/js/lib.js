/**
 * @const __C
 * @property {Object<string, string>} CLASSES
 * @property {string} DATE_FORMAT
 * @property {Object<string, string>} COLORS
 * @property {Object<string, string>} STATS
 * @property {Object<string, string[]>} ACTION_NAMES
 * @property {Object<string, string>} ENTITIES
 */
__C = {
	CLASSES: {
		MATERIAL: 'material',
		FLOATING_MATERIAL: 'material -floating_material',
		IMG_HOLDER: 'img_holder',
		TEXT_COLORS: {
			ACCENT: '-text_color_accent'
		},
		COLORS: {
			ACCENT: '-color_accent',
			PRIMARY: '-color_primary',
			DEFAULT: '-color_default',
			NEUTRAL: '-color_neutral',
			NEUTRAL_ACCENT: '-color_neutral_accent',
			MARGINAL: '-color_marginal',
			MARGINAL_ACCENT: '-color_marginal_accent',
			MARGINAL_PRIMARY: '-color_marginal_primary',
			MARGINAL_FRANKLIN: '-color_marginal_franklin',
			MARGINAL_BUBBLEGUM: '-color_marginal_bubble_gum'
		},
		ALIGN: {
			LEFT: '-align_left',
			CENTER: '-align_center',
			RIGHT: '-align_right'
		},
		UNIVERSAL_STATES: {
			EMPTY: '-empty',
			ROUNDED: '-rounded',
			SHADOWED: '-shadowed',
			BORDERED: '-bordered',
			TRANSFORM_UPPERCASE: '-transform_uppercase'
		},
		STATUS: {
			SUCCESS: '-status_success',
			WARNING: '-status_warning',
			PENDING: '-status_pending',
			ERROR: '-status_error',
			DISABLED: '-status_disabled'
		},
		SIZES: {
			X30: '-size_30x30',
			X40: '-size_40x40',
			X50: '-size_50x50',
			X55: '-size_55x55',
			LOW: '-size_low',
			WIDE: '-size_wide',
			SMALL: '-size_small'
		},
		MODAL_STATES: {
			FIXED: '-fixed',
			NO_PADDING: '-no_padding',
			SIZE: {
				WIDE: '-size_wide',
				NARROW: '-size_narrow',
				TINY: '-size_tiny',
				RESPONSIVE: '-size_responsive'
			}
		},
		HOOKS: {
			HANDLED: '-Handled_',
			RIPPLE: 'RippleEffect',
			ADD_STAFF: 'AddStaff',
			ADD_TO_FAVORITES: 'AddToFavorites',
			TEXT: 'Text',
			CALL_MODAL: 'CallModal',
			CLOSE_MODAL: 'CloseModal',
			DROPDOWN_BUTTON: 'DropdownButton',
			ADD_AVATAR: {
				ANCESTOR: 'AddAvatarWrapper',
				COLLECTION: 'AvatarsCollection',
				QUANTITY: 'FavoredCount',
				STATES: {
					CAST: '-cast',
					CASTABLE: '-castable',
					SHIFT: '-shift',
					SHIFTED: '-shifted'
				}
			}
		},
		ACTIVE: '-active',
		DISABLED: '-disabled',
		HIDDEN: '-hidden',
		ICONS: {
			STAR: 'fa-star',
			STAR_O: 'fa-star-o',
			BELL_O: 'fa-bell-o',
			TIMES: 'fa-times',
			PLUS: 'fa-plus',
			CHECK: 'fa-check',
			PENCIL: 'fa-pencil',
			EYE: 'fa-eye',
			EYE_CLOSE: 'fa-eye-slash',
			TICKET: 'fa-ticket'
		},
		ICON_CLASS: 'fa_icon'
	},
	SOCICON_CLASSES: {
		'vk': 'fa-vk',
		'google': 'fa-google-plus',
		'facebook': 'fa-facebook-official'
	},
	DATE_FORMAT: 'YYYY-MM-DD',
	MODAL_TYPES: {
		FAVORS: 'favors',
		SUBSCRIBERS: 'subscribers',
		EDITORS: 'editors',
		MAP: 'map',
		MEDIA: 'media',
		CROPPER: 'cropper',
		FRIENDS_LIST: 'friends_list',
		SUBSCRIBERS_LIST: 'subscribers_list',
		TICKET: 'tickets',
		ADD_STAFF: 'add_staff'
	},
	COLORS: {
		PRIMARY: '#2e3b50',
		MUTED: '#3e4d66',
		MUTED_80: '#657184',
		MUTED_50: '#9fa6b3',
		MUTED_30: '#c5c9d1',
		TEXT: '#4a4a4a',
		ACCENT: '#f82969',
		ACCENT_ALT: '#ff5f9e',
		FRANKLIN: '#28be84',
		FRANKLIN_ALT: '#23d792'
	},
	STATS: {
		EVENT_VIEW: 'view',
		EVENT_VIEW_DETAIL: 'view_detail',
		EVENT_OPEN_SITE: 'open_site',
		EVENT_OPEN_MAP: 'open_map',
		ORGANIZATION_OPEN_SITE: 'open_site',
		EVENT_ENTITY: 'event',
		ORGANIZATION_ENTITY: 'organization'
	},
	/**
	 * @enum {string}
	 */
	ENTITIES: {
		USER: 'user',
		EVENT: 'event',
		ORGANIZATION: 'organization'
	},
	/**
	 * @enum {string}
	 */
	DEFERRED_STATES: {
		PENDING: 'pending',
		RESOLVED: 'resolved',
		REJECTED: 'rejected'
	}
};
/**
 * Extending class
 *
 * @param {...Function} parents
 * @param {Function} children
 * @return {Function}
 */
function extending(/**...parents, children*/){
	var children = Array.prototype.pop.call(arguments),
		parents = Array.prototype.slice.call(arguments);
	
	parents.forEach(function(parent) {
		children.prototype = $.extend(Object.create(parent.prototype), children.prototype);
	});
	children.prototype.constructor = children;
	
	return children;
}
/**
 * Extending jQuery object
 *
 * @param {Function} children
 * @return {Function}
 */
function extendingJQuery(children){
	children.prototype = $.extend(Object.create(jQuery.prototype), children.prototype);
	children.prototype.constructor = children;
	
	children.prototype.pushStack = function(elems) {
		var ret = jQuery.merge(this.get(0) == elems ? new this.constructor() : $(), elems);
		ret.prevObject = this;
		ret.context = this.context;
		return ret;
	};
	
	
	return children;
}
/**
 * Returns capitalized string
 *
 * @return {string}
 */
String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
};
/**
 * Checks if string contains some substring
 *
 * @param {(string|RegExp)} it
 * @return {boolean}
 */
String.prototype.contains = function(it) {return this.search(it) !== -1;};
/**
 * Works like printf. Variables must be inside the {braces}. Returns formatted string
 *
 * @param {object} fields
 * @return {string}
 */
String.prototype.format = function(fields) {
	return this.replace(/\{(\w+)\}/g, function(m, n) {
		return fields[n] != null ? fields[n] : '';
	});
};
/**
 * Converts {delimiter}-separated string into CamelCase
 *
 * @param {string} [delimiter=' ']
 * @return {string}
 */
String.prototype.toCamelCase = function(delimiter) {
	return this.split(delimiter ? delimiter : ' ').map(function(part) { return part.capitalize(); }).join('');
};
/**
 * Makes CamelCase to_underscore
 *
 * @return {string}
 */
String.prototype.toUnderscore = function() {
	return (this.charAt(0).toLowerCase() + this.slice(1)).replace(/([A-Z])/g, function($1) {return "_" + $1.toLowerCase();});
};
/**
 * Returns formatted string for fields AJAX data
 * @param {AJAXData} data
 * @return {string}
 */
String.prototype.appendAjaxData = function(data) {
	if (data.fields && data.fields instanceof Array) {
		data.fields = data.fields.join(',');
	}
	return this + JSON.stringify(data);
};
/**
 * Returns array of objects` own properties
 *
 * @param {object} obj
 * @return {Array}
 */
Object.props = function(obj) {
	return Object.keys(obj).filter(function(prop) {
		return typeof obj[prop] !== 'function';
	});
};
/**
 * Returns objects` own properties
 *
 * @param {object} obj
 * @return {object}
 */
Object.getProps = function(obj) {
	var props = {};
	$.each(obj, function(key, value) {
		if (typeof value !== 'function') {
			props[key] = value;
		}
	});
	return props;
};
/**
 * Returns array of objects` own methods
 *
 * @param {object} obj
 * @return {Array}
 */
Object.methods = function(obj) {
	var methods = [];
	Object.keys(obj).forEach(function(prop) {
		if (typeof obj[prop] === 'function') {
			methods.push(prop);
		}
	});
	return methods;
};

if (typeof Object.values !== 'function') {
	/**
	 * Returns array of objects` own properties` values
	 *
	 * @param {object} obj
	 * @return {Array}
	 */
	Object.values = function(obj) {
		var vals = [];
		for (var key in obj) {
			if (obj.hasOwnProperty(key) && obj.propertyIsEnumerable(key)) {
				vals.push(obj[key]);
			}
		}
		return vals;
	};
}
/**
 * Converts object into string of html data set
 *
 * @return {string}
 */
Object.toHtmlDataSet = function() {
	var dataset = [], obj = this;
	Object.props(obj).forEach(function(prop) {
		dataset.push(((prop.indexOf('data-') != 0) ? 'data-' + prop : prop) + '="' + obj[prop] + '"');
	});
	return dataset.join(' ');
};
/**
 * Converts object into string of html attributes
 *
 * @return {string}
 */
Object.toHtmlAttributes = function() {
	var attributes = [], obj = this;
	Object.props(obj).forEach(function(prop) {
		attributes.push(prop + '="' + obj[prop] + '"');
	});
	return attributes.join(' ');
};
/**
 * Returns copy of original array and appends additional_values
 *
 * @param {Array} original
 * @param {...(number|string|boolean|object|Array)} [additional_values]
 * @return {Array}
 */
Array.newFrom = function(original, additional_values) {
	var new_array = original.slice(0), arg, i;
	if (arguments.length > 1) {
		for (i = 1; i < arguments.length; i++) {
			arg = arguments[i];
			switch (typeof arg) {
				case 'number':
				case 'string':
				case 'boolean': {
					$.merge(new_array, [arg]);
					break;
				}
				case 'object': {
					if (arg instanceof Array) {
						$.merge(new_array, arg);
					} else {
						$.merge(new_array, Object.keys(arg).map(function(key) {return arg[key]}));
					}
					break;
				}
				default: {
					console.error('')
				}
			}
		}
	}
	return new_array;
};
/**
 * Returns string of elements, separated by space
 *
 * @return {string}
 */
Array.toSpaceSeparatedString = function() {
	return this.join(' ');
};
/**
 * Cleans array from specific values. If no delete_value is passed, deletes undefined values,
 *
 * @param {*} [delete_value]
 * @return {Array}
 */
Array.prototype.clean = function(delete_value) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == delete_value) {
			this.splice(i, 1);
			i--;
		}
	}
	return this;
};
/**
 * Merges arrays without duplicates
 *
 * @param {...Array} array
 * @return {Array}
 */
Array.prototype.merge = function(array) {
	var args = Array.prototype.slice.call(arguments),
		hash = {},
		arr = [],
		i = 0,
		j = 0;
	args.unshift(this);
	for (i = 0; i < args.length; i++) {
		for (j = 0; j < args[i].length; j++) {
			if (hash[args[i][j]] !== true) {
				arr[arr.length] = args[i][j];
				hash[args[i][j]] = true;
			}
		}
	}
	return arr;
};
/**
 * Checks if array contains some element
 *
 * @param {*} it
 * @return {boolean}
 */
Array.prototype.contains = function(it) {return this.indexOf(it) !== -1;};

if (![].includes) {
	Array.prototype.includes = function(searchElement/*, fromIndex*/) {
		'use strict';
		var O = Object(this);
		var len = parseInt(O.length) || 0;
		if (len === 0) {
			return false;
		}
		var n = parseInt(arguments[1]) || 0;
		var k;
		if (n >= 0) {
			k = n;
		} else {
			k = len + n;
			if (k < 0) {
				k = 0;
			}
		}
		while (k < len) {
			var currentElement = O[k];
			if (searchElement === currentElement ||
				(searchElement !== searchElement && currentElement !== currentElement)
			) {
				return true;
			}
			k++;
		}
		return false;
	};
}
/**
 * Returns rounded num to specific count of decimals
 *
 * @param {(number|string)} num
 * @param {number} decimals
 * @return {number}
 */
Math.roundTo = function(num, decimals) {
	var d = Math.pow(10, decimals ? decimals : 0);
	return Math.round(num * d) / d;
};


(function($) {
	function handleStep(tween) {
		var target = $(tween.elem),
			defaults = {
				separator: ' ',
				group_length: 3,
				suffix: '',
				prefix: ''
			},
			options, floored_number, separated_number;
		if (tween.elem.nodeType && tween.elem.parentNode) {
			options = $.extend(true, {}, defaults, target.data());
			floored_number = Math.floor(tween.now);
			separated_number = floored_number.toString();
			
			function extractNumberParts(separated_number, group_length) {
				var numbers = separated_number.split('').reverse(),
					number_parts = [],
					current_number_part,
					current_index,
					q;
				
				for (var i = 0, l = Math.ceil(separated_number.length / group_length); i < l; i++) {
					current_number_part = '';
					for (q = 0; q < group_length; q++) {
						current_index = i * group_length + q;
						if (current_index === separated_number.length) {
							break;
						}
						
						current_number_part = current_number_part + numbers[current_index];
					}
					number_parts.push(current_number_part);
				}
				
				return number_parts;
			}
			
			function removePrecendingZeros(number_parts) {
				var last_index = number_parts.length - 1,
					last = number_parts[last_index].split('').reverse().join('');
				
				number_parts[last_index] = parseInt(last, 10).toString().split('').reverse().join('');
				return number_parts;
			}
			
			if (separated_number.length > options.group_length) {
				var number_parts = extractNumberParts(separated_number, options.group_length);
				separated_number = removePrecendingZeros(number_parts).join(options.separator);
				separated_number = separated_number.split('').reverse().join('');
			}
			target.prop('number', tween.now).text(options.prefix + separated_number + options.suffix);
		}
	}
	
	if (!$.Tween || !$.Tween.propHooks) {
		$.fx.step.number = handleStep;
	} else {
		$.Tween.propHooks.number = {
			set: handleStep
		};
	}
}(window.jQuery));

$.fn.extend({
	/**
	 *
	 * @memberOf jQuery#
	 * @param {string} statuses
	 * @return {jQuery}
	 */
	toggleStatus: function(statuses) {
		var $this = this;
		
		if ($this.is('.form_unit')) {
			statuses.split(' ').forEach(function(status) {
				var $form_elements = $this.find('input, select, textarea, button');
				if (status === 'disabled') {
					if ($this.hasClass('-status_disabled')) {
						$form_elements.removeAttr('disabled');
					} else {
						$form_elements.attr('disabled', true);
					}
				}
				$this.toggleClass('-status_' + status);
			});
		} else if ($this.is('input, textarea, select, button')) {
			$this.closest('.form_unit').toggleStatus(statuses);
		} else if ($this.length) {
			$this.find('.form_unit').toggleStatus(statuses);
		}
		
		return this;
	},
	
	/**
	 * Сбор данных с формы
	 * Метод возвращает javaScript объект, состоящий из атрибутов name и value элементов формы.
	 * Если output_type стоит на array, то возвращается массив из объектов с полями name и value (аналогично с serializeArray).
	 *
	 * @memberOf jQuery#
	 * @param {string} [output_type=object]
	 * @returns {(Array|Object)}
	 */
	serializeForm: function(output_type) {
		var zb = /^(?:input|select|textarea|keygen)/i,
			yb = /^(?:submit|button|image|reset|file)$/i,
			T = /^(?:checkbox|radio)$/i,
			xb = /\r?\n/g,
			elements = this.map(function() {
				var a = $.prop(this, "elements");
				return a ? $.makeArray(a) : this
			});
		
		switch (output_type) {
			case 'array': {
				/* Работает так же как и serializeArray, с некоторыми модификациями */
				return elements.filter(function() {
					var a = this.type;
					return this.name
						&& !$(this).is(":disabled")
						&& zb.test(this.nodeName)
						&& !yb.test(a)
						&& ((this.checked && this.value != "on") || a != "radio")
						&& ((this.checked && this.value != "on") || this.value == "on" || a != "checkbox")
				}).map(function(a, b) {
					var c = $(this).val(),
						std = "";
					switch (this.type) {
						case "radio":
						case "checkbox": {
							std = c == "on" ? ( this.checked ? 1 : 0 ) : c;
							break;
						}
						default: {
							std = c.replace(xb, "\r\n");
						}
					}
					return null == c ? null : {
						name: b.name,
						value: std
					}
				}).get();
			}
			case 'object':
			default: {
				var output = {};
				elements.filter(function() {
					var a = this.type;
					return this.name && !$(this).is(':disabled') && zb.test(this.nodeName) && !yb.test(a) && !T.test(a)
				}).each(function(i, el) {
					var $element = $(el),
						name = el.name,
						value = $element.val();
					
					if (elements.filter("[name='" + name + "']").length > 1 && value != "") {
						output[name] = typeof(output[name]) == "undefined" ? [] : output[name];
						output[name].push(value ? value.replace(xb, "\r\n") : value)
					}
					else if ($element.attr('type') === 'hidden' && value.indexOf('data.') === 0) {
						var data_names = value.split('.'),
							data = $element.data(data_names[1]),
							n = 2;
						while (data_names[n]) {
							data = data[data_names[n]];
							n++;
						}
						output[name] = data;
					}
					else {
						output[name] = value || value === 0 ? value.replace(xb, "\r\n") : null;
					}
				});
				elements.filter(function() {
					var a = this.type;
					return this.name && !$(this).is(":disabled") && T.test(a) && ((this.checked && this.value != "on") || (this.value == "on" && a == "checkbox"))
				}).each(function(i, el) {
					var name = el.name,
						value = el.value;
					
					switch (el.type) {
						case 'radio': {
							output[name] = value;
							break;
						}
						case 'checkbox': {
							if (elements.filter("[name='" + name + "']").length > 1 && value != "on") {
								output[name] = typeof(output[name]) == "undefined" ? [] : output[name];
								output[name].push(value)
							}
							else if (value != "on")
								output[name] = value;
							else
								output[name] = !!el.checked;
							break;
						}
					}
				});
				return output;
			}
		}
	},
	
	animateNumber: function(options) {
		var args = [options];
		
		for (var i = 1, l = arguments.length; i < l; i++) {
			args.push(arguments[i]);
		}
		this.data(options);
		
		return this.animate.apply(this, args);
	},
	/**
	 * jQuery adapter for Tablesort
	 *
	 * @memberOf jQuery#
	 * @param {object} [options]
	 *
	 * @return {(Tablesort|null)}
	 */
	tablesort: function(options) {
		options = setDefaultValue(options, {});
		var table = this.get(0),
			instance = null,
			observer;
		
		if(Tablesort && typeof Tablesort === 'function'){
			instance = new Tablesort(table, options);
			observer = new MutationObserver(function() {
				instance.refresh();
			});
			
			observer.observe(table, {
				attributes: true,
				childList: true
			});
			
			this.data({
				tablesort_instance: instance,
				mutation_observer_instance: observer
			});
			
		} else {
			console.error('Tablesort is not defined');
		}
		return instance;
	},
	/**
	 * Resolving instance from element
	 *
	 * @memberOf jQuery#
	 * @return {*}
	 */
	resolveInstance: function() {
		var instance = this.data('instance');
		return instance ? instance : this;
	},
	/**
	 * Getting outer HTML string from jQuery collection
	 *
	 * @memberOf jQuery#
	 * @return {string}
	 */
	outerHTML: function() {
		var str = '';
		this.each(function(i, el) {
			str += el.outerHTML;
		});
		return str;
	}
});
/**
 * Makes jQuery collection from the genuine array of HTML elements or jQuery objects
 *
 * @param {(Array<Element>|Array<jQuery>|Element)} array
 * @return {jQuery}
 */
jQuery.makeSet = function(array) {
	return $($.map(array, function(el) {return el.get();}));
};


/**
 * Notify Addon definition as jQuery plugin
 * Adapted version to work with Bootstrap classes
 * More information http://getuikit.com/docs/addons_notify.html
 */
(function($, window, document) {
	
	var containers = {},
		messages = {},
		
		notify = function(options) {
			
			if ($.type(options) == 'string') {
				options = {message: options};
			}
			
			if (arguments[1]) {
				options = $.extend(options, $.type(arguments[1]) == 'string' ? {status: arguments[1]} : arguments[1]);
			}
			
			return (new Message(options)).show();
		},
		closeAll = function(group, instantly) {
			if (group) {
				for (var id in messages) {
					if (group === messages[id].group) messages[id].close(instantly);
				}
			} else {
				for (var id in messages) {
					messages[id].close(instantly);
				}
			}
		};
	
	var Message = function(options) {
		
		var $this = this;
		
		this.options = $.extend({}, Message.defaults, options);
		
		this.uuid = "ID" + (new Date().getTime()) + "RAND" + (Math.ceil(Math.random() * 100000));
		this.element = $([
			// alert-dismissable enables bs close icon
			'<div class="uk-notify-message alert-dismissable">',
			'<a class="close">&times;</a>',
			'<div>' + this.options.message + '</div>',
			'</div>'
		
		].join('')).data("notifyMessage", this);
		
		// status
		if (this.options.status) {
			this.element.addClass('alert alert-' + this.options.status);
			this.currentstatus = this.options.status;
		}
		
		this.group = this.options.group;
		
		messages[this.uuid] = this;
		
		if (!containers[this.options.pos]) {
			containers[this.options.pos] = $('<div class="uk-notify uk-notify-' + this.options.pos + '"></div>').appendTo('body').on("click", ".uk-notify-message", function() {
				$(this).data("notifyMessage").close();
			});
		}
	};
	
	
	$.extend(Message.prototype, {
		
		uuid: false,
		element: false,
		timout: false,
		currentstatus: "",
		group: false,
		
		show: function() {
			
			if (this.element.is(":visible")) return;
			
			var $this = this;
			
			containers[this.options.pos].show().prepend(this.element);
			
			var marginbottom = parseInt(this.element.css("margin-bottom"), 10);
			
			this.element.css({
				"opacity": 0,
				"margin-top": -1 * this.element.outerHeight(),
				"margin-bottom": 0
			}).animate({"opacity": 1, "margin-top": 0, "margin-bottom": marginbottom}, function() {
				
				if ($this.options.timeout) {
					
					var closefn = function() {
						$this.close();
					};
					
					$this.timeout = setTimeout(closefn, $this.options.timeout);
					
					$this.element.hover(
						function() {
							clearTimeout($this.timeout);
						},
						function() {
							$this.timeout = setTimeout(closefn, $this.options.timeout);
						}
					);
				}
				
			});
			
			return this;
		},
		
		close: function(instantly) {
			
			var $this = this,
				finalize = function() {
					$this.element.remove();
					
					if (!containers[$this.options.pos].children().length) {
						containers[$this.options.pos].hide();
					}
					
					delete messages[$this.uuid];
				};
			
			if (this.timeout) clearTimeout(this.timeout);
			
			if (instantly) {
				finalize();
			} else {
				this.element.animate({
					"opacity": 0,
					"margin-top": -1 * this.element.outerHeight(),
					"margin-bottom": 0
				}, function() {
					finalize();
				});
			}
		},
		
		content: function(html) {
			
			var container = this.element.find(">div");
			
			if (!html) {
				return container.html();
			}
			
			container.html(html);
			
			return this;
		},
		
		status: function(status) {
			
			if (!status) {
				return this.currentstatus;
			}
			
			this.element.removeClass('alert alert-' + this.currentstatus).addClass('alert alert-' + status);
			
			this.currentstatus = status;
			
			return this;
		}
	});
	
	Message.defaults = {
		message: "",
		status: "normal",
		timeout: 5000,
		group: null,
		pos: 'top-center'
	};
	
	
	$["notify"] = notify;
	$["notify"].message = Message;
	$["notify"].closeAll = closeAll;
	
	return notify;
	
}(jQuery, window, document));

/**===========================================================
 * A complete cookies reader/writer framework with full unicode support.
 *
 * Revision #1 - September 4, 2014
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/document.cookie
 * https://developer.mozilla.org/User:fusionchess
 * https://github.com/madmurphy/cookies.js
 *
 * This framework is released under the GNU Public License, version 3 or later.
 * http://www.gnu.org/licenses/gpl-3.0-standalone.html
 */
(function(window){
	/**
	 *
	 * @lends cookies
	 */
	window.cookies = {
		/**
		 * @param {string} name
		 * @return {(string|null)}
		 */
		getItem: function (name) {
			if (!name) { return null; }
			return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(name).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
		},
		/**
		 *
		 * @param {string} name
		 * @param {*} value
		 * @param {(string|number|Date)} [end] - max-age in seconds, Infinity, or the expires date in GMTString format or as Date object
		 * @param {string} [path]
		 * @param {string} [domain]
		 * @param {boolean} [is_secure]
		 * @return {boolean}
		 */
		setItem: function (name, value, end, path, domain, is_secure) {
			var expires = "";
			if (!name || /^(?:expires|max\-age|path|domain|secure)$/i.test(name)) { return false; }
			if (end) {
				switch (end.constructor) {
					case Number:
						expires = end === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + end;
						break;
					case String:
						expires = "; expires=" + end;
						break;
					case Date:
						expires = "; expires=" + end.toUTCString();
						break;
				}
			}
			document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + (domain ? "; domain=" + domain : "") + (path ? "; path=" + path : "") + (is_secure ? "; secure" : "");
			return true;
		},
		/**
		 *
		 * @param {string} name
		 * @param {string} [path]
		 * @param {string} [domain]
		 * @return {boolean}
		 */
		removeItem: function (name, path, domain) {
			if (!this.hasItem(name)) { return false; }
			document.cookie = encodeURIComponent(name) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (domain ? "; domain=" + domain : "") + (path ? "; path=" + path : "");
			return true;
		},
		/**
		 *
		 * @param {string} name
		 * @return {boolean}
		 */
		hasItem: function (name) {
			if (!name) { return false; }
			return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(name).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
		},
		/**
		 *
		 * @return {Array}
		 */
		keys: function () {
			var keys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/),
				length = keys.length;
			for (var i = 0; i < length; i++) {
				keys[i] = decodeURIComponent(keys[i]);
			}
			return keys;
		}
	};
}(window));

/**===========================================================
 * Templates for jQuery
 *
 * @param {string} template_type
 * @param {(object|Array)} [items={}]
 * @param {(jQuery|Element)} [addTo]
 * @param {string} [direction="append"] - can be "append" or "prepend"
 * @returns {jQuery}
 */
function tmpl(template_type, items, addTo, direction) {
	items = items ? items : {};
	addTo = addTo instanceof Element ? $(addTo) : addTo;
	var $tmpl = $('#tmpl-' + template_type),
		wrapMap = {
			thead: [ 1, "<table>", "</table>" ],
			col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
			tr: [ 2, "<table><tbody>", "</tbody></table>" ],
			td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
			_default: [ 1, "<div>", "</div>" ]
		},
		result = $(),
		html_val;
	
	wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
	wrapMap.th = wrapMap.td;
	
	if(!$tmpl.length) {
		console.group('tmpl_error');
		console.log('error in ' + template_type);
		console.log('items', items);
		console.log('addTo', addTo);
		console.log('inputs', {template_type: template_type, items: items, addTo: addTo, direction: direction});
		console.groupEnd();
		return $();
	}
	
	function htmlEntities(str) {
		return String(str + '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
	}
	
	function replaceTags(html, object) {
		var jQuery_pairs = {},
			keys = {},
			wrap = wrapMap[ ( /<([\w:]+)/.exec( html ) || [ "", "" ] )[ 1 ].toLowerCase() ] || wrapMap._default,
			j = wrap[ 0 ];
		
		$.each(object, function(key, value) {
			if ($.type(value) == 'string') {
				keys[key] = htmlEntities(value);
			} else if (value instanceof jQuery) {
				if (value.length) {
					jQuery_pairs[key] = value;
					if (value.is('tr')) {
						keys[key] = '<tbody id="JQ_tmpl_' + key + '"></tbody>';
					} else if (value.is('span')) {
						keys[key] = '<span id="JQ_tmpl_' + key + '"></span>';
					} else if (value.is('option')) {
						keys[key] = '<optgroup id="JQ_tmpl_' + key + '"></optgroup>';
					} else {
						keys[key] = '<div id="JQ_tmpl_' + key + '"></div>';
					}
				}
			} else if (value == null) {
				keys[key] = '';
			} else {
				keys[key] = value;
			}
		});
		
		html = $(html ? wrap[ 1 ] + html.format(keys) + wrap[ 2 ] : '');
		$.each(jQuery_pairs, function(key, value) {
			html.find('#JQ_tmpl_' + key).append(value);
			if(value.is('tr')){
				value.parent('tbody').removeAttr('id');
			} else {
				value.unwrap();
			}
		});
		while ( j-- ) {
			html = html.children();
		}
		return html;
	}
	
	html_val = $tmpl.html()
		.replace(/(?:\/\*(?:[\s\S]*?)\*\/)|(?:([\s;])+\/\/(?:.*)$)/gim, '')// comments
		.replace(/\\s{2,}|\t|\n|\r/gim, '')// spaces, tabs, new lines
		.trim();
	
	if (Array.isArray(items)) {
		result = $.makeSet(items.map(function(item) {
			return replaceTags(html_val, item);
		}));
	} else {
		result = replaceTags(html_val, items);
	}
	if (addTo == null) {
		return result;
	}
	if (direction === 'prepend') {
		addTo.prepend(result);
	} else {
		addTo.append(result);
	}
	return result;
}
/**
 *
 * Parses URI and returns object like PHP parse_url function do
 * @link http://php.net/manual/ru/function.parse-url.php
 *
 * @param {string} str
 * @param {object} [options]
 * @return {{
 *    anchor: string
 *    authority: string
 *    directory: string
 *    file: string
 *    host: string
 *    password: string
 *    path: string
 *    port: string
 *    protocol: string
 *    query: string
 *    queryKey: Object
 *    relative: string
 *    source: string
 *    user: string
 *    userInfo: string
 *    wo_query: string
 * }}
 */
function parseUri(str, options) {
	var o = {
			strictMode: false,
			key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
			q:   {
				name:   "queryKey",
				parser: /(?:^|&)([^&=]*)=?([^&]*)/g
			},
			parser: {
				strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
				loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
			}
		},
		m = o.parser[o.strictMode ? 'strict' : 'loose'].exec(str),
		uri = {},
		i = 14;
	
	if (options) {
		$.extend(o, options);
	}
	
	while (i--) uri[o.key[i]] = m[i] || '';
	
	uri[o.q.name] = {};
	uri[o.key[12]].replace(o.q.parser, function($0, $1, $2) {
		if ($1) uri[o.q.name][$1] = $2;
	});
	
	Object.defineProperties(uri, {
		wo_query: {
			get: function() {
				return uri[o.key[1]] + '://' + uri[o.key[6]] + uri[o.key[9]];
			}
		}
	});
	
	return uri;
}

function storeStat(entity_id, entity_type, event_type) {
	window.__stats = window.__stats ? window.__stats : [];
	window.__stats.push({
		entity_id: entity_id,
		entity_type: entity_type,
		event_type: event_type
	});
}

/**
 * Возвращает единицу измерения с правильным окончанием
 *
 * @param {Number} num      Число
 * @param {{NOM: {string}, GEN: {string}, PLU: {string}}} cases    Варианты слова {nom: 'час', gen: 'часа', plu: 'часов'}
 * @return {String}
 */
function getUnitsText(num, cases) {
	num = Math.abs(num);
	
	var word = '';
	
	if (num.toString().indexOf('.') > -1) {
		word = cases.GEN;
	} else {
		word = (
			num % 10 == 1 && num % 100 != 11
				? cases.NOM
				: num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20)
				? cases.GEN
				: cases.PLU
		);
	}
	
	return word;
}
/**
 * Возвращает текст с правильным родом
 *
 * @param {OneUser.GENDER} gender
 * @param {({
 *  MAS: {string},
 *  FEM: {string},
 *  NEU: {string}
 * }|string)} cases
 */
function getGenderText(gender, cases) {
	if(typeof cases === 'string'){
		return cases;
	}
	switch (gender) {
		default:
		case OneUser.GENDER.MALE: return cases.MAS;
		case OneUser.GENDER.FEMALE: return cases.FEM;
		case OneUser.GENDER.NEUTRAL: return cases.NEU;
	}
}


/**
 * Returns formatted array of format variable
 *
 * @param {(Array<OneDate>|DatesCollection)} dates
 * @param {(string|Array|jQuery|object)} format
 * @param {boolean} [is_same_time=false]
 * @returns {(Array<string>|Array<Array>|Array<jQuery>|Array<object>)}
 */
function formatDates(dates, format, is_same_time) {
	var cur_moment,
		prev_moment,
		cur_year,
		cur_month,
		cur_time,
		prev_time,
		is_with_time = false,
		cur_range_of_days = [],
		last_index = dates.length - 1,
		dates_obj = {},
		output = [];
	
	
	function formatString(formatting, days, time, month, year) {
		var genitive_month_names = [
				'января',
				'февраля',
				'марта',
				'апреля',
				'мая',
				'июня',
				'июля',
				'августа',
				'сентября',
				'октября',
				'ноября',
				'декабря'
			],
			format_options = {
				d: days,
				D: days,
				t: time,
				T: time,
				M: month + 1,
				MM: month + 1 > 9 ? month + 1 : "0" + (month + 1),
				MMM: __LOCALES.ru_RU.DATE.MONTH_SHORT_NAMES[month].toLocaleLowerCase(),
				MMMM: __LOCALES.ru_RU.DATE.MONTH_NAMES[month].toLocaleLowerCase(),
				MMMMs: genitive_month_names[month],
				Y: year,
				YY: year.substr(2, 2),
				YYYY: year
			},
			output;
		
		if (typeof formatting == 'string') {
			output = formatting.format(format_options).capitalize();
		} else if (Array.isArray(formatting)) {
			output = formatting.map(function(str) {
				return str.format(format_options).capitalize();
			});
		} else if (formatting instanceof jQuery) {
			output = $();
			formatting.each(function(key, elem) {
				var $elem = $(elem).clone();
				$elem.text(elem.innerText.format(format_options).capitalize());
				output = output.add($elem);
			});
		} else {
			output = {};
			$.each(formatting, function(key, str) {
				output[key] = str.format(format_options).capitalize();
			});
		}
		
		return output;
	}
	
	if (!format) {
		format = {
			date: '{D} {MMMMs} {YYYY}',
			time: '{T}'
		}
	}
	
	if (typeof format == 'string') {
		is_with_time = format.contains((/\{T\}|\{t\}/)) && dates[0]['start_time'] !== undefined;
	} else {
		is_with_time = dates[0]['start_time'] !== undefined;
		$.each(format, function() {
			is_with_time = is_with_time || this.contains((/\{T\}|\{t\}/));
		})
	}
	
	if (is_same_time) {
		if (is_with_time) {
			cur_time = dates[0].end_time ? displayTimeRange(dates[0].start_time, dates[0].end_time) : displayTimeRange(dates[0].start_time);
		}
		
		dates.forEach(function(date, i) {
			cur_moment = moment.unix(date.event_date);
			cur_year = cur_moment.year();
			cur_month = cur_moment.month();
			if (!dates_obj[cur_year])  dates_obj[cur_year] = {};
			if (!dates_obj[cur_year][cur_month])  dates_obj[cur_year][cur_month] = [];
			
			if (prev_moment) {
				if (cur_month !== prev_moment.month() || prev_moment.diff(cur_moment, 'days') !== -1) {
					dates_obj[prev_moment.year()][prev_moment.month()].push(cur_range_of_days.join('-'));
					cur_range_of_days[0] = cur_moment.format('D');
				} else {
					cur_range_of_days[1] = cur_moment.format('D');
				}
			} else {
				cur_range_of_days[0] = cur_moment.format('D');
			}
			
			if (i === last_index) {
				dates_obj[cur_year][cur_month].push(cur_range_of_days.join('-'));
			} else {
				prev_moment = cur_moment;
			}
		});
		
		
		$.each(dates_obj, function(year, months) {
			$.each(months, function(month, days) {
				output.push(formatString(format, days.join(', '), is_with_time ? cur_time : '', month, year));
			})
		});
		
	} else {
		dates.forEach(function(date, i) {
			cur_moment = moment.unix(date.event_date);
			cur_year = cur_moment.year();
			cur_month = cur_moment.month();
			cur_time = date.end_time ? displayTimeRange(date.start_time, date.end_time) : displayTimeRange(date.start_time);
			if (!dates_obj[cur_year])  dates_obj[cur_year] = {};
			if (!dates_obj[cur_year][cur_month])  dates_obj[cur_year][cur_month] = [];
			
			if (prev_moment) {
				if (cur_month !== prev_moment.month() || prev_moment.diff(cur_moment, 'days') !== -1 || prev_time !== cur_time) {
					dates_obj[prev_moment.year()][prev_moment.month()].push({
						date: cur_range_of_days.join('-'),
						time: prev_time
					});
					cur_range_of_days = [cur_moment.format('D')];
				} else {
					cur_range_of_days[1] = cur_moment.format('D');
				}
			} else {
				cur_range_of_days = [cur_moment.format('D')];
			}
			
			if (i === last_index) {
				dates_obj[cur_year][cur_month].push({
					date: cur_range_of_days.join('-'),
					time: cur_time
				});
			} else {
				prev_moment = cur_moment;
				prev_time = cur_time;
			}
		});
		
		$.each(dates_obj, function(year, months) {
			$.each(months, function(month, days) {
				var formatted_days = [],
					range = [],
					prev_time;
				$.each(days, function(i, day) {
					if (prev_time) {
						if (day.time != prev_time) {
							formatted_days.push({date: range.join(', '), time: prev_time});
							range = [day.date];
						} else {
							range.push(day.date);
						}
					} else {
						range = [day.date];
					}
					
					if (i === days.length - 1) {
						formatted_days.push({date: range.join(', '), time: day.time});
					} else {
						prev_time = day.time;
					}
				});
				
				$.each(formatted_days, function(i, formatted_day) {
					output.push(formatString(format, formatted_day.date, is_with_time ? formatted_day.time : '', month, year));
				});
			})
		});
	}
	
	return output;
}
/**
 * Cutting out seconds in time string
 *
 * @param {string} time
 * @return {string}
 */
function trimSeconds(time) {
	time = time.split(':');
	if (time.length == 3)
		time = time.splice(0, 2);
	
	return time.join(':');
}
/**
 * Returns formatted range of dates
 *
 * @param {timestamp} first_date
 * @param {timestamp} last_date
 * @returns {string}
 */
function displayDateRange(first_date, last_date) {
	var m_first = moment.unix(first_date),
		m_last = moment.unix(last_date),
		m_today = moment();
	
	if (m_first.isSame(m_last, 'year')) {
		if (m_first.isSame(m_last, 'month')) {
			if (m_first.isSame(m_last, 'day')) {
				return m_first.format(m_first.isSame(m_today, 'year') ? 'D MMM' : 'D MMM YYYY');
			} else {
				return m_first.format('D') + '-' + m_last.format(m_first.isSame(m_today, 'year') ? 'D MMM' : 'D MMM YYYY');
			}
		} else {
			return m_first.format('D MMM') + ' - ' + m_last.format(m_first.isSame(m_today, 'year') ? 'D MMM' : 'D MMM YYYY');
		}
	} else {
		return m_first.format('MMM YYYY') + ' - ' + m_last.format('MMM YYYY');
	}
}
/**
 * Returns formatted times range
 *
 * @param {string} start_time
 * @param {string} [end_time]
 * @returns {string}
 */
function displayTimeRange(start_time, end_time) {
	
	if (end_time) {
		if (end_time == start_time && (start_time == '00:00:00' || start_time == '00:00')) {
			return 'Весь день';
		} else {
			return trimSeconds(start_time) + ' - ' + trimSeconds(end_time);
		}
	} else {
		return trimSeconds(start_time);
	}
}
/**
 *
 * Returns formatted currency
 *
 * @param {(string|number)} number
 * @param {string} [separator=' ']
 * @param {string} [decimal_separator='.']
 * @param {string} [before]
 * @param {string} [after]
 * @return {string}
 */
function formatCurrency(number, separator, decimal_separator, before, after) {
	number = +number || 0;
	separator = separator || ' ';
	decimal_separator = decimal_separator || '.';
	var numbers_decimals = (''+number).split('.')[1],
		negative = number < 0 ? '-' : '',
		integer_part = parseInt(Math.abs(number), 10) + '',
		cast_pos = integer_part.length > 3 ? integer_part.length % 3 : 0;
	return ''
		+ (before ? (before + separator) : '')
		+ negative
		+ (cast_pos ? integer_part.substr(0, cast_pos) + separator : '')
		+ integer_part.substr(cast_pos).replace(/(\d{3})(?=\d)/g, '$1' + separator)
		+ (numbers_decimals ? decimal_separator + numbers_decimals : '')
		+ (after ? (separator + after) : '');
}
/**
 * Making ticket number more readable ( 999999999 => 999 999 999 )
 *
 * @param {(string|number)} number
 * @return {string}
 */
function formatTicketNumber(number) {
	return ('' + number).replace(/(\d{3})/g, '$1 ').trim();
}
/**
 * Generates guid-like string (actually, it`s not guid, just randomly compiled string)
 *
 * @return {string}
 */
function guid() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	}
	
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
/**
 * Validating form or fieldset
 *
 * @param {(Element|jQuery)} $form
 * @return {boolean}
 */
function isFormValid($form) {
	$form = $form instanceof Element ? $($form) : $form;
	var is_valid = true,
		$elements = $form.find('input, textarea');
	
	if (!$form[0].checkValidity()) {
		$elements.each(function(i, el) {
			if ( (el.required && (el.value.trim() === '' || !el.checkValidity())) || (el.value.trim() !== '' && !el.checkValidity()) ) {
				handleErrorField(el);
				is_valid = false;
			}
		});
	}
	
	return is_valid;
}
/**
 *
 * Gets filename from url, or empty string, if there is no filename in URL
 *
 * @param {string} [url]
 * @returns {string}
 */
function getFilenameFromURL(url) {
	return url ? url.split('\\').pop().split('/').pop() : '';
}
/**
 *
 * Checks is the argument is base64 encoded string
 *
 * @param {string} string
 * @returns {boolean}
 */
function isBase64(string) {
	return string.contains(';base64,');
}
/**
 *
 * Checks is the argument is function
 *
 * @param {*} variable
 * @return {boolean}
 */
function isFunction(variable) {
	return (variable && typeof variable === 'function');
}
/**
 *
 * Returns array of the numbers
 *
 * @param {number} end
 * @param {number} [start]
 * @param {number} [step]
 * @return {Array}
 */
function range(end, start, step) {
	var array = [];
	
	for (start = (start ? start : 0), step = (step ? step : 1); start !== end; start += step) {
		array.push(start);
	}
	
	return array;
}
/**
 *
 * @param {string} url
 * @param {(AJAXData|string)} [data]
 * @param {string} [content_type='application/x-www-form-urlencoded; charset=UTF-8']
 */
function outerAjax(url, data, content_type) {
	data = data || {};
	var jqXHR;
	if (data.fields instanceof Fields){
		data.fields = data.fields.toString();
	}
	jqXHR = $.ajax({
		url: url,
		data: data,
		method: 'GET',
		contentType: content_type || 'application/x-www-form-urlencoded; charset=UTF-8'
	});
	return jqXHR.then(function(response, status_text, jqXHR) {
		return response;
	}).promise();
}


function bindLimitInputSize($parent) {
	$parent = $parent ? $parent : $('body');
	$parent.find('.LimitSize').not('.-Handled_LimitSize').each(function(i, e) {
		var $this = $(e),
			$form_unit = $this.closest('.form_unit'),
			max = $this.data('maxlength'),
			$prompt = $this.siblings('.form_prompt');
		if (!$prompt.length) {
			$this.after($('<p>').addClass('form_prompt').text($this.val().length + '/' + max));
			$prompt = $this.siblings('.form_prompt');
		} else {
			$prompt.text($this.val().length + '/' + max);
		}
		$this.on('input', function() {
			var length = $this.val().length;
			if ($this.is('textarea')) {
				var crlfs = $this.val().match(/\n/g);
				length = crlfs ? length + crlfs.length : length;
			}
			if (length > max) {
				$form_unit.addClass('-status_error');
			} else if ($form_unit.hasClass('-status_error')) {
				$form_unit.removeClass('-status_error');
			}
			$prompt.text(length + '/' + max);
		})
	}).addClass('-Handled_LimitSize');
}

function initSelect2($element, options) {
	var opt = {
		containerCssClass: 'form_select2',
		dropdownCssClass: 'form_select2_drop'
	};
	if ($element.hasClass('-Handled_ToSelect2')) {
		$element.select2('destroy');
	}
	if (options) {
		$.extend(true, opt, options);
	}
	$element.select2(opt).addClass('-Handled_ToSelect2')
}

function initTimeInput(time_field) {
	var $time_field = $(time_field),
		$hours = $time_field.find('input').eq(0),
		$minutes = $time_field.find('input').eq(1);
	
	function onBlur() {
		var $this = $(this);
		if ($this.val() == "0" || $this.val() === "") {
			$this.val("00");
		}
		else if ($this.val() <= 9) {
			$this.val("0" + parseInt($this.val()));
		}
	}
	
	$hours.inputmask('Regex', {regex: "([01]?[0-9]|2[0-3])"}).on('keyup', function() {
		if ($hours.val() > 2 || $hours.val() == "00") {
			$minutes.focus();
			$hours.trigger('blur');
		}
	}).on('blur', onBlur);
	$minutes.inputmask('Regex', {regex: "[0-5][0-9]"}).on('blur', onBlur);
	$time_field.addClass('-Handled_TimeInput');
}

function trimAvatarsCollection($parent) {
	$parent = $parent ? $parent : $('body');
	$parent.find('.AvatarsCollection').each(function() {
		var $collection = $(this),
			is_shifted = $collection.hasClass('-shifted'),
			is_subscribed = $collection.hasClass('-subscribed'),
			$avatars = $collection.find('.avatar'),
			avatar_width = $avatars.outerWidth(),
			amount = $avatars.length,
			kink = 6;
		
		if ((is_subscribed || is_shifted) && amount < $collection.data('max_amount')) {
			$collection.width(amount === 1 ? (avatar_width * amount) : (avatar_width * amount) - (kink * (amount - 1)));
		} else {
			$collection.width(amount === 1 ? 0 : (avatar_width * (amount - 1)) - (kink * (amount - 2)));
		}
		$collection.addClass('-trimmed');
	});
}

function bindDatePickers($parent) {
	$parent = $parent ? $parent : $('body');
	$parent.find('.DatePicker').not('.-Handled_DatePicker').each(function(i, elem) {
		(new DatePicker(elem, $(elem).data())).init();
	}).addClass('-Handled_DatePicker');
}

function bindTimeInput($parent) {
	$parent = $parent ? $parent : $('body');
	$parent.find('.TimeInput').not('.-Handled_TimeInput').each(function(i, elem) {
		initTimeInput(elem);
	}).addClass('-Handled_TimeInput');
}

function bindTabs($parent) {
	$parent = $parent ? $parent : $('body');
	$parent.find('.Tabs').not('.-Handled_Tabs').each(function(i, elem) {
		var $this = $(elem),
			tabs_id = $this.data('tabs_id'),
			focus_on_change = !!$this.data('focus_on_change'),
			mutation_observer = new MutationObserver(function(records) {
				var $wrappers,
					$target;
				records.forEach(function(record){
					$target = $(record.target);
					$wrappers = $target.parents('.TabsBody');
					$wrappers = $target.hasClass('TabsBody') ? $wrappers.add($target) : $wrappers;
					$wrappers.each(function(i, wrapper) {
						var $wrapper = $(wrapper);
						if($wrapper.hasClass(__C.CLASSES.ACTIVE)) {
							$this.addClass('-in_progress');
							$wrapper.parent().height($wrapper.outerHeight());
						}
					});
				});
			}),
			$bodies_wrapper,
			$bodies,
			$header_wrapper,
			$tabs;
		
		if(tabs_id){
			$bodies_wrapper = $this.find('.TabsBodyWrapper[data-tabs_id="'+tabs_id+'"]');
			$bodies = $bodies_wrapper.children('.TabsBody');
			$header_wrapper = $this.find('.HeaderTabs[data-tabs_id="'+tabs_id+'"]');
			$tabs = $header_wrapper.children('.Tab');
		} else {
			$bodies_wrapper = $this.find('.TabsBodyWrapper:first');
			$bodies = $bodies_wrapper.children('.TabsBody');
			$header_wrapper = $this.find('.HeaderTabs:first');
			$tabs = $header_wrapper.children('.Tab');
		}
		
		Object.defineProperties($this, {
			'currentTabsIndex': {
				get: function() {
					return $tabs.index($tabs.filter('.'+__C.CLASSES.ACTIVE));
				}
			},
			'tabsCount': {
				get: function() {
					return $tabs.length;
				}
			}
		});
		
		$this.setToTab = function(index) {
			var $setting_tab = $tabs.eq(index),
				$setting_body = $bodies.eq(index);
			if ($setting_tab.length && !$setting_tab.hasClass(__C.CLASSES.ACTIVE)) {
				$tabs.removeClass(__C.CLASSES.ACTIVE);
				$bodies.removeClass(__C.CLASSES.ACTIVE);
				$setting_tab.addClass(__C.CLASSES.ACTIVE);
				$setting_body.addClass(__C.CLASSES.ACTIVE);
				$this.trigger('change.tabs');
				if (focus_on_change) {
					scrollTo($setting_body, 400);
				}
			}
		};
		
		$this.nextTab = function() {
			$this.setToTab($this.currentTabsIndex + 1);
		};
		
		$this.prevTab = function() {
			$this.setToTab($this.currentTabsIndex - 1);
		};
		
		if (!$tabs.filter('.'+__C.CLASSES.ACTIVE).length) {
			$tabs.eq(0).addClass(__C.CLASSES.ACTIVE);
		}
		$bodies.removeClass(__C.CLASSES.ACTIVE).eq($this.currentTabsIndex).addClass(__C.CLASSES.ACTIVE);
		$bodies_wrapper.height($bodies.filter('.'+__C.CLASSES.ACTIVE).outerHeight());
		$bodies_wrapper.on('transitionend webkitTransitionEnd', function() {
			$this.removeClass('-in_progress');
			$this.trigger('progress_end')
		});
		$bodies.each(function(i, body) {
			mutation_observer.observe(body, {
				childList: true,
				subtree: true,
				attributes: true,
				attributeFilter: ['class']
			});
		});
		
		$tabs.on('click', function() {
			$this.setToTab($tabs.index(this));
		});
		
		$this.data('instance', $this);
	}).addClass('-Handled_Tabs');
}

function bindShareButtons($parent) {
	$parent = $parent ? $parent : $('body');
	$parent.find('.ShareButton').not('.-Handled_ShareButton').each(function(i, elem) {
		var $this = $(elem);
		$this.on('click', function() {
			window.open($this.data('href'), $this.data('title'), 'width=600,height=440,resizable=yes,scrollbars=no,status=no');
		});
	}).addClass('-Handled_ShareButton');
}

function bindSelect2($parent) {
	$parent = $parent ? $parent : $('body');
	$parent.find('.ToSelect2').not('.-Handled_ToSelect2').each(function(i, el) {
		initSelect2($(el));
	}).addClass('-Handled_ToSelect2');
}

function bindRippleEffect($parent) {
	$parent = $parent ? $parent : $('body');
	$parent.find('.RippleEffect').not('.-Handled_RippleEffect').on('click.RippleEffect', function(e) {
		var $this = $(this), $ripple, size, x, y;
		
		if ($this.children('.Ripple').length == 0)
			$this.prepend('<span class="ripple Ripple"></span>');
		
		$ripple = $this.children('.Ripple');
		$ripple.removeClass('animate');
		
		if (!$ripple.height() && !$ripple.width()) {
			size = Math.max($this.outerWidth(), $this.outerHeight());
			$ripple.css({height: size, width: size});
		}
		
		x = e.pageX - $this.offset().left - ($ripple.width() / 2);
		y = e.pageY - $this.offset().top - ($ripple.height() / 2);
		
		$ripple
			.css({top: y + 'px', left: x + 'px'})
			.addClass('animate');
		setTimeout(function() {
			$ripple.removeClass('animate');
		}, 650);
	}).addClass('-Handled_RippleEffect');
}

function bindDropdown($parent) {
	$parent = $parent ? $parent : $('body');
	$parent.find('.DropdownButton').not('.-Handled_DropdownButton').each(function() {
		var $button = $(this),
			data = $button.data(),
			$dropbox = $('.DropdownBox').filter('[data-dropdown_id="' + data.dropdown + '"]');
		
		$dropbox.data($.extend({}, $dropbox.data(), data));
		$dropbox.closeDropbox = function() {
			$('body').off('mousedown.CloseDropdown');
			$(document).off('keyup.CloseDropdown');
			$dropbox.removeClass('-show');
			$button.addClass('-dropdown_active');
		};
		
		if (data.hasOwnProperty('ddWidth')) {
			if (data.ddWidth == 'self') {
				$dropbox.width($button.outerWidth());
			} else if ((isFinite(data.ddWidth)) || (data.ddWidth.search(/^[1-9]\d*%$|^0%$/) === 0)) {
				$dropbox.width(data.ddWidth);
			}
		}
		if (data.hasOwnProperty('ddPosX') || data.hasOwnProperty('ddPosY')) {
			var button_pos = $button.position();
			if (data.hasOwnProperty('ddPosX')) {
				var xPos;
				if (data.ddPosX == 'self.center') {
					xPos = (button_pos.left + $button.outerWidth() / 2) - $dropbox.outerWidth() / 2;
				} else if (data.ddPosX == 'center') {
					xPos = $dropbox.parent().outerWidth() / 2 - $dropbox.outerWidth() / 2;
				} else if (isFinite(data.ddPosX)) {
					xPos = data.ddPosX;
				}
				$dropbox.css('left', xPos);
			}
			if (data.hasOwnProperty('ddPosY')) {
				var yPos;
				if (data.ddPosY == 'self.center') {
					yPos = (button_pos.top + $button.outerHeight() / 2) - $dropbox.outerHeight() / 2;
				} else if (data.ddPosY == 'center') {
					yPos = $dropbox.parent().outerHeight() / 2 - $dropbox.outerHeight() / 2;
				} else if (isFinite(data.ddPosY)) {
					yPos = (button_pos.top + $button.outerHeight()) + data.ddPosY;
				}
				$dropbox.css('top', yPos);
			}
		}
		$dropbox.find('.CloseDropdown').on('click.CloseDropdown', $dropbox.closeDropbox);
		$button.on('click.Dropdown', function() {
			$dropbox.addClass('-show');
			$button.addClass('-dropdown_active');
			$('body').on('mousedown.CloseDropdown', function(e) {
				if (!$(e.target).closest('.DropdownBox').length) {
					$dropbox.closeDropbox();
				}
			});
			$(document).on('keyup.CloseDropdown', function(e) {
				if (e.keyCode == 27) {
					$dropbox.closeDropbox();
				}
			});
		});
		
	}).addClass('-Handled_DropdownButton')
}

function bindFileLoadButton($parent) {
	$parent = $parent ? $parent : $('body');
	$parent.find('.FileLoadButton').not('.-Handled_FileLoadButton').click(function(e) {
		var $this = $(this);
		$this.children('input').get(0).click();
	}).addClass('-Handled_FileLoadButton');
}

function bindCollapsing($parent) {
	$parent = $parent ? $parent : $('body');
	$parent.find('.Collapsing').not('.-Handled_Collapsing').each(function() {
		var $instance = $(this),
			collapsing_id = $instance.data('collapsing_id'),
			mutation_observer = new MutationObserver(function(records) {
				var $contents,
					$target;
				records.forEach(function(record){
					$target = $(record.target);
					$contents = $target.parents('.CollapsingContent');
					$contents = $target.hasClass('CollapsingContent') ? $contents.add($target) : $contents;
					$contents.each(function(i, content) {
						var $content = $(content),
							$wrapper = $content.parent();
						if ($wrapper.hasClass('-opened')) {
							$wrapper.addClass('-in_progress').height($content.outerHeight());
						}
					});
				});
			}),
			default_height,
			$wrapper,
			$content,
			$trigger,
			trigger_event;
		
		if(collapsing_id){
			$wrapper = $instance.find('.CollapsingWrapper[data-collapsing_id="'+collapsing_id+'"]');
			$trigger = $instance.find('.CollapsingTrigger[data-collapsing_id="'+collapsing_id+'"]');
		} else {
			$wrapper = $instance.find('.CollapsingWrapper:first');
			$trigger = $instance.find('.CollapsingTrigger:first');
		}
		$content = $wrapper.children('.CollapsingContent');
		trigger_event = $trigger.is(':checkbox') || $trigger.is(':radio') ? 'change' : 'click';
		
		if($wrapper.hasClass('-fading')){
			default_height = $instance.data('defaultHeight') < $content.height() ? $instance.data('defaultHeight') : $content.height();
			if (!$instance.hasClass(__C.CLASSES.ACTIVE) && $wrapper.height() < default_height) {
				$wrapper.height(default_height);
			}
		} else {
			default_height = $instance.data('defaultHeight') ? $instance.data('defaultHeight') : 0;
		}
		
		function toggleCollapsing(){
			$wrapper.addClass('-in_progress');
			if ($instance.hasClass(__C.CLASSES.ACTIVE)) {
				$wrapper.height(default_height);
			} else {
				$wrapper.height($content.outerHeight());
			}
			$wrapper.toggleClass('-opened');
			$instance.toggleClass(__C.CLASSES.ACTIVE);
		}
		
		function changeProp(){
			if (trigger_event === 'change') {
				$trigger.prop('checked', !$trigger.prop('checked'));
			}
		}
		
		$instance.openCollapsing = function() {
			if(!$instance.hasClass(__C.CLASSES.ACTIVE)){
				changeProp();
				toggleCollapsing();
			}
		};
		
		$instance.closeCollapsing = function() {
			if($instance.hasClass(__C.CLASSES.ACTIVE)){
				changeProp();
				toggleCollapsing();
			}
		};
		
		$trigger.on(trigger_event+'.toggleCollapsing', function() {
			toggleCollapsing();
		});
		
		$wrapper
			.on('click', function(){
				$instance.openCollapsing();
			})
			.on('transitionend webkitTransitionEnd', function() {
				$wrapper.removeClass('-in_progress');
			});
		
		mutation_observer.observe($wrapper.get(0), {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ['class']
		});
		
		$instance.data('instance', $instance);
	}).addClass('Handled_Collapsing');
}

function bindControlSwitch($parent) {
	$parent = $parent ? $parent : $('body');
	$parent.find('.Switch').not('.-Handled_Switch').each(function(i, el) {
		var $switch = $(el),
			switch_id = $switch.data('switch_id'),
			$switching = $parent.find('.Switching[data-switch_id="'+switch_id+'"]');
		
		$switch.on('change.Switch', function() {
			if($switching.is('fieldset')) {
				$switching.prop('disabled', !$switching.prop('disabled'));
			} else {
				$switching.toggleStatus('disabled');
			}
		});
	}).addClass('-Handled_Switch');
}
/**
 *
 * @param {jQuery} $parent
 * @return {jQuery}
 */
function bindCallModal($parent) {
	$parent = $parent ? $parent : $('body');
	return $parent
		.find('.' + __C.CLASSES.HOOKS.CALL_MODAL)
		.not('.' + __C.CLASSES.HOOKS.HANDLED + __C.CLASSES.HOOKS.CALL_MODAL)
		.each(function() {
			var $this = $(this);
			
			$this.on('click.CallModal', function() {
				var $this = $(this),
					data = $this.data(),
					title = data.modal_title,
					modal = data.modal,
					modal_type = data.modal_type;
				
				if (!modal) {
					switch (modal_type) {
						case __C.MODAL_TYPES.FAVORS: {
							modal = new FavoredModal(data.modal_event_id, title);
							break;
						}
						case __C.MODAL_TYPES.SUBSCRIBERS: {
							modal = new SubscribersModal(data.modal_organization_id, title);
							break;
						}
						case __C.MODAL_TYPES.EDITORS: {
							modal = new EditorsModal(data.modal_organization_id, title, data.modal_specific_role);
							break;
						}
						case __C.MODAL_TYPES.MAP: {
							modal = new MapModal(data.modal_map_location, title);
							break;
						}
						case __C.MODAL_TYPES.MEDIA: {
							var type = data.modal_media_type,
								url = data.modal_media_url,
								parsed_url;
							if (!url) {
								if ($this.is('img')) {
									url = $this.attr('src');
									type = 'image';
								} else if ($this.is('video')) {
									//url = $this.attr('url');
									type = 'video';
								} else {
									var str = $this.css('background-image');
									if (str !== 'none') {
										if (str.indexOf('"') != -1) {
											url = str.slice(str.indexOf('"') + 1, str.indexOf('"', str.indexOf('"') + 1));
										} else {
											url = str.slice(str.indexOf('(') + 1, str.indexOf(')'));
										}
										type = 'image';
									}
								}
							}
							modal = new MediaModal(parseUri(url).wo_query, type);
							break;
						}
						case __C.MODAL_TYPES.CROPPER: {
							modal = new CropperModal(data.source_img, data);
							break;
						}
						case __C.MODAL_TYPES.FRIENDS_LIST: {
							modal = new FriendsListModal(data.modal_entity);
							break;
						}
						case __C.MODAL_TYPES.SUBSCRIBERS_LIST: {
							modal = new SubscriptionsListModal(data.modal_entity);
							break;
						}
						case __C.MODAL_TYPES.TICKET: {
							modal = new TicketsModal(data.tickets || data.ticket_uuid);
							break;
						}
						case __C.MODAL_TYPES.ADD_STAFF: {
							modal = new AddStaffModal(data.modal_org_id, data.modal_role);
							break;
						}
						default: {
							modal = new StdModal(title, data.modal_content, data.modal_style);
							break;
						}
					}
					$this.data('modal', modal);
				}
				modal.show();
			});
		})
		.addClass(__C.CLASSES.HOOKS.HANDLED + __C.CLASSES.HOOKS.CALL_MODAL);
}
/**
 *
 * @param {jQuery} [$parent]
 * @return {jQuery}
 */
function bindPageLinks($parent) {
	$parent = $parent ? $parent : $('body');
	var $links = $parent.is('.Link') ? $parent : $parent.find('.Link');
	
	return $links.not('.-Handled_Link').on('click.pageRender', function(e) {
		var $this = $(this);
		if ($this.hasClass(__C.CLASSES.DISABLED))
			return false;
		if (e.which === 1) {
			e.preventDefault();
			__APP.changeState($this.attr('href'));
		}
	}).addClass('-Handled_Link');
}

/**
 * Changes form unit`s state to error
 * @param {(jQuery|Element)} $unit
 * @return {jQuery}
 */
function handleErrorField($unit) {
	var $input;
	
	if (!($unit instanceof jQuery)) {
		return handleErrorField($($unit));
	}
	if (!$unit.is('.form_unit')) {
		if ($unit.closest('.form_unit').length)
			return handleErrorField($unit.closest('.form_unit'));
		return $unit;
	}
	
	if (!$unit.closest('.form_unit').hasClass('-status_error')) {
		$input = $unit.find('input, select, textarea');
		$unit
			.addClass('-status_error')
			.off('input.ClearError change.ClearError')
			.one('input.ClearError change.ClearError', function() {
				$unit.off('input.ClearError change.ClearError').removeClass('-status_error');
				$input.off('blur.ClearError');
			});
		$input
			.off('blur.ClearError')
			.one('blur.ClearError', function() {
				if ($(this).val().trim() !== '') {
					$unit.trigger('input.ClearError');
				}
			});
	}
	return $unit;
}
/**
 * Getting base64-encoded string of the image from url
 * @param {string} url
 * @param {function({string})} callback
 */
function toDataUrl(url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.responseType = 'blob';
	xhr.onload = function() {
		var reader = new FileReader();
		reader.onloadend = function() {
			callback(reader.result);
		};
		reader.readAsDataURL(xhr.response);
	};
	xhr.open('GET', url);
	xhr.send();
}

function showNotifier(response) {
	$.notify({
		'message': response.text,
		'pos': response.pos ? response.pos : 'top-right',
		'status': response.status ? 'success' : 'danger'
	});
}
/**
 * Checks if device is mobile
 * @return {boolean}
 */
function isNotDesktop() {
	var check = false;
	(function (a) {
		if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))check = true
	})(navigator.userAgent || navigator.vendor || window.opera);
	return check;
}

/**
 *
 * @param {(jQuery|number)} $element
 * @param {number} [duration=400]
 * @param {Function} [complete]
 *
 * @return {number} New scrollTop value
 */
function scrollTo($element, duration, complete) {
	var scroll_top;
	if ($element instanceof jQuery) {
		scroll_top = $element.offset().top - 150;
	} else {
		scroll_top = $element - 150;
	}
	if (complete && !(complete instanceof Function)) {
		complete = function() {};
	}
	$('body').stop().animate({
			scrollTop: Math.ceil(scroll_top)
		}, {
			duration: duration ? duration : 400,
			easing: 'swing',
			complete: complete
		}
	);
	
	return scroll_top;
}

/**
 * Returning true if scroll passes ending threshold + left argument
 * @param {number} [left=200]
 * @return {boolean}
 */
function isScrollRemain(left) {
	left = left ? left : 200;
	return ($(window).height() + $(window).scrollTop() + +(left)) >= $(document).height();
}

/**
 * Setting default value for variable if its is undefined
 * @param {*} variable
 * @param {*} default_value
 * @return {*}
 */
function setDefaultValue(variable, default_value) {
	return variable = typeof variable === 'undefined' ? default_value : variable;
}