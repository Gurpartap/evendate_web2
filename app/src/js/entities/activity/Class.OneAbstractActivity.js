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
		this.stat_type_id = 0;
		this.user_id = 0;
		this.user = new OneAbstractUser(this.user_id);
		this.entity = '';
		/**
		 *
		 * @type {OneAbstractActivity.TYPES}
		 */
		this.type_code = '';
		this.created_at = 0;
	}
	/**
	 * @const
	 * @enum {string}
	 */
	OneAbstractActivity.TYPES = {
		SUBSCRIBE: 'subscribe',
		FAVE: 'fave',
		UNSUBSCRIBE: 'unsubscribe',
		UNFAVE: 'unfave',
		SHARE_VK: 'share_vk',
		SHARE_FB: 'share_fb',
		SHARE_TW: 'share_tw'
	};
	Object.freeze(OneAbstractActivity.TYPES);
	/**
	 * @const
	 * @enum {string}
	 */
	OneAbstractActivity.TYPES_INDEX = {
		subscribe: 'SUBSCRIBE',
		fave: 'FAVE',
		unsubscribe: 'UNSUBSCRIBE',
		unfave: 'UNFAVE',
		share_vk: 'SHARE',
		share_fb: 'SHARE',
		share_tw: 'SHARE'
	};
	Object.freeze(OneAbstractActivity.TYPES_INDEX);

	
	return OneAbstractActivity;
}()));