/**
 *
 * @abstract
 * @class
 */
Page = (function() {
	/**
	 *
	 * @constructor
	 * @constructs Page
	 *
	 * @property {string} name
	 * @property {string} state_name
	 * @property {string} page_title
	 * @property {(jQuery|Array|string)} page_title_obj
	 * @property {jQuery} $view
	 * @property {jQuery} $wrapper
	 * @property {string} wrapper_tmpl
	 * @property {boolean} with_header_tabs
	 *
	 * @property {jqPromise} rendering_defer
	 * @property {jqPromise} fetching_data_defer
	 */
	function Page() {
		this.name = this.constructor.name;
		this.state_name = this.name;
		this.page_title = setDefaultValue(this.page_title, '');
		this.page_title_obj = setDefaultValue(this.page_title_obj, '');
		/**
		 * @name Page#$view
		 * @type jQuery
		 */
		this.$view = setDefaultValue(this.$view, $('.PageView'));
		/**
		 * @name Page#$wrapper
		 * @type jQuery
		 */
		this.$wrapper = setDefaultValue(this.$wrapper, $());
		this.wrapper_tmpl = setDefaultValue(this.wrapper_tmpl, 'std');
		this.with_header_tabs = setDefaultValue(this.with_header_tabs, false);
		
		this.rendering_defer = $.Deferred();
		this.fetching_data_defer = $.Deferred();
	}
	/**
	 * Routing
	 * @param {string} path
	 * @return {Page}
	 */
	Page.routeNewPage = function(path) {
		var path_map = decodeURIComponent(path).split('/'),
			args = [],
			PageClass;
		
		PageClass = path_map.reduce(function(tree_chunk, path_chunk) {
			if (!path_chunk)
				return tree_chunk;
			
			if (tree_chunk.hasOwnProperty(path_chunk))
				return tree_chunk[path_chunk];
			else
				return Object.keys(tree_chunk).reduce(function(found_chunk, key) {
					if (!found_chunk && key.indexOf('^') === 0 && (new RegExp(key)).test(path_chunk)) {
						args.push(path_chunk);
						
						return tree_chunk[key];
					}
					
					return found_chunk;
				}, false);
			
		}, __APP.ROUTING);
		
		PageClass = (PageClass.prototype instanceof Page) ? PageClass : ((PageClass[''] && PageClass[''].prototype instanceof Page) ? PageClass[''] : NotFoundPage); // Open default page
		return new (Function.prototype.bind.apply(PageClass, [null].concat(args)))(); // new Page(...args)
	};
	
	Page.prototype.show = function() {
		var PAGE = this,
			$main_header = $('#main_header'),
			is_other_page = __APP.PREVIOUS_PAGE.wrapper_tmpl !== PAGE.wrapper_tmpl,
			wrapper_field = is_other_page ? '$view' : '$wrapper',
			$prev = __APP.PREVIOUS_PAGE[wrapper_field].length ? __APP.PREVIOUS_PAGE[wrapper_field] : is_other_page ? $('.PageView') : $('.PageView').find('.Content');
		
		$prev.addClass('-faded');
		
		setTimeout(function() {
			$prev.addClass(__C.CLASSES.HIDDEN);
			
			if (PAGE.with_header_tabs) {
				$main_header.addClass('-with_tabs');
			} else {
				$main_header.removeClass('-with_tabs');
			}
			
			$('body').removeClass(function(index, css) {
				return (css.match(/(^|\s)-state_\S+/g) || []).join(' ');
			}).addClass('-state_' + PAGE.state_name.toUnderscore());
			
			if (is_other_page) {
				PAGE.$view.html(tmpl(PAGE.wrapper_tmpl + '-wrapper', {}));
			}
			PAGE.$wrapper = PAGE.$view.find('.Content');
			PAGE.$wrapper.empty();
			
			PAGE.$view.removeClass(__C.CLASSES.HIDDEN);
			PAGE.$wrapper.removeClass(__C.CLASSES.HIDDEN);
			PAGE[wrapper_field].addClass('-faded');
			
			PAGE.rendering_defer.resolve();
		}, 200);
		
		$.when(PAGE.rendering_defer, PAGE.fetching_data_defer).done(function pageRender(){
			if (PAGE.page_title) {
				__APP.changeTitle(PAGE.page_title_obj ? PAGE.page_title_obj : PAGE.page_title);
			}
			PAGE.renderHeaderTabs();
			$(window).scrollTop(0);
			PAGE.render();
			bindPageLinks();
			setTimeout(function() {
				PAGE[wrapper_field].removeClass('-faded');
			}, 200);
		});
	};
	
	Page.prototype.renderHeaderTabs = function() {};
	
	Page.prototype.fetchData = function() {
		return this.fetching_data_defer.resolve().promise();
	};
	
	Page.prototype.render = function() {};
	
	Page.prototype.destroy = function() {};
	
	return Page;
}());