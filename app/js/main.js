String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
};
String.prototype.contains = function(it) {return this.search(it) !== -1;};
String.prototype.format = function(fields){
	return this.replace(/\{(\w+)\}/gm, function(m,n){
		return fields[n] ? fields[n] : m;
	});
};
Object.props = function(obj){
	var props = [];
	Object.keys(obj).forEach(function(prop){
		if(typeof obj[prop] !== 'function'){
			props.push(prop);
		}
	});
	return props;
};
Object.methods = function(obj){
	var methods = [];
	Object.keys(obj).forEach(function(prop){
		if(typeof obj[prop] === 'function'){
			methods.push(prop);
		}
	});
	return methods;
};
Object.values = typeof Object.values == 'function' ? Object.values : function(obj) {
	var vals = [];
	for (var key in obj) {
		if (obj.hasOwnProperty(key) && obj.propertyIsEnumerable(key)) {
			vals.push(obj[key]);
		}
	}
	return vals;
};
Array.newFrom = function(original) {
	var new_array = original.slice(0), arg, i;
	if(arguments.length > 1){
		for (i = 1; i < arguments.length; i++) {
			arg = arguments[i];
			switch(typeof arg){
				case 'number':
				case 'string':
				case 'boolean': {
					$.merge(new_array, [arg]);
					break;
				}
				case 'object': {
					if(!Array.isArray(arg)){
						$.merge(new_array, Object.keys(arg).map(function(key) {return arg[key]}));
					} else {
						$.merge(new_array, arg);
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
Array.prototype.clean = function(deleteValue) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == deleteValue) {
			this.splice(i, 1);
			i--;
		}
	}
	return this;
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
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			options = $.extend(true, {}, defaults, target.data());
			floored_number = Math.floor(tween.now);
			separated_number = floored_number.toString();
			
			function extractNumberParts(separated_number, group_length) {
				var numbers = separated_number.split('').reverse(),
					number_parts = [],
					current_number_part,
					current_index,
					q;
				
				for(var i = 0, l = Math.ceil(separated_number.length / group_length); i < l; i++) {
					current_number_part = '';
					for(q = 0; q < group_length; q++) {
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
	
}(jQuery));

function arrayToSpaceSeparatedString(){return this.join(' ')}

function objectToHtmlAttributes(){
	var attributes = [], obj = this;
	Object.props(obj).forEach(function(prop){
		attributes.push(prop+'="'+obj[prop]+'"');
	});
	return attributes.join(' ');
}

function objectToHtmlDataSet(){
	var dataset = [], obj = this;
	Object.props(obj).forEach(function(prop){
		dataset.push(((prop.indexOf('data-') != 0) ? 'data-'+prop : prop) + '="' + obj[prop] + '"');
	});
	return dataset.join(' ');
}

/**
 *
 * @param {Object[]} dates
 * @param {timestamp} dates[].event_date
 * @param {string} [dates[].start_time]
 * @param {string} [dates[].end_time]
 * @param {(string|Array|jQuery|Object)} format
 * @param {bool} is_same_time
 * @returns {Array}
 */
function formatDates(dates, format, is_same_time){
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
				MM: month + 1 > 9 ? month + 1 : "0"+(month + 1),
				MMM: __LOCALES.DATE.MONTH_SHORT_NAMES[month].toLocaleLowerCase(),
				MMMM: __LOCALES.DATE.MONTH_NAMES[month].toLocaleLowerCase(),
				MMMMs: genitive_month_names[month],
				Y: year,
				YY: year.substr(2,2),
				YYYY: year
			},
			output;
		
		if(typeof formatting == 'string'){
			output = formatting.format(format_options).capitalize();
		} else if(Array.isArray(formatting)) {
			output = formatting.map(function(str) {
				return str.format(format_options).capitalize();
			});
		} else if(formatting instanceof jQuery) {
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
	
	if(!format) {
		format = {
			date: '{D} {MMMMs} {YYYY}',
			time: '{T}'
		}
	}
	
	if(typeof format == 'string'){
		is_with_time = format.contains((/\{T\}|\{t\}/)) && dates[0]['start_time'] !== undefined;
	} else {
		is_with_time = dates[0]['start_time'] !== undefined;
		$.each(format, function() {
			is_with_time = is_with_time || this.contains((/\{T\}|\{t\}/));
		})
	}
	
	if(is_same_time){
		if(is_with_time){
			cur_time = dates[0].end_time ? displayTimeRange(dates[0].start_time, dates[0].end_time) : displayTimeRange(dates[0].start_time);
		}
		
		dates.forEach(function(date, i) {
			cur_moment = moment.unix(date.event_date);
			cur_year = cur_moment.year();
			cur_month = cur_moment.month();
			if(!dates_obj[cur_year])  dates_obj[cur_year] = {};
			if(!dates_obj[cur_year][cur_month])  dates_obj[cur_year][cur_month] = [];
			
			if(prev_moment){
				if(cur_month !== prev_moment.month() || prev_moment.diff(cur_moment, 'days') !== -1){
					dates_obj[prev_moment.year()][prev_moment.month()].push(cur_range_of_days.join('-'));
					cur_range_of_days[0] = cur_moment.format('D');
				} else {
					cur_range_of_days[1] = cur_moment.format('D');
				}
			} else {
				cur_range_of_days[0] = cur_moment.format('D');
			}
			
			if(i === last_index){
				dates_obj[cur_year][cur_month].push(cur_range_of_days.join('-'));
			} else {
				prev_moment = cur_moment;
			}
		});
		
		
		$.each(dates_obj, function(year, months){
			$.each(months, function(month, days){
				output.push(formatString(format, days.join(', '), is_with_time ? cur_time : '', month, year));
			})
		});
		
	} else {
		dates.forEach(function(date, i) {
			cur_moment = moment.unix(date.event_date);
			cur_year = cur_moment.year();
			cur_month = cur_moment.month();
			cur_time = date.end_time ? displayTimeRange(date.start_time, date.end_time) : displayTimeRange(date.start_time);
			if(!dates_obj[cur_year])  dates_obj[cur_year] = {};
			if(!dates_obj[cur_year][cur_month])  dates_obj[cur_year][cur_month] = [];
			
			if(prev_moment){
				if(cur_month !== prev_moment.month() || prev_moment.diff(cur_moment, 'days') !== -1 || prev_time !== cur_time){
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
			
			if(i === last_index){
				dates_obj[cur_year][cur_month].push({
					date: cur_range_of_days.join('-'),
					time: prev_time
				});
			} else {
				prev_moment = cur_moment;
				prev_time = cur_time;
			}
		});
		
		$.each(dates_obj, function(year, months){
			$.each(months, function(month, days){
				var formatted_days = [],
					range = [],
					prev_time;
				$.each(days, function(i, day) {
					if(prev_time){
						if(day.time != prev_time){
							formatted_days.push({date: range.join(', '), time: prev_time});
							range = [day.date];
						} else {
							range.push(day.date);
						}
					} else {
						range = [day.date];
					}
					
					if(i === days.length - 1){
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

function trimSeconds(time) {
	time = time.split(':');
	if(time.length == 3)
		time = time.splice(0,2);
	
	return time.join(':');
}

/**
 *
 * @param {timestamp} first_date
 * @param {timestamp} last_date
 * @returns {string}
 */
function displayDateRange(first_date, last_date){
	var m_first = moment.unix(first_date),
		m_last = moment.unix(last_date);
	
	if(m_first.isSame(m_last, 'year')){
		if(m_first.isSame(m_last, 'month')){
			if(m_first.isSame(m_last, 'day')){
				return m_first.format('D MMM YYYY');
			} else {
				return m_first.format('D') + '-' + m_last.format('D MMM YYYY');
			}
		} else {
			return m_first.format('D MMM') + ' - ' + m_last.format('D MMM YYYY');
		}
	} else {
		return m_first.format('MMM YYYY') + ' - ' + m_last.format('MMM YYYY');
	}
}

/**
 *
 * @param {string} start_time
 * @param {string} [end_time]
 * @returns {string}
 */
function displayTimeRange(start_time, end_time){
	
	if(end_time){
		if(end_time == start_time && (start_time == '00:00:00' || start_time == '00:00')){
			return 'Весь день';
		} else {
			return trimSeconds(start_time) + ' - ' + trimSeconds(end_time);
		}
	} else {
		return trimSeconds(start_time);
	}
}


$.fn.extend({
	toggleStatus: function(statuses) {
		var $this = this;

		if($this.is('.form_unit')){
			statuses.split(' ').forEach(function(status){
				var $form_elements = $this.find('input, select, textarea, button');
				if(status === 'disabled'){
					if($this.hasClass('-status_disabled')){
						$form_elements.removeAttr('disabled');
					} else {
						$form_elements.attr('disabled', true);
					}
				}
				$this.toggleClass('-status_'+status);
			});
		} else if($this.is('input, textarea, select, button')){
			$this.closest('.form_unit').toggleStatus(statuses);
		}	else if($this.length) {
			$this.find('.form_unit').toggleStatus(statuses);
		}	else {
			throw Error('Argument not found');
		}

		return this;
	},

	/**
	 * Сбор данных с формы
	 * Метод возвращает javaScript объект, состоящий из атрибутов name и value элементов формы.
	 * Если output_type стоит на array, то возвращается массив из объектов с полями name и value (аналогично с serializeArray).
	 *
	 * @method external:"jQuery.fn".serializeForm
	 *
	 * @param {string} [output_type=object]
	 * @returns {Array|Object}
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

		switch(output_type){
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
					switch(this.type){
						case "radio":
						case "checkbox":{
							std = c == "on" ? ( this.checked ? 1 : 0 ) : c;
							break;
						}
						default:{
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
				}).each(function(i,el){
					var $element = $(el),
						name = el.name,
						value = $element.val();

					if(elements.filter("[name='"+name+"']").length > 1 && value != ""){
						output[name] = typeof(output[name]) == "undefined" ? [] : output[name];
						output[name].push(value ? value.replace(xb, "\r\n") : value)
					}
					else if($element.attr('type') === 'hidden' && value.indexOf('data.') === 0){
						var data_names = value.split('.'),
							data = $element.data(data_names[1]),
							n = 2;
						while(data_names[n]){
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
				}).each(function(i,el){
					var name = el.name,
						value = el.value;

					switch(el.type){
						case 'radio':{
							output[name] = value;
							break;
						}
						case 'checkbox':{
							if(elements.filter("[name='"+name+"']").length > 1 && value != "on"){
								output[name] = typeof(output[name]) == "undefined" ? [] : output[name];
								output[name].push(value)
							}
							else if(value != "on")
								output[name] = value;
							else
								output[name] = el.checked ? true : false;
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
		
		for(var i = 1, l = arguments.length; i < l; i++) {
			args.push(arguments[i]);
		}
		this.data(options);
		
		return this.animate.apply(this, args);
	}
});

jQuery.makeSet = function(array) {
	return $($.map(array, function(el){return el.get();}));
};

function SubscribeButton($btn, options){
	var self = this,
		default_values = {
			labels: {
				subscribe: 'Подписаться',
				unsubscribe: 'Отписаться',
				subscribed: 'Подписан'
			},
			colors: {
				subscribe: '-color_neutral_accent',
				unsubscribe: '-color_accent',
				subscribed: '-color_accent'
			},
			icons: {
				subscribe: 'fa-plus',
				unsubscribe: 'fa-times',
				subscribed: 'fa-check'
			}
		},
		classes = {
			subscribed_state: '-Subscribed'
		};
	options = options ? options : {};
	this.$btn = $btn;
	this.is_subscribed = this.$btn.hasClass(classes.subscribed_state);
	this.is_organization = self.$btn.data('organization-id') ? true : false;
	this.id = this.is_organization ? self.$btn.data('organization-id') : self.$btn.data('event-id');
	
	$.each(default_values, function(type, default_values) {
		if(type == 'labels'){
			self[type] = typeof options[type] == 'undefined' ? default_values : $.extend({}, default_values, options[type]);
			return;
		}
		options[type] = typeof options[type] != 'undefined' ? options[type] : {};
		if(typeof options[type] == 'object' && options[type] !== null){
			$.each(default_values, function(state, default_value) {
				var add_class = options[type][state] ? options[type][state] : default_value;
				classes[state] = classes[state] ? classes[state].concat(' ', add_class) : add_class;
			});
		}
	});
	this.classes = classes;

	this.bindHoverEvents = function(){
		var self = this;
		self.$btn
			.off('mouseenter.hoverSubscribed mouseleave.hoverSubscribed')
			.on('mouseenter.hoverSubscribed', function(){
				self.$btn.removeClass(self.classes.subscribed).addClass(self.classes.unsubscribe);
				self.$btn.children('.Text').text(self.labels.unsubscribe);
			})
			.on('mouseleave.hoverSubscribed', function(){
				self.$btn.removeClass(self.classes.unsubscribe).addClass(self.classes.subscribed);
				self.$btn.children('.Text').text(self.labels.subscribed);
			});
		return self.$btn;
	};

	this.subscribe = function(){
		var self = this;
		if(this.is_subscribed){
			console.warn('You already subscribed');
		} else {
			subscribeAction(true, self.is_organization, self.id, function(){
				self.$btn
					.removeClass([self.classes.subscribe, self.classes.subscribed].join(' '))
					.addClass(['-Subscribed', self.classes.unsubscribe].join(' '))
					.children('.Text').text(self.labels.unsubscribe);
				self.bindHoverEvents();
				self.is_subscribed = true;
			});
		}
	};

	this.unsubscribe = function(){
		var self = this;
		if(this.is_subscribed){
			subscribeAction(false, this.is_organization, this.id, function(){
				self.$btn
					.removeClass([classes.subscribed_state, self.classes.unsubscribe, self.classes.subscribed].join(' '))
					.addClass(self.classes.subscribe)
					.off('mouseenter.hoverSubscribed mouseleave.hoverSubscribed')
					.children('.Text').text(self.labels.subscribe);
				self.is_subscribed = false;
			});
		} else {
			console.warn('You are not subscribed');
		}
	};
	
	function subscribeAction(to_subscribe, is_org, id, callback){
		to_subscribe = typeof to_subscribe == 'boolean' ? to_subscribe : true;
		$.ajax({
			url: is_org ? '/api/v1/organizations/'+id+'/subscriptions' : '/api/v1/events/'+id+'/favorites',
			method: to_subscribe ? 'POST' : 'DELETE',
			success: function(res){
				ajaxHandler(res, function(){
					callback();
					if(is_org){
						to_subscribe ? renderSidebarOrganizations(id, bindControllers) : hideSidebarOrganization(id);
					}
				}, ajaxErrorHandler)
			}
		});
		if (window.askToSubscribe instanceof Function){
			window.askToSubscribe();
		}
	}

	if(this.is_subscribed){
		this.bindHoverEvents();
	}

	if(!this.$btn.children('span').length){
		this.$btn.wrapInner('<span class="Text">');
	}

	this.$btn.on('click.subscribe', function(){
		if(self.is_subscribed){
			self.unsubscribe();
		} else {
			self.subscribe();
		}
		if (window.askToSubscribe instanceof Function){
			window.askToSubscribe();
		}
	})
}

function buildRadioOrCheckbox(type, props){
	if(type == 'checkbox' || type == 'radio'){
		props.type = type;
		props.classes = props.classes ? (typeof props.classes == 'string') ? props.classes.split(' ') : props.classes : [];
		props.unit_classes = props.unit_classes ? (typeof props.unit_classes == 'string') ? props.unit_classes.split(' ') : props.unit_classes : [];
		if(props.classes.indexOf('form_checkbox') == -1 && props.classes.indexOf('form_radio') == -1){
			props.classes.unshift('form_'+type);
		}
		props.classes.toString = arrayToSpaceSeparatedString;
		props.unit_classes.toString = arrayToSpaceSeparatedString;
		props.unit_classes.unshift('form_unit');

		if(props.dataset)
			props.dataset.toString = (Array.isArray(props.dataset)) ? arrayToSpaceSeparatedString : objectToHtmlDataSet;
		if(props.attributes)
			props.attributes.toString = (Array.isArray(props.attributes)) ? arrayToSpaceSeparatedString : objectToHtmlAttributes;
		return tmpl('radio-checkbox', props);
	} else {
		throw Error('Принимаемый аргумент type может быть либо "radio" либо "checkbox", придурок')
	}
}

function buildButton(props){
	props.classes = props.classes ? (typeof props.classes == 'string') ? props.classes.split(' ') : props.classes : [];
	props.classes.toString = arrayToSpaceSeparatedString;
	if(props.dataset)
		props.dataset.toString = (Array.isArray(props.dataset)) ? arrayToSpaceSeparatedString : objectToHtmlDataSet;
	if(props.attributes)
		props.attributes.toString = (Array.isArray(props.attributes)) ? arrayToSpaceSeparatedString : objectToHtmlAttributes;
	
	return tmpl('button', props);
}

function buildUserTombstones(users, props){
	function normalize(user) {
		props.avatar_classes = props.avatar_classes ? (typeof props.avatar_classes == 'string') ? props.avatar_classes.split(' ') : props.avatar_classes : [];
		props.tombstone_classes = props.tombstone_classes ? (typeof props.tombstone_classes == 'string') ? props.tombstone_classes.split(' ') : props.tombstone_classes : [];
		
		$.extend(true, user, {
			dataset: {},
			name: [user.first_name, user.last_name].join(' '),
			size: '70x70'
		}, props);
		
		if(props.is_link){
			$.extend(true, user.dataset, {
				page: 'friend/'+user.id,
				'friend-id': user.id,
				title: user.name,
				name: user.name
			});
			user.tombstone_classes.push('Controller');
		}
		
		user.avatar_classes.toString = arrayToSpaceSeparatedString;
		user.tombstone_classes.toString = arrayToSpaceSeparatedString;
		if(user.dataset)
			user.dataset.toString = (Array.isArray(user.dataset)) ? arrayToSpaceSeparatedString : objectToHtmlDataSet;
	}
	
	if(Array.isArray(users)){
		users.forEach(normalize);
	} else {
		normalize(users);
	}
	
	return tmpl('user-tombstone', users);
}

function buildAvatarBlocks(props){
	if(Array.isArray(props)){
		props.forEach(normalize);
	} else {
		normalize(props);
	}
	
	function normalize(props_unit) {
		props_unit.avatar_classes = props_unit.avatar_classes ? (typeof props_unit.avatar_classes == 'string') ? props_unit.avatar_classes.split(' ') : props_unit.avatar_classes : [];
		props_unit.block_classes = props_unit.block_classes ? (typeof props_unit.block_classes == 'string') ? props_unit.block_classes.split(' ') : props_unit.block_classes : [];
		if(props_unit.is_link){
			props_unit.dataset = $.extend({
				'title': props_unit.name,
				'page': 'friend/'+props_unit.id,
				'friend-id': props_unit.id
			}, props_unit.dataset);
			props_unit.block_classes.push('Controller');
		}
		if(props_unit.avatar_classes)
			props_unit.avatar_classes.toString = arrayToSpaceSeparatedString;
		if(props_unit.block_classes)
			props_unit.block_classes.toString = arrayToSpaceSeparatedString;
		if(props_unit.dataset)
			props_unit.dataset.toString = (Array.isArray(props_unit.dataset)) ? arrayToSpaceSeparatedString : objectToHtmlDataSet;
	}
	
	return tmpl('avatar-block', props);
}

function buildAvatars(subscribers, count){
	var $subscribers = $();
	$subscribers = $subscribers.add(tmpl('subscriber-avatar', __USER));
	subscribers.forEach(function(subscriber){
		if(subscriber.id != __USER.id && $subscribers.length <= count){
			$subscribers = $subscribers.add(tmpl('subscriber-avatar', subscriber));
		}
	});
	return $subscribers;
}

function buildAvatarCollection(users, max_count, props){
	props.classes = props.classes ? (typeof props.classes == 'string') ? props.classes.split(' ') : props.classes : [];
	props.classes.toString = arrayToSpaceSeparatedString;
	if(props.dataset)
		props.dataset.toString = (Array.isArray(props.dataset)) ? arrayToSpaceSeparatedString : objectToHtmlDataSet;
	
	props.avatars = tmpl('subscriber-avatar', __USER);
	users.forEach(function(user){
		if(user.id != __USER.id && props.avatars.length <= max_count){
			props.avatars = props.avatars.add(tmpl('subscriber-avatar', user));
		}
	});
	return tmpl('avatars-collection', props);
}

function buildOrganizationBlock(organization, additional_fields){
	if(additional_fields){
		if(additional_fields.dataset)
			additional_fields.dataset.toString = objectToHtmlDataSet;
		if(additional_fields.avatar_classes)
			additional_fields.avatar_classes.toString = arrayToSpaceSeparatedString;
		if(additional_fields.block_classes)
			additional_fields.block_classes.toString = arrayToSpaceSeparatedString;
		if(additional_fields.counter_classes)
			additional_fields.counter_classes.toString = arrayToSpaceSeparatedString;
		return tmpl('organization-block', $.extend(true, organization, additional_fields));
	} else {
		return tmpl('organization-block', organization);
	}
}


function bindSubscribeButton($parent, options){
	$parent = $parent ? $parent : $('body');
	$parent.find('.Subscribe').not('.-Handled_Subscribe').each(function(){
		new SubscribeButton($(this), options);
	}).addClass('-Handled_Subscribe');
}

function bindDatePickers($parent){
	$parent = $parent ? $parent : $('body');
	$parent.find('.DatePicker').not('.-Handled_DatePicker').each(function(i, elem){
		(new DatePicker(elem, $(elem).data())).init();
	}).addClass('-Handled_DatePicker');
}

function bindTimeInput($parent){
	$parent = $parent ? $parent : $('body');
	$parent.find('.TimeInput').not('.-Handled_TimeInput').each(function(i, elem){
		initTimeInput(elem);
	}).addClass('-Handled_TimeInput');
}

function bindTabs($parent){
	$parent = $parent ? $parent : $('body');
	$parent.find('.Tabs').not('.-Handled_Tabs').each(function(i, elem){
		var $this = $(elem),
			$wrapper = $this.find('.TabsBodyWrapper'),
			$tabs = $this.find('.Tab'),
			$bodies = $this.find('.TabsBody');

		if(!$tabs.filter('.-active').length){
			$tabs.eq(0).addClass(__C.CLASSES.NEW_ACTIVE);
		}
		$bodies.removeClass(__C.CLASSES.NEW_ACTIVE).eq($tabs.index($tabs.filter('.-active'))).addClass(__C.CLASSES.NEW_ACTIVE);
		$wrapper.height($bodies.filter('.-active').height());

		$tabs.on('click', function(){
			if(!$(this).hasClass(__C.CLASSES.NEW_ACTIVE)){
				$tabs.removeClass(__C.CLASSES.NEW_ACTIVE);
				$bodies.removeClass(__C.CLASSES.NEW_ACTIVE);
				$(this).addClass(__C.CLASSES.NEW_ACTIVE);
				$bodies.eq($tabs.index(this)).addClass(__C.CLASSES.NEW_ACTIVE);
				$wrapper.height($bodies.filter('.-active').height());
				$this.trigger('change.tabs');
			}
		})
	}).addClass('-Handled_Tabs');
}

function bindShareButtons($parent){
	$parent = $parent ? $parent : $('body');
	$parent.find('.ShareButton').not('.-Handled_ShareButton').each(function(i, elem){
		var $this = $(elem);
		$this.on('click', function(){
			window.open($this.data('href'), $this.data('title'), 'width=600,height=440,resizable=yes,scrollbars=no,status=no');
		});
	}).addClass('-Handled_ShareButton');
}

function bindSelect2($parent){
	$parent = $parent ? $parent : $('body');
	$parent.find('.ToSelect2').not('.-Handled_ToSelect2').each(function(i, el){
		initSelect2($(el));
	});
}

function bindRippleEffect($parent){
	$parent = $parent ? $parent : $('body');
	$parent.find('.RippleEffect').not('.-Handled_RippleEffect').on('click.RippleEffect', function(e){
		var $this = $(this), $ripple, size, x, y;

		if($this.children('.Ripple').length == 0)
			$this.prepend("<span class='ripple Ripple'></span>");

		$ripple = $this.children('.Ripple');
		$ripple.removeClass('animate');

		if(!$ripple.height() && !$ripple.width()) {
			size = Math.max($this.outerWidth(), $this.outerHeight());
			$ripple.css({height: size, width: size});
		}

		x = e.pageX - $this.offset().left - ($ripple.width() / 2);
		y = e.pageY - $this.offset().top - ($ripple.height() / 2);

		$ripple
			.css({top: y+'px', left: x+'px'})
			.addClass('animate')
			.one('animationend webkitAnimationEnd', function(){
				$ripple.removeClass('animate');
			});
	}).addClass('-Handled_RippleEffect');
}

function bindDropdown($parent){
	$parent = $parent ? $parent : $('body');
	$parent.find('.DropdownButton').not('.-Handled_DropdownButton').each(function(){
		var $button = $(this),
			data = $button.data(),
			$dropbox = $('.DropdownBox').filter('[data-dropdown_id="'+data.dropdown+'"]');

		$dropbox.data($.extend({}, $dropbox.data(), data));
		$dropbox.closeDropbox = function(){
			$('body').off('mousedown.CloseDropdown');
			$(document).off('keyup.CloseDropdown');
			$dropbox.removeClass('-show');
			$button.addClass('-dropdown_active');
		};

		if(data.hasOwnProperty('ddWidth')){
			if(data.ddWidth == 'self'){
				$dropbox.width($button.outerWidth());
			} else if((isFinite(data.ddWidth)) || (data.ddWidth.search(/^[1-9]\d*%$|^0%$/) === 0)){
				$dropbox.width(data.ddWidth);
			}
		}
		if(data.hasOwnProperty('ddPosX') || data.hasOwnProperty('ddPosY')){
			var button_pos = $button.position();
			if(data.hasOwnProperty('ddPosX')){
				var xPos;
				if(data.ddPosX == 'self.center'){
					xPos = (button_pos.left + $button.outerWidth() / 2) - $dropbox.outerWidth() / 2;
				} else if(data.ddPosX == 'center'){
					xPos = $dropbox.parent().outerWidth() / 2 - $dropbox.outerWidth() / 2;
				} else if(isFinite(data.ddPosX)){
					xPos = data.ddPosX;
				}
				$dropbox.css('left', xPos);
			}
			if(data.hasOwnProperty('ddPosY')){
				var yPos;
				if(data.ddPosY == 'self.center'){
					yPos = (button_pos.top + $button.outerHeight() / 2) - $dropbox.outerHeight() / 2;
				} else if(data.ddPosY == 'center'){
					yPos = $dropbox.parent().outerHeight() / 2 - $dropbox.outerHeight() / 2;
				} else if(isFinite(data.ddPosY)){
					yPos = (button_pos.top + $button.outerHeight()) + data.ddPosY;
				}
				$dropbox.css('top', yPos);
			}
		}
		$dropbox.find('.CloseDropdown').on('click.CloseDropdown', $dropbox.closeDropbox);
		$button.on('click.Dropdown', function(){
			$dropbox.addClass('-show');
			$button.addClass('-dropdown_active');
			$('body').on('mousedown.CloseDropdown', function(e) {
				if(!$(e.target).closest('.DropdownBox').length){
					$dropbox.closeDropbox();
				}
			});
			$(document).on('keyup.CloseDropdown', function(e){
				if(e.keyCode == 27){
					$dropbox.closeDropbox();
				}
			});
		});

	}).addClass('-Handled_DropdownButton')
}

function bindAddAvatar($parent){
	$parent = $parent ? $parent : $('body');
	$parent.find('.AddAvatar').not('.-Handled_AddAvatar').on('click', function(){
		var $wrapper = $(this).closest('.AddAvatarWrapper'),
			$collection = $wrapper.find('.AvatarsCollection'),
			$favored_count = $wrapper.find('.FavoredCount'),
			$avatars = $collection.find('.avatar'),
			amount = $avatars.length;

		if($collection.data('max_amount') >= amount){
			if($collection.hasClass('-subscribed')){
				$collection.removeClass('-subscribed');
				$collection.width(amount == 1 ? 0 : ($avatars.outerWidth()*(amount-1)) - (6*(amount-2)));
			} else {
				$collection.addClass('-subscribed');
				$collection.width(($avatars.outerWidth()*amount) - (6*(amount-1)));
			}
		} else {
			if($favored_count.length){
				var current_count = parseInt($favored_count.text());
				if($collection.hasClass('-subscribed')){
					$favored_count.text(current_count-1);
					if(current_count-1 <= 0){
						$favored_count.parent().addClass('-cast');
					}
				} else {
					$favored_count.text(current_count+1);
					$favored_count.parent().removeClass('-cast');
				}
			}
			$collection.toggleClass('-shift -subscribed');
		}
	}).addClass('-Handled_AddAvatar');
}

function bindFileLoadButton(){
	$('.FileLoadButton').not('.-Handled_FileLoadButton').click(function(e){
		var $this = $(this);
		$this.children('input').get(0).click();
	}).addClass('-Handled_FileLoadButton');
}

function bindCollapsing($parent){
	$parent = $parent ? $parent : $('body');
	$parent.find('.CollapsingButton').each(function(){
		var $button = $(this),
			$wrapper = $button.siblings('.CollapsingWrapper'),
			$content = $wrapper.children(),
			default_height = $wrapper.data('defaultHeight') ? $wrapper.data('defaultHeight') : 0;
		function toggleCollapsing(){
			if($wrapper.hasClass('-opened')){
				$wrapper.height(default_height);
				$wrapper.on('click.toggleCollapsing', toggleCollapsing);
			} else {
				$wrapper.height($content.outerHeight());
				$wrapper.off('click.toggleCollapsing');
			}
			$wrapper.toggleClass('-opened');
		}
		if(!$wrapper.hasClass('-opened')){
			$wrapper.on('click.toggleCollapsing', toggleCollapsing);
		}
		$button.on('click.toggleCollapsing', toggleCollapsing);
	})
}

function bindControllers($parent){
	$parent = $parent ? $parent : $('body');
	$parent.find('[data-page], .Controller').not('.-Handled_Controller').on('mousedown.pageRender', function(e){
		if(e.which == 2){
			e.preventDefault();
		}
		$(this).off('mouseup.pageRender').one('mouseup.pageRender', function(e){
			var $this = $(this),
				page_name = $this.data('page'),
				controller_name = $this.data('controller');
			if ($this.hasClass(__C.CLASSES.DISABLED)) return true;
			switch(e.which){
				case 1: {
					if (page_name != undefined){
						changeState(page_name, $this.data('title') ? $this.data('title'): $this.text(), $this.data());
					} else {
						if (window[controller_name] != undefined && window[controller_name] instanceof Function){
							window[controller_name]();
						}
					}
					break;
				}
				case 2: {
					e.preventDefault();
					window.open('/'+page_name);
				}
			}
		});
	}).addClass('-Handled_Controller');
}

function changeState(page_name, title, data){
	title = title ? title : '';
	data = data ? data : {};
	if (page_name){
		page_name = page_name.indexOf('/') == 0 ? page_name : '/'+page_name;
		History.pushState($.extend({}, data, {_index: History.getCurrentIndex()}), title, '/'+page_name);
	} else {
		console.error('Need to pass page name');
	}
}



function initSelect2($element, options){
	var opt = {
		containerCssClass: 'form_select2',
		dropdownCssClass: 'form_select2_drop'
	};
	if($element.hasClass('-Handled_ToSelect2')){
		$element.select2('destroy');
	}
	if(options){
		$.extend(true, opt, options);
	}
	$element.select2(opt).addClass('-Handled_ToSelect2')
}

function initTimeInput(time_field){
	var $time_field = $(time_field),
		$hours = $time_field.find('input').eq(0),
		$minutes = $time_field.find('input').eq(1);

	function onBlur(){
		var $this = $(this);
		if($this.val() == "0" || $this.val() === ""){
			$this.val("00");
		}
		else if($this.val() <= 9){
			$this.val("0"+parseInt($this.val()));
		}
	}

	$hours.inputmask('Regex', {regex: "([01]?[0-9]|2[0-3])"}).on('keyup', function(){
		if($hours.val() > 2 || $hours.val() == "00"){
			$minutes.focus();
			$hours.trigger('blur');
		}
	}).on('blur', onBlur);
	$minutes.inputmask('Regex', {regex: "[0-5][0-9]"}).on('blur', onBlur);
	$time_field.addClass('-Handled_TimeInput');
}

function trimAvatarsCollection($parent){
	$parent = $parent ? $parent : $('body');
	$parent.find('.AvatarsCollection').each(function(){
		var $collection = $(this),
			$avatars = $collection.find('.avatar'),
			amount = $avatars.length;
		if($collection.hasClass('-subscribed') && !$collection.hasClass('-shift')){
			$collection.width(amount == 1 ? ($avatars.outerWidth()*amount) : ($avatars.outerWidth()*amount) - (6*(amount-1)));
		} else {
			$collection.width(amount == 1 ? 0 : ($avatars.outerWidth()*(amount-1)) - (6*(amount-2)));
		}
		$collection.addClass('-trimmed');
	});
}

function limitInputSize(){
	$('.LimitSize').not('.-Handled_LimitSize').each(function(i, e) {
		var $this = $(e),
			$form_unit = $this.closest('.form_unit'),
			max = $this.data('maxlength'),
			$prompt = $this.siblings('.form_prompt');
		if(!$prompt.length){
			$this.after($('<p>').addClass('form_prompt').text($this.val().length+'/'+max));
			$prompt = $this.siblings('.form_prompt');
		} else {
			$prompt.text($this.val().length+'/'+max);
		}
		$this.on('input', function(){
			var length = $this.val().length;
			if($this.is('textarea')){
				var crlfs = $this.val().match(/\n/g);
				length = crlfs ? length + crlfs.length : length;
			}
			if(length > max){
				$form_unit.addClass('-status_error');
			} else if($form_unit.hasClass('-status_error')) {
				$form_unit.removeClass('-status_error');
			}
			$prompt.text(length+'/'+max);
		})
	}).addClass('-Handled_LimitSize');
}

function handleErrorField($unit){
	if(!$unit instanceof jQuery){
		handleErrorField($($unit));
	} else if(!$unit.is('.form_unit')) {
		handleErrorField($unit.closest('.form_unit'));
	} else {
		if(!$unit.closest('form_unit').hasClass('-status_error')){
			var $input = $unit.find('input, select, textarea');
			$unit
				.toggleStatus('error')
				.off('input.clear_error change.clear_error')
				.one('input.clear_error change.clear_error', function(){
					$unit.off('input.clear_error change.clear_error').toggleStatus('error');
					$input.off('blur.clear_error');
				});
			$input
				.off('blur.clear_error')
				.one('blur.clear_error', function(){
					if($(this).val() !== ""){
						$unit.trigger('input.clear_error');
					}
				});
		}
	}
}

function placeAvatarDefault($parent){
	$parent = $parent ? $parent : $('body');
	var $avatars = $parent.find('.avatar');
	$avatars.each(function(){
		$(this).children('img').one('error', function(){
			this.src = '/app/img/logo_500.png';
		})
	});
}

function toDataUrl(url, callback){
	var xhr = new XMLHttpRequest();
	xhr.responseType = 'blob';
	xhr.onload = function() {
		var reader  = new FileReader();
		reader.onloadend = function () {
			callback(reader.result);
		};
		reader.readAsDataURL(xhr.response);
	};
	xhr.open('GET', url);
	xhr.send();
}

function showNotifier(response){
	$.notify({
		'message': response.text,
		'pos': response.pos ? response.pos : 'top-right',
		'status': response.status ? 'success' : 'danger'
	});
}

function renderState(){
	var page_split = __STATES.getCurrentState().split('/'),
		page = page_split[0],
		$body = $('body'),
		$sidebar_nav_items = $('.SidebarNavItem'),
		$tabs = $('.HeaderTabsWrapper').find('.Tab'),
		$views = $('.PageView'),
		$cur_view = $views.not('.'+__C.CLASSES.NEW_HIDDEN),
		state = History.getState(),
		$new_view,
		controller;
	
	changeTitle(state.title);
	
	if(!(state.data.reload === false && state.data._index+1 == History.getCurrentIndex())){
		$(window).off('scroll').data('disable_upload', false);
		switch(typeof __STATES[page]){
			case 'function': {
				controller = __STATES[page];
				break;
			}
			default:
			case 'undefined': {
				//TODO: 404 page
				console.error('PAGE RENDERING ERROR');
				return false;
			}
		}
		$new_view = page == 'friend' ? $('.friends-app') : $views.filter('.'+controller.name+'View');
		if(!$cur_view.is($new_view)){
			$('#main_header').removeClass('-with_tabs');
			$body.removeClass('-state_statistics');
		}
		
		$body.find('[data-page], .Controller').removeClass('-Handled_Controller').off('mousedown.pageRender');
		$cur_view.addClass('-faded');
		setTimeout(function(){
			$cur_view.addClass(__C.CLASSES.NEW_HIDDEN);
			$new_view.addClass('-faded').removeClass(__C.CLASSES.NEW_HIDDEN);
			controller($new_view);
			bindControllers();
			setTimeout(function(){
				$new_view.removeClass('-faded');
			}, 200);
		}, 200);
	}
	if(page != 'search')
		$('#search_bar_input').val('');
	
	$sidebar_nav_items.not('[data-page="' + page + '"]').removeClass(__C.CLASSES.NEW_ACTIVE)
		.end().filter('[data-page="' + page + '"]').addClass(__C.CLASSES.NEW_ACTIVE);
	$tabs.not('[data-tab_state="' + state.data.tab_state + '"]').removeClass(__C.CLASSES.NEW_ACTIVE)
		.end().filter('[data-tab_state="' + state.data.tab_state + '"]').addClass(__C.CLASSES.NEW_ACTIVE);
}

function hideSidebarOrganization(org_id){
	var $organization_item = $('#main_sidebar').find('.organization_item[data-organization_id="' + org_id + '"]').removeClass('-show');
	setTimeout(function(){
		$organization_item.remove();
	}, 500);
}

function renderSidebarOrganizations(organization, afterRenderCallback){
	var $list = $('.SidebarOrganizationsList'),
		timing = 0;

	function prependOrganization(org){
		if ($list.find('.organization_item[data-organization_id="' + org.id + '"]').length == 0){
			var counter_classes = org.new_events_count ? [] : ['-hidden'],
				org_block = buildOrganizationBlock(org, {
					block_classes: ['animated'],
					avatar_classes: ['-size_30x30', '-rounded'],
					counter_classes: counter_classes
				});
			if(timing){
				org_block.appendTo($list);
			} else {
				org_block.prependTo($list);
			}
			setTimeout(function(){
				org_block.addClass('-show');
			}, timing+=100);
		}
	}

	if (organization){
		if(Array.isArray(organization)){
			organization.forEach(function(org){
				prependOrganization(org);
			});
			if(afterRenderCallback && typeof afterRenderCallback == 'function')
				afterRenderCallback($list);
		}
		else if(typeof organization == 'number'){
			$.ajax({
				url: '/api/v1/organizations/'+organization,
				data: {fields: 'new_events_count,img_small_url'},
				success: function(res){
					res.data.forEach(function(organization){
						prependOrganization(organization);
					});
					if(afterRenderCallback && typeof afterRenderCallback == 'function')
						afterRenderCallback($list);
				}
			});
		}
		else {
			prependOrganization(organization);
			if(afterRenderCallback && typeof afterRenderCallback == 'function')
				afterRenderCallback($list);
		}
	}else{
		$.ajax({
			url: '/api/v1/organizations/subscriptions',
			data: {fields: 'new_events_count,img_small_url'},
			success: function(res){
				res.data.forEach(function(organization){
					prependOrganization(organization);
				});
				if(afterRenderCallback && typeof afterRenderCallback == 'function')
					afterRenderCallback($list);
			}
		});
	}
}

function renderHeaderTabs(tabs){
	var $wrapper = $('#main_header_bottom').find('.HeaderTabsWrapper');
	if(!Array.isArray(tabs) && typeof tabs == 'object'){
		var buf = [];
		$.each(tabs, function(){
			buf.push(this);
		});
		tabs = buf;
	}
	tabs.forEach(function(tab){
		if(tab.dataset)
			tab.dataset.toString = (Array.isArray(tab.dataset)) ? arrayToSpaceSeparatedString : objectToHtmlDataSet;
		if(tab.classes)
			tab.classes.toString = arrayToSpaceSeparatedString;
	});
	$wrapper.html(tmpl('tabs-header', {
		color: 'default',
		tabs: tmpl('tab', tabs)
	}));
	bindTabs($wrapper);
	$wrapper.find('.Tabs').on('change.tabs', function() {
		var $this = $(this),
			page_name = $this.data('page');
		changeState(page_name, $this.data('title') ? $this.data('title'): $this.text(), $this.data());
	});
	bindControllers($wrapper);
	$('#main_header').addClass('-with_tabs');
}

function changeTitle(new_title){
	var $new_title = $(),
		title_str;
	switch(true){
		case (typeof new_title == 'string'): {
			title_str = new_title;
			new_title = new_title.split(' > ');
		}
		case (Array.isArray(new_title)): {
			new_title.forEach(function(title_chunk, i) {
				if(i)
					$new_title = $new_title.add('<span class="fa_icon fa-angle-right -empty"></span>');
				$new_title = $new_title.add('<span>'+title_chunk+'</span>');
			});
			if(!title_str){
				title_str = new_title.join(' > ');
			}
			break;
		}
		case (new_title instanceof jQuery): {
			$new_title = new_title;
			new_title.each(function() {
				if(this.text())
					title_str += this.text() + ' ';
			});
			break;
		}
	}
	$('#page_title').html($new_title);
	$('title').text(title_str ? 'Evendate. '+title_str : 'Evendate');
}

function recognizeRole(privileges){
	var role = __C.ROLES.USER;
	privileges.forEach(function(privilege) {
		if(privilege.role_id == 1 || privilege.name == __C.ROLES.ADMIN)
			role = __C.ROLES.ADMIN;
		if((privilege.role_id == 2 || privilege.name == __C.ROLES.MODERATOR) && role !== __C.ROLES.ADMIN)
			role = __C.ROLES.MODERATOR;
	});
	return role;
}

function getSpecificStaff(role, staff, additional_fields){
	var specific_staff = [];
	staff.forEach(function(man){
		if(man.role == role){
			man.name = man.first_name + ' ' + man.last_name;
			specific_staff.push($.extend(true, {}, man, additional_fields))
		}
	});
	return specific_staff;
}


/* OLD CODE */

function showSettingsModal() {
	var $modal = $('#settings-modal');
	$modal.remove();

	$.ajax({
		url: '/api/v1/users/me/settings',
		type: 'GET',
		success: function(res) {
			$modal = tmpl('settings-modal', res.data);
			$modal
				.appendTo($('body'))
				.on('shown.bs.modal', function() {
					if (res.data.hasOwnProperty('show_to_friends')) {
						$modal.find('.show-to-friends').prop('checked', res.data.show_to_friends);
					}
					if (res.data.hasOwnProperty('notify_in_browser')) {
						$modal.find('.notify-in-browser').prop('checked', res.data.notify_in_browser);
					}
					$modal.find('.notify-in-browser').on('change', function() {
						var $this = $(this);
						if ($this.prop('checked')) {
							if (Notify.needsPermission) {
								Notify.requestPermission(function() {
								}, function() {
									$this.prop('checked', false);
									showNotifier({
										status: false,
										text: 'Мы не можем включить уведомления в браузере. Вы запретили их для нас :('
									});
								});
							}
						}
					})
				})
				.modal();
			$modal
				.find('.save-settings-btn')
				.off('click')
				.on('click', function() {
					var _data = {};
					$modal.find('input').each(function() {
						var $this = $(this);
						_data[$this.attr('name')] = $this.prop('checked');
					});

					Pace.ignore(function() {
						$.ajax({
							url: '/api/v1/users/me/settings',
							type: 'PUT',
							data: _data
						});
					});
					$modal.modal('hide');
				});
		}
	});
}

function getFriendsList($friends_right_list, cb){
	$.ajax({
		url: '/api/v1/users/friends?page=0&length=500',
		success: function(res){
			if (res.data.length == 0){
				$('.no-friends-block').removeClass(__C.CLASSES.HIDDEN);
				$('.friends-right-bar, .friends-main-content, .one-friend-profile').addClass(__C.CLASSES.HIDDEN);
				return;
			}
			$friends_right_list.find('.friends-list').empty();
			$friends_right_list.removeClass(__C.CLASSES.HIDDEN);
			tmpl('friend-item', res.data, $friends_right_list.find('.friends-list'));
			$friends_right_list.find('.friends-count').text(res.data.length);
			bindControllers($friends_right_list);
			if ($friends_right_list.height() > window.innerHeight - 200){
				$friends_right_list.find('.friends-list').slimscroll({
					height: window.innerHeight - 200,
					width: '100%'
				});
			}

			if (cb) cb(res);
		}
	});
}