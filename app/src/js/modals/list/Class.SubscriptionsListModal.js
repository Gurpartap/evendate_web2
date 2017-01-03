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
	 * @constructs SubscriptionsListModal
	 */
	function SubscriptionsListModal(user) {
		AbstractListModal.call(this);
		this.title = 'Подписки на организации';
		AbstractListModal.call(this, user);
		this.entities = this.entity.subscriptions;
	}
	
	SubscriptionsListModal.prototype.uploadEntities = function() {
		var self = this;
		if(!this.block_scroll){
			this.block_scroll = true;
			return this.entity.fetchSubscriptions({length: 20}).done(function(organizations) {
				if(organizations.length) {
					self.block_scroll = false;
					self.$entities_wrapper.append(self.buildEntities(organizations));
				}
			});
		}
		return $.Deferred().resolve().promise();
	};
	
	SubscriptionsListModal.prototype.buildEntities = function(entities) {
		var $blocks = __APP.BUILD.avatarBlocks(entities, {
			is_link: true,
			entity: 'organization',
			avatar_classes: ['-size_40x40', '-rounded']
		});
		bindPageLinks($blocks);
		return $blocks;
	};
	
	return SubscriptionsListModal;
}()));