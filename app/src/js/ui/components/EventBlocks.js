/**
 * @requires componentsContainer.js
 */
function EventBlock({
	event,
	date,
	hasDivider = false,
	coverWidth = 550
}) {
	const event_id = event.id,
		avatars_collection_classes = new HtmlClassesArray(
			__C.CLASSES.UNIVERSAL_STATES.ROUNDED,
			__C.CLASSES.UNIVERSAL_STATES.BORDERED,
			__C.CLASSES.SIZES.SMALL,
			__C.CLASSES.HOOKS.ADD_AVATAR.COLLECTION
		),
		event_date = date.format(__C.DATE_FORMAT),
		time = event.dates.reduce((times, date) => {
			if (moment.unix(date.event_date).format(__C.DATE_FORMAT) === event_date) {
				
				return [...times, displayTimeRange(date.start_time, date.end_time)];
			}
			
			return times;
		}, []).join('; ');
	
	if (event.is_favorite) {
		avatars_collection_classes.push(__C.CLASSES.HOOKS.ADD_AVATAR.STATES.SHIFTED);
	}
	
	return (
		<React.Fragment>
			{hasDivider && <hr title={date.calendar().capitalize()} />}
			<div className="event_block" data-event-id={event_id} data-event_date={event_date}>
				<PageLink href={`/event/${event_id}`} className="event_block_img img_holder link">
					<img src={`${event.image_horizontal_url}?width=${coverWidth}`} title={event.title} width={coverWidth} />
				</PageLink>
				<div className="event_block_info">
					<header className="event_block_title">
						<PageLink href={`/event/${event_id}`} className="link">{event.title}</PageLink>
					</header>
					<div className="event_block_service">
						<p><small>{time}</small></p>
						<div className="event_block_action_buttons AddAvatarWrapper">
							<div className="event_block_add_avatar_wrapper">
								<AvatarCollection
									users={event.favored}
									maxCount={3}
									className={avatars_collection_classes}
									counterClasses={[
										__C.CLASSES.SIZES.X30,
										__C.CLASSES.UNIVERSAL_STATES.BORDERED,
										__C.CLASSES.COLORS.MARGINAL,
										__C.CLASSES.HOOKS.ADD_AVATAR.STATES.CASTABLE
									]}
									overallAvatarsCount={event.favored_users_count}
									onClick={() => {
										if (!this.favored_modal) {
											this.favored_modal = new FavoredModal(event.id);
										}
										this.favored_modal.show();
									}}
								/>
							</div>
							<div className="event_block_action_buttons_wrapper">
								<ReactAddToFavoriteButton
									event={event}
									isAddAvatar
									isChecked
									className={new HtmlClassesArray([
										'event_block_main_action_button',
										__C.CLASSES.SIZES.LOW,
										__C.CLASSES.UNIVERSAL_STATES.ROUNDED,
										__C.CLASSES.HOOKS.ADD_TO_FAVORITES,
										__C.CLASSES.HOOKS.RIPPLE
									])}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
}

EventBlock.propTypes = {
	event: PropTypes.instanceOf(OneEvent).isRequired,
	date: PropTypes.moment.isRequired,
	hasDivider: PropTypes.bool,
	coverWidth: PropTypes.number
};

const EventBlocks = componentsContainer(EventBlock, {
	entity_name: 'event',
	entities_name: 'events',
	CollectionClass: EventsCollection,
	noEntities: () => <Cap>{i18n(__S.NO_EVENTS)}</Cap>,
	renderEntities(events) {
		const {
			coverWidth,
			sortDateType = 'nearest_event_date'
		} = this.props;
		
		let last_date;
		
		return events.map(event => {
			const m_event_date = moment.unix(event[sortDateType] || event.first_event_date),
				event_date = m_event_date.format(__C.DATE_FORMAT),
				is_different_day = last_date !== event_date;
			
			last_date = event_date;
			
			return (
				<EventBlock
					key={event.id}
					event={event}
					date={m_event_date}
					coverWidth={coverWidth}
					hasDivider={is_different_day}
				/>
			)
		});
	}
});

EventBlocks.propTypes = {
	events: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.instanceOf(OneEvent)),
		PropTypes.instanceOf(EventsCollection)
	]).isRequired,
	sortDateType: PropTypes.string,
	coverWidth: PropTypes.number
};