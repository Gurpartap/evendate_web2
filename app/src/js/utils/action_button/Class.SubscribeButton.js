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
function SubscribeButton(id, is_subscribed, options) {
	this.classes = {
		subscribed_state: '-Subscribed'
	};
	this.options = {
		labels: {
			subscribe: __LOCALES.ru_RU.TEXTS.BUTTON.ADD_SUBSCRIPTION,
			unsubscribe: __LOCALES.ru_RU.TEXTS.BUTTON.REMOVE_SUBSCRIPTION,
			subscribed: __LOCALES.ru_RU.TEXTS.BUTTON.SUBSCRIBED
		},
		colors: {
			subscribe: '-color_neutral_accent',
			unsubscribe: '-color_accent',
			subscribed: '-color_accent'
		},
		icons: {
			subscribe: 'fa-plus',
			unsubscribe: 'fa-times',
			subscribed: 'fa-check'
		}
	};
	ActionButton.apply(this, [id, is_subscribed, options]);
}
SubscribeButton.extend(ActionButton);
SubscribeButton.prototype.bindClick = function() {
	var self = this;
	this.on('click.subscribe', function() {
		if (self.is_subscribed) {
			__APP.USER.unsubscribeFromOrganization(self.id, function() {
				self.afterUnsubscribe();
				$(window).trigger('unsubscribe', [self.id]);
			});
		} else {
			__APP.USER.subscribeToOrganization(self.id, function() {
				self.afterSubscribe();
				$(window).trigger('subscribe', [self.id]);
			});
		}
		if (window.askToSubscribe instanceof Function) {
			window.askToSubscribe();
		}
	});
};