/**
 * @requires ../Class.StatisticsPage.js
 */
/**
 *
 * @constructor
 * @abstract
 * @augments StatisticsPage
 * @param {(string|number)} org_id
 */
function StatisticsOrganizationPage(org_id) {
	StatisticsPage.apply(this);
	this.id = org_id;
	this.organization = new OneOrganization(this.id);
	//this.with_header_tabs = true;
}
StatisticsOrganizationPage.extend(StatisticsPage);