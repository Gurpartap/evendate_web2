/**
 * @requires Class.PostMessageConnection.js
 */
/**
 *
 * @class WidgetPostMessageConnection
 * @extends PostMessageConnection
 */
WidgetPostMessageConnection = extending(PostMessageConnection, (function() {
	/**
	 *
	 * @param {Window} window
	 *
	 * @constructor
	 * @constructs WidgetPostMessageConnection
	 *
	 * @property {Window} window
	 */
	function WidgetPostMessageConnection(window) {
		PostMessageConnection.call(this, window);
	}
	/**
	 *
	 * @param {string} redirect_uri
	 * @param {Window} [send_to_window]
	 *
	 * @return void
	 */
	WidgetPostMessageConnection.prototype.redirect = function(redirect_uri, send_to_window) {
		
		return this.postMessageFactory('redirect', redirect_uri, send_to_window);
	};
	/**
	 *
	 * @param {Window} [send_to_window]
	 *
	 * @return void
	 */
	WidgetPostMessageConnection.prototype.ready = function(send_to_window) {
		
		return this.postMessageFactory('ready', null, send_to_window);
	};
	/**
	 *
	 * @param {string} height
	 * @param {Window} [send_to_window]
	 *
	 * @return void
	 */
	WidgetPostMessageConnection.prototype.setHeight = function(height, send_to_window) {
		
		return this.postMessageFactory('setHeight', height, send_to_window);
	};
	
	return WidgetPostMessageConnection;
}()));