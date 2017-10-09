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
		this.$content = setDefaultValue(this.$content, __APP.BUILD.loaderBlock());
		this.is_fetched = false;
		this.is_shown = false;
		this.is_rendered = false;
		
		jQuery.fn.init.call(this, tmpl('app-inspector', {
			id: this.id,
			title: this.title,
			content: this.$content
		}));
		
		this.find('.AppInspectorRemoveButton').on('click.CloseInspector', function() {
			self.callWithAncestors('hide');
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
	/**
	 *
	 * @returns {jqPromise}
	 */
	AbstractAppInspector.prototype.fetchData = function() {
		
		return $.Deferred().resolve().promise();
	};
	
	AbstractAppInspector.prototype.fetchDone = function() {};
	
	AbstractAppInspector.prototype.render = function() {
		this.changeTitle(this.title);
		this.find('.AppInspectorContent').html(this.$content);
		this.is_rendered = true;
		this.callWithAncestors('initiate');
		
		return this;
	};
	
	AbstractAppInspector.prototype.initiate = function() {
		this.find('.AppInspectorScroll').scrollbar();
	};
	
	AbstractAppInspector.prototype.show = function() {
		var self = this;
		
		if (AbstractAppInspector.currentInspector) {
			AbstractAppInspector.currentInspector.hide();
		}
		
		AbstractAppInspector.$wrapper.append(this);
		
		setTimeout(function() {
			self.addClass(__C.CLASSES.SHOW);
		}, 100);
		
		AbstractAppInspector.currentInspector = this;
		this.is_shown = true;
		
		if (!this.is_fetched) {
			this.fetchData().done(function() {
				AbstractAppInspector.$wrapper.trigger('inspector:data_fetched');
				self.fetchDone.apply(self, arguments);
				self.is_fetched = true;
				if (!self.is_rendered) {
					self.callWithAncestors('render');
				}
			});
		} else {
			if (!this.is_rendered) {
				this.callWithAncestors('render');
			}
		}
	};
	
	AbstractAppInspector.prototype.changeTitle = function(title) {
		this.find('.AppInspectorTitle').html(title);
		
		return this;
	};
	
	AbstractAppInspector.prototype.hide = function() {
		this.removeClass(__C.CLASSES.SHOW);
		AbstractAppInspector.currentInspector = null;
		AbstractAppInspector.$wrapper.trigger('inspector:hide');
		this.is_shown = false;
		
		return this;
	};
	
	AbstractAppInspector.prototype.destroy = function() {
		if (this.is_shown) {
			this.callWithAncestors('hide');
		}
		AbstractAppInspector.collection.splice(this.id, 1);
		this.is_rendered = false;
		this.remove();
	};
	/**
	 *
	 * @param {string} method
	 * @param {Function} [ancestor]
	 * @returns {*}
	 */
	AbstractAppInspector.prototype.callWithAncestors = function(method, ancestor) {
		ancestor = !empty(ancestor) ? ancestor : AbstractAppInspector;
		
		if (this instanceof ancestor && this[method] !== ancestor.prototype[method]) {
			ancestor.prototype[method].call(this);
		}
		
		return this[method]();
	};
	
	$('body').on('keyup.CloseCurrentAppInspector', function(e) {
		if (isKeyPressed(e, __C.KEY_CODES.ESC)) {
			AbstractAppInspector.hideCurrent();
		}
	});
	
	Object.seal(AbstractAppInspector);
	
	return AbstractAppInspector;
}()));