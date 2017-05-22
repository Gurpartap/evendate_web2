/**
 * @requires Class.AbstractModal.js
 */
/**
 * @class CityChooseModal
 * @extends AbstractModal
 */
CityChooseModal = extending(AbstractModal, (function() {
	/**
	 *
	 * @param {(Array<OneCity>|CitiesCollection)} [cities]
	 * @constructor
	 * @constructs CityChooseModal
	 *
	 * @property {CitiesCollection} cities
	 */
	function CityChooseModal(cities) {
		AbstractModal.call(this, AbstractModal.STYLES.OK_ONLY);
		this.cities = cities;
		this.title = 'Выбор города';
	}
	/**
	 *
	 * @return {CityChooseModal}
	 */
	CityChooseModal.prototype.show = function() {
		var self = this;
		
		if(!this.cities){
			this.cities = new CitiesCollection();
			this.cities.fetchCities('timediff_seconds', 0, 'distance,local_name', function() {
				self.__show();
			});
			return this;
		}
		
		this.__show();
		return this;
		
	};
	/**
	 *
	 * @return {CityChooseModal}
	 */
	CityChooseModal.prototype.render = function() {
		this.content = tmpl('modal-city-choose-content', {
			cities: tmpl('option', this.cities.map(function(city) {
				return {
					val: city.id,
					display_name: city.local_name
				};
			}))
		});
		this.__render({
			classes: [__C.CLASSES.FLOATING_MATERIAL],
			width: 400
		});
		
		return this;
	};
	/**
	 *
	 * @return {CityChooseModal}
	 */
	CityChooseModal.prototype.init = function() {
		this.content.find('#city_choose_modal_select').select2({
			containerCssClass: 'form_select2',
			dropdownCssClass: 'form_select2_drop'
		}).select2('val', 1);
		this.__init();
		
		return this;
	};
	/**
	 *
	 * @return {CityChooseModal}
	 */
	CityChooseModal.prototype.hide = function() {
		__APP.USER.selected_city = this.cities.getByID(this.content.find('#city_choose_modal_select').val());
		try {
			localStorage.setItem('selected_city', JSON.stringify(__APP.USER.selected_city));
		} catch (e) {}
		this.__hide();
		__APP.reload();
		
		return this;
	};
	
	return CityChooseModal;
}()));