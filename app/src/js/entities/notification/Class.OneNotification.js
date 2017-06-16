/**
 * @requires ../Class.OneEntity.js
 */
/**
 *
 * @class OneNotification
 * @extends OneEntity
 */
OneNotification = extending(OneEntity, (function() {
	/**
	 *
	 * @constructor
	 * @constructs OneNotification
	 *
	 * @property {?string} guid
	 * @property {?string} uuid
	 * @property {?(string|number)} event_id
	 * @property {?timestamp} notification_time
	 *
	 * @property {?string} notification_type
	 * @property {?timestamp} sent_time
	 * @property {?boolean} done
	 * @property {?timestamp} created_at
	 * @property {?timestamp} updated_at
	 */
	function OneNotification() {
		var self = this;
		
		this.uuid = null;
		this.event_id = null;
		this.notification_time = null;
		this.notification_type = null;
		
		this.sent_time = null;
		this.done = null;
		this.created_at = null;
		this.updated_at = null;
		
		Object.defineProperty(this, OneNotification.prototype.ID_PROP_NAME, {
			get: function() {
				return self.uuid || self.notification_type;
			}
		});
	}
	
	OneNotification.prototype.ID_PROP_NAME = 'guid';
	
	OneNotification.NOTIFICATIN_TYPES = {
		NOW: 'notification-now',
		CANCELED: 'notification-event-canceled',
		CHANGED_DATES: 'notification-event-changed-dates',
		CHANGED_LOCATION: 'notification-event-changed-location',
		CHANGED_PRICE: 'notification-event-changed-price',
		CHANGED_REGISTRATION: 'notification-event-changed-registration',
		ONE_DAY_REGISTRATION_CLOSE: 'notification-one-day-registration-close',
		BEFORE_THREE_HOURS: 'notification-before-three-hours',
		BEFORE_DAY: 'notification-before-day',
		BEFORE_THREE_DAYS: 'notification-before-three-days',
		BEFORE_WEEK: 'notification-before-week',
		BEFORE_QUARTER_OF_HOUR: 'notification-before-quarter-of-hour',
		CUSTOM: 'notification-custom',
		REGISTRATION_APPROVED: 'notification-registration-approved',
		REGISTRATION_CHECKED_OUT: 'notification-registration-checked-out',
		REGISTRATION_NOT_CHECKED_OUT: 'notification-registration-not-checked-out',
		REGISTRATION_NOT_APPROVED: 'notification-registration-not-approved',
		USERS: 'users-notification',
		ADDITIONAL_FOR_ORGANIZATION: 'notification-additional-for-organization'
	};
	
	
	return OneNotification;
}()));