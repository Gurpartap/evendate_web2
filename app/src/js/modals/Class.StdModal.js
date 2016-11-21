/**
 * @requires Class.AbstractModal.js
 */
/**
 * @class
 * @extends AbstractModal
 */
StdModal = extending(AbstractModal, (function() {
	/**
	 *
	 * @param {string} title
	 * @param {(string|jQuery)} [content]
	 * @constructor
	 */
	function StdModal(title, content) {
		AbstractModal.call(this, {
			content: content,
			title: title,
			type: '',
			content_classes: [],
			footer: __APP.BUILD.button({
				classes: ['-color_primary','CloseModal','RippleEffect'],
				title: 'OK'
			})
		});
	}
	
	return StdModal;
}()));