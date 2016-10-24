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
 * @constructor
 * @augments jQuery
 * @param {(number|string)} id
 * @param {boolean} is_subscribed
 * @param {object} options
 */
function ActionButton(id, is_subscribed, options) {
	var self = this;
	this.classes = $.extend(true, {subscribed_state: ''}, this.classes);
	this.options = $.extend(true, this.options, options);
	this.options.classes = this.options.classes ? this.options.classes : [];
	this.states.forEach(function(state) {
		self.classes[state] = [];
		self.options.icons ? self.classes[state].push(self.options.icons[state]) : false;
		self.options.colors ? self.classes[state].push(self.options.colors[state]) : false;
		self.classes[state] = self.classes[state].join(' ');
	});
	this.is_subscribed = is_subscribed;
	this.id = id;
	jQuery.fn.init.call(this, __APP.BUILD.button({
		classes: (
			self.is_subscribed ?
				self.options.classes.concat(self.classes.subscribed).concat(self.classes.subscribed_state) :
				self.options.classes.concat(self.classes.subscribe)
		).concat('fa_icon'),
		title: self.is_subscribed ? self.options.labels.subscribed : self.options.labels.subscribe
	}));
	this.initiate();
}
ActionButton.extend(jQuery);
ActionButton.prototype.states = ['subscribe', 'unsubscribe', 'subscribed'];
ActionButton.prototype.pushStack = function(elems) {
	var ret = jQuery.merge(this.get(0) == elems ? new this.constructor(this.id, this.is_subscribed, this.options) : $(), elems);
	ret.prevObject = this;
	ret.context = this.context;
	return ret;
};
ActionButton.prototype.bindHoverEffects = function() {
	var self = this;
	this
		.off('mouseenter.hoverSubscribed mouseleave.hoverSubscribed')
		.on('mouseenter.hoverSubscribed', function() {
			self.removeClass(self.classes.subscribed).addClass(self.classes.unsubscribe);
			self.children('.Text').text(self.options.labels.unsubscribe);
		})
		.on('mouseleave.hoverSubscribed', function() {
			self.removeClass(self.classes.unsubscribe).addClass(self.classes.subscribed);
			self.children('.Text').text(self.options.labels.subscribed);
		});
};
/**
 * @interface
 */
ActionButton.prototype.bindClick = function() {};
ActionButton.prototype.afterSubscribe = function() {
	this.removeClass([this.classes.subscribe, this.classes.subscribed].join(' '));
	this.addClass([this.classes.subscribed_state, this.classes.unsubscribe].join(' '));
	this.children('.Text').text(this.options.labels.unsubscribe);
	this.is_subscribed = true;
	this.bindHoverEffects();
};
ActionButton.prototype.afterUnsubscribe = function() {
	this.removeClass([this.classes.subscribed_state, this.classes.unsubscribe, this.classes.subscribed].join(' '));
	this.addClass(this.classes.subscribe);
	this.children('.Text').text(this.options.labels.subscribe);
	this.is_subscribed = false;
	this.off('mouseenter.hoverSubscribed mouseleave.hoverSubscribed');
};
ActionButton.prototype.initiate = function() {
	if (this.is_subscribed) {
		this.bindHoverEffects();
	}
	this.bindClick();
};

/**
 *
 * @constructor
 * @augments ActionButton
 * @param {(number|string)} id
 * @param {boolean} is_subscribed
 * @param {object} options
 */
