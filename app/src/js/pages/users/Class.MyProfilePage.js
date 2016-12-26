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
	}
	
	MyProfilePage.prototype.fetchData = function() {
		var actions_promise,
			favored_promise;
		if(!this.user.actions.length){
			actions_promise = this.user.actions.fetch(this.actions_fetch_data.fields, this.actions_fetch_data.length, this.actions_fetch_data.order_by);
		}
		if(!this.user.favored.length){
			favored_promise = this.user.fetchFavored(this.favored_fetch_data);
		}
		
		if(actions_promise && favored_promise){
			return this.fetching_data_defer = __APP.SERVER.multipleAjax(actions_promise, favored_promise);
		} else {
			if(actions_promise) {
				return this.fetching_data_defer = actions_promise;
			}
			if(favored_promise) {
				return this.fetching_data_defer = favored_promise;
			}
		}
		return Page.prototype.fetchData.call(this);
	};
	
	MyProfilePage.prototype.render = function() {
		__APP.changeTitle('Мой профиль');
		
		this.user.actions.forEach(function(action) {
			action.user = __APP.USER;
		});
		this.$wrapper.append(tmpl('user-page', {
			tombstone: __APP.BUILD.userTombstones(this.user, {avatar_classes: ['-bordered', '-shadowed']}),
			links: __APP.BUILD.socialLinks(this.user.accounts_links),
			subscribed_orgs: __APP.BUILD.avatarBlocks(this.user.subscriptions.slice(0,4), {
				avatar_classes: ['-size_30x30'],
				entity: 'organization',
				is_link: true
			}),
			show_all_subscribed_orgs_button: __APP.BUILD.button({
				classes: ['-color_neutral_accent','CallModal','RippleEffect'],
				dataset: {
					modal_type: ''
				},
				title: 'Показать все'
			}),
			subscribed_users: __APP.BUILD.avatarBlocks(this.user.friends.slice(0,4), {
				avatar_classes: ['-size_30x30', '-rounded'],
				entity: 'user',
				is_link: true
			}),
			show_all_subscribed_users_button: __APP.BUILD.button({
				classes: ['-color_neutral_accent','CallModal','RippleEffect'],
				dataset: {
					modal_type: 'favors'
				},
				title: 'Показать все'
			}),
			activity_blocks: __APP.BUILD.activity(this.user.actions),
			favored_event_blocks: __APP.BUILD.eventBlocks(this.user.favored, this.events_data)
		}));
		this.init();
	};
	
	return MyProfilePage;
}()));