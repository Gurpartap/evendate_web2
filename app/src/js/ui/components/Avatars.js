function Avatars({
	entities,
	className,
	...rest_props
}) {
	const classes = new HtmlClassesArray(className);
	
	return (entities instanceof Array ? entities : [entities]).map(entity => (
		<Avatar key={entity.id} entity={entity} className={classes} {...rest_props} />
	));
}

Avatars.propTypes = {
	entities: PropTypes.oneOfType([
		PropTypes.instanceOf(UsersCollection),
		PropTypes.instanceOf(OrganizationsCollection),
		PropTypes.instanceOf(OneUser),
		PropTypes.instanceOf(OneOrganization),
		PropTypes.arrayOf(PropTypes.instanceOf(OneUser)),
		PropTypes.arrayOf(PropTypes.instanceOf(OneOrganization))
	]).isRequired,
	className: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.instanceOf(HtmlClassesArray),
	]),
};

function Avatar({
	entity,
	className,
	badgeClass,
	...rest_props
}) {
	const classes = new HtmlClassesArray(className);
	
	let avatar_url,
		name;
	
	if (entity instanceof OneUser || entity.avatar_url) {
		avatar_url = entity.avatar_url;
		name = entity.full_name || [entity.first_name, entity.last_name].join(' ');
	} else {
		avatar_url = entity.img_small_url || entity.img_url;
		name = entity.short_name || entity.name
	}
	
	return (
		<div className={`avatar ${classes}`} title={name} {...rest_props}>
			<img src={avatar_url} onError={e => e.target.src = '/app/img/brand_logo.png'} />
			{badgeClass && <span className="avatar_badge"><i className={`fa fa-${badgeClass}`} /></span>}
		</div>
	);
}

Avatar.propTypes = {
	entity: PropTypes.oneOfType([
		PropTypes.instanceOf(OneUser),
		PropTypes.instanceOf(OneOrganization),
	]).isRequired,
	className: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.instanceOf(HtmlClassesArray),
	]),
	badgeClass: PropTypes.oneOf(['plus', 'minus', 'star'])
};