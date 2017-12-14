function AvatarBlocks({
	entity: entity_type,
	entities = new UsersCollection(),
	isLink = false,
	className,
	avatarClasses = [],
	...rest_props
}) {
	const block_classes = new HtmlClassesArray(className);
	
	return (entities instanceof Array ? entities : [entities]).map(entity => (
		<AvatarBlock
			key={entity.id}
			entity={entity}
			entityType={entity_type}
			isLink={isLink}
			className={block_classes}
			avatarClasses={avatarClasses}
			{...rest_props}
		/>
	));
}

AvatarBlocks.propTypes = {
	entities: PropTypes.oneOfType([
		PropTypes.instanceOf(UsersCollection),
		PropTypes.instanceOf(OrganizationsCollection),
		PropTypes.arrayOf(PropTypes.instanceOf(OneUser)),
		PropTypes.arrayOf(PropTypes.instanceOf(OneOrganization)),
		PropTypes.instanceOf(OneUser),
		PropTypes.instanceOf(OneOrganization),
	]).isRequired,
	entity: PropTypes.oneOf([
		__C.ENTITIES.USER,
		__C.ENTITIES.ORGANIZATION
	]),
	avatarClasses: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.arrayOf(PropTypes.string),
		PropTypes.instanceOf(HtmlClassesArray),
	]),
	className: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.instanceOf(HtmlClassesArray),
	]),
	isLink: PropTypes.bool
};

function AvatarBlock({
	entity,
	entityType,
	avatarClasses,
	className,
	isLink,
	...rest_props
}) {
	let name,
		href;
	
	if ((entityType && entityType === __C.ENTITIES.USER) || entity instanceof OneUser || entity.first_name) {
		name = entity.full_name || [entity.first_name, entity.last_name].join(' ');
		href = '/user/' + entity.id;
	} else {
		name = entity.short_name || entity.name;
		href = '/organization/' + entity.id;
	}
	const avatar = <Avatar entity={entity} className={new HtmlClassesArray(avatarClasses)} />,
		avatar_name = <span className="avatar_name">{name}</span>,
		avatar_block_classes = new HtmlClassesArray(['avatar_block', `User${entity.id}`, 'link', ...(new HtmlClassesArray(className))]);
	
	if (isLink) {
		
		return (
			<PageLink	className={avatar_block_classes} href={href} {...rest_props}>
				{avatar}
				{avatar_name}
			</PageLink>
		);
	}
	
	return (
		<div className={avatar_block_classes}	{...rest_props}>
			{avatar}
			{avatar_name}
		</div>
	);
}

AvatarBlock.propTypes = {
	entity: PropTypes.oneOfType([
		PropTypes.instanceOf(OneUser),
		PropTypes.instanceOf(OneOrganization),
	]).isRequired,
	entityType: PropTypes.oneOf([
		__C.ENTITIES.USER,
		__C.ENTITIES.ORGANIZATION
	]),
	avatarClasses: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.arrayOf(PropTypes.string),
		PropTypes.instanceOf(HtmlClassesArray),
	]),
	className: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.instanceOf(HtmlClassesArray),
	]),
	isLink: PropTypes.bool
};