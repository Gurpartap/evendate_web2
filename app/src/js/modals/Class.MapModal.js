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
			classes: [__C.CLASSES.FLOATING_MATERIAL, __C.CLASSES.MODAL_STATES.SIZE.WIDE],
			content_classes: [__C.CLASSES.MODAL_STATES.NO_PADDING]
		});
		
		return this;
	};
	
	return MapModal;
}()));