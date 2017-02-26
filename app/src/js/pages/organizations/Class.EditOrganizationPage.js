/**
 * @requires ../Class.Page.js
 */
/**
 *
 * @constructor
 * @augments Page
 * @param {(string|number)} [organization_id]
 */
function EditOrganizationPage(organization_id) {
	Page.apply(this);
	this.page_title = 'Редактировать организацию';
	this.organization = new OneOrganization(organization_id);
	this.categories = new CategoriesCollection();
	this.state_name = 'edit_organization';
	
	this.fields = [
		'description',
		'site_url',
		'default_address',
		'vk_url',
		'facebook_url',
		'email'
	];
}
EditOrganizationPage.extend(Page);

EditOrganizationPage.prototype.fetchData = function() {
	if (this.organization.id) {
		return this.fetching_data_defer = this.organization.fetchOrganization(this.fields);
	}
	return Page.prototype.fetchData.call(this);
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
		
		
		$view.find('#add_organization_submit').off('click.Submit').on('click.Submit', submitEditOrganization);
		
	}
	
	function initOrganizationTypes(selected_id) {
		PAGE.categories.fetchCategories({}, 0, function(data) {
			var $wrapper = $view.find('.EditEventOrganizations'),
				organizations_options = $(),
				$select = $wrapper.find('#add_organization_type');
			
			data.forEach(function(organization) {
				organizations_options = organizations_options.add(tmpl('option', {
					val: organization.id,
					display_name: organization.name
				}));
			});
			
			$select.append(organizations_options).select2({
				containerCssClass: 'form_select2',
				dropdownCssClass: 'form_select2_drop'
			});
			if (selected_id) {
				$select.select2('val', selected_id);
			}
			if (organizations_options.length > 1) {
				$wrapper.removeClass('-hidden');
			} else {
				$wrapper.addClass('-hidden');
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
            socket.emit('utils.registrationFinished', additional_fields);
            socket.on('utils.updateImagesDone', function() {
				window.location.href = '/organization/' + PAGE.organization.id;
			});
			socket.emit('utils.updateImages');
		}
		
		var $form = $view.find("#add-organization-form"),
			data = {
				organization_id: null,
				name: null,
				short_name: null,
				type_id: null,
				background_filename: null,
				logo_filename: null,
				default_address: null,
				location: null,
				description: null,
				site_url: null,
				vk_url: null,
				facebook_url: null,
				email: null,
				filenames: {
					background: null,
					logo: null
				}
			},
			form_data = $form.serializeForm(),
			valid_form = formValidation($form, !!(form_data.organization_id));
		
		if (valid_form) {
			$.extend(true, data, form_data);
			
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
			local_storage = JSON.parse(window.localStorage.getItem('organization_info'));
		} catch (e) {
			local_storage = {}
		}
		
		additional_fields = $.extend({
			header_text: 'Новый организатор'
		}, local_storage, true);
		
		cookies.removeItem('open_add_organization', '/');
		window.localStorage.removeItem('organization_info');
		
		$wrapper.html(tmpl('add-organization-page', additional_fields));
		initEditEventPage($view);
		__APP.MODALS.bindCallModal($view);
		initOrganizationTypes();
	} else {
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
		
		initEditEventPage($view);
		initOrganizationTypes(additional_fields.type_id);
		
		__APP.MODALS.bindCallModal($view);
		
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
};