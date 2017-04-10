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
		AdminPage.apply(this);
		this.my_organizations_fields = ['img_medium_url', 'subscribed_count', 'staff'];
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
		return this.fetching_data_defer = this.my_organizations.fetchMyOrganizations('admin', this.my_organizations_fields, 10, '');
	};
	
	AdminOrganizationsPage.prototype.bindOrganizationsEvents = function($parent) {
		trimAvatarsCollection($parent);
		bindPageLinks($parent);
		__APP.MODALS.bindCallModal($parent);
		bindRippleEffect($parent);
		return $parent;
	};
	
	AdminOrganizationsPage.prototype.bindUploadOnScroll = function() {
		var PAGE = this,
			$window = $(window),
			scrollEvent = function() {
				if ($window.height() + $window.scrollTop() + 200 >= $(document).height() && !PAGE.is_upload_disabled) {
					$window.off('scroll.uploadOrganizations');
					PAGE.my_organizations.fetchMyOrganizations('admin', PAGE.my_organizations_fields, 10, '', function(organizations) {
						var $organizations = AdminOrganizationsPage.buildMyOrganizationsBlocks(PAGE.my_organizations.last_pushed);
						if (PAGE.my_organizations.last_pushed.length) {
							PAGE.$wrapper.find('.StatOverviewOrganizations').append($organizations);
							PAGE.bindOrganizationsEvents($organizations);
							$window.on('scroll.uploadOrganizations', scrollEvent);
						} else {
							PAGE.is_upload_disabled = true;
						}
					});
				}
			};
		
		if (!PAGE.is_upload_disabled) {
			$window.on('scroll.uploadOrganizations', scrollEvent);
		}
	};
	
	AdminOrganizationsPage.prototype.init = function() {
		this.bindOrganizationsEvents(this.$wrapper);
		this.bindUploadOnScroll();
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