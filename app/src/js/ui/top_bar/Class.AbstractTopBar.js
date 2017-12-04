/**
 * @abstract
 * @class
 */
AbstractTopBar = (function () {
	/**
	 *
	 * @constructor
	 * @constructs AbstractTopBar
	 *
	 * @property {jQuery} $main_header
	 */
	function AbstractTopBar() {
		this.$main_header = $('#main_header');
		this.$page_title = this.$main_header.find('#page_title');
		this.$tabs_wrapper = this.$main_header.find('.HeaderTabsWrapper');
		this.is_tabs_rendered = false;
	}
	
	AbstractTopBar.prototype.init = function () {
		var $overlay = this.$main_header.find('.TopBarOverlay'),
			$search_button = $overlay.find('.TopBarSearchButton'),
			$search_input = $overlay.find('.TopBarSearchInput');
			
		$search_button.on('click.OpenSearchBar', function() {
			if ($overlay.hasClass('-open_search_bar')) {
				__APP.changeState('/search/' + encodeURIComponent($search_input.val()));
			} else {
				$overlay.addClass('-open_search_bar');
				$search_input.focus();
			}
		});
		
		$search_input.on('keypress', function(e) {
			if (e.which === 13) {
				if ($search_input.val().indexOf('#') === 0) {
					__APP.changeState('/search/tag/' + encodeURIComponent($search_input.val().replace('#', '')));
				} else {
					__APP.changeState('/search/' + encodeURIComponent($search_input.val()));
				}
			}
		}).on('keydown', function(e) {
			if (e.keyCode === 27) {
				$overlay.removeClass('-open_search_bar');
				$search_input.val('');
			}
		}).on('blur', function() {
			if ($search_input.val() === '') {
				$overlay.removeClass('-open_search_bar');
			}
		});
		
		this.$main_header.find('.SidebarBurger').add($('.MainSectionCap')).on('click', function() {
			$('body').toggleClass('-open_sidebar');
		});
		
		bindRippleEffect(this.$main_header);
		bindPageLinks(this.$main_header);
	};
	
	AbstractTopBar.prototype.showTabs = function() {
		this.is_tabs_rendered = true;
		this.$main_header.addClass('-with_tabs');
	};
	
	AbstractTopBar.prototype.hideTabs = function() {
		this.is_tabs_rendered = false;
		this.$main_header.removeClass('-with_tabs');
	};
	
	/**
	 * Rendering header tabs
	 * @param {(buildProps|Array<buildProps>)} tabs
	 */
	AbstractTopBar.prototype.renderHeaderTabs = function(tabs) {
		if (empty(tabs)) {
			
			return null;
		}
		
		tabs = tabs instanceof Array ? tabs : [tabs];
		
		this.$tabs_wrapper.html(tmpl('tabs-header', {
			color: 'default',
			tabs: __APP.BUILD.link.apply(__APP.BUILD, tabs.map(function(tab) {
				var _tab = Builder.normalizeBuildProps(tab);
				
				_tab.classes.push('tab', 'Tab');
				if (window.location.pathname.contains(_tab.page)) {
					_tab.classes.push(__C.CLASSES.ACTIVE);
				}
				
				return _tab;
			}))
		}));
		bindTabs(this.$tabs_wrapper, false);
		bindPageLinks(this.$tabs_wrapper);
		
		return this;
	};
	/**
	 * Changes title of the page
	 * @param {(string|Array<{page: {string}, title: {string}}>|jQuery)} new_title
	 */
	AbstractTopBar.prototype.changeTitle = function(new_title) {
		
		bindPageLinks(this.$page_title.html(function() {
			if (new_title instanceof jQuery) {
				
				return new_title;
			} else if (typeof new_title === 'string') {
				new_title = new_title.split(' > ');
			}
			
			if (new_title instanceof Array) {
				
				return new_title.reduce(function($obj, title_chunk, i) {
					if (i) {
						$obj = $obj.add('<span class="title_chunk fa_icon fa-angle-right -empty"></span>');
					}
					
					if (typeof title_chunk === 'object') {
						return $obj.add('<a href="' + title_chunk.page + '" class="title_chunk link Link">' + title_chunk.title + '</a>');
					}
					
					return $obj.add('<span class="title_chunk">' + title_chunk + '</span>');
				}, $());
			} else {
				
				return null;
			}
		}));
	};
	
	return AbstractTopBar;
}());