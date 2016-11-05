/**
 * @requires Class.FeedPage.js
 */
/**
 *
 * @constructor
 * @augments Events
 */
function FavoredEventsPage() {
	FeedPage.apply(this);
	this.events = new FavoredEventsCollection();
	this.page_title = 'Избранные события';
}
FavoredEventsPage.extend(FeedPage);