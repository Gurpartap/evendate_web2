/**
 * @requires Class.FeedPage.js
 */
/**
 *
 * @constructor
 * @augments Events
 */
function RecommendedEventsPage() {
	FeedPage.apply(this);
	this.events = new RecommendedEventsCollection();
	this.page_title = 'Рекомендованные события';
}
RecommendedEventsPage.extend(FeedPage);