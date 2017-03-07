/**
 * @requires Class.AbstractModal.js
 */
/**
 * @class
 * @extends AbstractModal
 */
MapModal = extending(AbstractModal, (function() {
	/**
	 *
	 * @param {string} location
	 * @constructor
	 * @constructs MapModal
	 */
	function MapModal(location) {
		AbstractModal.call(this);
		if (location) {
			this.location = location;
			this.content = tmpl('modal-map-content', {
				location: location
			});
		} else {
			throw Error('To initiate map you need to pass location (location)')
		}
	}
	/**
	 *
	 * @return {MapModal}
	 */
	MapModal.prototype.render = function(){
		this.__render({
			classes: ['-size_wide'],
			content_classes: ['-no_padding']
		});
		
		return this;
	};
	
	return MapModal;
}()));