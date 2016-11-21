/**
 * @requires ../Class.OneEntity.js
 */
/**
 *
 * @constructor
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
	/**
	 *
	 * @type {OneActivity.TYPES}
	 */
	this.type_code = '';
	this.created_at = 0;
}
OneActivity.extend(OneEntity);
/**
 * @const
 * @enum {string}
 */
OneActivity.TYPES = {
	SUBSCRIBE: 'subscribe',
	FAVE: 'fave',
	UNSUBSCRIBE: 'unsubscribe',
	UNFAVE: 'unfave',
	SHARE_VK: 'share_vk',
	SHARE_FB: 'share_fb',
	SHARE_TW: 'share_tw'
};
Object.freeze(OneActivity.TYPES);