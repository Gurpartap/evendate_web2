/**
 * @requires Class.Modal.js
 */
function MapModal(location, title) {
	if (location) {
		this.location = location;
		this.title = title ? title : 'Место проведения события';
		this.content = tmpl('modal-map-content', {location: this.location});
		
		this.modal = tmpl('modal', {
			modal_type: 'MapModal',
			modal_content_classes: '-no_padding',
			modal_title: tmpl('modal-title', {title: this.title}),
			modal_content: this.content
		});
		Modal.pushModal(this);
	} else {
		throw Error('To initiate map you need to pass location (location)')
	}
}
MapModal.extend(Modal);