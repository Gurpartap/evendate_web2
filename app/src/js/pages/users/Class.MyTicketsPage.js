/**
 * @requires ../Class.Page.js
 */
/**
 *
 * @class MyTicketsPage
 * @extends Page
 */
MyTicketsPage = extending(Page, (function() {
	/**
	 *
	 * @constructor
	 * @constructs MyTicketsPage
	 */
	function MyTicketsPage() {
		Page.call(this);
		this.page_title = 'Мои билеты';
		
		this.tickets = new MyTicketsCollection();
		
		this.disable_uploads = false;
		this.block_scroll = false;
		
		this.fetch_tickets_fields = TicketsModal.NECESSARY_FIELDS.copy();
		this.fetch_tickets_quantity = 30;
	}
	
	MyTicketsPage.prototype.fetchData = function() {
		
		return this.fetching_data_defer = this.tickets.fetchTickets(this.fetch_tickets_fields, this.fetch_tickets_quantity);
	};
	
	MyTicketsPage.prototype.fetchAndAppendTickets = function() {
		var self = this,
			$loader;
		
		if (!this.disable_uploads && !this.block_scroll) {
			$loader = __APP.BUILD.loaderBlock(this.$wrapper);
			this.block_scroll = true;
			this.tickets.fetchTickets(this.fetch_tickets_fields, this.fetch_tickets_quantity).then(function(tickets) {
				var green_tickets = ExtendedTicketsCollection.getGreenTickets(tickets);
				
				self.block_scroll = false;
				if (tickets.length) {
					if (green_tickets.length) {
						self.$wrapper.find('.TicketsWrapper').append(__APP.BUILD.ticketCards(tickets));
					} else {
						self.fetchAndAppendTickets();
					}
				} else {
					self.disable_uploads = true;
				}
				$loader.remove();
			});
		}
	};
	
	MyTicketsPage.prototype.init = function() {
		var self = this;
		bindCallModal(this.$wrapper);
		
		if (isScrollRemain(1000)) {
			self.fetchAndAppendTickets();
		}
		$(window).on('scroll.uploadTickets', function() {
			if (isScrollRemain(1000)) {
				self.fetchAndAppendTickets();
			}
		});
	};
	
	MyTicketsPage.prototype.render = function() {
		var green_tickets;
		
		if(__APP.USER.isLoggedOut()){
			__APP.changeState('/', true, true);
			return null;
		}
		
		green_tickets = ExtendedTicketsCollection.getGreenTickets(this.tickets.__last_pushed);
		
		if (!green_tickets.length) {
			this.fetchAndAppendTickets();
		}
		
		this.$wrapper.html(tmpl('my-tickets-wrapper', {
			tickets: __APP.BUILD.ticketCards(green_tickets)
		}));
		
		this.init();
	};
	
	return MyTicketsPage;
}()));