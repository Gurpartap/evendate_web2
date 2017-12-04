/**
 * @requires AbstractEvendateApplication.js
 */
class EvendateApplication extends AbstractEvendateApplication {
	constructor() {
		super();
		this.EXPORT = new ServerExports();
		this.TOP_BAR = new AbstractTopBar();
		this.SIDEBAR = new AbstractSidebar();
		this.IS_WIDGET = false;
		this.POST_MESSAGE = new AppPostMessageConnection(window);
		this.ROUTING = {
			'admin': {
				'organization': {
					'^([0-9]+)': {
						'add': {
							'dispatch': AdminAddDispatchPage,
								'event': AddEventPage,
								'': AddEventPage
						},
						'dispatches': AdminOrganizationDispatchesPage,
							'dispatch': {
							'^([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})': {
								'edit': AdminEditDispatchPage,
									'': AdminEditDispatchPage
							},
							'add': AdminAddDispatchPage,
								'': AdminAddDispatchPage
						},
						'edit': AdminOrganizationEditPage,
							'overview': AdminOrganizationOverviewPage,
							'events': AdminOrganizationEventsPage,
							'crm': AdminOrganizationCRMPage,
							'requisites': AdminOrganizationRequisitesPage,
							'finances': AdminOrganizationFinancesPage,
							'settings': AdminOrganizationSettingsPage,
							'': AdminOrganizationOverviewPage
					}
				},
				'event': {
					'^([0-9]+)': {
						'overview': AdminEventOverviewPage,
							'sales': AdminEventSalesPage,
							'orders': AdminEventOrdersPage,
							'requests': AdminEventRequestsPage,
							'check_in': AdminEventCheckInPage,
							'utm_stats': AdminEventUTMTagsPage,
							'edit': AdminEventEditPage,
							'': AdminEventOverviewPage
					}
				},
				'': AdminOrganizationsPage
			},
			'add': {
				'event': {
					'to': {
						'^([0-9]+)': AddEventPage,
							'': AddEventPage
					},
					'': AddEventPage
				},
				'organization': AddOrganizationPage
			},
			'my': {
				'orders': MyOrdersPage,
					'tickets': MyTicketsPage,
					'profile': MyProfilePage,
					'': MyProfilePage
			},
			'event': {
				'add_to': {
					'^([0-9]+)': AddEventPage,
						'': AddEventPage
				},
				'add': {
					'to': {
						'^([0-9]+)': AddEventPage,
							'': AddEventPage
					},
					'': AddEventPage
				},
				'^([0-9]+)': {
					'order': {
						'^([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})': {
							'from_legal_entity': LegalEntityPayment
						},
						'': OrderPage
					},
					'edit': EditEventPage,
						'': EventPage
				},
				'': FeedPage
			},
			'feed': {
				'actual': ActualEventsPage,
					'timeline': TimelineEventsPage,
					'favored': FavoredEventsPage,
					'recommendations': RecommendedEventsPage,
					'friends': FriendsEventsPage,
					'day': {
					'^([0-9]{4}-[0-9]{2}-[0-9]{2})': DayEventsPage //Very shitty way to detect date
				},
				'': ActualEventsPage
			},
			'organizations': {
				'at': {
					'^([0-9]+)': CatalogPage,
						'^([^/]+)': {
						'^([0-9]+)': CatalogPage,
							'': CatalogPage
					}
				},
				'^([0-9]+)': CatalogPage,
					'': CatalogPage
			},
			'organization': {
				'add': AddOrganizationPage,
					'^([0-9]+)': {
					'feedback': OrganizationFeedbackPage,
						'edit': EditOrganizationPage,
						'': OrganizationPage
				},
				'': CatalogPage
			},
			'onboarding': OnboardingPage,
				'search': {
				'tag': {
					'^([^/]+)': SearchByTagPage
				},
				'^([^/]+)': SearchPage
			},
			'friends': MyProfilePage,
				'friend': {
				'^([0-9]+)': UserPage,
					'': MyProfilePage
			},
			'user': {
				'me': MyProfilePage,
					'^([0-9]+)': UserPage,
					'': MyProfilePage
			},
			'ticket': {
				'^([^/]+)': TicketPage,
					'': TicketPage
			},
			'': ActualEventsPage
		};
	}
	/**
	 *
	 * @param {object} colors
	 * @param {string} [colors.header]
	 * @param {string} [colors.accent]
	 */
	repaint(colors) {
		AbstractEvendateApplication.prototype.repaint.call(this, colors);
		
		if (colors.header) {
			(hex => {
				const main_header_style = this.TOP_BAR.$main_header.get(0).style,
					contrast_hex = getContrastColor(hex);
				
				main_header_style.setProperty('--color_primary', hex);
				main_header_style.setProperty('color', contrast_hex);
			})(colors.header);
		}
	}
	
	
	setDefaultColors() {
		const main_header_style = this.TOP_BAR.$main_header.get(0).style;
		
		AbstractEvendateApplication.prototype.setDefaultColors.call(this);
		
		main_header_style.removeProperty('--color_primary');
		main_header_style.removeProperty('color');
	}
	/**
	 * Changes title of the page
	 * @param {(string|Array<{page: {string}, title: {string}}>|jQuery)} new_title
	 */
	changeTitle(new_title) {
		var title_str;
		
		title_str = (function() {
			if (typeof new_title === 'string') {
				
				return new_title;
			} else if (new_title instanceof Array) {
				if (typeof new_title[0] === 'object') {
					
					return new_title.map(function(title_chunk) {
						if (typeof title_chunk === 'object') {
							return title_chunk.title;
						}
						
						return title_chunk;
					}).join(' > ');
				}
				
				return new_title.join(' > ');
			} else if (new_title instanceof jQuery) {
				
				return new_title.text();
			}
			
			return '';
		}());
		
		this.TOP_BAR.changeTitle(new_title);
		$('title').text(title_str ? title_str : 'Evendate');
	}
	
	init() {
		AbstractEvendateApplication.prototype.init.call(this);
		
		this.SIDEBAR.activateNavItem(window.location.pathname);
	}
}