/**
 * @requires Class.UserPage.js
 */
/**
 * @class MyProfilePage
 * @extends UserPage
 */
MyProfilePage = extending(UserPage, (function() {
	/**
	 *
	 * @constructs MyProfilePage
	 */
	function MyProfilePage() {
		UserPage.call(this, 'me');
		this.page_title = 'Мой профиль';
		this.user = __APP.USER;
		
		if(this.user.friends.length > 0){
			Page.triggerRender();
		} else {
			this.user.fetchFriends({length: 4}, Page.triggerRender);
		}
	}
	
	MyProfilePage.prototype.render = function() {
		var self = this;
		
		
	};
	
	return MyProfilePage;
}()));