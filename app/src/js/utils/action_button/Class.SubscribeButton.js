/**
 * @requires Class.ActionButton.js
 */
/**
 *
 * @class SubscribeButton
 * @extends ActionButton
 */
SubscribeButton = extending(ActionButton, (function() {
	/**
	 *
	 * @constructor
	 * @constructs SubscribeButton
	 * @param {(number|string)} org_id
	 * @param {object} [options]
	 */
	function SubscribeButton(org_id, options) {
		this.options = {
			labels: {
				checked: __LOCALES.ru_RU.TEXTS.BUTTON.SUBSCRIBED,
				unchecked: __LOCALES.ru_RU.TEXTS.BUTTON.ADD_SUBSCRIPTION,
				checked_hover: __LOCALES.ru_RU.TEXTS.BUTTON.REMOVE_SUBSCRIPTION,
				unchecked_hover: __LOCALES.ru_RU.TEXTS.BUTTON.ADD_SUBSCRIPTION
			},
			colors: {
				checked: __C.CLASSES.COLORS.ACCENT,
				unchecked: __C.CLASSES.COLORS.NEUTRAL_ACCENT,
				checked_hover: __C.CLASSES.COLORS.ACCENT,
				unchecked_hover: __C.CLASSES.COLORS.NEUTRAL_ACCENT
			},
			icons: {
				checked: __C.CLASSES.ICONS.CHECK,
				unchecked: __C.CLASSES.ICONS.PLUS,
				checked_hover: __C.CLASSES.ICONS.TIMES,
				unchecked_hover: __C.CLASSES.ICONS.PLUS
			}
		};
		this.org_id = org_id;
		ActionButton.call(this, options);
	}
	
	SubscribeButton.prototype.checked_state_class = '-Subscribed';
	
	SubscribeButton.prototype.onClick = function() {
		var self = this;
		if (self.is_checked) {
			__APP.USER.unsubscribeFromOrganization(self.org_id, function() {
				self.afterUncheck();
				$(window).trigger('unsubscribe', [self.org_id]);
			});
		} else {
			__APP.USER.subscribeToOrganization(self.org_id, function() {
				self.afterCheck();
				$(window).trigger('subscribe', [self.org_id]);
			});
		}
	};
	
	
	return SubscribeButton;
}()));