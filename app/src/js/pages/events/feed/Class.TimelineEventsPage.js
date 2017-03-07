/**
 * @requires Class.FeedPage.js
 */
/**
 *
 * @class TimelineEventsPage
 * @extends FeedPage
 */
TimelineEventsPage = extending(FeedPage, (function() {
	/**
	 *
	 * @constructor
	 * @constructs TimelineEventsPage
	 */
	function TimelineEventsPage() {
		FeedPage.apply(this);
		this.events = new TimelineEventsCollection();
		this.page_title = 'События по времени';
	}
	
	return TimelineEventsPage
}()));