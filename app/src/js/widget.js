/**
 *
 * @const __APP
 */
__APP = {
	/**
	 * @type {ServerConnection}
	 */
	SERVER: new ServerConnection(),
	POST_MESSAGE: new WidgetPostMessageConnection(window),
	EVENDATE_BEGIN: '15-12-2015',
	AUTH_URLS: {},
	USER: new CurrentUser(),
	PREVIOUS_PAGE: new Page(),
	CURRENT_PAGE: new Page(),
	ROUTING: {
		'widget' : {
			'order': {
				'event': {
					'^([0-9]+)': {
						'^([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})': {
							'from_legal_entity': LegalEntityPayment
						},
						'': OrderPage
					},
				}
			}
		},
	},
	MODALS: new Modals(),
	BUILD: new Builder(),
	IS_WIDGET: true,
	/**
	 * Changes title of the page
	 * @param {(string|Array<{page: {string}, title: {string}}>|jQuery)} new_title
	 */
	changeTitle: function changeTitle(new_title) {},
	/**
	 * Pushes state in History.js`s states stack and renders page or replaces last state
	 * @param {string} page_name
	 * @param {boolean} [soft_change=false]
	 * @param {boolean} [reload=false]
	 *
	 * @return {boolean} false
	 */
	changeState: function changeState(page_name, soft_change, reload) {
		var parsed_uri,
			location_match = location.pathname.match(/\/widget\/([^\/]*)\//),
			base_url = location_match[0],
			widget_name = location_match[1];
		
		History.stateChangeHandled = true;
		
		if (page_name) {
			page_name = page_name.indexOf(base_url) === 0 ? page_name : page_name.indexOf('/') === 0 ? base_url.slice(0,-1) + page_name : base_url + page_name;
			
			parsed_uri = parseUri(decodeURIComponent(page_name));
			if (soft_change) {
				History.replaceState({parsed_page_uri: parsed_uri}, '', parsed_uri.path);
			} else {
				History.pushState({parsed_page_uri: parsed_uri}, '', parsed_uri.path);
			}
			if (!soft_change || (soft_change && reload)) {
				__APP.init();
			}
		} else {
			console.error('Need to pass page name');
		}
		
		History.stateChangeHandled = false;
		
		return false;
	},
	reload: function() {
		
		return __APP.changeState(location.pathname, true, true);
	},
	openPage: function(page) {
		$(window).off('scroll');
		
		AbstractAppInspector.hideCurrent();
		__APP.SERVER.abortAllConnections();
		__APP.PREVIOUS_PAGE = __APP.CURRENT_PAGE;
		__APP.PREVIOUS_PAGE.destroy();
		
		__APP.CURRENT_PAGE = page;
		__APP.CURRENT_PAGE.fetchData();
		__APP.CURRENT_PAGE.show();
		
		return __APP.CURRENT_PAGE;
	},
	init: function appInit() {
		var pathname = window.location.pathname;
		
		__APP.openPage(Page.routeNewPage(pathname));
		__APP.SIDEBAR.activateNavItem(pathname);
	}
};

Object.seal(__APP);
Object.freeze(__APP.SERVER);
Object.freeze(__APP.ROUTING);
Object.freeze(__APP.BUILD);
