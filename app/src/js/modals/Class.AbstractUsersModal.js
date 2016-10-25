/**
 * @requires Class.Modal.js
 */
/**
 * @abstract
 * @augments Modal
 * @param {(string|number)} entity_id
 * @param {string} title
 */
function AbstractUsersModal(entity_id, title) {
	this.title = title;
	this.entity_id = entity_id;
	this.entities_length = 30;
	this.disable_upload = false;
	this.users = new UsersCollection();
	this.is_first = true;
	
	this.modal = tmpl('modal', {
		modal_type: this.constructor.name,
		modal_content_classes: 'ModalContent',
		modal_title: tmpl('modal-title', {title: this.title})
	});
	this.content = this.modal.find('.ModalContent');
	
	if (this.constructor === AbstractUsersModal) {
		throw new Error("Can't instantiate abstract class!");
	}
}
AbstractUsersModal.extend(Modal);

AbstractUsersModal.prototype.show = function() {
	var self = this;
	
	Modal.modal_wrapper.data('block_scroll', false);
	Modal.modal_wrapper.on('scroll.uploadUsers', function() {
		if (!self.disable_upload) {
			if (Modal.modal_wrapper.height() + Modal.modal_wrapper.scrollTop() >= self.modal.height()) {
				if (!Modal.modal_wrapper.data('block_scroll')) {
					Modal.modal_wrapper.data('block_scroll', true);
					self.uploadUsers(function() {
						Modal.modal_wrapper.data('block_scroll', false);
						self.adjustDestroyer();
					});
				}
			}
		}
	});
	if (!this.users.length) {
		self.uploadUsers(function() {
			self.appear();
		});
		
	} else {
		self.appear();
	}
};

AbstractUsersModal.prototype.hide = function() {
	Modal.modal_wrapper.data('block_scroll', false).off('scroll.uploadUsers');
	this.disappear();
	Modal.hide();
};

AbstractUsersModal.prototype.uploadUsers = function(callback) {};

AbstractUsersModal.prototype.buildUsers = function(users, $wrapper) {
	var $users = $(),
		last_is_fiends = false,
		self = this;
	
	if (typeof $wrapper != 'undefined') {
		last_is_fiends = $wrapper.find('.UserTombstone').eq(-1).data('is_friend') == 'true';
	}
	
	users.forEach(function(user, i) {
		if ((self.is_first && !i) || last_is_fiends != user.is_friend) {
			$users = $users.add(tmpl('modal-users-divider', {label: user.is_friend ? 'Друзья' : 'Все'}));
			last_is_fiends = user.is_friend;
		}
		
		$users = $users.add(__APP.BUILD.userTombstones(user, {
			tombstone_classes: ['UserTombstone'],
			is_link: true,
			dataset: {is_friend: user.is_friend}
		}));
	});
	$wrapper.append($users);
	return $users;
};

AbstractUsersModal.prototype.afterUpload = function(users) {
	var self = this,
		$new_users;
	if (users.length) {
		$new_users = this.buildUsers(users, this.content);
		this.content.append($new_users);
		this.is_first = false;
		this.entities_length = 10;
		this.adjustDestroyer();
		bindPageLinks(this.modal);
		$new_users.on('click.hideModal', function() {
			self.hide();
		});
	} else {
		this.disable_upload = true;
	}
};