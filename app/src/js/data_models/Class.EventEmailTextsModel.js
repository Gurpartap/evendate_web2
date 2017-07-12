/**
 * @requires ../entities/Class.OneEntity.js
 */
/**
 *
 * @class EventEmailTextsModel
 * @extends OneEntity
 */
EventEmailTextsModel = extending(OneEntity, (function() {
	/**
	 *
	 * @constructor
	 * @constructs EventEmailTextsModel
	 *
	 * @property {?string} payed
	 * @property {?string} approved
	 * @property {?string} not_approved
	 * @property {?string} after_event
	 */
	function EventEmailTextsModel() {
		OneEntity.call(this);
		
		this.payed = null;
		this.approved = null;
		this.not_approved = null;
		this.after_event = null;
	}
	
	return EventEmailTextsModel;
}()));