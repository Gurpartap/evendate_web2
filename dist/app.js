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
 * @return {string}
 */
String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
};
/**
 * Checks if string contains some substring
 * @param {(string|RegExp)} it
 * @return {boolean}
 */
String.prototype.contains = function(it) {return this.search(it) !== -1;};
/**
 * Works like printf. Variables must be inside the {braces}. Returns formatted string
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
 * @param {string} [delimiter=' ']
 * @return {string}
 */
String.prototype.toCamelCase = function(delimiter) {
	return this.split(delimiter ? delimiter : ' ').map(function(part) { return part.capitalize(); }).join('');
};
/**
 * Makes CamelCase to_underscore
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
 * @return {string}
 */
Array.toSpaceSeparatedString = function() {
	return this.join(' ');
};
/**
 * Cleans array from specific values. If no delete_value is passed, deletes undefined values,
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
	 * @memberOf jQuery#
	 * @return {*}
	 */
	resolveInstance: function() {
		var instance = this.data('instance');
		return instance ? instance : this;
	},
	/**
	 * Getting outer HTML string from jQuery collection
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
 * @param {string} [direction="append"]
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
 *
 * @param {(string|number)} number
 * @return {string}
 */
function formatTicketNumber(number) {
	return ('' + number).replace(/(\d{3})/g, '$1 ').trim();
}
/**
 * Generates guid-like string
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
 * @param {string} [url]
 * @returns {string}
 */
function getFilenameFromURL(url) {
	return url ? url.split('\\').pop().split('/').pop() : '';
}
/**
 *
 * @param {string} string
 * @returns {boolean}
 */
function isBase64(string) {
	return string.contains(';base64,');
}
/**
 *
 * @param {*} variable
 * @return {boolean}
 */
function isFunction(variable) {
	return (variable && typeof variable === 'function');
}
/**
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
			$avatars = $collection.find('.avatar'),
			amount = $avatars.length;
		if (($collection.hasClass('-subscribed') || $collection.hasClass('-shifted')) && amount < $collection.data('max_amount')) {
			$collection.width(amount == 1 ? ($avatars.outerWidth() * amount) : ($avatars.outerWidth() * amount) - (6 * (amount - 1)));
		} else {
			$collection.width(amount == 1 ? 0 : ($avatars.outerWidth() * (amount - 1)) - (6 * (amount - 2)));
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
 * @param {jQuery} $parent
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
if (window.location.hostname.indexOf('.test.evendate.ru') == -1) {
    window.socket = io.connect(window.location.protocol == 'https:' ? ':8443' : ':8080', {secure: window.location.protocol == 'https:'});
} else {
    window.socket = io({path: '/node/socket.io'});
}

socket.on('auth', function (data) {
    var organization_info;

    $.ajax({
        url: 'auth.php',
        type: 'POST',
        data: data,
        success: function (res) {

            if (yaCounter32442130) {
                switch (data.type) {
                    case 'vk': {
                        yaCounter32442130.reachGoal('VkAuthDone');
                        break;
                    }
                    case 'facebook': {
                        yaCounter32442130.reachGoal('FacebookAuthDone');
                        break;
                    }
                    case 'google': {
                        yaCounter32442130.reachGoal('GoogleAuthDone');
                        break;
                    }
                }
            }

            if (res.status) {
                var search_data = searchToObject();
                if (search_data.redirect_to) {
                    window.location.href = search_data.redirect_to;
                } else if (data.hasOwnProperty('mobile') && data.mobile == true) {
                    window.location.href = '/mobileAuthDone.php?token=' + data.token + '&email=' + data.email;
                } else {
                    try {
	                    organization_info = sessionStorage.getItem('organization_info');
                    } catch (e) {
	                    organization_info = '';
                    }
                    if (organization_info) {
                        window.parent.location = '/add/organization';
                    } else if (data.subscriptions_count == 0) {
                        window.parent.location = '/onboarding';
                    } else {
                        window.parent.location = '/';
                    }
                }
            } else {
                $('.panel-body.loader-demo').text(res.text);
                $('.panel-heading').hide();
            }
        }
    });
});

socket.on('log', function (data) {
    console.log(data);
});

socket.on('error.retry', function () {
    $('.panel-body.loader-demo').text('Во время загрузки данных произошла ошибка. Войдите с помощью другой социальной сети или попробуте чуть позже.');
    $('.panel-heading').hide();
});

socket.on('notification', function (data) {
    if (!Notify.needsPermission) {
        socket.emit('notification.received', {
            notification_id: data.notification_id
        });
        var myNotification = new Notify(data.note.payload.title, {
                body: data.note.body,
                icon: data.note.icon,
                tag: data.note.payload.event_id,
                timeout: 60,
                notifyClick: function () {
                    $("<a>").attr("href", window.location.origin + '/event.php?id=' + data.note.payload.event_id).attr("target", "_blank")[0].click();
                    socket.emit('notification.received', {
                        notification_id: data.notification_id,
                        click_time: moment().format(__C.DATE_FORMAT + ' HH:MM:SS')
                    });
                }
            }
        );

        myNotification.show();
    } else if (Notify.isSupported()) {
        Notify.requestPermission();
    }
});

socket.on('image.getFromURLDone', function (response) {
    if (response.error) {
        showNotifier({text: response.error, status: false});
    } else {
        ImgLoader.handleImgUpload(ImgLoader.current_load_context, response.data, response.filename);
    }
});

socket.on('vk.getGroupsToPostDone', function (response) {
    if (response.error) {
        showNotifier({text: response.error, status: false});
    } else {
        var data = response.data.response,
            $groups = __APP.CURRENT_PAGE.$wrapper.find('#edit_event_vk_groups');
        if (data.length || data[0]) {
            data.splice(0, 1);
            data.forEach(function (option) {
                $groups.append(tmpl('option', {
                    val: option.gid,
                    display_name: option.name,
                    data: "data-img='" + option.photo + "'"
                }));
            });
            initSelect2($groups);
        } else {
            __APP.CURRENT_PAGE.$wrapper.find('#edit_event_to_public_vk').toggleStatus('disabled').prop('checked', false).trigger('change');
        }
    }
});

socket.on('vk.post.error', function (response) {
    console.log(response);
    showNotifier({text: 'Не удалось опубликовать событие в группе vk. Пожалуйста, попробуйте еще раз.', status: false});
});

/**
 * @typedef {object} AJAXData
 * @property {(Fields|Array|string|undefined)} [fields]
 * @property {(string|undefined)} [format=json] Sets the response format. Can be xml or json. Default: json
 * @property {(boolean|undefined)} [download=false] If flag is TRUE server will set additional headers to make response downloadble in browser. Default: false
 * @property {(boolean|undefined)} [nude_data=false] If nude_data is TRUE server response with only data, without status code and description. Default: false
 * @property {(number|undefined)} [offset] Use offset to set how many elements you want to skip. Default: 0
 * @property {(number|undefined)} [length] Sets the items count server will return in response. Default: 100
 * @property {(string|undefined)} [order_by]
 */
/**
 * @typedef {function(({}|Array<{}>))} AJAXCallback
 */
/**
 * @interface
 */
EntityInterface = (function() {
	/**
	 *
	 * @interface
	 */
	function EntityInterface() {}
	/**
	 *
	 * @param {(Array|object)} data
	 * @returns {EntityInterface}
	 */
	EntityInterface.prototype.setData = function(data) {};
	
	return EntityInterface;
}());
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
/**
 * @requires EntityInterface.js
 * @requires Class.Fields.js
 */
/**
 *
 * @abstract
 * @class
 * @implements EntityInterface
 */
OneEntity = (function() {
	/**
	 *
	 * @constructor
	 * @constructs OneEntity
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
			if (data.hasOwnProperty(field) && this.hasOwnProperty(field)) {
				if ((this[field] instanceof EntitiesCollection || this[field] instanceof OneEntity) && data[field] != null) {
					this[field].setData(data[field]);
				} else {
					this[field] = data[field];
				}
			}
		}
		return this;
	};
	
	return OneEntity;
}());

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
/**
 * @requires ../entities/Class.OneEntity.js
 */
/**
 *
 * @class OrganizationModel
 * @extends OneEntity
 */
OrganizationModel = extending(OneEntity, (function() {
	/**
	 *
	 * @param {(OneOrganization|object)} [data]
	 *
	 * @constructor
	 * @constructs OrganizationModel
	 *
	 * @property {?string} name
	 * @property {?string} short_name
	 * @property {?string} description
	 * @property {?string} site_url
	 * @property {?string} default_address
	 * @property {?string} vk_url
	 * @property {?string} facebook_url
	 * @property {?string} type_id
	 * @property {?string} background
	 * @property {?string} logo
	 * @property {?string} detail_info_url
	 * @property {?string} email
	 * @property {?string} city_id
	 * @property {?string} country_id
	 * @property {?boolean} is_private
	 */
	function OrganizationModel(data) {
		this.organization_id = null;
		this.name = null;
		this.short_name = null;
		this.description = null;
		this.site_url = null;
		this.default_address = null;
		this.vk_url = null;
		this.facebook_url = null;
		this.type_id = null;
		this.background = null;
		this.background_filename = null;
		this.logo = null;
		this.logo_filename = null;
		this.detail_info_url = null;
		this.email = null;
		this.city_id = null;
		this.country_id = null;
		this.is_private = null;
		
		if (data) {
			setData(this, data);
		}
	}
	
	/**
	 *
	 * @param {OrganizationModel} obj
	 * @param {(OneOrganization|object)} data
	 * @returns {OrganizationModel}
	 */
	function setData(obj, data) {
		var field;
		
		for (field in data) {
			if (data.hasOwnProperty(field)) {
				if (obj.hasOwnProperty(field)) {
					obj[field] = data[field];
				} else {
					switch (field) {
						case 'background_img_url': {
							if (isBase64(data[field])) {
								obj.background = data[field];
							}
							break;
						}
						case 'img_url': {
							if (isBase64(data[field])) {
								obj.logo = data[field];
							}
							break;
						}
						case 'city': {
							obj.city_id = data[field] instanceof OneCity ? data[field].id : data[field];
							break;
						}
						case 'country': {
							obj.country_id = data[field].id;
							break;
						}
					}
				}
			}
		}
		
		return obj;
	}
	/**
	 *
	 * @param {(Array|object)} data
	 * @returns {OrganizationModel}
	 */
	OrganizationModel.prototype.setData = function(data) {
		return setData(this, data);
	};
	/**
	 *
	 * @returns {string}
	 */
	OrganizationModel.prototype.toString = function() {
		return JSON.stringify(this);
	};
	
	return OrganizationModel;
}()));
/**
 * @requires ../entities/Class.OneEntity.js
 */
/**
 *
 * @class TariffModel
 * @extends OneEntity
 */
TariffModel = extending(OneEntity, (function() {
	/**
	 *
	 * @param {(OneOrganization|object)} [data]
	 *
	 * @constructor
	 * @constructs TariffModel
	 *
	 * @property {?(string|number)} tariff_id
	 * @property {?string} name
	 * @property {?timestamp} since
	 * @property {?timestamp} till
	 * @property {?number} available_additional_notifications
	 * @property {?number} available_event_publications
	 * @property {?number} available_tickets_selling
	 * @property {?boolean} available_telegram_bots
	 * @property {?boolean} available_slack_bots
	 * @property {?boolean} available_auditory_analytics
	 * @property {?number} available_in_city
	 * @property {?number} price
	 */
	function TariffModel(data) {
		var self = this;
		
		this.tariff_id = null;
		this.name = null;
		this.since = null;
		this.till = null;
		this.available_additional_notifications = null;
		this.available_event_publications = null;
		this.available_tickets_selling = null;
		this.available_telegram_bots = null;
		this.available_slack_bots = null;
		this.available_auditory_analytics = null;
		this.available_in_city = null;
		this.price = null;
		
		Object.defineProperty(this, 'is_full', {
			get: function() {
				return self.price !== 0;
			}
		});
		
		if (data) {
			setData(this, data);
		}
	}
	
	return TariffModel;
}()));
/**
 * @requires ../../entities/Class.OneEntity.js
 */
/**
 *
 * @class DateModel
 * @extends OneEntity
 */
DateModel = extending(OneEntity, (function() {
	/**
	 *
	 * @constructor
	 * @constructs DateModel
	 */
	function DateModel() {
		this.event_date = '';
		this.start_time = '';
		this.end_time = '';
	}
	
	return DateModel;
}()));
/**
 * @requires ../../entities/Class.EntitiesCollection.js
 * @requires Class.DateModel.js
 */
/**
 *
 * @class DateModelsCollection
 * @extends EntitiesCollection
 */
DateModelsCollection = extending(EntitiesCollection, (function() {
	/**
	 *
	 * @constructor
	 * @constructs DateModelsCollection
	 */
	function DateModelsCollection() {
		EntitiesCollection.call(this);
	}
	DateModelsCollection.prototype.collection_of = DateModel;
	
	return DateModelsCollection;
}()));
/**
 * @requires ../../entities/Class.OneEntity.js
 */
/**
 * @class RegistrationFieldModel
 * @extends OneEntity
 */
RegistrationFieldModel = extending(OneEntity, (function() {
	/**
	 *
	 * @constructor
	 * @constructs RegistrationFieldModel
	 */
	function RegistrationFieldModel() {
		this.uuid = null;
		/**
		 *
		 * @type {RegistrationFieldModel.TYPES}
		 */
		this.type = null;
		this.label = null;
		this.required = false;
	}
	/**
	 *
	 * @enum {string}
	 */
	RegistrationFieldModel.TYPES = {
		EMAIL: 'email',
		FIRST_NAME: 'first_name',
		LAST_NAME: 'last_name',
		PHONE_NUMBER: 'phone_number',
		ADDITIONAL_TEXT: 'additional_text',
		CUSTOM: 'custom',
		EXTENDED_CUSTOM: 'extended_custom'
	};
	/**
	 *
	 * @enum {string}
	 */
	RegistrationFieldModel.DEFAULT_LABEL = {
		EMAIL: 'E-mail',
		FIRST_NAME: 'Имя',
		LAST_NAME: 'Фамилия',
		PHONE_NUMBER: 'Номер телефона',
		ADDITIONAL_TEXT: 'Дополнительное текстовое поле',
		CUSTOM: 'Дополнительное текстовое поле',
		EXTENDED_CUSTOM: 'Дополнительное текстовое поле'
	};
	
	/**
	 *
	 * @param {(RegistrationFieldModel|{type: {string}, required: {boolean}, [label]: {?string}})} field
	 * @return {boolean}
	 */
	RegistrationFieldModel.isCustomField = function(field) {
		switch (field.type) {
			case RegistrationFieldModel.TYPES.EMAIL:
			case RegistrationFieldModel.TYPES.FIRST_NAME:
			case RegistrationFieldModel.TYPES.LAST_NAME:
			case RegistrationFieldModel.TYPES.PHONE_NUMBER: return false;
			default:
			case RegistrationFieldModel.TYPES.CUSTOM:
			case RegistrationFieldModel.TYPES.EXTENDED_CUSTOM:
			case RegistrationFieldModel.TYPES.ADDITIONAL_TEXT: return true;
		}
	};
	
	RegistrationFieldModel.prototype.setData = function(data) {
		var field;
		if (Array.isArray(data)) {
			data = data[0];
		}
		for (field in data) {
			if (data.hasOwnProperty(field) && this.hasOwnProperty(field)) {
				this[field] = data[field];
			}
		}
		return this;
	};
	
	return RegistrationFieldModel;
}()));
/**
 * @requires ../../entities/Class.EntitiesCollection.js
 * @requires Class.RegistrationFieldModel.js
 */
/**
 *
 * @class RegistrationFieldsCollection
 * @extends EntitiesCollection
 */
RegistrationFieldsCollection = extending(EntitiesCollection, (function() {
	/**
	 *
	 * @constructor
	 * @constructs RegistrationFieldsCollection
	 */
	function RegistrationFieldsCollection() {
		EntitiesCollection.call(this);
	}
	RegistrationFieldsCollection.prototype.collection_of = RegistrationFieldModel;
	/**
	 *
	 * @param {...object} element
	 * @returns {number}
	 */
	RegistrationFieldsCollection.prototype.push = function(element) {
		var self = this,
			entities = Array.prototype.slice.call(arguments),
			types = [
				RegistrationFieldModel.TYPES.FIRST_NAME,
				RegistrationFieldModel.TYPES.LAST_NAME,
				RegistrationFieldModel.TYPES.EMAIL,
				RegistrationFieldModel.TYPES.PHONE_NUMBER,
				RegistrationFieldModel.TYPES.ADDITIONAL_TEXT,
				RegistrationFieldModel.TYPES.CUSTOM,
				RegistrationFieldModel.TYPES.EXTENDED_CUSTOM
			];
		
		this.last_pushed.splice(0);
		
		types.forEach(function(type) {
			entities.forEach(function(entity) {
				if (entity.type == type) {
					self.last_pushed.push(self[self.length++] = (entity instanceof self.collection_of) ? entity : (new self.collection_of()).setData(entity));
				}
			});
		});
		return this.length;
	};
	
	return RegistrationFieldsCollection;
}()));
/**
 * @requires ../Class.OneEntity.js
 */
/**
 * @abstract
 * @class OneAbstractActivity
 * @extends OneEntity
 */
OneAbstractActivity = extending(OneEntity, (function() {
	/**
	 *
	 * @constructs OneAbstractActivity
	 */
	function OneAbstractActivity() {
		this.stat_type_id = 0;
		this.user_id = 0;
		this.user = new OneUser(this.user_id);
		this.entity = '';
		/**
		 *
		 * @type {OneAbstractActivity.TYPES}
		 */
		this.type_code = '';
		this.created_at = 0;
	}
	/**
	 * @const
	 * @enum {string}
	 */
	OneAbstractActivity.TYPES = {
		SUBSCRIBE: 'subscribe',
		FAVE: 'fave',
		UNSUBSCRIBE: 'unsubscribe',
		UNFAVE: 'unfave',
		SHARE_VK: 'share_vk',
		SHARE_FB: 'share_fb',
		SHARE_TW: 'share_tw'
	};
	Object.freeze(OneAbstractActivity.TYPES);
	/**
	 * @const
	 * @enum {string}
	 */
	OneAbstractActivity.TYPES_INDEX = {
		subscribe: 'SUBSCRIBE',
		fave: 'FAVE',
		unsubscribe: 'UNSUBSCRIBE',
		unfave: 'UNFAVE',
		share_vk: 'SHARE',
		share_fb: 'SHARE',
		share_tw: 'SHARE'
	};
	Object.freeze(OneAbstractActivity.TYPES_INDEX);

	
	return OneAbstractActivity;
}()));
/**
 * @requires Class.OneAbstractActivity.js
 */
/**
 * @class OneEventActivity
 * @extends OneAbstractActivity
 */
OneEventActivity = extending(OneAbstractActivity, (function() {
	/**
	 *
	 * @constructs OneEventActivity
	 */
	function OneEventActivity() {
		OneAbstractActivity.call(this);
		this.event_id = 0;
		this.event = new OneEvent(this.event_id);
	}
	
	return OneEventActivity;
}()));
/**
 * @requires Class.OneAbstractActivity.js
 */
/**
 * @class OneOrganizationActivity
 * @extends OneAbstractActivity
 */
OneOrganizationActivity = extending(OneAbstractActivity, (function() {
	/**
	 *
	 * @constructs OneOrganizationActivity
	 */
	function OneOrganizationActivity() {
		OneAbstractActivity.call(this);
		this.organization_id = 0;
		this.organization = new OneOrganization(this.organization_id);
	}
	
	return OneOrganizationActivity;
}()));
/**
 * @requires ../Class.EntitiesCollection.js
 * @requires Class.OneEventActivity.js
 * @requires Class.OneOrganizationActivity.js
 */
/**
 * @class UsersActivitiesCollection
 * @extends EntitiesCollection
 */
UsersActivitiesCollection = extending(EntitiesCollection, (function() {
	/**
	 *
	 * @constructs UsersActivitiesCollection
	 */
	function UsersActivitiesCollection(user_id) {
		EntitiesCollection.call(this);
		Object.defineProperty(this, 'user_id', {value: user_id});
	}
	Object.defineProperty(UsersActivitiesCollection.prototype, 'collection_of', {value: OneAbstractActivity});
	
	UsersActivitiesCollection.setDefaultData = function(data) {
		if(typeof data.fields === 'string'){
			data.fields = data.fields.split(',');
		} else if (!(data.fields instanceof Array)) {
			data.fields = [];
		}
		data.fields = data.fields.merge([
			'created_at',
			'type_code',
			'event',
			'organization'
		]);
		data.order_by = setDefaultValue(data.order_by, '-created_at');
		data.length = setDefaultValue(data.length, 20);
		return data;
	};
	/**
	 *
	 * @param {...object} element
	 * @returns {number}
	 */
	UsersActivitiesCollection.prototype.push = function(element) {
		for (var i = 0; i < arguments.length; i++) {
			if(arguments[i] instanceof this.collection_of){
				this[this.length] = arguments[i];
			} else if (arguments[i].event_id != undefined) {
				this[this.length] = (new OneEventActivity()).setData(arguments[i]);
			} else if (arguments[i].organization_id != undefined) {
				this[this.length] = (new OneOrganizationActivity()).setData(arguments[i]);
			}
			this.length++;
		}
		return this.length;
	};
	/**
	 *
	 * @param {(string|number)} user_id
	 * @param {AJAXData} data
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	UsersActivitiesCollection.fetch = function(user_id, data, success) {
		data = UsersActivitiesCollection.setDefaultData(data);
		return __APP.SERVER.getData('/api/v1/users/' + user_id + '/actions', data, success);
	};
	/**
	 *
	 * @param {(Array|string)} [fields]
	 * @param {(number|string)} [length]
	 * @param {string} [order_by]
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	UsersActivitiesCollection.prototype.fetch = function(fields, length, order_by, success) {
		var self = this,
			ajax_data = {
				fields: fields,
				offset: this.length,
				length: length
			};
		if (order_by) {
			ajax_data.order_by = order_by;
		}
		return this.constructor.fetch(this.user_id, ajax_data).then(function(data) {
			self.setData(data);
			return (new self.constructor()).setData(data);
		});
	};
	
	return UsersActivitiesCollection;
}()));
/**
 * @requires ../Class.OneEntity.js
 */
/**
 *
 * @class OneCategory
 * @extends OneEntity
 */
OneCategory = extending(OneEntity, (function() {
	/**
	 *
	 * @param {(string|number)} [category_id]
	 * @param {boolean} [is_loading_continuous]
	 * @constructor
	 * @constructs OneCategory
	 *
	 * @property {(number|string)} id
	 * @property {string} ?name
	 * @property {number} ?order_position
	 * @property {OrganizationsCollection} organizations
	 */
	function OneCategory(category_id, is_loading_continuous) {
		this.id = setDefaultValue(category_id, 0);
		this.name = null;
		this.order_position = null;
		this.organizations = new OrganizationsCollection();
		
		this.loading = false;
		if (category_id && is_loading_continuous) {
			this.loading = true;
			this.fetchCategory([], function() {
				this.loading = false;
				$(window).trigger('fetch.OneCategory');
			});
		}
	}
	/**
	 *
	 * @param {(string|number)} category_id
	 * @param {AJAXData} data
	 * @param {AJAXCallback} [success]
	 * @return {jqPromise}
	 */
	OneCategory.fetchCategory = function(category_id, data, success) {
		return __APP.SERVER.getData('/api/v1/organizations/types', $.extend({}, data, {id: category_id}), success);
	};
	/**
	 *
	 * @param {(Array|string)} fields
	 * @param {AJAXCallback} [success]
	 * @return {jqPromise}
	 */
	OneCategory.prototype.fetchCategory = function(fields, success) {
		var self = this;
		return this.constructor.fetchCategory(self.id, {fields: fields}, function(data) {
			self.setData(data);
			if (success && typeof success == 'function') {
				success.call(self, data[0]);
			}
		});
	};
	
	return OneCategory;
}()));
/**
 * @requires ../Class.EntitiesCollection.js
 * @requires Class.OneCategory.js
 */
/**
 *
 * @class CategoriesCollection
 * @extends EntitiesCollection
 */
CategoriesCollection = extending(EntitiesCollection, (function() {
	/**
	 *
	 * @constructor
	 * @constructs CategoriesCollection
	 */
	function CategoriesCollection() {
		EntitiesCollection.call(this);
	}
	
	CategoriesCollection.prototype.collection_of = OneCategory;
	/**
	 *
	 * @param {AJAXData} data
	 * @param {AJAXCallback} [success]
	 */
	CategoriesCollection.fetchCategories = function(data, success) {
		return __APP.SERVER.getData('/api/v1/organizations/types', data, success);
	};
	/**
	 *
	 * @param {AJAXData} data
	 * @param {(number|string)} [length]
	 * @param {AJAXCallback} [success]
	 */
	CategoriesCollection.prototype.fetchCategories = function(data, length, success) {
		var self = this,
			ajax_data = $.extend({}, data, {
				offset: this.length,
				length: length
			});
		return this.constructor.fetchCategories(ajax_data, function(data) {
			self.setData(data);
			if (success && typeof success == 'function') {
				success.call(self, data);
			}
		});
	};
	/**
	 *
	 * @param {AJAXData} categories_ajax_data
	 * @param {AJAXData} orgs_ajax_data
	 * @param {(number|string)} [length]
	 * @param {AJAXCallback} [success]
	 */
	CategoriesCollection.prototype.fetchCategoriesWithOrganizations = function(categories_ajax_data, orgs_ajax_data, length, success) {
		var self = this,
			ajax_data = $.extend({}, categories_ajax_data, {
				offset: this.length,
				length: length
			}),
			org_field = 'organizations' + JSON.stringify(__APP.SERVER.validateData(orgs_ajax_data));
		if (!ajax_data.fields) {
			ajax_data.fields = [];
		} else if (!Array.isArray(ajax_data.fields)) {
			ajax_data.fields = ajax_data.fields.split(',');
		}
		ajax_data.fields.push(org_field);
		return this.constructor.fetchCategories(ajax_data, function(data) {
			self.setData(data);
			if (success && typeof success == 'function') {
				success.call(self, data);
			}
		});
	};
	
	return CategoriesCollection;
}()));
/**
 * @requires ../Class.OneEntity.js
 */
/**
 * @class OneCity
 * @extends OneEntity
 */
OneCity = extending(OneEntity, (function() {
	/**
	 *
	 * @param {(string|number)} [city_id]
	 * @constructor
	 * @constructs OneCity
	 *
	 * @property {(string|number)} id=0
	 * @property {?string} en_name
	 * @property {?number} country_id
	 * @property {?string} local_name
	 * @property {CategoriesCollection} organization_type
	 * @property {?number} timediff_seconds
	 */
	function OneCity(city_id) {
		this.id = setDefaultValue(city_id, 0);
		
		this.en_name = null;
		this.country_id = null;
		this.local_name = null;
		this.organization_type = new CategoriesCollection();
		this.timediff_seconds = null;
	}
	
	return OneCity;
}()));
/**
 * @requires ../Class.EntitiesCollection.js
 * @requires Class.OneCity.js
 */
/**
 *
 * @class CitiesCollection
 * @extends EntitiesCollection
 */
CitiesCollection = extending(EntitiesCollection, (function() {
	/**
	 *
	 * @constructor
	 * @constructs CitiesCollection
	 */
	function CitiesCollection() {
		EntitiesCollection.call(this);
	}
	
	CitiesCollection.prototype.collection_of = OneCity;
	/**
	 *
	 * @param {AJAXData} data
	 * @param {AJAXCallback} success
	 * @return {jqPromise}
	 */
	CitiesCollection.fetchCities = function(data, success) {
		return __APP.SERVER.getData('/api/v1/organizations/cities', data, success);
	};
	/**
	 *
	 * @param {string} name
	 * @returns {(OneCity|null)}
	 */
	CitiesCollection.prototype.getByName = function(name) {
		for (var i = 0; i < this.length; i++) {
			if (this[i].en_name == name) {
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
	CitiesCollection.prototype.has = function(id) {
		return ($.isNumeric(id) ? this.getByID(id) : this.getByName(id)) instanceof OneEntity;
	};
	/**
	 *
	 * @param {?(Fields|Array|string)} [fields]
	 * @param {?number} [length]
	 * @param {?string} [order_by]
	 * @param {?function} [success]
	 * @return {jqPromise}
	 */
	CitiesCollection.prototype.fetchCities = function(fields, length, order_by, success) {
		var self = this;
		
		return CitiesCollection.fetchCities({
			fields: fields || undefined,
			offset: this.length,
			length: length || undefined,
			order_by: order_by || undefined
		}, function(data) {
			self.setData(data);
			if (success && typeof success == 'function') {
				success.call(self, self.last_pushed);
			}
		});
	};
	
	return CitiesCollection;
}()));
/**
 * @requires ../../data_models/date/Class.DateModel.js
 */
/**
 *
 * @class OneDate
 * @extends DateModel
 */
OneDate = extending(DateModel, (function() {
	/**
	 *
	 * @constructor
	 * @constructs OneDate
	 */
	function OneDate() {
		DateModel.call(this);
		this.id = 0;
		this.event_id = 0;
		this.organization_id = 0;
		this.events_count = 0;
		this.favored_count = 0;
	}
	return OneDate;
}()));
/**
 * @requires ../Class.EntitiesCollection.js
 * @requires Class.OneDate.js
 */
/**
 * @typedef {AJAXData} DatesCollectionAJAXData
 * @property {string} [month]
 * @property {string} [since]
 * @property {string} [till]
 * @property {(number|string)} [organization_id]
 * @property {(number|string)} [event_id]
 * @property {boolean} [unique]
 * @property {boolean} [my]
 */
/**
 *
 * @class DatesCollection
 * @extends EntitiesCollection
 */
DatesCollection = extending(EntitiesCollection, (function() {
	/**
	 *
	 * @constructor
	 * @constructs DatesCollection
	 */
	function DatesCollection() {
		EntitiesCollection.call(this);
	}
	DatesCollection.prototype.collection_of = OneDate;
	/**
	 *
	 * @param {DatesCollectionAJAXData} ajax_data
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	DatesCollection.fetchDates = function(ajax_data, success) {
		return __APP.SERVER.getData('/api/v1/events/dates', ajax_data, success);
	};
	
	return DatesCollection;
}()));
/**
 * @requires ../Class.OneEntity.js
 * @requires ../../data_models/registration_field/Class.RegistrationFieldsCollection.js
 */
/**
 * @class OneEvent
 * @extends OneEntity
 */
OneEvent = extending(OneEntity, (function() {
	/**
	 *
	 * @param {(string|number)} [event_id=0]
	 * @param {boolean} [is_loading_continuous]
	 *
	 * @constructor
	 * @constructs OneEvent
	 *
	 * @property {number} id
	 * @property {?string} title
	 * @property {?string} description
	 *
	 * @property {?string} location
	 * @property {?string} latitude
	 * @property {?string} longitude
	 * @property {?boolean} is_online
	 *
	 * @property {?string} detail_info_url
	 *
	 * @property {OrdersCollection} orders
	 *
	 * @property {?boolean} ticketing_locally
	 * @property {EventsTicketsCollection} tickets
	 * @property {TicketTypesCollection} ticket_types
	 *
	 * @property {?boolean} registration_locally
	 * @property {?boolean} registration_available
	 * @property {?boolean} registration_required
	 * @property {?number} registration_limit_count
	 * @property {?string} registration_till
	 * @property {?string} registration_approve_status
	 * @property {?boolean} registration_approvement_required
	 * @property {?boolean} is_registered
	 * @property {?number} registered_count
	 * @property {UsersCollection} registered_users
	 * @property {RegistrationFieldsCollection} registration_fields
	 *
	 * @property {?number} organization_id
	 * @property {?string} organization_short_name
	 * @property {?string} organization_logo_large_url
	 * @property {?string} organization_logo_medium_url
	 * @property {?string} organization_logo_small_url
	 *
	 * @property {?string} image_vertical_url
	 * @property {?string} image_horizontal_url
	 * @property {?string} image_horizontal_large_url
	 * @property {?string} image_horizontal_medium_url
	 * @property {?string} image_horizontal_small_url
	 *
	 * @property {?boolean} is_free
	 * @property {?number} min_price
	 *
	 * @property {DatesCollection} dates
	 * @property {?boolean} is_same_time
	 * @property {?timestamp} first_event_date
	 * @property {?timestamp} last_event_date
	 * @property {?timestamp} nearest_event_date
	 *
	 * @property {TagsCollection} tags
	 *
	 * @property {Array} notifications
	 *
	 * @property {UsersCollection} favored
	 * @property {?number} favored_users_count
	 * @property {?number} favored_friends_count
	 * @property {?boolean} is_favorite
	 *
	 * @property {?number} public_at
	 * @property {?boolean} canceled
	 * @property {?boolean} can_edit
	 *
	 * @property {?number} actuality
	 *
	 * @property {?number} creator_id
	 * @property {?number} created_at
	 * @property {?number} updated_at
	 */
	function OneEvent(event_id, is_loading_continuous) {
		this.id = event_id ? event_id : 0;
		this.title = null;
		this.description = null;
		
		this.location = null;
		this.latitude = null;
		this.longitude = null;
		this.is_online = null;
		
		this.detail_info_url = null;
		
		this.orders = new OrdersCollection(event_id);
		
		this.ticketing_locally = null;
		this.tickets = new EventsTicketsCollection(event_id);
		this.ticket_types = new TicketTypesCollection(event_id);
		
		this.registration_locally = null;
		this.registration_available = null;
		this.registration_required = null;
		this.registration_limit_count = null;
		this.registration_till = null;
		this.registration_approve_status = null;
		this.registration_approvement_required = null;
		this.is_registered = null;
		this.registered_count = null;
		this.registered_users = new UsersCollection();
		this.registration_fields = new RegistrationFieldsCollection();
		
		this.organization_id = null;
		this.organization_short_name = null;
		this.organization_logo_large_url = null;
		this.organization_logo_medium_url = null;
		this.organization_logo_small_url = null;
		
		this.image_vertical_url = null;
		this.image_horizontal_url = null;
		this.image_horizontal_large_url = null;
		this.image_horizontal_medium_url = null;
		this.image_horizontal_small_url = null;
		
		this.is_free = null;
		this.min_price = null;
		
		this.dates = new DatesCollection();
		this.is_same_time = null;
		this.first_event_date = null;
		this.last_event_date = null;
		this.nearest_event_date = null;
		
		this.tags = new TagsCollection();
		
		this.notifications = [];
		
		this.favored = new UsersCollection();
		this.favored_users_count = null;
		this.favored_friends_count = null;
		this.is_favorite = null;
		
		this.public_at = null;
		this.canceled = null;
		this.can_edit = null;
		
		this.actuality = null;
		
		this.creator_id = null;
		this.created_at = null;
		this.updated_at = null;
		
		this.loading = false;
		if (event_id && is_loading_continuous) {
			this.loading = true;
			this.fetchEvent(undefined, function() {
				this.loading = false;
				$(window).trigger('fetch.OneEvent');
			});
		}
	}
	
	/**
	 * @const
	 * @enum {string}
	 */
	OneEvent.STATUS = {
		CANCEL: 'cancel',
		BRING_BACK: 'bring_back',
		HIDE: 'hide',
		SHOW: 'show'
	};
	/**
	 *
	 * @param {(string|number)} event_id
	 * @param {(Fields|string|Array)} [fields]
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	OneEvent.fetchEvent = function(event_id, fields, success) {
		return __APP.SERVER.getData('/api/v1/events/' + event_id, {fields: new Fields(fields)}, success);
	};
	/**
	 * @typedef {function({
	 *   event_id: number
	 * })} OneEventCreateEventCallback
	 */
	/**
	 * @typedef {object} OneEventCreateEventData
	 * @property {string} [title]
	 * @property {string} [description]
	 * @property {string} [location]
	 * @property {integer} [organization_id]
	 * @property {object} [location_object]
	 * @property {number} [location_object.latitude]
	 * @property {number} [location_object.longitude]
	 * @property {number} [longitude]
	 * @property {number} [latitude]
	 * @property {string} [image_horizontal]
	 * @property {string} [detail_info_url]
	 * @property {DatesCollection} [dates]
	 * @property {Array<(string|number)>} [tags]
	 */
	/**
	 *
	 * @param {OneEventCreateEventData} new_event_data
	 * @param {OneEventCreateEventCallback} [success]
	 * @param {function} [error]
	 * @returns {jqPromise}
	 */
	OneEvent.createEvent = function(new_event_data, success, error) {
		return __APP.SERVER.addData('/api/v1/events/', new_event_data, true, success, error);
	};
	/**
	 *
	 * @param {(string|number)} event_id
	 * @param {OneEventCreateEventData} data
	 * @param {OneEventCreateEventCallback} [success]
	 * @param {function} [error]
	 * @returns {jqPromise}
	 */
	OneEvent.updateEvent = function(event_id, data, success, error) {
		return __APP.SERVER.updateData('/api/v1/events/' + event_id, data, true, success, error);
	};
	/**
	 *
	 * @param {(string|number)} event_id
	 * @param {(OneEvent.STATUS|Array<OneEvent.STATUS>)} status
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	OneEvent.changeEventStatus = function(event_id, status, success) {
		var data = {};
		status = Array.isArray(status) ? status : [status];
		status.forEach(function(el) {
			switch (el) {
				case OneEvent.STATUS.CANCEL: {
					data.canceled = true;
					break;
				}
				case OneEvent.STATUS.BRING_BACK: {
					data.canceled = false;
					break;
				}
				case OneEvent.STATUS.HIDE: {
					data.hidden = true;
					break;
				}
				case OneEvent.STATUS.SHOW: {
					data.hidden = false;
					break;
				}
			}
		});
		return __APP.SERVER.updateData('/api/v1/events/' + event_id + '/status', data, false, function() {
			if (success && typeof success == 'function') {
				success.call(self, data);
			}
		});
	};
	/**
	 *
	 * @param {(string|number)} event_id
	 * @param {function} [success]
	 * @returns {jqPromise}
	 */
	OneEvent.addFavored = function(event_id, success) {
		return __APP.SERVER.addData('/api/v1/events/' + event_id + '/favorites', {}, false, success);
	};
	/**
	 *
	 * @param {(string|number)} event_id
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	OneEvent.deleteFavored = function(event_id, success) {
		return __APP.SERVER.deleteData('/api/v1/events/' + event_id + '/favorites', {}, success);
	};
	/**
	 *
	 * @param {(string|number)} event_id
	 * @param {string} notification_type
	 * @param {function} [success]
	 * @returns {jqPromise}
	 */
	OneEvent.addEventNotification = function(event_id, notification_type, success) {
		return __APP.SERVER.addData('/api/v1/events/' + event_id + '/notifications', {notification_type: notification_type}, false, success);
	};
	/**
	 *
	 * @param {(string|number)} event_id
	 * @param {string} notification_uuid
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	OneEvent.deleteEventNotification = function(event_id, notification_uuid, success) {
		return __APP.SERVER.deleteData('/api/v1/events/' + event_id + '/notifications/' + notification_uuid, {}, success);
	};
	/**
	 *
	 * @param {(string|number)} event_id
	 * @param {object} registration_fields
	 * @param {AJAXCallback} [success]
	 * @return {jqPromise}
	 */
	OneEvent.registerToEvent = function(event_id, registration_fields, success) {
		return __APP.SERVER.addData('/api/v1/events/' + event_id + '/orders', {
			registration_fields: registration_fields,
			tickets: [{
				uuid: null,
				count: 1
			}]
		}, true, success);
	};
	/**
	 *
	 * @param {(Fields|string|Array)} fields
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	OneEvent.prototype.fetchEvent = function(fields, success) {
		var self = this;
		return OneEvent.fetchEvent(self.id, fields, function(data) {
			self.setData(data[0]);
			if (success && typeof success === 'function') {
				success.call(self, data[0]);
			}
		});
	};
	/**
	 *
	 * @param {OneEventCreateEventData} data
	 * @param {OneEventCreateEventCallback} [success]
	 * @param {function} [error]
	 * @returns {jqPromise}
	 */
	OneEvent.prototype.createEvent = function(data, success, error) {
		var self = this;
		return this.constructor.createEvent(data, function(response_data) {
			self.setData(data);
			self.id = response_data.event_id;
			if (success && typeof success == 'function') {
				success.call(self, data);
			}
		}, error);
	};
	/**
	 *
	 * @param {OneEventCreateEventData} data
	 * @param {OneEventCreateEventCallback} [success]
	 * @param {function} [error]
	 * @returns {jqPromise}
	 */
	OneEvent.prototype.updateEvent = function(data, success, error) {
		var self = this;
		return this.constructor.updateEvent(self.id, data, function(response_data) {
			self.setData(data);
			if (success && typeof success == 'function') {
				success.call(self, data);
			}
		}, error);
	};
	/**
	 *
	 * @param {(OneEvent.STATUS|Array<OneEvent.STATUS>)} status
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	OneEvent.prototype.changeEventStatus = function(status, success) {
		var self = this;
		return this.constructor.changeEventStatus(self.id, status, function(data) {
			self.setData(data);
			if (success && typeof success == 'function') {
				success.call(self, data);
			}
		});
	};
	/**
	 *
	 * @param {string} notification_type
	 * @param {function} [success]
	 * @returns {jqPromise}
	 */
	OneEvent.prototype.addNotification = function(notification_type, success) {
		return this.constructor.addEventNotification(this.id, notification_type, success);
	};
	/**
	 *
	 * @param {string} notification_uuid
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	OneEvent.prototype.deleteNotification = function(notification_uuid, success) {
		return this.constructor.deleteEventNotification(this.id, notification_uuid, success);
	};
	/**
	 *
	 * @param {object} registration_fields
	 * @param {AJAXCallback} [success]
	 * @return {jqPromise}
	 */
	OneEvent.prototype.registerToEvent = function(registration_fields, success) {
		return this.constructor.registerToEvent(this.id, registration_fields, success);
	};
	
	return OneEvent;
}()));
/**
 * @requires ../Class.EntitiesCollection.js
 * @requires Class.OneEvent.js
 */
/**
 * @typedef {AJAXData} EventsCollectionAJAXData
 * @property {string} [date]
 * @property {string} [query]
 * @property {boolean} [statistics]
 * @property {boolean} [canceled_shown]
 * @property {boolean} [future]
 * @property {boolean} [is_delayed]
 * @property {boolean} [is_canceled]
 * @property {string} [since]
 * @property {string} [till]
 * @property {string} [changed_since]
 * @property {string} [tags]
 * @property {string} [title]
 * @property {boolean} [strict]
 * @property {(string|number)} [organization_id]
 * @property {string} [bounds]
 * @property {string} [point]
 */
/**
 * @typedef {function(Array<OneEvent>)} EventsCollectionAJAXCallback
 */
/**
 *
 * @class EventsCollection
 * @extends EntitiesCollection
 */
EventsCollection = extending(EntitiesCollection, (function() {
	/**
	 *
	 * @constructor
	 * @constructs EventsCollection
	 */
	function EventsCollection() {
		EntitiesCollection.call(this);
	}
	EventsCollection.prototype.collection_of = OneEvent;
	/**
	 * @const
	 * @enum {string}
	 */
	EventsCollection.KIND = {
		MY: 'my',
		FAVORED: 'favored',
		RECOMMENDED: 'recommended'
	};
	/**
	 *
	 * @param {EventsCollectionAJAXData} data
	 * @param {EventsCollectionAJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	EventsCollection.fetchEvents = function(data, success) {
		return __APP.SERVER.getData('/api/v1/events/', data, success);
	};
	/**
	 *
	 * @param {EventsCollectionAJAXData} data
	 * @param {EventsCollectionAJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	EventsCollection.fetchMyEvents = function(data, success) {
		return __APP.SERVER.getData('/api/v1/events/my', data, success);
	};
	/**
	 *
	 * @param {EventsCollectionAJAXData} data
	 * @param {EventsCollectionAJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	EventsCollection.fetchFavoredEvents = function(data, success) {
		return __APP.SERVER.getData('/api/v1/events/favorites', data, success);
	};
	/**
	 *
	 * @param {EventsCollectionAJAXData} data
	 * @param {EventsCollectionAJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	EventsCollection.fetchRecommendedEvents = function(data, success) {
		return __APP.SERVER.getData('/api/v1/events/recommendations', data, success);
	};
	/**
	 *
	 * @param {(number|string)} organization_id
	 * @param {EventsCollectionAJAXData} data
	 * @param {EventsCollectionAJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	EventsCollection.fetchOrganizationsEvents = function(organization_id, data, success) {
		return __APP.SERVER.getData('/api/v1/events/', $.extend({}, data, {organization_id: organization_id}), success);
	};
	/**
	 *
	 * @param {EventsCollection.KIND} [kind]
	 * @param {EventsCollectionAJAXData} [data]
	 * @param {(number|string)} [length]
	 * @param {EventsCollectionAJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	EventsCollection.prototype.fetchEvents = function(kind, data, length, success) {
		var self = this,
			method_name = 'fetchEvents',
			ajax_data = $.extend({}, data, {
				offset: this.length,
				length: length
			});
		switch (kind) {
			default: {
				method_name = 'fetchEvents';
				break;
			}
			case EventsCollection.KIND.MY: {
				method_name = 'fetchMyEvents';
				break;
			}
			case EventsCollection.KIND.FAVORED: {
				method_name = 'fetchFavoredEvents';
				break;
			}
			case EventsCollection.KIND.RECOMMENDED: {
				method_name = 'fetchRecommendedEvents';
				break;
			}
		}
		return this.constructor[method_name](ajax_data, function(data) {
			self.setData(data);
			if (success && typeof success === 'function') {
				success.call(self, self.last_pushed);
			}
		});
	};
	/**
	 *
	 * @param {(Fields|Array|string)} [fields]
	 * @param {(number|string)} [length]
	 * @param {EventsCollectionAJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	EventsCollection.prototype.fetchFeed = function(fields, length, success) {
		var self = this,
			ajax_data = {
				fields: fields,
				offset: this.length,
				length: length
			};
		return this.constructor.fetchEvents(ajax_data, function(data) {
			self.setData(data);
			if (success && typeof success === 'function') {
				success.call(self, self.last_pushed);
			}
		});
	};
	/**
	 *
	 * @param {(number|string)} organization_id
	 * @param {EventsCollectionAJAXData} [data]
	 * @param {(number|string)} [length]
	 * @param {EventsCollectionAJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	EventsCollection.prototype.fetchOrganizationsEvents = function(organization_id, data, length, success) {
		var self = this,
			ajax_data = $.extend({}, data, {
				offset: this.length,
				length: length
			});
		return this.constructor.fetchOrganizationsEvents(organization_id, ajax_data, function(data) {
			self.setData(data);
			if (success && typeof success === 'function') {
				success.call(self, self.last_pushed);
			}
		});
	};
	/**
	 *
	 * @param {(number|string)} organization_id
	 * @param {(Fields|Array|string)} [fields]
	 * @param {(number|string)} [length]
	 * @param {EventsCollectionAJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	EventsCollection.prototype.fetchOrganizationsFeed = function(organization_id, fields, length, success) {
		var self = this,
			ajax_data = {
				fields: fields,
				offset: this.length,
				length: length
			};
		return this.constructor.fetchOrganizationsEvents(organization_id, ajax_data, function(data) {
			self.setData(data);
			if (success && typeof success === 'function') {
				success.call(self, self.last_pushed);
			}
		});
	};
	
	return EventsCollection;
}()));
/**
 * @requires Class.EventsCollection.js
 */
/**
 *
 * @class ActualEventsCollection
 * @extends EventsCollection
 */
ActualEventsCollection = extending(EventsCollection, (function() {
	/**
	 *
	 * @constructor
	 * @constructs ActualEventsCollection
	 */
	function ActualEventsCollection() {
		EventsCollection.call(this);
	}
	/**
	 *
	 * @override
	 */
	ActualEventsCollection.fetchEvents = function(data, success) {
		data.fields = data.fields ? (typeof data.fields === 'string') ? data.fields.split(',') : data.fields : [];
		data.fields.push('actuality');
		data.future = true;
		data.order_by = '-actuality';
		
		return EventsCollection.fetchMyEvents(data, success);
	};
	
	return ActualEventsCollection;
}()));
/**
 * @requires Class.EventsCollection.js
 */
/**
 *
 * @class CanceledEventsCollection
 * @extends EventsCollection
 */
CanceledEventsCollection = extending(EventsCollection, (function() {
	/**
	 *
	 * @constructor
	 * @constructs CanceledEventsCollection
	 */
	function CanceledEventsCollection() {
		EventsCollection.call(this);
	}
	/**
	 *
	 * @override
	 */
	CanceledEventsCollection.fetchOrganizationsEvents = function(organization_id, data, success) {
		data.fields = data.fields ? (typeof data.fields === 'string') ? data.fields.split(',') : data.fields : [];
		data.fields.push('updated_at');
		data.is_canceled = true;
		data.order_by = '-updated_at';
		return EventsCollection.fetchOrganizationsEvents(organization_id, data, success);
	};
	
	return CanceledEventsCollection;
}()));
/**
 * @requires Class.EventsCollection.js
 */
/**
 *
 * @class DayEventsCollection
 * @extends EventsCollection
 */
DayEventsCollection = extending(EventsCollection, (function() {
	/**
	 *
	 * @param {string} date
	 * @constructor
	 * @construct DayEventsCollection
	 */
	function DayEventsCollection(date) {
		if (!date)
			throw Error('DayEventsCollection must have date parameter');
		EventsCollection.call(this);
		this.date = date;
	}
	/**
	 *
	 * @param {string} date
	 * @param {EventsCollectionAJAXData} data
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	DayEventsCollection.fetchEvents = function(date, data, success) {
		data.date = date;
		return EventsCollection.fetchMyEvents(data, success);
	};
	/**
	 *
	 * @override
	 */
	DayEventsCollection.prototype.fetchFeed = function(fields, length, success) {
		var self = this,
			ajax_data = {
				fields: fields,
				offset: this.length,
				length: length
			};
		return this.constructor.fetchEvents(this.date, ajax_data, function(data) {
			self.setData(data);
			if (success && typeof success == 'function') {
				success.call(self, data);
			}
		});
	};
	
	return DayEventsCollection;
}()));
/**
 * @requires Class.EventsCollection.js
 */
/**
 *
 * @class DelayedEventsCollection
 * @extends EventsCollection
 */
DelayedEventsCollection = extending(EventsCollection, (function() {
	/**
	 *
	 * @constructor
	 * @constructs DelayedEventsCollection
	 */
	function DelayedEventsCollection() {
		EventsCollection.call(this);
	}
	/**
	 *
	 * @override
	 */
	DelayedEventsCollection.fetchOrganizationsEvents = function(organization_id, data, success) {
		data.fields = data.fields ? (typeof data.fields === 'string') ? data.fields.split(',') : data.fields : [];
		data.fields.push('public_at');
		data.is_delayed = true;
		data.is_canceled = false;
		data.order_by = 'public_at';
		return EventsCollection.fetchOrganizationsEvents(organization_id, data, success);
	};
	
	return DelayedEventsCollection;
}()));
/**
 * @requires Class.OneEvent.js
 */
/**
 *
 * @class OneEventWithStatistics
 * @extends OneEvent
 */
OneEventWithStatistics = extending(OneEvent, (function() {
	/**
	 *
	 * @param {(string|number)} [event_id]
	 * @param {boolean} [is_loading_continuous]
	 * @constructor
	 * @constructs OneEventWithStatistics
	 */
	function OneEventWithStatistics(event_id, is_loading_continuous) {
		OneEvent.apply(this, arguments);
		this.view = 0;
		this.view_detail = 0;
		this.fave = 0;
		this.unfave = 0;
		this.open_site = 0;
		this.notifications_sent = 0;
	}
	
	return OneEventWithStatistics;
}()));
/**
 * @requires Class.EventsCollection.js
 * @requires Class.OneEventWithStatistics.js
 */
/**
 *
 * @class EventsWithStatisticsCollection
 * @extends EventsCollection
 */
EventsWithStatisticsCollection = extending(EventsCollection, (function() {
	/**
	 *
	 * @constructor
	 * @constructs EventsWithStatisticsCollection
	 */
	function EventsWithStatisticsCollection() {
		EventsCollection.call(this);
	}
	EventsWithStatisticsCollection.prototype.collection_of = OneEventWithStatistics;
	/**
	 *
	 * @param {EventsCollectionAJAXData} data
	 * @param {EventsCollectionAJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	EventsWithStatisticsCollection.fetchEvents = function(data, success) {
		data.statistics = true;
		return __APP.SERVER.getData('/api/v1/events/', data, success);
	};
	/**
	 *
	 * @param {EventsCollectionAJAXData} data
	 * @param {EventsCollectionAJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	EventsWithStatisticsCollection.fetchMyEvents = function(data, success) {
		data.statistics = true;
		return __APP.SERVER.getData('/api/v1/events/my', data, success);
	};
	/**
	 *
	 * @param {EventsCollectionAJAXData} data
	 * @param {EventsCollectionAJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	EventsWithStatisticsCollection.fetchFavoredEvents = function(data, success) {
		data.statistics = true;
		return __APP.SERVER.getData('/api/v1/events/favorites', data, success);
	};
	/**
	 *
	 * @param {EventsCollectionAJAXData} data
	 * @param {EventsCollectionAJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	EventsWithStatisticsCollection.fetchRecommendedEvents = function(data, success) {
		data.statistics = true;
		return __APP.SERVER.getData('/api/v1/events/recommendations', data, success);
	};
	/**
	 *
	 * @param {(number|string)} organization_id
	 * @param {EventsCollectionAJAXData} data
	 * @param {EventsCollectionAJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	EventsWithStatisticsCollection.fetchOrganizationsEvents = function(organization_id, data, success) {
		data.statistics = true;
		return __APP.SERVER.getData('/api/v1/events/', $.extend({}, data, {organization_id: organization_id}), success);
	};
	
	return EventsWithStatisticsCollection;
}()));
/**
 * @requires Class.EventsCollection.js
 */
/**
 *
 * @class FavoredEventsCollection
 * @extends EventsCollection
 */
FavoredEventsCollection = extending(EventsCollection, (function() {
	/**
	 *
	 * @constructor
	 * @constructs FavoredEventsCollection
	 */
	function FavoredEventsCollection() {
		EventsCollection.call(this);
	}
	/**
	 *
	 * @override
	 */
	FavoredEventsCollection.fetchEvents = function(data, success) {
		data.future = true;
		return EventsCollection.fetchFavoredEvents(data, success);
	};
	
	return FavoredEventsCollection;
}()));
/**
 * @requires Class.EventsCollection.js
 */
/**
 *
 * @class FriendsEventsCollection
 * @extends EventsCollection
 */
FriendsEventsCollection = extending(EventsCollection, (function() {
	/**
	 *
	 * @constructor
	 * @constructs FriendsEventsCollection
	 */
	function FriendsEventsCollection() {
		EventsCollection.call(this);
	}
	/**
	 *
	 * @override
	 */
	FriendsEventsCollection.fetchEvents = function(data, success) {
		data.fields = data.fields ? (typeof data.fields === 'string') ? data.fields.split(',') : data.fields : [];
		data.fields.push('favored_friends_count');
		data.future = true;
		data.order_by = '-favored_friends_count';
		return EventsCollection.fetchMyEvents(data, success);
	};
	
	return FriendsEventsCollection;
}()));
/**
 * @requires Class.EventsCollection.js
 */
/**
 *
 * @class FutureEventsCollection
 * @extends EventsCollection
 */
FutureEventsCollection = extending(EventsCollection, (function() {
	/**
	 *
	 * @constructor
	 * @constructs FutureEventsCollection
	 */
	function FutureEventsCollection() {
		EventsCollection.call(this);
	}
	/**
	 *
	 * @override
	 */
	FutureEventsCollection.fetchOrganizationsEvents = function(organization_id, data, success) {
		data.future = true;
		data.order_by = 'nearest_event_date';
		return EventsCollection.fetchOrganizationsEvents(organization_id, data, success);
	};
	
	return FutureEventsCollection;
}()));
/**
 * @requires Class.EventsCollection.js
 */
/**
 *
 * @class PastEventsCollection
 * @extends EventsCollection
 */
PastEventsCollection = extending(EventsCollection, (function() {
	/**
	 *
	 * @constructor
	 * @constructs PastEventsCollection
	 */
	function PastEventsCollection() {
		EventsCollection.call(this);
	}
	/**
	 *
	 * @override
	 */
	PastEventsCollection.fetchOrganizationsEvents = function(organization_id, data, success) {
		data.till = moment().format(__C.DATE_FORMAT);
		data.order_by = '-last_event_date';
		return EventsCollection.fetchOrganizationsEvents(organization_id, data, success);
	};
	
	return PastEventsCollection;
}()));
/**
 * @requires Class.EventsCollection.js
 */
/**
 *
 * @class RecommendedEventsCollection
 * @extends EventsCollection
 */
RecommendedEventsCollection = extending(EventsCollection, (function() {
	/**
	 *
	 * @constructor
	 * @constructs RecommendedEventsCollection
	 */
	function RecommendedEventsCollection() {
		EventsCollection.call(this);
	}
	/**
	 *
	 * @override
	 */
	RecommendedEventsCollection.fetchEvents = function(data, success) {
		data.future = true;
		data.order_by = '-rating';
		return EventsCollection.fetchRecommendedEvents(data, success);
	};
	
	return RecommendedEventsCollection;
}()));
/**
 * @requires Class.EventsCollection.js
 */
/**
 *
 * @class TimelineEventsCollection
 * @extends EventsCollection
 */
TimelineEventsCollection = extending(EventsCollection, (function() {
	/**
	 *
	 * @constructor
	 * @constructs TimelineEventsCollection
	 */
	function TimelineEventsCollection() {
		EventsCollection.call(this);
	}
	/**
	 *
	 * @override
	 */
	TimelineEventsCollection.fetchEvents = function(data, success) {
		data.future = true;
		return EventsCollection.fetchMyEvents(data, success);
	};
	
	return TimelineEventsCollection;
}()));
/**
 * @requires ../Class.OneEntity.js
 */
/**
 *
 * @class OneOrder
 * @extends OneEntity
 */
OneOrder = extending(OneEntity, (function() {
	/**
	 *
	 * @param {(string|number)} [event_id]
	 * @param {(string|number)} [uuid]
	 *
	 * @constructor
	 * @constructs
	 *
	 * @property {?(string|number)} uuid
	 * @property {?(string|number)} user_id
	 * @property {?string} order_content
	 * @property {?boolean} is_canceled
	 * @property {?number} status_id
	 * @property {?OneOrder.EXTENDED_ORDER_STATUSES} status_type_code
	 * @property {?TEXTS.TICKET_STATUSES} status_name
	 * @property {?number} created_at
	 * @property {?number} updated_at
	 * @property {?number} payed_at
	 * @property {?number} canceled_at
	 *
	 * @property {EventsTicketsCollection} tickets
	 * @property {OneUser} user
	 */
	function OneOrder(event_id, uuid) {
		var self = this;
		
		this.uuid = setDefaultValue(uuid, 0);
		this.event_id = setDefaultValue(event_id, 0);
		this.order_content = null;
		this.is_canceled = null;
		this.status_id = null;
		this.status_type_code = null;
		this.created_at = null;
		this.updated_at = null;
		this.payed_at = null;
		this.canceled_at = null;
		
		this.tickets = new EventsTicketsCollection();
		this.user_id = null;
		this.user = new OneUser();
		
		Object.defineProperty(this, 'status_name', {
			get: function() {
				for( var prop in OneOrder.EXTENDED_ORDER_STATUSES ) {
					if( OneOrder.EXTENDED_ORDER_STATUSES.hasOwnProperty(prop) && OneOrder.EXTENDED_ORDER_STATUSES[ prop ] === self.status_type_code )
						return __LOCALES.ru_RU.TEXTS.TICKET_STATUSES[ prop ];
				}
			}
		});
	}
	
	/**
	 *
	 * @enum {string}
	 */
	OneOrder.ORDER_STATUSES = {
		WAITING_FOR_PAYMENT: 'waiting_for_payment',
		IS_PENDING: 'is_pending',
		
		APPROVED: 'approved',
		PAYED: 'payed',
		WITHOUT_PAYMENT: 'without_payment',
		
		RETURNED_BY_ORGANIZATION: 'returned_by_organization',
		RETURNED_BY_CLIENT: 'returned_by_client',
		REJECTED: 'rejected'
	};
	/**
	 *
	 * @enum {string}
	 */
	OneOrder.EXTENDED_ORDER_STATUSES = $.extend({
		PAYMENT_CANCELED_AUTO: 'payment_canceled_auto',
		PAYMENT_CANCELED_BY_CLIENT: 'payment_canceled_by_client'
	}, OneOrder.ORDER_STATUSES);
	/**
	 *
	 * @param {(string|number)} event_id
	 * @param {(string|number)} uuid
	 * @param {(Fields|string)} [fields]
	 * @param {AJAXCallback} [success]
	 *
	 * @return {jqPromise}
	 */
	OneOrder.fetchOrder = function(event_id, uuid, fields, success) {
		return __APP.SERVER.getData('/api/v1/events/' + event_id + '/orders/' + uuid, {
			fields: fields
		}, success);
	};
	/**
	 *
	 * @param {(Fields|string)} [fields]
	 * @param {AJAXCallback} [success]
	 *
	 * @return {jqPromise}
	 */
	OneOrder.prototype.fetchOrder = function(fields, success) {
		var self = this;
		return OneOrder.fetchOrder(this.event_id, this.uuid, fields, function(data) {
			self.setData(data);
			if (success && typeof success == 'function') {
				success.call(self, data);
			}
		});
	};
	
	return OneOrder;
}()));
/**
 * @requires ../Class.EntitiesCollection.js
 * @requires Class.OneOrder.js
 */
/**
 *
 * @class OrdersCollection
 * @extends EntitiesCollection
 */
OrdersCollection = extending(EntitiesCollection, (function() {
	/**
	 *
	 * @param {(string|number)} [event_id=0]
	 *
	 * @constructor
	 * @constructs OrdersCollection
	 *
	 * @property {(string|number)} event_id
	 */
	function OrdersCollection(event_id) {
		EntitiesCollection.call(this);
		
		this.event_id = setDefaultValue(event_id, 0);
	}
	
	OrdersCollection.prototype.collection_of = OneOrder;
	/**
	 *
	 * @param {string} uuid
	 * @return {(OneOrder|undefined)}
	 */
	OrdersCollection.prototype.getByUUID = function(uuid) {
		var found = this.filter(function(element) {
			return element.uuid === uuid;
		});
		
		return found.shift();
	};
	
	/**
	 *
	 * @param {(string|number)} event_id
	 * @param {AJAXData} [ajax_data]
	 * @param {AJAXCallback} [success]
	 *
	 * @return {jqPromise}
	 */
	OrdersCollection.fetchOrders = function(event_id, ajax_data, success) {
		return __APP.SERVER.getData('/api/v1/events/' + event_id + '/orders', ajax_data, success);
	};
	/**
	 *
	 * @param {(Fields|string)} [fields]
	 * @param {number} [length]
	 * @param {(string|Array)} [order_by]
	 * @param {AJAXCallback} [success]
	 */
	OrdersCollection.prototype.fetchOrders = function(fields, length, order_by, success) {
		var self = this;
		
		return OrdersCollection.fetchOrders(this.event_id, {
			fields: fields || undefined,
			offset: this.length,
			length: length || undefined,
			order_by: order_by || undefined
		}, function(data) {
			self.setData(data);
			if (success && typeof success == 'function') {
				success.call(self, self.last_pushed);
			}
		});
	};
	
	return OrdersCollection;
}()));
/**
 * @requires ../Class.OneEntity.js
 */
/**
 * @typedef {object} Privilege
 * @property {number} role_id
 * @property {OneUser.ROLE} name
 */
/**
 *
 * @class OneOrganization
 * @extends OneEntity
 */
OneOrganization = extending(OneEntity, (function() {
	/**
	 *
	 * @param {(string|number)} [organization_id=0]
	 * @param {boolean} [is_loading_continuous]
	 * @constructor
	 * @constructs OneOrganization
	 *
	 * @property {number} id
	 * @property {?string} name
	 * @property {?string} short_name
	 * @property {?string} description
	 *
	 * @property {?string} img_url
	 * @property {?string} img_small_url
	 * @property {?string} img_medium_url
	 *
	 * @property {?string} background_img_url
	 * @property {?string} background_small_img_url
	 * @property {?string} background_medium_img_url
	 *
	 * @property {?number} type_id
	 * @property {?string} type_name
	 *
	 * @property {?string} site_url
	 * @property {?string} default_address
	 * @property {EventsCollection} events
	 *
	 * @property {?number} subscription_id
	 * @property {?boolean} is_subscribed
	 * @property {?number} subscribed_count
	 * @property {UsersCollection} subscribed
	 *
	 * @property {Array<Privilege>} privileges
	 * @property {?string} role
	 * @property {TariffModel} tariff
	 *
	 * @property {UsersCollection} staff
	 * @property {Array<OneUser>} admins
	 * @property {Array<OneUser>} moderators
	 *
	 * @property {?string} email
	 * @property {?boolean} is_new
	 * @property {?number} new_events_count
	 * @property {?number} actual_events_count
	 *
	 * @property {?boolean} is_private
	 * @property {?string} brand_color
	 * @property {?OneCity} city
	 * @property {?} country
	 *
	 * @property {?string} vk_url
	 * @property {?string} facebook_url
	 *
	 * @property {?boolean} status
	 *
	 * @property {boolean} loading
	 */
	function OneOrganization(organization_id, is_loading_continuous) {
		var self = this;
		
		this.id = organization_id || 0;
		this.name = null;
		this.short_name = null;
		this.description = null;
		this.img_url = null;
		this.img_small_url = null;
		this.img_medium_url = null;
		this.background_img_url = null;
		this.background_small_img_url = null;
		this.background_medium_img_url = null;
		this.type_id = null;
		this.type_name = null;
		this.site_url = null;
		this.default_address = null;
		this.events = new EventsCollection();
		
		this.subscription_id = null;
		this.is_subscribed = null;
		this.subscribed_count = null;
		this.subscribed = new UsersCollection();
		this.privileges = [];
		
		this.is_private = null;
		this.brand_color = null;
		this.tariff = new TariffModel();
		this.city = new OneCity();
		this.country = null;
		
		this.email = null;
		this.staff = new UsersCollection();
		this.status = null;
		
		this.is_new = null;
		this.new_events_count = null;
		this.actual_events_count = null;
		
		this.vk_url = null;
		this.facebook_url = null;
		
		Object.defineProperties(this, {
			'role': {
				get: function() {
					return OneUser.recognizeRole(self.privileges);
				}
			},
			'admins': {
				get: function() {
					return self.staff.getSpecificStaff(OneUser.ROLE.ADMIN);
				}
			},
			'moderators': {
				get: function() {
					return self.staff.getSpecificStaff(OneUser.ROLE.MODERATOR);
				}
			}
		});
		
		this.loading = false;
		if (organization_id && is_loading_continuous) {
			this.loading = true;
			this.fetchOrganization([], function() {
				this.loading = false;
				$(window).trigger('fetch.OneOrganization');
			});
		}
	}
	/**
	 *
	 * @param {(string|number)} org_id
	 * @param {(Fields|string|Array)} [fields]
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	OneOrganization.fetchOrganization = function(org_id, fields, success) {
		return __APP.SERVER.getData('/api/v1/organizations/' + org_id, {fields: fields}, success);
	};
	/**
	 * @typedef {AJAXData} OneOrganizationCreateOrganizationData
	 * @property {string} [name]
	 * @property {string} [short_name]
	 * @property {string} [description]
	 * @property {string} [site_url]
	 * @property {string} [default_address]
	 * @property {string} [vk_url]
	 * @property {string} [facebook_url]
	 * @property {string} [type_id]
	 * @property {string} [background]
	 * @property {string} [logo]
	 * @property {string} [detail_info_url]
	 * @property {string} [email]
	 */
	/**
	 * @typedef {function({
 *   organization_id: number
 * })} OneOrganizationCreateOrganizationCallback
	 */
	/**
	 *
	 * @param {OrganizationModel} new_organization_data
	 * @param {OneOrganizationCreateOrganizationCallback} [success]
	 * @param {function} [error]
	 * @returns {jqPromise}
	 */
	OneOrganization.createOrganization = function(new_organization_data, success, error) {
		return __APP.SERVER.addData('/api/v1/organizations/', new_organization_data, true, success, error);
	};
	/**
	 *
	 * @param {(string|number)} organization_id
	 * @param {OrganizationModel} organization_data
	 * @param {OneOrganizationCreateOrganizationCallback} [success]
	 * @param {function} [error]
	 * @returns {jqPromise}
	 */
	OneOrganization.updateOrganization = function(organization_id, organization_data, success, error) {
		return __APP.SERVER.updateData('/api/v1/organizations/' + organization_id, organization_data, true, success, error);
	};
	/**
	 *
	 * @param {(string|number)} org_id
	 * @param {(string|number)} user_id
	 * @param {OneUser.ROLE} role
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	OneOrganization.addStaff = function(org_id, user_id, role, success) {
		return __APP.SERVER.addData('/api/v1/organizations/' + org_id + '/staff', {
			user_id: user_id,
			role: role
		}, false, success);
	};
	/**
	 *
	 * @param {(string|number)} org_id
	 * @param {(string|number)} user_id
	 * @param {OneUser.ROLE} role
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	OneOrganization.removeStaff = function(org_id, user_id, role, success) {
		return __APP.SERVER.deleteData('/api/v1/organizations/' + org_id + '/staff', {
			user_id: user_id,
			role: role
		}, success);
	};
	/**
	 *
	 * @param {(string|number)} org_id
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	OneOrganization.subscribeOrganization = function(org_id, success) {
		return __APP.SERVER.addData('/api/v1/organizations/' + org_id + '/subscriptions', {}, false, success);
	};
	/**
	 *
	 * @param {(string|number)} org_id
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	OneOrganization.unsubscribeOrganization = function(org_id, success) {
		return __APP.SERVER.deleteData('/api/v1/organizations/' + org_id + '/subscriptions', {}, success);
	};
	/**
	 *
	 * @param {(Fields|string|Array)} [fields]
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	OneOrganization.prototype.fetchOrganization = function(fields, success) {
		var self = this;
		return OneOrganization.fetchOrganization(self.id, fields, function(data) {
			self.setData(data);
			if (success && typeof success === 'function') {
				success.call(self, self);
			}
		});
	};
	/**
	 *
	 * @param {OrganizationModel} new_organization_data
	 * @param {OneOrganizationCreateOrganizationCallback} [success]
	 * @param {function} [error]
	 * @returns {jqPromise}
	 */
	OneOrganization.prototype.createOrganization = function(new_organization_data, success, error) {
		var self = this;
		return OneOrganization.createOrganization(new_organization_data, function(response_data) {
			self.setData(new_organization_data);
			self.id = response_data.organization_id;
			if (success && typeof success === 'function') {
				success.call(self, self);
			}
		}, error);
	};
	/**
	 *
	 * @param {OrganizationModel} organization_data
	 * @param {OneOrganizationCreateOrganizationCallback} [success]
	 * @param {function} [error]
	 * @returns {jqPromise}
	 */
	OneOrganization.prototype.updateOrganization = function(organization_data, success, error) {
		var self = this;
		return OneOrganization.updateOrganization(self.id, organization_data, function(response_data) {
			self.setData(organization_data);
			if (success && typeof success === 'function') {
				success.call(self, self);
			}
		}, error);
	};
	/**
	 *
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	OneOrganization.prototype.subscribe = function(success) {
		var self = this;
		return this.constructor.subscribeOrganization(this.id, function(data) {
			this.is_subscribed = true;
			this.subscribed_count++;
			if (success && typeof success == 'function') {
				success.call(self, data);
			}
		});
	};
	/**
	 *
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	OneOrganization.prototype.unsubscribe = function(success) {
		var self = this;
		return this.constructor.unsubscribeOrganization(this.id, function(data) {
			this.is_subscribed = false;
			this.subscribed_count = this.subscribed_count ? this.subscribed_count - 1 : this.subscribed_count;
			if (success && typeof success == 'function') {
				success.call(self, data);
			}
		});
	};
	/**
	 *
	 * @param {(string|number)} user_id
	 * @param {OneUser.ROLE} role
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	OneOrganization.prototype.addStaff = function(user_id, role, success) {
		var self = this,
			user = new OneUser(user_id);
		
		return __APP.SERVER.multipleAjax(OneOrganization.addStaff(this.id, user_id, role), user.fetchUser(new Fields())).done(function(org_data, user_data) {
			self.staff.setData(user);
			if (success && typeof success === 'function') {
				success.call(self, user);
			}
		}).promise();
	};
	/**
	 *
	 * @param {(string|number)} user_id
	 * @param {OneUser.ROLE} role
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	OneOrganization.prototype.removeStaff = function(user_id, role, success) {
		var self = this;
		
		return OneOrganization.removeStaff(this.id, user_id, role, function() {
			if (success && typeof success === 'function') {
				success.call(self, self.staff.remove(user_id));
			}
		});
	};
	
	return OneOrganization;
}()));
/**
 * @requires ../Class.EntitiesCollection.js
 * @requires Class.OneOrganization.js
 */
/**
 *
 * @class OrganizationsCollection
 * @extends EntitiesCollection
 */
OrganizationsCollection = extending(EntitiesCollection, (function() {
	/**
	 *
	 * @constructor
	 * @constructs OrganizationsCollection
	 */
	function OrganizationsCollection() {
		EntitiesCollection.call(this);
	}
	OrganizationsCollection.prototype.collection_of = OneOrganization;
	/**
	 *
	 * @param {AJAXData} data
	 * @param {AJAXCallback} [success]
	 */
	OrganizationsCollection.fetchSubscribedOrganizations = function(data, success) {
		return __APP.SERVER.getData('/api/v1/organizations/subscriptions', data, success);
	};
	/**
	 *
	 * @param {(string|Array)} [roles]
	 * @param {AJAXData} [data]
	 * @param {AJAXCallback} [success]
	 */
	OrganizationsCollection.fetchMyOrganizations = function(roles, data, success) {
		roles = Array.isArray(roles) ? roles.join(',') : roles;
		return __APP.SERVER.getData('/api/v1/organizations/', $.extend({}, data, {roles: roles}), success);
	};
	/**
	 *
	 * @param {AJAXData} data
	 * @param {AJAXCallback} [success]
	 */
	OrganizationsCollection.fetchRecommendations = function(data, success) {
		return __APP.SERVER.getData('/api/v1/organizations/recommendations', data, success);
	};
	/**
	 *
	 * @param {(Fields|Array|string)} [fields]
	 * @param {(number|string)} [length]
	 * @param {string} [order_by]
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	OrganizationsCollection.prototype.fetchSubscribedOrganizations = function(fields, length, order_by, success) {
		var self = this,
			ajax_data = {
				fields: fields,
				offset: this.length,
				length: length,
				order_by: order_by || undefined
			};
		return this.constructor.fetchSubscribedOrganizations(ajax_data, function(data) {
			self.setData(data);
			if (success && typeof success == 'function') {
				success.call(self, data);
			}
		});
	};
	/**
	 *
	 * @param {(Array<string>|string)} roles
	 * @param {(Fields|Array<string>|string)} [fields]
	 * @param {(number|string)} [length]
	 * @param {string} [order_by]
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	OrganizationsCollection.prototype.fetchMyOrganizations = function(roles, fields, length, order_by, success) {
		var self = this,
			ajax_data = {
				fields: fields,
				length: length,
				offset: this.length,
				order_by: order_by || undefined
			};
		
		return OrganizationsCollection.fetchMyOrganizations(roles, ajax_data, function(data) {
			self.setData(data);
			if (isFunction(success)) {
				success.call(self, self.last_pushed);
			}
		});
	};
	
	return OrganizationsCollection;
}()));
/**
 * @typedef {object} StatisticsUnit
 * @property {number} time_value
 * @property {number} value
 */
/**
 * @typedef {StatisticsUnit} StatisticsConversionUnit
 * @property {number} to
 * @property {number} with
 */
/**
 * @typedef {object} StatisticsAudience
 * @property {Array<{name: {string}, count: {number}}>} devices
 * @property {Array<{gender: {?string}, count: {number}}>} gender
 */
/**
 * @typedef {object} StatisticsStdData
 * @property {Statistics.SCALES} [scale]
 * @property {string} [since]
 * @property {string} [till]
 */
/**
 * @abstract
 * @class Statistics
 * @implements EntityInterface
 */
Statistics = (function() {
	/**
	 *
	 * @constructor
	 * @constructs Statistics
	 *
	 * @property {(number|string)} id
	 * @property {Statistics.ENTITIES} entity
	 * @property {Array<StatisticsUnit>} view
	 * @property {Array<StatisticsUnit>} fave
	 * @property {Array<StatisticsUnit>} unfave
	 * @property {Array<StatisticsUnit>} notifications_sent
	 * @property {Array<StatisticsUnit>} notifications_sent
	 * @property {Object} dynamics
	 * @property  {Array<StatisticsUnit>} dynamics.view
	 * @property  {Array<StatisticsUnit>} dynamics.fave
	 */
	function Statistics() {
		this.id = 0;
		this.entity = null;
		this.view = [];
		this.fave = [];
		this.unfave = [];
		this.notifications_sent = [];
		
		this.dynamics = {
			view: [],
			fave: []
		};
	}
	/**
	 *
	 * @param {(Array|object)} data
	 * @returns {Statistics}
	 */
	Statistics.prototype.setData = function(data) {
		return $.extend(true, this, (data instanceof Array) ? data[0] : data);
	};
	/**
	 * @const
	 * @enum {string}
	 */
	Statistics.SCALES = {
		MINUTE: 'minute',
		HOUR: 'hour',
		DAY: 'day',
		WEEK: 'week',
		MONTH: 'month',
		YEAR: 'year',
		OVERALL: 'overall'
	};
	/**
	 * @const
	 * @enum {string}
	 */
	Statistics.ENTITIES = {
		EVENT: 'events',
		ORGANIZATION: 'organizations'
	};
	/**
	 * @static
	 * @param {Statistics.ENTITIES} entity
	 * @param {(string|number)} id
	 * @param {Statistics.SCALES} scale
	 * @param {(string|object|boolean)} range
	 * @param {string} range.since
	 * @param {string} [range.till]
	 * @param {(Array<string>|object<string, StatisticsStdData>)} statistics_fields
	 * @param {?StatisticsStdData} [dynamics_ajax_data]
	 * @param {(Array<string>|string)} [dynamics_ajax_data.fields]
	 * @param {function} [success]
	 * @return {jqPromise}
	 */
	Statistics.fetchStatistics = function(entity, id, scale, range, statistics_fields, dynamics_ajax_data, success) {
		var data = {
			scale: scale,
			fields: []
		};
		if (statistics_fields instanceof Array) {
			data.fields = data.fields.concat(statistics_fields);
		} else {
			$.each(statistics_fields, function(field, options) {
				if (Object.getOwnPropertyNames(options).length) {
					data.fields.push(field + JSON.stringify(options));
				} else {
					data.fields.push(field);
				}
			});
		}
		if (dynamics_ajax_data) {
			data.fields.push('dynamics' + JSON.stringify(__APP.SERVER.validateData(dynamics_ajax_data)));
		}
		
		switch (typeof range) {
			case 'string': {
				if (range) data.since = range;
				break;
			}
			case 'object': {
				if (range.since) data.since = range.since;
				if (range.till) data.till = range.till;
				break;
			}
			default:
			case 'boolean': break;
		}
		
		return __APP.SERVER.getData('/api/v1/statistics/' + entity + '/' + id, data, success);
	};
	/**
	 *
	 * @param {Statistics.SCALES} scale
	 * @param {(string|object|boolean)} range
	 * @param {string} range.since
	 * @param {string} [range.till]
	 * @param {object<string, StatisticsStdData>} statistics_fields
	 * @param {?object} dynamics_ajax_data
	 * @param {Statistics.SCALES} [dynamics_ajax_data.scale]
	 * @param {string} [dynamics_ajax_data.since]
	 * @param {string} [dynamics_ajax_data.till]
	 * @param {function} [success]
	 * @return {jqPromise}
	 */
	Statistics.prototype.fetchStatistics = function(scale, range, statistics_fields, dynamics_ajax_data, success) {
		var self = this;
		return Statistics.fetchStatistics(this.entity, this.id, scale, range, statistics_fields, dynamics_ajax_data, function(data) {
			self.setData(data);
			if (success && typeof success == 'function') {
				success.call(self, data);
			}
		});
	};
	
	return Statistics;
}());
/**
 * @requires Class.Statistics.js
 */
/**
 *
 * @class EventStatistics
 * @extends Statistics
 */
EventStatistics = extending(Statistics, (function() {
	/**
	 *
	 * @param {(string|number)} event_id
	 * @constructor
	 * @constructs EventStatistics
	 *
	 * @property {Array<StatisticsUnit>} open_site
	 * @property {Array<StatisticsUnit>} view_detail
	 * @property {Array<StatisticsConversionUnit>} open_conversion
	 * @property {Array<StatisticsConversionUnit>} fave_conversion
	 * @property {Object} dynamics
	 * @property  {Array<StatisticsConversionUnit>} dynamics.fave_conversion
	 * @property  {Array<StatisticsConversionUnit>} dynamics.open_conversion
	 */
	function EventStatistics(event_id) {
		Statistics.apply(this);
		
		this.id = event_id;
		this.entity = Statistics.ENTITIES.EVENT;
		
		this.open_site = [];
		this.view_detail = [];
		
		this.open_conversion = [];
		this.fave_conversion = [];
		this.dynamics.fave_conversion = [];
		this.dynamics.open_conversion = [];
	}
	
	return EventStatistics;
}()));
/**
 * @requires Class.Statistics.js
 */
/**
 *
 * @class OrganizationsStatistics
 * @extends Statistics
 */
OrganizationsStatistics = extending(Statistics, (function() {
	/**
	 *
	 * @param {(string|number)} organization_id
	 * @constructor
	 * @constructs OrganizationsStatistics
	 *
	 * @property {Array<StatisticsUnit>} subscribe
	 * @property {Array<StatisticsUnit>} unsubscribe
	 * @property {Array<StatisticsConversionUnit>} conversion
	 * @property {StatisticsAudience} audience
	 * @property {Object} dynamics
	 * @property  {Array<StatisticsUnit>} dynamics.subscribe
	 * @property  {Array<StatisticsConversionUnit>} dynamics.conversion
	 */
	function OrganizationsStatistics(organization_id) {
		Statistics.apply(this);
		
		this.id = organization_id;
		this.entity = Statistics.ENTITIES.ORGANIZATION;
		
		this.subscribe = [];
		this.unsubscribe = [];
		this.conversion = [];
		this.audience = {};
		
		this.dynamics.subscribe = [];
		this.dynamics.conversion = [];
	}
	
	return OrganizationsStatistics;
}()));
/**
 * @requires ../Class.OneEntity.js
 */
/**
 *
 * @class SearchResults
 * @extends OneEntity
 */
SearchResults = extending(OneEntity, (function() {
	/**
	 * @typedef {function({
 *   [events]: Array<OneEvent>,
 *   [organizations]: Array<OneOrganization>
 * })} SearchResultsAJAXCallback
	 */
	/**
	 *
	 * @param {string} query_string
	 * @constructor
	 * @constructs SearchResults
	 */
	function SearchResults(query_string) {
		this.query_string = query_string;
		this.events = new EventsCollection();
		this.organizations = new OrganizationsCollection();
	}
	/**
	 *
	 * @param {string} query_string
	 * @returns {{ [q]: {string}, [tags]: {string} }}
	 */
	SearchResults.sanitizeQueryVar = function(query_string) {
		var data = {};
		if (query_string.indexOf('#') === 0) {
			data.tags = query_string.replace('#', '');
		} else {
			data.q = query_string;
		}
		return data;
	};
	/**
	 *
	 * @param {string} query_string
	 * @param {AJAXData} [ajax_data]
	 * @param {SearchResultsAJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	SearchResults.fetchEventsAndOrganizations = function(query_string, ajax_data, success) {
		return __APP.SERVER.getData('/api/v1/search/', $.extend({}, SearchResults.sanitizeQueryVar(query_string), ajax_data), success);
	};
	/**
	 *
	 * @param {AJAXData} [events_ajax_data]
	 * @param {function(organizations: Array<OneEvent>)} [success]
	 * @returns {jqPromise}
	 */
	SearchResults.prototype.fetchEvents = function(events_ajax_data, success) {
		var self = this,
			ajax_data = {
				fields: 'events' + JSON.stringify($.extend({}, __APP.SERVER.validateData(events_ajax_data), {offset: this.events.length}))
			};
		
		return SearchResults.fetchEventsAndOrganizations(self.query_string, ajax_data, function(data) {
			self.setData(data);
			if (success && typeof success == 'function') {
				success.call(self, data.events);
			}
		});
	};
	/**
	 *
	 * @param {AJAXData} [organizations_ajax_data]
	 * @param {function(organizations: Array<OneOrganization>)} [success]
	 * @returns {jqPromise}
	 */
	SearchResults.prototype.fetchOrganizations = function(organizations_ajax_data, success) {
		var self = this,
			ajax_data = {
				fields: 'organizations' + JSON.stringify($.extend({}, __APP.SERVER.validateData(organizations_ajax_data), {offset: this.organizations.length}))
			};
		
		return SearchResults.fetchEventsAndOrganizations(self.query_string, ajax_data, function(data) {
			self.setData(data);
			if (success && typeof success == 'function') {
				success.call(self, data.organizations);
			}
		});
	};
	/**
	 *
	 * @param {AJAXData} [events_ajax_data]
	 * @param {AJAXData} [organizations_ajax_data]
	 * @param {SearchResultsAJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	SearchResults.prototype.fetchEventsAndOrganizations = function(events_ajax_data, organizations_ajax_data, success) {
		var self = this,
			ajax_data = {fields: new Fields()};
		
		if (events_ajax_data) {
			ajax_data.fields.push({
				events: $.extend({}, __APP.SERVER.validateData(events_ajax_data), {offset: this.events.length})
			});
		}
		if (organizations_ajax_data && !SearchResults.sanitizeQueryVar(self.query_string).tags) {
			ajax_data.fields.push({
				organizations: $.extend({}, __APP.SERVER.validateData(organizations_ajax_data), {offset: this.organizations.length})
			});
		}
		
		return SearchResults.fetchEventsAndOrganizations(self.query_string, ajax_data, function(data) {
			self.setData(data);
			if (success && typeof success == 'function') {
				success.call(self, data);
			}
		});
	};
	
	return SearchResults;
}()));
/**
 * @requires ../Class.OneEntity.js
 */
/**
 *
 * @class OneTag
 * @extends OneEntity
 */
OneTag = extending(OneEntity, function() {
	/**
	 *
	 * @param {(string|number)} [tag_id]
	 * @param {boolean} [is_loading_continuous]
	 * @constructor
	 * @constructs OneTag
	 */
	function OneTag(tag_id, is_loading_continuous) {
		this.id = tag_id ? tag_id : 0;
		this.name = '';
		
		if (tag_id && is_loading_continuous) {
			this.loading = true;
			this.fetchTag(function() {
				this.loading = false;
				$(window).trigger('fetch.OneTag');
			});
		}
	}
	/**
	 *
	 * @param {(string|number)} tag_id
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	OneTag.fetchTag = function(tag_id, success) {
		return __APP.SERVER.getData('/api/v1/tags/' + tag_id, {}, success);
	};
	/**
	 *
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	OneTag.prototype.fetchTag = function(success) {
		var self = this;
		return this.constructor.fetchTag(self.id, function(data) {
			self.setData(data[0]);
			if (success && typeof success == 'function') {
				success.call(self, data[0]);
			}
		});
	};
	
	return OneTag;
}());
/**
 * @requires ../Class.EntitiesCollection.js
 * @requires Class.OneTag.js
 */
/**
 * @typedef {AJAXData} TagsCollectionAJAXData
 * @property {string} name
 * @property {(string|number)} event_id
 * @property {string} used_since
 * @property {string} used_till
 */
/**
 *
 * @class TagsCollection
 * @extends EntitiesCollection
 */
TagsCollection = extending(EntitiesCollection, (function() {
	/**
	 *
	 * @constructor
	 * @constructs TagsCollection
	 */
	function TagsCollection() {
		EntitiesCollection.call(this);
	}
	
	TagsCollection.prototype.collection_of = OneTag;
	/**
	 *
	 * @param {AJAXData} data
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	TagsCollection.fetchTags = function(data, success) {
		return __APP.SERVER.getData('/api/v1/tags/', data, success);
	};
	/**
	 *
	 * @param {TagsCollectionAJAXData} data
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	TagsCollection.prototype.fetchTags = function(data, success) {
		var self = this;
		return this.constructor.fetchTags(data, function(data) {
			self.setData(data);
			if (success && typeof success == 'function') {
				success.call(self, data);
			}
		});
	};
	
	return TagsCollection;
}()));
/**
 * @requires ../Class.OneEntity.js
 */
/**
 *
 * @class OneTicket
 * @extends OneEntity
 */
OneTicket = extending(OneEntity, (function() {
	/**
	 *
	 * @param {(string|number)} [event_id]
	 * @param {(string|number)} [uuid]
	 *
	 * @constructor
	 * @constructs OneTicket
	 *
	 * @property {?(string|number)} uuid
	 * @property {?(string|number)} event_id
	 * @property {?(string|number)} user_id
	 * @property {?string} type_code
	 * @property {?string} ticket_type_uuid
	 * @property {?string} ticket_order_uuid
	 * @property {?boolean} status
	 * @property {?boolean} checkout
	 * @property {?(string|number)} price
	 * @property {?(string|number)} number
	 * @property {?timestamp} created_at
	 *
	 * @property {OneTicketType} ticket_type
	 * @property {OneOrder} order
	 * @property {OneUser} user
	 */
	function OneTicket(event_id, uuid) {
		this.uuid = setDefaultValue(uuid, 0);
		this.event_id = setDefaultValue(event_id, 0);
		this.user_id = null;
		this.type_code = null;
		this.ticket_type_uuid = null;
		this.ticket_order_uuid = null;
		this.status = null;
		this.checkout = null;
		this.price = null;
		this.number = null;
		this.ticket_type = new OneTicketType();
		this.order = new OneOrder();
		this.user = new OneUser();
		
		this.created_at = null;
	}
	
	/**
	 *
	 * @param {(string|number)} event_id
	 * @param {(string|number)} uuid
	 * @param {(Fields|string)} [fields]
	 * @param {AJAXCallback} [success]
	 *
	 * @return {jqPromise}
	 */
	OneTicket.fetchTicket = function(event_id, uuid, fields, success) {
		return __APP.SERVER.getData('/api/v1/events/' + event_id + '/tickets/' + uuid, {
			fields: fields
		}, success);
	};
	/**
	 *
	 * @param {(string|number)} event_id
	 * @param {(string|number)} uuid
	 * @param {AJAXCallback} [success]
	 * @return {jqPromise}
	 */
	OneTicket.check = function(event_id, uuid, success) {
		return __APP.SERVER.updateData('/api/v1/statistics/events/' + event_id + '/tickets/' + uuid, {
			checkout: true
		}, false, success);
	};
	/**
	 *
	 * @param {(string|number)} event_id
	 * @param {(string|number)} uuid
	 * @param {AJAXCallback} [success]
	 * @return {jqPromise}
	 */
	OneTicket.uncheck = function(event_id, uuid, success) {
		return __APP.SERVER.updateData('/api/v1/statistics/events/' + event_id + '/tickets/' + uuid, {
			checkout: false
		}, false, success);
	};
	/**
	 *
	 * @param {(Fields|string)} [fields]
	 * @param {AJAXCallback} [success]
	 *
	 * @return {jqPromise}
	 */
	OneTicket.prototype.fetchTicket = function(fields, success) {
		var self = this;
		
		return OneTicket.fetchTicket(this.event_id, this.uuid, fields, function(data) {
			self.setData(data);
			if (success && typeof success === 'function') {
				success.call(self, data);
			}
		});
	};
	/**
	 *
	 * @param {AJAXCallback} [success]
	 *
	 * @return {jqPromise}
	 */
	OneTicket.prototype.check = function(success) {
		var self = this;
		
		return OneTicket.check(this.event_id, this.uuid, function() {
			self.checkout = true;
			if (success && typeof success === 'function') {
				success.call(self, self);
			}
		});
	};
	/**
	 *
	 * @param {AJAXCallback} [success]
	 *
	 * @return {jqPromise}
	 */
	OneTicket.prototype.uncheck = function(success) {
		var self = this;
		
		return OneTicket.uncheck(this.event_id, this.uuid, function() {
			self.checkout = false;
			if (success && typeof success === 'function') {
				success.call(self, self);
			}
		});
	};
	
	return OneTicket;
}()));
/**
 * @requires ../ticket/Class.OneTicket.js
 * @requires ../order/Class.OneOrder.js
 */
/**
 * @class OneExtendedTicket
 * @extends OneTicket
 */
OneExtendedTicket = extending(OneTicket, (function() {
	/**
	 *
	 * @param {(string|number)} [event_id]
	 * @param {(string|number)} [uuid]
	 *
	 * @constructor
	 * @constructs OneExtendedTicket
	 *
	 * @property {?(string|number)} uuid
	 * @property {?(string|number)} event_id
	 * @property {?(string|number)} user_id
	 * @property {?string} type_code
	 * @property {?string} ticket_type_uuid
	 * @property {?string} ticket_order_uuid
	 * @property {?boolean} status
	 * @property {?TEXTS.TICKET_STATUSES} status_name
	 * @property {?OneExtendedTicket.TICKET_STATUSES} status_type_code
	 * @property {?boolean} checked_out
	 * @property {?(string|number)} price
	 * @property {?(string|number)} number
	 * @property {?timestamp} created_at
	 *
	 * @property {OneTicketType} ticket_type
	 * @property {OneOrder} order
	 * @property {OneUser} user
	 * @property {OneEvent} event
	 */
	function OneExtendedTicket(event_id, uuid) {
		var self = this;
		OneTicket.call(this, event_id, uuid);
		
		this.event = new OneEvent(event_id);
		
		Object.defineProperties(this, {
			status_name: {
				get: function() {
					for( var prop in OneExtendedTicket.TICKET_STATUSES ) {
						if( OneExtendedTicket.TICKET_STATUSES.hasOwnProperty(prop) && OneExtendedTicket.TICKET_STATUSES[ prop ] === self.order.status_type_code )
							return __LOCALES.ru_RU.TEXTS.TICKET_STATUSES[ prop ];
					}
					return '';
				}
			},
			status_type_code: {
				get: function() {
					return self.order.status_type_code;
				}
			}
		});
	}
	
	OneExtendedTicket.TICKET_STATUSES = $.extend({
		USED: 'used'
	}, OneOrder.EXTENDED_ORDER_STATUSES);
	/**
	 *
	 * @param {Array} data
	 * @return {Array}
	 */
	OneExtendedTicket.extractTicketFromData = function(data) {
		return data.map(function(event) {
			var ticket_data = event.tickets.length === 1 ? event.tickets.shift() : event.tickets,
				order_data = ticket_data.order,
				ticket_type_data = ticket_data.ticket_type;
			
			if (!order_data && event.orders) {
				order_data = event.orders.reduce(function(found_order, order) {
					return found_order ? found_order : (order.uuid === ticket_data.ticket_order_uuid ? order : false);
				}, false);
			}
			if (!ticket_type_data && event.ticket_types) {
				ticket_type_data = event.ticket_types.reduce(function(found_ticket_type, ticket_type) {
					return found_ticket_type ? found_ticket_type : (ticket_type.uuid === ticket_data.ticket_type_uuid ? ticket_type : false);
				}, false);
			}
			
			return $.extend(ticket_data, {
				event: event,
				order: order_data,
				ticket_type: ticket_type_data
			});
		});
	};
	/**
	 *
	 * @param {OneEvent} event
	 * @return {OneExtendedTicket}
	 */
	OneExtendedTicket.extractTicketFromEvent = function(event) {
		var _event = new OneEvent(),
			ticket = new OneExtendedTicket(event.id);
		
		_event.setData(event);
		ticket.setData($.extend(_event.tickets[0], {
			event: _event,
			event_id: _event.id,
			order: _event.orders.getByUUID(_event.tickets[0].ticket_order_uuid)
		}));
		
		return ticket;
	};
	/**
	 *
	 * @param {(string|number)} event_id
	 * @param {(string|number)} uuid
	 * @param {(Fields|string)} [fields]
	 * @param {AJAXCallback} [success]
	 *
	 * @return {jqPromise}
	 */
	OneExtendedTicket.fetchTicket = function(event_id, uuid, fields, success) {
		var event_ajax_data;
		
		fields = Fields.parseFields(fields);
		
		event_ajax_data = $.extend(true, {}, fields.pull('event'), {
			fields: new Fields({
				tickets: {
					filters: 'uuid=' + uuid,
					fields: fields
				}
			})
		});
		
		return __APP.SERVER.getData('/api/v1/events/' + event_id, event_ajax_data, success);
	};
	/**
	 *
	 * @param {(Fields|string)} [fields]
	 * @param {AJAXCallback} [success]
	 *
	 * @return {jqPromise}
	 */
	OneExtendedTicket.prototype.fetchTicket = function(fields, success) {
		var self = this;
		
		return OneExtendedTicket.fetchTicket(this.event_id, this.uuid, fields, function(data) {
			var ticket_data = OneExtendedTicket.extractTicketFromData(data);
			self.setData(ticket_data);
			if (success && typeof success === 'function') {
				success.call(self, ticket_data);
			}
		});
	};
	
	return OneExtendedTicket;
}()));
/**
 * @requires ../Class.EntitiesCollection.js
 * @requires Class.OneExtendedTicket.js
 */
/**
 *
 * @class ExtendedTicketsCollection
 * @extends EntitiesCollection
 */
ExtendedTicketsCollection = extending(EntitiesCollection, (function() {
	/**
	 *
	 * @constructor
	 * @constructs ExtendedTicketsCollection
	 */
	function ExtendedTicketsCollection() {
		EntitiesCollection.call(this);
	}
	
	ExtendedTicketsCollection.prototype.collection_of = OneExtendedTicket;
	/**
	 *
	 * @param {(Fields|Array|string|undefined)} [fields]
	 *
	 * @return {AJAXData}
	 */
	ExtendedTicketsCollection.convertTicketFieldsToEventAjaxData = function(fields) {
		fields = fields ? Fields.parseFields(fields) : new Fields();
		var events_ajax_data = {},
			events_fields;
		
		if (fields.has('event')) {
			events_ajax_data = fields.pull('event');
		}
		
		events_fields = new Fields({tickets: {fields: fields}});
		
		if (events_ajax_data.fields) {
			events_ajax_data.fields = Fields.parseFields(events_ajax_data.fields);
			events_ajax_data.fields.push(events_fields);
		} else {
			events_ajax_data.fields = events_fields;
		}
		
		return events_ajax_data;
	};
	/**
	 *
	 * @param {OneEvent} event
	 * @return {ExtendedTicketsCollection}
	 */
	ExtendedTicketsCollection.extractTicketsFromEvent = function(event) {
		var _event = new OneEvent(),
			tickets = new ExtendedTicketsCollection();
		
		_event.setData(event);
		tickets.setData(_event.tickets.map(function(ticket) {
			return $.extend({}, ticket, {
				event_id: _event.id,
				event: _event
			});
		}));
		
		return tickets;
	};
	
	
	return ExtendedTicketsCollection;
}()));
/**
 * @requires ../event/Class.OneEvent.js
 * @requires Class.ExtendedTicketsCollection.js
 */
/**
 *
 * @class EventsExtendedTicketsCollection
 * @extends ExtendedTicketsCollection
 */
EventsExtendedTicketsCollection = extending(ExtendedTicketsCollection, (function() {
	/**
	 *
	 * @param {(string|number)} [event_id]
	 *
	 * @constructor
	 * @constructs ExtendedTicketsCollection
	 *
	 * @property {(string|number)} event_id
	 */
	function EventsExtendedTicketsCollection(event_id) {
		ExtendedTicketsCollection.call(this);
		
		Object.defineProperty(this, 'event_id', {
			value: event_id
		});
	}
	
	/**
	 *
	 * @param {(string|number)} event_id
	 * @param {(Fields|string|Array)} [fields]
	 * @param {AJAXCallback} [success]
	 *
	 * @return {jqPromise}
	 */
	EventsExtendedTicketsCollection.fetchTickets = function(event_id, fields, success){
		
		return OneEvent.fetchEvent(event_id, ExtendedTicketsCollection.convertTicketFieldsToEventAjaxData(fields).fields, success);
	};
	/**
	 *
	 * @param {(Fields|string)} [fields]
	 * @param {number} [length]
	 * @param {(string|Array)} [order_by]
	 * @param {AJAXCallback} [success]
	 *
	 * @return {jqPromise}
	 */
	EventsExtendedTicketsCollection.prototype.fetchTickets = function(fields, length, order_by, success) {
		var self = this;
		
		return EventsExtendedTicketsCollection.fetchTickets(this.event_id, fields).then(function(data) {
			self.setData(ExtendedTicketsCollection.extractTicketsFromEvent(data));
			if (success && typeof success === 'function') {
				success.call(self, self.last_pushed);
			}
			return self.last_pushed;
		});
	};
	
	
	return EventsExtendedTicketsCollection;
}()));
/**
 * @requires Class.ExtendedTicketsCollection.js
 */
/**
 *
 * @class MyTicketsCollection
 * @extends ExtendedTicketsCollection
 */
MyTicketsCollection = extending(ExtendedTicketsCollection, (function() {
	/**
	 *
	 * @constructor
	 * @constructs MyTicketsCollection
	 */
	function MyTicketsCollection() {
		ExtendedTicketsCollection.call(this);
	}
	
	/**
	 *
	 * @param {AJAXData} [ajax_data]
	 * @param {AJAXCallback} [success]
	 *
	 * @return {jqPromise}
	 */
	MyTicketsCollection.fetchTickets = function(ajax_data, success) {
		ajax_data = ajax_data ? ajax_data : {};
		var events_ajax_data = ExtendedTicketsCollection.convertTicketFieldsToEventAjaxData(ajax_data.fields);
		
		return __APP.SERVER.getData('/api/v1/events', $.extend(events_ajax_data, {
			length: ajax_data.length,
			offset: ajax_data.offset,
			registered: true
		}), success);
	};
	/**
	 *
	 * @param {(Fields|string)} [fields]
	 * @param {number} [length]
	 * @param {(string|Array)} [order_by]
	 * @param {AJAXCallback} [success]
	 *
	 * @return {jqPromise}
	 */
	MyTicketsCollection.prototype.fetchTickets = function(fields, length, order_by, success) {
		var self = this;
		
		return MyTicketsCollection.fetchTickets({
			fields: fields || undefined,
			offset: this.length,
			length: length || undefined,
			order_by: order_by || undefined
		}).then(function(data) {
			self.setData(data.map(ExtendedTicketsCollection.extractTicketsFromEvent).reduce(function(collection, current){
				collection.push.apply(collection, current);
				
				return collection;
			}, []));
			
			if (success && typeof success === 'function') {
				success.call(self, self.last_pushed);
			}
			return self.last_pushed;
		});
	};
	
	return MyTicketsCollection;
}())); 
/**
 * @requires ../Class.EntitiesCollection.js
 * @requires Class.OneTicket.js
 */
/**
 *
 * @class EventsTicketsCollection
 * @extends EntitiesCollection
 */
EventsTicketsCollection = extending(EntitiesCollection, (function() {
	/**
	 *
	 * @param {(string|number)} [event_id=0]
	 *
	 * @constructor
	 * @constructs EventsTicketsCollection
	 *
	 * @property {(string|number)} event_id
	 */
	function EventsTicketsCollection(event_id) {
		EntitiesCollection.call(this);
		
		Object.defineProperty(this, 'event_id', {
			value: setDefaultValue(event_id, 0)
		});
	}
	
	EventsTicketsCollection.prototype.ID_PROP_NAME = 'uuid';
	EventsTicketsCollection.prototype.collection_of = OneTicket;
	
	/**
	 *
	 * @param {(string|number)} event_id
	 * @param {AJAXData} [ajax_data]
	 * @param {AJAXCallback} [success]
	 *
	 * @return {jqPromise}
	 */
	EventsTicketsCollection.fetchTickets = function(event_id, ajax_data, success) {
		return __APP.SERVER.getData('/api/v1/events/' + event_id + '/tickets', ajax_data, success);
	};
	/**
	 *
	 * @param {(Fields|string)} [fields]
	 * @param {number} [length]
	 * @param {(string|Array)} [order_by]
	 * @param {AJAXCallback} [success]
	 *
	 * @return {jqPromise}
	 */
	EventsTicketsCollection.prototype.fetchTickets = function(fields, length, order_by, success) {
		var self = this;
		
		return EventsTicketsCollection.fetchTickets(this.event_id, {
			fields: fields || undefined,
			offset: this.length,
			length: length || undefined,
			order_by: order_by || undefined
		}, function(data) {
			self.setData(data);
			if (success && typeof success == 'function') {
				success.call(self, self.last_pushed);
			}
		});
	};
	
	return EventsTicketsCollection;
}()));
/**
 * @requires Class.EventsTicketsCollection.js
 */
/**
 *
 * @class AdminEventsTicketsCollection
 * @extends EventsTicketsCollection
 */
AdminEventsTicketsCollection = extending(EventsTicketsCollection, (function() {
	/**
	 * @param {(string|number)} event_id
	 *
	 * @constructor
	 * @constructs AdminEventsTicketsCollection
	 */
	function AdminEventsTicketsCollection(event_id) {
		EventsTicketsCollection.call(this, event_id);
	}
	
	/**
	 *
	 * @param {(string|number)} event_id
	 * @param {AJAXData} [ajax_data]
	 * @param {AJAXCallback} [success]
	 *
	 * @return {jqPromise}
	 */
	AdminEventsTicketsCollection.fetchTickets = function(event_id, ajax_data, success) {
		ajax_data = ajax_data ? ajax_data : {};
		
		return __APP.SERVER.getData('/api/v1/statistics/events/'+event_id+'/tickets', ajax_data, success);
	};
	/**
	 *
	 * @param {(Fields|string)} [fields]
	 * @param {number} [length]
	 * @param {(string|Array)} [order_by]
	 * @param {AJAXCallback} [success]
	 *
	 * @return {jqPromise}
	 */
	AdminEventsTicketsCollection.prototype.fetchTickets = function(fields, length, order_by, success) {
		var self = this;
		
		return AdminEventsTicketsCollection.fetchTickets(this.event_id, {
			fields: fields || undefined,
			offset: this.length,
			length: length || undefined,
			order_by: order_by || undefined
		}, function(data) {
			self.setData(data);
			if (success && typeof success === 'function') {
				success.call(self, self.last_pushed);
			}
		});
	};
	
	return AdminEventsTicketsCollection;
}())); 
/**
 * @requires Class.AdminEventsTicketsCollection.js
 */
/**
 *
 * @class SearchAdminEventsTicketsCollection
 * @extends AdminEventsTicketsCollection
 */
SearchAdminEventsTicketsCollection = extending(AdminEventsTicketsCollection, (function() {
	/**
	 * @param {(string|number)} query_string
	 * @param {(string|number)} event_id
	 *
	 * @constructor
	 * @constructs SearchAdminEventsTicketsCollection
	 */
	function SearchAdminEventsTicketsCollection(query_string, event_id) {
		AdminEventsTicketsCollection.call(this, event_id);
		this.query_string = query_string;
	}
	
	/**
	 *
	 * @param {(string|number)} query_string
	 * @param {(string|number)} event_id
	 * @param {AJAXData} [ajax_data]
	 * @param {AJAXCallback} [success]
	 *
	 * @return {jqPromise}
	 */
	SearchAdminEventsTicketsCollection.fetchTickets = function(query_string, event_id, ajax_data, success) {
		ajax_data = ajax_data ? ajax_data : {};
		
		if ($.isNumeric(query_string)) {
			ajax_data.number = query_string;
		} else {
			ajax_data.user_name = query_string;
		}
		
		return AdminEventsTicketsCollection.fetchTickets(event_id, ajax_data, success);
	};
	/**
	 *
	 * @param {(Fields|string)} [fields]
	 * @param {number} [length]
	 * @param {(string|Array)} [order_by]
	 * @param {AJAXCallback} [success]
	 *
	 * @return {jqPromise}
	 */
	SearchAdminEventsTicketsCollection.prototype.fetchTickets = function(fields, length, order_by, success) {
		var self = this;
		
		return SearchAdminEventsTicketsCollection.fetchTickets(this.query_string, this.event_id, {
			fields: fields || undefined,
			offset: this.length,
			length: length || undefined,
			order_by: order_by || undefined
		}, function(data) {
			self.setData(data);
			if (success && typeof success === 'function') {
				success.call(self, self.last_pushed);
			}
		});
	};
	
	return SearchAdminEventsTicketsCollection;
}())); 
/**
 * @requires ../Class.OneEntity.js
 */
/**
 *
 * @class OneTicketType
 * @extends OneEntity
 */
OneTicketType = extending(OneEntity, (function() {
	/**
	 *
	 * @param {(string|number)} [event_id]
	 * @param {(string|number)} [uuid]
	 *
	 * @constructor
	 * @constructs OneTicketType
	 *
	 * @property {?(string|number)} uuid
	 * @property {?(string|number)} event_id
	 * @property {?string} type_code
	 * @property {?string} name
	 * @property {?string} comment
	 * @property {?number} price
	 * @property {?number} sell_start_date
	 * @property {?number} sell_end_date
	 * @property {?(string|number)} start_after_ticket_type_uuid
	 * @property {?number} amount
	 * @property {?number} min_count_per_user
	 * @property {?number} max_count_per_user
	 * @property {?number} promocode
	 * @property {?number} promocode_effort
	 */
	function OneTicketType(event_id, uuid) {
		this.uuid = setDefaultValue(uuid, 0);
		this.event_id = setDefaultValue(event_id, 0);
		this.type_code = null;
		this.name = null;
		this.comment = null;
		this.price = null;
		this.sell_start_date = null;
		this.sell_end_date = null;
		this.start_after_ticket_type_uuid = null;
		this.amount = null;
		this.min_count_per_user = null;
		this.max_count_per_user = null;
		this.promocode = null;
		this.promocode_effort = null;
	}
	
	/**
	 *
	 * @param {(string|number)} event_id
	 * @param {(string|number)} uuid
	 * @param {(Fields|string)} [fields]
	 * @param {AJAXCallback} [success]
	 *
	 * @return {jqPromise}
	 */
	OneTicketType.fetchTicketType = function(event_id, uuid, fields, success) {
		return __APP.SERVER.getData('/api/v1/events/' + event_id + '/ticket_types/' + uuid, {
			fields: fields
		}, success);
	};
	/**
	 *
	 * @param {(Fields|string)} [fields]
	 * @param {AJAXCallback} [success]
	 *
	 * @return {jqPromise}
	 */
	OneTicketType.prototype.fetchOrder = function(fields, success) {
		var self = this;
		
		return OneTicketType.fetchTicketType(this.event_id, this.uuid, fields, function(data) {
			self.setData(data);
			if (success && typeof success == 'function') {
				success.call(self, data);
			}
		});
	};
	
	return OneTicketType;
}()));
/**
 * @requires ../Class.EntitiesCollection.js
 * @requires Class.OneTicketType.js
 */
/**
 *
 * @class TicketTypesCollection
 * @extends EntitiesCollection
 */
TicketTypesCollection = extending(EntitiesCollection, (function() {
	/**
	 *
	 * @param {(string|number)} [event_id=0]
	 *
	 * @constructor
	 * @constructs TicketTypesCollection
	 *
	 * @property {(string|number)} event_id
	 */
	function TicketTypesCollection(event_id) {
		EntitiesCollection.call(this);
		
		this.event_id = setDefaultValue(event_id, 0);
	}
	
	TicketTypesCollection.prototype.collection_of = OneTicketType;
	
	/**
	 *
	 * @param {(string|number)} event_id
	 * @param {AJAXData} [ajax_data]
	 * @param {AJAXCallback} [success]
	 *
	 * @return {jqPromise}
	 */
	TicketTypesCollection.fetchTicketTypes = function(event_id, ajax_data, success) {
		return __APP.SERVER.getData('/api/v1/events/' + event_id + '/ticket_types', ajax_data, success);
	};
	/**
	 *
	 * @param {(Fields|string)} [fields]
	 * @param {number} [length]
	 * @param {(string|Array)} [order_by]
	 * @param {AJAXCallback} [success]
	 *
	 * @return {jqPromise}
	 */
	TicketTypesCollection.prototype.fetchTicketTypes = function(fields, length, order_by, success) {
		var self = this;
		
		return TicketTypesCollection.fetchTicketTypes(this.event_id, {
			fields: fields || undefined,
			offset: this.length,
			length: length || undefined,
			order_by: order_by || undefined
		}, function(data) {
			self.setData(data);
			if (success && typeof success == 'function') {
				success.call(self, self.last_pushed);
			}
		});
	};
	
	return TicketTypesCollection;
}()));
/**
 * @requires ../Class.OneEntity.js
 * @requires ../activity/Class.UsersActivitiesCollection.js
 */
/**
 * @class OneUser
 * @extends OneEntity
 */
OneUser = extending(OneEntity, (function() {
	/**
	 *
	 * @param {(string|number)} [user_id]
	 * @constructor
	 * @constructs OneUser
	 *
	 * @property {(number|string)} id
	 * @property {string} ?first_name
	 * @property {string} ?last_name
	 * @property {string} ?middle_name
	 * @property {string} ?full_name
	 * @property {OneUser.GENDER} ?gender
	 * @property {string} ?email
	 * @property {string} ?avatar_url
	 * @property {string} ?blurred_image_url
	 * @property {string} ?link
	 * @property {string} ?type
	 * @property {string} ?role
	 * @property {boolean} ?is_friend
	 * @property {boolean} ?is_editor
	 *
	 * @property {Array<OneUser.ACCOUNTS>} accounts
	 * @property {Object<OneUser.ACCOUNTS, string>} accounts_links
	 * @property {string} ?vk_uid
	 * @property {string} ?google_uid
	 * @property {string} ?facebook_uid
	 *
	 * @property {OrganizationsCollection} subscriptions
	 * @property {FavoredEventsCollection} favored
	 * @property {UsersActivitiesCollection} actions
	 */
	function OneUser(user_id) {
		var self = this;
		
		this.id = setDefaultValue(user_id, 0);
		this.first_name = null;
		this.last_name = null;
		this.middle_name = null;
		this.gender = null;
		this.email = null;
		this.avatar_url = null;
		this.blurred_image_url = null;
		this.link = null;
		this.type = null;
		this.role = null;
		this.is_friend = null;
		this.is_editor = null;
		
		this.accounts = [];
		this.accounts_links = {};
		this.vk_uid = null;
		this.google_uid = null;
		this.facebook_uid = null;
		
		this.subscriptions = new OrganizationsCollection();
		this.favored = new FavoredEventsCollection();
		this.actions = new UsersActivitiesCollection(user_id);
		
		Object.defineProperty(this, 'full_name', {
			enumerable: true,
			get: function() {
				return self.first_name + ' ' + self.last_name;
			}
		});
	}
	OneUser.prototype.subscriptions_fields = ['img_small_url', 'subscribed_count', 'new_events_count', 'actual_events_count'];
	Object.freeze(OneUser.prototype.subscriptions_fields);
	/**
	 * @const
	 * @enum {string}
	 */
	OneUser.ROLE = {
		UNAUTH: 'unauth',
		USER: 'user',
		MODERATOR: 'moderator',
		ADMIN: 'admin'
	};
	Object.freeze(OneUser.ROLE);
	/**
	 * @const
	 * @enum {string}
	 */
	OneUser.GENDER = {
		MALE: 'male',
		FEMALE: 'female',
		NEUTRAL: 'neutral'
	};
	Object.freeze(OneUser.GENDER);
	/**
	 * @const
	 * @enum {string}
	 */
	OneUser.ACCOUNTS = {
		VK: 'vk',
		GOOGLE: 'google',
		FACEBOOK: 'facebook'
	};
	Object.freeze(OneUser.ACCOUNTS);
	/**
	 *
	 * @param {(string|number)} user_id
	 * @param {(Fields|Array|string)} [fields]
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	OneUser.fetchUser = function(user_id, fields, success) {
		return __APP.SERVER.getData('/api/v1/users/' + user_id, {fields: fields}, success);
	};
	/**
	 *
	 * @param {(string|number)} user_id
	 * @param {AJAXData} [data]
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	OneUser.fetchFavored = function(user_id, data, success) {
		return __APP.SERVER.getData('/api/v1/users/' + user_id + '/favorites', data, success);
	};
	/**
	 *
	 * @param {(string|number)} user_id
	 * @param {AJAXData} [data]
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	OneUser.fetchSubscriptions = function(user_id, data, success) {
		return __APP.SERVER.getData('/api/v1/users/' + user_id + '/subscriptions', data, success);
	};
	/**
	 *
	 * @param {(string|number)} user_id
	 * @param {(Array|string)} [fields]
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	OneUser.fetchUserActivity = function(user_id, fields, success) {
		return UsersActivitiesCollection.fetch(user_id, {fields: fields}, success);
	};
	/**
	 * Returns highest role in privileges set
	 * @param {Array<Privilege>} privileges
	 * @returns {OneUser.ROLE}
	 */
	OneUser.recognizeRole = function(privileges) {
		var role = OneUser.ROLE.USER;
		privileges.forEach(function(privilege) {
			if (privilege.role_id == 1 || privilege.name == OneUser.ROLE.ADMIN)
				role = OneUser.ROLE.ADMIN;
			if ((privilege.role_id == 2 || privilege.name == OneUser.ROLE.MODERATOR) && role !== OneUser.ROLE.ADMIN)
				role = OneUser.ROLE.MODERATOR;
		});
		return role ? role : OneUser.ROLE.UNAUTH;
	};
	/**
	 *
	 * @param {(Fields|Array|string)} [fields]
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	OneUser.prototype.fetchUser = function(fields, success) {
		var self = this;
		fields = setDefaultValue(fields, []);
		
		return OneUser.fetchUser(self.id, fields, function(data) {
			data = data instanceof Array ? data[0] : data;
			self.setData(data);
			if (success && typeof success == 'function') {
				success.call(self, data);
			}
		});
	};
	/**
	 *
	 * @param {AJAXData} [data]
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	OneUser.prototype.fetchFavored = function(data, success) {
		var self = this;
		data.offset = this.favored.length;
		return OneUser.fetchFavored(self.id, data).done(function(favored) {
			self.favored.setData(favored);
			if (success && typeof success == 'function') {
				success.call(self, self.favored.last_pushed);
			}
		}).promise();
	};
	/**
	 *
	 * @param {AJAXData} [data]
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	OneUser.prototype.fetchSubscriptions = function(data, success) {
		var self = this;
		data.offset = this.subscriptions.length;
		return OneUser.fetchSubscriptions(self.id, data).done(function(subscriptions) {
			self.subscriptions.setData(subscriptions);
			if (success && typeof success == 'function') {
				success.call(self, self.subscriptions.last_pushed);
			}
		}).promise();
	};
	
	return OneUser;
}()));
/**
 * @requires Class.OneUser.js
 */
/**
 * @singleton
 * @class CurrentUser
 * @extends OneUser
 */
CurrentUser = extending(OneUser, (function() {
	/**
	 * @class FriendsActivitiesCollection
	 * @extends UsersActivitiesCollection
	 */
	var FriendsActivitiesCollection = extending(UsersActivitiesCollection, (function() {
		/**
		 *
		 * @constructs FriendsActivitiesCollection
		 */
		function FriendsActivitiesCollection() {}
		/**
		 *
		 * @param {AJAXData} data
		 * @param {AJAXCallback} [success]
		 * @returns {jqPromise}
		 */
		FriendsActivitiesCollection.fetch = function(data, success) {
			data = UsersActivitiesCollection.setDefaultData(data);
			data.fields = data.fields.merge(['user']);
			return __APP.SERVER.getData('/api/v1/users/feed', data, success);
		};
		
		return FriendsActivitiesCollection;
	}()));
	/**
	 *
	 * @constructor
	 * @constructs CurrentUser
	 *
	 * @property {(number|string)} id
	 * @property {string} ?first_name
	 * @property {string} ?last_name
	 * @property {string} ?middle_name
	 * @property {string} ?full_name
	 * @property {OneUser.GENDER} ?gender
	 * @property {string} ?avatar_url
	 * @property {string} ?blurred_image_url
	 * @property {string} ?link
	 * @property {string} ?type
	 * @property {string} ?role
	 * @property {string} ?email
	 * @property {boolean} ?is_friend
	 * @property {boolean} ?is_editor
	 *
	 * @property {Array<OneUser.ACCOUNTS>} accounts
	 * @property {Object<OneUser.ACCOUNTS, string>} accounts_links
	 * @property {string} ?vk_uid
	 * @property {string} ?google_uid
	 * @property {string} ?facebook_uid
	 *
	 * @property {OrganizationsCollection} subscriptions
	 * @property {FavoredEventsCollection} favored
	 * @property {UsersActivitiesCollection} actions
	 *
	 * @property {OneCity} selected_city
	 * @property {UsersCollection} friends
	 * @property {FriendsActivitiesCollection} friends_activities
	 */
	function CurrentUser() {
		if (typeof CurrentUser.instance === 'object') {
			return CurrentUser.instance;
		}
		OneUser.call(this, 'me');
		
		this.selected_city = new OneCity();
		this.friends = new UsersCollection();
		this.friends_activities = new FriendsActivitiesCollection();
		
		CurrentUser.instance = this;
	}
	/**
	 *
	 * @param {AJAXData} [data]
	 * @param {AJAXCallback} [success]
	 * @return {jqPromise}
	 */
	CurrentUser.fetchFriends = function(data, success){
		return __APP.SERVER.getData('/api/v1/users/friends', data, success);
	};
	/**
	 *
	 * @param {(Fields|Array|string)} [fields]
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	CurrentUser.prototype.fetchUser = function(fields, success) {
		var self = this,
			promise = OneUser.fetchUser('me', fields),
			afterAjax = function(data) {
				data = data instanceof Array ? data[0] : data;
				self.setData(data);
				if (success && typeof success == 'function') {
					success.call(self, data);
				}
			};
		fields = setDefaultValue(fields, []);
		
		if(fields.hasOwnProperty('friends')) {
			return __APP.SERVER.multipleAjax(promise, this.fetchFriends(fields.friends)).done(function(user_data, friends_data) {
				user_data = user_data instanceof Array ? user_data[0] : user_data;
				user_data.friends = friends_data;
				afterAjax(user_data);
			}).promise();
		}
		return promise.done(afterAjax).promise();
	};
	/**
	 *
	 * @param {AJAXData} [ajax_data]
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	CurrentUser.prototype.fetchFriends = function(ajax_data, success) {
		var self = this;
		ajax_data = $.extend(ajax_data, {
			offset: self.friends.length
		});
		return CurrentUser.fetchFriends(ajax_data, function(data) {
			self.friends.setData(data);
			if (success && typeof success == 'function') {
				success.call(self, self.friends.last_pushed);
			}
		});
	};
	/**
	 *
	 * @returns {jqPromise}
	 */
	CurrentUser.prototype.logout = function() {
		return $.ajax({
			url: '/index.php',
			data: {logout: true},
			complete: function() {
				window.location = '/';
			}
		});
	};
	/**
	 *
	 * @return {boolean}
	 */
	CurrentUser.prototype.isLoggedOut = function() {
		return this.id === -1;
	};
	/**
	 *
	 * @param {(number|string)} [organization_id]
	 * @param {AJAXCallback} [success]
	 * @returns {(jqPromise|null)}
	 */
	CurrentUser.prototype.subscribeToOrganization = function(organization_id, success) {
		var self = this;
		if (!self.subscriptions.has(organization_id)) {
			OneOrganization.fetchOrganization(organization_id, self.subscriptions_fields, function(organization) {
				self.subscriptions.push(organization[0]);
				if (success && typeof success == 'function') {
					success.call(self, organization);
				}
			});
			return OneOrganization.subscribeOrganization(organization_id);
		} else {
			console.warn('Current user is already subscribed to this organization');
			return null;
		}
	};
	/**
	 *
	 * @param {(number|string)} [organization_id]
	 * @param {AJAXCallback} [success]
	 * @returns {(jqPromise|null)}
	 */
	CurrentUser.prototype.unsubscribeFromOrganization = function(organization_id, success) {
		var self = this;
		if (self.subscriptions.has(organization_id)) {
			return OneOrganization.unsubscribeOrganization(organization_id, function() {
				self.subscriptions.remove(organization_id);
				if (success && typeof success == 'function') {
					success.call(self, organization_id);
				}
			});
		} else {
			console.warn('Current user isn`t subscribed to this organization');
			return null;
		}
	};
	
	return CurrentUser;
}()));
/**
 * @requires ../Class.EntitiesCollection.js
 * @requires Class.OneUser.js
 */
/**
 * @typedef {AJAXData} UsersCollectionAJAXData
 * @property {string} [first_name]
 * @property {string} [last_name]
 * @property {string} [name]
 */
/**
 *
 * @class UsersCollection
 * @extends EntitiesCollection
 */
UsersCollection = extending(EntitiesCollection, (function() {
	/**
	 *
	 * @constructor
	 * @constructs UsersCollection
	 */
	function UsersCollection() {
		EntitiesCollection.call(this);
	}
	UsersCollection.prototype.collection_of = OneUser;
	/**
	 * Returns specified staff by role. Mixing additional_fields if needed.
	 * @param {OneUser.ROLE} role
	 * @param {(Array<OneUser>|UsersCollection)} staff
	 * @return {Array<OneUser>}
	 */
	UsersCollection.getSpecificStaff = function(role, staff) {
		
		return staff.filter(function(man) {
			return man.role === role;
		});
	};
	/**
	 *
	 * @param {UsersCollectionAJAXData} data
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	UsersCollection.fetchUsers = function(data, success) {
		return __APP.SERVER.getData('/api/v1/users/', data, success);
	};
	/**
	 *
	 * @param {(string|number)} event_id
	 * @param {UsersCollectionAJAXData} ajax_data
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	UsersCollection.fetchEventFavorites = function(event_id, ajax_data, success) {
		return __APP.SERVER.getData('/api/v1/events/' + event_id, {fields: 'favored'.appendAjaxData(__APP.SERVER.validateData(ajax_data))}, function(data) {
			if (ajax_data.length && ajax_data.offset) {
				ajax_data.offset += ajax_data.length;
			}
			if (success && typeof success == 'function') {
				success(data[0].favored);
			}
		});
	};
	/**
	 *
	 * @param {(string|number)} org_id
	 * @param {UsersCollectionAJAXData} ajax_data
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	UsersCollection.fetchOrganizationSubscribers = function(org_id, ajax_data, success) {
		return __APP.SERVER.getData('/api/v1/organizations/' + org_id, {fields: 'subscribed'.appendAjaxData(__APP.SERVER.validateData(ajax_data))}, function(data) {
			if (ajax_data.length && ajax_data.offset) {
				ajax_data.offset += ajax_data.length;
			}
			if (success && typeof success == 'function') {
				success(data[0].subscribed);
			}
		});
	};
	/**
	 *
	 * @param {(string|number)} org_id
	 * @param {UsersCollectionAJAXData} ajax_data
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	UsersCollection.fetchOrganizationStaff = function(org_id, ajax_data, success) {
		return __APP.SERVER.getData('/api/v1/organizations/' + org_id + '/staff/', ajax_data, success);
	};
	/**
	 * Returns specified staff by role. Mixing additional_fields if needed.
	 * @param {OneUser.ROLE} role
	 * @return {Array<OneUser>}
	 */
	UsersCollection.prototype.getSpecificStaff = function(role) {
		
		return UsersCollection.getSpecificStaff(role, this);
	};
	/**
	 *
	 * @param {UsersCollectionAJAXData} [data]
	 * @param {(number|string)} [length]
	 * @param {AJAXCallback} [success]
	 * @this Array<OneUser>
	 * @returns {jqPromise}
	 */
	UsersCollection.prototype.fetchUsers = function(data, length, success) {
		var self = this,
			ajax_data = $.extend(data, {
				offset: this.length,
				length: length
			});
		return UsersCollection.fetchUsers(ajax_data, function(data) {
			self.setData(data);
			if (success && typeof success == 'function') {
				success.call(self, data);
			}
		});
	};
	/**
	 *
	 * @param {(string|number)} event_id
	 * @param {(number|string)} length
	 * @param {UsersCollectionAJAXData} [data]
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	UsersCollection.prototype.fetchEventFavorites = function(event_id, length, data, success) {
		var self = this,
			ajax_data = $.extend({}, data, {
				offset: this.length,
				length: length
			});
		return UsersCollection.fetchEventFavorites(event_id, ajax_data, function(data) {
			self.setData(data);
			if (success && typeof success == 'function') {
				success.call(self, data);
			}
		});
	};
	/**
	 *
	 * @param {(string|number)} org_id
	 * @param {(number|string)} length
	 * @param {UsersCollectionAJAXData} [data]
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	UsersCollection.prototype.fetchOrganizationSubscribers = function(org_id, length, data, success) {
		var self = this,
			ajax_data = $.extend({}, data, {
				offset: this.length,
				length: length
			});
		return this.constructor.fetchOrganizationSubscribers(org_id, ajax_data, function(data) {
			self.setData(data);
			if (success && typeof success == 'function') {
				success.call(self, data);
			}
		});
	};
	/**
	 *
	 * @param {(string|number)} org_id
	 * @param {(number|string)} length
	 * @param {UsersCollectionAJAXData} [data]
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	UsersCollection.prototype.fetchOrganizationStaff = function(org_id, length, data, success) {
		var self = this,
			ajax_data = $.extend({}, data, {
				offset: this.length,
				length: length
			});
		return UsersCollection.fetchOrganizationStaff(org_id, ajax_data, function(data) {
			self.setData(data);
			if (success && typeof success == 'function') {
				success.call(self, data);
			}
		});
	};
	
	return UsersCollection;
})());

/**
 * @requires Class.UsersCollection.js
 */
/**
 *
 * @class OrganizationSubscribersCollection
 * @extends UsersCollection
 */
OrganizationSubscribersCollection = extending(UsersCollection, (function() {
	/**
	 *
	 * @param {(number|string)} organization_id
	 *
	 * @constructor
	 * @constructs UsersCollection
	 */
	function OrganizationSubscribersCollection(organization_id) {
		UsersCollection.call(this);
		
		Object.defineProperty(this, 'organization_id', {
			value: organization_id
		});
	}
	
	/**
	 *
	 * @param {(string|number)} organization_id
	 * @param {UsersCollectionAJAXData} ajax_data
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	OrganizationSubscribersCollection.fetchSubscribers = function(organization_id, ajax_data, success) {
		ajax_data = ajax_data ? ajax_data : {};
		
		return __APP.SERVER.getData('/api/v1/organizations/' + organization_id, {fields: new Fields({subscribed: ajax_data})}, function(data) {
			if (isFunction(success)) {
				success(data[0].subscribed);
			}
		}).then(function(data) {
			
			return data[0].subscribed;
		});
	};
	/**
	 *
	 * @param {(Fields|Array<string>|string)} [fields]
	 * @param {(number|string)} [length]
	 * @param {(Array<string>|string)} [order_by]
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	OrganizationSubscribersCollection.prototype.fetchSubscribers = function(fields, length, order_by, success) {
		var self = this;
		
		return OrganizationSubscribersCollection.fetchSubscribers(this.organization_id, {
			fields: fields || undefined,
			offset: this.length || undefined,
			length: length || undefined,
			order_by: order_by || undefined
		}, function(subscribed) {
			
			self.setData(subscribed);
			if (isFunction(success)) {
				success.call(self, self.last_pushed);
			}
		}).then(function() {
			
			return self.last_pushed;
		});
	};
	/**
	 *
	 * @param {number} subscribed_count
	 * @param {(Fields|Array<string>|string)} [fields]
	 * @param {(Array<string>|string)} [order_by]
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	OrganizationSubscribersCollection.prototype.fetchAllSubscribers = function(subscribed_count, fields, order_by, success) {
		var self = this,
			subscribers = [],
			laps = Math.ceil(subscribed_count / 100);
		
		this.empty();
		
		return __APP.SERVER.multipleAjax.apply(__APP.SERVER, (new Array(laps)).fill(true).map(function(el, i) {
			
			return OrganizationSubscribersCollection.fetchSubscribers(self.organization_id, {
				fields: fields || undefined,
				offset: i * 100,
				order_by: order_by || undefined
			}).then(function(chunk) {
				
				subscribers = subscribers.concat(chunk);
				
				return chunk;
			});
		})).then(function() {
			self.setData(subscribers);
			
			if (isFunction(success)) {
				success.call(self, self.last_pushed);
			}
			
			return self.last_pushed;
		});
	};
	
	return OrganizationSubscribersCollection;
}()));
/**
 * @class Calendar
 */
Calendar = (function() {
	/**
	 *
	 * @param {(jQuery|Element|string)} $calendar
	 * @param {object} [options]
	 * @param   {object} [options.classes]
	 * @param     {string} [options.classes.wrapper_class = 'calendar_wrapper']
	 * @param     {string} [options.classes.header_class = 'calendar_header']
	 * @param     {string} [options.classes.prev_btn_class = 'calendar_prev_btn']
	 * @param     {string} [options.classes.next_btn_class = 'calendar_next_btn']
	 * @param     {string} [options.classes.month_name_class = 'calendar_month_name']
	 * @param     {string} [options.classes.table_class = 'calendar_month']
	 * @param     {string} [options.classes.thead_class = 'calendar_thead']
	 * @param     {string} [options.classes.tbody_class = 'calendar_tbody']
	 * @param     {string} [options.classes.tr_class = 'calendar_week']
	 * @param     {string} [options.classes.head_tr_class = 'calendar_weekdays_row']
	 * @param     {string} [options.classes.th_class = 'calendar_weekday']
	 * @param     {string} [options.classes.td_class = 'calendar_day']
	 * @param     {Array} [options.classes.td_additional_classes]
	 * @param     {string} [options.classes.td_disabled_class = '-disabled']
	 * @param     {string} [options.classes.table_cell_class = 'calendar_cell']
	 * @param     {string} [options.classes.today_class = 'today']
	 * @param   {object} [options.additional_dataset]
	 * @param   {string} [options.selection_type = Calendar.SELECTION_TYPES.SINGLE]
	 * @param   {boolean} [options.weekday_selection = false]
	 * @param   {boolean} [options.month_selection = false]
	 * @param   {boolean} [options.disable_selection = false]
	 * @param   {string} [options.min_date = false]
	 * @param   {string} [options.max_date = false]
	 * @param   {string} [options.locale = 'ru']
	 * @param   {object} [options.labels]
	 *
	 * @constructor
	 * @constructs Calendar
	 */
	function Calendar($calendar, options){
		this.options = {
			classes: {
				wrapper_class: 'calendar_wrapper',
				header_class: 'calendar_header',
				prev_btn_class: 'calendar_prev_btn',
				next_btn_class: 'calendar_next_btn',
				month_name_class: 'calendar_month_name',
				table_class: 'calendar_month',
				thead_class: 'calendar_thead',
				tbody_class: 'calendar_tbody',
				tr_class: 'calendar_week',
				head_tr_class: 'calendar_weekdays_row',
				th_class: 'calendar_weekday',
				td_class: 'calendar_day',
				td_additional_classes: [],
				td_disabled_class: '-disabled',
				table_cell_class: 'calendar_cell',
				today_class: 'today'
			},
			additional_dataset: {},
			selection_type: Calendar.SELECTION_TYPES.SINGLE,
			weekday_selection: false,
			month_selection: false,
			disable_selection: false,
			min_date: false,
			max_date: false,
			locale: 'ru',
			labels: {}
		};
		
		if ($calendar instanceof Element || typeof $calendar == "string") {
			$calendar = $($calendar);
			if($calendar.length === 0)
				throw new Error("Такого элемента не существует");
			else if($calendar.length > 1)
				throw new Error("Элементов с заданным аргументов найдено несколько");
		}
		if ($calendar instanceof jQuery) {
			$.extend(true, this.options, options, $calendar.data());
			if(this.options.min_date !== false && this.options.max_date !== false && moment(this.options.max_date).diff(this.options.min_date, 'days') <= 0){
				this.options.max_date = false;
			}
			if(this.options.weekday_selection === true || this.options.month_selection === true ) {
				this.options.selection_type = Calendar.SELECTION_TYPES.MULTI;
			}
			this.selected_days = [];
			this.selected_weeks = {};
			this.selected_months = [];
			this.last_action = '';
			this.last_selected_days = '';
			this.now_selected_day = '';
			this.prev_selected_day = '';
			this.formatted_days = {};
			this.$calendar = $calendar;
			this.current_month = moment(new Date());
			this._today = moment(new Date());
		} else {
			throw new TypeError("Аргумент должен быть экземпляром jQuery, элементом DOM, либо CSS селектором");
		}
	}
	
	Calendar.SELECTION_TYPES = {
		SINGLE: 'single',
		MULTI: 'multi'
	};
	
	Calendar.prototype.flush = function(){
		this.selected_days = [];
		this.selected_weeks = {};
		this.selected_months = [];
		this.last_action = '';
		this.last_selected_days = '';
		this.now_selected_day = '';
		this.prev_selected_day = '';
		this.formatted_days = {};
		this.destroyTable();
	};
	
	Calendar.prototype.setMonth = function(month, year){
		switch(month){
			case 'prev':{
				this.current_month = this.current_month.add(-1, 'months'); break;
			}
			case 'next':{
				this.current_month = this.current_month.add(1, 'months'); break;
			}
			case 'current':{
				this.current_month = moment(new Date()); break;
			}
			default: {
				this.current_month = year ? this.current_month.set({'year': year, 'month': month-1}) : this.current_month.month(month-1);
			}
		}
		this.renderTable();
		this.$calendar.trigger('month-changed');
		return this;
	};
	
	Calendar.prototype.destroyTable = function(){
		this.$calendar.find('.'+this.options.classes.th_class).removeClass(__C.CLASSES.ACTIVE).off('click');
		this.$calendar.find('.MonthName').removeClass(__C.CLASSES.ACTIVE).off('click');
		this.$calendar.find('.CalendarTableBody').remove();
		return this;
	};
	
	Calendar.prototype.setMonthName = function(){
		this.$calendar.find('.MonthName')
			.data('month', this.current_month.month())
			.text(this.current_month.format("MMMM YYYY").capitalize());
		return this;
	};
	
	Calendar.prototype.buildTable = function(){
		var $calendar_table = this.$calendar.find('.CalendarTable'),
			days_count = this.current_month.daysInMonth(),
			first_day_in_month = this.current_month.date(1).day(),
			last_day_in_month = this.current_month.date(days_count).day(),
			td_days = [],
			td_classes = [],
			this_day,
			this_moment,
			dataset = [];
		for(var name in this.options.additional_dataset){
			if(this.options.additional_dataset.hasOwnProperty(name)){
				dataset.push('data-'+name+'='+this.options.additional_dataset[name]);
			}
		}
		for(var day = 1; day <= days_count; day++){
			this.current_month.date(day);
			this_day = this.current_month.format(__C.DATE_FORMAT);
			this_moment = moment(this_day);
			
			td_classes = [
				this.options.classes.table_cell_class,
				this.options.classes.td_class,
				'Day_'+this_day,
				'DayOfWeek_'+this.current_month.day(),
				'DayOfMonth_'+this.current_month.month()
			].concat(this.options.classes.td_additional_classes);
			if((this.options.min_date !== false && !(this_moment.diff(this.options.min_date, 'd') >= 0) ) || (this.options.max_date !== false && !(this_moment.diff(this.options.max_date, 'd') <= 0)))
				td_classes.push(this.options.classes.td_disabled_class);
			if(this.current_month.format(__C.DATE_FORMAT) == this._today.format(__C.DATE_FORMAT))
				td_classes.push(this.options.classes.today_class);
			
			td_days.push(tmpl('calendar-div', {
				td_classes: td_classes.join(' '),
				number: this.current_month.date(),
				day_number: this.current_month.day(),
				date: this.current_month.format(__C.DATE_FORMAT),
				date_text: this.current_month.format('DD MMMM YYYY'),
				dataset: dataset.join(' ')
			}));
		}
		var curr_month_clone = this.current_month.clone();
		if (first_day_in_month != 1){
			curr_month_clone.add(-1, 'months');
			curr_month_clone.date(curr_month_clone.daysInMonth());
			do {
				this_day = curr_month_clone.format(__C.DATE_FORMAT);
				this_moment = moment(this_day);
				td_classes = [
					this.options.classes.table_cell_class,
					this.options.classes.td_class,
					'Day_'+this_day,
					'DayOfWeek_'+curr_month_clone.day(),
					'DayOfMonth_'+curr_month_clone.month(),
					'not_this_month'
				].concat(this.options.classes.td_additional_classes);
				if((this.options.min_date !== false && !(this_moment.diff(this.options.min_date, 'd') >= 0) ) || (this.options.max_date !== false && !(this_moment.diff(this.options.max_date, 'd') <= 0)))
					td_classes.push(this.options.classes.td_disabled_class);
				
				td_days.unshift(tmpl('calendar-div', {
					td_classes: td_classes.join(' '),
					number: curr_month_clone.date(),
					day_number: curr_month_clone.day(),
					date: curr_month_clone.format(__C.DATE_FORMAT),
					date_text: curr_month_clone.format('DD MMMM YYYY'),
					dataset: dataset.join(' ')
				}));
				curr_month_clone.add(-1, 'days');
			} while(curr_month_clone.day() != 0);
		}
		
		if (last_day_in_month != 0){
			curr_month_clone = this.current_month.clone();
			do {
				curr_month_clone.add(1, 'days');
				this_day = curr_month_clone.format(__C.DATE_FORMAT);
				this_moment = moment(this_day);
				td_classes = [
					this.options.classes.table_cell_class,
					this.options.classes.td_class,
					'Day_'+this_day,
					'DayOfWeek_'+curr_month_clone.day(),
					'DayOfMonth_'+curr_month_clone.month(),
					'not_this_month'
				].concat(this.options.classes.td_additional_classes);
				if((this.options.min_date !== false && !(this_moment.diff(this.options.min_date, 'd') >= 0) ) || (this.options.max_date !== false && !(this_moment.diff(this.options.max_date, 'd') <= 0)))
					td_classes.push(this.options.classes.td_disabled_class);
				
				td_days.push(tmpl('calendar-div', {
					td_classes: td_classes.join(' '),
					number: curr_month_clone.date(),
					day_number: curr_month_clone.day(),
					date: curr_month_clone.format(__C.DATE_FORMAT),
					date_text: curr_month_clone.format('DD MMMM YYYY'),
					dataset: dataset.join(' ')
				}));
			} while(curr_month_clone.day() != 0);
		}
		var $tbody = $('<tbody>').addClass('CalendarTableBody'),
			tds_in_tr = 0,
			trs_count = 0,
			$trs = [tmpl('calendar-row', {tr_class: this.options.classes.tr_class})];
		for(var i = 0; i < td_days.length; i++){
			if (tds_in_tr == 7 ){
				$trs.push(tmpl('calendar-row', {tr_class: this.options.classes.tr_class}));
				tds_in_tr = 0;
				trs_count++;
			}
			$trs[trs_count].append(td_days[i]);
			tds_in_tr++;
		}
		$trs.forEach(function(item){
			$tbody.append(item);
		});
		$calendar_table.append($tbody);
		return this;
	};
	
	Calendar.prototype.renderTable = function(){
		this
			.destroyTable()
			.buildTable()
			.activateSelectedDays()
			.setMonthName();
		
		if(!this.options.disable_selection){
			switch(this.options.selection_type){
				case Calendar.SELECTION_TYPES.MULTI: {
					this.bindDragSelection();
					break;
				}
				case Calendar.SELECTION_TYPES.SINGLE: {
					this.bindDaySelection();
					break;
				}
				default: {break;}
			}
			
			if(this.options.weekday_selection === true){
				this.bindWeekdaySelection();
			}
			if(this.options.month_selection === true){
				this.bindMonthSelection();
			}
		}
		
		return this;
	};
	
	Calendar.prototype.selectToday = function(){
		this.$calendar.find('.'+this.options.classes.td_class+'.'+this.options.classes.today_class).addClass(__C.CLASSES.ACTIVE);
		return this;
	};

//TODO: Make formated days
//TODO: Make range selection
	Calendar.prototype.formatDays = function(){
		var genitive_month_names = {
				'январь': 'января',
				'февраль': 'февраля',
				'март': 'марта',
				'апрель': 'апреля',
				'май': 'мая',
				'июнь': 'июня',
				'июль': 'июля',
				'август': 'августа',
				'сентябрь': 'сентября',
				'октябрь': 'октября',
				'ноябрь': 'ноября',
				'декабрь': 'декабря'
			},
			_date = moment(this.now_selected_day),
			month_num = _date.month(),
			month = _date.month(month_num),
			days_in_month = month.daysInMonth(),
			_day = month.date(1);
		
		if(typeof this.formatted_days[month_num] === 'undefined'){
			this.formatted_days[month_num] = {};
			this.formatted_days[month_num].selected_days = [];
			this.formatted_days[month_num].month_name = genitive_month_names[_date.format('MMMM')];
		}
		
		this.formatted_days[month_num].selected_days.push(_date.format(__C.DATE_FORMAT));
		this.formatted_days[month_num].text = '';
		
		while(days_in_month){
			console.log(this.formatted_days[month_num].selected_days);
			if(this.formatted_days[month_num].selected_days.indexOf(_day.format(__C.DATE_FORMAT)) !== -1){
				this.formatted_days[month_num].text += ''+_day.format('D');
			}
			_day = _day.add(1, 'd');
			days_in_month--;
		}
		console.log(this.formatted_days[month_num].text);
		
		return this;
	};
	
	Calendar.prototype.selectDays = function(days){
		var self = this;
		
		function select(day){
			//var $this_day = self.$calendar.find('.Day_'+day);
			
			
			switch(self.options.selection_type){
				case Calendar.SELECTION_TYPES.MULTI: {
					if(self.selected_days.indexOf(day) === -1){
						self.selected_days.push(day);
						self.selected_days.sort();
					}
					break;
				}
				default:
				case Calendar.SELECTION_TYPES.SINGLE: {
					self.$calendar.find('.'+self.options.classes.td_class+'.'+__C.CLASSES.ACTIVE).removeClass(__C.CLASSES.ACTIVE);
					self.selected_days = [day];
					break;
				}
			}
			
			//self.prev_selected_day = self.now_selected_day;
			//self.now_selected_day = $this_day.data('date');
			//this.formatDays();
			
			self.$calendar.find('.Day_'+day).addClass(__C.CLASSES.ACTIVE);
		}
		
		
		if(Array.isArray(days)){
			var removing_days = [];
			days.forEach(function(day){
				if((self.options.min_date !== false && !(moment(day).diff(self.options.min_date) >= 0) ) || (self.options.max_date !== false && !(moment(day).diff(self.options.max_date) <= 0))){
					removing_days.push(day);
				} else {
					select(day);
				}
			});
			removing_days.forEach(function(day) {
				days.splice(days.indexOf(day), 1)
			})
		} else {
			if((self.options.min_date !== false && !(moment(days).diff(self.options.min_date) >= 0) ) || (self.options.max_date !== false && !(moment(days).diff(self.options.max_date) <=0))){
				days = [];
			} else {
				select(days);
				days = [days];
			}
		}
		if(days.length){
			self.last_action = 'select';
			self.last_selected_days = days;
			self.$calendar.trigger('days-changed');
		}
		return this;
	};
	
	Calendar.prototype.deselectDays = function(days){ // 2012-12-21
		var self = this;
		
		function deselect(day){
			var $this_day = self.$calendar.find('.Day_'+day),
				$this_weekday = self.$calendar.find('.Week_'+$this_day.data('weekday')),
				$this_month_name = self.$calendar.find('.MonthName'),
				this_year = self.current_month.format('YYYY'),
				this_month_num = self.current_month.format('MM'),
				this_month = self.current_month.format('YYYY.MM'),
				this_weekday_pos;
			
			self.selected_days.splice(self.selected_days.indexOf(day), 1);
			self.selected_days.sort();
			
			if(self.selected_months.indexOf(this_month) !== -1){
				$this_month_name.removeClass(__C.CLASSES.ACTIVE);
				self.selected_months.splice(self.selected_months.indexOf(this_month), 1);
			}
			
			if(typeof self.selected_weeks[this_year] !== 'undefined'){
				if(typeof self.selected_weeks[this_year][this_month_num] !== 'undefined'){
					this_weekday_pos = self.selected_weeks[this_year][this_month_num].indexOf($this_day.data('weekday'));
					if(this_weekday_pos !== -1){
						$this_weekday.removeClass(__C.CLASSES.ACTIVE);
						self.selected_weeks[this_year][this_month_num].splice(this_weekday_pos, 1);
					}
				}
			}
			self.$calendar.find('.Day_'+day).removeClass(__C.CLASSES.ACTIVE);
		}
		
		if(this.options.selection_type === Calendar.SELECTION_TYPES.MULTI){
			if(Array.isArray(days)){
				days.forEach(function(day){
					deselect(day);
				});
			} else {
				deselect(days);
			}
			self.last_action = 'deselect';
			self.last_selected_days = days;
			self.$calendar.trigger('days-changed');
		}
		
		
		return this;
	};
	
	Calendar.prototype.selectWeek = function(week){ // 0..6
		var self = this,
			$this_weekday = self.$calendar.find('.Week_'+week),
			$this_weekday_days = self.$calendar.find('.DayOfWeek_'+week).not('.not_this_month'),
			this_year = self.current_month.format('YYYY'),
			this_month = self.current_month.format('MM'),
			this_weekday_pos,
			days = [];
		
		$this_weekday_days.each(function(i){
			days.push($this_weekday_days.eq(i).data('date'));
		});
		
		if(typeof self.selected_weeks[this_year] === 'undefined')
			self.selected_weeks[this_year] = {};
		if(typeof self.selected_weeks[this_year][this_month] === 'undefined')
			self.selected_weeks[this_year][this_month] = [];
		
		this_weekday_pos = self.selected_weeks[this_year][this_month].indexOf(week);
		
		if(this_weekday_pos === -1){
			$this_weekday.addClass(__C.CLASSES.ACTIVE);
			self.selectDays(days);
			self.selected_weeks[this_year][this_month].push(week)
		} else {
			$this_weekday.removeClass(__C.CLASSES.ACTIVE);
			self.deselectDays(days);
			self.selected_weeks[this_year][this_month].splice(this_weekday_pos, 1);
		}
		return this;
	};
	
	Calendar.prototype.selectMonth = function(month){ // 0..11
		var self = this,
			$this_month_name = self.$calendar.find('.MonthName'),
			$this_month_days = self.$calendar.find('.DayOfMonth_'+month),
			this_month = self.current_month.format('YYYY.MM'),
			this_month_pos = self.selected_months.indexOf(this_month),
			days = [];
		
		$this_month_days.each(function(i){
			days.push($this_month_days.eq(i).data('date'));
		});
		
		if(this_month_pos === -1){
			$this_month_name.addClass(__C.CLASSES.ACTIVE);
			self.selectDays(days);
			self.selected_months.push(this_month);
		} else {
			$this_month_name.removeClass(__C.CLASSES.ACTIVE);
			self.deselectDays(days);
			self.selected_months.splice(this_month_pos, 1);
		}
		return this;
	};
	
	Calendar.prototype.bindMonthArrows = function(){
		var self = this;
		this.$calendar.find('.NextMonth').off('click.NextMonth').on('click.NextMonth', function(){
			self.setMonth('next');
		});
		this.$calendar.find('.PrevMonth').off('click.PrevMonth').on('click.PrevMonth', function(){
			self.setMonth('prev');
		});
		return this;
	};
	
	Calendar.prototype.bindDaySelection = function(){
		var self = this,
			$days_in_month = self.$calendar.find('.'+this.options.classes.td_class),
			$active_days = $days_in_month.not('.'+this.options.classes.td_disabled_class);
		$days_in_month.off('click.bindDaySelection');
		$active_days.on('click.bindDaySelection', function(){
			if(self.options.selection_type === Calendar.SELECTION_TYPES.MULTI && $(this).hasClass(__C.CLASSES.ACTIVE)){
				self.deselectDays($(this).data('date'));
			} else {
				self.selectDays($(this).data('date'));
			}
		});
		return this;
	};
	
	Calendar.prototype.bindWeekdaySelection = function(){
		var self = this,
			$weekdays = self.$calendar.find('.'+this.options.classes.th_class);
		$weekdays.on('click', function(){
			self.selectWeek($(this).data('weekday'));
		});
		return this;
	};
	
	Calendar.prototype.bindMonthSelection = function(){
		var self = this,
			$this_month_name = self.$calendar.find('.MonthName');
		$this_month_name.on('click', function(){
			self.selectMonth($(this).data('month'));
		});
		return this;
	};
	
	Calendar.prototype.bindDragSelection = function(){
		var self = this;
		
		function selectDate($target){
			$target = $target.is('.'+self.options.classes.td_class) ? $target : $target.closest('.'+self.options.classes.td_class);
			if($target.not('.'+self.options.classes.td_disabled_class).length){
				if($target.hasClass(__C.CLASSES.ACTIVE)){
					self.deselectDays($target.data('date'));
				} else {
					self.selectDays($target.data('date'));
				}
			}
		}
		
		function disableDragSelection(){
			self.$calendar.find('.'+self.options.classes.td_class).off('mouseenter.DragSelection');
		}
		
		self.$calendar
			.off('mousedown.RangeSelection')
			.on('mousedown.RangeSelection', function(e){
				selectDate($(e.target));
				self.$calendar.find('.'+self.options.classes.td_class).not('.'+self.options.classes.td_disabled_class).on('mouseenter.DragSelection', function(e){
					e.preventDefault();
					selectDate($(e.target));
				});
			})
			.on('mouseup', disableDragSelection)
			.on('mouseleave', disableDragSelection);
		return this;
	};
	
	Calendar.prototype.activateSelectedDays = function(){
		var self = this,
			this_year = self.current_month.format('YYYY'),
			this_month_num = self.current_month.format('MM');
		
		self.selected_days.forEach(function(day){
			self.$calendar.find('.Day_'+day).addClass(__C.CLASSES.ACTIVE)
		});
		
		if(self.selected_months.indexOf(this_year + '.' + this_month_num) !== -1){
			self.$calendar.find('.MonthName').addClass(__C.CLASSES.ACTIVE);
		}
		if(typeof self.selected_weeks[this_year] !== 'undefined'){
			if(typeof self.selected_weeks[this_year][this_month_num] !== 'undefined'){
				self.selected_weeks[this_year][this_month_num].forEach(function(weekday) {
					self.$calendar.find('.Week_'+weekday).addClass(__C.CLASSES.ACTIVE);
				});
			}
		}
		return this;
	};
	
	Calendar.prototype.setDaysWithEvents = function(){
		var calendar = this,
			ajax_data = {
				since: calendar.current_month.startOf('month').format(__C.DATE_FORMAT),
				till: calendar.current_month.endOf('month').format(__C.DATE_FORMAT),
				length: 500,
				my: true,
				unique: true
			};
		calendar.$calendar.find('.feed_calendar_td').removeClass('Controller has_favorites').addClass(__C.CLASSES.DISABLED);
		DatesCollection.fetchDates(ajax_data, function(data) {
			data.forEach(function(day){
				var $tr = calendar.$calendar.find('.Day_' + moment.unix(day.event_date).format(__C.DATE_FORMAT));
				$tr
					.html(tmpl('link', {
						title: $tr.children().text(),
						classes: $tr.children().get(0).classList,
						page: '/feed/day/'+$tr.data('date')
					}))
					.addClass(day.favorites_count > 0 ? 'has_favorites' : '')
					.removeClass(__C.CLASSES.DISABLED);
			});
			calendar.bindDaySelection();
			bindPageLinks(calendar.$calendar);
		});
		return this;
	};
	
	Calendar.prototype.init = function(){
		this.$calendar.empty().append(tmpl('calendar', this.options.classes));
		if(this.options.weekday_selection){
			this.$calendar.addClass('-weekday_selection');
		}
		if(this.options.month_selection){
			this.$calendar.addClass('-month_selection');
		}
		this.$calendar.data('calendar', this);
		this.$calendar.data('instance', this);
		this.$calendar.data('days', this.selected_days);
		this.$calendar.data('options', this.options);
		this
			.bindMonthArrows()
			.renderTable();
		return this;
	};
	
	return Calendar;
}());
/**
 * @class DatePicker
 */
DatePicker = (function() {
	/**
	 *
	 * @param {(jQuery|Element|string)} $datepicker
	 * @param {object} [options]
	 * @constructor
	 * @construct DatePicker
	 */
	function DatePicker($datepicker, options){
		this.options = {
			classes: {
			},
			close_on_pick: true,
			min_date: false,
			max_date: false,
			labels: {}
		};
		
		if ($datepicker instanceof Element || typeof $datepicker == 'string') {
			$datepicker = $($datepicker);
			if($datepicker.length === 0)
				throw new Error('Такого элемента не существует');
			else if($datepicker.length > 1)
				throw new Error('Элементов с заданным аргументов найдено несколько');
		}
		if ($datepicker instanceof jQuery) {
			$.extend(true, this.options, options, $datepicker.data());
			this.$datepicker = $datepicker;
			this.$datepicker_modal = tmpl('datepicker', {});
			this.$input = $datepicker.is('input') ? $datepicker : $datepicker.find('input');
			this.calendar = new Calendar(this.$datepicker_modal.children('.DatePickerCalendar'), {
				min_date: this.options.min_date,
				max_date: this.options.max_date
			});
			this.prev_selected_day = (typeof this.options.selected_day !== 'undefined') ? this.options.selected_day : '';
			this.selected_day = (typeof this.options.selected_day !== 'undefined') ? this.options.selected_day : '';
			this.formated_selected_day = this.selected_day.toString().split('-').reverse().join('.');
		} else {
			throw new TypeError('Аргумент должен быть экземпляром jQuery, элементом DOM, либо CSS селектором');
		}
	}
	/**
	 *
	 * @return {DatePicker}
	 */
	DatePicker.prototype.init = function(){
		var self = this;
		this
			.bindOpener()
			.$datepicker.data('datepicker', this)
			.data('instance', this);
		this.$datepicker.addClass('-unselectable -Handled_DatePicker');
		
		this.calendar.init().$calendar.on('days-changed', function(){
			self.prev_selected_day = self.selected_day;
			self.selected_day = self.calendar.selected_days.toString();
			self.formated_selected_day = self.calendar.selected_days.toString().split('-').reverse().join('.');
			if(!self.$datepicker.is('input')){
				self.$datepicker.find('label').text(self.formated_selected_day);
			}
			self.$input.val(self.selected_day).trigger('change');
			
			if(self.options.close_on_pick){
				self.closeDialog();
			}
			self.$datepicker.trigger('date-picked');
		});
		
		return this;
	};
	/**
	 *
	 * @return {DatePicker}
	 */
	DatePicker.prototype.bindOpener = function(){
		var self = this;
		function open(){
			if(self.$input.is(':disabled')){
				self.$datepicker.one('click', open);
			} else {
				self.openDialog();
			}
		}
		this.$datepicker.one('click', open);
		return this;
	};
	/**
	 *
	 * @return {DatePicker}
	 */
	DatePicker.prototype.openDialog = function(){
		var datepicker_position = this.$datepicker.offset();
		
		$('body').append(this.$datepicker_modal);
		this.$datepicker_modal.css({
			top: datepicker_position.top + this.$datepicker.outerHeight() + 2,
			left: datepicker_position.left + this.$datepicker.width() - this.$datepicker_modal.width(),
			maxWidth: this.$datepicker.width()
		});
		this.calendar.renderTable();
		this.bindCloseDialog();
		return this;
	};
	/**
	 *
	 * @return {DatePicker}
	 */
	DatePicker.prototype.bindCloseDialog = function(){
		var self = this;
		
		$(document)
			.off('click.checkOnClick')
			.on('click.checkOnClick', function(e){
				var $this = $(e.target);
				if(($this.closest(self.$datepicker_modal).length === 0 && $this.closest(self.$datepicker).length === 0) || $this.closest('.SubmitDatePicker').length){
					self.closeDialog();
				}
			})
			.off('keydown.checkOnKeyDown')
			.on('keydown.checkOnKeyDown', function(e){
				if(e.keyCode === 9 || e.keyCode === 13 || e.keyCode === 27){
					self.closeDialog();
				}
			});
		
		//TODO: BUG. Click on another datepicker doesn't close current
		return this;
	};
	/**
	 *
	 * @return {DatePicker}
	 */
	DatePicker.prototype.closeDialog = function() {
		$(document).off('click.checkOnClick').off('keydown.checkOnKeyDown');
		this.$datepicker_modal.detach();
		this.calendar.flush();
		this.bindOpener();
		return this;
	};
	/**
	 *
	 * @return {DatePicker}
	 */
	DatePicker.prototype.destroy = function(){
		this.closeDialog().$datepicker.data('datepicker', '');
		return this;
	};
	
	return DatePicker;
}());
/**
 * @class ImgLoader
 */
ImgLoader = (function() {
	/**
	 *
	 * @constructor
	 * @construct ImgLoader
	 */
	function ImgLoader() {}
	
	/**
	 *
	 * @type {?jQuery}
	 */
	ImgLoader.current_load_context = null;
	/**
	 *
	 * @param {jQuery} [$parent]
	 */
	ImgLoader.init = function($parent) {
		$parent = $parent ? $parent : $('body');
		
		$parent.find('.ImgLoadWrap').each(function() {
			var $parent = $(this),
				$img_source = $parent.find('.ImgSrc'),
				$img_preview = $parent.find('.ImgPreview');
			
			
			$img_source.off('change.CroppedPreview').on('change.CroppedPreview', function() {
				$img_preview.attr('src', this.value);
			});
			
			if ($img_preview.attr('src')) {
				$parent.find('.CropperButton').removeClass(__C.CLASSES.HIDDEN);
			}
			
			$parent.find('.LoadImg').off('change.LoadImg').on('change.LoadImg', function(e) {
				var files = e.target.files,
					reader;
				
				if (files.length == 0)
					return false;
				
				for (var i = 0, file; file = files[i]; i++) {
					reader = new FileReader();
					reader.onload = (function(file) {
						return function(onload_event) {
							var data_url = onload_event.target.result;
							ImgLoader.handleImgUpload($parent, data_url, file.name);
						};
					})(file);
					reader.readAsDataURL(file);
				}
			});
			
			$parent.find('.LoadByURLButton').not('-Handled_LoadByURLButton').on('click.LoadByURL', function() {
				ImgLoader.current_load_context = $parent;
				socket.emit('image.getFromURL', $parent.find('.LoadByURLAddress').val());
				Pace.restart();
			}).addClass('-Handled_LoadByURLButton');
			
			$parent.find('.CropperButton').off('click.CallCropper').on('click.CallCropper', function() {
				ImgLoader.callImgCropper($parent,	$parent.data('src') ? $parent.data('src') : $img_source.val());
			});
			
		});
	};
	/**
	 * @param {jQuery} $context
	 * @param {string} source
	 * @return {CropperModal}
	 */
	ImgLoader.callImgCropper = function($context, source) {
		var $parent = $context.closest('.ImgLoadWrap'),
			$img_source = $parent.find('.ImgSrc'),
			cropper_modal = $parent.data('modal');
		
		if(cropper_modal && cropper_modal.image_src != source) {
			cropper_modal.destroy();
		}
		if(!cropper_modal || cropper_modal.image_src != source) {
			$parent.data('src', source);
			cropper_modal = new CropperModal(source, {
				'aspectRatio': eval($parent.data('aspect_ratio'))
			});
			$parent.data('modal', cropper_modal);
		}
		
		cropper_modal.show();
		
		cropper_modal.modal.on('crop', function(event, cropped_src) {
			$img_source.val(cropped_src).trigger('change');
		});
		
		return cropper_modal;
	};
	/**
	 *
	 * @param {jQuery} $context
	 * @param {string} source
	 * @param {string} filename
	 */
	ImgLoader.handleImgUpload = function($context, source, filename) {
		var $parent = $context.closest('.ImgLoadWrap');
		
		$parent.data('src', source);
		$parent.find('.FileName').val(filename);
		$parent.find('.CropperButton').removeClass(__C.CLASSES.HIDDEN);
		
		ImgLoader.callImgCropper($parent, source);
	};
	
	return ImgLoader;
}());
/**
 *
 * @class ProgressBar
 * @extends jQuery
 */
ProgressBar = extendingJQuery((function() {
	/**
	 *
	 * @param {object} data
	 * @param {number} [data.NUMBER]
	 * @param {number} [data.OVERALL]
	 * @param {number} [data.PERCENTAGE]
	 * @param {buildProps} [options]
	 *
	 * @constructor
	 * @constructs ProgressBar
	 */
	function ProgressBar(data, options) {
		var datas = {};
		
		Object.keys(ProgressBar.STRINGS).forEach(function(string) {
			if (data[string] != null) {
				datas[ProgressBar.STRINGS[string]] = data[string];
			}
		});
		jQuery.fn.init.call(this, tmpl('progress-bar', $.extend(true, Builder.normalizeBuildProps(options), {
			dataset: datas
		})));
		this.options = options;
		this.$strip = this.find('.ProgressBarComplete');
		
		this.data($.extend({
			instance: this
		}, options.dataset));
		
		if (data.NUMBER != null && data.OVERALL != null) {
			setWidth(this.$strip, (data.NUMBER / data.OVERALL) * 100);
		} else if (data.PERCENTAGE != null) {
			setWidth(this.$strip, data.PERCENTAGE);
		}
		
	}
	
	ProgressBar.STRINGS = {
		NUMBER: 'abs_number',
		OVERALL: 'abs_of',
		PERCENTAGE: 'percentage'
	};
	
	/**
	 *
	 * @param {jQuery} $obj
	 * @param {(string|number)} width
	 */
	function setWidth($obj, width) {
		$obj.width( Math.roundTo(width, 3) + ($.isNumeric(width) ? '%' : '') );
	}
	
	/**
	 *
	 * @param {(string|number)} number
	 */
	ProgressBar.prototype.set = function(number) {
		var data = this.data();
		
		if ($.isNumeric(number)) {
			this.attr('data-' + ProgressBar.STRINGS.NUMBER, number);
			this.data(ProgressBar.STRINGS.NUMBER, number);
			setWidth(this.$strip, (number / data[ProgressBar.STRINGS.OVERALL]) * 100);
		} else {
			if (data[ProgressBar.STRINGS.NUMBER] && data[ProgressBar.STRINGS.OVERALL]) {
				this.attr('data-' + ProgressBar.STRINGS.NUMBER, data[ProgressBar.STRINGS.NUMBER] = ((data[ProgressBar.STRINGS.OVERALL] * parseFloat(number) / 100) ));
				this.data(ProgressBar.STRINGS.NUMBER, data[ProgressBar.STRINGS.NUMBER]);
			} else {
				this.attr('data-' + ProgressBar.STRINGS.PERCENTAGE, data[ProgressBar.STRINGS.PERCENTAGE] = parseFloat(number));
				this.data(ProgressBar.STRINGS.PERCENTAGE, data[ProgressBar.STRINGS.PERCENTAGE]);
			}
			setWidth(this.$strip, number);
		}
	};
	/**
	 *
	 * @param {number} number
	 */
	ProgressBar.prototype.setMax = function(number) {
		var data = this.data();
		
		this.attr('data-' + ProgressBar.STRINGS.OVERALL, number);
		this.data(ProgressBar.STRINGS.OVERALL, number);
		setWidth(this.$strip, (data[ProgressBar.STRINGS.NUMBER] / number) * 100);
	};
	
	
	return ProgressBar;
}()));
/**
 *
 * @abstract
 * @class ActionButton
 * @extends jQuery
 */
ActionButton = extendingJQuery((function() {
	/**
	 *
	 * @constructor
	 * @constructs ActionButton
	 * @param {object} [options]
	 */
	function ActionButton(options) {
		options = options ? options : {};
		var self = this;
		
		this.options = $.extend(true, {
			classes: [],
			icons: null,
			colors: null,
			labels: null
		}, this.options, options);
				
		this.has_icon = options.hasOwnProperty('has_icon') ? !!options.has_icon : true;
		this.is_checked = !!options.is_checked;
		this.is_add_avatar = !!options.is_add_avatar;
		
		if (this.has_icon) {
			this.options.classes.push(this.icon_class);
		} else {
			this.options.icons = {};
		}
		
		this.options.icons = this.options.icons ? this.options.icons : {};
		this.options.colors = this.options.colors ? this.options.colors : {};
		this.options.labels = this.options.labels ? this.options.labels : {};
		
		this.classes = {};
		$.each(ActionButton.STATES, function(field, state_name) {
			self.classes[state_name] = []
				.concat(self.options.icons ? self.options.icons[state_name] : [])
				.concat(self.options.colors ? self.options.colors[state_name] : [])
				.join(' ');
		});
		
		jQuery.fn.init.call(this, __APP.BUILD.button(this.is_checked ? {
				classes: this.options.classes.concat(this.classes[ActionButton.STATES.CHECKED]).concat(this.checked_state_class ? this.checked_state_class  : []),
				title: this.options.labels[ActionButton.STATES.CHECKED]
			} : {
				classes: this.options.classes.concat(this.classes[ActionButton.STATES.UNCHECKED]),
				title: this.options.labels[ActionButton.STATES.UNCHECKED]
			}
		));
		
		this.data('instance', this);
		this.initiate();
	}
	/**
	 *
	 * @enum {string}
	 */
	ActionButton.STATES = {
		CHECKED: 'checked',
		UNCHECKED: 'unchecked',
		CHECKED_HOVER: 'checked_hover',
		UNCHECKED_HOVER: 'unchecked_hover'
	};
	
	/**
	 * @param {jQuery} $context
	 */
	function addAvatar($context) {
		var $wrapper = $context.closest('.'+__C.CLASSES.HOOKS.ADD_AVATAR.ANCESTOR),
			$collection = $wrapper.find('.'+__C.CLASSES.HOOKS.ADD_AVATAR.COLLECTION),
			$favored_count = $wrapper.find('.'+__C.CLASSES.HOOKS.ADD_AVATAR.QUANTITY),
			$avatars = $collection.find('.avatar'),
			amount = $avatars.length;
		
		if ($collection.data('max_amount') >= amount) {
			if ($collection.hasClass(__C.CLASSES.HOOKS.ADD_AVATAR.STATES.SHIFTED)) {
				$collection.removeClass(__C.CLASSES.HOOKS.ADD_AVATAR.STATES.SHIFTED);
				$collection.width(amount == 1 ? 0 : ($avatars.outerWidth() * (amount - 1)) - (6 * (amount - 2)));
			} else {
				$collection.addClass(__C.CLASSES.HOOKS.ADD_AVATAR.STATES.SHIFTED);
				$collection.width(($avatars.outerWidth() * amount) - (6 * (amount - 1)));
			}
		} else {
			if ($favored_count.length) {
				var current_count = parseInt($favored_count.text());
				if ($collection.hasClass(__C.CLASSES.HOOKS.ADD_AVATAR.STATES.SHIFTED)) {
					$favored_count.text(current_count - 1);
					if (current_count - 1 <= 0) {
						$favored_count.parent().addClass(__C.CLASSES.HOOKS.ADD_AVATAR.STATES.CAST);
					}
				} else {
					$favored_count.text(current_count + 1);
					$favored_count.parent().removeClass(__C.CLASSES.HOOKS.ADD_AVATAR.STATES.CAST);
				}
			}
			$collection.toggleClass(__C.CLASSES.HOOKS.ADD_AVATAR.STATES.SHIFT+' '+__C.CLASSES.HOOKS.ADD_AVATAR.STATES.SHIFTED);
		}
	}
	
	ActionButton.prototype.checked_state_class = '';
	ActionButton.prototype.icon_class = __C.CLASSES.ICON_CLASS;
	
	ActionButton.prototype.onClick = function() {};
	
	ActionButton.prototype.afterCheck = function() {
		var is_hovered = this.is(':hover');
		
		this.is_checked = true;
		this
			.removeClass(''.concat(this.classes[ActionButton.STATES.UNCHECKED_HOVER], ' ', this.classes[ActionButton.STATES.UNCHECKED]))
			.addClass(''.concat(this.classes[is_hovered ? ActionButton.STATES.CHECKED_HOVER : ActionButton.STATES.CHECKED], ' ', this.checked_state_class))
			.children('.'+__C.CLASSES.HOOKS.TEXT).text(this.options.labels[is_hovered ? ActionButton.STATES.CHECKED_HOVER : ActionButton.STATES.CHECKED]);
	};
	
	ActionButton.prototype.afterUncheck = function() {
		var is_hovered = this.is(':hover');
		
		this.is_checked = false;
		this
			.removeClass(''.concat(this.classes[ActionButton.STATES.CHECKED_HOVER], ' ', this.classes[ActionButton.STATES.CHECKED], ' ', this.checked_state_class))
			.addClass(''.concat(this.classes[is_hovered ? ActionButton.STATES.UNCHECKED_HOVER : ActionButton.STATES.UNCHECKED]))
			.children('.'+__C.CLASSES.HOOKS.TEXT).text(this.options.labels[is_hovered ? ActionButton.STATES.UNCHECKED_HOVER : ActionButton.STATES.UNCHECKED]);
	};
	
	
	ActionButton.prototype.initiate = function() {
		var self = this;
		
		this
			.on('mouseenter.HoverActionButton', function() {
				self
					.removeClass(self.classes[self.is_checked ? ActionButton.STATES.CHECKED : ActionButton.STATES.UNCHECKED])
					.addClass(self.classes[self.is_checked ? ActionButton.STATES.CHECKED_HOVER : ActionButton.STATES.UNCHECKED_HOVER]);
				self.children('.'+__C.CLASSES.HOOKS.TEXT).text(self.options.labels[self.is_checked ? ActionButton.STATES.CHECKED_HOVER : ActionButton.STATES.UNCHECKED_HOVER]);
			})
			
			.on('mouseleave.LeaveActionButton', function() {
				self
					.removeClass(self.classes[self.is_checked ? ActionButton.STATES.CHECKED_HOVER : ActionButton.STATES.UNCHECKED_HOVER])
					.addClass(self.classes[self.is_checked ? ActionButton.STATES.CHECKED : ActionButton.STATES.UNCHECKED]);
				self.children('.'+__C.CLASSES.HOOKS.TEXT).text(self.options.labels[self.is_checked ? ActionButton.STATES.CHECKED : ActionButton.STATES.UNCHECKED]);
			})
			
			.on('click.Action', function() {
				if(__APP.USER.isLoggedOut()){
					if (self instanceof SubscribeButton) {
						cookies.setItem('auth_command', 'subscribe_to');
						cookies.setItem('auth_entity_id', self.org_id);
						return (new AuthModal(location.origin + '/organization/' + self.org_id)).show();
					} else {
						if (self instanceof AddToFavoriteButton) {
							cookies.setItem('auth_command', 'add_to_favorite');
							cookies.setItem('auth_entity_id', self.event_id);
						} else {
							cookies.removeItem('auth_command');
							cookies.removeItem('auth_entity_id');
						}
						return (new AuthModal(location.origin + '/event/' + self.event_id)).show();
					}
				}
				self.onClick();
				
				if(self.is_add_avatar){
					addAvatar(self);
				}
				if (window.askToSubscribe instanceof Function) {
					window.askToSubscribe();
				}
			});
	};
	
	
	return ActionButton;
}()));
/**
 * @requires Class.ActionButton.js
 */
/**
 *
 * @class AddToFavoriteButton
 * @extends ActionButton
 */
AddToFavoriteButton = extending(ActionButton, (function() {
	/**
	 *
	 * @constructor
	 * @constructs AddToFavoriteButton
	 * @param {(number|string)} event_id
	 * @param {object} [options]
	 */
	function AddToFavoriteButton(event_id, options) {
		this.options = {
			labels: {
				checked: __LOCALES.ru_RU.TEXTS.BUTTON.FAVORED,
				unchecked: __LOCALES.ru_RU.TEXTS.BUTTON.ADD_FAVORITE,
				checked_hover: __LOCALES.ru_RU.TEXTS.BUTTON.REMOVE_FAVORITE,
				unchecked_hover: __LOCALES.ru_RU.TEXTS.BUTTON.ADD_FAVORITE
			},
			colors: {
				checked: __C.CLASSES.COLORS.ACCENT,
				unchecked: __C.CLASSES.COLORS.MARGINAL_ACCENT,
				checked_hover: __C.CLASSES.COLORS.ACCENT,
				unchecked_hover: __C.CLASSES.COLORS.MARGINAL_ACCENT
			},
			icons: {
				checked: __C.CLASSES.ICONS.STAR,
				unchecked: __C.CLASSES.ICONS.STAR_O,
				checked_hover: __C.CLASSES.ICONS.TIMES,
				unchecked_hover: __C.CLASSES.ICONS.STAR_O
			}
		};
		this.event_id = event_id;
		ActionButton.call(this, options);
	}
	
	AddToFavoriteButton.prototype.checked_state_class = '-Favored';
	
	AddToFavoriteButton.prototype.onClick = function() {
		var self = this;
		
		if (this.is_checked) {
			OneEvent.deleteFavored(this.event_id, function() {
				self.afterUncheck();
			});
		} else {
			OneEvent.addFavored(this.event_id, function() {
				self.afterCheck();
			});
		}
	};
	
	
	return AddToFavoriteButton;
}()));
/**
 * @requires Class.ActionButton.js
 */
/**
 *
 * @class RegisterButton
 * @extends ActionButton
 */
RegisterButton = extending(ActionButton, (function() {
	/**
	 *
	 * @param {OneEvent} event
	 * @param {object} [options]
	 * @constructor
	 * @constructs RegisterButton
	 *
	 * @property {OneEvent} event
	 * @property {(RegistrationModal|TicketsModal)} modal
	 */
	function RegisterButton(event, options) {
		this.options = {
			labels: {
				checked: 'Зарегистрирован',
				unchecked: 'Регистрация',
				checked_hover: 'Открыть билеты',
				unchecked_hover: 'Регистрация'
			},
			colors: {
				checked: __C.CLASSES.COLORS.ACCENT,
				unchecked: __C.CLASSES.COLORS.MARGINAL_ACCENT,
				checked_hover: __C.CLASSES.COLORS.ACCENT,
				unchecked_hover: __C.CLASSES.COLORS.MARGINAL_ACCENT
			},
			icons: {
				checked: __C.CLASSES.ICONS.CHECK,
				unchecked: __C.CLASSES.ICONS.PENCIL,
				checked_hover: __C.CLASSES.ICONS.TICKET,
				unchecked_hover: __C.CLASSES.ICONS.PENCIL
			}
		};
		this.event = event;
		this.modal = null;
		options.is_checked = event.is_registered;
		ActionButton.call(this, options);
	}
	
	RegisterButton.prototype.checked_state_class = '-Registered';
	
	RegisterButton.prototype.onClick = function() {
		var self = this,
			tickets_fields = ['created_at', 'number', 'ticket_type', 'order'],
			events_fields = ['dates', 'is_same_time', 'image_horizontal_medium_url', 'location'],
			ticket,
			promise;
		
		/**
		 *
		 * @param {RegistrationModal} modal
		 * @param {RegisterButton} button
		 */
		function showRegistrationModal(modal, button) {
			modal.show();
			modal.modal.one('registration:success', function() {
				modal.event.is_registered = true;
				button.afterCheck();
			});
		}
		
		if (!this.event.registration_available && !this.event.is_registered) {
			this.off('click.RippleEffect').addClass(__C.CLASSES.HOOKS.HANDLED + __C.CLASSES.HOOKS.RIPPLE);
			return false;
		}
		
		if (!this.event.is_registered) {
			if (this.modal && this.modal instanceof RegistrationModal) {
				showRegistrationModal(this.modal, this);
			} else if (this.event.registration_fields.length) {
				this.modal = new RegistrationModal(this.event);
				showRegistrationModal(this.modal, this)
			} else {
				this.event.fetchEvent(new Fields('registration_fields')).done(function() {
					self.modal = new RegistrationModal(self.event);
					showRegistrationModal(self.modal, self)
				});
			}
		} else {
			if (this.modal && this.modal instanceof TicketsModal) {
				this.modal.show();
			} else {
				if (this.event.tickets.length) {
					ticket = new EventsExtendedTicketsCollection(this.event.id);
					promise = ticket.fetchTickets(new Fields(tickets_fields, {
						event: {
							fields: new Fields(events_fields)
						}
					}));
				} else {
					promise = this.event.fetchEvent(new Fields(events_fields, {
						tickets: {
							fields: new Fields(tickets_fields)
						}
					})).done(function() {
						return ticket = ExtendedTicketsCollection.extractTicketsFromEvent(self.event);
					});
				}
				
				promise.done(function() {
					self.modal = new TicketsModal(ticket);
					self.modal.show();
				});
			}
		}
		
	};
	
	RegisterButton.prototype.initiate = function() {
		if (!this.event.registration_available && !this.event.is_registered) {
			this.attr('disabled', true);
		} else {
			ActionButton.prototype.initiate.call(this);
		}
	};
	
	
	return RegisterButton;
}()));

/**
 * @requires Class.ActionButton.js
 */
/**
 *
 * @class SubscribeButton
 * @extends ActionButton
 */
SubscribeButton = extending(ActionButton, (function() {
	/**
	 *
	 * @constructor
	 * @constructs SubscribeButton
	 * @param {(number|string)} org_id
	 * @param {object} [options]
	 */
	function SubscribeButton(org_id, options) {
		this.options = {
			labels: {
				checked: __LOCALES.ru_RU.TEXTS.BUTTON.SUBSCRIBED,
				unchecked: __LOCALES.ru_RU.TEXTS.BUTTON.ADD_SUBSCRIPTION,
				checked_hover: __LOCALES.ru_RU.TEXTS.BUTTON.REMOVE_SUBSCRIPTION,
				unchecked_hover: __LOCALES.ru_RU.TEXTS.BUTTON.ADD_SUBSCRIPTION
			},
			colors: {
				checked: __C.CLASSES.COLORS.ACCENT,
				unchecked: __C.CLASSES.COLORS.NEUTRAL_ACCENT,
				checked_hover: __C.CLASSES.COLORS.ACCENT,
				unchecked_hover: __C.CLASSES.COLORS.NEUTRAL_ACCENT
			},
			icons: {
				checked: __C.CLASSES.ICONS.CHECK,
				unchecked: __C.CLASSES.ICONS.PLUS,
				checked_hover: __C.CLASSES.ICONS.TIMES,
				unchecked_hover: __C.CLASSES.ICONS.PLUS
			}
		};
		this.org_id = org_id;
		ActionButton.call(this, options);
	}
	
	SubscribeButton.prototype.checked_state_class = '-Subscribed';
	
	SubscribeButton.prototype.onClick = function() {
		var self = this;
		if (self.is_checked) {
			__APP.USER.unsubscribeFromOrganization(self.org_id, function() {
				self.afterUncheck();
				$(window).trigger('unsubscribe', [self.org_id]);
			});
		} else {
			__APP.USER.subscribeToOrganization(self.org_id, function() {
				self.afterCheck();
				$(window).trigger('subscribe', [self.org_id]);
			});
		}
	};
	
	
	return SubscribeButton;
}()));
/**
 * @class
 * @extends Array
 */
ModalsCollection = extending(Array, (function() {
	/**
	 *
	 * @param {number} length
	 * @constructor
	 * @construct ModalsCollection
	 */
	function ModalsCollection(length) {
		this.max_length = length;
		Object.defineProperty(this, 'last_id', {
			value: 0,
			writable: true,
			enumerable: false,
			configurable: false
		});
	}
	
	/**
	 *
	 * @param {AbstractModal} modal
	 */
	ModalsCollection.prototype.push = function(modal) {
		if (modal instanceof AbstractModal) {
			modal.id = ++this.last_id;
			this[this.length++] = modal;
			if (this.length > this.max_length) {
				this.shift().destroy();
			}
		}
		return this.length;
	};
	
	
	return ModalsCollection;
}()));
/**
 * @requires Class.ModalsCollection.js
 */
/**
 * @class Modals
 */
Modals = (function() {
	/**
	 *
	 * @class ModalDestroyer
	 * @extends jQuery
	 */
	var ModalDestroyer = extendingJQuery((function() {
		/**
		 *
		 * @param {(jQuery|Element|string)} element
		 * @constructor
		 * @constructs ModalDestroyer
		 */
		function ModalDestroyer(element) {
			jQuery.fn.init.call(this, element);
			
			this.on('click.CloseModal', function() {
				AbstractModal.hideCurrent();
			});
		}
		/**
		 *
		 * @param {number} height
		 * @return {number}
		 */
		ModalDestroyer.prototype.adjustHeight = function(height) {
			var html_height = $(window).height(),
				modal_height = height;
			return this.height((modal_height > html_height) ? modal_height : html_height);
		};
		
		return ModalDestroyer;
	}()));
	/**
	 *
	 * @constructor
	 * @constructs Modals
	 */
	function Modals() {
		if (typeof Modals.instance === 'object') {
			return Modals.instance;
		}
		
		this.collection = new ModalsCollection(5);
		/**
		 * @type {AbstractModal}
		 */
		this.active_modal = null;
		/**
		 * @type {jQuery}
		 */
		this.modal_wrapper = $('.modal_wrapper');
		this.modal_destroyer = new ModalDestroyer($('.modal_destroyer'));
		
		Modals.instance = this;
	}
	
	/**
	 * @function
	 * @memberof Modals
	 */
	Modals.prototype.bindCallModal = bindCallModal;
	
	return Modals;
}());
/**
 * @requires Class.Modals.js
 */
/**
 * @class
 * @abstract
 */
AbstractModal = (function() {
	/**
	 * @abstract
	 * @constructor
	 * @param {AbstractModal.STYLES} [style]
	 * @property {jQuery} modal
	 * @property {jQuery} content_wrapper
	 * @property {(string|jQuery)} content
	 * @property {boolean} block_scroll
	 */
	function AbstractModal(style) {
		this.id = 0;
		this.title = '';
		this.type = this.constructor.name;
		this.style = style ? style : AbstractModal.STYLES.NONE;
		this.modal = $();
		this.content_wrapper = $();
		this.content = '';
		this.scrollTop = 0;
		
		this.wrapper_is_scrollable = false;
		this.content_is_scrollable = false;
		this.is_upload_disabled = false;
		this.is_rendered = false;
		this.is_inited = false;
		this.is_shown = false;
		
		__APP.MODALS.collection.push(this);
	}
	
	/**
	 * @type {jQuery}
	 */
	AbstractModal.prototype.modal_wrapper = (new Modals()).modal_wrapper;
	
	Object.defineProperty(AbstractModal.prototype, 'block_scroll', {
		get: function() {
			return AbstractModal.prototype.modal_wrapper.data('block_scroll');
		},
		set: function(value) {
			return AbstractModal.prototype.modal_wrapper.data('block_scroll', value);
		}
	});
	
	AbstractModal.hideCurrent = function() {
		if (__APP.MODALS.active_modal) {
			__APP.MODALS.active_modal.hide();
		}
	};
	/**
	 *
	 * @enum {integer}
	 */
	AbstractModal.STYLES = {
		NONE: 0,
		OK_ONLY: 1,
		OK_CANCEL: 2,
		ABORT_RETRY_IGNORE: 3,
		YES_NO_CANCEL: 4,
		YES_NO: 5,
		RETRY_CANCEL: 6,
		CRITICAL: 10,
		QUESTION: 11,
		EXCLAMATION: 12,
		INFORMATION: 13
	};
	Object.freeze(AbstractModal.STYLES);
	
	
	/**
	 *
	 * @final
	 * @protected
	 * @param {object} [props]
	 * @param {(Array<string>|string)} [props.classes]
	 * @param {(Array<string>|string)} [props.content_classes]
	 * @param {(number|string)} [props.width]
	 * @param {(number|string)} [props.height]
	 * @param {jQuery} [props.header]
	 * @param {jQuery} [props.footer]
	 * @param {jQuery} [props.footer]
	 * @param {jQuery} [props.footer_buttons]
	 * @param {Object<string, *>} [props.dataset]
	 * @param {Object<string, (string|number|boolean)>} [props.attributes]
	 * @return {AbstractModal}
	 */
	AbstractModal.prototype.__render = function(props) {
		var $footer_buttons;
		
		switch (this.style) {
			case AbstractModal.STYLES.OK_ONLY: {
				$footer_buttons = __APP.BUILD.button({
					classes: [__C.CLASSES.COLORS.PRIMARY,__C.CLASSES.SIZES.LOW, __C.CLASSES.HOOKS.CLOSE_MODAL, __C.CLASSES.HOOKS.RIPPLE],
					title: 'OK'
				});
				break;
			}
			case AbstractModal.STYLES.OK_CANCEL: {
				$footer_buttons = __APP.BUILD.button({
					classes: [__C.CLASSES.COLORS.PRIMARY,__C.CLASSES.SIZES.LOW, __C.CLASSES.HOOKS.CLOSE_MODAL, __C.CLASSES.HOOKS.RIPPLE],
					title: 'OK'
				}, {
					classes: [__C.CLASSES.COLORS.DEFAULT,__C.CLASSES.SIZES.LOW, __C.CLASSES.HOOKS.CLOSE_MODAL, __C.CLASSES.HOOKS.RIPPLE],
					title: 'Отмена'
				});
				break;
			}
			case AbstractModal.STYLES.ABORT_RETRY_IGNORE: {
				$footer_buttons = __APP.BUILD.button({
					classes: [__C.CLASSES.COLORS.MARGINAL_BUBBLEGUM,__C.CLASSES.SIZES.LOW, __C.CLASSES.HOOKS.CLOSE_MODAL, __C.CLASSES.HOOKS.RIPPLE],
					title: 'Прервать'
				}, {
					classes: [__C.CLASSES.COLORS.DEFAULT,__C.CLASSES.SIZES.LOW, __C.CLASSES.HOOKS.CLOSE_MODAL, __C.CLASSES.HOOKS.RIPPLE],
					title: 'Повтор'
				}, {
					classes: [__C.CLASSES.COLORS.DEFAULT,__C.CLASSES.SIZES.LOW, __C.CLASSES.HOOKS.CLOSE_MODAL, __C.CLASSES.HOOKS.RIPPLE],
					title: 'Пропустить'
				});
				break;
			}
			case AbstractModal.STYLES.YES_NO_CANCEL: {
				$footer_buttons = __APP.BUILD.button({
					classes: [__C.CLASSES.COLORS.MARGINAL_FRANKLIN,__C.CLASSES.SIZES.LOW, __C.CLASSES.HOOKS.CLOSE_MODAL, __C.CLASSES.HOOKS.RIPPLE],
					title: 'Да'
				}, {
					classes: [__C.CLASSES.COLORS.MARGINAL_BUBBLEGUM,__C.CLASSES.SIZES.LOW, __C.CLASSES.HOOKS.CLOSE_MODAL, __C.CLASSES.HOOKS.RIPPLE],
					title: 'Нет'
				}, {
					classes: [__C.CLASSES.COLORS.DEFAULT,__C.CLASSES.SIZES.LOW, __C.CLASSES.HOOKS.CLOSE_MODAL, __C.CLASSES.HOOKS.RIPPLE],
					title: 'Отмена'
				});
				break;
			}
			case AbstractModal.STYLES.YES_NO: {
				$footer_buttons = __APP.BUILD.button({
					classes: [__C.CLASSES.COLORS.MARGINAL_FRANKLIN,__C.CLASSES.SIZES.LOW, __C.CLASSES.HOOKS.CLOSE_MODAL, __C.CLASSES.HOOKS.RIPPLE],
					title: 'Да'
				}, {
					classes: [__C.CLASSES.COLORS.MARGINAL_BUBBLEGUM,__C.CLASSES.SIZES.LOW, __C.CLASSES.HOOKS.CLOSE_MODAL, __C.CLASSES.HOOKS.RIPPLE],
					title: 'Нет'
				});
				break;
			}
			case AbstractModal.STYLES.RETRY_CANCEL: {
				$footer_buttons = __APP.BUILD.button({
					classes: [__C.CLASSES.COLORS.DEFAULT,__C.CLASSES.SIZES.LOW, __C.CLASSES.HOOKS.CLOSE_MODAL, __C.CLASSES.HOOKS.RIPPLE],
					title: 'Повтор'
				}, {
					classes: [__C.CLASSES.COLORS.DEFAULT,__C.CLASSES.SIZES.LOW, __C.CLASSES.HOOKS.CLOSE_MODAL, __C.CLASSES.HOOKS.RIPPLE],
					title: 'Отмена'
				});
				break;
			}
		}
		
		this.modal = __APP.BUILD.modal($.extend({
			type: this.type,
			title: this.title,
			content: this.content,
			footer_buttons: $footer_buttons
		}, props));
		this.content_wrapper = this.modal.find('.ModalContent');
		
		this.is_rendered = true;
		
		if (!this.content) {
			this.content = this.content_wrapper.children();
		}
		
		return this;
	};
	
	/**
	 * @final
	 * @protected
	 * @return {AbstractModal}
	 */
	AbstractModal.prototype.__init = function() {
		var self = this;
		
		function handleScrollToBottom(self) {
			if(!self.is_upload_disabled && !self.block_scroll) {
				self.block_scroll = true;
				self.onScrollToBottom(function() {
					self.block_scroll = false;
					self.adjustDestroyerHeight();
				});
			}
		}
		
		if (!this.is_rendered) {
			console.error('Modal has not been rendered yet');
			return this;
		}
		
		this.modal.find('.CloseModal').on('click.CloseModal', function() {
			AbstractModal.hideCurrent();
		});
		$(document).on('keyup.CloseModal', function(event) {
			if (event.keyCode == 27) {
				$(this).off('keyup.CloseModal');
				AbstractModal.hideCurrent();
			}
		});
		
		if (this.wrapper_is_scrollable && this.onScrollToBottom != AbstractModal.prototype.onScrollToBottom) {
			this.modal_wrapper.on('scroll', function() {
				if (self.modal_wrapper.height() + self.modal_wrapper.scrollTop() >= self.modal.height()) {
					handleScrollToBottom(self);
				}
			});
		}
		
		if (this.content_is_scrollable) {
			this.content.scrollbar({
				onScroll: this.onScrollToBottom != AbstractModal.prototype.onScrollToBottom ? function(y) {
					if (y.scroll == y.maxScroll) {
						handleScrollToBottom(self);
					}
				} : undefined
			});
			
			this.modal.on('modal:disappear', function() {
				self.content.scrollTop(0);
			});
		}
		
		this.is_inited = true;
		
		return this;
	};
	
	/**
	 *
	 * @final
	 * @protected
	 * @return {AbstractModal}
	 */
	AbstractModal.prototype.__show = function() {
		var self = this;
		
		if (!this.is_rendered)
			return this.render().show();
		
		AbstractModal.hideCurrent();
		$('body').addClass('-open_modal');
		__APP.MODALS.active_modal = this;
		
		this.modal_wrapper.append(this.modal.addClass('-faded').removeClass(__C.CLASSES.HIDDEN));
		this.adjustDestroyerHeight();
		
		this.modal.trigger('modal:show');
		setTimeout(function() {
			self.modal.removeClass('-faded');
			self.modal_wrapper.scrollTop(self.scrollTop);
			self.modal.trigger('modal:appear');
			self.is_shown = true;
		}, 200);
		
		if (!this.is_inited) {
			this.init();
		}
		
		return this;
	};
	/**
	 *
	 * @final
	 * @protected
	 * @return {AbstractModal}
	 */
	AbstractModal.prototype.__hide = function() {
		var self = this;
		
		this.scrollTop = this.modal_wrapper.scrollTop();
		$(document).off('keyup.CloseModal');
		
		$('body').removeClass('-open_modal');
		
		__APP.MODALS.active_modal = undefined;
		
		this.modal.addClass('-faded');
		this.modal.trigger('modal:disappear');
		setTimeout(function() {
			self.modal.addClass(__C.CLASSES.HIDDEN).trigger('modal:close');
			self.is_shown = false;
		}, 200);
		
		return this;
	};
	
	/**
	 * @param {Function} callback
	 * @return {AbstractModal}
	 */
	AbstractModal.prototype.onScrollToBottom = function(callback){
		callback.call(this);
		
		return this;
	};
	/**
	 *
	 * @return {AbstractModal}
	 */
	AbstractModal.prototype.adjustDestroyerHeight = function(){
		__APP.MODALS.modal_destroyer.adjustHeight(this.modal.outerHeight(true));
		
		return this;
	};
	/**
	 *
	 * @param {object} [props]
	 * @param {(Array<string>|string)} [props.classes]
	 * @param {(Array<string>|string)} [props.content_classes]
	 * @param {(number|string)} [props.width]
	 * @param {(number|string)} [props.height]
	 * @param {jQuery} [props.header]
	 * @param {jQuery} [props.footer]
	 * @param {jQuery} [props.footer]
	 * @param {jQuery} [props.footer_buttons]
	 * @param {Object<string, *>} [props.dataset]
	 * @param {Object<string, (string|number|boolean)>} [props.attributes]
	 * @return {AbstractModal}
	 */
	AbstractModal.prototype.render = function(props){
		
		return this.__render($.extend({
			classes: [__C.CLASSES.FLOATING_MATERIAL]
		}, props));
	};
	/**
	 * @return {AbstractModal}
	 */
	AbstractModal.prototype.init = function() {
		return this.__init();
	};
	/**
	 * @return {AbstractModal}
	 */
	AbstractModal.prototype.show = function() {
		return this.__show();
	};
	/**
	 *
	 * @return {AbstractModal}
	 */
	AbstractModal.prototype.hide = function() {
		return this.__hide();
	};
	/**
	 * @protected
	 * @return {AbstractModal}
	 */
	AbstractModal.prototype.destroyNested = function() {
		return this;
	};
	/**
	 *
	 * @return {AbstractModal}
	 */
	AbstractModal.prototype.destroy = function() {
		var index = __APP.MODALS.collection.indexOf(this);
		this.hide();
		__APP.MODALS.modal_wrapper.trigger('modal.beforeDestroy');
		this.destroyNested();
		this.modal.remove();
		if (index != -1) {
			__APP.MODALS.collection.splice(index, 1);
		}
		__APP.MODALS.modal_wrapper.trigger('modal.afterDestroy');
		
		return this;
	};
	
	return AbstractModal;
}());
/**
 * @requires Class.AbstractModal.js
 */
/**
 * @class
 * @extends AbstractModal
 */
AddStaffModal = extending(AbstractModal, (function() {
	/**
	 *
	 * @param {(number|string)} org_id
	 * @param {OneUser.ROLE} role
	 *
	 * @constructor
	 * @constructs AddStaffModal
	 */
	function AddStaffModal(org_id, role) {
		AbstractModal.call(this);
		this.org_id = org_id;
		this.organization = new OneOrganization(this.org_id);
		this.role = role;
	}
	
	/**
	 *
	 * @return {AddStaffModal}
	 */
	AddStaffModal.prototype.render = function() {
		this.content = tmpl('modal-add-staff-content', {
			modal_id: this.id,
			org_id: this.org_id,
			role: this.role
		});
		
		this.__render({
			width: 380,
			classes: [__C.CLASSES.FLOATING_MATERIAL, __C.CLASSES.MODAL_STATES.SIZE.TINY],
			content_classes: [__C.CLASSES.ALIGN.CENTER]
		});
		
		return this;
	};
	/**
	 *
	 * @return {AddStaffModal}
	 */
	AddStaffModal.prototype.init = function() {
		var self = this,
			$search_by_name_input = this.content.find('.SearchByName');
		
		bindRippleEffect(this.content);
		
		$search_by_name_input.select2({
			width: '100%',
			placeholder: $search_by_name_input.attr('placeholder'),
			ajax: {
				url: '/api/v1/users/',
				dataType: 'JSON',
				data: function(searchTerm, pageNumber, context) {
					return {name: searchTerm};
				},
				results: function(remoteData, pageNumber, query) {
					return {
						results: remoteData.data.map(function(user) {
							return {
								id: user.id,
								text: [user.last_name, user.first_name, user.middle_name].join(' ').trim()
							}
						})
					};
				}
			},
			dropdownCssClass: "form_select2_drop"
		});
		
		this.content.find('.AddStaff').on('click', function() {
			var form_data = $(this).closest('form').serializeForm();
			
			self.organization.addStaff(form_data.user_id, form_data.role, function(user) {
				__APP.CURRENT_PAGE.$view.trigger('staff:add', [form_data.role, user]);
				self.hide();
			});
		});
		
		return this;
	};
	
	
	return AddStaffModal;
}()));
/**
 * @requires Class.AbstractModal.js
 */
/**
 * @class
 * @extends AbstractModal
 */
AuthModal = extending(AbstractModal, (function() {
	/**
	 *
	 * @param {string} [redirect_to]
	 *
	 * @constructor
	 * @constructs AuthModal
	 */
	function AuthModal(redirect_to) {
		AbstractModal.call(this);
		this.content = tmpl('modal-auth-content', {
			heading: 'Войдите через социальную сеть, чтобы совершить это действие'
		});
		this.redirect_to = redirect_to;
	}
	
	/**
	 *
	 * @return {AuthModal}
	 */
	AuthModal.prototype.render = function() {
		this.__render({
			classes: [__C.CLASSES.FLOATING_MATERIAL, __C.CLASSES.MODAL_STATES.SIZE.TINY],
			content_classes: [__C.CLASSES.ALIGN.CENTER]
		});
		
		return this;
	};
	/**
	 *
	 * @return {AuthModal}
	 */
	AuthModal.prototype.init = function() {
		var self = this;
		
		this.modal.find('.AuthButton').each(function() {
			$(this).on('click', function (e) {
				var network = $(this).data('auth_network');
				
				if (yaCounter32442130) {
					yaCounter32442130.reachGoal(network.toUpperCase() + 'AuthStart');
				}
				
				try {
					window.localStorage.setItem('redirect_to', encodeURIComponent(self.redirect_to));
				} catch (e) {}
				
				if (isNotDesktop()) {
					window.location.href = __APP.AUTH_URLS[network];
				} else {
					window.open(__APP.AUTH_URLS[network], network.toUpperCase() + '_AUTH_WINDOW', 'status=1,toolbar=0,menubar=0&height=500,width=700');
				}
				e.preventDefault();
			});
		});
		
		bindRippleEffect(this.modal);
		
		return this;
	};
	
	
	return AuthModal;
}()));
/**
 * @requires Class.AbstractModal.js
 */
/**
 * @class CityChooseModal
 * @extends AbstractModal
 */
CityChooseModal = extending(AbstractModal, (function() {
	/**
	 *
	 * @param {(Array<OneCity>|CitiesCollection)} [cities]
	 * @constructor
	 * @constructs CityChooseModal
	 */
	function CityChooseModal(cities) {
		AbstractModal.call(this, AbstractModal.STYLES.OK_ONLY);
		this.cities = cities;
		this.title = 'Выбор города';
	}
	/**
	 *
	 * @return {CityChooseModal}
	 */
	CityChooseModal.prototype.show = function() {
		var self = this;
		
		if(!this.cities){
			this.cities = new CitiesCollection();
			this.cities.fetchCities('timediff_seconds', 0, 'distance,local_name', function() {
				self.__show();
			});
			return this;
		}
		
		this.__show();
		return this;
		
	};
	/**
	 *
	 * @return {CityChooseModal}
	 */
	CityChooseModal.prototype.render = function() {
		this.content = tmpl('modal-city-choose-content', {
			cities: tmpl('option', this.cities.map(function(city) {
				return {
					val: city.id,
					display_name: city.local_name
				};
			}))
		});
		this.__render({
			classes: [__C.CLASSES.FLOATING_MATERIAL],
			width: 400
		});
		
		return this;
	};
	/**
	 *
	 * @return {CityChooseModal}
	 */
	CityChooseModal.prototype.init = function() {
		this.content.find('#city_choose_modal_select').select2({
			containerCssClass: 'form_select2',
			dropdownCssClass: 'form_select2_drop'
		}).select2('val', 1);
		this.__init();
		
		return this;
	};
	/**
	 *
	 * @return {CityChooseModal}
	 */
	CityChooseModal.prototype.hide = function() {
		__APP.USER.selected_city = this.cities.getByID(this.content.find('#city_choose_modal_select').val());
		try {
			localStorage.setItem('selected_city', JSON.stringify(__APP.USER.selected_city));
		} catch (e) {}
		this.__hide();
		__APP.reload();
		
		return this;
	};
	
	return CityChooseModal;
}()));
/**
 * @requires Class.AbstractModal.js
 */
/**
 * @class
 * @extends AbstractModal
 */
CropperModal = extending(AbstractModal, (function() {
	/**
	 *
	 * @param {string} image_src
	 * @param {object} [cropper_options]
	 * @constructor
	 * @constructs CropperModal
	 */
	function CropperModal(image_src, cropper_options) {
		AbstractModal.call(this);
		if (image_src) {
			cropper_options = typeof cropper_options == 'object' ? cropper_options : {};
			this.image_src = image_src;
			this.content = tmpl('modal-cropper-content', {
				image_src: this.image_src
			});
			this.options = $.extend({
				viewMode: 1,
				responsive: false,
				scalable: false,
				zoomable: false,
				zoomOnWheel: false
			}, cropper_options);
		} else {
			throw Error('To initiate cropper you need to pass image source (image_src)')
		}
	}
	/**
	 *
	 * @return {CropperModal}
	 */
	CropperModal.prototype.render = function() {
		var self = this,
			$image = this.content;
		
		this.__render({
			classes: [__C.CLASSES.FLOATING_MATERIAL, __C.CLASSES.MODAL_STATES.SIZE.WIDE],
			content_classes: [__C.CLASSES.MODAL_STATES.NO_PADDING, __C.CLASSES.IMG_HOLDER],
			footer_buttons: tmpl('button', [
				{classes: [__C.CLASSES.COLORS.PRIMARY, 'CropButton', __C.CLASSES.HOOKS.RIPPLE].join(' '), title: 'Кадрировать'},
				{classes: [__C.CLASSES.COLORS.DEFAULT, 'DestroyCropButton', __C.CLASSES.HOOKS.RIPPLE].join(' '), title: 'Отмена'}
			])
		});
		
		$image.on('load', function() {
			$image.cropper(self.options);
		}).attr('src', this.image_src);
		
		return this;
	};
	/**
	 *
	 * @return {CropperModal}
	 */
	CropperModal.prototype.init = function() {
		var self = this;
		
		this.modal.find('.CropButton').on('click.Crop', function() {
			self.crop();
			self.hide();
		});
		this.modal.find('.DestroyCropButton').on('click.DestroyCrop', function() {
			self.hide();
		});
		
		return this;
	};
	/**
	 * @protected
	 * @return {CropperModal}
	 */
	CropperModal.prototype.destroyNested = function() {
		this.content.cropper('destroy');
		this.modal.find('.CropButton').off('click.Crop');
		this.modal.find('.DestroyCropButton').off('click.DestroyCrop');
		
		return this;
	};
	/**
	 *
	 * @return {CropperModal}
	 */
	CropperModal.prototype.crop = function() {
		this.modal.trigger('crop', [this.content.cropper('getCroppedCanvas').toDataURL()]);
		
		return this;
	};
	
	return CropperModal;
}()));
/**
 * @requires Class.AbstractModal.js
 */
/**
 * @class
 * @extends AbstractModal
 */
MapModal = extending(AbstractModal, (function() {
	/**
	 *
	 * @param {string} location
	 * @constructor
	 * @constructs MapModal
	 */
	function MapModal(location) {
		AbstractModal.call(this);
		if (location) {
			this.location = location;
		} else {
			throw Error('To initiate map you need to pass location (location)')
		}
	}
	/**
	 *
	 * @return {MapModal}
	 */
	MapModal.prototype.render = function() {
		this.content = tmpl('modal-map-content', {
			iframe_height: $(window).height() - 200,
			location: this.location
		});
		
		this.__render({
			classes: [__C.CLASSES.FLOATING_MATERIAL, __C.CLASSES.MODAL_STATES.SIZE.WIDE],
			content_classes: [__C.CLASSES.MODAL_STATES.NO_PADDING]
		});
		
		return this;
	};
	/**
	 *
	 * @return {MapModal}
	 */
	MapModal.prototype.show = function() {
		var self = this,
			$window = $(window);
		
		$window.on('resize.changeMapHeight', function() {
			self.content.height($window.height() - 200);
			self.adjustDestroyerHeight();
		});
		
		this.__show();
		
		return this;
	};
	/**
	 *
	 * @return {MapModal}
	 */
	MapModal.prototype.hide = function() {
		$(window).off('resize.changeMapHeight');
		this.__hide();
		
		return this;
	};
	
	return MapModal;
}()));
/**
 * @requires Class.AbstractModal.js
 */
/**
 * @class
 * @extends AbstractModal
 */
MediaModal = extending(AbstractModal, (function() {
	/**
	 *
	 * @param {string} src
	 * @param {string} format
	 * @constructor
	 * @constructs MediaModal
	 */
	function MediaModal(src, format) {
		AbstractModal.call(this);
		if (src) {
			if (format === 'image') {
				this.content = tmpl('modal-image-media-content', {src: src});
			} else {
				
			}
			this.src = src;
			this.format = format ? format : 'image';
		} else {
			throw Error('To open media you need to pass media source (src)')
		}
	}
	
	/**
	 *
	 * @return {MediaModal}
	 */
	MediaModal.prototype.render = function(){
		this.__render({
			classes: [__C.CLASSES.FLOATING_MATERIAL, __C.CLASSES.MODAL_STATES.SIZE.RESPONSIVE],
			content_classes: [__C.CLASSES.IMG_HOLDER, __C.CLASSES.MODAL_STATES.NO_PADDING]
		});
		
		return this;
	};
	
	/**
	 *
	 * @return {MediaModal}
	 */
	MediaModal.prototype.show = function() {
		var self = this;
		this.content.on('load', function() {
			self.adjustDestroyerHeight();
		});
		this.__show();
		
		return this;
	};
	
	return MediaModal;
}()));
/**
 * @requires Class.AbstractModal.js
 */
/**
 * @class
 * @extends AbstractModal
 */
StdModal = extending(AbstractModal, (function() {
	/**
	 *
	 * @param {string} title
	 * @param {(string|jQuery)} content
	 * @param {StdModal.STYLES} [style]
	 * @constructor
	 * @constructs StdModal
	 */
	function StdModal(title, content, style) {
		AbstractModal.call(this, style);
		this.title = title;
		this.content = content;
	}
	
	StdModal.STYLES = AbstractModal.STYLES;
	Object.freeze(StdModal.STYLES);
	
	return StdModal;
}()));
/**
 * @requires Class.AbstractModal.js
 */
/**
 * @class TicketsModal
 * @extends AbstractModal
 */
TicketsModal = extending(AbstractModal, (function() {
	/**
	 *
	 * @param {(ExtendedTicketsCollection|Array<OneExtendedTicket>|OneExtendedTicket)} tickets
	 * @constructor
	 * @constructs TicketsModal
	 *
	 * @property {ExtendedTicketsCollection} tickets
	 * @property {string} ticket_uuid
	 * @property {boolean} is_ticket_exists
	 */
	function TicketsModal(tickets) {
		AbstractModal.call(this);
		
		if (tickets instanceof ExtendedTicketsCollection) {
			this.tickets = tickets;
		} else if (tickets instanceof Array || tickets instanceof OneExtendedTicket) {
			this.tickets = new ExtendedTicketsCollection();
			this.tickets.setData(tickets);
		} else {
			throw Error('Constructor needs instance of OneExtendedTicket class to create new instance of TicketsModal');
		}
		//this.width = 450;
	}
	/**
	 *
	 * @return {TicketsModal}
	 */
	TicketsModal.prototype.render = function(){
		var self = this;
		
		this.content = tmpl('modal-ticket-content', Builder.normalizeTicketProps(this.tickets).map(function(props, i) {
			var data = self.tickets[i].order.payed_at || self.tickets[i].created_at;
			
			props.cover_width = 450;
			props.card_classes.push('-ticket_extended', __C.CLASSES.FLOATING_MATERIAL);
			
			return $.extend(props, {
				cover_height: 253,
				number_formatted: formatTicketNumber(self.tickets[i].number),
				payed_at_formatted: (self.tickets[i].order.payed_at ? 'Куплен ' : 'Приобретен ') + moment.unix(data).format(__LOCALES.ru_RU.DATE.DATE_TIME_FORMAT),
				price_formatted: +self.tickets[i].price ? formatCurrency(self.tickets[i].price, ' ', '.', '', 'руб.') : 'Бесплатно'
			});
		}));
		
		this.__render({
			//width: this.width,
			content_classes: [__C.CLASSES.MODAL_STATES.NO_PADDING]
		});
		
		return this;
	};
	
	return TicketsModal;
}()));
/**
 * @requires ../Class.AbstractModal.js
 */
/**
 * @class
 * @abstract
 * @extends AbstractModal
 */
AbstractListModal = extending(AbstractModal, (function() {
	/**
	 *
	 * @param {OneEntity} entity
	 * @constructor
	 * @constructs AbstractListModal
	 */
	function AbstractListModal(entity) {
		AbstractModal.call(this);
		this.content = tmpl('modal-list-content');
		this.entity = entity;
		this.entities = new EntitiesCollection();
		this.content_is_scrollable = true;
	}
	
	/**
	 *
	 * @return {AbstractListModal}
	 */
	AbstractListModal.prototype.render = function() {
		this.__render({
			width: 384,
			height: 'calc(100% - 140px)',
			classes: ['material', '-floating', '-fixed'],
			content_classes: ['list_modal_content']
		});
		
		return this;
	};
	/**
	 *
	 * @abstract
	 * @return {jqPromise}
	 */
	AbstractListModal.prototype.uploadEntities = function() {
		return $.Deferred.resolve().promise();
	};
	/**
	 *
	 * @abstract
	 * @param {EntitiesCollection} entities
	 * @return {jQuery}
	 */
	AbstractListModal.prototype.buildEntities = function(entities) {
		return $();
	};
	/**
	 *
	 * @return {AbstractListModal}
	 */
	AbstractListModal.prototype.show = function() {
		var self = this;
		
		if(this.content.children().length) {
			this.__show();
			return this;
		}
		
		this.render();
		this.content.append(this.buildEntities(this.entities));
		
		if (this.entities.length < 5) {
			this.uploadEntities().done(function() {
				self.__show();
			});
		} else {
			this.__show();
		}
		
		return this;
	};
	/**
	 *
	 * @return {AbstractListModal}
	 */
	AbstractListModal.prototype.onScrollToBottom = function(callback) {
		var self = this,
			$loader = __APP.BUILD.loaderBlock(this.content);
		
		this.uploadEntities()
			.fail(function() {
				self.block_scroll = false;
			})
			.done(function(){
				$loader.remove();
				callback.call(self);
			});
		
		return this;
	};
	
	return AbstractListModal;
}()));
/**
 * @requires Class.AbstractListModal.js
 */
/**
 * @class
 * @extends AbstractListModal
 */
FriendsListModal = extending(AbstractListModal, (function() {
	/**
	 *
	 * @param {CurrentUser} user
	 * @constructor
	 * @constructs FriendsListModal
	 * @property {CurrentUser} entity
	 */
	function FriendsListModal(user) {
		if (typeof FriendsListModal.instance === 'object') {
			return FriendsListModal.instance;
		}
		AbstractListModal.call(this, user);
		this.title = 'Подписки на пользователей';
		this.entities = this.entity.friends;
		FriendsListModal.instance = this;
	}
	/**
	 *
	 * @return {jqPromise}
	 */
	FriendsListModal.prototype.uploadEntities = function() {
		var self = this;
		
		return __APP.USER.fetchFriends({length: 20}).done(function(friends) {
			if(friends.length) {
				self.content.append(self.buildEntities(friends));
			} else {
				self.is_upload_disabled = true;
			}
		}).promise();
	};
	/**
	 *
	 * @param {UsersCollection} entities
	 * @return {jQuery}
	 */
	FriendsListModal.prototype.buildEntities = function(entities) {
		var $blocks = __APP.BUILD.avatarBlocks(entities, {
			is_link: true,
			entity: __C.ENTITIES.USER,
			avatar_classes: [__C.CLASSES.SIZES.X40, __C.CLASSES.UNIVERSAL_STATES.ROUNDED]
		});
		bindPageLinks($blocks);
		
		return $blocks;
	};
	
	return FriendsListModal;
}()));
/**
 * @requires Class.AbstractListModal.js
 */
/**
 * @class
 * @extends AbstractListModal
 */
SubscriptionsListModal = extending(AbstractListModal, (function() {
	/**
	 *
	 * @param {OneUser} user
	 * @constructor
	 * @constructs SubscriptionsListModal
	 * @property {OneUser} entity
	 */
	function SubscriptionsListModal(user) {
		AbstractListModal.call(this, user);
		this.title = 'Подписки на организации';
		this.entities = this.entity.subscriptions;
	}
	/**
	 *
	 * @return {jqPromise}
	 */
	SubscriptionsListModal.prototype.uploadEntities = function() {
		var self = this;
		
		return this.entity.fetchSubscriptions({length: 20}).done(function(organizations) {
			if(organizations.length) {
				self.content.append(self.buildEntities(organizations));
			} else {
				self.is_upload_disabled = true;
			}
		}).promise();
	};
	/**
	 *
	 * @param {UsersCollection} entities
	 * @return {jQuery}
	 */
	SubscriptionsListModal.prototype.buildEntities = function(entities) {
		var $blocks = __APP.BUILD.avatarBlocks(entities, {
			is_link: true,
			entity: __C.ENTITIES.ORGANIZATION,
			avatar_classes: [__C.CLASSES.SIZES.X40, __C.CLASSES.UNIVERSAL_STATES.ROUNDED]
		});
		bindPageLinks($blocks);
		
		return $blocks;
	};
	
	return SubscriptionsListModal;
}()));
/**
 * @requires ../Class.AbstractModal.js
 */
/**
 * @class PreviewRegistrationModal
 * @extends AbstractModal
 */
PreviewRegistrationModal = extending(AbstractModal, (function() {
	
	/**
	 *
	 * @param {OneEvent} event
	 * @constructor
	 * @constructs PreviewRegistrationModal
	 */
	function PreviewRegistrationModal(event) {
		AbstractModal.call(this);
		this.event = event;
		this.title = 'Регистрация';
	}
	/**
	 *
	 * @return {PreviewRegistrationModal}
	 */
	PreviewRegistrationModal.prototype.render = function() {
		var self = this;
		this.__render({
			classes: ['material', '-floating'],
			width: 400,
			content: tmpl('modal-registration-content', {
				modal_id: this.id,
				required_star: tmpl('required-star'),
				event_title: this.event.title,
				fields: $.makeSet(this.event.registration_fields.map(self.buildRegistrationField.bind(self)))
			})
		});
		
		return this;
	};
	/**
	 *
	 * @return {PreviewRegistrationModal}
	 */
	PreviewRegistrationModal.prototype.init = function() {
		this.content.find('.RegisterButton').prop('disabled', true);
		this.__init();
		
		return this;
	};
	/**
	 *
	 * @param {RegistrationFieldModel} field
	 * @return {jQuery}
	 */
	PreviewRegistrationModal.prototype.buildRegistrationField = function(field) {
		return __APP.BUILD.formInput({
			id: 'registration_form_' + this.id + '_' + field.uuid,
			type: field.type === RegistrationFieldModel.TYPES.EXTENDED_CUSTOM ? 'textarea' : field.type,
			name: field.uuid,
			classes: ['Registration' + field.type.toCamelCase('_') + 'Field'],
			label: $('<span>'+ field.label +'</span>').add((field.required ? tmpl('required-star') : $())),
			placeholder: field.label,
			required: field.required,
			helptext: (function(type) {
				switch (type) {
					case RegistrationFieldModel.TYPES.EMAIL:
						return 'На почту Вам поступит сообщение с подтверждением регистрации';
					case RegistrationFieldModel.TYPES.FIRST_NAME:
						return 'Используйте настоящее имя для регистрации';
					case RegistrationFieldModel.TYPES.LAST_NAME:
						return 'Используйте настоящюю фамилию для регистрации';
					default:
						return '';
				}
			})(field.type)
		});
	};
	
	return PreviewRegistrationModal;
}()));
/**
 * @requires Class.PreviewRegistrationModal.js
 */
/**
 * @class RegistrationModal
 * @extends PreviewRegistrationModal
 */
RegistrationModal = extending(PreviewRegistrationModal, (function() {
	
	/**
	 *
	 * @param {OneEvent} event
	 * @constructor
	 * @constructs RegistrationModal
	 */
	function RegistrationModal(event) {
		PreviewRegistrationModal.call(this, event);
	}
	/**
	 *
	 * @return {RegistrationModal}
	 */
	RegistrationModal.prototype.init = function() {
		var self = this;
		
		this.content.find('.RegisterButton').on('click.Register', function() {
			var $register_button = $(this),
				$form = $register_button.closest('.RegistrationModalForm');
			
			$register_button.attr('disabled', true);
			if (isFormValid($form)) {
				OneEvent.registerToEvent(self.event.id, $form.serializeForm('array').map(function(field) {
					return {
						uuid: field.name,
						value: field.value
					};
				}))
					.always(function() {
						$register_button.removeAttr('disabled');
					})
					.done(function() {
						self.modal.trigger('registration:success');
						self.hide();
					});
			} else {
				$register_button.removeAttr('disabled');
			}
		});
		this.content.find('.RegistrationFirstNameField').val(__APP.USER.first_name);
		this.content.find('.RegistrationLastNameField').val(__APP.USER.last_name);
		this.content.find('.RegistrationEmailField').val(__APP.USER.email);
		
		bindRippleEffect(this.content);
		this.__init();
		
		return this;
	};
	
	return RegistrationModal;
}()));
/**
 * @requires ../Class.AbstractModal.js
 */
/**
 * @class
 * @abstract
 * @extends AbstractModal
 */
AbstractUsersModal = extending(AbstractModal, (function() {
	/**
	 *
	 * @param {(string|number)} entity_id
	 * @param {string} title
	 * @constructor
	 * @constructs AbstractUsersModal
	 */
	function AbstractUsersModal(entity_id, title) {
		AbstractModal.call(this);
		this.title = title;
		this.entity_id = entity_id;
		this.entities_length = 30;
		this.is_upload_disabled = false;
		this.users = new UsersCollection();
		this.is_first = true;
		this.wrapper_is_scrollable = true;
		
		if (this.constructor === AbstractUsersModal) {
			throw new Error("Can't instantiate abstract class!");
		}
	}
	/**
	 *
	 * @return {AbstractUsersModal}
	 */
	AbstractUsersModal.prototype.show = function() {
		var self = this;
		
		this.block_scroll = false;
		if(this.users.length){
			this.__show();
			return this;
		}
		this.render({
			width: '60%'
		});
		this.uploadUsers(function() {
			self.__show();
		});
		
		return this;
	};
	/**
	 *
	 * @return {AbstractUsersModal}
	 */
	AbstractUsersModal.prototype.init = function() {
		bindPageLinks(this.modal);
		this.__init();
		
		return this;
	};
	/**
	 *
	 * @return {AbstractUsersModal}
	 */
	AbstractUsersModal.prototype.onScrollToBottom = function(callback) {
		var self = this;
		
		this.uploadUsers(function() {
			callback.call(self);
		});
		
		return this;
	};
	/**
	 *
	 * @return {AbstractUsersModal}
	 */
	AbstractUsersModal.prototype.hide = function() {
		this.block_scroll = false;
		this.modal_wrapper.off('scroll.uploadUsers');
		this.__hide();
		
		return this;
	};
	/**
	 * @callback AbstractUsersModal.uploadUsersCallback
	 * @param {Array} [users]
	 */
	/**
	 *
	 * @param {AbstractUsersModal.uploadUsersCallback} [callback]
	 */
	AbstractUsersModal.prototype.uploadUsers = function(callback) {};
	/**
	 *
	 * @param {Array} users
	 * @return {jQuery}
	 */
	AbstractUsersModal.prototype.buildUsers = function(users) {
		var $users = $(),
			last_is_fiends = this.content_wrapper.find('.UserTombstone').eq(-1).data('is_friend') == 'true',
			self = this;
		
		users.forEach(function(user, i) {
			if ((self.is_first && !i) || last_is_fiends != user.is_friend) {
				$users = $users.add(tmpl('modal-users-divider', {label: user.is_friend ? 'Друзья' : 'Все'}));
				last_is_fiends = user.is_friend;
			}
			
			$users = $users.add(__APP.BUILD.userTombstones(user, {
				tombstone_classes: ['UserTombstone'],
				is_link: true,
				dataset: {is_friend: user.is_friend}
			}));
		});
		
		return $users;
	};
	/**
	 *
	 * @param {Array} users
	 */
	AbstractUsersModal.prototype.afterUpload = function(users) {
		var self = this,
			$new_users;
		if (users.length) {
			$new_users = this.buildUsers(users);
			this.content_wrapper.append($new_users);
			this.is_first = false;
			this.entities_length = 10;
			this.adjustDestroyerHeight();
			bindPageLinks($new_users);
			$new_users.on('click.hideModal', function() {
				self.hide();
			});
		} else {
			this.is_upload_disabled = true;
		}
	};
	
	return AbstractUsersModal;
}()));
/**
 * @requires Class.AbstractUsersModal.js
 */
/**
 * @class
 * @extends AbstractUsersModal
 */
EditorsModal = extending(AbstractUsersModal, (function() {
	/**
	 *
	 * @param {(string|number)} organization_id
	 * @param {string} [title=Редаторы]
	 * @param {OneUser.ROLE} [specific_role]
	 * @constructor
	 * @constructs EditorsModal
	 */
	function EditorsModal(organization_id, title, specific_role) {
		AbstractUsersModal.call(this, organization_id, title ? title : 'Редакторы');
		this.ajax_data = {
			order_by: 'role,first_name'
		};
		
		if (specific_role) {
			this.ajax_data.roles = specific_role;
		}
	}
	/**
	 *
	 * @param {AbstractUsersModal.uploadUsersCallback} [callback]
	 * @return {jqPromise}
	 */
	EditorsModal.prototype.uploadUsers = function(callback) {
		var self = this;
		
		return this.users.fetchOrganizationStaff(this.entity_id, this.entities_length, this.ajax_data, function(users) {
			self.afterUpload(users);
			if (callback && typeof callback == 'function') {
				callback(users);
			}
		});
	};
	/**
	 *
	 * @param {Array} users
	 * @return {jQuery}
	 */
	EditorsModal.prototype.buildUsers = function(users) {
		var $users = $(),
			last_role = this.content_wrapper.find('.UserTombstone').last().data('role'),
			labels = {
				admin: 'Администраторы',
				moderator: 'Модераторы'
			},
			self = this;
		
		users.forEach(function(user, i) {
			if ((self.is_first && !i) || last_role != user.role) {
				$users = $users.add(tmpl('modal-users-divider', {label: labels[user.role]}));
				last_role = user.role;
			}
			
			$users = $users.add(__APP.BUILD.userTombstones(user, {
				tombstone_classes: ['UserTombstone'],
				is_link: true,
				dataset: {role: user.role}
			}));
		});
		
		return $users;
	};
	
	return EditorsModal;
}()));

/**
 * @requires Class.AbstractUsersModal.js
 */
/**
 * @class
 * @extends AbstractUsersModal
 */
FavoredModal = extending(AbstractUsersModal, (function() {
	/**
	 *
	 * @param {(number|string)} event_id
	 * @param {string} [title=Добавили в избранное]
	 * @constructor
	 * @constructs FavoredModal
	 */
	function FavoredModal(event_id, title) {
		if (event_id) {
			AbstractUsersModal.call(this, event_id, title ? title : 'Добавили в избранное');
			this.ajax_data = {
				fields: ['is_friend'],
				order_by: '-is_friend,first_name'
			};
		} else {
			throw Error('To open favored modal you need to pass event_id');
		}
	}
	
	/**
	 *
	 * @param {AbstractUsersModal.uploadUsersCallback} [callback]
	 * @return {jqPromise}
	 */
	FavoredModal.prototype.uploadUsers = function(callback) {
		var self = this;
		
		return this.users.fetchEventFavorites(this.entity_id, this.entities_length, this.ajax_data, function(users) {
			self.afterUpload(users);
			if (callback && typeof callback == 'function') {
				callback(users);
			}
		});
	};
	
	return FavoredModal;
}()));

/**
 * @requires Class.AbstractUsersModal.js
 */
/**
 * @class
 * @extends AbstractUsersModal
 */
SubscribersModal = extending(AbstractUsersModal, (function() {
	/**
	 *
	 * @param {(string|number)} organization_id
	 * @param {string} [title=Подписались]
	 * @constructor
	 * @constructs SubscribersModal
	 */
	function SubscribersModal(organization_id, title) {
		if (organization_id) {
			AbstractUsersModal.apply(this, [organization_id, title ? title : 'Подписались']);
			this.entity_id = organization_id;
			this.ajax_data = {
				fields: ['is_friend'],
				order_by: '-is_friend,first_name'
			};
			
		} else {
			throw Error('To open favored modal you need to pass organization_id');
		}
	}
	
	/**
	 *
	 * @param {AbstractUsersModal.uploadUsersCallback} [callback]
	 * @return {jqPromise}
	 */
	SubscribersModal.prototype.uploadUsers = function(callback) {
		var self = this;
		
		return this.users.fetchOrganizationSubscribers(this.entity_id, this.entities_length, this.ajax_data, function(users) {
			self.afterUpload(users);
			if (callback && typeof callback == 'function') {
				callback(users);
			}
		});
	};
	
	return SubscribersModal;
}()));

/**
 * @singleton
 * @class Builder
 */
Builder = (function() {
	/**
	 *
	 * @constructor
	 * @constructs Builder
	 */
	function Builder() {
		if (typeof Builder.instance === 'object')
			return Builder.instance;
		
		Builder.instance = this;
	}
	
	/**
	 * @typedef {(Array<string>|Object<string, *>)} HTMLDataset
	 */
	/**
	 * @typedef {(Array<string>|Object<string, (string|number)>)} HTMLAttributes
	 */
	/**
	 * @typedef {object} buildProps
	 * @property {(Array<string>|string)} [classes]
	 * @property {HTMLDataset} [dataset]
	 * @property {HTMLAttributes} [attributes]
	 */
	/**
	 *
	 * @param {buildProps} props
	 * @param {Array<string>} [classes]
	 * @param {Array<string>} [datasets]
	 * @param {Array<string>} [attributes]
	 * @returns {buildProps}
	 */
	Builder.normalizeBuildProps = function normalizeBuildProps(props, classes, datasets, attributes) {
		props = props ? props : {};
		classes ? classes.push('classes') : classes = ['classes'];
		datasets ? datasets.push('dataset') : datasets = ['dataset'];
		attributes ? attributes.push('attributes') : attributes = ['attributes'];
		classes.forEach(function(c) {
			props[c] = props[c] ? (typeof props[c] === 'string') ? props[c].split(' ') : props[c] : [];
			props[c].toString = Array.toSpaceSeparatedString;
		});
		datasets.forEach(function(d) {
			props[d] = props[d] ? props[d] : {};
			props[d].toString = (Array.isArray(props[d])) ? Array.toSpaceSeparatedString : Object.toHtmlDataSet;
		});
		attributes.forEach(function(a) {
			props[a] = props[a] ? props[a] : {};
			props[a].toString = (Array.isArray(props[a])) ? Array.toSpaceSeparatedString : Object.toHtmlAttributes;
		});
		
		return props;
	};
	
	/**
	 *
	 * @param {...buildProps} props
	 * @returns {jQuery}
	 */
	Builder.prototype.button = function buildButton(/**props*/) {
		var props = Array.prototype.slice.call(arguments);
		return tmpl('button', props.map(function(arg) {
			return Builder.normalizeBuildProps(arg);
		})).each(function(i, button) {
			if(props[i].dataset) {
				$(button).data(props[i].dataset);
			}
		});
	};
	/**
	 *
	 * @param {HTMLAttributes} [attributes]
	 * @param {(Array<string>|string)} [classes]
	 * @param {HTMLDataset} [dataset]
	 * @returns {jQuery}
	 */
	Builder.prototype.input = function buildInput(attributes, classes, dataset) {
		return tmpl('input', Builder.normalizeBuildProps({
			classes: classes,
			attributes: attributes,
			dataset: dataset
		})).each(function(i, input) {
			if(dataset) {
				$(input).data(dataset);
			}
		});
	};
	/**
	 *
	 * @param {HTMLAttributes} [attributes]
	 * @param {(Array<string>|string)} [classes]
	 * @param {string} [value]
	 * @param {HTMLDataset} [dataset]
	 * @returns {jQuery}
	 */
	Builder.prototype.textarea = function buildTextarea(attributes, classes, value, dataset) {
		return tmpl('textarea', Builder.normalizeBuildProps({
			value: value,
			classes: classes,
			attributes: attributes,
			dataset: dataset
		})).each(function(i, input) {
			if(dataset) {
				$(input).data(dataset);
			}
		});
	};
	/**
	 *
	 * @param {...buildProps} props
	 * @param {string} props.page
	 * @returns {jQuery}
	 */
	Builder.prototype.link = function buildLink(props) {
		return bindPageLinks(tmpl('link', [].map.call(arguments, function(arg) {
			return Builder.normalizeBuildProps(arg);
		})));
	};
	/**
	 *
	 * @param {string} type - checkbox or radio
	 * @param {buildProps} props
	 * @param {(Array<string>|string)} [props.unit_classes]
	 * @returns {jQuery}
	 */
	Builder.prototype.radioCheckbox = function buildRadioCheckbox(type, props) {
		if (type == 'checkbox' || type == 'radio') {
			props = Builder.normalizeBuildProps(props, ['unit_classes']);
			if (props.classes.indexOf('form_checkbox') == -1 && props.classes.indexOf('form_radio') == -1) {
				props.classes.unshift('form_' + type);
			}
			props.unit_classes.unshift('form_unit');
			if(!props.attributes.checked) {
				delete props.attributes.checked;
			}
			props.attributes.tabindex = props.attributes.tabindex ? props.attributes.tabindex : -1;
			
			return tmpl('radio-checkbox', $.extend(props, {type: type}));
		} else {
			throw Error('Принимаемый аргумент type может быть либо "radio" либо "checkbox", придурок')
		}
	};
	/**
	 *
	 * @param {...buildProps} props
	 * @returns {jQuery}
	 */
	Builder.prototype.radio = function buildRadio(props) {
		var self = this;
		
		return $.makeSet([].map.call(arguments, function(arg) {
			return self.radioCheckbox('radio', arg)
		}));
	};
	/**
	 *
	 * @param {...buildProps} props
	 * @returns {jQuery}
	 */
	Builder.prototype.checkbox = function buildCheckbox(props) {
		var self = this;
		
		return $.makeSet([].map.call(arguments, function(arg) {
			return self.radioCheckbox('checkbox', arg)
		}));
	};
	/**
	 *
	 * @param {buildProps} props
	 * @param {string} props.name
	 * @param {(jQuery|buildProps)} props.units
	 * @return {jQuery}
	 */
	Builder.prototype.radioGroup = function(props) {
		var self = this,
			build_props = $.extend({}, Builder.normalizeBuildProps(props)),
			$radio_group;
		
		if (!(build_props.units instanceof jQuery)) {
			build_props.units = self.radio.apply(self, build_props.units.map(function(unit) {
				var item = $.extend(unit, {
					name: build_props.name
				});
				if (!item.id) {
					item.id = guid();
				}
				
				return item;
			}));
		}
		
		$radio_group = tmpl('radio-group', build_props);
		$radio_group.data(props.dataset);
		
		return $radio_group;
	};
	/**
	 *
	 * @param {(string|Element|jQuery)} text
	 * @param {HTMLDataset} [dataset]
	 * @param {HTMLAttributes} [attributes]
	 * @returns {jQuery}
	 */
	Builder.prototype.formHelpText = function buildFormHelpText(text, dataset, attributes) {
		return tmpl('form-helptext', Builder.normalizeBuildProps({
			text: text,
			dataset: dataset,
			attributes: attributes
		}));
	};
	/**
	 *
	 * @param {...buildProps} props
	 * @param {(string|number)} props.id
	 * @param {(jQuery|string)} props.label
	 * @param {string} [props.type=text]
	 * @param {string} [props.name]
	 * @param {string} [props.value]
	 * @param {number} [props.tabindex]
	 * @param {boolean} [props.required]
	 * @param {string} [props.placeholder]
	 *
	 * @param {(string|jQuery)} [props.helptext]
	 * @param {HTMLDataset} [props.helptext_dataset]
	 * @param {HTMLAttributes} [props.helptext_attributes]
	 * @param {(Array<string>|string)} [props.unit_classes]
	 * @param {(Array<string>|string)} [props.label_classes]
	 * @returns {jQuery}
	 */
	Builder.prototype.formInput = function buildFormInput(props) {
		var self = this,
			INPUT_TYPES = [
			'hidden',
			'text',
			'search',
			'tel',
			'url',
			'email',
			'password',
			'date',
			'time',
			'number',
			'range',
			'color',
			'checkbox',
			'radio',
			'file',
			'submit',
			'image',
			'reset',
			'button'
		];
		return $.makeSet(Array.prototype.map.call(arguments, function(props) {
			switch (props.type) {
				case 'radio':
					return self.radio(props);
				case 'checkbox':
					return self.checkbox(props);
				default:
					return tmpl('form-unit', Builder.normalizeBuildProps($.extend(true, {}, props, {
						form_element: props.type === 'textarea' ?
						              self.textarea($.extend(
						              	{},
							              props.attributes,
							              {
								              id: props.id,
								              name: props.name || undefined,
								              required: props.required || undefined,
								              placeholder: props.placeholder,
								              tabindex: props.tabindex
							              }), (props.classes ? ['form_textarea'].concat(props.classes) : ['form_textarea']), props.value, props.dataset) :
						              self.input($.extend(
						              	{},
							              props.attributes,
							              {
								              id: props.id,
								              type: !props.type || INPUT_TYPES.indexOf(props.type) === -1 ? 'text' : props.type,
								              name: props.name || undefined,
								              value: props.value || undefined,
								              required: props.required || undefined,
								              placeholder: props.placeholder,
								              tabindex: props.tabindex
							              }), (props.classes ? ['form_input'].concat(props.classes) : ['form_input']), props.dataset),
						helptext: self.formHelpText(props.helptext, props.helptext_dataset, props.helptext_attributes)
					}), ['unit_classes', 'label_classes']));
			}
		}));
	};
	/**
	 *
	 * @param {string|Element|jQuery} message
	 * @param {buildProps} [props]
	 * @return {jQuery}
	 */
	Builder.prototype.cap = function buildTags(message, props) {
		if(!props)
			props = {};
		props = Builder.normalizeBuildProps(props);
		
		return tmpl('cap', $.extend({message: message}, props));
	};
	/**
	 *
	 * @param {(OneTag|Array<OneTag>|TagsCollection)} tags
	 * @param {buildProps} [props]
	 * @returns {jQuery}
	 */
	Builder.prototype.tags = function buildTags(tags, props) {
		props = Builder.normalizeBuildProps(props);
		
		function normalizeTag(tag) {
			return $.extend(true, {}, {
				name: tag.name.toLowerCase(),
				page: '/search/' + encodeURIComponent('#' + tag.name.toLowerCase())
			}, props);
		}
		
		if (tags instanceof Array) {
			return tmpl('tag', tags.map(normalizeTag));
		} else {
			return tmpl('tag', normalizeTag(tags));
		}
	};
	/**
	 *
	 * @param {jQuery} [$wrapper]
	 * @param {string} [direction]
	 * @return {jQuery}
	 */
	Builder.prototype.loaderBlock = function buildLoaderBlock($wrapper, direction) {
		return tmpl('loader-block', {loader: tmpl('loader')}, $wrapper, direction);
	};
	/**
	 *
	 * @param {jQuery} [$wrapper]
	 * @param {string} [direction]
	 * @return {jQuery}
	 */
	Builder.prototype.overlayLoader = function buildLoaderBlock($wrapper, direction) {
		return tmpl('loader-block', {
			classes: '-loader_overlay',
			loader: tmpl('loader')
		}, $wrapper, direction);
	};
	/**
	 *
	 * @param {Object<OneUser.ACCOUNTS, string>} [accounts_links]
	 * @param {buildProps} [props]
	 * @returns {jQuery}
	 */
	Builder.prototype.socialLinks = function buildSocialLinks(accounts_links, props) {
		var props_array = [],
			ICON_SLUGS = {
				VK: 'vk',
				GOOGLE: 'google-plus',
				FACEBOOK: 'facebook-official'
			};
		
		$.each(OneUser.ACCOUNTS, function(slug, account) {
			var acc_props = {
				slug: account,
				icon_slug: ICON_SLUGS[slug]
			};
			
			if(accounts_links.hasOwnProperty(account)){
				acc_props.html_tag = 'a';
				acc_props.attributes = {
					href: accounts_links[account],
					target: '_blank'
				};
			} else {
				acc_props.html_tag = 'span';
			}
			
			props_array.push(Builder.normalizeBuildProps($.extend(acc_props, props)));
		});
		
		return tmpl('user-social-links-wrapper', {links: tmpl('user-social-link', props_array)});
	};
	/**
	 *
	 * @param users
	 * @param {buildProps} [props]
	 * @param {(Array<string>|string)} [props.avatar_classes]
	 * @param {(Array<string>|string)} [props.tombstone_classes]
	 * @param {boolean} [props.is_link]
	 * @returns {jQuery}
	 */
	Builder.prototype.userTombstones = function buildUserTombstones(users, props) {
		var self = this;
		
		props = Builder.normalizeBuildProps(props, ['avatar_classes', 'tombstone_classes']);
		props.avatar_classes.push('-rounded');
		props.avatar_classes.push('-size_'+ (props.size ? props.size : '70x70'));
		if (props.is_link) {
			props.html_tag = 'a';
			props.tombstone_classes.push('link Link');
		} else {
			props.html_tag = 'div';
		}
		
		return tmpl('user-tombstone', (users instanceof Array ? users : [users]).map(function(user) {
			if (props.is_link) {
				props.attributes.href = '/user/' + user.id;
			}
			return $.extend(true, {}, user, {
				avatar: self.avatars(user, {
					classes: props.avatar_classes
				}),
				name: user.full_name ? user.full_name : [user.first_name, user.last_name].join(' ')
			}, props);
		}));
	};
	/**
	 *
	 * @param {(OneUser|UsersCollection|OneOrganization|OrganizationsCollection|Array)} entities
	 * @param {buildProps} [props]
	 * @param {boolean} [props.is_link]
	 * @param {__C.ENTITIES} [props.entity]
	 * @param {(Array<string>|string)} [props.avatar_classes]
	 * @param {(Array<string>|string)} [props.block_classes]
	 * @returns {jQuery}
	 */
	Builder.prototype.avatarBlocks = function buildAvatarBlocks(entities, props) {
		var self = this;
		
		props = Builder.normalizeBuildProps(props, ['avatar_classes', 'block_classes']);
		if (props.is_link) {
			props.html_tag = 'a';
			props.block_classes.push('link','Link');
		} else {
			props.html_tag = 'div';
		}
		
		return tmpl('avatar-block', (entities instanceof Array ? entities : [entities]).map(function(entity) {
			var name, href;
			
			if((props.entity && props.entity === __C.ENTITIES.USER) || entity instanceof OneUser || entity.first_name){
				name = entity.full_name ? entity.full_name : (entity.first_name + ' ' + entity.last_name);
				href = '/user/' + entity.id;
			} else {
				name = entity.short_name ? entity.short_name : entity.name;
				href = '/organization/' + entity.id;
			}
			
			return $.extend(true, {
				id: entity.id,
				avatar: self.avatars(entity, {
					classes: props.avatar_classes
				}),
				attributes: {
					href: href
				},
				name: name
			}, props);
		}));
	};
	/**
	 *
	 * @param {(number|string)} org_id
	 * @param {OneUser.ROLE} role
	 * @param {buildProps} props
	 * @returns {jQuery}
	 */
	Builder.prototype.addUserAvatarBlock = function(org_id, role, props) {
		var name;
		
		props = Builder.normalizeBuildProps(props, ['avatar_classes', 'block_classes']);
		props.block_classes.push('link', __C.CLASSES.HOOKS.ADD_STAFF, __C.CLASSES.HOOKS.CALL_MODAL);
		
		switch (role) {
			case OneUser.ROLE.ADMIN: {
				name = 'Добавить администратора';
				break;
			}
			case OneUser.ROLE.MODERATOR: {
				name = 'Добавить модератора';
				break;
			}
		}
		
		return tmpl('avatar-block', $.extend({
			html_tag: 'div',
			name: name,
			avatar: tmpl('avatar', {
				classes: props.avatar_classes,
				avatar_url: window.location.origin + '/app/img/add_user.svg'
			})
		}, props)).data({
			modal_type: 'add_staff',
			modal_org_id: org_id,
			modal_role: role
		});
	};
	/**
	 *
	 * @param {(OneUser|UsersCollection|OneOrganization|OrganizationsCollection|Array)} entities
	 * @param {buildProps} [props]
	 * @returns {jQuery|undefined}
	 */
	Builder.prototype.avatars = function buildAvatars(entities, props) {
		var map = function() {},
			tmp = [],
			output_entities;
		if(!entities || (entities instanceof Array && !entities.length))
			return;
		props = Builder.normalizeBuildProps(props);
		function userMap(user) {
			return $.extend(true, {
				avatar_url: user.avatar_url,
				name: user.full_name ? user.full_name : (user.first_name + ' ' + user.last_name)
			}, props);
		}
		function orgMap(org) {
			return $.extend(true, {
				avatar_url: org.img_small_url ? org.img_small_url : org.img_url,
				name: org.short_name ? org.short_name : org.name
			}, props);
		}
		
		switch (true){
			case (entities instanceof OneUser):
			case (entities instanceof UsersCollection): {
				map = userMap;
				break;
			}
			case (entities instanceof OneOrganization):
			case (entities instanceof OrganizationsCollection): {
				map = orgMap;
				break;
			}
			default: {
				if(!(entities instanceof Array)){
					tmp = [entities];
				}
				map = tmp[0].avatar_url ? userMap : orgMap;
				break;
			}
		}
		output_entities = (entities instanceof Array) ? entities : [entities];
		
		return tmpl('avatar', output_entities.map(map));
	};
	/**
	 *
	 * @param {Array} entities
	 * @param {number} max_count
	 * @param {buildProps} [props]
	 * @param {boolean} [props.avatar_is_link]
	 * @param {number} [overall_avatars_count]
	 * @returns {jQuery}
	 */
	Builder.prototype.avatarCollection = function buildAvatarCollection(entities, max_count, props, overall_avatars_count) {
		var data = Builder.normalizeBuildProps(props, ['counter_classes']),
			i, count;
		
		data.dataset.max_amount = max_count;
		data.classes.push('-max_' + max_count);
		
		data.avatars = this.avatars(__APP.USER);
		for(i = 0, count = 1; count <= max_count; i++){
			if (!entities[i]) break;
			if (entities[i].id != __APP.USER.id) {
				data.avatars = data.avatars.add(this.avatars(entities[i]));
				count++;
			}
		}
		data.more_avatars_count = (count <= max_count) ? 0 : ( (overall_avatars_count ? overall_avatars_count : entities.length) - max_count );
		if(data.more_avatars_count <= 0){
			data.counter_classes.push('-cast');
		}
		
		return tmpl('avatars-collection', data);
	};
	/**
	 *
	 * @param {(OneAbstractActivity|Array<OneAbstractActivity>|UsersActivitiesCollection)} activities
	 * @param {buildProps} [props]
	 * @return {jQuery}
	 */
	Builder.prototype.activity = function buildActivity(activities, props){
		var build = this instanceof Builder ? this : new Builder(),
			ICON_CLASSES = {};
		
		ICON_CLASSES[OneAbstractActivity.TYPES.SUBSCRIBE] = 'plus';
		ICON_CLASSES[OneAbstractActivity.TYPES.FAVE] = 'star';
		ICON_CLASSES[OneAbstractActivity.TYPES.UNSUBSCRIBE] = ICON_CLASSES[OneAbstractActivity.TYPES.UNFAVE] = 'minus';
		
		props = Builder.normalizeBuildProps(props, ['avatar_classes']);
		props.avatar_classes.push(__C.CLASSES.SIZES.X50, __C.CLASSES.UNIVERSAL_STATES.ROUNDED);
		
		return tmpl('activity-block', (activities instanceof Array ? activities : [activities]).map(function(activity) {
			var entity_props = {},
				locales = __LOCALES.ru_RU.TEXTS.ACTIVITY[OneAbstractActivity.TYPES_INDEX[activity.type_code]];
			
			switch (true) {
				case (activity instanceof OneOrganizationActivity): {
					entity_props = {
						entity: 'organization',
						img_url: activity.organization.img_small_url ? activity.organization.img_small_url : activity.organization.img_url,
						entity_url: '/organization/'+activity.organization.id,
						hero_text: activity.organization.short_name
					};
					break;
				}
				case (activity instanceof OneEventActivity): {
					entity_props = {
						entity: 'event',
						img_url: activity.event.image_horizontal_small_url ? activity.event.image_horizontal_small_url : activity.event.image_horizontal_url,
						entity_url: '/event/'+activity.event.id,
						hero_text: activity.event.title
					};
					break;
				}
			}
			return $.extend(entity_props, {
				creator_avatar: build.avatars(activity.user, {
					classes: props.avatar_classes,
					is_link: props.avatar_is_link,
					badge: tmpl('avatar-badge', {icon_class: ICON_CLASSES[activity.type_code]})
				}),
				type_code: activity.type_code,
				additional_info: getGenderText(activity.user.gender, locales),
				creator_url: '/user/'+activity.user.id,
				creator_name: activity.user.full_name ? activity.user.full_name : (activity.user.first_name + ' ' + activity.user.last_name),
				date: moment.unix(activity.created_at).calendar(null, __LOCALES.ru_RU.DATE.CALENDAR_DATE_TIME)
			})
		}));
	};
	/**
	 *
	 * @param {(OneOrganization|Array<OneOrganization>|OrganizationsCollection)} organizations
	 * @param {object} [additional_fields]
	 * @returns {jQuery}
	 */
	Builder.prototype.organizationItems = function buildOrganizationItems(organizations, additional_fields) {
		organizations = organizations instanceof Array ? organizations : [organizations];
		var self = this,
			orgs = organizations.map(function(org) {
				org.counter_classes = org.new_events_count ? [] : [__C.CLASSES.HIDDEN];
				return org;
			});
		return tmpl('organization-item', orgs.map(function(organization) {
			return $.extend(true, {
				avatar_block: self.avatarBlocks(organization, {
					entity: __C.ENTITIES.ORGANIZATION,
					avatar_classes: [__C.CLASSES.SIZES.X30]
				})
			}, organization, Builder.normalizeBuildProps(additional_fields, ['avatar_classes', 'block_classes', 'counter_classes']));
		}));
	};
	/**
	 *
	 * @param {(Array<OneOrganization>|OrganizationsCollection)} organizations
	 * @returns {jQuery}
	 */
	Builder.prototype.organizationCard = function buildOrganisationCard(organizations) {
		var self = this;
		
		return tmpl('organization-card', organizations.map(function(org) {
			return $.extend(true, {}, org, {
				background_image: (org.background_small_img_url || org.background_img_url) ? self.link({
						page: '/organization/'+org.id,
						classes: ['organization_unit_background'],
						attributes: {
							style: 'background-image: url('+(org.background_small_img_url || org.background_img_url)+')'
						}
					}) : '',
				avatar: self.avatars(org, {
					classes: [
						'organization_unit_avatar',
						__C.CLASSES.SIZES.X55,
						__C.CLASSES.UNIVERSAL_STATES.BORDERED,
						__C.CLASSES.UNIVERSAL_STATES.ROUNDED,
						__C.CLASSES.UNIVERSAL_STATES.SHADOWED
					]
				}),
				subscribe_button: new SubscribeButton(org.id, {
					is_checked: org.is_subscribed,
					colors: {
						unchecked: __C.CLASSES.COLORS.MARGINAL_ACCENT,
						unchecked_hover: __C.CLASSES.COLORS.MARGINAL_ACCENT
					},
					has_icons: false,
					classes: [__C.CLASSES.SIZES.LOW, __C.CLASSES.HOOKS.RIPPLE]
				}),
				subscribed_text: org.subscribed_count + getUnitsText(org.subscribed_count, __LOCALES.ru_RU.TEXTS.SUBSCRIBERS),
				redact_org_button: (org.role === OneUser.ROLE.UNAUTH || org.role === OneUser.ROLE.USER) ? '' : self.link({
						classes: [
							'button',
							__C.CLASSES.SIZES.LOW,
							__C.CLASSES.COLORS.MARGINAL_PRIMARY,
							__C.CLASSES.ICON_CLASS,
							__C.CLASSES.ICONS.PENCIL,
							__C.CLASSES.UNIVERSAL_STATES.EMPTY,
							__C.CLASSES.HOOKS.RIPPLE
						],
						page: '/admin/organization/' + org.id + '/edit'
					})
			});
		}))
	};
	/**
	 *
	 * @param {Array<OneEvent>} events
	 * @param {OrganizationPage~EventType} type
	 * @returns {jQuery}
	 */
	Builder.prototype.eventBlocks = function buildEventBlocks(events, type) {
		var self = this;
		
		return tmpl('event-block', events.map(function(event) {
			var sort_date_type = type.sort_date_type ? type.sort_date_type : 'nearest_event_date',
				m_event_date = moment.unix(event[sort_date_type] ? event[sort_date_type] : event['first_event_date']),
				different_day = type.last_date != m_event_date.format(__C.DATE_FORMAT),
				avatars_collection_classes = [
					__C.CLASSES.UNIVERSAL_STATES.ROUNDED,
					__C.CLASSES.UNIVERSAL_STATES.BORDERED,
					__C.CLASSES.SIZES.SMALL,
					__C.CLASSES.HOOKS.ADD_AVATAR.COLLECTION,
					__C.CLASSES.HOOKS.CALL_MODAL
				],
				$action_buttons = $();
			
			if(event.is_favorite) {
				avatars_collection_classes.push(__C.CLASSES.HOOKS.ADD_AVATAR.STATES.SHIFTED);
			}
			
			if (event.is_favorite != null) {
				if (event.registration_locally || event.ticketing_locally) {
					$action_buttons = $action_buttons.add(new AddToFavoriteButton(event.id, {
						is_add_avatar: true,
						is_checked: event.is_favorite,
						classes: [
							__C.CLASSES.UNIVERSAL_STATES.EMPTY,
							__C.CLASSES.SIZES.LOW,
							__C.CLASSES.UNIVERSAL_STATES.ROUNDED,
							__C.CLASSES.HOOKS.ADD_TO_FAVORITES,
							__C.CLASSES.HOOKS.RIPPLE
						],
						labels: null
					}));
					
					if (event.ticketing_locally) {
						
					} else {
						$action_buttons = $action_buttons.add(new RegisterButton(event, {
							classes: [
								'event_block_main_action_button',
								__C.CLASSES.SIZES.LOW,
								__C.CLASSES.UNIVERSAL_STATES.ROUNDED,
								__C.CLASSES.HOOKS.ADD_TO_FAVORITES,
								__C.CLASSES.HOOKS.RIPPLE
							]
						}));
					}
				} else {
					$action_buttons = new AddToFavoriteButton(event.id, {
						is_add_avatar: true,
						is_checked: event.is_favorite,
						classes: [
							'event_block_main_action_button',
							__C.CLASSES.SIZES.LOW,
							__C.CLASSES.UNIVERSAL_STATES.ROUNDED,
							__C.CLASSES.HOOKS.ADD_TO_FAVORITES,
							__C.CLASSES.HOOKS.RIPPLE
						]
					});
				}
			}
			
			type.last_date = m_event_date.format(__C.DATE_FORMAT);
			
			return $.extend({}, event, {
				cover_width: 550,
				divider: different_day ? tmpl('divider', {
						title: m_event_date.calendar().capitalize()
					}) : '',
				action_buttons: $action_buttons,
				date: m_event_date.format(__C.DATE_FORMAT),
				avatars_collection: self.avatarCollection(event.favored, 3, {
					dataset: {
						modal_type: 'favors',
						modal_event_id: event.id
					},
					classes: avatars_collection_classes,
					counter_classes: [__C.CLASSES.SIZES.X30, __C.CLASSES.UNIVERSAL_STATES.BORDERED, __C.CLASSES.COLORS.MARGINAL, __C.CLASSES.HOOKS.ADD_AVATAR.STATES.CASTABLE]
				}, event.favored_users_count),
				time: event.dates.reduce(function(times, date) {
					if (moment.unix(date.event_date).format(__C.DATE_FORMAT) == m_event_date.format(__C.DATE_FORMAT)) {
						times.push(displayTimeRange(date.start_time, date.end_time));
					}
					return times;
				}, []).join('; ')
			})
		}));
	};
	/**
	 *
	 * @param {OneCategory|Array<OneCategory>} categories
	 * @returns {jQuery}
	 */
	Builder.prototype.organisationsCategoriesItems = function buildOrganisationsCategoriesItems(categories) {
		if (!(categories instanceof Array))
			categories = [categories];
		return tmpl('organization-category', categories.map(function(cat) {
			var is_parent_category = true,
				new_events_count,
				aside_classes = [];
			
			if (cat.organizations && cat.organizations.new_events_count) {
				if (is_parent_category) {
					new_events_count = cat.organizations.reduce(function(sum, org) {
						return sum + org.new_events_count;
					}, 0);
					aside_classes = new_events_count ? ['counter'] : ['counter', __C.CLASSES.HIDDEN];
				} else {
					aside_classes = ['fa_icon', 'fa-angle-down', '-empty'];
				}
			} else {
				new_events_count = '';
				aside_classes = [__C.CLASSES.HIDDEN];
			}
			return {
				category_id: cat.id,
				category_name: cat.name,
				order_position: cat.order_position,
				aside_classes: aside_classes,
				new_events_count: is_parent_category ? '+' + new_events_count : ''
			}
		}));
	};
	/**
	 *
	 * @param {Array} subscribers
	 * @param {boolean} [last_is_fiend]
	 * @returns {jQuery}
	 */
	Builder.prototype.subscribers = function buildSubscribers(subscribers, last_is_fiend) {
		var self = this;
		
		return tmpl('subscriber', subscribers.map(function(subscriber, i) {
			var append_divider = (typeof last_is_fiend == 'undefined') || last_is_fiend != subscriber.is_friend;
			
			last_is_fiend = subscriber.is_friend;
			return {
				divider: append_divider ? tmpl('subscriber-divider', {label: subscriber.is_friend ? 'Друзья' : 'Все подписчики'}) : '',
				avatar_block: self.avatarBlocks(subscriber, {
					is_link: true,
					entity: __C.ENTITIES.USER,
					avatar_classes: [
						__C.CLASSES.SIZES.X40,
						__C.CLASSES.UNIVERSAL_STATES.ROUNDED,
						__C.CLASSES.UNIVERSAL_STATES.BORDERED,
						__C.CLASSES.UNIVERSAL_STATES.SHADOWED
					],
					block_classes: ['subscriber']
				})
			};
		}));
	};
	/**
	 *
	 * @param {(OneEvent|Array<OneEvent>|EventsCollection)} events
	 * @returns {jQuery}
	 */
	Builder.prototype.eventCards = function buildEventCards(events) {
		var self = this,
			$events,
			_events = events instanceof Array ? events : [events];
		
		$events = tmpl('event-card', _events.map(function(event) {
			var card_cover_width = 405,
				avatars_collection_classes = [
					__C.CLASSES.UNIVERSAL_STATES.ROUNDED,
					__C.CLASSES.UNIVERSAL_STATES.BORDERED,
					__C.CLASSES.SIZES.SMALL,
					__C.CLASSES.HOOKS.ADD_AVATAR.COLLECTION,
					__C.CLASSES.HOOKS.CALL_MODAL
				],
				feed_event_infos = [],
				organization = new OneOrganization(event.organization_id),
				$action_button,
				$header_buttons = $();
			
			organization.setData({
				short_name: event.organization_short_name,
				img_url: event.organization_logo_small_url
			});
			
			
			if (event.registration_locally || event.ticketing_locally) {
				$header_buttons = new AddToFavoriteButton(event.id, {
					is_add_avatar: true,
					is_checked: event.is_favorite,
					classes: [
						'feed_event_header_button',
						__C.CLASSES.SIZES.LOW,
						__C.CLASSES.UNIVERSAL_STATES.EMPTY
					],
					labels: null,
					icons: {
						checked_hover: __C.CLASSES.ICONS.STAR
					},
					colors: {
						checked: __C.CLASSES.TEXT_COLORS.ACCENT,
						unchecked: '',
						checked_hover: __C.CLASSES.TEXT_COLORS.ACCENT,
						unchecked_hover: ''
					}
				});
				
				if (event.ticketing_locally) {
					
				} else {
					$action_button = new RegisterButton(event, {
						classes: [
							__C.CLASSES.SIZES.LOW,
							__C.CLASSES.SIZES.WIDE,
							__C.CLASSES.UNIVERSAL_STATES.ROUNDED,
							__C.CLASSES.HOOKS.RIPPLE
						]
					});
				}
			} else {
				$action_button = new AddToFavoriteButton(event.id, {
					is_add_avatar: true,
					is_checked: event.is_favorite,
					classes: [
						__C.CLASSES.SIZES.LOW,
						__C.CLASSES.SIZES.WIDE,
						__C.CLASSES.UNIVERSAL_STATES.ROUNDED,
						__C.CLASSES.HOOKS.RIPPLE
					]
				})
			}
			
			$header_buttons = $header_buttons.add(self.button({
				classes: [
					'feed_event_header_button',
					__C.CLASSES.SIZES.LOW,
					__C.CLASSES.UNIVERSAL_STATES.EMPTY,
					'HideEvent'
				],
				dataset: {
					'event-id': event.id
				},
				title: '×'
			}));
			
			if (event.is_favorite) {
				avatars_collection_classes.push(__C.CLASSES.HOOKS.ADD_AVATAR.STATES.SHIFTED);
			}
			feed_event_infos.push({
				text: displayDateRange(event.dates[0].event_date, event.dates[event.dates.length - 1].event_date)
				+ (event.is_same_time ? ', ' + displayTimeRange(event.dates[0].start_time, event.dates[0].end_time) : '')
			});
			if (event.registration_required && event.registration_till) {
				feed_event_infos.push({text: 'Регистрация до ' + moment.unix(event.registration_till).calendar().capitalize()});
			}
			if (event.is_free) {
				feed_event_infos.push({text: 'Бесплатно'});
			} else {
				feed_event_infos.push({text: 'Цена от ' + (event.min_price ? formatCurrency(event.min_price) : 0) + ' руб.'});
			}
			
			return $.extend(true, {
				cover_width: card_cover_width,
				organization_avatar_block: self.avatarBlocks(organization, {
					block_classes: [__C.CLASSES.SIZES.SMALL],
					is_link: true,
					entity: __C.ENTITIES.ORGANIZATION
				}),
				action_button: $action_button,
				avatars_collection: self.avatarCollection(event.favored, 4, {
					dataset: {
						modal_type: 'favors',
						modal_event_id: event.id
					},
					classes: avatars_collection_classes,
					counter_classes: [
						__C.CLASSES.SIZES.X30,
						__C.CLASSES.UNIVERSAL_STATES.BORDERED,
						__C.CLASSES.COLORS.MARGINAL_PRIMARY,
						__C.CLASSES.HOOKS.ADD_AVATAR.STATES.CASTABLE
					]
				}, event.favored_users_count),
				feed_event_infos: tmpl('event-card-info', feed_event_infos),
				header_buttons: $header_buttons
			}, event);
		}));
		
		_events.forEach(function(event, i) {
			$events.eq(i).appear(function() {
				storeStat(event.id, __C.STATS.EVENT_ENTITY, __C.STATS.EVENT_VIEW);
			}, {accY: 100})
		});
		
		if(__APP.USER.isLoggedOut()){
			$events.find('.HideEvent').remove();
		}
		
		return $events;
	};
	
	/**
	 *
	 * @param {(OneExtendedTicket|Array<OneExtendedTicket>|ExtendedTicketsCollection)} tickets
	 * @return Array
	 */
	Builder.normalizeTicketProps = function(tickets) {
		
		return (tickets instanceof Array ? tickets : [tickets]).map(function(ticket) {
			var props = Builder.normalizeBuildProps({
				card_classes: [],
				title: ticket.event.title,
				location: ticket.event.location,
				status_name: ticket.status_name,
				status_type_code: ticket.status_type_code,
				ticket_type_name: ticket.ticket_type.name,
				image_horizontal_url: ticket.event.image_horizontal_url,
				image_horizontal_large_url: ticket.event.image_horizontal_large_url || ticket.event.image_horizontal_url,
				image_horizontal_medium_url: ticket.event.image_horizontal_medium_url
			}, ['card_classes']),	event_date;
			
			switch (props.status_type_code) {
				case OneExtendedTicket.TICKET_STATUSES.PAYED:
				case OneExtendedTicket.TICKET_STATUSES.APPROVED:
				case OneExtendedTicket.TICKET_STATUSES.WITHOUT_PAYMENT: {
					props.card_classes.push(__C.CLASSES.STATUS.SUCCESS);
					break;
				}
				case OneExtendedTicket.TICKET_STATUSES.IS_PENDING:
				case OneExtendedTicket.TICKET_STATUSES.WAITING_FOR_PAYMENT: {
					props.card_classes.push(__C.CLASSES.STATUS.PENDING);
					break;
				}
				case OneExtendedTicket.TICKET_STATUSES.REJECTED:
				case OneExtendedTicket.TICKET_STATUSES.RETURNED_BY_CLIENT:
				case OneExtendedTicket.TICKET_STATUSES.RETURNED_BY_ORGANIZATION: {
					props.card_classes.push(__C.CLASSES.STATUS.ERROR);
					break;
				}
			}
			
			switch (props.status_type_code) {
				case OneExtendedTicket.TICKET_STATUSES.IS_PENDING:
				case OneExtendedTicket.TICKET_STATUSES.WAITING_FOR_PAYMENT:
				case OneExtendedTicket.TICKET_STATUSES.RETURNED_BY_ORGANIZATION:
				case OneExtendedTicket.TICKET_STATUSES.RETURNED_BY_CLIENT:
				case OneExtendedTicket.TICKET_STATUSES.REJECTED: {
					props.card_classes.push(__C.CLASSES.STATUS.DISABLED);
					break;
				}
				default: {
					props.card_classes.push(__C.CLASSES.HOOKS.CALL_MODAL);
					break;
				}
			}
			
			if (ticket.event.is_same_time) {
				event_date = ticket.event.dates[0];
				props.formatted_dates = displayDateRange(event_date.event_date, ticket.event.dates[ticket.event.dates.length - 1].event_date) + ', ' + displayTimeRange(event_date.start_time, event_date.end_time);
			} else {
				event_date = ticket.event.nearest_event_date;
				props.formatted_dates = displayDateRange(event_date, event_date);
			}
			
			return props;
		});
	};
	/**
	 *
	 * @param {(OneExtendedTicket|Array<OneExtendedTicket>|ExtendedTicketsCollection)} tickets
	 * @return {jQuery}
	 */
	Builder.prototype.ticketCards = function buildTicketCard(tickets) {
		
		return tmpl('ticket-card', Builder.normalizeTicketProps(tickets).map(function(ticket) {
			ticket.cover_width = 260;
			return ticket;
		})).each(function(i, ticket) {
			$(ticket).data({
				modal_type: __C.MODAL_TYPES.TICKET,
				tickets: tickets[i]
			});
		});
	};
	/**
	 *
	 * @param {{
		 *    [type]: string,
		 *    [content]: string|jQuery,
		 *    [classes]: Array<string>|string,
		 *    [content_classes]: Array<string>|string,
		 *    [width]: (number|string),
		 *    [height]: (number|string),
		 *    [header]: jQuery,
		 *    [title]: string,
		 *    [footer]: jQuery,
		 *    [footer_buttons]: jQuery
		 *    [dataset]: object
		 *    [attributes]: object
		 * }} props
	 * @return {jQuery}
	 */
	Builder.prototype.modal = function(props) {
		var $modal,
			normalized_props = Builder.normalizeBuildProps(props, ['content_classes']),
			vars = {
				modal_header: '',
				modal_type: normalized_props.type,
				modal_content: normalized_props.content,
				modal_classes: normalized_props.classes,
				modal_content_classes: normalized_props.content_classes,
				modal_footer: ''
			};
		
		if(normalized_props.header){
			vars.modal_header = normalized_props.header;
		} else if(normalized_props.title) {
			vars.modal_header = tmpl('modal-header', {
				title: normalized_props.title,
				close_button: this.button({
					classes: [__C.CLASSES.UNIVERSAL_STATES.EMPTY, '-modal_destroyer', __C.CLASSES.HOOKS.CLOSE_MODAL, __C.CLASSES.HOOKS.RIPPLE],
					title: '×'
				})
			});
		}
		
		if(normalized_props.footer){
			vars.modal_footer = normalized_props.footer;
		} else if(normalized_props.footer_buttons) {
			vars.modal_footer = tmpl('modal-footer', {footer_buttons: normalized_props.footer_buttons});
		}
		
		$modal = tmpl('modal', vars);
		if(normalized_props.width){
			$modal.width(normalized_props.width);
		}
		if(normalized_props.height){
			$modal.height(normalized_props.height);
		}
		
		return $modal;
	};
	
	
	return Builder;
}());
/**
 * @abstract
 * @class
 */
AbstractTopBar = (function () {
	/**
	 *
	 * @constructor
	 * @constructs AbstractTopBar
	 *
	 * @property {jQuery} $main_header
	 */
	function AbstractTopBar() {
		this.$main_header = $('#main_header');
	}
	
	AbstractTopBar.prototype.init = function () {
		var $overlay = this.$main_header.find('.TopBarOverlay'),
			$search_button = $overlay.find('.TopBarSearchButton'),
			$search_input = $overlay.find('.TopBarSearchInput');
			
		$search_button.on('click.OpenSearchBar', function() {
			if ($overlay.hasClass('-open_search_bar')) {
				__APP.changeState('/search/' + encodeURIComponent($search_input.val()));
			} else {
				$overlay.addClass('-open_search_bar');
				$search_input.focus();
			}
		});
		
		$search_input.on('keypress', function(e) {
			if (e.which === 13) {
				__APP.changeState('/search/' + encodeURIComponent($search_input.val()));
			}
		}).on('keydown', function(e) {
			if (e.keyCode === 27) {
				$overlay.removeClass('-open_search_bar');
				$search_input.val('');
			}
		}).on('blur', function() {
			if ($search_input.val() === '') {
				$overlay.removeClass('-open_search_bar');
			}
		});
		
		this.$main_header.find('.SidebarBurger').add($('.MainSectionCap')).on('click', function() {
			$('body').toggleClass('-open_sidebar');
		});
		
		bindRippleEffect(this.$main_header);
		bindPageLinks(this.$main_header);
	};
	
	return AbstractTopBar;
}());
/**
 * @requires Class.AbstractTopBar.js
 */
/**
 * @class
 * @extends AbstractTopBar
 */
TopBar = extending(AbstractTopBar, (function () {
	/**
	 *
	 * @constructor
	 * @constructs TopBar
	 */
	function TopBar() {
		AbstractTopBar.call(this);
	}
	
	TopBar.prototype.init = function () {
		AbstractTopBar.prototype.init.call(this);
	};
	
	return TopBar;
}()));
/**
 * @requires Class.AbstractTopBar.js
 */
/**
 * @class
 * @extends AbstractTopBar
 */
TopBarNoAuth = extending(AbstractTopBar, (function () {
	/**
	 *
	 * @constructor
	 * @constructs TopBarNoAuth
	 */
	function TopBarNoAuth() {
		AbstractTopBar.call(this);
	}
	
	TopBarNoAuth.prototype.init = function () {
		this.$main_header.find('.LoginButton').on('click', function() {
			cookies.removeItem('auth_command');
			cookies.removeItem('auth_entity_id');
			(new AuthModal(location.href)).show();
		});
		AbstractTopBar.prototype.init.call(this);
	};
	
	return TopBarNoAuth;
}()));
/**
 * @abstract
 * @class
 */
AbstractSidebar = (function () {
	/**
	 *
	 * @constructor
	 * @constructs AbstractSidebar
	 */
	function AbstractSidebar() {
		this.$sidebar = $('#main_sidebar');
		this.$subscribed_orgs = $('.SidebarOrganizationsList');
	}
	
	AbstractSidebar.prototype.init = function () {
		this.$sidebar.find('.SidebarNav').addClass('-items_' + this.$sidebar.find('.SidebarNavItem').not('.-hidden').length);
		this.$sidebar.find('.SidebarScroll').scrollbar({
			disableBodyScroll: true
		});
	};
	
	AbstractSidebar.prototype.updateSubscriptions = function () {};
	
	return AbstractSidebar;
}());
/**
 * @requires Class.AbstractSidebar.js
 */
/**
 * @class
 * @extends AbstractSidebar
 */
Sidebar = extending(AbstractSidebar, (function () {
	/**
	 *
	 * @constructor
	 * @construct Sidebar
	 */
	function Sidebar() {
		AbstractSidebar.call(this);
	}
	
	Sidebar.prototype.init = function () {
		var self = this;
		self.updateSubscriptions();
		$(window).on('subscribe unsubscribe', function() {
			self.updateSubscriptions();
		});
		
		AbstractSidebar.prototype.init.call(this);
	};
	
	Sidebar.prototype.updateSubscriptions = function() {
		var $subscribed_orgs = this.$subscribed_orgs,
			timing = 0,
			current_menu_items = $.map($subscribed_orgs.children(), function(el) {
				return $(el).data('organization_id');
			}),
			to_add = __APP.USER.subscriptions.filter(function(item) {
				return current_menu_items.indexOf(item.id) === -1;
			}),
			to_remove = current_menu_items.filter(function(item) {
				return !(__APP.USER.subscriptions.has(item));
			});
		
		if (to_add.length) {
			__APP.BUILD.organizationItems(to_add, {
				block_classes: ['animated'],
				avatar_classes: ['-size_30x30']
			})
				[($subscribed_orgs.length ? 'prependTo' : 'appendTo')]($subscribed_orgs)
				.each(function(i, org_block) {
					setTimeout(function() {
						$(org_block).addClass('-show');
					}, timing += 100);
				});
			
			bindPageLinks($subscribed_orgs);
		}
		if (to_remove.length) {
			to_remove.forEach(function(id) {
				var $organization_item = $subscribed_orgs.find('.organization_item[data-organization_id="' + id + '"]').removeClass('-show');
				setTimeout(function() {
					$organization_item.remove();
				}, 500);
			});
		}
	};
	
	return Sidebar;
}()));
/**
 * @requires Class.AbstractSidebar.js
 */
/**
 * @class
 * @extends AbstractSidebar
 */
SidebarNoAuth = extending(AbstractSidebar, (function () {
	/**
	 *
	 * @constructor
	 * @constructs SidebarNoAuth
	 */
	function SidebarNoAuth() {
		AbstractSidebar.call(this);
	}
	
	SidebarNoAuth.prototype.init = function () {
		this.$sidebar.find('.SidebarOrganizationsScroll').addClass(__C.CLASSES.HIDDEN);
		AbstractSidebar.prototype.init.call(this);
	};
	
	return SidebarNoAuth;
}()));
/**
 *
 * @abstract
 * @class
 */
Page = (function() {
	/**
	 *
	 * @constructor
	 * @constructs Page
	 *
	 * @property {string} name
	 * @property {string} state_name
	 * @property {string} page_title
	 * @property {(jQuery|Array|string)} page_title_obj
	 * @property {jQuery} $view
	 * @property {jQuery} $wrapper
	 * @property {string} wrapper_tmpl
	 * @property {boolean} with_header_tabs
	 *
	 * @property {jqPromise} rendering_defer
	 * @property {jqPromise} fetching_data_defer
	 */
	function Page() {
		this.name = this.constructor.name;
		this.state_name = this.name;
		this.page_title = setDefaultValue(this.page_title, '');
		this.page_title_obj = setDefaultValue(this.page_title_obj, '');
		/**
		 * @name Page#$view
		 * @type jQuery
		 */
		this.$view = setDefaultValue(this.$view, $('.PageView'));
		/**
		 * @name Page#$wrapper
		 * @type jQuery
		 */
		this.$wrapper = setDefaultValue(this.$wrapper, $());
		this.wrapper_tmpl = setDefaultValue(this.wrapper_tmpl, 'std');
		this.with_header_tabs = setDefaultValue(this.with_header_tabs, false);
		
		this.rendering_defer = $.Deferred();
		this.fetching_data_defer = $.Deferred();
	}
	/**
	 * Routing
	 * @param {string} path
	 * @return {Page}
	 */
	Page.routeNewPage = function(path) {
		var path_map = decodeURIComponent(path).split('/'),
			args = [],
			PageClass;
		
		PageClass = path_map.reduce(function(tree_chunk, path_chunk) {
			if (!path_chunk)
				return tree_chunk;
			
			if (tree_chunk.hasOwnProperty(path_chunk))
				return tree_chunk[path_chunk];
			else
				return Object.keys(tree_chunk).reduce(function(found_chunk, key) {
					if (!found_chunk && key.indexOf('^') === 0 && (new RegExp(key)).test(path_chunk)) {
						args.push(path_chunk);
						
						return tree_chunk[key];
					}
					
					return found_chunk;
				}, false);
			
		}, __APP.ROUTING);
		
		PageClass = (PageClass.prototype instanceof Page) ? PageClass : ((PageClass[''] && PageClass[''].prototype instanceof Page) ? PageClass[''] : NotFoundPage); // Open default page
		return new (Function.prototype.bind.apply(PageClass, [null].concat(args)))(); // new Page(...args)
	};
	
	Page.prototype.show = function() {
		var PAGE = this,
			$main_header = $('#main_header'),
			is_other_page = __APP.PREVIOUS_PAGE.wrapper_tmpl !== PAGE.wrapper_tmpl,
			wrapper_field = is_other_page ? '$view' : '$wrapper',
			$prev = __APP.PREVIOUS_PAGE[wrapper_field].length ? __APP.PREVIOUS_PAGE[wrapper_field] : is_other_page ? $('.PageView') : $('.PageView').find('.Content');
		$prev.addClass('-faded');
		
		setTimeout(function() {
			$prev.addClass(__C.CLASSES.HIDDEN);
			
			if (PAGE.with_header_tabs) {
				$main_header.addClass('-with_tabs');
			} else {
				$main_header.removeClass('-with_tabs');
			}
			
			$('body').removeClass(function(index, css) {
				return (css.match(/(^|\s)-state_\S+/g) || []).join(' ');
			}).addClass('-state_' + PAGE.state_name.toUnderscore());
			
			if (is_other_page) {
				PAGE.$view.html(tmpl(PAGE.wrapper_tmpl + '-wrapper', {}));
			}
			PAGE.$wrapper = PAGE.$view.find('.Content');
			PAGE.$wrapper.empty();
			
			PAGE.$view.removeClass(__C.CLASSES.HIDDEN);
			PAGE.$wrapper.removeClass(__C.CLASSES.HIDDEN);
			PAGE[wrapper_field].addClass('-faded');
			
			PAGE.rendering_defer.resolve();
		}, 200);
		
		$.when(PAGE.rendering_defer, PAGE.fetching_data_defer).done(function pageRender(){
			if (PAGE.page_title_obj || PAGE.page_title) {
				__APP.changeTitle(PAGE.page_title_obj ? PAGE.page_title_obj : PAGE.page_title);
			}
			PAGE.renderHeaderTabs();
			$(window).scrollTop(0);
			PAGE.render();
			bindPageLinks();
			setTimeout(function() {
				PAGE[wrapper_field].removeClass('-faded');
			}, 200);
		});
	};
	
	Page.prototype.renderHeaderTabs = function() {};
	
	Page.prototype.fetchData = function() {
		return this.fetching_data_defer.resolve().promise();
	};
	
	Page.prototype.render = function() {};
	
	Page.prototype.destroy = function() {};
	
	return Page;
}());
/**
 * @requires ../Class.Page.js
 */
/**
 *
 * @abstract
 * @class AdminPage
 * @extends Page
 */
AdminPage = extending(Page, (function() {
	/**
	 *
	 * @constructor
	 * @constructs AdminPage
	 */
	function AdminPage() {
		Page.apply(this);
		this.state_name = 'admin';
		this.SCALES = {
			MINUTE: 'minute',
			HOUR: 'hour',
			DAY: 'day',
			WEEK: 'week',
			MONTH: 'month',
			YEAR: 'year',
			OVERALL: 'overall'
		};
		this.highchart_defaults = {
			chart: {
				backgroundColor: null,
				plotBorderWidth: null,
				plotShadow: false,
				style: {
					fontFamily: 'inherit',
					fontSize: 'inherit'
				}
			},
			title: {
				text: false
			},
			credits: {
				enabled: false
			}
		};
	}
	/**
	 *
	 * @param {object} raw_data
	 * @returns {object}
	 */
	AdminPage.prototype.areaChartSeriesNormalize = function(raw_data) {
		var CONVERSATIONS = {
				open_conversion: {
					with: 'open_site',
					to: 'view'
				},
				fave_conversion: {
					with: 'fave',
					to: 'open_site'
				},
				conversion: {
					with: 'subscribe',
					to: 'view'
				}
			},
			COMPARISONS = {
				subscribe_unsubscribe: {
					subscribe: 'subscribe',
					unsubscribe: 'unsubscribe'
				}
			},
			STD_NAMES = {
				'notifications_sent': 'Отправлено уведомлений',
				'view': 'Просмотры',
				'view_detail': 'Открытий страницы события из ленты Evendate',
				'conversion': 'Конверсия',
				'subscribe': 'Подписалось',
				'unsubscribe': 'Отписалось',
				'open_site': 'Открытий страницы события',
				'open_conversion': 'Конверсия просмотра события в ленте к открытию страницы события',
				'fave': 'Кол-во пользователей, которые добавили событие в избранное',
				'fave_conversion': 'Конверсия открытия страницы события к добавлениям в избранное'
			},
			HIDDEN_SERIES_OPTIONS = {
				showInLegend: false,
				lineWidth: 0,
				fillOpacity: 0,
				states: {
					hover: {
						enabled: false
					}
				}
			},
			output = {};
		
		function dataNormalize(raw_data, field, value_field_name) {
			return {
				name: STD_NAMES[field],
				data: raw_data.map(function(line, i) {
					return [moment.unix(line.time_value).valueOf(), line[value_field_name]];
				})
			}
		}
		
		
		$.each(raw_data, function(key, data){
			output[key] = [];
			if(CONVERSATIONS.hasOwnProperty(key)){
				output[key].push($.extend(true, { tooltip: {valueSuffix: ' %'} }, dataNormalize(data, key, 'value')));
				$.each(CONVERSATIONS[key], function(field_key, field) {
					output[key].push($.extend(true, {}, HIDDEN_SERIES_OPTIONS, dataNormalize(data, field, field_key)));
				})
			}
			else if(COMPARISONS.hasOwnProperty(key)) {
				$.each(COMPARISONS[key], function(field_key, field) {
					output[key].push(dataNormalize(data, field, field_key));
				})
			}
			else {
				output[key].push(dataNormalize(data, key, 'value'));
			}
		});
		
		return output;
	};
	/**
	 *
	 * @param {object} data
	 * @param {object} [additional_options]
	 */
	AdminPage.prototype.buildAreaCharts = function(data, additional_options) {
		var self = this,
			normalized_series = self.areaChartSeriesNormalize(data),
			FIELDS = {
				notifications_sent: {
					title: 'Отправлено уведомлений пользователям',
					wrapper_class: 'NotificationsSentAreaChart'
				},
				view: {
					title: 'Просмотры',
					wrapper_class: 'ViewAreaChart'
				},
				view_detail: {
					title: 'Открытий страницы события',
					wrapper_class: 'ViewDetailAreaChart'
				},
				open_site: {
					title: 'Открытий страницы события из ленты Evendate',
					wrapper_class: 'OpenSiteAreaChart'
				},
				open_conversion: {
					title: 'Конверсия просмотров/открытий',
					wrapper_class: 'OpenConversionsAreaChart'
				},
				fave: {
					title: 'Добавлений в избранное',
					wrapper_class: 'FaveAreaChart'
				},
				fave_conversion: {
					title: 'Конверсия открытий/добавлений в избранное',
					wrapper_class: 'FaveConversionsAreaChart'
				},
				subscribe_unsubscribe: {
					title: 'Подписчики',
					wrapper_class: 'SubscriberAreaChart'
				},
				conversion: {
					title: 'Конверсия просмотров/подписок',
					wrapper_class: 'ConversionAreaChart'
				}
			},
			FILL_COLORS = [
				['rgba(35, 215, 146, 0.18)', 'rgba(101, 101, 101, 0.6)', 'rgba(101, 101, 101, 0.6)'],
				['rgba(35, 215, 146, 0.09)', 'rgba(101, 101, 101, 0.6)', 'rgba(101, 101, 101, 0.6)']
			],
			area_chart_options = $.extend(true, {}, self.highchart_defaults, {
				chart: {
					type: 'areaspline',
					plotBackgroundColor: '#fcfcfc',
					plotBorderColor: '#ebebeb',
					plotBorderWidth: 1
				},
				colors: [__C.COLORS.FRANKLIN, __C.COLORS.MUTED_80, __C.COLORS.ACCENT, __C.COLORS.MUTED, __C.COLORS.MUTED_50, __C.COLORS.MUTED_30],
				title: {
					align: 'left',
					margin: 20
				},
				legend: {
					enabled: true,
					align: 'left',
					itemStyle: {color: __C.COLORS.TEXT, cursor: 'pointer', fontSize: '14px', fontWeight: '500', y: 0},
					itemMarginTop: 24,
					itemMarginBottom: 5,
					symbolHeight: 18,
					symbolWidth: 18,
					symbolRadius: 9,
					itemDistance: 42,
					x: 30
				},
				plotOptions: {
					series: {
						states: {
							hover: {
								lineWidth: 2
							}
						}
					},
					areaspline: {
						fillOpacity: 0.5,
						marker: {
							enabled: false,
							symbol: 'circle',
							radius: 2,
							states: {
								hover: {
									enabled: true
								}
							}
						},
						dataGrouping: {
							dateTimeLabelFormats: {
								millisecond: ['%b %e, %H:%M:%S.%L', '%b %e, %H:%M:%S.%L', '-%H:%M:%S.%L'],
								second: ['%b %e, %H:%M:%S', '%b %e, %H:%M:%S', '-%H:%M:%S'],
								minute: ['%b %e, %H:%M', '%b %e, %H:%M', '-%H:%M'],
								hour: ['%b %e, %H:%M', '%b %e, %H:%M', '-%H:%M'],
								day: ['%b %e, %Y', '%b %e', '-%b %e, %Y'],
								week: ['%b %e, %Y', '%b %e', '-%b %e, %Y'],
								month: ['%B %Y', '%B', '-%B %Y'],
								year: ['%Y', '%Y', '-%Y']
							}
						}
					}
				},
				tooltip: {
					headerFormat: '<b>{point.key}</b><br/>',
					positioner: function(labelWidth, labelHeight) {
						return {
							x: this.chart.plotLeft,
							y: this.chart.plotTop
						};
					},
					shadow: false,
					shape: 'square',
					valueDecimals: 0,
					xDateFormat: '%e %b %Y',
					shared: true
				},
				scrollbar: {enabled: false},
				navigator: {
					outlineColor: '#ebebeb',
					outlineWidth: 1,
					maskInside: false,
					maskFill: 'rgba(245, 245, 245, 0.66)',
					handles: {
						backgroundColor: '#9fa7b6',
						borderColor: '#fff'
					},
					xAxis: {
						gridLineWidth: 0,
						labels: {
							align: 'left',
							reserveSpace: true,
							style: {
								color: '#888'
							},
							x: 0,
							y: null
						}
					}
				},
				rangeSelector: {
					buttonTheme: {
						width: null,
						height: 22,
						fill: 'none',
						stroke: 'none',
						r: 14,
						style: {
							color: __C.COLORS.MUTED_80,
							fontSize: '13px',
							fontWeight: '400',
							textTransform: 'uppercase',
							dominantBaseline: 'middle'
						},
						states: {
							hover: {
								fill: __C.COLORS.MUTED_50,
								style: {
									color: '#fff'
								}
							},
							select: {
								fill: __C.COLORS.MUTED_80,
								style: {
									color: '#fff',
									fontWeight: '400'
								}
							}
						}
					},
					buttons: [{
						type: 'day',
						count: 7,
						text: "\xa0\xa0\xa0Неделя\xa0\xa0\xa0"
					}, {
						type: 'month',
						count: 1,
						text: "\xa0\xa0\xa0Месяц\xa0\xa0\xa0"
					}, {
						type: 'year',
						count: 1,
						text: "\xa0\xa0\xa0Год\xa0\xa0\xa0"
					}, {
						type: 'all',
						text: "\xa0\xa0\xa0Все\xa0время\xa0\xa0\xa0"
					}],
					allButtonsEnabled: true,
					selected: 2,
					labelStyle: {
						display: 'none'
					},
					inputEnabled: false
				},
				xAxis: {
					gridLineWidth: 1,
					gridLineDashStyle: 'dash',
					type: 'datetime',
					showEmpty: false,
					tickPosition: 'inside',
					dateTimeLabelFormats: {
						minute: '%H:%M',
						hour: '%H:%M',
						day: '%e %b',
						week: '%e %b',
						month: '%b %y',
						year: '%Y'
					}
				},
				yAxis: {
					allowDecimals: false,
					floor: 0,
					min: 0,
					gridLineDashStyle: 'dash',
					opposite: false,
					title: {
						text: false
					}
				}
			}, additional_options);
		
		$.each(normalized_series, function(key) {
			var field_data = {
				title: {text: FIELDS[key].title}
			};
			
			field_data.series = normalized_series[key].map(function(series_unit, i) {
				if (series_unit.fillOpacity !== 0) {
					return $.extend(true, {}, series_unit, {
						fillColor: {
							linearGradient: {x1: 0, x2: 0, y1: 0, y2: 1},
							stops: FILL_COLORS.map(function(colors_set, j) {
								return [j, colors_set[i]];
							})
						}
					})
				}
				return series_unit;
			});
			
			if (key == 'conversion' || key == 'open_conversion' || key == 'fave_conversion') {
				field_data.yAxis = {
					max: 100,
					labels: {
						format: '{value}%'
					}
				};
			}
			
			self.$wrapper.find('.' + FIELDS[key].wrapper_class).highcharts('StockChart', $.extend(true, {}, area_chart_options, field_data));
		});
	};
	/**
	 *
	 * @param {jQuery} $scoreboards_wrapper
	 * @param {object} data
	 * @param {object} data.numbers
	 * @param {object} [data.dynamics]
	 * @param {object} [titles]
	 * @param {Array} [order]
	 * @param {string} [size="normal"]
	 */
	AdminPage.prototype.updateScoreboards = function($scoreboards_wrapper, data, titles, order, size) {
		var with_dynamics = !!data.dynamics;
		if (!order)
			order = Object.keys(titles);
		
		order.forEach(function(field) {
			var scoreboard_type = 'Scoreboard' + field.toCamelCase('_'),
				$scoreboard = $scoreboards_wrapper.find('.' + scoreboard_type),
				measure;
			
			switch (field) {
				case 'conversion':
				case 'open_conversion':
				case 'fave_conversion': {
					measure = '%';
					break;
				}
			}
			
			if (!$scoreboard.length) {
				$scoreboard = tmpl(with_dynamics ? 'scoreboard-with-dynamics' : 'scoreboard', {
					type: scoreboard_type,
					title: titles[field],
					size: size ? '-size_' + size : '-size_normal',
					number: 0 + measure,
					dynamic_by_week: 0 + measure
				}, $scoreboards_wrapper)
			}
			
			if (data.numbers[field] !== undefined) {
				$scoreboard.find('.ScoreboardNumber').animateNumber({
					number: Math.round(data.numbers[field]),
					suffix: measure
				}, 2000, 'easeOutSine');
			}
			
			if (with_dynamics) {
				if (data.dynamics[field] !== undefined) {
					$scoreboard
						.find('.ScoreboardDynamic')
						.animateNumber({
							number: Math.round(data.dynamics[field]),
							prefix: data.dynamics[field] == 0 ? undefined : (data.dynamics[field] > 0 ? '+' : '-'),
							suffix: measure
						}, 2000, 'easeOutSine')
						.siblings('label')
						.removeClass('fa-caret-up -text_color_franklin fa-caret-down -text_color_bubblegum')
						.addClass(data.dynamics[field] == 0 ? '' : (data.dynamics[field] > 0 ? 'fa-caret-up -text_color_franklin' : 'fa-caret-down -text_color_bubblegum'));
				}
			}
		});
	};
	
	return AdminPage;
}()));
/**
 * @requires ../Class.AdminPage.js
 */
/**
 *
 * @class AdminEventPage
 * @extends AdminPage
 */
AdminEventPage = extending(AdminPage, (function() {
	/**
	 *
	 * @param {(string|number)} event_id
	 *
	 * @constructor
	 * @constructs AdminEventPage
	 *
	 * @property {(string|number)} id
	 * @property {OneEvent} event
	 * @property {Fields} event_fields
	 */
	function AdminEventPage(event_id) {
		AdminPage.call(this);
		this.id = event_id;
		this.event = new OneEvent(this.id);
		this.event_fields = new Fields('organization_short_name', 'ticketing_locally', 'registration_locally');
		
		this.with_header_tabs = true;
	}
	
	AdminEventPage.prototype.fetchData = function() {
		return this.fetching_data_defer = this.event.fetchEvent(this.event_fields);
	};
	
	AdminEventPage.prototype.renderHeaderTabs = function(){
		var tabs = [];
		
		tabs.push({title: 'Обзор', page: '/admin/event/'+this.id+'/overview'});
		if (this.event.registration_locally || this.event.ticketing_locally) {
			tabs.push({title: 'Контроль входа', page: '/admin/event/'+this.id+'/check_in'});
		}
		tabs.push({title: 'Редактирование', page: '/admin/event/'+this.id+'/edit'});
		
		__APP.renderHeaderTabs(tabs);
	};
	
	return AdminEventPage;
}()));
/**
 * @requires Class.AdminEventPage.js
 */
/**
 *
 * @class AdminEventAuditoryPage
 * @extends AdminEventPage
 */
AdminEventAuditoryPage = extending(AdminEventPage, (function() {
	/**
	 *
	 * @constructor
	 * @constructs AdminEventAuditoryPage
	 * @param {(string|number)} event_id
	 */
	function AdminEventAuditoryPage(event_id) {
		AdminEventPage.apply(this, arguments);
	}
	
	AdminEventAuditoryPage.prototype.render = function() {};
	
	return AdminEventAuditoryPage;
}()));
/**
 * @requires Class.AdminEventPage.js
 */
/**
 *
 * @class AdminEventCheckInPage
 * @extends AdminEventPage
 */
AdminEventCheckInPage = extending(AdminEventPage, (function() {
	/**
	 *
	 * @class CheckInTicketsCollection
	 * @extends AdminEventsTicketsCollection
	 */
	var CheckInTicketsCollection = extending(AdminEventsTicketsCollection, (function() {
		
		/**
		 * @param {(string|number)} event_id
		 *
		 * @constructor
		 * @constructs CheckInTicketsCollection
		 *
		 * @property {Array<OneTicket>} awaiting
		 * @property {Array<OneTicket>} checked
		 * @property {Array<OneTicket>} new_awaiting
		 * @property {Array<OneTicket>} new_checked
		 * @property {Array<OneTicket>} last_pushed
		 */
		function CheckInTicketsCollection(event_id) {
			var self = this;
			
			AdminEventsTicketsCollection.call(this, event_id);
			
			Object.defineProperties(this, {
				awaiting: {
					get: function() {
						return self.filter(function(ticket) {
							return !ticket.checkout;
						});
					}
				},
				new_awaiting: {
					get: function() {
						return self.last_pushed.filter(function(ticket) {
							return !ticket.checkout;
						});
					}
				},
				checked: {
					get: function() {
						return self.filter(function(ticket) {
							return ticket.checkout;
						});
					}
				},
				new_checked: {
					get: function() {
						return self.last_pushed.filter(function(ticket) {
							return ticket.checkout;
						});
					}
				}
			});
		}
		
		return CheckInTicketsCollection;
	}()));
	
	/**
	 *
	 * @param {(string|number)} event_id
	 *
	 * @constructor
	 * @constructs AdminEventCheckInPage
	 *
	 * @property {AdminEventCheckInPage.STATES} current_checkin_state
	 * @property {CheckInTicketsCollection} tickets
	 * @property {SearchAdminEventsTicketsCollection} searching_tickets
	 * @property {Fields} tickets_fields
	 * @property {boolean} is_awaiting_state
	 * @property {boolean} is_searching_state
	 * @property {boolean} is_fetching
	 * @property {ProgressBar} progress_bar
	 * @property {jQuery} table_body
	 */
	function AdminEventCheckInPage(event_id) {
		var self = this;
		
		AdminEventPage.call(this, event_id);
		
		this.current_checkin_state = AdminEventCheckInPage.STATES.AWAITING;
		this.tickets_fields = new Fields('user', 'ticket_type', 'event_id');
		this.tickets = new CheckInTicketsCollection(event_id);
		this.searching_tickets = new SearchAdminEventsTicketsCollection('', event_id);
		this.is_searching_state = false;
		this.is_fetching = false;
		
		this.progress_bar = new ProgressBar({
			NUMBER: this.tickets.checked.length,
			OVERALL: this.tickets.length
		}, {
			classes: ['-with_label']
		});
		
		this.table_body = $();
		
		Object.defineProperties(this, {
			page_title_obj: {
				get: function() {
					return [{
						title: 'Организации',
						page: '/admin'
					}, {
						title: self.event.organization_short_name,
						page: '/admin/organization/' + self.event.organization_id
					}, self.event.title + ' - контроль входа'];
				}
			},
			is_awaiting_state: {
				get: function() {
					return self.current_checkin_state === AdminEventCheckInPage.STATES.AWAITING;
				}
			}
		});
	}
	
	/**
	 *
	 * @enum {string}
	 */
	AdminEventCheckInPage.STATES = {
		AWAITING: 'awaiting',
		CHECKED: 'checked'
	};
	
	AdminEventCheckInPage.ACTION_TEXTS = {
		AWAITING_NORMAL: 'Ожидает подтверждения',
		AWAITING_HOVER: 'Подтвердить вход',
		CHECKED_NORMAL: 'Подтверждён',
		CHECKED_HOVER: 'Отменить подтверждение'
	};
	
	AdminEventCheckInPage.prototype.fetchData = function() {
		return this.fetching_data_defer = __APP.SERVER.multipleAjax(AdminEventPage.prototype.fetchData.call(this), this.tickets.fetchTickets(this.tickets_fields, 0, 'created_at'));
	};
	/**
	 *
	 * @param {(Array<OneTicket>|OneTicket)} tickets
	 * @param {string} [no_tickets_text='Нет билетов']
	 * @return {jQuery}
	 */
	AdminEventCheckInPage.prototype.buildTableRows = function(tickets, no_tickets_text) {
		tickets = tickets ? (tickets instanceof Array) ? tickets : [tickets] : [];
		var self = this,
			$rows;
		
		if (!tickets.length)
			return tmpl('event-admin-check-in-row-no-tickets', {text: no_tickets_text ? no_tickets_text : 'Нет билетов'});
		
		$rows = tmpl('event-admin-check-in-row', tickets.map(function(ticket) {
			
			return {
				ticket_id: ticket.uuid,
				number: ticket.number,
				full_name: ticket.user.full_name,
				avatar_block: __APP.BUILD.avatarBlocks(ticket.user, {
					entity: __C.ENTITIES.USER,
					avatar_classes: [__C.CLASSES.SIZES.X30, __C.CLASSES.UNIVERSAL_STATES.ROUNDED]
				}),
				ticket_type: ticket.ticket_type.name,
				state_modificator: '-ticket_status_' + (ticket.checkout ? AdminEventCheckInPage.STATES.CHECKED : AdminEventCheckInPage.STATES.AWAITING),
				status_text: ticket.checkout ? AdminEventCheckInPage.ACTION_TEXTS.CHECKED_NORMAL : AdminEventCheckInPage.ACTION_TEXTS.AWAITING_NORMAL,
				action_text: ticket.checkout ? AdminEventCheckInPage.ACTION_TEXTS.CHECKED_HOVER : AdminEventCheckInPage.ACTION_TEXTS.AWAITING_HOVER
			};
		}));
		
		$rows.find('.CheckoutTicket').not('.-Handled_CheckoutTicket').on('click', function() {
			/**
			 *
			 * @type {OneTicket}
			 */
			var ticket = self.tickets.getByID($(this).closest('.Ticket').data('ticket_uuid'));
			
			OneTicket[ticket.checkout ? 'uncheck' : 'check'](ticket.event_id, ticket.uuid, function() {
				self.changeTicketState(ticket, ticket.checkout ? AdminEventCheckInPage.STATES.AWAITING : AdminEventCheckInPage.STATES.CHECKED);
			});
		}).addClass('-Handled_CheckoutTicket');
		
		return $rows;
	};
	/**
	 *
	 * @param {OneTicket} ticket
	 * @param {AdminEventCheckInPage.STATES} state
	 */
	AdminEventCheckInPage.prototype.changeTicketState = function(ticket, state) {
		var $ticket;
		
		if (this.is_searching_state) {
			$ticket = this.table_body.find('.Ticket_' + ticket.uuid);
			$ticket.toggleClass(Object.values(AdminEventCheckInPage.STATES).map(function(state) { return '-ticket_status_' + state; }).join(' '));
			$ticket.find('.StatusText').text(AdminEventCheckInPage.ACTION_TEXTS[ticket.checkout ? 'AWAITING_NORMAL' : 'CHECKED_NORMAL']);
			$ticket.find('.CheckoutTicket').text(AdminEventCheckInPage.ACTION_TEXTS[ticket.checkout ? 'AWAITING_HOVER' : 'CHECKED_HOVER']);
		} else if (ticket.checkout !== this.is_awaiting_state) {
			if (state === (this.is_awaiting_state ? AdminEventCheckInPage.STATES.AWAITING : AdminEventCheckInPage.STATES.CHECKED)) {
				this.table_body.append(this.buildTableRows(ticket));
			} else {
				this.table_body.find('.Ticket_' + ticket.uuid).remove();
			}
		}
		
		if ((ticket.checkout && state === AdminEventCheckInPage.STATES.AWAITING) || (!ticket.checkout && state === AdminEventCheckInPage.STATES.CHECKED)) {
			ticket.checkout = !ticket.checkout;
			this.progress_bar.set(this.tickets.checked.length);
		}
		
		if (!this.is_searching_state && !this.tickets[this.current_checkin_state].length) {
			this.table_body.html(this.buildTableRows([]));
		}
	};
	
	AdminEventCheckInPage.prototype.initSearch = function() {
		var self = this;
		
		this.is_searching_state = true;
		this.$wrapper.find('.RadioGroup').find('input').prop('checked', false);
		
		this.$wrapper.find('.ClearSearch').one('click', function() {
			self.$wrapper.find('.SearchTickets').val('');
			self.deInitSearch();
		});
		
		$(window).on('keydown.deInitSearch', function(e) {
			if (e.keyCode === 27) {
				self.deInitSearch();
			}
		});
	};
	
	AdminEventCheckInPage.prototype.deInitSearch = function() {
		this.is_searching_state = false;
		$(window).off('keydown.deInitSearch');
		
		this.$wrapper.find('#event_admin_check_in_type_' + this.current_checkin_state).prop('checked', true);
		this.table_body.html(this.buildTableRows(this.tickets[this.current_checkin_state]));
		
	};
	
	AdminEventCheckInPage.prototype.init = function() {
		var self = this;
		
		this.$wrapper.find('.RadioGroup').on('change', function(e) {
			self.current_checkin_state = $(e.target).val();
			self.table_body.html(self.buildTableRows(self.tickets[self.current_checkin_state]));
		});
		
		this.$wrapper.find('.SearchTickets').on('input', function(e) {
			var value = $(e.target).val();
			
			if (!self.is_searching_state) {
				self.initSearch();
			}
			
			__APP.SERVER.abortAllConnections();
			
			if (value === '') {
				self.deInitSearch();
			} else {
				self.searching_tickets = new SearchAdminEventsTicketsCollection(value, self.event.id);
				
				self.fetching_data_defer = self.searching_tickets.fetchTickets(self.tickets_fields, 0, 'created_at', function() {
					self.table_body.html(self.buildTableRows(this.last_pushed));
				});
			}
		});
	};
	/**
	 *
	 * @return {jqPromise}
	 */
	AdminEventCheckInPage.prototype.loadRest = function() {
		var self = this;
		
		return this.tickets.fetchTickets(this.tickets_fields, 0, 'created_at', function() {
			if (this.last_pushed.length) {
				self.progress_bar.setMax(self.tickets.length);
				self.progress_bar.set(self.tickets.checked.length);
				
				self.table_body.append(self.buildTableRows(this['new_' + self.current_checkin_state]));
				self.fetching_data_defer = self.loadRest();
			}
		});
	};
	
	AdminEventCheckInPage.prototype.render = function() {
		this.progress_bar.setMax(this.tickets.length);
		this.progress_bar.set(this.tickets.checked.length);
		
		this.$wrapper.html(tmpl('event-admin-check-in-page', {
			radio_group: __APP.BUILD.radioGroup({
				name: 'check_in_type',
				units: [
					{
						id: 'event_admin_check_in_type_awaiting',
						label: 'Ожидают',
						attributes: {
							value: AdminEventCheckInPage.STATES.AWAITING,
							checked: true
						}
					},
					{
						id: 'event_admin_check_in_type_checked',
						label: 'Проверенные',
						attributes: {
							value: AdminEventCheckInPage.STATES.CHECKED
						}
					}
				]
			}),
			progress_bar: this.progress_bar,
			rows: this.buildTableRows(this.tickets.awaiting)
		}));
		
		this.table_body = this.$wrapper.find('.CheckInTable').children('tbody');
		
		this.fetching_data_defer = this.loadRest();
		this.init();
	};
	
	
	return AdminEventCheckInPage;
}()));
/**
 * @requires ../Class.Page.js
 */
/**
 *
 * @abstract
 * @class AbstractEditEventPage
 * @extends Page
 */
AbstractEditEventPage = extending(Page, (function() {
	/**
	 *
	 * @constructor
	 * @constructs AbstractEditEventPage
	 */
	function AbstractEditEventPage() {
		Page.call(this);
		
		this.event = new OneEvent();
		this.state_name = 'admin';
		this.organization_id = null;
	}
	
	AbstractEditEventPage.lastRegistrationCustomFieldId = 0;
	
	/**
	 *
	 * @param {RegistrationFieldModel|Array<RegistrationFieldModel>|RegistrationFieldsCollection} [registration_data]
	 * @return {jQuery}
	 */
	AbstractEditEventPage.buildRegistrationCustomField = function(registration_data) {
		registration_data = registration_data ? (registration_data instanceof Array ? registration_data : [registration_data]) : [{}];
		var $fields;
		
		$fields = tmpl('edit-event-registration-custom-field', registration_data.filter(function(data) {
			if (RegistrationFieldModel.isCustomField(data)) {
				data.id = data.id ? data.id : AbstractEditEventPage.lastRegistrationCustomFieldId++;
				return true;
			}
			return false;
		}));
		registration_data.forEach(function(data) {
			if (data.required) {
				$fields.find('#edit_event_registration_'+data.id+'_custom_field_required').prop('checked', true);
			}
			if (data.type) {
				$fields.find('#edit_event_registration_'+data.id+'_custom_field_'+data.type+'_type').prop('checked', true);
			}
		});
		$fields.find('.RemoveRegistrationCustomField').on('click.RemoveRegistrationCustomField', function() {
			$(this).closest('.RegistrationCustomField').remove();
		});
		$fields.find('.RegistrationCustomFieldLabel, .RegistrationCustomFieldType').on('change.RemoveRegistrationFieldUUID', function() {
			$(this).closest('.RegistrationCustomField').find('.RegistrationCustomFieldUUID').val('');
		});
		
		return $fields;
	};
	
	AbstractEditEventPage.prototype.init = function() {
		var PAGE = this,
			$main_tabs = PAGE.$wrapper.find('.EditEventPageTabs'),
			$bottom_nav_buttons = PAGE.$wrapper.find('.edit_event_buttons').children(),
			$next_page_button = $bottom_nav_buttons.filter('#edit_event_next_page'),
			$prev_page_button = $bottom_nav_buttons.filter('#edit_event_prev_page'),
			$submit_button = $bottom_nav_buttons.filter('#edit_event_submit');
		
		/**
		 *
		 * @param {jQuery} $input
		 */
		function convertToNumericInput($input) {
			if($input.is('input')) {
				$input.inputmask({
					alias: 'numeric',
					autoGroup: false,
					digits: 2,
					digitsOptional: true,
					allowPlus: false,
					allowMinus: false,
					rightAlign: false
				});
			} else {
				$input = $input.find('input');
				if($input.length) {
					convertToNumericInput($input);
				}
			}
		}
		
		bindDatePickers(PAGE.$wrapper);
		bindTimeInput(PAGE.$wrapper);
		bindSelect2(PAGE.$wrapper);
		bindTabs(PAGE.$wrapper);
		bindControlSwitch(PAGE.$wrapper);
		bindCallModal(PAGE.$wrapper);
		bindLimitInputSize(PAGE.$wrapper);
		bindRippleEffect(PAGE.$wrapper);
		bindFileLoadButton(PAGE.$wrapper);
		ImgLoader.init(PAGE.$wrapper);
		(function initEditEventMainCalendar() {
			//TODO: Refactor this!! Make it more readable
			var $selected_days_text = PAGE.$wrapper.find('.EventSelectedDaysText'),
				$selected_days_table_rows = PAGE.$wrapper.find('.SelectedDaysRows'),
				MainCalendar = new Calendar('.EventDatesCalendar', {
					weekday_selection: true,
					month_selection: true,
					min_date: moment().format(__C.DATE_FORMAT)
				}),
				AddRowDatePicker = PAGE.$wrapper.find('.AddDayToTable').data('datepicker'),
				dates = {},
				genitive_month_names = {
					'январь': 'января',
					'февраль': 'февраля',
					'март': 'марта',
					'апрель': 'апреля',
					'май': 'мая',
					'июнь': 'июня',
					'июль': 'июля',
					'август': 'августа',
					'сентябрь': 'сентября',
					'октябрь': 'октября',
					'ноябрь': 'ноября',
					'декабрь': 'декабря'
				},
				$fucking_table = $();
			MainCalendar.init();
			
			function bindRemoveRow($parent) {
				$parent.find('.RemoveRow').not('.-Handled_RemoveRow').each(function(i, elem) {
					$(elem).on('click', function() {
						MainCalendar.deselectDays($(this).closest('tr').data('date'));
					}).addClass('-Handled_RemoveRow');
				});
			}
			
			function displayFormattedText() {
				dates = {};
				MainCalendar.selected_days.forEach(function(date, i, days) {
					var _date = moment(date);
					
					if (typeof dates[_date.month()] === 'undefined') {
						dates[_date.month()] = {};
						dates[_date.month()].selected_days = [];
						dates[_date.month()].month_name = genitive_month_names[_date.format('MMMM')];
					}
					dates[_date.month()].selected_days.push(_date.date());
				});
				
				$selected_days_text.empty().removeClass('hidden');
				if (Object.keys(dates).length) {
					$.each(dates, function(i, elem) {
						$selected_days_text.append($('<p>').text(elem.selected_days.join(', ') + ' ' + elem.month_name))
					});
				} else {
					$selected_days_text.html('<p>Даты не выбраны</p>');
				}
			}
			
			function doTheFuckingSort($rows, $parent) {
				$rows.sort(function(a, b) {
					var an = $(a).data('date'),
						bn = $(b).data('date');
					
					if (an > bn) return 1;
					else if (an < bn) return -1;
					else return 0;
				});
				$rows.detach().appendTo($parent);
			}
			
			function buildTable(selected_days) {
				//TODO: BUG. On multiple selection (month or weekday) duplicates appearing in table.
				//TODO: Bind time on building table
				var $output = $(),
					today = moment().format(__C.DATE_FORMAT);
				if (Array.isArray(selected_days)) {
					selected_days.forEach(function(day) {
						$output = $output.add(tmpl('selected-table-day', {
							date: day,
							formatted_date: day.split('-').reverse().join('.'),
							today: today
						}));
					});
				}
				else {
					$output = tmpl('selected-table-day', {
						date: selected_days,
						formatted_date: selected_days.split('-').reverse().join('.'),
						today: today
					});
				}
				bindDatePickers($output);
				bindTimeInput($output);
				bindRemoveRow($output);
				
				$fucking_table = $fucking_table.add($output);
				$output.find('.DatePicker').each(function() {
					var DP = $(this).data('datepicker');
					DP.$datepicker.on('date-picked', function() {
						MainCalendar.deselectDays(DP.prev_selected_day).selectDays(DP.selected_day);
						doTheFuckingSort($fucking_table, $selected_days_table_rows)
					});
				});
				doTheFuckingSort($fucking_table, $selected_days_table_rows);
			}
			
			function BuildSelectedDaysTable() {
				if (MainCalendar.last_action === 'select') {
					buildTable(MainCalendar.last_selected_days);
				}
				else if (MainCalendar.last_action === 'deselect') {
					if (Array.isArray(MainCalendar.last_selected_days)) {
						var classes = [];
						MainCalendar.last_selected_days.forEach(function(day) {
							classes.push('.TableDay_' + day);
						});
						$fucking_table.remove(classes.join(', '));
						$fucking_table = $fucking_table.not(classes.join(', '));
					}
					else {
						$fucking_table.remove('.TableDay_' + MainCalendar.last_selected_days);
						$fucking_table = $fucking_table.not('.TableDay_' + MainCalendar.last_selected_days);
					}
				}
				
				doTheFuckingSort($fucking_table, $selected_days_table_rows);
				
				//TODO: Do not forget to rename 'fucking' names
				//TODO: Please, don't forget to rename 'fucking' names
				
			}
			
			buildTable(MainCalendar.selected_days);
			PAGE.$wrapper.find('.SelectedDaysRows').toggleStatus('disabled');
			
			MainCalendar.$calendar.on('days-changed.displayFormattedText', displayFormattedText);
			MainCalendar.$calendar.on('days-changed.buildTable', BuildSelectedDaysTable);
			
			AddRowDatePicker.$datepicker.on('date-picked', function() {
				MainCalendar.selectDays(AddRowDatePicker.selected_day);
			});
			
		})();
		(function initOrganization(selected_id) {
			OrganizationsCollection.fetchMyOrganizations(['admin', 'moderator'], {fields: ['default_address']}, function(data) {
				var $wrapper = $('.EditEventOrganizations'),
					organizations_options = $(),
					$default_address_button = PAGE.$wrapper.find('.EditEventDefaultAddress'),
					$select = $wrapper.find('#edit_event_organization'),
					selected_address;
				
				data.forEach(function(organization) {
					if (organization.id == selected_id) {
						selected_address = organization.default_address;
					}
					organizations_options = organizations_options.add(tmpl('option', {
						val: organization.id,
						data: "data-image-url='" + organization.img_url + "' data-default-address='" + organization.default_address + "'",
						display_name: organization.name
					}));
				});
				if (selected_id && !selected_address) {
					return __APP.changeState('/', true, true);
				}
				
				$select.append(organizations_options).select2({
					containerCssClass: 'form_select2',
					dropdownCssClass: 'form_select2_drop'
				}).on('change', function() {
					$default_address_button.data('default_address', $(this).children(":selected").data('default-address'));
				});
				if (selected_id) {
					$select.select2('val', selected_id);
					$default_address_button.data('default_address', selected_address);
				} else {
					$default_address_button.data('default_address', data[0].default_address);
				}
				if (organizations_options.length > 1) {
					$wrapper.removeClass('-hidden');
				} else {
					$wrapper.addClass('-hidden');
				}
			});
		})(PAGE.event.organization_id);
		
		bindCollapsing(PAGE.$wrapper);
		
		$main_tabs = $main_tabs.resolveInstance();
		
		//TODO: perepilit' placepicker
		PAGE.$wrapper.find(".Placepicker").placepicker();
		
		PAGE.$wrapper.find('.EventTags').select2({
			tags: true,
			width: '100%',
			placeholder: "Выберите до 5 тегов",
			maximumSelectionLength: 5,
			maximumSelectionSize: 5,
			tokenSeparators: [',', ';'],
			multiple: true,
			createSearchChoice: function(term, data) {
				if ($(data).filter(function() {
						return this.text.localeCompare(term) === 0;
					}).length === 0) {
					return {
						id: term,
						text: term
					};
				}
			},
			ajax: {
				url: '/api/v1/tags/',
				dataType: 'JSON',
				data: function(term, page) {
					return {
						name: term // search term
					};
				},
				results: function(data) {
					var _data = [];
					data.data.forEach(function(value) {
						value.text = value.name;
						_data.push(value);
					});
					return {
						results: _data
					}
				}
			},
			containerCssClass: "form_select2",
			dropdownCssClass: "form_select2_drop"
		});
		
		PAGE.$wrapper.find('.EditEventDefaultAddress').off('click.defaultAddress').on('click.defaultAddress', function() {
			var $this = $(this);
			$this.closest('.form_group').find('input').val($this.data('default_address')).trigger('input');
		});
		
		PAGE.$wrapper.find('#edit_event_is_online').off('change.OnlineEvent').on('change.OnlineEvent', function() {
			PAGE.$wrapper.find('#edit_event_placepicker').prop('required', !$(this).prop('checked'));
		});
		
		PAGE.$wrapper.find('#edit_event_free').off('change.FreeEvent').on('change.FreeEvent', function() {
			PAGE.$wrapper.find('.MinPrice').toggleStatus('disabled');
		});
		
		convertToNumericInput(PAGE.$wrapper.find('.MinPrice'));
		convertToNumericInput(PAGE.$wrapper.find('#edit_event_registration_limit_count'));
		
		PAGE.$wrapper.find('.AddRegistrationCustomField').off('click.AddRegistrationCustomField').on('click.AddRegistrationCustomField', function() {
			AbstractEditEventPage.buildRegistrationCustomField().insertBefore($(this));
		});
		
		PAGE.$wrapper.find('.RegistrationPreview').on('click.RegistrationPreview', function() {
			var form_data = $(this).closest('form').serializeForm(),
				event = new OneEvent(),
				modal;
			
			form_data.registration_fields = (new RegistrationFieldsCollection()).setData(form_data.registration_fields.sort().map(function(field) {
				return {
					uuid: guid(),
					type: form_data['registration_'+field+'_field_type'],
					label: form_data['registration_'+field+'_field_label'] || RegistrationFieldModel.DEFAULT_LABEL[form_data['registration_'+field+'_field_type'].toUpperCase()],
					required: form_data['registration_'+field+'_field_required']
				};
			}));
			event.setData(form_data);
			
			modal = new PreviewRegistrationModal(event);
			modal.show();
		});
		
		$main_tabs.on('change.tabs', function() {
			if($main_tabs.currentTabsIndex === 0){
				$prev_page_button.addClass(__C.CLASSES.HIDDEN);
			} else {
				$prev_page_button.removeClass(__C.CLASSES.HIDDEN);
			}
			if ($main_tabs.currentTabsIndex === $main_tabs.tabsCount - 1) {
				$next_page_button.addClass(__C.CLASSES.HIDDEN);
				$submit_button.removeClass(__C.CLASSES.HIDDEN);
			} else {
				$next_page_button.removeClass(__C.CLASSES.HIDDEN);
				$submit_button.addClass(__C.CLASSES.HIDDEN);
			}
		});
		
		$next_page_button.off('click.nextPage').on('click.nextPage', function() {
			$main_tabs.nextTab();
		});
		
		$prev_page_button.off('click.nextPage').on('click.prevPage', function() {
			$main_tabs.prevTab();
		});
		
		$submit_button.off('click.Submit').on('click.Submit', function submitEditEvent() {
			var $form = PAGE.$wrapper.find("#edit-event-form"),
				/**
				 * @type {Calendar} MainCalendar
				 */
				MainCalendar = PAGE.$wrapper.find('.EventDatesCalendar').resolveInstance(),
				$event_tags = $form.find('input.EventTags'),
				form_data = $form.serializeForm(),
				is_edit = !!(PAGE.event.id),
				send_data,
				is_form_valid,
				$loader = $();
			
			is_form_valid = (function validation($form, Calendar) {
				var is_valid = true,
					$times = $form.find('#edit_event_different_time').prop('checked') ? $form.find('[class^="TableDay_"]') : $form.find('.MainTime');
				
				function failSubmit($element, is_form_valid, error_message){
					var $cut_tab,
						$Tabs;
					if(is_form_valid){
						$cut_tab = $element.parents('.TabsBody:last');
						$Tabs = $cut_tab.closest('.Tabs').resolveInstance();
						$Tabs.setToTab($Tabs.find('.TabsBodyWrapper:first').children().index($cut_tab));
						scrollTo($element, 400, function() {
							showNotifier({text: error_message, status: false});
						});
					}
					handleErrorField($element);
					return false;
				}
				
				$form.find(':required').not($form.find(':disabled')).each(function() {
					var $this = $(this);
					
					if ($this.val().trim() === '') {
						is_valid = failSubmit($this, is_valid, 'Заполните все обязательные поля');
					} else if ($this.hasClass('LimitSize') && $this.val().trim().length > $this.data('maxlength')) {
						is_valid = failSubmit($this, is_valid, 'Количество символов превышает установленное значение');
					}
				});
				
				if (!Calendar.selected_days.length) {
					is_valid = failSubmit(Calendar.$calendar, is_valid, 'Выберите даты для события');
				}
				
				$times.each(function() {
					var $row = $(this),
						$inputs = $row.find('.StartHours, .StartMinutes, .EndHours, .EndMinutes'),
						start = $row.find('.StartHours').val().trim() + $row.find('.StartMinutes').val().trim(),
						end = $row.find('.EndHours').val().trim() + $row.find('.EndMinutes').val().trim();
					
					$inputs.each(function() {
						var $input = $(this);
						if ($input.val().trim() === '') {
							is_valid = failSubmit($input, is_valid, 'Заполните время события');
						}
					});
					if (is_valid && start > end) {
						is_valid = failSubmit($row, is_valid, 'Начальное время не может быть позже конечного');
					}
				});
				
				if ($event_tags.val().trim() === '') {
					is_valid = failSubmit($event_tags.siblings('.EventTags'), is_valid, 'Необходимо выбрать хотя бы один тэг');
				}
				
				if (form_data.registration_limit_by_quantity && (!form_data.registration_fields || !form_data.registration_fields.length)) {
					is_valid = failSubmit($form.find('#edit_event_registration_fields'), is_valid, 'Должно быть выбрано хотя бы одно поле регистрации в анкете');
				}
				
				if (!is_edit) {
					$form.find('.DataUrl').each(function() {
						var $this = $(this);
						if ($this.val().trim() === "") {
							is_valid = failSubmit($this.closest('.ImgLoadWrap'), is_valid, 'Пожалуйста, добавьте к событию обложку');
						}
					});
				}
				
				return is_valid;
			})($form, MainCalendar);
			
			function afterSubmit() {
				PAGE.$wrapper.removeClass(__C.CLASSES.STATUS.DISABLED);
				$loader.remove();
				__APP.changeState('/event/' + PAGE.event.id);
			}
			
			function onError(e) {
				PAGE.$wrapper.removeClass(__C.CLASSES.STATUS.DISABLED);
				$loader.remove();
				console.error(e);
				console.log({
					MainCalendar: MainCalendar,
					send_data: send_data,
					form_data: form_data
				});
			}
			
			if (is_form_valid) {
				PAGE.$wrapper.addClass(__C.CLASSES.STATUS.DISABLED);
				$loader = __APP.BUILD.overlayLoader(PAGE.$view);
				try {
					send_data = {
						event_id: parseInt(form_data.event_id) ? parseInt(form_data.event_id) : null,
						title: form_data.title.trim(),
						organization_id: form_data.organization_id,
						description: form_data.description.trim(),
						is_online: form_data.is_online,
						location: form_data.location && form_data.location.trim() ? form_data.location.trim() : null,
						detail_info_url: form_data.detail_info_url ? form_data.detail_info_url.trim() : null,
						image_horizontal: form_data.image_horizontal,
						filenames: {horizontal: form_data.filename_horizontal},
						is_free: form_data.is_free,
						min_price: form_data.is_free ? null : form_data.min_price
					};
					
					send_data.registration_required = form_data.registration_required;
					if (form_data.registration_required) {
						if (form_data.registration_limit_by_date) {
							send_data.registration_till = moment(
								form_data.registration_till_date + 'T' +
								form_data.registration_till_time_hours + ':' +
								form_data.registration_till_time_minutes + ':00'
							).tz('UTC').format();
						}
						
						if (form_data.registration_limit_by_quantity) {
							send_data.registration_locally = true;
							send_data.registration_limit_count = form_data.registration_limit_count;
						}
						
						if (form_data.registration_fields && form_data.registration_fields.length) {
							send_data.registration_locally = true;
							send_data.registration_fields = (new RegistrationFieldsCollection()).setData(form_data.registration_fields.map(function(id) {
								var field = new RegistrationFieldModel();
								
								field.required = form_data['registration_' + id + '_field_required'];
								if (form_data['registration_' + id + '_field_uuid']) {
									field.uuid = form_data['registration_' + id + '_field_uuid'];
								}
								if (form_data['registration_' + id + '_field_type']) {
									field.type = form_data['registration_' + id + '_field_type'];
								}
								if (form_data['registration_' + id + '_field_label']) {
									field.label = form_data['registration_' + id + '_field_label'].trim();
								}
								
								return field;
							})).getArrayCopy();
						}
					}
					
					if(form_data.tags){
						send_data.tags = form_data.tags.split(',');
					}
					
					send_data.delayed_publication = form_data.delayed_publication;
					if (form_data.delayed_publication) {
						send_data.public_at = moment(
							form_data.public_at_date + 'T' +
							form_data.public_at_time_hours + ':' +
							form_data.public_at_time_minutes + ':00'
						).tz('UTC').format();
					}
					
					send_data.different_time = form_data.different_time;
					send_data.dates = new DateModelsCollection();
					if (form_data.different_time) {
						PAGE.$wrapper.find('.SelectedDaysRows').children().each(function(i, row) {
							var $row = $(row);
							send_data.dates.push((new DateModel()).setData({
								event_date: $row.find('.DatePicker').data('selected_day'),
								start_time: $row.find('.StartHours').val() + ':' + $row.find('.StartMinutes').val(),
								end_time: $row.find('.EndHours').val() + ':' + $row.find('.EndMinutes').val()
							}));
						});
					} else {
						MainCalendar.selected_days.forEach(function(day) {
							send_data.dates.push((new DateModel()).setData({
								event_date: day,
								start_time: form_data.start_hours + ':' + form_data.start_minutes,
								end_time: form_data.end_hours + ':' + form_data.end_minutes
							}));
						});
					}
					send_data.dates = send_data.dates.getArrayCopy();
					
					if (is_edit) {
						PAGE.event.updateEvent(send_data, afterSubmit, onError);
					} else {
						PAGE.event.createEvent(send_data, afterSubmit, onError);
					}
				} catch (e) {
					onError(e);
				}
			}
		});
	};
	
	AbstractEditEventPage.prototype.render = function() {
		var PAGE = this,
			is_edit = !!PAGE.event.id,
			page_vars = $.extend(true, {}, Object.getProps(PAGE.event), {
				event_id: PAGE.event.id ? PAGE.event.id : undefined,
				public_at_data_label: 'Дата',
				current_date: moment().format(__C.DATE_FORMAT),
				tomorrow_date: moment().add(1, 'd').format(__C.DATE_FORMAT),
				button_text: is_edit ? 'Сохранить' : 'Опубликовать'
			}),
			registration_props = {
				registration_limit_count: PAGE.event.registration_limit_count,
				registration_till_display_date: 'Дата',
				tomorrow_date: page_vars.tomorrow_date,
				predefined_field: tmpl('edit-event-registration-predefined-field', [
					{id: AbstractEditEventPage.lastRegistrationCustomFieldId++, type: 'email', name: 'E-mail', description: 'Текстовое поле для ввода адреса электронной почты'},
					{id: AbstractEditEventPage.lastRegistrationCustomFieldId++, type: 'first_name', name: 'Имя', description: 'Текстовое поле для ввода имени'},
					{id: AbstractEditEventPage.lastRegistrationCustomFieldId++, type: 'last_name', name: 'Фамилия', description: 'Текстовое поле для ввода фамилии'},
					{id: AbstractEditEventPage.lastRegistrationCustomFieldId++, type: 'phone_number', name: 'Номер телефона', description: 'Текстовое поля для ввода номера телефона'}
				])
			};
		
		if (!checkRedirect('event/add', (this.organization_id ? '/add/event/to/' + this.organization_id : '/add/event'))) {
			return null;
		}
		
		if (PAGE.event.registration_required) {
			if (PAGE.event.registration_till) {
				var m_registration_till = moment.unix(PAGE.event.registration_till);
				registration_props = $.extend(registration_props, {
					registration_till_display_date: m_registration_till.format(__LOCALES.ru_RU.DATE.DATE_FORMAT),
					registration_till_date: m_registration_till.format(__C.DATE_FORMAT),
					registration_till_time_hours: m_registration_till.format('HH'),
					registration_till_time_minutes: m_registration_till.format('mm')
				});
			}
		}
		
		if (PAGE.event.public_at != null) {
			var m_public_at = moment.unix(PAGE.event.public_at);
			page_vars.public_at_data = m_public_at.format('YYYY-MM-DD');
			page_vars.public_at_data_label = m_public_at.format('DD.MM.YYYY');
			page_vars.public_at_time_hours = m_public_at.format('HH');
			page_vars.public_at_time_minutes = m_public_at.format('mm');
		}
		
		PAGE.$wrapper.html(tmpl('edit-event-page', $.extend(page_vars, {
			date_picker: tmpl('edit-event-datepicker', {
				today: page_vars.current_date
			}),
			cover_picker: tmpl('edit-event-cover-picker', {
				image_horizontal_url: PAGE.event.image_horizontal_url,
				image_horizontal_filename: getFilenameFromURL(PAGE.event.image_horizontal_url)
			}),
			registration: tmpl('edit-event-registration', registration_props)
		})));
		
		PAGE.init();
		
		if(page_vars.public_at != null) {
			PAGE.$wrapper.find('#edit_event_delayed_publication').prop('checked', true).trigger('change');
		}
		
		this.renderRest(page_vars);
	};
	
	AbstractEditEventPage.prototype.renderRest = function(page_vars) {};
	
	return AbstractEditEventPage;
}()));
/**
 * @requires Class.AbstractEditEventPage.js
 */
/**
 *
 * @class EditEventPage
 * @extends AbstractEditEventPage
 */
EditEventPage = extending(AbstractEditEventPage, (function() {
	/**
	 *
	 * @param {(string|number)} [event_id]
	 * @constructor
	 * @constructs EditEventPage
	 */
	function EditEventPage(event_id) {
		AbstractEditEventPage.call(this);
		this.page_title = 'Редактирование события';
		this.event = new OneEvent(event_id);
	}
	
	EditEventPage.prototype.fetchData = function() {
		return this.fetching_data_defer = this.event.fetchEvent(EventPage.fields);
	};
	
	EditEventPage.prototype.renderRest = function(page_vars) {
		var PAGE = this;
		
		(function selectDates($view, raw_dates, is_same_time) {
			var MainCalendar = $view.find('.EventDatesCalendar').data('calendar'),
				start_time = raw_dates[0].start_time.split(':'),
				end_time = raw_dates[0].end_time ? raw_dates[0].end_time.split(':') : [],
				$table_rows = $view.find('.SelectedDaysRows'),
				dates = [],
				$day_row;
			
			if (is_same_time) {
				$day_row = $view.find('.MainTime');
				$day_row.find('.StartHours').val(start_time[0]);
				$day_row.find('.StartMinutes').val(start_time[1]);
				if (end_time.length) {
					$day_row.find('.EndHours').val(end_time[0]);
					$day_row.find('.EndMinutes').val(end_time[1]);
				}
			} else {
				PAGE.$wrapper.find('#edit_event_different_time').prop('checked', true).trigger('change');
			}
			
			raw_dates.forEach(function(date) {
				date.event_date = moment.unix(date.event_date).format('YYYY-MM-DD');
				dates.push(date.event_date);
			});
			MainCalendar.selectDays(dates);
			raw_dates.forEach(function(date) {
				var $day_row = $table_rows.find('.TableDay_' + date.event_date),
					start_time = date.start_time.split(':'),
					end_time = date.end_time ? date.end_time.split(':') : [];
				$day_row.find('.StartHours').val(start_time[0]);
				$day_row.find('.StartMinutes').val(start_time[1]);
				if (end_time.length) {
					$day_row.find('.EndHours').val(end_time[0]);
					$day_row.find('.EndMinutes').val(end_time[1]);
				}
			});
		})(PAGE.$wrapper, PAGE.event.dates, PAGE.event.is_same_time);
		(function selectTags($view, tags) {
			var selected_tags = [];
			tags.forEach(function(tag) {
				selected_tags.push({
					id: parseInt(tag.id),
					text: tag.name
				});
			});
			
			$view.find('#event_tags').select2('data', selected_tags);
		})(PAGE.$wrapper, PAGE.event.tags);
		
		if (PAGE.event.image_horizontal_url) {
			toDataUrl(PAGE.event.image_horizontal_url, function(base64_string) {
				PAGE.$wrapper.find('#edit_event_image_horizontal_source').val(base64_string ? base64_string : null);
			});
		}
		
		if (!PAGE.event.is_free) {
			PAGE.$wrapper.find('#edit_event_free').prop('checked', false).trigger('change');
			PAGE.$wrapper.find('#edit_event_min_price').val(PAGE.event.min_price);
		}
		if (PAGE.event.registration_required) {
			PAGE.$wrapper.find('#edit_event_registration_required').prop('checked', true).trigger('change');
			if (PAGE.event.registration_till) {
				PAGE.$wrapper.find('#edit_event_registration_limit_by_date').prop('checked', true).trigger('change');
			}
			if (PAGE.event.registration_limit_count) {
				PAGE.$wrapper.find('#edit_event_registration_limit_by_quantity').prop('checked', true).trigger('change');
			}
			if (page_vars.registration_fields && page_vars.registration_fields.length) {
				PAGE.$wrapper.find('.AddRegistrationCustomField').before(AbstractEditEventPage.buildRegistrationCustomField(page_vars.registration_fields.filter(function(field) {
					var is_custom_field = RegistrationFieldModel.isCustomField(field);
					if (!is_custom_field) {
						PAGE.$wrapper.find('#edit_event_registration_'+field.type+'_field_uuid').val(field.uuid);
						PAGE.$wrapper.find('#edit_event_registration_'+field.type+'_field_enable').prop('checked', true).trigger('change');
						if (field.required) {
							PAGE.$wrapper.find('#edit_event_registration_'+field.type+'_field_required').prop('checked', true);
						}
					}
					
					return is_custom_field;
				})));
			}
		}
		if (page_vars.public_at == null) {
			PAGE.$wrapper.find('#edit_event_delayed_publication').toggleStatus('disabled');
		}
	};
	
	return EditEventPage;
}()));
/**
 * @requires Class.AdminEventPage.js
 * @requires ../../events/Class.EditEventPage.js
 */
/**
 *
 * @class AdminEventEditPage
 * @extends EditEventPage
 * @extends AdminEventPage
 */
AdminEventEditPage = extending(EditEventPage, AdminEventPage, (function() {
	/**
	 *
	 * @param {(string|number)} event_id
	 *
	 * @constructor
	 * @constructs AdminEventEditPage
	 */
	function AdminEventEditPage(event_id) {
		var self = this;
		
		EditEventPage.call(this, event_id);
		AdminEventPage.call(this, event_id);
		
		this.event_fields.add(EventPage.fields);
		
		Object.defineProperty(this, 'page_title_obj', {
			get: function() {
				return [{
					title: 'Организации',
					page: '/admin'
				}, {
					title: self.event.organization_short_name,
					page: '/admin/organization/' + self.event.organization_id
				}, self.event.title + ' - редактирование'];
			}
		});
	}
	
	return AdminEventEditPage;
}()));

AdminEventEditPage.prototype.renderHeaderTabs = AdminEventPage.prototype.renderHeaderTabs;
/**
 * @requires Class.AdminEventPage.js
 */
/**
 *
 * @class AdminEventOverviewPage
 * @extends AdminEventPage
 */
AdminEventOverviewPage = extending(AdminEventPage, (function() {
	/**
	 *
	 * @constructor
	 * @constructs AdminEventOverviewPage
	 * @param {(string|number)} event_id
	 */
	function AdminEventOverviewPage(event_id) {
		AdminEventPage.apply(this, arguments);
		
		this.graphics_stats = new EventStatistics(this.id);
		this.scoreboards_stats = new EventStatistics(this.id);
		this.event_fields.add(new Fields(
			'favored_users_count',
			'is_same_time',
			'dates'
		));
	}
	
	AdminEventOverviewPage.prototype.render = function() {
		var PAGE = this;
		
		this.renderHeaderTabs();
		__APP.changeTitle([{
			title: 'Организации',
			page: '/admin'
		}, {
			title: this.event.organization_short_name,
			page: '/admin/organization/' + this.event.organization_id
		}, this.event.title]);
		
		if (!checkRedirect('overview', '/admin/event/'+this.event.id+'/overview', true)) {
			return null;
		}
		
		this.$wrapper.html(tmpl('eventstat-overview', $.extend(true, {}, this.event, {
			cover_width: 280,
			dates_block: tmpl('eventstat-overview-datetime', {
				date: displayDateRange(this.event.first_event_date, this.event.last_event_date),
				time: this.event.is_same_time ? displayTimeRange(this.event.dates[0].start_time, this.event.dates[0].end_time) : 'Разное время'
			})
		})));
		this.$wrapper.find('.EventStatAreaCharts').children('.AreaChart').html(tmpl('loader'));
		
		this.scoreboards_stats.fetchStatistics(Statistics.SCALES.OVERALL, false, ['notifications_sent', 'view', 'fave', 'view_detail', 'fave_conversion', 'open_conversion'], null, function(data) {
			var scoreboards_data = {numbers: {}};
			$.each(data, function(field, stats) {
				scoreboards_data.numbers[field] = stats[0].value
			});
			PAGE.updateScoreboards(PAGE.$wrapper.find('.EventstatsScoreboards'), scoreboards_data, {
				'fave': 'Добавлений в избранное',
				'view': 'Просмотров события'
			}, ['fave', 'view']);
			PAGE.updateScoreboards(PAGE.$wrapper.find('.EventstatsBigScoreboards'), scoreboards_data, {
				'notifications_sent': 'Уведомлений отправлено',
				'view': 'Просмотров',
				'view_detail': 'Открытий',
				'open_conversion': 'Конверсия открытий',
				'fave': 'Добавлений',
				'fave_conversion': 'Конверсия добавлений'
			}, ['notifications_sent', 'view', 'view_detail', 'open_conversion', 'fave', 'fave_conversion'], 'big');
		});
		
		this.graphics_stats.fetchStatistics(Statistics.SCALES.DAY, moment(__APP.EVENDATE_BEGIN, 'DD-MM-YYYY').format(), ['notifications_sent', 'view', 'fave', 'view_detail', 'fave_conversion', 'open_conversion'], null, function(data) {
			PAGE.buildAreaCharts(data, {
				rangeSelector: {
					selected: 1
				}
			});
		});
		
		__APP.MODALS.bindCallModal(PAGE.$wrapper);
		bindPageLinks(PAGE.$wrapper);
	};
	
	return AdminEventOverviewPage;
}()));
/**
 * @requires Class.AdminEventPage.js
 */
/**
 *
 * @class AdminEventPromotionPage
 * @extends AdminEventPage
 */
AdminEventPromotionPage = extending(AdminEventPage, (function() {
	/**
	 *
	 * @constructor
	 * @constructs AdminEventPromotionPage
	 * @param {(string|number)} event_id
	 */
	function AdminEventPromotionPage(event_id) {
		AdminEventPage.apply(this, arguments);
	}
	
	AdminEventPromotionPage.prototype.render = function() {};
	
	return AdminEventPromotionPage;
}()));
/**
 * @requires ../Class.AdminPage.js
 */
/**
 * @abstract
 * @class AdminOrganizationPage
 * @extends AdminPage
 */
AdminOrganizationPage = extending(AdminPage, (function() {
	/**
	 *
	 * @param {(string|number)} org_id
	 * @constructor
	 * @constructs AdminOrganizationPage
	 *
	 * @property {(number|string)} id
	 * @property {Fields} organization_fields
	 * @property {OneOrganization} organization
	 */
	function AdminOrganizationPage(org_id) {
		AdminPage.apply(this);
		this.id = org_id;
		this.organization = new OneOrganization(this.id);
		this.with_header_tabs = true;
		
		this.organization_fields = new Fields(
			'privileges'
		);
	}
	
	AdminOrganizationPage.prototype.fetchData = function() {
		return this.fetching_data_defer = this.organization.fetchOrganization(this.organization_fields);
	};
	
	AdminOrganizationPage.prototype.renderHeaderTabs = function(){
		__APP.renderHeaderTabs([
			{title: 'Обзор', page: '/admin/organization/'+this.id+'/overview'},
			{title: 'События', page: '/admin/organization/'+this.id+'/events'},
			{title: 'CRM', page: '/admin/organization/'+this.id+'/crm'},
			{title: 'Настройки', page: '/admin/organization/'+this.id+'/settings'},
			{title: 'Редактирование', page: '/admin/organization/'+this.id+'/edit'}
		]);
	};
	
	return AdminOrganizationPage;
}()));
/**
 * @requires Class.AdminOrganizationPage.js
 */
/**
 *
 * @class AdminOrganizationCRMPage
 * @extends AdminOrganizationPage
 */
AdminOrganizationCRMPage = extending(AdminOrganizationPage, (function() {
	/**
	 *
	 * @param {(string|number)} org_id
	 * @constructor
	 * @constructs AdminOrganizationCRMPage
	 *
	 * @property {Fields} organization_fields
	 * @property {OrganizationSubscribersCollection} organization_subscribers
	 * @property {Fields} subscribers_fields
	 * @property {DataTable.Api} CRMTable
	 * @property {jQuery} $loader
	 */
	function AdminOrganizationCRMPage(org_id) {
		var self = this;
		
		AdminOrganizationPage.call(this, org_id);
		
		this.organization_fields = this.organization_fields.add('subscribed_count');
		this.subscribers_fields = new Fields('email', 'accounts_links');
		this.organization_subscribers = new OrganizationSubscribersCollection(org_id);
		this.CRMTable = null;
		this.$loader = $();
		
		Object.defineProperty(this, 'page_title_obj', {
			get: function() {
				return [{
					title: 'Организации',
					page: '/admin'
				}, self.organization.short_name + ' - CRM'];
			}
		});
	}
	
	/**
	 *
	 * @enum {string}
	 */
	AdminOrganizationCRMPage.TABLE_COLUMNS = [
		'name',
		'email',
		'accounts',
		'gender',
		'country',
		'city',
		'auth_date',
		'subscription_date',
		'unsubscription_date',
		'organization_page_view',
		'event_page_view',
		'notifications_received',
		'notifications_opened',
		'notifications_hidden',
		'registrations',
		'favored',
		'shared_event',
		'average_check',
		'overall_average_check',
		'spent_on_me',
		'overall_spent',
		'friends',
		'loyalty',
		'solvency'
	];
	
	AdminOrganizationCRMPage.prototype.initCRMTable = function() {
		var self = this;
		
		this.CRMTable = this.$wrapper.find('.CRMTable').eq(0).DataTable({
			paging: true,
			columnDefs: [
				{
					targets: 0,
					width: 350
				},
				{
					targets: 1,
					width: 550
				},
				{
					targets: 2,
					width: 90
				},
				{
					targets: 3,
					width: 60
				},
				{
					targets: range(24, 4),
					width: 100,
					visible: false,
					searchable: false
				}
			],
			fixedColumns: true,
			scrollX: '100%',
			scrollCollapse: true,
			dom: '<"data_tables_pagination"p>t<"data_tables_pagination"p>',
			language: {
				url: __LOCALE.DATATABLES_URL
			}
		});
		
		this.$wrapper.find('.CRMTableSearch').on('input', function() {
			self.CRMTable.search(this.value).draw();
		});
	};
	/**
	 *
	 * @param {(number|AdminOrganizationCRMPage.TABLE_COLUMNS)} index
	 */
	AdminOrganizationCRMPage.prototype.toggleColumn = function(index) {
		var column = this.CRMTable.column( (+index === index) ? index : AdminOrganizationCRMPage.TABLE_COLUMNS.indexOf(index) );
		
		column.visible( ! column.visible() );
		this.CRMTable.rows().recalcHeight().columns.adjust().fixedColumns().relayout().draw();
	};
	
	AdminOrganizationCRMPage.prototype.init = function() {
		this.initCRMTable();
	};
	
	AdminOrganizationCRMPage.prototype.render = function() {
		var self = this;
		
		this.$wrapper.html(tmpl('admin-organization-crm-page', {
			loader: (this.$loader = __APP.BUILD.overlayLoader())
		}));
		this.$wrapper.find('.CRMTableWrapper').addClass(__C.CLASSES.STATUS.DISABLED);
		
		this.init();
		
		this.organization_subscribers.fetchAllSubscribers(this.organization.subscribed_count, this.subscribers_fields).done(function(subscribers) {
			var $rows = tmpl('admin-organization-crm-page-tr', subscribers.map(function(subscriber) {
				
				return {
					name: __APP.BUILD.link({
						title: subscriber.full_name,
						page: '/user/' + subscriber.id
					}),
					email: subscriber.email,
					accounts: __APP.BUILD.socialLinks(subscriber.accounts_links),
					gender: (function(gender) {
						switch (gender) {
							case OneUser.GENDER.MALE:
								return 'М';
							case OneUser.GENDER.FEMALE:
								return 'Ж';
							default:
							case OneUser.GENDER.NEUTRAL:
								return '—';
						}
					}(subscriber.gender))
				};
			}));
			
			if (!self.CRMTable) {
				self.initCRMTable();
			}
			self.CRMTable.rows.add($rows).draw();
			try {
				self.CRMTable.rows().recalcHeight().columns.adjust().fixedColumns().relayout().draw();
			} catch (e) {
				__APP.reload();
			}
			
			self.$wrapper.find('.CRMTableWrapper').removeClass(__C.CLASSES.STATUS.DISABLED);
			self.$loader.remove();
		});
	};
	
	return AdminOrganizationCRMPage;
}()));
/**
 * @requires ../Class.Page.js
 */
/**
 *
 * @class AbstractEditOrganizationPage
 * @extends Page
 */
AbstractEditOrganizationPage = extending(Page, (function() {
	/**
	 *
	 * @constructor
	 * @constructs AbstractEditOrganizationPage
	 */
	function AbstractEditOrganizationPage() {
		Page.call(this);
		
		this.organization = new OneOrganization();
		this.categories = new CategoriesCollection();
		this.cities = new CitiesCollection();
		this.state_name = 'admin';
		
		this.fields = new Fields(
			'description',
			'site_url',
			'default_address',
			'vk_url',
			'privileges',
			'facebook_url',
			'email'
		);
		
		this.adding_is_over = false;
	}
	
	AbstractEditOrganizationPage.prototype.init = function() {
		var PAGE = this;
		
		function initEditEventPage($view) {
			
			bindSelect2($view);
			bindTabs($view);
			bindLimitInputSize($view);
			bindRippleEffect($view);
			bindFileLoadButton($view);
			ImgLoader.init($view);
			
			$view.find('#add_organization_address').placepicker();
			
			$view.find('#add_organization_submit').off('click.Submit').on('click.Submit', submitEditOrganization);
			
		}
		
		function initCities(selected_id) {
			var $select = PAGE.$wrapper.find('#add_organization_city');
			
			PAGE.cities.fetchCities(null, 0, 'local_name', function() {
				$select
					.append(tmpl('option', PAGE.cities.map(function(city) {
						return {
							val: city.id,
							display_name: city.local_name
						};
					})))
					.select2({
						containerCssClass: 'form_select2',
						dropdownCssClass: 'form_select2_drop'
					});
				if (selected_id) {
					$select.select2('val', selected_id);
				}
			});
		}
		
		function initOrganizationTypes(selected_id) {
			PAGE.categories.fetchCategories({}, 0, function(categories) {
				var $select = PAGE.$wrapper.find('#add_organization_type');
				
				$select
					.html(tmpl('option', categories.map(function(category) {
						return {
							val: category.id,
							display_name: category.name
						};
					})))
					.select2({
						containerCssClass: 'form_select2',
						dropdownCssClass: 'form_select2_drop'
					});
				if (selected_id) {
					$select.select2('val', selected_id);
				}
			});
		}
		
		function submitEditOrganization() {
			var $form = PAGE.$wrapper.find("#add-organization-form"),
				org_model = new OrganizationModel(),
				form_data = $form.serializeForm(),
				valid_form = formValidation($form, !!(form_data.organization_id)),
				method_name = PAGE.organization.id ? 'updateOrganization' : 'createOrganization',
				$loader;
			
			function formValidation($form, for_edit) {
				var is_valid = true,
					$times = $form.find('#edit_event_different_time').prop('checked') ? $form.find('[class^="TableDay_"]') : $form.find('.MainTime');
				
				$form.find(':required').not(':disabled').each(function() {
					var $this = $(this),
						max_length = $this.data('maxlength');
					if ($this.val() === "" || (max_length && $this.val().length > max_length)) {
						if (is_valid) {
							$('body').stop().animate({scrollTop: Math.ceil($this.offset().top - 150)}, 1000, 'swing');
						}
						handleErrorField($this);
						is_valid = false;
					}
				});
				
				$times.each(function() {
					var $row = $(this),
						start = $row.find('.StartHours').val() + $row.find('.StartMinutes').val(),
						end = $row.find('.EndHours').val() + $row.find('.EndMinutes').val();
					if (start > end) {
						if (is_valid) {
							$('body').stop().animate({scrollTop: Math.ceil($row.offset().top - 150)}, 1000, 'swing');
						}
						showNotifier({text: 'Начальное время не может быть меньше конечного', status: false});
						is_valid = false;
					}
				});
				
				if (!for_edit) {
					$form.find('.DataUrl').each(function() {
						var $this = $(this);
						if ($this.val() === "") {
							if (is_valid) {
								$('body').stop().animate({scrollTop: Math.ceil($this.closest('.EditEventImgLoadWrap').offset().top - 150)}, 1000, 'swing', function() {
									showNotifier({text: 'Пожалуйста, добавьте обложку организации', status: false})
								});
							}
							is_valid = false;
						}
					});
				}
				return is_valid;
			}
			
			if (valid_form) {
				PAGE.$wrapper.addClass(__C.CLASSES.STATUS.DISABLED);
				$loader = __APP.BUILD.overlayLoader(PAGE.$view);
				org_model.setData(form_data);
				
				PAGE.organization[method_name](org_model, function() {
					PAGE.adding_is_over = true;
					try {
						sessionStorage.removeItem('organization_info');
					} catch (e) {}
					$('.SidebarNav').find('.ContinueRegistration').remove();
					
					socket.emit('utils.registrationFinished', {
						uuid: PAGE.$wrapper.find('#add_organization_organization_registration_uuid').val()
					});
					socket.emit('utils.updateImages');
					
					PAGE.$wrapper.removeClass(__C.CLASSES.STATUS.DISABLED);
					$loader.remove();
					__APP.changeState('/organization/' + PAGE.organization.id);
				}, function() {
					PAGE.$wrapper.removeClass(__C.CLASSES.STATUS.DISABLED);
					$loader.remove();
				});
			}
		}
		
		initEditEventPage(this.$wrapper);
		bindCallModal(this.$wrapper);
		initOrganizationTypes(this.organization.type_id);
		initCities(this.organization.city_id || __APP.USER.selected_city.id);
	};
	
	AbstractEditOrganizationPage.prototype.render = function() {
		
		if (!checkRedirect('organization/add', '/add/organization')) {
			return null;
		}
		
		this.renderRest();
		this.init();
	};
	
	AbstractEditOrganizationPage.prototype.renderRest = function(page_vars) {};
	
	return AbstractEditOrganizationPage;
}()));
/**
 * @requires Class.AbstractEditOrganizationPage.js
 */
/**
 *
 * @class EditOrganizationPage
 * @extends AbstractEditOrganizationPage
 */
EditOrganizationPage = extending(AbstractEditOrganizationPage, (function() {
	/**
	 *
	 * @param {(string|number)} [organization_id]
	 * @constructor
	 * @constructs EditOrganizationPage
	 */
	function EditOrganizationPage(organization_id) {
		AbstractEditOrganizationPage.call(this);
		this.page_title = 'Редактировать организацию';
		this.organization = new OneOrganization(organization_id);
		
		this.adding_is_over = true;
	}
	
	EditOrganizationPage.prototype.fetchData = function() {
		var cities_promise = this.cities.fetchCities(null, 0, 'local_name');
		
		if (this.organization.id) {
			return this.fetching_data_defer = __APP.SERVER.multipleAjax(cities_promise, this.organization.fetchOrganization(this.fields));
		}
		
		return this.fetching_data_defer = cities_promise;
	};
	
	EditOrganizationPage.prototype.renderRest = function() {
		var self = this,
			additional_fields;
		
		if (this.organization.role === OneUser.ROLE.USER) {
			debugger;
			return __APP.changeState('/', true, true);
		}
		
		this.adding_is_over = true;
		additional_fields = $.extend(true, {}, this.organization);
		
		additional_fields.header_text = this.page_title;
		
		if (additional_fields.background_img_url) {
			additional_fields.background_filename = additional_fields.background_img_url.split('/').reverse()[0];
		}
		if (additional_fields.img_url) {
			additional_fields.logo_filename = additional_fields.img_url.split('/').reverse()[0];
		}
		
		this.$wrapper.html(tmpl('add-organization-page', additional_fields));
		
		
		if (additional_fields.img_url) {
			toDataUrl(additional_fields.img_url, function(base64_string) {
				self.$wrapper.find('#add_organization_img_src').val(base64_string ? base64_string : null);
			});
		}
		if (additional_fields.background_img_url) {
			toDataUrl(additional_fields.background_img_url, function(base64_string) {
				self.$wrapper.find('#add_organization_background_src').val(base64_string ? base64_string : null);
			});
		}
	};
	
	return EditOrganizationPage;
}()));
/**
 * @requires Class.AdminOrganizationPage.js
 * @requires ../../organizations/Class.EditOrganizationPage.js
 */
/**
 *
 * @class AdminOrganizationEditPage
 * @extends EditOrganizationPage
 * @extends AdminOrganizationPage
 */
AdminOrganizationEditPage = extending(EditOrganizationPage, AdminOrganizationPage, (function() {
	/**
	 *
	 * @param {(string|number)} organization_id
	 *
	 * @constructor
	 * @constructs AdminOrganizationEditPage
	 */
	function AdminOrganizationEditPage(organization_id) {
		var self = this;
		
		EditOrganizationPage.call(this, organization_id);
		AdminOrganizationPage.call(this, organization_id);
		
		Object.defineProperty(this, 'page_title_obj', {
			get: function() {
				return [{
					title: 'Организации',
					page: '/admin'
				}, self.organization.short_name + ' - редактирование'];
			}
		});
	}
	
	return AdminOrganizationEditPage;
}()));

AdminOrganizationEditPage.prototype.renderHeaderTabs = AdminOrganizationPage.prototype.renderHeaderTabs;
/**
 * @requires Class.AdminOrganizationPage.js
 */
/**
 *
 * @class AdminOrganizationEventsPage
 * @extends AdminOrganizationPage
 */
AdminOrganizationEventsPage = extending(AdminOrganizationPage, (function() {
	/**
	 *
	 * @param {(string|number)} org_id
	 * @constructor
	 * @constructs AdminOrganizationEventsPage
	 */
	function AdminOrganizationEventsPage(org_id) {
		AdminOrganizationPage.apply(this, arguments);
		
		this.block_scroll = false;
		this.future_events_data = {
			future: true,
			canceled_shown: true
		};
		this.past_events_data = {
			future: false,
			canceled_shown: true,
			order_by: '-first_event_date'
		};
		this.future_events = new EventsWithStatisticsCollection();
		this.past_events = new EventsWithStatisticsCollection();
	}
	
	AdminOrganizationEventsPage.buildEventRows = function(events, date_field) {
		var $events = tmpl('orgstat-events-row', events.map(function(event) {
			return $.extend({}, event, {
				date: moment.unix(event[date_field]).format(__LOCALES.ru_RU.DATE.DATE_FORMAT),
				timestamp: event[date_field],
				conversion: Math.round(event.view == 0 ? event.view : (event.view_detail * 100 / event.view)) + '%'
			});
		}));
		bindPageLinks($events);
		return $events;
	};
	
	AdminOrganizationEventsPage.prototype.render = function() {
		var this_page = this,
			$window = $(window),
			$past_events_wrapper,
			past_events_tablesort;
		
		if (this.organization.role === OneUser.ROLE.USER) {
			return __APP.changeState('/', true, true);
		}
		
		this.renderHeaderTabs();
		__APP.changeTitle([{
			title: 'Организации',
			page: '/admin'
		}, this.organization.short_name + ' - события']);
		
		this.$wrapper.html(tmpl('orgstat-events-page'));
		
		this.future_events.fetchOrganizationsEvents(this.organization.id, this.future_events_data, 0, function() {
			if(this.length){
				this_page.$wrapper.find('.OrgStatFutureEventsWrapper').html(tmpl('orgstat-events-wrapper', {
					title: 'Предстоящие события',
					rows: AdminOrganizationEventsPage.buildEventRows(this_page.future_events, 'nearest_event_date')
				})).find('table').tablesort();
			}
		});
		
		this.past_events.fetchOrganizationsEvents(this.organization.id, this.past_events_data, 30, function() {
			if(this.length){
				$past_events_wrapper = this_page.$wrapper.find('.OrgStatPastEventsWrapper');
				$past_events_wrapper.html(tmpl('orgstat-events-wrapper', {
					title: 'Прошедшие события',
					rows: AdminOrganizationEventsPage.buildEventRows(this_page.past_events, 'first_event_date')
				}));
				past_events_tablesort = $past_events_wrapper.find('table').tablesort();
				
				$window.on('scroll.uploadEvents', function() {
					if ($window.height() + $window.scrollTop() + 200 >= $(document).height() && !this_page.block_scroll) {
						this_page.block_scroll = true;
						
						this_page.past_events.fetchOrganizationsEvents(this_page.organization.id, this_page.past_events_data, 30, function(events) {
							this_page.block_scroll = false;
							if (events.length) {
								$past_events_wrapper.find('tbody').append(AdminOrganizationEventsPage.buildEventRows(events, 'first_event_date'));
								past_events_tablesort.refresh();
							} else {
								$(window).off('scroll.uploadEvents');
							}
						})
					}
				})
			}
		});
	};
	
	return AdminOrganizationEventsPage;
}()));
/**
 * @requires Class.AdminOrganizationPage.js
 */
/**
 *
 * @class AdminOrganizationOverviewPage
 * @extends AdminOrganizationPage
 */
AdminOrganizationOverviewPage = extending(AdminOrganizationPage, (function() {
	/**
	 *
	 * @param {(string|number)} org_id
	 * @constructor
	 * @constructs AdminOrganizationOverviewPage
	 */
	function AdminOrganizationOverviewPage(org_id) {
		AdminOrganizationPage.apply(this, arguments);
		this.graphics_stats = new OrganizationsStatistics(this.id);
		this.other_stats = new OrganizationsStatistics(this.id);
		
		this.organization_fields = new Fields(
			'description',
			'img_medium_url',
			'default_address',
			'staff',
			'privileges', {
				events: {
					length: 3,
					filters: 'future=true,is_canceled=false,is_delayed=true',
					fields: new Fields('organization_short_name',	'public_at'),
					order_by: 'nearest_event_date'
				}
			}
		);
	}
	/**
	 *
	 * @param {string} title
	 * @param staff
	 * @return {jQuery}
	 */
	AdminOrganizationOverviewPage.buildStaffBlock = function(title, staff) {
		if (staff.length) {
			return tmpl('orgstat-overview-sidebar-wrapper-title', {title: title}).add(__APP.BUILD.avatarBlocks(staff, {
				is_link: true,
				entity: __C.ENTITIES.USER,
				avatar_classes: [__C.CLASSES.SIZES.X40, __C.CLASSES.UNIVERSAL_STATES.ROUNDED]
			}));
		}
		return $();
	};
	
	AdminOrganizationOverviewPage.prototype.buildAreaCharts = function() {
		var self = this;
		AdminPage.prototype.buildAreaCharts.call(self, {
			subscribe_unsubscribe: self.graphics_stats.subscribe.map(function(el, i) {
				return {
					time_value: el.time_value,
					subscribe: el.value,
					unsubscribe: self.graphics_stats.unsubscribe[i].value
				}
			}),
			view: self.graphics_stats.view,
			conversion: self.graphics_stats.conversion
		});
	};
	
	AdminOrganizationOverviewPage.prototype.buildPieChart = function($container, data) {
		var pie_chart_options = {
			chart: {
				type: 'pie',
				height: 200,
				style: {
					fontFamily: 'inherit',
					fontSize: 'inherit'
				}
			},
			colors: [__C.COLORS.FRANKLIN, __C.COLORS.ACCENT, __C.COLORS.MUTED, __C.COLORS.MUTED_80, __C.COLORS.MUTED_50, __C.COLORS.MUTED_30],
			tooltip: {
				pointFormat: '<b>{point.percentage:.1f}%</b>'
			},
			plotOptions: {
				pie: {
					center: [45, '50%'],
					allowPointSelect: true,
					cursor: 'pointer',
					size: 120,
					dataLabels: {
						distance: -35,
						defer: false,
						formatter: function() {
							return this.percentage > 15 ? Math.round(this.percentage) + '%' : null;
						},
						style: {"color": "#fff", "fontSize": "20px", "fontWeight": "300", "textShadow": "none"},
						y: -6
					},
					showInLegend: true
				}
			},
			legend: {
				align: 'right',
				verticalAlign: 'top',
				layout: 'vertical',
				width: 100,
				symbolHeight: 0,
				symbolWidth: 0,
				itemMarginBottom: 5,
				labelFormatter: function() {
					return '<span style="color: ' + this.color + '">' + this.name + '</span>'
				},
				itemStyle: {cursor: 'pointer', fontSize: '14px', fontWeight: '500'},
				y: 12
			}
		};
		
		function pieChartSeriesNormalize(raw_data) {
			var STD_NAMES = {
				"browser": "Браузер",
				"android": "Аndroid",
				"ios": "iOS",
				"female": "Женщины",
				"male": "Мужчины",
				"other": "Остальные",
				null: "Не указано"
			};
			return [{
				data: raw_data.map(function(line, i) {
					return {
						name: line.name ? STD_NAMES[line.name] : STD_NAMES[line.gender],
						y: line.count
					}
				})
			}];
		}
		
		$container.highcharts($.extend(true, {}, this.highchart_defaults, pie_chart_options, {series: pieChartSeriesNormalize(data)}));
	};
	
	AdminOrganizationOverviewPage.prototype.render = function() {
		var PAGE = this,
			stat_dynamics = {
				scale: Statistics.SCALES.WEEK,
				fields: [
					'subscribe',
					'view',
					'fave',
					'conversion'
				]
			},
			storage_data_name = 'org_stats_' + this.id + '_data',
			storage_until_name = 'org_stats_' + this.id + '_until',
			is_cached_data_actual = moment.unix(sessionStorage.getItem(storage_until_name)).isAfter(moment());
		
		
		if (!checkRedirect('overview', '/admin/organization/'+this.organization.id+'/overview', true)) {
			return null;
		}
		
		this.renderHeaderTabs();
		__APP.changeTitle([{
			title: 'Организации',
			page: '/admin'
		}, this.organization.short_name]);
		
		function extendStaffProps(staff) {
			return $.extend({}, staff, {
				is_link: true,
				avatar_classes: ['-size_40x40', '-rounded']
			});
		}
		
		
		this.$wrapper.html(tmpl('orgstat-overview', $.extend(true, {}, this.organization, {
			avatar_block: __APP.BUILD.avatarBlocks(this.organization, {
				entity: __C.ENTITIES.ORGANIZATION,
				block_classes: ['-stack']
			}),
			staff_block: AdminOrganizationOverviewPage.buildStaffBlock('Администраторы', this.organization.admins.map(extendStaffProps))
			                                          .add(AdminOrganizationOverviewPage.buildStaffBlock('Модераторы', this.organization.moderators.map(extendStaffProps))),
			event_blocks: this.organization.events.length ? tmpl('orgstat-overview-sidebar-wrapper', {
				content: tmpl('orgstat-overview-sidebar-wrapper-title', {title: 'Предстоящие события'})
					.add(tmpl('orgstat-event-block', this.organization.events.map(function(event) {
						var badges = [];
						if (event.canceled)
							badges.push({title: 'Отменено'});
						if (event.public_at && moment.unix(event.public_at).isBefore())
							badges.push({title: 'Не опубликовано'});
						
						return {
							id: event.id,
							title: event.title,
							organization_short_name: event.organization_short_name,
							day: moment.unix(event.first_event_date).format("D"),
							month: moment.unix(event.first_event_date).format("MMM"),
							badges: tmpl('orgstat-event-block-badge', badges)
						};
					})))
			}) : ''
		})));
		
		if (is_cached_data_actual) {
			this.graphics_stats.setData(JSON.parse(sessionStorage.getItem(storage_data_name)));
			this.buildAreaCharts();
		} else {
			this.$wrapper.find('.OrgStatAreaCharts').children('.AreaChart').append(tmpl('loader'));
			this.graphics_stats.fetchStatistics(Statistics.SCALES.DAY, moment(__APP.EVENDATE_BEGIN, 'DD-MM-YYYY').format(), ['view', 'subscribe', 'unsubscribe', 'conversion'], null, function() {
				sessionStorage.setItem(storage_data_name, JSON.stringify(PAGE.graphics_stats));
				sessionStorage.setItem(storage_until_name, moment().add(15, 'm').unix());
				PAGE.buildAreaCharts();
			});
		}
		
		this.other_stats.fetchStatistics(Statistics.SCALES.OVERALL, false, ['subscribe', 'view', 'fave', 'conversion', 'audience'], stat_dynamics, function(stat_data) {
			var scoreboards_data = {numbers: {}, dynamics: {}};
			
			$.each(stat_data.dynamics, function(field, dynamics) {
				scoreboards_data.dynamics[field] = dynamics[0].value;
				scoreboards_data.numbers[field] = stat_data[field][0].value;
			});
			PAGE.buildPieChart(PAGE.$wrapper.find('.GenderPieChart'), this.audience.gender);
			PAGE.buildPieChart(PAGE.$wrapper.find('.DevicePieChart'), this.audience.devices);
			
			PAGE.updateScoreboards(PAGE.$wrapper.find('.Scoreboards'), scoreboards_data, {
				'subscribe': 'Подписчиков организатора',
				'fave': 'Добавлений в избранное',
				'view': 'Просмотров организатора',
				'conversion': 'Конверсия открытий/подписок'
			}, ['subscribe', 'fave', 'view', 'conversion']);
			
		});
		
		bindRippleEffect(this.$wrapper);
		bindPageLinks(this.$wrapper);
	};
	
	return AdminOrganizationOverviewPage;
}()));
/**
 * @requires Class.AdminOrganizationPage.js
 */
/**
 *
 * @class AdminOrganizationPromotionPage
 * @extends AdminOrganizationPage
 */
AdminOrganizationPromotionPage = extending(AdminOrganizationPage, (function() {
	/**
	 *
	 * @param {(string|number)} org_id
	 * @constructor
	 * @constructs AdminOrganizationPromotionPage
	 */
	function AdminOrganizationPromotionPage(org_id) {
		AdminOrganizationPage.apply(this, arguments);
	}
	
	AdminOrganizationPromotionPage.prototype.render = function() {};
	
	return AdminOrganizationPromotionPage;
}()));
/**
 * @requires Class.AdminOrganizationPage.js
 */
/**
 *
 * @class AdminOrganizationSettingsPage
 * @extends AdminOrganizationPage
 */
AdminOrganizationSettingsPage = extending(AdminOrganizationPage, (function() {
	/**
	 *
	 * @param {(string|number)} org_id
	 * @constructor
	 * @constructs AdminOrganizationSettingsPage
	 */
	function AdminOrganizationSettingsPage(org_id) {
		var self = this;
		
		AdminOrganizationPage.call(this, org_id);
		
		this.organization_fields = new Fields(
			'city',
			'country',
			'default_address',
			'description',
			'brand_color',
			'is_private',
			'email',
			'privileges',
			'staff',
			'site_url', {
				tariff: {
					fields: new Fields(
						'till',
						'available_additional_notifications',
						'available_event_publications',
						'available_tickets_selling',
						'available_telegram_bots',
						'available_slack_bots',
						'available_auditory_analytics',
						'available_in_city',
						'price'
					)
				}
			}
		);
	}
	/**
	 *
	 * @returns {jqPromise}
	 */
	AdminOrganizationSettingsPage.prototype.updateOrganizationData = function() {
		return this.organization.updateOrganization(new OrganizationModel(this.organization));
	};
	
	AdminOrganizationSettingsPage.prototype.init = function() {
		var self = this;
		
		bindCallModal(this.$wrapper);
		bindRippleEffect(this.$wrapper);
		
		this.$wrapper.find('#org_admin_settings_is_private').on('change', function() {
			self.organization.is_private = $(this).prop('checked');
			self.updateOrganizationData();
		});
		
		this.$wrapper.find('.SaveLocal').on('click', function() {
			self.organization.setData($(this).closest('.SaveLocalWrapper').serializeForm());
			self.updateOrganizationData();
		});
		
		this.$view.on('staff:add', function(e, role, staff) {
			var $staff_collection = self.$wrapper.find('.StaffCollection');
			
			self.organization.staff.remove(staff.id);
			self.organization.staff.setData(staff);
			$staff_collection.find('.User'+staff.id).remove();
			$staff_collection.filter(function(i, elem) {
				return $(elem).data('staff_type') === role;
			}).children('.'+__C.CLASSES.HOOKS.ADD_STAFF).before(__APP.BUILD.avatarBlocks(staff, {
				is_link: true,
				avatar_classes: [__C.CLASSES.SIZES.X40, __C.CLASSES.UNIVERSAL_STATES.ROUNDED]
			}));
			
			bindPageLinks($staff_collection);
		});
		
		this.$wrapper.find('.ActivatePayment').on('click', function() {
			__APP.SERVER.addData('/api/v1/payments/organizations/', {
				organization_id: self.organization.id
			}, false, function(data) {
				tmpl('admin-organization-payment-form', {
					customer_id: __APP.USER.full_name,
					cps_email: __APP.USER.email,
					callback_url: location.href,
					payment_uuid: data.uuid,
					sum: data.sum
				}, self.$wrapper).submit().remove();
			});
		});
	};
	
	AdminOrganizationSettingsPage.prototype.render = function() {
		var self = this,
			staffs_additional_fields = {
				is_link: true,
				avatar_classes: [__C.CLASSES.SIZES.X40, __C.CLASSES.UNIVERSAL_STATES.ROUNDED]
			};
		
		this.renderHeaderTabs();
		
		__APP.changeTitle([{
			title: 'Организации',
			page: '/admin'
		}, this.organization.short_name + ' - настройки']);
		
		this.$wrapper.html(tmpl('admin-organization-settings-page', $.extend({}, this.organization, {
			admin_avatar_blocks: __APP.BUILD.avatarBlocks(this.organization.admins, staffs_additional_fields)
			                          .add(__APP.BUILD.addUserAvatarBlock(this.organization.id, OneUser.ROLE.ADMIN, {avatar_classes: [__C.CLASSES.SIZES.X40, __C.CLASSES.UNIVERSAL_STATES.ROUNDED]})),
			moderator_avatar_blocks: __APP.BUILD.avatarBlocks(this.organization.moderators, staffs_additional_fields)
			                              .add(__APP.BUILD.addUserAvatarBlock(this.organization.id, OneUser.ROLE.MODERATOR, {avatar_classes: [__C.CLASSES.SIZES.X40, __C.CLASSES.UNIVERSAL_STATES.ROUNDED]})),
			private_checkbox: __APP.BUILD.checkbox({
				id: 'org_admin_settings_is_private',
				name: 'is_private',
				label: 'Закрытая организация',
				attributes: {
					checked: self.organization.is_private
				}
			}),
			subdomain_radio: __APP.BUILD.radio({
				id: 'org_admin_settings_subdomain_enabled',
				name: 'domains'
			}),
			other_domain_radio: __APP.BUILD.radio({
				id: 'org_admin_settings_other_domain_enabled',
				name: 'domains'
			}),
			tariff_button: __APP.BUILD.button({
				title: 'Оплатить',
				classes: [__C.CLASSES.COLORS.ACCENT, __C.CLASSES.HOOKS.RIPPLE, 'ActivatePayment']
			}),
			tariff_service_info: !self.organization.tariff.is_full ? '' : 'Оплачен до ' + moment.unix(self.organization.tariff.till).calendar(null, {
				sameDay: '[Сегодня]',
				nextDay: '[Завтра]',
				nextWeek: 'D MMMM YYYY',
				lastWeek: 'D MMMM YYYY',
				sameElse: 'D MMMM YYYY'
			})
		})));
		
		this.init();
	};
	
	AdminOrganizationSettingsPage.prototype.destroy = function() {
		this.$view.off('staff:add');
	};
	
	return AdminOrganizationSettingsPage;
}()));
/**
 * @requires Class.AdminOrganizationPage.js
 */
/**
 *
 * @class AdminOrganizationSupportPage
 * @extends AdminOrganizationPage
 */
AdminOrganizationSupportPage = extending(AdminOrganizationPage, (function() {
	/**
	 *
	 * @param {(string|number)} org_id
	 * @constructor
	 * @constructs AdminOrganizationSupportPage
	 */
	function AdminOrganizationSupportPage(org_id) {
		AdminOrganizationPage.apply(this, arguments);
	}
	
	AdminOrganizationSupportPage.prototype.render = function() {};
	
	return AdminOrganizationSupportPage;
}()));
/**
 * @requires ../../Class.Page.js
 */
/**
 *
 * @abstract
 * @class FeedPage
 * @extends Page
 */
FeedPage = extending(Page, (function() {
	/**
	 *
	 * @constructor
	 * @constructs FeedPage
	 */
	function FeedPage() {
		Page.call(this);
		this.fields = new Fields(
			'organization_short_name',
			'organization_logo_small_url',
			'dates',
			'is_same_time',
			'favored_users_count',
			'is_favorite',
			'is_registered',
			'ticketing_locally',
			'registration_locally',
			'registration_available',
			'registration_required',
			'registration_till',
			'registration_limit_count',
			'is_free',
			'min_price', {
				favored: {
					fields: 'is_friend',
					order_by: '-is_friend',
					length: 10
				}
			}
		);
		this.events = new EventsCollection();
		this.next_events_length = 20;
		this.wrapper_tmpl = 'feed';
		this.with_header_tabs = true;
	}
	
	FeedPage.prototype.bindFeedEvents = function($parent) {
		trimAvatarsCollection($parent);
		bindRippleEffect($parent);
		bindDropdown($parent);
		__APP.MODALS.bindCallModal($parent);
		bindPageLinks($parent);
		
		$parent.find('.HideEvent').not('.-Handled_HideEvent').each(function() {
			var $this = $(this),
				$event = $this.parents('.FeedEvent'),
				event_id = $this.data("event-id");
			
			$this.on('click', function() {
				$event.addClass('-cancel');
				OneEvent.changeEventStatus(event_id, OneEvent.STATUS.HIDE, function() {
					$event.after(tmpl('button', {
						classes: '-color_neutral ReturnEvent',
						title: 'Вернуть событие',
						dataset: 'data-event-id="' + event_id + '"'
					}));
					$event.siblings('.ReturnEvent').not('.-Handled_ReturnEvent').on('click', function() {
						var $remove_button = $(this);
						OneEvent.changeEventStatus(event_id, OneEvent.STATUS.SHOW, function() {
							$remove_button.remove();
							$event.removeClass('-cancel');
						});
					}).addClass('-Handled_ReturnEvent');
				});
			});
		}).addClass('-Handled_HideEvent');
	};
	
	FeedPage.prototype.addNoEventsBlock = function() {
		var $no_events_block = tmpl('feed-no-event', {
			text: 'Как насчет того, чтобы подписаться на организации?',
			button: __APP.BUILD.link({
				title: 'Перейти к каталогу',
				classes: ['button', '-color_neutral_accent', 'RippleEffect'],
				page: '/organizations'
			})
		}, this.$wrapper);
		bindPageLinks($no_events_block);
		bindRippleEffect($no_events_block);
	};
	/**
	 *
	 * @param {function(jQuery)} [success]
	 * @returns {jqPromise}
	 */
	FeedPage.prototype.appendEvents = function(success) {
		var PAGE = this,
			$loader = __APP.BUILD.loaderBlock(PAGE.$wrapper);
		
		PAGE.block_scroll = true;
		return PAGE.events.fetchFeed(this.fields, this.next_events_length, function(events) {
			var $events = __APP.BUILD.eventCards(PAGE.events.last_pushed);
			PAGE.block_scroll = false;
			if ($events.length) {
				PAGE.$wrapper.append($events);
				PAGE.bindFeedEvents($events);
				if (isFunction(success)) {
					success($events);
				}
			} else {
				PAGE.addNoEventsBlock();
				$(window).off('scroll.upload' + PAGE.constructor.name);
			}
			$loader.remove();
		});
	};
	
	FeedPage.prototype.initFeedCalendar = function() {
		var PAGE = this,
			selected_date = PAGE.events.date,
			MainCalendar = new Calendar(PAGE.$view.find('.FeedCalendar'), {
				classes: {
					wrapper_class: 'feed_calendar_wrapper',
					table_class: 'feed_calendar_table',
					thead_class: 'feed_calendar_thead',
					tbody_class: 'feed_calendar_tbody',
					th_class: 'feed_calendar_th',
					td_class: 'feed_calendar_td',
					td_disabled: __C.CLASSES.DISABLED
				}
			});
		
		MainCalendar.init();
		if (selected_date) {
			MainCalendar.setMonth(selected_date.split('-')[1], selected_date.split('-')[0]).selectDays(selected_date);
		}
		MainCalendar.setDaysWithEvents();
		MainCalendar.$calendar.on('month-changed', function() {
			bindPageLinks(MainCalendar.$calendar);
			MainCalendar.setDaysWithEvents();
		});
	};
	
	FeedPage.prototype.render = function() {
		var PAGE = this,
			$window = $(window);
		
		if (!(__APP.PREVIOUS_PAGE instanceof FeedPage)) {
			PAGE.initFeedCalendar();
		}
		
		if(__APP.USER.isLoggedOut()){
			__APP.renderHeaderTabs([
				{title: 'Актуальные', page: '/feed/actual'},
				{title: 'По времени', page: '/feed/timeline'}
			]);
			
			PAGE.$view.find('.BecomeOrg').on('click', function(e) {
				cookies.removeItem('auth_command');
				cookies.removeItem('auth_entity_id');
				(new AuthModal(location.origin + '/add/organization')).show();
				
				return false;
			});
			if(window.location.pathname == '/feed/favored' || window.location.pathname == '/feed/recommendations'){
				__APP.changeState('/feed/actual', true, true);
				return null;
			}
		} else {
			__APP.renderHeaderTabs([
				{title: 'Актуальные', page: '/feed/actual'},
				{title: 'По времени', page: '/feed/timeline'},
				{title: 'Избранные', page: '/feed/favored'},
				{title: 'Рекомендованные', page: '/feed/recommendations'}/*,
				 {title: 'Друзья', page: '/feed/friends/'},*/
			]);
		}
		
		$window.off('scroll');
		PAGE.appendEvents(function() {
			if (isScrollRemain(1000)) {
				PAGE.appendEvents();
			}
			$window.on('scroll.upload' + PAGE.constructor.name, function() {
				if (isScrollRemain(1000) && !PAGE.block_scroll) {
					PAGE.appendEvents();
				}
			})
		});
	};
	
	return FeedPage;
}()));
/**
 * @requires Class.FeedPage.js
 */
/**
 *
 * @class ActualEventsPage
 * @extends FeedPage
 */
ActualEventsPage = extending(FeedPage, (function() {
	/**
	 *
	 * @constructor
	 * @constructs ActualEventsPage
	 */
	function ActualEventsPage() {
		FeedPage.apply(this);
		this.events = new ActualEventsCollection();
		this.page_title = 'Актуальные события';
	}
	
	return ActualEventsPage
}()));
/**
 * @requires Class.FeedPage.js
 */
/**
 *
 * @class DayEventsPage
 * @extends FeedPage
 */
DayEventsPage = extending(FeedPage, (function() {
	/**
	 *
	 * @param {string} date
	 * @constructor
	 * @constructs DayEventsPage
	 */
	function DayEventsPage(date) {
		if (!date)
			throw Error('DayEventsCollection must have date parameter');
		FeedPage.apply(this);
		this.date = date;
		this.events = new DayEventsCollection(this.date);
		this.page_title = 'События на ' + moment(this.date).format('D MMMM YYYY');
	}
	
	return DayEventsPage
}()));
/**
 * @requires Class.FeedPage.js
 */
/**
 *
 * @class FavoredEventsPage
 * @extends FeedPage
 */
FavoredEventsPage = extending(FeedPage, (function() {
	/**
	 *
	 * @constructor
	 * @constructs FavoredEventsPage
	 */
	function FavoredEventsPage() {
		FeedPage.apply(this);
		this.events = new FavoredEventsCollection();
		this.page_title = 'Избранные события';
	}
	
	return FavoredEventsPage
}()));
/**
 * @requires Class.FeedPage.js
 */
/**
 *
 * @class FriendsEventsPage
 * @extends FeedPage
 */
FriendsEventsPage = extending(FeedPage, (function() {
	/**
	 *
	 * @constructor
	 * @constructs FriendsEventsPage
	 */
	function FriendsEventsPage() {
		FeedPage.apply(this);
		this.events = new FriendsEventsCollection();
		this.page_title = 'События друзей';
	}
	
	return FriendsEventsPage
}()));
/**
 * @requires Class.FeedPage.js
 */
/**
 *
 * @class RecommendedEventsPage
 * @extends FeedPage
 */
RecommendedEventsPage = extending(FeedPage, (function() {
	/**
	 *
	 * @constructor
	 * @constructs RecommendedEventsPage
	 */
	function RecommendedEventsPage() {
		FeedPage.apply(this);
		this.events = new RecommendedEventsCollection();
		this.page_title = 'Рекомендованные события';
	}
	
	return RecommendedEventsPage
}()));
/**
 * @requires Class.FeedPage.js
 */
/**
 *
 * @class TimelineEventsPage
 * @extends FeedPage
 */
TimelineEventsPage = extending(FeedPage, (function() {
	/**
	 *
	 * @constructor
	 * @constructs TimelineEventsPage
	 */
	function TimelineEventsPage() {
		FeedPage.apply(this);
		this.events = new TimelineEventsCollection();
		this.page_title = 'События по времени';
	}
	
	return TimelineEventsPage
}()));
/**
 * @requires Class.Page.js
 */
/**
 *
 * @class NotFoundPage
 * @extends Page
 */
NotFoundPage = extending(Page, (function() {
	/**
	 *
	 * @constructor
	 * @constructs NotFoundPage
	 */
	function NotFoundPage() {
		Page.call(this);
	}
	
	NotFoundPage.prototype.render = function() {
		__APP.changeTitle('Страница не найдена');
	};
	
	return NotFoundPage;
}()));
/**
 * @requires Class.AdminPage.js
 */
/**
 *
 * @class AdminOrganizationsPage
 * @extends AdminPage
 */
AdminOrganizationsPage = extending(AdminPage, (function() {
	/**
	 *
	 * @constructor
	 * @constructs AdminOrganizationsPage
	 */
	function AdminOrganizationsPage() {
		AdminPage.call(this);
		
		this.is_upload_disabled = false;
		this.block_scroll = false;
		this.my_organizations_fields = new Fields('img_medium_url', 'subscribed_count', 'staff');
		this.page_title = 'Организации';
		this.my_organizations = new OrganizationsCollection();
	}
	
	/**
	 *
	 * @param {(OrganizationsCollection|Array<OneOrganization>)} organizations
	 * @return {jQuery}
	 */
	AdminOrganizationsPage.buildMyOrganizationsBlocks = function(organizations) {
		return tmpl('statistics-overview-organization', organizations.map(function(org) {
			
			var avatars_max_count = 2,
				org_roles = [
					{
						name: OneUser.ROLE.ADMIN,
						title: 'Администраторы',
						staff: org.admins,
						plural_name: OneUser.ROLE.ADMIN + 's_block'
					}, {
						name: OneUser.ROLE.MODERATOR,
						title: 'Модераторы',
						staff: org.moderators,
						plural_name: OneUser.ROLE.MODERATOR + 's_block'
					}
				];
			
			return $.extend(true, {}, org, {
				subscribers: org.subscribed_count + getUnitsText(org.subscribed_count, __LOCALES.ru_RU.TEXTS.SUBSCRIBERS),
				buttons: __APP.BUILD.link({
					title: 'Редактировать',
					classes: ['button', 'fa_icon', 'fa-pencil', '-color_neutral', 'RippleEffect'],
					page: '/admin/organization/' + org.id + '/edit'
				}, {
					title: 'Создать событие',
					classes: ['button', 'fa_icon', 'fa-plus', '-color_accent', 'RippleEffect'],
					page: '/add/event/to/' + org.id
				})
			}, org_roles.reduce(function(obj, role) {
				obj[role.plural_name] = __APP.BUILD.avatarCollection(role.staff.map(function(staff) {
					return $.extend({}, staff, {
						is_link: true,
						avatar_classes: ['-size_100x100', '-rounded']
					});
				}), avatars_max_count, {
					dataset: {
						modal_type: 'editors',
						modal_specific_role: role.name,
						modal_title: role.title,
						modal_organization_id: org.id
					},
					classes: ['-size_30x30', '-rounded', '-shifted', 'CallModal'],
					counter_classes: ['-size_30x30','-color_marginal_primary']
				});
				
				return obj;
			}, {}));
		}));
	};
	
	AdminOrganizationsPage.prototype.fetchData = function() {
		return this.fetching_data_defer = this.my_organizations.fetchMyOrganizations([OneUser.ROLE.ADMIN, OneUser.ROLE.MODERATOR], this.my_organizations_fields, 10, '');
	};
	
	AdminOrganizationsPage.prototype.bindOrganizationsEvents = function($parent) {
		trimAvatarsCollection($parent);
		bindPageLinks($parent);
		__APP.MODALS.bindCallModal($parent);
		bindRippleEffect($parent);
		return $parent;
	};
	
	AdminOrganizationsPage.prototype.init = function() {
		var PAGE = this;
		
		this.bindOrganizationsEvents(this.$wrapper);
		
		
		$(window).on('scroll.uploadOrganizations', function() {
			var $loader,
				$wrapper,
				$organizations;
			
			if (isScrollRemain(200) && !PAGE.is_upload_disabled && !PAGE.block_scroll) {
				PAGE.block_scroll = true;
				$wrapper = PAGE.$wrapper.find('.StatOverviewOrganizations');
				$loader = __APP.BUILD.loaderBlock($wrapper);
				
				PAGE.my_organizations.fetchMyOrganizations([OneUser.ROLE.ADMIN, OneUser.ROLE.MODERATOR], PAGE.my_organizations_fields, 10, '', function(organizations) {
					PAGE.block_scroll = false;
					$loader.remove();
					$organizations = AdminOrganizationsPage.buildMyOrganizationsBlocks(organizations);
					if (organizations.length) {
						$wrapper.append($organizations);
						PAGE.bindOrganizationsEvents($organizations);
					} else {
						PAGE.is_upload_disabled = true;
					}
				});
			}
		});
	};
	
	AdminOrganizationsPage.prototype.render = function() {
		if(__APP.USER.id === -1){
			__APP.changeState('/feed/actual', true, true);
			return null;
		}
		this.$wrapper.html(tmpl('statistics-overview-wrapper', {
			organizations: AdminOrganizationsPage.buildMyOrganizationsBlocks(this.my_organizations)
		}));
		this.init();
	};
	
	AdminOrganizationsPage.prototype.destroy = function() {
		$(window).off('scroll.uploadOrganizations');
	};
	
	return AdminOrganizationsPage;
}()));
/**
 * @requires Class.AbstractEditEventPage.js
 */
/**
 *
 * @class AddEventPage
 * @extends AbstractEditEventPage
 */
AddEventPage = extending(AbstractEditEventPage, (function() {
	/**
	 *
	 * @param {(string|number)} [org_id]
	 * @constructor
	 * @constructs AddEventPage
	 */
	function AddEventPage(org_id) {
		AbstractEditEventPage.call(this);
		this.page_title = 'Добавить событие';
		this.organization_id = org_id;
	}
	
	return AddEventPage;
}()));
/**
 * @requires ../Class.Page.js
 */
/**
 *
 * @class EventPage
 * @extends Page
 */
EventPage = extending(Page, (function() {
	/**
	 *
	 * @constructor
	 * @constructs EventPage
	 * @param {(string|number)} event_id
	 */
	function EventPage(event_id) {
		Page.apply(this);

		this.event = new OneEvent(event_id);
	}
	
	EventPage.fields = new Fields([
		'image_horizontal_medium_url',
		'image_horizontal_large_url',
		'favored_users_count',
		'is_favorite',
		'description',
		'location',
		'latitude',
		'longitude',
		'is_online',
		'can_edit',
		'is_free',
		'min_price',
		'organization_logo_small_url',
		'organization_short_name',
		'is_same_time',
		'tags',
		'detail_info_url',
		'canceled',
		'public_at',
		'is_registered',
		'registration_required',
		'registration_approvement_required',
		'registration_till',
		'registration_limit_count',
		'registration_locally',
		'registration_fields',
		'registration_available',
		'registration_approved',
		'registered_count',
		'registered'
	], {
		dates: {
			length: 0,
			fields: new Fields('start_time', 'end_time')
		},
		favored: {
			fields: new Fields('is_friend'),
			order_by: '-is_friend',
			length: 10
		},
		notifications: {
			fields: new Fields('notification_type', 'done')
		},
		orders: {
			fields: new Fields('created_at')
		},
		tickets: new Fields('created_at', 'number', 'ticket_type')
	});
	
	/**
	 *
	 * @param {Array} raw_notifications
	 * @param {(number|string)} event_id
	 * @param {timestamp} last_date
	 * @return {jQuery}
	 */
	EventPage.buildNotifications = function(raw_notifications, event_id, last_date) {
		var m_today = moment(),
			all_notifications = {
				'notification-before-quarter-of-hour': {
					label: 'За 15 минут',
					moment: moment.unix(last_date).subtract(15, 'minutes').unix()
				},
				'notification-before-three-hours': {
					label: 'За 3 часа',
					moment: moment.unix(last_date).subtract(3, 'hours').unix()
				},
				'notification-before-day': {
					label: 'За день',
					moment: moment.unix(last_date).subtract(1, 'days').unix()
				},
				'notification-before-three-days': {
					label: 'За 3 дня',
					moment: moment.unix(last_date).subtract(3, 'days').unix()
				},
				'notification-before-week': {
					label: 'За неделю',
					moment: moment.unix(last_date).subtract(1, 'week').unix()
				}
			},
			$notifications = $(),
			current_notifications = {},
			i = 0;
		for (var notif in raw_notifications) {
			if (raw_notifications.hasOwnProperty(notif)) {
				current_notifications[raw_notifications[notif].notification_type] = raw_notifications[notif];
			}
		}
		
		for (var notification in all_notifications) {
			
			if (all_notifications.hasOwnProperty(notification)) {
				var is_disabled = moment.unix(all_notifications[notification].moment).isBefore(m_today),
					data = {
						id: 'event_notify_' + (++i),
						classes: ['ToggleNotification'],
						name: 'notification_time',
						label: all_notifications[notification].label,
						attributes: {
							value: notification
						},
						dataset: {
							event_id: event_id
						}
					};
				
				if (current_notifications[notification]) {
					is_disabled = is_disabled || current_notifications[notification].done || !current_notifications[notification].uuid;
					if (current_notifications[notification].uuid) {
						data.dataset.uuid = current_notifications[notification].uuid;
					}
					data.attributes.checked = true;
				}
				if (is_disabled) {
					data.unit_classes = ['-status_disabled'];
					data.attributes.disabled = true;
				}
				$notifications = $notifications.add(__APP.BUILD.checkbox(data))
			}
		}
		return $notifications;
	};
	
	EventPage.prototype.fetchData = function() {
		return this.fetching_data_defer = this.event.fetchEvent(EventPage.fields);
	};
	
	EventPage.prototype.init = function() {
		var PAGE = this;
		trimAvatarsCollection(PAGE.$wrapper);
		bindRippleEffect(PAGE.$wrapper);
		bindDropdown(PAGE.$wrapper);
		//bindShareButtons(PAGE.$wrapper);
		__APP.MODALS.bindCallModal(PAGE.$wrapper);
		bindCollapsing(PAGE.$wrapper);
		bindPageLinks(PAGE.$wrapper);
		
		PAGE.$wrapper.find('.ToggleNotification').each(function() {
			var $this = $(this);
			
			$this.on('change', function() {
				$this.prop('disabled', true);
				if ($this.prop('checked')) {
					PAGE.event.addNotification($this.val(), function(data) {
						$this.data('uuid', data.uuid);
						$this.prop('disabled', false);
					});
				} else {
					PAGE.event.deleteNotification($this.data('uuid'), function() {
						$this.data('uuid', undefined);
						$this.prop('disabled', false);
					});
				}
			})
		});
		
		PAGE.$wrapper.find('.CancelEvent').on('click.CancelEvent', function() {
			PAGE.event.changeEventStatus(OneEvent.STATUS.CANCEL, function() {
				PAGE.$wrapper.find('.event_canceled_cap').removeClass(__C.CLASSES.HIDDEN);
			});
		});
		
		PAGE.$wrapper.find('.CancelCancellation').on('click.CancelCancellation', function() {
			PAGE.event.changeEventStatus(OneEvent.STATUS.BRING_BACK, function() {
				PAGE.$wrapper.find('.event_canceled_cap').addClass(__C.CLASSES.HIDDEN);
			});
		});
		
		PAGE.$wrapper.find('.ExternalLink').on('click.sendStat', function() {
			storeStat(PAGE.event.id, __C.STATS.EVENT_ENTITY, __C.STATS.EVENT_OPEN_SITE);
		});
		
		PAGE.$wrapper.find('.EventMap').on('click.sendStat', function() {
			storeStat(PAGE.event.id, __C.STATS.EVENT_ENTITY, __C.STATS.EVENT_OPEN_MAP);
		});
	};
	
	EventPage.prototype.render = function() {
		var PAGE = this,
			cover_width = 630,
			this_event = PAGE.event,
			avatars_collection_classes = [
				__C.CLASSES.UNIVERSAL_STATES.ROUNDED,
				__C.CLASSES.UNIVERSAL_STATES.BORDERED,
				__C.CLASSES.SIZES.SMALL,
				__C.CLASSES.HOOKS.ADD_AVATAR.COLLECTION,
				__C.CLASSES.HOOKS.CALL_MODAL
			],
			$action_buttons = __APP.BUILD.button({
				classes: [
					__C.CLASSES.UNIVERSAL_STATES.EMPTY,
					__C.CLASSES.UNIVERSAL_STATES.ROUNDED,
					__C.CLASSES.SIZES.LOW,
					__C.CLASSES.ICON_CLASS,
					__C.CLASSES.ICONS.BELL_O,
					__C.CLASSES.COLORS.NEUTRAL,
					__C.CLASSES.HOOKS.RIPPLE,
					__C.CLASSES.HOOKS.DROPDOWN_BUTTON
				],
				dataset: {
					dropdown: 'edit_notification',
					ddWidth: 190,
					ddPosX: 'self.center',
					ddPosY: 6
				}
			}),
			$event_additional_fields = $(),
			$event_additional_information = $(),
			organization = new OneOrganization(this_event.organization_id);

		organization.setData({
			short_name: this_event.organization_short_name,
			img_url: this_event.organization_logo_small_url
		});
		
		__APP.changeTitle(this_event.title);
		if (this_event.is_favorite) {
			avatars_collection_classes.push(__C.CLASSES.HOOKS.ADD_AVATAR.STATES.SHIFTED);
		}

		if (this_event.registration_locally || this_event.ticketing_locally) {
			$action_buttons = $action_buttons.add(new AddToFavoriteButton(this_event.id, {
				is_add_avatar: true,
				is_checked: this_event.is_favorite,
				classes: [
					__C.CLASSES.UNIVERSAL_STATES.EMPTY,
					__C.CLASSES.SIZES.LOW,
					__C.CLASSES.UNIVERSAL_STATES.ROUNDED,
					__C.CLASSES.HOOKS.RIPPLE
				],
				labels: null,
				colors: {
					unchecked: __C.CLASSES.COLORS.NEUTRAL_ACCENT,
					unchecked_hover: __C.CLASSES.COLORS.NEUTRAL_ACCENT
				}
			}));
			
			if (this_event.ticketing_locally) {
				
			} else {
				$action_buttons = $action_buttons.add(new RegisterButton(this_event, {
					classes: [
						'event_main_action_button',
						__C.CLASSES.SIZES.LOW,
						__C.CLASSES.UNIVERSAL_STATES.ROUNDED,
						__C.CLASSES.HOOKS.RIPPLE
					],
					colors: {
						unchecked: __C.CLASSES.COLORS.NEUTRAL_ACCENT,
						unchecked_hover: __C.CLASSES.COLORS.NEUTRAL_ACCENT
					}
				}));
			}
		} else {
			$action_buttons = $action_buttons.add(new AddToFavoriteButton(this_event.id, {
				is_add_avatar: true,
				is_checked: this_event.is_favorite,
				classes: [
					'event_main_action_button',
					__C.CLASSES.SIZES.LOW,
					__C.CLASSES.UNIVERSAL_STATES.ROUNDED,
					__C.CLASSES.HOOKS.RIPPLE
				],
				colors: {
					unchecked: __C.CLASSES.COLORS.NEUTRAL_ACCENT,
					unchecked_hover: __C.CLASSES.COLORS.NEUTRAL_ACCENT
				}
			}));
		}
		
		if (this_event.registration_required) {
			$event_additional_information = $event_additional_information.add(tmpl('event-additional-info', {
				classes: __C.CLASSES.TEXT_COLORS.ACCENT + ' ' + __C.CLASSES.UNIVERSAL_STATES.TRANSFORM_UPPERCASE,
				text: (this_event.registration_till ? 'Регистрация до ' + moment.unix(this_event.registration_till).calendar(null, __LOCALES.ru_RU.DATE.CALENDAR_DATE_TIME) : 'Регистрация обязательна')
			}));
		}
		
		if (!this_event.is_free) {
			$event_additional_information = $event_additional_information.add(tmpl('event-additional-info', {
				classes: __C.CLASSES.TEXT_COLORS.ACCENT,
				text: 'от ' + (this_event.min_price ? formatCurrency(this_event.min_price) : '0') + ' руб.'
			}));
		}
		
		if (this_event.is_online) {
			$event_additional_information = $event_additional_information.add(tmpl('event-additional-info', {
				classes: __C.CLASSES.TEXT_COLORS.ACCENT,
				text: 'Online'
			}));
		}
		
		if (this_event.is_same_time) {
			$event_additional_fields = $event_additional_fields.add(tmpl('event-additional-field', {
				key: 'Время',
				value: displayTimeRange(this_event.dates[0].start_time, this_event.dates[0].end_time)
			}));
		} else {
			$event_additional_fields = $event_additional_fields.add(tmpl('event-date-time', {
				date_times: tmpl('event-date-time-row', formatDates(this_event.dates, {
					date: '{D} {MMMMs}',
					time: '{T}'
				}, this_event.is_same_time))
			}));
		}
		if (this_event.location) {
			$event_additional_fields = $event_additional_fields.add(tmpl('event-additional-field', {
				key: 'Место',
				value: this_event.location
			}));
		}
		$event_additional_fields = $event_additional_fields.add(tmpl('event-additional-field', {
			key: 'Теги',
			value: __APP.BUILD.tags(this_event.tags)
		}));
		
		if (this_event.detail_info_url) {
			$event_additional_fields = $event_additional_fields.add(tmpl('event-detail-link', {detail_info_url: this_event.detail_info_url}));
		}
		
		PAGE.$wrapper.html(tmpl('event-page', $.extend({}, this_event, {
			cover_width: cover_width,
			action_buttons: $action_buttons,
			avatars_collection: __APP.BUILD.avatarCollection(this_event.favored, 6, {
				dataset: {
					modal_type: 'favors',
					modal_event_id: this_event.id
				},
				classes: avatars_collection_classes,
				counter_classes: [
					__C.CLASSES.SIZES.X30,
					__C.CLASSES.UNIVERSAL_STATES.BORDERED,
					__C.CLASSES.COLORS.MARGINAL,
					__C.CLASSES.HOOKS.ADD_AVATAR.STATES.CASTABLE
				]
			}, this_event.favored_users_count),
			notifications: EventPage.buildNotifications(this_event.notifications, this_event.id, this_event.last_event_date),
			event_map: this_event.location ? tmpl('event-map', {location_sanitized: encodeURI(this_event.location)}) : '',
			event_edit_functions: this_event.can_edit ? tmpl('event-edit-functions', this_event) : '',
			event_additional_info: $event_additional_information,
			canceled: this_event.canceled ? '' : __C.CLASSES.HIDDEN,
			organization_avatar_block: __APP.BUILD.avatarBlocks(organization, {
				block_classes: [__C.CLASSES.SIZES.SMALL],
				is_link: true,
				entity: __C.ENTITIES.ORGANIZATION
			}),
			event_additional_fields: $event_additional_fields,
			cancel_cancellation: this_event.can_edit ? tmpl('button', {
					classes: __C.CLASSES.COLORS.PRIMARY + ' ' + __C.CLASSES.HOOKS.RIPPLE + ' CancelCancellation',
					title: 'Вернуть событие'
				}) : ''
		})));
		
		if (this_event.is_same_time) {
			var m_nearest_date = this_event.nearest_event_date ? moment.unix(this_event.nearest_event_date) : moment.unix(this_event.first_event_date);
			PAGE.calendar = new Calendar(PAGE.$wrapper.find('.EventCalendar'), {
				classes: {
					wrapper_class: 'feed_calendar_wrapper',
					td_class: 'event_calendar_day',
					table_class: 'feed_calendar_table'
				},
				selection_type: Calendar.SELECTION_TYPES.MULTI,
				disable_selection: true
			});
			PAGE.calendar
				.init()
				.setMonth(m_nearest_date.format('M'), m_nearest_date.format('YYYY'))
				.selectDays(
					this_event.dates.map(function(date) {
						return moment.unix(date.event_date).format(__C.DATE_FORMAT)
					})
				);
		}
		
		if(__APP.USER.id === -1){
			$('.DropdownButton, .DropdownBox').remove();
		}
		
		PAGE.init();
	};
	
	return EventPage;
}()));

/**
 * @requires ../Class.Page.js
 */
/**
 *
 * @class OnboardingPage
 * @extends Page
 */
OnboardingPage = extending(Page, (function() {
	/**
	 *
	 * @constructor
	 * @constructs OnboardingPage
	 */
	function OnboardingPage() {
		Page.apply(this, arguments);
		this.ajax_data = {
			length: 30,
			offset: 0,
			fields: 'img_small_url'
		};
		this.state_name = 'onboarding_page';
		this.is_upload_disabled = false;
		this.block_scroll = true;
	}
	
	OnboardingPage.prototype.init = function() {
		bindRippleEffect(this.$wrapper);
		bindPageLinks(this.$wrapper);
		this.$wrapper.find('.Link').on('click', function() {
			if($(this).is('.SkipOnboarding')){
				cookies.setItem('skip_onboarding', 1, moment().add(7, 'd')._d);
			}
			__APP.SIDEBAR.updateSubscriptions();
		});
	};
	
	OnboardingPage.prototype.bindSubscriptions = function() {
		this.$wrapper.find(".OnboardingOrgItem").not('.-Handled_OnboardingOrgItem').on('click', function() {
			var $this = $(this);
			if ($this.hasClass(__C.CLASSES.ACTIVE)) {
				__APP.USER.unsubscribeFromOrganization($this.data("organization_id"));
			} else {
				__APP.USER.subscribeToOrganization($this.data("organization_id"));
			}
			$this.toggleClass(__C.CLASSES.ACTIVE);
		}).addClass('-Handled_OnboardingOrgItem');
	};
	
	OnboardingPage.prototype.render = function() {
		var PAGE = this,
			$loader = tmpl('loader', {});
		
		if(__APP.USER.id === -1){
			__APP.changeState('/feed/actual', true, true);
			return null;
		}
		function appendRecommendations(organizations) {
			$loader.detach();
			if (organizations.length) {
				PAGE.$wrapper.find(".RecommendationsWrapper").last().append(tmpl("onboarding-recommendation", organizations));
				PAGE.bindSubscriptions();
				PAGE.block_scroll = false;
			} else {
				PAGE.is_upload_disabled = true;
			}
		}
		
		PAGE.$wrapper.html(tmpl("onboarding-main", {}));
		PAGE.init();
		PAGE.$wrapper.find('.RecommendationsWrapper').last().append($loader);
		OrganizationsCollection.fetchRecommendations(PAGE.ajax_data, appendRecommendations);
		PAGE.$wrapper.find(".RecommendationsScrollbar").scrollbar({
			onScroll: function(y, x) {
				if (y.scroll == y.maxScroll && !PAGE.is_upload_disabled && !PAGE.block_scroll) {
					PAGE.block_scroll = true;
					PAGE.$wrapper.find('.RecommendationsWrapper').last().append($loader);
					OrganizationsCollection.fetchRecommendations(PAGE.ajax_data, appendRecommendations);
				}
			}
		});
	};
	
	return OnboardingPage
}()));
/**
 * @requires ../Class.Page.js
 */
/**
 *
 * @class SearchPage
 * @extends Page
 */
SearchPage = extending(Page, (function() {
	/**
	 *
	 * @param {string} search
	 * @constructor
	 * @constructs SearchPage
	 */
	function SearchPage(search) {
		Page.apply(this, arguments);
		
		this.page_title = 'Поиск';
		this.$search_bar_input = $('#search_bar_input');
		this.search_string = decodeURIComponent(search);
		this.events_ajax_data = {
			length: 10,
			fields: new Fields(
				'image_horizontal_medium_url',
				'detail_info_url',
				'nearest_event_date',
				'can_edit',
				'location',
				'is_favorite',
				'is_registered',
				'registration_available',
				'registration_locally',
				'registration_required',
				'registration_till',
				'ticketing_locally',
				'is_free',
				'min_price',
				'favored_users_count',
				'organization_name',
				'organization_short_name',
				'organization_logo_small_url',
				'description',
				'favored',
				'is_same_time',
				'tags',
				'dates'
			),
			order_by: 'nearest_event_date,-first_event_date'
		};
		this.organizations_ajax_data = {
			length: 30,
			fields: new Fields([
				'subscribed_count',
				'img_small_url'
			])
		};
		this.past_events = false;
		this.search_results = new SearchResults(this.search_string);
	}
	/**
	 *
	 * @param {(OneOrganization|Array<OneOrganization>|OrganizationsCollection)} organizations
	 * @returns {jQuery}
	 */
	SearchPage.buildOrganizationItems = function(organizations) {
		return __APP.BUILD.organizationItems(organizations, {
			block_classes: ['-show'],
			avatar_classes: ['-size_50x50', '-rounded'],
			counter_classes: [__C.CLASSES.HIDDEN]
		})
	};
	/**
	 *
	 * @param {(OneEvent|Array<OneEvent>|EventsCollection)} events
	 * @returns {jQuery}
	 */
	SearchPage.buildEventCards = function(events) {
		var $events = $();
		if (events.length == 0) {
			$events = tmpl('search-no-events', {});
		} else {
			events.forEach(function(event) {
				if(event.nearest_event_date == undefined && !this.past_events){
					$events = $events.add(tmpl('divider', {title: 'Прошедшие события'}));
					this.past_events = true;
				}
				$events = $events.add(__APP.BUILD.eventCards(event));
			});
		}
		return $events
	};
	
	SearchPage.prototype.fetchData = function() {
		return this.fetching_data_defer = this.search_results.fetchEventsAndOrganizations(this.events_ajax_data, this.organizations_ajax_data);
	};
	
	SearchPage.prototype.init = function() {
		var PAGE = this,
			$window = $(window),
			$organizations_scrollbar;
		
		function bindFeedEvents($parent) {
			trimAvatarsCollection($parent);
			bindRippleEffect($parent);
			__APP.MODALS.bindCallModal($parent);
			bindPageLinks($parent);
			
			$parent.find('.HideEvent').remove();
		}
		
		$organizations_scrollbar = this.$wrapper.find('.SearchOrganizationsScrollbar').scrollbar({
			disableBodyScroll: true,
			onScroll: function(y) {
				if (y.scroll == y.maxScroll) {
					PAGE.search_results.fetchOrganizations(PAGE.organizations_ajax_data, function(organizations) {
						if (organizations.length) {
							$organizations_scrollbar.append(SearchPage.buildOrganizationItems(organizations));
						} else {
							$organizations_scrollbar.off('scroll.onScroll');
						}
						bindPageLinks($organizations_scrollbar);
					});
				}
			}
		});
		$window.off('scroll.upload' + PAGE.constructor.name);
		$window.on('scroll.upload' + PAGE.constructor.name, function() {
			if ($window.height() + $window.scrollTop() + 200 >= $(document).height() && !PAGE.block_scroll) {
				PAGE.block_scroll = true;
				PAGE.search_results.fetchEvents(PAGE.events_ajax_data, function(events) {
					var $events;
					if(events.length){
						$events = SearchPage.buildEventCards(PAGE.search_results.events.last_pushed);
						PAGE.$wrapper.find('.SearchEvents').append($events);
						bindFeedEvents($events);
						PAGE.block_scroll = false;
					} else {
						$window.off('scroll.upload' + PAGE.constructor.name);
					}
				});
			}
		});
		bindFeedEvents(this.$wrapper);
	};
	
	SearchPage.prototype.render = function() {
		var data = {};
		
		$('.TopBarOverlay').addClass('-open_search_bar');
		this.$search_bar_input.val(this.search_string);
		
		data.events = SearchPage.buildEventCards(this.search_results.events);
		if (this.search_results.organizations.length == 0) {
			data.no_organizations = __C.CLASSES.HIDDEN;
		} else {
			data.organizations = SearchPage.buildOrganizationItems(this.search_results.organizations);
		}
		
		this.$wrapper.append(tmpl('search-wrapper', data));
		this.init();
	};
	
	SearchPage.prototype.destroy = function() {
		$('.TopBarOverlay').removeClass('-open_search_bar');
		this.$search_bar_input.val('');
	};
	
	return SearchPage;
}()));
/**
 * @requires Class.AbstractEditOrganizationPage.js
 */
/**
 *
 * @class AddOrganizationPage
 * @extends AbstractEditOrganizationPage
 */
AddOrganizationPage = extending(AbstractEditOrganizationPage, (function() {
	/**
	 *
	 * @constructor
	 * @constructs AddOrganizationPage
	 */
	function AddOrganizationPage() {
		AbstractEditOrganizationPage.call(this);
		this.page_title = 'Новая организация';
		this.adding_is_over = false;
	}
	
	AddOrganizationPage.prototype.destroy = function() {
		var data = this.$wrapper.find('#add-organization-form').serializeForm(),
			$sidebar_nav = $('.SidebarNav');
		
		if (!this.adding_is_over) {
			if (!$sidebar_nav.find('.ContinueRegistration').length) {
				$sidebar_nav.prepend(__APP.BUILD.link({
					page: '/add/organization',
					title: 'Продолжить регистрацию',
					classes: ['sidebar_navigation_item', 'SidebarNavItem', 'ContinueRegistration']
				}));
				bindPageLinks($sidebar_nav);
			}
			try {
				sessionStorage.setItem('organization_info', JSON.stringify({
					city_id: data.city_id,
					type_id: data.type_id,
					name: data.name,
					short_name: data.short_name,
					email: data.email,
					site_url: data.site_url,
					default_address: data.default_address,
					description: data.description,
					facebook_url: data.facebook_url,
					vk_url: data.vk_url
				}));
			} catch (e) {}
		}
	};
	
	AddOrganizationPage.prototype.renderRest = function() {
		var additional_fields,
			local_storage;
		
		try {
			local_storage = JSON.parse(sessionStorage.getItem('organization_info') ? sessionStorage.getItem('organization_info') : localStorage.getItem('organization_info'));
			sessionStorage.removeItem('organization_info');
		} catch (e) {
			local_storage = {}
		}
		
		additional_fields = $.extend({
			header_text: this.page_title
		}, local_storage, true);
		
		this.$wrapper.html(tmpl('add-organization-page', additional_fields));
	};
	
	return AddOrganizationPage;
}()));
/**
 * @requires ../Class.Page.js
 */
/**
 *
 * @class CatalogPage
 * @extends Page
 */
CatalogPage = extending(Page, (function() {
	/**
	 *
	 * @param {string} [city_name]
	 * @param {(string|number)} [category_id]
	 * @constructor
	 * @constructs CatalogPage
	 */
	function CatalogPage(city_name, category_id) {
		Page.apply(this);
		
		if ($.isNumeric(city_name) && !category_id) {
			category_id = city_name;
			city_name = __APP.USER.selected_city.en_name;
		}
		
		this.wrapper_tmpl = 'organizations';
		
		this.categories_ajax_data = {order_by: 'order_position'};
		this.organizations_ajax_data = {
			fields: [
				'background_small_img_url',
				'img_small_url',
				'is_subscribed',
				'subscribed_count',
				'privileges'
			],
			order_by: '-subscribed_count'
		};
		
		this.default_title = 'Организации';
		
		this.selected_city = new OneCity();
		this.selected_city_name = city_name || __APP.USER.selected_city.en_name;
		this.selected_category_id = category_id;
		this.cities = new CitiesCollection();
		this.categories = new CategoriesCollection();
		this.all_organizations = new OrganizationsCollection();
	}
	
	CatalogPage.prototype.fetchData = function() {
		var self = this;
		
		return this.fetching_data_defer =	this.cities.fetchCities(null, 0, 'distance,local_name', function() {
			if (self.selected_city_name) {
				self.selected_city = this.getByName(self.selected_city_name);
				self.categories_ajax_data.city_id = self.selected_city.id;
			}
		}).then(function() {
			return self.categories.fetchCategoriesWithOrganizations(self.categories_ajax_data, self.organizations_ajax_data, 0).done(function() {
				self.all_organizations = self.categories
					.reduce(function(collection, cat) {
						return collection.setData(cat.organizations);
					}, new OrganizationsCollection())
					.sort(function(a, b) {
						return b.subscribed_count - a.subscribed_count;
					});
			});
		}).promise();
	};
	/**
	 *
	 * @param {(string|number)} category_id
	 */
	CatalogPage.prototype.selectCategory = function(category_id) {
		this.selected_category_id = category_id ? category_id : this.selected_category_id;
		this.$view.find('.Category').filter('[data-category-id="' + this.selected_category_id + '"]').addClass(__C.CLASSES.ACTIVE);
		__APP.changeState('/organizations/at/' + this.selected_city_name + '/' + this.selected_category_id, true);
		__APP.changeTitle(this.categories.getByID(this.selected_category_id).name);
	};
	
	CatalogPage.prototype.init = function() {
		var PAGE = this,
			$categories = PAGE.$view.find('.Category'),
			$organizations_cities_select = PAGE.$view.find('#organizations_cities_select');
		
		function bindOrganizationsEvents() {
			bindRippleEffect(PAGE.$view);
			bindPageLinks(PAGE.$view);
		}
		
		$(window).on('subscribe.updateCatalog', function(e, id) {
			var org = PAGE.all_organizations.getByID(id);
			org.is_subscribed = true;
			org.subscribed_count++;
		});
		$(window).on('unsubscribe.updateCatalog', function(e, id) {
			var org = PAGE.all_organizations.getByID(id);
			org.is_subscribed = false;
			org.subscribed_count--;
		});
		
		bindOrganizationsEvents();
		
		PAGE.$view.find('.OrganizationsCategoriesScroll').scrollbar({disableBodyScroll: true});
		
		$organizations_cities_select.select2({
			containerCssClass: 'form_select2',
			dropdownCssClass: 'form_select2_drop'
		}).off('change.SelectCity').on('change.SelectCity', function() {
			__APP.changeState('/organizations/at/' + PAGE.cities.getByID($(this).val()).en_name, true, true);
		});
		if (PAGE.selected_city_name) {
			$organizations_cities_select.select2('val', PAGE.cities.getByName(PAGE.selected_city_name).id);
		}
		
		PAGE.$view.find('.ShowAllOrganizations').off('click.showAllOrganizations').on('click.showAllOrganizations', function() {
			$categories.removeClass(__C.CLASSES.ACTIVE).siblings('.SubcategoryWrap').height(0);
			PAGE.selected_category_id = undefined;
			
			__APP.changeState('/organizations/at/' + PAGE.selected_city_name, true);
			__APP.changeTitle(PAGE.default_title);
			PAGE.$wrapper.html(__APP.BUILD.organizationCard(PAGE.all_organizations));
			bindOrganizationsEvents();
		});
		
		$categories.off('click.selectCategory').on('click.selectCategory', function() {
			var $this = $(this),
				category_id = $this.data('category-id'),
				$wrap = $this.next('.SubcategoryWrap'),
				is_parent_category = !!$wrap.length,
				is_this_active = $this.hasClass(__C.CLASSES.ACTIVE);
			
			$this.parent().find('.Category').not($this).removeClass(__C.CLASSES.ACTIVE).filter('.SubcategoryWrap').height(0);
			if (is_parent_category) {
				$wrap.height(is_this_active ? 0 : $wrap.children().outerHeight());
				$this.toggleClass(__C.CLASSES.ACTIVE);
			} else {
				if (is_this_active) {
					PAGE.categories = new CategoriesCollection();
					PAGE.categories.fetchCategoriesWithOrganizations(PAGE.categories_ajax_data, PAGE.organizations_ajax_data, 0, function() {
						PAGE.render();
					});
				} else {
					PAGE.selectCategory(category_id);
					PAGE.$wrapper.html(__APP.BUILD.organizationCard(PAGE.categories.getByID(category_id).organizations));
					bindOrganizationsEvents();
				}
			}
		});
	};
	
	CatalogPage.prototype.render = function() {
		this.$view.find('#organizations_cities_select').html(tmpl('option', this.cities.map(function(city) {
			return {
				val: city.id,
				display_name: city.local_name
			};
		})));
		this.$view.find('.OrganizationsCategoriesScroll').html(__APP.BUILD.organisationsCategoriesItems(this.categories));
		this.$wrapper.html(__APP.BUILD.organizationCard(this.selected_category_id ? this.categories.getByID(this.selected_category_id).organizations : this.all_organizations));
		
		if ((window.location.pathname == '/organizations' || window.location.pathname == '/organizations/') && this.selected_city_name) {
			__APP.changeState('/organizations/at/' + this.selected_city_name, true);
		}
		if (this.selected_category_id) {
			this.selectCategory(this.selected_category_id);
		} else {
			__APP.changeTitle(this.default_title);
		}
		this.init();
	};
	
	CatalogPage.prototype.destroy = function() {
		$(window).off('subscribe.updateCatalog unsubscribe.updateCatalog');
	};
	
	return CatalogPage;
}()));
/**
 * @requires ../Class.Page.js
 */
/**
 *
 * @class OrganizationPage
 * @extends Page
 */
OrganizationPage = extending(Page, (function() {
	/**
	 *
	 * @param {(string|number)} organization_id
	 * @constructor
	 * @constructs OrganizationPage
	 */
	function OrganizationPage(organization_id) {
		/**
		 * @typedef {Object} OrganizationPage~EventType
		 * @property {string} name
		 * @property {string} scroll_event
		 * @property {string} sort_date_type
		 * @property {string} last_date
		 * @property {boolean} is_upload_disabled
		 */
		var	event_type_default = {
			last_date: '',
			block_scroll: false,
			is_upload_disabled: false
		};
		Page.call(this);
		
		this.fields = new Fields(
			'img_small_url',
			'background_medium_img_url',
			'description',
			'site_url',
			'is_subscribed',
			'privileges',
			'default_address',
			'subscribed_count', {
				subscribed: {
					fields: 'is_friend',
					order_by: '-is_friend,first_name',
					length: 10
				}
			}
		);
		this.events_fields = new Fields(
			'image_horizontal_medium_url',
			'favored_users_count',
			'is_favorite',
			'is_registered',
			'registration_available',
			'registration_locally',
			'ticketing_locally',
			'dates', {
				favored: {
					length: 5
				}
			}
		);
		
		/**
		 * @name OrganizationPage#event_types
		 * @enum {OrganizationPage~EventType}
		 */
		this.event_types = {
			future: $.extend(true, {}, event_type_default, {
				name: 'future',
				scroll_event: 'scroll.uploadFutureEvents',
				sort_date_type: 'nearest_event_date'
			}),
			past: $.extend(true, {}, event_type_default, {
				name: 'past',
				scroll_event: 'scroll.uploadPastEvents',
				sort_date_type: 'last_event_date'
			}),
			delayed: $.extend(true, {}, event_type_default, {
				name: 'delayed',
				scroll_event: 'scroll.uploadDelayedEvents',
				sort_date_type: 'public_at'
			}),
			canceled: $.extend(true, {}, event_type_default, {
				name: 'canceled',
				scroll_event: 'scroll.uploadCanceledEvents',
				sort_date_type: 'first_event_date'
			})
		};
		
		this.current_tab = this.event_types.future.name;
		this.is_admin = false;
		this.future_events = new FutureEventsCollection();
		this.past_events = new PastEventsCollection();
		this.delayed_events = new DelayedEventsCollection();
		this.canceled_events = new CanceledEventsCollection();
		this.organization = new OneOrganization(organization_id);
	}
	/**
	 *
	 * @return {jqPromise}
	 */
	OrganizationPage.prototype.fetchData = function() {
		var self = this;
		
		return this.fetching_data_defer = this.organization.fetchOrganization(this.fields).done(function(data) {
			self.is_admin = self.organization.role !== OneUser.ROLE.USER;
		}).promise();
	};
	/**
	 *
	 * @param {OrganizationPage~EventType} type
	 * @param {function} [success]
	 */
	OrganizationPage.prototype.fetchAndAppendFeed = function(type, success) {
		var PAGE = this,
			$wrapper,
			$loader,
			$output;
		
		if (!type.is_upload_disabled && !type.block_scroll) {
			$wrapper = this.$wrapper.find('.' + type.name.capitalize() + 'Events');
			$loader = __APP.BUILD.loaderBlock($wrapper);
			
			type.block_scroll = true;
			PAGE[type.name + '_events'].fetchOrganizationsFeed(PAGE.organization.id, PAGE.events_fields, 10, function(events) {
				$loader.remove();
				type.block_scroll = false;
				if (events.length) {
					$output = __APP.BUILD.eventBlocks(events, type);
				} else {
					type.is_upload_disabled = true;
					$output = tmpl('organization-feed-no-event', {
						text: 'Больше событий нет :('
					});
				}
				$wrapper.append($output);
				PAGE.bindFeedEvents($output);
				
				if (isFunction(success)) {
					success();
				}
			});
		}
	};
	
	OrganizationPage.prototype.bindFeedEvents = function($parent) {
		bindRippleEffect($parent);
		trimAvatarsCollection($parent);
		bindCallModal($parent);
		bindPageLinks($parent);
	};
	
	OrganizationPage.prototype.init = function() {
		var PAGE = this,
			$subscribers_scroll;
		
		bindTabs(PAGE.$wrapper);
		bindCallModal(PAGE.$wrapper);
		
		PAGE.$wrapper.find('.Tabs').on('change.tabs', function() {
			PAGE.current_tab = $(this).find('.Tab.-active').data('type');
		});
		
		PAGE.$wrapper.find('.ExternalPage').on('click.sendStat', function() {
			storeStat(PAGE.organization.id, __C.STATS.ORGANIZATION_ENTITY, __C.STATS.ORGANIZATION_OPEN_SITE);
		});
		
		if (isScrollRemain(1000)) {
			PAGE.fetchAndAppendFeed(PAGE.event_types[PAGE.current_tab]);
		}
		$(window).on('scroll.uploadEvents', function() {
			if (isScrollRemain(1000)) {
				PAGE.fetchAndAppendFeed(PAGE.event_types[PAGE.current_tab]);
			}
		});
		
		$subscribers_scroll = PAGE.$wrapper.find('.SubscribersScroll').scrollbar({
			disableBodyScroll: true,
			onScroll: function(y) {
				if (y.scroll == y.maxScroll) {
					PAGE.organization.subscribed.fetchOrganizationSubscribers(PAGE.organization.id, 10, {
						fields: 'is_friend',
						order_by: '-is_friend,first_name'
					}, function(subscribed) {
						if (subscribed.length) {
							$subscribers_scroll.append(__APP.BUILD.subscribers(subscribed, PAGE.organization.subscribed[PAGE.organization.subscribed.length - 1].is_friend));
						} else {
							$subscribers_scroll.off('scroll.onScroll');
						}
						bindPageLinks($subscribers_scroll);
					});
				}
			}
		});
	};
	
	OrganizationPage.prototype.render = function() {
		var PAGE = this,
			organization = new OneOrganization(PAGE.organization.id);
		
		organization.setData(PAGE.organization);
		__APP.changeTitle(organization.short_name);
		__APP.SIDEBAR.$subscribed_orgs.find('[data-organization_id="' + organization.id + '"]').find('.OrganizationCounter').addClass(__C.CLASSES.HIDDEN);
		PAGE.$wrapper.html(tmpl('organization-wrapper', $.extend(true, {
			background_image: organization.background_img_url ? tmpl('organization-background-image', organization) : '',
			avatar_block: __APP.BUILD.avatarBlocks(organization, {
				block_classes: ['organization_title_block'],
				avatar_classes: [__C.CLASSES.SIZES.SMALL, 'organization_avatar'],
				entity: __C.ENTITIES.ORGANIZATION
			}),
			subscribe_button: new SubscribeButton(organization.id, {
				is_checked: organization.is_subscribed,
				colors: {
					checked: __C.CLASSES.COLORS.NEUTRAL,
					unchecked: __C.CLASSES.COLORS.ACCENT,
					checked_hover: __C.CLASSES.COLORS.NEUTRAL,
					unchecked_hover: __C.CLASSES.COLORS.ACCENT
				},
				classes: [__C.CLASSES.SIZES.LOW, __C.CLASSES.SIZES.WIDE, __C.CLASSES.HOOKS.RIPPLE]
			}),
			has_address: organization.default_address ? '' : __C.CLASSES.HIDDEN,
			redact_org_button: (organization.role === OneUser.ROLE.ADMIN) ? __APP.BUILD.link({
					title: __LOCALES.ru_RU.TEXTS.BUTTON.EDIT,
					classes: ['button', __C.CLASSES.SIZES.WIDE, __C.CLASSES.COLORS.NEUTRAL, __C.CLASSES.ICON_CLASS, __C.CLASSES.ICONS.PENCIL, __C.CLASSES.HOOKS.RIPPLE],
					page: '/admin/organization/' + organization.id + '/edit/'
				}) : '',
			hidden_for_users: PAGE.is_admin ? '' : __C.CLASSES.HIDDEN,
			subscribed_blocks: __APP.BUILD.subscribers(organization.subscribed)
		}, organization)));
		
		PAGE.init();
		
		PAGE.fetchAndAppendFeed(PAGE.event_types.future);
		PAGE.fetchAndAppendFeed(PAGE.event_types.past);
		
		if (PAGE.is_admin) {
			PAGE.fetchAndAppendFeed(PAGE.event_types.delayed);
			PAGE.fetchAndAppendFeed(PAGE.event_types.canceled);
		}
	};
	
	return OrganizationPage;
}()));
/**
 * @requires ../Class.Page.js
 */
/**
 * @class UserPage
 * @extends Page
 */
UserPage = extending(Page, (function() {
	/**
	 *
	 * @param {(number|string)} user_id
	 * @constructs UserPage
	 */
	function UserPage(user_id) {
		Page.apply(this);
		this.user_id = user_id;
		this.user = new OneUser(user_id);
		this.events_metadata = {last_date: ''};
		
		this.disable_uploads = {
			events: false,
			activities: false
		};
		this.favored_fetch_data = {
			fields: new Fields(
				'image_horizontal_medium_url',
				'favored',
				'favored_users_count',
				'is_favorite',
				'is_registered',
				'registration_available',
				'registration_locally',
				'ticketing_locally',
				'dates'
			),
			order_by: 'nearest_event_date,-first_event_date',
			length: 10
		};
	}
	
	UserPage.bindEvents = function($parent) {
		bindRippleEffect($parent);
		trimAvatarsCollection($parent);
		__APP.MODALS.bindCallModal($parent);
		bindPageLinks($parent);
	};
	
	UserPage.prototype.fetchData = function() {
		if(!(this.user_id == __APP.USER.id || this.user_id === 'me')){
			return this.fetching_data_defer = this.user.fetchUser(new Fields('type', 'is_friend', 'link', 'accounts', 'accounts_links', {
				friends: {
					fields: ['is_friend'],
					length: 4
				},
				favored: this.favored_fetch_data,
				subscriptions: {
					fields: ['img_small_url'],
					length: 4,
					order_by: ['organization_type_order', 'organization_type_id']
				}
			}));
		}
		return Page.prototype.fetchData.call(this);
	};
	
	UserPage.prototype.uploadEntities = function(type) {
		var self = this,
			types = {
				activities: {
					fetch_method: this.user.actions.fetch,
					fetch_context: this.user.actions,
					fetch_arguments: [['organization', 'event', 'type_code', 'created_at'], 20, '-created_at'],
					extra_function: function(entities) {
						entities.forEach(function(activity) {
							activity.user = self.user;
						});
					},
					build_method: __APP.BUILD.activity,
					build_extra_arguments: []
				},
				events: {
					fetch_method: this.user.fetchFavored,
					fetch_context: this.user,
					fetch_arguments: [this.favored_fetch_data],
					build_method: __APP.BUILD.eventBlocks,
					build_extra_arguments: [this.events_metadata]
				}
			},
			type_data = types[type],
			$wrapper = self.$wrapper.find('.TabsBody').filter('[data-tab_body_type="'+type+'"]'),
			$loader;
		
		if(!self.disable_uploads[type] && !self.block_scroll){
			$loader = __APP.BUILD.loaderBlock($wrapper);
			self.block_scroll = true;
			
			type_data.fetch_method.apply(type_data.fetch_context, type_data.fetch_arguments).done(function(entities) {
				var $entities;
				self.block_scroll = false;
				$loader.remove();
				if(entities.length){
					if(type_data.extra_function && typeof type_data.extra_function === 'function'){
						type_data.extra_function(entities);
					}
					$entities = type_data.build_method.apply(__APP.BUILD, [entities].concat(type_data.build_extra_arguments));
					$wrapper.append($entities);
					UserPage.bindEvents($entities);
				} else {
					if(!$wrapper.children().length){
						$wrapper.append(__APP.BUILD.cap('Активности нет'));
					}
					self.disable_uploads[type] = true;
				}
			});
		}
	};
	
	UserPage.prototype.init = function() {
		var self = this,
			event_names = {
				activities: 'scroll.uploadActivities',
				events: 'scroll.uploadEvents'
			};
		
		function bindScrollEvents(page, event_names) {
			var active_type = page.$wrapper.find('.TabsBody').filter('.'+__C.CLASSES.ACTIVE).data('tab_body_type'),
				$window = $(window);
			
			$window.off(Object.values(event_names).join(' '));
			$window.on(event_names[active_type], function() {
				if ( isScrollRemain(200) ) {
					switch (active_type) {
						case 'activities': {
							page.uploadEntities('activities');
							break;
						}
						case 'events': {
							page.uploadEntities('events');
							break;
						}
					}
				}
			});
		}
		
		bindTabs(this.$wrapper);
		UserPage.bindEvents(this.$wrapper);
		
		this.$wrapper.find('.Tabs').on('change.tabs', function() {
			bindScrollEvents(self, event_names);
		});
		
		bindScrollEvents(this, event_names);
	};
	
	UserPage.prototype.render = function() {
		var self = this,
			$subscribed_orgs,
			$favored_events;
		
		if(this.user_id == __APP.USER.id){
			__APP.changeState('/my/profile', true, true);
			return null;
		}
		__APP.changeTitle(this.user.full_name);
		
		this.user.actions.forEach(function(action) {
			action.user = self.user;
		});
		
		if(this.user.subscriptions.length) {
			$subscribed_orgs = __APP.BUILD.avatarBlocks(this.user.subscriptions.slice(0,4), {
				is_link: true,
				entity: __C.ENTITIES.ORGANIZATION,
				avatar_classes: [__C.CLASSES.SIZES.X30]
			});
		} else {
			$subscribed_orgs = __APP.BUILD.cap('Нет подписок');
		}
		
		if(this.user.favored.length) {
			$favored_events = __APP.BUILD.eventBlocks(this.user.favored, this.events_metadata);
		} else {
			$favored_events = __APP.BUILD.cap('Событий нет');
		}
		
		this.$wrapper.append(tmpl('user-page', {
			wrapper_classes: '-another_user',
			tombstone: __APP.BUILD.userTombstones(this.user, {avatar_classes: [__C.CLASSES.UNIVERSAL_STATES.BORDERED, __C.CLASSES.UNIVERSAL_STATES.SHADOWED]}),
			links: __APP.BUILD.socialLinks(this.user.accounts_links, {
				classes: __C.CLASSES.UNIVERSAL_STATES.ROUNDED
			}),
			subscribed_orgs: $subscribed_orgs,
			show_all_subscribed_orgs_button: this.user.subscriptions.length ? __APP.BUILD.button({
				classes: [__C.CLASSES.COLORS.NEUTRAL_ACCENT, __C.CLASSES.HOOKS.CALL_MODAL, __C.CLASSES.HOOKS.RIPPLE],
				dataset: {
					modal_type: 'subscribers_list',
					modal_entity: this.user
				},
				title: 'Показать все'
			}) : '',
			friends_hidden: __C.CLASSES.HIDDEN,
			favored_event_blocks: $favored_events
		}));
		this.uploadEntities('activities');
		this.init();
	};
	
	return UserPage;
}()));
/**
 * @requires Class.UserPage.js
 */
/**
 * @class MyProfilePage
 * @extends UserPage
 */
MyProfilePage = extending(UserPage, (function() {
	/**
	 *
	 * @constructs MyProfilePage
	 */
	function MyProfilePage() {
		UserPage.call(this, __APP.USER.id);
		this.page_title = 'Мой профиль';
		this.favored_fetch_data.fields.push('is_favorite');
		this.user = __APP.USER;
	}
	
	MyProfilePage.prototype.fetchData = function() {
		if(!this.user.favored.length){
			return this.fetching_data_defer = this.user.fetchFavored(this.favored_fetch_data);
		}
		return Page.prototype.fetchData.call(this);
	};
	
	MyProfilePage.prototype.render = function() {
		var $activities,
			$subscribed_orgs,
			$favored_events,
			$subscribed_users;
		__APP.changeTitle('Мой профиль');
		
		this.user.actions.forEach(function(action) {
			action.user = __APP.USER;
		});
		
		if(this.user.subscriptions.length) {
			$subscribed_orgs = __APP.BUILD.avatarBlocks(this.user.subscriptions.slice(0,4), {
				is_link: true,
				entity: __C.ENTITIES.ORGANIZATION,
				avatar_classes: [__C.CLASSES.SIZES.X30]
			});
		} else {
			$subscribed_orgs = __APP.BUILD.cap('Нет подписок');
		}
		
		if(this.user.friends.length) {
			$subscribed_users = __APP.BUILD.avatarBlocks(this.user.friends.slice(0,4), {
				is_link: true,
				entity: __C.ENTITIES.USER,
				avatar_classes: [__C.CLASSES.SIZES.X30, __C.CLASSES.UNIVERSAL_STATES.ROUNDED]
			});
		} else {
			$subscribed_users = __APP.BUILD.cap('Нет друзей');
		}
		
		if(this.user.favored.length) {
			$favored_events = __APP.BUILD.eventBlocks(this.user.favored, this.events_metadata);
		} else {
			$favored_events = __APP.BUILD.cap('Событий нет');
		}
		
		this.$wrapper.append(tmpl('user-page', {
			wrapper_classes: '-this_user',
			tombstone: __APP.BUILD.userTombstones(this.user, {avatar_classes: [__C.CLASSES.UNIVERSAL_STATES.BORDERED, __C.CLASSES.UNIVERSAL_STATES.SHADOWED]}),
			links: __APP.BUILD.socialLinks(this.user.accounts_links, {
				classes: __C.CLASSES.UNIVERSAL_STATES.ROUNDED
			}),
			subscribe_button: __APP.BUILD.button({
				classes: [__C.CLASSES.COLORS.NEUTRAL_ACCENT, __C.CLASSES.HOOKS.RIPPLE, 'LogoutButton'],
				title: 'Выйти'
			}),
			subscribed_orgs: $subscribed_orgs,
			show_all_subscribed_orgs_button: this.user.subscriptions.length ? __APP.BUILD.button({
				classes: [__C.CLASSES.COLORS.NEUTRAL_ACCENT, __C.CLASSES.HOOKS.CALL_MODAL, __C.CLASSES.HOOKS.RIPPLE],
				dataset: {
					modal_type: 'subscribers_list',
					modal_entity: this.user
				},
				title: 'Показать все'
			}) : '',
			subscribed_users: $subscribed_users,
			show_all_subscribed_users_button: this.user.friends.length ? __APP.BUILD.button({
				classes: [__C.CLASSES.COLORS.NEUTRAL_ACCENT, __C.CLASSES.HOOKS.CALL_MODAL, __C.CLASSES.HOOKS.RIPPLE],
				dataset: {
					modal_type: 'friends_list',
					modal_entity: this.user
				},
				title: 'Показать все'
			}) : '',
			favored_event_blocks: $favored_events
		}));
		
		if(this.user.actions.length){
			$activities = __APP.BUILD.activity(this.user.actions);
			this.$wrapper.find('.TabsBody').filter('[data-tab_body_type="activities"]').append($activities);
			UserPage.bindEvents($activities);
		} else {
			this.uploadEntities('activities');
		}
		this.$wrapper.find('.LogoutButton').on('click', __APP.USER.logout);
		this.init();
	};
	
	return MyProfilePage;
}()));
/**
 * @requires ../Class.Page.js
 */
/**
 *
 * @class MyTicketsPage
 * @extends Page
 */
MyTicketsPage = extending(Page, (function() {
	/**
	 *
	 * @constructor
	 * @constructs MyTicketsPage
	 */
	function MyTicketsPage() {
		Page.call(this);
		this.page_title = 'Мои билеты';
		
		this.tickets = new MyTicketsCollection();
		
		this.disable_uploads = false;
		this.block_scroll = false;
		
		this.fetch_tickets_fields = new Fields('created_at', 'number', 'ticket_type', 'order', {
			event: {
				fields: new Fields('dates', 'is_same_time', 'image_horizontal_medium_url', 'location')
			}
		});
		this.fetch_tickets_quantity = 30;
	}
	
	MyTicketsPage.prototype.fetchData = function() {
		return this.fetching_data_defer = this.tickets.fetchTickets(this.fetch_tickets_fields, this.fetch_tickets_quantity);
	};
	
	MyTicketsPage.prototype.init = function() {
		var self = this;
		bindCallModal(this.$wrapper);
		
		$(window).on('scroll.uploadTickets', function() {
			if (isScrollRemain(200)) {
				var $loader;
				
				if(!self.disable_uploads && !self.block_scroll){
					$loader = __APP.BUILD.loaderBlock(self.$wrapper);
					self.block_scroll = true;
					
					self.tickets.fetchTickets(self.fetch_tickets_fields, self.fetch_tickets_quantity).done(function(tickets) {
						self.block_scroll = false;
						if (tickets.length) {
							self.$wrapper.find('.TicketsWrapper').append(__APP.BUILD.ticketCards(tickets))
						} else {
							self.disable_uploads = true;
						}
						$loader.remove();
					});
				}
			}
		});
	};
	
	MyTicketsPage.prototype.render = function() {
		if(__APP.USER.isLoggedOut()){
			__APP.changeState('/', true, true);
			return null;
		}
		
		this.$wrapper.html(tmpl('my-tickets-wrapper', {
			tickets: __APP.BUILD.ticketCards(this.tickets)
		}));
		
		this.init();
	};
	
	return MyTicketsPage;
}()));
/**
 * @singleton
 * @class ServerConnection
 */
ServerConnection = (function() {
	/**
	 *
	 * @constructor
	 * @constructs ServerConnection
	 */
	function ServerConnection() {
		if (typeof ServerConnection.instance === 'object') {
			return ServerConnection.instance;
		}
		this.current_connections = [];
		ServerConnection.instance = this;
	}
	/**
	 *
	 * @enum {string}
	 */
	ServerConnection.HTTP_METHODS = {
		GET: 'GET',
		POST: 'POST',
		PUT: 'PUT',
		DELETE: 'DELETE'
	};
	Object.freeze(ServerConnection.HTTP_METHODS);
	
	function ajaxHandler(result, success, error) {
		error = typeof error !== 'undefined' ? error : function() {
				console.log(result);
				showNotifier({text: 'Упс, что-то пошло не так', status: false});
			};
		success = typeof success !== 'function' ? function() {} : success;
		try {
			if (result.status) {
				success(result.data, result.text);
			} else {
				error(result);
			}
		} catch (e) {
			error(e);
		}
	}
	
	ServerConnection.ajaxErrorHandler = function(event, jqxhr, settings, thrownError) {
		var args = Array.prototype.slice.call(arguments),
			debug = {},
			fields;
		if (args.length == 4) {
			fields = ['event', 'jqxhr', 'settings', 'thrownError'];
			args.forEach(function(arg, i) {
				debug[fields[i]] = arg;
			});
		} else if (args.length == 1) {
			debug = args[0];
		} else {
			args.forEach(function(arg, i) {
				debug[i] = arg;
			});
		}
		console.groupCollapsed('AJAX error');
		if (debug.thrownError)
			console.log('Thrown error:', debug.thrownError);
		if (debug.event && debug.event.type)
			console.log('Error type:', debug.event.type);
		if (debug.event && debug.event.text)
			console.log('Description:', debug.event.text);
		if (debug.jqxhr && debug.jqxhr.responseJSON && debug.jqxhr.responseJSON.text) {
			console.log('Response:', debug.jqxhr.responseJSON.text);
			showNotifier({text: debug.jqxhr.responseJSON.text, status: false});
		}
		if (debug.settings) {
			console.log('URL:', debug.settings.url);
			console.log('Method:', debug.settings.type);
		}
		if (debug.stack) {
			console.log('Thrown error:', debug.name);
			console.log('Description:', debug.message);
			console.log('Error stacktrace:', debug.stack);
		} else {
			console.error('Error stacktrace:');
		}
		console.groupEnd();
		
		if (!window.errors_array)  window.errors_array = [];
		window.errors_array.push(debug);
	};
	
	/**
	 *
	 * @param {ServerConnection.HTTP_METHODS} http_method
	 * @param {string} url
	 * @param {(AJAXData|string)} [ajax_data]
	 * @param {string} [content_type='application/x-www-form-urlencoded; charset=UTF-8']
	 * @param {AJAXCallback} [success]
	 * @param {function} [error]
	 * @returns {jqPromise}
	 */
	ServerConnection.prototype.dealAjax = function(http_method, url, ajax_data, content_type, success, error) {
		ajax_data = ajax_data || {};
		var jqXHR;
		
		if (ajax_data.fields instanceof Fields){
			ajax_data.fields = ajax_data.fields.toString();
		}
		jqXHR = $.ajax({
			url: url,
			data: ajax_data,
			method: http_method,
			contentType: content_type || 'application/x-www-form-urlencoded; charset=UTF-8'
		});
		this.current_connections.push(jqXHR);
		
		return jqXHR.fail(error).then(function(response, status_text, jqXHR) {
			ajaxHandler(response, function(data, text) {
				if (success && typeof success === 'function') {
					success(data);
				}
			}, ServerConnection.ajaxErrorHandler);
			return response.data;
		}).promise();
	};
	
	/**
	 * @param {...(jqXHR|Deferred|jqPromise)} Deferreds
	 * @param {function(..(Array|object))} [cb]
	 * @return {jqPromise}
	 */
	ServerConnection.prototype.multipleAjax = function(){
		var with_callback = (arguments[arguments.length - 1] instanceof Function),
			promises = with_callback ? Array.prototype.splice.call(arguments, 0, arguments.length - 1) : Array.prototype.slice.call(arguments),
			parallel_promise;
		parallel_promise = $.when.apply($, promises);
		if(with_callback) {
			parallel_promise.done(Array.prototype.shift.call(arguments));
		}
		return parallel_promise.promise();
	};
	
	/**
	 *
	 * @param {string} url
	 * @param {(object|string)} ajax_data
	 * @param {AJAXCallback} [success]
	 * @param {function} [error]
	 * @returns {jqPromise}
	 */
	ServerConnection.prototype.getData = function(url, ajax_data, success, error) {
		return this.dealAjax(ServerConnection.HTTP_METHODS.GET, url, this.validateData(ajax_data), 'application/json', function(data) {
			if (ajax_data.length != undefined && ajax_data.offset != undefined) {
				ajax_data.offset += ajax_data.length;
			}
			if (success && typeof success == 'function') {
				success(data);
			}
		}, error);
	};
	/**
	 *
	 * @param {string} url
	 * @param {(object|string)} ajax_data
	 * @param {boolean} [is_payload]
	 * @param {AJAXCallback} [success]
	 * @param {function} [error]
	 * @returns {jqPromise}
	 */
	ServerConnection.prototype.updateData = function(url, ajax_data, is_payload, success, error) {
		if(is_payload){
			return this.dealAjax(ServerConnection.HTTP_METHODS.PUT, url, JSON.stringify(ajax_data), 'application/json', success, error);
		}
		return this.dealAjax(ServerConnection.HTTP_METHODS.PUT, url, ajax_data, 'application/x-www-form-urlencoded; charset=UTF-8', success, error);
	};
	/**
	 *
	 * @param {string} url
	 * @param {(object|string)} ajax_data
	 * @param {boolean} [is_payload]
	 * @param {AJAXCallback} [success]
	 * @param {function} [error]
	 * @returns {jqPromise}
	 */
	ServerConnection.prototype.addData = function(url, ajax_data, is_payload, success, error) {
		if(is_payload){
			return this.dealAjax(ServerConnection.HTTP_METHODS.POST, url, JSON.stringify(ajax_data), 'application/json', success, error);
		}
		return this.dealAjax(ServerConnection.HTTP_METHODS.POST, url, ajax_data, 'application/x-www-form-urlencoded; charset=UTF-8', success, error);
	};
	/**
	 *
	 * @param {string} url
	 * @param {AJAXData} ajax_data
	 * @param {AJAXCallback} [success]
	 * @param {function} [error]
	 * @returns {jqPromise}
	 */
	ServerConnection.prototype.deleteData = function(url, ajax_data, success, error) {
		return this.dealAjax(ServerConnection.HTTP_METHODS.DELETE, url, ajax_data, 'application/json', success, error);
	};
	/**
	 *
	 * @param {AJAXData} ajax_data
	 * @returns {AJAXData}
	 */
	ServerConnection.prototype.validateData = function(ajax_data) {
		ajax_data = ajax_data || {};
		var order_by = [];
		
		if (ajax_data.order_by) {
			order_by = (typeof ajax_data.order_by === 'string') ? ajax_data.order_by.split(',') : ajax_data.order_by;
			order_by = order_by.map(function(unit) {
				return unit.trim().replace('-', '');
			});
			
			if (ajax_data.order_by instanceof Array) {
				ajax_data.order_by = ajax_data.order_by.join(',');
			}
		}
		
		if (!ajax_data.fields) {
			ajax_data.fields = order_by;
		} else {
			if (ajax_data.fields instanceof Array) {
				ajax_data.fields = ajax_data.fields.merge(order_by);
			} else if (ajax_data.fields instanceof Fields && order_by.length) {
				order_by.forEach(function(unit) {
					ajax_data.fields.add(unit);
				});
			}
		}
		
		ajax_data.fields = (ajax_data.fields = ajax_data.fields.toString()) ? ajax_data.fields : undefined;
		
		return ajax_data;
	};
	
	ServerConnection.prototype.abortAllConnections = function() {
		var cur;
		while (this.current_connections.length) {
			cur = this.current_connections.pop();
			if(cur.state !== 200 || cur.state() === 'pending'){
				cur.abort();
			}
		}
	};
	
	
	return ServerConnection;
}());
/**
 * @requires Class.ServerConnection.js
 */

__APP = {
	/**
	 * @type {ServerConnection}
	 */
	SERVER: new ServerConnection(),
	EVENDATE_BEGIN: '15-12-2015',
	AUTH_URLS: {},
	/**
	 * @property {string} ip
	 * @property {string} country_code
	 * @property {string} country_name
	 * @property {string} region_code
	 * @property {string} region_name
	 * @property {string} city
	 * @property {string} zip_code
	 * @property {string} time_zone
	 * @property {number} latitude
	 * @property {number} longitude
	 * @property {number} metro_code
	 */
	TOP_BAR: new AbstractTopBar(),
	SIDEBAR: new AbstractSidebar(),
	USER: new CurrentUser(),
	PREVIOUS_PAGE: new Page(),
	CURRENT_PAGE: new Page(),
	ROUTING: {
		'admin': {
			'organization': {
				'^([0-9]+)': {
					'add': {
						'event': AddEventPage,
						'': AddEventPage
					},
					'edit': AdminOrganizationEditPage,
					'overview': AdminOrganizationOverviewPage,
					'events': AdminOrganizationEventsPage,
					'crm': AdminOrganizationCRMPage,
					'settings': AdminOrganizationSettingsPage,
					'': AdminOrganizationOverviewPage
				}
			},
			'event': {
				'^([0-9]+)': {
					'overview': AdminEventOverviewPage,
					'check_in': AdminEventCheckInPage,
					'edit': AdminEventEditPage,
					'': AdminEventOverviewPage
				}
			},
			'': AdminOrganizationsPage
		},
		'add': {
			'event': {
				'to': {
					'^([0-9]+)': AddEventPage,
					'': AddEventPage
				},
				'': AddEventPage
			},
			'organization': AddOrganizationPage
		},
		'my': {
			'tickets': MyTicketsPage,
			'profile': MyProfilePage,
			'': MyProfilePage
		},
		'event': {
			'add_to': {
				'^([0-9]+)': AddEventPage,
				'': AddEventPage
			},
			'add': {
				'to': {
					'^([0-9]+)': AddEventPage,
					'': AddEventPage
				},
				'': AddEventPage
			},
			'^([0-9]+)': {
				'edit': EditEventPage,
				'': EventPage
			},
			'': FeedPage
		},
		'feed': {
			'actual': ActualEventsPage,
			'timeline': TimelineEventsPage,
			'favored': FavoredEventsPage,
			'recommendations': RecommendedEventsPage,
			'friends': FriendsEventsPage,
			'day': {
				'^([0-9]{4}-[0-9]{2}-[0-9]{2})': DayEventsPage //Very shitty way to detect date
			},
			'': ActualEventsPage
		},
		'organizations': {
			'at': {
				'^([0-9]+)': CatalogPage,
				'^([^/]+)': {
					'^([0-9]+)': CatalogPage,
					'': CatalogPage
				}
			},
			'^([0-9]+)': CatalogPage,
			'': CatalogPage
		},
		'organization': {
			'add': AddOrganizationPage,
			'^([0-9]+)': {
				'edit': EditOrganizationPage,
				'': OrganizationPage
			},
			'': CatalogPage
		},
		'onboarding': OnboardingPage,
		'search': {
			'^([^/]+)': SearchPage
		},
		'friends': MyProfilePage,
		'friend': {
			'^([0-9]+)': UserPage,
			'': MyProfilePage
		},
		'user': {
			'me': MyProfilePage,
			'^([0-9]+)': UserPage,
			'': MyProfilePage
		},
		'': ActualEventsPage
	},
	MODALS: new Modals(),
	BUILD: new Builder(),
	/**
	 * Rendering header tabs
	 * @param {(buildProps|Array<buildProps>)} tabs
	 */
	renderHeaderTabs: function renderHeaderTabs(tabs) {
		var $wrapper = $('#main_header_bottom').find('.HeaderTabsWrapper');
		tabs = tabs instanceof Array ? tabs : [tabs];
		tabs.forEach(function(tab) {
			tab = Builder.normalizeBuildProps(tab);
			tab.classes.push('tab', 'Tab');
			if (window.location.pathname.contains(tab.page)) {
				tab.classes.push(__C.CLASSES.ACTIVE);
			}
		});
		$wrapper.html(tmpl('tabs-header', {
			color: 'default',
			tabs: tmpl('link', tabs)
		}));
		bindTabs($wrapper);
		bindPageLinks($wrapper);
	},
	/**
	 * Changes title of the page
	 * @param {(string|Array<{page: {string}, title: {string}}>|jQuery)} new_title
	 */
	changeTitle: function changeTitle(new_title) {
		var $new_title = $(),
			title_str;
		if(typeof new_title === 'string') {
			title_str = new_title;
			new_title = new_title.split(' > ');
		}
		switch (true) {
			case (new_title instanceof Array): {
				new_title.forEach(function(title_chunk, i) {
					if (i) {
						$new_title = $new_title.add('<span class="title_chunk fa_icon fa-angle-right -empty"></span>');
					}
					if (typeof title_chunk == 'object') {
						title_chunk.toString = (Array.isArray(title_chunk)) ? Array.toSpaceSeparatedString : Object.toHtmlDataSet;
						$new_title = $new_title.add('<a href="' + title_chunk.page + '" class="title_chunk link Link">' + title_chunk.title + '</a>');
						new_title[i] = title_chunk.title;
					} else {
						$new_title = $new_title.add('<span class="title_chunk">' + title_chunk + '</span>');
					}
				});
				if (!title_str) {
					title_str = new_title.join(' > ');
				}
				break;
			}
			case (new_title instanceof jQuery): {
				$new_title = new_title;
				new_title.each(function() {
					if (this.text())
						title_str += this.text() + ' ';
				});
				break;
			}
		}
		bindPageLinks($('#page_title').html($new_title));
		$('title').text(title_str ? title_str : 'Evendate');
	},
	/**
	 * Pushes state in History.js`s states stack and renders page or replaces last state
	 * @param {string} page_name
	 * @param {boolean} [soft_change=false]
	 * @param {boolean} [reload=false]
	 * @return {boolean} false
	 */
	changeState: function changeState(page_name, soft_change, reload) {
		History.stateChangeHandled = true;
		if (page_name) {
			page_name = page_name.indexOf('/') === 0 ? page_name : '/' + page_name;
			if (soft_change) {
				History.replaceState({_index: History.getCurrentIndex()}, '', page_name);
			} else {
				History.pushState({_index: History.getCurrentIndex()}, '', page_name);
			}
			if (!soft_change || (soft_change && reload)) {
				__APP.reInit();
			}
		} else {
			console.error('Need to pass page name');
		}
		History.stateChangeHandled = false;
		
		return false;
	},
	reload: function() {
		return __APP.changeState(location.pathname, true, true);
	},
	init: function appInit() {
		var $sidebar_nav_items = $('.SidebarNavItem'),
			pathname = window.location.pathname;
		
		__APP.CURRENT_PAGE = Page.routeNewPage(pathname);
		__APP.CURRENT_PAGE.fetchData();
		__APP.CURRENT_PAGE.show();
		$sidebar_nav_items
			.removeClass(__C.CLASSES.ACTIVE)
			.filter(function() {
				return pathname.indexOf(this.getAttribute('href')) === 0;
			})
			.addClass(__C.CLASSES.ACTIVE);
	},
	reInit: function appReInit() {
		$(window).off('scroll');
		
		__APP.SERVER.abortAllConnections();
		__APP.PREVIOUS_PAGE = __APP.CURRENT_PAGE;
		__APP.PREVIOUS_PAGE.destroy();
		__APP.init();
	}
};

__ERRORS = [];

__LOCALES = {
	ru_RU: {
		TEXTS: {
			BUTTON: {
				REMOVE_FAVORITE: 'Убрать',
				ADD_FAVORITE: 'В избранное',
				FAVORED: 'В избранном',
				ADD_SUBSCRIPTION: 'Подписаться',
				REMOVE_SUBSCRIPTION: 'Отписаться',
				SUBSCRIBED: 'Подписан',
				EDIT: 'Изменить'
			},
			SUBSCRIBERS: {
				NOM: ' подписчик',
				GEN: ' подписчика',
				PLU: ' подписчиков'
			},
			PEOPLE: {
				NOM: ' человек',
				GEN: ' человека',
				PLU: ' человек'
			},
			FAVORED: {
				NOM: ' участник',
				GEN: ' участника',
				PLU: ' участников'
			},
			ACTIVITY: {
				SUBSCRIBE: {
					MAS: 'подписался на организацию',
					FEM: 'подписалась на организацию',
					NEU: 'подписалось на организацию'
				},
				UNSUBSCRIBE: {
					MAS: 'отписался от организации',
					FEM: 'отписалась от организации',
					NEU: 'отписалось от организации'
				},
				FAVE: {
					MAS: 'добавил в избранное событие',
					FEM: 'добавила в избранное событие',
					NEU: 'добавило в избранное событие'
				},
				UNFAVE: {
					MAS: 'удалил из избранного событие',
					FEM: 'удалила из избранного событие',
					NEU: 'удалило из избранного событие'
				},
				SHARE: {
					MAS: 'поделился событием',
					FEM: 'поделилась событием',
					NEU: 'поделилось событием'
				}
			},
			TICKET_STATUSES: {
				USED: 'Билет использован',
				
				WAITING_FOR_PAYMENT: 'Ожидает оплаты',
				IS_PENDING: 'Ожидает подтверждения',
				
				APPROVED: 'Подтверждено',
				PAYED: 'Оплачено',
				WITHOUT_PAYMENT: 'Подтверждено',
				
				TICKETS_ARE_OVER: 'Билеты закончились',
				RETURNED_BY_ORGANIZATION: 'Возврат билета организатором',
				PAYMENT_CANCELED_AUTO: 'Отмена транзакции',
				PAYMENT_CANCELED_BY_CLIENT: 'Отменено клиентом',
				RETURNED_BY_CLIENT: 'Возврат билета',
				REJECTED: 'Отклонено'
			}
		},
		DATE: {
			DATE_FORMAT: 'DD.MM.YYYY',
			TIME_FORMAT: 'HH:mm',
			DATE_TIME_FORMAT: 'DD.MM.YYYY HH:mm',
			MONTH_SHORT_NAMES: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
			MONTH_NAMES: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
			CALENDAR_DATE_TIME: {
				sameDay: '[Сегодня в] HH:mm',
				lastDay: '[Вчера в] HH:mm',
				nextWeek: 'D MMMM [в] HH:mm',
				lastWeek: 'D MMMM [в] HH:mm',
				sameElse: 'D MMMM [в] HH:mm'
			}
		},
		DATATABLES_URL: '//cdn.datatables.net/plug-ins/1.10.15/i18n/Russian.json'
	}
};

__LOCALE = __LOCALES.ru_RU;

Object.seal(__APP);
Object.freeze(__APP.SERVER);
Object.freeze(__APP.ROUTING);
Object.freeze(__APP.BUILD);
Object.freeze(__C);
Object.freeze(__LOCALES);

/**
 *
 * @class jqPromise
 */
/**
 * @method
 * @name jqPromise#then
 * @param {(Function|Array<Function>)} doneCallbacks
 * @param {(Function|Array<Function>)} [failCallbacks]
 * @param {(Function|Array<Function>)} [progressCallbacks]
 * @returns {jqPromise}
 */
/**
 * @method
 * @name jqPromise#progress
 * @param {...(Function|Array<Function>)} progressCallbacks
 * @returns {Deferred}
 */
/**
 * @method
 * @name jqPromise#done
 * @param {...(Function|Array<Function>)} doneCallbacks
 * @returns {Deferred}
 */
/**
 * @method
 * @name jqPromise#fail
 * @param {...(Function|Array<Function>)} failCallbacks
 * @returns {Deferred}
 */
/**
 * @method
 * @name jqPromise#always
 * @param {...(Function|Array<Function>)} alwaysCallbacks
 * @returns {Deferred}
 */
/**
 * @method
 * @name jqPromise#promise
 * @param {Object} [target]
 * @returns {jqPromise}
 */
/**
 * @method
 * @name jqPromise#state
 * @returns {__C.DEFERRED_STATES}
 */

window.paceOptions = {
	ajax: false, // disabled
	document: false, // disabled
	eventLag: false, // disabled
	elements: {},
	search_is_active: false,
	search_query: null,
	search_xhr: null
};
__stats = [];
askToSubscribe = null;

/**
 *
 * @param {string} [path_part]
 * @param {string} [redirect_to]
 * @param {boolean} [contains_not=false]
 * @return {boolean}
 */
function checkRedirect(path_part, redirect_to, contains_not) {
	var pathname = window.location.pathname;
	
	if (path_part && (contains_not ^ pathname.contains(path_part))) {
		return __APP.changeState(redirect_to, true, true);
	}
	
	
	if (__APP.USER.isLoggedOut()) {
		if (pathname.contains('/admin')) {
			return __APP.changeState('/', true, true);
		}
	}
	
	if (pathname.contains('/statistics')) {
		return __APP.changeState(pathname.replace('statistics', 'admin'), true, true);
	}
	
	return true;
}

if (checkRedirect()) {
	$(document)
		.ajaxStart(function() {
			Pace.restart()
		})
		.ajaxError(function(event, jqxhr, settings, thrownError) {
			if (thrownError && thrownError === 'Forbidden') {
				__APP.changeState('/', true, true);
			} else if (!(thrownError && thrownError === 'abort')) {
				ServerConnection.ajaxErrorHandler(event, jqxhr, settings, thrownError);
			}
		})
		.ready(function() {
			var OneSignal = window.OneSignal || [],
				user_jqhxr,
				auth_urls_jqxhr;
			
			OneSignal.push(["init", {
				appId: "7471a586-01f3-4eef-b989-c809700a8658",
				autoRegister: false,
				notifyButton: {
					enable: false /* Set to false to hide */
				}
			}]);
			OneSignal.push(function () {
				// If we're on an unsupported browser, do nothing
				if (!OneSignal.isPushNotificationsSupported()) {
					return;
				}
				OneSignal.isPushNotificationsEnabled(function (isEnabled) {
					if (isEnabled) {
						// The user is subscribed to notifications
						// Don't show anything
					} else {
						window.askToSubscribe = function subscribe() {
							OneSignal.push(function () {
								OneSignal.on('subscriptionChange', function (isSubscribed) {
									if (isSubscribed) {
										// The user is subscribed
										//   Either the user subscribed for the first time
										//   Or the user was subscribed -> unsubscribed -> subscribed
										
										OneSignal.getUserId(function (userId) {
											$.ajax({
												url: 'api/v1/users/me/devices',
												type: 'PUT',
												data: {
													'device_token': userId,
													'client_type': 'browser',
													'model': navigator.appVersion ? navigator.appVersion : null,
													'os_version': navigator.platform ? navigator.platform : null
												},
												global: false
											});
										});
									}
								});
							});
							
							OneSignal.push(["registerForPushNotifications"]);
							event.preventDefault();
						};
					}
				});
			});
			
			if (window.moment !== undefined) {
				moment.locale(navigator.language);
				//moment.tz.setDefault('Europe/Moscow');
				moment.updateLocale('ru', {
					monthsShort: __LOCALES.ru_RU.DATE.MONTH_SHORT_NAMES,
					calendar: {
						sameDay: '[Сегодня]',
						nextDay: '[Завтра]',
						lastDay: '[Вчера]',
						nextWeek: 'D MMMM',
						lastWeek: 'D MMMM',
						sameElse: 'D MMMM'
					}
				})
			}
			
			if (window.Highcharts !== undefined) {
				Highcharts.setOptions({
					lang: {
						shortMonths: __LOCALES.ru_RU.DATE.MONTH_SHORT_NAMES
					}
				});
			}
			
			/**
			 * Bind only on 'back' action
			 */
			History.Adapter.bind(window, 'statechange', function() {
				if (!History.stateChangeHandled) {
					__APP.reInit();
				}
			});
			
			if (isNotDesktop()) {
				$('.DownloadAppBand').addClass('-open_band');
				$('.CloseDownloadAppBand').one('click', function() {
					$('.DownloadAppBand').removeClass('-open_band');
				});
			}
			
			user_jqhxr = __APP.USER.fetchUser(new Fields(
				'email',
				'accounts',
				'accounts_links', {
					friends: {
						fields: ['is_friend'],
						length: 4
					},
					subscriptions: {
						fields: ['img_small_url', 'subscribed_count', 'new_events_count', 'actual_events_count']
					}
				}));
			auth_urls_jqxhr = __APP.SERVER.getData('/auth.php', {
				action: 'get_urls',
				mobile: isNotDesktop()
			});
			
			__APP.SERVER.multipleAjax(user_jqhxr, auth_urls_jqxhr, function(user_data, auth_urls) {
				var selected_city;
				
				if (checkRedirect()) {
					try {
						selected_city = JSON.parse(localStorage.getItem('selected_city'));
					} catch (e) {
						selected_city = false;
					}
					
					__APP.AUTH_URLS = auth_urls;
					
					if (selected_city) {
						__APP.USER.selected_city.setData(selected_city);
					} else {
						(new CitiesCollection()).fetchCities(new Fields('timediff_seconds', 'distance'), null, '-distance', function() {
							(new CityChooseModal(this)).show();
						});
					}
					
					if(__APP.USER.isLoggedOut()){
						__APP.TOP_BAR = new TopBarNoAuth();
						__APP.SIDEBAR = new SidebarNoAuth();
					} else {
						__APP.TOP_BAR = new TopBar();
						__APP.SIDEBAR = new Sidebar();
					}
					__APP.TOP_BAR.init();
					__APP.SIDEBAR.init();
					__APP.init();
					bindPageLinks();
				}
			});
			
			setInterval(function () {
				if (window.__stats.length != 0) {
					var batch = window.__stats;
					window.__stats = [];
					$.ajax({
						url: '/api/v1/statistics/batch',
						data: JSON.stringify(batch),
						type: 'POST',
						contentType: 'application/json; charset=utf-8',
						dataType: 'json',
						error: function () {
							window.__stats.concat(batch);
						}
					});
				}
			}, 5000);
			
		});
}