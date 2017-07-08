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
	 *
	 * @property {OneOrganization} organization
	 */
	function AdminOrganizationSettingsPage(org_id) {
		var self = this;
		
		AdminOrganizationPage.call(this, org_id);
		
		this.organization_fields = new Fields(
			'city',
			'country',
			'default_address',
			'description',
			'brand_color',
			'is_private',
			'email',
			'privileges',
			'staff',
			'site_url', {
				tariff: {
					fields: new Fields(
						'till',
						'available_additional_notifications',
						'available_event_publications',
						'available_tickets_selling',
						'available_telegram_bots',
						'available_slack_bots',
						'available_auditory_analytics',
						'available_in_city',
						'price'
					)
				}
			}
		);
	}
	
	/**
	 *
	 * @param {(string|number)} org_id
	 * @param {(OneUser|UsersCollection|Array)} staff
	 * @param {OneUser.ROLE} role
	 * @param {OneUser.ROLE} user_role
	 *
	 * @returns {jQuery}
	 */
	AdminOrganizationSettingsPage.buildStaffBlock = function(org_id, staff, role, user_role) {
		return __APP.BUILD.staffAvatarBlocks(org_id, staff, {
			is_link: true,
			avatar_classes: [__C.CLASSES.SIZES.X40, __C.CLASSES.UNIVERSAL_STATES.ROUNDED]
		}, user_role === OneUser.ROLE.ADMIN).add(__APP.BUILD.addUserAvatarBlock(org_id, role, {
			avatar_classes: [__C.CLASSES.SIZES.X40, __C.CLASSES.UNIVERSAL_STATES.ROUNDED]
		}));
	};
	/**
	 *
	 * @returns {jqPromise}
	 */
	AdminOrganizationSettingsPage.prototype.updateOrganizationData = function() {
		return this.organization.updateOrganization(new OrganizationModel(this.organization));
	};
	
	AdminOrganizationSettingsPage.prototype.init = function() {
		var self = this;
		
		bindCallModal(this.$wrapper);
		bindRippleEffect(this.$wrapper);
		
		this.$wrapper.find('#org_admin_settings_is_private').on('change', function() {
			self.organization.is_private = $(this).prop('checked');
			self.updateOrganizationData();
		});
		
		this.$wrapper.find('.SaveLocal').on('click', function() {
			self.organization.setData($(this).closest('.SaveLocalWrapper').serializeForm());
			self.updateOrganizationData();
		});
		
		this.$view.on('staff:add', function(e, role, staff) {
			var $staff_collection = self.$wrapper.find('.StaffCollection');
			
			self.organization.staff.remove(staff.id);
			self.organization.staff.setData(staff);
			$staff_collection.find('.User'+staff.id).remove();
			$staff_collection.filter(function(i, elem) {
				return $(elem).data('staff_type') === role;
			}).children('.'+__C.CLASSES.HOOKS.ADD_STAFF).before(__APP.BUILD.avatarBlocks(staff, {
				is_link: true,
				avatar_classes: [__C.CLASSES.SIZES.X40, __C.CLASSES.UNIVERSAL_STATES.ROUNDED]
			}));
			
			bindPageLinks($staff_collection);
		});
		
		this.$wrapper.find('.ActivatePayment').on('click', function() {
			Payment.payForTariff(self.organization.id, function(data) {
				Payment.doPayment(data.uuid, data.sum);
			});
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
			admin_avatar_blocks: AdminOrganizationSettingsPage.buildStaffBlock(this.organization.id, this.organization.admins, OneUser.ROLE.ADMIN, this.organization.role),
			moderator_avatar_blocks: AdminOrganizationSettingsPage.buildStaffBlock(this.organization.id, this.organization.moderators, OneUser.ROLE.MODERATOR, this.organization.role),
			private_checkbox: __APP.BUILD.checkbox({
				id: 'org_admin_settings_is_private',
				name: 'is_private',
				label: 'Закрытая организация',
				attributes: {
					checked: self.organization.is_private
				}
			}),
			subdomain_radio: __APP.BUILD.radio({
				id: 'org_admin_settings_subdomain_enabled',
				name: 'domains'
			}),
			other_domain_radio: __APP.BUILD.radio({
				id: 'org_admin_settings_other_domain_enabled',
				name: 'domains'
			}),
			tariff_button: __APP.BUILD.button({
				title: 'Оплатить',
				classes: [__C.CLASSES.COLORS.ACCENT, __C.CLASSES.HOOKS.RIPPLE, 'ActivatePayment']
			}),
			tariff_service_info: !self.organization.tariff.is_full ? '' : 'Оплачен до ' + moment.unix(self.organization.tariff.till).calendar(null, {
				sameDay: '[Сегодня]',
				nextDay: '[Завтра]',
				nextWeek: 'D MMMM YYYY',
				lastWeek: 'D MMMM YYYY',
				sameElse: 'D MMMM YYYY'
			})
		})));
		
		this.init();
	};
	
	AdminOrganizationSettingsPage.prototype.destroy = function() {
		this.$view.off('staff:add');
	};
	
	return AdminOrganizationSettingsPage;
}()));