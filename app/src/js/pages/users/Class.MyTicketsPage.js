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
		
		this.fetch_tickets_fields = new Fields('created_at', 'number', 'ticket_type', {
			order: {
				fields: new Fields('created_at')
			},
			event: {
				fields: new Fields('dates', 'is_same_time', 'image_horizontal_medium_url', 'location')
			}
		});
		this.fetch_tickets_quantity = 30;
	}
	
	MyTicketsPage.prototype.fetchData = function() {
		return this.fetching_data_defer = this.tickets.fetchTickets(this.fetch_tickets_fields, this.fetch_tickets_quantity);
	};
	
	MyTicketsPage.prototype.init = function() {
		var self = this;
		bindCallModal(this.$wrapper);
		
		$(window).on('scroll.uploadTickets', function() {
			if (isScrollRemain(200)) {
				
				
				var $loader;
				
				if(!self.disable_uploads && !self.block_scroll){
					$loader = __APP.BUILD.loaderBlock(self.$wrapper);
					self.block_scroll = true;
					
					self.tickets.fetchTickets(self.fetch_tickets_fields, self.fetch_tickets_quantity).done(function(tickets) {
						self.block_scroll = false;
						if (tickets.length) {
							self.$wrapper.find('.TicketsWrapper').append(__APP.BUILD.ticketCards(tickets))
						} else {
							self.disable_uploads = true;
						}
						$loader.remove();
					});
					
				}
				
			}
		});
	};
	
	MyTicketsPage.prototype.render = function() {
		if(__APP.USER.isLoggedOut()){
			__APP.changeState('/', true, true);
			return null;
		}
		
		this.$wrapper.html(tmpl('my-tickets-wrapper', {
			tickets: __APP.BUILD.ticketCards(this.tickets)
		}));
		
		this.init();
	};
	
	return MyTicketsPage;
}()));