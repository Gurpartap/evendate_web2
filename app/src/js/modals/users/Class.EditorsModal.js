/**
 * @requires Class.AbstractUsersModal.js
 */
/**
 * @class
 * @extends AbstractUsersModal
 */
EditorsModal = extending(AbstractUsersModal, (function() {
	/**
	 *
	 * @param {(string|number)} organization_id
	 * @param {string} [title=Редаторы]
	 * @param {OneUser.ROLE} [specific_role]
	 * @constructor
	 * @constructs EditorsModal
	 */
	function EditorsModal(organization_id, title, specific_role) {
		AbstractUsersModal.call(this, organization_id, title ? title : 'Редакторы');
		this.ajax_data = {
			order_by: 'role,first_name'
		};
		
		if (specific_role) {
			this.ajax_data.roles = specific_role;
		}
	}
	/**
	 *
	 * @param {AbstractUsersModal.uploadUsersCallback} [callback]
	 * @return {jqPromise}
	 */
	EditorsModal.prototype.uploadUsers = function(callback) {
		var self = this;
		
		return this.users.fetchOrganizationStaff(this.entity_id, this.entities_length, this.ajax_data, function(users) {
			self.afterUpload(users);
			if (callback && typeof callback == 'function') {
				callback(users);
			}
		});
	};
	/**
	 *
	 * @param {Array} users
	 * @return {jQuery}
	 */
	EditorsModal.prototype.buildUsers = function(users) {
		var $users = $(),
			last_role = this.content_wrapper.find('.UserTombstone').last().data('role'),
			labels = {
				admin: 'Администраторы',
				moderator: 'Модераторы'
			},
			self = this;
		
		users.forEach(function(user, i) {
			if ((self.is_first && !i) || last_role != user.role) {
				$users = $users.add(tmpl('modal-users-divider', {label: labels[user.role]}));
				last_role = user.role;
			}
			
			$users = $users.add(__APP.BUILD.userTombstones(user, {
				tombstone_classes: ['UserTombstone'],
				is_link: true,
				dataset: {role: user.role}
			}));
		});
		
		return $users;
	};
	
	return EditorsModal;
}()));
