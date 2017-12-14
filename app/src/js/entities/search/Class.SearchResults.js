/**
 * @requires ../Class.OneEntity.js
 */
/**
 *
 * @class SearchResults
 * @extends OneEntity
 */
SearchResults = extending(OneEntity, (function() {
	/**
	 * @typedef {function({
 *   [events]: Array<OneEvent>,
 *   [organizations]: Array<OneOrganization>
 * })} SearchResultsAJAXCallback
	 */
	/**
	 *
	 * @param {string} query_string
	 * @constructor
	 * @constructs SearchResults
	 */
	function SearchResults(query_string) {
		this.query_string = query_string;
		this.events = new EventsCollection();
		this.organizations = new OrganizationsCollection();
	}
	/**
	 *
	 * @param {string} query_string
	 * @returns {{ [q]: {string}, [tags]: {string} }}
	 */
	SearchResults.sanitizeQueryVar = function(query_string) {
		var data = {};
		if (query_string.indexOf('#') === 0) {
			data.tags = query_string.replace('#', '');
		} else {
			data.q = query_string;
		}
		return data;
	};
	/**
	 *
	 * @param {string} query_string
	 * @param {AJAXData} [ajax_data]
	 * @param {SearchResultsAJAXCallback} [success]
	 * @returns {Promise}
	 */
	SearchResults.fetchEventsAndOrganizations = function(query_string, ajax_data, success) {
		return __APP.SERVER.getData('/api/v1/search/', $.extend({}, SearchResults.sanitizeQueryVar(query_string), ajax_data), success);
	};
	/**
	 *
	 * @param {AJAXData} [events_ajax_data]
	 * @param {function(organizations: Array<OneEvent>)} [success]
	 * @returns {Promise}
	 */
	SearchResults.prototype.fetchEvents = function(events_ajax_data, success) {
		var self = this,
			ajax_data = {
				fields: 'events' + JSON.stringify($.extend({}, __APP.SERVER.validateData(events_ajax_data), {offset: this.events.length}))
			};
		
		return SearchResults.fetchEventsAndOrganizations(self.query_string, ajax_data, function(data) {
			self.setData(data);
			if (success && typeof success == 'function') {
				success.call(self, data.events);
			}
		});
	};
	/**
	 *
	 * @param {AJAXData} [organizations_ajax_data]
	 * @param {function(organizations: Array<OneOrganization>)} [success]
	 * @returns {Promise}
	 */
	SearchResults.prototype.fetchOrganizations = function(organizations_ajax_data, success) {
		var self = this,
			ajax_data = {
				fields: 'organizations' + JSON.stringify($.extend({}, __APP.SERVER.validateData(organizations_ajax_data), {offset: this.organizations.length}))
			};
		
		return SearchResults.fetchEventsAndOrganizations(self.query_string, ajax_data, function(data) {
			self.setData(data);
			if (success && typeof success == 'function') {
				success.call(self, data.organizations);
			}
		});
	};
	/**
	 *
	 * @param {AJAXData} [events_ajax_data]
	 * @param {AJAXData} [organizations_ajax_data]
	 * @param {SearchResultsAJAXCallback} [success]
	 * @returns {Promise}
	 */
	SearchResults.prototype.fetchEventsAndOrganizations = function(events_ajax_data, organizations_ajax_data, success) {
		var self = this,
			ajax_data = {
				fields: new Fields('search_score'),
				order: '-search_score'
			};
		
		if (events_ajax_data) {
			ajax_data.fields.push({
				events: $.extend({}, __APP.SERVER.validateData(events_ajax_data), {offset: this.events.length})
			});
		}
		if (organizations_ajax_data && !SearchResults.sanitizeQueryVar(self.query_string).tags) {
			ajax_data.fields.push({
				organizations: $.extend({}, __APP.SERVER.validateData(organizations_ajax_data), {offset: this.organizations.length})
			});
		}
		
		return SearchResults.fetchEventsAndOrganizations(self.query_string, ajax_data, function(data) {
			self.setData(data);
			if (isFunction(success)) {
				success.call(self, data);
			}
		});
	};
	
	return SearchResults;
}()));