/**
 * @class ReactAddToFavoriteButton
 * @extends ReactActionButton
 *
 * @static {Object<string, Object<STATES, ?string>>} DEFAULTS
 *
 * @property {OneEvent} event
 * @property {Object<STATES, ?string>} labels
 * @property {Object<STATES, ?string>} colors
 * @property {Object<STATES, ?string>} icons
 * @property {HtmlClassesArray} classes
 * @property {object} state
 * @property {STATES} state.current_state
 * @property {boolean} state.is_checked
 * @property {boolean} state.is_hovered
 */
class ReactAddToFavoriteButton extends ReactActionButton {
	/**
	 * @inheritDoc
	 * @param {OneEvent} props.event
	 */
	constructor(props) {
		super(props);
		
		this.event = props.event;
	}
	
	showAuthModal() {
		let {modal} = this;
		
		if (!modal) {
			modal = new AuthModal(`${location.origin}/event/${this.event.id}`, {
				note: 'Чтобы добавить событие в избранное, необходимо войти через социальную сеть'
			});
			this.modal = modal;
		}
		
		cookies.setItem('auth_command', 'add_to_favorite');
		cookies.setItem('auth_entity_id', this.event.id);
		
		return modal.show();
	}
	
	clickAction() {
		if (this.state.is_checked) {
			
			return this.event.unfavour();
		} else {
			
			return this.event.favour();
		}
	}
}

ReactAddToFavoriteButton.DEFAULTS = {
	labels: {
		[ReactActionButton.STATES.CHECKED]: __LOCALES.ru_RU.TEXTS.BUTTON.FAVORED,
		[ReactActionButton.STATES.UNCHECKED]: __LOCALES.ru_RU.TEXTS.BUTTON.ADD_FAVORITE,
		[ReactActionButton.STATES.CHECKED_HOVER]: __LOCALES.ru_RU.TEXTS.BUTTON.REMOVE_FAVORITE,
		[ReactActionButton.STATES.UNCHECKED_HOVER]: __LOCALES.ru_RU.TEXTS.BUTTON.ADD_FAVORITE
	},
	colors: {
		[ReactActionButton.STATES.CHECKED]: __C.CLASSES.COLORS.ACCENT,
		[ReactActionButton.STATES.UNCHECKED]: __C.CLASSES.COLORS.DEFAULT,
		[ReactActionButton.STATES.CHECKED_HOVER]: __C.CLASSES.COLORS.ACCENT,
		[ReactActionButton.STATES.UNCHECKED_HOVER]: __C.CLASSES.COLORS.NEUTRAL_ACCENT
	},
	icons: {
		[ReactActionButton.STATES.CHECKED]: __C.CLASSES.ICONS.STAR,
		[ReactActionButton.STATES.UNCHECKED]: __C.CLASSES.ICONS.STAR_O,
		[ReactActionButton.STATES.CHECKED_HOVER]: __C.CLASSES.ICONS.TIMES,
		[ReactActionButton.STATES.UNCHECKED_HOVER]: __C.CLASSES.ICONS.STAR_O
	}
};