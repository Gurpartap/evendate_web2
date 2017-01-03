/**
 * @requires Class.AbstractListModal.js
 */
/**
 * @class
 * @extends AbstractListModal
 */
FriendsListModal = extending(AbstractListModal, (function() {
	/**
	 *
	 * @constructs FriendsListModal
	 */
	function FriendsListModal(user) {
		if (typeof FriendsListModal.instance === 'object') {
			return FriendsListModal.instance;
		}
		this.title = 'Подписки на пользователей';
		AbstractListModal.call(this, user);
		this.entities = this.entity.friends;
		FriendsListModal.instance = this;
	}
	
	FriendsListModal.prototype.uploadEntities = function() {
		var self = this;
		if(!this.block_scroll){
			this.block_scroll = true;
			return __APP.USER.fetchFriends({length: 20}).done(function(friends) {
				if(friends.length) {
					self.block_scroll = false;
					self.$entities_wrapper.append(self.buildEntities(friends));
				}
			});
		}
		return $.Deferred().resolve().promise();
	};
	
	FriendsListModal.prototype.buildEntities = function(entities) {
		var $blocks = __APP.BUILD.avatarBlocks(entities, {
			is_link: true,
			entity: 'user',
			avatar_classes: ['-size_40x40', '-rounded']
		});
		bindPageLinks($blocks);
		return $blocks;
	};
	
	return FriendsListModal;
}()));