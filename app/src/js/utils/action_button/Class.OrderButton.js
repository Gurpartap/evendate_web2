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
				unchecked: event.ticketing_locally ? 'Купить' : 'Регистрация',
				checked_hover: 'Открыть билеты',
				unchecked_hover: event.ticketing_locally ? 'Купить' : 'Регистрация'
			},
			colors: {
				checked: __C.CLASSES.COLORS.ACCENT,
				unchecked: __C.CLASSES.COLORS.MARGINAL_ACCENT,
				checked_hover: __C.CLASSES.COLORS.ACCENT,
				unchecked_hover: __C.CLASSES.COLORS.MARGINAL_ACCENT
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
		this.is_disabled = !this.event.registration_available;
		options.is_checked = false;
		ActionButton.call(this, options);
	}
	
	OrderButton.prototype.checked_state_class = '-Ordered';
	
	OrderButton.prototype.onClick = function() {
		var self = this,
			tickets_fields = ['created_at', 'number', 'ticket_type', 'order'],
			events_fields = ['dates', 'is_same_time', 'image_horizontal_medium_url', 'location'],
			ticket,
			promise;
		
		if (this.is_disabled) {
			this.off('click.RippleEffect').addClass(__C.CLASSES.HOOKS.HANDLED + __C.CLASSES.HOOKS.RIPPLE);
			
			return false;
		}
		__APP.changeState('/event/' + this.event.id + '/order');
		/*
		if (this.event.registration_available && !this.event.is_registered || this.event.ticketing_locally && this.event.tickets.length === 0) {
			__APP.changeState('/event/' + this.event.id + '/order');
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
		}*/
		
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