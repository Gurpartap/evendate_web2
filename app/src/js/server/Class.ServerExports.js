/**
 * @requires Class.AsynchronousConnection.js
 */
/**
 * @singleton
 * @extends AsynchronousConnection
 * @class ServerConnection
 */
ServerExports = extending(AsynchronousConnection, (function() {
	/**
	 *
	 * @constructor
	 * @constructs ServerExports
	 */
	function ServerExports() {
		if (typeof ServerExports.instance === 'object') {
			return ServerExports.instance;
		}
		ServerExports.instance = this;
	}
	
	/**
	 *
	 * @enum
	 */
	ServerExports.EXPORT_EXTENSION = {
		XLSX: 'xlsx',
		HTML: 'html'
	};
	/**
	 *
	 * @param {string} url
	 * @param {ServerExports.EXPORT_EXTENSION} [format=xlsx]
	 * @param {function} [success]
	 * @param {function} [error]
	 *
	 * @return {jqPromise}
	 */
	ServerExports.prototype.export = function(url, format, success, error) {
		
		return this.dealAjax(AsynchronousConnection.HTTP_METHODS.GET, url, {
			format: format || ServerExports.EXPORT_EXTENSION.XLSX
		}, null, success, error);
	};
	/**
	 *
	 * @param {number} organization_id
	 * @param {ServerExports.EXPORT_EXTENSION} [format=xlsx]
	 * @param {function} [success]
	 * @param {function} [error]
	 *
	 * @return {jqPromise}
	 */
	ServerExports.prototype.organizationSubscribers = function(organization_id, format, success, error) {
	
		return this.export('/api/v1/statistics/organizations/'+organization_id+'/subscribers/export', format, success, error);
	};
	/**
	 *
	 * @param {number} event_id
	 * @param {ServerExports.EXPORT_EXTENSION} [format=xlsx]
	 * @param {function} [success]
	 * @param {function} [error]
	 *
	 * @return {jqPromise}
	 */
	ServerExports.prototype.eventOrders = function(event_id, format, success, error) {
		
		return this.export('/api/v1/statistics/events/'+event_id+'/orders/export', format, success, error);
	};
	/**
	 *
	 * @param {number} event_id
	 * @param {ServerExports.EXPORT_EXTENSION} [format=xlsx]
	 * @param {function} [success]
	 * @param {function} [error]
	 *
	 * @return {jqPromise}
	 */
	ServerExports.prototype.eventTickets = function(event_id, format, success, error) {
		
		return this.export('/api/v1/statistics/events/'+event_id+'/tickets/export', format, success, error);
	};
	
	
	return ServerExports;
}()));