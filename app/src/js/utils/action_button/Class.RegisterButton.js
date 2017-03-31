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
	 * @property {(RegistrationModal|TicketsModal)} modal
	 */
	function RegisterButton(event, options) {
		this.options = {
			labels: {
				checked: 'Зарегистрирован',
				unchecked: 'Регистрация',
				checked_hover: 'Открыть билеты',
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
				checked_hover: __C.CLASSES.ICONS.TICKET,
				unchecked_hover: __C.CLASSES.ICONS.PENCIL
			}
		};
		this.event = event;
		this.modal = null;
		options.is_checked = event.is_registered;
		ActionButton.call(this, options);
	}
	
	RegisterButton.prototype.checked_state_class = '-Registered';
	
	RegisterButton.prototype.onClick = function() {
		var self = this,
			ticket,
			promise;
		
		/**
		 *
		 * @param {RegistrationModal} modal
		 * @param {RegisterButton} button
		 */
		function showRegistrationModal(modal, button) {
			modal.show();
			modal.modal.one('registration:success', function() {
				modal.event.is_registered = true;
				button.afterCheck();
			});
		}
		
		if (!this.event.registration_available && !this.event.is_registered) {
			this.off('click.RippleEffect').addClass(__C.CLASSES.HOOKS.HANDLED + __C.CLASSES.HOOKS.RIPPLE);
			return false;
		}
		
		if (!this.event.is_registered) {
			if (this.modal && this.modal instanceof RegistrationModal) {
				showRegistrationModal(this.modal, this);
			} else if (this.event.registration_fields.length) {
				this.modal = new RegistrationModal(this.event);
				showRegistrationModal(this.modal, this)
			} else {
				this.event.fetchEvent(new Fields('registration_fields')).done(function() {
					self.modal = new RegistrationModal(self.event);
					showRegistrationModal(self.modal, self)
				});
			}
		} else {
			if (this.modal && this.modal instanceof TicketsModal) {
				this.modal.show();
			} else {
				if (this.event.tickets.length) {
					ticket = OneExtendedTicket.extractTicketFromEvent(this.event);
					promise = ticket.fetchTicket(new Fields('created_at', 'number', 'ticket_type', {
						order: {
							fields: new Fields('created_at')
						},
						event: {
							fields: new Fields('dates', 'is_same_time', 'image_horizontal_medium_url', 'location')
						}
					}));
				} else {
					promise = this.event.fetchEvent(new Fields('dates', 'is_same_time', 'image_horizontal_medium_url', 'location', {
						orders: {
							fields: new Fields('created_at')
						},
						tickets: new Fields('created_at', 'number', 'ticket_type')
					})).done(function() {
						return ticket = OneExtendedTicket.extractTicketFromEvent(self.event);
					});
				}
				
				promise.done(function() {
					self.modal = new TicketsModal(ticket);
					self.modal.show();
				});
			}
		}
		
	};
	
	RegisterButton.prototype.initiate = function() {
		if (!this.event.registration_available && !this.event.is_registered) {
			this.attr('disabled', true);
		} else {
			ActionButton.prototype.initiate.call(this);
		}
	};
	
	
	return RegisterButton;
}()));
