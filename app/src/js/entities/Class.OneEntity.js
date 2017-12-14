/**
 * @requires Class.Data.js
 * @requires Class.Fields.js
 */
/**
 *
 * @abstract
 * @class
 * @extends Data
 * @implements EntityInterface
 */
OneEntity = extending(Data, (function() {
	/**
	 *
	 * @constructor
	 * @constructs OneEntity
	 */
	function OneEntity() {}
	
	OneEntity.prototype.ID_PROP_NAME = 'id';
	
	OneEntity.prototype.fetch = function(fields) {};
	
	return OneEntity;
}()));
