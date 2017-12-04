/**
 *
 * @param {buildProps} props
 * @param {(__C.ENTITIES.USER|__C.ENTITIES.ORGANIZATION)} props.entity
 * @param {(OneUser|UsersCollection|OneOrganization|OrganizationsCollection|Array)} props.entities
 * @param {boolean} [props.isLink = false]
 * @param {Array<string>} [props.avatarClasses = []]
 * @constructor
 */
function AvatarBlocks({
	entity,
	entities = new UsersCollection(),
	isLink = false,
	className,
	avatarClasses = [],
	...rest_props
}) {
	const entity_name = entity,
		block_classes = new HtmlClassesArray(className);
	
	return (entities instanceof Array ? entities : [entities]).map(function(entity) {
		let name,
			href;
		
		if ((entity_name && entity_name === __C.ENTITIES.USER) || entity instanceof OneUser || entity.first_name) {
			name = entity.full_name || [entity.first_name, entity.last_name].join(' ');
			href = '/user/' + entity.id;
		} else {
			name = entity.short_name || entity.name;
			href = '/organization/' + entity.id;
		}
		const avatar = <Avatar entity={entity} className={new HtmlClassesArray(avatarClasses)} />,
			avatar_name = <span className="avatar_name">{name}</span>,
			avatar_block_classes = new HtmlClassesArray(['avatar_block', `User${entity.id}`, 'link', ...block_classes]);
		
		if (isLink) {
			
			return (
				<PageLink
					key={entity.id}
					className={avatar_block_classes}
					href={href}
					{...rest_props}
				>
					{avatar}
					{avatar_name}
				</PageLink>
			);
		} else {
			
			return (
				<div
					key={entity.id}
					className={avatar_block_classes}
					{...rest_props}
				>
					{avatar}
					{avatar_name}
				</div>
			);
		}
	});
}