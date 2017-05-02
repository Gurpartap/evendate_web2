/**
 * @requires Class.AdminPage.js
 */
/**
 *
 * @class AdminOrganizationsPage
 * @extends AdminPage
 */
AdminOrganizationsPage = extending(AdminPage, (function() {
	/**
	 *
	 * @constructor
	 * @constructs AdminOrganizationsPage
	 */
	function AdminOrganizationsPage() {
		AdminPage.call(this);
		
		this.is_upload_disabled = false;
		this.block_scroll = false;
		this.my_organizations_fields = new Fields('img_medium_url', 'subscribed_count', 'staff');
		this.page_title = 'Организации';
		this.my_organizations = new OrganizationsCollection();
	}
	
	/**
	 *
	 * @param {(OrganizationsCollection|Array<OneOrganization>)} organizations
	 * @return {jQuery}
	 */
	AdminOrganizationsPage.buildMyOrganizationsBlocks = function(organizations) {
		return tmpl('statistics-overview-organization', organizations.map(function(org) {
			
			var avatars_max_count = 2,
				org_roles = [
					{
						name: OneUser.ROLE.ADMIN,
						title: 'Администраторы',
						staff: org.admins,
						plural_name: OneUser.ROLE.ADMIN + 's_block'
					}, {
						name: OneUser.ROLE.MODERATOR,
						title: 'Модераторы',
						staff: org.moderators,
						plural_name: OneUser.ROLE.MODERATOR + 's_block'
					}
				];
			
			return $.extend(true, {}, org, {
				subscribers: org.subscribed_count + getUnitsText(org.subscribed_count, __LOCALES.ru_RU.TEXTS.SUBSCRIBERS),
				buttons: __APP.BUILD.link({
					title: 'Редактировать',
					classes: ['button', 'fa_icon', 'fa-pencil', '-color_neutral', 'RippleEffect'],
					page: '/admin/organization/' + org.id + '/edit'
				}, {
					title: 'Создать событие',
					classes: ['button', 'fa_icon', 'fa-plus', '-color_accent', 'RippleEffect'],
					page: '/add/event/to/' + org.id
				})
			}, org_roles.reduce(function(obj, role) {
				obj[role.plural_name] = __APP.BUILD.avatarCollection(role.staff.map(function(staff) {
					return $.extend({}, staff, {
						is_link: true,
						avatar_classes: ['-size_100x100', '-rounded']
					});
				}), avatars_max_count, {
					dataset: {
						modal_type: 'editors',
						modal_specific_role: role.name,
						modal_title: role.title,
						modal_organization_id: org.id
					},
					classes: ['-size_30x30', '-rounded', '-shifted', 'CallModal'],
					counter_classes: ['-size_30x30','-color_marginal_primary']
				});
				
				return obj;
			}, {}));
		}));
	};
	
	AdminOrganizationsPage.prototype.fetchData = function() {
		return this.fetching_data_defer = this.my_organizations.fetchMyOrganizations([OneUser.ROLE.ADMIN, OneUser.ROLE.MODERATOR], this.my_organizations_fields, 10, '');
	};
	
	AdminOrganizationsPage.prototype.bindOrganizationsEvents = function($parent) {
		trimAvatarsCollection($parent);
		bindPageLinks($parent);
		__APP.MODALS.bindCallModal($parent);
		bindRippleEffect($parent);
		return $parent;
	};
	
	AdminOrganizationsPage.prototype.init = function() {
		var PAGE = this;
		
		this.bindOrganizationsEvents(this.$wrapper);
		
		
		$(window).on('scroll.uploadOrganizations', function() {
			var $loader,
				$wrapper,
				$organizations;
			
			if (isScrollRemain(200) && !PAGE.is_upload_disabled && !PAGE.block_scroll) {
				PAGE.block_scroll = true;
				$wrapper = PAGE.$wrapper.find('.StatOverviewOrganizations');
				$loader = __APP.BUILD.loaderBlock($wrapper);
				
				PAGE.my_organizations.fetchMyOrganizations([OneUser.ROLE.ADMIN, OneUser.ROLE.MODERATOR], PAGE.my_organizations_fields, 10, '', function(organizations) {
					PAGE.block_scroll = false;
					$loader.remove();
					$organizations = AdminOrganizationsPage.buildMyOrganizationsBlocks(organizations);
					if (organizations.length) {
						$wrapper.append($organizations);
						PAGE.bindOrganizationsEvents($organizations);
					} else {
						PAGE.is_upload_disabled = true;
					}
				});
			}
		});
	};
	
	AdminOrganizationsPage.prototype.render = function() {
		if(__APP.USER.id === -1){
			__APP.changeState('/feed/actual', true, true);
			return null;
		}
		this.$wrapper.html(tmpl('statistics-overview-wrapper', {
			organizations: AdminOrganizationsPage.buildMyOrganizationsBlocks(this.my_organizations)
		}));
		this.init();
	};
	
	AdminOrganizationsPage.prototype.destroy = function() {
		$(window).off('scroll.uploadOrganizations');
	};
	
	return AdminOrganizationsPage;
}()));