/**
 * @requires Class.Page.js
 */
/**
 *
 * @class NotFoundPage
 * @extends Page
 */
NotFoundPage = extending(Page, (function() {
	/**
	 *
	 * @constructor
	 * @constructs NotFoundPage
	 */
	function NotFoundPage() {
		Page.call(this);
	}
	
	NotFoundPage.prototype.render = function() {
		__APP.changeTitle('Страница не найдена');
	};
	
	return NotFoundPage;
}()));