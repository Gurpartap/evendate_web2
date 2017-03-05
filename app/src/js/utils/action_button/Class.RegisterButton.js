/**
 * @requires Class.ActionButton.js
 */
/**
 *
 * @class RegisterButton
 * @extends ActionButton
 */
RegisterButton = extending(ActionButton, (function() {
	/**
	 *
	 * @param {OneEvent} event
	 * @param {object} [options]
	 * @constructor
	 * @constructs RegisterButton
	 *
	 * @property {OneEvent} event
	 * @property {RegistrationModal} modal
	 */
	function RegisterButton(event, options) {
		this.options = {
			labels: {
				checked: 'Зарегистрирован',
				unchecked: 'Регистрация',
				checked_hover: 'Зарегистрирован',
				unchecked_hover: 'Регистрация'
			},
			colors: {
				checked: __C.CLASSES.COLORS.ACCENT,
				unchecked: __C.CLASSES.COLORS.MARGINAL_ACCENT,
				checked_hover: __C.CLASSES.COLORS.ACCENT,
				unchecked_hover: __C.CLASSES.COLORS.MARGINAL_ACCENT
			},
			icons: {
				checked: __C.CLASSES.ICONS.CHECK,
				unchecked: __C.CLASSES.ICONS.PENCIL,
				checked_hover: __C.CLASSES.ICONS.CHECK,
				unchecked_hover: __C.CLASSES.ICONS.PENCIL
			}
		};
		this.event = event;
		this.modal = null;
		options.is_checked = event.is_registered;
		ActionButton.call(this, options);
		if (event.is_registered || !event.registration_available) {
			this.off('click.RippleEffect').addClass('-Handled_RippleEffect');
		}
	}
	
	RegisterButton.prototype.onClick = function() {
		var self = this;
		
		/**
		 *
		 * @param {RegistrationModal} modal
		 * @param {RegisterButton} button
		 */
		function bindOnRegister(modal, button) {
			modal.modal.on('registration:success', function() {
				modal.event.is_registered = true;
				button.afterCheck();
			});
		}
		
		if (this.event.is_registered || !this.event.registration_available) {
			this.off('click.RippleEffect').addClass('-Handled_RippleEffect');
			return false;
		}
		
		if (this.modal) {
			this.modal.show();
			bindOnRegister(this.modal, this);
		} else if (this.event.registration_fields.length) {
			this.modal = new RegistrationModal(this.event);
			this.modal.show();
			bindOnRegister(this.modal, this)
		} else {
			this.event.fetchEvent(new Fields('registration_fields')).done(function() {
				self.modal = new RegistrationModal(self.event);
				self.modal.show();
				bindOnRegister(self.modal, self)
			});
		}
		
	};
	
	
	return RegisterButton;
}()));
