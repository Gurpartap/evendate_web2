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
	 */
	function Page() {
		this.name = this.constructor.name;
		this.state_name = this.name;
		this.page_title = '';
		/**
		 * @name Page#$view
		 * @type jQuery
		 */
		this.$view = $('.PageView');
		/**
		 * @name Page#$wrapper
		 * @type jQuery
		 */
		this.$wrapper = $();
		this.wrapper_tmpl = 'std';
		this.with_header_tabs = false;
		
		this.rendering_defer = $.Deferred();
		this.fetching_data_defer = $.Deferred();
	}
	/**
	 * Routing
	 * @param {string} path
	 * @return {Page}
	 */
	Page.routeNewPage = function(path) {
		var path_split = decodeURIComponent(path).split('/').splice(1),
			pages_child = __APP.ROUTING,
			args = [], i, key, PageClass;
		
		for (i = 0; i < path_split.length; i++) {
			if (pages_child.hasOwnProperty(path_split[i])) {
				if (i < path_split.length - 1) {
					pages_child = pages_child[path_split[i]];
				} else {
					PageClass = pages_child[path_split[i]];
					break;
				}
			} else {
				for (key in pages_child) {
					if (key.indexOf('^') === 0 && (new RegExp(key)).test(path_split[i])) {
						args.push(path_split[i]);
						if (i < path_split.length - 1) {
							pages_child = pages_child[key];
						} else {
							PageClass = pages_child[key];
						}
						break;
					}
				}
			}
		}
		PageClass = PageClass ? PageClass : pages_child; // In case of trailing slash in url
		PageClass = PageClass.prototype instanceof Page ? PageClass : PageClass['']; // Open default page
		return new (Function.prototype.bind.apply(PageClass, [null].concat(args)))(); // new Page(...args)
	};
	
	Page.prototype.show = function() {
		var PAGE = this,
			$main_header = $('#main_header'),
			is_other_page = __APP.PREVIOUS_PAGE.wrapper_tmpl !== PAGE.wrapper_tmpl,
			wrapper_field = is_other_page ? '$view' : '$wrapper',
			$prev = __APP.PREVIOUS_PAGE[wrapper_field].length ? __APP.PREVIOUS_PAGE[wrapper_field] : is_other_page ? $('.PageView') : $('.PageView').find('.Content');
		
		if (PAGE.page_title) {
			__APP.changeTitle(PAGE.page_title);
		}
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
			$(window).scrollTop(0);
			PAGE.render();
			bindPageLinks();
			setTimeout(function() {
				PAGE[wrapper_field].removeClass('-faded');
			}, 200);
		});
	};
	
	Page.prototype.fetchData = function() {
		return this.fetching_data_defer.resolve().promise();
	};
	
	Page.prototype.render = function() {};
	
	Page.prototype.destroy = function() {};
	
	return Page;
}());