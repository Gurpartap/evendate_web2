/**
 *
 * @class jqPromise
 */
/**
 * @method
 * @name jqPromise#then
 * @param {(Function|Array<Function>)} doneCallbacks
 * @param {(Function|Array<Function>)} [failCallbacks]
 * @param {(Function|Array<Function>)} [progressCallbacks]
 * @returns {jqPromise}
 */
/**
 * @method
 * @name jqPromise#progress
 * @param {...(Function|Array<Function>)} progressCallbacks
 * @returns {Deferred}
 */
/**
 * @method
 * @name jqPromise#done
 * @param {...(Function|Array<Function>)} doneCallbacks
 * @returns {Deferred}
 */
/**
 * @method
 * @name jqPromise#fail
 * @param {...(Function|Array<Function>)} failCallbacks
 * @returns {Deferred}
 */
/**
 * @method
 * @name jqPromise#always
 * @param {...(Function|Array<Function>)} alwaysCallbacks
 * @returns {Deferred}
 */
/**
 * @method
 * @name jqPromise#promise
 * @param {Object} [target]
 * @returns {jqPromise}
 */
/**
 * @method
 * @name jqPromise#state
 * @returns {__C.DEFERRED_STATES}
 */

/**
 * @const
 * @namespace __APP
 * @property {object} SERVER
 * @property {object} SERVER.AJAX_METHOD
 * @property {CollectionOfXHRs} SERVER.CURRENT_CONNECTIONS
 * @property {string} EVENDATE_BEGIN
 * @property {object} AUTH_URLS
 * @property {string} AUTH_URLS.vk
 * @property {string} AUTH_URLS.google
 * @property {string} AUTH_URLS.facebook
 * @property {AbstractTopBar} TOP_BAR
 * @property {AbstractSidebar} SIDEBAR
 * @property {CurrentUser} USER
 * @property {Page} PREVIOUS_PAGE
 * @property {Page} CURRENT_PAGE
 * @property {object} ROUTING
 * @property {object} MODALS
 * @property {number} MODALS.last_id
 * @property {Object<number, AbstractModal>} MODALS.collection
 * @property {AbstractModal} MODALS.active_modal
 * @property {jQuery} MODALS.modal_destroyer
 * @property {jQuery} MODALS.modal_wrapper
 * @property {object} BUILD
 */
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
		
		CURRENT_CONNECTIONS: new CollectionOfXHRs(),
		/**
		 *
		 * @param {__APP.SERVER.AJAX_METHOD} ajax_method
		 * @param {string} ajax_url
		 * @param {(AJAXData|string)} ajax_data
		 * @param {string} [content_type='application/x-www-form-urlencoded; charset=UTF-8']
		 * @param {AJAXCallback} [success]
		 * @param {function} [error]
		 * @returns {jqPromise}
		 */
		dealAjax: function(ajax_method, ajax_url, ajax_data, content_type, success, error) {
			var self = this,
				jqXHR;
			if(ajax_data.fields instanceof Fields){
				ajax_data.fields = ajax_data.fields.toString();
			}
			jqXHR = $.ajax({
				url: ajax_url,
				data: ajax_data,
				method: ajax_method,
				contentType: content_type || 'application/x-www-form-urlencoded; charset=UTF-8'
			});
			__APP.SERVER.CURRENT_CONNECTIONS.push(jqXHR);
			return jqXHR.fail(error).then(function(response, status_text, jqXHR) {
				__APP.SERVER.ajaxHandler(response, function(data, text) {
					if (success && typeof success == 'function') {
						success.call(self, data);
					}
				}, __APP.SERVER.ajaxErrorHandler);
				return response.data;
			}).promise();
		},
		/**
		 * @param {...(jqXHR|Deferred|jqPromise)} Deferreds
		 * @param {function(..(Array|object))} [cb]
		 * @return {jqPromise}
		 */
		multipleAjax: function multipleAjax(){
			var with_callback = (arguments[arguments.length - 1] instanceof Function),
				promises = with_callback ? Array.prototype.splice.call(arguments, 0, arguments.length - 1) : Array.prototype.slice.call(arguments),
				parallel_promise;
			parallel_promise = $.when.apply($, promises);
			if(with_callback) {
				parallel_promise.done(Array.prototype.shift.call(arguments));
			}
			return parallel_promise.promise();
		},
		/**
		 *
		 * @param {string} ajax_url
		 * @param {AJAXData} ajax_data
		 * @param {AJAXCallback} [success]
		 * @param {function} [error]
		 * @returns {jqPromise}
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
		 * @returns {jqPromise}
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
		 * @returns {jqPromise}
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
		 * @returns {jqPromise}
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
			if(ajax_data.fields){
				if(Array.isArray(ajax_data.fields)){
					if (ajax_data.order_by) {
						ajax_data.order_by = ajax_data.order_by instanceof Array ? ajax_data.order_by : ajax_data.order_by.split(',');
						ajax_data.fields = ajax_data.fields.merge(ajax_data.order_by.map(function(order_by) {
							return order_by.trim().replace('-', '');
						}));
						ajax_data.order_by = ajax_data.order_by.join(',');
					}
					if (ajax_data.fields.length) {
						ajax_data.fields = ajax_data.fields.join(',');
					} else {
						ajax_data.fields = undefined;
					}
				} else if(ajax_data.fields instanceof Fields){
					if (ajax_data.order_by) {
						ajax_data.order_by = ajax_data.order_by instanceof Array ? ajax_data.order_by : ajax_data.order_by.split(',');
						ajax_data.order_by.forEach(function(field) {
							ajax_data.fields[field.trim().replace('-', '')] = {};
						});
						ajax_data.order_by = ajax_data.order_by.join(',');
					}
					if (Object.keys(ajax_data.fields).length === 0) {
						ajax_data.fields = undefined;
					}
					
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
	AUTH_URLS: {},
	TOP_BAR: new AbstractTopBar(),
	SIDEBAR: new AbstractSidebar(),
	USER: new CurrentUser(),
	PREVIOUS_PAGE: new Page(),
	CURRENT_PAGE: new Page(),
	ROUTING: {
		'add': {
			'event': {
				'to': {
					'^([0-9]+)': AddEventPage,
					'': AddEventPage
				},
				'': AddEventPage
			},
			'organization': AddOrganizationPage
		},
		'my': {
			'profile': MyProfilePage,
			'': MyProfilePage
		},
		'event': {
			'add_to': {
				'^([0-9]+)': AddEventPage,
				'': AddEventPage
			},
			'add': AddEventPage,
			'^([0-9]+)': {
				'edit': RedactEventPage,
				'': EventPage
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
		'friends': MyProfilePage,
		'friend': {
			'^([0-9]+)': UserPage,
			'': MyProfilePage
		},
		'user': {
			'me': MyProfilePage,
			'^([0-9]+)': UserPage,
			'': MyProfilePage
		},
		'statistics': {
			'organization': {
				'^([0-9]+)': {
					'overview': StatisticsOrganizationOverviewPage,
					'events': StatisticsOrganizationEventsPage,
					'': StatisticsOrganizationOverviewPage
				}
			},
			'event': {
				'^([0-9]+)': StatisticsEventOverviewPage
			},
			'': StatisticsOverviewPage
		}
	},
	MODALS: {
		last_id: 0,
		collection: {},
		active_modal: undefined,
		modal_destroyer: $.extend({
			adjustHeight: function(height) {
				var html_height = $(window).height(),
					modal_height = height;
				this.height((modal_height > html_height) ? modal_height : html_height);
			}
		}, $('.modal_destroyer')),
		modal_wrapper: $('.modal_wrapper'),
		/**
		 *
		 * @param {AbstractModal} modal
		 */
		pushModal: function(modal) {
			modal.id = ++__APP.MODALS.last_id;
			__APP.MODALS.collection[modal.id] = modal;
			var keys = Object.keys(__APP.MODALS.collection);
			if (keys.length > 5) {
				__APP.MODALS.collection[keys[0]].destroy();
			}
		},
		hideCurrent: function() {
			if (__APP.MODALS.active_modal !== undefined) {
				__APP.MODALS.active_modal.__hide();
				$('body').removeClass('-open_modal');
			}
		},
		bindCallModal: function($parent) {
			$parent = $parent ? $parent : $('body');
			$parent.find('.CallModal').not('.-Handled_CallModal').each(function() {
				var $this = $(this),
					title = $this.data('modal_title'),
					modal,
					modal_id,
					modal_type = $this.data('modal_type');
				
				$this.on('click.CallModal', function() {
					modal_id = $this.data('modal_id');
					if (__APP.MODALS.collection.hasOwnProperty(modal_id)) {
						__APP.MODALS.collection[modal_id].show();
					} else {
						switch (modal_type) {
							case 'favors': {
								modal = new FavoredModal($this.data('modal_event_id'), title);
								break;
							}
							case 'subscribers': {
								modal = new SubscribersModal($this.data('modal_organization_id'), title);
								break;
							}
							case 'editors': {
								modal = new EditorsModal($this.data('modal_organization_id'), title, $this.data('modal_specific_role'));
								break;
							}
							case 'map': {
								modal = new MapModal($this.data('modal_map_location'), title);
								break;
							}
							case 'media': {
								var type = $this.data('modal_media_type'),
									url = $this.data('modal_media_url');
								if (!url) {
									if ($this.is('img')) {
										url = $this.attr('src');
										type = 'image';
									} else if ($this.is('video')) {
										//url = $this.attr('url');
										type = 'video';
									} else {
										var str = $this.css('background-image');
										if (str !== 'none') {
											if (str.indexOf('"') != -1) {
												url = str.slice(str.indexOf('"') + 1, str.indexOf('"', str.indexOf('"') + 1));
											} else {
												url = str.slice(str.indexOf('(') + 1, str.indexOf(')'));
											}
											type = 'image';
										}
									}
								}
								modal = new MediaModal(url, type);
								break;
							}
							case 'cropper': {
								modal = new CropperModal($this.data('source_img'), {
									'aspectRatio': eval($this.data('aspect_ratio'))
								});
								
								modal.modal.one('modal.close', function() {
									
									$this.removeClass('-hidden').off('click.CallModal').on('click.CallModal', function() {
										modal_id = $this.data('modal_id');
										if (__APP.MODALS.collection.hasOwnProperty(modal_id)) {
											if (__APP.MODALS.collection[modal_id].image_src == $this.data('source_img')) {
												__APP.MODALS.collection[modal_id].show();
											} else {
												__APP.MODALS.collection[modal_id].destroy();
												modal = new CropperModal($this.data('source_img'), {
													'aspectRatio': eval($this.data('aspect_ratio'))
												});
												$this.data('modal_id', modal.id);
												modal.initer = $this;
												modal.show();
											}
										} else {
											modal = new CropperModal($this.data('source_img'), {
												'data': $this.data('crop_data'),
												'aspectRatio': eval($this.data('aspect_ratio'))
											});
											$this.data('modal_id', modal.id);
											modal.initer = $this;
											modal.show();
										}
									});
									
								});
								break;
							}
							case 'friends_list': {
								modal = new FriendsListModal($this.data('modal_entity'));
								break;
							}
							case 'subscribers_list': {
								modal = new SubscriptionsListModal($this.data('modal_entity'));
								break;
							}
							default: {
								modal = new StdModal(title, $this.data('modal_content'));
								break;
							}
						}
						$this.data('modal_id', modal.id);
						modal.initer = $this;
						modal.show();
					}
				});
			}).addClass('-Handled_CallModal');
		}
	},
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
		 * @param {..buildProps} props
		 * @returns {jQuery}
		 */
		button: function buildButton(/**props*/) {
			var props = Array.prototype.slice.call(arguments);
			return tmpl('button', props.map(function(arg) {
				return __APP.BUILD.normalizeBuildProps(arg);
			})).each(function(i, button) {
				if(props[i].dataset) {
					$(button).data(props[i].dataset);
				}
			});
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
		 * @param {string|Element|jQuery} message
		 * @param {buildProps} [props]
		 * @return {jQuery}
		 */
		cap: function buildTags(message, props) {
			if(!props)
				props = {};
			props = __APP.BUILD.normalizeBuildProps(props);
			
			return tmpl('cap', $.extend({message: message}, props));
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
		 * @param {jQuery} [$wrapper]
		 * @param {string} [direction]
		 * @return {jQuery}
		 */
		loaderBlock: function buildLoaderBlock($wrapper, direction) {
			return tmpl('loader-block', {loader: tmpl('loader')}, $wrapper, direction);
		},
		/**
		 *
		 * @param {Object<OneUser.ACCOUNTS, string>} [accounts_links]
		 * @returns {jQuery}
		 */
		socialLinks: function buildSocialLinks(accounts_links) {
			var props_array = [],
				ICON_SLUGS = {
					VK: 'vk',
					GOOGLE: 'google-plus',
					FACEBOOK: 'facebook-official'
				};
			$.each(OneUser.ACCOUNTS, function(slug, account) {
				var props = {
					slug: account,
					icon_slug: ICON_SLUGS[slug]
				};
				if(accounts_links.hasOwnProperty(account)){
					props.html_tag = 'a';
					props.attributes = {
						href: accounts_links[account],
						target: '_blank'
					};
				} else {
					props.html_tag = 'span';
				}
				props_array.push(__APP.BUILD.normalizeBuildProps(props))
			});
			return tmpl('user-page-social-link', props_array);
		},
		/**
		 *
		 * @param users
		 * @param {buildProps} [props]
		 * @param {(Array<string>|string)} [props.avatar_classes]
		 * @param {(Array<string>|string)} [props.tombstone_classes]
		 * @param {boolean} [props.is_link]
		 * @returns {jQuery}
		 */
		userTombstones: function buildUserTombstones(users, props) {
			props = __APP.BUILD.normalizeBuildProps(props, ['avatar_classes', 'tombstone_classes']);
			props.avatar_classes.push('-rounded');
			props.avatar_classes.push('-size_'+ (props.size ? props.size : '70x70'));
			if (props.is_link) {
				props.html_tag = 'a';
				props.tombstone_classes.push('link Link');
			} else {
				props.html_tag = 'div';
			}
			
			return tmpl('user-tombstone', (users instanceof Array ? users : [users]).map(function(user) {
				if (props.is_link) {
					props.attributes.href = '/user/' + user.id;
				}
				return $.extend(true, {}, user, {
					avatar: __APP.BUILD.avatars(user, {
						classes: props.avatar_classes
					}),
					name: user.full_name ? user.full_name : [user.first_name, user.last_name].join(' ')
				}, props);
			}));
		},
		/**
		 *
		 * @param {(OneUser|UsersCollection|OneOrganization|OrganizationsCollection|Array)} entities
		 * @param {buildProps} [props]
		 * @param {boolean} [props.is_link]
		 * @param {string} [props.entity]
		 * @param {(Array<string>|string)} [props.avatar_classes]
		 * @param {(Array<string>|string)} [props.block_classes]
		 * @returns {jQuery}
		 */
		avatarBlocks: function buildAvatarBlocks(entities, props) {
			props = __APP.BUILD.normalizeBuildProps(props, ['avatar_classes', 'block_classes']);
			if (props.is_link) {
				props.html_tag = 'a';
				props.block_classes.push('link','Link');
			} else {
				props.html_tag = 'div';
			}
			
			return tmpl('avatar-block', (entities instanceof Array ? entities : [entities]).map(function(entity) {
				var name, href;
				if((props.entity && props.entity === 'organization') || !entity.first_name){
					name = entity.short_name ? entity.short_name : entity.name;
					href = '/organization/' + entity.id;
				} else {
					name = entity.full_name ? entity.full_name : (entity.first_name + ' ' + entity.last_name);
					href = '/user/' + entity.id;
				}
				return $.extend(true, {
					avatar: __APP.BUILD.avatars(entity, {
						classes: props.avatar_classes
					}),
					attributes: {
						href: href
					},
					name: name
				}, props);
			}));
		},
		/**
		 *
		 * @param {(OneUser|UsersCollection|OneOrganization|OrganizationsCollection|Array)} entities
		 * @param {buildProps} [props]
		 * @returns {jQuery|undefined}
		 */
		avatars: function buildAvatars(entities, props) {
			var map = function() {},
				tmp = [],
				output_entities;
			if(!entities || (entities instanceof Array && !entities.length))
				return;
			props = __APP.BUILD.normalizeBuildProps(props);
			function userMap(user) {
				return $.extend(true, {
					avatar_url: user.avatar_url,
					name: user.full_name ? user.full_name : (user.first_name + ' ' + user.last_name)
				}, props);
			}
			function orgMap(org) {
				return $.extend(true, {
					avatar_url: org.img_small_url ? org.img_small_url : org.img_url,
					name: org.short_name ? org.short_name : org.name
				}, props);
			}
			
			switch (true){
				case (entities instanceof OneUser):
				case (entities instanceof UsersCollection): {
					map = userMap;
					break;
				}
				case (entities instanceof OneOrganization):
				case (entities instanceof OrganizationsCollection): {
					map = orgMap;
					break;
				}
				default: {
					if(!(entities instanceof Array)){
						tmp = [entities];
					}
					map = tmp[0].avatar_url ? userMap : orgMap;
					break;
				}
			}
			output_entities = (entities instanceof Array) ? entities : [entities];
			
			return tmpl('avatar', output_entities.map(map));
		},
		/**
		 *
		 * @param {Array} entities
		 * @param {number} max_count
		 * @param {buildProps} [props]
		 * @param {boolean} [props.avatar_is_link]
		 * @param {number} [overall_avatars_count]
		 * @returns {jQuery}
		 */
		avatarCollection: function buildAvatarCollection(entities, max_count, props, overall_avatars_count) {
			var data = __APP.BUILD.normalizeBuildProps(props, ['counter_classes']),
				i, count;
			
			data.dataset.max_amount = max_count;
			data.classes.push('-max_' + max_count);
			
			data.avatars = __APP.BUILD.avatars(__APP.USER);
			for(i = 0, count = 1; count <= max_count; i++){
				if (!entities[i]) break;
				if (entities[i].id != __APP.USER.id) {
					data.avatars = data.avatars.add(__APP.BUILD.avatars(entities[i]));
					count++;
				}
			}
			data.more_avatars_count = (count <= max_count) ? 0 : ( (overall_avatars_count ? overall_avatars_count : entities.length) - max_count );
			if(data.more_avatars_count <= 0){
				data.counter_classes.push('-cast');
			}
			
			return tmpl('avatars-collection', data);
		},
		
		activity: function buildActivity(activities, props){
			var ICON_CLASSES = {};
			
			ICON_CLASSES[OneAbstractActivity.TYPES.SUBSCRIBE] = 'plus';
			ICON_CLASSES[OneAbstractActivity.TYPES.FAVE] = 'star';
			ICON_CLASSES[OneAbstractActivity.TYPES.UNSUBSCRIBE] = ICON_CLASSES[OneAbstractActivity.TYPES.UNFAVE] = 'minus';
			
			props = __APP.BUILD.normalizeBuildProps(props, ['avatar_classes']);
			props.avatar_classes.push('-size_50x50', '-rounded');
			
			return tmpl('activity-block', (activities instanceof Array ? activities : [activities]).map(function(activity) {
				var entity_props = {},
					locales = __LOCALES.ru_RU.TEXTS.ACTIVITY[OneAbstractActivity.TYPES_INDEX[activity.type_code]];
				
				switch (true) {
					case (activity instanceof OneOrganizationActivity): {
						entity_props = {
							entity: 'organization',
							img_url: activity.organization.img_small_url ? activity.organization.img_small_url : activity.organization.img_url,
							entity_url: '/organization/'+activity.organization.id,
							hero_text: activity.organization.short_name
						};
						break;
					}
					case (activity instanceof OneEventActivity): {
						entity_props = {
							entity: 'event',
							img_url: activity.event.image_horizontal_small_url ? activity.event.image_horizontal_small_url : activity.event.image_horizontal_url,
							entity_url: '/event/'+activity.event.id,
							hero_text: activity.event.title
						};
						break;
					}
				}
				return $.extend(entity_props, {
					creator_avatar: __APP.BUILD.avatars(activity.user, {
						classes: props.avatar_classes,
						is_link: props.avatar_is_link,
						badge: tmpl('avatar-badge', {icon_class: ICON_CLASSES[activity.type_code]})
					}),
					type_code: activity.type_code,
					additional_info: getGenderText(activity.user.gender, locales),
					creator_url: '/user/'+activity.user.id,
					creator_name: activity.user.full_name ? activity.user.full_name : (activity.user.first_name + ' ' + activity.user.last_name),
					date: moment.unix(activity.created_at).calendar(null, __LOCALES.ru_RU.DATE.CALENDAR_DATE_TIME)
				})
			}));
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
			return tmpl('organization-item', orgs.map(function(organization) {
				return $.extend(true, {
					avatar_block: __APP.BUILD.avatarBlocks(organization, {
						entity: 'organization',
						avatar_classes: ['-size_30x30']
					})
				}, organization, __APP.BUILD.normalizeBuildProps(additional_fields, ['avatar_classes', 'block_classes', 'counter_classes']));
			}));
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
					avatar: __APP.BUILD.avatars(org, {
						classes: ['organization_unit_avatar','-size_55x55','-bordered','-rounded','-shadowed']
					}),
					subscribe_button: new SubscribeButton(org.id, {
						is_subscribed: org.is_subscribed,
						colors: {
							subscribe: '-color_marginal_accent'
						},
						icons: null,
						classes: ['-size_low', 'RippleEffect']
					}),
					subscribed_text: org.subscribed_count + getUnitsText(org.subscribed_count, __LOCALES.ru_RU.TEXTS.SUBSCRIBERS),
					redact_org_button: (org.role === OneUser.ROLE.UNAUTH || org.role === OneUser.ROLE.USER) ? '' : __APP.BUILD.link({
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
		eventBlocks: function buildEventBlocks(events, type) {
			return tmpl('event-block', events.map(function(event) {
				var sort_date_type = type.sort_date_type ? type.sort_date_type : 'nearest_event_date',
					m_event_date = moment.unix(event[sort_date_type] ? event[sort_date_type] : event['first_event_date']),
					different_day = type.last_date != m_event_date.format(__C.DATE_FORMAT),
					avatars_collection_classes = ['-rounded','-bordered','-size_small','AvatarsCollection','CallModal'];
				
				if(event.is_favorite) {
					avatars_collection_classes.push('-shifted');
				}
				
				type.last_date = m_event_date.format(__C.DATE_FORMAT);
				return $.extend({}, event, {
					divider: different_day ? tmpl('divider', {
						title: m_event_date.calendar().capitalize()
					}) : '',
					add_to_favorite_button: new AddToFavoriteButton(event.id, {
						is_add_avatar: true,
						is_subscribed: event.is_favorite,
						classes: ['-size_low', '-size_wide', '-rounded', 'AddToFavorites', 'RippleEffect']
					}),
					date: m_event_date.format(__C.DATE_FORMAT),
					avatars_collection: __APP.BUILD.avatarCollection(event.favored, 4, {
						dataset: {
							modal_type: 'favors',
							modal_event_id: event.id,
							modal_title: 'Добавили в избранное'
						},
						classes: avatars_collection_classes,
						counter_classes: ['-size_30x30','-bordered','-color_marginal','-castable']
					}, event.favored_users_count),
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
				return {
					divider: append_divider ? tmpl('subscriber-divider', {label: subscriber.is_friend ? 'Друзья' : 'Все подписчики'}) : '',
					avatar_block: __APP.BUILD.avatarBlocks(subscriber, {
						is_link: true,
						entity: 'user',
						avatar_classes: ['-size_40x40', '-rounded', '-bordered', '-shadowed'],
						block_classes: ['subscriber']
					})
				};
			}));
		},
		/**
		 *
		 * @param {(OneEvent|Array<OneEvent>|EventsCollection)} events
		 * @returns {jQuery}
		 */
		eventCards: function buildEventCards(events) {
			var $events;
			events = events instanceof Array ? events : [events];
			$events = tmpl('feed-event', events.map(function(event) {
				var avatars_collection_classes = ['-rounded','-bordered','-size_small','AvatarsCollection','CallModal'],
					feed_event_infos = [],
					organization = new OneOrganization(event.organization_id);
				organization.setData({
					short_name: event.organization_short_name,
					img_url: event.organization_logo_small_url
				});
				
				if (event.is_favorite) {
					avatars_collection_classes.push('-shifted');
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
					organization_avatar_block: __APP.BUILD.avatarBlocks(organization, {
						block_classes: ['-size_small'],
						is_link: true,
						entity: 'organization'
					}),
					add_to_favorite_button: new AddToFavoriteButton(event.id, {
						is_add_avatar: true,
						is_subscribed: event.is_favorite,
						classes: ['-size_low', '-size_wide', '-rounded', 'RippleEffect']
					}),
					avatars_collection: __APP.BUILD.avatarCollection(event.favored, 4, {
						dataset: {
							modal_type: 'favors',
							modal_event_id: event.id,
							modal_title: 'Добавили в избранное'
						},
						classes: avatars_collection_classes,
						counter_classes: ['-size_30x30','-bordered','-color_marginal_primary','-castable']
					}, event.favored_users_count),
					feed_event_infos: tmpl('feed-event-info', feed_event_infos)
				}, event);
			}));
			
			events.forEach(function(event, i) {
				$events.eq(i).appear(function() {
					storeStat(event.id, __C.STATS.EVENT_ENTITY, __C.STATS.EVENT_VIEW);
				}, {accY: 100})
			});
			
			if(__APP.USER.id === -1){
				$events.find('.HideEvent').remove();
			}
			
			return $events;
		},
		/**
		 *
		 * @param {{
		 *    [type]: string,
		 *    [content]: string|jQuery,
		 *    [classes]: Array<string>|string,
		 *    [content_classes]: Array<string>|string,
		 *    [width]: (number|string),
		 *    [height]: (number|string),
		 *    [header]: jQuery,
		 *    [title]: string,
		 *    [footer]: jQuery,
		 *    [footer_buttons]: jQuery
		 *    [dataset]: object
		 *    [attributes]: object
		 * }} props
		 * @return {jQuery}
		 */
		modal: function(props) {
			var $modal, vars;
			props = __APP.BUILD.normalizeBuildProps(props, ['content_classes']);
			vars = {
				modal_type: props.type,
				modal_content: props.content,
				modal_classes: props.classes,
				modal_content_classes: props.content_classes
			};
			if(props.header){
				vars.modal_header = props.header;
			} else if(props.title) {
				vars.modal_header = tmpl('modal-header', {
					title: props.title,
					close_button: __APP.BUILD.button({
						classes: ['-empty','-modal_destroyer','CloseModal','RippleEffect'],
						title: '×'
					})
				});
			} else {
				vars.header = '';
			}
			if(props.footer){
				vars.modal_footer = props.footer;
			} else if(props.footer_buttons) {
				vars.modal_footer = tmpl('modal-footer', {footer_buttons: props.footer_buttons});
			} else {
				vars.modal_footer = '';
			}
			$modal = tmpl('modal', vars);
			if(props.width){
				$modal.width(props.width);
			}
			if(props.height){
				$modal.height(props.height);
			}
			return $modal;
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
		$('title').text(title_str ? title_str : 'Evendate');
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
		__APP.CURRENT_PAGE.fetchData();
		__APP.CURRENT_PAGE.show();
		$sidebar_nav_items.removeClass(__C.CLASSES.NEW_ACTIVE)
			.filter(function() {
				return window.location.pathname.indexOf(this.getAttribute('href')) === 0;
			}).addClass(__C.CLASSES.NEW_ACTIVE);
	},
	reInit: function appReInit() {
		$(window).off('scroll');
		
		__APP.SERVER.CURRENT_CONNECTIONS.abortAll();
		__APP.PREVIOUS_PAGE = __APP.CURRENT_PAGE;
		__APP.PREVIOUS_PAGE.destroy();
		__APP.init();
		
		if (!(__APP.CURRENT_PAGE instanceof SearchPage)) {
			$('#search_bar_input').val('');
		}
	}
};
/**
 *
 * @namespace __C
 * @property CLASSES
 * @property DATE_FORMAT
 * @property COLORS
 * @property STATS
 * @property ACTION_NAMES
 * @property ENTITIES
 */
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
	},
	/**
	 * @enum {string}
	 */
	DEFERRED_STATES: {
		PENDING: 'pending',
		RESOLVED: 'resolved',
		REJECTED: 'rejected'
	}
};

__ERRORS = [];

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
			}
		},
		DATE: {
			DATE_FORMAT: 'DD.MM.YYYY',
			MONTH_SHORT_NAMES: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
			MONTH_NAMES: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
			CALENDAR_DATE_TIME: {
				sameDay: '[Сегодня в] HH:mm',
				lastDay: '[Вчера в] HH:mm',
				nextWeek: 'dddd [в] HH:mm',
				lastWeek: 'D MMMM [в] HH:mm',
				sameElse: 'D MMMM [в] HH:mm'
			}
		}
	}
};
Object.seal(__APP);
Object.freeze(__APP.SERVER);
Object.freeze(__APP.ROUTING);
Object.freeze(__APP.BUILD);
Object.freeze(__C);
Object.freeze(__LOCALES);