/**
 * @requires Class.OrderPage.js
 */
/**
 *
 * @class LegalEntityPayment
 * @extends Page
 */
LegalEntityPayment = extending(Page, (function() {
	/**
	 *
	 * @param {(number|string)} event_id
	 * @param {(number|string)} uuid
	 *
	 * @constructor
	 * @constructs LegalEntityPayment
	 *
	 * @property {OneExtendedOrder} order
	 * @property {OneEvent} event
	 */
	function LegalEntityPayment(event_id, uuid) {
		var self = this;
		
		Page.call(this);
		
		try {
			this.order_info = JSON.parse(window.localStorage.getItem(event_id + '_order_info'));
		} catch (e) {
			this.order_info = {};
		}
		
		this.order = new OneExtendedOrder(event_id, uuid);
		this.order_fields = new Fields('sum');
		
		this.render_vars = {
			event_info: null,
			receivers_form_field: null,
			company_form_field: null,
			inn_form_field: null,
			kpp_form_field: null,
			real_address_form_field: null,
			post_address_form_field: null,
			bank_name_form_field: null,
			bic_form_field: null,
			correspondent_account_form_field: null,
			checking_account_form_field: null,
			signer_name_form_field: null,
			signer_position_form_field: null,
			self_name_form_field: null,
			self_email_form_field: null,
			self_phone_form_field: null
		};
		
		this.$submit_button = $();
		
		Object.defineProperties(this, {
			event: {
				get: function() {
					
					return self.order.event;
				}
			},
			page_title: {
				get: function() {
					
					return 'Оплата участия на событие ' + self.event.title + ' от юридического лица';
				}
			}
		});
	}
	
	LegalEntityPayment.prototype.fetchData = function() {
		
		return this.fetching_data_defer = this.order.fetchOrder(this.order_fields);
	};
	
	LegalEntityPayment.prototype.init = function() {
		var self = this,
			$company_name = this.$wrapper.find('.CompanyNameInput'),
			$inn = this.$wrapper.find('.InnInput'),
			$kpp = this.$wrapper.find('.KppInput'),
			$address = this.$wrapper.find('.AddressInput'),
			$bank_name = this.$wrapper.find('.BankNameInput'),
			$bic = this.$wrapper.find('.BikInput'),
			$correspondent_account = this.$wrapper.find('.CorrespondentAccountInput');
		
		$company_name.on('input.ToggleCompanyInfo', function() {
			if ($(this).val().trim() !== '') {
				self.$wrapper.find('.CompanyAdditionalInfo').removeClass(__C.CLASSES.HIDDEN);
			}
		});
		
		$company_name.add($inn).suggestions({
			token: __C.API_TOKENS.DADATA,
			type: 'PARTY',
			count: 5,
			onSelect: function(suggestion) {
				$company_name.val(suggestion.unrestricted_value).trigger('change');
				if (!suggestion.data) {
					return void 0;
				}
				$inn.val(suggestion.data.inn).trigger('change');
				$kpp.val(suggestion.data.kpp).trigger('change');
				
				if (suggestion.data.address) {
					$address.val(suggestion.data.address.value).trigger('change');
				}
			}
		});
		
		$bank_name.on('input.ToggleBankInfo', function() {
			if ($(this).val().trim() !== '') {
				self.$wrapper.find('.BankAdditionalInfo').removeClass(__C.CLASSES.HIDDEN);
			}
		});
		
		$bank_name.add($bic).suggestions({
			token: __C.API_TOKENS.DADATA,
			type: 'BANK',
			count: 5,
			onSelect: function(suggestion) {
				$bank_name.val(suggestion.unrestricted_value).trigger('change');
				if (!suggestion.data) {
					return void 0;
				}
				$bic.val(suggestion.data.bic).trigger('change');
				$correspondent_account.val(suggestion.data.correspondent_account).trigger('change');
			}
		});
		
		this.$submit_button.on('click.SubmitForm', function() {
			var $form = self.$wrapper.find('.LegalEntityPaymentForm');
			
			if (isFormValid($form)) {
				self.order.makeLegalEntityPayment($form.serializeForm()).done(function() {
					window.localStorage.removeItem(self.event.id + '_order_info');
					showNotifier({text: 'Форма отправлена успешно<br>' +
					                    'В скором времени на указанную почту придет договор-счет для оплаты от юрлица', status: true});
					
					if (self.order_info['away_to']) {
						window.location = self.order_info['away_to']
					} else {
						__APP.changeState('/event/' + self.event.id);
					}
				});
			}
			
		});
		
	};
	
	
	LegalEntityPayment.prototype.preRender = function() {
		
		this.render_vars.event_info = __APP.BUILD.fields([
			{
				name: 'Название события:',
				value: this.event.title
			}, {
				name: 'Дата события:',
				value: displayDateRange(this.event.first_event_date, this.event.last_event_date)
			}, {
				name: 'Сумма платежа:',
				value: formatCurrency(this.order.sum) + ' руб.'
			}
		]);
		
		this.render_vars.receivers_form_field = __APP.BUILD.formUnit({
			label: 'Перечислите ФИО участников от компании',
			id: 'legal_entity_payment_receivers',
			name: 'participants',
			type: 'textarea',
			helptext: 'По одному участнику на каждой строке',
			required: true
		});
		
		this.render_vars.company_form_field = __APP.BUILD.formUnit({
			label: 'Название компании',
			id: 'legal_entity_payment_company_name',
			name: 'company_name',
			classes: 'CompanyNameInput',
			placeholder: 'Начните вводить чтобы появились предложения',
			helptext: 'Полное наименование организации, включая форму предприятия',
			required: true
		});
		
		this.render_vars.inn_form_field = __APP.BUILD.formUnit({
			label: 'ИНН',
			id: 'legal_entity_payment_inn',
			name: 'company_inn',
			classes: 'InnInput',
			placeholder: 'Попробуйте найти организацию через ИНН',
			helptext: '10 или 12 знаков в зависимости от организационной формы',
			required: true,
			attributes: {
				maxlength: 12
			}
		});
		
		this.render_vars.kpp_form_field = __APP.BUILD.formUnit({
			label: 'КПП',
			id: 'legal_entity_payment_kpp',
			name: 'company_kpp',
			classes: 'KppInput',
			helptext: '9 знаков, если у вас нет КПП - поставьте прочерк',
			required: true,
			attributes: {
				maxlength: 9
			}
		});
		
		this.render_vars.real_address_form_field = __APP.BUILD.formUnit({
			label: 'Юридический адрес',
			id: 'legal_entity_payment_real_address',
			name: 'company_address',
			classes: 'AddressInput',
			helptext: 'Например: 150000, Россия, Москыв, ул. Ленина, д. 108, корп. 1, кв. 8',
			required: true
		});
		
		this.render_vars.bank_name_form_field = __APP.BUILD.formUnit({
			label: 'Наименование банка',
			id: 'legal_entity_payment_bank_name',
			name: 'bank_name',
			classes: 'BankNameInput',
			placeholder: 'Начните вводить чтобы появились предложения',
			helptext: 'Полное наименование банка, включая отделение (если есть)',
			required: true
		});
		
		this.render_vars.bic_form_field = __APP.BUILD.formUnit({
			label: 'БИК',
			id: 'legal_entity_payment_bic',
			name: 'bank_bik',
			classes: 'BikInput',
			placeholder: 'Попробуйте найти банк через БИК',
			helptext: '9 знаков',
			required: true,
			attributes: {
				maxlength: 9
			}
		});
		
		this.render_vars.correspondent_account_form_field = __APP.BUILD.formUnit({
			label: 'Корреспондентский счет',
			id: 'legal_entity_payment_correspondent_account',
			name: 'bank_correspondent_account',
			classes: 'CorrespondentAccountInput',
			helptext: '20 знаков',
			required: true,
			attributes: {
				maxlength: 20
			},
			inputmask: {
			
			}
		});
		
		this.render_vars.checking_account_form_field = __APP.BUILD.formUnit({
			label: 'Расчетный счет',
			id: 'legal_entity_payment_checking_account',
			name: 'bank_payment_account',
			helptext: '20 знаков',
			required: true,
			attributes: {
				maxlength: 20
			}
		});
		
		this.render_vars.signer_name_form_field = __APP.BUILD.formUnit({
			label: 'ФИО подписывающего лица',
			id: 'legal_entity_payment_signer_name',
			name: 'signer_full_name',
			helptext: 'ФИО лица, подписывающего договор (полностью). Например, Иванов Иван Иванович',
			required: true
		});
		
		this.render_vars.signer_position_form_field = __APP.BUILD.formUnit({
			label: 'Должность подписывающего лица',
			id: 'legal_entity_payment_signer_position',
			name: 'signer_position',
			helptext: 'Должность директора или ответственного лица, подписывающего договор',
			required: true
		});
		
		this.render_vars.self_name_form_field = __APP.BUILD.formUnit({
			label: 'Ваши имя и фамилия',
			id: 'legal_entity_payment_self_name',
			name: 'contact_full_name',
			value: __APP.USER.full_name,
			required: true
		});
		
		this.render_vars.self_email_form_field = __APP.BUILD.formUnit({
			label: 'Ваш e-mail',
			id: 'legal_entity_payment_self_email',
			name: 'contact_email',
			value: __APP.USER.email,
			helptext: 'На него мы вышлем заполненный договор',
			required: true
		});
		
		this.render_vars.self_phone_form_field = __APP.BUILD.formUnit({
			label: 'Контактный телефон',
			id: 'legal_entity_payment_self_phone',
			name: 'contact_phone_number',
			helptext: 'В формате: +7 (xxx) xxx-xx-xx',
			required: true
		});
		
		this.render_vars.submit_button = this.$submit_button = __APP.BUILD.button({
			classes: [
				__C.CLASSES.SIZES.HUGE,
				__C.CLASSES.COLORS.ACCENT,
			  'LegalEntityPaymentSubmit'
			],
			title: 'Отправить'
		});
		
	};
	
	
	LegalEntityPayment.prototype.render = function() {
		if (empty(this.order_info)) {
			//return __APP.changeState('/event/'+this.event.id+'/order');
		}
		
		if (__APP.USER.isLoggedOut()) {
			return (new AuthModal(window.location.href, false)).show();
		}
		this.preRender();
		
		this.$wrapper.html(tmpl('legal-entity-payment-page', this.render_vars));
		
		this.init();
	};
	
	return LegalEntityPayment;
}()));