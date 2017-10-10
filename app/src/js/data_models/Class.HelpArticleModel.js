/**
 * @requires ../entities/Class.OneEntity.js
 */
/**
 *
 * @class HelpArticleModel
 * @extends OneEntity
 */
HelpArticleModel = extending(OneEntity, (function() {
	/**
	 *
	 * @constructor
	 * @constructs HelpArticleModel
	 *
	 * @property {?number} id
	 * @property {?string} title
	 * @property {?string} link
	 * @property {Date} create_at
	 * @property {Date} updated_at
	 * @property {?string} content
	 */
	function HelpArticleModel() {
		this.id = null;
		this.title = null;
		this.link = null;
		this.create_at = new Date();
		this.updated_at = new Date();
		this.content = null;
	}
	
	return HelpArticleModel;
}()));