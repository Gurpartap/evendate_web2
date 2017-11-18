/**
 * @requires Class.OneAbstractDispatch.js
 */
/**
 *
 * @class OneEventDispatch
 * @extends OneAbstractDispatch
 */
OneEventDispatch = extending(OneAbstractDispatch, (function() {
	/**
	 *
	 * @param {string} [uuid]
	 * @param {number} [event_id]
	 *
	 * @constructor
	 * @constructs OneEventDispatch
	 *
	 * @property {OneEvent} event
	 * @property {?number} event_id
	 */
	function OneEventDispatch(uuid, event_id) {
		OneAbstractDispatch.call(this, uuid);
		
		this.event_id = setDefaultValue(event_id, null);
		this.event = new OneEvent(event_id);
	}
	
	OneEventDispatch.prototype.convertToPostObject = function(data) {
		var post_data = OneAbstractDispatch.convertToPostObject(data);
		
		post_data.event_id = data.event_id;
		
		return post_data;
	};
	
	return OneEventDispatch;
}()));