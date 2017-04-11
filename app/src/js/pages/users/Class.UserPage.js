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
		this.events_metadata = {last_date: ''};
		
		this.disable_uploads = {
			events: false,
			activities: false
		};
		this.favored_fetch_data = {
			fields: new Fields(
				'image_horizontal_medium_url',
				'favored',
				'dates'
			),
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
					length: 4,
					order_by: ['organization_type_order', 'organization_type_id']
				}
			}));
		}
		return Page.prototype.fetchData.call(this);
	};
	
	UserPage.prototype.uploadEntities = function(type) {
		var self = this,
			types = {
				activities: {
					fetch_method: this.user.actions.fetch,
					fetch_context: this.user.actions,
					fetch_arguments: [['organization', 'event', 'type_code', 'created_at'], 20, '-created_at'],
					extra_function: function(entities) {
						entities.forEach(function(activity) {
							activity.user = self.user;
						});
					},
					build_method: __APP.BUILD.activity,
					build_extra_arguments: []
				},
				events: {
					fetch_method: this.user.fetchFavored,
					fetch_context: this.user,
					fetch_arguments: [this.favored_fetch_data],
					build_method: __APP.BUILD.eventBlocks,
					build_extra_arguments: [this.events_metadata]
				}
			},
			type_data = types[type],
			$wrapper = self.$wrapper.find('.TabsBody').filter('[data-tab_body_type="'+type+'"]'),
			$loader;
		
		if(!self.disable_uploads[type] && !self.block_scroll){
			$loader = __APP.BUILD.loaderBlock($wrapper);
			self.block_scroll = true;
			
			type_data.fetch_method.apply(type_data.fetch_context, type_data.fetch_arguments).done(function(entities) {
				var $entities;
				self.block_scroll = false;
				$loader.remove();
				if(entities.length){
					if(type_data.extra_function && typeof type_data.extra_function === 'function'){
						type_data.extra_function(entities);
					}
					$entities = type_data.build_method.apply(self, [entities].concat(type_data.build_extra_arguments));
					$wrapper.append($entities);
					UserPage.bindEvents($entities);
				} else {
					if(!$wrapper.children().length){
						$wrapper.append(__APP.BUILD.cap('Активности нет'));
					}
					self.disable_uploads[type] = true;
				}
			});
		}
	};
	
	UserPage.prototype.init = function() {
		var self = this,
			event_names = {
				activities: 'scroll.uploadActivities',
				events: 'scroll.uploadEvents'
			};
		
		function bindScrollEvents(page, event_names) {
			var active_type = page.$wrapper.find('.TabsBody').filter('.'+__C.CLASSES.ACTIVE).data('tab_body_type'),
				$window = $(window);
			
			$window.off(Object.values(event_names).join(' '));
			$window.on(event_names[active_type], function() {
				if ( isScrollRemain(200) ) {
					switch (active_type) {
						case 'activities': {
							page.uploadEntities('activities');
							break;
						}
						case 'events': {
							page.uploadEntities('events');
							break;
						}
					}
				}
			});
		}
		
		bindTabs(this.$wrapper);
		UserPage.bindEvents(this.$wrapper);
		
		this.$wrapper.find('.Tabs').on('change.tabs', function() {
			bindScrollEvents(self, event_names);
		});
		
		bindScrollEvents(this, event_names);
	};
	
	UserPage.prototype.render = function() {
		var self = this,
			$subscribed_orgs,
			$favored_events;
		
		if(this.user_id == __APP.USER.id){
			__APP.changeState('/my/profile', true, true);
			return null;
		}
		__APP.changeTitle(this.user.full_name);
		
		this.user.actions.forEach(function(action) {
			action.user = self.user;
		});
		
		if(this.user.subscriptions.length) {
			$subscribed_orgs = __APP.BUILD.avatarBlocks(this.user.subscriptions.slice(0,4), {
				avatar_classes: ['-size_30x30'],
				entity: 'organization',
				is_link: true
			});
		} else {
			$subscribed_orgs = __APP.BUILD.cap('Нет подписок');
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
			friends_hidden: __C.CLASSES.HIDDEN,
			favored_event_blocks: $favored_events
		}));
		this.uploadEntities('activities');
		this.init();
	};
	
	return UserPage;
}()));