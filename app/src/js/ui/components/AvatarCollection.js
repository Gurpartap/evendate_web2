/**
 * @requires AvatarCollectionContextProvider.js
 */
class AvatarCollection extends React.Component {
	constructor(props, context) {
		let left = props.maxCount;
		
		super(props, context);
		
		this.avatars = [
			__APP.USER,
			...props.users.filter(user => __APP.USER.id !== parseInt(user.id) && left-- > 0)
		];
	}
	
	getWidth() {
		var avatar_width = 30,
			amount = this.avatars.length,
			kink = 6;
		
		if (this.context[AvatarCollectionContextProvider.CONTEXT_NAME].isSubscribed && amount < this.props.maxCount) {
			
			return amount === 1 ? (avatar_width * amount) : (avatar_width * amount) - (kink * (amount - 1));
		}
		
		return amount === 1 ? 0 : (avatar_width * (amount - 1)) - (kink * (amount - 2));
	}
	
	render() {
		const {
				users,
				overallAvatarsCount,
				className,
				counterClasses,
				maxCount,
				...rest_props
			} = this.props,
			classes = new HtmlClassesArray('avatars_collection', `-max_${maxCount}`, '-trimmed'),
			more_avatars_count = (overallAvatarsCount || users.length) - maxCount,
			is_counter_hidden = more_avatars_count <= 0;
		
		if (this.context[AvatarCollectionContextProvider.CONTEXT_NAME].isSubscribed) {
			classes.push(__C.CLASSES.HOOKS.ADD_AVATAR.STATES.SHIFTED)
		}
		
		classes.push(className);
		
		return (
			<React.Fragment>
				<div className={classes} style={{width: this.getWidth()}} {...rest_props}>
					<Avatars entities={this.avatars} />
				</div>
				<span className={`counter ${new HtmlClassesArray(counterClasses)} ${is_counter_hidden ? '-cast' : ''}`}>
					+{more_avatars_count}
				</span>
			</React.Fragment>
		);
	}
}

AvatarCollection.propTypes = {
	users: PropTypes.oneOfType([
		PropTypes.instanceOf(UsersCollection),
		PropTypes.arrayOf(PropTypes.instanceOf(OneUser)),
	]).isRequired,
	maxCount: PropTypes.number.isRequired,
	overallAvatarsCount: PropTypes.number,
	className: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.instanceOf(HtmlClassesArray),
	]),
	counterClasses: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.arrayOf(PropTypes.string),
		PropTypes.instanceOf(HtmlClassesArray),
	])
};

AvatarCollection.contextTypes = AvatarCollectionContextProvider.childContextTypes;