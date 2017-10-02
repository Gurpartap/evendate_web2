/**
 *
 * @class HelpCenterConnection
 * @extends AsynchronousConnection
 */
HelpCenterConnection = extending(AsynchronousConnection, (function() {
	/**
	 *
	 * @constructor
	 * @constructs HelpCenterConnection
	 */
	function HelpCenterConnection() {
		AsynchronousConnection.call(this);
	}
	
	HelpCenterConnection.URL_BASE = 'https://evendate.io/help/wp-json/wp/v2/article/';
	
	HelpCenterConnection.ENDPOINT = Object.freeze({
		ARTICLE: HelpCenterConnection.URL_BASE + '{id}'
	});
	
	HelpCenterConnection.prototype.fetchArticle = function(id) {
		
		return this.dealAjax(AsynchronousConnection.HTTP_METHODS.GET, HelpCenterConnection.ENDPOINT.ARTICLE.format({id: id})).then(function(data) {
			
			return (new HelpArticleModel()).setData({
				id: data.id,
				title: data.title.rendered,
				link: data.link,
				create_at: new Date(data.date_gmt),
				updated_at: new Date(data.modified_gmt),
				content: data.content.rendered
			});
		});
	};
	
	return HelpCenterConnection;
}()));