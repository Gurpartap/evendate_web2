/**
 * @requires Class.FeedPage.js
 */
/**
 *
 * @constructor
 * @augments Events
 * @param {string} date
 */
function DayEventsPage(date) {
	if (!date)
		throw Error('DayEventsCollection must have date parameter');
	FeedPage.apply(this);
	this.date = date;
	this.events = new DayEventsCollection(this.date);
	this.page_title = 'События на ' + moment(this.date).format('D MMMM YYYY');
}
DayEventsPage.extend(FeedPage);