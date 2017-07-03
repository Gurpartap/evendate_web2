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
	 *
	 * @return {jqPromise}
	 */
	ServerExports.prototype.export = function(url, format) {
		
		return $.fileDownload(url, {
			data: {
				format: format || ServerExports.EXPORT_EXTENSION.XLSX
			}
		});
	};
	/**
	 *
	 * @param {number} organization_id
	 * @param {ServerExports.EXPORT_EXTENSION} [format=xlsx]
	 *
	 * @return {jqPromise}
	 */
	ServerExports.prototype.organizationSubscribers = function(organization_id, format) {
	
		return this.export('/api/v1/statistics/organizations/'+organization_id+'/subscribers/export', format);
	};
	/**
	 *
	 * @param {number} event_id
	 * @param {ServerExports.EXPORT_EXTENSION} [format=xlsx]
	 *
	 * @return {jqPromise}
	 */
	ServerExports.prototype.eventOrders = function(event_id, format) {
		
		return this.export('/api/v1/statistics/events/'+event_id+'/orders/export', format);
	};
	/**
	 *
	 * @param {number} event_id
	 * @param {ServerExports.EXPORT_EXTENSION} [format=xlsx]
	 *
	 * @return {jqPromise}
	 */
	ServerExports.prototype.eventTickets = function(event_id, format) {
		
		return this.export('/api/v1/statistics/events/'+event_id+'/tickets/export', format);
	};
	
	
	return ServerExports;
}()));