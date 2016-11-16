/**
 * @requires Class.AbstractSidebar.js
 */
/**
 * @class
 * @extends AbstractSidebar
 */
Sidebar = extending(AbstractSidebar, (function () {
	function Sidebar() {
		AbstractSidebar.call(this);
	}
	Sidebar.prototype.init = function () {
		var self = this;
		self.updateSubscriptions();
		$(window).on('subscribe unsubscribe', function() {
			self.updateSubscriptions();
		});
		
		AbstractSidebar.prototype.init.call(this);
	};
	
	Sidebar.prototype.updateSubscriptions = function() {
		var $subscribed_orgs = this.$subscribed_orgs,
			timing = 0,
			current_menu_items = $.map($subscribed_orgs.children(), function(el) {
				return $(el).data('organization_id');
			}),
			to_add = __APP.USER.subscriptions.filter(function(item) {
				return current_menu_items.indexOf(item.id) === -1;
			}),
			to_remove = current_menu_items.filter(function(item) {
				return !(__APP.USER.subscriptions.has(item));
			});
		
		if (to_add.length) {
			__APP.BUILD.organizationItems(to_add, {
				block_classes: ['animated'],
				avatar_classes: ['-size_30x30']
			})
				[($subscribed_orgs.length ? 'prependTo' : 'appendTo')]($subscribed_orgs)
				.each(function(i, org_block) {
					setTimeout(function() {
						$(org_block).addClass('-show');
					}, timing += 100);
				});
			
			bindPageLinks($subscribed_orgs);
		}
		if (to_remove.length) {
			to_remove.forEach(function(id) {
				var $organization_item = $subscribed_orgs.find('.organization_item[data-organization_id="' + id + '"]').removeClass('-show');
				setTimeout(function() {
					$organization_item.remove();
				}, 500);
			});
		}
	};
	
	return Sidebar;
}()));