/**
 * @requires Class.OneAbstractActivity.js
 */
/**
 * @class OneEventActivity
 * @extends OneAbstractActivity
 */
OneEventActivity = extending(OneAbstractActivity, (function() {
	/**
	 *
	 * @constructs OneEventActivity
	 */
	function OneEventActivity() {
		OneAbstractActivity.call(this);
		this.event_id = 0;
		this.event = new OneEvent(this.event_id);
		
		Object.defineProperty(this, 'uuid', {
			get() {
				
				return CryptoJS.MD5([
					this.user_id,
					this.event_id,
					this.type_code,
					this.entity,
					this.created_at
				].join('-')).toString();
			}
		});
	}
	
	return OneEventActivity;
}()));