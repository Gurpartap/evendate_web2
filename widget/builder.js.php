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
	var EvendateWidgetBuilder = (function() {
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
			this.is_loaded = false;

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

			this.sendPostMessage = {
				setColor: this.postMessageFactory('setColor'),
				getHeight: this.postMessageFactory('getHeight')
			};
		}

		EvendateWidgetBuilder.prototype.postMessageHandler = function(command, data) {
			switch (command) {
				case 'ready': {

					return this.is_loaded = true;
				}
				case 'setHeight': {

					return this.setHeight(data);
				}
			}
		};

		/**
		 *
		 * @param {string} command
		 *
		 * @return {function}
		 */
		EvendateWidgetBuilder.prototype.postMessageFactory = function(command) {
			var self = this;

			return function(data) {

				return self.window.postMessage(JSON.stringify({
					command: command,
					data: data
				}), '*');
			};
		};
		
		EvendateWidgetBuilder.prototype.addPostMessageListener = function() {
			/**
			 *
			 * @param {object} event
			 * @param {string} event.data
			 * @param {string} event.origin
			 * @param {Window} event.source
			 */
			var listener = function(event) {
				var data;

				if (event.origin.indexOf('evendate') !== -1) {
					data = JSON.parse(event.data);

					return this.postMessageHandler(data.command, data.data);
				}

				return null;
			}.bind(this);
			
			if (this.window.parent.addEventListener) {
				this.window.parent.addEventListener("message", listener);
			} else {
				this.window.parent.attachEvent("onmessage", listener);
			}
		};

		/**
		 *
		 * @param {number} id
		 *
		 * @return {number}
		 */
		EvendateWidgetBuilder.prototype.setId = function(id) {
			this.id = id;
			this.addPostMessageListener();

			return id;
		};
		/**
		 *
		 * @param {function} callback
		 */
		EvendateWidgetBuilder.prototype.onLoad = function(callback) {
			var self = this,
				fired = false,
				timer;

			!function checkVisibility() {
				if (self.iframe.offsetParent === null) {

					return timer = setTimeout(checkVisibility, 1);
				} else {
					clearTimeout(timer);

					return !function checkLoaded() {
						if (self.is_loaded) {
							if (!fired) {
								fired = true;
								clearTimeout(timer);

								return callback.call(self);
							}
						} else {

							return timer = setTimeout(checkLoaded, 1);
						}
					}();
				}
			}();
		};
		/**
		 *
		 * @param {(number|string)} [height]
		 *
		 * @return {string}
		 */
		EvendateWidgetBuilder.prototype.setHeight = function(height) {
			if (!this.is_loaded) {
				return this.onLoad(this.setHeight.bind(this, height));
			}

			height = function calcHeight(height) {
				if (parseInt(height) === 0) {

					return 0;
				}

				if (height != null) {
					if (+height == height) {

						return height + 'px';
					} else if (!isNaN(parseInt(height))) {

						return height;
					}
				}

				return null;
			}.call(this, height);

			if (height === 0) {
				return '0px';
			}

			if (height == null) {
				return this.sendPostMessage.getHeight();
			}

			return this.iframe.style.height = height;
		};

		/**
		 * @param {string} color
		 */
		EvendateWidgetBuilder.prototype.setColor = function(color) {
			if (!this.is_loaded) {
				return this.onLoad(this.setColor.bind(this, color));
			}

			color = '' + color;
			if (color.indexOf('#') === -1) {
				color = '#' + color;
			}

			return this.sendPostMessage.setColor(color);
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
	var iframe = document.createElement('iframe');

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

	evendateWidget.onLoad(function() {
		evendateWidget.setHeight();

		if (props['color']) {
			evendateWidget.setColor(props['color']);
		}

		evendateWidget.iframe.onload = function() {
			evendateWidget.addPostMessageListener();

			if (props['color']) {
				evendateWidget.setColor(props['color']);
			}
			evendateWidget.setHeight();
		}
	});
}(<?=$_REQUEST['id']?>, <?=json_encode( $_REQUEST )?>);<?php
		break;
	}
}
?>