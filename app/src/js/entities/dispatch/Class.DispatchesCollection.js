/**
 * @requires ../Class.EntitiesCollection.js
 * @requires Class.OneAbstractDispatch.js
 */
/**
 *
 * @class DispatchesCollection
 * @extends EntitiesCollection
 */
DispatchesCollection = extending(EntitiesCollection, (function() {
	/**
	 *
	 * @constructor
	 * @constructs DispatchesCollection
	 */
	function DispatchesCollection() {
		EntitiesCollection.call(this);
	}
	
	DispatchesCollection.prototype.collection_of = OneAbstractDispatch;
	/**
	 *
	 * @param {AJAXData} [ajax_data]
	 *
	 * @return {Promise}
	 */
	DispatchesCollection.fetchDispatches = function(ajax_data) {
		
		return __APP.SERVER.getData(OneAbstractDispatch.ENDPOINT.DISPATCHES, ajax_data);
	};
	
	return DispatchesCollection;
}()));