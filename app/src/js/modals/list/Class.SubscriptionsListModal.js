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
	 * @return {jqPromise}
	 */
	SubscriptionsListModal.prototype.uploadEntities = function() {
		var self = this;
		
		return this.entity.fetchSubscriptions({length: 20}).done(function(organizations) {
			if(organizations.length) {
				self.content.append(self.buildEntities(organizations));
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