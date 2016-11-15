/**
 * @requires ../Class.Page.js
 */
/**
 *
 * @constructor
 * @augments Page
 */
function OnboardingPage() {
	Page.apply(this, arguments);
	this.ajax_data = {
		length: 30,
		offset: 0,
		fields: 'img_small_url'
	};
	this.disable_upload = false;
	this.block_scroll = true;
}
OnboardingPage.extend(Page);

OnboardingPage.prototype.init = function() {
	bindRippleEffect(this.$wrapper);
	bindPageLinks(this.$wrapper);
	this.$wrapper.find('.Link').on('click', function() {
		if($(this).is('.SkipOnboarding')){
			cookies.setItem('skip_onboarding', 1, moment().add(7, 'd')._d);
		}
		__APP.SIDEBAR.updateSubscriptions();
	});
};

OnboardingPage.prototype.bindSubscriptions = function() {
	this.$wrapper.find(".OnboardingOrgItem").not('.-Handled_OnboardingOrgItem').on('click', function() {
		var $this = $(this);
		if ($this.hasClass(__C.CLASSES.NEW_ACTIVE)) {
			__APP.USER.unsubscribeFromOrganization($this.data("organization_id"));
		} else {
			__APP.USER.subscribeToOrganization($this.data("organization_id"));
		}
		$this.toggleClass(__C.CLASSES.NEW_ACTIVE);
	}).addClass('-Handled_OnboardingOrgItem');
};

OnboardingPage.prototype.render = function() {
	var PAGE = this,
		$loader = tmpl('loader', {});
	
	function appendRecommendations(organizations) {
		$loader.detach();
		if (organizations.length) {
			PAGE.$wrapper.find(".RecommendationsWrapper").last().append(tmpl("onboarding-recommendation", organizations));
			PAGE.bindSubscriptions();
			PAGE.block_scroll = false;
		} else {
			PAGE.disable_upload = true;
		}
	}
	
	PAGE.$wrapper.html(tmpl("onboarding-main", {}));
	PAGE.init();
	PAGE.$wrapper.find('.RecommendationsWrapper').last().append($loader);
	OrganizationsCollection.fetchRecommendations(PAGE.ajax_data, appendRecommendations);
	PAGE.$wrapper.find(".RecommendationsScrollbar").scrollbar({
		onScroll: function(y, x) {
			if (y.scroll == y.maxScroll && !PAGE.disable_upload && !PAGE.block_scroll) {
				PAGE.block_scroll = true;
				PAGE.$wrapper.find('.RecommendationsWrapper').last().append($loader);
				OrganizationsCollection.fetchRecommendations(PAGE.ajax_data, appendRecommendations);
			}
		}
	});
};