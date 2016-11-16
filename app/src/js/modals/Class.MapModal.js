/**
 * @requires Class.AbstractModal.js
 */
/**
 * @class
 * @extends AbstractModal
 */
MapModal = extending(AbstractModal, (function() {
	function MapModal(location, title) {
		if (location) {
			AbstractModal.call(this, {
				content: tmpl('modal-map-content', {location: location}),
				type: 'MapModal',
				classes: ['-size_wide'],
				content_classes: ['-no_padding']
			});
			this.location = location;
		} else {
			throw Error('To initiate map you need to pass location (location)')
		}
	}
	
	return MapModal;
}()));