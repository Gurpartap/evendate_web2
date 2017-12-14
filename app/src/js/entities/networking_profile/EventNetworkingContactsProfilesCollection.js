/**
 * @requires NetworkingContactsProfilesCollection.js
 */
class EventNetworkingContactsProfilesCollection extends NetworkingContactsProfilesCollection {
	constructor(event_id) {
		super();
		
		Object.defineProperty(this, 'event_id', {
			get() {
				
				return event_id;
			}
		});
	}
	
	/**
	 *
	 * @param {number} event_id
	 * @param {object} request_data
	 * @return {Promise}
	 */
	static fetchProfiles(event_id, request_data) {
		
		return __APP.SERVER.getData(EventNetworkingContactsProfilesCollection.profilesPath(event_id), request_data);
	}
	
	fetch(fields, length, order_by) {
		
		return EventNetworkingContactsProfilesCollection.fetchProfiles(this.event_id, {
			fields,
			length,
			order_by,
			offset: this.length
		}).then(profiles => {
			this.setData(profiles);
			
			return this.__last_pushed;
		});
	}
}

EventNetworkingContactsProfilesCollection.prototype.collection_of = OneEventNetworkingProfile;
EventNetworkingContactsProfilesCollection.profilesPath = event_id => `/events/${event_id}/networking/contacts`;