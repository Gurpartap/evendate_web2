/**
 * @requires Class.AdminOrganizationPage.js
 */
/**
 *
 * @class AdminOrganizationSettingsPage
 * @extends AdminOrganizationPage
 */
AdminOrganizationSettingsPage = extending(AdminOrganizationPage, (function() {
	/**
	 *
	 * @param {(string|number)} org_id
	 * @constructor
	 * @constructs AdminOrganizationSettingsPage
	 */
	function AdminOrganizationSettingsPage(org_id) {
		AdminOrganizationPage.call(this, org_id);
	}
	
	AdminOrganizationSettingsPage.prototype.fetchData = function() {
		return this.fetching_data_defer = this.organization.fetchOrganization(new Fields(
			'email',
			'privileges',
			'staff'
		));
	};
	
	AdminOrganizationSettingsPage.prototype.init = function() {
		var self = this;
		
		bindCallModal(this.$wrapper);
		/*
		this.$wrapper.find('.'+__C.CLASSES.HOOKS.ADD_STAFF).on('click', function() {
		
		});*/
		
		this.$view.on('staff:add', function(e, role, staff) {
			self.$wrapper.find('.StaffCollection').filter(function(i, elem) {
				return $(elem).data('staff_type') === role;
			}).children('.'+__C.CLASSES.HOOKS.ADD_STAFF).before(__APP.BUILD.avatarBlocks(staff, {
				is_link: true,
				avatar_classes: [__C.CLASSES.SIZES.X40, __C.CLASSES.UNIVERSAL_STATES.ROUNDED]
			}));
		});
	};
	
	AdminOrganizationSettingsPage.prototype.render = function() {
		var self = this,
			staffs_additional_fields = {
				is_link: true,
				avatar_classes: [__C.CLASSES.SIZES.X40, __C.CLASSES.UNIVERSAL_STATES.ROUNDED]
			};
		
		this.renderHeaderTabs();
		
		__APP.changeTitle([{
			title: 'Организации',
			page: '/admin'
		}, this.organization.short_name + ' - настройки']);
		
		this.$wrapper.html(tmpl('admin-organization-settings-page', $.extend({}, this.organization, {
			admin_avatar_blocks: __APP.BUILD.avatarBlocks(this.organization.admins, staffs_additional_fields)
			                          .add(__APP.BUILD.addUserAvatarBlock(OneUser.ROLE.ADMIN, {avatar_classes: [__C.CLASSES.SIZES.X40, __C.CLASSES.UNIVERSAL_STATES.ROUNDED]})),
			moderator_avatar_blocks: __APP.BUILD.avatarBlocks(this.organization.moderators, staffs_additional_fields)
			                              .add(__APP.BUILD.addUserAvatarBlock(OneUser.ROLE.MODERATOR, {avatar_classes: [__C.CLASSES.SIZES.X40, __C.CLASSES.UNIVERSAL_STATES.ROUNDED]}))
		})));
		
		this.init();
	};
	
	AdminOrganizationSettingsPage.prototype.destroy = function() {
		this.$view.off('staff:add');
	};
	
	return AdminOrganizationSettingsPage;
}()));