/**
 * @requires Class.AbstractModal.js
 */
/**
 * @class
 * @abstract
 * @extends AbstractModal
 */
AbstractUsersModal = extending(AbstractModal, (function() {
	/**
	 *
	 * @param {(string|number)} entity_id
	 * @param {string} title
	 * @constructor
	 */
	function AbstractUsersModal(entity_id, title) {
		AbstractModal.call(this, {
			content: '',
			title: title,
			type: this.constructor.name,
			content_classes: ['ModalContent']
		});
		this.entity_id = entity_id;
		this.entities_length = 30;
		this.disable_upload = false;
		this.users = new UsersCollection();
		this.is_first = true;
		
		this.content = this.modal.find('.ModalContent');
		
		if (this.constructor === AbstractUsersModal) {
			throw new Error("Can't instantiate abstract class!");
		}
	}
	
	AbstractUsersModal.prototype.show = function() {
		var self = this;
		
		__APP.MODALS.modal_wrapper.data('block_scroll', false);
		__APP.MODALS.modal_wrapper.on('scroll.uploadUsers', function() {
			if (!self.disable_upload) {
				if (__APP.MODALS.modal_wrapper.height() + __APP.MODALS.modal_wrapper.scrollTop() >= self.modal.height()) {
					if (!__APP.MODALS.modal_wrapper.data('block_scroll')) {
						__APP.MODALS.modal_wrapper.data('block_scroll', true);
						self.uploadUsers(function() {
							__APP.MODALS.modal_wrapper.data('block_scroll', false);
							__APP.MODALS.modal_destroyer.adjustHeight(self.modal.height());
						});
					}
				}
			}
		});
		if (!this.users.length) {
			self.uploadUsers(function() {
				AbstractModal.prototype.show.call(self);
			});
			
		} else {
			AbstractModal.prototype.show.call(self);
		}
	};
	
	AbstractUsersModal.prototype.hide = function() {
		__APP.MODALS.modal_wrapper.data('block_scroll', false).off('scroll.uploadUsers');
		__APP.MODALS.hideCurrent();
	};
	
	AbstractUsersModal.prototype.uploadUsers = function(callback) {};
	/**
	 *
	 * @param {Array} users
	 * @param {jQuery} $wrapper
	 * @return {jQuery}
	 */
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
	/**
	 *
	 * @param {Array} users
	 */
	AbstractUsersModal.prototype.afterUpload = function(users) {
		var self = this,
			$new_users;
		if (users.length) {
			$new_users = this.buildUsers(users, this.content);
			this.content.append($new_users);
			this.is_first = false;
			this.entities_length = 10;
			__APP.MODALS.modal_destroyer.adjustHeight(this.modal.height());
			bindPageLinks(this.modal);
			$new_users.on('click.hideModal', function() {
				self.hide();
			});
		} else {
			this.disable_upload = true;
		}
	};
	
	return AbstractUsersModal;
}()));