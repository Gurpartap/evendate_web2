/**
 * @requires Class.AbstractAppInspector.js
 */
/**
 *
 * @class ClientAppInspector
 * @extends AbstractAppInspector
 */
ClientAppInspector = extending(AbstractAppInspector, (function() {
	/**
	 *
	 * @param {OneUser} client
	 *
	 * @constructor
	 * @constructs ClientAppInspector
	 *
	 * @property {OneUser} client
	 *
	 */
	function ClientAppInspector(client) {
		
		this.client = client;
		
		this.title = 'Клиент';
		this.$content = tmpl('client-app-inspector', {
			client: AbstractAppInspector.build.avatarBlock(client),
			interests_title: AbstractAppInspector.build.title('Интересы'),
			interests_spiderweb_chart: ''
		});
		
		AbstractAppInspector.call(this);
	}
	
	
	
	return ClientAppInspector;
}()));