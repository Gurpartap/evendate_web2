/**
 * @requires Class.UserPage.js
 */
class OldMyProfilePage extends OldUserPage {
	constructor() {
		super(__APP.USER.id);
		this.favored_fetch_data.fields.push('is_favorite');
		this.user = __APP.USER;
		this.page_title = 'Мой профиль';
	}
	
	fetchData() {
		if (!this.user.friends.length) {
			
			return this.fetching_data_defer = this.user.fetchFriends({
				fields: new Fields('is_friend'),
				length: 4
			});
		}
		
		return this.fetching_data_defer = Promise.resolve();
	}
}