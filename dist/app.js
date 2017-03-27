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
        UNIVERSAL_STATES: {
            EMPTY: '-empty',
            ROUNDED: '-rounded',
            SHADOWED: '-shadowed',
            BORDERED: '-bordered',
            TRANSFORM_UPPERCASE: '-transform_uppercase'
        },
        SIZES: {
            X30: '-size_30x30',
            X40: '-size_40x40',
            X55: '-size_55x55',
            LOW: '-size_low',
            WIDE: '-size_wide',
            SMALL: '-size_small'
        },
        HOOKS: {
            RIPPLE: 'RippleEffect',
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
            PENCIL: 'fa-pencil'
        },
        ICON_CLASS: 'fa_icon'
    },
    DATE_FORMAT: 'YYYY-MM-DD',
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
    ACTION_NAMES: {
        fave: ['добавил(а) в избранное'],
        unfave: ['удалил(а) из избранного'],
        subscribe: ['добавил(а) подписки'],
        unsubscribe: ['удалил(а) подписки']
    },
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
 * @param {Function} parent
 * @param {Function} children
 * @return {Function}
 */
function extending(parent, children) {
    children.prototype = $.extend(Object.create(parent.prototype), children.prototype);
    children.prototype.constructor = children;
    Object.defineProperty(children.prototype, '__super', {
        value: parent
    });

    /**
     *
     * @param {string} name
     * @param {...*} [args]
     * @return {*}
     */
    children.prototype.uber = function uber(name, args) {
        var method;
        method = children.prototype[name];
        if (method == this[name]) {
            method = parent.prototype[name];
        }

        return method.apply(this, Array.prototype.slice.apply(arguments, [1]));
    };

    return children;
}
/**
 * Extending jQuery object
 * @param {Function} children
 * @return {Function}
 */
