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
	}
	
	return OneEventActivity;
}()));