/**
 * @requires ../Class.OneEntity.js
 */
/**
 *
 * @constructor
 * @augments OneEntity
 */
function OneDate() {
	this.event_date = '';
	this.id = 0;
	this.start_time = '';
	this.end_time = '';
	this.event_id = 0;
	this.organization_id = 0;
	this.events_count = 0;
	this.favored_count = 0;
}
OneDate.extend(OneEntity);