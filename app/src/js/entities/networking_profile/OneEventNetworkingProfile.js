/**
 * @requires OneNetworkingProfile.js
 */
class OneEventNetworkingProfile extends OneNetworkingProfile {
	constructor(user_id, event_id) {
		super(user_id);
		
		this.event_id = setDefaultValue(event_id, null);
		this.request = new OneEventNetworkingRequest(event_id, this.request_uuid);
		this.outgoing_request = new OneEventNetworkingRequest(event_id, this.outgoing_request_uuid);
	}
	
	static fetchProfile(event_id, user_id, fields) {
		
		return __APP.SERVER.getData(OneEventNetworkingProfile.profilePath(event_id, user_id), {fields});
	}
	
	fetch(fields) {
		
		return OneEventNetworkingProfile.fetchProfile(this.event_id, this.user_id, fields).then(data => {
			this.setData(data);
			
			return data;
		});
	}
}

OneEventNetworkingProfile.profilePath = (event_id, user_id) => `/events/${event_id}/networking/profiles/${user_id}`;