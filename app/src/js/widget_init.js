sendPostMessage = (function(w) {
	var sendMessage = (function() {
		function postMessageFactory(command) {
			
			return function(data) {
				
				return w.parent.postMessage(JSON.stringify({
					command: command,
					data: data
				}), '*')
			};
		}
		
		return {
			ready: postMessageFactory('ready'),
			setHeight: postMessageFactory('setHeight')
		};
	}());
	
	/**
	 *
	 * @param {object} event
	 * @param {string} event.data
	 * @param {string} event.origin
	 * @param {Window} event.source
	 */
	function listener(event) {
		var resp = JSON.parse(event.data);
		
		switch (resp.command) {
			case 'setColor': {
				
				return !function(color){
					
					return w.document.body.style.setProperty('--color_accent', color);
				}(resp.data);
			}
			case 'getHeight': {
				
				return !function(current_height){
					
					return sendMessage.setHeight(calcHeight(current_height));
				}(resp.data);
			}
		}
	}
	
	if (w.addEventListener) {
		w.addEventListener("message", listener);
	} else {
		w.attachEvent("onmessage", listener);
	}
	
	return sendMessage;
}(window));

function calcHeight(current_height) {
	if (current_height && current_height > document.scrollingElement.scrollHeight) {
		
		return $('.Content').children().outerHeight() + 150;
	} else {
		
		return document.scrollingElement.scrollHeight;
	}
}

$(document)
	.ajaxStart(function() {
		Pace.restart()
	})
	.ready(function() {
		var user_jqhxr,
			auth_urls_jqxhr,
			cities_jqxhr;
		
		sendPostMessage.ready();
		
		(new MutationObserver(function() {
			sendPostMessage.setHeight(calcHeight());
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