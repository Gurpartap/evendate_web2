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
	 * @param {CurrentUser} user
	 * @constructor
	 * @constructs FriendsListModal
	 * @property {CurrentUser} entity
	 */
	function FriendsListModal(user) {
		if (typeof FriendsListModal.instance === 'object') {
			return FriendsListModal.instance;
		}
		AbstractListModal.call(this, user);
		this.title = 'Подписки на пользователей';
		this.entities = this.entity.friends;
		FriendsListModal.instance = this;
	}
	/**
	 *
	 * @return {jqPromise}
	 */
	FriendsListModal.prototype.uploadEntities = function() {
		var self = this;
		
		return __APP.USER.fetchFriends({length: 20}).done(function(friends) {
			if(friends.length) {
				self.content.append(self.buildEntities(friends));
			} else {
				self.is_upload_disabled = true;
			}
		}).promise();
	};
	/**
	 *
	 * @param {UsersCollection} entities
	 * @return {jQuery}
	 */
	FriendsListModal.prototype.buildEntities = function(entities) {
		var $blocks = __APP.BUILD.avatarBlocks(entities, {
			is_link: true,
			entity: __C.ENTITIES.USER,
			avatar_classes: [__C.CLASSES.SIZES.X40, __C.CLASSES.UNIVERSAL_STATES.ROUNDED]
		});
		bindPageLinks($blocks);
		
		return $blocks;
	};
	
	return FriendsListModal;
}()));