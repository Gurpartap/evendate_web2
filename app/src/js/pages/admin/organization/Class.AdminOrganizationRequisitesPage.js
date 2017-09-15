/**
 * @requires Class.AdminOrganizationPage.js
 */
/**
 *
 * @class AdminOrganizationRequisitesPage
 * @extends AdminOrganizationPage
 */
AdminOrganizationRequisitesPage = extending(AdminOrganizationPage, (function() {
	/**
	 *
	 * @constructor
	 * @constructs AdminOrganizationRequisitesPage
	 */
	function AdminOrganizationRequisitesPage(org_id) {
		AdminOrganizationPage.call(this, org_id);
		
		Object.defineProperty(this, 'page_title_obj', {
			get: function() {
				
				return [{
					title: 'Организации',
					page: '/admin'
				}, this.organization.short_name + ' - реквизиты'];
			}
		});
	}
	
	AdminOrganizationRequisitesPage.prototype.init = function() {
		var self = this,
			$legal_company_name = this.$wrapper.find('.LegalEntityCompanyNameInput'),
			$legal_inn = this.$wrapper.find('.LegalEntityInnInput'),
			$legal_kpp = this.$wrapper.find('.LegalEntityKppInput'),
			$legal_address = this.$wrapper.find('.LegalEntityAddressInput'),
			$legal_bank_name = this.$wrapper.find('.LegalEntityBankNameInput'),
			$legal_bic = this.$wrapper.find('.LegalEntityBikInput'),
			$legal_correspondent_account = this.$wrapper.find('.LegalEntityCorrespondentAccountInput'),
			$person_bank_name = this.$wrapper.find('.NaturalPersonBankNameInput'),
			$person_bic = this.$wrapper.find('.NaturalPersonBikInput'),
			$person_correspondent_account = this.$wrapper.find('.NaturalPersonCorrespondentAccountInput');
		
		bindTabs(this.$wrapper);
		
		this.$wrapper.find('.Tabs').on('tabs:change', function() {
			var $bodies = $(this).find('.TabsBody');
			
			$bodies.not('.'+__C.CLASSES.ACTIVE).prop('disabled', true);
			$bodies.filter('.'+__C.CLASSES.ACTIVE).prop('disabled', false);
		});
		
		$legal_company_name.on('input.ToggleCompanyInfo', function() {
			var $this = $(this);
			
			if ($this.val().trim() !== '') {
				self.$wrapper.find('.CompanyAdditionalInfo').removeClass(__C.CLASSES.HIDDEN);
				$this.off('input.ToggleCompanyInfo');
			}
		});
		
		$legal_company_name.add($legal_inn).suggestions({
			token: __C.API_TOKENS.DADATA,
			type: 'PARTY',
			count: 5,
			onSelect: function(suggestion) {
				$legal_company_name.val(suggestion.unrestricted_value).trigger('change');
				if (!suggestion.data) {
					return void 0;
				}
				$legal_inn.val(suggestion.data.inn).trigger('change');
				$legal_kpp.val(suggestion.data.kpp).trigger('change');
				
				if (suggestion.data.address) {
					$legal_address.val(suggestion.data.address.value).trigger('change');
				}
			}
		});
		
		$legal_bank_name.on('input.ToggleBankInfo', function() {
			var $this = $(this);
			
			if ($this.val().trim() !== '') {
				self.$wrapper.find('.LegalEntityBankAdditionalInfo').removeClass(__C.CLASSES.HIDDEN);
				$this.off('input.ToggleBankInfo');
			}
		});
		
		$legal_bank_name.add($legal_bic).suggestions({
			token: __C.API_TOKENS.DADATA,
			type: 'BANK',
			count: 5,
			onSelect: function(suggestion) {
				$legal_bank_name.val(suggestion.unrestricted_value).trigger('change');
				if (!suggestion.data) {
					return void 0;
				}
				$legal_bic.val(suggestion.data.bic).trigger('change');
				$legal_correspondent_account.val(suggestion.data.correspondent_account).trigger('change');
			}
		});
		
		$person_bank_name.on('input.ToggleBankInfo', function() {
			var $this = $(this);
			
			if ($this.val().trim() !== '') {
				self.$wrapper.find('.NaturalPersonBankAdditionalInfo').removeClass(__C.CLASSES.HIDDEN);
				$this.off('input.ToggleBankInfo');
			}
		});
		
		$person_bank_name.add($person_bic).suggestions({
			token: __C.API_TOKENS.DADATA,
			type: 'BANK',
			count: 5,
			onSelect: function(suggestion) {
				$person_bank_name.val(suggestion.unrestricted_value).trigger('change');
				if (!suggestion.data) {
					
					return void 0;
				}
				$person_bic.val(suggestion.data.bic).trigger('change');
				$person_correspondent_account.val(suggestion.data.correspondent_account).trigger('change');
			}
		});
		
		this.render_vars.submit_button.on('click.Submit', function() {
			var $form = self.$wrapper.find('.RequisitesForm'),
				form_data;
			
			if (isFormValid($form)) {
				form_data = self.gatherSendData();
				console.log(form_data);
			}
		});
	};
	
	AdminOrganizationRequisitesPage.prototype.gatherSendData = function() {
		
		return this.$wrapper.find('.RequisitesForm').serializeForm();
	};
	
	AdminOrganizationRequisitesPage.prototype.preRender = function() {
		
		this.render_vars.l_company_form_field = __APP.BUILD.formUnit({
			label: 'Название компании',
			id: 'legal_entity_requisites_company_name',
			name: 'company_name',
			classes: 'LegalEntityCompanyNameInput',
			placeholder: 'Начните вводить чтобы появились предложения',
			helptext: 'Полное наименование организации, включая форму предприятия',
			required: true
		});
		
		this.render_vars.l_inn_form_field = __APP.BUILD.formUnit({
			label: 'ИНН',
			id: 'legal_entity_requisites_inn',
			name: 'company_inn',
			classes: 'LegalEntityInnInput',
			placeholder: 'Попробуйте найти организацию через ИНН',
			helptext: '10 или 12 знаков в зависимости от организационной формы',
			required: true,
			attributes: {
				maxlength: 12
			}
		});
		
		this.render_vars.l_kpp_form_field = __APP.BUILD.formUnit({
			label: 'КПП',
			id: 'legal_entity_requisites_kpp',
			name: 'company_kpp',
			classes: 'LegalEntityKppInput',
			helptext: '9 знаков, если у вас нет КПП - поставьте прочерк',
			required: true,
			attributes: {
				maxlength: 9
			}
		});
		
		this.render_vars.l_real_address_form_field = __APP.BUILD.formUnit({
			label: 'Юридический адрес',
			id: 'legal_entity_requisites_real_address',
			name: 'company_address',
			classes: 'LegalEntityAddressInput',
			helptext: 'Например: 150000, Россия, Москыв, ул. Ленина, д. 108, корп. 1, кв. 8',
			required: true
		});
		
		this.render_vars.l_bank_name_form_field = __APP.BUILD.formUnit({
			label: 'Наименование банка',
			id: 'legal_entity_requisites_bank_name',
			name: 'bank_name',
			classes: 'LegalEntityBankNameInput',
			placeholder: 'Начните вводить чтобы появились предложения',
			helptext: 'Полное наименование банка, включая отделение (если есть)',
			required: true
		});
		
		this.render_vars.l_bic_form_field = __APP.BUILD.formUnit({
			label: 'БИК',
			id: 'legal_entity_requisites_bic',
			name: 'bank_bik',
			classes: 'LegalEntityBikInput',
			placeholder: 'Попробуйте найти банк через БИК',
			helptext: '9 знаков',
			required: true,
			attributes: {
				maxlength: 9
			}
		});
		
		this.render_vars.l_correspondent_account_form_field = __APP.BUILD.formUnit({
			label: 'Корреспондентский счет',
			id: 'legal_entity_requisites_correspondent_account',
			name: 'bank_correspondent_account',
			classes: 'LegalEntityCorrespondentAccountInput',
			helptext: '20 знаков',
			required: true,
			attributes: {
				maxlength: 20
			},
			inputmask: {
			
			}
		});
		
		this.render_vars.l_checking_account_form_field = __APP.BUILD.formUnit({
			label: 'Расчетный счет',
			id: 'legal_entity_requisites_checking_account',
			name: 'bank_payment_account',
			helptext: '20 знаков',
			required: true,
			attributes: {
				maxlength: 20
			}
		});
		
		this.render_vars.l_signer_name_form_field = __APP.BUILD.formUnit({
			label: 'ФИО подписывающего лица',
			id: 'legal_entity_requisites_signer_name',
			name: 'signer_full_name',
			helptext: 'ФИО лица, подписывающего договор (полностью). Например, Иванов Иван Иванович',
			required: true
		});
		
		this.render_vars.l_signer_position_form_field = __APP.BUILD.formUnit({
			label: 'Должность подписывающего лица',
			id: 'legal_entity_requisites_signer_position',
			name: 'signer_position',
			helptext: 'Должность директора или ответственного лица, подписывающего договор',
			required: true
		});
		
		this.render_vars.l_self_name_form_field = __APP.BUILD.formUnit({
			label: 'Ваши имя и фамилия',
			id: 'legal_entity_requisites_self_name',
			name: 'contact_full_name',
			value: __APP.USER.full_name,
			required: true
		});
		
		this.render_vars.l_self_email_form_field = __APP.BUILD.formUnit({
			label: 'Ваш e-mail',
			id: 'legal_entity_requisites_self_email',
			name: 'contact_email',
			value: __APP.USER.email,
			helptext: 'На него мы вышлем заполненный договор',
			required: true
		});
		
		this.render_vars.l_self_phone_form_field = __APP.BUILD.formUnit({
			label: 'Контактный телефон',
			id: 'legal_entity_requisites_self_phone',
			name: 'contact_phone_number',
			helptext: 'В формате: +7 (xxx) xxx-xx-xx',
			required: true
		});
		
		
		
		this.render_vars.n_self_name_form_field = __APP.BUILD.formUnit({
			label: 'Ваши имя и фамилия',
			id: 'natural_person_requisites_self_name',
			name: 'contact_full_name',
			value: __APP.USER.full_name,
			required: true
		});
		
		this.render_vars.n_inn_form_field = __APP.BUILD.formUnit({
			label: 'ИНН',
			id: 'natural_person_requisites_inn',
			name: 'company_inn',
			classes: 'LegalEntityInnInput',
			placeholder: 'ИНН',
			helptext: '12 знаков. Если у вас нет ИНН, оставьте поле пустым',
			attributes: {
				maxlength: 12
			}
		});
		
		this.render_vars.n_id_number_field = __APP.BUILD.formUnit({
			label: 'Серия и номер паспорта',
			name: 'id_number',
			placeholder: 'Серия и номер',
			helptext: 'Например, 1234 123456',
			required: true
		});
		
		this.render_vars.n_id_when_field = __APP.BUILD.formUnit({
			label: 'Когда выдан паспорт',
			name: 'id_when',
			type: 'date',
			required: true,
			dataset: {
				max_date: moment().format(__C.DATE_FORMAT)
			}
		});
		
		this.render_vars.n_id_who_field = __APP.BUILD.formUnit({
			label: 'Кем выдан паспорт',
			name: 'id_who',
			helptext: 'Например, ОВД Алексеевского района города Москвы',
			required: true
		});
		
		this.render_vars.n_register_address_field = __APP.BUILD.formUnit({
			label: 'Адрес регистрации',
			name: 'register_address',
			helptext: 'Например: 150000, Россия, Москыв, ул. Ленина, д. 108, корп. 1, кв. 8',
			required: true
		});
		
		this.render_vars.n_post_address_field = __APP.BUILD.formUnit({
			label: 'Почтновый адрес',
			name: 'post_address',
			helptext: 'Например: 150000, Россия, Москыв, ул. Ленина, д. 108, корп. 1, кв. 8',
			required: true
		});
		
		this.render_vars.n_bank_name_form_field = __APP.BUILD.formUnit({
			label: 'Наименование банка',
			name: 'bank_name',
			classes: 'NaturalPersonBankNameInput',
			placeholder: 'Начните вводить чтобы появились предложения',
			helptext: 'Полное наименование банка, включая отделение (если есть)',
			required: true
		});
		
		this.render_vars.n_bic_form_field = __APP.BUILD.formUnit({
			label: 'БИК',
			name: 'bank_bik',
			classes: 'NaturalPersonBikInput',
			placeholder: 'Попробуйте найти банк через БИК',
			helptext: '9 знаков',
			required: true,
			attributes: {
				maxlength: 9
			}
		});
		
		this.render_vars.n_correspondent_account_form_field = __APP.BUILD.formUnit({
			label: 'Корреспондентский счет',
			name: 'bank_correspondent_account',
			classes: 'NaturalPersonCorrespondentAccountInput',
			helptext: '20 знаков',
			required: true,
			attributes: {
				maxlength: 20
			},
			inputmask: {}
		});
		
		this.render_vars.n_checking_account_form_field = __APP.BUILD.formUnit({
			label: 'Расчетный счет',
			name: 'bank_payment_account',
			helptext: '20 знаков',
			required: true,
			attributes: {
				maxlength: 20
			}
		});
		
		this.render_vars.n_self_email_form_field = __APP.BUILD.formUnit({
			label: 'Контактрый e-mail',
			name: 'contact_email',
			value: __APP.USER.email,
			helptext: 'В формате john@doe.com',
			required: true
		});
		
		this.render_vars.n_self_phone_form_field = __APP.BUILD.formUnit({
			label: 'Контактный телефон',
			name: 'contact_phone_number',
			helptext: 'В формате: +7 (xxx) xxx-xx-xx',
			required: true
		});
		
		this.render_vars.submit_button = __APP.BUILD.button({
			title: 'Сохранить',
			classes: [
				__C.CLASSES.SIZES.HUGE,
				__C.CLASSES.COLORS.NEUTRAL_ACCENT
			]
		});
		
	};
	
	AdminOrganizationRequisitesPage.prototype.render = function() {
	
		this.$wrapper.html(tmpl('admin-organization-requisites-page', this.render_vars));
		this.init();
	};
	
	return AdminOrganizationRequisitesPage;
}()));