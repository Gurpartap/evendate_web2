<?php
require_once '../v1-backend/bin/env_variables.php';
require_once "{$BACKEND_FULL_PATH}/bin/db.php";
header("Content-type: application/javascript");

function wrongInitError() { ?>
	console.error('Widget wrongly initialised'); <?php
	exit();
} ?>

!function(w) {
	/**
	 * @class
	 */
	EvendateWidgetBuilder = (function() {
		/**
		 *
		 * @param {number} [id]
		 *
		 * @constructor
		 * @constructs EvendateWidgetBuilder
		 *
		 * @property {?number} id
		 * @property {?HTMLIFrameElement} iframe
		 * @property {?Window} window
		 */
		function EvendateWidgetBuilder(id) {
			var self = this;

			this.id = id;

			Object.defineProperties(this, {
				iframe: {
					get: function() {

						return document.getElementById('evendate-widget-' + self.id);
					}
				},
				window: {
					get: function() {

						return self.id ? self.iframe.contentWindow : null;
					}
				}
			});
		}
		/**
		 *
		 * @param {number} id
		 *
		 * @return {number}
		 */
		EvendateWidgetBuilder.prototype.setId = function(id) {

			return this.id = id;
		};
		/**
		 *
		 * @return {boolean}
		 */
		EvendateWidgetBuilder.prototype.isLoaded = function() {

			return !!this.id && this.window.document.readyState === "complete";
		};
		/**
		 *
		 * @param {function} callback
		 */
		EvendateWidgetBuilder.prototype.onLoad = function(callback) {
			var self = this,
				iframe = this.iframe,
				fired = false,
				timer;

			function ready() {
				if (!fired) {
					fired = true;
					clearTimeout(timer);
					callback.call(self);
				}
			}

			function readyState() {
				if (this.readyState === "complete") {
					ready.call(this);
				}
			}

			function addEvent(elem, event, fn) {
				if (elem.addEventListener) {

					return elem.addEventListener(event, fn);
				} else {

					return elem.attachEvent("on" + event, function () {

						return fn.call(elem, window.event);
					});
				}
			}

			function checkLoaded() {
				var doc = iframe.contentDocument || iframe.contentWindow.document;

				if (doc.URL.indexOf("about:") !== 0) {
					if (doc.readyState === "complete") {
						ready();
					} else {
						addEvent(doc, "DOMContentLoaded", ready);
						addEvent(doc, "readystatechange", readyState);
					}
				} else {
					timer = setTimeout(checkLoaded, 1);
				}
			}

			addEvent(iframe, "load", ready);

			checkLoaded();
		};
		/**
		 *
		 * @param {(number|string)} [height]
		 *
		 * @return {string}
		 */
		EvendateWidgetBuilder.prototype.setHeight = function(height) {
			if (!this.isLoaded()) {
				return this.onLoad(this.setHeight.bind(this, height));
			}

			height = function calcHeight(height) {
				if (height) {
					if (+height == height) {

						return height + 'px';
					} else if (!isNaN(parseInt(height))) {

						return height;
					}
				}

				return this.window.document.scrollingElement.scrollHeight + 'px';
			}.call(this, height);

			return this.iframe.style.height = height;
		};

		/**
		 * @param {string} color
		 */
		EvendateWidgetBuilder.prototype.setColor = function(color) {
			if (!this.isLoaded()) {
				return this.onLoad(this.setColor.bind(this, color));
			}

			color = '' + color;
			if (color.indexOf('#') === -1) {
				color = '#' + color;
			}

			this.window.document.body.style.setProperty('--color_accent', color);
		};

		return EvendateWidgetBuilder;
	}());

	w.evendateWidget = new EvendateWidgetBuilder();
}(window);

<?php

if (!isset( $_REQUEST['type'] )) {
	wrongInitError();
}

switch ($_REQUEST['type']) {
	case 'order': {
		if (!isset( $_REQUEST['id'])) {
			wrongInitError();
		} ?>
!function appendOrderWidget(id, props) {
	var iframe = document.createElement('iframe'),
		heightObserver;

	iframe.id = 'evendate-widget-' + id;
	iframe.setAttribute('src', '//<?=App::$DOMAIN?>/widget/order/event/' + id);
	iframe.setAttribute('frameborder', '0');
	iframe.setAttribute('scrolling', 'no');
	iframe.style.display = 'block';
	iframe.style.border = '0';
	iframe.setAttribute('width', props['width'] || '100%');
	iframe.setAttribute('height', props['height'] || '500');

	document.currentScript.parentElement.insertBefore(iframe, document.currentScript);

	evendateWidget.setId(id);

	heightObserver = new MutationObserver(function() {
		evendateWidget.setHeight();
	});

	evendateWidget.onLoad(function() {
		evendateWidget.setHeight();

		if (props['color']) {
			evendateWidget.setColor(props['color']);
		}

		heightObserver.observe(evendateWidget.window.document.body, {
			childList: true,
			subtree: true
		});

		evendateWidget.iframe.onload = function() {
			heightObserver.disconnect();
			if (props['color']) {
				evendateWidget.setColor(props['color']);
			}
			evendateWidget.setHeight();
			heightObserver.observe(evendateWidget.window.document.body, {
				childList: true,
				subtree: true
			});
		}
	});
}(<?=$_REQUEST['id']?>, <?=json_encode( $_REQUEST )?>);<?php
		break;
	}
}
?>