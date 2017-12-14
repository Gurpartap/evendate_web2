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
	
	ServerExports.ENDPOINT = Object.freeze({
		ORGANIZATION_SUBSCRIBERS: '/statistics/organizations/{organization_id}/subscribers/export',
		EVENT_ORDERS: '/statistics/events/{event_id}/orders/export',
		EVENT_TICKETS: '/statistics/events/{event_id}/tickets/export',
		EVENT_TICKET: '/events/{event_id}/tickets/{ticket_uuid}/export',
	});
	/**
	 *
	 * @param {string} url
	 * @param {ServerExports.EXPORT_EXTENSION} [format=xlsx]
	 *
	 * @return {Promise}
	 */
	ServerExports.prototype.export = function(url, format) {
		url = url.contains('/api/v1') ? url : '/api/v1' + url;
		
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
	 * @return {Promise}
	 */
	ServerExports.prototype.organizationSubscribers = function(organization_id, format) {
	
		return this.export(ServerExports.ENDPOINT.ORGANIZATION_SUBSCRIBERS.format({organization_id: organization_id}), format);
	};
	/**
	 *
	 * @param {number} event_id
	 * @param {ServerExports.EXPORT_EXTENSION} [format=xlsx]
	 *
	 * @return {Promise}
	 */
	ServerExports.prototype.eventOrders = function(event_id, format) {
		
		return this.export(ServerExports.ENDPOINT.EVENT_ORDERS.format({event_id: event_id}), format);
	};
	/**
	 *
	 * @param {number} event_id
	 * @param {ServerExports.EXPORT_EXTENSION} [format=xlsx]
	 *
	 * @return {Promise}
	 */
	ServerExports.prototype.eventTickets = function(event_id, format) {
		
		return this.export(ServerExports.ENDPOINT.EVENT_TICKETS.format({event_id: event_id}), format);
	};
	/**
	 *
	 * @param {number} event_id
	 * @param {string} uuid
	 *
	 * @return {Promise}
	 */
	ServerExports.prototype.eventTicket = function(event_id, uuid) {
		
		return this.export(ServerExports.ENDPOINT.EVENT_TICKET.format({
			event_id: event_id,
			ticket_uuid: uuid
		}));
	};
	
	
	return ServerExports;
}()));