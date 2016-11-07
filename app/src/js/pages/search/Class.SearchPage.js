/**
 * @requires ../Class.Page.js
 */
/**
 *
 * @constructor
 * @augments Page
 * @param {string} search
 */
function SearchPage(search) {
	Page.apply(this, arguments);
	
	this.page_title = 'Поиск';
	this.$search_bar_input = $('#search_bar_input');
	this.search_string = decodeURIComponent(search);
	this.events_ajax_data = {
		length: 20,
		fields: [
			'image_horizontal_medium_url',
			'detail_info_url',
			'is_favorite',
			'nearest_event_date',
			'can_edit',
			'location',
			'registration_required',
			'registration_till',
			'is_free',
			'min_price',
			'favored_users_count',
			'organization_name',
			'organization_short_name',
			'organization_logo_small_url',
			'description',
			'favored',
			'is_same_time',
			'tags',
			'dates'
		],
		filters: "future=true"
	};
	this.organizations_ajax_data = {
		length: 30,
		fields: [
			'subscribed_count',
			'img_small_url'
		]
	};
	this.search_results = new SearchResults(this.search_string);
	this.is_loading = true;
	this.search_results.fetchEventsAndOrganizations(this.events_ajax_data, this.organizations_ajax_data, Page.triggerRender);
}
SearchPage.extend(Page);
/**
 *
 * @param {(OneOrganization|Array<OneOrganization>|OrganizationsCollection)} organizations
 * @returns {jQuery}
 */
SearchPage.buildOrganizationItems = function(organizations) {
	return __APP.BUILD.organizationItems(organizations, {
		block_classes: ['-show'],
		avatar_classes: ['-size_50x50', '-rounded'],
		counter_classes: [__C.CLASSES.NEW_HIDDEN]
	})
};

SearchPage.prototype.render = function() {
	var PAGE = this,
		data = {},
		$organizations_scrollbar;
	
	this.$search_bar_input.val(this.search_string);
	
	function bindFeedEvents($parent) {
		bindAddAvatar($parent);
		trimAvatarsCollection($parent);
		bindRippleEffect($parent);
		Modal.bindCallModal($parent);
		bindPageLinks($parent);
		
		$parent.find('.HideEvent').addClass(__C.CLASSES.NEW_HIDDEN);
	}
	
	if (this.search_results.events.length == 0) {
		data.events = tmpl('search-no-events', {});
	} else {
		data.events = __APP.BUILD.feedEventCards(this.search_results.events);
	}
	if (this.search_results.organizations.length == 0) {
		data.no_organizations = __C.CLASSES.NEW_HIDDEN;
	} else {
		data.organizations = SearchPage.buildOrganizationItems(this.search_results.organizations);
	}
	
	this.$wrapper.append(tmpl('search-wrapper', data));
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
	bindFeedEvents(this.$wrapper);
};