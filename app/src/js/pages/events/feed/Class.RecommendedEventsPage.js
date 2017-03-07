/**
 * @requires Class.FeedPage.js
 */
/**
 *
 * @class RecommendedEventsPage
 * @extends FeedPage
 */
RecommendedEventsPage = extending(FeedPage, (function() {
	/**
	 *
	 * @constructor
	 * @constructs RecommendedEventsPage
	 */
	function RecommendedEventsPage() {
		FeedPage.apply(this);
		this.events = new RecommendedEventsCollection();
		this.page_title = 'Рекомендованные события';
	}
	
	return RecommendedEventsPage
}()));