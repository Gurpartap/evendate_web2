/**
 * @requires asyncPage.js
 */
const UserPage = asyncPage({
	constructPage({user_id = __APP.USER.id}) {
		
		return {
			user: new OneUser(user_id)
		};
	},
	fetchData(props) {
		
		return props.user.fetchUser(new Fields(
			'type',
			'is_friend',
			'link',
			'accounts',
			'accounts_links', {
				friends: {
					fields: ['is_friend'],
					length: 4
				}, subscriptions: {
					fields: ['img_small_url'],
					length: 4,
					order_by: ['organization_type_order', 'organization_type_id']
				}
			}
		));
	},
	pageTitle(props) {
		
		return props.user.full_name;
	}
}, class UserPage extends React.Component {
	/**
	 *
	 * @param {object} props
	 * @param {(OneUser|CurrentUser)} props.user
	 * @param {string} props.title
	 * @param {string} props.noEntitiesText
	 * @param {(UsersCollection|Array<OneUser>|OrganizationsCollection|Array<OneOrganization>)} props.entities
	 * @param {__C.ENTITIES} props.entitiesType
	 * @param {AbstractListModal} props.showAllModalClass
	 * @return {XML}
	 * @constructor
	 */
	static SidebarWrapper({
		user,
		title,
		noEntitiesText,
		entities,
		entitiesType,
		showAllModalClass
	}) {
		if (entities.length) {
			const avatar_classes = [__C.CLASSES.SIZES.X30],
				showAllClickHandler = function(e) {
					rippleEffectHandler(e);
					
					if (!this.modal) {
						this.modal = new showAllModalClass(user);
					}
					this.modal.show();
				};
			
			if (entitiesType === __C.ENTITIES.USER) {
				avatar_classes.push(__C.CLASSES.UNIVERSAL_STATES.ROUNDED);
			}
			
			return (
				<div className="user_page_sidebar_wrapper">
					<span className="sidebar_section_heading">{title}</span>
					<AvatarBlocks isLink entities={entities.slice(0, 4)} entity={entitiesType} avatarClasses={avatar_classes} />
					<footer className="user_page_sidebar_footer">
						<Button className={__C.CLASSES.COLORS.NEUTRAL_ACCENT} onClick={showAllClickHandler}>{i18n(__S.SHOW_ALL)}</Button>
					</footer>
				</div>
			);
		} else {
			
			return (
				<div className="user_page_sidebar_wrapper">
					<span className="sidebar_section_heading">{title}</span>
					<div className="cap"><span className="cap_message">{noEntitiesText}</span></div>
				</div>
			);
		}
	}
	
	constructor(props) {
		super(props);
		
		this.disable_uploads = {
			[__C.ENTITIES.EVENT]: false,
			[__C.ENTITIES.ACTIVITY]: false
		};
		this.block_scroll = {
			[__C.ENTITIES.EVENT]: false,
			[__C.ENTITIES.ACTIVITY]: false
		};
		
		this.active_tab = __C.ENTITIES.EVENT;
		this.favored_fetch_data = {
			fields: new Fields(
				'image_horizontal_medium_url',
				'favored_users_count',
				'is_favorite',
				'is_registered',
				'registration_locally',
				'registration_available',
				'ticketing_locally',
				'ticketing_available',
				'dates', {
					favored: {
						length: 5
					}
				}
			),
			order_by: 'nearest_event_date,-first_event_date',
			length: 10
		};
	}
	
	componentDidMount() {
		const {user} = this.props,
			promises = [];
		
		if (!user.actions.length) {
			promises.push(this.uploadEntities(__C.ENTITIES.ACTIVITY));
		}
		
		if (!user.favored.length) {
			promises.push(this.uploadEntities(__C.ENTITIES.EVENT));
		}
		
		if (promises.length) {
			Promise.race(promises).then(() => {
				this.bindScrollEvents();
			});
		} else {
			this.bindScrollEvents();
		}
	}
	
	componentWillUnmount() {
		this.unbindScrollEvents();
	}
	
	/**
	 *
	 * @return {Promise}
	 */
	fetchActivities() {
		
		return this.props.user.actions.fetch(new Fields('organization', 'event', 'type_code', 'created_at'), 20, '-created_at');
	};
	
	/**
	 *
	 * @return {Promise}
	 */
	fetchFavoredEvents() {
		
		return this.props.user.fetchFavored(this.favored_fetch_data);
	};
	
	/**
	 *
	 * @param {__C.ENTITIES} type
	 *
	 * @returns {Promise}
	 */
	uploadEntities(type) {
		const is_upload_disabled = this.disable_uploads[type],
			is_scroll_blocked = this.block_scroll[type];
		
		let fetch_promise;
		
		if (is_scroll_blocked || is_upload_disabled) {
			
			return Promise.resolve();
		}
		
		switch (type) {
			case __C.ENTITIES.EVENT: {
				this.favored_events.setLoadingState();
				fetch_promise = this.fetchFavoredEvents();
				break;
			}
			case __C.ENTITIES.ACTIVITY: {
				this.activities.setLoadingState();
				fetch_promise = this.fetchActivities();
				break;
			}
			default: {
				
				return Promise.resolve();
			}
		}
		
		this.block_scroll[type] = true;
		
		return fetch_promise.then(entities => {
			this.block_scroll[type] = false;
			
			if (!entities.length) {
				this.disable_uploads[type] = true;
			}
			
			switch (type) {
				case __C.ENTITIES.EVENT: {
					
					return this.favored_events.unsetLoadingState().update();
				}
				case __C.ENTITIES.ACTIVITY: {
					
					return this.activities.unsetLoadingState().update();
				}
			}
			
			return entities;
		});
	};
	
	unbindScrollEvents() {
		var $window = $(window);
		
		$window.off('scroll.uploadEntities');
	}
	
	bindScrollEvents() {
		var $window = $(window);
		
		this.unbindScrollEvents();
		
		switch (this.tabs.state.selected_tab) {
			case __C.ENTITIES.EVENT:
			case __C.ENTITIES.ACTIVITY: {
				if ( isScrollRemain(1000) ) {
					this.uploadEntities(this.tabs.state.selected_tab);
				}
				
				$window.on('scroll.uploadEntities', () => {
					if ( isScrollRemain(1000) ) {
						this.uploadEntities(this.tabs.state.selected_tab);
					}
				});
			}
			default: {
				
				return Promise.resolve();
			}
		}
	};
	
	render() {
		const {user} = this.props,
			{SidebarWrapper} = UserPage,
			is_another_user = __APP.USER.id !== parseInt(user.id),
			logoutClickHandler = e => {
				rippleEffectHandler(e);
				__APP.USER.logout();
			};
		
		return contentWrap(
			<div className={`user_page_wrapper ${is_another_user ? '-another_user' : '-this_user'}`}>
				<div className="page user_page_sidebar">
					<header className="user_page_sidebar_header">
						<UserTombstones users={user} avatarClasses={[
							__C.CLASSES.UNIVERSAL_STATES.BORDERED,
							__C.CLASSES.UNIVERSAL_STATES.SHADOWED
						]} />
						<div className="user_page_social_links">
							<SocialLinks links={user.accounts_links} className={__C.CLASSES.UNIVERSAL_STATES.ROUNDED} />
						</div>
						{!is_another_user &&
						 <Button className={__C.CLASSES.COLORS.NEUTRAL_ACCENT} onClick={logoutClickHandler}>{i18n(__S.LOGOUT)}</Button>}
					</header>
					<SidebarWrapper
						user={user}
						title={i18n(__S.USER_SUBSCRIBED_TO_ORG, user.subscriptions.length, {}, {
							gender: user.gender
						})}
						noEntitiesText={i18n(__S.NO_SUBSCRIPTIONS)}
						entities={user.subscriptions}
						entitiesType={__C.ENTITIES.ORGANIZATION}
						showAllModalClass={SubscriptionsListModal}
					/>
					{!is_another_user &&
					 <SidebarWrapper
						 user={user}
						 title={i18n(__S.USER_SUBSCRIBED_TO_USER, user.friends.length, {}, {
							 gender: user.gender
						 })}
						 noEntitiesText={i18n(__S.NO_FRIENDS)}
						 entities={user.friends}
						 entitiesType={__C.ENTITIES.USER}
						 showAllModalClass={FriendsListModal}
					 />}
				</div>
				<Tabs
					ref={component => this.tabs = component}
					className="page user_page_content"
					headerClasses="user_page_content_header -color_accent"
					selectedTab="event"
				>
					<Tab title={i18n(__S.ACTIVITY, 1)} name="activity">
						<UserActivities ref={component => this.activities = component} user={user} activities={user.actions} />
					</Tab>
					<Tab title={i18n(__S.FAVORED_EVENT, 2)} name="event">
						<EventBlocks ref={component => this.favored_events = component} events={user.favored} />
					</Tab>
				</Tabs>
			</div>
		);
	}
});