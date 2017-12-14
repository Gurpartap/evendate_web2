/**
 * @requires NetworkingProfilesCollection.js
 */
class NetworkingContactsProfilesCollection extends NetworkingProfilesCollection {
	
	/**
	 *
	 * @param {object} request_data
	 * @return {Promise}
	 */
	static fetchProfiles(request_data) {
		
		return __APP.SERVER.getData(NetworkingContactsProfilesCollection.profilesPath(), request_data);
	}
	
	fetch(fields, length, order_by) {
		
		return NetworkingContactsProfilesCollection.fetchProfiles({
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

NetworkingContactsProfilesCollection.prototype.collection_of = OneNetworkingProfile;
NetworkingContactsProfilesCollection.profilesPath = () => '/users/me/contacts/';