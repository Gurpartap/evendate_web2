/**
 * @singleton
 * @class AsynchronousConnection
 */
AsynchronousConnection = (function() {
	/**
	 *
	 * @constructor
	 * @constructs AsynchronousConnection
	 */
	function AsynchronousConnection() {
		if (typeof AsynchronousConnection.instance === 'object') {
			return AsynchronousConnection.instance;
		}
		AsynchronousConnection.instance = this;
	}
	
	/**
	 *
	 * @enum {string}
	 */
	AsynchronousConnection.HTTP_METHODS = {
		GET: 'GET',
		POST: 'POST',
		PUT: 'PUT',
		DELETE: 'DELETE'
	};
	Object.freeze(AsynchronousConnection.HTTP_METHODS);
	/**
	 *
	 * @param {AsynchronousConnection.HTTP_METHODS} http_method
	 * @param {string} url
	 * @param {(object|string)} [ajax_data]
	 * @param {string} [content_type='application/x-www-form-urlencoded; charset=UTF-8']
	 * @param {function} [success]
	 * @param {function} [error]
	 *
	 * @returns {jqPromise}
	 */
	AsynchronousConnection.prototype.dealAjax = AsynchronousConnection.dealAjax = function(http_method, url, ajax_data, content_type, success, error) {
		
		return $.ajax({
			url: url,
			data: ajax_data,
			method: http_method,
			contentType: content_type || 'application/x-www-form-urlencoded; charset=UTF-8'
		}).then((function(response, status_text, jqXHR) {
			if (
				response.hasOwnProperty('status') &&
				response.hasOwnProperty('data') &&
				response.hasOwnProperty('code') &&
				response.hasOwnProperty('text')
			) {
				
				return response.data;
			}
			
			return response;
		})).fail(error).done(success);
	};
	/**
	 * @param {...(jqXHR|Deferred|jqPromise)} Deferreds
	 * @param {function(..(Array|object))} [cb]
	 * @return {jqPromise}
	 */
	AsynchronousConnection.prototype.multipleAjax = AsynchronousConnection.multipleAjax = function(){
		var with_callback = (arguments[arguments.length - 1] instanceof Function),
			promises = with_callback ? Array.prototype.splice.call(arguments, 0, arguments.length - 1) : Array.prototype.slice.call(arguments),
			parallel_promise;
		
		parallel_promise = $.when.apply($, promises);
		if(with_callback) {
			parallel_promise.done(Array.prototype.shift.call(arguments));
		}
		return parallel_promise.promise();
	};
	
	
	return AsynchronousConnection;
}());