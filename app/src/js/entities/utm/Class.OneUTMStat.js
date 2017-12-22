/**
 * @requires ../Class.OneEntity.js
 */
/**
 *
 * @class OneUTMStat
 * @extends OneEntity
 */
OneUTMStat = extending(OneEntity, (function() {
	/**
	 *
	 * @constructor
	 * @constructs OneUTMStat
	 *
	 * @property {?string} uuid
	 * @property {?string} utm_source
	 * @property {?string} utm_medium
	 * @property {?string} utm_campaign
	 * @property {?string} utm_content
	 * @property {?string} utm_term
	 * @property {?number} open_count
	 * @property {?number} conversion
	 * @property {?number} orders_sum
	 */
	function OneUTMStat() {
		var self = this;
		
		OneEntity.call(this);
		
		this.utm_source = null;
		this.utm_medium = null;
		this.utm_campaign = null;
		this.utm_content = null;
		this.utm_term = null;
		this.open_count = null;
		this.tickets_count = null;
		this.orders_count = null;
		this.orders_sum = null;
		
		Object.defineProperty(this, 'uuid', {
			get: function() {
				
				return CryptoJS.MD5([
					self.utm_source,
					self.utm_medium,
					self.utm_campaign,
					self.utm_content,
					self.utm_term
				].clean().join('-')).toString();
			}
		});
	}
	
	OneUTMStat.prototype.ID_PROP_NAME = 'uuid';
	
	return OneUTMStat;
}()));