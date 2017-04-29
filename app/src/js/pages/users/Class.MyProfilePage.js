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
		this.favored_fetch_data.fields.push('is_favorite');
		this.user = __APP.USER;
	}
	
	MyProfilePage.prototype.fetchData = function() {
		if(!this.user.favored.length){
			return this.fetching_data_defer = this.user.fetchFavored(this.favored_fetch_data);
		}
		return Page.prototype.fetchData.call(this);
	};
	
	MyProfilePage.prototype.render = function() {
		var $activities,
			$subscribed_orgs,
			$favored_events,
			$subscribed_users;
		__APP.changeTitle('Мой профиль');
		
		this.user.actions.forEach(function(action) {
			action.user = __APP.USER;
		});
		
		if(this.user.subscriptions.length) {
			$subscribed_orgs = __APP.BUILD.avatarBlocks(this.user.subscriptions.slice(0,4), {
				is_link: true,
				entity: __C.ENTITIES.ORGANIZATION,
				avatar_classes: [__C.CLASSES.SIZES.X30]
			});
		} else {
			$subscribed_orgs = __APP.BUILD.cap('Нет подписок');
		}
		
		if(this.user.friends.length) {
			$subscribed_users = __APP.BUILD.avatarBlocks(this.user.friends.slice(0,4), {
				is_link: true,
				entity: __C.ENTITIES.USER,
				avatar_classes: [__C.CLASSES.SIZES.X30, __C.CLASSES.UNIVERSAL_STATES.ROUNDED]
			});
		} else {
			$subscribed_users = __APP.BUILD.cap('Нет друзей');
		}
		
		if(this.user.favored.length) {
			$favored_events = __APP.BUILD.eventBlocks(this.user.favored, this.events_metadata);
		} else {
			$favored_events = __APP.BUILD.cap('Событий нет');
		}
		
		this.$wrapper.append(tmpl('user-page', {
			tombstone: __APP.BUILD.userTombstones(this.user, {avatar_classes: ['-bordered', '-shadowed']}),
			links: __APP.BUILD.socialLinks(this.user.accounts_links),
			subscribed_orgs: $subscribed_orgs,
			show_all_subscribed_orgs_button: this.user.subscriptions.length ? __APP.BUILD.button({
				classes: ['-color_neutral_accent','CallModal','RippleEffect'],
				dataset: {
					modal_type: 'subscribers_list',
					modal_entity: this.user
				},
				title: 'Показать все'
			}) : '',
			subscribed_users: $subscribed_users,
			show_all_subscribed_users_button: this.user.friends.length ? __APP.BUILD.button({
				classes: ['-color_neutral_accent','CallModal','RippleEffect'],
				dataset: {
					modal_type: 'friends_list',
					modal_entity: this.user
				},
				title: 'Показать все'
			}) : '',
			favored_event_blocks: $favored_events
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