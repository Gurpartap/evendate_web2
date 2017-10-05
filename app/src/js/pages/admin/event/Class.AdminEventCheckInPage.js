/**
 * @requires Class.AdminEventPage.js
 */
/**
 *
 * @class AdminEventCheckInPage
 * @extends AdminEventPage
 */
AdminEventCheckInPage = extending(AdminEventPage, (function() {
	/**
	 *
	 * @class CheckInTicketsCollection
	 * @extends EventAllTicketsCollection
	 */
	var CheckInTicketsCollection = extending(EventAllTicketsCollection, (function() {
		
		/**
		 * @param {(string|number)} event_id
		 *
		 * @constructor
		 * @constructs CheckInTicketsCollection
		 *
		 * @property {Array<OneTicket>} awaiting
		 * @property {Array<OneTicket>} checked
		 * @property {Array<OneTicket>} new_awaiting
		 * @property {Array<OneTicket>} new_checked
		 * @property {Array<OneTicket>} last_pushed
		 */
		function CheckInTicketsCollection(event_id) {
			var self = this;
			
			EventAllTicketsCollection.call(this, event_id);
			
			Object.defineProperties(this, {
				awaiting: {
					get: function() {
						return self.filter(function(ticket) {
							return !ticket.checkout;
						});
					}
				},
				new_awaiting: {
					get: function() {
						return self.last_pushed.filter(function(ticket) {
							return !ticket.checkout;
						});
					}
				},
				checked: {
					get: function() {
						return self.filter(function(ticket) {
							return ticket.checkout;
						});
					}
				},
				new_checked: {
					get: function() {
						return self.last_pushed.filter(function(ticket) {
							return ticket.checkout;
						});
					}
				}
			});
		}
		
		CheckInTicketsCollection.fetchTickets = EventAllTicketsCollection.fetchTickets;
		
		return CheckInTicketsCollection;
	}()));
	
	/**
	 *
	 * @param {(string|number)} event_id
	 *
	 * @constructor
	 * @constructs AdminEventCheckInPage
	 *
	 * @property {AdminEventCheckInPage.STATES} current_checkin_state
	 * @property {CheckInTicketsCollection} tickets
	 * @property {Fuse} searching_tickets_fuse
	 * @property {Fields} tickets_fields
	 * @property {boolean} is_awaiting_state
	 * @property {boolean} is_searching_state
	 * @property {boolean} is_fetching
	 * @property {ProgressBar} progress_bar
	 * @property {jQuery} table_body
	 */
	function AdminEventCheckInPage(event_id) {
		var self = this;
		
		AdminEventPage.call(this, event_id);
		
		this.current_checkin_state = AdminEventCheckInPage.STATES.AWAITING;
		this.tickets_fields = new Fields('user', 'ticket_type', 'event_id');
		this.tickets = new CheckInTicketsCollection(event_id);
		this.is_searching_state = false;
		this.is_fetching = false;
		
		this.progress_bar = new ProgressBar(this.tickets.length, this.tickets.checked.length, {
			classes: [
				AbstractProgressBar.MODIFICATORS.WITH_LABEL,
				__C.CLASSES.UNIVERSAL_STATES.ROUNDED
			]
		});
		
		this.table_body = $();
		
		Object.defineProperties(this, {
			page_title_obj: {
				get: function() {
					return [{
						title: 'Организации',
						page: '/admin'
					}, {
						title: self.event.organization_short_name,
						page: '/admin/organization/' + self.event.organization_id
					}, self.event.title + ' - контроль входа'];
				}
			},
			is_awaiting_state: {
				get: function() {
					return self.current_checkin_state === AdminEventCheckInPage.STATES.AWAITING;
				}
			},
			searching_tickets_fuse: {
				get: function() {
					
					return new Fuse(self.tickets, {
						shouldSort: true,
						threshold: 0.1,
						distance: 1000,
						keys: [
							'number',
							'user.full_name'
						]
					});
				}
			}
		});
	}
	
	/**
	 *
	 * @enum {string}
	 */
	AdminEventCheckInPage.STATES = {
		AWAITING: 'awaiting',
		CHECKED: 'checked'
	};
	
	AdminEventCheckInPage.ACTION_TEXTS = {
		AWAITING_NORMAL: 'Ожидает подтверждения',
		AWAITING_HOVER: 'Подтвердить вход',
		CHECKED_NORMAL: 'Подтверждён',
		CHECKED_HOVER: 'Отменить подтверждение'
	};
	
	AdminEventCheckInPage.prototype.fetchData = function() {
		
		return this.fetching_data_defer = AdminEventPage.prototype.fetchData.call(this);
	};
	/**
	 *
	 * @param {(Array<OneTicket>|OneTicket)} tickets
	 * @param {string} [no_tickets_text='Нет билетов']
	 * @return {jQuery}
	 */
	AdminEventCheckInPage.prototype.buildTableRows = function(tickets, no_tickets_text) {
		tickets = tickets ? (tickets instanceof Array) ? tickets : [tickets] : [];
		var self = this,
			$rows;
		
		if (!tickets.length)
			return tmpl('event-admin-check-in-row-no-tickets', {text: no_tickets_text ? no_tickets_text : 'Нет билетов'});
		
		$rows = tmpl('event-admin-check-in-row', tickets.map(function(ticket) {
			
			return {
				ticket_id: ticket.uuid,
				number: ticket.number,
				full_name: ticket.user.full_name,
				avatar_block: __APP.BUILD.avatarBlocks(ticket.user, {
					entity: __C.ENTITIES.USER,
					avatar_classes: [__C.CLASSES.SIZES.X30, __C.CLASSES.UNIVERSAL_STATES.ROUNDED]
				}),
				ticket_type: ticket.ticket_type.name,
				state_modificator: '-ticket_status_' + (ticket.checkout ? AdminEventCheckInPage.STATES.CHECKED : AdminEventCheckInPage.STATES.AWAITING),
				status_text: ticket.checkout ? AdminEventCheckInPage.ACTION_TEXTS.CHECKED_NORMAL : AdminEventCheckInPage.ACTION_TEXTS.AWAITING_NORMAL,
				action_text: ticket.checkout ? AdminEventCheckInPage.ACTION_TEXTS.CHECKED_HOVER : AdminEventCheckInPage.ACTION_TEXTS.AWAITING_HOVER
			};
		}));
		
		$rows.find('.CheckoutTicket').not('.-Handled_CheckoutTicket').on('click', function() {
			/**
			 *
			 * @type {OneTicket}
			 */
			var ticket = self.tickets.getByID($(this).closest('.Ticket').data('ticket_uuid'));
			
			OneTicket[ticket.checkout ? 'uncheck' : 'check'](ticket.event_id, ticket.uuid, function() {
				self.changeTicketState(ticket, ticket.checkout ? AdminEventCheckInPage.STATES.AWAITING : AdminEventCheckInPage.STATES.CHECKED);
			});
		}).addClass('-Handled_CheckoutTicket');
		
		return $rows;
	};
	/**
	 *
	 * @param {OneTicket} ticket
	 * @param {AdminEventCheckInPage.STATES} state
	 */
	AdminEventCheckInPage.prototype.changeTicketState = function(ticket, state) {
		var $ticket;
		
		if (this.is_searching_state) {
			$ticket = this.table_body.find('.Ticket_' + ticket.uuid);
			$ticket.toggleClass(Object.values(AdminEventCheckInPage.STATES).map(function(state) { return '-ticket_status_' + state; }).join(' '));
			$ticket.find('.StatusText').text(AdminEventCheckInPage.ACTION_TEXTS[ticket.checkout ? 'AWAITING_NORMAL' : 'CHECKED_NORMAL']);
			$ticket.find('.CheckoutTicket').text(AdminEventCheckInPage.ACTION_TEXTS[ticket.checkout ? 'AWAITING_HOVER' : 'CHECKED_HOVER']);
		} else if (ticket.checkout !== this.is_awaiting_state) {
			if (state === (this.is_awaiting_state ? AdminEventCheckInPage.STATES.AWAITING : AdminEventCheckInPage.STATES.CHECKED)) {
				this.table_body.append(this.buildTableRows(ticket));
			} else {
				this.table_body.find('.Ticket_' + ticket.uuid).remove();
			}
		}
		
		if ((ticket.checkout && state === AdminEventCheckInPage.STATES.AWAITING) || (!ticket.checkout && state === AdminEventCheckInPage.STATES.CHECKED)) {
			ticket.checkout = !ticket.checkout;
			this.progress_bar.set(this.tickets.checked.length);
		}
		
		if (!this.is_searching_state && !this.tickets[this.current_checkin_state].length) {
			this.table_body.html(this.buildTableRows([]));
		}
	};
	
	AdminEventCheckInPage.prototype.initSearch = function() {
		var self = this;
		
		this.is_searching_state = true;
		this.$wrapper.find('.RadioGroup').find('input').prop('checked', false);
		
		this.$wrapper.find('.ClearSearch').one('click', function() {
			self.$wrapper.find('.SearchTickets').val('');
			self.deInitSearch();
		});
		
		$(window).on('keydown.deInitSearch', function(e) {
			if (e.keyCode === 27) {
				self.deInitSearch();
			}
		});
	};
	
	AdminEventCheckInPage.prototype.deInitSearch = function() {
		this.is_searching_state = false;
		$(window).off('keydown.deInitSearch');
		
		this.$wrapper.find('#event_admin_check_in_type_' + this.current_checkin_state).prop('checked', true);
		this.table_body.html(this.buildTableRows(this.tickets[this.current_checkin_state]));
	};
	
	AdminEventCheckInPage.prototype.init = function() {
		var self = this;
		
		this.$wrapper.find('.RadioGroup').on('change', function(e) {
			self.current_checkin_state = $(e.target).val();
			self.table_body.html(self.buildTableRows(self.tickets[self.current_checkin_state]));
		});
		
		this.$wrapper.find('.SearchTickets').on('input', function(e) {
			var value = $(e.target).val();
			
			if (!self.is_searching_state) {
				self.initSearch();
			}
			
			if (value === '') {
				self.deInitSearch();
			} else {
				self.table_body.html(self.buildTableRows(self.searching_tickets_fuse.search(value)));
			}
		});
	};
	
	AdminEventCheckInPage.prototype.render = function() {
		var self = this,
			$loader;
		
		this.progress_bar.setMax(this.tickets.length);
		this.progress_bar.set(this.tickets.checked.length);
		
		this.$wrapper.html(tmpl('event-admin-check-in-page', {
			radio_group: __APP.BUILD.radioGroup({
				name: 'check_in_type',
				units: [
					{
						id: 'event_admin_check_in_type_awaiting',
						label: 'Ожидают',
						attributes: {
							value: AdminEventCheckInPage.STATES.AWAITING,
							checked: true
						}
					},
					{
						id: 'event_admin_check_in_type_checked',
						label: 'Проверенные',
						attributes: {
							value: AdminEventCheckInPage.STATES.CHECKED
						}
					}
				]
			}),
			progress_bar: this.progress_bar
		}));
		
		this.$wrapper.find('.CheckInTable').after($loader = __APP.BUILD.loaderBlock());
		this.table_body = this.$wrapper.find('.CheckInTable').children('tbody');
		
		this.tickets.fetchAllTickets(this.tickets_fields, {
			order_status_type: 'green'
		}, 'created_at').always(function() {
			$loader.remove();
		}).done(function() {
			self.progress_bar.setMax(self.tickets.length);
			self.progress_bar.set(self.tickets.checked.length);
			
			self.table_body.append(self.buildTableRows(self.tickets['new_' + self.current_checkin_state]));
		});
		
		this.init();
	};
	
	
	return AdminEventCheckInPage;
}()));