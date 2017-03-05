/**
 * @requires Class.FeedPage.js
 */
/**
 *
 * @class DayEventsPage
 * @extends FeedPage
 */
DayEventsPage = extending(FeedPage, (function() {
	/**
	 *
	 * @param {string} date
	 * @constructor
	 * @constructs DayEventsPage
	 */
	function DayEventsPage(date) {
		if (!date)
			throw Error('DayEventsCollection must have date parameter');
		FeedPage.apply(this);
		this.date = date;
		this.events = new DayEventsCollection(this.date);
		this.page_title = 'События на ' + moment(this.date).format('D MMMM YYYY');
	}
	
	return DayEventsPage
}()));