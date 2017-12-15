/**
 *
 * @param {object} options
 * @param {React.Component} PageClass
 *
 * @return {AsyncPageAdapter}
 */
function asyncPage(
	/**
	 * @template {object} pageProps
	 */
	{
		/**
		 * @callback constructPage
		 * @description callback that strikes before fetch. Accepts arguments from router and returns object of props for outcoming async Class
		 * @param {...(string|number)} args
		 *
		 * @return pageProps
		 */
		constructPage = args => ({}),
		/**
		 * @callback fetchData
		 * @description callback that takes props from constructPage callback and returns Promise. After promise resolve page finally renders
		 * @param {pageProps} props
		 *
		 * @return Promise
		 */
		fetchData = props => Promise.resolve(),
		/**
		 * @member {(function|string)} pageTitle
		 * @param {pageProps} props
		 *
		 * @return string
		 */
		pageTitle = props => null,
		
		headerTabs = false,
		
		is_admin_page = false,
		is_auth_required = false,
		
		state_name = ''
	}, PageClass) {
	class AsyncPageAdapter extends React.Component {
		constructor(props) {
			super(props);
			
			__APP.HISTORY = props.history;
			__APP.CURRENT_REACT_PAGE = this;
			this.pageProps = {...props.match.params, ...constructPage.call(this, props.match.params)};
			this.origin_page = null;
			this.state = {
				is_data_fetching: !(is_auth_required && __APP.USER.isLoggedOut()),
				fetched_data: null
			};
		}
		
		componentWillMount() {
			__APP.SERVER.abortAllConnections();
			__APP.SIDEBAR.activateNavItem(window.location.pathname);
			
			if (is_auth_required && __APP.USER.isLoggedOut()) {
				
				return;
			}
			
			if (isFunction(headerTabs)) {
				__APP.TOP_BAR.renderHeaderTabs(headerTabs.call({props: this.pageProps}));
				__APP.TOP_BAR.showTabs();
			} else if (__APP.TOP_BAR.is_tabs_rendered) {
				__APP.TOP_BAR.hideTabs();
			}
			
			{
				const $body = $('body');
				
				$body.removeClass((index, css) => (css.match(/(^|\s)-state_\S+/g) || []).join(' '));
				
				if (is_admin_page) {
					$body.addClass('-state_admin');
				} else {
					$body.removeClass('-state_admin');
				}
				
				if (state_name) {
					$body.addClass(`-state_${state_name}`);
				}
			}
			
			fetchData.call({props: this.pageProps}, this.pageProps).then(data => {
				__APP.changeTitle(isFunction(pageTitle) ? pageTitle.call(this.pageProps, this.pageProps) : pageTitle);
				
				this.setState({
					is_data_fetching: false,
					fetched_data: data
				});
				
				return data;
			});
		}
		
		componentWillUpdate() {
			__APP.SERVER.abortAllConnections();
		}
		
		render() {
			const {
				is_data_fetching,
				fetched_data
			} = this.state;
			
			if (is_auth_required && __APP.USER.isLoggedOut()) {
				cookies.removeItem('auth_command');
				cookies.removeItem('auth_entity_id');
				(new AuthModal(location.href, {
					note: 'Для получения доступа, вам необходимо авторизоваться'
				})).show();
				
				return null;
			}
			
			if (is_data_fetching) {
				
				return <OverlayLoader />;
			}
			
			return (
				<PageClass
					{...{
						match: this.props.match,
						fetched_data,
						...this.pageProps
					}}
					ref={component => this.origin_page = component}
				/>
			);
		}
	}
	
	AsyncPageAdapter.displayName = `asyncPage(${PageClass.displayName || PageClass.name || 'Page'})`;
	
	hoistNonReactStatics(AsyncPageAdapter, PageClass);
	AsyncPageAdapter.OriginPage = PageClass;
	
	return AsyncPageAdapter;
}

function contentWrap(children = '') {
	
	return (
		<div className="page_wrapper Content -fadeable">{children}</div>
	)
}