/**
 * @requires OneEventNetworkingProfile.js
 */
class MyEventNetworkingProfile extends OneEventNetworkingProfile {
	constructor(event_id) {
		super('me', event_id);
	}
	
	static updateProfile(event_id, data) {
		
		return __APP.SERVER.addData(OneEventNetworkingProfile.profilePath(event_id, 'me'), data);
	}
	
	/**
	 *
	 * @param {number} event_id
	 * @param {(number|string)} user_id
	 * @param {string} code
	 * @param {Fields} [fields]
	 * @return {Promise}
	 */
	static redeemEventAccess(event_id, user_id, code, fields) {
		
		return __APP.SERVER.getData(OneEventNetworkingProfile.profilePath(event_id, user_id), {fields, code});
	}
	
	/**
	 *
	 * @param {Fields} [fields]
	 * @param {number} [event_id]
	 * @return {*}
	 */
	checkAccess(fields, event_id) {
		if (isVoid(this.event_id)) {
			this.event_id = event_id;
		}
		
		return OneEventNetworkingProfile.fetchProfile(this.event_id, 'me', fields).then(data => {
			this.setData(data);
			
			return data;
		}, reason => {
			debugger;
			if (!isVoid(reason.response)) {
			
			}
		});
	}
	
	/**
	 *
	 * @param {string} code
	 * @param {Fields} [fields]
	 * @param {number} [event_id]
	 * @return {Promise}
	 */
	redeemAccess(code, fields, event_id) {
		if (isVoid(this.event_id)) {
			this.event_id = event_id;
		}
		
		return MyEventNetworkingProfile.redeemEventAccess(this.event_id, 'me', code, fields).then(data => {
			this.setData(data);
			
			return data;
		});
	}
	
	update(data) {
		if (!isVoid(data)) {
			this.setData(data);
		}
		
		return MyEventNetworkingProfile.updateProfile(this.event_id, {
			first_name: this.first_name,
			last_name: this.last_name,
			avatar_url: this.avatar_url,
			info: this.info,
			looking_for: this.looking_for,
			vk_url: this.vk_url,
			facebook_url: this.facebook_url,
			twitter_url: this.twitter_url,
			linkedin_url: this.linkedin_url,
			telegram_url: this.telegram_url,
			instagram_url: this.instagram_url,
			github_url: this.github_url,
			company_name: this.company_name,
		});
	}
}