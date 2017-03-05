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
 * @class ServerConnection
 */
ServerConnection = (function() {
	/**
	 *
	 * @constructor
	 * @constructs ServerConnection
	 */
	function ServerConnection() {
		if (typeof ServerConnection.instance === 'object') {
			return ServerConnection.instance;
		}
		this.current_connections = [];
		ServerConnection.instance = this;
	}
	/**
	 *
	 * @enum {string}
	 */
	ServerConnection.HTTP_METHODS = {
		GET: 'GET',
		POST: 'POST',
		PUT: 'PUT',
		DELETE: 'DELETE'
	};
	Object.freeze(ServerConnection.HTTP_METHODS);
	
	function ajaxHandler(result, success, error) {
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
	}
	
	ServerConnection.ajaxErrorHandler = function(event, jqxhr, settings, thrownError) {
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
	};
	
	/**
	 *
	 * @param {ServerConnection.HTTP_METHODS} http_method
	 * @param {string} url
	 * @param {(AJAXData|string)} ajax_data
	 * @param {string} [content_type='application/x-www-form-urlencoded; charset=UTF-8']
	 * @param {AJAXCallback} [success]
	 * @param {function} [error]
	 * @returns {jqPromise}
	 */
	ServerConnection.prototype.dealAjax = function(http_method, url, ajax_data, content_type, success, error) {
		var self = this,
			jqXHR;
		if(ajax_data.fields instanceof Fields){
			ajax_data.fields = ajax_data.fields.toString();
		}
		jqXHR = $.ajax({
			url: url,
			data: ajax_data,
			method: http_method,
			contentType: content_type || 'application/x-www-form-urlencoded; charset=UTF-8'
		});
		this.current_connections.push(jqXHR);
		return jqXHR.fail(error).then(function(response, status_text, jqXHR) {
			ajaxHandler(response, function(data, text) {
				if (success && typeof success == 'function') {
					success(data);
				}
			}, ServerConnection.ajaxErrorHandler);
			return response.data;
		}).promise();
	};
	
	/**
	 * @param {...(jqXHR|Deferred|jqPromise)} Deferreds
	 * @param {function(..(Array|object))} [cb]
	 * @return {jqPromise}
	 */
	ServerConnection.prototype.multipleAjax = function(){
		var with_callback = (arguments[arguments.length - 1] instanceof Function),
			promises = with_callback ? Array.prototype.splice.call(arguments, 0, arguments.length - 1) : Array.prototype.slice.call(arguments),
			parallel_promise;
		parallel_promise = $.when.apply($, promises);
		if(with_callback) {
			parallel_promise.done(Array.prototype.shift.call(arguments));
		}
		return parallel_promise.promise();
	};
	
	/**
	 *
	 * @param {string} url
	 * @param {AJAXData} ajax_data
	 * @param {AJAXCallback} [success]
	 * @param {function} [error]
	 * @returns {jqPromise}
	 */
	ServerConnection.prototype.getData = function(url, ajax_data, success, error) {
		return this.dealAjax(ServerConnection.HTTP_METHODS.GET, url, this.validateData(ajax_data), 'application/json', function(data) {
			if (ajax_data.length != undefined && ajax_data.offset != undefined) {
				ajax_data.offset += ajax_data.length;
			}
			if (success && typeof success == 'function') {
				success(data);
			}
		}, error);
	};
	/**
	 *
	 * @param {string} url
	 * @param {AJAXData} ajax_data
	 * @param {boolean} [is_payload]
	 * @param {AJAXCallback} [success]
	 * @param {function} [error]
	 * @returns {jqPromise}
	 */
	ServerConnection.prototype.updateData = function(url, ajax_data, is_payload, success, error) {
		if(is_payload){
			return this.dealAjax(ServerConnection.HTTP_METHODS.PUT, url, JSON.stringify(ajax_data), 'application/json', success, error);
		}
		return this.dealAjax(ServerConnection.HTTP_METHODS.PUT, url, ajax_data, 'application/x-www-form-urlencoded; charset=UTF-8', success, error);
	};
	/**
	 *
	 * @param {string} url
	 * @param {AJAXData} ajax_data
	 * @param {boolean} [is_payload]
	 * @param {AJAXCallback} [success]
	 * @param {function} [error]
	 * @returns {jqPromise}
	 */
	ServerConnection.prototype.addData = function(url, ajax_data, is_payload, success, error) {
		if(is_payload){
			return this.dealAjax(ServerConnection.HTTP_METHODS.POST, url, JSON.stringify(ajax_data), 'application/json', success, error);
		}
		return this.dealAjax(ServerConnection.HTTP_METHODS.POST, url, ajax_data, 'application/x-www-form-urlencoded; charset=UTF-8', success, error);
	};
	/**
	 *
	 * @param {string} url
	 * @param {AJAXData} ajax_data
	 * @param {AJAXCallback} [success]
	 * @param {function} [error]
	 * @returns {jqPromise}
	 */
	ServerConnection.prototype.deleteData = function(url, ajax_data, success, error) {
		return this.dealAjax(ServerConnection.HTTP_METHODS.DELETE, url, ajax_data, 'application/json', success, error);
	};
	/**
	 *
	 * @param {AJAXData} ajax_data
	 * @returns {AJAXData}
	 */
	ServerConnection.prototype.validateData = function(ajax_data) {
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
	};
	
	ServerConnection.prototype.abortAllConnections = function() {
		var cur;
		while (this.current_connections.length) {
			cur = this.current_connections.pop();
			if(cur.state() === 'pending'){
				//cur.abort();
			}
		}
	};
	
	
	return ServerConnection;
}());


