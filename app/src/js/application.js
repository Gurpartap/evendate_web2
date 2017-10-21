/**
 *
 * @const __APP
 */
__APP = {
	/**
	 * @type {ServerConnection}
	 */
	SERVER: new ServerConnection(),
	EXPORT: new ServerExports(),
	POST_MESSAGE: new AppPostMessageConnection(window),
	EVENDATE_BEGIN: '15-12-2015',
	AUTH_URLS: {},
	TOP_BAR: new AbstractTopBar(),
	SIDEBAR: new AbstractSidebar(),
	USER: new CurrentUser(),
	PREVIOUS_PAGE: new Page(),
	CURRENT_PAGE: new Page(),
	ROUTING: {
		'admin': {
			'organization': {
				'^([0-9]+)': {
					'add': {
						'event': AddEventPage,
						'': AddEventPage
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
	},
	MODALS: new Modals(),
	BUILD: new Builder(),
	YA_METRIKA: window.yaCounter32442130 || null,
	IS_WIDGET: false,
	IS_REPAINTED: false,
	LOADER: $(),
	/**
	 *
	 * @param {object} colors
	 * @param {string} [colors.header]
	 * @param {string} [colors.accent]
	 */
	repaint: function(colors) {
		__APP.IS_REPAINTED = true;
		
		if (colors.header) {
			(function(hex) {
				var main_header = __APP.TOP_BAR.$main_header.get(0),
					contrast_hex = getContrastColor(hex);
				
				main_header.style.setProperty('--color_primary', hex);
				main_header.style.setProperty('color', contrast_hex);
			})(colors.header);
		}
		
		if (colors.accent) {
			(function(hex) {
				$('#main_overlay').get(0).style.setProperty('--color_accent', hex);
			})(colors.accent);
		}
	},
	
	setDefaultColors: function() {
		var main_header = __APP.TOP_BAR.$main_header.get(0),
			main_overlay = $('#main_overlay').get(0);
		
		main_header.style.removeProperty('--color_primary');
		main_header.style.removeProperty('color');
		
		main_overlay.style.removeProperty('--color_accent');
	},
	/**
	 * Changes title of the page
	 * @param {(string|Array<{page: {string}, title: {string}}>|jQuery)} new_title
	 */
	changeTitle: function changeTitle(new_title) {
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
		
		__APP.TOP_BAR.changeTitle(new_title);
		$('title').text(title_str ? title_str : 'Evendate');
	},
	/**
	 * Pushes state in History.js`s states stack and renders page or replaces last state
	 * @param {string} page_name
	 * @param {boolean} [soft_change=false]
	 * @param {boolean} [reload=false]
	 *
	 * @return {boolean} false
	 */
	changeState: function changeState(page_name, soft_change, reload) {
		var parsed_uri;
		
		History.stateChangeHandled = true;
		if (page_name) {
			page_name = page_name.indexOf('/') === 0 ? page_name : '/' + page_name;
			parsed_uri = parseUri(decodeURIComponent(page_name));
			if (soft_change) {
				History.replaceState({parsed_page_uri: parsed_uri}, '', parsed_uri.path);
			} else {
				History.pushState({parsed_page_uri: parsed_uri}, '', parsed_uri.path);
			}
			if (!soft_change || (soft_change && reload)) {
				__APP.init();
			}
		} else {
			console.error('Need to pass page name');
		}
		History.stateChangeHandled = false;
		
		return false;
	},
	reload: function() {
		
		return __APP.changeState(location.pathname, true, true);
	},
	openPage: function(page) {
		$(window).off('scroll');
		
		AbstractAppInspector.hideCurrent();
		__APP.SERVER.abortAllConnections();
		__APP.PREVIOUS_PAGE = __APP.CURRENT_PAGE;
		__APP.PREVIOUS_PAGE.destroy();
		
		__APP.CURRENT_PAGE = page;
		__APP.CURRENT_PAGE.fetchData();
		__APP.CURRENT_PAGE.show();
		
		return __APP.CURRENT_PAGE;
	},
	init: function appInit() {
		var pathname = window.location.pathname;
		
		__APP.openPage(Page.routeNewPage(pathname));
		__APP.SIDEBAR.activateNavItem(pathname);
	}
};

__ERRORS = [];
/**
 *
 * @const __LOCALES
 */
__LOCALES = {
	ru_RU: {
		TEXTS: {
			BUTTON: {
				REMOVE_FAVORITE: 'Убрать',
				ADD_FAVORITE: 'В избранное',
				FAVORED: 'В избранном',
				ADD_SUBSCRIPTION: 'Подписаться',
				REMOVE_SUBSCRIPTION: 'Отписаться',
				SUBSCRIBED: 'Подписан',
				EDIT: 'Изменить'
			},
			SUBSCRIBERS: {
				NOM: ' подписчик',
				GEN: ' подписчика',
				PLU: ' подписчиков'
			},
			PEOPLE: {
				NOM: ' человек',
				GEN: ' человека',
				PLU: ' человек'
			},
			FAVORED: {
				NOM: ' участник',
				GEN: ' участника',
				PLU: ' участников'
			},
			ACTIVITY: {
				SUBSCRIBE: {
					MAS: 'подписался на организацию',
					FEM: 'подписалась на организацию',
					NEU: 'подписалось на организацию'
				},
				UNSUBSCRIBE: {
					MAS: 'отписался от организации',
					FEM: 'отписалась от организации',
					NEU: 'отписалось от организации'
				},
				FAVE: {
					MAS: 'добавил в избранное событие',
					FEM: 'добавила в избранное событие',
					NEU: 'добавило в избранное событие'
				},
				UNFAVE: {
					MAS: 'удалил из избранного событие',
					FEM: 'удалила из избранного событие',
					NEU: 'удалило из избранного событие'
				},
				SHARE: {
					MAS: 'поделился событием',
					FEM: 'поделилась событием',
					NEU: 'поделилось событием'
				}
			},
			TICKET_STATUSES: {
				USED: 'Билет использован',
				
				WAITING_PAYMENT_LEGAL_ENTITY: 'Ожидает оплаты от юрлица',
				WAITING_FOR_PAYMENT: 'Ожидает оплаты',
				IS_PENDING: 'Ожидает подтверждения',
				
				APPROVED: 'Подтверждено',
				PAYED: 'Оплачено',
				WITHOUT_PAYMENT: 'Без оплаты',
				
				TICKETS_ARE_OVER: 'Билеты закончились',
				RETURNED_BY_ORGANIZATION: 'Возврат билета организатором',
				PAYMENT_CANCELED_AUTO: 'Истек срок оплаты',
				PAYMENT_CANCELED_BY_CLIENT: 'Отменен клиентом',
				RETURNED_BY_CLIENT: 'Возврат билета',
				REJECTED: 'Отклонен'
			}
		},
		DATE: {
			DATE_FORMAT: 'DD.MM.YYYY',
			TIME_FORMAT: 'HH:mm',
			DATE_TIME_FORMAT: 'DD.MM.YYYY, HH:mm',
			MONTH_SHORT_NAMES: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
			MONTH_NAMES: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
			CALENDAR_DATE_TIME: {
				sameDay: '[Сегодня в] ' + __C.MOMENTJS_CALENDAR.HOURS_AND_MINUTES,
				lastDay: '[Вчера в] ' + __C.MOMENTJS_CALENDAR.HOURS_AND_MINUTES,
				nextWeek: __C.MOMENTJS_CALENDAR.DATE_AND_MONTH + ' [в] ' + __C.MOMENTJS_CALENDAR.HOURS_AND_MINUTES,
				lastWeek: __C.MOMENTJS_CALENDAR.DATE_AND_MONTH + ' [в] ' + __C.MOMENTJS_CALENDAR.HOURS_AND_MINUTES,
				sameElse: __C.MOMENTJS_CALENDAR.DATE_AND_MONTH + ' [в] ' + __C.MOMENTJS_CALENDAR.HOURS_AND_MINUTES
			}
		},
		DATATABLES_URL: '//cdn.datatables.net/plug-ins/1.10.15/i18n/Russian.json'
	}
};

__LOCALE = __LOCALES.ru_RU;

Object.seal(__APP);
Object.freeze(__APP.SERVER);
Object.freeze(__APP.ROUTING);
Object.freeze(__APP.BUILD);
Object.freeze(__C);
Object.freeze(__LOCALES);

/**
 *
 * @class jqPromise
 */
/**
 * @method
 * @name jqPromise#then
 * @param {(Function|Array<Function>)} doneCallbacks
 * @param {(Function|Array<Function>)} [failCallbacks]
 * @param {(Function|Array<Function>)} [progressCallbacks]
 * @returns {jqPromise}
 */
/**
 * @method
 * @name jqPromise#progress
 * @param {...(Function|Array<Function>)} progressCallbacks
 * @returns {Deferred}
 */
/**
 * @method
 * @name jqPromise#done
 * @param {...(Function|Array<Function>)} doneCallbacks
 * @returns {Deferred}
 */
/**
 * @method
 * @name jqPromise#fail
 * @param {...(Function|Array<Function>)} failCallbacks
 * @returns {Deferred}
 */
/**
 * @method
 * @name jqPromise#always
 * @param {...(Function|Array<Function>)} alwaysCallbacks
 * @returns {Deferred}
 */
/**
 * @method
 * @name jqPromise#promise
 * @param {Object} [target]
 * @returns {jqPromise}
 */
/**
 * @method
 * @name jqPromise#state
 * @returns {__C.DEFERRED_STATES}
 */
