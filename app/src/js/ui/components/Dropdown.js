class Dropdown extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			click_pos: {
				X: 0,
				Y: 0,
			},
			opened: false
		};
		
		this.open = this.open.bind(this);
		this.close = this.close.bind(this);
		this.handleClickOutside = this.handleClickOutside.bind(this);
	}
	
	componentDidMount() {
		if (this.state.opened) {
			this.bindClickOutside();
		}
	}
	
	componentWillUnmount() {
		this.unbindClickOutside();
	}
	
	open(e) {
		this.setState({
			opened: true,
			click_pos: {
				X: e.pageX,
				Y: e.pageY,
			}
		}, () => {
			this.bindClickOutside();
		});
	}
	
	close(e) {
		this.setState({
			opened: false
		}, () => {
			this.unbindClickOutside();
			this.setState({
				click_pos: {
					X: 0,
					Y: 0,
				}
			});
		});
	}
	
	bindClickOutside() {
		if (this.props.isDismissOnOuterClick) {
			document.addEventListener('mousedown', this.handleClickOutside);
		}
	}
	
	unbindClickOutside() {
		if (this.props.isDismissOnOuterClick) {
			document.removeEventListener('mousedown', this.handleClickOutside);
		}
	}
	
	handleClickOutside(event) {
		if (this.dropdown && !this.dropdown.contains(event.target)) {
			this.close();
		}
	}
	
	getPos() {
		const viewport_width = window.outerWidth,
			{X: click_X, Y: click_Y} = this.state.click_pos;
		
		let left,
			dropdown_width;
		
		if (!this.dropdown) {
			
			return {};
		}
		
		dropdown_width = this.dropdown.offsetWidth;
		if (viewport_width < click_X + (dropdown_width / 2)) {
			left = viewport_width - dropdown_width;
		} else {
			left = click_X - (dropdown_width / 2);
		}
		
		return {
			left: left,
			top: click_Y + 25
		};
	}
	
	render() {
		const {
				renderControl,
				renderDropdown,
				children
			} = this.props,
			{opened} = this.state;
		
		return (
			<React.Fragment>
				{renderControl(opened, this.open, this.close)}
				{children}
				{ReactDOM.createPortal(
					<div
						className={`dropdown_box ${opened ? '-show' : ''}`}
						ref={node => this.dropdown = node}
						style={this.getPos()}
					>
						{renderDropdown(this.close)}
					</div>,
					document.body
				)}
			</React.Fragment>
		);
	}
}

Dropdown.propTypes = {
	renderControl: PropTypes.func.isRequired,
	renderDropdown: PropTypes.func.isRequired,
	isDismissOnOuterClick: PropTypes.bool,
};