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
			'site_url',
			'default_address',
			'vk_url',
			'facebook_url',
			'email'
		);
		
		this.adding_is_over = false;
	}
	
	AbstractEditOrganizationPage.prototype.init = function() {
		var PAGE = this;
		
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
			var $select = PAGE.$wrapper.find('#add_organization_city');
			
			PAGE.cities.fetchCities(null, 0, 'local_name', function() {
				$select
					.append(tmpl('option', PAGE.cities.map(function(city) {
						return {
							val: city.id,
							display_name: city.local_name
						};
					})))
					.select2({
						containerCssClass: 'form_select2',
						dropdownCssClass: 'form_select2_drop'
					});
				if (selected_id) {
					$select.select2('val', selected_id);
				}
			});
		}
		
		function initOrganizationTypes(selected_id) {
			PAGE.categories.fetchCategories({}, 0, function(categories) {
				var $select = PAGE.$wrapper.find('#add_organization_type');
				
				$select
					.html(tmpl('option', categories.map(function(category) {
						return {
							val: category.id,
							display_name: category.name
						};
					})))
					.select2({
						containerCssClass: 'form_select2',
						dropdownCssClass: 'form_select2_drop'
					});
				if (selected_id) {
					$select.select2('val', selected_id);
				}
			});
		}
		
		function submitEditOrganization() {
			var $form = PAGE.$wrapper.find("#add-organization-form"),
				org_model = new OrganizationModel(),
				form_data = $form.serializeForm(),
				valid_form = formValidation($form, !!(form_data.organization_id)),
				method_name = PAGE.organization.id ? 'updateOrganization' : 'createOrganization',
				$loader;
			
			function formValidation($form, for_edit) {
				var is_valid = true,
					$times = $form.find('#edit_event_different_time').prop('checked') ? $form.find('[class^="TableDay_"]') : $form.find('.MainTime');
				
				$form.find(':required').not(':disabled').each(function() {
					var $this = $(this),
						max_length = $this.data('maxlength');
					if ($this.val() === "" || (max_length && $this.val().length > max_length)) {
						if (is_valid) {
							$('body').stop().animate({scrollTop: Math.ceil($this.offset().top - 150)}, 1000, 'swing');
						}
						handleErrorField($this);
						is_valid = false;
					}
				});
				
				$times.each(function() {
					var $row = $(this),
						start = $row.find('.StartHours').val() + $row.find('.StartMinutes').val(),
						end = $row.find('.EndHours').val() + $row.find('.EndMinutes').val();
					if (start > end) {
						if (is_valid) {
							$('body').stop().animate({scrollTop: Math.ceil($row.offset().top - 150)}, 1000, 'swing');
						}
						showNotifier({text: 'Начальное время не может быть меньше конечного', status: false});
						is_valid = false;
					}
				});
				
				if (!for_edit) {
					$form.find('.DataUrl').each(function() {
						var $this = $(this);
						if ($this.val() === "") {
							if (is_valid) {
								$('body').stop().animate({scrollTop: Math.ceil($this.closest('.EditEventImgLoadWrap').offset().top - 150)}, 1000, 'swing', function() {
									showNotifier({text: 'Пожалуйста, добавьте обложку организации', status: false})
								});
							}
							is_valid = false;
						}
					});
				}
				return is_valid;
			}
			
			if (valid_form) {
				PAGE.$wrapper.addClass(__C.CLASSES.STATUS.DISABLED);
				$loader = __APP.BUILD.overlayLoader(PAGE.$view);
				org_model.setData(form_data);
				
				PAGE.organization[method_name](org_model, function() {
					PAGE.adding_is_over = true;
					try {
						sessionStorage.removeItem('organization_info');
					} catch (e) {}
					$('.SidebarNav').find('.ContinueRegistration').remove();
					
					socket.emit('utils.registrationFinished', {
						uuid: PAGE.$wrapper.find('#add_organization_organization_registration_uuid').val()
					});
					socket.on('utils.updateImagesDone', function() {
						PAGE.$wrapper.removeClass(__C.CLASSES.STATUS.DISABLED);
						$loader.remove();
						__APP.changeState('/organization/' + PAGE.organization.id);
					});
					socket.emit('utils.updateImages');
				});
			}
		}
		
		initEditEventPage(this.$wrapper);
		bindCallModal(this.$wrapper);
		initOrganizationTypes(this.organization.type_id);
		initCities(this.organization.city_id || __APP.USER.selected_city.id);
	};
	
	AbstractEditOrganizationPage.prototype.render = function() {
		
		if (!checkRedirect('organization/add', '/add/organization')) {
			return null;
		}
		
		this.renderRest();
		this.init();
	};
	
	AbstractEditOrganizationPage.prototype.renderRest = function(page_vars) {};
	
	return AbstractEditOrganizationPage;
}()));