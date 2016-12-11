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
		UserPage.call(this, __APP.USER.id);
		this.page_title = 'Мой профиль';
		this.user = __APP.USER;
		
		if(this.user.actions.length){
			Page.triggerRender();
		} else {
			this.user.actions.fetch(['organization', 'event', 'type_code', 'created_at'], 20, '-created_at', Page.triggerRender);
		}
	}
	
	MyProfilePage.prototype.render = function() {
		var self = this;
		
		
	};
	
	return MyProfilePage;
}()));