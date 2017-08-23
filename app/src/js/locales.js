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
				sameDay: '[Сегодня в] HH:mm',
				lastDay: '[Вчера в] HH:mm',
				nextWeek: 'D MMMM [в] HH:mm',
				lastWeek: 'D MMMM [в] HH:mm',
				sameElse: 'D MMMM [в] HH:mm'
			}
		},
		DATATABLES_URL: '//cdn.datatables.net/plug-ins/1.10.15/i18n/Russian.json'
	}
};

__LOCALE = __LOCALES.ru_RU;
Object.freeze(__LOCALES);