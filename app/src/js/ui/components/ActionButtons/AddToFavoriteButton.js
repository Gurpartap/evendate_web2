/**
 * @requires ActionButton.js
 * @requires ../AvatarCollectionContextProvider.js
 */
class ReactAddToFavoriteButton extends ReactActionButton {
	constructor(props, context) {
		super(props, context);
		
		this.event = props.event;
		if (!isVoid(context[AvatarCollectionContextProvider.CONTEXT_NAME])) {
			this.state.is_checked = context[AvatarCollectionContextProvider.CONTEXT_NAME].isSubscribed;
		}
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
			
			return this.event.unfavour().then(data => {
				if (!isVoid(this.context[AvatarCollectionContextProvider.CONTEXT_NAME])) {
					this.context[AvatarCollectionContextProvider.CONTEXT_NAME].unsubscribe();
				}
				
				return data;
			});
		} else {
			
			return this.event.favour().then(data => {
				if (!isVoid(this.context[AvatarCollectionContextProvider.CONTEXT_NAME])) {
					this.context[AvatarCollectionContextProvider.CONTEXT_NAME].subscribe();
				}
				
				return data;
			});
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

ReactAddToFavoriteButton.propTypes = {
	event: PropTypes.instanceOf(OneEvent),
	...ReactActionButton.propTypes
};

ReactAddToFavoriteButton.contextTypes = AvatarCollectionContextProvider.childContextTypes;