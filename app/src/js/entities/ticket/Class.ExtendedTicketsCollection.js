/**
 * @requires ../Class.EntitiesCollection.js
 * @requires Class.OneExtendedTicket.js
 */
/**
 *
 * @class ExtendedTicketsCollection
 * @extends EntitiesCollection
 */
ExtendedTicketsCollection = extending(EntitiesCollection, (function() {
	/**
	 *
	 * @constructor
	 * @constructs ExtendedTicketsCollection
	 */
	function ExtendedTicketsCollection() {
		EntitiesCollection.call(this);
	}
	
	ExtendedTicketsCollection.prototype.collection_of = OneExtendedTicket;
	
	return ExtendedTicketsCollection;
}()));