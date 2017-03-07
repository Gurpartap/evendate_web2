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
	 * @param {(number|string)} event_id
	 * @param {object} [options]
	 */
	function AddToFavoriteButton(event_id, options) {
		this.options = {
			labels: {
				checked: __LOCALES.ru_RU.TEXTS.BUTTON.FAVORED,
				unchecked: __LOCALES.ru_RU.TEXTS.BUTTON.ADD_FAVORITE,
				checked_hover: __LOCALES.ru_RU.TEXTS.BUTTON.REMOVE_FAVORITE,
				unchecked_hover: __LOCALES.ru_RU.TEXTS.BUTTON.ADD_FAVORITE
			},
			colors: {
				checked: __C.CLASSES.COLORS.ACCENT,
				unchecked: __C.CLASSES.COLORS.MARGINAL_ACCENT,
				checked_hover: __C.CLASSES.COLORS.ACCENT,
				unchecked_hover: __C.CLASSES.COLORS.MARGINAL_ACCENT
			},
			icons: {
				checked: __C.CLASSES.ICONS.STAR,
				unchecked: __C.CLASSES.ICONS.STAR_O,
				checked_hover: __C.CLASSES.ICONS.TIMES,
				unchecked_hover: __C.CLASSES.ICONS.STAR_O
			}
		};
		this.event_id = event_id;
		ActionButton.call(this, options);
	}
	
	AddToFavoriteButton.prototype.checked_state_class = '-Favored';
	
	AddToFavoriteButton.prototype.onClick = function() {
		var self = this;
		
		if (this.is_checked) {
			OneEvent.deleteFavored(this.event_id, function() {
				self.afterUncheck();
			});
		} else {
			OneEvent.addFavored(this.event_id, function() {
				self.afterCheck();
			});
		}
	};
	
	
	return AddToFavoriteButton;
}()));