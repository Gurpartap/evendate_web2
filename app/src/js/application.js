/**
 * @requires Class.ServerConnection.js
 */

__APP = {
	/**
	 * @type {ServerConnection}
	 */
	SERVER: new ServerConnection(),
	EVENDATE_BEGIN: '15-12-2015',
	AUTH_URLS: {},
	/**
	 * @property {string} ip
	 * @property {string} country_code
	 * @property {string} country_name
	 * @property {string} region_code
	 * @property {string} region_name
	 * @property {string} city
	 * @property {string} zip_code
	 * @property {string} time_zone
	 * @property {number} latitude
	 * @property {number} longitude
	 * @property {number} metro_code
	 */
	TOP_BAR: new AbstractTopBar(),
	SIDEBAR: new AbstractSidebar(),
	USER: new CurrentUser(),
	PREVIOUS_PAGE: new Page(),
	CURRENT_PAGE: new Page(),
	ROUTING: {
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
			'tickets': MyTicketsPage,
			'profile': MyProfilePage,
			'': MyProfilePage
		},
		'event': {
			'add_to': {
				'^([0-9]+)': AddEventPage,
				'': AddEventPage
			},
			'add': AddEventPage,
			'^([0-9]+)': {
				'edit': RedactEventPage,
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
				'edit': EditOrganizationPage,
				'': OrganizationPage
			},
			'': CatalogPage
		},
		'onboarding': OnboardingPage,
		'search': {
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
		'statistics': {
			'organization': {
				'^([0-9]+)': {
					'overview': StatisticsOrganizationOverviewPage,
					'events': StatisticsOrganizationEventsPage,
					'': StatisticsOrganizationOverviewPage
				}
			},
			'event': {
				'^([0-9]+)': StatisticsEventOverviewPage
			},
			'': StatisticsOverviewPage
		},
		'': ActualEventsPage
	},
	MODALS: new Modals(),
	BUILD: new Builder(),
	/**
	 * Rendering header tabs
	 * @param {(buildProps|Array<buildProps>)} tabs
	 */
	renderHeaderTabs: function renderHeaderTabs(tabs) {
		var $wrapper = $('#main_header_bottom').find('.HeaderTabsWrapper');
		tabs = tabs instanceof Array ? tabs : [tabs];
		tabs.forEach(function(tab) {
			tab = Builder.normalizeBuildProps(tab);
			tab.classes.push('tab', 'Tab');
			if (window.location.pathname.contains(tab.page)) {
				tab.classes.push(__C.CLASSES.ACTIVE);
			}
		});
		$wrapper.html(tmpl('tabs-header', {
			color: 'default',
			tabs: tmpl('link', tabs)
		}));
		bindTabs($wrapper);
		bindPageLinks($wrapper);
	},
	/**
	 * Changes title of the page
	 * @param {(string|Array<{page: {string}, title: {string}}>|jQuery)} new_title
	 */
	changeTitle: function changeTitle(new_title) {
		var $new_title = $(),
			title_str;
		if(typeof new_title === 'string') {
			title_str = new_title;
			new_title = new_title.split(' > ');
		}
		switch (true) {
			case (new_title instanceof Array): {
				new_title.forEach(function(title_chunk, i) {
					if (i) {
						$new_title = $new_title.add('<span class="title_chunk fa_icon fa-angle-right -empty"></span>');
					}
					if (typeof title_chunk == 'object') {
						title_chunk.toString = (Array.isArray(title_chunk)) ? Array.toSpaceSeparatedString : Object.toHtmlDataSet;
						$new_title = $new_title.add('<a href="' + title_chunk.page + '" class="title_chunk link Link">' + title_chunk.title + '</a>');
						new_title[i] = title_chunk.title;
					} else {
						$new_title = $new_title.add('<span class="title_chunk">' + title_chunk + '</span>');
					}
				});
				if (!title_str) {
					title_str = new_title.join(' > ');
				}
				break;
			}
			case (new_title instanceof jQuery): {
				$new_title = new_title;
				new_title.each(function() {
					if (this.text())
						title_str += this.text() + ' ';
				});
				break;
			}
		}
		bindPageLinks($('#page_title').html($new_title));
		$('title').text(title_str ? title_str : 'Evendate');
	},
	/**
	 * Pushes state in History.js`s states stack and renders page or replaces last state
	 * @param {string} page_name
	 * @param {boolean} [soft_change=false]
	 * @param {boolean} [reload=false]
	 */
	changeState: function changeState(page_name, soft_change, reload) {
		if (page_name) {
			page_name = page_name.indexOf('/') == 0 ? page_name : '/' + page_name;
			if (soft_change) {
				History.replaceState({_index: History.getCurrentIndex()}, '', page_name);
			} else {
				History.pushState({_index: History.getCurrentIndex()}, '', page_name);
			}
			if (!soft_change || (soft_change && reload)) {
				__APP.reInit();
			}
		} else {
			console.error('Need to pass page name');
		}
	},
	reload: function() {
		return __APP.changeState(location.pathname, true, true);
	},
	init: function appInit() {
		var $sidebar_nav_items = $('.SidebarNavItem');
		
		__APP.CURRENT_PAGE = Page.routeNewPage(window.location.pathname);
		__APP.CURRENT_PAGE.fetchData();
		__APP.CURRENT_PAGE.show();
		$sidebar_nav_items.removeClass(__C.CLASSES.ACTIVE)
			.filter(function() {
				return window.location.pathname.indexOf(this.getAttribute('href')) === 0;
			}).addClass(__C.CLASSES.ACTIVE);
	},
	reInit: function appReInit() {
		$(window).off('scroll');
		
		__APP.SERVER.abortAllConnections();
		__APP.PREVIOUS_PAGE = __APP.CURRENT_PAGE;
		__APP.PREVIOUS_PAGE.destroy();
		__APP.init();
		
		if (!(__APP.CURRENT_PAGE instanceof SearchPage)) {
			$('#search_bar_input').val('');
		}
	}
};

__ERRORS = [];

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
				
				WAITING_FOR_PAYMENT: 'Ожидает оплаты',
				IS_PENDING: 'Ожидает подтверждения',
				
				APPROVED: 'Подтверждено',
				PAYED: 'Оплачено',
				WITHOUT_PAYMENT: 'Подтверждено',
				
				TICKETS_ARE_OVER: 'Билеты закончились',
				RETURNED_BY_ORGANIZATION: 'Возврат билета организатором',
				PAYMENT_CANCELED_AUTO: 'Отмена транзакции',
				PAYMENT_CANCELED_BY_CLIENT: 'Отменено клиентом',
				RETURNED_BY_CLIENT: 'Возврат билета',
				REJECTED: 'Отклонено'
			}
		},
		DATE: {
			DATE_FORMAT: 'DD.MM.YYYY',
			TIME_FORMAT: 'HH:mm',
			DATE_TIME_FORMAT: 'DD.MM.YYYY HH:mm',
			MONTH_SHORT_NAMES: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
			MONTH_NAMES: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
			CALENDAR_DATE_TIME: {
				sameDay: '[Сегодня в] HH:mm',
				lastDay: '[Вчера в] HH:mm',
				nextWeek: 'dddd [в] HH:mm',
				lastWeek: 'D MMMM [в] HH:mm',
				sameElse: 'D MMMM [в] HH:mm'
			}
		}
	}
};
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
