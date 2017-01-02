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
		if(!this.user.favored.length){
			return this.fetching_data_defer = this.user.fetchFavored(this.favored_fetch_data);
		}
		return Page.prototype.fetchData.call(this);
	};
	
	MyProfilePage.prototype.render = function() {
		var $activities;
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
			favored_event_blocks: __APP.BUILD.eventBlocks(this.user.favored, this.events_metadata)
		}));
		if(this.user.actions.length){
			$activities = __APP.BUILD.activity(this.user.actions);
			this.$wrapper.find('.TabsBody').filter('[data-tab_body_type="activities"]').append($activities);
			UserPage.bindEvents($activities);
		} else {
			this.uploadEntities('activities');
		}
		this.init();
	};
	
	return MyProfilePage;
}()));