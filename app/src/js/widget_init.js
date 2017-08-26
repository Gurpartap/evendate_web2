$(document)
	.ajaxStart(function() {
		Pace.restart()
	})
	.ready(function() {
		var user_jqhxr,
			auth_urls_jqxhr,
			cities_jqxhr;
		
		if (window.moment !== undefined) {
			moment.locale(navigator.language);
			moment.updateLocale('ru', {
				monthsShort: __LOCALES.ru_RU.DATE.MONTH_SHORT_NAMES,
				calendar: {
					sameDay: '[Сегодня]',
					nextDay: '[Завтра]',
					lastDay: '[Вчера]',
					nextWeek: 'D MMMM',
					lastWeek: 'D MMMM',
					sameElse: 'D MMMM'
				}
			})
		}
		
		if (window.Highcharts !== undefined) {
			Highcharts.setOptions({
				lang: {
					shortMonths: __LOCALES.ru_RU.DATE.MONTH_SHORT_NAMES
				}
			});
		}
		
		/**
		 * Bind only on 'back' action
		 */
		History.Adapter.bind(window, 'statechange', function() {
			if (!History.stateChangeHandled) {
				__APP.reInit();
			}
		});
		
		user_jqhxr = __APP.USER.fetchUser(new Fields('email'));
		auth_urls_jqxhr = AsynchronousConnection.dealAjax(AsynchronousConnection.HTTP_METHODS.GET, '/auth.php', {
			action: 'get_urls',
			mobile: isNotDesktop()
		});
		cities_jqxhr = (new CitiesCollection()).fetchCities(new Fields('timediff_seconds', 'distance'), 1, 'distance');
		
		__APP.SERVER.multipleAjax(user_jqhxr, auth_urls_jqxhr, cities_jqxhr, function(user_data, auth_urls, cities) {
			__APP.USER.selected_city.setData(cities[0]);
			__APP.AUTH_URLS = auth_urls;
			
			__APP.init();
			bindPageLinks();
		});
	});