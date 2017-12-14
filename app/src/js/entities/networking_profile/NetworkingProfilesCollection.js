/**
 * @requires ../Class.EntitiesCollection.js
 * @requires OneNetworkingProfile.js
 */
class NetworkingProfilesCollection extends EntitiesCollection {
	
	fetch(fields, length, order_by) {
		
		return Promise.resolve();
	}
}

NetworkingProfilesCollection.prototype.collection_of = OneNetworkingProfile;