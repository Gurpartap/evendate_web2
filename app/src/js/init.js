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

$(document)
	.ajaxStart(function() {
		Pace.restart()
	})
	.ajaxError(function(event, jqxhr, settings, thrownError) {
		if (!(thrownError && thrownError == 'abort')) {
			ServerConnection.ajaxErrorHandler(event, jqxhr, settings, thrownError);
		}
	})
	.ready(function() {
		var OneSignal = window.OneSignal || [],
			user_jqhxr,
			auth_urls_jqxhr;
		
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
		
		if (window['moment'] != undefined) {
			moment.locale(navigator.language);
			//moment.tz.setDefault('Europe/Moscow');
			moment.updateLocale('ru', {
				monthsShort: __LOCALES.ru_RU.DATE.MONTH_SHORT_NAMES,
				calendar: {
					sameDay: '[Сегодня]',
					nextDay: '[Завтра]',
					lastDay: '[Вчера]',
					nextWeek: 'dddd',
					lastWeek: 'D MMMM',
					sameElse: 'D MMMM'
				}
			})
		}
		
		if (window['Highcharts'] != undefined) {
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
			if (History.getCurrentIndex() - 1 !== History.getState().data._index) {
				__APP.reInit();
			}
		});
		
		user_jqhxr = __APP.USER.fetchUser(new Fields('accounts', 'accounts_links', {
			friends: {
				fields: ['is_friend'],
				length: 4
			},
			subscriptions: {
				fields: ['img_small_url', 'subscribed_count', 'new_events_count', 'actual_events_count']
			}
		}));
		auth_urls_jqxhr = __APP.SERVER.getData('/auth.php', {
			action: 'get_urls',
			mobile: isNotDesktop()
		});
		
		__APP.SERVER.multipleAjax(user_jqhxr, auth_urls_jqxhr, function(user_data, auth_urls) {
			__APP.AUTH_URLS = auth_urls;
			if(__APP.USER.id === -1){
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