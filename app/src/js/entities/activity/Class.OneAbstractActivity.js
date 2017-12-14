/**
 * @requires ../Class.OneEntity.js
 */
/**
 * @abstract
 * @class OneAbstractActivity
 * @extends OneEntity
 */
OneAbstractActivity = extending(OneEntity, (function() {
	/**
	 *
	 * @constructs OneAbstractActivity
	 */
	function OneAbstractActivity() {
		this.stat_type_id = null;
		this.user_id = null;
		this.user = new OneUser(this.user_id);
		this.entity = '';
		/**
		 *
		 * @type {OneAbstractActivity.TYPES}
		 */
		this.type_code = '';
		this.created_at = 0;
	}
	OneAbstractActivity.prototype.ID_PROP_NAME = 'uuid';
	
	OneAbstractActivity.factory = function(data) {
		let entity;
		
		switch (true) {
			case !isVoid(data.event_id): {
				entity = new OneEventActivity();
				break;
			}
			case !isVoid(data.organization_id): {
				entity = new OneOrganizationActivity();
				break;
			}
			default: {
				entity = new OneAbstractDispatch();
				break;
			}
		}
		
		entity.setData(data);
		
		return entity;
	};
	/**
	 * @const
	 * @enum {string}
	 */
	OneAbstractActivity.TYPES = Object.freeze({
		SUBSCRIBE: 'subscribe',
		FAVE: 'fave',
		UNSUBSCRIBE: 'unsubscribe',
		UNFAVE: 'unfave',
		SHARE_VK: 'share_vk',
		SHARE_FB: 'share_fb',
		SHARE_TW: 'share_tw'
	});
	/**
	 * @const
	 * @enum {string}
	 */
	OneAbstractActivity.TYPES_INDEX = Object.freeze({
		subscribe: 'SUBSCRIBE',
		fave: 'FAVE',
		unsubscribe: 'UNSUBSCRIBE',
		unfave: 'UNFAVE',
		share_vk: 'SHARE',
		share_fb: 'SHARE',
		share_tw: 'SHARE'
	});

	
	return OneAbstractActivity;
}()));