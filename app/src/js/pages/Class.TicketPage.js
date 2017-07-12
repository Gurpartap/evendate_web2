/**
 *
 * @class TicketPage
 * @extends Page
 */
TicketPage = extending(Page, (function() {
	/**
	 *
	 * @constructor
	 * @constructs TicketPage
	 */
	function TicketPage() {
		Page.call(this);
	}
	
	TicketPage.prototype.render = function() {
		
		this.$view.find('.Print').on('click', function() {
			window.print();
		});
	};
	
	return TicketPage;
}()));