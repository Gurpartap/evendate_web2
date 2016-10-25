/**
 * @requires Class.AbstractUsersModal.js
 */
/**
 *
 * @constructor
 * @augments AbstractUsersModal
 * @param {(string|number)} organization_id
 * @param {string} [title='Подписались']
 */
function SubscribersModal(organization_id, title) {
	if (organization_id) {
		AbstractUsersModal.apply(this, [organization_id, title ? title : 'Подписались']);
		this.entity_id = organization_id;
		this.ajax_data = {
			fields: ['is_friend'],
			order_by: '-is_friend,first_name'
		};
		
		Modal.pushModal(this);
	} else {
		throw Error('To open favored modal you need to pass organization_id');
	}
}

SubscribersModal.prototype.uploadUsers = function(callback) {
	var self = this;
	
	this.users.fetchOrganizationSubscribers(this.entity_id, this.entities_length, this.ajax_data, function(users) {
		self.afterUpload(users);
		if (callback && typeof callback == 'function') {
			callback(users);
		}
	});
};