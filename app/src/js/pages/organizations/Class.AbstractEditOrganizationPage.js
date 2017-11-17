/**
 * @requires ../Class.Page.js
 */
/**
 *
 * @class AbstractEditOrganizationPage
 * @extends Page
 */
AbstractEditOrganizationPage = extending(Page, (function() {
	/**
	 *
	 * @constructor
	 * @constructs AbstractEditOrganizationPage
	 */
	function AbstractEditOrganizationPage() {
		Page.call(this);
		
		this.organization = new OneOrganization();
		this.categories = new CategoriesCollection();
		this.cities = new CitiesCollection();
		this.state_name = 'admin';
		
		this.fields = new Fields(
			'description',
			'city',
			'site_url',
			'default_address',
			'vk_url',
			'privileges',
			'facebook_url',
			'email'
		);
		
		this.adding_is_over = false;
	}
	
	AbstractEditOrganizationPage.prototype.init = function() {
		var self = this;
		
		function initEditEventPage($view) {
			
			bindSelect2($view);
			bindTabs($view);
			bindLimitInputSize($view);
			bindRippleEffect($view);
			bindFileLoadButton($view);
			ImgLoader.init($view);
			
			$view.find('#add_organization_address').placepicker();
			
			$view.find('#add_organization_submit').off('click.Submit').on('click.Submit', submitEditOrganization);
			
		}
		
		function initCities(selected_id) {
			var $select = self.$wrapper.find('.OrganizationCity');
			
			self.cities.fetchCities(null, 0, 'local_name', function() {
				
				initSelect2($select, {
					tags: self.cities.map(function(city) {
						
						return {
							text: city.local_name,
							id: city.id
						};
					}),
					width: '100%',
					placeholder: 'Выберите или введите город',
					maximumSelectionLength: 1,
					maximumSelectionSize: 1,
					tokenSeparators: [',', ';'],
					containerCssClass: 'form_select2 -select2_no_tags',
					multiple: false
				});
				
				if (selected_id) {
					$select.select2('val', [selected_id]);
				}
			});
		}
		
		function initOrganizationTypes(selected_id) {
			self.categories.fetchCategories({}, 0, function(categories) {
				var $select = self.$wrapper.find('#add_organization_type');
				
				$select.html(tmpl('option', categories.map(function(category) {
					return {
						val: category.id, display_name: category.name
					};
				})));
				initSelect2($select);
				
				if (selected_id) {
					$select.select2('val', selected_id);
				}
			});
		}
		
		function submitEditOrganization() {
			var $form = self.$wrapper.find('#add-organization-form'),
				org_model = new OrganizationModel(),
				form_data = $form.serializeForm(),
				valid_form = formValidation($form, !!(form_data.organization_id)),
				method_name = self.organization.id ? 'updateOrganization' : 'createOrganization',
				$loader;
			
			function formValidation($form, for_edit) {
				var is_valid = true;
				
				$form.find(':required').not(':disabled').each(function() {
					var $this = $(this),
						max_length = $this.data('maxlength');
					
					if ($this.val() === '' || (max_length && $this.val().length > max_length)) {
						if (is_valid) {
							scrollTo($this, 400);
						}
						handleErrorField($this);
						is_valid = false;
					}
				});
				
				if (!for_edit) {
					$form.find('.DataUrl').each(function() {
						var $this = $(this);
						
						if ($this.val() === '') {
							if (is_valid) {
								scrollTo($this, 400, function() {
									showNotifier({text: 'Пожалуйста, добавьте обложку организации', status: false});
								});
							}
							is_valid = false;
						}
					});
				}
				return is_valid;
			}
			
			if (valid_form) {
				self.$wrapper.addClass(__C.CLASSES.STATUS.DISABLED);
				$loader = __APP.BUILD.overlayLoader(self.$view);
				org_model.setData(form_data);
				
				self.organization[method_name](org_model, function() {
					self.adding_is_over = true;
					try {
						sessionStorage.removeItem('organization_info');
					} catch (e) {
					}
					$('.SidebarNav').find('.ContinueRegistration').remove();
					
					socket.emit('utils.registrationFinished', {
						uuid: self.$wrapper.find('#add_organization_organization_registration_uuid').val()
					});
					socket.emit('utils.updateImages');
					
					__APP.changeState('/organization/' + self.organization.id);
				}).always(function() {
					self.$wrapper.removeClass(__C.CLASSES.STATUS.DISABLED);
					$loader.remove();
				});
			}
		}
		
		initEditEventPage(this.$wrapper);
		bindCallModal(this.$wrapper);
		initOrganizationTypes(this.organization.type_id);
		initCities(this.organization.city.id || __APP.USER.selected_city.id);
	};
	
	AbstractEditOrganizationPage.prototype.render = function() {
		if (__APP.USER.isLoggedOut()) {
			var auth_modal = new AuthModal(window.location, {
				note: 'Для выполнения этого действия Вам необходимо авторизоваться через социальную сеть'
			});
			
			auth_modal.is_hidable = false;
			auth_modal.show();
			
			return void(0);
		}
		
		if (!checkRedirect('organization/add', '/add/organization')) {
			return null;
		}
		
		this.renderRest();
		this.init();
	};
	
	AbstractEditOrganizationPage.prototype.renderRest = function(page_vars) {};
	
	return AbstractEditOrganizationPage;
}()));