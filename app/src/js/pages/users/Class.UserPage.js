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
		this.events_data = {
			last_date: '',
			disable_upload: false
		};
		this.actions_disable_upload = false;
		this.favored_fetch_data = {
			fields: ['image_horizontal_medium_url', 'favored', 'dates'],
			order_by: 'nearest_event_date,-first_event_date',
			length: 10
		};
	}
	
	UserPage.bindEvents = function($parent) {
		bindRippleEffect($parent);
		trimAvatarsCollection($parent);
		__APP.MODALS.bindCallModal($parent);
		bindPageLinks($parent);
	};
	
	UserPage.prototype.fetchData = function() {
		if(!(this.user_id == __APP.USER.id || this.user_id === 'me')){
			return this.fetching_data_defer = this.user.fetchUser(new Fields('type', 'is_friend', 'link', 'accounts', 'accounts_links', {
				friends: {
					fields: ['is_friend'],
					length: 4
				},
				favored: this.favored_fetch_data,
				subscriptions: {
					fields: ['img_small_url'],
					length: 4
				}
			}));
		}
		return Page.prototype.fetchData.call(this);
	};
	
	UserPage.prototype.uploadEvents = function() {
		var self = this,
			$wrapper = self.$wrapper.find('.TabsBody').filter('[data-tab_body_type="events"]'),
			$loader = __APP.BUILD.loaderBlock($wrapper);
		$wrapper.parent().height($wrapper.height());
		if(!self.events_data.disable_upload){
			self.user.fetchFavored(this.favored_fetch_data, function(favored) {
				var $events;
				if(favored.length){
					$events = __APP.BUILD.eventBlocks(favored, self.events_data);
					$wrapper.append($events);
					UserPage.bindEvents($events);
					self.block_scroll = false;
				} else {
					self.events_data.disable_upload = true;
				}
				$loader.remove();
				$wrapper.parent().height($wrapper.height());
			});
		}
	};
	
	UserPage.prototype.uploadActivities = function() {
		var self = this,
			$wrapper = self.$wrapper.find('.TabsBody').filter('[data-tab_body_type="activities"]'),
			$loader = __APP.BUILD.loaderBlock($wrapper);
		$wrapper.parent().height($wrapper.height());
		if(!self.actions_disable_upload){
			self.user.actions.fetch(['organization', 'event', 'type_code', 'created_at'], 20, '-created_at', function(activities) {
				var $activities;
				if(activities.length){
					activities.forEach(function(activity) {
						activity.user = self.user;
					});
					$activities = __APP.BUILD.activity(activities);
					$wrapper.append($activities);
					UserPage.bindEvents($activities);
					self.block_scroll = false;
				} else {
					self.actions_disable_upload = true;
				}
				$loader.remove();
				$wrapper.parent().height($wrapper.height());
			});
		}
	};
	
	UserPage.prototype.init = function() {
		var self = this,
			$window = $(window),
			event_names = {
				activities: 'scroll.uploadActivities',
				events: 'scroll.uploadEvents'
			};
		
		bindTabs(this.$wrapper);
		UserPage.bindEvents(this.$wrapper);
		
		
		this.$wrapper.find('.Tabs').on('change.tabs', function() {
			var $this = $(this),
				active_type = $this.find('.TabsBody').filter('.'+__C.CLASSES.NEW_ACTIVE).data('tab_body_type');
			$window.off(Object.values(event_names).join(' '));
			$window.on(event_names[active_type], function() {
				if ($window.height() + $window.scrollTop() + 200 >= $(document).height() && !self.block_scroll) {
					self.block_scroll = true;
					switch (active_type) {
						case 'activities': {
							self.uploadActivities();
							break;
						}
						case 'events': {
							self.uploadEvents();
							break;
						}
					}
				}
			});
		});
		
		$window.on(event_names.activities, function() {
			if ($window.height() + $window.scrollTop() + 200 >= $(document).height() && !self.block_scroll) {
				self.block_scroll = true;
				self.uploadActivities();
			}
		});
	};
	
	UserPage.prototype.render = function() {
		var self = this;
		
		if(this.user_id == __APP.USER.id){
			__APP.changeState('/my/profile', true, true);
			return null;
		}
		__APP.changeTitle(this.user.full_name);
		
		this.user.actions.forEach(function(action) {
			action.user = self.user;
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
			friends_hidden: '-hidden',
			favored_event_blocks: __APP.BUILD.eventBlocks(this.user.favored, this.events_data)
		}));
		this.uploadActivities();
		this.init();
	};
	
	return UserPage;
}()));