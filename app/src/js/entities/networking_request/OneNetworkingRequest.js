/**
 * @requires ../Class.OneEntity.js
 */
/**
 * @class OneNetworkingRequest
 * @extends OneEntity
 *
 * @property {?string} uuid
 * @property {?number} sender_user_id
 * @property {?number} recipient_user_id
 * @property {?string} message
 * @property {?boolean} status
 * @property {?boolean} accept_status
 * @property {?timestamp} accepted_at
 * @property {?timestamp} created_at
 * @property {?timestamp} updated_at
 */
class OneNetworkingRequest extends OneEntity {
	constructor(uuid) {
		super();
		
		this.uuid = setDefaultValue(uuid, null);
		this.sender_user_id = null;
		this.recipient_user_id = null;
		this.message = null;
		this.status = null;
		this.accept_status = null;
		this.accepted_at = null;
		this.created_at = null;
		this.updated_at = null;
	}
	
}