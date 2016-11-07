/**
 * @requires Class.ActionButton.js
 */
/**
 *
 * @constructor
 * @augments ActionButton
 * @param {(number|string)} id
 * @param {boolean} is_subscribed
 * @param {object} options
 */
function AddToFavoriteButton(id, is_subscribed, options) {
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
	ActionButton.apply(this, [id, is_subscribed, options]);
}
AddToFavoriteButton.extend(ActionButton);
AddToFavoriteButton.prototype.bindClick = function() {
	var self = this;
	this.on('click.subscribe', function() {
		if (self.is_subscribed) {
			OneEvent.deleteFavored(self.id, function() {
				self.afterUnsubscribe();
			});
		} else {
			OneEvent.addFavored(self.id, function() {
				self.afterSubscribe();
			});
		}
		if (window.askToSubscribe instanceof Function) {
			window.askToSubscribe();
		}
	});
};