/**
 * @requires ../Class.AbstractModal.js
 */
/**
 * @class
 * @extends AbstractModal
 */
AbstractListModal = extending(AbstractModal, (function() {
	
	function AbstractListModal(entity) {
		AbstractModal.call(this, {
			type: this.constructor.name,
			title: this.title,
			content: tmpl('modal-list-content'),
			width: 384,
			height: 'calc(100% - 140px)',
			classes: ['-fixed'],
			content_classes: ['list_modal_content']
		});
		this.entity = entity;
		/**
		 * @abstract
		 * @type {EntitiesCollection}
		 */
		this.entities = new EntitiesCollection();
		/**
		 * @type jQuery
		 */
		this.$entities_wrapper = this.modal.find('.ListModalWrapper');
		this.block_scroll = false;
	}
	
	AbstractListModal.prototype.uploadEntities = function() {};
	
	AbstractListModal.prototype.buildEntities = function(entities) {};
	
	AbstractListModal.prototype.init = function() {
		var self = this,
			$loader;
		
		this.$entities_wrapper.scrollbar({
			disableBodyScroll: true,
			onScroll: function(y) {
				if (y.scroll == y.maxScroll) {
					$loader = __APP.BUILD.loaderBlock(self.$entities_wrapper);
					self.uploadEntities().done(function(){
						$loader.remove();
					});
				}
			}
		});
	};
	
	AbstractListModal.prototype.show = function() {
		var self = this;
		if(this.$entities_wrapper.children().length) {
			this.__show();
			self.init();
		} else {
			this.$entities_wrapper.append(this.buildEntities(this.entities));
			if (this.entities.length < 5) {
				this.uploadEntities().done(function() {
					self.__show();
					self.init();
				});
			}
		}
	};
	
	return AbstractListModal;
}()));