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
		} else {
			throw Error('To initiate map you need to pass location (location)')
		}
	}
	/**
	 *
	 * @return {MapModal}
	 */
	MapModal.prototype.render = function() {
		this.content = tmpl('modal-map-content', {
			iframe_height: $(window).height() - 200,
			location: this.location
		});
		
		this.__render({
			classes: [__C.CLASSES.FLOATING_MATERIAL, __C.CLASSES.MODAL_STATES.SIZE.WIDE],
			content_classes: [__C.CLASSES.MODAL_STATES.NO_PADDING]
		});
		
		return this;
	};
	/**
	 *
	 * @return {MapModal}
	 */
	MapModal.prototype.show = function() {
		var self = this,
			$window = $(window);
		
		$window.on('resize.changeMapHeight', function() {
			self.content.height($window.height() - 200);
			self.adjustDestroyerHeight();
		});
		
		this.__show();
		
		return this;
	};
	/**
	 *
	 * @return {MapModal}
	 */
	MapModal.prototype.hide = function() {
		$(window).off('resize.changeMapHeight');
		this.__hide();
		
		return this;
	};
	
	return MapModal;
}()));