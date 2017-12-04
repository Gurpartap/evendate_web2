/**
 * @class ReactActionButton
 * @extends React.Component
 *
 * @static {Object<string, string>} STATES
 * @static {Object<string, Object<STATES, ?string>>} DEFAULTS
 * @static {function} addAvatar
 *
 * @property {Object<STATES, ?string>} labels
 * @property {Object<STATES, ?string>} colors
 * @property {Object<STATES, ?string>} icons
 * @property {STATES} current_state
 * @property {HtmlClassesArray} classes
 * @property {object} state
 * @property {boolean} state.is_checked
 * @property {boolean} state.is_hovered
 */
class ReactActionButton extends React.Component {
	static addAvatar($context) {
		var $wrapper = ($context instanceof jQuery ? $context : $($context)).closest('.' + __C.CLASSES.HOOKS.ADD_AVATAR.ANCESTOR),
			$collection = $wrapper.find('.' + __C.CLASSES.HOOKS.ADD_AVATAR.COLLECTION),
			$favored_count = $wrapper.find('.' + __C.CLASSES.HOOKS.ADD_AVATAR.QUANTITY),
			$avatars = $collection.find('.avatar'),
			amount = $avatars.length;
		
		if ($collection.data('max_amount') >= amount) {
			if ($collection.hasClass(__C.CLASSES.HOOKS.ADD_AVATAR.STATES.SHIFTED)) {
				$collection.removeClass(__C.CLASSES.HOOKS.ADD_AVATAR.STATES.SHIFTED);
				$collection.width(amount == 1 ? 0 : ($avatars.outerWidth() * (amount - 1)) - (6 * (amount - 2)));
			} else {
				$collection.addClass(__C.CLASSES.HOOKS.ADD_AVATAR.STATES.SHIFTED);
				$collection.width(($avatars.outerWidth() * amount) - (6 * (amount - 1)));
			}
		} else {
			if ($favored_count.length) {
				var current_count = parseInt($favored_count.text());
				if ($collection.hasClass(__C.CLASSES.HOOKS.ADD_AVATAR.STATES.SHIFTED)) {
					$favored_count.text(current_count - 1);
					if (current_count - 1 <= 0) {
						$favored_count.parent().addClass(__C.CLASSES.HOOKS.ADD_AVATAR.STATES.CAST);
					}
				} else {
					$favored_count.text(current_count + 1);
					$favored_count.parent().removeClass(__C.CLASSES.HOOKS.ADD_AVATAR.STATES.CAST);
				}
			}
			$collection.toggleClass(__C.CLASSES.HOOKS.ADD_AVATAR.STATES.SHIFT + ' ' +
			                        __C.CLASSES.HOOKS.ADD_AVATAR.STATES.SHIFTED);
		}
	}
	
