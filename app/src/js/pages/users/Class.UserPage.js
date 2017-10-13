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
			event: false,
			activity: false
		};
		this.block_scroll = {
			event: false,
			activity: false
		};
		this.favored_fetch_data = {
			fields: new Fields(
				'image_horizontal_medium_url',
				'favored_users_count',
				'is_favorite',
				'is_registered',
				'registration_locally',
				'registration_available',
				'ticketing_locally',
				'ticketing_available',
				'dates', {
					favored: {
						length: 5
					}
				}
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
				subscriptions: {
					fields: ['img_small_url'],
					length: 4,
					order_by: ['organization_type_order', 'organization_type_id']
				}
			}));
		}
		
		return Page.prototype.fetchData.call(this);
	};
	/**
	 *
	 * @param {__C.ENTITIES} type
	 *
	 * @returns {jqPromise}
	 */
	UserPage.prototype.uploadEntities = function(type) {
		var self = this,
			$wrapper = this.$wrapper.find('.TabsBody').filter('[data-tab_body_type="'+type+'"]'),
			type_data,
			$loader;
		
		switch (type) {
			case __C.ENTITIES.EVENT: {
				type_data = {
					fetch_method: this.user.fetchFavored,
					fetch_context: this.user,
					fetch_arguments: [this.favored_fetch_data],
					build_method: __APP.BUILD.eventBlocks,
					build_extra_arguments: [this.events_metadata]
				};
				
				break;
			}
			case __C.ENTITIES.ACTIVITY: {
				type_data = {
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
				};
				
				break;
			}
			default: {
				
				return $.Deferred().reject().promise();
			}
		}
		
		if (!this.disable_uploads[type] && !this.block_scroll[type]) {
			$loader = __APP.BUILD.loaderBlock($wrapper);
			this.block_scroll[type] = true;
			
			return type_data.fetch_method.apply(type_data.fetch_context, type_data.fetch_arguments).done(function(entities) {
				var $entities;
				self.block_scroll[type] = false;
				$loader.remove();
				if(entities.length){
					if(type_data.extra_function && typeof type_data.extra_function === 'function'){
						type_data.extra_function(entities);
					}
					$entities = type_data.build_method.apply(__APP.BUILD, [entities].concat(type_data.build_extra_arguments));
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
		
		return $.Deferred().reject().promise();
	};
	
	UserPage.prototype.init = function() {
		var self = this;
		
		bindTabs(this.$wrapper);
		UserPage.bindEvents(this.$wrapper);
		
		this.$wrapper.find('.Tabs').on('tabs:change', function() {
			self.bindScrollEvents();
		});
	};
	
	UserPage.prototype.bindScrollEvents = function() {
		var self = this,
			active_type = this.$wrapper.find('.TabsBody').filter('.'+__C.CLASSES.ACTIVE).data('tab_body_type'),
			$window = $(window),
			event_names = {};
		
		event_names[__C.ENTITIES.EVENT] = 'scroll.uploadEvents';
		event_names[__C.ENTITIES.ACTIVITY] = 'scroll.uploadActivities';
		
		$window.off(Object.values(event_names).join(' '));
		if ( isScrollRemain(1000) ) {
			this.uploadEntities(active_type);
		}
		$window.on(event_names[active_type], function() {
			if ( isScrollRemain(1000) ) {
				self.uploadEntities(active_type);
			}
		});
	};
	
	UserPage.prototype.render = function() {
		var self = this,
			$subscribed_orgs;
		
		if (this.user_id == __APP.USER.id){
			__APP.changeState('/my/profile', true, true);
			return null;
		}
		__APP.changeTitle(this.user.full_name);
		
		this.user.actions.forEach(function(action) {
			action.user = self.user;
		});
		
		if (this.user.subscriptions.length) {
			$subscribed_orgs = __APP.BUILD.avatarBlocks(this.user.subscriptions.slice(0,4), {
				is_link: true,
				entity: __C.ENTITIES.ORGANIZATION,
				avatar_classes: [__C.CLASSES.SIZES.X30]
			});
		} else {
			$subscribed_orgs = __APP.BUILD.cap('Нет подписок');
		}
		
		this.$wrapper.append(tmpl('user-page', {
			wrapper_classes: '-another_user',
			tombstone: __APP.BUILD.userTombstones(this.user, {avatar_classes: [__C.CLASSES.UNIVERSAL_STATES.BORDERED, __C.CLASSES.UNIVERSAL_STATES.SHADOWED]}),
			links: __APP.BUILD.socialLinks(this.user.accounts_links, {
				classes: __C.CLASSES.UNIVERSAL_STATES.ROUNDED
			}),
			subscribed_orgs: $subscribed_orgs,
			show_all_subscribed_orgs_button: this.user.subscriptions.length ? __APP.BUILD.button({
				classes: [__C.CLASSES.COLORS.NEUTRAL_ACCENT, __C.CLASSES.HOOKS.CALL_MODAL, __C.CLASSES.HOOKS.RIPPLE],
				dataset: {
					modal_type: 'subscribers_list',
					modal_entity: this.user
				},
				title: 'Показать все'
			}) : '',
			friends_hidden: __C.CLASSES.HIDDEN
		}));
		this.uploadEntities(__C.ENTITIES.EVENT).done(function() {
			self.bindScrollEvents();
		});
		this.uploadEntities(__C.ENTITIES.ACTIVITY);
		this.init();
	};
	
	return UserPage;
}()));