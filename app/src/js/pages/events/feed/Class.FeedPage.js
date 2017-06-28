/**
 * @requires ../../Class.Page.js
 */
/**
 *
 * @abstract
 * @class FeedPage
 * @extends Page
 */
FeedPage = extending(Page, (function() {
	/**
	 *
	 * @constructor
	 * @constructs FeedPage
	 */
	function FeedPage() {
		Page.call(this);
		this.fields = new Fields(
			'organization_short_name',
			'organization_logo_small_url',
			'dates',
			'is_same_time',
			'favored_users_count',
			'is_favorite',
			'is_registered',
			'ticketing_locally',
			'registration_locally',
			'registration_available',
			'registration_required',
			'registration_till',
			'registration_limit_count',
			'is_free',
			'min_price', {
				favored: {
					fields: 'is_friend',
					order_by: '-is_friend',
					length: 5
				}
			}
		);
		this.events = new EventsCollection();
		this.next_events_length = 10;
		this.cities = new CitiesCollection();
		this.wrapper_tmpl = 'feed';
		this.with_header_tabs = true;
	}
	
	FeedPage.prototype.bindFeedEvents = function($parent) {
		trimAvatarsCollection($parent);
		bindRippleEffect($parent);
		bindDropdown($parent);
		__APP.MODALS.bindCallModal($parent);
		bindPageLinks($parent);
		
		$parent.find('.HideEvent').not('.-Handled_HideEvent').each(function() {
			var $this = $(this),
				$event = $this.parents('.FeedEvent'),
				event_id = $this.data("event-id");
			
			$this.on('click', function() {
				$event.addClass('-cancel');
				OneEvent.changeEventStatus(event_id, OneEvent.STATUS.HIDE, function() {
					$event.after(tmpl('button', {
						classes: '-color_neutral ReturnEvent',
						title: 'Вернуть событие',
						dataset: 'data-event-id="' + event_id + '"'
					}));
					$event.siblings('.ReturnEvent').not('.-Handled_ReturnEvent').on('click', function() {
						var $remove_button = $(this);
						OneEvent.changeEventStatus(event_id, OneEvent.STATUS.SHOW, function() {
							$remove_button.remove();
							$event.removeClass('-cancel');
						});
					}).addClass('-Handled_ReturnEvent');
				});
			});
		}).addClass('-Handled_HideEvent');
	};
	
	FeedPage.prototype.addNoEventsBlock = function() {
		var $no_events_block = tmpl('feed-no-event', {
			text: 'Как насчет того, чтобы подписаться на организации?',
			button: __APP.BUILD.link({
				title: 'Перейти к каталогу',
				classes: ['button', '-color_neutral_accent', 'RippleEffect'],
				page: '/organizations'
			})
		}, this.$wrapper);
		bindPageLinks($no_events_block);
		bindRippleEffect($no_events_block);
	};
	/**
	 *
	 * @param {function(jQuery)} [success]
	 * @returns {jqPromise}
	 */
	FeedPage.prototype.appendEvents = function(success) {
		var PAGE = this,
			$loader = __APP.BUILD.loaderBlock(PAGE.$wrapper);
		
		PAGE.block_scroll = true;
		
		return PAGE.events.fetchFeed(this.fields, this.next_events_length, {city_id: __APP.USER.selected_city.id}, function(events) {
			var $events = __APP.BUILD.eventCards(PAGE.events.last_pushed);
			
			PAGE.block_scroll = false;
			if ($events.length) {
				PAGE.$wrapper.append($events);
				PAGE.bindFeedEvents($events);
				if (isFunction(success)) {
					success($events);
				}
			} else {
				PAGE.addNoEventsBlock();
				$(window).off('scroll.upload' + PAGE.constructor.name);
			}
			$loader.remove();
		});
	};
	
	FeedPage.prototype.initFeedCalendar = function() {
		var PAGE = this,
			selected_date = PAGE.events.date,
			MainCalendar = new Calendar(PAGE.$view.find('.FeedCalendar'), {
				classes: {
					wrapper_class: 'feed_calendar_wrapper',
					table_class: 'feed_calendar_table',
					thead_class: 'feed_calendar_thead',
					tbody_class: 'feed_calendar_tbody',
					th_class: 'feed_calendar_th',
					td_class: 'feed_calendar_td',
					td_disabled: __C.CLASSES.DISABLED
				}
			});
		
		MainCalendar.init();
		if (selected_date) {
			MainCalendar.setMonth(selected_date.split('-')[1], selected_date.split('-')[0]).selectDays(selected_date);
		}
		MainCalendar.setDaysWithEvents();
		MainCalendar.$calendar.on('change:month', function() {
			bindPageLinks(MainCalendar.$calendar);
			MainCalendar.setDaysWithEvents();
		});
	};
	
	FeedPage.prototype.initCitySelect = function() {
		var PAGE = this;
		
		PAGE.cities.fetchCities(null, 0, 'distance,local_name').done(function() {
			var $select = PAGE.$view.find('.FeedCitiesSelect');
			
			$select.html(tmpl('option', PAGE.cities.map(function(city) {
				
				return {
					val: city.id,
					display_name: city.local_name
				};
			})));
			
			initSelect2($select);
			$select.select2('val', __APP.USER.selected_city.id).off('change.SelectCity').on('change.SelectCity', function() {
					__APP.USER.selected_city = PAGE.cities.getByID($(this).val());
					__APP.reload();
				});
		});
	};
	
	FeedPage.prototype.render = function() {
		var PAGE = this,
			$window = $(window);
		
		if (!(__APP.PREVIOUS_PAGE instanceof FeedPage)) {
			PAGE.initFeedCalendar();
			PAGE.initCitySelect();
		}
		
		if(__APP.USER.isLoggedOut()){
			__APP.renderHeaderTabs([
				{title: 'Актуальные', page: '/feed/actual'},
				{title: 'По времени', page: '/feed/timeline'}
			]);
			
			PAGE.$view.find('.BecomeOrg').on('click', function(e) {
				cookies.removeItem('auth_command');
				cookies.removeItem('auth_entity_id');
				(new AuthModal(location.origin + '/add/organization')).show();
				
				return false;
			});
			if(window.location.pathname === '/feed/favored' || window.location.pathname === '/feed/recommendations'){
				__APP.changeState('/feed/actual', true, true);
				return null;
			}
		} else {
			__APP.renderHeaderTabs([
				{title: 'Актуальные', page: '/feed/actual'},
				{title: 'По времени', page: '/feed/timeline'},
				{title: 'Избранные', page: '/feed/favored'},
				{title: 'Рекомендованные', page: '/feed/recommendations'}/*,
				 {title: 'Друзья', page: '/feed/friends/'},*/
			]);
		}
		
		$window.off('scroll');
		PAGE.appendEvents(function() {
			if (isScrollRemain(1000)) {
				PAGE.appendEvents();
			}
			$window.on('scroll.upload' + PAGE.constructor.name, function() {
				if (isScrollRemain(1000) && !PAGE.block_scroll) {
					PAGE.appendEvents();
				}
			})
		});
	};
	
	return FeedPage;
}()));