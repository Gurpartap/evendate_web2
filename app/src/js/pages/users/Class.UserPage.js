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
		
		if(this.user_id != __APP.USER.id){
			this.is_loading = true;
			this.user.fetchUserWithSubscriptions(['type', 'is_friend', 'link'], undefined, Page.triggerRender)
		} else {
			Page.triggerRender();
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