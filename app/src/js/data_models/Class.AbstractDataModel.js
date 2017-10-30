/**
 * @requires ../entities/Class.Data.js
 */
/**
 *
 * @class AbstractDataModel
 * @extends Data
 */
AbstractDataModel = extending(Data, (function() {
	/**
	 *
	 * @constructor
	 * @constructs AbstractDataModel
	 */
	function AbstractDataModel() {
		Data.call(this);
	}
	
	return AbstractDataModel;
}()));