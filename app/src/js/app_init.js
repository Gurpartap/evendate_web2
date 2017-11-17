window.paceOptions = {
	ajax: false, // disabled
	document: false, // disabled
	eventLag: false, // disabled
	elements: {},
	search_is_active: false,
	search_query: null,
	search_xhr: null
};
__stats = [];
askToSubscribe = null;

/**
 *
 * @param {string} [path_part]
 * @param {string} [redirect_to]
 * @param {boolean} [contains_not=false]
 * @return {boolean}
 */
function checkRedirect(path_part, redirect_to, contains_not) {
	var pathname = window.location.pathname;
	
	if (path_part && (contains_not ^ pathname.contains(path_part))) {
		return __APP.changeState(redirect_to, true, true);
	}
	
	
	if (__APP.USER.isLoggedOut()) {
		if (pathname.contains('/admin')) {
			return __APP.changeState('/', true, true);
		}
	}
	
	if (pathname.contains('/statistics')) {
		return __APP.changeState(pathname.replace('statistics', 'admin'), true, true);
	}
	
	return true;
}

if (checkRedirect()) {
	
	__APP.POST_MESSAGE.listen(PostMessageConnection.AVAILABLE_COMMANDS.REDIRECT, function(redirect_uri) {
		
		return this.location.href = redirect_uri;
	});
	
	$(document)
		.ajaxStart(function() {
			Pace.restart()
		})
		.ajaxError(function(event, jqxhr, settings, thrownError) {
			if (thrownError && thrownError === 'Forbidden') {
				__APP.changeState('/', true, true);
			}
		})
		.ready(function() {
			var user_jqhxr,
				auth_urls_jqxhr,
				cities_jqxhr;
			
			+function configOneSignal() {
				var OneSignal = window.OneSignal || [];
				
				OneSignal.push(["init", {
					appId: "7471a586-01f3-4eef-b989-c809700a8658",
					autoRegister: false,
					notifyButton: {
						enable: false /* Set to false to hide */
					}
				}]);
				OneSignal.push(function () {
					// If we're on an unsupported browser, do nothing
					if (!OneSignal.isPushNotificationsSupported()) {
						return;
					}
					OneSignal.isPushNotificationsEnabled(function (isEnabled) {
						if (isEnabled) {
							// The user is subscribed to notifications
							// Don't show anything
						} else {
							window.askToSubscribe = function subscribe() {
								OneSignal.push(function () {
									OneSignal.on('subscriptionChange', function (isSubscribed) {
										if (isSubscribed) {
											// The user is subscribed
											//   Either the user subscribed for the first time
											//   Or the user was subscribed -> unsubscribed -> subscribed
											
											OneSignal.getUserId(function (userId) {
												$.ajax({
													url: 'api/v1/users/me/devices',
													type: 'PUT',
													data: {
														'device_token': userId,
														'client_type': 'browser',
														'model': navigator.appVersion ? navigator.appVersion : null,
														'os_version': navigator.platform ? navigator.platform : null
													},
													global: false
												});
											});
										}
									});
								});
								
								OneSignal.push(["registerForPushNotifications"]);
								event.preventDefault();
							};
						}
					});
				});
			}();
			
			+function configMoment() {
				if (window.moment !== undefined) {
					moment.locale(navigator.language);
					//moment.tz.setDefault('Europe/Moscow');
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
			}();
			
			+function configHighcharts() {
				if (window.Highcharts !== undefined) {
					Highcharts.setOptions({
						lang: {
							shortMonths: __LOCALES.ru_RU.DATE.MONTH_SHORT_NAMES
						}
					});
				}
			}();
			
			+function configHistory() {
				/**
				 * Bind only on 'back' action
				 */
				History.Adapter.bind(window, 'statechange', function() {
					if (!History.stateChangeHandled) {
						__APP.init();
					}
				});
			}();
			
			+function configTrumbowyg() {
				$.trumbowyg.svgPath = '/app/src/vendor/trumbowyg/icons.svg';
				$.trumbowyg.defaultOptions.lang = 'ru';
				$.trumbowyg.defaultOptions.autogrow = true;
				$.trumbowyg.defaultOptions.autogrowOnEnter = true;
				$.trumbowyg.defaultOptions.btns = [
					['viewHTML'],
					['undo', 'redo'],
					['formatting'],
					['strong', 'em'],
					['link'],
					['insertImage'],
					['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
					['unorderedList', 'orderedList'],
					['horizontalRule'],
					['removeformat']
				];
			}();
			
			if (isNotDesktop()) {
				$('.DownloadAppBand').addClass('-open_band');
				$('.CloseDownloadAppBand').one('click', function() {
					$('.DownloadAppBand').removeClass('-open_band');
				});
			}
			__APP.LOADER = __APP.BUILD.overlayLoader();
			
			user_jqhxr = __APP.USER.fetchUser(new Fields(
				'email',
				'accounts',
				'accounts_links', {
					subscriptions: {
						fields: ['img_small_url', 'subscribed_count', 'new_events_count', 'actual_events_count']
					}
				}));
			auth_urls_jqxhr = AsynchronousConnection.dealAjax(AsynchronousConnection.HTTP_METHODS.GET, '/auth.php', {
				action: 'get_urls',
				mobile: isNotDesktop()
			});
			cities_jqxhr = (new CitiesCollection()).fetchCities(new Fields('timediff_seconds', 'distance'), 1, 'distance');
			
			__APP.SERVER.multipleAjax(user_jqhxr, auth_urls_jqxhr, cities_jqxhr, function(user_data, auth_urls, cities) {
				__APP.USER.selected_city.setData(cities[0]);
				__APP.AUTH_URLS = auth_urls;
				
				checkRedirect();
				
				if(__APP.USER.isLoggedOut()){
					__APP.TOP_BAR = new TopBarNoAuth();
					__APP.SIDEBAR = new SidebarNoAuth();
				} else {
					__APP.TOP_BAR = new TopBar();
					__APP.SIDEBAR = new Sidebar();
				}
				__APP.TOP_BAR.init();
				__APP.SIDEBAR.init();
				__APP.init();
				bindPageLinks();
			});
			
			setInterval(function () {
				if (window.__stats.length != 0) {
					var batch = window.__stats;
					window.__stats = [];
					$.ajax({
						url: '/api/v1/statistics/batch',
						data: JSON.stringify(batch),
						type: 'POST',
						contentType: 'application/json; charset=utf-8',
						dataType: 'json',
						error: function () {
							window.__stats.concat(batch);
						}
					});
				}
			}, 5000);
			
		});
}