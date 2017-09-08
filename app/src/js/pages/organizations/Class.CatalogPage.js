/**
 * @requires ../Class.Page.js
 */
/**
 *
 * @class CatalogPage
 * @extends Page
 */
CatalogPage = extending(Page, (function() {
	/**
	 *
	 * @param {string} [city_name]
	 * @param {(string|number)} [category_id]
	 * @constructor
	 * @constructs CatalogPage
	 */
	function CatalogPage(city_name, category_id) {
		Page.apply(this);
		
		if ($.isNumeric(city_name) && !category_id) {
			category_id = city_name;
			city_name = __APP.USER.selected_city.en_name;
		}
		
		this.wrapper_tmpl = 'organizations';
		
		this.categories_ajax_data = {
			new_separated: true,
			order_by: 'order_position'
		};
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
		
		this.selected_city = new OneCity();
		this.selected_city_name = city_name || __APP.USER.selected_city.en_name;
		this.selected_category_id = category_id;
		this.cities = new CitiesCollection();
		this.categories = new CategoriesCollection();
		this.all_organizations = new OrganizationsCollection();
	}
	
	CatalogPage.prototype.fetchData = function() {
		var self = this;
		
		return this.fetching_data_defer =	this.cities.fetchCities(null, 0, 'distance,local_name', function() {
			if (self.selected_city_name) {
				self.selected_city = this.getByName(self.selected_city_name);
				self.categories_ajax_data.city_id = self.selected_city.id;
			}
		}).then(function() {
			
			return self.categories.fetchCategoriesWithOrganizations(self.categories_ajax_data, self.organizations_ajax_data, 0).done(function() {
				self.all_organizations = self.categories
					.reduce(function(collection, cat) {
						return collection.setData(cat.organizations);
					}, new OrganizationsCollection())
					.sort(function(a, b) {
						return b.subscribed_count - a.subscribed_count;
					});
			});
		}).promise();
	};
	/**
	 *
	 * @param {(string|number)} category_id
	 */
	CatalogPage.prototype.selectCategory = function(category_id) {
		this.selected_category_id = category_id ? category_id : this.selected_category_id;
		this.$view.find('.Category').filter('[data-category-id="' + this.selected_category_id + '"]').addClass(__C.CLASSES.ACTIVE);
		__APP.changeState('/organizations/at/' + this.selected_city_name + '/' + this.selected_category_id, true);
		__APP.changeTitle(this.categories.getByID(this.selected_category_id).name);
	};
	
	CatalogPage.prototype.init = function() {
		var PAGE = this,
			$categories = PAGE.$view.find('.Category'),
			$organizations_cities_select = PAGE.$view.find('#organizations_cities_select');
		
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
		
		initSelect2($organizations_cities_select);
		$organizations_cities_select.off('change.SelectCity').on('change.SelectCity', function() {
			var selected_city = PAGE.cities.getByID($(this).val());
			
			__APP.USER.selected_city = selected_city;
			__APP.changeState('/organizations/at/' + selected_city.en_name, true, true);
		});
		
		if (PAGE.selected_city_name) {
			$organizations_cities_select.select2('val', PAGE.cities.getByName(PAGE.selected_city_name).id);
		}
		
		PAGE.$view.find('.ShowAllOrganizations').off('click.showAllOrganizations').on('click.showAllOrganizations', function() {
			$categories.removeClass(__C.CLASSES.ACTIVE).siblings('.SubcategoryWrap').height(0);
			PAGE.selected_category_id = undefined;
			
			__APP.changeState('/organizations/at/' + PAGE.selected_city_name, true);
			__APP.changeTitle(PAGE.default_title);
			PAGE.$wrapper.html(__APP.BUILD.organizationCard(PAGE.all_organizations));
			bindOrganizationsEvents();
		});
		
		$categories.off('click.selectCategory').on('click.selectCategory', function() {
			var $this = $(this),
				category_id = $this.data('category-id'),
				$wrap = $this.next('.SubcategoryWrap'),
				is_parent_category = !!$wrap.length,
				is_this_active = $this.hasClass(__C.CLASSES.ACTIVE);
			
			$this.parent().find('.Category').not($this).removeClass(__C.CLASSES.ACTIVE).filter('.SubcategoryWrap').height(0);
			if (is_parent_category) {
				$wrap.height(is_this_active ? 0 : $wrap.children().outerHeight());
				$this.toggleClass(__C.CLASSES.ACTIVE);
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
		this.$view.find('#organizations_cities_select').html(tmpl('option', this.cities.map(function(city) {
			return {
				val: city.id,
				display_name: city.local_name
			};
		})));
		this.$view.find('.OrganizationsCategoriesScroll').html(__APP.BUILD.organisationsCategoriesItems(this.categories));
		this.$wrapper.html(__APP.BUILD.organizationCard(this.selected_category_id ? this.categories.getByID(this.selected_category_id).organizations : this.all_organizations));
		
		if ((window.location.pathname == '/organizations' || window.location.pathname == '/organizations/') && this.selected_city_name) {
			__APP.changeState('/organizations/at/' + this.selected_city_name, true);
		}
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
	
	return CatalogPage;
}()));