/**
 * @requires ../Class.Page.js
 */
/**
 *
 * @class EditOrganizationPage
 * @extends Page
 */
EditOrganizationPage = extending(Page, (function() {
	/**
	 *
	 * @param {(string|number)} [organization_id]
	 * @constructor
	 * @constructs EditOrganizationPage
	 */
	function EditOrganizationPage(organization_id) {
		Page.apply(this);
		this.page_title = 'Редактировать организацию';
		this.organization = new OneOrganization(organization_id);
		this.categories = new CategoriesCollection();
		this.cities = new CitiesCollection();
		this.state_name = 'edit_organization';
		
		this.fields = [
			'description',
			'site_url',
			'default_address',
			'vk_url',
			'facebook_url',
			'email'
		];
		
		this.adding_is_over = false;
	}
	
	EditOrganizationPage.prototype.fetchData = function() {
		var cities_promise = this.cities.fetchCities(null, 0, 'local_name');
		
		if (this.organization.id) {
			return this.fetching_data_defer = __APP.SERVER.multipleAjax(cities_promise, this.organization.fetchOrganization(this.fields));
		}
		
		return this.fetching_data_defer = cities_promise;
	};
	
	EditOrganizationPage.prototype.render = function() {
		var PAGE = this,
			$view = this.$view,
			$wrapper = this.$wrapper,
			organization_id = this.organization.id,
			additional_fields,
			local_storage;
		
		if(__APP.USER.id === -1){
			__APP.changeState('/feed/actual', true, true);
			return null;
		}
		if(window.location.pathname.contains('organization/add')){
			__APP.changeState('/add/organization', true, true);
			return null;
		}
		
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
			var $select = $view.find('#add_organization_city');
			
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
		}
		
		function initOrganizationTypes(selected_id) {
			PAGE.categories.fetchCategories({}, 0, function(categories) {
				var $select = $view.find('#add_organization_type');
				
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
			
			function afterSubmit() {
				PAGE.adding_is_over = true;
				try {
					sessionStorage.removeItem('organization_info');
				} catch (e) {}
				$('.SidebarNav').find('.ContinueRegistration').remove();
				
				socket.emit('utils.registrationFinished', additional_fields);
				socket.on('utils.updateImagesDone', function() {
					window.location.href = '/organization/' + PAGE.organization.id;
				});
				socket.emit('utils.updateImages');
			}
			
			var $form = $view.find("#add-organization-form"),
				data = new OrganizationModel(),
				form_data = $form.serializeForm(),
				valid_form = formValidation($form, !!(form_data.organization_id));
			
			if (valid_form) {
				data.setData(form_data);
				
				data.filenames = {
					background: data.background_filename,
					logo: data.logo_filename
				};
				
				if (PAGE.organization.id) {
					PAGE.organization.updateOrganization(data, afterSubmit);
				} else {
					PAGE.organization.createOrganization(data, afterSubmit);
				}
				
				
			}
			
		}
		
		
		if (!organization_id) {
			try {
				local_storage = JSON.parse(sessionStorage.getItem('organization_info') ? sessionStorage.getItem('organization_info') : localStorage.getItem('organization_info'));
				sessionStorage.removeItem('organization_info');
			} catch (e) {
				local_storage = {}
			}
			
			additional_fields = $.extend({
				header_text: 'Новый организатор'
			}, local_storage, true);
			
			$wrapper.html(tmpl('add-organization-page', additional_fields));
		} else {
			this.adding_is_over = true;
			additional_fields = $.extend(true, {}, this.organization);
			
			additional_fields.header_text = 'Редактирование организации';
			
			if (additional_fields.background_img_url) {
				additional_fields.background_filename = additional_fields.background_img_url.split('/').reverse()[0];
			}
			if (additional_fields.img_url) {
				additional_fields.logo_filename = additional_fields.img_url.split('/').reverse()[0];
			}
			
			$.extend(true, additional_fields, additional_fields);
			$wrapper.html(tmpl('add-organization-page', additional_fields));
			
			
			if (additional_fields.img_url) {
				toDataUrl(additional_fields.img_url, function(base64_string) {
					$view.find('#add_organization_img_src').val(base64_string ? base64_string : null);
				});
			}
			if (additional_fields.background_img_url) {
				toDataUrl(additional_fields.background_img_url, function(base64_string) {
					$view.find('#add_organization_background_src').val(base64_string ? base64_string : null);
				});
			}
		}
		
		initEditEventPage($view);
		__APP.MODALS.bindCallModal($view);
		initOrganizationTypes(additional_fields.type_id);
		initCities(additional_fields.city_id || __APP.USER.selected_city.id);
	};
	
	EditOrganizationPage.prototype.destroy = function() {
		var data = this.$wrapper.find('#add-organization-form').serializeForm(),
			$sidebar_nav = $('.SidebarNav');
		
		if (!this.adding_is_over) {
			if (!$sidebar_nav.find('.ContinueRegistration').length) {
				$sidebar_nav.prepend(__APP.BUILD.link({
					page: '/add/organization',
					title: 'Продолжить регистрацию',
					classes: ['sidebar_navigation_item', 'SidebarNavItem', 'ContinueRegistration']
				}));
				bindPageLinks($sidebar_nav);
			}
			try {
				sessionStorage.setItem('organization_info', JSON.stringify({
					city_id: data.city_id,
					type_id: data.type_id,
					name: data.name,
					short_name: data.short_name,
					email: data.email,
					site_url: data.site_url,
					default_address: data.default_address,
					description: data.description,
					facebook_url: data.facebook_url,
					vk_url: data.vk_url
				}));
			} catch (e) {}
		}
	};
	
	return EditOrganizationPage;
}()));