/**
 *
 * @param {buildProps} props
 * @param {(UsersCollection|Array<OneUser>|OneUser)} props.users
 * @param {boolean} [props.isLink = false]
 * @param {Array<string>} [props.avatarClasses = []]
 * @param {string} [props.size = '70x70']
 * @constructor
 */
function UserTombstones({
	users = new UsersCollection(),
	isLink = false,
	avatarClasses = [],
	className,
	size = '70x70',
	...rest_props
}) {
	const tombstone_classes = new HtmlClassesArray(className),
		avatar_component_classes = new HtmlClassesArray([...avatarClasses, '-rounded', `-size_${size}`]);
	
	return (users instanceof Array ? users : [users]).map(function(user, id) {
		const name = user.full_name || [user.first_name, user.last_name].join(' ');
		
		if (isLink) {
			
			return (
				<PageLink
					key={user.id}
					className={`user_tombstone link ${tombstone_classes}`}
					href={`/user/${user.id}`}
					{...rest_props}
				>
					<Avatars entities={users} className={avatar_component_classes}/>
					<p className="user_tombstone_title">{name}</p>
				</PageLink>
			);
		}
		return (
			<div
				key={user.id}
				className={`user_tombstone ${tombstone_classes}`}
				{...rest_props}
			>
				<Avatars entities={users} className={avatar_component_classes}/>
				<p className="user_tombstone_title">{name}</p>
			</div>
		);
	});
}