/**
 * @requires Class.FeedPage.js
 */
/**
 *
 * @constructor
 * @augments FeedPage
 */
function ActualEventsPage() {
	FeedPage.apply(this);
	this.events = new ActualEventsCollection();
	this.page_title = 'Актуальные события';
}
ActualEventsPage.extend(FeedPage);