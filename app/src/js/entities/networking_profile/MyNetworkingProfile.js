/**
 * @requires OneNetworkingProfile.js
 */
class MyNetworkingProfile extends OneNetworkingProfile {
	constructor() {
		super('me');
	}
	
	static updateProfile(data) {
		
		return __APP.SERVER.addData(OneNetworkingProfile.profilePath('me'), data, true);
	}
	
	update(data) {
		if (!isVoid(data)) {
			this.setData(data);
		}
		
		return MyNetworkingProfile.updateProfile(this.event_id, {
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