/**
 *
 * @const __LOCALES
 * @template LOCALE
 * @enum LOCALE
 */
const __LOCALES = {
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
			CALENDAR_DATE_WITH_YEAR: {
				sameDay: '[Сегодня]',
				lastDay: '[Вчера]',
				nextWeek: __C.MOMENTJS_CALENDAR.DATE_AND_MONTH + ' ' + __C.MOMENTJS_CALENDAR.YEAR,
				lastWeek: __C.MOMENTJS_CALENDAR.DATE_AND_MONTH + ' ' + __C.MOMENTJS_CALENDAR.YEAR,
				sameElse: __C.MOMENTJS_CALENDAR.DATE_AND_MONTH + ' ' + __C.MOMENTJS_CALENDAR.YEAR
			},
			CALENDAR_DATE_TIME: {
				sameDay: '[Сегодня в] ' + __C.MOMENTJS_CALENDAR.HOURS_AND_MINUTES,
				lastDay: '[Вчера в] ' + __C.MOMENTJS_CALENDAR.HOURS_AND_MINUTES,
				nextWeek: __C.MOMENTJS_CALENDAR.DATE_AND_MONTH + ' [в] ' + __C.MOMENTJS_CALENDAR.HOURS_AND_MINUTES,
				lastWeek: __C.MOMENTJS_CALENDAR.DATE_AND_MONTH + ' [в] ' + __C.MOMENTJS_CALENDAR.HOURS_AND_MINUTES,
				sameElse: __C.MOMENTJS_CALENDAR.DATE_AND_MONTH + ' [в] ' + __C.MOMENTJS_CALENDAR.HOURS_AND_MINUTES
			}
		},
		DATATABLES_URL: '//cdn.datatables.net/plug-ins/1.10.15/i18n/Russian.json'
	},
	en_EN: {
		DATE: {
			CALENDAR_DATE_TIME: {
				sameDay: '[Today at] ' + __C.MOMENTJS_CALENDAR.HOURS_AND_MINUTES,
				lastDay: '[Yesterday at] ' + __C.MOMENTJS_CALENDAR.HOURS_AND_MINUTES,
				nextWeek: __C.MOMENTJS_CALENDAR.DATE_AND_MONTH + ' [at] ' + __C.MOMENTJS_CALENDAR.HOURS_AND_MINUTES,
				lastWeek: __C.MOMENTJS_CALENDAR.DATE_AND_MONTH + ' [at] ' + __C.MOMENTJS_CALENDAR.HOURS_AND_MINUTES,
				sameElse: __C.MOMENTJS_CALENDAR.DATE_AND_MONTH + ' [at] ' + __C.MOMENTJS_CALENDAR.HOURS_AND_MINUTES
			}
		}
	}
};
__LOCALES.ru = __LOCALES.ru_RU;
__LOCALES.en = __LOCALES.en_EN;


const __S = {
	ACTIVITY: "activity",
	FAVORED_EVENT: "favored_event",
	
	NO_ELEMENTS: "no_elements",
	NO_EVENTS: "no_events",
	NO_ACTIVITIES: "no_activities",
	NO_FRIENDS: "no_friends",
	NO_SUBSCRIPTIONS: "no_subscriptions",
	
	LOGOUT: "logout",
	SHOW_ALL: "show_all",
	
	USER_SUBSCRIBED_TO_ORG: "user_subscribed_to_org",
	USER_SUBSCRIBED_TO_USER: "user_subscribed_to_user",
	USER_UNSUBSCRIBED_FROM_ORG: "user_unsubscribed_from_org",
	USER_FAVORED_EVENT: "user_favored_event",
	USER_UNFAVORED_EVENT: "user_unfavored_event",
	USER_SHARED_EVENT: "user_shared_event",
	
};

