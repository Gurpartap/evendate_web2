/**
 * @requires ../Class.OneEntity.js
 */
/**
 *
 * @abstract
 * @class OneAbstractDispatch
 * @extends OneEntity
 */
OneAbstractDispatch = extending(OneEntity, (function() {
	/**
	 *
	 * @param {string} [uuid]
	 *
	 * @constructor
	 * @constructs OneAbstractDispatch
	 *
	 * @property {?string} uuid
	 * @property {?number} creator_id
	 * @property {?number} owner_organization_id
	 * @property {?boolean} is_email
	 * @property {?boolean} is_push
	 * @property {?boolean} is_sms
	 * @property {?string} title
	 * @property {?string} subject
	 * @property {?string} message_text
	 * @property {?string} url
	 * @property {?string} notification_time
	 * @property {?boolean} is_active
	 * @property {?boolean} done
	 * @property {?timestamp} created_at
	 * @property {?timestamp} updated_at
	 */
	function OneAbstractDispatch(uuid) {
		OneEntity.call(this);
		
		this.uuid = setDefaultValue(uuid, null);
		this.creator_id = null;
		this.owner_organization_id = null;
		this.is_email = null;
		this.is_push = null;
		this.is_sms = null;
		this.title = null;
		this.subject = null;
		this.message_text = null;
		this.url = null;
		this.notification_time = null;
		this.is_active = null;
		this.done = null;
		this.created_at = null;
		this.updated_at = null;
	}
	
	OneAbstractDispatch.ENDPOINT = Object.freeze({
		DISPATCHES: '/broadcasts',
		DISPATCH: '/broadcasts/{uuid}'
	});
	
	/**
	 *
	 * @param {object} data
	 *
	 * @return {OneAbstractDispatch}
	 */
	OneAbstractDispatch.factory = function(data) {
		var dispatch = new OneAbstractDispatch();
		
		switch (true) {
			case !isVoid(data.organization_id): {
				dispatch = new OneOrganizationDispatch();
				break;
			}
			case !isVoid(data.event_id): {
				dispatch = new OneEventDispatch();
				break;
			}
		}
		
		dispatch.setData(data);
		
		return dispatch;
	};
	
	OneAbstractDispatch.convertToPostObject = function(data) {
		
		return {
			is_email: data.is_email,
			is_push: data.is_push,
			is_sms: data.is_sms,
			is_active: data.is_active,
			title: data.title,
			subject: data.subject,
			message_text: data.message_text,
			notification_time: data.notification_time
		};
	};
	
	OneAbstractDispatch.prototype.convertToPostObject = function(data) {
		
		return OneAbstractDispatch.convertToPostObject(data);
	};
	/**
	 *
	 * @param {string} uuid
	 * @param {Fields} [fields]
	 *
	 * @return {jqPromise}
	 */
	OneAbstractDispatch.fetchDispatch = function(uuid, fields) {
		
		return __APP.SERVER.getData(OneAbstractDispatch.ENDPOINT.DISPATCH.format({uuid: uuid}), {
			fields: fields
		});
	};
	/**
	 *
	 * @param {Object} data
	 *
	 * @return {jqPromise}
	 */
	OneAbstractDispatch.createDispatch = function(data) {
		
		return __APP.SERVER.addData(OneAbstractDispatch.ENDPOINT.DISPATCHES, data);
	};
	/**
	 *
	 * @param {string} uuid
	 * @param {Object} data
	 *
	 * @return {jqPromise}
	 */
	OneAbstractDispatch.updateDispatch = function(uuid, data) {
		
		return __APP.SERVER.updateData(OneAbstractDispatch.ENDPOINT.DISPATCH.format({uuid: uuid}), data);
	};
	/**
	 *
	 * @param {Fields} [fields]
	 *
	 * @return {jqPromise}
	 */
	OneAbstractDispatch.prototype.fetch = function(fields) {
		
		return OneAbstractDispatch.fetchDispatch(this.uuid, fields).then(function(data) {
			
			return OneAbstractDispatch.factory(data instanceof Array ? data[0] : data);
		});
	};
	/**
	 *
	 * @return {jqPromise}
	 */
	OneAbstractDispatch.prototype.save = function() {
		if (isVoid(this.uuid)) {
			
			return OneAbstractDispatch.createDispatch(this.convertToPostObject(this));
		}
		
		return OneAbstractDispatch.updateDispatch(this.uuid, this.convertToPostObject(this));
	};
	
	return OneAbstractDispatch;
}()));