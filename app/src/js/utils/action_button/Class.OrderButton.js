/**
 * @requires Class.ActionButton.js
 */
/**
 *
 * @class OrderButton
 * @extends ActionButton
 */
OrderButton = extending(ActionButton, (function() {
	/**
	 *
	 * @param {OneEvent} event
	 * @param {object} [options]
	 * @constructor
	 * @constructs OrderButton
	 *
	 * @property {OneEvent} event
	 * @property {TicketsModal} modal
	 */
	function OrderButton(event, options) {
		this.options = {
			labels: {
				checked: event.ticketing_locally ? 'Куплен' : 'Зарегистрирован',
				unchecked: event.ticketing_locally ? 'Купить билет' : 'Регистрация',
				checked_hover: 'Открыть билеты',
				unchecked_hover: event.ticketing_locally ? 'Купить билет' : 'Регистрация'
			},
			colors: {
				checked: __C.CLASSES.COLORS.ACCENT,
				unchecked: __C.CLASSES.COLORS.DEFAULT,
				checked_hover: __C.CLASSES.COLORS.ACCENT,
				unchecked_hover: __C.CLASSES.COLORS.NEUTRAL_ACCENT
			},
			icons: {
				checked: __C.CLASSES.ICONS.CHECK,
				unchecked: event.ticketing_locally ? __C.CLASSES.ICONS.TICKET : __C.CLASSES.ICONS.PENCIL,
				checked_hover: __C.CLASSES.ICONS.TICKET,
				unchecked_hover: event.ticketing_locally ? __C.CLASSES.ICONS.TICKET : __C.CLASSES.ICONS.PENCIL
			}
		};
		this.event = event;
		this.modal = null;
		this.is_disabled = this.event.ticketing_locally ? !this.event.ticketing_available : (this.event.registration_locally && !this.event.registration_available);
		options.is_checked = false;
		ActionButton.call(this, options);
	}
	
	OrderButton.prototype.checked_state_class = '-Ordered';
	
	OrderButton.prototype.showAuthModal = function() {
		var modal;
		
		if (!(modal = this.data('modal'))) {
			modal = new AuthModal(location.origin + '/event/' + this.event.id + '/order', {
				note: 'Для выполнения этого действия, нужно войти через социальную сеть'
			});
			this.data('modal', modal);
		}
		
		cookies.removeItem('auth_command');
		cookies.removeItem('auth_entity_id');
		
		return modal.show();
	};
	
	OrderButton.prototype.onClick = function() {
		if (this.is_disabled) {
			this.off('click.RippleEffect').addClass(__C.CLASSES.HOOKS.HANDLED + __C.CLASSES.HOOKS.RIPPLE);
			
			return false;
		}
		__APP.changeState('/event/' + this.event.id + '/order');
	};
	
	OrderButton.prototype.initiate = function() {
		if (this.is_disabled) {
			this.attr('disabled', true);
		} else {
			ActionButton.prototype.initiate.call(this);
		}
	};
	
	return OrderButton;
}()));