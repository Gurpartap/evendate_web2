/**
 * @requires Class.AbstractAppInspector.js
 */
/**
 *
 * @class HelpAppInspector
 * @extends AbstractAppInspector
 */
HelpAppInspector = extending(AbstractAppInspector, (function() {
	/**
	 *
	 * @constructor
	 * @constructs HelpAppInspector
	 */
	function HelpAppInspector(article_id) {
		AbstractAppInspector.call(this);
		
		this.article_id = article_id;
	}
	/**
	 *
	 * @returns {jqPromise}
	 */
	HelpAppInspector.prototype.fetchData = function() {
		
		return (new HelpCenterConnection()).fetchArticle(this.article_id);
	};
	/**
	 *
	 * @param {HelpArticleModel} article
	 */
	HelpAppInspector.prototype.fetchDone = function(article) {
		var $imgs,
			$videos,
			$links;
		
		this.$content = $('<div class="app_inspector_help_content_wrapper">'+article.content+'</div>');
		this.title = $('<a class="link" href="'+article.link+'" target="_blank">'+article.title+'</a>');
		
		$imgs = this.$content.find('img');
		$videos = this.$content.find('video');
		$links = this.$content.find('a');
		
		this.$content.find('[style*="width"]').width('auto');
		
		$imgs.removeAttr('height');
		$videos.removeAttr('height');
		$videos.removeAttr('width');
		$links.attr('target', '_blank');
	};
	
	return HelpAppInspector;
}()));