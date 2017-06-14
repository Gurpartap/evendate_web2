/**
 * @requires ../Class.EntitiesCollection.js
 * @requires Class.OneNotification.js
 */
/**
 *
 * @class NotificationsCollection
 * @extends EntitiesCollection
 */
NotificationsCollection = extending(EntitiesCollection, (function() {
	/**
	 *
	 * @constructor
	 * @constructs NotificationsCollection
	 */
	function NotificationsCollection() {
		EntitiesCollection.call(this);
	}
	NotificationsCollection.prototype.collection_of = OneNotification;
	
	return NotificationsCollection;
}()));