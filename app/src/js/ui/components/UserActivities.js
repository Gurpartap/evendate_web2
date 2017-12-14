/**
 * @requires componentsContainer.js
 */
function UserActivity({
	user,
	activity,
	avatarClasses
}) {
	const classes = new HtmlClassesArray('activity_block'),
		avatar_classes = new HtmlClassesArray(avatarClasses),
		creator_name = user.full_name || `${user.first_name} ${user.last_name}`,
		date = moment.unix(activity.created_at).calendar(null, __LOCALE.DATE.CALENDAR_DATE_TIME);
	
	let img_url, entity_url, entity_title;
	
	classes.push(`-type_${activity.type_code}`);
	avatar_classes.push(__C.CLASSES.SIZES.X50, __C.CLASSES.UNIVERSAL_STATES.ROUNDED);
	
	switch (true) {
		case (activity instanceof OneOrganizationActivity): {
			classes.push('-entity_organization');
			img_url = activity.organization.img_small_url || activity.organization.img_url;
			entity_url = `/organization/${activity.organization.id}`;
			entity_title = activity.organization.short_name;
			break;
		}
		case (activity instanceof OneEventActivity): {
			classes.push('-entity_event');
			img_url = activity.event.image_horizontal_small_url || activity.event.image_horizontal_url;
			entity_url = `/event/${activity.event.id}`;
			entity_title = activity.event.title;
			break;
		}
	}
	
	return (
		<div className={classes}>
			<Avatar entity={user} className={avatar_classes} badgeClass={UserActivity.AVATAR_BADGE_ICON[activity.type_code]} />
			<div className="activity_block_content">
				<p className="activity_block_top">
					<PageLink className="activity_block_creator link" href={`/user/${user.id}`}>{creator_name}</PageLink>
					{' ' + i18n(UserActivity.ACTION_TEXT[activity.type_code], 1, {}, {
						gender: user.gender
					})}
				</p>
				<p className="activity_block_middle">
					<PageLink className="link" href={entity_url}>{entity_title}</PageLink>
				</p>
				<p className="activity_block_bottom">{date}</p>
			</div>
			<PageLink className="activity_block_image img_holder link" href={entity_url}>
				<img src={img_url} height="48" onClick={e => e.target.src = '/app/img/brand_logo.png'} />
			</PageLink>
		</div>
	);
}

UserActivity.propTypes = {
	user: PropTypes.instanceOf(OneUser).isRequired,
	activity: PropTypes.instanceOf(OneAbstractActivity).isRequired,
	avatarClasses: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.instanceOf(HtmlClassesArray),
	])
};

UserActivity.AVATAR_BADGE_ICON = {
	[OneAbstractActivity.TYPES.SUBSCRIBE]: 'plus',
	[OneAbstractActivity.TYPES.UNSUBSCRIBE]: 'minus',
	[OneAbstractActivity.TYPES.FAVE]: 'star',
	[OneAbstractActivity.TYPES.UNFAVE]: 'minus',
};

UserActivity.ACTION_TEXT = {
	[OneAbstractActivity.TYPES.SUBSCRIBE]: __S.USER_SUBSCRIBED_TO_ORG,
	[OneAbstractActivity.TYPES.UNSUBSCRIBE]: __S.USER_UNSUBSCRIBED_FROM_ORG,
	[OneAbstractActivity.TYPES.FAVE]: __S.USER_FAVORED_EVENT,
	[OneAbstractActivity.TYPES.UNFAVE]: __S.USER_UNFAVORED_EVENT,
	[OneAbstractActivity.TYPES.SHARE_VK]: __S.USER_SHARED_EVENT,
	[OneAbstractActivity.TYPES.SHARE_FB]: __S.USER_SHARED_EVENT,
	[OneAbstractActivity.TYPES.SHARE_TW]: __S.USER_SHARED_EVENT
};


const UserActivities = componentsContainer(UserActivity, {
	entity_name: 'activity',
	entities_name: 'activities',
	CollectionClass: UsersActivitiesCollection,
	noEntities: () => <Cap>{i18n(__S.NO_ACTIVITIES)}</Cap>
});

UserActivities.propTypes = {
	user: PropTypes.instanceOf(OneUser).isRequired,
	activities: PropTypes.oneOfType([
		PropTypes.instanceOf(UsersActivitiesCollection),
		PropTypes.arrayOf(PropTypes.instanceOf(OneAbstractActivity))
	]).isRequired
};