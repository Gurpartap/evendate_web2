/**
 * @requires ../Class.Page.js
 */
/**
 *
 * @constructor
 * @augments Page
 * @param {(string|number)} [category_id]
 */
function CatalogPage(category_id) {
	var self = this;
	Page.apply(this);
	
	this.wrapper_tmpl = 'organizations';
	
	this.categories_ajax_data = {order_by: 'order_position'};
	this.organizations_ajax_data = {
		fields: [
			'background_small_img_url',
			'img_small_url',
			'is_subscribed',
			'subscribed_count',
			'privileges'
		],
		order_by: '-subscribed_count'
	};
	
	this.default_title = 'Организации';
	
	this.is_loading = true;
	this.selected_category_id = category_id;
	this.categories = new CategoriesCollection();
	this.all_organizations = new OrganizationsCollection();
	this.categories.fetchCategoriesWithOrganizations(this.categories_ajax_data, this.organizations_ajax_data, 0, function() {
		self.all_organizations = self.categories
			.reduce(function(collection, cat) {
				return collection.setData(cat.organizations);
			}, new OrganizationsCollection())
			.sort(function(a, b) {
				return b.subscribed_count - a.subscribed_count;
			});
		Page.triggerRender();
	});
}
CatalogPage.extend(Page);
/**
 *
 * @param {(string|number)} category_id
 */
CatalogPage.prototype.selectCategory = function(category_id) {
	this.selected_category_id = category_id ? category_id : this.selected_category_id;
	this.$view.find('.Category').filter('[data-category-id="' + this.selected_category_id + '"]').addClass(__C.CLASSES.NEW_ACTIVE);
	__APP.changeState('/organizations/' + this.selected_category_id, true);
	__APP.changeTitle(this.categories.getByID(this.selected_category_id).name);
};

CatalogPage.prototype.init = function() {
	var PAGE = this,
		$categories = PAGE.$view.find('.Category');
	
	function bindOrganizationsEvents() {
		bindRippleEffect(PAGE.$view);
		bindPageLinks(PAGE.$view);
	}
	
	$(window).on('subscribe.updateCatalog', function(e, id) {
		var org = PAGE.all_organizations.getByID(id);
		org.is_subscribed = true;
		org.subscribed_count++;
	});
	$(window).on('unsubscribe.updateCatalog', function(e, id) {
		var org = PAGE.all_organizations.getByID(id);
		org.is_subscribed = false;
		org.subscribed_count--;
	});
	
	bindOrganizationsEvents();
	
	PAGE.$view.find('.OrganizationsCategoriesScroll').scrollbar({disableBodyScroll: true});
	
	PAGE.$view.find('.ShowAllOrganizations').on('click.showAllOrganizations', function() {
		$categories.removeClass(__C.CLASSES.NEW_ACTIVE).siblings('.SubcategoryWrap').height(0);
		PAGE.selected_category_id = undefined;
		
		__APP.changeState('/organizations', true);
		__APP.changeTitle(PAGE.default_title);
		PAGE.$wrapper.html(__APP.BUILD.organizationCard(PAGE.all_organizations));
		bindOrganizationsEvents();
	});
	
	$categories.on('click.selectCategory', function() {
		var $this = $(this),
			category_id = $this.data('category-id'),
			$wrap = $this.next('.SubcategoryWrap'),
			is_parent_category = !!$wrap.length,
			is_this_active = $this.hasClass(__C.CLASSES.NEW_ACTIVE);
		
		$this.parent().find('.Category').not($this).removeClass(__C.CLASSES.NEW_ACTIVE).filter('.SubcategoryWrap').height(0);
		if (is_parent_category) {
			$wrap.height(is_this_active ? 0 : $wrap.children().outerHeight());
			$this.toggleClass(__C.CLASSES.NEW_ACTIVE);
		} else {
			if (is_this_active) {
				PAGE.categories = new CategoriesCollection();
				PAGE.categories.fetchCategoriesWithOrganizations(PAGE.categories_ajax_data, PAGE.organizations_ajax_data, 0, function() {
					PAGE.render();
				});
			} else {
				PAGE.selectCategory(category_id);
				PAGE.$wrapper.html(__APP.BUILD.organizationCard(PAGE.categories.getByID(category_id).organizations));
				bindOrganizationsEvents();
			}
		}
	});
};

CatalogPage.prototype.render = function() {
	this.$view.find('.OrganizationsCategoriesScroll').html(__APP.BUILD.organisationsCategoriesItems(this.categories));
	this.$wrapper.html(__APP.BUILD.organizationCard(this.selected_category_id ? this.categories.getByID(this.selected_category_id).organizations : this.all_organizations));
	
	if (this.selected_category_id) {
		this.selectCategory(this.selected_category_id);
	} else {
		__APP.changeTitle(this.default_title);
	}
	this.init();
};

CatalogPage.prototype.destroy = function() {
	$(window).off('subscribe.updateCatalog unsubscribe.updateCatalog');
};