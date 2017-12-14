/**
 * @requires asyncPage.js
 * @requires UserPage.js
 */
const MyProfilePage = asyncPage({
	constructPage() {
		
		return {
			user: __APP.USER
		};
	},
	
	fetchData(props) {
		if (!props.user.friends.length) {
			
			return props.user.fetchFriends({
				fields: new Fields('is_friend'),
				length: 4
			});
		}
		
		return Promise.resolve();
	},
	pageTitle: 'Мой профиль'
}, class MyProfilePage extends UserPage.OriginPage {
		constructor(props) {
			super(props);
			this.favored_fetch_data.fields.push('is_favorite');
		}
	}
);
