/**
 * @requires ../Class.OneEntity.js
 */
/**
 *
 * @abstract
 * @augments OneEntity
 */
function OneActivity() {
	this.stat_type_id = 0;
	this.event_id = 0;
	this.event = new OneEvent(this.event_id);
	this.organization_id = 0;
	this.organization = new OneOrganization(this.organization_id);
	this.user_id = 0;
	this.user = new OneUser(this.user_id);
	this.entity = '';
	this.type_code = '';
	this.created_at = 0;
}
OneActivity.extend(OneEntity);