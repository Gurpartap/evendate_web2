/**
 * @requires ../Class.Page.js
 */
/**
 * @class UserPage
 * @extends Page
 */
UserPage = extending(Page, (function() {
	/**
	 *
	 * @param {(number|string)} user_id
	 * @constructs UserPage
	 */
	function UserPage(user_id) {
		Page.apply(this);
		this.user_id = user_id;
		this.user = new OneUser(user_id);
		
		if(this.user_id == __APP.USER.id || this.user_id === 'me'){
			Page.triggerRender();
		} else {
			this.is_loading = true;
			this.user.fetchUser(new Fields('type', 'is_friend', 'link', 'accounts', 'accounts_links', {
				friends: {
					fields: ['is_friend'],
					length: 4
				},
				subscriptions: {
					fields: ['img_small_url'],
					length: 4
				},
				actions: {
					fields: ['organization', 'event', 'type_code', 'created_at'],
					order_by: '-created_at',
					length: 20
				}
			}), Page.triggerRender);
		}
	}
	
	UserPage.prototype.render = function() {
		if(this.user_id == __APP.USER.id){
			__APP.changeState('/my/profile', true, true);
			return null;
		}
		__APP.changeTitle(this.user.full_name)
	};
	
	return UserPage;
}()));