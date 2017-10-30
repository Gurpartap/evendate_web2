/**
 * @requires Class.UsersCollection.js
 */
/**
 *
 * @class OrganizationSubscribersCollection
 * @extends UsersCollection
 */
OrganizationSubscribersCollection = extending(UsersCollection, (function() {
	/**
	 *
	 * @param {(number|string)} organization_id
	 *
	 * @constructor
	 * @constructs UsersCollection
	 *
	 * @property {(number|string)} organization_id
	 */
	function OrganizationSubscribersCollection(organization_id) {
		UsersCollection.call(this);
		
		Object.defineProperty(this, 'organization_id', {
			value: organization_id
		});
	}
	
	/**
	 *
	 * @param {(string|number)} organization_id
	 * @param {UsersCollectionAJAXData} ajax_data
	 * @param {AJAXCallback} [success]
	 * @returns {jqPromise}
	 */
	OrganizationSubscribersCollection.fetchSubscribers = function(organization_id, ajax_data, success) {
		ajax_data = ajax_data ? ajax_data : {};
		
		return __APP.SERVER.getData('/api/v1/organizations/' + organization_id, {fields: new Fields({subscribed: ajax_data})}, function(data) {
			if (isFunction(success)) {
				success(data[0].subscribed);
			}
		}).then(function(data) {
			
			return data[0].subscribed;
		});
	};
	/**
	 *
	 * @param {(Fields|Array<string>|string)} [fields]
	 * @param {(number|string)} [length]
	 * @param {(Array<string>|string)} [order_by]
	 * @param {AJAXCallback} [success]
	 *
	 * @returns {jqPromise}
	 */
	OrganizationSubscribersCollection.prototype.fetchSubscribers = function(fields, length, order_by, success) {
		var self = this;
		
		return OrganizationSubscribersCollection.fetchSubscribers(this.organization_id, {
			fields: fields || undefined,
			offset: this.length || undefined,
			length: length || undefined,
			order_by: order_by || undefined
		}, function(subscribed) {
			
			self.setData(subscribed);
			if (isFunction(success)) {
				success.call(self, self.__last_pushed);
			}
		}).then(function() {
			
			return self.__last_pushed;
		});
	};
	/**
	 *
	 * @param {(Fields|Array<string>|string)} [fields]
	 * @param {(Array<string>|string)} [order_by]
	 * @param {AJAXCallback} [success]
	 *
	 * @returns {jqPromise}
	 */
	OrganizationSubscribersCollection.prototype.fetchAllSubscribers = function(fields, order_by, success) {
		var self = this;
		
		return OrganizationSubscribersCollection.fetchSubscribers(this.organization_id, {
			fields: fields || undefined,
			offset: 0,
			length: ServerConnection.MAX_ENTITIES_LENGTH,
			order_by: order_by || undefined
		}, function(subscribed) {
			
			self.setData(subscribed);
			if (isFunction(success)) {
				success.call(self, self.__last_pushed);
			}
		}).then(function() {
			
			return self.__last_pushed;
		});
	};
	/**
	 *
	 * @param {ServerExports.EXPORT_EXTENSION} [format=xlsx]
	 *
	 * @return {jqPromise}
	 */
	OrganizationSubscribersCollection.prototype.export = function(format) {
		
		return (new ServerExports()).organizationSubscribers(this.organization_id, format);
	};
	
	return OrganizationSubscribersCollection;
}()));