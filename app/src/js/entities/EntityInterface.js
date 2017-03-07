/**
 * @typedef {object} AJAXData
 * @property {(Array|string|undefined)} [fields]
 * @property {(string|undefined)} [format=json] Sets the response format. Can be xml or json. Default: json
 * @property {(boolean|undefined)} [download=false] If flag is TRUE server will set additional headers to make response downloadble in browser. Default: false
 * @property {(boolean|undefined)} [nude_data=false] If nude_data is TRUE server response with only data, without status code and description. Default: false
 * @property {(number|undefined)} [offset] Use offset to set how many elements you want to skip. Default: 0
 * @property {(number|undefined)} [length] Sets the items count server will return in response. Default: 100
 * @property {(string|undefined)} [order_by]
 */
/**
 * @typedef {function(({}|Array<{}>))} AJAXCallback
 */
/**
 * @interface
 */
EntityInterface = (function() {
	/**
	 *
	 * @interface
	 */
	function EntityInterface() {}
	/**
	 *
	 * @param {(Array|object)} data
	 * @returns {EntityInterface}
	 */
	EntityInterface.prototype.setData = function(data) {};
	
	return EntityInterface;
}());