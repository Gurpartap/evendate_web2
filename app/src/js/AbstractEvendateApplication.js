class AbstractEvendateApplication {
	constructor() {
		this.SERVER = new ServerConnection();
		this.POST_MESSAGE = PostMessageConnection(window);
		this.EVENDATE_BEGIN = '15-12-2015';
		this.AUTH_URLS = {};
		this.USER = new CurrentUser();
		this.PREVIOUS_PAGE = new Page();
		this.CURRENT_PAGE = new Page();
		this.CURRENT_REACT_PAGE = null;
		this.MODALS = new Modals();
		this.BUILD = new Builder();
		this.ROUTING = {};
		this.YA_METRIKA = window.yaCounter32442130 || null;
		this.IS_REPAINTED = false;
		this.HISTORY = null;
		this.IS_WIDGET = false;
		this.IS_REACT_PAGE = true;
		this.IS_PREV_PAGE_REACT = true;
		this.LOADER = $();
		this.BASE_PATH = '/';
	}
	/**
	 *
	 * @param {object} colors
	 * @param {string} [colors.header]
	 * @param {string} [colors.accent]
	 */
	repaint(colors) {
		this.IS_REPAINTED = true;
		
		if (colors.accent) {
			(hex => document.getElementById('main_overlay').style.setProperty('--color_accent', hex))(colors.accent);
		}
	}
	
	setDefaultColors() {
		const main_overlay_style = document.getElementById('main_overlay').style;
		
		main_overlay_style.removeProperty('--color_accent');
	}
	/**
	 * Changes title of the page
	 * @param {(string|Array<{page: {string}, title: {string}}>|jQuery)} new_title
	 */
	changeTitle(new_title) {}
	/**
	 * Pushes state in History.js`s states stack and renders page or replaces last state
	 * @param {string} page_name
	 * @param {boolean} [soft_change=false]
	 * @param {boolean} [reload=false]
	 *
	 * @return {boolean} false
	 */
	changeState(page_name, soft_change, reload) {
		let parsed_uri;
		
		History.stateChangeHandled = true;
		if (page_name) {
			let state;
			
			parsed_uri = parseUri(decodeURIComponent(page_name.indexOf(this.BASE_PATH) === 0 ?
			                                         page_name : page_name.indexOf('/') === 0 ?
			                                                     this.BASE_PATH.slice(0, -1) + page_name : this.BASE_PATH + page_name));
			
			state = {
				parsed_page_uri: parsed_uri,
				soft_change,
				reload
			};
			if (soft_change) {
				this.replaceState(parsed_uri.path, state);
			} else {
				this.pushState(parsed_uri.path, state);
			}
		} else {
			console.error('Need to pass page name');
		}
		History.stateChangeHandled = false;
		
		return false;
	}
	
	pushState(path, state) {
		if (this.HISTORY) {
			this.HISTORY.push(path, state);
		} else {
			History.pushState(state, '', path);
		}
	}
	
	replaceState(path, state) {
		if (this.HISTORY) {
			this.HISTORY.replace(path, state);
		} else {
			History.replaceState(state, '', path);
		}
	}
	
	reload() {
		
		return this.changeState(location.pathname, true, true);
	}
	
	openPage(page) {
		$(window).off('scroll');
		
		AbstractAppInspector.hideCurrent();
		this.PREVIOUS_PAGE = __APP.CURRENT_PAGE;
		this.PREVIOUS_PAGE.destroy();
		
		this.CURRENT_PAGE = page;
		this.CURRENT_PAGE.fetchData();
		this.CURRENT_PAGE.show();
		
		return this.CURRENT_PAGE;
	}
	
	routePage(path) {
		var path_map = decodeURIComponent(path).split('/'),
			args = [],
			PageClass;
		
		PageClass = path_map.reduce(function(tree_chunk, path_chunk) {
			if (!path_chunk) {
				
				return tree_chunk;
			}
			if (tree_chunk.hasOwnProperty(path_chunk)) {
				
				return tree_chunk[path_chunk];
			}
			
			return Object.keys(tree_chunk).reduce(function(found_chunk, key) {
				if (!found_chunk && key.indexOf('^') === 0 && (new RegExp(key)).test(path_chunk)) {
					args.push(path_chunk);
					
					return tree_chunk[key];
				}
				
				return found_chunk;
			}, false);
		}, this.ROUTING);
		
		if (!(PageClass.prototype instanceof Page || PageClass.prototype instanceof React.Component)) {
			if (PageClass[''] && (PageClass[''].prototype instanceof Page || PageClass.prototype instanceof React.Component)) {
				PageClass = PageClass[''];
			} else {
				PageClass = NotFoundPage;
			}
		}
		
		return {PageClass, args};
	}
	
	init() {
		const state = this.HISTORY ? this.HISTORY.location.state : null,
			pathname = window.location.pathname;
		
		if (isVoid(state) || !state.soft_change || (state.soft_change && state.reload)) {
			const {PageClass, args} = this.routePage(pathname);
			
			this.SERVER.abortAllConnections();
			this.openPage(new PageClass(...args));
		}
	}
	
	renderReact() {
		const {BrowserRouter} = ReactRouterDOM,
			{Switch, Route, Redirect} = ReactRouter;
		
		ReactDOM.render((
			<BrowserRouter>
				<Switch>
					<Route exact path="/my/profile" component={MyProfilePage} />
					<Redirect from={`/user/${this.USER.id}`} to="/my/profile" />
					<Route exact path="/user/:user_id" component={UserPage} />
					<Route path="/event/:event_id/networking" component={EventNetworkingPage} />
					<Route component={NoReactPage} />
				</Switch>
			</BrowserRouter>
		), document.getElementById('app_page_root'));
	}
}