	/**
	 *
	 * @param {object} props
	 * @param {boolean} [props.isChecked = false]
	 * @param {boolean} [props.isAddAvatar = false]
	 * @param {(string|Array)} [props.className]
	 * @param {Object<STATES, ?string>} [props.labels]
	 * @param {Object<STATES, ?string>} [props.colors]
	 * @param {Object<STATES, ?string>} [props.icons]
	 * @param {function} [props.onClick]
	 */
	constructor(props) {
		super(props);
		
		this.state = {
			is_checked: props.isChecked,
			is_hovered: false
		};
		
		this.labels = props.labels === null ? ReactActionButton.DEFAULTS.labels : {...this.constructor.DEFAULTS.labels, ...props.labels};
		this.colors = props.colors === null ? ReactActionButton.DEFAULTS.colors : {...this.constructor.DEFAULTS.colors, ...props.colors};
		this.icons = props.icons === null ? ReactActionButton.DEFAULTS.icons : {...this.constructor.DEFAULTS.icons, ...props.icons};
		
		this.mouseHoverHandler = this.mouseHoverHandler.bind(this);
		this.mouseLeaveHandler = this.mouseLeaveHandler.bind(this);
		this.checkedStateChange = this.checkedStateChange.bind(this);
		this.onClickHandler = this.onClickHandler.bind(this);
		this.clickAction = this.clickAction.bind(this);
		
		Object.defineProperties(this, {
			classes: {
				get() {
					const classes = new HtmlClassesArray(this.props.className);
					
					if (!empty(this.icons[this.current_state])) {
						classes.push(__C.CLASSES.ICON_CLASS, this.icons[this.current_state]);
					}
					
					if (!empty(this.colors[this.current_state])) {
						classes.push(this.colors[this.current_state]);
					}
					
					return classes;
				}
			},
			current_state: {
				get() {
					
					switch (true) {
						case this.state.is_checked && this.state.is_hovered: {
							
							return ReactActionButton.STATES.CHECKED_HOVER;
						}
						case this.state.is_checked && !this.state.is_hovered: {
							
							return ReactActionButton.STATES.CHECKED;
						}
						case !this.state.is_checked && this.state.is_hovered: {
							
							return ReactActionButton.STATES.UNCHECKED_HOVER;
						}
						case !this.state.is_checked && !this.state.is_hovered: {
							
							return ReactActionButton.STATES.UNCHECKED;
						}
					}
				}
			}
		});
	}
	
	showAuthModal() {
		let {modal} = this;
		
		if (!modal) {
			modal = new AuthModal(null, {
				note: 'Для выполнения этого действия, нужно войти через социальную сеть'
			});
			this.modal = modal;
		}
		
		return modal.show();
	}
	
	clickAction() {
		
		return Promise.resolve();
	};
	
	onClickHandler(e) {
		const {onClick, isAddAvatar} = this.props;
		
		if (__APP.USER.isLoggedOut()) {
			
			return this.showAuthModal();
		}
		
		this.clickAction();
		this.checkedStateChange();
		if (isFunction(onClick)) {
			onClick(e);
		}
		if (isAddAvatar) {
			ReactActionButton.addAvatar(this.button);
		}
		
		if (isFunction(window.askToSubscribe)) {
			window.askToSubscribe();
		}
	}
	
	checkedStateChange() {
		if (this.state.is_checked) {
			this.setState({
				is_checked: false
			});
		} else {
			this.setState({
				is_checked: true
			});
		}
	}
	
	mouseHoverHandler() {
		this.setState({
			is_hovered: true
		});
	}
	
	mouseLeaveHandler() {
		this.setState({
			is_hovered: false
		});
	}
	
	render() {
		
		return (
			<Button
				className={this.classes}
				onClick={this.onClickHandler}
				onMouseEnter={this.mouseHoverHandler}
				onMouseLeave={this.mouseLeaveHandler}
			>
				{this.labels[this.current_state]}
			</Button>
		);
	}
}

ReactActionButton.STATES = {
	CHECKED: 'CHECKED',
	UNCHECKED: 'UNCHECKED',
	CHECKED_HOVER: 'CHECKED_HOVER',
	UNCHECKED_HOVER: 'UNCHECKED_HOVER'
};

ReactActionButton.DEFAULTS = {
	labels: {
		[ReactActionButton.STATES.CHECKED]: null,
		[ReactActionButton.STATES.UNCHECKED]: null,
		[ReactActionButton.STATES.CHECKED_HOVER]: null,
		[ReactActionButton.STATES.UNCHECKED_HOVER]: null
	},
	colors: {
		[ReactActionButton.STATES.CHECKED]: null,
		[ReactActionButton.STATES.UNCHECKED]: null,
		[ReactActionButton.STATES.CHECKED_HOVER]: null,
		[ReactActionButton.STATES.UNCHECKED_HOVER]: null
	},
	icons: {
		[ReactActionButton.STATES.CHECKED]: null,
		[ReactActionButton.STATES.UNCHECKED]: null,
		[ReactActionButton.STATES.CHECKED_HOVER]: null,
		[ReactActionButton.STATES.UNCHECKED_HOVER]: null
	}
};