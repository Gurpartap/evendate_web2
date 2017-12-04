/**
 * @requires Class.AbstractListModal.js
 */
/**
 * @class
 * @extends AbstractListModal
 */
SubscriptionsListModal = extending(AbstractListModal, (function() {
	/**
	 *
	 * @param {OneUser} user
	 * @constructor
	 * @constructs SubscriptionsListModal
	 * @property {OneUser} entity
	 */
	function SubscriptionsListModal(user) {
		AbstractListModal.call(this, user);
		this.title = 'Подписки на организации';
		this.entities = this.entity.subscriptions;
	}
	/**
	 *
	 * @return {Promise}
	 */
	SubscriptionsListModal.prototype.uploadEntities = function() {
		
		return this.entity.fetchSubscriptions({length: 20}).then(organizations => {
			if (organizations.length) {
				this.content.append(this.buildEntities(organizations));
			} else {
				this.is_upload_disabled = true;
			}
		});
	};
	/**
	 *
	 * @param {UsersCollection} entities
	 * @return {jQuery}
	 */
	SubscriptionsListModal.prototype.buildEntities = function(entities) {
		var $blocks = __APP.BUILD.avatarBlocks(entities, {
			is_link: true,
			entity: __C.ENTITIES.ORGANIZATION,
			avatar_classes: [__C.CLASSES.SIZES.X40, __C.CLASSES.UNIVERSAL_STATES.ROUNDED]
		});
		bindPageLinks($blocks);
		
		return $blocks;
	};
	
	return SubscriptionsListModal;
}()));