/**
 * @requires ../Class.Page.js
 */
/**
 *
 * @constructor
 * @augments Page
 * @param {(string|number)} organization_id
 */
function OrganizationPage(organization_id) {
	/**
	 * @typedef {object} OrganizationPage~EventType
	 * @property {string} name
	 * @property {string} scroll_event
	 * @property {string} sort_date_type
	 * @property {string} last_date
	 * @property {boolean} disable_upload
	 */
	var self = this,
		event_type_default = {
			last_date: '',
			disable_upload: false
		};
	Page.apply(this, arguments);
	this.fields = [
		'img_small_url',
		'background_medium_img_url',
		'description',
		'site_url',
		'is_subscribed',
		'privileges',
		'default_address',
		'subscribed_count',
		'subscribed{fields:"is_friend",order_by:"-is_friend,first_name",length:10}'
	];
	this.events_fields = [
		'image_horizontal_medium_url',
		'favored_users_count',
		'is_favorite',
		'favored{length:5}',
		'dates'
	];
	
	/**
	 * @name OrganizationPage#event_types
	 * @type object
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
	
	this.events_load = 0;
	this.is_loading = true;
	this.future_events = new FutureEventsCollection();
	this.past_events = new PastEventsCollection();
	this.delayed_events = new DelayedEventsCollection();
	this.canceled_events = new CanceledEventsCollection();
	this.organization = new OneOrganization(organization_id);
	this.organization.fetchOrganization(this.fields, function(data) {
		self.is_admin = self.organization.role != OneUser.ROLE.USER;
		self.max_events_load = self.is_admin ? 4 : 2;
		Page.triggerRender();
	});
}
OrganizationPage.extend(Page);
/**
 *
 * @param {OrganizationPage~EventType} type
 * @param {Array<OneEvent>} events
 * @returns {jQuery}
 */
OrganizationPage.prototype.appendEvents = function(type, events) {
	var $wrapper = this.$wrapper.find('.' + type.name.capitalize() + 'Events'),
		$output;
	
	if (events.length) {
		$output = __APP.BUILD.organizationFeedEvents(events, type);
	} else {
		type.disable_upload = true;
		$(window).off(type.scroll_event);
		$output = tmpl('organization-feed-no-event', {
			text: 'Больше событий нет :('
		});
	}
	$wrapper.append($output);
	if ($wrapper.hasClass(__C.CLASSES.NEW_ACTIVE)) {
		$wrapper.parent().height($wrapper.height());
	}
	return $output;
};
/**
 *
 * @param {OrganizationPage~EventType} type
 */
OrganizationPage.prototype.bindUploadEventsOnScroll = function(type) {
	var PAGE = this,
		$window = $(window),
		scrollEvent = function() {
			if ($window.height() + $window.scrollTop() + 200 >= $(document).height() && !type.disable_upload) {
				$window.off(type.scroll_event);
				PAGE[type.name + '_events'].fetchOrganizationsFeed(PAGE.organization.id, PAGE.events_fields, 10, function(events) {
					PAGE.bindFeedEvents(PAGE.appendEvents(type, events));
					$window.on(type.scroll_event, scrollEvent);
				});
			}
		};
	
	if (!type.disable_upload) {
		$window.on(type.scroll_event, scrollEvent);
	}
};

OrganizationPage.prototype.bindFeedEvents = function($parent) {
	bindRippleEffect($parent);
	bindAddAvatar($parent);
	trimAvatarsCollection($parent);
	Modal.bindCallModal($parent);
	bindPageLinks($parent);
};

OrganizationPage.prototype.init = function() {
	var PAGE = this,
		$subscribers_scroll;
	bindTabs(PAGE.$wrapper);
	PAGE.bindFeedEvents(PAGE.$wrapper);
	Modal.bindCallModal(PAGE.$wrapper);
	
	PAGE.$wrapper.find('.Tabs').on('change.tabs', function() {
		var scroll_events = [];
		$.each(PAGE.event_types, function() {
			scroll_events.push(this.scroll_event);
		});
		$(window).off(scroll_events.join(' '));
		PAGE.bindUploadEventsOnScroll(PAGE.event_types[$(this).find('.Tab.-active').data('type')]);
	});
	
	PAGE.$wrapper.find('.ExternalPage').on('click.sendStat', function() {
		storeStat(PAGE.organization.id, __C.STATS.ORGANIZATION_ENTITY, __C.STATS.ORGANIZATION_OPEN_SITE);
	});
	
	$subscribers_scroll = PAGE.$wrapper.find('.SubscribersScroll').scrollbar({
		disableBodyScroll: true,
		onScroll: function(y) {
			if (y.scroll == y.maxScroll) {
				PAGE.organization.subscribed.fetchOrganizationSubscribers(PAGE.organization.id, 10, {
					fields: 'is_friend',
					order_by: '-is_friend,first_name'
				}, function(subscribed) {
					if (subscribed.length) {
						$subscribers_scroll.append(__APP.BUILD.subscribers(subscribed, PAGE.organization.subscribed[PAGE.organization.subscribed.length - 1].is_friend));
					} else {
						$subscribers_scroll.off('scroll.onScroll');
					}
					bindPageLinks($subscribers_scroll);
				});
			}
		}
	});
};

OrganizationPage.prototype.render = function() {
	var PAGE = this;
	
	__APP.changeTitle(PAGE.organization.short_name);
	$('.SidebarOrganizationsList').find('[data-organization_id="' + PAGE.organization.id + '"]').find('.OrganizationCounter').addClass('-hidden');
	
	PAGE.$wrapper.html(tmpl('organization-wrapper', $.extend(true, {
		background_image: PAGE.organization.background_img_url ? tmpl('organization-background-image', PAGE.organization) : '',
		subscribe_button: new SubscribeButton(PAGE.organization.id, PAGE.organization.is_subscribed, {
			colors: {
				subscribe: '-color_accent',
				unsubscribe: '-color_neutral',
				subscribed: '-color_neutral'
			},
			classes: ['-size_low', '-fill', 'RippleEffect']
		}),
		has_address: PAGE.organization.default_address ? '' : '-hidden',
		redact_org_button: (PAGE.organization.role == OneUser.ROLE.ADMIN) ? __APP.BUILD.link({
			title: 'Изменить',
			classes: ['button', '-fill', '-color_neutral', 'fa_icon', 'fa-pencil', 'RippleEffect'],
			page: 'organization/' + PAGE.organization.id + '/edit/'
		}) : '',
		hidden_for_users: PAGE.is_admin ? '' : '-hidden',
		subscribed_blocks: __APP.BUILD.subscribers(PAGE.organization.subscribed)
	}, PAGE.organization)));
	
	PAGE.$wrapper.on('events_load.FutureEvents events_load.PastEvents events_load.DelayedEvents events_load.CanceledEvents', function(e) {
		if (e.namespace == 'FutureEvents') {
			PAGE.init();
			PAGE.bindUploadEventsOnScroll(PAGE.event_types.future);
		}
		PAGE.bindFeedEvents(PAGE.$wrapper.find('.' + e.namespace));
		if (++PAGE.events_load == PAGE.max_events_load) {
			PAGE.$wrapper.off('events_load');
		}
	});
	
	
	PAGE.future_events.fetchOrganizationsFeed(PAGE.organization.id, PAGE.events_fields, 10, function(future_events) {
		PAGE.appendEvents(PAGE.event_types.future, future_events);
		PAGE.$wrapper.trigger('events_load.FutureEvents');
	});
	
	PAGE.past_events.fetchOrganizationsFeed(PAGE.organization.id, PAGE.events_fields, 10, function(past_events) {
		PAGE.appendEvents(PAGE.event_types.past, past_events);
		PAGE.$wrapper.trigger('events_load.PastEvents');
	});
	
	if (PAGE.is_admin) {
		PAGE.delayed_events.fetchOrganizationsFeed(PAGE.organization.id, PAGE.events_fields, 10, function(delayed_events) {
			PAGE.appendEvents(PAGE.event_types.delayed, delayed_events);
			PAGE.$wrapper.trigger('events_load.DelayedEvents');
		});
		
		PAGE.canceled_events.fetchOrganizationsFeed(PAGE.organization.id, PAGE.events_fields, 10, function(canceled_events) {
			PAGE.appendEvents(PAGE.event_types.canceled, canceled_events);
			PAGE.$wrapper.trigger('events_load.CanceledEvents');
		});
	}
};