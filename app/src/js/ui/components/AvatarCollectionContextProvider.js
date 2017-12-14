class AvatarCollectionContextProvider extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			is_subscribed: props.isSubscribed
		};
	}
	getChildContext() {
		
		return {
			[AvatarCollectionContextProvider.CONTEXT_NAME]: {
				isSubscribed: this.state.is_subscribed,
				subscribe: () => {
					this.setState({
						is_subscribed: true
					})
				},
				unsubscribe: () => {
					this.setState({
						is_subscribed: false
					})
				}
			}
		}
	}
	
	render() {
		
		return React.Children.map(this.props.children, child => child);
	}
}
AvatarCollectionContextProvider.CONTEXT_NAME = '__avatar_collection__';

AvatarCollectionContextProvider.propTypes = {
	isSubscribed: PropTypes.bool
};

AvatarCollectionContextProvider.childContextTypes = {
	[AvatarCollectionContextProvider.CONTEXT_NAME]: PropTypes.shape({
		isSubscribed: PropTypes.bool,
		subscribe: PropTypes.func,
		unsubscribe: PropTypes.func,
	})
};