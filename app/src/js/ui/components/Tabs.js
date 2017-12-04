class Tabs extends React.Component {
	/**
	 *
	 * @param props
	 * @param props.selectedTab
	 * @param props.className
	 * @param props.headerClasses
	 * @param props.bodyWrapperClasses
	 */
	constructor(props) {
		super(props);
		
		this.state = {
			selected_tab: props.selectedTab || null
		};
		
		this.changeTab = this.changeTab.bind(this);
	}
	
	changeTab(new_state) {
		this.setState(prev_state => {
			if (prev_state.selected_tab !== new_state) {
				
				return {
					selected_tab: new_state
				}
			}
			
			return null;
		})
	}
	
	render() {
		const {
				className,
				headerClasses,
				bodyWrapperClasses,
				selectedTab,
				...rest_props
			} = this.props,
			children = React.Children.toArray(this.props.children);
		
		return (
			<div className={`${new HtmlClassesArray(className)} Tabs`} {...rest_props}>
				<header className={`${new HtmlClassesArray(headerClasses)} tabs_header HeaderTabs`}>
					{children.map(child => (
						<span
							key={child.props.name}
							className={`tab Tab ${child.props.name === this.state.selected_tab ? '-active' : ''}`}
							onClick={() => this.changeTab(child.props.name)}
						>
							{child.props.title}
						</span>
					))}
				</header>
				<div className={`${new HtmlClassesArray(bodyWrapperClasses)} tab_bodies_wrap TabsBodyWrapper`}>
					{children.map(child => (
						<div className={`tab_body TabsBody ${child.props.name === this.state.selected_tab ? '-active' : ''}`} key={child.props.name}>
							{child.props.children}
						</div>
					))}
				</div>
			</div>
		);
	}
}

Tabs.propTypes = {
	className: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.instanceOf(HtmlClassesArray),
	]),
	headerClasses: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.arrayOf(PropTypes.string),
		PropTypes.instanceOf(HtmlClassesArray),
	]),
	bodyWrapperClasses: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.arrayOf(PropTypes.string),
		PropTypes.instanceOf(HtmlClassesArray),
	]),
	selectedTab: PropTypes.string
};

class Tab extends React.Component {}

Tab.propTypes = {
	title: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired
};