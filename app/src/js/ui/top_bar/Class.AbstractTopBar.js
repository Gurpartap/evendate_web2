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
	
	return AbstractTopBar;
}());