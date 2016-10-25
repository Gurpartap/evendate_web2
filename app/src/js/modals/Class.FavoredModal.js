/**
 * @requires Class.AbstractUsersModal.js
 */
/**
 *
 * @constructor
 * @augments AbstractUsersModal
 * @param {(number|string)} event_id
 * @param {string} [title='Добавили в избранное']
 */
function FavoredModal(event_id, title) {
	if (event_id) {
		AbstractUsersModal.apply(this, [event_id, title ? title : 'Добавили в избранное']);
		this.ajax_data = {
			fields: ['is_friend'],
			order_by: '-is_friend,first_name'
		};
		
		Modal.pushModal(this);
	} else {
		throw Error('To open favored modal you need to pass event_id');
	}
}
FavoredModal.extend(AbstractUsersModal);

FavoredModal.prototype.uploadUsers = function(callback) {
	var self = this;
	
	this.users.fetchEventFavorites(this.entity_id, this.entities_length, this.ajax_data, function(users) {
		self.afterUpload(users);
		if (callback && typeof callback == 'function') {
			callback(users);
		}
	});
};