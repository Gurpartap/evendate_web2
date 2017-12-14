/**
 * @requires NetworkingProfilesCollection.js
 * @requires OneEventNetworkingProfile.js
 */
class EventNetworkingProfilesCollection extends NetworkingProfilesCollection {
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
	 *
	 * @return {Promise}
	 */
	static fetchProfiles(event_id, request_data) {
	
		return __APP.SERVER.getData(EventNetworkingProfilesCollection.profilesPath(event_id), request_data);
	}
	
	fetch(fields, length, order_by) {
		
		return EventNetworkingProfilesCollection.fetchProfiles(this.event_id, {
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

EventNetworkingProfilesCollection.prototype.collection_of = OneEventNetworkingProfile;
EventNetworkingProfilesCollection.profilesPath = event_id => `/events/${event_id}/networking/profiles/`;