/**
 * @requires ../Class.OneEntity.js
 */
class OneNetworkingProfile extends OneEntity {
	constructor(user_id) {
		super();
		
		this.user_id = setDefaultValue(user_id, null);
		this.first_name = null;
		this.last_name = null;
		this.avatar_url = null;
		this.info = null;
		this.looking_for = null;
		this.vk_url = null;
		this.facebook_url = null;
		this.twitter_url = null;
		this.linkedin_url = null;
		this.telegram_url = null;
		this.instagram_url = null;
		this.github_url = null;
		this.email = null;
		this.signed_up = null;
		this.company_name = null;
		this.request_uuid = null;
		this.request = new OneNetworkingRequest(this.request_uuid);
		this.outgoing_request_uuid = null;
		this.outgoing_request = new OneNetworkingRequest(this.outgoing_request_uuid);
		this.user = new OneUser(this.user_id);
		
		Object.defineProperties(this.user, {
			first_name: {
				get: () => {
					
					return this.first_name;
				}
			},
			last_name: {
				get: () => {
					
					return this.last_name;
				}
			},
			avatar_url: {
				get: () => {
					
					return this.avatar_url;
				}
			},
		});
	}
	
	
	static fetchProfile(user_id, fields) {
		
		return __APP.SERVER.getData(OneNetworkingProfile.profilePath(user_id), {fields});
	}
	
	fetch(fields) {
		
		return OneNetworkingProfile.fetchProfile(this.user_id, fields).then(data => {
			this.setData(data);
			
			return data;
		});
	}
}

OneNetworkingProfile.prototype.ID_PROP_NAME = 'user_id';
OneNetworkingProfile.profilePath = user_id => `/events/networking/profiles/${user_id}`;