(function (window, document, $, undefined) {

    if (typeof $ === 'undefined') {
        throw new Error('This application\'s JavaScript requires jQuery');
    }

    $(function () {

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

$.fn.extend({
    toggleStatus: function (statuses) {
        var $this = this;

        if ($this.is('.form_unit')) {
            statuses.split(' ').forEach(function (status) {
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
        } else {
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
    serializeForm: function (output_type) {
        var zb = /^(?:input|select|textarea|keygen)/i,
            yb = /^(?:submit|button|image|reset|file)$/i,
            T = /^(?:checkbox|radio)$/i,
            xb = /\r?\n/g,
            elements = this.map(function () {
                var a = $.prop(this, "elements");
                return a ? $.makeArray(a) : this
            });

        switch (output_type) {
            case 'array': {
                /* Работает так же как и serializeArray, с некоторыми модификациями */
                return elements.filter(function () {
                    var a = this.type;
                    return this.name
                        && !$(this).is(":disabled")
                        && zb.test(this.nodeName)
                        && !yb.test(a)
                        && ((this.checked && this.value != "on") || a != "radio")
                        && ((this.checked && this.value != "on") || this.value == "on" || a != "checkbox")
                }).map(function (a, b) {
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
                elements.filter(function () {
                    var a = this.type;
                    return this.name && !$(this).is(':disabled') && zb.test(this.nodeName) && !yb.test(a) && !T.test(a)
                }).each(function (i, el) {
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
                elements.filter(function () {
                    var a = this.type;
                    return this.name && !$(this).is(":disabled") && T.test(a) && ((this.checked && this.value != "on") || (this.value == "on" && a == "checkbox"))
                }).each(function (i, el) {
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

jQuery.makeSet = function (array) {
    return $($.map(array, function (el) {
        return el.get();
    }));
};

/**=========================================================
 * Module: notify.js
 * Create toggleable notifications that fade out automatically.
 * Based on Notify addon from UIKit (http://getuikit.com/docs/addons_notify.html)
 * [data-toggle="notify"]
 * [data-options="options in json format" ]
 =========================================================*/
(function ($, window, document) {
    'use strict';

    var Selector = '[data-notify]',
        autoloadSelector = '[data-onload]',
        doc = $(document);


    $(function () {

        $(Selector).each(function () {

            var $this = $(this),
                onload = $this.data('onload');

            if (onload !== undefined) {
                setTimeout(function () {
                    notifyNow($this);
                }, 800);
            }

            $this.on('click', function (e) {
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
(function ($, window, document) {

    var containers = {},
        messages = {},

        notify = function (options) {

            if ($.type(options) == 'string') {
                options = {message: options};
            }

            if (arguments[1]) {
                options = $.extend(options, $.type(arguments[1]) == 'string' ? {status: arguments[1]} : arguments[1]);
            }

            return (new Message(options)).show();
        },
        closeAll = function (group, instantly) {
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

    var Message = function (options) {

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
            containers[this.options.pos] = $('<div class="uk-notify uk-notify-' + this.options.pos + '"></div>').appendTo('body').on("click", ".uk-notify-message", function () {
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

        show: function () {

            if (this.element.is(":visible")) return;

            var $this = this;

            containers[this.options.pos].show().prepend(this.element);

            var marginbottom = parseInt(this.element.css("margin-bottom"), 10);

            this.element.css({
                "opacity": 0,
                "margin-top": -1 * this.element.outerHeight(),
                "margin-bottom": 0
            }).animate({"opacity": 1, "margin-top": 0, "margin-bottom": marginbottom}, function () {

                if ($this.options.timeout) {

                    var closefn = function () {
                        $this.close();
                    };

                    $this.timeout = setTimeout(closefn, $this.options.timeout);

                    $this.element.hover(
                        function () {
                            clearTimeout($this.timeout);
                        },
                        function () {
                            $this.timeout = setTimeout(closefn, $this.options.timeout);
                        }
                    );
                }

            });

            return this;
        },

        close: function (instantly) {

            var $this = this,
                finalize = function () {
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
                }, function () {
                    finalize();
                });
            }
        },

        content: function (html) {

            var container = this.element.find(">div");

            if (!html) {
                return container.html();
            }

            container.html(html);

            return this;
        },

        status: function (status) {

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
(function ($, window, doc) {
    'use strict';

    var $html = $("html"), $win = $(window);

    $.support.transition = (function () {

        var transitionEnd = (function () {

            var element = doc.body || doc.documentElement,
                transEndEventNames = {
                    WebkitTransition: 'webkitTransitionEnd',
                    MozTransition: 'transitionend',
                    OTransition: 'oTransitionEnd otransitionend',
                    transition: 'transitionend'
                }, name;

            for (name in transEndEventNames) {
                if (element.style[name] !== undefined) return transEndEventNames[name];
            }
        }());

        return transitionEnd && {end: transitionEnd};
    })();

    $.support.animation = (function () {

        var animationEnd = (function () {

            var element = doc.body || doc.documentElement,
                animEndEventNames = {
                    WebkitAnimation: 'webkitAnimationEnd',
                    MozAnimation: 'animationend',
                    OAnimation: 'oAnimationEnd oanimationend',
                    animation: 'animationend'
                }, name;

            for (name in animEndEventNames) {
                if (element.style[name] !== undefined) return animEndEventNames[name];
            }
        }());

        return animationEnd && {end: animationEnd};
    })();

    $.support.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function (callback) {
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

    $.Utils.debounce = function (func, wait, immediate) {
        var timeout;
        return function () {
            var context = this, args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    $.Utils.removeCssRules = function (selectorRegEx) {
        var idx, idxs, stylesheet, _i, _j, _k, _len, _len1, _len2, _ref;

        if (!selectorRegEx) return;

        setTimeout(function () {
            try {
                _ref = document.styleSheets;
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    stylesheet = _ref[_i];
                    idxs = [];
                    stylesheet.cssRules = stylesheet.cssRules;
                    for (idx = _j = 0, _len1 = stylesheet.cssRules.length; _j < _len1; idx = ++_j) {
                        if (stylesheet.cssRules[idx].type === CSSRule.STYLE_RULE && selectorRegEx.test(stylesheet.cssRules[idx].selectorText)) {
                            idxs.unshift(idx);
                        }
                    }
                    for (_k = 0, _len2 = idxs.length; _k < _len2; _k++) {
                        stylesheet.deleteRule(idxs[_k]);
                    }
                }
            } catch (_error) {
            }
        }, 0);
    };

    $.Utils.isInView = function (element, options) {

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

    $.Utils.options = function (string) {

        if ($.isPlainObject(string)) return string;

        var start = (string ? string.indexOf("{") : -1), options = {};

        if (start != -1) {
            try {
                options = (new Function("", "var json = " + string.substr(start) + "; return JSON.parse(JSON.stringify(json));"))();
            } catch (e) {
            }
        }

        return options;
    };

    $.Utils.events = {};
    $.Utils.events.click = $.support.touch ? 'tap' : 'click';

    $.langdirection = $html.attr("dir") == "rtl" ? "right" : "left";

    $(function () {

        // Check for dom modifications
        if (!$.support.mutationobserver) return;

        // Install an observer for custom needs of dom changes
        var observer = new $.support.mutationobserver($.Utils.debounce(function (mutations) {
            $(doc).trigger("domready");
        }, 300));

        // pass in the target node, as well as the observer options
        observer.observe(document.body, {childList: true, subtree: true});

    });

    // add touch identifier class
    $html.addClass($.support.touch ? "touch" : "no-touch");

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
(function (window) {
    window.cookies = {
        /**
         *
         * @param {string} name
         * @return {(string|null)}
         */
        getItem: function (name) {
            if (!name) {
                return null;
            }
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
            if (!name || /^(?:expires|max\-age|path|domain|secure)$/i.test(name)) {
                return false;
            }
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
            if (!this.hasItem(name)) {
                return false;
            }
            document.cookie = encodeURIComponent(name) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (domain ? "; domain=" + domain : "") + (path ? "; path=" + path : "");
            return true;
        },
        /**
         *
         * @param {string} name
         * @return {boolean}
         */
        hasItem: function (name) {
            if (!name) {
                return false;
            }
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


function searchToObject() {
    var pairs = window.location.search.substring(1).split("&"),
        obj = {},
        pair,
        i;

    for (i in pairs) {
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
    for (i in pairs) {
        if (pairs.hasOwnProperty(i)) {
            if (pairs[i] === '') continue;

            pair = pairs[i].split("=");
            obj[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
        }
    }
    return obj;
}

if (window.location.hostname.indexOf('.test.evendate.ru') == -1) {
    window.socket = io.connect(window.location.protocol == 'https:' ? ':8443' : ':8080', {secure: window.location.protocol == 'https:'});
} else {
    window.socket = io({path: '/node/socket.io'});
}


socket.on('auth', function (data) {
    console.log(data);
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
                if (data.hasOwnProperty('mobile') && data.mobile == true) {
                    window.location.href = '/mobileAuthDone.php?token=' + data.token + '&email=' + data.email;
                } else {
                    if (cookies.hasItem('open_add_organization')) {
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

socket.on('utils.registrationSaved', function (data) {
    var _data = $('form.register-organization').serializeForm();
    _data.uuid = data.uuid;
    $('.with-register, .no-register').toggleClass('hidden');
    $('.faq-link').click();
    cookies.setItem('open_add_organization', 1, Infinity);
    window.localStorage.setItem('organization_info', JSON.stringify(_data));
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

$(document).ready(function () {
    window.paceOptions = {
        ajax: false, // disabled
        document: false, // disabled
        eventLag: false, // disabled
        elements: {},
        search_is_active: false,
        search_query: null,
        search_xhr: null
    };
    window.__stats = [];
    window.askToSubscribe = null;

    window.storeStat = function (entity_id, entity_type, event_type) {
        window.__stats.push({
            entity_id: entity_id,
            entity_type: entity_type,
            event_type: event_type
        });
    };

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


    function subscribe() {
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
    }

    var OneSignal = window.OneSignal || [];

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
                window.askToSubscribe = subscribe;
            }
        });
    });
});

function isNotDesktop() {
    var check = false;
    (function (a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
}