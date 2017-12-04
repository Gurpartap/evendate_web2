/**
 * @requires Class.AbstractModal.js
 */
/**
 *
 * @class WithdrawModal
 * @extends AbstractModal
 */
WithdrawModal = extending(AbstractModal, (function() {
	/**
	 *
	 * @param {OneOrganization} organization
	 *
	 * @constructor
	 * @constructs WithdrawModal
	 *
	 * @property {OneOrganization} organization
	 */
	function WithdrawModal(organization) {
		AbstractModal.call(this);
		
		this.withdraw = new WithdrawModel();
		this.organization = organization;
	}
	
	/**
	 * @returns WithdrawModal
	 */
	WithdrawModal.prototype.init = function() {
		var self = this;
		
		function requestWithdrawFunds() {
			if (isFormValid(self.content)) {
				self.withdraw.setData(Object.assign({
					created_at: moment().unix(),
					status_type_code: WithdrawModel.STATUS.PENDING,
					user: __APP.USER
				}, self.content.serializeForm()));
				
				self.organization.requestWithdrawFunds(self.withdraw.sum, self.withdraw.comment).then(function() {
					if (__APP.CURRENT_PAGE instanceof AdminOrganizationFinancesPage) {
						__APP.CURRENT_PAGE.appendWithdraw(self.withdraw);
					}
					
					self.destroy();
				});
			}
			
			return false;
		}
		
		this.modal.find('.WithdrawFunds').on('click.WithdrawFunds', requestWithdrawFunds);
		this.content.on('submit', requestWithdrawFunds);
		this.__init();
		
		return this;
	};
	
	/**
	 *
	 * @inheritDoc
	 *
	 * @return {WithdrawModal}
	 */
	WithdrawModal.prototype.render = function(props) {
		this.content = tmpl('modal-withdraw-content', {
			avatar_block: __APP.BUILD.avatarBlocks(__APP.USER, {
				avatar_classes: [
					__C.CLASSES.SIZES.X40,
					__C.CLASSES.UNIVERSAL_STATES.ROUNDED
				]
			}),
			amount_form_unit: __APP.BUILD.formUnit({
				label: 'Сумма',
				name: 'sum',
				type: 'number',
				placeholder: 'Желаемая сумма для вывода',
				required: true
			}),
			comment_form_unit: __APP.BUILD.formUnit({
				label: 'Примечание',
				name: 'comment',
				type: 'textarea',
				helptext: 'Для вашего удобства, можете написать причину вывода средств, либо любую другую служебную информацию.'
			})
		});
		
		this.__render({
			width: 480,
			title: 'Запрос вывода средств на расчетный счет',
			classes: [__C.CLASSES.FLOATING_MATERIAL],
			footer_buttons: __APP.BUILD.button({
				classes: [
					__C.CLASSES.COLORS.MARGINAL,
					__C.CLASSES.HOOKS.RIPPLE,
					'WithdrawFunds'
				],
				title: 'Запросить вывод средств'
			})
		});
		
		return this;
	};
	
	return WithdrawModal;
}()));