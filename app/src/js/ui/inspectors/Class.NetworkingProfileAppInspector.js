/**
 * @requires Class.AbstractAppInspector.js
 */
/**
 *
 * @class NetworkingProfileAppInspector
 * @extends AbstractAppInspector
 */
NetworkingProfileAppInspector = extending(AbstractAppInspector, (function() {
	/**
	 *
	 * @param {OneNetworkingProfile} profile
	 *
	 * @constructor
	 * @constructs NetworkingProfileAppInspector
	 *
	 * @property {OneNetworkingProfile} profile
	 */
	function NetworkingProfileAppInspector(profile) {
		const {
				user,
				company_name,
				info,
			} = profile,
			icons = {
				vk_url: 'vk',
				facebook_url: 'facebook-official',
				twitter_url: 'twitter',
				linkedin_url: 'linkedin',
				telegram_url: 'telegram',
				instagram_url: 'instagram',
				github_url: 'github',
			},
			links = [
				'vk_url',
				'facebook_url',
				'twitter_url',
				'linkedin_url',
				'telegram_url',
				'instagram_url',
				'github_url',
			].reduce((bundle, key) => {
				if (!isVoid(profile[key]) && profile[key] !== '') {
					bundle[key] = profile[key];
				}
				
				return bundle;
			}, {}),
			link_keys = Object.keys(links);
		
		
		this.profile = profile;
		this.title = user.full_name;
		this.$content = tmpl('networking-profile-app-inspector', {
			avatar: __APP.BUILD.avatars(user, {
				classes: [
					__C.CLASSES.UNIVERSAL_STATES.ROUNDED,
				]
			}),
			full_name: user.full_name,
			company_name,
			info: info ? info : '-',
			contacts: link_keys.length ? tmpl('app-inspector-contact', link_keys.map(type => {
				
				return {
					icon_class: icons[type],
					url: links[type],
				}
			})) : 'Нет контактов'
		});
		AbstractAppInspector.call(this);
	}
	
	return NetworkingProfileAppInspector;
}()));