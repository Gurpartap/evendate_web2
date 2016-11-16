/**
 * @requires Class.AbstractTopBar.js
 */
/**
 * @class
 * @extends AbstractTopBar
 */
TopBar = extending(AbstractTopBar, (function () {
	function TopBar() {
		AbstractTopBar.call(this);
	}
	TopBar.prototype.init = function () {
		this.$main_header.find('#user_bar').on('click.openUserBar', function() {
			var $this = $(this),
				$document = $(document);
			$this.addClass('-open');
			$document.on('click.closeUserBar', function(e) {
				if (!$(e.target).parents('#user_bar').length) {
					$document.off('click.closeUserBar');
					$this.removeClass('-open');
				}
			})
		});
		this.$main_header.find('.LogoutButton').on('click', __APP.USER.logout);
		this.$main_header.find('.OpenSettingsButton').on('click', showSettingsModal);
		AbstractTopBar.prototype.init.call(this);
	};
	return TopBar;
}()));