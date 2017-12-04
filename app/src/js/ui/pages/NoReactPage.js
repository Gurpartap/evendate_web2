class NoReactPage extends React.Component {
	
	componentDidMount() {
		__APP.HISTORY = this.props.history;
		__APP.IS_REACT_PAGE = true;
		__APP.init();
	}
	
	componentWillUpdate() {
		__APP.CURRENT_PAGE.destroy();
		__APP.init();
	}
	
	componentWillUnmount() {
		__APP.CURRENT_PAGE.destroy();
		$('#app_page_root').html('');
	}
	
	render() {
		
		return null;
	}
}