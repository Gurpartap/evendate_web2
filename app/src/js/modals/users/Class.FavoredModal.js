/**
 * @requires Class.AbstractUsersModal.js
 */
/**
 * @class
 * @extends AbstractUsersModal
 */
FavoredModal = extending(AbstractUsersModal, (function() {
	/**
	 *
	 * @param {(number|string)} event_id
	 * @param {string} [title = Добавили в избранное]
	 * @constructor
	 * @constructs FavoredModal
	 */
	function FavoredModal(event_id, title) {
		if (event_id) {
			AbstractUsersModal.call(this, event_id, title ? title : 'Добавили в избранное');
			this.ajax_data = {
				fields: ['is_friend'],
				order_by: '-is_friend,first_name'
			};
		} else {
			throw Error('To open favored modal you need to pass event_id');
		}
	}
	
	/**
	 *
	 * @param {AbstractUsersModal.uploadUsersCallback} [callback]
	 * @return {Promise}
	 */
	FavoredModal.prototype.uploadUsers = function(callback) {
		var self = this;
		
		return this.users.fetchEventFavorites(this.entity_id, this.entities_length, this.ajax_data, function(users) {
			self.afterUpload(users);
			if (callback && typeof callback == 'function') {
				callback(users);
			}
		});
	};
	
	return FavoredModal;
}()));