const __i18n = {
	en: {
		"values": {
			[__S.ACTIVITY]: [
				[0, 1, "activity"],
				[1, null, "activities"],
			],
			[__S.FAVORED_EVENT]: [
				[0, 1, "favored event"],
				[1, null, "favored events"]
			],
			
			[__S.NO_ELEMENTS]: "No elements",
			[__S.NO_EVENTS]: "No events",
			[__S.NO_ACTIVITIES]: "No activity",
			[__S.NO_FRIENDS]: "No friends",
			[__S.NO_SUBSCRIPTIONS]: "No subscriptions",
			
			[__S.LOGOUT]: "Logout",
			[__S.SHOW_ALL]: "Show all",
			
			[__S.USER_SUBSCRIBED_TO_ORG]: [
				[0, 1, "subscribed to an organization"],
				[1, null, "subscribed to organizations"],
			],
			[__S.USER_SUBSCRIBED_TO_USER]: [
				[0, 1, "subscribed to user"],
				[1, null, "subscribed to users"],
			],
			[__S.USER_UNSUBSCRIBED_FROM_ORG]: [[0, null, "unsubscribed from an organization"]],
			[__S.USER_FAVORED_EVENT]: [[0, null, "added to favorites an event"]],
			[__S.USER_UNFAVORED_EVENT]: [[0, null, "removed from favorites an event"]],
			[__S.USER_SHARED_EVENT]: [[0, null, "shared an event"]],
		},
		"contexts": [{
			"matches": {
				"gender": "male"
			},
			"values": {
			
			}
		}, {
			"matches": {
				"gender": "female"
			},
			"values": {
			
			}
		}]
	},
	
	
	ru: {
		"values": {
			[__S.ACTIVITY]: [
				[0, 1, "активность"],
				[1, null, "активности"],
			],
			[__S.FAVORED_EVENT]: [
				[0, 1, "избранное событие"],
				[1, null, "избранные события"]
			],
			
			[__S.NO_ELEMENTS]: "Нет элементов",
			[__S.NO_EVENTS]: "Событий нет",
			[__S.NO_ACTIVITIES]: "Активности нет",
			[__S.NO_FRIENDS]: "Нет друзей",
			[__S.NO_SUBSCRIPTIONS]: "Нет подписок",
			
			[__S.LOGOUT]: "Выйти",
			[__S.SHOW_ALL]: "Показать все",
		},
		"contexts": [{
			"matches": {
				"gender": "male"
			},
			"values": {
				[__S.USER_SUBSCRIBED_TO_ORG]: [
					[0, 1, "подписался на организацию"],
					[1, null, "подписался на организации"],
				],
				[__S.USER_SUBSCRIBED_TO_USER]: [
					[0, 1, "подписался на пользователя"],
					[1, null, "подписался на пользователей"],
				],
				[__S.USER_UNSUBSCRIBED_FROM_ORG]: [[0, null, "отписался от организации"]],
				[__S.USER_FAVORED_EVENT]: [[0, null, "добавил в избранное событие"]],
				[__S.USER_UNFAVORED_EVENT]: [[0, null, "удалил из избранного событие"]],
				[__S.USER_SHARED_EVENT]: [[0, null, "поделился событием"]]
			}
		}, {
			"matches": {
				"gender": "female"
			},
			"values": {
				[__S.USER_SUBSCRIBED_TO_ORG]: [
					[0, 1, "подписалась на организацию"],
					[1, null, "подписалась на организации"],
				],
				[__S.USER_SUBSCRIBED_TO_USER]: [
					[0, 1, "подписалась на пользователя"],
					[1, null, "подписалась на пользователей"],
				],
				[__S.USER_UNSUBSCRIBED_FROM_ORG]: [[0, null, "отписалась от организации"]],
				[__S.USER_FAVORED_EVENT]: [[0, null, "добавила в избранное событие"]],
				[__S.USER_UNFAVORED_EVENT]: [[0, null, "удалила из избранного событие"]],
				[__S.USER_SHARED_EVENT]: [[0, null, "поделилась событием"]]
			}
		}, {
			"matches": {
				"gender": "neutral"
			},
			"values": {
				[__S.USER_SUBSCRIBED_TO_ORG]: [
					[0, 1, "подписался(-ась) на организацию"],
					[1, null, "подписался(-ась) на организации"],
				],
				[__S.USER_SUBSCRIBED_TO_USER]: [
					[0, 1, "подписался(-ась) на пользователя"],
					[1, null, "подписался(-ась) на пользователей"],
				],
				[__S.USER_UNSUBSCRIBED_FROM_ORG]: [[0, null, "отписался(-ась) от организации"]],
				[__S.USER_FAVORED_EVENT]: [[0, null, "добавил(а) в избранное событие"]],
				[__S.USER_UNFAVORED_EVENT]: [[0, null, "удалил(а) из избранного событие"]],
				[__S.USER_SHARED_EVENT]: [[0, null, "поделился(-ась) событием"]]
			}
		}]
	}
};

function getBrowserLang() {
	
	return (navigator.languages && navigator.languages[0]) || navigator.language || navigator.userLanguage;
}

const language = getBrowserLang();
const language_without_region_code = language.toLowerCase().split(/[_-]+/)[0];

const __LOCALE = __LOCALES[language.replaceSeparator('-', '_')] || __LOCALES.ru_RU;