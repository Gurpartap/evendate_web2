/**
 * @requires ../Class.Page.js
 */
/**
 *
 * @class SearchPage
 * @extends Page
 */
SearchPage = extending(Page, (function() {
	/**
	 *
	 * @param {string} search
	 * @constructor
	 * @constructs SearchPage
	 */
	function SearchPage(search) {
		Page.call(this);
		
		this.page_title = 'Поиск';
		this.$search_bar_input = $('#search_bar_input');
		this.search_string = decodeURIComponent(search);
		this.events_ajax_data = {
			length: 10,
			fields: FeedPage.fields.copy(),
			order_by: 'nearest_event_date,-first_event_date'
		};
		this.organizations_ajax_data = {
			length: 30,
			fields: new Fields([
				'subscribed_count',
				'img_small_url'
			])
		};
		this.past_events = false;
		this.search_results = new SearchResults(this.search_string);
	}
	/**
	 *
	 * @param {(OneOrganization|Array<OneOrganization>|OrganizationsCollection)} organizations
	 * @returns {jQuery}
	 */
	SearchPage.buildOrganizationItems = function(organizations) {
		return __APP.BUILD.organizationItems(organizations, {
			block_classes: ['-show'],
			avatar_classes: ['-size_50x50', '-rounded'],
			counter_classes: [__C.CLASSES.HIDDEN]
		})
	};
	/**
	 *
	 * @param {(OneEvent|Array<OneEvent>|EventsCollection)} events
	 * @returns {jQuery}
	 */
	SearchPage.buildEventCards = function(events) {
		var $events = $();
		if (events.length == 0) {
			$events = tmpl('search-no-events', {});
		} else {
			events.forEach(function(event) {
				if(event.nearest_event_date == undefined && !this.past_events){
					$events = $events.add(tmpl('divider', {title: 'Прошедшие события'}));
					this.past_events = true;
				}
				$events = $events.add(__APP.BUILD.eventCards(event));
			});
		}
		return $events
	};
	
	SearchPage.prototype.fetchData = function() {
		return this.fetching_data_defer = this.search_results.fetchEventsAndOrganizations(this.events_ajax_data, this.organizations_ajax_data);
	};
	
	SearchPage.prototype.init = function() {
		var PAGE = this,
			$window = $(window),
			$organizations_scrollbar;
		
		function bindFeedEvents($parent) {
			trimAvatarsCollection($parent);
			bindRippleEffect($parent);
			__APP.MODALS.bindCallModal($parent);
			bindPageLinks($parent);
			
			$parent.find('.HideEvent').remove();
		}
		
		$organizations_scrollbar = this.$wrapper.find('.SearchOrganizationsScrollbar').scrollbar({
			disableBodyScroll: true,
			onScroll: function(y) {
				if (y.scroll == y.maxScroll) {
					PAGE.search_results.fetchOrganizations(PAGE.organizations_ajax_data, function(organizations) {
						if (organizations.length) {
							$organizations_scrollbar.append(SearchPage.buildOrganizationItems(organizations));
						} else {
							$organizations_scrollbar.off('scroll.onScroll');
						}
						bindPageLinks($organizations_scrollbar);
					});
				}
			}
		});
		$window.off('scroll.upload' + PAGE.constructor.name);
		$window.on('scroll.upload' + PAGE.constructor.name, function() {
			if ($window.height() + $window.scrollTop() + 200 >= $(document).height() && !PAGE.block_scroll) {
				PAGE.block_scroll = true;
				PAGE.search_results.fetchEvents(PAGE.events_ajax_data, function(events) {
					var $events;
					if(events.length){
						$events = SearchPage.buildEventCards(PAGE.search_results.events.__last_pushed);
						PAGE.$wrapper.find('.SearchEvents').append($events);
						bindFeedEvents($events);
						PAGE.block_scroll = false;
					} else {
						$window.off('scroll.upload' + PAGE.constructor.name);
					}
				});
			}
		});
		bindFeedEvents(this.$wrapper);
	};
	
	SearchPage.prototype.render = function() {
		var data = {};
		
		$('.TopBarOverlay').addClass('-open_search_bar');
		this.$search_bar_input.val(this.search_string);
		
		data.events = SearchPage.buildEventCards(this.search_results.events);
		if (this.search_results.organizations.length == 0) {
			data.no_organizations = __C.CLASSES.HIDDEN;
		} else {
			data.organizations = SearchPage.buildOrganizationItems(this.search_results.organizations);
		}
		
		this.$wrapper.append(tmpl('search-wrapper', data));
		this.init();
	};
	
	SearchPage.prototype.destroy = function() {
		$('.TopBarOverlay').removeClass('-open_search_bar');
		this.$search_bar_input.val('');
	};
	
	return SearchPage;
}()));