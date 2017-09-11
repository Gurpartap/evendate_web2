/**
 * @requires ../../entities/Class.OneEntity.js
 */
/**
 *
 * @class WithdrawModel
 * @extends OneEntity
 */
WithdrawModel = extending(OneEntity, (function() {
	/**
	 *
	 * @constructor
	 * @constructs WithdrawModel
	 *
	 * @property {?number} id
	 * @property {?number} sum
	 * @property {?number} user_id
	 * @property {OneUser} user
	 * @property {?number} organization_id
	 * @property {?string} comment
	 * @property {?string} response
	 * @property {?number} number
	 * @property {?WithdrawModel.STATUS} status_type_code
	 * @property {?string} status_description
	 * @property {?timestamp} created_at
	 * @property {?timestamp} updated_at
	 */
	function WithdrawModel() {
		OneEntity.call(this);
		
		this.id = null;
		this.sum = null;
		this.user_id = null;
		this.user = new OneUser(this.user_id);
		this.organization_id = null;
		this.comment = null;
		this.response = null;
		this.number = null;
		this.status_type_code = null;
		
		this.created_at = null;
		this.updated_at = null;
		
		Object.defineProperty(this, 'status_description', {
			get: function() {
				
				return getByValue(this.status_type_code, WithdrawModel.STATUS, WithdrawModel.STATUS_DESCRIPTION);
			}
		});
	}
	
	/**
	 *
	 * @enum {string}
	 */
	WithdrawModel.STATUS = {
		PENDING: 'pending',
		IN_PROGRESS: 'in_progress',
		BANK_CHARGING: 'bank_charging',
		COMPLETED: 'completed',
		REJECTED: 'rejected',
		REJECTED_BY_ORGANIZATION: 'rejected_by_organization'
	};
	/**
	 *
	 * @enum {string}
	 */
	WithdrawModel.STATUS_DESCRIPTION = {
		PENDING: 'Ожидает обработки',
		IN_PROGRESS: 'Обрабатывается',
		BANK_CHARGING: 'Отправлено в банк на исполнение',
		COMPLETED: 'Выполнено',
		REJECTED: 'Отказано',
		REJECTED_BY_ORGANIZATION: 'Отозвано организаторов'
	};
	
	return WithdrawModel;
}()));