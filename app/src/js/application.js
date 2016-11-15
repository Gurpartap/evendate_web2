__APP = {
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
		 * @param {__APP.SERVER.AJAX_METHOD} ajax_method
		 * @param {string} ajax_url
		 * @param {(AJAXData|string)} ajax_data
		 * @param {string} [content_type='application/x-www-form-urlencoded; charset=UTF-8']
		 * @param {AJAXCallback} [success]
		 * @param {function} [error]
		 * @returns {jqXHR}
		 */
		dealAjax: function(ajax_method, ajax_url, ajax_data, content_type, success, error) {
			var self = this;
			return $.ajax({
				url: ajax_url,
				data: ajax_data,
				method: ajax_method,
				contentType: content_type || 'application/x-www-form-urlencoded; charset=UTF-8',
				success: function(res) {
					__APP.SERVER.ajaxHandler(res, function(data, text) {
						if (success && typeof success == 'function') {
							success.call(self, data);
						}
					}, __APP.SERVER.ajaxErrorHandler)
				},
				error: error
			});
		},
		/**
		 *
		 * @param {string} ajax_url
		 * @param {AJAXData} ajax_data
		 * @param {AJAXCallback} [success]
		 * @param {function} [error]
		 * @returns {jqXHR}
		 */
		getData: function getData(ajax_url, ajax_data, success, error) {
			var self = this;
			return __APP.SERVER.dealAjax(__APP.SERVER.AJAX_METHOD.GET, ajax_url, __APP.SERVER.validateData(ajax_data), 'application/json', function(data) {
				if (ajax_data.length != undefined && ajax_data.offset != undefined) {
					ajax_data.offset += ajax_data.length;
				}
				if (success && typeof success == 'function') {
					success.call(self, data);
				}
			}, error);
		},
		/**
		 *
		 * @param {string} ajax_url
		 * @param {AJAXData} ajax_data
		 * @param {AJAXCallback} [success]
		 * @param {function} [error]
		 * @returns {jqXHR}
		 */
		updateData: function updateData(ajax_url, ajax_data, success, error) {
			return __APP.SERVER.dealAjax(__APP.SERVER.AJAX_METHOD.PUT, ajax_url, ajax_data, 'application/json', success, error);
		},
		/**
		 *
		 * @param {string} ajax_url
		 * @param {AJAXData} ajax_data
		 * @param {boolean} is_payload
		 * @param {AJAXCallback} [success]
		 * @param {function} [error]
		 * @returns {jqXHR}
		 */
		addData: function addData(ajax_url, ajax_data, is_payload, success, error) {
			if(is_payload){
				return __APP.SERVER.dealAjax(__APP.SERVER.AJAX_METHOD.POST, ajax_url, ajax_data, 'application/json', success, error);
			}
			return __APP.SERVER.dealAjax(__APP.SERVER.AJAX_METHOD.POST, ajax_url, ajax_data, 'application/x-www-form-urlencoded; charset=UTF-8', success, error);
		},
		/**
		 *
		 * @param {string} ajax_url
		 * @param {AJAXData} ajax_data
		 * @param {AJAXCallback} [success]
		 * @param {function} [error]
		 * @returns {jqXHR}
		 */
		deleteData: function deleteData(ajax_url, ajax_data, success, error) {
			return __APP.SERVER.dealAjax(__APP.SERVER.AJAX_METHOD.DELETE, ajax_url, ajax_data, 'application/json', success, error);
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
	TOP_BAR: new AbstractTopBar(),
	SIDEBAR: new AbstractSidebar(),
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
		radioCheckbox: function buildRadioCheckbox(type, props) {
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
		 * @param {buildProps} props
		 * @returns {jQuery}
		 */
		radio: function buildRadio(props) {
			return __APP.BUILD.radioCheckbox('radio', props);
		},
		/**
		 *
		 * @param {buildProps} props
		 * @returns {jQuery}
		 */
		checkbox: function buildCheckbox(props) {
			return __APP.BUILD.radioCheckbox('checkbox', props);
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
					background_image: org.background_small_img_url || org.background_img_url ? __APP.BUILD.link({
						page: '/organization/'+org.id,
						classes: ['organization_unit_background'],
						attributes: {
							style: 'background-image: url(\''+(org.background_small_img_url || org.background_img_url)+'\')'
						}
					}) : '',
					subscribe_button: new SubscribeButton(org.id, {
						is_subscribed: org.is_subscribed,
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
					add_to_favorite_button: new AddToFavoriteButton(event.id, {
						is_add_avatar: true,
						is_subscribed: event.is_favorite,
						classes: ['-size_low', '-fill', '-rounded', 'AddToFavorites', 'RippleEffect']
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
					feed_event_infos.push({text: 'Цена от ' + (event.min_price ? formatCurrency(event.min_price) : 0) + ' руб.'});
				}
				
				return $.extend(true, {
					add_to_favorite_button: new AddToFavoriteButton(event.id, {
						is_add_avatar: true,
						is_subscribed: event.is_favorite,
						classes: ['-size_low', '-fill', '-rounded', 'RippleEffect']
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

__C = {
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

__LOCALES = {
	ru_RU: {
		TEXTS: {
			BUTTON: {
				REMOVE_FAVORITE: 'Убрать',
				ADD_FAVORITE: 'В избранное',
				FAVORED: 'В избранном',
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
			DATE_FORMAT: 'DD.MM.YYYY',
			MONTH_SHORT_NAMES: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
			MONTH_NAMES: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
		}
	}
};