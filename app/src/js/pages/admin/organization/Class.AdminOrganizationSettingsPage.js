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
			'brand_color_accent',
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
		
		this.render_vars = {
			id: null,
			email: null,
			admin_avatar_blocks: null,
			moderator_avatar_blocks: null,
			private_checkbox: null,
			fb_vk_integration_checkboxes: null,
			facebook_profile: null,
			slack_telegram_integration_checkboxes: null,
			brand_color_field: null,
			brand_color_accent_field: null,
			save_colors_button: null,
			subdomain_radio: null,
			subdomain: null,
			other_domain_radio: null,
			other_domain: null,
			tariff_button: null,
			premium_tariff_help: null,
			tariff_service_info: null
		};
		
		Object.defineProperty(this, 'page_title_obj', {
			get: function() {
				
				return [{
					title: 'Организации',
					page: '/admin'
				}, this.organization.short_name + ' - настройки'];
			}
		});
		
		Object.defineProperties(this.render_vars, {
			id: {
				get: function() {
					
					return self.organization.id;
				}
			},
			email: {
				get: function() {
					
					return self.organization.email;
				}
			}
		});
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
		bindHelpLink(this.$wrapper);
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
		
		(function initSpectrum($wrapper) {
			var $fields = $wrapper.find('.ColorPicker'),
				$brand_color = $fields.filter('.BrandColor'),
				$brand_color_accent = $fields.filter('.BrandAccentColor'),
				options = {
					allowEmpty: true,
					preferredFormat: 'hex',
					showInitial: true,
					showInput: true,
					showButtons: false,
					replacerClassName: '-spectrum_replacer_override',
					containerClassName: '-spectrum_container_override'
				};
			
			function repaint(color, place) {
				var obj = {};
				
				if (color) {
					obj[place] = color.toHexString();
					__APP.repaint(obj);
				} else {
					__APP.setDefaultColors();
				}
			}
			
			$brand_color
				.on('move.spectrum', function(e, color) {
					$brand_color.spectrum('set', color.toHexString());
					repaint(color, 'header');
				})
				.on('change.spectrum', function(e, color) {
					repaint(color, 'header');
				})
				.spectrum(Object.assign({color: $brand_color.val() || __C.COLORS.MUTED}, options));
			
			$brand_color_accent
				.on('move.spectrum', function(e, color) {
					$brand_color_accent.spectrum('set', color.toHexString());
					repaint(color, 'accent');
				})
				.on('change.spectrum', function(e, color) {
					repaint(color, 'accent');
				})
				.spectrum(Object.assign({color: $brand_color_accent.val() || __C.COLORS.ACCENT}, options));
			
		}(this.$wrapper));
	};
	
	AdminOrganizationSettingsPage.prototype.preRender = function() {
		var service_info_string = this.organization.tariff.is_full ? 'Оплачен до {date}' : '';
		
		this.render_vars.admin_avatar_blocks = AdminOrganizationSettingsPage.buildStaffBlock(this.organization.id, this.organization.admins, OneUser.ROLE.ADMIN, this.organization.role);
		
		this.render_vars.moderator_avatar_blocks = AdminOrganizationSettingsPage.buildStaffBlock(this.organization.id, this.organization.moderators, OneUser.ROLE.MODERATOR, this.organization.role);
		
		this.render_vars.private_checkbox = __APP.BUILD.checkbox({
			id: 'org_admin_settings_is_private',
			name: 'is_private',
			label: 'Закрытая организация',
			attributes: {
				checked: this.organization.is_private
			}
		});
		
		this.render_vars.fb_vk_integration_checkboxes = null;
		this.render_vars.facebook_profile = null;
		this.render_vars.slack_telegram_integration_checkboxes = null;
		
		this.render_vars.brand_color_field = __APP.BUILD.formUnit({
			id: 'org_admin_settings_brand_color',
			label: 'Основной фирменный цвет',
			name: 'brand_color',
			classes: ['ColorPicker', 'BrandColor'],
			value: this.organization.brand_color,
			placeholder: __C.COLORS.MUTED
		});
		
		this.render_vars.brand_color_accent_field = __APP.BUILD.formUnit({
			id: 'org_admin_settings_brand_color_accent',
			label: 'Акцентирующий фирменный цвет',
			name: 'brand_color_accent',
			classes: ['ColorPicker', 'BrandAccentColor'],
			value: this.organization.brand_color_accent,
			placeholder: __C.COLORS.ACCENT
		});
		
		this.render_vars.save_colors_button = __APP.BUILD.button({
			title: 'Сохранить',
			classes: [
				__C.CLASSES.COLORS.ACCENT,
				__C.CLASSES.HOOKS.RIPPLE,
				'SaveLocal'
			]
		});
		
		this.render_vars.subdomain_radio = __APP.BUILD.radio({
			id: 'org_admin_settings_subdomain_enabled',
			name: 'domains'
		});
		
		this.render_vars.subdomain = null;
		
		this.render_vars.other_domain_radio = __APP.BUILD.radio({
			id: 'org_admin_settings_other_domain_enabled',
			name: 'domains'
		});
		
		this.render_vars.other_domain = null;
		
		this.render_vars.tariff_button = __APP.BUILD.button({
			title: 'Оплатить',
			classes: [__C.CLASSES.COLORS.ACCENT, __C.CLASSES.HOOKS.RIPPLE, 'ActivatePayment']
		});
		
		this.render_vars.premium_tariff_help = __APP.BUILD.helpLink(HelpCenterConnection.ARTICLE.PREMIUM_TARIFF, 'Что дает premium подписка');
		
		this.render_vars.tariff_service_info = service_info_string.format({
			date: moment.unix(this.organization.tariff.till).calendar(null, {
				sameDay: '[Сегодня]',
				nextDay: '[Завтра]',
				nextWeek: 'D MMMM YYYY',
				lastWeek: 'D MMMM YYYY',
				sameElse: 'D MMMM YYYY'
			})
		});
	};
	
	AdminOrganizationSettingsPage.prototype.render = function() {
		this.renderHeaderTabs();
		
		this.$wrapper.html(tmpl('admin-organization-settings-page', this.render_vars));
		
		this.init();
	};
	
	AdminOrganizationSettingsPage.prototype.destroy = function() {
		if (__APP.IS_REPAINTED) {
			__APP.setDefaultColors();
		}
		this.$view.off('staff:add');
	};
	
	return AdminOrganizationSettingsPage;
}()));