/**
 *
 * @class PostMessageConnection
 */
PostMessageConnection = (function() {
	/**
	 *
	 * @param {Window} window
	 *
	 * @constructor
	 * @constructs PostMessageConnection
	 *
	 * @property {Window} window
	 */
	function PostMessageConnection(window) {
		this.window = window;
	}
	/**
	 *
	 * @final
	 * @protected
	 *
	 * @param {string} command
	 * @param {*} data
	 * @param {Window} [send_to_window]
	 *
	 * @return void
	 */
	PostMessageConnection.prototype.postMessageFactory = function(command, data, send_to_window) {
		var self = this;
		
		return (send_to_window ? send_to_window : self.window.parent).postMessage(JSON.stringify({
			command: command,
			data: data
		}), '*');
	};
	
	/**
	 *
	 * @enum {string}
	 */
	PostMessageConnection.AVAILABLE_COMMANDS = {
		SET_COLOR: 'setColor',
		GET_HEIGHT: 'getHeight',
		REDIRECT: 'redirect',
		FETCH_REDIRECT_PARAM: 'fetchRedirectToParam'
	};
	/**
	 * @callback postMessageListenerCallback
	 * @this Window
	 * @param {*} data
	 * @param {Window} source
	 * @param {string} origin
	 */
	/**
	 *
	 * @final
	 *
	 * @param {PostMessageConnection.AVAILABLE_COMMANDS} command
	 * @param {postMessageListenerCallback} callback
	 * @param {string} [secure_origin]
	 *
	 * @return void
	 */
	PostMessageConnection.prototype.listen = function(command, callback, secure_origin) {
		var self = this;
		/**
		 *
		 * @param {object} event
		 * @param {string} event.data
		 * @param {string} event.origin
		 * @param {Window} event.source
		 */
		function listener(event) {
			var resp;
			
			try {
				resp = JSON.parse(event.data);
			} catch (e) {
				
				return null;
			}
			
			if (resp.command !== command || !isFunction(callback) || (secure_origin && event.origin !== secure_origin)) {
				
				return null;
			}
			
			return callback.call(self.window, resp.data, event.source, event.origin);
		}
		
		if (this.window.addEventListener) {
			this.window.addEventListener('message', listener);
		} else {
			this.window.attachEvent('onmessage', listener);
		}
	};
	
	
	return PostMessageConnection;
}());