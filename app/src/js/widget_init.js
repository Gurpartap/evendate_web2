function calcHeight() {
	var $content = $('.Content');
	
	if ($content.children().length) {
		
		if (document.scrollingElement.scrollHeight > $content.children().outerHeight() + 150) {
			
			return $content.children().outerHeight() + 150;
		}
		
	}
	
	return document.scrollingElement.scrollHeight;
}

__APP.POST_MESSAGE.listen(PostMessageConnection.AVAILABLE_COMMANDS.SET_COLOR, function(color) {
	
	return this.document.body.style.setProperty('--color_accent', color, '');
});

__APP.POST_MESSAGE.listen(PostMessageConnection.AVAILABLE_COMMANDS.GET_HEIGHT, function() {
	
	return __APP.POST_MESSAGE.setHeight(calcHeight());
});

__APP.POST_MESSAGE.listen(PostMessageConnection.AVAILABLE_COMMANDS.REDIRECT, function(redirect_uri) {
	
	return this.location.href = redirect_uri;
});

__APP.POST_MESSAGE.listen(PostMessageConnection.AVAILABLE_COMMANDS.FETCH_REDIRECT_PARAM, function(data, source) {
	
	return __APP.POST_MESSAGE.passRedirectToParam(window.location, source);
});


$(document)
	.ajaxStart(function() {
		Pace.restart()
	})
	.ready(function() {
		var user_jqhxr,
			auth_urls_jqxhr,
			cities_jqxhr;
		
		__APP.POST_MESSAGE.ready();
		
		(new MutationObserver(function() {
			__APP.POST_MESSAGE.setHeight(calcHeight());
		})).observe(document.body, {
			childList: true,
			subtree: true
		});
		
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
				__APP.init();
			}
		});
		
		user_jqhxr = __APP.USER.fetchUser(new Fields('email'));
		auth_urls_jqxhr = AsynchronousConnection.dealAjax(AsynchronousConnection.HTTP_METHODS.GET, '/auth.php', {
			action: 'get_urls',
			mobile: false
		});
		cities_jqxhr = (new CitiesCollection()).fetchCities(new Fields('timediff_seconds', 'distance'), 1, 'distance');
		
		__APP.SERVER.multipleAjax(user_jqhxr, auth_urls_jqxhr, cities_jqxhr, function(user_data, auth_urls, cities) {
			__APP.USER.selected_city.setData(cities[0]);
			__APP.AUTH_URLS = auth_urls;
			
			__APP.init();
			bindPageLinks();
		});
	});