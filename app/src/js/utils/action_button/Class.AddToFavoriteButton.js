/**
 * @requires Class.ActionButton.js
 */
/**
 *
 * @class AddToFavoriteButton
 * @extends ActionButton
 */
AddToFavoriteButton = extending(ActionButton, (function() {
	/**
	 *
	 * @constructor
	 * @constructs AddToFavoriteButton
	 * @param {OneEvent} event
	 * @param {object} [options]
	 */
	function AddToFavoriteButton(event, options) {
		this.options = {
			labels: {
				checked: __LOCALES.ru_RU.TEXTS.BUTTON.FAVORED,
				unchecked: __LOCALES.ru_RU.TEXTS.BUTTON.ADD_FAVORITE,
				checked_hover: __LOCALES.ru_RU.TEXTS.BUTTON.REMOVE_FAVORITE,
				unchecked_hover: __LOCALES.ru_RU.TEXTS.BUTTON.ADD_FAVORITE
			},
			colors: {
				checked: __C.CLASSES.COLORS.ACCENT,
				unchecked: __C.CLASSES.COLORS.DEFAULT,
				checked_hover: __C.CLASSES.COLORS.ACCENT,
				unchecked_hover: __C.CLASSES.COLORS.NEUTRAL_ACCENT
			},
			icons: {
				checked: __C.CLASSES.ICONS.STAR,
				unchecked: __C.CLASSES.ICONS.STAR_O,
				checked_hover: __C.CLASSES.ICONS.TIMES,
				unchecked_hover: __C.CLASSES.ICONS.STAR_O
			}
		};
		this.event = event;
		ActionButton.call(this, options);
	}
	
	AddToFavoriteButton.prototype.checked_state_class = '-Favored';
	
	AddToFavoriteButton.prototype.showAuthModal = function() {
		var modal;
		
		if (!(modal = this.data('modal'))) {
			modal = new AuthModal(location.origin + '/event/' + this.event.id, {
				note: 'Чтобы добавить событие в избранное, необходимо войти через социальную сеть'
			});
			this.data('modal', modal);
		}
		
		cookies.setItem('auth_command', 'add_to_favorite');
		cookies.setItem('auth_entity_id', this.event.id);
		
		return modal.show();
	};
	
	AddToFavoriteButton.prototype.onClick = function() {
		var self = this;
		
		if (this.is_checked) {
			this.event.unfavour().then(function() {
				self.afterUncheck();
			});
		} else {
			this.event.favour().then(function() {
				self.afterCheck();
			});
		}
	};
	
	
	return AddToFavoriteButton;
}()));