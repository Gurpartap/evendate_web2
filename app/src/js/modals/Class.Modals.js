/**
 * @requires Class.ModalsCollection.js
 */
/**
 * @class Modals
 */
Modals = (function() {
	/**
	 *
	 * @class ModalDestroyer
	 * @extends jQuery
	 */
	var ModalDestroyer = extendingJQuery((function() {
		/**
		 *
		 * @param {(jQuery|Element|string)} element
		 * @constructor
		 * @constructs ModalDestroyer
		 */
		function ModalDestroyer(element) {
			jQuery.fn.init.call(this, element);
			
			this.on('click.CloseModal', function() {
				AbstractModal.hideCurrent();
			});
		}
		/**
		 *
		 * @param {number} height
		 * @return {number}
		 */
		ModalDestroyer.prototype.adjustHeight = function(height) {
			var html_height = $(window).height(),
				modal_height = height;
			return this.height((modal_height > html_height) ? modal_height : html_height);
		};
		
		return ModalDestroyer;
	}()));
	/**
	 *
	 * @constructor
	 * @constructs Modals
	 */
	function Modals() {
		if (typeof Modals.instance === 'object') {
			return Modals.instance;
		}
		
		this.collection = new ModalsCollection(5);
		/**
		 * @type {AbstractModal}
		 */
		this.active_modal = null;
		/**
		 * @type {jQuery}
		 */
		this.modal_wrapper = $('.ModalsWrapper');
		this.modal_destroyer = new ModalDestroyer($('.ModalDestroyer'));
		
		Modals.instance = this;
	}
	
	/**
	 * @function
	 * @memberof Modals
	 */
	Modals.prototype.bindCallModal = bindCallModal;
	
	return Modals;
}());