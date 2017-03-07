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
	 * @param {(string|jQuery)} content
	 * @param {StdModal.STYLES} [style]
	 * @constructor
	 * @constructs StdModal
	 */
	function StdModal(title, content, style) {
		AbstractModal.call(this, style);
		this.title = title;
		this.content = content;
	}
	
	StdModal.STYLES = AbstractModal.STYLES;
	Object.freeze(StdModal.STYLES);
	
	return StdModal;
}()));