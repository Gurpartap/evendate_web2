/**
 * @requires ../Class.AbstractModal.js
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
	 * @constructs AbstractUsersModal
	 */
	function AbstractUsersModal(entity_id, title) {
		AbstractModal.call(this);
		this.title = title;
		this.entity_id = entity_id;
		this.entities_length = 30;
		this.is_upload_disabled = false;
		this.users = new UsersCollection();
		this.is_first = true;
		this.wrapper_is_scrollable = true;
		
		if (this.constructor === AbstractUsersModal) {
			throw new Error("Can't instantiate abstract class!");
		}
	}
	/**
	 *
	 * @return {AbstractUsersModal}
	 */
	AbstractUsersModal.prototype.show = function() {
		var self = this;
		
		this.block_scroll = false;
		if(this.users.length){
			this.__show();
			return this;
		}
		this.render();
		this.uploadUsers(function() {
			self.__show();
		});
		
		return this;
	};
	/**
	 *
	 * @return {AbstractUsersModal}
	 */
	AbstractUsersModal.prototype.init = function() {
		bindPageLinks(this.modal);
		this.__init();
		
		return this;
	};
	/**
	 *
	 * @return {AbstractUsersModal}
	 */
	AbstractUsersModal.prototype.onScrollToBottom = function(callback) {
		var self = this;
		
		this.uploadUsers(function() {
			callback.call(self);
		});
		
		return this;
	};
	/**
	 *
	 * @return {AbstractUsersModal}
	 */
	AbstractUsersModal.prototype.hide = function() {
		this.block_scroll = false;
		this.modal_wrapper.off('scroll.uploadUsers');
		this.__hide();
		
		return this;
	};
	/**
	 * @callback AbstractUsersModal.uploadUsersCallback
	 * @param {Array} [users]
	 */
	/**
	 *
	 * @param {AbstractUsersModal.uploadUsersCallback} [callback]
	 */
	AbstractUsersModal.prototype.uploadUsers = function(callback) {};
	/**
	 *
	 * @param {Array} users
	 * @return {jQuery}
	 */
	AbstractUsersModal.prototype.buildUsers = function(users) {
		var $users = $(),
			last_is_fiends = this.content_wrapper.find('.UserTombstone').eq(-1).data('is_friend') == 'true',
			self = this;
		
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
			$new_users = this.buildUsers(users);
			this.content_wrapper.append($new_users);
			this.is_first = false;
			this.entities_length = 10;
			this.adjustDestroyerHeight();
			bindPageLinks($new_users);
			$new_users.on('click.hideModal', function() {
				self.hide();
			});
		} else {
			this.is_upload_disabled = true;
		}
	};
	
	return AbstractUsersModal;
}()));