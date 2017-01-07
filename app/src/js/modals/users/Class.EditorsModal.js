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
	 * @constructor
	 * @param {(string|number)} organization_id
	 * @param {string} [title='Редаторы']
	 * @param {OneUser.ROLE} [specific_role]
	 */
	function EditorsModal(organization_id, title, specific_role) {
		AbstractUsersModal.apply(this, [organization_id, title ? title : 'Редакторы']);
		this.ajax_data = {
			order_by: 'role,first_name'
		};
		
		if (specific_role) {
			this.ajax_data.roles = specific_role;
		}
	}
	
	/**
	 *
	 * @param {function({Array})} callback
	 */
	EditorsModal.prototype.uploadUsers = function(callback) {
		var self = this;
		
		this.users.fetchOrganizationStaff(this.entity_id, this.entities_length, this.ajax_data, function(users) {
			self.afterUpload(users);
			if (callback && typeof callback == 'function') {
				callback(users);
			}
		});
	};
	/**
	 *
	 * @param {Array} users
	 * @param {jQuery} $wrapper
	 * @return {jQuery}
	 */
	EditorsModal.prototype.buildUsers = function(users, $wrapper) {
		var $users = $(),
			last_role = false,
			labels = {
				admin: 'Администраторы',
				moderator: 'Модераторы'
			},
			self = this;
		
		if (typeof $wrapper != 'undefined') {
			last_role = $wrapper.find('.UserTombstone').last().data('role');
		}
		
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
		$wrapper.append($users);
		return $users;
	};
	
	return EditorsModal;
}()));