function extendingJQuery(children) {
    children = extending(jQuery, children);

    children.prototype.pushStack = function (elems) {
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
String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};
/**
 * Checks if string contains some substring
 * @param {(string|RegExp)} it
 * @return {boolean}
 */
String.prototype.contains = function (it) {
    return this.search(it) !== -1;
};
/**
 * Works like printf. Variables must be inside the {braces}. Returns formatted string
 * @param {object} fields
 * @return {string}
 */
String.prototype.format = function (fields) {
    return this.replace(/\{(\w+)\}/g, function (m, n) {
        return fields[n] != null ? fields[n] : '';
    });
};
/**
 * Converts {delimiter}-separated string into CamelCase
 * @param {string} [delimiter=' ']
 * @return {string}
 */
String.prototype.toCamelCase = function (delimiter) {
    return this.split(delimiter ? delimiter : ' ').map(function (part) {
        return part.capitalize();
    }).join('');
};
/**
 * Makes CamelCase to_underscore
 * @return {string}
 */
String.prototype.toUnderscore = function () {
    return (this.charAt(0).toLowerCase() + this.slice(1)).replace(/([A-Z])/g, function ($1) {
        return "_" + $1.toLowerCase();
    });
};
/**
 * Returns formatted string for fields AJAX data
 * @param {AJAXData} data
 * @return {string}
 */
String.prototype.appendAjaxData = function (data) {
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
Object.props = function (obj) {
    return Object.keys(obj).filter(function (prop) {
        return typeof obj[prop] !== 'function';
    });
};
/**
 * Returns objects` own properties
 * @param {object} obj
 * @return {object}
 */
Object.getProps = function (obj) {
    var props = {};
    $.each(obj, function (key, value) {
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
Object.methods = function (obj) {
    var methods = [];
    Object.keys(obj).forEach(function (prop) {
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
    Object.values = function (obj) {
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
Object.toHtmlDataSet = function () {
    var dataset = [], obj = this;
    Object.props(obj).forEach(function (prop) {
        dataset.push(((prop.indexOf('data-') != 0) ? 'data-' + prop : prop) + '="' + obj[prop] + '"');
    });
    return dataset.join(' ');
};
/**
 * Converts object into string of html attributes
 * @return {string}
 */
Object.toHtmlAttributes = function () {
    var attributes = [], obj = this;
    Object.props(obj).forEach(function (prop) {
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
Array.newFrom = function (original, additional_values) {
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
                        $.merge(new_array, Object.keys(arg).map(function (key) {
                            return arg[key]
                        }));
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
Array.toSpaceSeparatedString = function () {
    return this.join(' ');
};
/**
 * Cleans array from specific values. If no delete_value is passed, deletes undefined values,
 * @param {*} [delete_value]
 * @return {Array}
 */
Array.prototype.clean = function (delete_value) {
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
Array.prototype.merge = function (array) {
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
Array.prototype.contains = function (it) {
    return this.indexOf(it) !== -1;
};

if (![].includes) {
    Array.prototype.includes = function (searchElement/*, fromIndex*/) {
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
Math.roundTo = function (num, decimals) {
    var d = Math.pow(10, decimals ? decimals : 0);
    return Math.round(num * d) / d;
};


(function ($) {
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
                                output[name] = !!el.checked;
                            break;
                        }
                    }
                });
                return output;
            }
        }
    },

    animateNumber: function (options) {
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
     */
    tablesort: function (options) {
        if (!options)
            options = {};
        if (Tablesort && typeof Tablesort === 'function') {
            return Tablesort(this.get(0), options);
        } else {
            console.error('Tablesort is not defined');
        }
    },
    /**
     * Resolving instance from element
     * @memberOf jQuery#
     * @return {*}
     */
    resolveInstance: function () {
        var instance = this.data('instance');
        return instance ? instance : this;
    },
    /**
     * Getting outer HTML string from jQuery collection
     * @memberOf jQuery#
     * @return {string}
     */
    outerHTML: function () {
        var str = '';
        this.each(function (i, el) {
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
jQuery.makeSet = function (array) {
    return $($.map(array, function (el) {
        return el.get();
    }));
};


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

/**===========================================================
 * Templates for jQuery
 *
 * @param {string} template_type
 * @param {(object|Array)} [items={}]
 * @param {jQuery} [addTo]
 * @param {string} [direction="append"]
 * @returns {jQuery}
 */
function tmpl(template_type, items, addTo, direction) {
    items = items ? items : {};
    var $tmpl = $('#tmpl-' + template_type),
        wrapMap = {
            thead: [1, "<table>", "</table>"],
            col: [2, "<table><colgroup>", "</colgroup></table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            _default: [1, "<div>", "</div>"]
        },
        result = $(),
        html_val;

    wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
    wrapMap.th = wrapMap.td;

    if (!$tmpl.length) {
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
            wrap = wrapMap[( /<([\w:]+)/.exec(html) || ["", ""] )[1].toLowerCase()] || wrapMap._default,
            j = wrap[0];
        $.each(object, function (key, value) {
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

        html = $(html ? wrap[1] + html.format(keys) + wrap[2] : '');
        $.each(jQuery_pairs, function (key, value) {
            html.find('#JQ_tmpl_' + key).append(value);
            if (value.is('tr')) {
                value.parent('tbody').removeAttr('id');
            } else {
                value.unwrap();
            }
        });
        while (j--) {
            html = html.children();
        }
        return html;
    }

    html_val = $tmpl.html()
        .replace(/(?:\/\*(?:[\s\S]*?)\*\/)|(?:([\s;])+\/\/(?:.*)$)/gim, '')// comments
        .replace(/\\s{2,}|\t|\n|\r/gim, '')// spaces, tabs, new lines
        .trim();

    if (Array.isArray(items)) {
        result = $.makeSet(items.map(function (item) {
            return replaceTags(html_val, item);
        }));
    } else {
        result = replaceTags(html_val, items);
    }
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
    if (typeof cases === 'string') {
        return cases;
    }
    switch (gender) {
        default:
        case OneUser.GENDER.MALE:
            return cases.MAS;
        case OneUser.GENDER.FEMALE:
            return cases.FEM;
        case OneUser.GENDER.NEUTRAL:
            return cases.NEU;
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
            output = formatting.map(function (str) {
                return str.format(format_options).capitalize();
            });
        } else if (formatting instanceof jQuery) {
            output = $();
            formatting.each(function (key, elem) {
                var $elem = $(elem).clone();
                $elem.text(elem.innerText.format(format_options).capitalize());
                output = output.add($elem);
            });
        } else {
            output = {};
            $.each(formatting, function (key, str) {
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
        $.each(format, function () {
            is_with_time = is_with_time || this.contains((/\{T\}|\{t\}/));
        })
    }

    if (is_same_time) {
        if (is_with_time) {
            cur_time = dates[0].end_time ? displayTimeRange(dates[0].start_time, dates[0].end_time) : displayTimeRange(dates[0].start_time);
        }

        dates.forEach(function (date, i) {
            cur_moment = moment.unix(date.event_date);
            cur_year = cur_moment.year();
            cur_month = cur_moment.month();
            if (!dates_obj[cur_year]) dates_obj[cur_year] = {};
            if (!dates_obj[cur_year][cur_month]) dates_obj[cur_year][cur_month] = [];

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


        $.each(dates_obj, function (year, months) {
            $.each(months, function (month, days) {
                output.push(formatString(format, days.join(', '), is_with_time ? cur_time : '', month, year));
            })
        });

    } else {
        dates.forEach(function (date, i) {
            cur_moment = moment.unix(date.event_date);
            cur_year = cur_moment.year();
            cur_month = cur_moment.month();
            cur_time = date.end_time ? displayTimeRange(date.start_time, date.end_time) : displayTimeRange(date.start_time);
            if (!dates_obj[cur_year]) dates_obj[cur_year] = {};
            if (!dates_obj[cur_year][cur_month]) dates_obj[cur_year][cur_month] = [];

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

        $.each(dates_obj, function (year, months) {
            $.each(months, function (month, days) {
                var formatted_days = [],
                    range = [],
                    prev_time;
                $.each(days, function (i, day) {
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

                $.each(formatted_days, function (i, formatted_day) {
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
 * @return {string}
 */
function formatCurrency(number, separator, decimal_separator) {
    number = +number || 0;
    separator = separator || ' ';
    decimal_separator = decimal_separator || '.';
    var numbers_decimals = ('' + number).split('.')[1],
        negative = number < 0 ? '-' : '',
        integer_part = parseInt(Math.abs(number), 10) + '',
        cast_pos = integer_part.length > 3 ? integer_part.length % 3 : 0;
    return negative
        + (cast_pos ? integer_part.substr(0, cast_pos) + separator : '')
        + integer_part.substr(cast_pos).replace(/(\d{3})(?=\d)/g, '$1' + separator)
        + (numbers_decimals ? decimal_separator + numbers_decimals : '');
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
        $elements.each(function (i, el) {
            if ((el.required && (el.value.trim() === '' || !el.checkValidity())) || (el.value.trim() !== '' && !el.checkValidity())) {
                handleErrorField(el);
                is_valid = false;
            }
        });
    }

    return is_valid;
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
    if (data.fields instanceof Fields) {
        data.fields = data.fields.toString();
    }
    jqXHR = $.ajax({
        url: url,
        data: data,
        method: 'GET',
        contentType: content_type || 'application/x-www-form-urlencoded; charset=UTF-8'
    });
    return jqXHR.then(function (response, status_text, jqXHR) {
        return response;
    }).promise();
}


function bindLimitInputSize($parent) {
    $parent = $parent ? $parent : $('body');
    $parent.find('.LimitSize').not('.-Handled_LimitSize').each(function (i, e) {
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
        $this.on('input', function () {
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

    $hours.inputmask('Regex', {regex: "([01]?[0-9]|2[0-3])"}).on('keyup', function () {
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
    $parent.find('.AvatarsCollection').each(function () {
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
    $parent.find('.DatePicker').not('.-Handled_DatePicker').each(function (i, elem) {
        (new DatePicker(elem, $(elem).data())).init();
    }).addClass('-Handled_DatePicker');
}

function bindTimeInput($parent) {
    $parent = $parent ? $parent : $('body');
    $parent.find('.TimeInput').not('.-Handled_TimeInput').each(function (i, elem) {
        initTimeInput(elem);
    }).addClass('-Handled_TimeInput');
}

function bindTabs($parent) {
    $parent = $parent ? $parent : $('body');
    $parent.find('.Tabs').not('.-Handled_Tabs').each(function (i, elem) {
        var $this = $(elem),
            tabs_id = $this.data('tabs_id'),
            focus_on_change = !!$this.data('focus_on_change'),
            mutation_observer = new MutationObserver(function (records) {
                var $wrappers,
                    $target;
                records.forEach(function (record) {
                    $target = $(record.target);
                    $wrappers = $target.parents('.TabsBody');
                    $wrappers = $target.hasClass('TabsBody') ? $wrappers.add($target) : $wrappers;
                    $wrappers.each(function (i, wrapper) {
                        var $wrapper = $(wrapper);
                        if ($wrapper.hasClass(__C.CLASSES.ACTIVE)) {
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

        if (tabs_id) {
            $bodies_wrapper = $this.find('.TabsBodyWrapper[data-tabs_id="' + tabs_id + '"]');
            $bodies = $bodies_wrapper.children('.TabsBody');
            $header_wrapper = $this.find('.HeaderTabs[data-tabs_id="' + tabs_id + '"]');
            $tabs = $header_wrapper.children('.Tab');
        } else {
            $bodies_wrapper = $this.find('.TabsBodyWrapper:first');
            $bodies = $bodies_wrapper.children('.TabsBody');
            $header_wrapper = $this.find('.HeaderTabs:first');
            $tabs = $header_wrapper.children('.Tab');
        }

        Object.defineProperties($this, {
            'currentTabsIndex': {
                get: function () {
                    return $tabs.index($tabs.filter('.' + __C.CLASSES.ACTIVE));
                }
            },
            'tabsCount': {
                get: function () {
                    return $tabs.length;
                }
            }
        });

        $this.setToTab = function (index) {
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

        $this.nextTab = function () {
            $this.setToTab($this.currentTabsIndex + 1);
        };

        $this.prevTab = function () {
            $this.setToTab($this.currentTabsIndex - 1);
        };

        if (!$tabs.filter('.' + __C.CLASSES.ACTIVE).length) {
            $tabs.eq(0).addClass(__C.CLASSES.ACTIVE);
        }
        $bodies.removeClass(__C.CLASSES.ACTIVE).eq($this.currentTabsIndex).addClass(__C.CLASSES.ACTIVE);
        $bodies_wrapper.height($bodies.filter('.' + __C.CLASSES.ACTIVE).outerHeight());
        $bodies_wrapper.on('transitionend webkitTransitionEnd', function () {
            $this.removeClass('-in_progress');
            $this.trigger('progress_end')
        });
        $bodies.each(function (i, body) {
            mutation_observer.observe(body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['class']
            });
        });

        $tabs.on('click', function () {
            $this.setToTab($tabs.index(this));
        });

        $this.data('instance', $this);
    }).addClass('-Handled_Tabs');
}

function bindShareButtons($parent) {
    $parent = $parent ? $parent : $('body');
    $parent.find('.ShareButton').not('.-Handled_ShareButton').each(function (i, elem) {
        var $this = $(elem);
        $this.on('click', function () {
            window.open($this.data('href'), $this.data('title'), 'width=600,height=440,resizable=yes,scrollbars=no,status=no');
        });
    }).addClass('-Handled_ShareButton');
}

function bindSelect2($parent) {
    $parent = $parent ? $parent : $('body');
    $parent.find('.ToSelect2').not('.-Handled_ToSelect2').each(function (i, el) {
        initSelect2($(el));
    }).addClass('-Handled_ToSelect2');
}

function bindRippleEffect($parent) {
    $parent = $parent ? $parent : $('body');
    $parent.find('.RippleEffect').not('.-Handled_RippleEffect').on('click.RippleEffect', function (e) {
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
        setTimeout(function () {
            $ripple.removeClass('animate');
        }, 650);
    }).addClass('-Handled_RippleEffect');
}

function bindDropdown($parent) {
    $parent = $parent ? $parent : $('body');
    $parent.find('.DropdownButton').not('.-Handled_DropdownButton').each(function () {
        var $button = $(this),
            data = $button.data(),
            $dropbox = $('.DropdownBox').filter('[data-dropdown_id="' + data.dropdown + '"]');

        $dropbox.data($.extend({}, $dropbox.data(), data));
        $dropbox.closeDropbox = function () {
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
        $button.on('click.Dropdown', function () {
            $dropbox.addClass('-show');
            $button.addClass('-dropdown_active');
            $('body').on('mousedown.CloseDropdown', function (e) {
                if (!$(e.target).closest('.DropdownBox').length) {
                    $dropbox.closeDropbox();
                }
            });
            $(document).on('keyup.CloseDropdown', function (e) {
                if (e.keyCode == 27) {
                    $dropbox.closeDropbox();
                }
            });
        });

    }).addClass('-Handled_DropdownButton')
}

function bindFileLoadButton($parent) {
    $parent = $parent ? $parent : $('body');
    $parent.find('.FileLoadButton').not('.-Handled_FileLoadButton').click(function (e) {
        var $this = $(this);
        $this.children('input').get(0).click();
    }).addClass('-Handled_FileLoadButton');
}

function bindCollapsing($parent) {
    $parent = $parent ? $parent : $('body');
    $parent.find('.Collapsing').not('.-Handled_Collapsing').each(function () {
        var $instance = $(this),
            collapsing_id = $instance.data('collapsing_id'),
            mutation_observer = new MutationObserver(function (records) {
                var $contents,
                    $target;
                records.forEach(function (record) {
                    $target = $(record.target);
                    $contents = $target.parents('.CollapsingContent');
                    $contents = $target.hasClass('CollapsingContent') ? $contents.add($target) : $contents;
                    $contents.each(function (i, content) {
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

        if (collapsing_id) {
            $wrapper = $instance.find('.CollapsingWrapper[data-collapsing_id="' + collapsing_id + '"]');
            $trigger = $instance.find('.CollapsingTrigger[data-collapsing_id="' + collapsing_id + '"]');
        } else {
            $wrapper = $instance.find('.CollapsingWrapper:first');
            $trigger = $instance.find('.CollapsingTrigger:first');
        }
        $content = $wrapper.children('.CollapsingContent');
        trigger_event = $trigger.is(':checkbox') || $trigger.is(':radio') ? 'change' : 'click';

        if ($wrapper.hasClass('-fading')) {
            default_height = $instance.data('defaultHeight') < $content.height() ? $instance.data('defaultHeight') : $content.height();
            if (!$instance.hasClass(__C.CLASSES.ACTIVE) && $wrapper.height() < default_height) {
                $wrapper.height(default_height);
            }
        } else {
            default_height = $instance.data('defaultHeight') ? $instance.data('defaultHeight') : 0;
        }

        function toggleCollapsing() {
            $wrapper.addClass('-in_progress');
            if ($instance.hasClass(__C.CLASSES.ACTIVE)) {
                $wrapper.height(default_height);
            } else {
                $wrapper.height($content.outerHeight());
            }
            $wrapper.toggleClass('-opened');
            $instance.toggleClass(__C.CLASSES.ACTIVE);
        }

        function changeProp() {
            if (trigger_event === 'change') {
                $trigger.prop('checked', !$trigger.prop('checked'));
            }
        }

        $instance.openCollapsing = function () {
            if (!$instance.hasClass(__C.CLASSES.ACTIVE)) {
                changeProp();
                toggleCollapsing();
            }
        };

        $instance.closeCollapsing = function () {
            if ($instance.hasClass(__C.CLASSES.ACTIVE)) {
                changeProp();
                toggleCollapsing();
            }
        };

        $trigger.on(trigger_event + '.toggleCollapsing', function () {
            toggleCollapsing();
        });

        $wrapper
            .on('click', function () {
                $instance.openCollapsing();
            })
            .on('transitionend webkitTransitionEnd', function () {
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
    $parent.find('.Switch').not('.-Handled_Switch').each(function (i, el) {
        var $switch = $(el),
            switch_id = $switch.data('switch_id'),
            $switching = $parent.find('.Switching[data-switch_id="' + switch_id + '"]');

        $switch.on('change.Switch', function () {
            if ($switching.is('fieldset')) {
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
    return $parent.find('.CallModal').not('.-Handled_CallModal').each(function () {
        var $this = $(this);

        $this.on('click.CallModal', function () {
            var $this = $(this),
                title = $this.data('modal_title'),
                modal = $this.data('modal'),
                modal_type = $this.data('modal_type');

            if (!modal) {
                switch (modal_type) {
                    case 'favors': {
                        modal = new FavoredModal($this.data('modal_event_id'), title);
                        break;
                    }
                    case 'subscribers': {
                        modal = new SubscribersModal($this.data('modal_organization_id'), title);
                        break;
                    }
                    case 'editors': {
                        modal = new EditorsModal($this.data('modal_organization_id'), title, $this.data('modal_specific_role'));
                        break;
                    }
                    case 'map': {
                        modal = new MapModal($this.data('modal_map_location'), title);
                        break;
                    }
                    case 'media': {
                        var type = $this.data('modal_media_type'),
                            url = $this.data('modal_media_url');
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
                        modal = new MediaModal(url, type);
                        break;
                    }
                    case 'cropper': {
                        modal = new CropperModal($this.data('source_img'), $this.data());
                        break;
                    }
                    case 'friends_list': {
                        modal = new FriendsListModal($this.data('modal_entity'));
                        break;
                    }
                    case 'subscribers_list': {
                        modal = new SubscriptionsListModal($this.data('modal_entity'));
                        break;
                    }
                    default: {
                        modal = new StdModal(title, $this.data('modal_content'), $this.data('modal_style'));
                        break;
                    }
                }
                $this.data('modal', modal);
            }
            modal.show();
        });
    }).addClass('-Handled_CallModal');
}

function bindPageLinks($parent) {
    $parent = $parent ? $parent : $('body');
    $parent.find('.Link').not('.-Handled_Link').on('click.pageRender', function (e) {
        var $this = $(this);
        if ($this.hasClass(__C.CLASSES.DISABLED))
            return false;
        if (e.which == 1) {
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
            .one('input.ClearError change.ClearError', function () {
                $unit.off('input.ClearError change.ClearError').removeClass('-status_error');
                $input.off('blur.ClearError');
            });
        $input
            .off('blur.ClearError')
            .one('blur.ClearError', function () {
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
    xhr.onload = function () {
        var reader = new FileReader();
        reader.onloadend = function () {
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
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true
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
        complete = function () {
        };
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
 * @param {int} left
 * @return {boolean}
 */
function isScrollRemain(left) {
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


/* OLD CODE */

function showSettingsModal() {
    var $modal = $('#settings-modal');
    $modal.remove();

    $.ajax({
        url: '/api/v1/users/me/settings',
        type: 'GET',
        success: function (res) {
            $modal = tmpl('settings-modal', res.data);
            $modal
                .appendTo($('body'))
                .on('shown.bs.modal', function () {
                    if (res.data.hasOwnProperty('show_to_friends')) {
                        $modal.find('.show-to-friends').prop('checked', res.data.show_to_friends);
                    }
                    if (res.data.hasOwnProperty('notify_in_browser')) {
                        $modal.find('.notify-in-browser').prop('checked', res.data.notify_in_browser);
                    }
                    $modal.find('.notify-in-browser').on('change', function () {
                        var $this = $(this);
                        if ($this.prop('checked')) {
                            if (Notify.needsPermission) {
                                Notify.requestPermission(function () {
                                }, function () {
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
                .on('click', function () {
                    var _data = {};
                    $modal.find('input').each(function () {
                        var $this = $(this);
                        _data[$this.attr('name')] = $this.prop('checked');
                    });

                    Pace.ignore(function () {
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
                var search_data = searchToObject();
                if (search_data.redirect_to) {
                    window.parent.location = search_data.redirect_to;
                } else if (data.hasOwnProperty('mobile') && data.mobile == true) {
                    window.location.href = '/mobileAuthDone.php?token=' + data.token + '&email=' + data.email;
                } else {
                    if (sessionStorage.getItem('organization_info')) {
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
/*
 socket.on('utils.registrationSaved', function (data) {
 var _data = $('#wizard-form').serializeForm();
 _data.uuid = data.uuid;
 cookies.setItem('open_add_organization', 1, Infinity);
 window.sessionStorage.setItem('organization_info', JSON.stringify(_data));
 });*/

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
EntityInterface = (function () {
    /**
     *
     * @interface
     */
    function EntityInterface() {
    }

    /**
     *
     * @param {(Array|object)} data
     * @returns {EntityInterface}
     */
    EntityInterface.prototype.setData = function (data) {
    };

    return EntityInterface;
}());
/**
 * @class Fields
 */
Fields = (function () {
    /**
     * @class FieldsProps
     */
    var FieldsProps = (function () {
        /**
         *
         * @constructs Field
         * @param {Object} [obj]
         */
        function FieldsProps(obj) {
            var field;
            for (field in obj) {
                this[field] = obj[field];
            }
        }

        Object.defineProperty(FieldsProps.prototype, 'toString', {
            value: function () {
                var self = this,
                    props = Object.props(this),
                    output = {};

                if (props.length === 0)
                    return '';

                props.forEach(function (prop) {
                    output[prop] = (self[prop] instanceof Array || self[prop] instanceof Fields) ? self[prop].toString() : self[prop];
                });


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
        value: function () {
            var self = this,
                fields = Object.props(this);

            if (fields.length === 0)
                return undefined;

            return fields.map(function (field_name) {
                return field_name + self[field_name];
            }).join(',');
        }
    });

    /**
     *
     * @param {(string|Array)} fields
     * @return {{}}
     */
    function parseFields(fields) {
        var parsed_fields = {};
        if (!(fields instanceof Array)) {
            fields = fields.replace(/\s+/g, '').match(/(\w+\{[^}]+}|\w+)/g);
        }
        fields.forEach(function (field) {
            var split = field.split('{'),
                subset = {};
            if (split.length > 1) {
                subset = JSON.parse('{' + split[1].replace(/(\w+):/g, function (str, m1) {
                        return '"' + m1 + '":';
                    }));
                if (subset.fields) {
                    subset.fields = new (Function.prototype.bind.apply(Fields, [null].concat(subset.fields.split(','))))();
                }
                if (subset.order_by) {
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
    Fields.parseFields = function (fields) {
        return new Fields(parseFields(fields));
    };

    Fields.prototype.push = Fields.prototype.add = function () {
        var args = Array.prototype.splice.call(arguments, 0),
            field,
            parsed_obj = {};

        args.forEach(function (arg) {
            if (typeof arg === 'string') {
                parsed_obj[arg] = {};
            } else if (arg instanceof Array) {
                arg.forEach(function (field) {
                    parsed_obj[field] = {};
                });
            } else if (arg instanceof Object) {
                for (field in arg) {
                    parsed_obj[field] = arg[field];
                }
            }
        });

        for (field in parsed_obj) {
            this[field] = new FieldsProps(parsed_obj[field]);
        }

        return this;
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
OneEntity = (function () {
    /**
     *
     * @constructor
     * @constructs OneEntity
     */
    function OneEntity() {
    }

    /**
     *
     * @param {(Array|object)} data
     * @returns {OneEntity}
     */
    OneEntity.prototype.setData = function (data) {
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
EntitiesCollection = extending(Array, (function () {
    /**
     *
     * @constructor
     * @constructs EntitiesCollection
     *
     * @property {object} __lookup
     * @property {Array<collection_of>} last_pushed
     */
    function EntitiesCollection() {
        Object.defineProperty(this, '__lookup', {
            value: {},
            writable: true,
            enumerable: false,
            configurable: false
        });
        Object.defineProperty(this, 'last_pushed', {
            value: [],
            writable: true,
            enumerable: false,
            configurable: false
        });
    }

    EntitiesCollection.prototype.collection_of = OneEntity;
    /**
     *
     * @param {(Array|object)} data
     * @returns {EntitiesCollection}
     */
    EntitiesCollection.prototype.setData = function (data) {
        data = data instanceof Array ? data : [data];
        this.push.apply(this, data);
        return this;
    };
    /**
     *
     * @param {(string|number)} id
     * @returns {(OneEntity|null)}
     */
    EntitiesCollection.prototype.getByID = function (id) {
        return this.__lookup.hasOwnProperty(id) ? this.__lookup[id] : null;
    };
    /**
     *
     * @param {(string|number)} id
     * @returns {boolean}
     */
    EntitiesCollection.prototype.has = function (id) {
        return this.getByID(id) instanceof OneEntity;
    };
    /**
     *
     * @param {...object} element
     * @returns {number}
     */
    EntitiesCollection.prototype.push = function (element) {
        var item;
        this.last_pushed = [];
        for (var i = 0; i < arguments.length; i++) {
            if (!arguments[i].id || (arguments[i].id && !this.has(arguments[i].id))) {
                item = (arguments[i] instanceof this.collection_of) ? arguments[i] : (new this.collection_of()).setData(arguments[i]);
                this.last_pushed.push(item);
                this[this.length++] = item;
                if (arguments[i].id) {
                    this.__lookup[arguments[i].id] = item;
                }
            }
        }
        return this.length;
    };
    /**
     *
     * @return {Array}
     */
    EntitiesCollection.prototype.getArrayCopy = function () {
        return this.map(function (el) {
            return el;
        })
    };
    /**
     *
     * @param {(string|number)} id
     * @returns {Array<OneEntity>}
     */
    EntitiesCollection.prototype.remove = function (id) {
        if (this.has(id)) {
            delete this.__lookup[id];
            return this.splice(this.indexOf(this.getByID(id)), 1);
        }
        return [];
    };

    return EntitiesCollection;
}()));
/**
 * @requires ../../entities/Class.OneEntity.js
 */
/**
 * @class RegistrationFieldModel
 * @extends OneEntity
 */
RegistrationFieldModel = extending(OneEntity, (function () {
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
    RegistrationFieldModel.isCustomField = function (field) {
        switch (field.type) {
            case RegistrationFieldModel.TYPES.EMAIL:
            case RegistrationFieldModel.TYPES.FIRST_NAME:
            case RegistrationFieldModel.TYPES.LAST_NAME:
            case RegistrationFieldModel.TYPES.PHONE_NUMBER:
                return false;
            default:
            case RegistrationFieldModel.TYPES.CUSTOM:
            case RegistrationFieldModel.TYPES.EXTENDED_CUSTOM:
            case RegistrationFieldModel.TYPES.ADDITIONAL_TEXT:
                return true;
        }
    };

    RegistrationFieldModel.prototype.setData = function (data) {
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
RegistrationFieldsCollection = extending(EntitiesCollection, (function () {
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
    RegistrationFieldsCollection.prototype.push = function (element) {
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

        this.last_pushed = [];

        types.forEach(function (type) {
            entities.forEach(function (entity) {
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
 * @requires ../../entities/Class.OneEntity.js
 */
/**
 *
 * @class DateModel
 * @extends OneEntity
 */
DateModel = extending(OneEntity, (function () {
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
DateModelsCollection = extending(EntitiesCollection, (function () {
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
 * @requires ../Class.OneEntity.js
 */
/**
 * @abstract
 * @class OneAbstractActivity
 * @extends OneEntity
 */
OneAbstractActivity = extending(OneEntity, (function () {
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
OneEventActivity = extending(OneAbstractActivity, (function () {
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
OneOrganizationActivity = extending(OneAbstractActivity, (function () {
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
UsersActivitiesCollection = extending(EntitiesCollection, (function () {
    /**
     *
     * @constructs UsersActivitiesCollection
     */
    function UsersActivitiesCollection(user_id) {
        EntitiesCollection.call(this);
        Object.defineProperty(this, 'user_id', {value: user_id});
    }

    Object.defineProperty(UsersActivitiesCollection.prototype, 'collection_of', {value: OneAbstractActivity});

    UsersActivitiesCollection.setDefaultData = function (data) {
        if (typeof data.fields === 'string') {
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
    UsersActivitiesCollection.prototype.push = function (element) {
        for (var i = 0; i < arguments.length; i++) {
            if (arguments[i] instanceof this.collection_of) {
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
    UsersActivitiesCollection.fetch = function (user_id, data, success) {
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
    UsersActivitiesCollection.prototype.fetch = function (fields, length, order_by, success) {
        var self = this,
            ajax_data = {
                fields: fields,
                offset: this.length,
                length: length
            };
        if (order_by) {
            ajax_data.order_by = order_by;
        }
        return this.constructor.fetch(this.user_id, ajax_data).then(function (data) {
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
 * @class OneCity
 * @extends OneEntity
 */
OneCity = extending(OneEntity, (function () {
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
CitiesCollection = extending(EntitiesCollection, (function () {
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
    CitiesCollection.fetchCities = function (data, success) {
        var location = {};

        try {
            location = {
                latitude: __APP.LOCATION.latitude,
                longitude: __APP.LOCATION.longitude
            };
        } catch (e) {
        }

        return __APP.SERVER.getData('/api/v1/organizations/cities', $.extend(location, data), success);
    };
    /**
     *
     * @param {string} name
     * @returns {(OneCity|null)}
     */
    CitiesCollection.prototype.getByName = function (name) {
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
    CitiesCollection.prototype.has = function (id) {
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
    CitiesCollection.prototype.fetchCities = function (fields, length, order_by, success) {
        var self = this;

        return CitiesCollection.fetchCities({
            fields: fields || undefined,
            offset: this.length,
            length: length || undefined,
            order_by: order_by || undefined
        }, function (data) {
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
OneDate = extending(DateModel, (function () {
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
DatesCollection = extending(EntitiesCollection, (function () {
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
    DatesCollection.fetchDates = function (ajax_data, success) {
        return __APP.SERVER.getData('/api/v1/events/dates', ajax_data, success);
    };

    return DatesCollection;
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
OneOrganization = extending(OneEntity, (function () {
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
     *
     * @property {UsersCollection} staff
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
        this.city = new OneCity();
        this.country = null;

        this.email = null;
        this.role = null;
        this.staff = new UsersCollection();
        this.status = null;

        this.is_new = null;
        this.new_events_count = null;
        this.actual_events_count = null;

        this.vk_url = null;
        this.facebook_url = null;

        this.loading = false;
        if (organization_id && is_loading_continuous) {
            this.loading = true;
            this.fetchOrganization([], function () {
                this.loading = false;
                $(window).trigger('fetch.OneOrganization');
            });
        }
    }

    /**
     *
     * @param {(string|number)} org_id
     * @param {(string|Array)} fields
     * @param {AJAXCallback} [success]
     * @returns {jqPromise}
     */
    OneOrganization.fetchOrganization = function (org_id, fields, success) {
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
     * @param {OneOrganizationCreateOrganizationData} new_organization_data
     * @param {OneOrganizationCreateOrganizationCallback} [success]
     * @returns {jqPromise}
     */
    OneOrganization.createOrganization = function (new_organization_data, success) {
        return __APP.SERVER.addData('/api/v1/organizations/', new_organization_data, true, success);
    };
    /**
     *
     * @param {(string|number)} organization_id
     * @param {OneOrganizationCreateOrganizationData} organization_data
     * @param {OneOrganizationCreateOrganizationCallback} [success]
     * @returns {jqPromise}
     */
    OneOrganization.updateOrganization = function (organization_id, organization_data, success) {
        return __APP.SERVER.updateData('/api/v1/organizations/' + organization_id, organization_data, true, success);
    };
    /**
     *
     * @param {(string|number)} org_id
     * @param {AJAXCallback} [success]
     * @returns {jqPromise}
     */
    OneOrganization.subscribeOrganization = function (org_id, success) {
        return __APP.SERVER.addData('/api/v1/organizations/' + org_id + '/subscriptions', {}, false, success);
    };
    /**
     *
     * @param {(string|number)} org_id
     * @param {AJAXCallback} [success]
     * @returns {jqPromise}
     */
    OneOrganization.unsubscribeOrganization = function (org_id, success) {
        return __APP.SERVER.deleteData('/api/v1/organizations/' + org_id + '/subscriptions', {}, success);
    };
    /**
     *
     * @param {(Array|object)} data
     * @returns {OneEntity}
     */
    OneOrganization.prototype.setData = function (data) {
        OneEntity.prototype.setData.call(this, data);
        this.role = OneUser.recognizeRole(this.privileges);
        return this;
    };
    /**
     *
     * @param {(string|Array)} fields
     * @param {AJAXCallback} [success]
     * @returns {jqPromise}
     */
    OneOrganization.prototype.fetchOrganization = function (fields, success) {
        var self = this;
        return this.constructor.fetchOrganization(self.id, fields, function (data) {
            self.setData(data);
            if (success && typeof success == 'function') {
                success.call(self, self);
            }
        });
    };
    /**
     *
     * @param {(string|Array)} fields
     * @param {AJAXData} [events_ajax_data]
     * @param {AJAXCallback} [success]
     * @returns {jqPromise}
     */
    OneOrganization.prototype.fetchOrganizationWithEvents = function (fields, events_ajax_data, success) {
        var _fields = fields;
        _fields = _fields instanceof Array ? _fields : _fields.split(',');
        _fields.push('events'.appendAjaxData(events_ajax_data));
        return this.fetchOrganization(fields, success);
    };
    /**
     *
     * @param {OneOrganizationCreateOrganizationData} new_organization_data
     * @param {OneOrganizationCreateOrganizationCallback} [success]
     * @returns {jqPromise}
     */
    OneOrganization.prototype.createOrganization = function (new_organization_data, success) {
        var self = this;
        return OneOrganization.createOrganization(new_organization_data, function (response_data) {
            self.setData(new_organization_data);
            self.id = response_data.organization_id;
            if (success && typeof success == 'function') {
                success.call(self, self);
            }
        });
    };
    /**
     *
     * @param {OneOrganizationCreateOrganizationData} organization_data
     * @param {OneOrganizationCreateOrganizationCallback} [success]
     * @returns {jqPromise}
     */
    OneOrganization.prototype.updateOrganization = function (organization_data, success) {
        var self = this;
        return OneOrganization.updateOrganization(self.id, organization_data, function (response_data) {
            self.setData(organization_data);
            if (success && typeof success == 'function') {
                success.call(self, self);
            }
        });
    };
    /**
     *
     * @param {AJAXCallback} [success]
     * @returns {jqPromise}
     */
    OneOrganization.prototype.subscribe = function (success) {
        var self = this;
        return this.constructor.subscribeOrganization(this.id, function (data) {
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
    OneOrganization.prototype.unsubscribe = function (success) {
        var self = this;
        return this.constructor.unsubscribeOrganization(this.id, function (data) {
            this.is_subscribed = false;
            this.subscribed_count = this.subscribed_count ? this.subscribed_count - 1 : this.subscribed_count;
            if (success && typeof success == 'function') {
                success.call(self, data);
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
OrganizationsCollection = extending(EntitiesCollection, (function () {
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
    OrganizationsCollection.fetchSubscribedOrganizations = function (data, success) {
        return __APP.SERVER.getData('/api/v1/organizations/subscriptions', data, success);
    };
    /**
     *
     * @param {(string|Array)} [roles]
     * @param {AJAXData} [data]
     * @param {AJAXCallback} [success]
     */
    OrganizationsCollection.fetchMyOrganizations = function (roles, data, success) {
        roles = Array.isArray(roles) ? roles.join(',') : roles;
        return __APP.SERVER.getData('/api/v1/organizations/', $.extend({}, data, {roles: roles}), success);
    };
    /**
     *
     * @param {AJAXData} data
     * @param {AJAXCallback} [success]
     */
    OrganizationsCollection.fetchRecommendations = function (data, success) {
        return __APP.SERVER.getData('/api/v1/organizations/recommendations', data, success);
    };
    /**
     *
     * @param {(Array|string)} [fields]
     * @param {(number|string)} [length]
     * @param {string} [order_by]
     * @param {AJAXCallback} [success]
     * @returns {jqPromise}
     */
    OrganizationsCollection.prototype.fetchSubscribedOrganizations = function (fields, length, order_by, success) {
        var self = this,
            ajax_data = {
                fields: fields,
                offset: this.length,
                length: length,
                order_by: order_by || undefined
            };
        return this.constructor.fetchSubscribedOrganizations(ajax_data, function (data) {
            self.setData(data);
            if (success && typeof success == 'function') {
                success.call(self, data);
            }
        });
    };
    /**
     *
     * @param {(Array<string>|string)} roles
     * @param {(Array<string>|string)} [fields]
     * @param {(number|string)} [length]
     * @param {string} [order_by]
     * @param {AJAXCallback} [success]
     * @returns {jqPromise}
     */
    OrganizationsCollection.prototype.fetchMyOrganizations = function (roles, fields, length, order_by, success) {
        var self = this,
            ajax_data = {
                fields: fields,
                length: length,
                offset: this.length,
                order_by: order_by || undefined
            };
        return OrganizationsCollection.fetchMyOrganizations(roles, ajax_data, function (data) {
            self.setData(data);
            if (success && typeof success == 'function') {
                success.call(self, data);
            }
        });
    };

    return OrganizationsCollection;
}()));
/**
 * @requires ../Class.OneEntity.js
 */
/**
 *
 * @class SearchResults
 * @extends OneEntity
 */
SearchResults = extending(OneEntity, (function () {
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
    SearchResults.sanitizeQueryVar = function (query_string) {
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
    SearchResults.fetchEventsAndOrganizations = function (query_string, ajax_data, success) {
        return __APP.SERVER.getData('/api/v1/search/', $.extend({}, SearchResults.sanitizeQueryVar(query_string), ajax_data), success);
    };
    /**
     *
     * @param {AJAXData} [events_ajax_data]
     * @param {function(organizations: Array<OneEvent>)} [success]
     * @returns {jqPromise}
     */
    SearchResults.prototype.fetchEvents = function (events_ajax_data, success) {
        var self = this,
            ajax_data = {
                fields: 'events' + JSON.stringify($.extend({}, __APP.SERVER.validateData(events_ajax_data), {offset: this.events.length}))
            };

        return SearchResults.fetchEventsAndOrganizations(self.query_string, ajax_data, function (data) {
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
    SearchResults.prototype.fetchOrganizations = function (organizations_ajax_data, success) {
        var self = this,
            ajax_data = {
                fields: 'organizations' + JSON.stringify($.extend({}, __APP.SERVER.validateData(organizations_ajax_data), {offset: this.organizations.length}))
            };

        return SearchResults.fetchEventsAndOrganizations(self.query_string, ajax_data, function (data) {
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
    SearchResults.prototype.fetchEventsAndOrganizations = function (events_ajax_data, organizations_ajax_data, success) {
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

        return SearchResults.fetchEventsAndOrganizations(self.query_string, ajax_data, function (data) {
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
 * @class OneCategory
 * @extends OneEntity
 */
OneCategory = extending(OneEntity, (function () {
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
            this.fetchCategory([], function () {
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
    OneCategory.fetchCategory = function (category_id, data, success) {
        return __APP.SERVER.getData('/api/v1/organizations/types', $.extend({}, data, {id: category_id}), success);
    };
    /**
     *
     * @param {(Array|string)} fields
     * @param {AJAXCallback} [success]
     * @return {jqPromise}
     */
    OneCategory.prototype.fetchCategory = function (fields, success) {
        var self = this;
        return this.constructor.fetchCategory(self.id, {fields: fields}, function (data) {
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
CategoriesCollection = extending(EntitiesCollection, (function () {
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
    CategoriesCollection.fetchCategories = function (data, success) {
        return __APP.SERVER.getData('/api/v1/organizations/types', data, success);
    };
    /**
     *
     * @param {AJAXData} data
     * @param {(number|string)} [length]
     * @param {AJAXCallback} [success]
     */
    CategoriesCollection.prototype.fetchCategories = function (data, length, success) {
        var self = this,
            ajax_data = $.extend({}, data, {
                offset: this.length,
                length: length
            });
        return this.constructor.fetchCategories(ajax_data, function (data) {
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
    CategoriesCollection.prototype.fetchCategoriesWithOrganizations = function (categories_ajax_data, orgs_ajax_data, length, success) {
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
        return this.constructor.fetchCategories(ajax_data, function (data) {
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
 * @requires ../../data_models/registration_field/Class.RegistrationFieldsCollection.js
 */
/**
 * @class OneEvent
 * @extends OneEntity
 */
OneEvent = extending(OneEntity, (function () {
    /**
     *
     * @constructor
     * @constructs OneEvent
     * @param {(string|number)} [event_id=0]
     * @param {boolean} [is_loading_continuous]
     *
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
     * @property {Array} orders
     *
     * @property {?boolean} ticketing_locally
     * @property {Array} tickets
     * @property {Array} ticket_types
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
     * @property {?number} first_event_date
     * @property {?number} last_event_date
     * @property {?number} nearest_event_date
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

        this.orders = [];

        this.ticketing_locally = null;
        this.tickets = [];
        this.ticket_types = [];

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
            this.fetchEvent([], function () {
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
     * @param {(string|Array)} [fields]
     * @param {AJAXCallback} [success]
     * @returns {jqPromise}
     */
    OneEvent.fetchEvent = function (event_id, fields, success) {
        return __APP.SERVER.getData('/api/v1/events/' + event_id, fields || (Array.isArray(fields) && fields.length) ? {fields: fields} : {}, success);
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
    OneEvent.createEvent = function (new_event_data, success, error) {
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
    OneEvent.updateEvent = function (event_id, data, success, error) {
        return __APP.SERVER.updateData('/api/v1/events/' + event_id, data, true, success, error);
    };
    /**
     *
     * @param {(string|number)} event_id
     * @param {(OneEvent.STATUS|Array<OneEvent.STATUS>)} status
     * @param {AJAXCallback} [success]
     * @returns {jqPromise}
     */
    OneEvent.changeEventStatus = function (event_id, status, success) {
        var data = {};
        status = Array.isArray(status) ? status : [status];
        status.forEach(function (el) {
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
        return __APP.SERVER.updateData('/api/v1/events/' + event_id + '/status', data, false, function () {
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
    OneEvent.addFavored = function (event_id, success) {
        return __APP.SERVER.addData('/api/v1/events/' + event_id + '/favorites', {}, false, success);
    };
    /**
     *
     * @param {(string|number)} event_id
     * @param {AJAXCallback} [success]
     * @returns {jqPromise}
     */
    OneEvent.deleteFavored = function (event_id, success) {
        return __APP.SERVER.deleteData('/api/v1/events/' + event_id + '/favorites', {}, success);
    };
    /**
     *
     * @param {(string|number)} event_id
     * @param {string} notification_type
     * @param {function} [success]
     * @returns {jqPromise}
     */
    OneEvent.addEventNotification = function (event_id, notification_type, success) {
        return __APP.SERVER.addData('/api/v1/events/' + event_id + '/notifications', {notification_type: notification_type}, false, success);
    };
    /**
     *
     * @param {(string|number)} event_id
     * @param {string} notification_uuid
     * @param {AJAXCallback} [success]
     * @returns {jqPromise}
     */
    OneEvent.deleteEventNotification = function (event_id, notification_uuid, success) {
        return __APP.SERVER.deleteData('/api/v1/events/' + event_id + '/notifications/' + notification_uuid, {}, success);
    };
    /**
     *
     * @param {(string|number)} event_id
     * @param {object} registration_fields
     * @param {AJAXCallback} [success]
     * @return {jqPromise}
     */
    OneEvent.registerToEvent = function (event_id, registration_fields, success) {
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
    OneEvent.prototype.fetchEvent = function (fields, success) {
        var self = this;
        return this.constructor.fetchEvent(self.id, fields, function (data) {
            self.setData(data[0]);
            if (success && typeof success == 'function') {
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
    OneEvent.prototype.createEvent = function (data, success, error) {
        var self = this;
        return this.constructor.createEvent(data, function (response_data) {
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
    OneEvent.prototype.updateEvent = function (data, success, error) {
        var self = this;
        return this.constructor.updateEvent(self.id, data, function (response_data) {
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
    OneEvent.prototype.changeEventStatus = function (status, success) {
        var self = this;
        return this.constructor.changeEventStatus(self.id, status, function (data) {
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
    OneEvent.prototype.addNotification = function (notification_type, success) {
        return this.constructor.addEventNotification(this.id, notification_type, success);
    };
    /**
     *
     * @param {string} notification_uuid
     * @param {AJAXCallback} [success]
     * @returns {jqPromise}
     */
    OneEvent.prototype.deleteNotification = function (notification_uuid, success) {
        return this.constructor.deleteEventNotification(this.id, notification_uuid, success);
    };
    /**
     *
     * @param {object} registration_fields
     * @param {AJAXCallback} [success]
     * @return {jqPromise}
     */
    OneEvent.prototype.registerToEvent = function (registration_fields, success) {
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
EventsCollection = extending(EntitiesCollection, (function () {
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
    EventsCollection.fetchEvents = function (data, success) {
        return __APP.SERVER.getData('/api/v1/events/', data, success);
    };
    /**
     *
     * @param {EventsCollectionAJAXData} data
     * @param {EventsCollectionAJAXCallback} [success]
     * @returns {jqPromise}
     */
    EventsCollection.fetchMyEvents = function (data, success) {
        return __APP.SERVER.getData('/api/v1/events/my', data, success);
    };
    /**
     *
     * @param {EventsCollectionAJAXData} data
     * @param {EventsCollectionAJAXCallback} [success]
     * @returns {jqPromise}
     */
    EventsCollection.fetchFavoredEvents = function (data, success) {
        return __APP.SERVER.getData('/api/v1/events/favorites', data, success);
    };
    /**
     *
     * @param {EventsCollectionAJAXData} data
     * @param {EventsCollectionAJAXCallback} [success]
     * @returns {jqPromise}
     */
    EventsCollection.fetchRecommendedEvents = function (data, success) {
        return __APP.SERVER.getData('/api/v1/events/recommendations', data, success);
    };
    /**
     *
     * @param {(number|string)} organization_id
     * @param {EventsCollectionAJAXData} data
     * @param {EventsCollectionAJAXCallback} [success]
     * @returns {jqPromise}
     */
    EventsCollection.fetchOrganizationsEvents = function (organization_id, data, success) {
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
    EventsCollection.prototype.fetchEvents = function (kind, data, length, success) {
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
        return this.constructor[method_name](ajax_data, function (data) {
            self.setData(data);
            if (success && typeof success == 'function') {
                success.call(self, self.last_pushed);
            }
        });
    };
    /**
     *
     * @param {(Array|string)} [fields]
     * @param {(number|string)} [length]
     * @param {EventsCollectionAJAXCallback} [success]
     * @returns {jqPromise}
     */
    EventsCollection.prototype.fetchFeed = function (fields, length, success) {
        var self = this,
            ajax_data = {
                fields: fields,
                offset: this.length,
                length: length
            };
        return this.constructor.fetchEvents(ajax_data, function (data) {
            self.setData(data);
            if (success && typeof success == 'function') {
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
    EventsCollection.prototype.fetchOrganizationsEvents = function (organization_id, data, length, success) {
        var self = this,
            ajax_data = $.extend({}, data, {
                offset: this.length,
                length: length
            });
        return this.constructor.fetchOrganizationsEvents(organization_id, ajax_data, function (data) {
            self.setData(data);
            if (success && typeof success == 'function') {
                success.call(self, self.last_pushed);
            }
        });
    };
    /**
     *
     * @param {(number|string)} organization_id
     * @param {(Array|string)} [fields]
     * @param {(number|string)} [length]
     * @param {EventsCollectionAJAXCallback} [success]
     * @returns {jqPromise}
     */
    EventsCollection.prototype.fetchOrganizationsFeed = function (organization_id, fields, length, success) {
        var self = this,
            ajax_data = {
                fields: fields,
                offset: this.length,
                length: length
            };
        return this.constructor.fetchOrganizationsEvents(organization_id, ajax_data, function (data) {
            self.setData(data);
            if (success && typeof success == 'function') {
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
ActualEventsCollection = extending(EventsCollection, (function () {
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
    ActualEventsCollection.fetchEvents = function (data, success) {
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
CanceledEventsCollection = extending(EventsCollection, (function () {
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
    CanceledEventsCollection.fetchOrganizationsEvents = function (organization_id, data, success) {
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
DayEventsCollection = extending(EventsCollection, (function () {
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
    DayEventsCollection.fetchEvents = function (date, data, success) {
        data.future = false;
        data.date = date;
        return EventsCollection.fetchMyEvents(data, success);
    };
    /**
     *
     * @override
     */
    DayEventsCollection.prototype.fetchFeed = function (fields, length, success) {
        var self = this,
            ajax_data = {
                fields: fields,
                offset: this.length,
                length: length
            };
        return this.constructor.fetchEvents(this.date, ajax_data, function (data) {
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
DelayedEventsCollection = extending(EventsCollection, (function () {
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
    DelayedEventsCollection.fetchOrganizationsEvents = function (organization_id, data, success) {
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
OneEventWithStatistics = extending(OneEvent, (function () {
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
EventsWithStatisticsCollection = extending(EventsCollection, (function () {
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
    EventsWithStatisticsCollection.fetchEvents = function (data, success) {
        data.statistics = true;
        return __APP.SERVER.getData('/api/v1/events/', data, success);
    };
    /**
     *
     * @param {EventsCollectionAJAXData} data
     * @param {EventsCollectionAJAXCallback} [success]
     * @returns {jqPromise}
     */
    EventsWithStatisticsCollection.fetchMyEvents = function (data, success) {
        data.statistics = true;
        return __APP.SERVER.getData('/api/v1/events/my', data, success);
    };
    /**
     *
     * @param {EventsCollectionAJAXData} data
     * @param {EventsCollectionAJAXCallback} [success]
     * @returns {jqPromise}
     */
    EventsWithStatisticsCollection.fetchFavoredEvents = function (data, success) {
        data.statistics = true;
        return __APP.SERVER.getData('/api/v1/events/favorites', data, success);
    };
    /**
     *
     * @param {EventsCollectionAJAXData} data
     * @param {EventsCollectionAJAXCallback} [success]
     * @returns {jqPromise}
     */
    EventsWithStatisticsCollection.fetchRecommendedEvents = function (data, success) {
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
    EventsWithStatisticsCollection.fetchOrganizationsEvents = function (organization_id, data, success) {
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
FavoredEventsCollection = extending(EventsCollection, (function () {
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
    FavoredEventsCollection.fetchEvents = function (data, success) {
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
FriendsEventsCollection = extending(EventsCollection, (function () {
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
    FriendsEventsCollection.fetchEvents = function (data, success) {
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
FutureEventsCollection = extending(EventsCollection, (function () {
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
    FutureEventsCollection.fetchOrganizationsEvents = function (organization_id, data, success) {
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
PastEventsCollection = extending(EventsCollection, (function () {
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
    PastEventsCollection.fetchOrganizationsEvents = function (organization_id, data, success) {
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
RecommendedEventsCollection = extending(EventsCollection, (function () {
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
    RecommendedEventsCollection.fetchEvents = function (data, success) {
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
TimelineEventsCollection = extending(EventsCollection, (function () {
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
    TimelineEventsCollection.fetchEvents = function (data, success) {
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
 * @class OneTag
 * @extends OneEntity
 */
OneTag = extending(OneEntity, function () {
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
            this.fetchTag(function () {
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
    OneTag.fetchTag = function (tag_id, success) {
        return __APP.SERVER.getData('/api/v1/tags/' + tag_id, {}, success);
    };
    /**
     *
     * @param {AJAXCallback} [success]
     * @returns {jqPromise}
     */
    OneTag.prototype.fetchTag = function (success) {
        var self = this;
        return this.constructor.fetchTag(self.id, function (data) {
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
TagsCollection = extending(EntitiesCollection, (function () {
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
    TagsCollection.fetchTags = function (data, success) {
        return __APP.SERVER.getData('/api/v1/tags/', data, success);
    };
    /**
     *
     * @param {TagsCollectionAJAXData} data
     * @param {AJAXCallback} [success]
     * @returns {jqPromise}
     */
    TagsCollection.prototype.fetchTags = function (data, success) {
        var self = this;
        return this.constructor.fetchTags(data, function (data) {
            self.setData(data);
            if (success && typeof success == 'function') {
                success.call(self, data);
            }
        });
    };

    return TagsCollection;
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
Statistics = (function () {
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
    Statistics.prototype.setData = function (data) {
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
    Statistics.fetchStatistics = function (entity, id, scale, range, statistics_fields, dynamics_ajax_data, success) {
        var data = {
            scale: scale,
            fields: []
        };
        if (statistics_fields instanceof Array) {
            data.fields = data.fields.concat(statistics_fields);
        } else {
            $.each(statistics_fields, function (field, options) {
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
            case 'boolean':
                break;
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
    Statistics.prototype.fetchStatistics = function (scale, range, statistics_fields, dynamics_ajax_data, success) {
        var self = this;
        return Statistics.fetchStatistics(this.entity, this.id, scale, range, statistics_fields, dynamics_ajax_data, function (data) {
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
EventStatistics = extending(Statistics, (function () {
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
OrganizationsStatistics = extending(Statistics, (function () {
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
 * @requires ../activity/Class.UsersActivitiesCollection.js
 */
/**
 * @class OneUser
 * @extends OneEntity
 */
OneUser = extending(OneEntity, (function () {
    /**
     *
     * @param {(string|number)} [user_id]
     * @constructs OneUser
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
            get: function () {
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
     * @param {(Array|string)} [fields]
     * @param {AJAXCallback} [success]
     * @returns {jqPromise}
     */
    OneUser.fetchUser = function (user_id, fields, success) {
        return __APP.SERVER.getData('/api/v1/users/' + user_id, {fields: fields}, success);
    };
    /**
     *
     * @param {(string|number)} user_id
     * @param {AJAXData} [data]
     * @param {AJAXCallback} [success]
     * @returns {jqPromise}
     */
    OneUser.fetchFavored = function (user_id, data, success) {
        return __APP.SERVER.getData('/api/v1/users/' + user_id + '/favorites', data, success);
    };
    /**
     *
     * @param {(string|number)} user_id
     * @param {AJAXData} [data]
     * @param {AJAXCallback} [success]
     * @returns {jqPromise}
     */
    OneUser.fetchSubscriptions = function (user_id, data, success) {
        return __APP.SERVER.getData('/api/v1/users/' + user_id + '/subscriptions', data, success);
    };
    /**
     *
     * @param {(string|number)} user_id
     * @param {(Array|string)} [fields]
     * @param {AJAXCallback} [success]
     * @returns {jqPromise}
     */
    OneUser.fetchUserActivity = function (user_id, fields, success) {
        return UsersActivitiesCollection.fetch(user_id, {fields: fields}, success);
    };
    /**
     * Returns highest role in privileges set
     * @param {Array<Privilege>} privileges
     * @returns {OneUser.ROLE}
     */
    OneUser.recognizeRole = function (privileges) {
        var role = OneUser.ROLE.USER;
        privileges.forEach(function (privilege) {
            if (privilege.role_id == 1 || privilege.name == OneUser.ROLE.ADMIN)
                role = OneUser.ROLE.ADMIN;
            if ((privilege.role_id == 2 || privilege.name == OneUser.ROLE.MODERATOR) && role !== OneUser.ROLE.ADMIN)
                role = OneUser.ROLE.MODERATOR;
        });
        return role ? role : OneUser.ROLE.UNAUTH;
    };
    /**
     *
     * @param {(Array|string)} [fields]
     * @param {AJAXCallback} [success]
     * @returns {jqPromise}
     */
    OneUser.prototype.fetchUser = function (fields, success) {
        var self = this;
        fields = setDefaultValue(fields, []);

        return OneUser.fetchUser(self.id, fields, function (data) {
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
    OneUser.prototype.fetchFavored = function (data, success) {
        var self = this;
        data.offset = this.favored.length;
        return OneUser.fetchFavored(self.id, data).done(function (favored) {
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
    OneUser.prototype.fetchSubscriptions = function (data, success) {
        var self = this;
        data.offset = this.subscriptions.length;
        return OneUser.fetchSubscriptions(self.id, data).done(function (subscriptions) {
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
 * @class CurrentUser
 * @extends OneUser
 */
CurrentUser = extending(OneUser, (function () {
    /**
     * @class FriendsActivitiesCollection
     * @extends UsersActivitiesCollection
     */
    var FriendsActivitiesCollection = extending(UsersActivitiesCollection, (function () {
        /**
         *
         * @constructs FriendsActivitiesCollection
         */
        function FriendsActivitiesCollection() {
        }

        /**
         *
         * @param {AJAXData} data
         * @param {AJAXCallback} [success]
         * @returns {jqPromise}
         */
        FriendsActivitiesCollection.fetch = function (data, success) {
            data = UsersActivitiesCollection.setDefaultData(data);
            data.fields = data.fields.merge(['user']);
            return __APP.SERVER.getData('/api/v1/users/feed', data, success);
        };

        return FriendsActivitiesCollection;
    }()));

    /**
     *
     * @constructs - Implements singleton
     * @augments OneUser
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
    CurrentUser.fetchFriends = function (data, success) {
        return __APP.SERVER.getData('/api/v1/users/friends', data, success);
    };
    /**
     *
     * @param {(Array|string)} [fields]
     * @param {AJAXCallback} [success]
     * @returns {jqPromise}
     */
    CurrentUser.prototype.fetchUser = function (fields, success) {
        var self = this,
            promise = OneUser.fetchUser('me', fields),
            afterAjax = function (data) {
                data = data instanceof Array ? data[0] : data;
                self.setData(data);
                if (success && typeof success == 'function') {
                    success.call(self, data);
                }
            };
        fields = setDefaultValue(fields, []);

        if (fields.hasOwnProperty('friends')) {
            return __APP.SERVER.multipleAjax(promise, this.fetchFriends(fields.friends)).done(function (user_data, friends_data) {
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
    CurrentUser.prototype.fetchFriends = function (ajax_data, success) {
        var self = this;
        ajax_data = $.extend(ajax_data, {
            offset: self.friends.length
        });
        return CurrentUser.fetchFriends(ajax_data, function (data) {
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
    CurrentUser.prototype.logout = function () {
        return $.ajax({
            url: '/index.php',
            data: {logout: true},
            complete: function () {
                window.location = '/';
            }
        });
    };
    /**
     *
     * @return {boolean}
     */
    CurrentUser.prototype.isLoggedOut = function () {
        return this.id === -1;
    };
    /**
     *
     * @param {(number|string)} [organization_id]
     * @param {AJAXCallback} [success]
     * @returns {(jqPromise|null)}
     */
    CurrentUser.prototype.subscribeToOrganization = function (organization_id, success) {
        var self = this;
        if (!self.subscriptions.has(organization_id)) {
            OneOrganization.fetchOrganization(organization_id, self.subscriptions_fields, function (organization) {
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
    CurrentUser.prototype.unsubscribeFromOrganization = function (organization_id, success) {
        var self = this;
        if (self.subscriptions.has(organization_id)) {
            return OneOrganization.unsubscribeOrganization(organization_id, function () {
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
UsersCollection = extending(EntitiesCollection, (function () {
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
     * @param {object} [additional_fields]
     * @return {(Array<OneUser>|UsersCollection|Array<object>)}
     */
    UsersCollection.getSpecificStaff = function (role, staff, additional_fields) {
        var specific_staff = [];
        staff.forEach(function (man) {
            if (man.role == role) {
                specific_staff.push($.extend(true, {
                    name: man.first_name + ' ' + man.last_name
                }, man, additional_fields))
            }
        });
        return specific_staff;
    };
    /**
     *
     * @param {UsersCollectionAJAXData} data
     * @param {AJAXCallback} [success]
     * @returns {jqPromise}
     */
    UsersCollection.fetchUsers = function (data, success) {
        return __APP.SERVER.getData('/api/v1/users/', data, success);
    };
    /**
     *
     * @param {(string|number)} event_id
     * @param {UsersCollectionAJAXData} ajax_data
     * @param {AJAXCallback} [success]
     * @returns {jqPromise}
     */
    UsersCollection.fetchEventFavorites = function (event_id, ajax_data, success) {
        return __APP.SERVER.getData('/api/v1/events/' + event_id, {fields: 'favored'.appendAjaxData(__APP.SERVER.validateData(ajax_data))}, function (data) {
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
    UsersCollection.fetchOrganizationSubscribers = function (org_id, ajax_data, success) {
        return __APP.SERVER.getData('/api/v1/organizations/' + org_id, {fields: 'subscribed'.appendAjaxData(__APP.SERVER.validateData(ajax_data))}, function (data) {
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
    UsersCollection.fetchOrganizationStaff = function (org_id, ajax_data, success) {
        return __APP.SERVER.getData('/api/v1/organizations/' + org_id + '/staff/', ajax_data, success);
    };
    /**
     * Returns specified staff by role. Mixing additional_fields if needed.
     * @param {OneUser.ROLE} role
     * @param {object} [additional_fields]
     * @return {(Array<OneUser>|UsersCollection|Array<Object>)}
     */
    UsersCollection.prototype.getSpecificStaff = function (role, additional_fields) {
        var specific_staff = [];
        this.forEach(function (man) {
            if (man.role == role) {
                specific_staff.push($.extend(true, {
                    name: man.first_name + ' ' + man.last_name
                }, man, additional_fields))
            }
        });
        return specific_staff;
    };
    /**
     *
     * @param {UsersCollectionAJAXData} [data]
     * @param {(number|string)} [length]
     * @param {AJAXCallback} [success]
     * @this Array<OneUser>
     * @returns {jqPromise}
     */
    UsersCollection.prototype.fetchUsers = function (data, length, success) {
        var self = this,
            ajax_data = $.extend(data, {
                offset: this.length,
                length: length
            });
        return UsersCollection.fetchUsers(ajax_data, function (data) {
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
    UsersCollection.prototype.fetchEventFavorites = function (event_id, length, data, success) {
        var self = this,
            ajax_data = $.extend({}, data, {
                offset: this.length,
                length: length
            });
        return UsersCollection.fetchEventFavorites(event_id, ajax_data, function (data) {
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
    UsersCollection.prototype.fetchOrganizationSubscribers = function (org_id, length, data, success) {
        var self = this,
            ajax_data = $.extend({}, data, {
                offset: this.length,
                length: length
            });
        return this.constructor.fetchOrganizationSubscribers(org_id, ajax_data, function (data) {
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
    UsersCollection.prototype.fetchOrganizationStaff = function (org_id, length, data, success) {
        var self = this,
            ajax_data = $.extend({}, data, {
                offset: this.length,
                length: length
            });
        return UsersCollection.fetchOrganizationStaff(org_id, ajax_data, function (data) {
            self.setData(data);
            if (success && typeof success == 'function') {
                success.call(self, data);
            }
        });
    };

    return UsersCollection;
})());

/**
 * @class Calendar
 */
Calendar = (function () {
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
    function Calendar($calendar, options) {
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
            if ($calendar.length === 0)
                throw new Error("Такого элемента не существует");
            else if ($calendar.length > 1)
                throw new Error("Элементов с заданным аргументов найдено несколько");
        }
        if ($calendar instanceof jQuery) {
            $.extend(true, this.options, options, $calendar.data());
            if (this.options.min_date !== false && this.options.max_date !== false && moment(this.options.max_date).diff(this.options.min_date, 'days') <= 0) {
                this.options.max_date = false;
            }
            if (this.options.weekday_selection === true || this.options.month_selection === true) {
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

    Calendar.prototype.flush = function () {
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

    Calendar.prototype.setMonth = function (month, year) {
        switch (month) {
            case 'prev': {
                this.current_month = this.current_month.add(-1, 'months');
                break;
            }
            case 'next': {
                this.current_month = this.current_month.add(1, 'months');
                break;
            }
            case 'current': {
                this.current_month = moment(new Date());
                break;
            }
            default: {
                this.current_month = year ? this.current_month.set({
                        'year': year,
                        'month': month - 1
                    }) : this.current_month.month(month - 1);
            }
        }
        this.renderTable();
        this.$calendar.trigger('month-changed');
        return this;
    };

    Calendar.prototype.destroyTable = function () {
        this.$calendar.find('.' + this.options.classes.th_class).removeClass(__C.CLASSES.ACTIVE).off('click');
        this.$calendar.find('.MonthName').removeClass(__C.CLASSES.ACTIVE).off('click');
        this.$calendar.find('.CalendarTableBody').remove();
        return this;
    };

    Calendar.prototype.setMonthName = function () {
        this.$calendar.find('.MonthName')
            .data('month', this.current_month.month())
            .text(this.current_month.format("MMMM YYYY").capitalize());
        return this;
    };

    Calendar.prototype.buildTable = function () {
        var $calendar_table = this.$calendar.find('.CalendarTable'),
            days_count = this.current_month.daysInMonth(),
            first_day_in_month = this.current_month.date(1).day(),
            last_day_in_month = this.current_month.date(days_count).day(),
            td_days = [],
            td_classes = [],
            this_day,
            this_moment,
            dataset = [];
        for (var name in this.options.additional_dataset) {
            if (this.options.additional_dataset.hasOwnProperty(name)) {
                dataset.push('data-' + name + '=' + this.options.additional_dataset[name]);
            }
        }
        for (var day = 1; day <= days_count; day++) {
            this.current_month.date(day);
            this_day = this.current_month.format(__C.DATE_FORMAT);
            this_moment = moment(this_day);

            td_classes = [
                this.options.classes.table_cell_class,
                this.options.classes.td_class,
                'Day_' + this_day,
                'DayOfWeek_' + this.current_month.day(),
                'DayOfMonth_' + this.current_month.month()
            ].concat(this.options.classes.td_additional_classes);
            if ((this.options.min_date !== false && !(this_moment.diff(this.options.min_date, 'd') >= 0) ) || (this.options.max_date !== false && !(this_moment.diff(this.options.max_date, 'd') <= 0)))
                td_classes.push(this.options.classes.td_disabled_class);
            if (this.current_month.format(__C.DATE_FORMAT) == this._today.format(__C.DATE_FORMAT))
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
        if (first_day_in_month != 1) {
            curr_month_clone.add(-1, 'months');
            curr_month_clone.date(curr_month_clone.daysInMonth());
            do {
                this_day = curr_month_clone.format(__C.DATE_FORMAT);
                this_moment = moment(this_day);
                td_classes = [
                    this.options.classes.table_cell_class,
                    this.options.classes.td_class,
                    'Day_' + this_day,
                    'DayOfWeek_' + curr_month_clone.day(),
                    'DayOfMonth_' + curr_month_clone.month(),
                    'not_this_month'
                ].concat(this.options.classes.td_additional_classes);
                if ((this.options.min_date !== false && !(this_moment.diff(this.options.min_date, 'd') >= 0) ) || (this.options.max_date !== false && !(this_moment.diff(this.options.max_date, 'd') <= 0)))
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
            } while (curr_month_clone.day() != 0);
        }

        if (last_day_in_month != 0) {
            curr_month_clone = this.current_month.clone();
            do {
                curr_month_clone.add(1, 'days');
                this_day = curr_month_clone.format(__C.DATE_FORMAT);
                this_moment = moment(this_day);
                td_classes = [
                    this.options.classes.table_cell_class,
                    this.options.classes.td_class,
                    'Day_' + this_day,
                    'DayOfWeek_' + curr_month_clone.day(),
                    'DayOfMonth_' + curr_month_clone.month(),
                    'not_this_month'
                ].concat(this.options.classes.td_additional_classes);
                if ((this.options.min_date !== false && !(this_moment.diff(this.options.min_date, 'd') >= 0) ) || (this.options.max_date !== false && !(this_moment.diff(this.options.max_date, 'd') <= 0)))
                    td_classes.push(this.options.classes.td_disabled_class);

                td_days.push(tmpl('calendar-div', {
                    td_classes: td_classes.join(' '),
                    number: curr_month_clone.date(),
                    day_number: curr_month_clone.day(),
                    date: curr_month_clone.format(__C.DATE_FORMAT),
                    date_text: curr_month_clone.format('DD MMMM YYYY'),
                    dataset: dataset.join(' ')
                }));
            } while (curr_month_clone.day() != 0);
        }
        var $tbody = $('<tbody>').addClass('CalendarTableBody'),
            tds_in_tr = 0,
            trs_count = 0,
            $trs = [tmpl('calendar-row', {tr_class: this.options.classes.tr_class})];
        for (var i = 0; i < td_days.length; i++) {
            if (tds_in_tr == 7) {
                $trs.push(tmpl('calendar-row', {tr_class: this.options.classes.tr_class}));
                tds_in_tr = 0;
                trs_count++;
            }
            $trs[trs_count].append(td_days[i]);
            tds_in_tr++;
        }
        $trs.forEach(function (item) {
            $tbody.append(item);
        });
        $calendar_table.append($tbody);
        return this;
    };

    Calendar.prototype.renderTable = function () {
        this
            .destroyTable()
            .buildTable()
            .activateSelectedDays()
            .setMonthName();

        if (!this.options.disable_selection) {
            switch (this.options.selection_type) {
                case Calendar.SELECTION_TYPES.MULTI: {
                    this.bindDragSelection();
                    break;
                }
                case Calendar.SELECTION_TYPES.SINGLE: {
                    this.bindDaySelection();
                    break;
                }
                default: {
                    break;
                }
            }

            if (this.options.weekday_selection === true) {
                this.bindWeekdaySelection();
            }
            if (this.options.month_selection === true) {
                this.bindMonthSelection();
            }
        }

        return this;
    };

    Calendar.prototype.selectToday = function () {
        this.$calendar.find('.' + this.options.classes.td_class + '.' + this.options.classes.today_class).addClass(__C.CLASSES.ACTIVE);
        return this;
    };

//TODO: Make formated days
//TODO: Make range selection
    Calendar.prototype.formatDays = function () {
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

        if (typeof this.formatted_days[month_num] === 'undefined') {
            this.formatted_days[month_num] = {};
            this.formatted_days[month_num].selected_days = [];
            this.formatted_days[month_num].month_name = genitive_month_names[_date.format('MMMM')];
        }

        this.formatted_days[month_num].selected_days.push(_date.format(__C.DATE_FORMAT));
        this.formatted_days[month_num].text = '';

        while (days_in_month) {
            console.log(this.formatted_days[month_num].selected_days);
            if (this.formatted_days[month_num].selected_days.indexOf(_day.format(__C.DATE_FORMAT)) !== -1) {
                this.formatted_days[month_num].text += '' + _day.format('D');
            }
            _day = _day.add(1, 'd');
            days_in_month--;
        }
        console.log(this.formatted_days[month_num].text);

        return this;
    };

    Calendar.prototype.selectDays = function (days) {
        var self = this;

        function select(day) {
            //var $this_day = self.$calendar.find('.Day_'+day);


            switch (self.options.selection_type) {
                case Calendar.SELECTION_TYPES.MULTI: {
                    if (self.selected_days.indexOf(day) === -1) {
                        self.selected_days.push(day);
                        self.selected_days.sort();
                    }
                    break;
                }
                default:
                case Calendar.SELECTION_TYPES.SINGLE: {
                    self.$calendar.find('.' + self.options.classes.td_class + '.' + __C.CLASSES.ACTIVE).removeClass(__C.CLASSES.ACTIVE);
                    self.selected_days = [day];
                    break;
                }
            }

            //self.prev_selected_day = self.now_selected_day;
            //self.now_selected_day = $this_day.data('date');
            //this.formatDays();

            self.$calendar.find('.Day_' + day).addClass(__C.CLASSES.ACTIVE);
        }


        if (Array.isArray(days)) {
            var removing_days = [];
            days.forEach(function (day) {
                if ((self.options.min_date !== false && !(moment(day).diff(self.options.min_date) >= 0) ) || (self.options.max_date !== false && !(moment(day).diff(self.options.max_date) <= 0))) {
                    removing_days.push(day);
                } else {
                    select(day);
                }
            });
            removing_days.forEach(function (day) {
                days.splice(days.indexOf(day), 1)
            })
        } else {
            if ((self.options.min_date !== false && !(moment(days).diff(self.options.min_date) >= 0) ) || (self.options.max_date !== false && !(moment(days).diff(self.options.max_date) <= 0))) {
                days = [];
            } else {
                select(days);
                days = [days];
            }
        }
        if (days.length) {
            self.last_action = 'select';
            self.last_selected_days = days;
            self.$calendar.trigger('days-changed');
        }
        return this;
    };

    Calendar.prototype.deselectDays = function (days) { // 2012-12-21
        var self = this;

        function deselect(day) {
            var $this_day = self.$calendar.find('.Day_' + day),
                $this_weekday = self.$calendar.find('.Week_' + $this_day.data('weekday')),
                $this_month_name = self.$calendar.find('.MonthName'),
                this_year = self.current_month.format('YYYY'),
                this_month_num = self.current_month.format('MM'),
                this_month = self.current_month.format('YYYY.MM'),
                this_weekday_pos;

            self.selected_days.splice(self.selected_days.indexOf(day), 1);
            self.selected_days.sort();

            if (self.selected_months.indexOf(this_month) !== -1) {
                $this_month_name.removeClass(__C.CLASSES.ACTIVE);
                self.selected_months.splice(self.selected_months.indexOf(this_month), 1);
            }

            if (typeof self.selected_weeks[this_year] !== 'undefined') {
                if (typeof self.selected_weeks[this_year][this_month_num] !== 'undefined') {
                    this_weekday_pos = self.selected_weeks[this_year][this_month_num].indexOf($this_day.data('weekday'));
                    if (this_weekday_pos !== -1) {
                        $this_weekday.removeClass(__C.CLASSES.ACTIVE);
                        self.selected_weeks[this_year][this_month_num].splice(this_weekday_pos, 1);
                    }
                }
            }
            self.$calendar.find('.Day_' + day).removeClass(__C.CLASSES.ACTIVE);
        }

        if (this.options.selection_type === Calendar.SELECTION_TYPES.MULTI) {
            if (Array.isArray(days)) {
                days.forEach(function (day) {
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

    Calendar.prototype.selectWeek = function (week) { // 0..6
        var self = this,
            $this_weekday = self.$calendar.find('.Week_' + week),
            $this_weekday_days = self.$calendar.find('.DayOfWeek_' + week).not('.not_this_month'),
            this_year = self.current_month.format('YYYY'),
            this_month = self.current_month.format('MM'),
            this_weekday_pos,
            days = [];

        $this_weekday_days.each(function (i) {
            days.push($this_weekday_days.eq(i).data('date'));
        });

        if (typeof self.selected_weeks[this_year] === 'undefined')
            self.selected_weeks[this_year] = {};
        if (typeof self.selected_weeks[this_year][this_month] === 'undefined')
            self.selected_weeks[this_year][this_month] = [];

        this_weekday_pos = self.selected_weeks[this_year][this_month].indexOf(week);

        if (this_weekday_pos === -1) {
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

    Calendar.prototype.selectMonth = function (month) { // 0..11
        var self = this,
            $this_month_name = self.$calendar.find('.MonthName'),
            $this_month_days = self.$calendar.find('.DayOfMonth_' + month),
            this_month = self.current_month.format('YYYY.MM'),
            this_month_pos = self.selected_months.indexOf(this_month),
            days = [];

        $this_month_days.each(function (i) {
            days.push($this_month_days.eq(i).data('date'));
        });

        if (this_month_pos === -1) {
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

    Calendar.prototype.bindMonthArrows = function () {
        var self = this;
        this.$calendar.find('.NextMonth').off('click.NextMonth').on('click.NextMonth', function () {
            self.setMonth('next');
        });
        this.$calendar.find('.PrevMonth').off('click.PrevMonth').on('click.PrevMonth', function () {
            self.setMonth('prev');
        });
        return this;
    };

    Calendar.prototype.bindDaySelection = function () {
        var self = this,
            $days_in_month = self.$calendar.find('.' + this.options.classes.td_class),
            $active_days = $days_in_month.not('.' + this.options.classes.td_disabled_class);
        $days_in_month.off('click.bindDaySelection');
        $active_days.on('click.bindDaySelection', function () {
            if (self.options.selection_type === Calendar.SELECTION_TYPES.MULTI && $(this).hasClass(__C.CLASSES.ACTIVE)) {
                self.deselectDays($(this).data('date'));
            } else {
                self.selectDays($(this).data('date'));
            }
        });
        return this;
    };

    Calendar.prototype.bindWeekdaySelection = function () {
        var self = this,
            $weekdays = self.$calendar.find('.' + this.options.classes.th_class);
        $weekdays.on('click', function () {
            self.selectWeek($(this).data('weekday'));
        });
        return this;
    };

    Calendar.prototype.bindMonthSelection = function () {
        var self = this,
            $this_month_name = self.$calendar.find('.MonthName');
        $this_month_name.on('click', function () {
            self.selectMonth($(this).data('month'));
        });
        return this;
    };

    Calendar.prototype.bindDragSelection = function () {
        var self = this;

        function selectDate($target) {
            $target = $target.is('.' + self.options.classes.td_class) ? $target : $target.closest('.' + self.options.classes.td_class);
            if ($target.not('.' + self.options.classes.td_disabled_class).length) {
                if ($target.hasClass(__C.CLASSES.ACTIVE)) {
                    self.deselectDays($target.data('date'));
                } else {
                    self.selectDays($target.data('date'));
                }
            }
        }

        function disableDragSelection() {
            self.$calendar.find('.' + self.options.classes.td_class).off('mouseenter.DragSelection');
        }

        self.$calendar
            .off('mousedown.RangeSelection')
            .on('mousedown.RangeSelection', function (e) {
                selectDate($(e.target));
                self.$calendar.find('.' + self.options.classes.td_class).not('.' + self.options.classes.td_disabled_class).on('mouseenter.DragSelection', function (e) {
                    e.preventDefault();
                    selectDate($(e.target));
                });
            })
            .on('mouseup', disableDragSelection)
            .on('mouseleave', disableDragSelection);
        return this;
    };

    Calendar.prototype.activateSelectedDays = function () {
        var self = this,
            this_year = self.current_month.format('YYYY'),
            this_month_num = self.current_month.format('MM');

        self.selected_days.forEach(function (day) {
            self.$calendar.find('.Day_' + day).addClass(__C.CLASSES.ACTIVE)
        });

        if (self.selected_months.indexOf(this_year + '.' + this_month_num) !== -1) {
            self.$calendar.find('.MonthName').addClass(__C.CLASSES.ACTIVE);
        }
        if (typeof self.selected_weeks[this_year] !== 'undefined') {
            if (typeof self.selected_weeks[this_year][this_month_num] !== 'undefined') {
                self.selected_weeks[this_year][this_month_num].forEach(function (weekday) {
                    self.$calendar.find('.Week_' + weekday).addClass(__C.CLASSES.ACTIVE);
                });
            }
        }
        return this;
    };

    Calendar.prototype.setDaysWithEvents = function () {
        var calendar = this,
            ajax_data = {
                since: calendar.current_month.startOf('month').format(__C.DATE_FORMAT),
                till: calendar.current_month.endOf('month').format(__C.DATE_FORMAT),
                length: 500,
                my: true,
                unique: true
            };
        calendar.$calendar.find('.feed_calendar_td').removeClass('Controller has_favorites').addClass(__C.CLASSES.DISABLED);
        DatesCollection.fetchDates(ajax_data, function (data) {
            data.forEach(function (day) {
                var $tr = calendar.$calendar.find('.Day_' + moment.unix(day.event_date).format(__C.DATE_FORMAT));
                $tr
                    .html(tmpl('link', {
                        title: $tr.children().text(),
                        classes: $tr.children().get(0).classList,
                        page: '/feed/day/' + $tr.data('date')
                    }))
                    .addClass(day.favorites_count > 0 ? 'has_favorites' : '')
                    .removeClass(__C.CLASSES.DISABLED);
            });
            calendar.bindDaySelection();
            bindPageLinks(calendar.$calendar);
        });
        return this;
    };

    Calendar.prototype.init = function () {
        this.$calendar.empty().append(tmpl('calendar', this.options.classes));
        if (this.options.weekday_selection) {
            this.$calendar.addClass('-weekday_selection');
        }
        if (this.options.month_selection) {
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
DatePicker = (function () {
    /**
     *
     * @param {(jQuery|Element|string)} $datepicker
     * @param {object} [options]
     * @constructor
     * @construct DatePicker
     */
    function DatePicker($datepicker, options) {
        this.options = {
            classes: {},
            close_on_pick: true,
            min_date: false,
            max_date: false,
            labels: {}
        };

        if ($datepicker instanceof Element || typeof $datepicker == 'string') {
            $datepicker = $($datepicker);
            if ($datepicker.length === 0)
                throw new Error('Такого элемента не существует');
            else if ($datepicker.length > 1)
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
    DatePicker.prototype.init = function () {
        var self = this;
        this
            .bindOpener()
            .$datepicker.data('datepicker', this)
            .data('instance', this);
        this.$datepicker.addClass('-unselectable -Handled_DatePicker');

        this.calendar.init().$calendar.on('days-changed', function () {
            self.prev_selected_day = self.selected_day;
            self.selected_day = self.calendar.selected_days.toString();
            self.formated_selected_day = self.calendar.selected_days.toString().split('-').reverse().join('.');
            if (!self.$datepicker.is('input')) {
                self.$datepicker.find('label').text(self.formated_selected_day);
            }
            self.$input.val(self.selected_day).trigger('change');

            if (self.options.close_on_pick) {
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
    DatePicker.prototype.bindOpener = function () {
        var self = this;

        function open() {
            if (self.$input.is(':disabled')) {
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
    DatePicker.prototype.openDialog = function () {
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
    DatePicker.prototype.bindCloseDialog = function () {
        var self = this;

        $(document)
            .off('click.checkOnClick')
            .on('click.checkOnClick', function (e) {
                var $this = $(e.target);
                if (($this.closest(self.$datepicker_modal).length === 0 && $this.closest(self.$datepicker).length === 0) || $this.closest('.SubmitDatePicker').length) {
                    self.closeDialog();
                }
            })
            .off('keydown.checkOnKeyDown')
            .on('keydown.checkOnKeyDown', function (e) {
                if (e.keyCode === 9 || e.keyCode === 13 || e.keyCode === 27) {
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
    DatePicker.prototype.closeDialog = function () {
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
    DatePicker.prototype.destroy = function () {
        this.closeDialog().$datepicker.data('datepicker', '');
        return this;
    };

    return DatePicker;
}());
/**
 * @class ImgLoader
 */
ImgLoader = (function () {
    /**
     *
     * @constructor
     * @construct ImgLoader
     */
    function ImgLoader() {
    }

    /**
     *
     * @type {?jQuery}
     */
    ImgLoader.current_load_context = null;
    /**
     *
     * @param {jQuery} [$parent]
     */
    ImgLoader.init = function ($parent) {
        $parent = $parent ? $parent : $('body');

        $parent.find('.ImgLoadWrap').each(function () {
            var $parent = $(this),
                $img_source = $parent.find('.ImgSrc'),
                $img_preview = $parent.find('.ImgPreview');


            $img_source.off('change.CroppedPreview').on('change.CroppedPreview', function () {
                $img_preview.attr('src', this.value);
            });

            if ($img_preview.attr('src')) {
                $parent.find('.CropperButton').removeClass(__C.CLASSES.HIDDEN);
            }

            $parent.find('.LoadImg').off('change.LoadImg').on('change.LoadImg', function (e) {
                var files = e.target.files,
                    reader;

                if (files.length == 0)
                    return false;

                for (var i = 0, file; file = files[i]; i++) {
                    reader = new FileReader();
                    reader.onload = (function (file) {
                        return function (onload_event) {
                            var data_url = onload_event.target.result;
                            ImgLoader.handleImgUpload($parent, data_url, file.name);
                        };
                    })(file);
                    reader.readAsDataURL(file);
                }
            });

            $parent.find('.LoadByURLButton').not('-Handled_LoadByURLButton').on('click.LoadByURL', function () {
                ImgLoader.current_load_context = $parent;
                socket.emit('image.getFromURL', $parent.find('.LoadByURLAddress').val());
                Pace.restart();
            }).addClass('-Handled_LoadByURLButton');

            $parent.find('.CropperButton').off('click.CallCropper').on('click.CallCropper', function () {
                ImgLoader.callImgCropper($parent, $parent.data('src') ? $parent.data('src') : $img_source.val());
            });

        });
    };
    /**
     * @param {jQuery} $context
     * @param {string} source
     * @return {CropperModal}
     */
    ImgLoader.callImgCropper = function ($context, source) {
        var $parent = $context.closest('.ImgLoadWrap'),
            $img_source = $parent.find('.ImgSrc'),
            cropper_modal = $parent.data('modal');

        if (cropper_modal && cropper_modal.image_src != source) {
            cropper_modal.destroy();
        }
        if (!cropper_modal || cropper_modal.image_src != source) {
            $parent.data('src', source);
            cropper_modal = new CropperModal(source, {
                'aspectRatio': eval($parent.data('aspect_ratio'))
            });
            $parent.data('modal', cropper_modal);
        }

        cropper_modal.show();

        cropper_modal.modal.on('crop', function (event, cropped_src) {
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
    ImgLoader.handleImgUpload = function ($context, source, filename) {
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
 * @abstract
 * @class ActionButton
 * @extends jQuery
 */
ActionButton = extendingJQuery((function () {
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
        $.each(ActionButton.STATES, function (field, state_name) {
            self.classes[state_name] = []
                .concat(self.options.icons ? self.options.icons[state_name] : [])
                .concat(self.options.colors ? self.options.colors[state_name] : [])
                .join(' ');
        });

        jQuery.fn.init.call(this, __APP.BUILD.button(this.is_checked ? {
                classes: this.options.classes.concat(this.classes[ActionButton.STATES.CHECKED]).concat(this.checked_state_class ? this.checked_state_class : []),
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
        var $wrapper = $context.closest('.' + __C.CLASSES.HOOKS.ADD_AVATAR.ANCESTOR),
            $collection = $wrapper.find('.' + __C.CLASSES.HOOKS.ADD_AVATAR.COLLECTION),
            $favored_count = $wrapper.find('.' + __C.CLASSES.HOOKS.ADD_AVATAR.QUANTITY),
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
            $collection.toggleClass(__C.CLASSES.HOOKS.ADD_AVATAR.STATES.SHIFT + ' ' + __C.CLASSES.HOOKS.ADD_AVATAR.STATES.SHIFTED);
        }
    }

    ActionButton.prototype.checked_state_class = '';
    ActionButton.prototype.icon_class = __C.CLASSES.ICON_CLASS;

    ActionButton.prototype.onClick = function () {
    };

    ActionButton.prototype.afterCheck = function () {
        var is_hovered = this.is(':hover');

        this.is_checked = true;
        this
            .removeClass(''.concat(this.classes[ActionButton.STATES.UNCHECKED_HOVER], ' ', this.classes[ActionButton.STATES.UNCHECKED]))
            .addClass(''.concat(this.classes[is_hovered ? ActionButton.STATES.CHECKED_HOVER : ActionButton.STATES.CHECKED], ' ', this.checked_state_class))
            .children('.' + __C.CLASSES.HOOKS.TEXT).text(this.options.labels[is_hovered ? ActionButton.STATES.CHECKED_HOVER : ActionButton.STATES.CHECKED]);
    };

    ActionButton.prototype.afterUncheck = function () {
        var is_hovered = this.is(':hover');

        this.is_checked = false;
        this
            .removeClass(''.concat(this.classes[ActionButton.STATES.CHECKED_HOVER], ' ', this.classes[ActionButton.STATES.CHECKED], ' ', this.checked_state_class))
            .addClass(''.concat(this.classes[is_hovered ? ActionButton.STATES.UNCHECKED_HOVER : ActionButton.STATES.UNCHECKED]))
            .children('.' + __C.CLASSES.HOOKS.TEXT).text(this.options.labels[is_hovered ? ActionButton.STATES.UNCHECKED_HOVER : ActionButton.STATES.UNCHECKED]);
    };


    ActionButton.prototype.initiate = function () {
        var self = this;

        this
            .on('mouseenter.HoverActionButton', function () {
                self
                    .removeClass(self.classes[self.is_checked ? ActionButton.STATES.CHECKED : ActionButton.STATES.UNCHECKED])
                    .addClass(self.classes[self.is_checked ? ActionButton.STATES.CHECKED_HOVER : ActionButton.STATES.UNCHECKED_HOVER]);
                self.children('.' + __C.CLASSES.HOOKS.TEXT).text(self.options.labels[self.is_checked ? ActionButton.STATES.CHECKED_HOVER : ActionButton.STATES.UNCHECKED_HOVER]);
            })

            .on('mouseleave.LeaveActionButton', function () {
                self
                    .removeClass(self.classes[self.is_checked ? ActionButton.STATES.CHECKED_HOVER : ActionButton.STATES.UNCHECKED_HOVER])
                    .addClass(self.classes[self.is_checked ? ActionButton.STATES.CHECKED : ActionButton.STATES.UNCHECKED]);
                self.children('.' + __C.CLASSES.HOOKS.TEXT).text(self.options.labels[self.is_checked ? ActionButton.STATES.CHECKED : ActionButton.STATES.UNCHECKED]);
            })

            .on('click.Action', function () {
                if (__APP.USER.isLoggedOut()) {
                    return (new AuthModal()).show();
                }
                self.onClick();

                if (self.is_add_avatar) {
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
AddToFavoriteButton = extending(ActionButton, (function () {
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

    AddToFavoriteButton.prototype.onClick = function () {
        var self = this;

        if (this.is_checked) {
            OneEvent.deleteFavored(this.event_id, function () {
                self.afterUncheck();
            });
        } else {
            OneEvent.addFavored(this.event_id, function () {
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
RegisterButton = extending(ActionButton, (function () {
    /**
     *
     * @param {OneEvent} event
     * @param {object} [options]
     * @constructor
     * @constructs RegisterButton
     *
     * @property {OneEvent} event
     * @property {RegistrationModal} modal
     */
    function RegisterButton(event, options) {
        this.options = {
            labels: {
                checked: 'Зарегистрирован',
                unchecked: 'Регистрация',
                checked_hover: 'Зарегистрирован',
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
                checked_hover: __C.CLASSES.ICONS.CHECK,
                unchecked_hover: __C.CLASSES.ICONS.PENCIL
            }
        };
        this.event = event;
        this.modal = null;
        options.is_checked = event.is_registered;
        ActionButton.call(this, options);
    }

    RegisterButton.prototype.checked_state_class = '-state_unselectable';

    RegisterButton.prototype.onClick = function () {
        var self = this;

        /**
         *
         * @param {RegistrationModal} modal
         * @param {RegisterButton} button
         */
        function bindOnRegister(modal, button) {
            modal.modal.on('registration:success', function () {
                modal.event.is_registered = true;
                button.afterCheck();
            });
        }

        if (this.event.is_registered || !this.event.registration_available) {
            this.off('click.RippleEffect').addClass('-Handled_RippleEffect');
            return false;
        }

        if (this.modal) {
            this.modal.show();
            bindOnRegister(this.modal, this);
        } else if (this.event.registration_fields.length) {
            this.modal = new RegistrationModal(this.event);
            this.modal.show();
            bindOnRegister(this.modal, this)
        } else {
            this.event.fetchEvent(new Fields('registration_fields')).done(function () {
                self.modal = new RegistrationModal(self.event);
                self.modal.show();
                bindOnRegister(self.modal, self)
            });
        }

    };

    RegisterButton.prototype.initiate = function () {
        if (this.event.registration_available) {
            ActionButton.prototype.initiate.call(this);
        } else {
            this.attr('disabled', true);
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
SubscribeButton = extending(ActionButton, (function () {
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

    SubscribeButton.prototype.onClick = function () {
        var self = this;
        if (self.is_checked) {
            __APP.USER.unsubscribeFromOrganization(self.org_id, function () {
                self.afterUncheck();
                $(window).trigger('unsubscribe', [self.org_id]);
            });
        } else {
            __APP.USER.subscribeToOrganization(self.org_id, function () {
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
ModalsCollection = extending(Array, (function () {
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
    ModalsCollection.prototype.push = function (modal) {
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
Modals = (function () {
    /**
     *
     * @class ModalDestroyer
     * @extends jQuery
     */
    var ModalDestroyer = extendingJQuery((function () {
        /**
         *
         * @param {(jQuery|Element|string)} element
         * @constructor
         * @constructs ModalDestroyer
         */
        function ModalDestroyer(element) {
            jQuery.fn.init.call(this, element);

            this.on('click.CloseModal', function () {
                AbstractModal.hideCurrent();
            });
        }

        /**
         *
         * @param {number} height
         * @return {number}
         */
        ModalDestroyer.prototype.adjustHeight = function (height) {
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
AbstractModal = (function () {
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
        get: function () {
            return AbstractModal.prototype.modal_wrapper.data('block_scroll');
        },
        set: function (value) {
            return AbstractModal.prototype.modal_wrapper.data('block_scroll', value);
        }
    });

    AbstractModal.hideCurrent = function () {
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
    AbstractModal.prototype.__render = function (props) {
        var $footer_buttons;

        switch (this.style) {
            case AbstractModal.STYLES.OK_ONLY: {
                $footer_buttons = __APP.BUILD.button({
                    classes: [__C.CLASSES.COLORS.PRIMARY, __C.CLASSES.SIZES.LOW, __C.CLASSES.HOOKS.CLOSE_MODAL, __C.CLASSES.HOOKS.RIPPLE],
                    title: 'OK'
                });
                break;
            }
            case AbstractModal.STYLES.OK_CANCEL: {
                $footer_buttons = __APP.BUILD.button({
                    classes: [__C.CLASSES.COLORS.PRIMARY, __C.CLASSES.SIZES.LOW, __C.CLASSES.HOOKS.CLOSE_MODAL, __C.CLASSES.HOOKS.RIPPLE],
                    title: 'OK'
                }, {
                    classes: [__C.CLASSES.COLORS.DEFAULT, __C.CLASSES.SIZES.LOW, __C.CLASSES.HOOKS.CLOSE_MODAL, __C.CLASSES.HOOKS.RIPPLE],
                    title: 'Отмена'
                });
                break;
            }
            case AbstractModal.STYLES.ABORT_RETRY_IGNORE: {
                $footer_buttons = __APP.BUILD.button({
                    classes: [__C.CLASSES.COLORS.MARGINAL_BUBBLEGUM, __C.CLASSES.SIZES.LOW, __C.CLASSES.HOOKS.CLOSE_MODAL, __C.CLASSES.HOOKS.RIPPLE],
                    title: 'Прервать'
                }, {
                    classes: [__C.CLASSES.COLORS.DEFAULT, __C.CLASSES.SIZES.LOW, __C.CLASSES.HOOKS.CLOSE_MODAL, __C.CLASSES.HOOKS.RIPPLE],
                    title: 'Повтор'
                }, {
                    classes: [__C.CLASSES.COLORS.DEFAULT, __C.CLASSES.SIZES.LOW, __C.CLASSES.HOOKS.CLOSE_MODAL, __C.CLASSES.HOOKS.RIPPLE],
                    title: 'Пропустить'
                });
                break;
            }
            case AbstractModal.STYLES.YES_NO_CANCEL: {
                $footer_buttons = __APP.BUILD.button({
                    classes: [__C.CLASSES.COLORS.MARGINAL_FRANKLIN, __C.CLASSES.SIZES.LOW, __C.CLASSES.HOOKS.CLOSE_MODAL, __C.CLASSES.HOOKS.RIPPLE],
                    title: 'Да'
                }, {
                    classes: [__C.CLASSES.COLORS.MARGINAL_BUBBLEGUM, __C.CLASSES.SIZES.LOW, __C.CLASSES.HOOKS.CLOSE_MODAL, __C.CLASSES.HOOKS.RIPPLE],
                    title: 'Нет'
                }, {
                    classes: [__C.CLASSES.COLORS.DEFAULT, __C.CLASSES.SIZES.LOW, __C.CLASSES.HOOKS.CLOSE_MODAL, __C.CLASSES.HOOKS.RIPPLE],
                    title: 'Отмена'
                });
                break;
            }
            case AbstractModal.STYLES.YES_NO: {
                $footer_buttons = __APP.BUILD.button({
                    classes: [__C.CLASSES.COLORS.MARGINAL_FRANKLIN, __C.CLASSES.SIZES.LOW, __C.CLASSES.HOOKS.CLOSE_MODAL, __C.CLASSES.HOOKS.RIPPLE],
                    title: 'Да'
                }, {
                    classes: [__C.CLASSES.COLORS.MARGINAL_BUBBLEGUM, __C.CLASSES.SIZES.LOW, __C.CLASSES.HOOKS.CLOSE_MODAL, __C.CLASSES.HOOKS.RIPPLE],
                    title: 'Нет'
                });
                break;
            }
            case AbstractModal.STYLES.RETRY_CANCEL: {
                $footer_buttons = __APP.BUILD.button({
                    classes: [__C.CLASSES.COLORS.DEFAULT, __C.CLASSES.SIZES.LOW, __C.CLASSES.HOOKS.CLOSE_MODAL, __C.CLASSES.HOOKS.RIPPLE],
                    title: 'Повтор'
                }, {
                    classes: [__C.CLASSES.COLORS.DEFAULT, __C.CLASSES.SIZES.LOW, __C.CLASSES.HOOKS.CLOSE_MODAL, __C.CLASSES.HOOKS.RIPPLE],
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
    AbstractModal.prototype.__init = function () {
        var self = this;

        function handleScrollToBottom(self) {
            if (!self.is_upload_disabled && !self.block_scroll) {
                self.block_scroll = true;
                self.onScrollToBottom(function () {
                    self.block_scroll = false;
                    self.adjustDestroyerHeight();
                });
            }
        }

        if (!this.is_rendered) {
            console.error('Modal has not been rendered yet');
            return this;
        }

        this.modal.find('.CloseModal').on('click.CloseModal', function () {
            AbstractModal.hideCurrent();
        });
        $(document).on('keyup.CloseModal', function (event) {
            if (event.keyCode == 27) {
                $(this).off('keyup.CloseModal');
                AbstractModal.hideCurrent();
            }
        });

        if (this.wrapper_is_scrollable && this.onScrollToBottom != AbstractModal.prototype.onScrollToBottom) {
            this.modal_wrapper.on('scroll', function () {
                if (self.modal_wrapper.height() + self.modal_wrapper.scrollTop() >= self.modal.height()) {
                    handleScrollToBottom(self);
                }
            });
        }

        if (this.content_is_scrollable) {
            this.content.scrollbar({
                onScroll: this.onScrollToBottom != AbstractModal.prototype.onScrollToBottom ? function (y) {
                        if (y.scroll == y.maxScroll) {
                            handleScrollToBottom(self);
                        }
                    } : undefined
            });

            this.modal.on('modal:disappear', function () {
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
    AbstractModal.prototype.__show = function () {
        var self = this;

        if (!this.is_rendered)
            return this.render().show();

        AbstractModal.hideCurrent();
        $('body').addClass('-open_modal');
        __APP.MODALS.active_modal = this;

        this.modal_wrapper.append(this.modal.addClass('-faded').removeClass(__C.CLASSES.HIDDEN));
        this.adjustDestroyerHeight();

        this.modal.trigger('modal:show');
        setTimeout(function () {
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
    AbstractModal.prototype.__hide = function () {
        var self = this;

        this.scrollTop = this.modal_wrapper.scrollTop();
        $(document).off('keyup.CloseModal');

        $('body').removeClass('-open_modal');

        __APP.MODALS.active_modal = undefined;

        this.modal.addClass('-faded');
        this.modal.trigger('modal:disappear');
        setTimeout(function () {
            self.modal.addClass(__C.CLASSES.HIDDEN).trigger('modal:close');
            self.is_shown = false;
        }, 200);

        return this;
    };

    /**
     * @param {Function} callback
     * @return {AbstractModal}
     */
    AbstractModal.prototype.onScrollToBottom = function (callback) {
        callback.call(this);

        return this;
    };
    /**
     *
     * @return {AbstractModal}
     */
    AbstractModal.prototype.adjustDestroyerHeight = function () {
        __APP.MODALS.modal_destroyer.adjustHeight(this.modal.outerHeight(true));

        return this;
    };
    /**
     *
     * @return {AbstractModal}
     */
    AbstractModal.prototype.render = function () {
        return this.__render();
    };
    /**
     * @return {AbstractModal}
     */
    AbstractModal.prototype.init = function () {
        return this.__init();
    };
    /**
     * @return {AbstractModal}
     */
    AbstractModal.prototype.show = function () {
        return this.__show();
    };
    /**
     *
     * @return {AbstractModal}
     */
    AbstractModal.prototype.hide = function () {
        return this.__hide();
    };
    /**
     * @protected
     * @return {AbstractModal}
     */
    AbstractModal.prototype.destroyNested = function () {
        return this;
    };
    /**
     *
     * @return {AbstractModal}
     */
    AbstractModal.prototype.destroy = function () {
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
AuthModal = extending(AbstractModal, (function () {
    /**
     *
     * @constructor
     * @constructs AuthModal
     */
    function AuthModal() {
        if (typeof AuthModal.instance === 'object') {
            return AuthModal.instance;
        }
        AbstractModal.call(this);
        this.content = tmpl('modal-auth-content', {
            heading: 'Войдите через социальную сеть, чтобы совершить это действие'
        });
        AuthModal.instance = this;
    }

    /**
     *
     * @return {AuthModal}
     */
    AuthModal.prototype.render = function () {
        this.__render({
            classes: ['-size_tiny'],
            content_classes: ['-align_center']
        });

        return this;
    };
    /**
     *
     * @return {AuthModal}
     */
    AuthModal.prototype.init = function () {
        this.modal.find('.AuthButton').each(function () {
            $(this).on('click', function (e) {
                var network = $(this).data('auth_network');
                if (yaCounter32442130) {
                    yaCounter32442130.reachGoal(network.toUpperCase() + 'AuthStart');
                }

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
CityChooseModal = extending(AbstractModal, (function () {
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
    CityChooseModal.prototype.show = function () {
        var self = this;

        if (!this.cities) {
            this.cities = new CitiesCollection();
            this.cities.fetchCities('timediff_seconds', 0, 'distance,local_name', function () {
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
    CityChooseModal.prototype.render = function () {
        this.content = tmpl('modal-city-choose-content', {
            cities: tmpl('option', this.cities.map(function (city) {
                return {
                    val: city.id,
                    display_name: city.local_name
                };
            }))
        });
        this.__render({
            width: 400
        });

        return this;
    };
    /**
     *
     * @return {CityChooseModal}
     */
    CityChooseModal.prototype.init = function () {
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
    CityChooseModal.prototype.hide = function () {
        __APP.USER.selected_city = this.cities.getByID(this.content.find('#city_choose_modal_select').val());
        localStorage.setItem('selected_city', JSON.stringify(__APP.USER.selected_city));
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
CropperModal = extending(AbstractModal, (function () {
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
    CropperModal.prototype.render = function () {
        var self = this,
            $image = this.content;

        this.__render({
            classes: ['-size_wide'],
            content_classes: ['-no_padding', 'img_holder'],
            footer_buttons: tmpl('button', [
                {classes: '-color_primary CropButton RippleEffect', title: 'Кадрировать'},
                {classes: '-color_default DestroyCropButton RippleEffect', title: 'Отмена'}
            ])
        });

        $image.on('load', function () {
            $image.cropper(self.options);
        }).attr('src', this.image_src);

        return this;
    };
    /**
     *
     * @return {CropperModal}
     */
    CropperModal.prototype.init = function () {
        var self = this;

        this.modal.find('.CropButton').on('click.Crop', function () {
            self.crop();
            self.hide();
        });
        this.modal.find('.DestroyCropButton').on('click.DestroyCrop', function () {
            self.hide();
        });

        return this;
    };
    /**
     * @protected
     * @return {CropperModal}
     */
    CropperModal.prototype.destroyNested = function () {
        this.content.cropper('destroy');
        this.modal.find('.CropButton').off('click.Crop');
        this.modal.find('.DestroyCropButton').off('click.DestroyCrop');

        return this;
    };
    /**
     *
     * @return {CropperModal}
     */
    CropperModal.prototype.crop = function () {
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
MapModal = extending(AbstractModal, (function () {
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
            this.content = tmpl('modal-map-content', {
                location: location
            });
        } else {
            throw Error('To initiate map you need to pass location (location)')
        }
    }

    /**
     *
     * @return {MapModal}
     */
    MapModal.prototype.render = function () {
        this.__render({
            classes: ['-size_wide'],
            content_classes: ['-no_padding']
        });

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
MediaModal = extending(AbstractModal, (function () {
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
            if (format == 'image') {
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
    MediaModal.prototype.render = function () {
        this.__render({
            classes: ['-size_responsive'],
            content_classes: ['img_holder', '-no_padding']
        });

        return this;
    };

    /**
     *
     * @return {MediaModal}
     */
    MediaModal.prototype.show = function () {
        var self = this;
        this.content.on('load', function () {
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
StdModal = extending(AbstractModal, (function () {
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
 * @requires ../Class.AbstractModal.js
 */
/**
 * @class PreviewRegistrationModal
 * @extends AbstractModal
 */
PreviewRegistrationModal = extending(AbstractModal, (function () {

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
    PreviewRegistrationModal.prototype.render = function () {
        var self = this;
        this.__render({
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
    PreviewRegistrationModal.prototype.init = function () {
        this.content.find('.RegisterButton').prop('disabled', true);
        this.__init();

        return this;
    };
    /**
     *
     * @param {RegistrationFieldModel} field
     * @return {jQuery}
     */
    PreviewRegistrationModal.prototype.buildRegistrationField = function (field) {
        return __APP.BUILD.formInput({
            id: 'registration_form_' + this.id + '_' + field.uuid,
            type: field.type === RegistrationFieldModel.TYPES.EXTENDED_CUSTOM ? 'textarea' : field.type,
            name: field.uuid,
            classes: ['Registration' + field.type.toCamelCase('_') + 'Field'],
            label: $('<span>' + field.label + '</span>').add((field.required ? tmpl('required-star') : $())),
            placeholder: field.label,
            required: field.required,
            helptext: (function (type) {
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
RegistrationModal = extending(PreviewRegistrationModal, (function () {

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
    RegistrationModal.prototype.init = function () {
        var self = this;

        this.content.find('.RegisterButton').on('click.Register', function () {
            var $register_button = $(this),
                $form = $register_button.closest('.RegistrationModalForm');

            $register_button.attr('disabled', true);
            if (isFormValid($form)) {
                OneEvent.registerToEvent(self.event.id, $form.serializeForm('array').map(function (field) {
                    return {
                        uuid: field.name,
                        value: field.value
                    };
                }))
                    .always(function () {
                        $register_button.removeAttr('disabled');
                    })
                    .done(function () {
                        self.modal.trigger('registration:success');
                        self.hide();
                    });
            } else {
                $register_button.removeAttr('disabled');
            }
        });

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
AbstractListModal = extending(AbstractModal, (function () {
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
    AbstractListModal.prototype.render = function () {
        this.__render({
            width: 384,
            height: 'calc(100% - 140px)',
            classes: ['-fixed'],
            content_classes: ['list_modal_content']
        });

        return this;
    };
    /**
     *
     * @abstract
     * @return {jqPromise}
     */
    AbstractListModal.prototype.uploadEntities = function () {
        return $.Deferred.resolve().promise();
    };
    /**
     *
     * @abstract
     * @param {EntitiesCollection} entities
     * @return {jQuery}
     */
    AbstractListModal.prototype.buildEntities = function (entities) {
        return $();
    };
    /**
     *
     * @return {AbstractListModal}
     */
    AbstractListModal.prototype.show = function () {
        var self = this;

        if (this.content.children().length) {
            this.__show();
            return this;
        }

        this.render();
        this.content.append(this.buildEntities(this.entities));

        if (this.entities.length < 5) {
            this.uploadEntities().done(function () {
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
    AbstractListModal.prototype.onScrollToBottom = function (callback) {
        var self = this,
            $loader = __APP.BUILD.loaderBlock(this.content);

        this.uploadEntities()
            .fail(function () {
                self.block_scroll = false;
            })
            .done(function () {
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
FriendsListModal = extending(AbstractListModal, (function () {
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
    FriendsListModal.prototype.uploadEntities = function () {
        var self = this;

        return __APP.USER.fetchFriends({length: 20}).done(function (friends) {
            if (friends.length) {
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
    FriendsListModal.prototype.buildEntities = function (entities) {
        var $blocks = __APP.BUILD.avatarBlocks(entities, {
            is_link: true,
            entity: 'user',
            avatar_classes: ['-size_40x40', '-rounded']
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
SubscriptionsListModal = extending(AbstractListModal, (function () {
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
    SubscriptionsListModal.prototype.uploadEntities = function () {
        var self = this;

        return this.entity.fetchSubscriptions({length: 20}).done(function (organizations) {
            if (organizations.length) {
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
    SubscriptionsListModal.prototype.buildEntities = function (entities) {
        var $blocks = __APP.BUILD.avatarBlocks(entities, {
            is_link: true,
            entity: 'organization',
            avatar_classes: ['-size_40x40', '-rounded']
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
 * @class
 * @abstract
 * @extends AbstractModal
 */
AbstractUsersModal = extending(AbstractModal, (function () {
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
    AbstractUsersModal.prototype.show = function () {
        var self = this;

        this.block_scroll = false;
        if (this.users.length) {
            this.__show();
            return this;
        }
        this.render();
        this.uploadUsers(function () {
            self.__show();
        });

        return this;
    };
    /**
     *
     * @return {AbstractUsersModal}
     */
    AbstractUsersModal.prototype.init = function () {
        bindPageLinks(this.modal);
        this.__init();

        return this;
    };
    /**
     *
     * @return {AbstractUsersModal}
     */
    AbstractUsersModal.prototype.onScrollToBottom = function (callback) {
        var self = this;

        this.uploadUsers(function () {
            callback.call(self);
        });

        return this;
    };
    /**
     *
     * @return {AbstractUsersModal}
     */
    AbstractUsersModal.prototype.hide = function () {
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
    AbstractUsersModal.prototype.uploadUsers = function (callback) {
    };
    /**
     *
     * @param {Array} users
     * @return {jQuery}
     */
    AbstractUsersModal.prototype.buildUsers = function (users) {
        var $users = $(),
            last_is_fiends = this.content_wrapper.find('.UserTombstone').eq(-1).data('is_friend') == 'true',
            self = this;

        users.forEach(function (user, i) {
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
    AbstractUsersModal.prototype.afterUpload = function (users) {
        var self = this,
            $new_users;
        if (users.length) {
            $new_users = this.buildUsers(users);
            this.content_wrapper.append($new_users);
            this.is_first = false;
            this.entities_length = 10;
            this.adjustDestroyerHeight();
            bindPageLinks($new_users);
            $new_users.on('click.hideModal', function () {
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
EditorsModal = extending(AbstractUsersModal, (function () {
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
    EditorsModal.prototype.uploadUsers = function (callback) {
        var self = this;

        return this.users.fetchOrganizationStaff(this.entity_id, this.entities_length, this.ajax_data, function (users) {
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
    EditorsModal.prototype.buildUsers = function (users) {
        var $users = $(),
            last_role = this.content_wrapper.find('.UserTombstone').last().data('role'),
            labels = {
                admin: 'Администраторы',
                moderator: 'Модераторы'
            },
            self = this;

        users.forEach(function (user, i) {
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
FavoredModal = extending(AbstractUsersModal, (function () {
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
    FavoredModal.prototype.uploadUsers = function (callback) {
        var self = this;

        return this.users.fetchEventFavorites(this.entity_id, this.entities_length, this.ajax_data, function (users) {
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
SubscribersModal = extending(AbstractUsersModal, (function () {
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
    SubscribersModal.prototype.uploadUsers = function (callback) {
        var self = this;

        return this.users.fetchOrganizationSubscribers(this.entity_id, this.entities_length, this.ajax_data, function (users) {
            self.afterUpload(users);
            if (callback && typeof callback == 'function') {
                callback(users);
            }
        });
    };

    return SubscribersModal;
}()));

/**
 * @abstract
 * @class
 */
AbstractTopBar = (function () {
    /**
     *
     * @constructor
     * @constructs AbstractTopBar
     */
    function AbstractTopBar() {
        this.$main_header = $('#main_header');
    }

    AbstractTopBar.prototype.init = function () {
        this.$main_header.find('#search_bar_input').on('keypress', function (e) {
            if (e.which == 13) {
                __APP.changeState('/search/' + encodeURIComponent(this.value));
            }
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
        this.$main_header.find('#user_bar').on('click.openUserBar', function () {
            var $this = $(this),
                $document = $(document);
            $this.addClass('-open');
            $document.on('click.closeUserBar', function (e) {
                if (!$(e.target).parents('#user_bar').length) {
                    $document.off('click.closeUserBar');
                    $this.removeClass('-open');
                }
            })
        });
        this.$main_header.find('.LogoutButton').on('click', __APP.USER.logout);
        this.$main_header.find('.OpenSettingsButton').on('click', showSettingsModal);
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
        this.$main_header.find('.LoginButton').on('click', function () {
            (new AuthModal()).show();
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

    AbstractSidebar.prototype.updateSubscriptions = function () {
    };

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
        $(window).on('subscribe unsubscribe', function () {
            self.updateSubscriptions();
        });

        AbstractSidebar.prototype.init.call(this);
    };

    Sidebar.prototype.updateSubscriptions = function () {
        var $subscribed_orgs = this.$subscribed_orgs,
            timing = 0,
            current_menu_items = $.map($subscribed_orgs.children(), function (el) {
                return $(el).data('organization_id');
            }),
            to_add = __APP.USER.subscriptions.filter(function (item) {
                return current_menu_items.indexOf(item.id) === -1;
            }),
            to_remove = current_menu_items.filter(function (item) {
                return !(__APP.USER.subscriptions.has(item));
            });

        if (to_add.length) {
            __APP.BUILD.organizationItems(to_add, {
                block_classes: ['animated'],
                avatar_classes: ['-size_30x30']
            })
                [($subscribed_orgs.length ? 'prependTo' : 'appendTo')]($subscribed_orgs)
                .each(function (i, org_block) {
                    setTimeout(function () {
                        $(org_block).addClass('-show');
                    }, timing += 100);
                });

            bindPageLinks($subscribed_orgs);
        }
        if (to_remove.length) {
            to_remove.forEach(function (id) {
                var $organization_item = $subscribed_orgs.find('.organization_item[data-organization_id="' + id + '"]').removeClass('-show');
                setTimeout(function () {
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
Page = (function () {
    /**
     *
     * @constructor
     * @constructs Page
     *
     * @property {string} name
     * @property {string} state_name
     * @property {string} page_title
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
        this.page_title = '';
        /**
         * @name Page#$view
         * @type jQuery
         */
        this.$view = $('.PageView');
        /**
         * @name Page#$wrapper
         * @type jQuery
         */
        this.$wrapper = $();
        this.wrapper_tmpl = 'std';
        this.with_header_tabs = false;

        this.rendering_defer = $.Deferred();
        this.fetching_data_defer = $.Deferred();
    }

    /**
     * Routing
     * @param {string} path
     * @return {Page}
     */
    Page.routeNewPage = function (path) {
        var path_split = decodeURIComponent(path).split('/').splice(1),
            pages_child = __APP.ROUTING,
            args = [], i, key, PageClass;

        for (i = 0; i < path_split.length; i++) {
            if (pages_child.hasOwnProperty(path_split[i])) {
                if (i < path_split.length - 1) {
                    pages_child = pages_child[path_split[i]];
                } else {
                    PageClass = pages_child[path_split[i]];
                    break;
                }
            } else {
                for (key in pages_child) {
                    if (key.indexOf('^') === 0 && (new RegExp(key)).test(path_split[i])) {
                        args.push(path_split[i]);
                        if (i < path_split.length - 1) {
                            pages_child = pages_child[key];
                        } else {
                            PageClass = pages_child[key];
                        }
                        break;
                    }
                }
            }
        }
        PageClass = PageClass ? PageClass : pages_child; // In case of trailing slash in url
        PageClass = PageClass.prototype instanceof Page ? PageClass : PageClass['']; // Open default page
        return new (Function.prototype.bind.apply(PageClass, [null].concat(args)))(); // new Page(...args)
    };

    Page.prototype.show = function () {
        var PAGE = this,
            $main_header = $('#main_header'),
            is_other_page = __APP.PREVIOUS_PAGE.wrapper_tmpl !== PAGE.wrapper_tmpl,
            wrapper_field = is_other_page ? '$view' : '$wrapper',
            $prev = __APP.PREVIOUS_PAGE[wrapper_field].length ? __APP.PREVIOUS_PAGE[wrapper_field] : is_other_page ? $('.PageView') : $('.PageView').find('.Content');

        if (PAGE.page_title) {
            __APP.changeTitle(PAGE.page_title);
        }
        $prev.addClass('-faded');

        setTimeout(function () {
            $prev.addClass(__C.CLASSES.HIDDEN);

            if (PAGE.with_header_tabs) {
                $main_header.addClass('-with_tabs');
            } else {
                $main_header.removeClass('-with_tabs');
            }

            $('body').removeClass(function (index, css) {
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

        $.when(PAGE.rendering_defer, PAGE.fetching_data_defer).done(function pageRender() {
            $(window).scrollTop(0);
            PAGE.render();
            bindPageLinks();
            setTimeout(function () {
                PAGE[wrapper_field].removeClass('-faded');
            }, 200);
        });
    };

    Page.prototype.fetchData = function () {
        return this.fetching_data_defer.resolve().promise();
    };

    Page.prototype.render = function () {
    };

    Page.prototype.destroy = function () {
    };

    return Page;
}());
/**
 * @requires ../../Class.Page.js
 */
/**
 *
 * @abstract
 * @class FeedPage
 * @extends Page
 */
FeedPage = extending(Page, (function () {
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

    FeedPage.prototype.bindFeedEvents = function ($parent) {
        trimAvatarsCollection($parent);
        bindRippleEffect($parent);
        bindDropdown($parent);
        __APP.MODALS.bindCallModal($parent);
        bindPageLinks($parent);

        $parent.find('.HideEvent').not('.-Handled_HideEvent').each(function () {
            var $this = $(this),
                $event = $this.parents('.FeedEvent'),
                event_id = $this.data("event-id");

            $this.on('click', function () {
                $event.addClass('-cancel');
                OneEvent.changeEventStatus(event_id, OneEvent.STATUS.HIDE, function () {
                    $event.after(tmpl('button', {
                        classes: '-color_neutral ReturnEvent',
                        title: 'Вернуть событие',
                        dataset: 'data-event-id="' + event_id + '"'
                    }));
                    $event.siblings('.ReturnEvent').not('.-Handled_ReturnEvent').on('click', function () {
                        var $remove_button = $(this);
                        OneEvent.changeEventStatus(event_id, OneEvent.STATUS.SHOW, function () {
                            $remove_button.remove();
                            $event.removeClass('-cancel');
                        });
                    }).addClass('-Handled_ReturnEvent');
                });
            });
        }).addClass('-Handled_HideEvent');
    };

    FeedPage.prototype.addNoEventsBlock = function () {
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
    FeedPage.prototype.appendEvents = function (success) {
        var PAGE = this;

        PAGE.block_scroll = true;
        return PAGE.events.fetchFeed(this.fields, this.next_events_length, function (events) {
            var $events = __APP.BUILD.eventCards(events);
            PAGE.block_scroll = false;
            if ($events.length) {
                PAGE.$wrapper.append($events);
                PAGE.bindFeedEvents($events);
                if (success && typeof success == 'function') {
                    success($events);
                }
            } else {
                PAGE.addNoEventsBlock();
                $(window).off('scroll.upload' + PAGE.constructor.name);
            }
        });
    };

    FeedPage.prototype.initFeedCalendar = function () {
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
        MainCalendar.$calendar.on('month-changed', function () {
            bindPageLinks(MainCalendar.$calendar);
            MainCalendar.setDaysWithEvents();
        });
    };

    FeedPage.prototype.render = function () {
        var PAGE = this,
            $window = $(window);

        if (!(__APP.PREVIOUS_PAGE instanceof FeedPage)) {
            PAGE.initFeedCalendar();
        }

        if (__APP.USER.isLoggedOut()) {
            __APP.renderHeaderTabs([
                {title: 'Актуальные', page: '/feed/actual'},
                {title: 'По времени', page: '/feed/timeline'}
            ]);

            if (window.location.pathname == '/feed/favored' || window.location.pathname == '/feed/recommendations') {
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
        PAGE.appendEvents(function () {
            $window.on('scroll.upload' + PAGE.constructor.name, function () {
                if ($window.height() + $window.scrollTop() + 200 >= $(document).height() && !PAGE.block_scroll) {
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
ActualEventsPage = extending(FeedPage, (function () {
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
DayEventsPage = extending(FeedPage, (function () {
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
FavoredEventsPage = extending(FeedPage, (function () {
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
FriendsEventsPage = extending(FeedPage, (function () {
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
RecommendedEventsPage = extending(FeedPage, (function () {
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
TimelineEventsPage = extending(FeedPage, (function () {
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
 * @requires ../Class.Page.js
 */
/**
 *
 * @abstract
 * @class StatisticsPage
 * @extends Page
 */
StatisticsPage = extending(Page, (function () {
    /**
     *
     * @constructor
     * @constructs StatisticsPage
     */
    function StatisticsPage() {
        Page.apply(this);
        this.state_name = 'statistics';
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
    StatisticsPage.prototype.areaChartSeriesNormalize = function (raw_data) {
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
                data: raw_data.map(function (line, i) {
                    return [moment.unix(line.time_value).valueOf(), line[value_field_name]];
                })
            }
        }


        $.each(raw_data, function (key, data) {
            output[key] = [];
            if (CONVERSATIONS.hasOwnProperty(key)) {
                output[key].push($.extend(true, {tooltip: {valueSuffix: ' %'}}, dataNormalize(data, key, 'value')));
                $.each(CONVERSATIONS[key], function (field_key, field) {
                    output[key].push($.extend(true, {}, HIDDEN_SERIES_OPTIONS, dataNormalize(data, field, field_key)));
                })
            }
            else if (COMPARISONS.hasOwnProperty(key)) {
                $.each(COMPARISONS[key], function (field_key, field) {
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
    StatisticsPage.prototype.buildAreaCharts = function (data, additional_options) {
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
                    positioner: function (labelWidth, labelHeight) {
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

        $.each(normalized_series, function (key) {
            var field_data = {
                title: {text: FIELDS[key].title}
            };

            field_data.series = normalized_series[key].map(function (series_unit, i) {
                if (series_unit.fillOpacity !== 0) {
                    return $.extend(true, {}, series_unit, {
                        fillColor: {
                            linearGradient: {x1: 0, x2: 0, y1: 0, y2: 1},
                            stops: FILL_COLORS.map(function (colors_set, j) {
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
    StatisticsPage.prototype.updateScoreboards = function ($scoreboards_wrapper, data, titles, order, size) {
        var with_dynamics = !!data.dynamics;
        if (!order)
            order = Object.keys(titles);

        order.forEach(function (field) {
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

    return StatisticsPage;
}()));
/**
 * @requires ../Class.StatisticsPage.js
 */
/**
 *
 * @class StatisticsEventPage
 * @extends StatisticsPage
 */
StatisticsEventPage = extending(StatisticsPage, (function () {
    /**
     *
     * @constructor
     * @constructs StatisticsEventPage
     * @param {(string|number)} event_id
     */
    function StatisticsEventPage(event_id) {
        StatisticsPage.apply(this, arguments);
        this.id = event_id;
        this.event = new OneEvent(this.id);
    }

    return StatisticsEventPage;
}()));
/**
 * @requires Class.StatisticsEventPage.js
 */
/**
 *
 * @class StatisticsEventAuditoryPage
 * @extends StatisticsEventPage
 */
StatisticsEventAuditoryPage = extending(StatisticsEventPage, (function () {
    /**
     *
     * @constructor
     * @constructs StatisticsEventAuditoryPage
     * @param {(string|number)} event_id
     */
    function StatisticsEventAuditoryPage(event_id) {
        StatisticsEventPage.apply(this, arguments);
    }

    StatisticsEventAuditoryPage.prototype.render = function () {
    };

    return StatisticsEventAuditoryPage;
}()));
/**
 * @requires Class.StatisticsEventPage.js
 */
/**
 *
 * @class StatisticsEventEditPage
 * @extends StatisticsEventPage
 */
StatisticsEventEditPage = extending(StatisticsEventPage, (function () {
    /**
     *
     * @constructor
     * @constructs StatisticsEventEditPage
     * @param {(string|number)} event_id
     */
    function StatisticsEventEditPage(event_id) {
        StatisticsEventPage.apply(this, arguments);
    }

    StatisticsEventEditPage.prototype.render = function () {
    };

    return StatisticsEventEditPage;
}()));
/**
 * @requires Class.StatisticsEventPage.js
 */
/**
 *
 * @class StatisticsEventOverviewPage
 * @extends StatisticsEventPage
 */
StatisticsEventOverviewPage = extending(StatisticsEventPage, (function () {
    /**
     *
     * @constructor
     * @constructs StatisticsEventOverviewPage
     * @param {(string|number)} event_id
     */
    function StatisticsEventOverviewPage(event_id) {
        StatisticsEventPage.apply(this, arguments);

        this.graphics_stats = new EventStatistics(this.id);
        this.scoreboards_stats = new EventStatistics(this.id);
    }

    StatisticsEventOverviewPage.prototype.fetchData = function () {
        return this.fetching_data_defer = this.event.fetchEvent([
            'image_horizontal_medium_url',
            'organization_short_name',
            'favored_users_count',
            'is_same_time',
            'dates'
        ]);
    };

    StatisticsEventOverviewPage.prototype.render = function () {
        var PAGE = this;

        if (__APP.USER.id === -1) {
            __APP.changeState('/feed/actual', true, true);
            return null;
        }
        __APP.changeTitle([{
            title: 'Организации',
            page: '/statistics'
        }, {
            title: this.event.organization_short_name,
            page: '/statistics/organization/' + this.event.organization_id
        }, this.event.title]);

        this.$wrapper.html(tmpl('eventstat-overview', $.extend(true, {}, this.event, {
            dates_block: tmpl('eventstat-overview-datetime', {
                date: displayDateRange(this.event.first_event_date, this.event.last_event_date),
                time: this.event.is_same_time ? displayTimeRange(this.event.dates[0].start_time, this.event.dates[0].end_time) : 'Разное время'
            })
        })));
        this.$wrapper.find('.EventStatAreaCharts').children('.AreaChart').html(tmpl('loader'));

        this.scoreboards_stats.fetchStatistics(Statistics.SCALES.OVERALL, false, ['notifications_sent', 'view', 'fave', 'view_detail', 'fave_conversion', 'open_conversion'], null, function (data) {
            var scoreboards_data = {numbers: {}};
            $.each(data, function (field, stats) {
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

        this.graphics_stats.fetchStatistics(Statistics.SCALES.DAY, moment(__APP.EVENDATE_BEGIN, 'DD-MM-YYYY').format(), ['notifications_sent', 'view', 'fave', 'view_detail', 'fave_conversion', 'open_conversion'], null, function (data) {
            PAGE.buildAreaCharts(data, {
                rangeSelector: {
                    selected: 1
                }
            });
        });

        __APP.MODALS.bindCallModal(PAGE.$wrapper);
        bindPageLinks(PAGE.$wrapper);
    };

    return StatisticsEventOverviewPage;
}()));
/**
 * @requires Class.StatisticsEventPage.js
 */
/**
 *
 * @class StatisticsEventPromotionPage
 * @extends StatisticsEventPage
 */
StatisticsEventPromotionPage = extending(StatisticsEventPage, (function () {
    /**
     *
     * @constructor
     * @constructs StatisticsEventPromotionPage
     * @param {(string|number)} event_id
     */
    function StatisticsEventPromotionPage(event_id) {
        StatisticsEventPage.apply(this, arguments);
    }

    StatisticsEventPromotionPage.prototype.render = function () {
    };

    return StatisticsEventPromotionPage;
}()));
/**
 * @requires ../Class.StatisticsPage.js
 */
/**
 * @abstract
 * @class StatisticsOrganizationPage
 * @extends StatisticsPage
 */
StatisticsOrganizationPage = extending(StatisticsPage, (function () {
    /**
     *
     * @param {(string|number)} org_id
     * @constructor
     * @constructs StatisticsOrganizationPage
     */
    function StatisticsOrganizationPage(org_id) {
        StatisticsPage.apply(this);
        this.id = org_id;
        this.organization = new OneOrganization(this.id);
        this.with_header_tabs = true;
    }

    StatisticsOrganizationPage.prototype.fetchData = function () {
        return this.fetching_data_defer = this.organization.fetchOrganization([
            'description',
            'img_medium_url',
            'default_address',
            'staff',
            'privileges',
            'events'.appendAjaxData({
                length: 3,
                future: true,
                is_canceled: true,
                is_delayed: true,
                fields: [
                    'organization_short_name',
                    'public_at'
                ],
                order_by: 'nearest_event_date'
            })
        ]);
    };

    StatisticsOrganizationPage.prototype.renderHeaderTabs = function () {
        __APP.renderHeaderTabs([
            {title: 'Обзор', page: '/statistics/organization/' + this.id + '/overview'},
            {title: 'События', page: '/statistics/organization/' + this.id + '/events'}
        ]);
    };

    return StatisticsOrganizationPage;
}()));
/**
 * @requires Class.StatisticsOrganizationPage.js
 */
/**
 *
 * @class StatisticsOrganizationAuditoryPage
 * @extends StatisticsOrganizationPage
 */
StatisticsOrganizationAuditoryPage = extending(StatisticsOrganizationPage, (function () {
    /**
     *
     * @param {(string|number)} org_id
     * @constructor
     * @constructs StatisticsOrganizationAuditoryPage
     */
    function StatisticsOrganizationAuditoryPage(org_id) {
        StatisticsOrganizationPage.apply(this, arguments);
    }

    StatisticsOrganizationAuditoryPage.prototype.render = function () {
    };

    return StatisticsOrganizationAuditoryPage;
}()));
/**
 * @requires Class.StatisticsOrganizationPage.js
 */
/**
 *
 * @class StatisticsOrganizationEventsPage
 * @extends StatisticsOrganizationPage
 */
StatisticsOrganizationEventsPage = extending(StatisticsOrganizationPage, (function () {
    /**
     *
     * @param {(string|number)} org_id
     * @constructor
     * @constructs StatisticsOrganizationAuditoryPage
     */
    function StatisticsOrganizationEventsPage(org_id) {
        StatisticsOrganizationPage.apply(this, arguments);

        this.block_scroll = false;
        this.future_events_data = {
            future: true,
            canceled_shown: true
        };
        this.past_events_data = {
            canceled_shown: true,
            order_by: '-first_event_date'
        };
        this.future_events = new EventsWithStatisticsCollection();
        this.past_events = new EventsWithStatisticsCollection();
    }

    StatisticsOrganizationEventsPage.buildEventRows = function (events, date_field) {
        var $events = tmpl('orgstat-events-row', events.map(function (event) {
            return $.extend({}, event, {
                date: moment.unix(event[date_field]).format(__LOCALES.ru_RU.DATE.DATE_FORMAT),
                timestamp: event[date_field],
                conversion: Math.round(event.view == 0 ? (event.view_detail * 100 / event).view : 0) + '%'
            });
        }));
        bindPageLinks($events);
        return $events;
    };

    StatisticsOrganizationEventsPage.prototype.fetchData = function () {
        return this.fetching_data_defer = this.organization.fetchOrganization([]);
    };

    StatisticsOrganizationEventsPage.prototype.render = function () {
        var this_page = this,
            $window = $(window),
            $past_events_wrapper,
            past_events_tablesort;

        if (__APP.USER.id === -1) {
            __APP.changeState('/feed/actual', true, true);
            return null;
        }

        this.renderHeaderTabs();
        __APP.changeTitle([{
            title: 'Организации',
            page: '/statistics'
        }, this.organization.short_name + ' - события']);

        this.$wrapper.html(tmpl('orgstat-events-page'));

        this.future_events.fetchOrganizationsEvents(this.organization.id, this.future_events_data, 0, function () {
            if (this.length) {
                this_page.$wrapper.find('.OrgStatFutureEventsWrapper').html(tmpl('orgstat-events-wrapper', {
                    title: 'Предстоящие события',
                    rows: StatisticsOrganizationEventsPage.buildEventRows(this_page.future_events, 'nearest_event_date')
                })).find('table').tablesort();
            }
        });

        this.past_events.fetchOrganizationsEvents(this.organization.id, this.past_events_data, 30, function () {
            if (this.length) {
                $past_events_wrapper = this_page.$wrapper.find('.OrgStatPastEventsWrapper');
                $past_events_wrapper.html(tmpl('orgstat-events-wrapper', {
                    title: 'Прошедшие события',
                    rows: StatisticsOrganizationEventsPage.buildEventRows(this_page.past_events, 'first_event_date')
                }));
                past_events_tablesort = $past_events_wrapper.find('table').tablesort();

                $window.on('scroll.uploadEvents', function () {
                    if ($window.height() + $window.scrollTop() + 200 >= $(document).height() && !this_page.block_scroll) {
                        this_page.block_scroll = true;

                        this_page.past_events.fetchOrganizationsEvents(this_page.organization.id, this_page.past_events_data, 30, function (events) {
                            this_page.block_scroll = false;
                            if (events.length) {
                                $past_events_wrapper.find('tbody').append(StatisticsOrganizationEventsPage.buildEventRows(events, 'first_event_date'));
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

    return StatisticsOrganizationEventsPage;
}()));
/**
 * @requires Class.StatisticsOrganizationPage.js
 */
/**
 *
 * @class StatisticsOrganizationOverviewPage
 * @extends StatisticsOrganizationPage
 */
StatisticsOrganizationOverviewPage = extending(StatisticsOrganizationPage, (function () {
    /**
     *
     * @param {(string|number)} org_id
     * @constructor
     * @constructs StatisticsOrganizationOverviewPage
     */
    function StatisticsOrganizationOverviewPage(org_id) {
        StatisticsOrganizationPage.apply(this, arguments);
        this.graphics_stats = new OrganizationsStatistics(this.id);
        this.other_stats = new OrganizationsStatistics(this.id);
    }

    /**
     *
     * @param {string} title
     * @param staff
     * @return {jQuery}
     */
    StatisticsOrganizationOverviewPage.buildStaffBlock = function (title, staff) {
        if (staff.length) {
            return tmpl('orgstat-overview-sidebar-wrapper-title', {title: title}).add(__APP.BUILD.avatarBlocks(staff, {
                avatar_classes: ['-size_40x40', '-rounded'],
                entity: 'user',
                is_link: true
            }));
        }
        return $();
    };

    StatisticsOrganizationOverviewPage.prototype.fetchData = function () {
        return this.fetching_data_defer = this.organization.fetchOrganizationWithEvents([
            'description',
            'img_medium_url',
            'default_address',
            'staff',
            'privileges'
        ], {
            length: 3,
            fields: [
                'organization_short_name',
                'public_at'
            ],
            is_delayed: true,
            filters: 'future=true,is_canceled=false',
            order_by: 'nearest_event_date'
        });
    };

    StatisticsOrganizationOverviewPage.prototype.buildAreaCharts = function () {
        var self = this;
        StatisticsPage.prototype.buildAreaCharts.call(self, {
            subscribe_unsubscribe: self.graphics_stats.subscribe.map(function (el, i) {
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

    StatisticsOrganizationOverviewPage.prototype.buildPieChart = function ($container, data) {
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
                        formatter: function () {
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
                labelFormatter: function () {
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
                data: raw_data.map(function (line, i) {
                    return {
                        name: line.name ? STD_NAMES[line.name] : STD_NAMES[line.gender],
                        y: line.count
                    }
                })
            }];
        }

        $container.highcharts($.extend(true, {}, this.highchart_defaults, pie_chart_options, {series: pieChartSeriesNormalize(data)}));
    };

    StatisticsOrganizationOverviewPage.prototype.render = function () {
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
            staffs_additional_fields = {
                is_link: true,
                avatar_classes: ['-size_40x40', '-rounded']
            },
            storage_data_name = 'org_stats_' + this.id + '_data',
            storage_until_name = 'org_stats_' + this.id + '_until',
            is_cached_data_actual = moment.unix(window.sessionStorage.getItem(storage_until_name)).isAfter(moment());

        if (__APP.USER.id === -1) {
            __APP.changeState('/feed/actual', true, true);
            return null;
        }

        if (!window.location.pathname.contains('overview')) {
            __APP.changeState(window.location.pathname + '/overview', true);
        }
        this.renderHeaderTabs();
        __APP.changeTitle([{
            title: 'Организации',
            page: '/statistics'
        }, this.organization.short_name]);

        this.$wrapper.html(tmpl('orgstat-overview', $.extend(true, {}, this.organization, {
            avatar_block: __APP.BUILD.avatarBlocks(this.organization, {
                entity: 'organization',
                block_classes: ['-stack']
            }),
            staff_block: StatisticsOrganizationOverviewPage.buildStaffBlock('Администраторы', this.organization.staff.getSpecificStaff(OneUser.ROLE.ADMIN, staffs_additional_fields))
                .add(StatisticsOrganizationOverviewPage.buildStaffBlock('Модераторы', this.organization.staff.getSpecificStaff(OneUser.ROLE.MODERATOR, staffs_additional_fields))),
            event_blocks: this.organization.events.length ? tmpl('orgstat-overview-sidebar-wrapper', {
                    content: tmpl('orgstat-overview-sidebar-wrapper-title', {title: 'Предстоящие события'})
                        .add(tmpl('orgstat-event-block', this.organization.events.map(function (event) {
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
            this.graphics_stats.setData(JSON.parse(window.sessionStorage.getItem(storage_data_name)));
            this.buildAreaCharts();
        } else {
            this.$wrapper.find('.OrgStatAreaCharts').children('.AreaChart').append(tmpl('loader'));
            this.graphics_stats.fetchStatistics(Statistics.SCALES.DAY, moment(__APP.EVENDATE_BEGIN, 'DD-MM-YYYY').format(), ['view', 'subscribe', 'unsubscribe', 'conversion'], null, function () {
                window.sessionStorage.setItem(storage_data_name, JSON.stringify(PAGE.graphics_stats));
                window.sessionStorage.setItem(storage_until_name, moment().add(15, 'm').unix());
                PAGE.buildAreaCharts();
            });
        }

        this.other_stats.fetchStatistics(Statistics.SCALES.OVERALL, false, ['subscribe', 'view', 'fave', 'conversion', 'audience'], stat_dynamics, function (stat_data) {
            var scoreboards_data = {numbers: {}, dynamics: {}};

            $.each(stat_data.dynamics, function (field, dynamics) {
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

    return StatisticsOrganizationOverviewPage;
}()));
/**
 * @requires Class.StatisticsOrganizationPage.js
 */
/**
 *
 * @class StatisticsOrganizationPromotionPage
 * @extends StatisticsOrganizationPage
 */
StatisticsOrganizationPromotionPage = extending(StatisticsOrganizationPage, (function () {
    /**
     *
     * @param {(string|number)} org_id
     * @constructor
     * @constructs StatisticsOrganizationPromotionPage
     */
    function StatisticsOrganizationPromotionPage(org_id) {
        StatisticsOrganizationPage.apply(this, arguments);
    }

    StatisticsOrganizationPromotionPage.prototype.render = function () {
    };

    return StatisticsOrganizationPromotionPage;
}()));
/**
 * @requires Class.StatisticsOrganizationPage.js
 */
/**
 *
 * @class StatisticsOrganizationSettingsPage
 * @extends StatisticsOrganizationPage
 */
StatisticsOrganizationSettingsPage = extending(StatisticsOrganizationPage, (function () {
    /**
     *
     * @param {(string|number)} org_id
     * @constructor
     * @constructs StatisticsOrganizationSettingsPage
     */
    function StatisticsOrganizationSettingsPage(org_id) {
        StatisticsOrganizationPage.apply(this, arguments);
    }

    StatisticsOrganizationSettingsPage.prototype.render = function () {
    };

    return StatisticsOrganizationSettingsPage;
}()));
/**
 * @requires Class.StatisticsOrganizationPage.js
 */
/**
 *
 * @class StatisticsOrganizationSupportPage
 * @extends StatisticsOrganizationPage
 */
StatisticsOrganizationSupportPage = extending(StatisticsOrganizationPage, (function () {
    /**
     *
     * @param {(string|number)} org_id
     * @constructor
     * @constructs StatisticsOrganizationSupportPage
     */
    function StatisticsOrganizationSupportPage(org_id) {
        StatisticsOrganizationPage.apply(this, arguments);
    }

    StatisticsOrganizationSupportPage.prototype.render = function () {
    };

    return StatisticsOrganizationSupportPage;
}()));
/**
 * @requires ../Class.Page.js
 */
/**
 *
 * @class OnboardingPage
 * @extends Page
 */
OnboardingPage = extending(Page, (function () {
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
        this.is_upload_disabled = false;
        this.block_scroll = true;
    }

    OnboardingPage.prototype.init = function () {
        bindRippleEffect(this.$wrapper);
        bindPageLinks(this.$wrapper);
        this.$wrapper.find('.Link').on('click', function () {
            if ($(this).is('.SkipOnboarding')) {
                cookies.setItem('skip_onboarding', 1, moment().add(7, 'd')._d);
            }
            __APP.SIDEBAR.updateSubscriptions();
        });
    };

    OnboardingPage.prototype.bindSubscriptions = function () {
        this.$wrapper.find(".OnboardingOrgItem").not('.-Handled_OnboardingOrgItem').on('click', function () {
            var $this = $(this);
            if ($this.hasClass(__C.CLASSES.ACTIVE)) {
                __APP.USER.unsubscribeFromOrganization($this.data("organization_id"));
            } else {
                __APP.USER.subscribeToOrganization($this.data("organization_id"));
            }
            $this.toggleClass(__C.CLASSES.ACTIVE);
        }).addClass('-Handled_OnboardingOrgItem');
    };

    OnboardingPage.prototype.render = function () {
        var PAGE = this,
            $loader = tmpl('loader', {});

        if (__APP.USER.id === -1) {
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
            onScroll: function (y, x) {
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
SearchPage = extending(Page, (function () {
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
    SearchPage.buildOrganizationItems = function (organizations) {
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
    SearchPage.buildEventCards = function (events) {
        var $events = $();
        if (events.length == 0) {
            $events = tmpl('search-no-events', {});
        } else {
            events.forEach(function (event) {
                if (event.nearest_event_date == undefined && !this.past_events) {
                    $events = $events.add(tmpl('divider', {title: 'Прошедшие события'}));
                    this.past_events = true;
                }
                $events = $events.add(__APP.BUILD.eventCards(event));
            });
        }
        return $events
    };

    SearchPage.prototype.fetchData = function () {
        return this.fetching_data_defer = this.search_results.fetchEventsAndOrganizations(this.events_ajax_data, this.organizations_ajax_data);
    };

    SearchPage.prototype.init = function () {
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
            onScroll: function (y) {
                if (y.scroll == y.maxScroll) {
                    PAGE.search_results.fetchOrganizations(PAGE.organizations_ajax_data, function (organizations) {
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
        $window.on('scroll.upload' + PAGE.constructor.name, function () {
            if ($window.height() + $window.scrollTop() + 200 >= $(document).height() && !PAGE.block_scroll) {
                PAGE.block_scroll = true;
                PAGE.search_results.fetchEvents(PAGE.events_ajax_data, function (events) {
                    var $events;
                    if (events.length) {
                        $events = SearchPage.buildEventCards(events);
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

    SearchPage.prototype.render = function () {
        var data = {};

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

    return SearchPage;
}()));
/**
 * @requires ../Class.Page.js
 */
/**
 *
 * @class RedactEventPage
 * @extends Page
 */
RedactEventPage = extending(Page, (function () {
    /**
     *
     * @param {(string|number)} [event_id]
     * @constructor
     * @constructs RedactEventPage
     */
    function RedactEventPage(event_id) {
        Page.apply(this);
        this.page_title = 'Редактирование события';
        this.event = new OneEvent(event_id);
        this.state_name = 'edit_event';
    }


    RedactEventPage.lastRegistrationCustomFieldId = 0;

    /**
     *
     * @param {RegistrationFieldModel|Array<RegistrationFieldModel>|RegistrationFieldsCollection} [registration_data]
     * @return {jQuery}
     */
    RedactEventPage.buildRegistrationCustomField = function (registration_data) {
        registration_data = registration_data ? (registration_data instanceof Array ? registration_data : [registration_data]) : [{}];
        var $fields;

        $fields = tmpl('edit-event-registration-custom-field', registration_data.filter(function (data) {
            if (RegistrationFieldModel.isCustomField(data)) {
                data.id = data.id ? data.id : RedactEventPage.lastRegistrationCustomFieldId++;
                return true;
            }
            return false;
        }));
        registration_data.forEach(function (data) {
            if (data.required) {
                $fields.find('#edit_event_registration_' + data.id + '_custom_field_required').prop('checked', true);
            }
            if (data.type) {
                $fields.find('#edit_event_registration_' + data.id + '_custom_field_' + data.type + '_type').prop('checked', true);
            }
        });
        $fields.find('.RemoveRegistrationCustomField').on('click.RemoveRegistrationCustomField', function () {
            $(this).closest('.RegistrationCustomField').remove();
        });
        $fields.find('.RegistrationCustomFieldLabel, .RegistrationCustomFieldType').on('change.RemoveRegistrationFieldUUID', function () {
            $(this).closest('.RegistrationCustomField').find('.RegistrationCustomFieldUUID').val('');
        });

        return $fields;
    };

    RedactEventPage.prototype.fetchData = function () {
        if (this.event.id) {
            return this.fetching_data_defer = this.event.fetchEvent(EventPage.fields);
        }
        return Page.prototype.fetchData.call(this);
    };

    RedactEventPage.prototype.init = function () {
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
            if ($input.is('input')) {
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
                if ($input.length) {
                    convertToNumericInput($input);
                }
            }
        }

        bindDatePickers(PAGE.$wrapper);
        bindTimeInput(PAGE.$wrapper);
        bindSelect2(PAGE.$wrapper);
        bindTabs(PAGE.$wrapper);
        bindControlSwitch(PAGE.$wrapper);
        __APP.MODALS.bindCallModal(PAGE.$wrapper);
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
                $parent.find('.RemoveRow').not('.-Handled_RemoveRow').each(function (i, elem) {
                    $(elem).on('click', function () {
                        MainCalendar.deselectDays($(this).closest('tr').data('date'));
                    }).addClass('-Handled_RemoveRow');
                });
            }

            function displayFormattedText() {
                dates = {};
                MainCalendar.selected_days.forEach(function (date, i, days) {
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
                    $.each(dates, function (i, elem) {
                        $selected_days_text.append($('<p>').text(elem.selected_days.join(', ') + ' ' + elem.month_name))
                    });
                } else {
                    $selected_days_text.html('<p>Даты не выбраны</p>');
                }
            }

            function doTheFuckingSort($rows, $parent) {
                $rows.sort(function (a, b) {
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
                    selected_days.forEach(function (day) {
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
                $output.find('.DatePicker').each(function () {
                    var DP = $(this).data('datepicker');
                    DP.$datepicker.on('date-picked', function () {
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
                        MainCalendar.last_selected_days.forEach(function (day) {
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

            AddRowDatePicker.$datepicker.on('date-picked', function () {
                MainCalendar.selectDays(AddRowDatePicker.selected_day);
            });

        })();
        (function initOrganization(selected_id) {
            OrganizationsCollection.fetchMyOrganizations(['admin', 'moderator'], {fields: ['default_address']}, function (data) {
                var $wrapper = $('.EditEventOrganizations'),
                    organizations_options = $(),
                    $default_address_button = PAGE.$wrapper.find('.EditEventDefaultAddress'),
                    $select = $wrapper.find('#edit_event_organization'),
                    selected_address;

                data.forEach(function (organization) {
                    if (organization.id == selected_id) {
                        selected_address = organization.default_address;
                    }
                    organizations_options = organizations_options.add(tmpl('option', {
                        val: organization.id,
                        data: "data-image-url='" + organization.img_url + "' data-default-address='" + organization.default_address + "'",
                        display_name: organization.name
                    }));
                });

                $select.append(organizations_options).select2({
                    containerCssClass: 'form_select2',
                    dropdownCssClass: 'form_select2_drop'
                }).on('change', function () {
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
            createSearchChoice: function (term, data) {
                if ($(data).filter(function () {
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
                data: function (term, page) {
                    return {
                        name: term // search term
                    };
                },
                results: function (data) {
                    var _data = [];
                    data.data.forEach(function (value) {
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

        PAGE.$wrapper.find('.EditEventDefaultAddress').off('click.defaultAddress').on('click.defaultAddress', function () {
            var $this = $(this);
            $this.closest('.form_group').find('input').val($this.data('default_address')).trigger('input');
        });

        PAGE.$wrapper.find('#edit_event_is_online').off('change.OnlineEvent').on('change.OnlineEvent', function () {
            PAGE.$wrapper.find('#edit_event_placepicker').prop('required', !$(this).prop('checked'));
        });

        PAGE.$wrapper.find('#edit_event_free').off('change.FreeEvent').on('change.FreeEvent', function () {
            PAGE.$wrapper.find('.MinPrice').toggleStatus('disabled');
        });

        convertToNumericInput(PAGE.$wrapper.find('.MinPrice'));
        convertToNumericInput(PAGE.$wrapper.find('#edit_event_registration_limit_count'));

        PAGE.$wrapper.find('.AddRegistrationCustomField').off('click.AddRegistrationCustomField').on('click.AddRegistrationCustomField', function () {
            RedactEventPage.buildRegistrationCustomField().insertBefore($(this));
        });

        PAGE.$wrapper.find('.RegistrationPreview').on('click.RegistrationPreview', function () {
            var form_data = $(this).closest('form').serializeForm(),
                event = new OneEvent(),
                modal;

            form_data.registration_fields = (new RegistrationFieldsCollection()).setData(form_data.registration_fields.sort().map(function (field) {
                return {
                    uuid: guid(),
                    type: form_data['registration_' + field + '_field_type'],
                    label: form_data['registration_' + field + '_field_label'] || RegistrationFieldModel.DEFAULT_LABEL[form_data['registration_' + field + '_field_type'].toUpperCase()],
                    required: form_data['registration_' + field + '_field_required']
                };
            }));
            event.setData(form_data);

            modal = new PreviewRegistrationModal(event);
            modal.show();
        });

        $main_tabs.on('change.tabs', function () {
            if ($main_tabs.currentTabsIndex === 0) {
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

        $next_page_button.off('click.nextPage').on('click.nextPage', function () {
            $main_tabs.nextTab();
        });

        $prev_page_button.off('click.nextPage').on('click.prevPage', function () {
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
                is_form_valid;

            is_form_valid = (function validation($form, Calendar) {
                var is_valid = true,
                    $times = $form.find('#edit_event_different_time').prop('checked') ? $form.find('[class^="TableDay_"]') : $form.find('.MainTime');

                function failSubmit($element, is_form_valid, error_message) {
                    var $cut_tab,
                        $Tabs;
                    if (is_form_valid) {
                        $cut_tab = $element.parents('.TabsBody:last');
                        $Tabs = $cut_tab.closest('.Tabs').resolveInstance();
                        $Tabs.setToTab($Tabs.find('.TabsBodyWrapper:first').children().index($cut_tab));
                        scrollTo($element, 400, function () {
                            showNotifier({text: error_message, status: false});
                        });
                    }
                    handleErrorField($element);
                    return false;
                }

                $form.find(':required').not($form.find(':disabled')).each(function () {
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

                $times.each(function () {
                    var $row = $(this),
                        $inputs = $row.find('.StartHours, .StartMinutes, .EndHours, .EndMinutes'),
                        start = $row.find('.StartHours').val().trim() + $row.find('.StartMinutes').val().trim(),
                        end = $row.find('.EndHours').val().trim() + $row.find('.EndMinutes').val().trim();

                    $inputs.each(function () {
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
                    $form.find('.DataUrl').each(function () {
                        var $this = $(this);
                        if ($this.val().trim() === "") {
                            is_valid = failSubmit($this.closest('.ImgLoadWrap'), is_valid, 'Пожалуйста, добавьте к событию обложку');
                        }
                    });
                }

                return is_valid;
            })($form, MainCalendar);

            function afterSubmit() {
                __APP.changeState('/event/' + PAGE.event.id);
            }

            function onError(e) {
                PAGE.$wrapper.removeClass('-faded');
                console.error(e);
                console.log({
                    MainCalendar: MainCalendar,
                    send_data: send_data,
                    form_data: form_data
                });
            }

            if (is_form_valid) {

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
                            send_data.registration_fields = (new RegistrationFieldsCollection()).setData(form_data.registration_fields.map(function (id) {
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

                    if (form_data.tags) {
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
                        PAGE.$wrapper.find('.SelectedDaysRows').children().each(function (i, row) {
                            var $row = $(row);
                            send_data.dates.push((new DateModel()).setData({
                                event_date: $row.find('.DatePicker').data('selected_day'),
                                start_time: $row.find('.StartHours').val() + ':' + $row.find('.StartMinutes').val(),
                                end_time: $row.find('.EndHours').val() + ':' + $row.find('.EndMinutes').val()
                            }));
                        });
                    } else {
                        MainCalendar.selected_days.forEach(function (day) {
                            send_data.dates.push((new DateModel()).setData({
                                event_date: day,
                                start_time: form_data.start_hours + ':' + form_data.start_minutes,
                                end_time: form_data.end_hours + ':' + form_data.end_minutes
                            }));
                        });
                    }
                    send_data.dates = send_data.dates.getArrayCopy();

                    PAGE.$wrapper.addClass('-faded');

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

    RedactEventPage.prototype.render = function () {
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
                    {
                        id: RedactEventPage.lastRegistrationCustomFieldId++,
                        type: 'email',
                        name: 'E-mail',
                        description: 'Текстовое поле для ввода адреса электронной почты'
                    },
                    {
                        id: RedactEventPage.lastRegistrationCustomFieldId++,
                        type: 'first_name',
                        name: 'Имя',
                        description: 'Текстовое поле для ввода имени'
                    },
                    {
                        id: RedactEventPage.lastRegistrationCustomFieldId++,
                        type: 'last_name',
                        name: 'Фамилия',
                        description: 'Текстовое поле для ввода фамилии'
                    },
                    {
                        id: RedactEventPage.lastRegistrationCustomFieldId++,
                        type: 'phone_number',
                        name: 'Номер телефона',
                        description: 'Текстовое поля для ввода номера телефона'
                    }
                ])
            };

        function resolveFilenameFromURL(url) {
            return url ? url.split('/').reverse()[0] : '';
        }


        if (__APP.USER.id === -1) {
            __APP.changeState('/feed/actual', true, true);
            return null;
        }
        if (window.location.pathname.contains('event/add')) {
            if (this.organization_id) {
                __APP.changeState('/add/event/to/' + this.organization_id, true, true);
            } else {
                __APP.changeState('/add/event', true, true);
            }
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
        console.log(page_vars);

        PAGE.$wrapper.html(tmpl('edit-event-page', $.extend(page_vars, {
            date_picker: tmpl('edit-event-datepicker', {
                today: page_vars.current_date
            }),
            cover_picker: tmpl('edit-event-cover-picker', {
                image_horizontal_url: PAGE.event.image_horizontal_url,
                image_horizontal_filename: resolveFilenameFromURL(PAGE.event.image_horizontal_url)
            }),
            registration: tmpl('edit-event-registration', registration_props)
        })));

        PAGE.init();

        if (page_vars.public_at != null) {
            PAGE.$wrapper.find('#edit_event_delayed_publication').prop('checked', true).trigger('change');
        }

        if (is_edit) {
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

                raw_dates.forEach(function (date) {
                    date.event_date = moment.unix(date.event_date).format('YYYY-MM-DD');
                    dates.push(date.event_date);
                });
                MainCalendar.selectDays(dates);
                raw_dates.forEach(function (date) {
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
                tags.forEach(function (tag) {
                    selected_tags.push({
                        id: parseInt(tag.id),
                        text: tag.name
                    });
                });

                $view.find('#event_tags').select2('data', selected_tags);
            })(PAGE.$wrapper, PAGE.event.tags);

            if (PAGE.event.image_horizontal_url) {
                toDataUrl(PAGE.event.image_horizontal_url, function (base64_string) {
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
                    PAGE.$wrapper.find('.AddRegistrationCustomField').before(RedactEventPage.buildRegistrationCustomField(page_vars.registration_fields.filter(function (field) {
                        var is_custom_field = RegistrationFieldModel.isCustomField(field);
                        if (!is_custom_field) {
                            PAGE.$wrapper.find('#edit_event_registration_' + field.type + '_field_uuid').val(field.uuid);
                            PAGE.$wrapper.find('#edit_event_registration_' + field.type + '_field_enable').prop('checked', true).trigger('change');
                            if (field.required) {
                                PAGE.$wrapper.find('#edit_event_registration_' + field.type + '_field_required').prop('checked', true);
                            }
                        }

                        return is_custom_field;
                    })));
                }
            }
            if (page_vars.public_at == null) {
                PAGE.$wrapper.find('#edit_event_delayed_publication').toggleStatus('disabled');
            }
        }
    };

    return RedactEventPage;
}()));
/**
 * @requires Class.RedactEventPage.js
 */
/**
 *
 * @class AddEventPage
 * @extends RedactEventPage
 */
AddEventPage = extending(RedactEventPage, (function () {
    /**
     *
     * @param {(string|number)} [org_id]
     * @constructor
     * @constructs AddEventPage
     */
    function AddEventPage(org_id) {
        RedactEventPage.apply(this);
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
EventPage = extending(Page, (function () {
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
        }
    });

    /**
     *
     * @param {Array} raw_notifications
     * @param {OneEvent.id} event_id
     * @param {OneEvent.last_event_date} last_date
     * @return {jQuery}
     */
    EventPage.buildNotifications = function (raw_notifications, event_id, last_date) {
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

    EventPage.prototype.fetchData = function () {
        return this.fetching_data_defer = this.event.fetchEvent(EventPage.fields);
    };

    EventPage.prototype.init = function () {
        var PAGE = this;
        trimAvatarsCollection(PAGE.$wrapper);
        bindRippleEffect(PAGE.$wrapper);
        bindDropdown(PAGE.$wrapper);
        //bindShareButtons(PAGE.$wrapper);
        __APP.MODALS.bindCallModal(PAGE.$wrapper);
        bindCollapsing(PAGE.$wrapper);
        bindPageLinks(PAGE.$wrapper);

        PAGE.$wrapper.find('.ToggleNotification').each(function () {
            var $this = $(this);

            $this.on('change', function () {
                $this.prop('disabled', true);
                if ($this.prop('checked')) {
                    PAGE.event.addNotification($this.val(), function (data) {
                        $this.data('uuid', data.uuid);
                        $this.prop('disabled', false);
                    });
                } else {
                    PAGE.event.deleteNotification($this.data('uuid'), function () {
                        $this.data('uuid', undefined);
                        $this.prop('disabled', false);
                    });
                }
            })
        });

        PAGE.$wrapper.find('.CancelEvent').on('click.CancelEvent', function () {
            PAGE.event.changeEventStatus(OneEvent.STATUS.CANCEL, function () {
                PAGE.$wrapper.find('.event_canceled_cap').removeClass(__C.CLASSES.HIDDEN);
            });
        });

        PAGE.$wrapper.find('.CancelCancellation').on('click.CancelCancellation', function () {
            PAGE.event.changeEventStatus(OneEvent.STATUS.BRING_BACK, function () {
                PAGE.$wrapper.find('.event_canceled_cap').addClass(__C.CLASSES.HIDDEN);
            });
        });

        PAGE.$wrapper.find('.ExternalLink').on('click.sendStat', function () {
            storeStat(PAGE.event.id, __C.STATS.EVENT_ENTITY, __C.STATS.EVENT_OPEN_SITE);
        });

        PAGE.$wrapper.find('.EventMap').on('click.sendStat', function () {
            storeStat(PAGE.event.id, __C.STATS.EVENT_ENTITY, __C.STATS.EVENT_OPEN_MAP);
        });
    };

    EventPage.prototype.render = function () {
        var PAGE = this,
            avatars_collection_classes = [
                __C.CLASSES.UNIVERSAL_STATES.ROUNDED,
                __C.CLASSES.UNIVERSAL_STATES.BORDERED,
                __C.CLASSES.SIZES.SMALL,
                __C.CLASSES.HOOKS.ADD_AVATAR.COLLECTION,
                __C.CLASSES.HOOKS.CALL_MODAL
            ],
            $action_buttons = $(),
            $event_additional_fields = $(),
            $event_additional_information = $(),
            organization = new OneOrganization(PAGE.event.organization_id);

        organization.setData({
            short_name: PAGE.event.organization_short_name,
            img_url: PAGE.event.organization_logo_small_url
        });

        __APP.changeTitle(PAGE.event.title);
        if (PAGE.event.is_favorite) {
            avatars_collection_classes.push(__C.CLASSES.HOOKS.ADD_AVATAR.STATES.SHIFTED);
        }

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
        });

        if (PAGE.event.registration_locally || PAGE.event.ticketing_locally) {
            $action_buttons = $action_buttons.add(new AddToFavoriteButton(PAGE.event.id, {
                is_add_avatar: true,
                is_checked: PAGE.event.is_favorite,
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

            if (PAGE.event.ticketing_locally) {

            } else {
                $action_buttons = $action_buttons.add(new RegisterButton(PAGE.event, {
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
            $action_buttons = $action_buttons.add(new AddToFavoriteButton(PAGE.event.id, {
                is_add_avatar: true,
                is_checked: PAGE.event.is_favorite,
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

        if (PAGE.event.registration_till) {
            $event_additional_information = $event_additional_information.add(tmpl('event-additional-info', {
                classes: __C.CLASSES.TEXT_COLORS.ACCENT + ' ' + __C.CLASSES.UNIVERSAL_STATES.TRANSFORM_UPPERCASE,
                text: 'Регистрация до ' + moment.unix(PAGE.event.registration_till).calendar(null, __LOCALES.ru_RU.DATE.CALENDAR_DATE_TIME)
            }));
        }

        if (!PAGE.event.is_free) {
            $event_additional_information = $event_additional_information.add(tmpl('event-additional-info', {
                classes: __C.CLASSES.TEXT_COLORS.ACCENT,
                text: 'от ' + (PAGE.event.min_price ? formatCurrency(PAGE.event.min_price) : '0') + ' руб.'
            }));
        }

        if (PAGE.event.is_online) {
            $event_additional_information = $event_additional_information.add(tmpl('event-additional-info', {
                classes: __C.CLASSES.TEXT_COLORS.ACCENT,
                text: 'Online'
            }));
        }

        if (PAGE.event.is_same_time) {
            $event_additional_fields = $event_additional_fields.add(tmpl('event-additional-field', {
                key: 'Время',
                value: displayTimeRange(PAGE.event.dates[0].start_time, PAGE.event.dates[0].end_time)
            }));
        } else {
            $event_additional_fields = $event_additional_fields.add(tmpl('event-date-time', {
                date_times: tmpl('event-date-time-row', formatDates(PAGE.event.dates, {
                    date: '{D} {MMMMs}',
                    time: '{T}'
                }, PAGE.event.is_same_time))
            }));
        }
        if (PAGE.event.location) {
            $event_additional_fields = $event_additional_fields.add(tmpl('event-additional-field', {
                key: 'Место',
                value: PAGE.event.location
            }));
        }
        $event_additional_fields = $event_additional_fields.add(tmpl('event-additional-field', {
            key: 'Теги',
            value: __APP.BUILD.tags(PAGE.event.tags)
        }));

        if (PAGE.event.detail_info_url) {
            $event_additional_fields = $event_additional_fields.add(tmpl('event-detail-link', {detail_info_url: PAGE.event.detail_info_url}));
        }

        PAGE.$wrapper.html(tmpl('event-page', $.extend({}, PAGE.event, {
            action_buttons: $action_buttons,
            avatars_collection: __APP.BUILD.avatarCollection(PAGE.event.favored, 6, {
                dataset: {
                    modal_type: 'favors',
                    modal_event_id: PAGE.event.id
                },
                classes: avatars_collection_classes,
                counter_classes: [
                    __C.CLASSES.SIZES.X30,
                    __C.CLASSES.UNIVERSAL_STATES.BORDERED,
                    __C.CLASSES.COLORS.MARGINAL,
                    __C.CLASSES.HOOKS.ADD_AVATAR.STATES.CASTABLE
                ]
            }, PAGE.event.favored_users_count),
            notifications: EventPage.buildNotifications(PAGE.event.notifications, PAGE.event.id, PAGE.event.last_event_date),
            event_map: PAGE.event.location ? tmpl('event-map', {location_sanitized: encodeURI(PAGE.event.location)}) : '',
            event_edit_functions: PAGE.event.can_edit ? tmpl('event-edit-functions', PAGE.event) : '',
            event_additional_info: $event_additional_information,
            canceled: PAGE.event.canceled ? '' : __C.CLASSES.HIDDEN,
            organization_avatar_block: __APP.BUILD.avatarBlocks(organization, {
                block_classes: [__C.CLASSES.SIZES.SMALL],
                is_link: true,
                entity: __C.ENTITIES.ORGANIZATION
            }),
            event_additional_fields: $event_additional_fields,
            cancel_cancellation: PAGE.event.can_edit ? tmpl('button', {
                    classes: __C.CLASSES.COLORS.PRIMARY + ' ' + __C.CLASSES.HOOKS.RIPPLE + ' CancelCancellation',
                    title: 'Вернуть событие'
                }) : ''
        })));

        if (PAGE.event.is_same_time) {
            var m_nearest_date = PAGE.event.nearest_event_date ? moment.unix(PAGE.event.nearest_event_date) : moment.unix(PAGE.event.first_event_date);
            PAGE.calendar = new Calendar(PAGE.$wrapper.find('.EventCalendar'), {
                classes: {
                    wrapper_class: 'feed_calendar_wrapper',
                    td_class: 'event_calendar_day'
                },
                selection_type: Calendar.SELECTION_TYPES.MULTI,
                disable_selection: true
            });
            PAGE.calendar
                .init()
                .setMonth(m_nearest_date.format('M'), m_nearest_date.format('YYYY'))
                .selectDays(
                    PAGE.event.dates.map(function (date) {
                        return moment.unix(date.event_date).format(__C.DATE_FORMAT)
                    })
                );
        }

        if (__APP.USER.id === -1) {
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
 * @class EditOrganizationPage
 * @extends Page
 */
EditOrganizationPage = extending(Page, (function () {
    /**
     *
     * @param {(string|number)} [organization_id]
     * @constructor
     * @constructs EditOrganizationPage
     */
    function EditOrganizationPage(organization_id) {
        Page.apply(this);
        this.page_title = 'Редактировать организацию';
        this.organization = new OneOrganization(organization_id);
        this.categories = new CategoriesCollection();
        this.cities = new CitiesCollection();
        this.state_name = 'edit_organization';

        this.fields = [
            'description',
            'site_url',
            'default_address',
            'vk_url',
            'facebook_url',
            'email'
        ];

        this.adding_is_over = false;
    }

    EditOrganizationPage.prototype.fetchData = function () {
        var cities_promise = this.cities.fetchCities(null, 0, 'local_name');

        if (this.organization.id) {
            return this.fetching_data_defer = __APP.SERVER.multipleAjax(cities_promise, this.organization.fetchOrganization(this.fields));
        }

        return this.fetching_data_defer = cities_promise;
    };

    EditOrganizationPage.prototype.render = function () {
        var PAGE = this,
            $view = this.$view,
            $wrapper = this.$wrapper,
            organization_id = this.organization.id,
            additional_fields,
            local_storage;

        if (__APP.USER.id === -1) {
            __APP.changeState('/feed/actual', true, true);
            return null;
        }
        if (window.location.pathname.contains('organization/add')) {
            __APP.changeState('/add/organization', true, true);
            return null;
        }

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
            var $select = $view.find('#add_organization_city');

            $select
                .append(tmpl('option', PAGE.cities.map(function (city) {
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
        }

        function initOrganizationTypes(selected_id) {
            PAGE.categories.fetchCategories({}, 0, function (categories) {
                var $select = $view.find('#add_organization_type');

                $select
                    .html(tmpl('option', categories.map(function (category) {
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
            function formValidation($form, for_edit) {
                var is_valid = true,
                    $times = $form.find('#edit_event_different_time').prop('checked') ? $form.find('[class^="TableDay_"]') : $form.find('.MainTime');

                $form.find(':required').not(':disabled').each(function () {
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

                $times.each(function () {
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
                    $form.find('.DataUrl').each(function () {
                        var $this = $(this);
                        if ($this.val() === "") {
                            if (is_valid) {
                                $('body').stop().animate({scrollTop: Math.ceil($this.closest('.EditEventImgLoadWrap').offset().top - 150)}, 1000, 'swing', function () {
                                    showNotifier({text: 'Пожалуйста, добавьте обложку организации', status: false})
                                });
                            }
                            is_valid = false;
                        }
                    });
                }
                return is_valid;
            }

            function afterSubmit() {
                PAGE.adding_is_over = true;
                sessionStorage.removeItem('organization_info');
                $('.SidebarNav').find('.ContinueRegistration').remove();

                socket.emit('utils.registrationFinished', additional_fields);
                socket.on('utils.updateImagesDone', function () {
                    window.location.href = '/organization/' + PAGE.organization.id;
                });
                socket.emit('utils.updateImages');
            }

            var $form = $view.find("#add-organization-form"),
                data = {
                    organization_id: null,
                    name: null,
                    short_name: null,
                    type_id: null,
                    background_filename: null,
                    logo_filename: null,
                    default_address: null,
                    location: null,
                    description: null,
                    site_url: null,
                    vk_url: null,
                    facebook_url: null,
                    email: null,
                    filenames: {
                        background: null,
                        logo: null
                    }
                },
                form_data = $form.serializeForm(),
                valid_form = formValidation($form, !!(form_data.organization_id));

            if (valid_form) {
                $.extend(true, data, form_data);

                data.filenames = {
                    background: data.background_filename,
                    logo: data.logo_filename
                };

                if (PAGE.organization.id) {
                    PAGE.organization.updateOrganization(data, afterSubmit);
                } else {
                    PAGE.organization.createOrganization(data, afterSubmit);
                }


            }

        }


        if (!organization_id) {
            try {
                local_storage = JSON.parse(sessionStorage.getItem('organization_info') ? sessionStorage.getItem('organization_info') : localStorage.getItem('organization_info'));
            } catch (e) {
                local_storage = {}
            }

            additional_fields = $.extend({
                header_text: 'Новый организатор'
            }, local_storage, true);

            //cookies.removeItem('open_add_organization', '/');
            sessionStorage.removeItem('organization_info');

            $wrapper.html(tmpl('add-organization-page', additional_fields));
        } else {
            this.adding_is_over = true;
            additional_fields = $.extend(true, {}, this.organization);

            additional_fields.header_text = 'Редактирование организации';

            if (additional_fields.background_img_url) {
                additional_fields.background_filename = additional_fields.background_img_url.split('/').reverse()[0];
            }
            if (additional_fields.img_url) {
                additional_fields.logo_filename = additional_fields.img_url.split('/').reverse()[0];
            }

            $.extend(true, additional_fields, additional_fields);
            $wrapper.html(tmpl('add-organization-page', additional_fields));


            if (additional_fields.img_url) {
                toDataUrl(additional_fields.img_url, function (base64_string) {
                    $view.find('#add_organization_img_src').val(base64_string ? base64_string : null);
                });
            }
            if (additional_fields.background_img_url) {
                toDataUrl(additional_fields.background_img_url, function (base64_string) {
                    $view.find('#add_organization_background_src').val(base64_string ? base64_string : null);
                });
            }
        }

        initEditEventPage($view);
        __APP.MODALS.bindCallModal($view);
        initOrganizationTypes(additional_fields.type_id);
        initCities(additional_fields.city_id || __APP.USER.selected_city.id);
    };

    EditOrganizationPage.prototype.destroy = function () {
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
        }
    };

    return EditOrganizationPage;
}()));
/**
 * @requires Class.EditOrganizationPage.js
 */
/**
 *
 * @class AddOrganizationPage
 * @extends EditOrganizationPage
 */
AddOrganizationPage = extending(EditOrganizationPage, (function () {
    /**
     *
     * @constructor
     * @constructs AddOrganizationPage
     */
    function AddOrganizationPage() {
        EditOrganizationPage.apply(this);
        this.page_title = 'Новая организация';
    }

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
CatalogPage = extending(Page, (function () {
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

    CatalogPage.prototype.fetchData = function () {
        var self = this;

        return this.fetching_data_defer = this.cities.fetchCities(null, 0, 'distance,local_name', function () {
            if (self.selected_city_name) {
                self.selected_city = this.getByName(self.selected_city_name);
                self.categories_ajax_data.city_id = self.selected_city.id;
            }
        }).then(function () {
            return self.categories.fetchCategoriesWithOrganizations(self.categories_ajax_data, self.organizations_ajax_data, 0).done(function () {
                self.all_organizations = self.categories
                    .reduce(function (collection, cat) {
                        return collection.setData(cat.organizations);
                    }, new OrganizationsCollection())
                    .sort(function (a, b) {
                        return b.subscribed_count - a.subscribed_count;
                    });
            });
        }).promise();
    };
    /**
     *
     * @param {(string|number)} category_id
     */
    CatalogPage.prototype.selectCategory = function (category_id) {
        this.selected_category_id = category_id ? category_id : this.selected_category_id;
        this.$view.find('.Category').filter('[data-category-id="' + this.selected_category_id + '"]').addClass(__C.CLASSES.ACTIVE);
        __APP.changeState('/organizations/at/' + this.selected_city_name + '/' + this.selected_category_id, true);
        __APP.changeTitle(this.categories.getByID(this.selected_category_id).name);
    };

    CatalogPage.prototype.init = function () {
        var PAGE = this,
            $categories = PAGE.$view.find('.Category'),
            $organizations_cities_select = PAGE.$view.find('#organizations_cities_select');

        function bindOrganizationsEvents() {
            bindRippleEffect(PAGE.$view);
            bindPageLinks(PAGE.$view);
        }

        $(window).on('subscribe.updateCatalog', function (e, id) {
            var org = PAGE.all_organizations.getByID(id);
            org.is_subscribed = true;
            org.subscribed_count++;
        });
        $(window).on('unsubscribe.updateCatalog', function (e, id) {
            var org = PAGE.all_organizations.getByID(id);
            org.is_subscribed = false;
            org.subscribed_count--;
        });

        bindOrganizationsEvents();

        PAGE.$view.find('.OrganizationsCategoriesScroll').scrollbar({disableBodyScroll: true});

        $organizations_cities_select.select2({
            containerCssClass: 'form_select2',
            dropdownCssClass: 'form_select2_drop'
        }).off('change.SelectCity').on('change.SelectCity', function () {
            __APP.changeState('/organizations/at/' + PAGE.cities.getByID($(this).val()).en_name, true, true);
        });
        if (PAGE.selected_city_name) {
            $organizations_cities_select.select2('val', PAGE.cities.getByName(PAGE.selected_city_name).id);
        }

        PAGE.$view.find('.ShowAllOrganizations').off('click.showAllOrganizations').on('click.showAllOrganizations', function () {
            $categories.removeClass(__C.CLASSES.ACTIVE).siblings('.SubcategoryWrap').height(0);
            PAGE.selected_category_id = undefined;

            __APP.changeState('/organizations/at/' + PAGE.selected_city_name, true);
            __APP.changeTitle(PAGE.default_title);
            PAGE.$wrapper.html(__APP.BUILD.organizationCard(PAGE.all_organizations));
            bindOrganizationsEvents();
        });

        $categories.off('click.selectCategory').on('click.selectCategory', function () {
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
                    PAGE.categories.fetchCategoriesWithOrganizations(PAGE.categories_ajax_data, PAGE.organizations_ajax_data, 0, function () {
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

    CatalogPage.prototype.render = function () {
        this.$view.find('#organizations_cities_select').html(tmpl('option', this.cities.map(function (city) {
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

    CatalogPage.prototype.destroy = function () {
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
OrganizationPage = extending(Page, (function () {
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
        var event_type_default = {
            last_date: '',
            is_upload_disabled: false
        };
        Page.apply(this, arguments);
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
         * @type object
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

        this.events_load = 0;
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
    OrganizationPage.prototype.fetchData = function () {
        var self = this;
        return this.fetching_data_defer = this.organization.fetchOrganization(this.fields).done(function (data) {
            self.is_admin = self.organization.role != OneUser.ROLE.USER;
            self.max_events_load = self.is_admin ? 4 : 2;
        }).promise();
    };
    /**
     *
     * @param {OrganizationPage~EventType} type
     * @param {Array<OneEvent>} events
     * @returns {jQuery}
     */
    OrganizationPage.prototype.appendEvents = function (type, events) {
        var $wrapper = this.$wrapper.find('.' + type.name.capitalize() + 'Events'),
            $output;

        if (events.length) {
            $output = __APP.BUILD.eventBlocks(events, type);
        } else {
            type.is_upload_disabled = true;
            $(window).off(type.scroll_event);
            $output = tmpl('organization-feed-no-event', {
                text: 'Больше событий нет :('
            });
        }
        $wrapper.append($output);
        return $output;
    };
    /**
     *
     * @param {OrganizationPage~EventType} type
     */
    OrganizationPage.prototype.bindUploadEventsOnScroll = function (type) {
        var PAGE = this,
            $window = $(window),
            scrollEvent = function () {
                if ($window.height() + $window.scrollTop() + 200 >= $(document).height() && !type.is_upload_disabled) {
                    $window.off(type.scroll_event);
                    PAGE[type.name + '_events'].fetchOrganizationsFeed(PAGE.organization.id, PAGE.events_fields, 10, function (events) {
                        PAGE.bindFeedEvents(PAGE.appendEvents(type, events));
                        $window.on(type.scroll_event, scrollEvent);
                    });
                }
            };

        if (!type.is_upload_disabled) {
            $window.on(type.scroll_event, scrollEvent);
        }
    };

    OrganizationPage.prototype.bindFeedEvents = function ($parent) {
        bindRippleEffect($parent);
        trimAvatarsCollection($parent);
        __APP.MODALS.bindCallModal($parent);
        bindPageLinks($parent);
    };

    OrganizationPage.prototype.init = function () {
        var PAGE = this,
            $subscribers_scroll;
        bindTabs(PAGE.$wrapper);
        PAGE.bindFeedEvents(PAGE.$wrapper);
        __APP.MODALS.bindCallModal(PAGE.$wrapper);

        PAGE.$wrapper.find('.Tabs').on('change.tabs', function () {
            var scroll_events = [];
            $.each(PAGE.event_types, function () {
                scroll_events.push(this.scroll_event);
            });
            $(window).off(scroll_events.join(' '));
            PAGE.bindUploadEventsOnScroll(PAGE.event_types[$(this).find('.Tab.-active').data('type')]);
        });

        PAGE.$wrapper.find('.ExternalPage').on('click.sendStat', function () {
            storeStat(PAGE.organization.id, __C.STATS.ORGANIZATION_ENTITY, __C.STATS.ORGANIZATION_OPEN_SITE);
        });

        $subscribers_scroll = PAGE.$wrapper.find('.SubscribersScroll').scrollbar({
            disableBodyScroll: true,
            onScroll: function (y) {
                if (y.scroll == y.maxScroll) {
                    PAGE.organization.subscribed.fetchOrganizationSubscribers(PAGE.organization.id, 10, {
                        fields: 'is_friend',
                        order_by: '-is_friend,first_name'
                    }, function (subscribed) {
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

    OrganizationPage.prototype.render = function () {
        var PAGE = this,
            organization = new OneOrganization(PAGE.organization.id);
        organization.setData(PAGE.organization);
        __APP.changeTitle(organization.short_name);
        organization.short_name = undefined;
        $('.SidebarOrganizationsList').find('[data-organization_id="' + organization.id + '"]').find('.OrganizationCounter').addClass(__C.CLASSES.HIDDEN);
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
            redact_org_button: (organization.role == OneUser.ROLE.ADMIN) ? __APP.BUILD.link({
                    title: __LOCALES.ru_RU.TEXTS.BUTTON.EDIT,
                    classes: ['button', __C.CLASSES.SIZES.WIDE, __C.CLASSES.COLORS.NEUTRAL, __C.CLASSES.ICON_CLASS, __C.CLASSES.ICONS.PENCIL, __C.CLASSES.HOOKS.RIPPLE],
                    page: 'organization/' + organization.id + '/edit/'
                }) : '',
            hidden_for_users: PAGE.is_admin ? '' : __C.CLASSES.HIDDEN,
            subscribed_blocks: __APP.BUILD.subscribers(organization.subscribed)
        }, organization)));

        PAGE.$wrapper.on('events_load.FutureEvents events_load.PastEvents events_load.DelayedEvents events_load.CanceledEvents', function (e) {
            if (e.namespace == 'FutureEvents') {
                PAGE.init();
                PAGE.bindUploadEventsOnScroll(PAGE.event_types.future);
            }
            PAGE.bindFeedEvents(PAGE.$wrapper.find('.' + e.namespace));
            if (++PAGE.events_load == PAGE.max_events_load) {
                PAGE.$wrapper.off('events_load');
            }
        });


        PAGE.future_events.fetchOrganizationsFeed(organization.id, PAGE.events_fields, 10, function (future_events) {
            PAGE.appendEvents(PAGE.event_types.future, future_events);
            PAGE.$wrapper.trigger('events_load.FutureEvents');
        });

        PAGE.past_events.fetchOrganizationsFeed(organization.id, PAGE.events_fields, 10, function (past_events) {
            PAGE.appendEvents(PAGE.event_types.past, past_events);
            PAGE.$wrapper.trigger('events_load.PastEvents');
        });

        if (PAGE.is_admin) {
            PAGE.delayed_events.fetchOrganizationsFeed(organization.id, PAGE.events_fields, 10, function (delayed_events) {
                PAGE.appendEvents(PAGE.event_types.delayed, delayed_events);
                PAGE.$wrapper.trigger('events_load.DelayedEvents');
            });

            PAGE.canceled_events.fetchOrganizationsFeed(organization.id, PAGE.events_fields, 10, function (canceled_events) {
                PAGE.appendEvents(PAGE.event_types.canceled, canceled_events);
                PAGE.$wrapper.trigger('events_load.CanceledEvents');
            });
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
UserPage = extending(Page, (function () {
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
                'dates'
            ),
            order_by: 'nearest_event_date,-first_event_date',
            length: 10
        };
    }

    UserPage.bindEvents = function ($parent) {
        bindRippleEffect($parent);
        trimAvatarsCollection($parent);
        __APP.MODALS.bindCallModal($parent);
        bindPageLinks($parent);
    };

    UserPage.prototype.fetchData = function () {
        if (!(this.user_id == __APP.USER.id || this.user_id === 'me')) {
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

    UserPage.prototype.uploadEntities = function (type) {
        var self = this,
            types = {
                activities: {
                    fetch_method: this.user.actions.fetch,
                    fetch_context: this.user.actions,
                    fetch_arguments: [['organization', 'event', 'type_code', 'created_at'], 20, '-created_at'],
                    extra_function: function (entities) {
                        entities.forEach(function (activity) {
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
            $wrapper = self.$wrapper.find('.TabsBody').filter('[data-tab_body_type="' + type + '"]'),
            $loader;

        if (!self.disable_uploads[type] && !self.block_scroll) {
            $loader = __APP.BUILD.loaderBlock($wrapper);
            self.block_scroll = true;

            type_data.fetch_method.apply(type_data.fetch_context, type_data.fetch_arguments).done(function (entities) {
                var $entities;
                self.block_scroll = false;
                $loader.remove();
                if (entities.length) {
                    if (type_data.extra_function && typeof type_data.extra_function === 'function') {
                        type_data.extra_function(entities);
                    }
                    $entities = type_data.build_method.apply(self, [entities].concat(type_data.build_extra_arguments));
                    $wrapper.append($entities);
                    UserPage.bindEvents($entities);
                } else {
                    if (!$wrapper.children().length) {
                        $wrapper.append(__APP.BUILD.cap('Активности нет'));
                    }
                    self.disable_uploads[type] = true;
                }
            });
        }
    };

    UserPage.prototype.init = function () {
        var self = this,
            $window = $(window),
            event_names = {
                activities: 'scroll.uploadActivities',
                events: 'scroll.uploadEvents'
            };

        bindTabs(this.$wrapper);
        UserPage.bindEvents(this.$wrapper);

        this.$wrapper.find('.Tabs').on('change.tabs', function () {
            var $this = $(this),
                active_type = $this.find('.TabsBody').filter('.' + __C.CLASSES.ACTIVE).data('tab_body_type');
            $window.off(Object.values(event_names).join(' '));
            $window.on(event_names[active_type], function () {
                if (isScrollRemain(200)) {
                    switch (active_type) {
                        case 'activities': {
                            self.uploadEntities('activities');
                            break;
                        }
                        case 'events': {
                            self.uploadEntities('events');
                            break;
                        }
                    }
                }
            });
        });

        $window.on(event_names.activities, function () {
            if (isScrollRemain(200)) {
                self.uploadEntities('activities');
            }
        });
    };

    UserPage.prototype.render = function () {
        var self = this,
            $subscribed_orgs,
            $favored_events;

        if (this.user_id == __APP.USER.id) {
            __APP.changeState('/my/profile', true, true);
            return null;
        }
        __APP.changeTitle(this.user.full_name);

        this.user.actions.forEach(function (action) {
            action.user = self.user;
        });

        if (this.user.subscriptions.length) {
            $subscribed_orgs = __APP.BUILD.avatarBlocks(this.user.subscriptions.slice(0, 4), {
                avatar_classes: ['-size_30x30'],
                entity: 'organization',
                is_link: true
            });
        } else {
            $subscribed_orgs = __APP.BUILD.cap('Нет подписок');
        }

        if (this.user.favored.length) {
            $favored_events = __APP.BUILD.eventBlocks(this.user.favored, this.events_metadata);
        } else {
            $favored_events = __APP.BUILD.cap('Событий нет');
        }

        this.$wrapper.append(tmpl('user-page', {
            tombstone: __APP.BUILD.userTombstones(this.user, {avatar_classes: ['-bordered', '-shadowed']}),
            links: __APP.BUILD.socialLinks(this.user.accounts_links),
            subscribed_orgs: $subscribed_orgs,
            show_all_subscribed_orgs_button: this.user.subscriptions.length ? __APP.BUILD.button({
                    classes: ['-color_neutral_accent', 'CallModal', 'RippleEffect'],
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
MyProfilePage = extending(UserPage, (function () {
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

    MyProfilePage.prototype.fetchData = function () {
        if (!this.user.favored.length) {
            return this.fetching_data_defer = this.user.fetchFavored(this.favored_fetch_data);
        }
        return Page.prototype.fetchData.call(this);
    };

    MyProfilePage.prototype.render = function () {
        var $activities,
            $subscribed_orgs,
            $favored_events,
            $subscribed_users;
        __APP.changeTitle('Мой профиль');

        this.user.actions.forEach(function (action) {
            action.user = __APP.USER;
        });

        if (this.user.subscriptions.length) {
            $subscribed_orgs = __APP.BUILD.avatarBlocks(this.user.subscriptions.slice(0, 4), {
                avatar_classes: ['-size_30x30'],
                entity: 'organization',
                is_link: true
            });
        } else {
            $subscribed_orgs = __APP.BUILD.cap('Нет подписок');
        }

        if (this.user.friends.length) {
            $subscribed_users = __APP.BUILD.avatarBlocks(this.user.friends.slice(0, 4), {
                avatar_classes: ['-size_30x30', '-rounded'],
                entity: 'user',
                is_link: true
            });
        } else {
            $subscribed_users = __APP.BUILD.cap('Нет друзей');
        }

        if (this.user.favored.length) {
            $favored_events = __APP.BUILD.eventBlocks(this.user.favored, this.events_metadata);
        } else {
            $favored_events = __APP.BUILD.cap('Событий нет');
        }

        this.$wrapper.append(tmpl('user-page', {
            tombstone: __APP.BUILD.userTombstones(this.user, {avatar_classes: ['-bordered', '-shadowed']}),
            links: __APP.BUILD.socialLinks(this.user.accounts_links),
            subscribed_orgs: $subscribed_orgs,
            show_all_subscribed_orgs_button: this.user.subscriptions.length ? __APP.BUILD.button({
                    classes: ['-color_neutral_accent', 'CallModal', 'RippleEffect'],
                    dataset: {
                        modal_type: 'subscribers_list',
                        modal_entity: this.user
                    },
                    title: 'Показать все'
                }) : '',
            subscribed_users: $subscribed_users,
            show_all_subscribed_users_button: this.user.friends.length ? __APP.BUILD.button({
                    classes: ['-color_neutral_accent', 'CallModal', 'RippleEffect'],
                    dataset: {
                        modal_type: 'friends_list',
                        modal_entity: this.user
                    },
                    title: 'Показать все'
                }) : '',
            favored_event_blocks: $favored_events
        }));
        if (this.user.actions.length) {
            $activities = __APP.BUILD.activity(this.user.actions);
            this.$wrapper.find('.TabsBody').filter('[data-tab_body_type="activities"]').append($activities);
            UserPage.bindEvents($activities);
        } else {
            this.uploadEntities('activities');
        }
        this.init();
    };

    return MyProfilePage;
}()));
/**
 * @requires Class.StatisticsPage.js
 */
/**
 *
 * @class StatisticsOverviewPage
 * @extends StatisticsPage
 */
StatisticsOverviewPage = extending(StatisticsPage, (function () {
    /**
     *
     * @constructor
     * @constructs StatisticsOverviewPage
     */
    function StatisticsOverviewPage() {
        StatisticsPage.apply(this);
        this.my_organizations_fields = ['img_medium_url', 'subscribed_count', 'staff'];
        this.page_title = 'Организации';
        this.my_organizations = new OrganizationsCollection();
    }

    StatisticsOverviewPage.buildMyOrganizationsBlocks = function (organizations) {
        return tmpl('statistics-overview-organization', organizations.map(function (org) {
            var avatars_max_count = 2,
                staff_additional_fields = {
                    is_link: true,
                    avatar_classes: ['-size_100x100', '-rounded']
                },
                org_roles = [
                    {
                        name: OneUser.ROLE.ADMIN,
                        title: 'Администраторы',
                        staff: UsersCollection.getSpecificStaff(OneUser.ROLE.ADMIN, org.staff, staff_additional_fields),
                        plural_name: OneUser.ROLE.ADMIN + 's'
                    }, {
                        name: OneUser.ROLE.MODERATOR,
                        title: 'Модераторы',
                        staff: UsersCollection.getSpecificStaff(OneUser.ROLE.MODERATOR, org.staff, staff_additional_fields),
                        plural_name: OneUser.ROLE.MODERATOR + 's'
                    }
                ];

            org_roles.forEach(function (role) {
                org[role.plural_name] = __APP.BUILD.avatarCollection(role.staff, avatars_max_count, {
                    dataset: {
                        modal_type: 'editors',
                        modal_specific_role: role.name,
                        modal_title: role.title,
                        modal_organization_id: org.id
                    },
                    classes: ['-size_30x30', '-rounded', '-shifted', 'CallModal'],
                    counter_classes: ['-size_30x30', '-color_marginal_primary']
                });
            });

            return $.extend(true, {}, org, {
                subscribers: org.subscribed_count + getUnitsText(org.subscribed_count, __LOCALES.ru_RU.TEXTS.SUBSCRIBERS),
                buttons: __APP.BUILD.link({
                    title: 'Редактировать',
                    classes: ['button', 'fa_icon', 'fa-pencil', '-color_neutral', 'RippleEffect'],
                    page: '/organization/' + org.id + '/edit'
                }, {
                    title: 'Создать событие',
                    classes: ['button', 'fa_icon', 'fa-plus', '-color_accent', 'RippleEffect'],
                    page: '/add/event/to/' + org.id
                })
            });
        }));
    };

    StatisticsOverviewPage.prototype.fetchData = function () {
        return this.fetching_data_defer = this.my_organizations.fetchMyOrganizations('admin', this.my_organizations_fields, 10, '');
    };

    StatisticsOverviewPage.prototype.bindOrganizationsEvents = function ($parent) {
        trimAvatarsCollection($parent);
        bindPageLinks($parent);
        __APP.MODALS.bindCallModal($parent);
        bindRippleEffect($parent);
        return $parent;
    };

    StatisticsOverviewPage.prototype.bindUploadOnScroll = function () {
        var PAGE = this,
            $window = $(window),
            scrollEvent = function () {
                if ($window.height() + $window.scrollTop() + 200 >= $(document).height() && !PAGE.is_upload_disabled) {
                    $window.off('scroll.uploadOrganizations');
                    PAGE.my_organizations.fetchMyOrganizations('admin', PAGE.my_organizations_fields, 10, '', function (organizations) {
                        var $organizations = StatisticsOverviewPage.buildMyOrganizationsBlocks(organizations);
                        if (organizations.length) {
                            PAGE.$wrapper.find('.StatOverviewOrganizations').append($organizations);
                            PAGE.bindOrganizationsEvents($organizations);
                            $window.on('scroll.uploadOrganizations', scrollEvent);
                        } else {
                            PAGE.is_upload_disabled = true;
                        }
                    });
                }
            };

        if (!PAGE.is_upload_disabled) {
            $window.on('scroll.uploadOrganizations', scrollEvent);
        }
    };

    StatisticsOverviewPage.prototype.init = function () {
        this.bindOrganizationsEvents(this.$wrapper);
        this.bindUploadOnScroll();
    };

    StatisticsOverviewPage.prototype.render = function () {
        if (__APP.USER.id === -1) {
            __APP.changeState('/feed/actual', true, true);
            return null;
        }
        this.$wrapper.html(tmpl('statistics-overview-wrapper', {
            organizations: StatisticsOverviewPage.buildMyOrganizationsBlocks(this.my_organizations)
        }));
        this.init();
    };

    StatisticsOverviewPage.prototype.destroy = function () {
        $(window).off('scroll.uploadOrganizations');
    };

    return StatisticsOverviewPage;
}()));
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


/**
 * @class ServerConnection
 */
ServerConnection = (function () {
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
        error = typeof error !== 'undefined' ? error : function () {
                console.log(result);
                showNotifier({text: 'Упс, что-то пошло не так', status: false});
            };
        success = typeof success !== 'function' ? function () {
            } : success;
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

    ServerConnection.ajaxErrorHandler = function (event, jqxhr, settings, thrownError) {
        var args = Array.prototype.slice.call(arguments),
            debug = {},
            fields;
        if (args.length == 4) {
            fields = ['event', 'jqxhr', 'settings', 'thrownError'];
            args.forEach(function (arg, i) {
                debug[fields[i]] = arg;
            });
        } else if (args.length == 1) {
            debug = args[0];
        } else {
            args.forEach(function (arg, i) {
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

        if (!window.errors_array) window.errors_array = [];
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
    ServerConnection.prototype.dealAjax = function (http_method, url, ajax_data, content_type, success, error) {
        ajax_data = ajax_data || {};
        var jqXHR;
        if (ajax_data.fields instanceof Fields) {
            ajax_data.fields = ajax_data.fields.toString();
        }
        jqXHR = $.ajax({
            url: url,
            data: ajax_data,
            method: http_method,
            contentType: content_type || 'application/x-www-form-urlencoded; charset=UTF-8'
        });
        this.current_connections.push(jqXHR);
        return jqXHR.fail(error).then(function (response, status_text, jqXHR) {
            ajaxHandler(response, function (data, text) {
                if (success && typeof success == 'function') {
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
    ServerConnection.prototype.multipleAjax = function () {
        var with_callback = (arguments[arguments.length - 1] instanceof Function),
            promises = with_callback ? Array.prototype.splice.call(arguments, 0, arguments.length - 1) : Array.prototype.slice.call(arguments),
            parallel_promise;
        parallel_promise = $.when.apply($, promises);
        if (with_callback) {
            parallel_promise.done(Array.prototype.shift.call(arguments));
        }
        return parallel_promise.promise();
    };

    /**
     *
     * @param {string} url
     * @param {AJAXData} ajax_data
     * @param {AJAXCallback} [success]
     * @param {function} [error]
     * @returns {jqPromise}
     */
    ServerConnection.prototype.getData = function (url, ajax_data, success, error) {
        return this.dealAjax(ServerConnection.HTTP_METHODS.GET, url, this.validateData(ajax_data), 'application/json', function (data) {
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
     * @param {AJAXData} ajax_data
     * @param {boolean} [is_payload]
     * @param {AJAXCallback} [success]
     * @param {function} [error]
     * @returns {jqPromise}
     */
    ServerConnection.prototype.updateData = function (url, ajax_data, is_payload, success, error) {
        if (is_payload) {
            return this.dealAjax(ServerConnection.HTTP_METHODS.PUT, url, JSON.stringify(ajax_data), 'application/json', success, error);
        }
        return this.dealAjax(ServerConnection.HTTP_METHODS.PUT, url, ajax_data, 'application/x-www-form-urlencoded; charset=UTF-8', success, error);
    };
    /**
     *
     * @param {string} url
     * @param {AJAXData} ajax_data
     * @param {boolean} [is_payload]
     * @param {AJAXCallback} [success]
     * @param {function} [error]
     * @returns {jqPromise}
     */
    ServerConnection.prototype.addData = function (url, ajax_data, is_payload, success, error) {
        if (is_payload) {
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
    ServerConnection.prototype.deleteData = function (url, ajax_data, success, error) {
        return this.dealAjax(ServerConnection.HTTP_METHODS.DELETE, url, ajax_data, 'application/json', success, error);
    };
    /**
     *
     * @param {AJAXData} ajax_data
     * @returns {AJAXData}
     */
    ServerConnection.prototype.validateData = function (ajax_data) {
        ajax_data = ajax_data || {};
        var order_by = [];

        if (ajax_data.order_by) {
            order_by = (typeof ajax_data.order_by === 'string') ? ajax_data.order_by.split(',') : ajax_data.order_by;
            order_by = order_by.map(function (unit) {
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
                order_by.forEach(function (unit) {
                    ajax_data.fields.add(unit);
                });
            }
        }

        ajax_data.fields = (ajax_data.fields = ajax_data.fields.toString()) ? ajax_data.fields : undefined;

        return ajax_data;
    };

    ServerConnection.prototype.abortAllConnections = function () {
        var cur;
        while (this.current_connections.length) {
            cur = this.current_connections.pop();
            if (cur.state() === 'pending') {
                //cur.abort();
            }
        }
    };


    return ServerConnection;
}());


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
    LOCATION: {},
    TOP_BAR: new AbstractTopBar(),
    SIDEBAR: new AbstractSidebar(),
    USER: new CurrentUser(),
    PREVIOUS_PAGE: new Page(),
    CURRENT_PAGE: new Page(),
    ROUTING: {
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
            'profile': MyProfilePage,
            '': MyProfilePage
        },
        'event': {
            'add_to': {
                '^([0-9]+)': AddEventPage,
                '': AddEventPage
            },
            'add': AddEventPage,
            '^([0-9]+)': {
                'edit': RedactEventPage,
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
        'statistics': {
            'organization': {
                '^([0-9]+)': {
                    'overview': StatisticsOrganizationOverviewPage,
                    'events': StatisticsOrganizationEventsPage,
                    '': StatisticsOrganizationOverviewPage
                }
            },
            'event': {
                '^([0-9]+)': StatisticsEventOverviewPage
            },
            '': StatisticsOverviewPage
        },
        '': ActualEventsPage
    },
    MODALS: new Modals(),
    BUILD: {
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
        normalizeBuildProps: function normalizeBuildProps(props, classes, datasets, attributes) {
            props = props ? props : {};
            classes ? classes.push('classes') : classes = ['classes'];
            datasets ? datasets.push('dataset') : datasets = ['dataset'];
            attributes ? attributes.push('attributes') : attributes = ['attributes'];
            classes.forEach(function (c) {
                props[c] = props[c] ? (typeof props[c] === 'string') ? props[c].split(' ') : props[c] : [];
                props[c].toString = Array.toSpaceSeparatedString;
            });
            datasets.forEach(function (d) {
                props[d] = props[d] ? props[d] : {};
                props[d].toString = (Array.isArray(props[d])) ? Array.toSpaceSeparatedString : Object.toHtmlDataSet;
            });
            attributes.forEach(function (a) {
                props[a] = props[a] ? props[a] : {};
                props[a].toString = (Array.isArray(props[a])) ? Array.toSpaceSeparatedString : Object.toHtmlAttributes;
            });
            return props;
        },
        /**
         *
         * @param {...buildProps} props
         * @returns {jQuery}
         */
        button: function buildButton(/**props*/) {
            var props = Array.prototype.slice.call(arguments);
            return tmpl('button', props.map(function (arg) {
                return __APP.BUILD.normalizeBuildProps(arg);
            })).each(function (i, button) {
                if (props[i].dataset) {
                    $(button).data(props[i].dataset);
                }
            });
        },
        /**
         *
         * @param {HTMLAttributes} [attributes]
         * @param {(Array<string>|string)} [classes]
         * @param {HTMLDataset} [dataset]
         * @returns {jQuery}
         */
        input: function buildInput(attributes, classes, dataset) {
            return tmpl('input', __APP.BUILD.normalizeBuildProps({
                classes: classes,
                attributes: attributes,
                dataset: dataset
            })).each(function (i, input) {
                if (dataset) {
                    $(input).data(dataset);
                }
            });
        },
        /**
         *
         * @param {HTMLAttributes} [attributes]
         * @param {(Array<string>|string)} [classes]
         * @param {string} [value]
         * @param {HTMLDataset} [dataset]
         * @returns {jQuery}
         */
        textarea: function buildTextarea(attributes, classes, value, dataset) {
            return tmpl('textarea', __APP.BUILD.normalizeBuildProps({
                value: value,
                classes: classes,
                attributes: attributes,
                dataset: dataset
            })).each(function (i, input) {
                if (dataset) {
                    $(input).data(dataset);
                }
            });
        },
        /**
         *
         * @param {...buildProps} props
         * @param {string} props.page
         * @returns {jQuery}
         */
        link: function buildLink(props) {
            return tmpl('link', [].map.call(arguments, function (arg) {
                return __APP.BUILD.normalizeBuildProps(arg);
            }));
        },
        /**
         *
         * @param {string} type - checkbox or radio
         * @param {buildProps} props
         * @param {(Array<string>|string)} [props.unit_classes]
         * @returns {jQuery}
         */
        radioCheckbox: function buildRadioCheckbox(type, props) {
            if (type == 'checkbox' || type == 'radio') {
                props = __APP.BUILD.normalizeBuildProps(props, ['unit_classes']);
                if (props.classes.indexOf('form_checkbox') == -1 && props.classes.indexOf('form_radio') == -1) {
                    props.classes.unshift('form_' + type);
                }
                props.unit_classes.unshift('form_unit');
                return tmpl('radio-checkbox', $.extend(props, {type: type}));
            } else {
                throw Error('Принимаемый аргумент type может быть либо "radio" либо "checkbox", придурок')
            }
        },
        /**
         *
         * @param {...buildProps} props
         * @returns {jQuery}
         */
        radio: function buildRadio(props) {
            return $.makeSet([].map.call(arguments, function (arg) {
                return __APP.BUILD.radioCheckbox('radio', arg)
            }));
        },
        /**
         *
         * @param {...buildProps} props
         * @returns {jQuery}
         */
        checkbox: function buildCheckbox(props) {
            return $.makeSet([].map.call(arguments, function (arg) {
                return __APP.BUILD.radioCheckbox('checkbox', arg)
            }));
        },
        /**
         *
         * @param {(string|Element|jQuery)} text
         * @param {HTMLDataset} [dataset]
         * @param {HTMLAttributes} [attributes]
         * @returns {jQuery}
         */
        formHelpText: function buildFormHelpText(text, dataset, attributes) {
            return tmpl('form-helptext', __APP.BUILD.normalizeBuildProps({
                text: text,
                dataset: dataset,
                attributes: attributes
            }));
        },
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
        formInput: function buildFormInput(props) {
            var INPUT_TYPES = [
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
            return $.makeSet(Array.prototype.map.call(arguments, function (props) {
                switch (props.type) {
                    case 'radio':
                        return __APP.BUILD.radio(props);
                    case 'checkbox':
                        return __APP.BUILD.checkbox(props);
                    default:
                        return tmpl('form-unit', __APP.BUILD.normalizeBuildProps($.extend(true, {}, props, {
                            form_element: props.type === 'textarea' ?
                                __APP.BUILD.textarea($.extend({}, props.attributes, {
                                    id: props.id,
                                    name: props.name || undefined,
                                    required: props.required || undefined,
                                    placeholder: props.placeholder,
                                    tabindex: props.tabindex
                                }), (props.classes ? ['form_textarea'].concat(props.classes) : ['form_textarea']), props.value, props.dataset) :
                                __APP.BUILD.input($.extend({}, props.attributes, {
                                    id: props.id,
                                    type: !props.type || INPUT_TYPES.indexOf(props.type) === -1 ? 'text' : props.type,
                                    name: props.name || undefined,
                                    value: props.value || undefined,
                                    required: props.required || undefined,
                                    placeholder: props.placeholder,
                                    tabindex: props.tabindex
                                }), (props.classes ? ['form_input'].concat(props.classes) : ['form_input']), props.dataset),
                            helptext: __APP.BUILD.formHelpText(props.helptext, props.helptext_dataset, props.helptext_attributes)
                        }), ['unit_classes', 'label_classes']));
                }
            }));
        },
        /**
         *
         * @param {string|Element|jQuery} message
         * @param {buildProps} [props]
         * @return {jQuery}
         */
        cap: function buildTags(message, props) {
            if (!props)
                props = {};
            props = __APP.BUILD.normalizeBuildProps(props);

            return tmpl('cap', $.extend({message: message}, props));
        },
        /**
         *
         * @param {(OneTag|Array<OneTag>|TagsCollection)} tags
         * @param {buildProps} [props]
         * @returns {jQuery}
         */
        tags: function buildTags(tags, props) {
            props = __APP.BUILD.normalizeBuildProps(props);

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
        },
        /**
         *
         * @param {jQuery} [$wrapper]
         * @param {string} [direction]
         * @return {jQuery}
         */
        loaderBlock: function buildLoaderBlock($wrapper, direction) {
            return tmpl('loader-block', {loader: tmpl('loader')}, $wrapper, direction);
        },
        /**
         *
         * @param {Object<OneUser.ACCOUNTS, string>} [accounts_links]
         * @returns {jQuery}
         */
        socialLinks: function buildSocialLinks(accounts_links) {
            var props_array = [],
                ICON_SLUGS = {
                    VK: 'vk',
                    GOOGLE: 'google-plus',
                    FACEBOOK: 'facebook-official'
                };
            $.each(OneUser.ACCOUNTS, function (slug, account) {
                var props = {
                    slug: account,
                    icon_slug: ICON_SLUGS[slug]
                };
                if (accounts_links.hasOwnProperty(account)) {
                    props.html_tag = 'a';
                    props.attributes = {
                        href: accounts_links[account],
                        target: '_blank'
                    };
                } else {
                    props.html_tag = 'span';
                }
                props_array.push(__APP.BUILD.normalizeBuildProps(props))
            });
            return tmpl('user-page-social-link', props_array);
        },
        /**
         *
         * @param users
         * @param {buildProps} [props]
         * @param {(Array<string>|string)} [props.avatar_classes]
         * @param {(Array<string>|string)} [props.tombstone_classes]
         * @param {boolean} [props.is_link]
         * @returns {jQuery}
         */
        userTombstones: function buildUserTombstones(users, props) {
            props = __APP.BUILD.normalizeBuildProps(props, ['avatar_classes', 'tombstone_classes']);
            props.avatar_classes.push('-rounded');
            props.avatar_classes.push('-size_' + (props.size ? props.size : '70x70'));
            if (props.is_link) {
                props.html_tag = 'a';
                props.tombstone_classes.push('link Link');
            } else {
                props.html_tag = 'div';
            }

            return tmpl('user-tombstone', (users instanceof Array ? users : [users]).map(function (user) {
                if (props.is_link) {
                    props.attributes.href = '/user/' + user.id;
                }
                return $.extend(true, {}, user, {
                    avatar: __APP.BUILD.avatars(user, {
                        classes: props.avatar_classes
                    }),
                    name: user.full_name ? user.full_name : [user.first_name, user.last_name].join(' ')
                }, props);
            }));
        },
        /**
         *
         * @param {(OneUser|UsersCollection|OneOrganization|OrganizationsCollection|Array)} entities
         * @param {buildProps} [props]
         * @param {boolean} [props.is_link]
         * @param {string} [props.entity]
         * @param {(Array<string>|string)} [props.avatar_classes]
         * @param {(Array<string>|string)} [props.block_classes]
         * @returns {jQuery}
         */
        avatarBlocks: function buildAvatarBlocks(entities, props) {
            props = __APP.BUILD.normalizeBuildProps(props, ['avatar_classes', 'block_classes']);
            if (props.is_link) {
                props.html_tag = 'a';
                props.block_classes.push('link', 'Link');
            } else {
                props.html_tag = 'div';
            }

            return tmpl('avatar-block', (entities instanceof Array ? entities : [entities]).map(function (entity) {
                var name, href;

                if ((props.entity && props.entity === __C.ENTITIES.USER) || entity instanceof OneUser || entity.first_name) {
                    name = entity.full_name ? entity.full_name : (entity.first_name + ' ' + entity.last_name);
                    href = '/user/' + entity.id;
                } else {
                    name = entity.short_name ? entity.short_name : entity.name;
                    href = '/organization/' + entity.id;
                }

                return $.extend(true, {
                    avatar: __APP.BUILD.avatars(entity, {
                        classes: props.avatar_classes
                    }),
                    attributes: {
                        href: href
                    },
                    name: name
                }, props);
            }));
        },
        /**
         *
         * @param {(OneUser|UsersCollection|OneOrganization|OrganizationsCollection|Array)} entities
         * @param {buildProps} [props]
         * @returns {jQuery|undefined}
         */
        avatars: function buildAvatars(entities, props) {
            var map = function () {
                },
                tmp = [],
                output_entities;
            if (!entities || (entities instanceof Array && !entities.length))
                return;
            props = __APP.BUILD.normalizeBuildProps(props);
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

            switch (true) {
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
                    if (!(entities instanceof Array)) {
                        tmp = [entities];
                    }
                    map = tmp[0].avatar_url ? userMap : orgMap;
                    break;
                }
            }
            output_entities = (entities instanceof Array) ? entities : [entities];

            return tmpl('avatar', output_entities.map(map));
        },
        /**
         *
         * @param {Array} entities
         * @param {number} max_count
         * @param {buildProps} [props]
         * @param {boolean} [props.avatar_is_link]
         * @param {number} [overall_avatars_count]
         * @returns {jQuery}
         */
        avatarCollection: function buildAvatarCollection(entities, max_count, props, overall_avatars_count) {
            var data = __APP.BUILD.normalizeBuildProps(props, ['counter_classes']),
                i, count;

            data.dataset.max_amount = max_count;
            data.classes.push('-max_' + max_count);

            data.avatars = __APP.BUILD.avatars(__APP.USER);
            for (i = 0, count = 1; count <= max_count; i++) {
                if (!entities[i]) break;
                if (entities[i].id != __APP.USER.id) {
                    data.avatars = data.avatars.add(__APP.BUILD.avatars(entities[i]));
                    count++;
                }
            }
            data.more_avatars_count = (count <= max_count) ? 0 : ( (overall_avatars_count ? overall_avatars_count : entities.length) - max_count );
            if (data.more_avatars_count <= 0) {
                data.counter_classes.push('-cast');
            }

            return tmpl('avatars-collection', data);
        },

        activity: function buildActivity(activities, props) {
            var ICON_CLASSES = {};

            ICON_CLASSES[OneAbstractActivity.TYPES.SUBSCRIBE] = 'plus';
            ICON_CLASSES[OneAbstractActivity.TYPES.FAVE] = 'star';
            ICON_CLASSES[OneAbstractActivity.TYPES.UNSUBSCRIBE] = ICON_CLASSES[OneAbstractActivity.TYPES.UNFAVE] = 'minus';

            props = __APP.BUILD.normalizeBuildProps(props, ['avatar_classes']);
            props.avatar_classes.push('-size_50x50', '-rounded');

            return tmpl('activity-block', (activities instanceof Array ? activities : [activities]).map(function (activity) {
                var entity_props = {},
                    locales = __LOCALES.ru_RU.TEXTS.ACTIVITY[OneAbstractActivity.TYPES_INDEX[activity.type_code]];

                switch (true) {
                    case (activity instanceof OneOrganizationActivity): {
                        entity_props = {
                            entity: 'organization',
                            img_url: activity.organization.img_small_url ? activity.organization.img_small_url : activity.organization.img_url,
                            entity_url: '/organization/' + activity.organization.id,
                            hero_text: activity.organization.short_name
                        };
                        break;
                    }
                    case (activity instanceof OneEventActivity): {
                        entity_props = {
                            entity: 'event',
                            img_url: activity.event.image_horizontal_small_url ? activity.event.image_horizontal_small_url : activity.event.image_horizontal_url,
                            entity_url: '/event/' + activity.event.id,
                            hero_text: activity.event.title
                        };
                        break;
                    }
                }
                return $.extend(entity_props, {
                    creator_avatar: __APP.BUILD.avatars(activity.user, {
                        classes: props.avatar_classes,
                        is_link: props.avatar_is_link,
                        badge: tmpl('avatar-badge', {icon_class: ICON_CLASSES[activity.type_code]})
                    }),
                    type_code: activity.type_code,
                    additional_info: getGenderText(activity.user.gender, locales),
                    creator_url: '/user/' + activity.user.id,
                    creator_name: activity.user.full_name ? activity.user.full_name : (activity.user.first_name + ' ' + activity.user.last_name),
                    date: moment.unix(activity.created_at).calendar(null, __LOCALES.ru_RU.DATE.CALENDAR_DATE_TIME)
                })
            }));
        },
        /**
         *
         * @param {(OneOrganization|Array<OneOrganization>|OrganizationsCollection)} organizations
         * @param {object} [additional_fields]
         * @returns {jQuery}
         */
        organizationItems: function buildOrganizationItems(organizations, additional_fields) {
            organizations = organizations instanceof Array ? organizations : [organizations];
            var orgs = organizations.map(function (org) {
                org.counter_classes = org.new_events_count ? [] : [__C.CLASSES.HIDDEN];
                return org;
            });
            return tmpl('organization-item', orgs.map(function (organization) {
                return $.extend(true, {
                    avatar_block: __APP.BUILD.avatarBlocks(organization, {
                        entity: 'organization',
                        avatar_classes: ['-size_30x30']
                    })
                }, organization, __APP.BUILD.normalizeBuildProps(additional_fields, ['avatar_classes', 'block_classes', 'counter_classes']));
            }));
        },
        /**
         *
         * @param {(Array<OneOrganization>|OrganizationsCollection)} organizations
         * @returns {jQuery}
         */
        organizationCard: function buildOrganisationCard(organizations) {
            return tmpl('organization-card', organizations.map(function (org) {
                return $.extend(true, {}, org, {
                    background_image: (org.background_small_img_url || org.background_img_url) ? __APP.BUILD.link({
                            page: '/organization/' + org.id,
                            classes: ['organization_unit_background'],
                            attributes: {
                                style: 'background-image: url(' + (org.background_small_img_url || org.background_img_url) + ')'
                            }
                        }) : '',
                    avatar: __APP.BUILD.avatars(org, {
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
                    redact_org_button: (org.role === OneUser.ROLE.UNAUTH || org.role === OneUser.ROLE.USER) ? '' : __APP.BUILD.link({
                            classes: [
                                'button',
                                __C.CLASSES.SIZES.LOW,
                                __C.CLASSES.COLORS.MARGINAL_PRIMARY,
                                __C.CLASSES.ICON_CLASS,
                                __C.CLASSES.ICONS.PENCIL,
                                __C.CLASSES.UNIVERSAL_STATES.EMPTY,
                                __C.CLASSES.HOOKS.RIPPLE
                            ],
                            page: 'organization/' + org.id + '/edit'
                        })
                });
            }))
        },
        /**
         *
         * @param {Array<OneEvent>} events
         * @param {OrganizationPage~EventType} type
         * @returns {jQuery}
         */
        eventBlocks: function buildEventBlocks(events, type) {
            return tmpl('event-block', events.map(function (event) {
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

                if (event.is_favorite) {
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
                    divider: different_day ? tmpl('divider', {
                            title: m_event_date.calendar().capitalize()
                        }) : '',
                    action_buttons: $action_buttons,
                    date: m_event_date.format(__C.DATE_FORMAT),
                    avatars_collection: __APP.BUILD.avatarCollection(event.favored, 4, {
                        dataset: {
                            modal_type: 'favors',
                            modal_event_id: event.id
                        },
                        classes: avatars_collection_classes,
                        counter_classes: [__C.CLASSES.SIZES.X30, __C.CLASSES.UNIVERSAL_STATES.BORDERED, __C.CLASSES.COLORS.MARGINAL, __C.CLASSES.HOOKS.ADD_AVATAR.STATES.CASTABLE]
                    }, event.favored_users_count),
                    time: event.dates.reduce(function (times, date) {
                        if (moment.unix(date.event_date).format(__C.DATE_FORMAT) == m_event_date.format(__C.DATE_FORMAT)) {
                            times.push(displayTimeRange(date.start_time, date.end_time));
                        }
                        return times;
                    }, []).join('; ')
                })
            }));
        },
        /**
         *
         * @param {OneCategory|Array<OneCategory>} categories
         * @returns {jQuery}
         */
        organisationsCategoriesItems: function buildOrganisationsCategoriesItems(categories) {
            if (!(categories instanceof Array))
                categories = [categories];
            return tmpl('organization-category', categories.map(function (cat) {
                var is_parent_category = true,
                    new_events_count,
                    aside_classes = [];

                if (cat.organizations && cat.organizations.new_events_count) {
                    if (is_parent_category) {
                        new_events_count = cat.organizations.reduce(function (sum, org) {
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
        },
        /**
         *
         * @param {Array} subscribers
         * @param {boolean} [last_is_fiend]
         * @returns {jQuery}
         */
        subscribers: function buildSubscribers(subscribers, last_is_fiend) {
            return tmpl('subscriber', subscribers.map(function (subscriber, i) {
                var append_divider = (typeof last_is_fiend == 'undefined') || last_is_fiend != subscriber.is_friend;

                last_is_fiend = subscriber.is_friend;
                return {
                    divider: append_divider ? tmpl('subscriber-divider', {label: subscriber.is_friend ? 'Друзья' : 'Все подписчики'}) : '',
                    avatar_block: __APP.BUILD.avatarBlocks(subscriber, {
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
        },
        /**
         *
         * @param {(OneEvent|Array<OneEvent>|EventsCollection)} events
         * @returns {jQuery}
         */
        eventCards: function buildEventCards(events) {
            var $events;
            events = events instanceof Array ? events : [events];

            $events = tmpl('feed-event', events.map(function (event) {
                var avatars_collection_classes = [
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

                $header_buttons = $header_buttons.add(__APP.BUILD.button({
                    classes: [
                        'feed_event_header_button',
                        __C.CLASSES.SIZES.LOW,
                        __C.CLASSES.ICON_CLASS,
                        __C.CLASSES.ICONS.TIMES,
                        __C.CLASSES.UNIVERSAL_STATES.EMPTY,
                        'HideEvent'
                    ],
                    dataset: {
                        'event-id': event.id
                    }
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
                    organization_avatar_block: __APP.BUILD.avatarBlocks(organization, {
                        block_classes: [__C.CLASSES.SIZES.SMALL],
                        is_link: true,
                        entity: 'organization'
                    }),
                    action_button: $action_button,
                    avatars_collection: __APP.BUILD.avatarCollection(event.favored, 4, {
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
                    feed_event_infos: tmpl('feed-event-info', feed_event_infos),
                    header_buttons: $header_buttons
                }, event);
            }));

            events.forEach(function (event, i) {
                $events.eq(i).appear(function () {
                    storeStat(event.id, __C.STATS.EVENT_ENTITY, __C.STATS.EVENT_VIEW);
                }, {accY: 100})
            });

            if (__APP.USER.isLoggedOut()) {
                $events.find('.HideEvent').remove();
            }

            return $events;
        },
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
        modal: function (props) {
            var $modal,
                normalized_props = __APP.BUILD.normalizeBuildProps(props, ['content_classes']),
                vars = {
                    modal_header: '',
                    modal_type: normalized_props.type,
                    modal_content: normalized_props.content,
                    modal_classes: normalized_props.classes,
                    modal_content_classes: normalized_props.content_classes,
                    modal_footer: ''
                };

            if (normalized_props.header) {
                vars.modal_header = normalized_props.header;
            } else if (normalized_props.title) {
                vars.modal_header = tmpl('modal-header', {
                    title: normalized_props.title,
                    close_button: __APP.BUILD.button({
                        classes: ['-empty', '-modal_destroyer', 'CloseModal', 'RippleEffect'],
                        title: '×'
                    })
                });
            }

            if (normalized_props.footer) {
                vars.modal_footer = normalized_props.footer;
            } else if (normalized_props.footer_buttons) {
                vars.modal_footer = tmpl('modal-footer', {footer_buttons: normalized_props.footer_buttons});
            }

            $modal = tmpl('modal', vars);
            if (normalized_props.width) {
                $modal.width(normalized_props.width);
            }
            if (normalized_props.height) {
                $modal.height(normalized_props.height);
            }

            return $modal;
        }
    },
    /**
     * Rendering header tabs
     * @param {(buildProps|Array<buildProps>)} tabs
     */
    renderHeaderTabs: function renderHeaderTabs(tabs) {
        var $wrapper = $('#main_header_bottom').find('.HeaderTabsWrapper');
        tabs = tabs instanceof Array ? tabs : [tabs];
        tabs.forEach(function (tab) {
            tab = __APP.BUILD.normalizeBuildProps(tab);
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
        if (typeof new_title === 'string') {
            title_str = new_title;
            new_title = new_title.split(' > ');
        }
        switch (true) {
            case (new_title instanceof Array): {
                new_title.forEach(function (title_chunk, i) {
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
                new_title.each(function () {
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
     */
    changeState: function changeState(page_name, soft_change, reload) {
        if (page_name) {
            page_name = page_name.indexOf('/') == 0 ? page_name : '/' + page_name;
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
    },
    reload: function () {
        return __APP.changeState(location.pathname, true, true);
    },
    init: function appInit() {
        var $sidebar_nav_items = $('.SidebarNavItem');

        __APP.CURRENT_PAGE = Page.routeNewPage(window.location.pathname);
        __APP.CURRENT_PAGE.fetchData();
        __APP.CURRENT_PAGE.show();
        $sidebar_nav_items.removeClass(__C.CLASSES.ACTIVE)
            .filter(function () {
                return window.location.pathname.indexOf(this.getAttribute('href')) === 0;
            }).addClass(__C.CLASSES.ACTIVE);
    },
    reInit: function appReInit() {
        $(window).off('scroll');

        __APP.SERVER.abortAllConnections();
        __APP.PREVIOUS_PAGE = __APP.CURRENT_PAGE;
        __APP.PREVIOUS_PAGE.destroy();
        __APP.init();

        if (!(__APP.CURRENT_PAGE instanceof SearchPage)) {
            $('#search_bar_input').val('');
        }
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
            }
        },
        DATE: {
            DATE_FORMAT: 'DD.MM.YYYY',
            MONTH_SHORT_NAMES: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
            MONTH_NAMES: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
            CALENDAR_DATE_TIME: {
                sameDay: '[Сегодня в] HH:mm',
                lastDay: '[Вчера в] HH:mm',
                nextWeek: 'dddd [в] HH:mm',
                lastWeek: 'D MMMM [в] HH:mm',
                sameElse: 'D MMMM [в] HH:mm'
            }
        }
    }
};
Object.seal(__APP);
Object.freeze(__APP.SERVER);
Object.freeze(__APP.ROUTING);
Object.freeze(__APP.BUILD);
Object.freeze(__C);
Object.freeze(__LOCALES);
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

$(document)
    .ajaxStart(function () {
        Pace.restart()
    })
    .ajaxError(function (event, jqxhr, settings, thrownError) {
        if (!(thrownError && thrownError == 'abort')) {
            ServerConnection.ajaxErrorHandler(event, jqxhr, settings, thrownError);
        }
    })
    .ready(function () {
        var OneSignal = window.OneSignal || [],
            user_jqhxr,
            auth_urls_jqxhr,
            geolocation_jqxhr;

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

        if (window['moment'] != undefined) {
            moment.locale(navigator.language);
            //moment.tz.setDefault('Europe/Moscow');
            moment.updateLocale('ru', {
                monthsShort: __LOCALES.ru_RU.DATE.MONTH_SHORT_NAMES,
                calendar: {
                    sameDay: '[Сегодня]',
                    nextDay: '[Завтра]',
                    lastDay: '[Вчера]',
                    nextWeek: 'dddd',
                    lastWeek: 'D MMMM',
                    sameElse: 'D MMMM'
                }
            })
        }

        if (window['Highcharts'] != undefined) {
            Highcharts.setOptions({
                lang: {
                    shortMonths: __LOCALES.ru_RU.DATE.MONTH_SHORT_NAMES
                }
            });
        }

        /**
         * Bind only on 'back' action
         */
        History.Adapter.bind(window, 'statechange', function () {
            if (History.getCurrentIndex() - 1 !== History.getState().data._index) {
                __APP.reInit();
            }
        });

        user_jqhxr = __APP.USER.fetchUser(new Fields('accounts', 'accounts_links', {
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
        geolocation_jqxhr = outerAjax('https://freegeoip.net/json/');

        __APP.SERVER.multipleAjax(user_jqhxr, auth_urls_jqxhr, geolocation_jqxhr, function (user_data, auth_urls, geolocation) {
            var selected_city = JSON.parse(localStorage.getItem('selected_city'));

            __APP.LOCATION = geolocation;
            __APP.AUTH_URLS = auth_urls;

            if (selected_city) {
                __APP.USER.selected_city.setData(selected_city);
            } else {
                (new CitiesCollection()).fetchCities('timediff_seconds', null, null, function () {
                    var selected_city;
                    if (this.has(__APP.LOCATION.city)) {
                        selected_city = this.getByName(__APP.LOCATION.city);
                        __APP.USER.selected_city.setData(selected_city);
                        localStorage.setItem('selected_city', JSON.stringify(selected_city));
                    } else {
                        (new CityChooseModal(this)).show();
                    }
                });
            }

            if (__APP.USER.id === -1) {
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