/**
 * @requires ../Class.Page.js
 */
/**
 *
 * @class OrganizationPage
 * @extends Page
 */
OrganizationPage = extending(Page, (function() {
	/**
	 *
	 * @param {(string|number)} organization_id
	 * @constructor
	 * @constructs OrganizationPage
	 */
	function OrganizationPage(organization_id) {
		/**
		 * @typedef {Object} OrganizationPage~EventType
		 * @property {string} name
		 * @property {string} scroll_event
		 * @property {string} sort_date_type
		 * @property {string} last_date
		 * @property {boolean} is_upload_disabled
		 */
		var	event_type_default = {
			last_date: '',
			block_scroll: false,
			is_upload_disabled: false
		};
		Page.call(this);
		
		this.fields = new Fields(
			'img_small_url',
			'background_medium_img_url',
			'description',
			'site_url',
			'is_subscribed',
			'privileges',
			'default_address',
			'subscribed_count', {
				subscribed: {
					fields: 'is_friend',
					order_by: '-is_friend,first_name',
					length: 10
				}
			}
		);
		this.events_fields = new Fields(
			'image_horizontal_medium_url',
			'favored_users_count',
			'is_favorite',
			'is_registered',
			'registration_available',
			'registration_locally',
			'ticketing_locally',
			'dates', {
				favored: {
					length: 5
				}
			}
		);
		
		/**
		 * @name OrganizationPage#event_types
		 * @enum {OrganizationPage~EventType}
		 */
		this.event_types = {
			future: $.extend(true, {}, event_type_default, {
				name: 'future',
				scroll_event: 'scroll.uploadFutureEvents',
				sort_date_type: 'nearest_event_date'
			}),
			past: $.extend(true, {}, event_type_default, {
				name: 'past',
				scroll_event: 'scroll.uploadPastEvents',
				sort_date_type: 'last_event_date'
			}),
			delayed: $.extend(true, {}, event_type_default, {
				name: 'delayed',
				scroll_event: 'scroll.uploadDelayedEvents',
				sort_date_type: 'public_at'
			}),
			canceled: $.extend(true, {}, event_type_default, {
				name: 'canceled',
				scroll_event: 'scroll.uploadCanceledEvents',
				sort_date_type: 'first_event_date'
			})
		};
		
		this.current_tab = this.event_types.future.name;
		this.is_admin = false;
		this.future_events = new FutureEventsCollection();
		this.past_events = new PastEventsCollection();
		this.delayed_events = new DelayedEventsCollection();
		this.canceled_events = new CanceledEventsCollection();
		this.organization = new OneOrganization(organization_id);
	}
	/**
	 *
	 * @return {jqPromise}
	 */
	OrganizationPage.prototype.fetchData = function() {
		var self = this;
		
		return this.fetching_data_defer = this.organization.fetchOrganization(this.fields).done(function(data) {
			self.is_admin = self.organization.role !== OneUser.ROLE.USER;
		}).promise();
	};
	/**
	 *
	 * @param {OrganizationPage~EventType} type
	 * @param {function} [success]
	 */
	OrganizationPage.prototype.fetchAndAppendFeed = function(type, success) {
		var PAGE = this,
			$wrapper,
			$loader,
			$output;
		
		if (!type.is_upload_disabled && !type.block_scroll) {
			$wrapper = this.$wrapper.find('.' + type.name.capitalize() + 'Events');
			$loader = __APP.BUILD.loaderBlock($wrapper);
			
			type.block_scroll = true;
			PAGE[type.name + '_events'].fetchOrganizationsFeed(PAGE.organization.id, PAGE.events_fields, 10, function(events) {
				$loader.remove();
				type.block_scroll = false;
				if (events.length) {
					$output = __APP.BUILD.eventBlocks(events, type);
				} else {
					type.is_upload_disabled = true;
					$output = tmpl('organization-feed-no-event', {
						text: 'Больше событий нет :('
					});
				}
				$wrapper.append($output);
				PAGE.bindFeedEvents($output);
				
				if (isFunction(success)) {
					success();
				}
			});
		}
	};
	
	OrganizationPage.prototype.bindFeedEvents = function($parent) {
		bindRippleEffect($parent);
		trimAvatarsCollection($parent);
		bindCallModal($parent);
		bindPageLinks($parent);
	};
	
	OrganizationPage.prototype.init = function() {
		var PAGE = this,
			$subscribers_scroll = PAGE.$wrapper.find('.SubscribersScroll');
		
		bindTabs(PAGE.$wrapper);
		bindCallModal(PAGE.$wrapper);
		
		PAGE.$wrapper.find('.Tabs').on('change.tabs', function() {
			PAGE.current_tab = $(this).find('.Tab.-active').data('type');
		});
		
		PAGE.$wrapper.find('.ExternalPage').on('click.sendStat', function() {
			storeStat(PAGE.organization.id, __C.STATS.ORGANIZATION_ENTITY, __C.STATS.ORGANIZATION_OPEN_SITE);
		});
		
		if (isScrollRemain(1000)) {
			PAGE.fetchAndAppendFeed(PAGE.event_types[PAGE.current_tab]);
		}
		$(window).on('scroll.uploadEvents', function() {
			if (isScrollRemain(1000)) {
				PAGE.fetchAndAppendFeed(PAGE.event_types[PAGE.current_tab]);
			}
		});
		
		if (PAGE.organization.subscribed.last_pushed.length) {
			$subscribers_scroll.scrollbar({
				onScroll: function(y) {
					var $loader,
						last_is_friend = false;
					
					if (PAGE.organization.subscribed.last_pushed.length) {
						last_is_friend = PAGE.organization.subscribed.last_pushed[PAGE.organization.subscribed.last_pushed.length - 1].is_friend
					}
					
					if (y.scroll + 200 >= y.maxScroll && !$subscribers_scroll.block_scroll) {
						$subscribers_scroll.block_scroll = true;
						$loader = __APP.BUILD.loaderBlock($subscribers_scroll);
						PAGE.organization.subscribed.fetchOrganizationSubscribers(PAGE.organization.id, 10, {
							fields: 'is_friend',
							order_by: '-is_friend,first_name'
						}, function(subscribed) {
							if (subscribed.length) {
								$subscribers_scroll.append(__APP.BUILD.subscribers(subscribed, last_is_friend));
								$subscribers_scroll.block_scroll = false;
							} else {
								$subscribers_scroll.off('scroll.onScroll');
							}
							$loader.remove();
							bindPageLinks($subscribers_scroll);
						});
					}
				}
			});
		}
	};
	
	OrganizationPage.prototype.render = function() {
		var PAGE = this,
			organization = new OneOrganization(PAGE.organization.id);
		
		organization.setData(PAGE.organization);
		__APP.changeTitle(organization.short_name);
		__APP.SIDEBAR.$subscribed_orgs.find('[data-organization_id="' + organization.id + '"]').find('.OrganizationCounter').addClass(__C.CLASSES.HIDDEN);
		PAGE.$wrapper.html(tmpl('organization-wrapper', $.extend(true, {
			background_image: organization.background_img_url ? tmpl('organization-background-image', organization) : '',
			avatar_block: __APP.BUILD.avatarBlocks(organization, {
				block_classes: ['organization_title_block'],
				avatar_classes: [__C.CLASSES.SIZES.SMALL, 'organization_avatar'],
				entity: __C.ENTITIES.ORGANIZATION
			}),
			subscribe_button: new SubscribeButton(organization.id, {
				is_checked: organization.is_subscribed,
				colors: {
					checked: __C.CLASSES.COLORS.NEUTRAL,
					unchecked: __C.CLASSES.COLORS.ACCENT,
					checked_hover: __C.CLASSES.COLORS.NEUTRAL,
					unchecked_hover: __C.CLASSES.COLORS.ACCENT
				},
				classes: [__C.CLASSES.SIZES.LOW, __C.CLASSES.SIZES.WIDE, __C.CLASSES.HOOKS.RIPPLE]
			}),
			has_address: organization.default_address ? '' : __C.CLASSES.HIDDEN,
			redact_org_button: (organization.role === OneUser.ROLE.ADMIN) ? __APP.BUILD.link({
					title: __LOCALES.ru_RU.TEXTS.BUTTON.EDIT,
					classes: ['button', __C.CLASSES.SIZES.WIDE, __C.CLASSES.COLORS.NEUTRAL, __C.CLASSES.ICON_CLASS, __C.CLASSES.ICONS.PENCIL, __C.CLASSES.HOOKS.RIPPLE],
					page: '/admin/organization/' + organization.id + '/edit/'
				}) : '',
			hidden_for_users: PAGE.is_admin ? '' : __C.CLASSES.HIDDEN,
			subscribed_blocks: __APP.BUILD.subscribers(organization.subscribed)
		}, organization)));
		
		PAGE.init();
		
		PAGE.fetchAndAppendFeed(PAGE.event_types.future);
		PAGE.fetchAndAppendFeed(PAGE.event_types.past);
		
		if (PAGE.is_admin) {
			PAGE.fetchAndAppendFeed(PAGE.event_types.delayed);
			PAGE.fetchAndAppendFeed(PAGE.event_types.canceled);
		}
	};
	
	return OrganizationPage;
}()));