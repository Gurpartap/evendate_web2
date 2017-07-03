/**
 * @requires Class.ActionButton.js
 */
/**
 *
 * @class BuyButton
 * @extends ActionButton
 */
BuyButton = extending(ActionButton, (function() {
	/**
	 *
	 * @param {OneEvent} event
	 * @param {object} [options]
	 * @constructor
	 * @constructs BuyButton
	 *
	 * @property {OneEvent} event
	 * @property {(RegistrationModal|TicketsModal)} modal
	 */
	function BuyButton(event, options) {
		var self = this;
		
		this.options = {
			labels: {
				checked: 'Куплен',
				unchecked: 'Купить билет',
				checked_hover: 'Открыть билеты',
				unchecked_hover: 'Купить билет'
			},
			colors: {
				checked: __C.CLASSES.COLORS.ACCENT,
				unchecked: __C.CLASSES.COLORS.MARGINAL_ACCENT,
				checked_hover: __C.CLASSES.COLORS.ACCENT,
				unchecked_hover: __C.CLASSES.COLORS.MARGINAL_ACCENT
			},
			icons: {
				checked: __C.CLASSES.ICONS.CHECK,
				unchecked: __C.CLASSES.ICONS.TICKET,
				checked_hover: __C.CLASSES.ICONS.TICKET,
				unchecked_hover: __C.CLASSES.ICONS.TICKET
			}
		};
		this.event = event;
		this.modal = null;
		
		Object.defineProperties(options, {
			is_checked: {
				get: function() {
					
					return !!self.event.tickets.length;
				}
			}
		});
		
		ActionButton.call(this, options);
	}
	
	BuyButton.prototype.checked_state_class = '-Bought';
	/*
	BuyButton.prototype.onClick = function() {
		var self = this,
			tickets_fields = ['created_at', 'number', 'ticket_type', 'order'],
			events_fields = ['dates', 'is_same_time', 'image_horizontal_medium_url', 'location'],
			ticket,
			promise;
		
		/!**
		 *
		 * @param {RegistrationModal} modal
		 * @param {BuyButton} button
		 *!/
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
					ticket = new EventsExtendedTicketsCollection(this.event.id);
					promise = ticket.fetchTickets(new Fields(tickets_fields, {
						event: {
							fields: new Fields(events_fields)
						}
					}));
				} else {
					promise = this.event.fetchEvent(new Fields(events_fields, {
						tickets: {
							fields: new Fields(tickets_fields)
						}
					})).done(function() {
						return ticket = ExtendedTicketsCollection.extractTicketsFromEvent(self.event);
					});
				}
				
				promise.done(function() {
					self.modal = new TicketsModal(ticket);
					self.modal.show();
				});
			}
		}
		
	};*/
	
	BuyButton.prototype.initiate = function() {
		if (!this.event.registration_available && !this.event.is_registered) {
			this.attr('disabled', true);
		} else {
			ActionButton.prototype.initiate.call(this);
		}
	};
	
	
	return BuyButton;
}()));
