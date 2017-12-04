/**
 *
 * @param {object} props
 * @param {(UsersCollection|Array<OneUser>)} props.users
 * @param {(string|Array)} props.className
 * @param {(string|Array)} props.counterClasses
 * @param {number} props.maxCount
 * @param {number} [props.overallAvatarsCount]
 * @constructor
 */
function AvatarCollection({
	users,
	className,
	counterClasses,
	maxCount,
	overallAvatarsCount = users.length,
	...rest_props
}) {
	const moreAvatarsCount = overallAvatarsCount - maxCount,
		counter_classes = new HtmlClassesArray(counterClasses);
	let left = maxCount;
	
	if (moreAvatarsCount <= 0) {
		counter_classes.push('-cast');
	}
	
	return (
		<React.Fragment>
			<div className={`avatars_collection -max_${maxCount} AvatarsCollection ${new HtmlClassesArray(className)}`} data-max_count={maxCount} {...rest_props}>
				<Avatars entities={[
					__APP.USER,
					...users.filter(user => {
						if (__APP.USER.id === parseInt(user.id)) {
							
							return false;
						}
						
						return !(left-- <= 0);
					})
				]} />
			</div>
			<span className={`counter ${counter_classes}`}>+<span className="FavoredCount">{moreAvatarsCount}</span></span>
		</React.Fragment>
	);
}