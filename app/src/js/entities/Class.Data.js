/**
 *
 * @class Data
 */
Data = (function() {
	/**
	 *
	 * @constructor
	 * @constructs Data
	 */
	function Data() {}
	
	Data.prototype.ID_PROP_NAME = 'id';
	/**
	 *
	 * @param {(Array|object)} data
	 * @returns {Data}
	 */
	Data.prototype.setData = function(data) {
		var field;
		
		if (data instanceof Array) {
			data = data[0];
		}
		for (field in data) {
			if (data.hasOwnProperty(field) && this.hasOwnProperty(field)) {
				if (this[field] instanceof Data || this[field] instanceof DataSet) {
					this[field].setData(data[field]);
				} else {
					this[field] = data[field];
				}
			}
		}
		
		return this;
	};
	
	return Data;
}());