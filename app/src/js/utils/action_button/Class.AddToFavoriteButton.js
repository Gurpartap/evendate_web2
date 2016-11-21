/**
 * @requires Class.ActionButton.js
 */
/**
 *
 * @constructor
 * @augments ActionButton
 * @param {(number|string)} id
 * @param {object} options
 */
function AddToFavoriteButton(id, options) {
	this.classes = {
		subscribed_state: '-Favored'
	};
	this.options = {
		labels: {
			subscribe: __LOCALES.ru_RU.TEXTS.BUTTON.ADD_FAVORITE,
			unsubscribe: __LOCALES.ru_RU.TEXTS.BUTTON.REMOVE_FAVORITE,
			subscribed: __LOCALES.ru_RU.TEXTS.BUTTON.FAVORED
		},
		colors: {
			subscribe: '-color_neutral_accent',
			unsubscribe: '-color_accent',
			subscribed: '-color_accent'
		},
		icons: {
			subscribe: 'fa-star-o',
			unsubscribe: 'fa-times',
			subscribed: 'fa-star'
		}
	};
	ActionButton.apply(this, [id, options]);
}
AddToFavoriteButton.extend(ActionButton);
AddToFavoriteButton.prototype.onClick = function() {
	var self = this;
	
	if (self.is_subscribed) {
		OneEvent.deleteFavored(self.id, function() {
			self.afterUnsubscribe();
		});
	} else {
		OneEvent.addFavored(self.id, function() {
			self.afterSubscribe();
		});
	}
};