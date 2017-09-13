/**
 * @requires Class.PostMessageConnection.js
 */
/**
 *
 * @class AppPostMessageConnection
 * @extends PostMessageConnection
 */
AppPostMessageConnection = extending(PostMessageConnection, (function() {
	/**
	 *
	 * @param {Window} window
	 *
	 * @constructor
	 * @constructs AppPostMessageConnection
	 *
	 * @property {Window} window
	 */
	function AppPostMessageConnection(window) {
		PostMessageConnection.call(this, window);
	}
	
	return AppPostMessageConnection;
}()));