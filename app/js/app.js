(function(window, document, $, undefined) {

	if (typeof $ === 'undefined') {
		throw new Error('This application\'s JavaScript requires jQuery');
	}

	$(function() {

		// Restore body classes
		// -----------------------------------
		var $body = $('body');

		// enable settings toggle after restore
		$('#chk-fixed').prop('checked', $body.hasClass('layout-fixed'));
		$('#chk-collapsed').prop('checked', $body.hasClass('aside-collapsed'));
		$('#chk-boxed').prop('checked', $body.hasClass('layout-boxed'));
		$('#chk-float').prop('checked', $body.hasClass('aside-float'));
		$('#chk-hover').prop('checked', $body.hasClass('aside-hover'));


	}); // doc ready


})(window, document, window.jQuery);
// Custom jQuery
// -----------------------------------

/**=========================================================
 * Module: notify.js
 * Create toggleable notifications that fade out automatically.
 * Based on Notify addon from UIKit (http://getuikit.com/docs/addons_notify.html)
 * [data-toggle="notify"]
 * [data-options="options in json format" ]
 =========================================================*/

(function($, window, document) {
	'use strict';

	var Selector = '[data-notify]',
		autoloadSelector = '[data-onload]',
		doc = $(document);


	$(function() {

		$(Selector).each(function() {

			var $this = $(this),
				onload = $this.data('onload');

			if (onload !== undefined) {
				setTimeout(function() {
					notifyNow($this);
				}, 800);
			}

			$this.on('click', function(e) {
				e.preventDefault();
				notifyNow($this);
			});

		});

	});

	function notifyNow($element) {
		var message = $element.data('message'),
			options = $element.data('options');

		if (!message)
			$.error('Notify: No message specified');

		$.notify(message, options || {});
	}


}(jQuery, window, document));


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
				for(var id in messages) {
					if (group === messages[id].group) messages[id].close(instantly);
				}
			} else {
				for(var id in messages) {
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

/**=========================================================
 * Module: utils.js
 * jQuery Utility functions library
 * adapted from the core of UIKit
 =========================================================*/

(function($, window, doc) {
	'use strict';

	var $html = $("html"), $win = $(window);

	$.support.transition = (function() {

		var transitionEnd = (function() {

			var element = doc.body || doc.documentElement,
				transEndEventNames = {
					WebkitTransition: 'webkitTransitionEnd',
					MozTransition: 'transitionend',
					OTransition: 'oTransitionEnd otransitionend',
					transition: 'transitionend'
				}, name;

			for(name in transEndEventNames) {
				if (element.style[name] !== undefined) return transEndEventNames[name];
			}
		}());

		return transitionEnd && {end: transitionEnd};
	})();

	$.support.animation = (function() {

		var animationEnd = (function() {

			var element = doc.body || doc.documentElement,
				animEndEventNames = {
					WebkitAnimation: 'webkitAnimationEnd',
					MozAnimation: 'animationend',
					OAnimation: 'oAnimationEnd oanimationend',
					animation: 'animationend'
				}, name;

			for(name in animEndEventNames) {
				if (element.style[name] !== undefined) return animEndEventNames[name];
			}
		}());

		return animationEnd && {end: animationEnd};
	})();

	$.support.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function(callback) {
			window.setTimeout(callback, 1000 / 60);
		};
	$.support.touch = (
		('ontouchstart' in window && navigator.userAgent.toLowerCase().match(/mobile|tablet/)) ||
		(window.DocumentTouch && document instanceof window.DocumentTouch) ||
		(window.navigator['msPointerEnabled'] && window.navigator['msMaxTouchPoints'] > 0) || //IE 10
		(window.navigator['pointerEnabled'] && window.navigator['maxTouchPoints'] > 0) || //IE >=11
		false
	);
	$.support.mutationobserver = (window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver || null);

	$.Utils = {};

	$.Utils.debounce = function(func, wait, immediate) {
		var timeout;
		return function() {
			var context = this, args = arguments;
			var later = function() {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	};

	$.Utils.removeCssRules = function(selectorRegEx) {
		var idx, idxs, stylesheet, _i, _j, _k, _len, _len1, _len2, _ref;

		if (!selectorRegEx) return;

		setTimeout(function() {
			try {
				_ref = document.styleSheets;
				for(_i = 0, _len = _ref.length; _i < _len; _i++) {
					stylesheet = _ref[_i];
					idxs = [];
					stylesheet.cssRules = stylesheet.cssRules;
					for(idx = _j = 0, _len1 = stylesheet.cssRules.length; _j < _len1; idx = ++_j) {
						if (stylesheet.cssRules[idx].type === CSSRule.STYLE_RULE && selectorRegEx.test(stylesheet.cssRules[idx].selectorText)) {
							idxs.unshift(idx);
						}
					}
					for(_k = 0, _len2 = idxs.length; _k < _len2; _k++) {
						stylesheet.deleteRule(idxs[_k]);
					}
				}
			} catch(_error) {
			}
		}, 0);
	};

	$.Utils.isInView = function(element, options) {

		var $element = $(element);

		if (!$element.is(':visible')) {
			return false;
		}

		var window_left = $win.scrollLeft(),
			window_top = $win.scrollTop(),
			offset = $element.offset(),
			left = offset.left,
			top = offset.top;

		options = $.extend({topoffset: 0, leftoffset: 0}, options);

		if (top + $element.height() >= window_top && top - options.topoffset <= window_top + $win.height() &&
			left + $element.width() >= window_left && left - options.leftoffset <= window_left + $win.width()) {
			return true;
		} else {
			return false;
		}
	};

	$.Utils.options = function(string) {

		if ($.isPlainObject(string)) return string;

		var start = (string ? string.indexOf("{") : -1), options = {};

		if (start != -1) {
			try {
				options = (new Function("", "var json = " + string.substr(start) + "; return JSON.parse(JSON.stringify(json));"))();
			} catch(e) {
			}
		}

		return options;
	};

	$.Utils.events = {};
	$.Utils.events.click = $.support.touch ? 'tap' : 'click';

	$.langdirection = $html.attr("dir") == "rtl" ? "right" : "left";

	$(function() {

		// Check for dom modifications
		if (!$.support.mutationobserver) return;

		// Install an observer for custom needs of dom changes
		var observer = new $.support.mutationobserver($.Utils.debounce(function(mutations) {
			$(doc).trigger("domready");
		}, 300));

		// pass in the target node, as well as the observer options
		observer.observe(document.body, {childList: true, subtree: true});

	});

	// add touch identifier class
	$html.addClass($.support.touch ? "touch" : "no-touch");

}(jQuery, window, document));


/**===========================================================
 * Templates for jQuery
 * */
function tmpl(template_type, items, addTo, direction) {

	var htmlEntities = function(str) {
			return String(str + '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
		},
		replaceTags = function(html, object) {
			$.each(object, function(key, value) {
				var key_expr = new RegExp('{' + key + '}', 'gim');
				if ($.type(value) == 'string') {
					value = htmlEntities(value);
				} else if (value instanceof jQuery) {
					var _value = [];
					value.each(function() {
						"use strict";
						_value.push(this.outerHTML);
					});
					value = _value.join('');
				} else if (value == null) {
					value = '';
				}
				html = html ? html.replace(key_expr, value) : '';
			});
			var not_handled_keys = new RegExp(/\{.*?\}/gim);
			html = html ? html.replace(not_handled_keys, '') : '';
			return html;
		},

		result = '',
		html_val = (typeof template_type == 'object') ? template_type.tmpl : $('#tmpl-' + template_type).html(), //Р”РѕР±Р°РІР»СЏСЋ РІРѕР·РјРѕР¶РЅРѕСЃС‚СЊ РїРµСЂРµРґР°С‡Сѓ СЃСЂР°Р·Сѓ С‚РµР»Р° С€Р°Р±Р»РѕРЅР°, Р° РЅРµ СЃРµР»РµРєС‚РѕСЂР°
		comments = new RegExp(/(?:\/\*(?:[\s\S]*?)\*\/)|(?:([\s;])+\/\/(?:.*)$)/gim),
		spaces = new RegExp('\\s{2,}', 'igm');
	if (html_val === undefined || items === undefined) {
		console.group('tmpl_error');
		console.log('error in ' + template_type);
		console.log('items', items);
		console.log('addTo', addTo);
		console.log('html_val', html_val);
		console.log('inputs', {template_type: template_type, items: items, addTo: addTo, direction: direction});
		console.groupEnd();
	}
	html_val = html_val ? html_val.replace(comments, '') : '';
	html_val = html_val ? html_val.replace(spaces, '').trim() : '';
	if (Array.isArray(items)) {
		var i, items_length = items.length;
		for(i = 0; i < items_length; i++) {
			result += replaceTags(html_val, items[i]);
		}
	} else {
		result = replaceTags(html_val, items);
	}
	result = $(result);
	if (addTo == null || addTo == undefined) {
		return result;
	}
	if (direction == 'prepend') {
		addTo.prepend(result);
	} else {
		addTo.append(result);
	}
	return result;
}

/**===========================================================
 * Query search part to object
 * */
if (window['moment'] != undefined) {
	moment.locale(navigator.language);
}

/**
 * Возвращает единицу измерения с правильным окончанием
 *
 * @param {Number} num      Число
 * @param {Object} cases    Варианты слова {nom: 'час', gen: 'часа', plu: 'часов'}
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

function searchToObject() {
	var pairs = window.location.search.substring(1).split("&"),
		obj = {},
		pair,
		i;

	for(i in pairs) {
		if (pairs.hasOwnProperty(i)) {
			if (pairs[i] === "") continue;

			pair = pairs[i].split("=");
			obj[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
		}
	}

	return obj;
}

function hashToObject() {
	var pairs = window.location.hash.substring(1).split("&"),
		obj = {},
		pair,
		i;
	for(i in pairs) {
		if (pairs.hasOwnProperty(i)) {
			if (pairs[i] === '') continue;

			pair = pairs[i].split("=");
			obj[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
		}
	}
	return obj;
}

window.socket = io.connect(window.location.protocol== 'https:' ? ':8443' : ':8080', {secure: window.location.protocol == 'https:'});


socket.on('connect', function() {
	$.ajax({
		url: 'api/v1/me/devices',
		type: 'PUT',
		data: {
			device_token: socket.id,
			client_type: 'browser'
		},
		success: function(res) {
			if (res.status) {
				socket.emit('session.set', res.data.token);
			}
		}
	});
});


socket.on('auth', function(data) {
	console.log(data);
	$.ajax({
		url: 'auth.php',
		type: 'POST',
		data: data,
		success: function(res) {

			if (yaCounter32442130) {
				switch(data.type) {
					case 'vk':
					{
						yaCounter32442130.reachGoal('VkAuthDone');
						break;
					}
					case 'facebook':
					{
						yaCounter32442130.reachGoal('FacebookAuthDone');
						break;
					}
					case 'google':
					{
						yaCounter32442130.reachGoal('GoogleAuthDone');
						break;
					}
				}
			}

			if (res.status) {
				if (data.hasOwnProperty('mobile') && data.mobile == true) {
					window.location.href = '/mobileAuthDone.php?token=' + data.token + '&email=' + data.email;
				} else {
					if (window.localStorage.getItem('open_add_organization') == 'true'){
						window.parent.location = 'add_organization';
					}else if (data.subscriptions_count == 0){
						window.parent.location = 'onboarding';
					}else{
						window.parent.location =  'feed';
					}
				}
			} else {
				$('.panel-body.loader-demo').text(res.text);
				$('.panel-heading').hide();
			}
		}
	});
});

socket.on('log', function(data) {
	console.log(data);
});

socket.on('error.retry', function() {
	$('.panel-body.loader-demo').text('Во время загрузки данных произошла ошибка. Войдите с помощью другой социальной сети или попробуте чуть позже.');
	$('.panel-heading').hide();
});

socket.on('notification', function(data) {
	if (!Notify.needsPermission) {
		socket.emit('notification.received', {
			notification_id: data.notification_id
		});
		var myNotification = new Notify(data.note.payload.title, {
				body: data.note.body,
				icon: data.note.icon,
				tag: data.note.payload.event_id,
				timeout: 60,
				notifyClick: function() {
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

Function.prototype.extend = function(parent) {
	var F = function(){};
	F.prototype = parent.prototype;
	this.prototype = new F();
	this.prototype.constructor = this;
	this.prototype.__super = parent.prototype;
	this.prototype.__superCall = function(method_name){
		if(parent.prototype[method_name] && typeof parent.prototype[method_name] == 'function'){
			return parent.prototype[method_name].call(this, Array.prototype.slice.call(1,arguments));
		} else {
			console.error('There is no "'+method_name+'" method in object "'+parent.prototype.constructor.name+'"');
		}
	};
};

$(document).ready(function() {
	window.paceOptions = {
		ajax: false, // disabled
		document: false, // disabled
		eventLag: false, // disabled
		elements: {},
		search_is_active: false,
		search_query: null,
		search_xhr: null
	};
	window.__C = {
		TEXTS: {
			REMOVE_FAVORITE: 'Удалить из избранного',
			ADD_FAVORITE: 'В избранное',
			SUBSCRIBERS: {
				NOM: ' подписчик',
				GEN: ' подписчика',
				PLU: ' подписчиков'
			},
			FAVORED: {
				NOM: ' участник',
				GEN: ' участника',
				PLU: ' участников'
			},
			ADD_SUBSCRIPTION: 'Подписаться',
			REMOVE_SUBSCRIPTION: 'Отписаться'
		},
		DATA_NAMES: {
			DATE: 'date'
		},
		CLASSES: {
			ACTIVE: 'active',
			NEW_ACTIVE: '-active',
			NO_BORDERS: 'no-borders',
			SUBSCRIBE_ADD: 'btn-pink-empty',
			SUBSCRIBE_DELETE: 'btn-pink',
			DISABLED: 'disabled',
			NEW_DISABLED: '-disabled',
			HIDDEN: 'hidden',
			NEW_HIDDEN: '-hidden'
		},
		DATE_FORMAT: 'YYYY-MM-DD',
		IMAGES_PATH: '/events_images',
		STATS: {
			EVENT_VIEW: 'view',
			EVENT_VIEW_DETAIL: 'view_detail',
			EVENT_OPEN_SITE: 'open_site',
			EVENT_OPEN_MAP: 'open_map',
			ORGANIZATION_OPEN_SITE: 'open_site',
			EVENT_ENTITY: 'event',
			ORGANIZATION_ENTITY: 'organization'
		},
		ACTION_NAMES: {
			fave: ['добавил(а) в избранное'],
			unfave: ['удалил(а) из избранного'],
			subscribe: ['добавил(а) подписки'],
			unsubscribe: ['удалил(а) подписки']
		},
		ENTITIES: {
			EVENT: 'event',
			ORGANIZATION: 'organization'
		},
		URL_FIELDS: {
			EVENTS: {
				fields: [
					'detail_info_url',
					'is_favorite',
					'nearest_event_date',
					'can_edit',
					'location',
					'favored_users_count',
					'organization_name',
					'organization_logo_small_url',
					'description',
					'favored',
					'is_same_time',
					'tags',
					'dates{"fields": "event_date,start_time,end_time", "order_by": "event_date,start_time"}'
				].join(','),
				length: 10
			}
		}
	};
	window.__stats = [];

	window.storeStat = function(entity_id, entity_type, event_type) {
		window.__stats.push({
			entity_id: entity_id,
			entity_type: entity_type,
			event_type: event_type
		});
	};

	setInterval(function() {
		if (window.__stats.length != 0) {
			var batch = window.__stats;
			window.__stats = [];
			$.ajax({
				url: '/api/v1/statistics/batch',
				data: JSON.stringify(batch),
				type: 'POST',
				contentType: 'application/json; charset=utf-8',
				dataType: 'json',
				error: function() {
					window.__stats.concat(batch);
				}
			});
		}
	}, 5000);
});

function isNotDesktop() {
	var check = false;
	(function(a) {
		if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))check = true
	})(navigator.userAgent || navigator.vendor || window.opera);
	return check;
}