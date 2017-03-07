/**
 * @class
 * @extends Array
 */
ModalsCollection = extending(Array, (function() {
	/**
	 *
	 * @param {number} length
	 * @constructor
	 * @construct ModalsCollection
	 */
	function ModalsCollection(length) {
		this.max_length = length;
		Object.defineProperty(this, 'last_id', {
			value: 0,
			writable: true,
			enumerable: false,
			configurable: false
		});
	}
	
	/**
	 *
	 * @param {AbstractModal} modal
	 */
	ModalsCollection.prototype.push = function(modal) {
		if (modal instanceof AbstractModal) {
			modal.id = ++this.last_id;
			this[this.length++] = modal;
			if (this.length > this.max_length) {
				this.shift().destroy();
			}
		}
		return this.length;
	};
	
	
	return ModalsCollection;
}()));