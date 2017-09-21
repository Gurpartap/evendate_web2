/**
 * @requires Class.AppInspectorComponents.js
 */
/**
 *
 * @class AbstractAppInspector
 * @extends jQuery
 */
AbstractAppInspector = extendingJQuery((function() {
	/**
	 *
	 * @constructor
	 * @constructs AbstractAppInspector
	 */
	function AbstractAppInspector() {
		var self = this;
		
		this.id = AbstractAppInspector.collection.push(this) - 1;
		this.title = setDefaultValue(this.title, null);
		this.$content = setDefaultValue(this.$content, $());
		this.is_shown = false;
		this.is_rendered = false;
		
		jQuery.fn.init.call(this, tmpl('app-inspector', {
			id: this.id,
			title: this.title,
			content: this.$content
		}));
		
		this.find('.AppInspectorRemoveButton').on('click.CloseInspector', function() {
			self.hide();
		});
		
		if (AbstractAppInspector.collection.length > 5) {
			AbstractAppInspector.collection[0].destroy();
		}
	}
	
	AbstractAppInspector.$wrapper = $('.AppInspectorsWrapper');
	/**
	 *
	 * @type {Array<AbstractAppInspector>}
	 */
	AbstractAppInspector.collection = [];
	/**
	 *
	 * @type {AbstractAppInspector}
	 */
	AbstractAppInspector.currentInspector = null;
	/**
	 *
	 * @type {AppInspectorComponents}
	 */
	AbstractAppInspector.build = new AppInspectorComponents();
	
	AbstractAppInspector.hideCurrent = function() {
		if (AbstractAppInspector.currentInspector) {
			AbstractAppInspector.currentInspector.hide();
		}
	};
	
	AbstractAppInspector.destroyAll = function() {
		AbstractAppInspector.collection.forEach(function(inspector) {
			inspector.destroy();
		});
	};
	
	AbstractAppInspector.prototype.render = function() {
		AbstractAppInspector.$wrapper.append(this);
		this.is_rendered = true;
		this.initiate();
		this.find('.AppInspectorScroll').scrollbar();
	};
	
	AbstractAppInspector.prototype.initiate = function() {};
	
	AbstractAppInspector.prototype.show = function() {
		var self = this;
		
		if (AbstractAppInspector.currentInspector) {
			AbstractAppInspector.currentInspector.hide();
		}
		if (!this.is_rendered) {
			this.render();
		}
		setTimeout(function() {
			self.addClass(__C.CLASSES.SHOW);
		}, 100);
		AbstractAppInspector.currentInspector = this;
		this.is_shown = true;
	};
	
	AbstractAppInspector.prototype.hide = function() {
		this.removeClass(__C.CLASSES.SHOW);
		AbstractAppInspector.currentInspector = null;
		AbstractAppInspector.$wrapper.trigger('inspector:hide');
		this.is_shown = false;
	};
	
	AbstractAppInspector.prototype.destroy = function() {
		if(this.is_shown) {
			this.hide();
		}
		AbstractAppInspector.collection.splice(this.id, 1);
		this.is_rendered = false;
		this.remove();
	};
	
	$('body').on('keyup.CloseCurrentAppInspector', function(e) {
		if (isKeyPressed(e, __C.KEY_CODES.ESC)) {
			AbstractAppInspector.hideCurrent();
		}
	});
	
	Object.seal(AbstractAppInspector);
	
	return AbstractAppInspector;
}()));