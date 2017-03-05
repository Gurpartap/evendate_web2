/**
 * @requires Class.FeedPage.js
 */
/**
 *
 * @class ActualEventsPage
 * @extends FeedPage
 */
ActualEventsPage = extending(FeedPage, (function() {
	/**
	 *
	 * @constructor
	 * @constructs ActualEventsPage
	 */
	function ActualEventsPage() {
		FeedPage.apply(this);
		this.events = new ActualEventsCollection();
		this.page_title = 'Актуальные события';
	}
	
	return ActualEventsPage
}()));