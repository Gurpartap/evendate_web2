/**
 * @class
 */
AbstractTopBar = (function () {
	function AbstractTopBar() {
		this.$main_header = $('#main_header');
	}
	AbstractTopBar.prototype.init = function () {
		this.$main_header.find('#search_bar_input').on('keypress', function(e) {
			if (e.which == 13) {
				__APP.changeState('/search/' + encodeURIComponent(this.value));
			}
		});
		
		bindRippleEffect(this.$main_header);
		bindPageLinks(this.$main_header);
	};
	return AbstractTopBar;
}());