__APP = {
	SERVER: new ServerConnection(),
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
			'': ActualEventsPage
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
		},
		'': ActualEventsPage
	},
	MODALS: new Modals(),
	BUILD: {
		/**
		 * @typedef {(Array<string>|Object<string, *>)} HTMLDataset
		 */
		/**
		 * @typedef {(Array<string>|Object<string, (string|number)>)} HTMLAttributes
		 */
		/**
		 * @typedef {object} buildProps
		 * @property {(Array<string>|string)} [classes]
		 * @property {HTMLDataset} [dataset]
		 * @property {HTMLAttributes} [attributes]
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
		 * @param {HTMLAttributes} [attributes]
		 * @param {(Array<string>|string)} [classes]
		 * @param {HTMLDataset} [dataset]
		 * @returns {jQuery}
		 */
		input: function buildInput(attributes, classes, dataset) {
			return tmpl('input', __APP.BUILD.normalizeBuildProps({
				classes: classes,
				attributes: attributes,
				dataset: dataset
			})).each(function(i, input) {
				if(dataset) {
					$(input).data(dataset);
				}
			});
		},
		/**
		 *
		 * @param {HTMLAttributes} [attributes]
		 * @param {(Array<string>|string)} [classes]
		 * @param {string} [value]
		 * @param {HTMLDataset} [dataset]
		 * @returns {jQuery}
		 */
		textarea: function buildTextarea(attributes, classes, value, dataset) {
			return tmpl('textarea', __APP.BUILD.normalizeBuildProps({
				value: value,
				classes: classes,
				attributes: attributes,
				dataset: dataset
			})).each(function(i, input) {
				if(dataset) {
					$(input).data(dataset);
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
		 * @param {...buildProps} props
		 * @returns {jQuery}
		 */
		radio: function buildRadio(props) {
			return $.makeSet([].map.call(arguments, function(arg) {
				return __APP.BUILD.radioCheckbox('radio', arg)
			}));
		},
		/**
		 *
		 * @param {...buildProps} props
		 * @returns {jQuery}
		 */
		checkbox: function buildCheckbox(props) {
			return $.makeSet([].map.call(arguments, function(arg) {
				return __APP.BUILD.radioCheckbox('checkbox', arg)
			}));
		},
		/**
		 *
		 * @param {(string|Element|jQuery)} text
		 * @param {HTMLDataset} [dataset]
		 * @param {HTMLAttributes} [attributes]
		 * @returns {jQuery}
		 */
		formHelpText: function buildFormHelpText(text, dataset, attributes) {
			return tmpl('form-helptext', __APP.BUILD.normalizeBuildProps({
				text: text,
				dataset: dataset,
				attributes: attributes
			}));
		},
		/**
		 *
		 * @param {...buildProps} props
		 * @param {(string|number)} props.id
		 * @param {(jQuery|string)} props.label
		 * @param {string} [props.type=text]
		 * @param {string} [props.name]
		 * @param {string} [props.value]
		 * @param {number} [props.tabindex]
		 * @param {boolean} [props.required]
		 * @param {string} [props.placeholder]
		 *
		 * @param {(string|jQuery)} [props.helptext]
		 * @param {HTMLDataset} [props.helptext_dataset]
		 * @param {HTMLAttributes} [props.helptext_attributes]
		 * @param {(Array<string>|string)} [props.unit_classes]
		 * @param {(Array<string>|string)} [props.label_classes]
		 * @returns {jQuery}
		 */
		formInput: function buildFormInput(props) {
			var INPUT_TYPES = [
				'hidden',
				'text',
				'search',
				'tel',
				'url',
				'email',
				'password',
				'date',
				'time',
				'number',
				'range',
				'color',
				'checkbox',
				'radio',
				'file',
				'submit',
				'image',
				'reset',
				'button'
			];
			return $.makeSet(Array.prototype.map.call(arguments, function(props) {
				switch (props.type) {
					case 'radio': return __APP.BUILD.radio(props);
					case 'checkbox': return __APP.BUILD.checkbox(props);
					default: return tmpl('form-unit', __APP.BUILD.normalizeBuildProps($.extend(true, {}, props, {
						form_element: props.type === 'textarea' ?
							__APP.BUILD.textarea($.extend({}, props.attributes, {
								id: props.id,
								name: props.name || undefined,
								required: props.required || undefined,
								placeholder: props.placeholder,
								tabindex: props.tabindex
							}), (props.classes ? ['form_textarea'].concat(props.classes) : ['form_textarea']), props.value, props.dataset) :
							__APP.BUILD.input($.extend({}, props.attributes, {
								id: props.id,
								type: !props.type || INPUT_TYPES.indexOf(props.type) === -1 ? 'text' : props.type,
								name: props.name || undefined,
								value: props.value || undefined,
								required: props.required || undefined,
								placeholder: props.placeholder,
								tabindex: props.tabindex
							}), (props.classes ? ['form_input'].concat(props.classes) : ['form_input']), props.dataset),
						helptext: __APP.BUILD.formHelpText(props.helptext, props.helptext_dataset, props.helptext_attributes)
					}), ['unit_classes', 'label_classes']));
				}
			}));
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
				if((props.entity && props.entity === __C.ENTITIES.ORGANIZATION) || !entity.first_name){
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
				org.counter_classes = org.new_events_count ? [] : [__C.CLASSES.HIDDEN];
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
							style: 'background-image: url("'+(org.background_small_img_url || org.background_img_url)+'")'
						}
					}) : '',
					avatar: __APP.BUILD.avatars(org, {
						classes: [
							'organization_unit_avatar',
							__C.CLASSES.SIZES.X55,
							__C.CLASSES.UNIVERSAL_STATES.BORDERED,
							__C.CLASSES.UNIVERSAL_STATES.ROUNDED,
							__C.CLASSES.UNIVERSAL_STATES.SHADOWED
						]
					}),
					subscribe_button: new SubscribeButton(org.id, {
						is_checked: org.is_subscribed,
						colors: {
							unchecked: __C.CLASSES.COLORS.MARGINAL_ACCENT,
							unchecked_hover: __C.CLASSES.COLORS.MARGINAL_ACCENT
						},
						has_icons: false,
						classes: [__C.CLASSES.SIZES.LOW, __C.CLASSES.HOOKS.RIPPLE]
					}),
					subscribed_text: org.subscribed_count + getUnitsText(org.subscribed_count, __LOCALES.ru_RU.TEXTS.SUBSCRIBERS),
					redact_org_button: (org.role === OneUser.ROLE.UNAUTH || org.role === OneUser.ROLE.USER) ? '' : __APP.BUILD.link({
						classes: [
							'button',
							__C.CLASSES.SIZES.LOW,
							__C.CLASSES.COLORS.MARGINAL_PRIMARY,
							__C.CLASSES.ICON_CLASS,
							__C.CLASSES.ICONS.PENCIL,
							__C.CLASSES.UNIVERSAL_STATES.EMPTY,
							__C.CLASSES.HOOKS.RIPPLE
						],
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
					avatars_collection_classes = [
						__C.CLASSES.UNIVERSAL_STATES.ROUNDED,
						__C.CLASSES.UNIVERSAL_STATES.BORDERED,
						__C.CLASSES.SIZES.SMALL,
						__C.CLASSES.HOOKS.ADD_AVATAR.COLLECTION,
						__C.CLASSES.HOOKS.CALL_MODAL
					],
					$action_buttons = $();
				
				if(event.is_favorite) {
					avatars_collection_classes.push(__C.CLASSES.HOOKS.ADD_AVATAR.STATES.SHIFTED);
				}
				
				if (event.is_favorite != null) {
					if (event.registration_locally || event.ticketing_locally) {
						$action_buttons = $action_buttons.add(new AddToFavoriteButton(event.id, {
							is_add_avatar: true,
							is_checked: event.is_favorite,
							classes: [
								__C.CLASSES.UNIVERSAL_STATES.EMPTY,
								__C.CLASSES.SIZES.LOW,
								__C.CLASSES.UNIVERSAL_STATES.ROUNDED,
								__C.CLASSES.HOOKS.ADD_TO_FAVORITES,
								__C.CLASSES.HOOKS.RIPPLE
							],
							labels: null
						}));
						
						if (event.ticketing_locally) {
							
						} else {
							$action_buttons = $action_buttons.add(new RegisterButton(event, {
								classes: [
									'event_block_main_action_button',
									__C.CLASSES.SIZES.LOW,
									__C.CLASSES.UNIVERSAL_STATES.ROUNDED,
									__C.CLASSES.HOOKS.ADD_TO_FAVORITES,
									__C.CLASSES.HOOKS.RIPPLE
								]
							}));
						}
					} else {
						$action_buttons = new AddToFavoriteButton(event.id, {
							is_add_avatar: true,
							is_checked: event.is_favorite,
							classes: [
								'event_block_main_action_button',
								__C.CLASSES.SIZES.LOW,
								__C.CLASSES.UNIVERSAL_STATES.ROUNDED,
								__C.CLASSES.HOOKS.ADD_TO_FAVORITES,
								__C.CLASSES.HOOKS.RIPPLE
							]
						});
					}
				}
				
				type.last_date = m_event_date.format(__C.DATE_FORMAT);
				
				return $.extend({}, event, {
					divider: different_day ? tmpl('divider', {
						title: m_event_date.calendar().capitalize()
					}) : '',
					action_buttons: $action_buttons,
					date: m_event_date.format(__C.DATE_FORMAT),
					avatars_collection: __APP.BUILD.avatarCollection(event.favored, 4, {
						dataset: {
							modal_type: 'favors',
							modal_event_id: event.id
						},
						classes: avatars_collection_classes,
						counter_classes: [__C.CLASSES.SIZES.X30, __C.CLASSES.UNIVERSAL_STATES.BORDERED, __C.CLASSES.COLORS.MARGINAL, __C.CLASSES.HOOKS.ADD_AVATAR.STATES.CASTABLE]
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
						aside_classes = new_events_count ? ['counter'] : ['counter', __C.CLASSES.HIDDEN];
					} else {
						aside_classes = ['fa_icon', 'fa-angle-down', '-empty'];
					}
				} else {
					new_events_count = '';
					aside_classes = [__C.CLASSES.HIDDEN];
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
				var avatars_collection_classes = [
						__C.CLASSES.UNIVERSAL_STATES.ROUNDED,
						__C.CLASSES.UNIVERSAL_STATES.BORDERED,
						__C.CLASSES.SIZES.SMALL,
						__C.CLASSES.HOOKS.ADD_AVATAR.COLLECTION,
						__C.CLASSES.HOOKS.CALL_MODAL
					],
					feed_event_infos = [],
					organization = new OneOrganization(event.organization_id),
					$action_button,
					$header_buttons = $();
				
				organization.setData({
					short_name: event.organization_short_name,
					img_url: event.organization_logo_small_url
				});
				
				
				if (event.registration_locally || event.ticketing_locally) {
					$header_buttons = new AddToFavoriteButton(event.id, {
						is_add_avatar: true,
						is_checked: event.is_favorite,
						classes: [
							'feed_event_header_button',
							__C.CLASSES.SIZES.LOW,
							__C.CLASSES.UNIVERSAL_STATES.EMPTY
						],
						labels: null,
						icons: {
							checked_hover: __C.CLASSES.ICONS.STAR
						},
						colors: {
							checked: __C.CLASSES.TEXT_COLORS.ACCENT,
							unchecked: '',
							checked_hover: __C.CLASSES.TEXT_COLORS.ACCENT,
							unchecked_hover: ''
						}
					});
					
					if (event.ticketing_locally) {
						
					} else {
						$action_button = new RegisterButton(event, {
							classes: [
								__C.CLASSES.SIZES.LOW,
								__C.CLASSES.SIZES.WIDE,
								__C.CLASSES.UNIVERSAL_STATES.ROUNDED,
								__C.CLASSES.HOOKS.RIPPLE
							]
						});
					}
				} else {
					$action_button = new AddToFavoriteButton(event.id, {
						is_add_avatar: true,
						is_checked: event.is_favorite,
						classes: [
							__C.CLASSES.SIZES.LOW,
							__C.CLASSES.SIZES.WIDE,
							__C.CLASSES.UNIVERSAL_STATES.ROUNDED,
							__C.CLASSES.HOOKS.RIPPLE
						]
					})
				}
				
				$header_buttons = $header_buttons.add(__APP.BUILD.button({
					classes: [
						'feed_event_header_button',
						__C.CLASSES.SIZES.LOW,
						__C.CLASSES.ICON_CLASS,
						__C.CLASSES.ICONS.TIMES,
						__C.CLASSES.UNIVERSAL_STATES.EMPTY,
						'HideEvent'
					],
					dataset: {
						'event-id': event.id
					}
				}));
				
				if (event.is_favorite) {
					avatars_collection_classes.push(__C.CLASSES.HOOKS.ADD_AVATAR.STATES.SHIFTED);
				}
				feed_event_infos.push({
					text: displayDateRange(event.dates[0].event_date, event.dates[event.dates.length - 1].event_date)
					+ (event.is_same_time ? ', ' + displayTimeRange(event.dates[0].start_time, event.dates[0].end_time) : '')
				});
				if (event.registration_required && event.registration_till) {
					feed_event_infos.push({text: 'Регистрация до ' + moment.unix(event.registration_till).calendar().capitalize()});
				}
				if (event.is_free) {
					feed_event_infos.push({text: 'Бесплатно'});
				} else {
					feed_event_infos.push({text: 'Цена от ' + (event.min_price ? formatCurrency(event.min_price) : 0) + ' руб.'});
				}
				
				return $.extend(true, {
					organization_avatar_block: __APP.BUILD.avatarBlocks(organization, {
						block_classes: [__C.CLASSES.SIZES.SMALL],
						is_link: true,
						entity: 'organization'
					}),
					action_button: $action_button,
					avatars_collection: __APP.BUILD.avatarCollection(event.favored, 4, {
						dataset: {
							modal_type: 'favors',
							modal_event_id: event.id
						},
						classes: avatars_collection_classes,
						counter_classes: [
							__C.CLASSES.SIZES.X30,
							__C.CLASSES.UNIVERSAL_STATES.BORDERED,
							__C.CLASSES.COLORS.MARGINAL_PRIMARY,
							__C.CLASSES.HOOKS.ADD_AVATAR.STATES.CASTABLE
						]
					}, event.favored_users_count),
					feed_event_infos: tmpl('feed-event-info', feed_event_infos),
					header_buttons: $header_buttons
				}, event);
			}));
			
			events.forEach(function(event, i) {
				$events.eq(i).appear(function() {
					storeStat(event.id, __C.STATS.EVENT_ENTITY, __C.STATS.EVENT_VIEW);
				}, {accY: 100})
			});
			
			if(__APP.USER.isLoggedOut()){
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
			var $modal,
				normalized_props = __APP.BUILD.normalizeBuildProps(props, ['content_classes']),
				vars = {
					modal_header: '',
					modal_type: normalized_props.type,
					modal_content: normalized_props.content,
					modal_classes: normalized_props.classes,
					modal_content_classes: normalized_props.content_classes,
					modal_footer: ''
				};
			
			if(normalized_props.header){
				vars.modal_header = normalized_props.header;
			} else if(normalized_props.title) {
				vars.modal_header = tmpl('modal-header', {
					title: normalized_props.title,
					close_button: __APP.BUILD.button({
						classes: ['-empty','-modal_destroyer','CloseModal','RippleEffect'],
						title: '×'
					})
				});
			}
			
			if(normalized_props.footer){
				vars.modal_footer = normalized_props.footer;
			} else if(normalized_props.footer_buttons) {
				vars.modal_footer = tmpl('modal-footer', {footer_buttons: normalized_props.footer_buttons});
			}
			
			$modal = tmpl('modal', vars);
			if(normalized_props.width){
				$modal.width(normalized_props.width);
			}
			if(normalized_props.height){
				$modal.height(normalized_props.height);
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
				tab.classes.push(__C.CLASSES.ACTIVE);
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
		$sidebar_nav_items.removeClass(__C.CLASSES.ACTIVE)
			.filter(function() {
				return window.location.pathname.indexOf(this.getAttribute('href')) === 0;
			}).addClass(__C.CLASSES.ACTIVE);
	},
	reInit: function appReInit() {
		$(window).off('scroll');
		
		__APP.SERVER.abortAllConnections();
		__APP.PREVIOUS_PAGE = __APP.CURRENT_PAGE;
		__APP.PREVIOUS_PAGE.destroy();
		__APP.init();
		
		if (!(__APP.CURRENT_PAGE instanceof SearchPage)) {
			$('#search_bar_input').val('');
		}
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