function SubscribeButton(id, is_subscribed, options) {
	this.classes = {
		subscribed_state: '-Subscribed'
	};
	this.options = {
		labels: {
			subscribe: __LOCALES.ru_RU.TEXTS.BUTTON.ADD_SUBSCRIPTION,
			unsubscribe: __LOCALES.ru_RU.TEXTS.BUTTON.REMOVE_SUBSCRIPTION,
			subscribed: __LOCALES.ru_RU.TEXTS.BUTTON.SUBSCRIBED
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
	};
	ActionButton.apply(this, [id, is_subscribed, options]);
}
SubscribeButton.extend(ActionButton);
SubscribeButton.prototype.bindClick = function() {
	var self = this;
	this.on('click.subscribe', function() {
		if (self.is_subscribed) {
			__APP.USER.unsubscribeFromOrganization(self.id, function() {
				self.afterUnsubscribe();
				$(window).trigger('unsubscribe', [self.id]);
			});
		} else {
			__APP.USER.subscribeToOrganization(self.id, function() {
				self.afterSubscribe();
				$(window).trigger('subscribe', [self.id]);
			});
		}
		if (window.askToSubscribe instanceof Function) {
			window.askToSubscribe();
		}
	});
};

/**
 *
 * @constructor
 * @augments ActionButton
 * @param {(number|string)} id
 * @param {boolean} is_subscribed
 * @param {object} options
 */
function AddToFavoriteButton(id, is_subscribed, options) {
	this.classes = {
		subscribed_state: '-Favored'
	};
	this.options = {
		labels: {
			subscribe: __LOCALES.ru_RU.TEXTS.BUTTON.ADD_FAVORITE,
			unsubscribe: __LOCALES.ru_RU.TEXTS.BUTTON.REMOVE_FAVORITE,
			subscribed: __LOCALES.ru_RU.TEXTS.BUTTON.FAVORED
		},
		colors: {
			subscribe: '-color_neutral_accent',
			unsubscribe: '-color_accent',
			subscribed: '-color_accent'
		},
		icons: {
			subscribe: 'fa-star-o',
			unsubscribe: 'fa-times',
			subscribed: 'fa-star'
		}
	};
	ActionButton.apply(this, [id, is_subscribed, options]);
}
AddToFavoriteButton.extend(ActionButton);
AddToFavoriteButton.prototype.bindClick = function() {
	var self = this;
	this.on('click.subscribe', function() {
		if (self.is_subscribed) {
			OneEvent.deleteFavored(self.id, function() {
				self.afterUnsubscribe();
			});
		} else {
			OneEvent.addFavored(self.id, function() {
				self.afterSubscribe();
			});
		}
		if (window.askToSubscribe instanceof Function) {
			window.askToSubscribe();
		}
	});
};


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
		if ($collection.hasClass('-subscribed') && !$collection.hasClass('-shift')) {
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
			$wrapper = $this.find('.TabsBodyWrapper'),
			$tabs = $this.find('.Tab'),
			$bodies = $this.find('.TabsBody');
		
		if (!$tabs.filter('.-active').length) {
			$tabs.eq(0).addClass(__C.CLASSES.NEW_ACTIVE);
		}
		$bodies.removeClass(__C.CLASSES.NEW_ACTIVE).eq($tabs.index($tabs.filter('.-active'))).addClass(__C.CLASSES.NEW_ACTIVE);
		$wrapper.height($bodies.filter('.-active').height());
		
		$tabs.on('click', function() {
			if (!$(this).hasClass(__C.CLASSES.NEW_ACTIVE)) {
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
	});
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
			.addClass('animate')
			.one('animationend webkitAnimationEnd', function() {
				$ripple.removeClass('animate');
			});
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

function bindAddAvatar($parent) {
	$parent = $parent ? $parent : $('body');
	$parent.find('.AddAvatar').not('.-Handled_AddAvatar').on('click', function() {
		var $wrapper = $(this).closest('.AddAvatarWrapper'),
			$collection = $wrapper.find('.AvatarsCollection'),
			$favored_count = $wrapper.find('.FavoredCount'),
			$avatars = $collection.find('.avatar'),
			amount = $avatars.length;
		
		if ($collection.data('max_amount') >= amount) {
			if ($collection.hasClass('-subscribed')) {
				$collection.removeClass('-subscribed');
				$collection.width(amount == 1 ? 0 : ($avatars.outerWidth() * (amount - 1)) - (6 * (amount - 2)));
			} else {
				$collection.addClass('-subscribed');
				$collection.width(($avatars.outerWidth() * amount) - (6 * (amount - 1)));
			}
		} else {
			if ($favored_count.length) {
				var current_count = parseInt($favored_count.text());
				if ($collection.hasClass('-subscribed')) {
					$favored_count.text(current_count - 1);
					if (current_count - 1 <= 0) {
						$favored_count.parent().addClass('-cast');
					}
				} else {
					$favored_count.text(current_count + 1);
					$favored_count.parent().removeClass('-cast');
				}
			}
			$collection.toggleClass('-shift -subscribed');
		}
	}).addClass('-Handled_AddAvatar');
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
	$parent.find('.CollapsingButton').each(function() {
		var $button = $(this),
			$wrapper = $button.siblings('.CollapsingWrapper'),
			$content = $wrapper.children(),
			default_height = $wrapper.data('defaultHeight') < $content.height() ? $wrapper.data('defaultHeight') : $content.height();
		
		function toggleCollapsing() {
			if ($wrapper.hasClass('-opened')) {
				$wrapper.height(default_height);
				$wrapper.on('click.toggleCollapsing', toggleCollapsing);
			} else {
				$wrapper.height($content.outerHeight());
				$wrapper.off('click.toggleCollapsing');
			}
			$wrapper.toggleClass('-opened');
		}
		
		if (!$wrapper.hasClass('-opened')) {
			$wrapper.on('click.toggleCollapsing', toggleCollapsing);
			if ($wrapper.height() < default_height) {
				$wrapper.height(default_height);
			}
		}
		$button.on('click.toggleCollapsing', toggleCollapsing);
	})
}

function bindPageLinks($parent) {
	$parent = $parent ? $parent : $('body');
	$parent.find('.Link').not('.-Handled_Link').on('click.pageRender', function(e) {
		var $this = $(this);
		if ($this.hasClass(__C.CLASSES.DISABLED)) return true;
		if (e.which == 1) {
			e.preventDefault();
			__APP.changeState($this.attr('href'));
		}
	}).addClass('-Handled_Link');
}

function unbindPageLinks($parent) {
	$parent = $parent ? $parent : $('body');
	$parent.find('.Link').removeClass('-Handled_Link').off('click.pageRender');
}

/**
 * Changes form unit`s state to error
 * @param {jQuery} $unit
 */
function handleErrorField($unit) {
	if (!$unit instanceof jQuery) {
		handleErrorField($($unit));
	} else if (!$unit.is('.form_unit')) {
		handleErrorField($unit.closest('.form_unit'));
	} else {
		if (!$unit.closest('form_unit').hasClass('-status_error')) {
			var $input = $unit.find('input, select, textarea');
			$unit
				.toggleStatus('error')
				.off('input.clear_error change.clear_error')
				.one('input.clear_error change.clear_error', function() {
					$unit.off('input.clear_error change.clear_error').toggleStatus('error');
					$input.off('blur.clear_error');
				});
			$input
				.off('blur.clear_error')
				.one('blur.clear_error', function() {
					if ($(this).val() !== "") {
						$unit.trigger('input.clear_error');
					}
				});
		}
	}
}

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

function getFriendsList($friends_right_list, cb) {
	$.ajax({
		url: '/api/v1/users/friends?page=0&length=500',
		success: function(res) {
			if (res.data.length == 0) {
				$('.no-friends-block').removeClass(__C.CLASSES.HIDDEN);
				$('.friends-right-bar, .friends-main-content, .one-friend-profile').addClass(__C.CLASSES.HIDDEN);
				return;
			}
			$friends_right_list.find('.friends-list').empty();
			$friends_right_list.removeClass(__C.CLASSES.HIDDEN);
			tmpl('friend-item', res.data, $friends_right_list.find('.friends-list'));
			$friends_right_list.find('.friends-count').text(res.data.length);
			bindPageLinks($friends_right_list);
			if ($friends_right_list.height() > window.innerHeight - 200) {
				$friends_right_list.find('.friends-list').slimscroll({
					height: window.innerHeight - 200,
					width: '100%'
				});
			}
			
			if (cb) cb(res);
		}
	});
}