/**
 * @requires Class.FeedPage.js
 */
/**
 *
 * @class FavoredEventsPage
 * @extends FeedPage
 */
FavoredEventsPage = extending(FeedPage, (function() {
	/**
	 *
	 * @constructor
	 * @constructs FavoredEventsPage
	 */
	function FavoredEventsPage() {
		FeedPage.apply(this);
		this.events = new FavoredEventsCollection();
		this.page_title = 'Избранные события';
	}
	
	return FavoredEventsPage
}()));