/**
 * @requires EventNetworkingProfilesCollection.js
 */
class EventNetworkingAcceptedRequestProfilesCollection extends EventNetworkingProfilesCollection {
	
	fetch(fields, length, order_by) {
		
		return EventNetworkingProfilesCollection.fetchProfiles(this.event_id, {
			request_accepted: true,
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