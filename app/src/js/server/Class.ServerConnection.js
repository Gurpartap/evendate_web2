/**
 * @requires Class.AsynchronousConnection.js
 */
/**
 * @singleton
 * @extends AsynchronousConnection
 * @class ServerConnection
 */
ServerConnection = extending(AsynchronousConnection, (function() {
	/**
	 *
	 * @constructor
	 * @constructs ServerConnection
	 *
	 * @property {Array<ServerConnection>} current_connections
	 */
	function ServerConnection() {
		if (typeof ServerConnection.instance === 'object') {
			return ServerConnection.instance;
		}
		this.current_connections = [];
		this.error_log = [];
		ServerConnection.instance = this;
	}
	
	ServerConnection.MAX_ENTITIES_LENGTH = 10000;
	
	function ajaxHandler(result, success, error) {
		error = typeof error !== 'undefined' ? error : ServerConnection.stdErrorHandler;
		success = typeof success !== 'function' ? function() {} : success;
		try {
			if (result.status) {
				success(result.data, result.text);
			} else {
				error(result);
			}
		} catch (e) {
			error(e);
		}
	}
	
	ServerConnection.stdErrorHandler = function(res) {
		console.error('Exorcizamus te, omnis immundus spiritus, omnis satanica potestas, omnis incursio infernalis adversarii, omnis legio, omnis congregatio et secta diabolica, in nomine et virtute Domini Nostri Jesu Christi, eradicare et effugare a Dei Ecclesia, ab animabus ad imaginem Dei conditis ac pretioso divini Agni sanguine redemptis!\n', res);
		showNotifier({text: 'Упс, что-то пошло не так', status: false});
	};
	/**
	 *
	 * @param {jQuery.Event} [event]
	 * @param {jqXHR} [jqxhr]
	 * @param {object} [settings]
	 * @param {string} [thrownError]
	 */
	ServerConnection.prototype.ajaxErrorHandler = function(event, jqxhr, settings, thrownError) {
		var args = Array.prototype.slice.call(arguments),
			/**
			 *
			 * @type {object}
			 * @property {jQuery.Event} [event]
			 * @property {jqXHR} [jqxhr]
			 * @property {object} [settings]
			 * @property {string} [thrownError]
			 * @property {string} [text]
			 * @property {string} [name]
			 * @property {string} [message]
			 * @property {string} [stack]
			 */
			debug = {},
			fields;
		
		switch (args.length) {
			case 4: {
				fields = ['event', 'jqxhr', 'settings', 'thrownError'];
				args.forEach(function(arg, i) {
					debug[fields[i]] = arg;
				});
				
				break;
			}
			case 3: {
				fields = ['jqxhr', 'text', 'thrownError'];
				args.forEach(function(arg, i) {
					debug[fields[i]] = arg;
				});
				
				break;
			}
			case 1: {
				debug = args[0];
				
				break;
			}
			default: {
				args.forEach(function(arg, i) {
					debug[i] = arg;
				});
				
				break;
			}
		}
		debugger;
		console.groupCollapsed('AJAX error');
		if (debug.thrownError)
			console.log('Thrown error:', debug.thrownError);
		if (debug.event && debug.event.type)
			console.log('Error type:', debug.event.type);
		if (debug.event && debug.event.text)
			console.log('Description:', debug.event.text);
		if (debug.jqxhr) {
			if (debug.jqxhr.responseJSON && debug.jqxhr.responseJSON.text) {
				console.log('Response:', debug.jqxhr.responseJSON.text);
				showNotifier({
					text: debug.jqxhr.responseJSON.text,
					status: false
				});
			} else if (debug.jqxhr.statusText) {
				showNotifier({
					text: debug.jqxhr.statusText,
					status: false
				});
			}
		}
		if (debug.settings) {
			console.log('URL:', debug.settings.url);
			console.log('Method:', debug.settings.type);
		}
		if (debug.stack) {
			console.log('Thrown error:', debug.name);
			console.log('Description:', debug.message);
			console.log('Error stacktrace:', debug.stack);
		} else {
			console.error('Error stacktrace:');
		}
		console.groupEnd();
		
		this.error_log.push(debug);
	};
	
	/**
	 *
	 * @param {AsynchronousConnection.HTTP_METHODS} http_method
	 * @param {string} url
	 * @param {(AJAXData|string)} [ajax_data]
	 * @param {string} [content_type='application/x-www-form-urlencoded; charset=UTF-8']
	 * @param {AJAXCallback} [success]
	 * @param {function} [error]
	 *
	 * @returns {Promise}
	 */
	ServerConnection.prototype.dealAjax = ServerConnection.dealAjax = function(http_method, url, ajax_data, content_type, success, error) {
		ajax_data = ajax_data || {};
		var self = this;
		
		if (ajax_data.fields instanceof Fields){
			ajax_data.fields = ajax_data.fields.toString();
		}
		
		url = url.contains('/api/v1') ? url : `/api/v1${url}`;
		
		return (new Promise(function(resolve, reject) {
			self.current_connections.push($.ajax({
				url: url,
				data: ajax_data,
				method: http_method,
				contentType: content_type || 'application/x-www-form-urlencoded; charset=UTF-8',
				success: (data, textStatus, jqXHR) => resolve(data),
				error: (jqXHR, textStatus, errorThrown) => reject({jqXHR, textStatus, errorThrown})
			}));
		})).then(function(response) {
			ajaxHandler(response, function(data, text) {
				if (isFunction(success)) {
					success(data);
				}
			});
			
			return response.data;
		}).catch(function({jqXHR, textStatus, errorThrown}) {
			if (errorThrown !== 'abort') {
				if (isFunction(error)) {
					error(jqXHR, textStatus, errorThrown);
				} else {
					self.ajaxErrorHandler(jqXHR, textStatus, errorThrown);
				}
			}
		});
	};
	/**
	 *
	 * @param {string} url
	 * @param {(object|string)} ajax_data
	 * @param {AJAXCallback} [success]
	 * @param {function} [error]
	 * @returns {Promise}
	 */
	ServerConnection.prototype.getData = function(url, ajax_data, success, error) {
		return this.dealAjax(AsynchronousConnection.HTTP_METHODS.GET, url, this.validateData(ajax_data), 'application/json', function(data) {
			if (!empty(ajax_data.length) && !empty(ajax_data.offset)) {
				ajax_data.offset += ajax_data.length;
			}
			if (isFunction(success)) {
				success(data);
			}
		}, error);
	};
	/**
	 *
	 * @param {string} url
	 * @param {(object|string)} ajax_data
	 * @param {boolean} [is_payload=false]
	 * @param {AJAXCallback} [success]
	 * @param {function} [error]
	 * @returns {Promise}
	 */
	ServerConnection.prototype.updateData = function(url, ajax_data, is_payload, success, error) {
		if (is_payload) {
			
			return this.dealAjax(AsynchronousConnection.HTTP_METHODS.PUT, url, JSON.stringify(ajax_data), 'application/json', success, error);
		}
		
		return this.dealAjax(AsynchronousConnection.HTTP_METHODS.PUT, url, ajax_data, 'application/x-www-form-urlencoded; charset=UTF-8', success, error);
	};
	/**
	 *
	 * @param {string} url
	 * @param {(object|string)} [ajax_data]
	 * @param {boolean} [is_payload=false]
	 * @param {AJAXCallback} [success]
	 * @param {function} [error]
	 * @returns {Promise}
	 */
	ServerConnection.prototype.addData = function(url, ajax_data, is_payload, success, error) {
		if (is_payload) {
			
			return this.dealAjax(AsynchronousConnection.HTTP_METHODS.POST, url, JSON.stringify(ajax_data), 'application/json', success, error);
		}
		
		return this.dealAjax(AsynchronousConnection.HTTP_METHODS.POST, url, ajax_data, 'application/x-www-form-urlencoded; charset=UTF-8', success, error);
	};
	/**
	 *
	 * @param {string} url
	 * @param {AJAXData} [ajax_data]
	 * @param {AJAXCallback} [success]
	 * @param {function} [error]
	 * @returns {Promise}
	 */
	ServerConnection.prototype.deleteData = function(url, ajax_data, success, error) {
		if (!empty(ajax_data)) {
			url = '{path}?{params}'.format({
				path: url,
				params: $.param(ajax_data)
			});
		}
		
		return this.dealAjax(AsynchronousConnection.HTTP_METHODS.DELETE, url, {}, 'application/json', success, error);
	};
	/**
	 *
	 * @param {AJAXData} ajax_data
	 * @returns {AJAXData}
	 */
	ServerConnection.prototype.validateData = function(ajax_data) {
		ajax_data = ajax_data || {};
		var order_by = [];
		
		if (ajax_data.order_by) {
			order_by = (typeof ajax_data.order_by === 'string') ? ajax_data.order_by.split(',') : ajax_data.order_by;
			order_by = order_by.map(function(unit) {
				return unit.trim().replace('-', '');
			});
			
			if (ajax_data.order_by instanceof Array) {
				ajax_data.order_by = ajax_data.order_by.join(',');
			}
		}
		
		if (!ajax_data.fields) {
			ajax_data.fields = order_by;
		} else {
			if (ajax_data.fields instanceof Array) {
				ajax_data.fields = ajax_data.fields.merge(order_by);
			} else if (ajax_data.fields instanceof Fields && order_by.length) {
				order_by.forEach(function(unit) {
					ajax_data.fields.add(unit);
				});
			}
		}
		
		ajax_data.fields = (ajax_data.fields = ajax_data.fields.toString()) ? ajax_data.fields : undefined;
		
		return ajax_data;
	};
	
	ServerConnection.prototype.abortAllConnections = function() {
		var cur;
		while (this.current_connections.length) {
			cur = this.current_connections.pop();
			if(cur.state !== 200 || cur.state() === 'pending'){
				cur.abort();
			}
		}
	};
	
	
	return ServerConnection;
}()));