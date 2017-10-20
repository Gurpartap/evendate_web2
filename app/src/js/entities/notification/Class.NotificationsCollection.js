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
	 *
	 * @property {Array<OneNotification>} future
	 */
	function NotificationsCollection() {
		EntitiesCollection.call(this);
		
		Object.defineProperties(this, {
			future: {
				get: function() {
					
					return this.filter(function(notification) {
						
						return !notification.done;
					});
				}
			}
		});
	}
	NotificationsCollection.prototype.collection_of = OneNotification;
	
	return NotificationsCollection;
}()));