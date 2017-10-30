/**
 * @requires Class.ExtendedTicketsCollection.js
 */
/**
 *
 * @class MyTicketsCollection
 * @extends ExtendedTicketsCollection
 */
MyTicketsCollection = extending(ExtendedTicketsCollection, (function() {
	/**
	 *
	 * @constructor
	 * @constructs MyTicketsCollection
	 */
	function MyTicketsCollection() {
		ExtendedTicketsCollection.call(this);
	}
	
	/**
	 *
	 * @param {AJAXData} [ajax_data]
	 * @param {AJAXCallback} [success]
	 *
	 * @return {jqPromise}
	 */
	MyTicketsCollection.fetchTickets = function(ajax_data, success) {
		ajax_data = ajax_data ? ajax_data : {};
		var events_ajax_data = ExtendedTicketsCollection.convertTicketFieldsToEventAjaxData(ajax_data.fields);
		
		return __APP.SERVER.getData('/api/v1/events', $.extend(events_ajax_data, {
			length: ajax_data.length,
			offset: ajax_data.offset,
			registered: true
		}), success);
	};
	/**
	 *
	 * @param {(Fields|string)} [fields]
	 * @param {number} [length]
	 * @param {(string|Array)} [order_by]
	 * @param {AJAXCallback} [success]
	 *
	 * @return {jqPromise}
	 */
	MyTicketsCollection.prototype.fetchTickets = function(fields, length, order_by, success) {
		var self = this;
		
		return MyTicketsCollection.fetchTickets({
			fields: fields || undefined,
			offset: this.length,
			length: length || undefined,
			order_by: order_by || undefined
		}).then(function(data) {
			self.setData(data.map(ExtendedTicketsCollection.extractTicketsFromEvent).reduce(function(collection, current){
				collection.push.apply(collection, current);
				
				return collection;
			}, []));
			
			if (isFunction(success)) {
				success.call(self, self.__last_pushed);
			}
			return self.__last_pushed;
		});
	};
	
	return MyTicketsCollection;
}())); 