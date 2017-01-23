/**
 * @typedef {object} StatisticsUnit
 * @property {number} time_value
 * @property {number} value
 */
/**
 * @typedef {StatisticsUnit} StatisticsConversionUnit
 * @property {number} to
 * @property {number} with
 */
/**
 * @typedef {object} StatisticsAudience
 * @property {Array<{name: {string}, count: {number}}>} devices
 * @property {Array<{gender: {?string}, count: {number}}>} gender
 */
/**
 * @typedef {object} StatisticsStdData
 * @property {Statistics.SCALES} scale
 * @property {string} since
 * @property {string} till
 */
/**
 *
 * @constructor
 * @implements EntityInterface
 */
function Statistics() {
	this.id = 0;
	/**
	 * @type {Array<StatisticsUnit>}
	 */
	this.view = [];
	/**
	 * @type {Array<StatisticsUnit>}
	 */
	this.fave = [];
	/**
	 * @type {Array<StatisticsUnit>}
	 */
	this.unfave = [];
	/**
	 * @type {Array<StatisticsUnit>}
	 */
	this.notifications_sent = [];
	
	this.dynamics = {
		/**
		 * @type {Array<StatisticsUnit>}
		 */
		view: [],
		/**
		 * @type {Array<StatisticsUnit>}
		 */
		fave: []
	};
}
/**
 *
 * @param {(Array|object)} data
 * @returns {Statistics}
 */
Statistics.prototype.setData = function(data) {
	return $.extend(true, this, (data instanceof Array) ? data[0] : data);
};
/**
 * @const
 * @enum {string}
 */
Statistics.SCALES = {
	MINUTE: 'minute',
	HOUR: 'hour',
	DAY: 'day',
	WEEK: 'week',
	MONTH: 'month',
	YEAR: 'year',
	OVERALL: 'overall'
};
/**
 * @const
 * @enum {string}
 */
Statistics.ENTITIES = {
	EVENT: 'events',
	ORGANIZATION: 'organizations'
};
/**
 * @static
 * @param {Statistics.ENTITIES} entity
 * @param {(string|number)} id
 * @param {Statistics.SCALES} scale
 * @param {(string|object|boolean)} range
 * @param {string} range.since
 * @param {string} [range.till]
 * @param {(Array<string>|object<string, StatisticsStdData>)} statistics_fields
 * @param {?StatisticsStdData} [dynamics_ajax_data]
 * @param {(Array<string>|string)} [dynamics_ajax_data.fields]
 * @param {function} [success]
 * @return {jqPromise}
 */
Statistics.fetchStatistics = function(entity, id, scale, range, statistics_fields, dynamics_ajax_data, success) {
	var data = {
		scale: scale,
		fields: []
	};
	if (statistics_fields instanceof Array) {
		data.fields = data.fields.concat(statistics_fields);
	} else {
		$.each(statistics_fields, function(field, options) {
			if (Object.getOwnPropertyNames(options).length) {
				data.fields.push(field + JSON.stringify(options));
			} else {
				data.fields.push(field);
			}
		});
	}
	if (dynamics_ajax_data) {
		data.fields.push('dynamics' + JSON.stringify(__APP.SERVER.validateData(dynamics_ajax_data)));
	}
	
	switch (typeof range) {
		case 'string': {
			if (range) data.since = range;
			break;
		}
		case 'object': {
			if (range.since) data.since = range.since;
			if (range.till) data.till = range.till;
			break;
		}
		default:
		case 'boolean': { break; }
	}
	
	return __APP.SERVER.getData('/api/v1/statistics/' + entity + '/' + id, data, success);
};
/**
 *
 * @param {Statistics.SCALES} scale
 * @param {(string|object|boolean)} range
 * @param {string} range.since
 * @param {string} [range.till]
 * @param {object<string, StatisticsStdData>} statistics_fields
 * @param {?object} dynamics_ajax_data
 * @param {Statistics.SCALES} [dynamics_ajax_data.scale]
 * @param {string} [dynamics_ajax_data.since]
 * @param {string} [dynamics_ajax_data.till]
 * @param {function} [success]
 * @return {jqPromise}
 */
Statistics.prototype.fetchStatistics = function(scale, range, statistics_fields, dynamics_ajax_data, success) {
	var self = this;
	return this.constructor.fetchStatistics(this.id, scale, range, statistics_fields, dynamics_ajax_data, function(data) {
		self.setData(data);
		if (success && typeof success == 'function') {
			success.call(self, data);
		}
	});
};