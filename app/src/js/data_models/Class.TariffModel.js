/**
 * @requires ../entities/Class.OneEntity.js
 */
/**
 *
 * @class TariffModel
 * @extends OneEntity
 */
TariffModel = extending(OneEntity, (function() {
	/**
	 *
	 * @param {(OneOrganization|object)} [data]
	 *
	 * @constructor
	 * @constructs TariffModel
	 *
	 * @property {?(string|number)} tariff_id
	 * @property {?string} name
	 * @property {?timestamp} since
	 * @property {?timestamp} till
	 * @property {?number} available_additional_notifications
	 * @property {?number} available_event_publications
	 * @property {?number} event_publications
	 * @property {?number} available_tickets_selling
	 * @property {?boolean} available_telegram_bots
	 * @property {?boolean} available_slack_bots
	 * @property {?boolean} available_auditory_analytics
	 * @property {?number} available_in_city
	 * @property {?number} price
	 */
	function TariffModel(data) {
		var self = this;
		
		this.tariff_id = null;
		this.name = null;
		this.since = null;
		this.till = null;
		this.available_additional_notifications = null;
		this.available_event_publications = null;
		this.event_publications = null;
		this.available_tickets_selling = null;
		this.available_telegram_bots = null;
		this.available_slack_bots = null;
		this.available_auditory_analytics = null;
		this.available_in_city = null;
		this.price = null;
		
		Object.defineProperty(this, 'is_full', {
			get: function() {
				return self.price !== 0;
			}
		});
		
		if (data) {
			setData(this, data);
		}
	}
	
	return TariffModel;
}()));