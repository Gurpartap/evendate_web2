/**
 * @requires Class.FeedPage.js
 */
/**
 *
 * @class FriendsEventsPage
 * @extends FeedPage
 */
FriendsEventsPage = extending(FeedPage, (function() {
	/**
	 *
	 * @constructor
	 * @constructs FriendsEventsPage
	 */
	function FriendsEventsPage() {
		FeedPage.apply(this);
		this.events = new FriendsEventsCollection();
		this.page_title = 'События друзей';
	}
	
	return FriendsEventsPage
}()));