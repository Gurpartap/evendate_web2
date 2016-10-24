/**
 * Created by Инал on 20.06.2015.
 */

"use strict";

window.__APP = {
	SERVER: {
		/**
		 * @enum {string}
		 */
		AJAX_METHOD: {
			GET: 'GET',
			POST: 'POST',
			PUT: 'PUT',
			DELETE: 'DELETE'
		},
		/**
		 *
		 * @param {Window.__APP.SERVER.AJAX_METHOD} ajax_method
		 * @param {string} ajax_url
		 * @param {(AJAXData|string)} ajax_data
		 * @param {AJAXCallback} [success]
		 * @param {function} [error]
		 * @returns {jqXHR}
		 */
		AJAX: function AJAX(ajax_method, ajax_url, ajax_data, success, error) {
			return $.ajax({
				url: ajax_url,
				data: ajax_data,
				method: ajax_method,
				contentType: 'application/json',
				success: success,
				error: error
			});
		},
		/**
		 *
		 * @param {string} ajax_url
		 * @param {AJAXData} ajax_data
		 * @param {AJAXCallback} [success]
		 * @returns {jqXHR}
		 */
		getData: function getData(ajax_url, ajax_data, success) {
			return __APP.SERVER.AJAX(__APP.SERVER.AJAX_METHOD.GET, ajax_url, __APP.SERVER.validateData(ajax_data), function(res) {
				__APP.SERVER.ajaxHandler(res, function(data, text) {
					if (success && typeof success == 'function') {
						if (ajax_data.length != undefined && ajax_data.offset != undefined) {
							ajax_data.offset += ajax_data.length;
						}
						success.call(self, data);
					}
				}, __APP.SERVER.ajaxErrorHandler)
			});
		},
		/**
		 *
		 * @param {string} ajax_url
		 * @param {AJAXData} ajax_data
		 * @param {AJAXCallback} [success]
		 * @returns {jqXHR}
		 */
		updateData: function updateData(ajax_url, ajax_data, success) {
			return __APP.SERVER.AJAX(__APP.SERVER.AJAX_METHOD.PUT, ajax_url, ajax_data, function(res) {
				__APP.SERVER.ajaxHandler(res, function(data, text) {
					if (success && typeof success == 'function') {
						if (ajax_data.length != undefined && ajax_data.offset != undefined) {
							ajax_data.offset += ajax_data.length;
						}
						success.call(self, data);
					}
				}, __APP.SERVER.ajaxErrorHandler)
			});
		},
		/**
		 *
		 * @param {string} ajax_url
		 * @param {AJAXData} ajax_data
		 * @param {AJAXCallback} [success]
		 * @returns {jqXHR}
		 */
		addData: function addData(ajax_url, ajax_data, success) {
			return __APP.SERVER.AJAX(__APP.SERVER.AJAX_METHOD.POST, ajax_url, ajax_data, function(res) {
				__APP.SERVER.ajaxHandler(res, function(data, text) {
					if (success && typeof success == 'function') {
						if (ajax_data.length != undefined && ajax_data.offset != undefined) {
							ajax_data.offset += ajax_data.length;
						}
						success.call(self, data);
					}
				}, __APP.SERVER.ajaxErrorHandler)
			});
		},
		/**
		 *
		 * @param {string} ajax_url
		 * @param {AJAXData} ajax_data
		 * @param {AJAXCallback} [success]
		 * @returns {jqXHR}
		 */
		deleteData: function deleteData(ajax_url, ajax_data, success) {
			return __APP.SERVER.AJAX(__APP.SERVER.AJAX_METHOD.DELETE, ajax_url, ajax_data, function(res) {
				__APP.SERVER.ajaxHandler(res, function(data, text) {
					if (success && typeof success == 'function') {
						if (ajax_data.length != undefined && ajax_data.offset != undefined) {
							ajax_data.offset += ajax_data.length;
						}
						success.call(self, data);
					}
				}, __APP.SERVER.ajaxErrorHandler)
			});
		},
		/**
		 *
		 * @param {AJAXData} ajax_data
		 * @returns {AJAXData}
		 */
		validateData: function validateData(ajax_data) {
			if (ajax_data.fields && Array.isArray(ajax_data.fields)) {
				if (ajax_data.order_by) {
					(ajax_data.order_by instanceof Array ? ajax_data.order_by : ajax_data.order_by.split(',')).forEach(function(order_by) {
						if (ajax_data.fields.indexOf(order_by.trim().replace('-', '')) === -1) {
							ajax_data.fields.push(order_by.trim().replace('-', ''));
						}
					});
				}
				if (ajax_data.fields.length) {
					ajax_data.fields = ajax_data.fields.join(',');
				} else {
					ajax_data.fields = undefined;
				}
			}
			return ajax_data;
		},
		
		ajaxHandler: function ajaxHandler(result, success, error) {
			error = typeof error !== 'undefined' ? error : function() {
				console.log(result);
				showNotifier({text: 'Упс, что-то пошло не так', status: false});
			};
			success = typeof success !== 'function' ? function() {} : success;
			try {
				if (result.status) {
					success(result.data, result.text);
				} else {
					error(result);
				}
			} catch (e) {
				error(e);
			}
		},
		
		ajaxErrorHandler: function ajaxErrorHandler(event, jqxhr, settings, thrownError) {
			var args = Array.prototype.slice.call(arguments),
				debug = {},
				fields;
			if (args.length == 4) {
				fields = ['event', 'jqxhr', 'settings', 'thrownError'];
				args.forEach(function(arg, i) {
					debug[fields[i]] = arg;
				});
			} else if (args.length == 1) {
				debug = args[0];
			} else {
				args.forEach(function(arg, i) {
					debug[i] = arg;
				});
			}
			console.groupCollapsed('AJAX error');
			if (debug.thrownError)
				console.log('Thrown error:', debug.thrownError);
			if (debug.event && debug.event.type)
				console.log('Error type:', debug.event.type);
			if (debug.event && debug.event.text)
				console.log('Description:', debug.event.text);
			if (debug.jqxhr && debug.jqxhr.responseJSON && debug.jqxhr.responseJSON.text) {
				console.log('Response:', debug.jqxhr.responseJSON.text);
				showNotifier({text: debug.jqxhr.responseJSON.text, status: false});
			}
			if (debug.settings) {
				console.log('URL:', debug.settings.url);
				console.log('Method:', debug.settings.type);
			}
			if (debug.stack) {
				console.log('Thrown error:', debug.name);
				console.log('Description:', debug.message);
				console.log('Error stacktrace:', debug.stack);
			} else {
				console.error('Error stacktrace:');
			}
			console.groupEnd();
			
			if (!window.errors_array)  window.errors_array = [];
			window.errors_array.push(debug);
		}
	},
	EVENDATE_BEGIN: '15-12-2015',
	USER: new CurrentUser(),
	PREVIOUS_PAGE: new Page(),
	CURRENT_PAGE: new Page(),
	CURRENT_JQXHR: {},
	BUILD: {
		/**
		 * @typedef {object} buildProps
		 * @property {(Array<string>|string)} classes
		 * @property {(Array<string>|object)} dataset
		 * @property {(Array<string>|object)} attributes
		 */
		/**
		 *
		 * @param {buildProps} props
		 * @param {Array<string>} [classes]
		 * @param {Array<string>} [datasets]
		 * @param {Array<string>} [attributes]
		 * @returns {buildProps}
		 */
		normalizeBuildProps: function normalizeBuildProps(props, classes, datasets, attributes) {
			props = props ? props : {};
			classes ? classes.push('classes') : classes = ['classes'];
			datasets ? datasets.push('dataset') : datasets = ['dataset'];
			attributes ? attributes.push('attributes') : attributes = ['attributes'];
			classes.forEach(function(c) {
				props[c] = props[c] ? (typeof props[c] === 'string') ? props[c].split(' ') : props[c] : [];
				props[c].toString = Array.toSpaceSeparatedString;
			});
			datasets.forEach(function(d) {
				props[d] = props[d] ? props[d] : {};
				props[d].toString = (Array.isArray(props[d])) ? Array.toSpaceSeparatedString : Object.toHtmlDataSet;
			});
			attributes.forEach(function(a) {
				props[a] = props[a] ? props[a] : {};
				props[a].toString = (Array.isArray(props[a])) ? Array.toSpaceSeparatedString : Object.toHtmlAttributes;
			});
			return props;
		},
		/**
		 *
		 * @param {...buildProps} props
		 * @returns {jQuery}
		 */
		button: function buildButton(props) {
			return tmpl('button', [].map.call(arguments, function(arg) {
				return __APP.BUILD.normalizeBuildProps(arg);
			}));
		},
		/**
		 *
		 * @param {...buildProps} props
		 * @param {string} props.page
		 * @returns {jQuery}
		 */
		link: function buildLink(props) {
			return tmpl('link', [].map.call(arguments, function(arg) {
				return __APP.BUILD.normalizeBuildProps(arg);
			}));
		},
		/**
		 *
		 * @param {string} type - checkbox or radio
		 * @param {buildProps} props
		 * @param {(Array<string>|string)} [props.unit_classes]
		 * @returns {jQuery}
		 */
		radioOrCheckbox: function buildRadioOrCheckbox(type, props) {
			if (type == 'checkbox' || type == 'radio') {
				props = __APP.BUILD.normalizeBuildProps(props, ['unit_classes']);
				if (props.classes.indexOf('form_checkbox') == -1 && props.classes.indexOf('form_radio') == -1) {
					props.classes.unshift('form_' + type);
				}
				props.unit_classes.unshift('form_unit');
				return tmpl('radio-checkbox', $.extend(props, {type: type}));
			} else {
				throw Error('Принимаемый аргумент type может быть либо "radio" либо "checkbox", придурок')
			}
		},
		/**
		 *
		 * @param {(OneTag|Array<OneTag>|TagsCollection)} tags
		 * @param {buildProps} [props]
		 * @returns {jQuery}
		 */
		tags: function buildTags(tags, props) {
			props = __APP.BUILD.normalizeBuildProps(props);
			
			function normalizeTag(tag) {
				return $.extend(true, {}, {
					name: tag.name.toLowerCase(),
					page: '/search/' + encodeURIComponent('#' + tag.name.toLowerCase())
				}, props);
			}
			
			if (tags instanceof Array) {
				return tmpl('tag', tags.map(normalizeTag));
			} else {
				return tmpl('tag', normalizeTag(tags));
			}
		},
		/**
		 *
		 * @param users
		 * @param {buildProps} props
		 * @param {(Array<string>|string)} [props.avatar_classes]
		 * @param {(Array<string>|string)} [props.tombstone_classes]
		 * @param {boolean} [props.is_link]
		 * @returns {jQuery}
		 */
		userTombstones: function buildUserTombstones(users, props) {
			props = __APP.BUILD.normalizeBuildProps(props, ['avatar_classes', 'tombstone_classes']);
			function normalize(user) {
				if (props.is_link) {
					props.html_tag = 'a';
					props.tombstone_classes.push('link Link');
					props.attributes.href = '/friend/' + user.id;
				} else {
					props.html_tag = 'div';
				}
				$.extend(true, user, {
					name: [user.first_name, user.last_name].join(' '),
					size: '70x70'
				}, props);
			}
			
			if (users instanceof Array) {
				users.forEach(normalize);
			} else {
				normalize(users);
			}
			
			return tmpl('user-tombstone', users);
		},
		/**
		 *
		 * @param {(buildProps|Array<buildProps>)} props
		 * @returns {jQuery}
		 */
		avatarBlocks: function buildAvatarBlocks(props) {
			if (Array.isArray(props)) {
				props.forEach(normalize);
			} else {
				normalize(props);
			}
			
			function normalize(props_unit) {
				props_unit = __APP.BUILD.normalizeBuildProps(props_unit, ['avatar_classes', 'block_classes']);
				if (props_unit.is_link) {
					props_unit.html_tag = 'a';
					props_unit.block_classes.push('link Link');
					props_unit.attributes.href = '/friend/' + props_unit.id;
				} else {
					props_unit.html_tag = 'div';
				}
			}
			
			return tmpl('avatar-block', props);
		},
		/**
		 *
		 * @param {Array} subscribers
		 * @param {number} count
		 * @returns {jQuery}
		 */
		avatars: function buildAvatars(subscribers, count) {
			var $subscribers = $();
			$subscribers = $subscribers.add(tmpl('subscriber-avatar', __APP.USER));
			subscribers.forEach(function(subscriber) {
				if (subscriber.id != __APP.USER.id && $subscribers.length <= count) {
					$subscribers = $subscribers.add(tmpl('subscriber-avatar', subscriber));
				}
			});
			return $subscribers;
		},
		/**
		 *
		 * @param {Array} users
		 * @param {number} max_count
		 * @param {buildProps} props
		 * @returns {jQuery}
		 */
		avatarCollection: function buildAvatarCollection(users, max_count, props) {
			var data = __APP.BUILD.normalizeBuildProps(props);
			
			data.avatars = tmpl('subscriber-avatar', __APP.USER);
			users.forEach(function(user) {
				if (user.id != __APP.USER.id && data.avatars.length <= max_count) {
					data.avatars = data.avatars.add(tmpl('subscriber-avatar', user));
				}
			});
			return tmpl('avatars-collection', data);
		},
		/**
		 *
		 * @param {(OneOrganization|Array<OneOrganization>|OrganizationsCollection)} organizations
		 * @param {object} [additional_fields]
		 * @returns {jQuery}
		 */
		organizationItems: function buildOrganizationItems(organizations, additional_fields) {
			organizations = organizations instanceof Array ? organizations : [organizations];
			var orgs = organizations.map(function(org) {
				org.counter_classes = org.new_events_count ? [] : [__C.CLASSES.NEW_HIDDEN];
				return org;
			});
			if (additional_fields) {
				return tmpl('organization-item', orgs.map(function(organization) {
					return $.extend(true, {}, organization, __APP.BUILD.normalizeBuildProps(additional_fields, ['avatar_classes', 'block_classes', 'counter_classes']));
				}));
			} else {
				return tmpl('organization-item', orgs);
			}
		},
		/**
		 *
		 * @param {(Array<OneOrganization>|OrganizationsCollection)} organizations
		 * @returns {jQuery}
		 */
		organizationCard: function buildOrganisationCard(organizations) {
			return tmpl('organization-card', organizations.map(function(org) {
				return $.extend(true, {}, org, {
					subscribe_button: new SubscribeButton(org.id, org.is_subscribed, {
						colors: {
							subscribe: '-color_marginal_accent'
						},
						icons: null,
						classes: ['-size_low', 'RippleEffect']
					}),
					subscribed_text: org.subscribed_count + getUnitsText(org.subscribed_count, __LOCALES.ru_RU.TEXTS.SUBSCRIBERS),
					redact_org_button: org.role === OneUser.ROLE.USER ? '' : __APP.BUILD.link({
						classes: ['button', '-size_low', '-color_marginal_primary', 'fa_icon', 'fa-pencil', '-empty', 'RippleEffect'],
						page: 'organization/' + org.id + '/edit'
					})
				});
			}))
		},
		/**
		 *
		 * @param {Array<OneEvent>} events
		 * @param {OrganizationPage~EventType} type
		 * @returns {jQuery}
		 */
		organizationFeedEvents: function buildOrganizationFeedEvents(events, type) {
			return tmpl('organization-feed-event', events.map(function(event) {
				var m_event_date = moment.unix(event[type.sort_date_type]),
					$subscribers = __APP.BUILD.avatars(event.favored, 4),
					favored_users_count = ($subscribers.length <= 4) ? 0 : event.favored_users_count - 4,
					different_day = type.last_date != m_event_date.format(__C.DATE_FORMAT);
				
				type.last_date = m_event_date.format(__C.DATE_FORMAT);
				return $.extend({}, event, {
					divider: different_day ? tmpl('organization-feed-event-divider', {
						formatted_date: m_event_date.calendar().capitalize(),
						date: m_event_date.format(__C.DATE_FORMAT)
					}) : '',
					add_to_favorite_button: new AddToFavoriteButton(event.id, event.is_favorite, {
						classes: ['-size_low', '-fill', '-rounded', 'AddToFavorites', 'AddAvatar', 'RippleEffect'],
						labels: {
							subscribed: 'В избранном'
						}
					}),
					subscribers: $subscribers,
					date: m_event_date.format(__C.DATE_FORMAT),
					avatars_collection_classes: event.is_favorite ? ($subscribers.length > 4) ? '-subscribed -shift' : '-subscribed' : '',
					favored_users_count: favored_users_count,
					favored_users_show: favored_users_count ? '' : '-cast',
					time: event.dates.reduce(function(times, date) {
						if (moment.unix(date.event_date).format(__C.DATE_FORMAT) == m_event_date.format(__C.DATE_FORMAT)) {
							times.push(displayTimeRange(date.start_time, date.end_time));
						}
						return times;
					}, []).join('; ')
				})
			}));
		},
		/**
		 *
		 * @param {OneCategory|Array<OneCategory>} categories
		 * @returns {jQuery}
		 */
		organisationsCategoriesItems: function buildOrganisationsCategoriesItems(categories) {
			if (!(categories instanceof Array))
				categories = [categories];
			return tmpl('organization-category', categories.map(function(cat) {
				var is_parent_category = true,
					new_events_count,
					aside_classes = [];
				
				if (cat.organizations && cat.organizations.new_events_count) {
					if (is_parent_category) {
						new_events_count = cat.organizations.reduce(function(sum, org) {
							return sum + org.new_events_count;
						}, 0);
						aside_classes = new_events_count ? ['counter'] : ['counter', __C.CLASSES.NEW_HIDDEN];
					} else {
						aside_classes = ['fa_icon', 'fa-angle-down', '-empty'];
					}
				} else {
					new_events_count = '';
					aside_classes = [__C.CLASSES.NEW_HIDDEN];
				}
				return {
					category_id: cat.id,
					category_name: cat.name,
					order_position: cat.order_position,
					aside_classes: aside_classes,
					new_events_count: is_parent_category ? '+' + new_events_count : ''
				}
			}));
		},
		/**
		 *
		 * @param {Array} subscribers
		 * @param {boolean} [last_is_fiend]
		 * @returns {jQuery}
		 */
		subscribers: function buildSubscribers(subscribers, last_is_fiend) {
			return tmpl('subscriber', subscribers.map(function(subscriber, i) {
				var append_divider = (typeof last_is_fiend == 'undefined') || last_is_fiend != subscriber.is_friend;
				
				last_is_fiend = subscriber.is_friend;
				return $.extend({
					divider: append_divider ? tmpl('subscriber-divider', {label: subscriber.is_friend ? 'Друзья' : 'Все подписчики'}) : '',
					avatar_block: __APP.BUILD.avatarBlocks({
						avatar_classes: ['-size_40x40', '-rounded', '-bordered'],
						name: [subscriber.first_name, subscriber.last_name].join(' '),
						avatar_url: subscriber.avatar_url
					}),
					name: [subscriber.first_name, subscriber.last_name].join(' ')
				}, subscriber);
			}));
		},
		/**
		 *
		 * @param {(OneEvent|Array<OneEvent>|EventsCollection)} events
		 * @returns {jQuery}
		 */
		feedEventCards: function buildFeedEventCards(events) {
			var $events;
			events = events instanceof Array ? events : [events];
			$events = tmpl('feed-event', events.map(function(event) {
				var $subscribers = __APP.BUILD.avatars(event.favored, 4),
					avatars_collection_classes = [],
					favored_users_count = ($subscribers.length <= 4) ? 0 : event.favored_users_count - 4,
					feed_event_infos = [];
				
				if (event.is_favorite) {
					avatars_collection_classes.push('-subscribed');
					if ($subscribers.length > 4) {
						avatars_collection_classes.push('-shift');
					}
				}
				feed_event_infos.push({
					text: displayDateRange(event.dates[0].event_date, event.dates[event.dates.length - 1].event_date)
					+ (event.is_same_time ? ', ' + displayTimeRange(event.dates[0].start_time, event.dates[0].end_time) : '')
				});
				if (event.registration_required) {
					feed_event_infos.push({text: 'Регистрация до ' + moment.unix(event.registration_till).calendar().capitalize()});
				}
				if (event.is_free) {
					feed_event_infos.push({text: 'Бесплатно'});
				} else {
					feed_event_infos.push({text: 'Цена от ' + (event.min_price ? event.min_price : 0) + ' руб.'});
				}
				
				return $.extend(true, {
					add_to_favorite_button: new AddToFavoriteButton(event.id, event.is_favorite, {
						classes: ['-size_low', '-fill', '-rounded', 'AddAvatar', 'RippleEffect']
					}),
					subscribers: $subscribers,
					avatars_collection_classes: avatars_collection_classes.join(' '),
					favored_users_show: favored_users_count ? '' : '-cast',
					favored_users_count: favored_users_count,
					feed_event_infos: tmpl('feed-event-info', feed_event_infos)
				}, event);
			}));
			
			events.forEach(function(event, i) {
				$events.eq(i).appear(function() {
					storeStat(event.id, __C.STATS.EVENT_ENTITY, __C.STATS.EVENT_VIEW);
				}, {accY: 100})
			});
			
			return $events;
		}
	},
	/**
	 * Rendering header tabs
	 * @param {(buildProps|Array<buildProps>)} tabs
	 */
	renderHeaderTabs: function renderHeaderTabs(tabs) {
		var $wrapper = $('#main_header_bottom').find('.HeaderTabsWrapper');
		tabs = tabs instanceof Array ? tabs : [tabs];
		tabs.forEach(function(tab) {
			tab = __APP.BUILD.normalizeBuildProps(tab);
			tab.classes.push('tab', 'Tab');
			if (window.location.pathname.contains(tab.page)) {
				tab.classes.push(__C.CLASSES.NEW_ACTIVE);
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
		switch (true) {
			case (typeof new_title == 'string'): {
				title_str = new_title;
				new_title = new_title.split(' > ');
			}
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
		$('title').text(title_str ? 'Evendate. ' + title_str : 'Evendate');
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
	init: function appInit() {
		var $sidebar_nav_items = $('.SidebarNavItem');
		__APP.CURRENT_PAGE = Page.routeNewPage(window.location.pathname);
		__APP.CURRENT_PAGE.show();
		$sidebar_nav_items.removeClass(__C.CLASSES.NEW_ACTIVE)
			.filter(function() {
				return window.location.pathname.indexOf(this.getAttribute('href')) === 0;
			}).addClass(__C.CLASSES.NEW_ACTIVE);
	},
	reInit: function appReInit() {
		$(window).off('scroll');
		
		unbindPageLinks();
		
		__APP.PREVIOUS_PAGE = __APP.CURRENT_PAGE;
		__APP.PREVIOUS_PAGE.destroy();
		__APP.init();
		
		if (!(__APP.CURRENT_PAGE instanceof SearchPage)) {
			$('#search_bar_input').val('');
		}
	}
};

window.__C = {
	CLASSES: {
		ACTIVE: 'active',
		NEW_ACTIVE: '-active',
		DISABLED: 'disabled',
		NEW_DISABLED: '-disabled',
		HIDDEN: 'hidden',
		NEW_HIDDEN: '-hidden'
	},
	DATE_FORMAT: 'YYYY-MM-DD',
	COLORS: {
		PRIMARY: '#2e3b50',
		MUTED: '#3e4d66',
		MUTED_80: '#657184',
		MUTED_50: '#9fa6b3',
		MUTED_30: '#c5c9d1',
		TEXT: '#4a4a4a',
		ACCENT: '#f82969',
		ACCENT_ALT: '#ff5f9e',
		FRANKLIN: '#28be84',
		FRANKLIN_ALT: '#23d792'
	},
	STATS: {
		EVENT_VIEW: 'view',
		EVENT_VIEW_DETAIL: 'view_detail',
		EVENT_OPEN_SITE: 'open_site',
		EVENT_OPEN_MAP: 'open_map',
		ORGANIZATION_OPEN_SITE: 'open_site',
		EVENT_ENTITY: 'event',
		ORGANIZATION_ENTITY: 'organization'
	},
	ACTION_NAMES: {
		fave: ['добавил(а) в избранное'],
		unfave: ['удалил(а) из избранного'],
		subscribe: ['добавил(а) подписки'],
		unsubscribe: ['удалил(а) подписки']
	},
	ENTITIES: {
		EVENT: 'event',
		ORGANIZATION: 'organization'
	}
};

window.__LOCALES = {
	ru_RU: {
		TEXTS: {
			BUTTON: {
				REMOVE_FAVORITE: 'Удалить из избранного',
				ADD_FAVORITE: 'Добавить в избранное',
				FAVORED: 'Избранное событие',
				ADD_SUBSCRIPTION: 'Подписаться',
				REMOVE_SUBSCRIPTION: 'Отписаться',
				SUBSCRIBED: 'Подписан'
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
			}
		},
		DATE: {
			DATE_FORMAT: 'DD MM YYYY',
			MONTH_SHORT_NAMES: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
			MONTH_NAMES: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
		}
	}
};

/* PAGE CLASSES */

/**
 *
 * @abstract
 */
function Page() {
	this.name = this.constructor.name;
	this.state_name = this.name;
	this.page_title = '';
	/**
	 * @name Page#$view
	 * @type jQuery
	 */
	this.$view = $('.PageView');
	/**
	 * @name Page#$wrapper
	 * @type jQuery
	 */
	this.$wrapper = $();
	this.wrapper_tmpl = 'std';
	this.is_loading = false;
	this.can_render = false;
	this.with_header_tabs = false;
}

Page.PAGES = {
	'event': {
		'add_to': {
			'^([0-9]+)': AddEventPage,
			'': AddEventPage
		},
		'add': AddEventPage,
		'^([0-9]+)': {
			'edit': RedactEventPage,
			'': OneEventPage
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
		'': FeedPage
	},
	'organizations': {
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
	'friends': FriendsPage,
	'friend': {
		'^([0-9]+)': OneFriendPage,
		'': FriendsPage
	},
	'statistics': {
		'organization': {
			'^([0-9]+)': StatisticsOrganizationOverviewPage
		},
		'event': {
			'^([0-9]+)': StatisticsEventOverviewPage
		},
		'': StatisticsOverviewPage
	}
};
/**
 * Routing
 * @param {string} path
 * @return {Page}
 */
Page.routeNewPage = function(path) {
	var path_split = decodeURIComponent(path).split('/').splice(1),
		pages_child = Page.PAGES,
		args = [], i, key, PageClass;
	
	for (i = 0; i < path_split.length; i++) {
		if (pages_child.hasOwnProperty(path_split[i])) {
			if (i < path_split.length - 1) {
				pages_child = pages_child[path_split[i]];
			} else {
				PageClass = pages_child[path_split[i]];
				break;
			}
		} else {
			for (key in pages_child) {
				if (key.indexOf('^') === 0 && (new RegExp(key)).test(path_split[i])) {
					args.push(path_split[i]);
					if (i < path_split.length - 1) {
						pages_child = pages_child[key];
					} else {
						PageClass = pages_child[key];
					}
					break;
				}
			}
		}
	}
	PageClass = PageClass ? PageClass : pages_child; // In case of trailing slash in url
	PageClass = PageClass.prototype instanceof Page ? PageClass : PageClass['']; // Open default page
	return new (Function.prototype.bind.apply(PageClass, [null].concat(args)))(); // new Page(...args)
};

Page.triggerRender = function() {
	$(window).trigger('page_load');
};

Page.prototype.show = function() {
	var PAGE = this,
		$main_header = $('#main_header'),
		is_other_page = __APP.PREVIOUS_PAGE.wrapper_tmpl !== PAGE.wrapper_tmpl,
		wrapper_field = is_other_page ? '$view' : '$wrapper',
		$prev = __APP.PREVIOUS_PAGE[wrapper_field].length ? __APP.PREVIOUS_PAGE[wrapper_field] : is_other_page ? $('.PageView') : $('.PageView').find('.Content'),
		$window = $(window);
	
	if (PAGE.page_title) {
		__APP.changeTitle(PAGE.page_title);
	}
	$prev.addClass('-faded');
	
	if (__APP.CURRENT_JQXHR && __APP.CURRENT_JQXHR.status == 1) {
		__APP.CURRENT_JQXHR.abort();
	}
	
	$window.on('page_render', function() {
		if (PAGE.can_render && !PAGE.is_loading) {
			$window.off('page_render');
			$(window).scrollTop(0);
			PAGE.render();
			bindPageLinks();
			setTimeout(function() {
				PAGE[wrapper_field].removeClass('-faded');
			}, 200);
		}
	});
	$window.one('page_load', function() {
		PAGE.is_loading = false;
		if (PAGE.can_render) {
			$window.trigger('page_render');
		}
	});
	setTimeout(function() {
		$prev.addClass(__C.CLASSES.NEW_HIDDEN);
		
		if (PAGE.with_header_tabs) {
			$main_header.addClass('-with_tabs');
		} else {
			$main_header.removeClass('-with_tabs');
		}
		
		$('body').removeClass(function(index, css) {
			return (css.match(/(^|\s)-state_\S+/g) || []).join(' ');
		}).addClass('-state_' + PAGE.state_name.toUnderscore());
		
		if (is_other_page) {
			PAGE.$view.html(tmpl(PAGE.wrapper_tmpl + '-wrapper', {}));
		}
		PAGE.$wrapper = PAGE.$view.find('.Content');
		PAGE.$wrapper.empty();
		
		PAGE.$view.removeClass(__C.CLASSES.NEW_HIDDEN);
		PAGE.$wrapper.removeClass(__C.CLASSES.NEW_HIDDEN);
		PAGE[wrapper_field].addClass('-faded');
		
		PAGE.can_render = true;
		if (!PAGE.is_loading) {
			$window.trigger('page_render');
		}
	}, 200);
};
/**
 * @interface
 */
Page.prototype.render = function() {};
/**
 * @interface
 */
Page.prototype.destroy = function() {};


/**
 *
 * @constructor
 * @augments Page
 * @param {(string|number)} event_id
 */
function OneEventPage(event_id) {
	Page.apply(this);
	
	this.fields = [
		'image_horizontal_large_url',
		'favored{fields:"is_friend",order_by:"-is_friend",length:10}',
		'favored_users_count',
		'is_favorite',
		'notifications{fields:"notification_type,done"}',
		'description',
		'location',
		'can_edit',
		'registration_required',
		'registration_till',
		'is_free',
		'min_price',
		'organization_logo_small_url',
		'organization_short_name',
		'is_same_time',
		'dates{length:0,fields:"start_time,end_time"}',
		'tags',
		'detail_info_url',
		'canceled'
	];
	this.is_loading = true;
	this.event = new OneEvent(event_id);
	this.event.fetchEvent(this.fields, Page.triggerRender);
}
OneEventPage.extend(Page);
/**
 *
 * @param {Array} raw_notifications
 * @param {OneEvent.id} event_id
 * @param {OneEvent.last_event_date} last_date
 * @return {jQuery}
 */
OneEventPage.buildNotifications = function(raw_notifications, event_id, last_date) {
	var m_today = moment(),
		all_notifications = {
			'notification-before-quarter-of-hour': {
				label: 'За 15 минут',
				moment: moment.unix(last_date).subtract(15, 'minutes').unix()
			},
			'notification-before-three-hours': {
				label: 'За 3 часа',
				moment: moment.unix(last_date).subtract(3, 'hours').unix()
			},
			'notification-before-day': {
				label: 'За день',
				moment: moment.unix(last_date).subtract(1, 'days').unix()
			},
			'notification-before-three-days': {
				label: 'За 3 дня',
				moment: moment.unix(last_date).subtract(3, 'days').unix()
			},
			'notification-before-week': {
				label: 'За неделю',
				moment: moment.unix(last_date).subtract(1, 'week').unix()
			}
		},
		$notifications = $(),
		current_notifications = {},
		i = 0;
	for (var notif in raw_notifications) {
		if (raw_notifications.hasOwnProperty(notif)) {
			current_notifications[raw_notifications[notif].notification_type] = raw_notifications[notif];
		}
	}
	
	for (var notification in all_notifications) {
		
		if (all_notifications.hasOwnProperty(notification)) {
			var is_disabled = moment.unix(all_notifications[notification].moment).isBefore(m_today),
				data = {
					id: 'event_notify_' + (++i),
					classes: ['ToggleNotification'],
					name: 'notification_time',
					label: all_notifications[notification].label,
					attributes: {
						value: notification
					},
					dataset: {
						event_id: event_id
					}
				};
			
			if (current_notifications[notification]) {
				is_disabled = is_disabled || current_notifications[notification].done || !current_notifications[notification].uuid;
				if (current_notifications[notification].uuid) {
					data.dataset.uuid = current_notifications[notification].uuid;
				}
				data.attributes.checked = true;
			}
			if (is_disabled) {
				data.unit_classes = ['-status_disabled'];
				data.attributes.disabled = true;
			}
			$notifications = $notifications.add(__APP.BUILD.radioOrCheckbox('checkbox', data))
		}
	}
	return $notifications;
};

OneEventPage.prototype.init = function() {
	var PAGE = this;
	bindAddAvatar(PAGE.$wrapper);
	trimAvatarsCollection(PAGE.$wrapper);
	bindRippleEffect(PAGE.$wrapper);
	bindDropdown(PAGE.$wrapper);
	//bindShareButtons(PAGE.$wrapper);
	Modal.bindCallModal(PAGE.$wrapper);
	bindCollapsing(PAGE.$wrapper);
	bindPageLinks(PAGE.$wrapper);
	
	PAGE.$wrapper.find('.ToggleNotification').each(function() {
		var $this = $(this);
		
		$this.on('change', function() {
			$this.prop('disabled', true);
			if ($this.prop('checked')) {
				PAGE.event.addNotification($this.val(), function(data) {
					$this.data('uuid', data.uuid);
					$this.prop('disabled', false);
				});
			} else {
				PAGE.event.deleteNotification($this.data('uuid'), function() {
					$this.data('uuid', undefined);
					$this.prop('disabled', false);
				});
			}
		})
	});
	
	PAGE.$wrapper.find('.CancelEvent').on('click.CancelEvent', function() {
		PAGE.event.changeEventStatus(OneEvent.STATUS.CANCEL, function() {
			PAGE.$wrapper.find('.event_canceled_cap').removeClass('-hidden');
		});
	});
	
	PAGE.$wrapper.find('.CancelCancellation').on('click.CancelCancellation', function() {
		PAGE.event.changeEventStatus(OneEvent.STATUS.BRING_BACK, function() {
			PAGE.$wrapper.find('.event_canceled_cap').addClass('-hidden');
		});
	});
	
	PAGE.$wrapper.find('.ExternalLink').on('click.sendStat', function() {
		storeStat(PAGE.event.id, __C.STATS.EVENT_ENTITY, __C.STATS.EVENT_OPEN_SITE);
	});
	
	PAGE.$wrapper.find('.EventMap').on('click.sendStat', function() {
		storeStat(PAGE.event.id, __C.STATS.EVENT_ENTITY, __C.STATS.EVENT_OPEN_MAP);
	});
};

OneEventPage.prototype.render = function() {
	var PAGE = this,
		$subscribers = __APP.BUILD.avatars(PAGE.event.favored, 6),
		avatars_collection_classes = [],
		favored_users_count = ($subscribers.length <= 6) ? 0 : PAGE.event.favored_users_count - 6,
		$event_additional_fields = $();
	
	__APP.changeTitle(PAGE.event.title);
	if (PAGE.event.is_favorite) {
		avatars_collection_classes.push('-subscribed');
		if ($subscribers.length > 4) {
			avatars_collection_classes.push('-shift');
		}
	}
	
	if (PAGE.event.is_same_time) {
		$event_additional_fields = $event_additional_fields.add(tmpl('event-additional-info', {
			key: 'Время',
			value: displayTimeRange(PAGE.event.dates[0].start_time, PAGE.event.dates[0].end_time)
		}));
	} else {
		$event_additional_fields = $event_additional_fields.add(tmpl('event-date-time', {
			date_times: tmpl('event-date-time-row', formatDates(PAGE.event.dates, {
				date: '{D} {MMMMs}',
				time: '{T}'
			}, PAGE.event.is_same_time))
		}));
	}
	$event_additional_fields = $event_additional_fields.add(tmpl('event-additional-info', {
		key: 'Место',
		value: PAGE.event.location
	}));
	$event_additional_fields = $event_additional_fields.add(tmpl('event-additional-info', {
		key: 'Теги',
		value: __APP.BUILD.tags(PAGE.event.tags)
	}));
	
	if (PAGE.event.detail_info_url) {
		$event_additional_fields = $event_additional_fields.add(tmpl('event-detail-link', {detail_info_url: PAGE.event.detail_info_url}));
	}
	
	PAGE.$wrapper.html(tmpl('event-page', $.extend({}, PAGE.event, {
		add_to_favorite_button: new AddToFavoriteButton(PAGE.event.id, PAGE.event.is_favorite, {
			classes: ['event_favourite_button', '-size_low', '-rounded', 'AddAvatar', 'RippleEffect']
		}),
		subscribers: $subscribers,
		avatars_collection_classes: avatars_collection_classes.join(' '),
		favored_users_show: favored_users_count ? '' : '-cast',
		favored_users_count: favored_users_count,
		notifications: OneEventPage.buildNotifications(PAGE.event.notifications, PAGE.event.id, PAGE.event.last_event_date),
		location_sanitized: encodeURI(PAGE.event.location),
		event_edit_functions: PAGE.event.can_edit ? tmpl('event-edit-functions', PAGE.event) : '',
		event_registration_information: PAGE.event.registration_required ? tmpl('event-registration-info', {registration_till: moment.unix(PAGE.event.registration_till).format('D MMMM')}) : '',
		event_price_information: PAGE.event.is_free ? '' : tmpl('event-price-info', {min_price: PAGE.event.min_price ? PAGE.event.min_price : '0'}),
		canceled: PAGE.event.canceled ? '' : '-hidden',
		event_additional_fields: $event_additional_fields,
		cancel_cancellation: PAGE.event.can_edit ? tmpl('button', {
			classes: '-color_primary RippleEffect CancelCancellation',
			title: 'Вернуть событие'
		}) : ''
	})));
	
	if (PAGE.event.is_same_time) {
		var m_nearest_date = PAGE.event.nearest_event_date ? moment.unix(PAGE.event.nearest_event_date) : moment.unix(PAGE.event.first_event_date);
		PAGE.calendar = new Calendar(PAGE.$wrapper.find('.EventCalendar'), {
			classes: {
				wrapper_class: 'feed_calendar_wrapper',
				td_class: 'event_calendar_day'
			},
			selection_type: Calendar.SELECTION_TYPES.MULTI,
			disable_selection: true
		});
		PAGE.calendar
			.init()
			.setMonth(m_nearest_date.format('M'), m_nearest_date.format('YYYY'))
			.selectDays(
				PAGE.event.dates.map(function(date) {
					return moment.unix(date.event_date).format(__C.DATE_FORMAT)
				})
			);
	}
	
	PAGE.init();
};

/**
 *
 * @constructor
 * @augments Page
 * @param {(string|number)} [event_id]
 */
function RedactEventPage(event_id) {
	Page.apply(this);
	this.page_title = 'Редактирование события';
	this.is_loading = false;
	
	this.fields = [
		'image_horizontal_large_url',
		'favored{fields:"is_friend",order_by:"-is_friend",length:10}',
		'favored_users_count',
		'is_favorite',
		'notifications{fields:"notification_type,done"}',
		'description',
		'location',
		'can_edit',
		'registration_required',
		'registration_till',
		'is_free',
		'min_price',
		'organization_logo_small_url',
		'organization_short_name',
		'is_same_time',
		'dates{length:0,fields:"start_time,end_time"}',
		'tags',
		'detail_info_url',
		'canceled'
	];
	this.event = new OneEvent(event_id);
	if (event_id) {
		this.is_loading = true;
		this.event.fetchEvent(this.fields, Page.triggerRender);
	}
}
RedactEventPage.extend(Page);

/**
 *
 * @param {jQuery} $context
 * @param {string} source
 * @param {string} filename
 */
RedactEventPage.handleImgUpload = function($context, source, filename) {
	var $parent = $context.closest('.EditEventImgLoadWrap'),
		$preview = $parent.find('.EditEventImgPreview'),
		$file_name_text = $parent.find('.FileNameText'),
		$file_name = $parent.find('.FileName'),
		$data_url = $parent.find('.DataUrl'),
		$button = $parent.find('.CallModal');
	
	$preview.attr('src', source);
	$file_name_text.html('Загружен файл:<br>' + filename);
	$file_name.val(filename);
	$button
		.data('source_img', source)
		.on('crop', function(event, cropped_src, crop_data) {
			$preview.attr('src', cropped_src);
			$button.data('crop_data', crop_data);
			$data_url.val('data.source').data('source', $preview.attr('src')).trigger('change');
		})
		.trigger('click.CallModal');
};

RedactEventPage.prototype.formatVKPost = function() {
	var PAGE = this,
		$post = PAGE.$wrapper.find('#edit_event_vk_post'),
		$title = PAGE.$wrapper.find('#edit_event_title'),
		$calendar = PAGE.$wrapper.find('.EventDatesCalendar').data('calendar'),
		$place = PAGE.$wrapper.find('#edit_event_placepicker'),
		$description = PAGE.$wrapper.find('#edit_event_description'),
		$is_free = PAGE.$wrapper.find('#edit_event_free'),
		$min_price = PAGE.$wrapper.find('#edit_event_min_price'),
		$is_required = PAGE.$wrapper.find('#edit_event_registration_required'),
		$registration_till = PAGE.$wrapper.find('.RegistrationTill'),
		$tags = PAGE.$wrapper.find('.EventTags'),
		tags = [],
		$link = PAGE.$wrapper.find('#edit_event_url'),
		post_text = '';
	
	post_text += $title.val() ? $title.val() + '\n\n' : '';
	
	if ($calendar.selected_days) {
		post_text += ($calendar.selected_days.length > 1) ? 'Дата начала: ' : 'Начало: ';
		post_text += moment($calendar.selected_days[0]).format('D MMMM YYYY');
		if ($calendar.selected_days.length == 1) {
			var $main_time_inputs = PAGE.$wrapper.find('.MainTime').find('input');
			post_text += $main_time_inputs.eq(0).val() ? ' в ' + parseInt($main_time_inputs.eq(0).val()) : '';
			post_text += $main_time_inputs.eq(1).val() ? ':' + $main_time_inputs.eq(1).val() : '';
		}
	}
	if ($is_required.prop('checked')) {
		var $inputs = $registration_till.find('input');
		if ($inputs.eq(0).val()) {
			post_text += ' (регистрация заканчивается: ' + moment($inputs.eq(0).val()).format('D MMMM YYYY');
			post_text += $inputs.eq(1).val() ? ' в ' + parseInt($inputs.eq(1).val()) : '';
			post_text += $inputs.eq(2).val() ? ':' + $inputs.eq(2).val() : '';
			post_text += ')\n';
		} else {
			post_text += '\n';
		}
	} else {
		post_text += '\n';
	}
	post_text += $place.val() ? $place.val() + '\n\n' : '';
	post_text += $description.val() ? $description.val() + '\n\n' : '';
	
	if (!$is_free.prop('checked')) {
		post_text += $min_price.val() ? 'Цена от ' + $min_price.val() + '\n\n' : '';
	}
	
	$tags.find('.select2-search-choice').each(function(i, tag) {
		tags.push('#' + $(tag).text().trim());
	});
	post_text += tags ? tags.join(' ') + '\n\n' : '';
	
	if ($link.val()) {
		post_text += $link.val()
	} else if (PAGE.event.id) {
		post_text += 'https://evendate.ru/event/' + PAGE.event.id;
	}
	
	$post.val(post_text);
};

RedactEventPage.prototype.toggleVkImg = function() {
	var PAGE = this,
		$wrap = PAGE.$wrapper.find('#edit_event_vk_publication').find('.EditEventImgLoadWrap'),
		$left_block = $wrap.children().eq(0),
		$right_block = $wrap.children().eq(1);
	
	if (!$left_block.hasClass('-hidden')) {
		$right_block.find('.LoadImg').off('change.ToggleVkImg').one('change.ToggleVkImg', function() {
			PAGE.toggleVkImg();
		});
		$right_block.find('.Text').text('Добавить картинку');
	} else {
		$right_block.find('.LoadImg').off('change.ToggleVkImg');
		$right_block.find('.Text').text('Изменить');
	}
	$left_block.toggleClass('-hidden');
	$right_block.toggleClass('-align_center');
};

RedactEventPage.prototype.init = function() {
	var PAGE = this;
	
	function submitEditEvent() {
		var $form = PAGE.$wrapper.find("#edit-event-form"),
			data = {
				event_id: null,
				title: null,
				image_horizontal: null,
				organization_id: null,
				location: null,
				description: null,
				detail_info_url: null,
				different_time: null,
				dates: null,
				tags: null,
				registration_required: null,
				registration_till: null,
				is_free: null,
				min_price: null,
				delayed_publication: null,
				public_at: null,
				filenames: {
					horizontal: null
				}
			},
			form_data = $form.serializeForm(),
			tags = form_data.tags ? form_data.tags.split(',') : null,
			is_edit = !!(PAGE.event.id),
			is_form_valid = true,
			$times = $form.find('#edit_event_different_time').prop('checked') ? $form.find('[class^="TableDay_"]') : $form.find('.MainTime');
		
		function afterSubmit() {
			if ($form.find('#edit_event_to_public_vk').prop('checked')) {
				socket.emit('vk.post', {
					guid: data.vk_group,
					event_id: PAGE.event.id,
					message: data.vk_post,
					image: {
						base64: data.vk_image_src,
						filename: data.vk_image_filename
					},
					link: data.detail_info_url
				});
			}
			__APP.changeState('/event/' + PAGE.event.id);
		}
		
		$form.find(':required').not(':disabled').each(function() {
			var $this = $(this),
				max_length = $this.data('maxlength');
			if ($this.val() === "" || (max_length && $this.val().length > max_length)) {
				if (is_form_valid) {
					$('body').stop().animate({scrollTop: Math.ceil($this.offset().top - 150)}, 1000, 'swing');
				}
				handleErrorField($this);
				is_form_valid = false;
			}
		});
		
		$times.each(function() {
			var $row = $(this),
				start = $row.find('.StartHours').val() + $row.find('.StartMinutes').val(),
				end = $row.find('.EndHours').val() + $row.find('.EndMinutes').val();
			if (start > end) {
				if (is_form_valid) {
					$('body').stop().animate({scrollTop: Math.ceil($row.offset().top - 150)}, 1000, 'swing');
				}
				showNotifier({text: 'Начальное время не может быть меньше конечного', status: false});
				is_form_valid = false;
			}
		});
		
		if (!is_edit) {
			$form.find('.DataUrl').each(function() {
				var $this = $(this);
				if ($this.val() === "") {
					if (is_form_valid) {
						$('body').stop().animate({scrollTop: Math.ceil($this.closest('.EditEventImgLoadWrap').offset().top - 150)}, 1000, 'swing', function() {
							showNotifier({text: 'Пожалуйста, добавьте к событию обложку', status: false})
						});
					}
					is_form_valid = false;
				}
			});
		}
		
		if (is_form_valid) {
			$.extend(true, data, form_data);
			
			data.tags = tags;
			data.filenames = {
				horizontal: data.filename_horizontal
			};
			if (data.registration_required) {
				data.registration_till = "" + data.registration_till_date + 'T' + data.registration_till_time_hours + ':' + data.registration_till_time_minutes + ':00'
			}
			if (data.delayed_publication) {
				data.public_at = "" + data.public_at_date + 'T' + data.public_at_time_hours + ':' + data.public_at_time_minutes + ':00'
			}
			
			data.dates = [];
			if (data.different_time) {
				var selected_days_rows = $('.SelectedDaysRows').children();
				
				selected_days_rows.each(function() {
					var $this = $(this);
					data.dates.push({
						event_date: $this.find('.DatePicker').data('selected_day'),
						start_time: $this.find('.StartHours').val() + ':' + $this.find('.StartMinutes').val(),
						end_time: $this.find('.EndHours').val() + ':' + $this.find('.EndMinutes').val()
					});
				});
			} else {
				var MainCalendar = $('.EventDatesCalendar').data('calendar'),
					$main_time = $('.MainTime'),
					start_time = $main_time.find('.StartHours').val() + ':' + $main_time.find('.StartMinutes').val(),
					end_time = $main_time.find('.EndHours').val() + ':' + $main_time.find('.EndMinutes').val();
				
				MainCalendar.selected_days.forEach(function(day) {
					data.dates.push({
						event_date: day,
						start_time: start_time,
						end_time: end_time
					})
				});
			}
			
			PAGE.$wrapper.addClass('-faded');
			try {
				if (is_edit) {
					PAGE.event.updateEvent(data, afterSubmit);
				} else {
					PAGE.event.createEvent(data, afterSubmit);
				}
			} catch (e) {
				PAGE.$wrapper.removeClass('-faded');
				console.error(e);
			}
		}
	}
	
	bindDatePickers(PAGE.$wrapper);
	bindTimeInput(PAGE.$wrapper);
	bindSelect2(PAGE.$wrapper);
	bindTabs(PAGE.$wrapper);
	Modal.bindCallModal(PAGE.$wrapper);
	bindLimitInputSize(PAGE.$wrapper);
	bindRippleEffect(PAGE.$wrapper);
	bindFileLoadButton(PAGE.$wrapper);
	(function bindLoadByURLButton() {
		$('.LoadByURLButton').not('-Handled_LoadByURLButton').on('click', function() {
			var $this = $(this),
				$input = $('#' + $this.data('load_input'));
			$this.data('url', $input.val());
			window.current_load_button = $this;
			socket.emit('image.getFromURL', $input.val());
			window.paceOptions = {
				catchupTime: 10000,
				maxProgressPerFrame: 1,
				ghostTime: Number.MAX_SAFE_INTEGER,
				checkInterval: {
					checkInterval: 10000
				},
				eventLag: {
					minSamples: 1,
					sampleCount: 30000000,
					lagThreshold: 0.1
				}
			}; //хз зачем, все равно не работает
			Pace.restart();
		}).addClass('-Handled_LoadByURLButton');
	})();
	(function initEditEventMainCalendar() {
		//TODO: Refactor this!! Make it more readable
		var $selected_days_text = PAGE.$wrapper.find('.EventSelectedDaysText'),
			$selected_days_table_rows = PAGE.$wrapper.find('.SelectedDaysRows'),
			MainCalendar = new Calendar('.EventDatesCalendar', {
				weekday_selection: true,
				month_selection: true,
				min_date: moment().format(__C.DATE_FORMAT)
			}),
			dates = {},
			genitive_month_names = {
				'январь': 'января',
				'февраль': 'февраля',
				'март': 'марта',
				'апрель': 'апреля',
				'май': 'мая',
				'июнь': 'июня',
				'июль': 'июля',
				'август': 'августа',
				'сентябрь': 'сентября',
				'октябрь': 'октября',
				'ноябрь': 'ноября',
				'декабрь': 'декабря'
			},
			$fucking_table = $();
		MainCalendar.init();
		MainCalendar.$calendar.on('days-changed.displayFormattedText', displayFormattedText);
		
		function bindRemoveRow($parent) {
			$parent.find('.RemoveRow').not('.-Handled_RemoveRow').each(function(i, elem) {
				$(elem).on('click', function() {
					MainCalendar.deselectDays($(this).closest('tr').data('date'));
				}).addClass('-Handled_RemoveRow');
			});
		}
		
		function displayFormattedText() {
			dates = {};
			MainCalendar.selected_days.forEach(function(date, i, days) {
				var _date = moment(date);
				
				if (typeof dates[_date.month()] === 'undefined') {
					dates[_date.month()] = {};
					dates[_date.month()].selected_days = [];
					dates[_date.month()].month_name = genitive_month_names[_date.format('MMMM')];
				}
				dates[_date.month()].selected_days.push(_date.date());
			});
			
			$selected_days_text.empty().removeClass('hidden');
			if (Object.keys(dates).length) {
				$.each(dates, function(i, elem) {
					$selected_days_text.append($('<p>').text(elem.selected_days.join(', ') + ' ' + elem.month_name))
				});
			} else {
				$selected_days_text.html('<p>Даты не выбраны</p>');
			}
		}
		
		function doTheFuckingSort($rows, $parent) {
			$rows.sort(function(a, b) {
				var an = $(a).data('date'),
					bn = $(b).data('date');
				
				if (an > bn) return 1;
				else if (an < bn) return -1;
				else return 0;
			});
			$rows.detach().appendTo($parent);
		}
		
		function buildTable(selected_days) {
			//TODO: BUG. On multiple selection (month or weekday) duplicates appearing in table.
			//TODO: Bind time on building table
			var $output = $();
			if (Array.isArray(selected_days)) {
				selected_days.forEach(function(day) {
					$output = $output.add(tmpl('selected-table-day', {
						date: day,
						formatted_date: day.split('-').reverse().join('.')
					}));
				});
			}
			else {
				$output = tmpl('selected-table-day', {
					date: selected_days,
					formatted_date: selected_days.split('-').reverse().join('.')
				});
			}
			bindDatePickers($output);
			bindTimeInput($output);
			bindRemoveRow($output);
			
			$fucking_table = $fucking_table.add($output);
			$output.find('.DatePicker').each(function() {
				var DP = $(this).data('datepicker');
				DP.$datepicker.on('date-picked', function() {
					MainCalendar.deselectDays(DP.prev_selected_day).selectDays(DP.selected_day);
					doTheFuckingSort($fucking_table, $selected_days_table_rows)
				});
			});
			doTheFuckingSort($fucking_table, $selected_days_table_rows);
		}
		
		function BuildSelectedDaysTable() {
			if (MainCalendar.last_action === 'select') {
				buildTable(MainCalendar.last_selected_days);
			}
			else if (MainCalendar.last_action === 'deselect') {
				if (Array.isArray(MainCalendar.last_selected_days)) {
					var classes = [];
					MainCalendar.last_selected_days.forEach(function(day) {
						classes.push('.TableDay_' + day);
					});
					$fucking_table.detach(classes.join(', '));
					$fucking_table = $fucking_table.not(classes.join(', '));
				}
				else {
					$fucking_table.detach('.TableDay_' + MainCalendar.last_selected_days);
					$fucking_table = $fucking_table.not('.TableDay_' + MainCalendar.last_selected_days);
				}
			}
			
			doTheFuckingSort($fucking_table, $selected_days_table_rows);
			
			//TODO: Do not forget to rename 'fucking' names
			//TODO: Please, don't forget to rename 'fucking' names
			
		}
		
		PAGE.$wrapper.find('#edit_event_different_time').on('change', function() {
			var $table_wrapper = PAGE.$wrapper.find('#edit_event_selected_days_wrapper'),
				$table_content = $table_wrapper.children();
			if ($(this).prop('checked')) {
				buildTable(MainCalendar.selected_days);
				$table_wrapper.height($table_content.height()).one('transitionend', function() {
					$table_wrapper.css({
						'height': 'auto',
						'overflow': 'visible'
					})
				});
				MainCalendar.$calendar.on('days-changed.buildTable', BuildSelectedDaysTable);
			} else {
				$table_wrapper.css({
					'height': $table_content.height(),
					'overflow': 'hidden'
				}).height(0);
				$fucking_table.remove();
				MainCalendar.$calendar.off('days-changed.buildTable');
			}
			PAGE.$wrapper.find('.MainTime').toggleStatus('disabled');
		});
		
		var AddRowDatePicker = PAGE.$wrapper.find('.AddDayToTable').data('datepicker');
		AddRowDatePicker.$datepicker.on('date-picked', function() {
			MainCalendar.selectDays(AddRowDatePicker.selected_day);
		});
		
	})();
	(function initOrganization(selected_id) {
		OrganizationsCollection.fetchMyOrganizations(['admin', 'moderator'], {fields: ['default_address']}, function(data) {
			var $wrapper = $('.EditEventOrganizations'),
				organizations_options = $(),
				$default_address_button = PAGE.$wrapper.find('.EditEventDefaultAddress'),
				$select = $wrapper.find('#edit_event_organization'),
				selected_address;
			
			data.forEach(function(organization) {
				if (organization.id == selected_id) {
					selected_address = organization.default_address;
				}
				organizations_options = organizations_options.add(tmpl('option', {
					val: organization.id,
					data: "data-image-url='" + organization.img_url + "' data-default-address='" + organization.default_address + "'",
					display_name: organization.name
				}));
			});
			
			$select.append(organizations_options).select2({
				containerCssClass: 'form_select2',
				dropdownCssClass: 'form_select2_drop'
			}).on('change', function() {
				$default_address_button.data('default_address', $(this).children(":selected").data('default-address'));
			});
			if (selected_id) {
				$select.select2('val', selected_id);
				$default_address_button.data('default_address', selected_address);
			} else {
				$default_address_button.data('default_address', data[0].default_address);
			}
			if (organizations_options.length > 1) {
				$wrapper.removeClass('-hidden');
			} else {
				$wrapper.addClass('-hidden');
			}
		});
	})(PAGE.event.organization_id);
	(function checkVkPublicationAbility() {
		if (__APP.USER.accounts.indexOf("vk") !== -1) {
			socket.emit('vk.getGroupsToPost', __APP.USER.id);
			PAGE.$wrapper
				.find(
					'#edit_event_title,' +
					'#edit_event_placepicker,' +
					'#edit_event_description,' +
					'#edit_event_free,' +
					'#edit_event_min_price,' +
					'#edit_event_registration_required,' +
					'#edit_event_url,' +
					'.EventTags'
				)
				.add('.RegistrationTill input')
				.add('.MainTime input')
				.on('change.FormatVkPost', function() { PAGE.formatVKPost(); });
			PAGE.$wrapper.find('.EventDatesCalendar').data('calendar').$calendar.on('days-changed.FormatVkPost', function() { PAGE.formatVKPost(); });
		} else {
			PAGE.$wrapper.find('#edit_event_to_public_vk').toggleStatus('disabled');
		}
	})();
	
	//TODO: perepilit' placepicker
	PAGE.$wrapper.find(".Placepicker").placepicker();
	
	PAGE.$wrapper.find('.EventTags').select2({
		tags: true,
		width: '100%',
		placeholder: "Выберите до 5 тегов",
		maximumSelectionLength: 5,
		maximumSelectionSize: 5,
		tokenSeparators: [',', ';'],
		multiple: true,
		createSearchChoice: function(term, data) {
			if ($(data).filter(function() {
					return this.text.localeCompare(term) === 0;
				}).length === 0) {
				return {
					id: term,
					text: term
				};
			}
		},
		ajax: {
			url: '/api/v1/tags/',
			dataType: 'JSON',
			data: function(term, page) {
				return {
					name: term // search term
				};
			},
			results: function(data) {
				var _data = [];
				data.data.forEach(function(value) {
					value.text = value.name;
					_data.push(value);
				});
				return {
					results: _data
				}
			}
		},
		containerCssClass: "form_select2",
		dropdownCssClass: "form_select2_drop"
	});
	
	PAGE.$wrapper.find('.EditEventDefaultAddress').off('click.defaultAddress').on('click.defaultAddress', function() {
		var $this = $(this);
		$this.closest('.form_group').find('input').val($this.data('default_address'))
	});
	
	PAGE.$wrapper.find('#edit_event_delayed_publication').off('change.DelayedPublication').on('change.DelayedPublication', function() {
		PAGE.$wrapper.find('.DelayedPublication').toggleStatus('disabled');
	});
	
	PAGE.$wrapper.find('#edit_event_registration_required').off('change.RequireRegistration').on('change.RequireRegistration', function() {
		PAGE.$wrapper.find('.RegistrationTill').toggleStatus('disabled');
	});
	
	PAGE.$wrapper.find('#edit_event_free').off('change.FreeEvent').on('change.FreeEvent', function() {
		PAGE.$wrapper.find('.MinPrice').toggleStatus('disabled');
	});
	
	PAGE.$wrapper.find('.MinPrice').find('input').inputmask({
		'alias': 'numeric',
		'autoGroup': false,
		'digits': 2,
		'digitsOptional': true,
		'placeholder': '0',
		'rightAlign': false
	});
	
	PAGE.$wrapper.find('.LoadImg').off('change.LoadImg').on('change.LoadImg', function(e) {
		var $this = $(e.target),
			files = e.target.files,
			reader;
		
		if (files.length == 0) return false;
		for (var i = 0, f; f = files[i]; i++) {
			reader = new FileReader();
			if (!f.type.match('image.*'))  continue;
			reader.onload = (function(the_file) {
				return function(e) {
					RedactEventPage.handleImgUpload($this, e.target.result, the_file.name);
				};
			})(f);
			reader.readAsDataURL(f);
		}
		
	});
	
	PAGE.$wrapper.find('#edit_event_to_public_vk').off('change.PublicVK').on('change.PublicVK', function() {
		var $vk_post_wrapper = PAGE.$wrapper.find('#edit_event_vk_publication'),
			$vk_post_content = $vk_post_wrapper.children();
		if ($(this).prop('checked')) {
			$vk_post_wrapper.height($vk_post_content.height());
		} else {
			$vk_post_wrapper.height(0);
		}
		$vk_post_wrapper.toggleStatus('disabled');
		
		$vk_post_content.find('.DeleteImg').off('click.DeleteImg').on('click.DeleteImg', function() {
			$(this).closest('.EditEventImgLoadWrap').find('input').val('').end().find('img').attr('src', '');
			PAGE.toggleVkImg();
		})
		
	});
	
	PAGE.$wrapper.find('#edit_event_submit').off('click.Submit').on('click.Submit', submitEditEvent);
};

RedactEventPage.prototype.render = function() {
	var PAGE = this,
		is_edit = !!PAGE.event.id,
		page_vars = {
			event_id: PAGE.event.id ? PAGE.event.id : undefined,
			public_at_data_label: 'Дата',
			registration_till_data_label: 'Дата',
			current_date: moment().format(__C.DATE_FORMAT),
			tomorrow_date: moment().add(1, 'd').format(__C.DATE_FORMAT)
		};
	
	function selectDates($view, raw_dates) {
		var MainCalendar = $view.find('.EventDatesCalendar').data('calendar'),
			$table_rows = $view.find('.SelectedDaysRows'),
			dates = [];
		raw_dates.forEach(function(date) {
			date.event_date = moment.unix(date.event_date).format('YYYY-MM-DD');
			dates.push(date.event_date);
		});
		MainCalendar.selectDays(dates);
		raw_dates.forEach(function(date) {
			var $day_row = $table_rows.find('.TableDay_' + date.event_date),
				start_time = date.start_time.split(':'),
				end_time = date.end_time ? date.end_time.split(':') : [];
			$day_row.find('.StartHours').val(start_time[0]);
			$day_row.find('.StartMinutes').val(start_time[1]);
			if (end_time.length) {
				$day_row.find('.EndHours').val(end_time[0]);
				$day_row.find('.EndMinutes').val(end_time[1]);
			}
		});
	}
	
	function selectTags($view, tags) {
		var selected_tags = [];
		tags.forEach(function(tag) {
			selected_tags.push({
				id: parseInt(tag.id),
				text: tag.name
			});
		});
		
		$view.find('#event_tags').select2('data', selected_tags);
	}
	
	function initVkImgCopying() {
		var $vk_wrapper = PAGE.$wrapper.find('#edit_event_vk_publication');
		PAGE.$wrapper.find('#edit_event_image_horizontal_src').on('change.CopyToVkImg', function() {
			var $wrap = $(this).closest('.EditEventImgLoadWrap'),
				$vk_wrap = PAGE.$wrapper.find('#edit_event_vk_publication'),
				$vk_preview = $vk_wrap.find('.EditEventImgPreview'),
				$vk_button = $vk_wrap.find('.CallModal'),
				$vk_$data_url = $vk_wrap.find('#edit_event_vk_image_src'),
				$button_orig = $wrap.find('.CallModal'),
				src = $(this).data('source');
			
			if (!PAGE.$wrapper.find('.edit_event_vk_right_block').hasClass('-align_center')) {
				PAGE.toggleVkImg();
			}
			$vk_$data_url.val('data.source').data('source', src);
			$vk_preview.attr('src', src);
			$vk_wrap.find('#edit_event_vk_image_filename').val(PAGE.$wrapper.find('#edit_event_image_horizontal_filename').val());
			$vk_button
				.data('crop_data', $button_orig.data('crop_data'))
				.data('source_img', $button_orig.data('source_img'))
				.on('crop', function(event, cropped_src, crop_data) {
					$vk_preview.attr('src', cropped_src);
					$vk_button.data('crop_data', crop_data);
					$vk_$data_url.data('source', $vk_preview.attr('src')).trigger('change');
				});
			
		});
		$vk_wrapper.find('.FileLoadButton, .CallModal, .DeleteImg').on('click.OffCopying', function() {
			PAGE.$wrapper.find('#edit_event_image_horizontal_src').off('change.CopyToVkImg');
		});
	}
	
	if (!is_edit) {
		page_vars.header_text = 'Новое событие';
		page_vars.button_text = 'Опубликовать';
		PAGE.$wrapper.html(tmpl('edit-event-page', page_vars));
		PAGE.init();
		PAGE.toggleVkImg();
		initVkImgCopying();
	} else {
		page_vars.header_text = 'Редактирование события';
		page_vars.button_text = 'Сохранить';
		if (PAGE.event.public_at !== null) {
			var m_public_at = moment(PAGE.event.public_at);
			page_vars.public_at_data = m_public_at.format('YYYY-MM-DD');
			page_vars.public_at_data_label = m_public_at.format('DD.MM.YYYY');
			page_vars.public_at_time_hours = m_public_at.format('HH');
			page_vars.public_at_time_minutes = m_public_at.format('mm');
		}
		if (PAGE.event.registration_required) {
			var m_registration_till = moment.unix(PAGE.event.registration_till);
			page_vars.registration_till_data = m_registration_till.format('YYYY-MM-DD');
			page_vars.registration_till_data_label = m_registration_till.format('DD.MM.YYYY');
			page_vars.registration_till_time_hours = m_registration_till.format('HH');
			page_vars.registration_till_time_minutes = m_registration_till.format('mm');
		}
		if (PAGE.event.image_horizontal_url) {
			page_vars.image_horizontal_filename = PAGE.event.image_horizontal_url.split('/').reverse()[0];
			page_vars.vk_image_url = PAGE.event.image_horizontal_url;
			page_vars.vk_image_filename = page_vars.image_horizontal_filename;
		}
		if (PAGE.event.vk_image_url) {
			page_vars.vk_image_url = PAGE.event.vk_image_url;
			page_vars.vk_image_filename = PAGE.event.vk_image_url.split('/').reverse()[0];
		}
		
		page_vars = $.extend(true, {}, PAGE.event, page_vars);
		PAGE.$wrapper.html(tmpl('edit-event-page', page_vars));
		PAGE.init();
		
		if (PAGE.event.is_same_time) {
			var $day_row = PAGE.$wrapper.find('.MainTime'),
				start_time = PAGE.event.dates[0].start_time.split(':'),
				end_time = PAGE.event.dates[0].end_time ? PAGE.event.dates[0].end_time.split(':') : [];
			$day_row.find('.StartHours').val(start_time[0]);
			$day_row.find('.StartMinutes').val(start_time[1]);
			if (end_time.length) {
				$day_row.find('.EndHours').val(end_time[0]);
				$day_row.find('.EndMinutes').val(end_time[1]);
			}
		} else {
			PAGE.$wrapper.find('#edit_event_different_time').prop('checked', true).trigger('change');
		}
		selectDates(PAGE.$wrapper, PAGE.event.dates);
		selectTags(PAGE.$wrapper, PAGE.event.tags);
		
		if (PAGE.event.image_horizontal_url) {
			toDataUrl(PAGE.event.image_horizontal_url, function(base64_string) {
				PAGE.$wrapper.find('#edit_event_image_horizontal_src').val(base64_string ? base64_string : null);
			});
			PAGE.$wrapper.find('.CallModal').removeClass('-hidden').on('crop', function(event, cropped_src, crop_data) {
				var $button = $(this),
					$parent = $button.closest('.EditEventImgLoadWrap'),
					$preview = $parent.find('.EditEventImgPreview'),
					$data_url = $parent.find('.DataUrl');
				$data_url.val('data.source').data('source', $preview.attr('src')).trigger('change');
				$preview.attr('src', cropped_src);
				$button.data('crop_data', crop_data);
			});
		}
		if (page_vars.vk_image_url) {
			toDataUrl(page_vars.vk_image_url, function(base64_string) {
				PAGE.$wrapper.find('#edit_event_vk_image_src').val(base64_string ? base64_string : null);
			});
		} else {
			PAGE.toggleVkImg();
		}
		
		if (!PAGE.event.is_free) {
			PAGE.$wrapper.find('#edit_event_free').prop('checked', false).trigger('change');
			PAGE.$wrapper.find('#edit_event_min_price').val(PAGE.event.min_price);
		}
		if (PAGE.event.registration_required) {
			PAGE.$wrapper.find('#edit_event_registration_required').prop('checked', true).trigger('change');
		}
		if (PAGE.event.public_at !== null) {
			PAGE.$wrapper.find('#edit_event_delayed_publication').prop('checked', true).trigger('change');
		}
		PAGE.formatVKPost();
	}
};

/**
 *
 * @constructor
 * @augments RedactEventPage
 * @param {(string|number)} [org_id]
 */
function AddEventPage(org_id) {
	RedactEventPage.apply(this);
	this.page_title = 'Добавить событие';
	this.organization_id = org_id;
}
AddEventPage.extend(RedactEventPage);


/**
 *
 * @abstract
 * @augments Page
 */
function FeedPage() {
	Page.apply(this);
	this.fields = [
		'organization_name',
		'organization_short_name',
		'organization_logo_small_url',
		'dates',
		'is_same_time',
		'favored_users_count',
		'is_favorite',
		'favored{fields:"is_friend",order_by:"-is_friend",length:10}',
		'registration_required',
		'registration_till',
		'is_free',
		'min_price'
	];
	this.events = new EventsCollection();
	this.next_events_length = 20;
	this.wrapper_tmpl = 'feed';
	this.with_header_tabs = true;
}
FeedPage.extend(Page);

FeedPage.prototype.bindFeedEvents = function($parent) {
	bindAddAvatar($parent);
	trimAvatarsCollection($parent);
	bindRippleEffect($parent);
	bindDropdown($parent);
	Modal.bindCallModal($parent);
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
 * @returns {jqXHR}
 */
FeedPage.prototype.appendEvents = function(success) {
	var PAGE = this;
	
	PAGE.block_scroll = true;
	return PAGE.events.fetchFeed(this.fields, this.next_events_length, function(events) {
		var $events = __APP.BUILD.feedEventCards(events);
		PAGE.block_scroll = false;
		if ($events.length) {
			PAGE.$wrapper.append($events);
			PAGE.bindFeedEvents($events);
			if (success && typeof success == 'function') {
				success($events);
			}
		} else {
			PAGE.addNoEventsBlock();
			$(window).off('scroll.upload' + PAGE.constructor.name);
		}
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
				td_disabled: __C.CLASSES.NEW_DISABLED
			}
		});
	
	MainCalendar.init();
	if (selected_date) {
		MainCalendar.setMonth(selected_date.split('-')[1], selected_date.split('-')[0]).selectDays(selected_date);
	}
	MainCalendar.setDaysWithEvents();
	MainCalendar.$calendar.on('month-changed', function() {
		bindPageLinks(MainCalendar.$calendar);
		MainCalendar.setDaysWithEvents();
	});
};

FeedPage.prototype.render = function() {
	var PAGE = this,
		$window = $(window);
	
	__APP.renderHeaderTabs([
		{title: 'Актуальные', page: '/feed/actual'},
		{title: 'По времени', page: '/feed/timeline'},
		{title: 'Избранные', page: '/feed/favored'},
		{title: 'Рекомендованные', page: '/feed/recommendations'}/*,
		 {title: 'Друзья', page: '/feed/friends/'},*/
	]);
	
	if (!(__APP.PREVIOUS_PAGE instanceof FeedPage)) {
		PAGE.initFeedCalendar();
	}
	if (window.location.pathname == '/feed/' || window.location.pathname == '/feed' || !window.location.pathname.contains('feed')) {
		__APP.changeState('/feed/actual', true, true);
		return null;
	}
	
	$window.off('scroll');
	__APP.CURRENT_JQXHR = PAGE.appendEvents(function() {
		$window.on('scroll.upload' + PAGE.constructor.name, function() {
			if ($window.height() + $window.scrollTop() + 200 >= $(document).height() && !PAGE.block_scroll) {
				__APP.CURRENT_JQXHR = PAGE.appendEvents();
			}
		})
	});
};

/**
 *
 * @constructor
 * @augments FeedPage
 */
function ActualEventsPage() {
	FeedPage.apply(this);
	this.events = new ActualEventsCollection();
	this.page_title = 'Актуальные события';
}
ActualEventsPage.extend(FeedPage);

/**
 *
 * @constructor
 * @augments FeedPage
 */
function TimelineEventsPage() {
	FeedPage.apply(this);
	this.events = new TimelineEventsCollection();
	this.page_title = 'События по времени';
}
TimelineEventsPage.extend(FeedPage);

/**
 *
 * @constructor
 * @augments Events
 */
function FavoredEventsPage() {
	FeedPage.apply(this);
	this.events = new FavoredEventsCollection();
	this.page_title = 'Избранные события';
}
FavoredEventsPage.extend(FeedPage);

/**
 *
 * @constructor
 * @augments Events
 */
function RecommendedEventsPage() {
	FeedPage.apply(this);
	this.events = new RecommendedEventsCollection();
	this.page_title = 'Рекомендованные события';
}
RecommendedEventsPage.extend(FeedPage);

/**
 *
 * @constructor
 * @augments Events
 */
function FriendsEventsPage() {
	FeedPage.apply(this);
	this.events = new FriendsEventsCollection();
	this.page_title = 'События друзей';
}
FriendsEventsPage.extend(FeedPage);

/**
 *
 * @constructor
 * @augments Events
 * @param {string} date
 */
function DayEventsPage(date) {
	if (!date)
		throw Error('DayEventsCollection must have date parameter');
	FeedPage.apply(this);
	this.date = date;
	this.events = new DayEventsCollection(this.date);
	this.page_title = 'События на ' + moment(this.date).format('D MMMM YYYY');
}
DayEventsPage.extend(FeedPage);


/**
 *
 * @constructor
 * @augments Page
 * @param {(string|number)} organization_id
 */
function OrganizationPage(organization_id) {
	/**
	 * @typedef {object} OrganizationPage~EventType
	 * @property {string} name
	 * @property {string} scroll_event
	 * @property {string} sort_date_type
	 * @property {string} last_date
	 * @property {boolean} disable_upload
	 */
	var self = this,
		event_type_default = {
			last_date: '',
			disable_upload: false
		};
	Page.apply(this, arguments);
	this.fields = [
		'img_small_url',
		'background_medium_img_url',
		'description',
		'site_url',
		'is_subscribed',
		'privileges',
		'default_address',
		'subscribed_count',
		'subscribed{fields:"is_friend",order_by:"-is_friend,first_name",length:10}'
	];
	this.events_fields = [
		'image_horizontal_medium_url',
		'favored_users_count',
		'is_favorite',
		'favored{length:5}',
		'dates'
	];
	
	/**
	 * @name OrganizationPage#event_types
	 * @type object
	 * @enum {OrganizationPage~EventType}
	 */
	this.event_types = {
		future: $.extend(true, {}, event_type_default, {
			name: 'future',
			scroll_event: 'scroll.uploadFutureEvents',
			sort_date_type: 'nearest_event_date'
		}),
		past: $.extend(true, {}, event_type_default, {
			name: 'past',
			scroll_event: 'scroll.uploadPastEvents',
			sort_date_type: 'last_event_date'
		}),
		delayed: $.extend(true, {}, event_type_default, {
			name: 'delayed',
			scroll_event: 'scroll.uploadDelayedEvents',
			sort_date_type: 'public_at'
		}),
		canceled: $.extend(true, {}, event_type_default, {
			name: 'canceled',
			scroll_event: 'scroll.uploadCanceledEvents',
			sort_date_type: 'first_event_date'
		})
	};
	
	this.events_load = 0;
	this.is_loading = true;
	this.future_events = new FutureEventsCollection();
	this.past_events = new PastEventsCollection();
	this.delayed_events = new DelayedEventsCollection();
	this.canceled_events = new CanceledEventsCollection();
	this.organization = new OneOrganization(organization_id);
	this.organization.fetchOrganization(this.fields, function(data) {
		self.is_admin = self.organization.role != OneUser.ROLE.USER;
		self.max_events_load = self.is_admin ? 4 : 2;
		Page.triggerRender();
	});
}
OrganizationPage.extend(Page);
/**
 *
 * @param {OrganizationPage~EventType} type
 * @param {Array<OneEvent>} events
 * @returns {jQuery}
 */
OrganizationPage.prototype.appendEvents = function(type, events) {
	var $wrapper = this.$wrapper.find('.' + type.name.capitalize() + 'Events'),
		$output;
	
	if (events.length) {
		$output = __APP.BUILD.organizationFeedEvents(events, type);
	} else {
		type.disable_upload = true;
		$(window).off(type.scroll_event);
		$output = tmpl('organization-feed-no-event', {
			text: 'Больше событий нет :('
		});
	}
	$wrapper.append($output);
	if ($wrapper.hasClass(__C.CLASSES.NEW_ACTIVE)) {
		$wrapper.parent().height($wrapper.height());
	}
	return $output;
};
/**
 *
 * @param {OrganizationPage~EventType} type
 */
OrganizationPage.prototype.bindUploadEventsOnScroll = function(type) {
	var PAGE = this,
		$window = $(window),
		scrollEvent = function() {
			if ($window.height() + $window.scrollTop() + 200 >= $(document).height() && !type.disable_upload) {
				$window.off(type.scroll_event);
				PAGE[type.name + '_events'].fetchOrganizationsFeed(PAGE.organization.id, PAGE.events_fields, 10, function(events) {
					PAGE.bindFeedEvents(PAGE.appendEvents(type, events));
					$window.on(type.scroll_event, scrollEvent);
				});
			}
		};
	
	if (!type.disable_upload) {
		$window.on(type.scroll_event, scrollEvent);
	}
};

OrganizationPage.prototype.bindFeedEvents = function($parent) {
	bindRippleEffect($parent);
	bindAddAvatar($parent);
	trimAvatarsCollection($parent);
	Modal.bindCallModal($parent);
	bindPageLinks($parent);
};

OrganizationPage.prototype.init = function() {
	var PAGE = this,
		$subscribers_scroll;
	bindTabs(PAGE.$wrapper);
	PAGE.bindFeedEvents(PAGE.$wrapper);
	Modal.bindCallModal(PAGE.$wrapper);
	
	PAGE.$wrapper.find('.Tabs').on('change.tabs', function() {
		var scroll_events = [];
		$.each(PAGE.event_types, function() {
			scroll_events.push(this.scroll_event);
		});
		$(window).off(scroll_events.join(' '));
		PAGE.bindUploadEventsOnScroll(PAGE.event_types[$(this).find('.Tab.-active').data('type')]);
	});
	
	PAGE.$wrapper.find('.ExternalPage').on('click.sendStat', function() {
		storeStat(PAGE.organization.id, __C.STATS.ORGANIZATION_ENTITY, __C.STATS.ORGANIZATION_OPEN_SITE);
	});
	
	$subscribers_scroll = PAGE.$wrapper.find('.SubscribersScroll').scrollbar({
		disableBodyScroll: true,
		onScroll: function(y) {
			if (y.scroll == y.maxScroll) {
				PAGE.organization.subscribed.fetchOrganizationSubscribers(PAGE.organization.id, 10, {
					fields: 'is_friend',
					order_by: '-is_friend,first_name'
				}, function(subscribed) {
					if (subscribed.length) {
						$subscribers_scroll.append(__APP.BUILD.subscribers(subscribed, PAGE.organization.subscribed[PAGE.organization.subscribed.length - 1].is_friend));
					} else {
						$subscribers_scroll.off('scroll.onScroll');
					}
					bindPageLinks($subscribers_scroll);
				});
			}
		}
	});
};

OrganizationPage.prototype.render = function() {
	var PAGE = this;
	
	__APP.changeTitle(PAGE.organization.short_name);
	$('.SidebarOrganizationsList').find('[data-organization_id="' + PAGE.organization.id + '"]').find('.OrganizationCounter').addClass('-hidden');
	
	PAGE.$wrapper.html(tmpl('organization-wrapper', $.extend(true, {
		subscribe_button: new SubscribeButton(PAGE.organization.id, PAGE.organization.is_subscribed, {
			colors: {
				subscribe: '-color_accent',
				unsubscribe: '-color_neutral',
				subscribed: '-color_neutral'
			},
			classes: ['-size_low', '-fill', 'RippleEffect']
		}),
		has_address: PAGE.organization.default_address ? '' : '-hidden',
		redact_org_button: (PAGE.organization.role == OneUser.ROLE.ADMIN) ? __APP.BUILD.link({
			title: 'Изменить',
			classes: ['button', '-fill', '-color_neutral', 'fa_icon', 'fa-pencil', 'RippleEffect'],
			page: 'organization/' + PAGE.organization.id + '/edit/'
		}) : '',
		hidden_for_users: PAGE.is_admin ? '' : '-hidden',
		subscribed_blocks: __APP.BUILD.subscribers(PAGE.organization.subscribed)
	}, PAGE.organization)));
	
	PAGE.$wrapper.on('events_load.FutureEvents events_load.PastEvents events_load.DelayedEvents events_load.CanceledEvents', function(e) {
		if (e.namespace == 'FutureEvents') {
			PAGE.init();
			PAGE.bindUploadEventsOnScroll(PAGE.event_types.future);
		}
		PAGE.bindFeedEvents(PAGE.$wrapper.find('.' + e.namespace));
		if (++PAGE.events_load == PAGE.max_events_load) {
			PAGE.$wrapper.off('events_load');
		}
	});
	
	
	PAGE.future_events.fetchOrganizationsFeed(PAGE.organization.id, PAGE.events_fields, 10, function(future_events) {
		PAGE.appendEvents(PAGE.event_types.future, future_events);
		PAGE.$wrapper.trigger('events_load.FutureEvents');
	});
	
	PAGE.past_events.fetchOrganizationsFeed(PAGE.organization.id, PAGE.events_fields, 10, function(past_events) {
		PAGE.appendEvents(PAGE.event_types.past, past_events);
		PAGE.$wrapper.trigger('events_load.PastEvents');
	});
	
	if (PAGE.is_admin) {
		PAGE.delayed_events.fetchOrganizationsFeed(PAGE.organization.id, PAGE.events_fields, 10, function(delayed_events) {
			PAGE.appendEvents(PAGE.event_types.delayed, delayed_events);
			PAGE.$wrapper.trigger('events_load.DelayedEvents');
		});
		
		PAGE.canceled_events.fetchOrganizationsFeed(PAGE.organization.id, PAGE.events_fields, 10, function(canceled_events) {
			PAGE.appendEvents(PAGE.event_types.canceled, canceled_events);
			PAGE.$wrapper.trigger('events_load.CanceledEvents');
		});
	}
};


/**
 *
 * @constructor
 * @augments Page
 * @param {(string|number)} [organization_id]
 */
function EditOrganizationPage(organization_id) {
	Page.apply(this);
	this.page_title = 'Редактировать организацию';
	this.organization = new OneOrganization(organization_id);
	this.categories = new CategoriesCollection();
	
	this.fields = [
		'description',
		'site_url',
		'default_address',
		'vk_url',
		'facebook_url',
		'email'
	];
	if (organization_id) {
		this.is_loading = true;
		this.organization.fetchOrganization(this.fields, Page.triggerRender);
	}
}
EditOrganizationPage.extend(Page);

EditOrganizationPage.prototype.render = function() {
	var PAGE = this,
		$view = this.$view,
		$wrapper = this.$wrapper,
		organization_id = this.organization.id,
		additional_fields,
		local_storage;
	
	function initEditEventPage($view) {
		
		function bindLoadByURLButton($view) {
			$view.find('.LoadByURLButton').not('-Handled_LoadByURLButton').on('click', function() {
				var $this = $(this),
					$input = $('#' + $this.data('load_input'));
				$this.data('url', $input.val());
				window.current_load_button = $this;
				socket.emit('image.getFromURL', $input.val());
				window.paceOptions = {
					catchupTime: 10000,
					maxProgressPerFrame: 1,
					ghostTime: Number.MAX_SAFE_INTEGER,
					checkInterval: {
						checkInterval: 10000
					},
					eventLag: {
						minSamples: 1,
						sampleCount: 30000000,
						lagThreshold: 0.1
					}
				}; //хз зачем, все равно не работает
				Pace.restart();
			}).addClass('-Handled_LoadByURLButton');
		}
		
		function handleImgUpload($context, source, filename) {
			var $parent = $context.closest('.EditEventImgLoadWrap'),
				$preview = $parent.find('.EditEventImgPreview'),
				$file_name_text = $parent.find('.FileNameText'),
				$file_name = $parent.find('.FileName'),
				$data_url = $parent.find('.DataUrl'),
				$button = $parent.find('.CallModal');
			
			$preview.attr('src', source);
			$file_name_text.html('Загружен файл:<br>' + filename);
			$file_name.val(filename);
			$button
				.data('source_img', source)
				.on('crop', function(event, cropped_src, crop_data) {
					$preview.attr('src', cropped_src);
					$button.data('crop_data', crop_data);
					$data_url.val('data.source').data('source', $preview.attr('src')).trigger('change');
				})
				.trigger('click.CallModal');
		}
		
		
		bindSelect2($view);
		bindTabs($view);
		bindLimitInputSize($view);
		bindRippleEffect($view);
		bindFileLoadButton($view);
		bindLoadByURLButton($view);
		
		
		$view.find('.LoadImg').off('change.LoadImg').on('change.LoadImg', function(e) {
			var $this = $(e.target),
				files = e.target.files;
			
			if (files.length == 0) return false;
			for (var i = 0, f; f = files[i]; i++) {
				var reader = new FileReader();
				if (!f.type.match('image.*'))    continue;
				reader.onload = (function(the_file) {
					return function(e) {
						handleImgUpload($this, e.target.result, the_file['name']);
					};
				})(f);
				reader.readAsDataURL(f);
			}
			
		});
		
		$view.find('#add_organization_submit').off('click.Submit').on('click.Submit', submitEditOrganization);
		
	}
	
	function initOrganizationTypes(selected_id) {
		PAGE.categories.fetchCategories({}, 0, function(data) {
			var $wrapper = $view.find('.EditEventOrganizations'),
				organizations_options = $(),
				$select = $wrapper.find('#add_organization_type');
			
			data.forEach(function(organization) {
				organizations_options = organizations_options.add(tmpl('option', {
					val: organization.id,
					display_name: organization.name
				}));
			});
			
			$select.append(organizations_options).select2({
				containerCssClass: 'form_select2',
				dropdownCssClass: 'form_select2_drop'
			});
			if (selected_id) {
				$select.select2('val', selected_id);
			}
			if (organizations_options.length > 1) {
				$wrapper.removeClass('-hidden');
			} else {
				$wrapper.addClass('-hidden');
			}
		});
	}
	
	function submitEditOrganization() {
		function formValidation($form, for_edit) {
			var is_valid = true,
				$times = $form.find('#edit_event_different_time').prop('checked') ? $form.find('[class^="TableDay_"]') : $form.find('.MainTime');
			
			$form.find(':required').not(':disabled').each(function() {
				var $this = $(this),
					max_length = $this.data('maxlength');
				if ($this.val() === "" || (max_length && $this.val().length > max_length)) {
					if (is_valid) {
						$('body').stop().animate({scrollTop: Math.ceil($this.offset().top - 150)}, 1000, 'swing');
					}
					handleErrorField($this);
					is_valid = false;
				}
			});
			
			$times.each(function() {
				var $row = $(this),
					start = $row.find('.StartHours').val() + $row.find('.StartMinutes').val(),
					end = $row.find('.EndHours').val() + $row.find('.EndMinutes').val();
				if (start > end) {
					if (is_valid) {
						$('body').stop().animate({scrollTop: Math.ceil($row.offset().top - 150)}, 1000, 'swing');
					}
					showNotifier({text: 'Начальное время не может быть меньше конечного', status: false});
					is_valid = false;
				}
			});
			
			if (!for_edit) {
				$form.find('.DataUrl').each(function() {
					var $this = $(this);
					if ($this.val() === "") {
						if (is_valid) {
							$('body').stop().animate({scrollTop: Math.ceil($this.closest('.EditEventImgLoadWrap').offset().top - 150)}, 1000, 'swing', function() {
								showNotifier({text: 'Пожалуйста, добавьте обложку организации', status: false})
							});
						}
						is_valid = false;
					}
				});
			}
			return is_valid;
		}
		
		function afterSubmit() {
			socket.on('utils.updateImagesDone', function() {
				window.location.href = '/organization/' + PAGE.organization.id;
			});
			socket.emit('utils.updateImages');
		}
		
		var $form = $view.find("#add-organization-form"),
			data = {
				organization_id: null,
				name: null,
				short_name: null,
				type_id: null,
				background_filename: null,
				logo_filename: null,
				default_address: null,
				location: null,
				description: null,
				site_url: null,
				vk_url: null,
				facebook_url: null,
				email: null,
				filenames: {
					background: null,
					logo: null
				}
			},
			form_data = $form.serializeForm(),
			valid_form = formValidation($form, !!(form_data.organization_id));
		
		if (valid_form) {
			$.extend(true, data, form_data);
			
			data.filenames = {
				background: data.background_filename,
				logo: data.logo_filename
			};
			
			if (PAGE.organization.id) {
				PAGE.organization.updateOrganization(data, afterSubmit);
			} else {
				PAGE.organization.createOrganization(data, afterSubmit);
			}
			
			
		}
		
	}
	
	
	if (typeof organization_id === 'undefined') {
		try {
			local_storage = JSON.parse(window.localStorage.getItem('organization_info'));
		} catch (e) {
			local_storage = {}
		}
		
		additional_fields = $.extend({
			header_text: 'Новый организатор'
		}, local_storage, true);
		
		window.localStorage.removeItem('open_add_organization');
		window.localStorage.removeItem('organization_info');
		
		$wrapper.html(tmpl('add-organization-page', additional_fields));
		initEditEventPage($view);
		Modal.bindCallModal($view);
		initOrganizationTypes();
	} else {
		additional_fields = $.extend(true, {}, this.organization);
		
		additional_fields.header_text = 'Редактирование организации';
		
		if (additional_fields.background_img_url) {
			additional_fields.background_filename = additional_fields.background_img_url.split('/').reverse()[0];
		}
		if (additional_fields.img_url) {
			additional_fields.logo_filename = additional_fields.img_url.split('/').reverse()[0];
		}
		
		$.extend(true, additional_fields, additional_fields);
		$wrapper.html(tmpl('add-organization-page', additional_fields));
		
		initEditEventPage($view);
		initOrganizationTypes(additional_fields.type_id);
		
		if (additional_fields.background_img_url && additional_fields.img_url) {
			$view.find('.CallModal').removeClass('-hidden').on('crop', function(event, cropped_src, crop_data) {
				var $button = $(this),
					$parent = $button.closest('.EditEventImgLoadWrap'),
					$preview = $parent.find('.EditEventImgPreview'),
					$data_url = $parent.find('.DataUrl');
				$data_url.val('data.source').data('source', $preview.attr('src')).trigger('change');
				$preview.attr('src', cropped_src);
				$button.data('crop_data', crop_data);
			});
		}
		Modal.bindCallModal($view);
		
		if (additional_fields.img_url) {
			toDataUrl(additional_fields.img_url, function(base64_string) {
				$view.find('#add_organization_img_src').val(base64_string ? base64_string : null);
			});
		}
		if (additional_fields.background_img_url) {
			toDataUrl(additional_fields.background_img_url, function(base64_string) {
				$view.find('#add_organization_background_src').val(base64_string ? base64_string : null);
			});
		}
	}
};

/**
 *
 * @constructor
 * @augments EditOrganizationPage
 */
function AddOrganizationPage() {
	EditOrganizationPage.apply(this);
	this.page_title = 'Новая организация';
}
AddOrganizationPage.extend(EditOrganizationPage);


/**
 *
 * @constructor
 * @augments Page
 * @param {(string|number)} [category_id]
 */
function CatalogPage(category_id) {
	var self = this;
	Page.apply(this);
	
	this.wrapper_tmpl = 'organizations';
	
	this.categories_ajax_data = {order_by: 'order_position'};
	this.organizations_ajax_data = {
		fields: [
			'background_small_img_url',
			'img_small_url',
			'is_subscribed',
			'subscribed_count',
			'privileges'
		],
		order_by: '-subscribed_count'
	};
	
	this.default_title = 'Организации';
	
	this.is_loading = true;
	this.selected_category_id = category_id;
	this.categories = new CategoriesCollection();
	this.all_organizations = new OrganizationsCollection();
	this.categories.fetchCategoriesWithOrganizations(this.categories_ajax_data, this.organizations_ajax_data, 0, function() {
		self.all_organizations = self.categories
			.reduce(function(collection, cat) {
				return collection.setData(cat.organizations);
			}, new OrganizationsCollection())
			.sort(function(a, b) {
				return b.subscribed_count - a.subscribed_count;
			});
		Page.triggerRender();
	});
}
CatalogPage.extend(Page);
/**
 *
 * @param {(string|number)} category_id
 */
CatalogPage.prototype.selectCategory = function(category_id) {
	this.selected_category_id = category_id ? category_id : this.selected_category_id;
	this.$view.find('.Category').filter('[data-category-id="' + this.selected_category_id + '"]').addClass(__C.CLASSES.NEW_ACTIVE);
	__APP.changeState('/organizations/' + this.selected_category_id, true);
	__APP.changeTitle(this.categories.getByID(this.selected_category_id).name);
};

CatalogPage.prototype.init = function() {
	var PAGE = this,
		$categories = PAGE.$view.find('.Category');
	
	function bindOrganizationsEvents() {
		bindRippleEffect(PAGE.$view);
		bindPageLinks(PAGE.$view);
	}
	
	$(window).on('subscribe.updateCatalog', function(e, id) {
		var org = PAGE.all_organizations.getByID(id);
		org.is_subscribed = true;
		org.subscribed_count++;
	});
	$(window).on('unsubscribe.updateCatalog', function(e, id) {
		var org = PAGE.all_organizations.getByID(id);
		org.is_subscribed = false;
		org.subscribed_count--;
	});
	
	bindOrganizationsEvents();
	
	PAGE.$view.find('.OrganizationsCategoriesScroll').scrollbar({disableBodyScroll: true});
	
	PAGE.$view.find('.ShowAllOrganizations').on('click.showAllOrganizations', function() {
		$categories.removeClass(__C.CLASSES.NEW_ACTIVE).siblings('.SubcategoryWrap').height(0);
		PAGE.selected_category_id = undefined;
		
		__APP.changeState('/organizations', true);
		__APP.changeTitle(PAGE.default_title);
		PAGE.$wrapper.html(__APP.BUILD.organizationCard(PAGE.all_organizations));
		bindOrganizationsEvents();
	});
	
	$categories.on('click.selectCategory', function() {
		var $this = $(this),
			category_id = $this.data('category-id'),
			$wrap = $this.next('.SubcategoryWrap'),
			is_parent_category = !!$wrap.length,
			is_this_active = $this.hasClass(__C.CLASSES.NEW_ACTIVE);
		
		$this.parent().find('.Category').not($this).removeClass(__C.CLASSES.NEW_ACTIVE).filter('.SubcategoryWrap').height(0);
		if (is_parent_category) {
			$wrap.height(is_this_active ? 0 : $wrap.children().outerHeight());
			$this.toggleClass(__C.CLASSES.NEW_ACTIVE);
		} else {
			if (is_this_active) {
				PAGE.categories = new CategoriesCollection();
				PAGE.categories.fetchCategoriesWithOrganizations(PAGE.categories_ajax_data, PAGE.organizations_ajax_data, 0, function() {
					PAGE.render();
				});
			} else {
				PAGE.selectCategory(category_id);
				PAGE.$wrapper.html(__APP.BUILD.organizationCard(PAGE.categories.getByID(category_id).organizations));
				bindOrganizationsEvents();
			}
		}
	});
};

CatalogPage.prototype.render = function() {
	this.$view.find('.OrganizationsCategoriesScroll').html(__APP.BUILD.organisationsCategoriesItems(this.categories));
	this.$wrapper.html(__APP.BUILD.organizationCard(this.selected_category_id ? this.categories.getByID(this.selected_category_id).organizations : this.all_organizations));
	
	if (this.selected_category_id) {
		this.selectCategory(this.selected_category_id);
	} else {
		__APP.changeTitle(this.default_title);
	}
	this.init();
};

CatalogPage.prototype.destroy = function() {
	$(window).off('subscribe.updateCatalog unsubscribe.updateCatalog');
};


/**
 *
 * @constructor
 * @augments Page
 * @param {string} search
 */
function SearchPage(search) {
	Page.apply(this, arguments);
	
	this.page_title = 'Поиск';
	this.$search_bar_input = $('#search_bar_input');
	this.search_string = decodeURIComponent(search);
	this.events_ajax_data = {
		length: 20,
		fields: [
			'image_horizontal_medium_url',
			'detail_info_url',
			'is_favorite',
			'nearest_event_date',
			'can_edit',
			'location',
			'favored_users_count',
			'organization_name',
			'organization_short_name',
			'organization_logo_small_url',
			'description',
			'favored',
			'is_same_time',
			'tags',
			'dates'
		],
		filters: "future=true"
	};
	this.organizations_ajax_data = {
		length: 30,
		fields: [
			'subscribed_count',
			'img_small_url'
		]
	};
	this.search_results = new SearchResults(this.search_string);
	this.is_loading = true;
	this.search_results.fetchEventsAndOrganizations(this.events_ajax_data, this.organizations_ajax_data, Page.triggerRender);
}
SearchPage.extend(Page);
/**
 *
 * @param {(OneOrganization|Array<OneOrganization>|OrganizationsCollection)} organizations
 * @returns {jQuery}
 */
SearchPage.buildOrganizationItems = function(organizations) {
	return __APP.BUILD.organizationItems(organizations, {
		block_classes: ['-show'],
		avatar_classes: ['-size_50x50', '-rounded'],
		counter_classes: [__C.CLASSES.NEW_HIDDEN]
	})
};

SearchPage.prototype.render = function() {
	var PAGE = this,
		data = {},
		$organizations_scrollbar;
	
	this.$search_bar_input.val(this.search_string);
	
	function bindFeedEvents($parent) {
		bindAddAvatar($parent);
		trimAvatarsCollection($parent);
		bindRippleEffect($parent);
		Modal.bindCallModal($parent);
		bindPageLinks($parent);
		
		$parent.find('.HideEvent').addClass(__C.CLASSES.NEW_HIDDEN);
	}
	
	if (this.search_results.events.length == 0) {
		data.events = tmpl('search-no-events', {});
	} else {
		data.events = __APP.BUILD.feedEventCards(this.search_results.events);
	}
	if (this.search_results.organizations.length == 0) {
		data.no_organizations = __C.CLASSES.NEW_HIDDEN;
	} else {
		data.organizations = SearchPage.buildOrganizationItems(this.search_results.organizations);
	}
	
	this.$wrapper.append(tmpl('search-wrapper', data));
	$organizations_scrollbar = this.$wrapper.find('.SearchOrganizationsScrollbar').scrollbar({
		disableBodyScroll: true,
		onScroll: function(y) {
			if (y.scroll == y.maxScroll) {
				PAGE.search_results.fetchOrganizations(PAGE.organizations_ajax_data, function(organizations) {
					if (organizations.length) {
						$organizations_scrollbar.append(SearchPage.buildOrganizationItems(organizations));
					} else {
						$organizations_scrollbar.off('scroll.onScroll');
					}
					bindPageLinks($organizations_scrollbar);
				});
			}
		}
	});
	bindFeedEvents(this.$wrapper);
};


/**
 *
 * @constructor
 * @augments Page
 * @param {(string|number)} friend_id
 */
function OneFriendPage(friend_id) {
	Page.apply(this);
	
	this.wrapper_tmpl = 'friends';
	this.friend_id = friend_id;
}
OneFriendPage.extend(Page);

OneFriendPage.prototype.render = function() {
	var $view = this.$view,
		friend_id = this.friend_id,
		$content = $view.find('.one-friend-main-content'),
		page_number = 0;
	
	getFriendsList($view.find('.friends-right-bar'), function() {
		$('.friend-item.friend-' + friend_id).addClass(__C.CLASSES.ACTIVE).siblings().removeClass(__C.CLASSES.ACTIVE);
	});
	$view.find('.friends-main-content').addClass(__C.CLASSES.HIDDEN);
	$content.removeClass(__C.CLASSES.HIDDEN).empty();
	
	function getFriendFeed() {
		var $load_btn = $content.find('.load-more-btn');
		if (page_number == 0) {
			$content.find('.friend-events-block').remove();
		}
		$.ajax({
			url: '/api/v1/users/' + friend_id + '/actions?fields=entity,created_at,user,type_code,event{fields:"organization_logo_small_url,image_square_vertical_url,organization_short_name"},organization{fields:"subscribed_count,img_medium_url"}&&order_by=-created_at&length=10&offset=' + (10 * page_number++),
			success: function(res) {
				var hide_btn = false;
				if ((res.data.length == 0 && page_number != 1) || (res.data.length < 10 && res.data.length > 0)) {
					$load_btn.addClass(__C.CLASSES.HIDDEN);
					hide_btn = true;
				} else if (res.data.length == 0 && page_number == 1) {
					$load_btn.before(tmpl('no-activity', {}));
					$load_btn.addClass(__C.CLASSES.HIDDEN);
					hide_btn = true;
				}
				var cards_by_users = {};
				res.data.forEach(function(stat) {
					var date = moment.unix(stat.created_at),
						ent = stat[stat.entity],
						key = [stat.entity, stat.stat_type_id, stat.user.id, date.format('DD.MM')].join('-');
					if (cards_by_users.hasOwnProperty(key) == false) {
						cards_by_users[key] = {
							user: stat.user,
							entity: stat.entity,
							type_code: stat.type_code,
							date: date.format(__C.DATE_FORMAT) == moment().format(__C.DATE_FORMAT) ? 'Сегодня' : date.format('DD.MM'),
							action_name: __C.ACTION_NAMES[stat.type_code][0].capitalize(),
							first_name: stat.user.first_name,
							avatar_url: stat.user.avatar_url,
							friend_id: stat.user.id,
							last_name: stat.user.last_name,
							entities: []
						};
					}
					
					cards_by_users[key].entities.push(ent);
				});
				
				$.each(cards_by_users, function(key, value) {
					var $card = tmpl('friends-feed-card-short', value),
						item_tmpl_name = value.entity == __C.ENTITIES.EVENT ? 'friends-feed-event' : 'friends-feed-organization';
					
					value.entities.forEach(function(ent) {
						$card.append(tmpl(item_tmpl_name, ent));
					});
					$load_btn.before($card);
				});
				if (!hide_btn) {
					$load_btn.removeClass(__C.CLASSES.HIDDEN).find('.btn').removeClass(__C.CLASSES.DISABLED);
				}
				$load_btn.off('click').on('click', getFriendFeed);
				bindPageLinks($view);
			}
		});
	}
	
	$.ajax({
		url: '/api/v1/users/' + friend_id + '?fields=subscriptions',
		success: function(res) {
			$content.append(tmpl('friends-page-header', res.data[0]));
			__APP.changeTitle(res.data[0].first_name + ' ' + res.data[0].last_name);
			$content.find('.friend-user-link').on('click', function() {
				window.open(res.data[0].link, '_blank');
			});
			
			if (res.data[0].subscriptions.length == 0) {
				tmpl('no-subscriptions', {}, $content.find('.one-friend-subscriptions'));
			} else {
				tmpl('friends-subscription', res.data[0].subscriptions, $content.find('.one-friend-subscriptions'))
			}
			
			
			$content.find('.friend-subscription-block').each(function(index) {
				var $this = $(this);
				setTimeout(function() {
					$this.fadeIn(300);
				}, index * 40 + 500);
			});
			$content.find('.user-btn').on('click', function() {
				var $this = $(this);
				$this.addClass(__C.CLASSES.ACTIVE);
				$this.siblings().removeClass(__C.CLASSES.ACTIVE);
				$content.find('.' + $this.data('tab'))
					.removeClass(__C.CLASSES.HIDDEN)
					.siblings()
					.addClass(__C.CLASSES.HIDDEN);
			});
			
			$view.find('.back-to-friends-list').on('click', function() {
				__APP.changeState('/friends');
			});
			getFriendFeed();
		}
	});
};


/**
 *
 * @constructor
 * @augments Page
 */
function FriendsPage() {
	Page.apply(this);
	
	this.wrapper_tmpl = 'friends';
	this.page_title = 'Друзья';
}
FriendsPage.extend(Page);

FriendsPage.prototype.render = function() {
	var $view = this.$view,
		page_number = 0;
	
	function getFeed() {
		if (page_number == 0) {
			$view.find('.friend-events-block').remove();
		}
		$.ajax({
			url: '/api/v1/users/feed?fields=entity,created_at,user,type_code,event{fields:"organization_logo_small_url,image_square_vertical_url,organization_short_name"},organization{fields:"subscribed_count,img_medium_url"}&&order_by=-created_at&length=10&offset=' + (10 * page_number++),
			success: function(res) {
				var cards_by_users = {};
				res.data.forEach(function(stat) {
					var date = moment.unix(stat.created_at),
						ent = stat[stat.entity],
						key = [stat.entity, stat.stat_type_id, stat.user.id, date.format('DD.MM')].join('-');
					if (cards_by_users.hasOwnProperty(key) == false) {
						cards_by_users[key] = {
							user: stat.user,
							entity: stat.entity,
							type_code: stat.type_code,
							date: date.format(__C.DATE_FORMAT) == moment().format(__C.DATE_FORMAT) ? 'Сегодня' : date.format('DD.MM'),
							action_name: __C.ACTION_NAMES[stat.type_code][0],
							first_name: stat.user.first_name,
							friend_id: stat.user.id,
							avatar_url: stat.user.avatar_url,
							last_name: stat.user.last_name,
							entities: []
						};
					}
					cards_by_users[key].entities.push(ent);
				});
				
				$.each(cards_by_users, function(key, value) {
					var $card = tmpl('friends-feed-card', value),
						item_tmpl_name = value.entity == __C.ENTITIES.EVENT ? 'friends-feed-event' : 'friends-feed-organization';
					
					value.entities.forEach(function(ent) {
						$card.append(tmpl(item_tmpl_name, ent));
					});
					$load_btn.before($card);
				});
				$load_btn.removeClass(__C.CLASSES.HIDDEN).find('.btn').removeClass(__C.CLASSES.DISABLED);
				bindPageLinks($view);
			}
		});
	}
	
	
	var $main_content = $view.find('.friends-main-content').removeClass(__C.CLASSES.HIDDEN),
		$friends_right_list = $view.find('.friends-right-bar'),
		$load_btn = $view.find('.load-more-btn').addClass(__C.CLASSES.HIDDEN),
		$user_content = $view.find('.one-friend-main-content').addClass(__C.CLASSES.HIDDEN);
	
	
	getFriendsList($friends_right_list, function(res) {});
	$load_btn.find('.btn').on('click', getFeed);
	getFeed();
};


/**
 *
 * @constructor
 * @augments Page
 */
function OnboardingPage() {
	Page.apply(this, arguments);
	this.ajax_data = {
		length: 30,
		offset: 0,
		fields: 'img_small_url'
	};
	this.disable_upload = false;
	this.block_scroll = true;
}
OnboardingPage.extend(Page);

OnboardingPage.prototype.init = function() {
	bindRippleEffect(this.$wrapper);
	bindPageLinks(this.$wrapper);
	this.$wrapper.find('.Link').on('click', function() {
		__APP.SUBSCRIBED_ORGS.update();
	});
};

OnboardingPage.prototype.bindSubscriptions = function() {
	this.$wrapper.find(".OnboardingOrgItem").not('.-Handled_OnboardingOrgItem').on('click', function() {
		var $this = $(this);
		if ($this.hasClass(__C.CLASSES.NEW_ACTIVE)) {
			__APP.USER.unsubscribeFromOrganization($this.data("organization_id"));
		} else {
			__APP.USER.subscribeToOrganization($this.data("organization_id"));
		}
		$this.toggleClass(__C.CLASSES.NEW_ACTIVE);
	}).addClass('-Handled_OnboardingOrgItem');
};

OnboardingPage.prototype.render = function() {
	var PAGE = this,
		$loader = tmpl('loader', {});
	
	function appendRecommendations(organizations) {
		$loader.detach();
		if (organizations.length) {
			PAGE.$wrapper.find(".RecommendationsWrapper").last().append(tmpl("onboarding-recommendation", organizations));
			PAGE.bindSubscriptions();
			PAGE.block_scroll = false;
		} else {
			PAGE.disable_upload = true;
		}
	}
	
	PAGE.$wrapper.html(tmpl("onboarding-main", {}));
	PAGE.init();
	PAGE.$wrapper.find('.RecommendationsWrapper').last().append($loader);
	OrganizationsCollection.fetchRecommendations(PAGE.ajax_data, appendRecommendations);
	PAGE.$wrapper.find(".RecommendationsScrollbar").scrollbar({
		onScroll: function(y, x) {
			if (y.scroll == y.maxScroll && !PAGE.disable_upload && !PAGE.block_scroll) {
				PAGE.block_scroll = true;
				PAGE.$wrapper.find('.RecommendationsWrapper').last().append($loader);
				OrganizationsCollection.fetchRecommendations(PAGE.ajax_data, appendRecommendations);
			}
		}
	});
};


/**
 *
 * @constructor
 * @abstract
 * @augments Page
 */
function StatisticsPage() {
	Page.apply(this);
	this.state_name = 'statistics';
	this.SCALES = {
		MINUTE: 'minute',
		HOUR: 'hour',
		DAY: 'day',
		WEEK: 'week',
		MONTH: 'month',
		YEAR: 'year',
		OVERALL: 'overall'
	};
	this.highchart_defaults = {
		chart: {
			backgroundColor: null,
			plotBorderWidth: null,
			plotShadow: false,
			style: {
				fontFamily: 'inherit',
				fontSize: 'inherit'
			}
		},
		title: {
			text: false
		},
		credits: {
			enabled: false
		}
	};
}
StatisticsPage.extend(Page);
/**
 *
 * @param {object} raw_data
 * @returns {object}
 */
StatisticsPage.prototype.areaChartSeriesNormalize = function(raw_data) {
	var CONVERSATIONS = {
			open_conversion: {
				with: 'open_site',
				to: 'view'
			},
			fave_conversion: {
				with: 'fave',
				to: 'open_site'
			},
			conversion: {
				with: 'subscribe',
				to: 'view'
			}
		},
		COMPARISONS = {
			subscribe_unsubscribe: {
				subscribe: 'subscribe',
				unsubscribe: 'unsubscribe'
			}
		},
		STD_NAMES = {
			'view': 'Просмотры',
			'conversion': 'Конверсия',
			'subscribe': 'Подписалось',
			'unsubscribe': 'Отписалось',
			'open_site': 'Открытий страницы события из ленты Evendate',
			'open_conversion': 'Конверсия просмотра события в ленте к открытию страницы события',
			'fave': 'Кол-во пользователей, которые добавили событие в избранное',
			'fave_conversion': 'Конверсия открытия страницы события к добавлениям в избранное'
		},
		HIDDEN_SERIES_OPTIONS = {
			showInLegend: false,
			lineWidth: 0,
			fillOpacity: 0,
			states: {
				hover: {
					enabled: false
				}
			}
		},
		output = {};
	
	function dataNormalize(raw_data, field, value_field_name) {
		return {
			name: STD_NAMES[field],
			data: raw_data.map(function(line, i) {
				return [moment.unix(line.time_value).valueOf(), line[value_field_name]];
			})
		}
	}
	
	
	$.each(raw_data, function(key, data) {
		output[key] = [];
		if (CONVERSATIONS.hasOwnProperty(key)) {
			output[key].push($.extend(true, {tooltip: {valueSuffix: ' %'}}, dataNormalize(data, key, 'value')));
			$.each(CONVERSATIONS[key], function(field_key, field) {
				output[key].push($.extend(true, {}, HIDDEN_SERIES_OPTIONS, dataNormalize(data, field, field_key)));
			})
		}
		else if (COMPARISONS.hasOwnProperty(key)) {
			$.each(COMPARISONS[key], function(field_key, field) {
				output[key].push(dataNormalize(data, field, field_key));
			})
		}
		else {
			output[key].push(dataNormalize(data, key, 'value'));
		}
	});
	
	return output;
};
/**
 *
 * @param {object} data
 * @param {object} [additional_options]
 */
StatisticsPage.prototype.buildAreaCharts = function(data, additional_options) {
	var self = this,
		normalized_series = self.areaChartSeriesNormalize(data),
		FIELDS = {
			view: {
				title: 'Просмотры',
				wrapper_class: 'ViewAreaChart'
			},
			open_site: {
				title: 'Открытий страницы события',
				wrapper_class: 'OpenSiteAreaChart'
			},
			open_conversion: {
				title: 'Конверсия просмотров/открытий',
				wrapper_class: 'OpenConversionsAreaChart'
			},
			fave: {
				title: 'Добавлений в избранное',
				wrapper_class: 'FaveAreaChart'
			},
			fave_conversion: {
				title: 'Конверсия открытий/добавлений в избранное',
				wrapper_class: 'FaveConversionsAreaChart'
			},
			subscribe_unsubscribe: {
				title: 'Подписчики',
				wrapper_class: 'SubscriberAreaChart'
			},
			conversion: {
				title: 'Конверсия просмотров/подписок',
				wrapper_class: 'ConversionAreaChart'
			}
		},
		FILL_COLORS = [
			['rgba(35, 215, 146, 0.18)', 'rgba(101, 101, 101, 0.6)', 'rgba(101, 101, 101, 0.6)'],
			['rgba(35, 215, 146, 0.09)', 'rgba(101, 101, 101, 0.6)', 'rgba(101, 101, 101, 0.6)']
		],
		area_chart_options = $.extend(true, {}, self.highchart_defaults, {
			chart: {
				type: 'areaspline',
				plotBackgroundColor: '#fcfcfc',
				plotBorderColor: '#ebebeb',
				plotBorderWidth: 1
			},
			colors: [__C.COLORS.FRANKLIN, __C.COLORS.MUTED_80, __C.COLORS.ACCENT, __C.COLORS.MUTED, __C.COLORS.MUTED_50, __C.COLORS.MUTED_30],
			title: {
				align: 'left',
				margin: 20
			},
			legend: {
				enabled: true,
				align: 'left',
				itemStyle: {color: __C.COLORS.TEXT, cursor: 'pointer', fontSize: '14px', fontWeight: '500', y: 0},
				itemMarginTop: 24,
				itemMarginBottom: 5,
				symbolHeight: 18,
				symbolWidth: 18,
				symbolRadius: 9,
				itemDistance: 42,
				x: 30
			},
			plotOptions: {
				series: {
					states: {
						hover: {
							lineWidth: 2
						}
					}
				},
				areaspline: {
					fillOpacity: 0.5,
					marker: {
						enabled: false,
						symbol: 'circle',
						radius: 2,
						states: {
							hover: {
								enabled: true
							}
						}
					},
					dataGrouping: {
						dateTimeLabelFormats: {
							millisecond: ['%b %e, %H:%M:%S.%L', '%b %e, %H:%M:%S.%L', '-%H:%M:%S.%L'],
							second: ['%b %e, %H:%M:%S', '%b %e, %H:%M:%S', '-%H:%M:%S'],
							minute: ['%b %e, %H:%M', '%b %e, %H:%M', '-%H:%M'],
							hour: ['%b %e, %H:%M', '%b %e, %H:%M', '-%H:%M'],
							day: ['%b %e, %Y', '%b %e', '-%b %e, %Y'],
							week: ['%b %e, %Y', '%b %e', '-%b %e, %Y'],
							month: ['%B %Y', '%B', '-%B %Y'],
							year: ['%Y', '%Y', '-%Y']
						}
					}
				}
			},
			tooltip: {
				headerFormat: '<b>{point.key}</b><br/>',
				positioner: function(labelWidth, labelHeight) {
					return {
						x: this.chart.plotLeft,
						y: this.chart.plotTop
					};
				},
				shadow: false,
				shape: 'square',
				valueDecimals: 0,
				xDateFormat: '%e %b %Y',
				shared: true
			},
			scrollbar: {enabled: false},
			navigator: {
				outlineColor: '#ebebeb',
				outlineWidth: 1,
				maskInside: false,
				maskFill: 'rgba(245, 245, 245, 0.66)',
				handles: {
					backgroundColor: '#9fa7b6',
					borderColor: '#fff'
				},
				xAxis: {
					gridLineWidth: 0,
					labels: {
						align: 'left',
						reserveSpace: true,
						style: {
							color: '#888'
						},
						x: 0,
						y: null
					}
				}
			},
			rangeSelector: {
				buttonTheme: {
					width: null,
					height: 22,
					fill: 'none',
					stroke: 'none',
					r: 14,
					style: {
						color: __C.COLORS.MUTED_80,
						fontSize: '13px',
						fontWeight: '400',
						textTransform: 'uppercase',
						dominantBaseline: 'middle'
					},
					states: {
						hover: {
							fill: __C.COLORS.MUTED_50,
							style: {
								color: '#fff'
							}
						},
						select: {
							fill: __C.COLORS.MUTED_80,
							style: {
								color: '#fff',
								fontWeight: '400'
							}
						}
					}
				},
				buttons: [{
					type: 'day',
					count: 7,
					text: "\xa0\xa0\xa0Неделя\xa0\xa0\xa0"
				}, {
					type: 'month',
					count: 1,
					text: "\xa0\xa0\xa0Месяц\xa0\xa0\xa0"
				}, {
					type: 'year',
					count: 1,
					text: "\xa0\xa0\xa0Год\xa0\xa0\xa0"
				}, {
					type: 'all',
					text: "\xa0\xa0\xa0Все\xa0время\xa0\xa0\xa0"
				}],
				allButtonsEnabled: true,
				selected: 2,
				labelStyle: {
					display: 'none'
				},
				inputEnabled: false
			},
			xAxis: {
				gridLineWidth: 1,
				gridLineDashStyle: 'dash',
				type: 'datetime',
				showEmpty: false,
				tickPosition: 'inside',
				dateTimeLabelFormats: {
					minute: '%H:%M',
					hour: '%H:%M',
					day: '%e %b',
					week: '%e %b',
					month: '%b %y',
					year: '%Y'
				}
			},
			yAxis: {
				allowDecimals: false,
				floor: 0,
				min: 0,
				gridLineDashStyle: 'dash',
				opposite: false,
				title: {
					text: false
				}
			}
		}, additional_options);
	
	$.each(normalized_series, function(key) {
		var field_data = {
			title: {text: FIELDS[key].title}
		};
		
		field_data.series = normalized_series[key].map(function(series_unit, i) {
			if (series_unit.fillOpacity !== 0) {
				return $.extend(true, {}, series_unit, {
					fillColor: {
						linearGradient: {x1: 0, x2: 0, y1: 0, y2: 1},
						stops: FILL_COLORS.map(function(colors_set, j) {
							return [j, colors_set[i]];
						})
					}
				})
			}
			return series_unit;
		});
		
		if (key == 'conversion' || key == 'open_conversion' || key == 'fave_conversion') {
			field_data.yAxis = {
				max: 100,
				labels: {
					format: '{value}%'
				}
			};
		}
		
		self.$wrapper.find('.' + FIELDS[key].wrapper_class).highcharts('StockChart', $.extend(true, {}, area_chart_options, field_data));
	});
};
/**
 *
 * @param {jQuery} $scoreboards_wrapper
 * @param {object} data
 * @param {object} data.numbers
 * @param {object} [data.dynamics]
 * @param {object} [titles]
 * @param {Array} [order]
 * @param {string} [size="normal"]
 */
StatisticsPage.prototype.updateScoreboards = function($scoreboards_wrapper, data, titles, order, size) {
	var with_dynamics = data.dynamics ? true : false;
	if (!order)
		order = Object.keys(titles);
	
	order.forEach(function(field) {
		var scoreboard_type = 'Scoreboard' + field.toCamelCase('_'),
			$scoreboard = $scoreboards_wrapper.find('.' + scoreboard_type),
			measure;
		
		switch (field) {
			case 'conversion':
			case 'open_conversion':
			case 'fave_conversion': {
				measure = '%';
				break;
			}
		}
		
		if (!$scoreboard.length) {
			$scoreboard = tmpl(with_dynamics ? 'scoreboard-with-dynamics' : 'scoreboard', {
				type: scoreboard_type,
				title: titles[field],
				size: size ? '-size_' + size : '-size_normal',
				number: 0 + measure,
				dynamic_by_week: 0 + measure
			}, $scoreboards_wrapper)
		}
		
		if (data.numbers[field] !== undefined) {
			$scoreboard.find('.ScoreboardNumber').animateNumber({
				number: Math.round(data.numbers[field]),
				suffix: measure
			}, 2000, 'easeOutSine');
		}
		
		if (with_dynamics) {
			if (data.dynamics[field] !== undefined) {
				$scoreboard
					.find('.ScoreboardDynamic')
					.animateNumber({
						number: Math.round(data.dynamics[field]),
						prefix: data.dynamics[field] == 0 ? undefined : (data.dynamics[field] > 0 ? '+' : '-'),
						suffix: measure
					}, 2000, 'easeOutSine')
					.siblings('label')
					.removeClass('fa-caret-up -color_franklin fa-caret-down -color_bubblegum')
					.addClass(data.dynamics[field] == 0 ? '' : (data.dynamics[field] > 0 ? 'fa-caret-up -color_franklin' : 'fa-caret-down -color_bubblegum'));
			}
		}
	});
};


/*===================StatisticsOverview===================*/

/**
 *
 * @constructor
 * @augments StatisticsPage
 */
function StatisticsOverviewPage() {
	StatisticsPage.apply(this);
	this.my_organizations_fields = ['img_medium_url', 'subscribed_count', 'staff'];
	this.page_title = 'Организации';
	this.is_loading = true;
	this.my_organizations = new OrganizationsCollection();
	this.my_organizations.fetchMyOrganizations('admin', this.my_organizations_fields, 10, '', Page.triggerRender);
}
StatisticsOverviewPage.extend(StatisticsPage);

StatisticsOverviewPage.buildMyOrganizationsBlocks = function(organizations) {
	return tmpl('statistics-overview-organization', organizations.map(function(org) {
		var avatars_max_count = 2,
			staff_additional_fields = {
				is_link: true,
				avatar_classes: ['-size_100x100', '-rounded']
			},
			org_roles = [
				{
					name: OneUser.ROLE.ADMIN,
					title: 'Администраторы',
					staff: org.staff.getSpecificStaff(OneUser.ROLE.ADMIN, staff_additional_fields),
					plural_name: OneUser.ROLE.ADMIN + 's'
				}, {
					name: OneUser.ROLE.MODERATOR,
					title: 'Модераторы',
					staff: org.staff.getSpecificStaff(OneUser.ROLE.MODERATOR, staff_additional_fields),
					plural_name: OneUser.ROLE.MODERATOR + 's'
				}
			],
			staffs_fields = {
				classes: ['-size_30x30', '-rounded', 'CallModal'],
				dataset: {
					modal_type: 'editors',
					modal_organization_id: org.id
				}
			};
		org_roles.forEach(function(role) {
			org[role.plural_name] = __APP.BUILD.avatarCollection(role.staff, avatars_max_count, $.extend(true, {}, staffs_fields, {
				dataset: {
					modal_specific_role: role.name,
					modal_title: role.title
				}
			}));
			
			org[role.plural_name + '_plus_count'] = role.staff.length - avatars_max_count;
			org[role.plural_name + '_plus_count_hidden'] = org[role.plural_name + '_plus_count'] <= 0 ? '-cast' : '';
		});
		return $.extend(true, {}, org, {
			subscribers: org.subscribed_count + getUnitsText(org.subscribed_count, __LOCALES.ru_RU.TEXTS.SUBSCRIBERS),
			buttons: __APP.BUILD.link({
				title: 'Редактировать',
				classes: ['button', 'fa_icon', 'fa-pencil', '-color_neutral', 'RippleEffect'],
				page: '/organization/' + org.id + '/edit'
			}, {
				title: 'Создать событие',
				classes: ['button', 'fa_icon', 'fa-plus', '-color_accent', 'RippleEffect'],
				page: '/event/add_to/' + org.id
			})
		});
	}));
};

StatisticsOverviewPage.prototype.bindOrganizationsEvents = function($parent) {
	trimAvatarsCollection($parent);
	bindPageLinks($parent);
	Modal.bindCallModal($parent);
	bindRippleEffect($parent);
	return $parent;
};

StatisticsOverviewPage.prototype.bindUploadOnScroll = function() {
	var PAGE = this,
		$window = $(window),
		scrollEvent = function() {
			if ($window.height() + $window.scrollTop() + 200 >= $(document).height() && !PAGE.disable_upload) {
				$window.off('scroll.uploadOrganizations');
				PAGE.my_organizations.fetchMyOrganizations('admin', PAGE.my_organizations_fields, 10, '', function(organizations) {
					if (organizations.length) {
						PAGE.find('.StatOverviewOrganizations').append(PAGE.bindOrganizationsEvents(StatisticsOverviewPage.buildMyOrganizationsBlocks(organizations)));
						$window.on('scroll.uploadOrganizations', scrollEvent);
					} else {
						PAGE.disable_upload = true;
					}
				});
			}
		};
	
	if (!PAGE.disable_upload) {
		$window.on('scroll.uploadOrganizations', scrollEvent);
	}
};

StatisticsOverviewPage.prototype.init = function() {
	this.bindOrganizationsEvents(this.$wrapper);
	this.bindUploadOnScroll();
};

StatisticsOverviewPage.prototype.render = function() {
	this.$wrapper.html(tmpl('statistics-overview-wrapper', {
		organizations: StatisticsOverviewPage.buildMyOrganizationsBlocks(this.my_organizations)
	}));
	this.init();
};

StatisticsOverviewPage.prototype.destroy = function() {
	$(window).off('scroll.uploadOrganizations');
};


/*===================StatisticsOrganization===================*/


/**
 *
 * @constructor
 * @abstract
 * @augments StatisticsPage
 * @param {(string|number)} org_id
 */
function StatisticsOrganizationPage(org_id) {
	StatisticsPage.apply(this);
	this.id = org_id;
	this.organization = new OneOrganization(this.id);
	//this.with_header_tabs = true;
}
StatisticsOrganizationPage.extend(StatisticsPage);


/**
 *
 * @constructor
 * @augments StatisticsOrganizationPage
 * @param {(string|number)} org_id
 */
function StatisticsOrganizationOverviewPage(org_id) {
	StatisticsOrganizationPage.apply(this, arguments);
	this.graphics_stats = new OrganizationsStatistics(this.id);
	this.other_stats = new OrganizationsStatistics(this.id);
	this.is_loading = true;
	this.organization.fetchOrganization([
		'description',
		'img_medium_url',
		'default_address',
		'staff',
		'privileges',
		'events'.appendAjaxData({
			length: 3,
			future: true,
			is_canceled: true,
			is_delayed: true,
			fields: [
				'organization_short_name',
				'public_at'
			],
			order_by: 'nearest_event_date'
		})
	], Page.triggerRender);
}
StatisticsOrganizationOverviewPage.extend(StatisticsOrganizationPage);
/**
 *
 * @param {string} title
 * @param staff
 * @return {jQuery}
 */
StatisticsOrganizationOverviewPage.buildStaffBlock = function(title, staff) {
	if (staff.length) {
		return tmpl('orgstat-staff-block', {
			title: title,
			avatars: __APP.BUILD.avatarBlocks(staff)
		});
	} else {
		return tmpl('orgstat-staff-block', {hidden: __C.CLASSES.NEW_HIDDEN});
	}
};

StatisticsOrganizationOverviewPage.prototype.buildAreaCharts = function() {
	var self = this;
	StatisticsPage.prototype.buildAreaCharts.call(self, {
		subscribe_unsubscribe: self.graphics_stats.subscribe.map(function(el, i) {
			return {
				time_value: el.time_value,
				subscribe: el.value,
				unsubscribe: self.graphics_stats.unsubscribe[i].value
			}
		}),
		view: self.graphics_stats.view,
		conversion: self.graphics_stats.conversion
	})
};

StatisticsOrganizationOverviewPage.prototype.buildPieChart = function($container, data) {
	var pie_chart_options = {
		chart: {
			type: 'pie',
			height: 200,
			style: {
				fontFamily: 'inherit',
				fontSize: 'inherit'
			}
		},
		colors: [__C.COLORS.FRANKLIN, __C.COLORS.ACCENT, __C.COLORS.MUTED, __C.COLORS.MUTED_80, __C.COLORS.MUTED_50, __C.COLORS.MUTED_30],
		tooltip: {
			pointFormat: '<b>{point.percentage:.1f}%</b>'
		},
		plotOptions: {
			pie: {
				center: [45, '50%'],
				allowPointSelect: true,
				cursor: 'pointer',
				size: 120,
				dataLabels: {
					distance: -35,
					defer: false,
					formatter: function() {
						return this.percentage > 15 ? Math.round(this.percentage) + '%' : null;
					},
					style: {"color": "#fff", "fontSize": "20px", "fontWeight": "300", "textShadow": "none"},
					y: -6
				},
				showInLegend: true
			}
		},
		legend: {
			align: 'right',
			verticalAlign: 'top',
			layout: 'vertical',
			width: 100,
			symbolHeight: 0,
			symbolWidth: 0,
			itemMarginBottom: 5,
			labelFormatter: function() {
				return '<span style="color: ' + this.color + '">' + this.name + '</span>'
			},
			itemStyle: {cursor: 'pointer', fontSize: '14px', fontWeight: '500'},
			y: 12
		}
	};
	
	function pieChartSeriesNormalize(raw_data) {
		var STD_NAMES = {
			"browser": "Браузер",
			"android": "Аndroid",
			"ios": "iOS",
			"female": "Женщины",
			"male": "Мужчины",
			"other": "Остальные",
			null: "Не указано"
		};
		return [{
			data: raw_data.map(function(line, i) {
				return {
					name: line.name ? STD_NAMES[line.name] : STD_NAMES[line.gender],
					y: line.count
				}
			})
		}];
	}
	
	$container.highcharts($.extend(true, {}, this.highchart_defaults, pie_chart_options, {series: pieChartSeriesNormalize(data)}));
};

StatisticsOrganizationOverviewPage.prototype.render = function() {
	var PAGE = this,
		stat_dynamics = {
			scale: Statistics.SCALES.WEEK,
			fields: [
				'subscribe',
				'view',
				'fave',
				'conversion'
			]
		},
		staffs_additional_fields = {
			is_link: true,
			avatar_classes: ['-size_40x40', '-rounded']
		},
		storage_data_name = 'org_stats_' + this.id + '_data',
		storage_until_name = 'org_stats_' + this.id + '_until',
		is_cached_data_actual = moment.unix(window.sessionStorage.getItem(storage_until_name)).isAfter(moment());
	
	__APP.changeTitle([{
		title: 'Организации',
		page: '/statistics'
	}, this.organization.short_name]);
	
	this.$wrapper.html(tmpl('orgstat-overview', $.extend(true, {}, this.organization, {
		staff_block: StatisticsOrganizationOverviewPage.buildStaffBlock('Администраторы', this.organization.staff.getSpecificStaff(OneUser.ROLE.ADMIN, staffs_additional_fields))
			.add(StatisticsOrganizationOverviewPage.buildStaffBlock('Модераторы', this.organization.staff.getSpecificStaff(OneUser.ROLE.MODERATOR, staffs_additional_fields))),
		event_blocks: tmpl('orgstat-event-block', this.organization.events.map(function(event) {
			var badges = [];
			if (event.canceled)
				badges.push({title: 'Отменено'});
			if (event.public_at && moment.unix(event.public_at).isBefore())
				badges.push({title: 'Не опубликовано'});
			
			return {
				id: event.id,
				title: event.title,
				organization_short_name: event.organization_short_name,
				day: moment.unix(event.first_event_date).format("D"),
				month: moment.unix(event.first_event_date).format("MMM"),
				badges: tmpl('orgstat-event-block-badge', badges)
			};
		}))
	})));
	
	if (is_cached_data_actual) {
		this.graphics_stats.setData(JSON.parse(window.sessionStorage.getItem(storage_data_name)));
		this.buildAreaCharts();
	} else {
		this.$wrapper.find('.OrgStatAreaCharts').children('.AreaChart').append(tmpl('loader'));
		this.graphics_stats.fetchStatistics(Statistics.SCALES.DAY, moment(__APP.EVENDATE_BEGIN, 'DD-MM-YYYY').format(), ['view', 'subscribe', 'unsubscribe', 'conversion'], null, function() {
			window.sessionStorage.setItem(storage_data_name, JSON.stringify(PAGE.graphics_stats));
			window.sessionStorage.setItem(storage_until_name, moment().add(15, 'm').unix());
			PAGE.buildAreaCharts();
		});
	}
	
	this.other_stats.fetchStatistics(Statistics.SCALES.OVERALL, false, ['subscribe', 'view', 'fave', 'conversion', 'audience'], stat_dynamics, function(stat_data) {
		var scoreboards_data = {numbers: {}, dynamics: {}};
		
		$.each(stat_data.dynamics, function(field, dynamics) {
			scoreboards_data.dynamics[field] = dynamics[0].value;
			scoreboards_data.numbers[field] = stat_data[field][0].value;
		});
		PAGE.buildPieChart(PAGE.$wrapper.find('.GenderPieChart'), this.audience.gender);
		PAGE.buildPieChart(PAGE.$wrapper.find('.DevicePieChart'), this.audience.devices);
		
		PAGE.updateScoreboards(PAGE.$wrapper.find('.Scoreboards'), scoreboards_data, {
			'subscribe': 'Подписчиков организатора',
			'fave': 'Добавлений в избранное',
			'view': 'Просмотров организатора',
			'conversion': 'Конверсия открытий/подписок'
		}, ['subscribe', 'fave', 'view', 'conversion']);
		
	});
	
	bindRippleEffect(this.$wrapper);
	bindPageLinks(this.$wrapper);
};


/**
 *
 * @constructor
 * @augments StatisticsOrganizationPage
 * @param {(string|number)} org_id
 */
function StatisticsOrganizationEventsPage(org_id) {
	StatisticsOrganizationPage.apply(this, arguments);
}
StatisticsOrganizationEventsPage.extend(StatisticsOrganizationPage);

StatisticsOrganizationEventsPage.prototype.render = function() {};


/**
 *
 * @constructor
 * @augments StatisticsOrganizationPage
 * @param {(string|number)} org_id
 */
function StatisticsOrganizationAuditoryPage(org_id) {
	StatisticsOrganizationPage.apply(this, arguments);
}
StatisticsOrganizationAuditoryPage.extend(StatisticsOrganizationPage);

StatisticsOrganizationAuditoryPage.prototype.render = function() {};


/**
 *
 * @constructor
 * @augments StatisticsOrganizationPage
 * @param {(string|number)} org_id
 */
function StatisticsOrganizationPromotionPage(org_id) {
	StatisticsOrganizationPage.apply(this, arguments);
}
StatisticsOrganizationPromotionPage.extend(StatisticsOrganizationPage);

StatisticsOrganizationPromotionPage.prototype.render = function() {};


/**
 *
 * @constructor
 * @augments StatisticsOrganizationPage
 * @param {(string|number)} org_id
 */
function StatisticsOrganizationSettingsPage(org_id) {
	StatisticsOrganizationPage.apply(this, arguments);
}
StatisticsOrganizationSettingsPage.extend(StatisticsOrganizationPage);

StatisticsOrganizationSettingsPage.prototype.render = function() {};


/**
 *
 * @constructor
 * @augments StatisticsOrganizationPage
 * @param {(string|number)} org_id
 */
function StatisticsOrganizationSupportPage(org_id) {
	StatisticsOrganizationPage.apply(this, arguments);
}
StatisticsOrganizationSupportPage.extend(StatisticsOrganizationPage);

StatisticsOrganizationSupportPage.prototype.render = function() {};


/*===================StatisticsEvent===================*/


/**
 *
 * @constructor
 * @augments StatisticsPage
 * @param {(string|number)} event_id
 */
function StatisticsEventPage(event_id) {
	StatisticsPage.apply(this, arguments);
	this.id = event_id;
	this.event = new OneEvent(this.id);
}
StatisticsEventPage.extend(StatisticsPage);


/**
 *
 * @constructor
 * @augments StatisticsEventPage
 * @param {(string|number)} event_id
 */
function StatisticsEventOverviewPage(event_id) {
	StatisticsEventPage.apply(this, arguments);
	
	this.graphics_stats = new EventStatistics(this.id);
	this.scoreboards_stats = new EventStatistics(this.id);
	this.is_loading = true;
	this.event.fetchEvent([
		'image_horizontal_medium_url',
		'organization_short_name',
		'favored_users_count',
		'is_same_time',
		'dates'
	], Page.triggerRender);
}
StatisticsEventOverviewPage.extend(StatisticsEventPage);

StatisticsEventOverviewPage.prototype.render = function() {
	var PAGE = this;
	
	__APP.changeTitle([{
		title: 'Организации',
		page: '/statistics'
	}, {
		title: this.event.organization_short_name,
		page: '/statistics/organization/' + this.event.organization_id
	}, this.event.title]);
	
	this.$wrapper.html(tmpl('eventstat-overview', $.extend(true, {}, this.event, {
		dates_block: tmpl('eventstat-overview-datetime', {
			date: displayDateRange(this.event.first_event_date, this.event.last_event_date),
			time: this.event.is_same_time ? displayTimeRange(this.event.dates[0].start_time, this.event.dates[0].end_time) : 'Разное время'
		})
	})));
	this.$wrapper.find('.EventStatAreaCharts').children('.AreaChart').html(tmpl('loader'));
	
	this.scoreboards_stats.fetchStatistics(Statistics.SCALES.OVERALL, false, ['view', 'fave', 'open_site', 'fave_conversion', 'open_conversion'], null, function(data) {
		var scoreboards_data = {numbers: {}};
		$.each(data, function(field, stats) {
			scoreboards_data.numbers[field] = stats[0].value
		});
		PAGE.updateScoreboards(PAGE.$wrapper.find('.EventstatsScoreboards'), scoreboards_data, {
			'fave': 'Добавлений в избранное',
			'view': 'Просмотров события'
		}, ['fave', 'view']);
		PAGE.updateScoreboards(PAGE.$wrapper.find('.EventstatsBigScoreboards'), scoreboards_data, {
			'view': 'Просмотров',
			'open_site': 'Открытий',
			'open_conversion': 'Конверсия открытий',
			'fave': 'Добавлений',
			'fave_conversion': 'Конверсия добавлений'
		}, ['view', 'open_site', 'open_conversion', 'fave', 'fave_conversion'], 'big');
	});
	
	this.graphics_stats.fetchStatistics(Statistics.SCALES.DAY, moment(__APP.EVENDATE_BEGIN, 'DD-MM-YYYY').format(), ['view', 'fave', 'open_site', 'fave_conversion', 'open_conversion'], null, function(data) {
		PAGE.buildAreaCharts(data, {
			rangeSelector: {
				selected: 1
			}
		});
	});
	
	Modal.bindCallModal(PAGE.$wrapper);
	bindPageLinks(PAGE.$wrapper);
};


/**
 *
 * @constructor
 * @augments StatisticsEventPage
 * @param {(string|number)} event_id
 */
function StatisticsEventAuditoryPage(event_id) {
	StatisticsEventPage.apply(this, arguments);
}
StatisticsEventAuditoryPage.extend(StatisticsEventPage);

StatisticsEventAuditoryPage.prototype.render = function() {};


/**
 *
 * @constructor
 * @augments StatisticsEventPage
 * @param {(string|number)} event_id
 */
function StatisticsEventEditPage(event_id) {
	StatisticsEventPage.apply(this, arguments);
}
StatisticsEventEditPage.extend(StatisticsEventPage);

StatisticsEventEditPage.prototype.render = function() {};


/**
 *
 * @constructor
 * @augments StatisticsEventPage
 * @param {(string|number)} event_id
 */
function StatisticsEventPromotionPage(event_id) {
	StatisticsEventPage.apply(this, arguments);
}
StatisticsEventPromotionPage.extend(StatisticsEventPage);

StatisticsEventPromotionPage.prototype.render = function() {};


$(document)
	.ajaxStart(function() {
		Pace.restart()
	})
	.ajaxError(function(event, jqxhr, settings, thrownError) {
		if (!(thrownError && thrownError == 'abort')) {
			__APP.SERVER.ajaxErrorHandler(event, jqxhr, settings, thrownError);
		}
	})
	.ready(function() {
		
		function initSidebar() {
			var $sidebar = $('#main_sidebar'),
				$sidebar_nav = $sidebar.find('.SidebarNav'),
				$sidebar_nav_items = $sidebar_nav.find('.SidebarNavItem');
			
			$sidebar_nav.addClass('-items_' + $sidebar_nav_items.not('.-hidden').length);
			__APP.SUBSCRIBED_ORGS.update();
			$(window).on('subscribe unsubscribe', function() {
				__APP.SUBSCRIBED_ORGS.update();
			});
			((window.innerHeight > 800) ? $('.SidebarOrganizationsScroll') : $('.SidebarScroll')).scrollbar({
				disableBodyScroll: true
			});
		}
		
		function initTopBar() {
			var $main_header = $('#main_header');
			
			$main_header.find('#search_bar_input').on('keypress', function(e) {
				if (e.which == 13) {
					__APP.changeState('/search/' + encodeURIComponent(this.value));
				}
			});
			
			$main_header.find('#user_bar').on('click.openUserBar', function() {
				var $this = $(this),
					$document = $(document);
				$this.addClass('-open');
				$document.on('click.closeUserBar', function(e) {
					if (!$(e.target).parents('#user_bar').length) {
						$document.off('click.closeUserBar');
						$this.removeClass('-open');
					}
				})
			});
			$main_header.find('.LogoutButton').on('click', __APP.USER.logout);
			$main_header.find('.OpenSettingsButton').on('click', showSettingsModal);
			bindRippleEffect($main_header);
			bindPageLinks($main_header);
		}
		
		if (window['moment'] != undefined) {
			moment.locale(navigator.language);
			moment.tz.setDefault('Europe/Moscow');
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
		
		__APP.SUBSCRIBED_ORGS = $('.SidebarOrganizationsList');
		__APP.SUBSCRIBED_ORGS.update = function() {
			/**
			 * @this jQuery
			 */
			var self = this,
				timing = 0,
				current_menu_items = $.map(self.children(), function(el) {
					return $(el).data('organization_id');
				}),
				to_add = __APP.USER.subscriptions.filter(function(item) {
					return current_menu_items.indexOf(item.id) === -1;
				}),
				to_remove = current_menu_items.filter(function(item) {
					return !(__APP.USER.subscriptions.has(item));
				});
			
			if (to_add.length) {
				__APP.BUILD.organizationItems(to_add, {
					block_classes: ['animated'],
					avatar_classes: ['-size_30x30', '-rounded']
				})
					[(self.length ? 'prependTo' : 'appendTo')](self)
					.each(function(i, org_block) {
						setTimeout(function() {
							$(org_block).addClass('-show');
						}, timing += 100);
					});
				
				bindPageLinks(self);
			}
			if (to_remove.length) {
				to_remove.forEach(function(id) {
					var $organization_item = self.find('.organization_item[data-organization_id="' + id + '"]').removeClass('-show');
					setTimeout(function() {
						$organization_item.remove();
					}, 500);
				});
			}
		};
		
		__APP.USER.fetchUserWithSubscriptions([], undefined, function() {
			initTopBar();
			initSidebar();
			__APP.init();
			bindPageLinks();
		});
		
	});