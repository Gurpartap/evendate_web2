/**
 * @requires ../Class.Page.js
 */
/**
 * @deprecated
 * @class OldUserPage
 * @extends Page
 */
class OldUserPage extends Page {
	/**
	 *
	 * @param {number} user_id
	 * @constructs OldUserPage
	 */
	constructor(user_id) {
		super();
		this.user_id = user_id;
		this.user = new OneUser(user_id);
		this.events_metadata = {last_date: ''};
		
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
		this.pageTitle = () => {
			
			return this.user.full_name;
		};
	}
	
	static bindEvents($parent) {
		bindRippleEffect($parent);
		trimAvatarsCollection($parent);
		__APP.MODALS.bindCallModal($parent);
		bindPageLinks($parent);
	}
	
	fetchData() {
		if (!(parseInt(this.user_id) === __APP.USER.id || this.user_id === 'me')) {
			
			return this.fetching_data_defer = this.user.fetchUser(new Fields(
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
		}
		
		return Promise.resolve();
	}
	
	/**
	 *
	 * @return {Promise}
	 */
	fetchActivities() {
		
		return this.user.actions.fetch(new Fields('organization', 'event', 'type_code', 'created_at'), 20, '-created_at');
	};
	
	/**
	 *
	 * @return {Promise}
	 */
	fetchFavoredEvents() {
		
		return this.user.fetchFavored(this.favored_fetch_data);
	};
	
	buildActivities(activities) {
		
		return __APP.BUILD.activity(activities.map((activity => {
			activity.user = this.user;
			
			return activity;
		})));
	};
	
	buildFavoredEvents(events) {
		
		return __APP.BUILD.eventBlocks(events, this.events_metadata);
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
		
		if (!is_upload_disabled && !is_scroll_blocked) {
			const $wrapper = this.$wrapper.find('.TabsBody').filter(`[data-tab_body_type="${type}"]`);
			let fetch_promise,
				$loader;
			
			switch (type) {
				case __C.ENTITIES.EVENT: {
					fetch_promise = this.fetchFavoredEvents();
					break;
				}
				case __C.ENTITIES.ACTIVITY: {
					fetch_promise = this.fetchActivities();
					break;
				}
				default: {
					
					return Promise.resolve();
				}
			}
			
			this.block_scroll[type] = true;
			$loader = __APP.BUILD.loaderBlock($wrapper);
			
			return fetch_promise.then(entities => {
				this.block_scroll[type] = false;
				$loader.remove();
				
				if (entities.length) {
					let $entities;
					
					switch (type) {
						case __C.ENTITIES.EVENT: {
							
							return this.page_component.favored_events.appendEvents(entities);
						}
						case __C.ENTITIES.ACTIVITY: {
							$entities = this.buildActivities(entities);
							break;
						}
					}
					
					$wrapper.append($entities);
					OldUserPage.bindEvents($entities);
				} else {
					if (!$wrapper.children().length) {
						$wrapper.append(__APP.BUILD.cap('Активности нет'));
						this.disable_uploads[type] = true;
					}
				}
			});
		}
		
		return Promise.resolve();
	};
	
	/**
	 *
	 * @param {__C.ENTITIES} entity_type
	 * @param entities
	 */
	renderEntities(entity_type, entities) {
		const $wrapper = this.$wrapper.find('.TabsBody').filter(`[data-tab_body_type="${entity_type}"]`);
		
		$wrapper.append(entities);
		OldUserPage.bindEvents(entities);
	};
	
	init() {
		const {$wrapper} = this;
		
		bindTabs($wrapper);
		OldUserPage.bindEvents($wrapper);
		
		$wrapper.find('.Tabs').on('tabs:change', () => {
			this.active_tab = $wrapper.find('.TabsBody').filter(`.${__C.CLASSES.ACTIVE}`).data('tab_body_type');
			this.bindScrollEvents();
		});
	};
	
	bindScrollEvents() {
		var $window = $(window),
			event_names = {
				[__C.ENTITIES.EVENT]: 'scroll.uploadEvents',
				[__C.ENTITIES.ACTIVITY]: 'scroll.uploadActivities',
			};
		
		$window.off(Object.values(event_names).join(' '));
		
		switch (this.active_tab) {
			case __C.ENTITIES.EVENT:
			case __C.ENTITIES.ACTIVITY: {
				if ( isScrollRemain(1000) ) {
					
					return this.uploadEntities(this.active_tab);
				}
				
				return new Promise(resolve => {
					$window.on(event_names[this.active_tab], () => {
						if ( isScrollRemain(1000) ) {
							resolve(this.uploadEntities(this.active_tab));
						}
					});
				});
			}
			default: {
				
				return Promise.resolve();
			}
		}
	};
	
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
					<AvatarBlocks isLink entities={entities} entity={entitiesType} avatarClasses={avatar_classes} />
					<footer className="user_page_sidebar_footer">
						<Button className={__C.CLASSES.COLORS.NEUTRAL_ACCENT} onClick={showAllClickHandler}>Показать все</Button>
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
	
	/**
	 *
	 * @param {object} props
	 * @param {(OneUser|CurrentUser)} props.user
	 * @return {XML}
	 * @constructor
	 */
	static PageComponent({user}) {
		const {SidebarWrapper} = OldUserPage,
			is_another_user = __APP.USER.id !== parseInt(user.id),
			logoutClickHandler = e => {
				rippleEffectHandler(e);
				__APP.USER.logout();
			};
		
		return (
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
						 <Button className={__C.CLASSES.COLORS.NEUTRAL_ACCENT} onClick={logoutClickHandler}>Выйти</Button>}
					</header>
					<SidebarWrapper
						user={user}
						title="Подписан на организаторов"
						noEntitiesText="Нет подписок"
						entities={user.subscriptions}
						entitiesType={__C.ENTITIES.ORGANIZATION}
						showAllModalClass={SubscriptionsListModal}
					/>
					{!is_another_user &&
					 <SidebarWrapper
						 user={user}
						 title="Подписан на пользователей"
						 noEntitiesText="Нет друзей"
						 entities={user.friends}
						 entitiesType={__C.ENTITIES.USER}
						 showAllModalClass={FriendsListModal}
					 />}
				</div>
				<div className="page user_page_content Tabs">
					<header className="user_page_content_header tabs_header HeaderTabs -color_accent">
						<span className="tab Tab">Активность</span>
						<span className="tab Tab -active">Избранные события</span>
					</header>
					<div className="tab_bodies_wrap TabsBodyWrapper">
						<div className="tab_body TabsBody" data-tab_body_type="activity" />
						<div className="tab_body TabsBody -active" data-tab_body_type="event" >
							<EventBlocks ref={component => this.favored_events = component} events={user.favored} />
						</div>
					</div>
				</div>
			</div>
		);
	}
	
	render() {
		const {user} = this,
			is_another_user = this instanceof OldMyProfilePage === false,
			promises = [];
		
		if (is_another_user && parseInt(this.user_id) === __APP.USER.id) {
			__APP.changeState('/my/profile', true, true);
			
			return null;
		}
		
		this.user.setData({
			...user,
			actions: user.actions.map(action => {
				
				return {...action, user};
			})
		});
		
		this.page_component = <UserPage.PageComponent user={user} />;
		debugger;
		
		ReactDOM.render(this.page_component, this.$wrapper.get(0));
		
		if (user.actions.length) {
			this.renderEntities(__C.ENTITIES.ACTIVITY, this.buildActivities(user.actions));
		} else {
			promises.push(this.uploadEntities(__C.ENTITIES.ACTIVITY));
		}
		
		if (user.favored.length) {
			this.renderEntities(__C.ENTITIES.EVENT, this.buildFavoredEvents(user.favored));
		} else {
			promises.push(this.uploadEntities(__C.ENTITIES.EVENT));
		}
		
		if (promises.length) {
			Promise.race(promises).then(() => {
				this.bindScrollEvents();
			});
		} else {
			this.bindScrollEvents();
		}
		
		this.init();
	};
}