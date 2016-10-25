/**
 * @requires Class.FeedPage.js
 */
/**
 *
 * @constructor
 * @augments Events
 */
function FriendsEventsPage() {
	FeedPage.apply(this);
	this.events = new FriendsEventsCollection();
	this.page_title = 'События друзей';
}
FriendsEventsPage.extend(FeedPage);