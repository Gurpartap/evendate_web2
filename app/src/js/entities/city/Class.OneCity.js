/**
 * @requires ../Class.OneEntity.js
 */
/**
 * @class OneCity
 * @extends OneEntity
 */
OneCity = extending(OneEntity, (function() {
	/**
	 *
	 * @param {(string|number)} [city_id]
	 * @constructor
	 * @constructs OneCity
	 *
	 * @property {(string|number)} id=0
	 * @property {?string} en_name
	 * @property {?number} country_id
	 * @property {?string} local_name
	 * @property {?number} timediff_seconds
	 */
	function OneCity(city_id) {
		this.id = setDefaultValue(city_id, 0);
		
		this.en_name = null;
		this.country_id = null;
		this.local_name = null;
		this.timediff_seconds = null;
	}
	
	return OneCity;
}()));