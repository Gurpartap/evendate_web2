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
	 * @returns {Promise}
	 */
	AsynchronousConnection.prototype.dealAjax = AsynchronousConnection.dealAjax = function(http_method, url, ajax_data, content_type, success, error) {
		
		return (new Promise(function(resolve, reject) {
			$.ajax({
				url: url,
				data: ajax_data,
				method: http_method,
				contentType: content_type || 'application/x-www-form-urlencoded; charset=UTF-8',
				success: resolve,
				error: reject
			});
		})).then((function(response) {
			if (
				response.hasOwnProperty('status') &&
				response.hasOwnProperty('data') &&
				response.hasOwnProperty('code') &&
				response.hasOwnProperty('text')
			) {
				
				return response.data;
			}
			
			return response;
		})).catch(error).then(success);
	};
	/**
	 * @param {...(jqXHR|Deferred|Promise)} Deferreds
	 * @param {function(..(Array|object))} [cb]
	 * @return {Promise}
	 */
	AsynchronousConnection.prototype.multipleAjax = AsynchronousConnection.multipleAjax = function() {
		var with_callback = (arguments[arguments.length - 1] instanceof Function),
			promises = with_callback ?
			           Array.prototype.splice.call(arguments, 0, arguments.length - 1) :
			           Array.prototype.slice.call(arguments),
			parallel_promise;
		
		parallel_promise = Promise.all(promises);
		if (with_callback) {
			parallel_promise.then((results) => {
				Array.prototype.shift.call(arguments).apply(this, [...results]);
				
				return this;
			});
		}
		
		return parallel_promise;
	};
	
	
	return AsynchronousConnection;
}());