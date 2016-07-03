String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
};
String.prototype.contains = function(it) {return this.indexOf(it) != -1;};
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
	}
});

function SubscribeButton($btn, options){
	var self = this;
	this.$btn = $btn;
	this.is_organization = self.$btn.data('organization-id') ? true : false;
	this.id = this.is_organization ? self.$btn.data('organization-id') : self.$btn.data('event-id');
	this.labels = {
		subscribe: 'Подписаться',
		unsubscribe: 'Отписаться',
		subscribed: 'Подписан'
	};
	this.icons = {
		subscribe: 'fa-plus',
		unsubscribe: 'fa-times',
		subscribed: 'fa-check'
	};
	this.colors = {
		subscribe: '-color_neutral_accent',
		unsubscribe: '-color_accent',
		subscribed: '-color_accent'
	};

	if(typeof options != 'undefined'){
		this.labels = typeof options.labels != 'undefined' ? $.extend(this.labels, options.labels) : this.labels;
		this.icons = typeof options.icons != 'undefined' ? $.extend(this.icons, options.icons) : this.icons;
		this.colors = typeof options.colors != 'undefined' ? $.extend(this.colors, options.colors) : this.colors;
	}

	this.$btn.bindHoverEvents = function(){
		self.$btn
			.off('mouseenter.hoverSubscribed mouseleave.hoverSubscribed')
			.on('mouseenter.hoverSubscribed', function(){
				self.$btn.removeClass([self.icons.subscribed, self.colors.subscribed].join(' ')).addClass([self.icons.unsubscribe, self.colors.unsubscribe].join(' '));
				self.$btn.children('.Text').text(self.labels.unsubscribe);
			})
			.on('mouseleave.hoverSubscribed', function(){
				self.$btn.removeClass([self.icons.unsubscribe, self.colors.unsubscribe].join(' ')).addClass([self.icons.subscribed, self.colors.subscribed].join(' '));
				self.$btn.children('.Text').text(self.labels.subscribed);
			});
		return self.$btn;
	};

	if(this.$btn.hasClass('-Subscribed')){
		this.$btn.bindHoverEvents();
	}

	if(!this.$btn.children('span').length){
		this.$btn.wrapInner('<span class="Text">');
	}

	this.$btn.on('click.subscribe', function(){
		var method,
			url = self.is_organization ? '/api/v1/organizations/'+self.id+'/subscriptions' : '/api/v1/events/'+self.id+'/favorites';
		if(self.$btn.hasClass('-Subscribed')){
			method = 'DELETE';
			self.$btn
				.removeClass(['-Subscribed', self.colors.unsubscribe, self.colors.subscribed, self.icons.unsubscribe, self.icons.subscribed].join(' '))
				.addClass([self.colors.subscribe, self.icons.subscribe].join(' '))
				.off('mouseenter.hoverSubscribed mouseleave.hoverSubscribed')
				.children('.Text').text(self.labels.subscribe);
		} else {
			method = 'POST';
			self.$btn
				.removeClass([self.colors.subscribe, self.colors.subscribed, self.icons.subscribe, self.icons.subscribed].join(' '))
				.addClass(['-Subscribed', self.colors.unsubscribe, self.icons.unsubscribe].join(' '))
				.bindHoverEvents()
				.children('.Text').text(self.labels.unsubscribe);
		}

		$.ajax({
			url: url,
			method: method,
			success: function(res){
				ajaxHandler(res, function(data, text){
					if(self.is_organization){
						method == 'POST' ? renderSidebarOrganizations(self.id, bindControllers) : hideSidebarOrganization(self.id);
					}
				}, ajaxErrorHandler)
			}
		});

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

function buildAvatarCollection(subscribers, count){
	var $subscribers = $();
	$subscribers = $subscribers.add(tmpl('subscriber-avatar', __USER));
	subscribers.forEach(function(subscriber){
		if(subscriber.id != __USER.id && $subscribers.length <= count){
			$subscribers = $subscribers.add(tmpl('subscriber-avatar', subscriber));
		}
	});
	return $subscribers;
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
			$tabs.removeClass(__C.CLASSES.NEW_ACTIVE);
			$bodies.removeClass(__C.CLASSES.NEW_ACTIVE);
			$(this).addClass(__C.CLASSES.NEW_ACTIVE);
			$bodies.eq($tabs.index(this)).addClass(__C.CLASSES.NEW_ACTIVE);
			$wrapper.height($bodies.filter('.-active').height());
			$this.trigger('change.tabs');
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

		if($collection.data('max_subscribers') >= amount){
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
			switch(e.which){
				case 1: {
					if ($this.hasClass(__C.CLASSES.DISABLED)) return true;
					if (page_name != undefined){
						History.pushState($this.data(), $this.data('title') ? $this.data('title'): $this.text(), '/'+page_name);
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
			if(length > max){
				$form_unit.addClass('-status_error');
			} else if($form_unit.hasClass('-status_error')) {
				$form_unit.removeClass('-status_error');
			}
			$prompt.text($this.val().length+'/'+max);
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




function setDaysWithEvents(calendar){
	var $calendar = calendar.$calendar,
		m_selected_month = moment(calendar.selected_days[0]);
	$.ajax({
		url: '/api/v1/events/dates',
		data: {
			since: m_selected_month.startOf('month').format(__C.DATE_FORMAT),
			till: m_selected_month.endOf('month').format(__C.DATE_FORMAT),
			offset: 0,
			length: 500,
			my: true,
			unique: true
		},
		success: function(res){
			$calendar.find('.feed_calendar_td').removeClass('Controller has_favorites').addClass(__C.CLASSES.NEW_DISABLED);
			res.data.forEach(function(day){
				$('.Day_' + moment.unix(day.event_date).format(__C.DATE_FORMAT))
					.data('page', 'feed')
					.addClass('Controller')
					.addClass(day.favorites_count > 0 ? 'has_favorites' : '')
					.removeClass(__C.CLASSES.NEW_DISABLED);
			});

			bindControllers($calendar);
		}
	});
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
				data: {fields: 'new_events_count'},
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
			data: {fields: 'new_events_count'},
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
	var $wrapper = $('#main_header_bottom').find('.HeaderTabsWrapper'),
		$tabs = $();
	tabs.forEach(function(tab){
		if(tab.dataset)
			tab.dataset.toString = (Array.isArray(tab.dataset)) ? arrayToSpaceSeparatedString : objectToHtmlDataSet;
		if(tab.classes)
			tab.classes.toString = arrayToSpaceSeparatedString;
		$tabs = $tabs.add(tmpl('tab', tab))
	});
	$wrapper.html(tmpl('tabs-header', {
		color: 'default',
		tabs: $tabs
	}));
	bindControllers($wrapper);
	$('#main_header').addClass('-with_tabs');
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

function calculateMargins($view){
	var $main_content = $view.find('.friends-main-content'),
		$friends_right_list = $view.find('.friends-right-bar'),
		$user_content = $view.find('.one-friend-main-content'),
		view_width = $view.width(),
		content_width = $main_content.width() == 0 ? $user_content.width() : $main_content.width(),
		friends_right_list_width = $friends_right_list.width(),
		DISTANCE_BETWEEN = 150,
		_margin = (view_width - content_width - friends_right_list_width - DISTANCE_BETWEEN) / 2;

	$main_content.css('margin-left', _margin + 'px');
	$friends_right_list.css('margin-left', _margin + content_width + DISTANCE_BETWEEN + 'px');
	$user_content.css('margin-left', _margin + 'px');
}

/**
 * Нажатие на кнопку подписаться/отписаться
 * @param state
 * @param entity_id ID подписки или ID организации в зависимости от типа совершаемого события
 * @param callback
 */
function toggleSubscriptionState(state, entity_id, callback){
	var options = (state == false) ? {
			url: '/api/v1/organizations/' + entity_id + '/subscriptions',
			type: 'DELETE'
		} : {
			url: '/api/v1/organizations/' + entity_id + '/subscriptions',
			type: 'POST'
		};
	$.ajax(options);
}


function getTagsString(tags){
	var _tags = [];
	if (tags instanceof Array == false) return null;
	tags.forEach(function(tag){
		_tags.push(tag.name);
	});
	return _tags.join(', ');
}

function bindEventHandlers(){

	var $view = $('.screen-view:not(.hidden)');
	$view.find('.tl-part:not(.tl-header)').each(function(){
		var $this = $(this);
		$this.height($view.find('.event-' + $this.data('event-id') + '-' + $this.data(__C.DATA_NAMES.DATE)).outerHeight());
	});

	$view.find('.more-info-btn').off('click').on('click', function(){
		var $panel_block = $(this).parents('.tl-panel-block'),
			$panel_wrapper = $panel_block.find('.tl-event-wrapper'),
			event_id = $panel_block.data('event-id');

		if($panel_block.hasClass('closed')){
			$panel_block.removeClass('closed');
			$panel_block.animate({height: $panel_wrapper.height() + 30}, 500, "easeOutBack", function(){
				$panel_block.addClass('opened');
				after();
			});
		} else {
			$panel_block.removeClass('opened').addClass('closed').animate({height: $panel_wrapper.height() + 30}, 500, "easeInBack", after);
		}
		function after(){
			$view.find('.timeline-' + $panel_block.data('event-id') + '-' + $panel_block.data(__C.DATA_NAMES.DATE))
				.animate({height: $panel_block.outerHeight()}, 500);

			storeStat(event_id, __C.STATS.EVENT_ENTITY, __C.STATS.EVENT_VIEW_DETAIL);
		}
	});

	$view.find('.add-to-favorites').on('click', function(){
		var $btn = $(this);

		var $liked_count = $btn.parents('.tl-panel-block').find('.liked-users-count-number'),
			$liked_count_text = $btn.parents('.tl-panel-block').find('.liked-users-count-text'),
			_event_id = $btn.data('event-id'),
			_date = $btn.parents('.tl-panel-block').data(__C.DATA_NAMES.DATE),
			params = {
				url: '/api/v1/events/' + _event_id + '/favorites/',
				type: 'POST'
			};

		$btn.toggleClass(__C.CLASSES.NO_BORDERS);
		$btn.text($btn.hasClass(__C.CLASSES.NO_BORDERS) ? __C.TEXTS.REMOVE_FAVORITE : __C.TEXTS.ADD_FAVORITE);
		$view.find('.timeline-' + _event_id + '-' + _date).toggleClass(__C.CLASSES.ACTIVE);

		var new_count;
		if (!$btn.hasClass(__C.CLASSES.NO_BORDERS)) {
			params.type = 'DELETE';
			params.url = '/api/v1/events/' + $btn.data('event-id') + '/favorites/';
			new_count = parseInt($liked_count.text()) - 1;
			$liked_count.text(new_count);
		} else {
			new_count = parseInt($liked_count.text()) + 1;
			$liked_count.text(new_count);
		}
		$liked_count_text.text(getUnitsText(new_count, __C.TEXTS.FAVORED));
	});

	$view.find('.likes-block').on('click', function(){
		var $this = $(this),
			$event = $this.parents('.tl-panel-block'),
			$all_friends = $('.friends-event-' + $event.data('event-id'));

		if ($all_friends.hasClass('open')){
			$all_friends
				.removeClass('open')
				.addClass('hidden')
				.remove();
		}else{
			$all_friends.remove();
			$all_friends = $event.data('friends');
			if ($all_friends.find('li').length == 0) return;

			$all_friends
				.removeClass('hidden')
				.addClass('open')
				.css({
					top: $this.offset().top + $this.height() + 'px',
					left: $this.find('.user-img-wrapper:first').offset().left - $this.width() + 'px'
				})
				.prependTo($event.parent().addClass('open'));
		}
	});

	$view.find('.social-links i').on('click', function(){
		var $this = $(this),
			$block = $this.parents('.tl-panel-block'),
			_type = $this.data('share-type');
		window.open($block.data('share')[_type], 'SHARE_WINDOW',
			'status=1,toolbar=0,menubar=0&height=300,width=500');
	});

	$view.find('.event-hide-button').on('click', function(){
		var $panel_block = $(this).parents('.tl-panel-block'),
			event = {id: $panel_block.data('event-id'), date: $panel_block.data(__C.DATA_NAMES.DATE)},
			$placeholder = tmpl('removed-event-placeholder', event);

		$panel_block.css({overflow: 'hidden'}).animate({height: 100, opacity: 0}, 300, "easeInBack", function(){
			$panel_block.hide().after($placeholder);
			$placeholder.find('.btn-cancel-remove').one('click', undoRemoveEvent);
		});
		$view.find('.timeline-' + $panel_block.data('event-id') + '-' + $panel_block.data(__C.DATA_NAMES.DATE))
			.animate({height: 100}, 300, "easeInBack");

		$.ajax({
			url: '/api/v1/events/' + event.id + '/status?hidden=1',
			type: 'PUT'
		});
	});

	$view.find('.external-link').on('click', function(){
		var $panel_block = $(this).parents('.tl-panel-block'),
			event_id = $panel_block.data('event-id');
		storeStat(event_id, __C.STATS.EVENT_ENTITY, __C.STATS.EVENT_OPEN_SITE);
	});

	function undoRemoveEvent(e){
		var $this = $(e.target),
			$placeholder = $this.parents('.tl-panel-block-placeholder'),
			event_id = $placeholder.data('event-id'),
			event_date = $placeholder.data('date'),
			$panel_block = $view.find('.event-' + event_id + '-' + event_date),
			$panel_wrapper = $panel_block.find('.tl-event-wrapper'),
			$tl_block = $view.find('.timeline-' + event_id + '-' + event_date);

		$placeholder.remove();
		$panel_block.show();
		$tl_block.animate({height: $panel_wrapper.height() + 30}, 300, "easeOutBack");
		$panel_block.animate({height: $panel_wrapper.height() + 30, opacity: 1}, 300, "easeOutBack", function(){
			$panel_block.css({overflow: 'visible'});
		});
		$.ajax({
			url: '/api/v1/events/' + event_id + '/status?hidden=0',
			type: 'PUT'
		});

	}
}

function generateEventAttributes(event){

	var dates = [],
		is_dates_range = event.is_same_time;
	event.dates.forEach(function(event_day, index){
		var _date = moment.unix(event_day.event_date);
		dates.push({
			start_date: moment(_date.format(__C.DATE_FORMAT) + ' ' + event_day.start_time),
			end_date: moment(_date.format(__C.DATE_FORMAT) + ' ' + event_day.end_time)
		});
	});

	event.moment_dates = dates;
	event.liked_users_count = event.favored_users_count;
	event.tags_text = getTagsString(event.tags);

	event.begin_time = dates[0].start_date.format('HH:mm');
	event.tags_block = $('<div>');

	event.tags.forEach(function(tag){
		event.tags_block.append(tmpl('event-tag', tag));
	});

	event.one_day = event.dates.length == 1;
	event.short_dates = [];
	event.dates = [];
	var date_format = event.dates.length == 1 ? 'DD MMMM' : 'DD/MM';
	event.moment_dates.forEach(function(val){
		event.dates.push(val.start_date.format(date_format) + ' ' + val.start_date.format('HH:mm') + ' - ' + val.end_date.format('HH:mm'));
		event.short_dates.push(val.start_date.format('DD/MM'));
	});
	if (is_dates_range){
		if (event.dates.length > 1){
			event.dates = '' + event.moment_dates[0].start_date.format('DD/MM') + ' - ' + event.moment_dates[event.moment_dates.length - 1].start_date.format('DD/MM');
			event.dates += "\n" + ' c ' + event.moment_dates[0].start_date.format('HH:mm') + ' до ' + event.moment_dates[0].end_date.format('HH:mm');
			event.short_dates = event.dates;
		}else{
			event.dates = event.moment_dates[0].start_date.format('DD/MM');
			event.dates += "\n" + ' c ' + event.moment_dates[0].start_date.format('HH:mm') + ' до ' + event.moment_dates[0].end_date.format('HH:mm');
			event.short_dates = event.dates;
		}
	}else{
		event.dates = event.dates.join(', ') ;
		event.short_dates = event.short_dates.join(', ') ;
	}
	event.day_name = dates[0].start_date.format('dddd');


	var _a = document.createElement('a'),
		_url = event.detail_info_url;

	_a.href = event.detail_info_url;


	event.detail_info_url = _url;
	event.can_edit_hidden = event.can_edit != 1 ? 'hidden':'';

	event.friends = $('<div>').addClass("liked-users");
	event.all_friends = tmpl('liked-dropdown-wrapper', {event_id: event.id});

	var short_friends_count = 0;
	if (event.favored != undefined){
		event.favored.forEach(function(user){
			if (short_friends_count++ < 5){
				event.friends.append(tmpl('liked-user', user));
			}
			event.all_friends.append(tmpl('liked-dropdown-item', user))
		})
	}

	event.organization_img_url = event.organization_logo_small_url;
	event.favorite_btn_class = event.is_favorite ? __C.CLASSES.NO_BORDERS : '';
	event.favorite_btn_text = event.is_favorite ? __C.TEXTS.REMOVE_FAVORITE : __C.TEXTS.ADD_FAVORITE;
	event.timeline_favorite_class = event.is_favorite ? __C.CLASSES.ACTIVE : '';
	event.favored_text = getUnitsText(event.favored_users_count, __C.TEXTS.FAVORED);
	return event;
}