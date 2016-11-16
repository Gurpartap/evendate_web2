/**
 * @requires Class.StatisticsPage.js
 */
/**
 *
 * @constructor
 * @augments StatisticsPage
 */
function StatisticsOverviewPage() {
	StatisticsPage.apply(this);
	this.my_organizations_fields = ['img_medium_url', 'subscribed_count', 'staff'];
	this.page_title = 'Организации';
	this.is_loading = true;
	this.my_organizations = new OrganizationsCollection();
	this.my_organizations.fetchMyOrganizations('admin', this.my_organizations_fields, 10, '', Page.triggerRender);
}
StatisticsOverviewPage.extend(StatisticsPage);

StatisticsOverviewPage.buildMyOrganizationsBlocks = function(organizations) {
	return tmpl('statistics-overview-organization', organizations.map(function(org) {
		var avatars_max_count = 2,
			staff_additional_fields = {
				is_link: true,
				avatar_classes: ['-size_100x100', '-rounded']
			},
			org_roles = [
				{
					name: OneUser.ROLE.ADMIN,
					title: 'Администраторы',
					staff: UsersCollection.getSpecificStaff(OneUser.ROLE.ADMIN, org.staff, staff_additional_fields),
					plural_name: OneUser.ROLE.ADMIN + 's'
				}, {
					name: OneUser.ROLE.MODERATOR,
					title: 'Модераторы',
					staff: UsersCollection.getSpecificStaff(OneUser.ROLE.MODERATOR, org.staff, staff_additional_fields),
					plural_name: OneUser.ROLE.MODERATOR + 's'
				}
			],
			staffs_fields = {
				classes: ['-size_30x30', '-rounded', 'CallModal'],
				dataset: {
					modal_type: 'editors',
					modal_organization_id: org.id
				}
			};
		org_roles.forEach(function(role) {
			org[role.plural_name] = __APP.BUILD.avatarCollection(role.staff, avatars_max_count, $.extend(true, {}, staffs_fields, {
				dataset: {
					modal_specific_role: role.name,
					modal_title: role.title
				}
			}));
			
			org[role.plural_name + '_plus_count'] = role.staff.length - avatars_max_count;
			org[role.plural_name + '_plus_count_hidden'] = org[role.plural_name + '_plus_count'] <= 0 ? '-cast' : '';
		});
		return $.extend(true, {}, org, {
			subscribers: org.subscribed_count + getUnitsText(org.subscribed_count, __LOCALES.ru_RU.TEXTS.SUBSCRIBERS),
			buttons: __APP.BUILD.link({
				title: 'Редактировать',
				classes: ['button', 'fa_icon', 'fa-pencil', '-color_neutral', 'RippleEffect'],
				page: '/organization/' + org.id + '/edit'
			}, {
				title: 'Создать событие',
				classes: ['button', 'fa_icon', 'fa-plus', '-color_accent', 'RippleEffect'],
				page: '/event/add_to/' + org.id
			})
		});
	}));
};

StatisticsOverviewPage.prototype.bindOrganizationsEvents = function($parent) {
	trimAvatarsCollection($parent);
	bindPageLinks($parent);
	__APP.MODALS.bindCallModal($parent);
	bindRippleEffect($parent);
	return $parent;
};

StatisticsOverviewPage.prototype.bindUploadOnScroll = function() {
	var PAGE = this,
		$window = $(window),
		scrollEvent = function() {
			if ($window.height() + $window.scrollTop() + 200 >= $(document).height() && !PAGE.disable_upload) {
				$window.off('scroll.uploadOrganizations');
				PAGE.my_organizations.fetchMyOrganizations('admin', PAGE.my_organizations_fields, 10, '', function(organizations) {
					if (organizations.length) {
						PAGE.$wrapper.find('.StatOverviewOrganizations').append(PAGE.bindOrganizationsEvents(StatisticsOverviewPage.buildMyOrganizationsBlocks(organizations)));
						$window.on('scroll.uploadOrganizations', scrollEvent);
					} else {
						PAGE.disable_upload = true;
					}
				});
			}
		};
	
	if (!PAGE.disable_upload) {
		$window.on('scroll.uploadOrganizations', scrollEvent);
	}
};

StatisticsOverviewPage.prototype.init = function() {
	this.bindOrganizationsEvents(this.$wrapper);
	this.bindUploadOnScroll();
};

StatisticsOverviewPage.prototype.render = function() {
	this.$wrapper.html(tmpl('statistics-overview-wrapper', {
		organizations: StatisticsOverviewPage.buildMyOrganizationsBlocks(this.my_organizations)
	}));
	this.init();
};

StatisticsOverviewPage.prototype.destroy = function() {
	$(window).off('scroll.uploadOrganizations');
};