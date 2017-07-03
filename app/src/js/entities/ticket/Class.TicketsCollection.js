/**
 * @requires ../Class.EntitiesCollection.js
 * @requires Class.OneTicket.js
 */
/**
 *
 * @class TicketsCollection
 * @extends EntitiesCollection
 */
TicketsCollection = extending(EntitiesCollection, (function() {
	/**
	 *
	 * @constructor
	 * @constructs TicketsCollection
	 */
	function TicketsCollection() {
		EntitiesCollection.call(this);
	}
	
	TicketsCollection.prototype.collection_of = OneTicket;
	
	return TicketsCollection;
}()));