/**
 * @requires Class.FeedPage.js
 */
/**
 *
 * @constructor
 * @augments FeedPage
 */
function TimelineEventsPage() {
	FeedPage.apply(this);
	this.events = new TimelineEventsCollection();
	this.page_title = 'События по времени';
}
TimelineEventsPage.extend(FeedPage);