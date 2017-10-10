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
	
	HelpCenterConnection.ARTICLE = Object.freeze({
		FUNDS_WITHDRAW: 47,
		BOOKING: 49,
		PROMOCODES: 51,
		TICKETS: 55,
		HOW_TO_ENABLE_REGISTRATION: 61,
		MEMBERS_LIMITATION: 65,
		ADMIN_ACCESS: 71,
		SITE_DESIGN: 77,
		PREMIUM_TARIFF: 79,
		HOW_PUSH_WORKS: 83,
		CROSSPOSTING_VK: 105,
		HOW_TO_PAY_FROM_LEGAL_ENTITY: 121,
		REQUEST_APPROVAL: 127,
		ORDER_STATUSES: 170
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