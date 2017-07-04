/**
 * @singleton
 * @class Builder
 */
Builder = (function() {
	/**
	 *
	 * @constructor
	 * @constructs Builder
	 */
	function Builder() {
		if (typeof Builder.instance === 'object')
			return Builder.instance;
		
		Builder.instance = this;
	}
	
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
	 *
	 * @returns {buildProps}
	 */
	Builder.normalizeBuildProps = function normalizeBuildProps(props, classes, datasets, attributes) {
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
	};
	
	/**
	 *
	 * @param {...buildProps} props
	 *
	 * @returns {jQuery}
	 */
	Builder.prototype.button = function buildButton(/**props*/) {
		var props = Array.prototype.slice.call(arguments);
		
		return tmpl('button', props.map(function(arg) {
			
			return Builder.normalizeBuildProps(arg);
		})).each(function(i, button) {
			var prop = props[i],
				$button = $(button);
			
			if (prop.dataset) {
				$button.data(prop.dataset);
			}
			
			if (prop.classes && prop.classes.contains(__C.CLASSES.HOOKS.RIPPLE)) {
				bindRippleEffect($button);
				$button.addClass(__C.CLASSES.HOOKS.HANDLED + __C.CLASSES.HOOKS.RIPPLE);
			}
		});
	};
	/**
	 *
	 * @param {HTMLAttributes} [attributes]
	 * @param {(Array<string>|string)} [classes]
	 * @param {HTMLDataset} [dataset]
	 *
	 * @returns {jQuery}
	 */
	Builder.prototype.input = function buildInput(attributes, classes, dataset) {
		
		return tmpl('input', Builder.normalizeBuildProps({
			classes: classes,
			attributes: attributes,
			dataset: dataset
		})).each(function(i, input) {
			if(dataset) {
				$(input).data(dataset);
			}
		});
	};
	/**
	 *
	 * @param {HTMLAttributes} [attributes]
	 * @param {(Array<string>|string)} [classes]
	 * @param {HTMLDataset} [dataset]
	 * @param {object} [inputmask_options]
	 *
	 * @returns {jQuery}
	 */
	Builder.prototype.inputNumber = function buildInput(attributes, classes, dataset, inputmask_options) {
		attributes = attributes ? attributes : {};
		classes = classes ? classes instanceof Array ? classes : classes.split(',') : [];
		dataset = dataset ? dataset : {};
		
		return this.input(
			attributes,
			classes.concat('form_input'),
			dataset
		).inputmask($.extend({
			alias: 'numeric',
			autoGroup: false,
			digits: 2,
			digitsOptional: true,
			allowPlus: false,
			allowMinus: false,
			rightAlign: false
		}, inputmask_options));
	};
	/**
	 *
	 * @param {Array<buildProps>} values
	 * @param {HTMLAttributes} [attributes]
	 * @param {(Array<string>|string)} [classes]
	 * @param {HTMLDataset} [dataset]
	 * @param {(string|number)} [default_value]
	 *
	 * @returns {jQuery}
	 */
	Builder.prototype.select = function buildSelect(values, attributes, classes, dataset, default_value) {
		var $select;
		
		values.unshift({id: '-1'});
		
		$select =  tmpl('select', Builder.normalizeBuildProps({
			options: __APP.BUILD.option(values),
			classes: classes,
			attributes: attributes,
			dataset: dataset
		}));
		
		if (dataset) {
			$select.data(dataset);
		}
		$select.val(default_value ? default_value : '-1');
		
		return $select;
	};
	/**
	 *
	 * @param {string} name
	 * @param {string} label
	 * @param {string} value - YYYY-MM-DD
	 * @param {HTMLAttributes} [attributes]
	 * @param {(Array<string>|string)} [classes]
	 * @param {HTMLDataset} [dataset]
	 *
	 * @return {jQuery}
	 */
	Builder.prototype.dateSelect = function(name, label, value, attributes, classes, dataset) {
		var $date_select = tmpl('date-select', Builder.normalizeBuildProps({
			name: name,
			label: label,
			value: value,
			attributes: attributes || {},
			classes: classes || [],
			dataset: dataset || {}
		}));
		
		(new DatePicker($date_select, dataset || {})).init();
		$date_select.addClass('-Handled_DatePicker');
		
		return $date_select;
	};
	/**
	 *
	 * @param {HTMLAttributes} [attributes]
	 * @param {(Array<string>|string)} [classes]
	 * @param {string} [value]
	 * @param {HTMLDataset} [dataset]
	 *
	 * @returns {jQuery}
	 */
	Builder.prototype.textarea = function buildTextarea(attributes, classes, value, dataset) {
		return tmpl('textarea', Builder.normalizeBuildProps({
			value: value,
			classes: classes,
			attributes: attributes,
			dataset: dataset
		})).each(function(i, input) {
			if(dataset) {
				$(input).data(dataset);
			}
		});
	};
	/**
	 *
	 * @param {...buildProps} props
	 * @param {string} props.page
	 *
	 * @returns {jQuery}
	 */
	Builder.prototype.link = function buildLink(props) {
		return bindPageLinks(tmpl('link', [].map.call(arguments, function(arg) {
			return Builder.normalizeBuildProps(arg);
		})));
	};
	/**
	 *
	 * @param {string} href
	 * @param {string} title
	 * @param {(string|Array<string>)} [classes]
	 * @param {(string|Object<string, string>|Array<string>)} [dataset]
	 * @param {(string|Object<string, string>|Array<string>)} [attributes]
	 *
	 * @returns {jQuery}
	 */
	Builder.prototype.actionLink = function buildActionLink(href, title, classes, dataset, attributes) {
		
		return tmpl('action-link', Builder.normalizeBuildProps({
			href: href,
			title: title,
			classes: classes,
			dataset: dataset,
			attributes: attributes
		}));
	};
	/**
	 *
	 * @param {...buildProps} props
	 * @param {string} props.title
	 *
	 * @returns {jQuery}
	 */
	Builder.prototype.actionButton = function buildActionButton(props) {
		var _props = props instanceof Array ? props : [].slice.call(arguments);
		
		return tmpl('action-button', _props.map(function(prop) {
			
			return Builder.normalizeBuildProps(prop);
		})).each(function(i) {
			$(this).data(_props[i].dataset);
		});
	};
	/**
	 *
	 * @param {(...buildProps|Array<buildProps>)} props
	 * @return {jQuery}
	 */
	Builder.prototype.option = function buildOption(props) {
		var args = props instanceof Array ? props : arguments;
		
		return tmpl('option', [].map.call(args, function(arg) {
			
			return Builder.normalizeBuildProps(arg);
		})).each(function(i, option) {
			if (args[i].dataset) {
				$(option).data(args[i].dataset);
			}
		});
	};
	/**
	 *
	 * @param {string} type - checkbox or radio
	 * @param {buildProps} props
	 * @param {(Array<string>|string)} [props.unit_classes]
	 * @returns {jQuery}
	 */
	Builder.prototype.radioCheckbox = function buildRadioCheckbox(type, props) {
		if (type == 'checkbox' || type == 'radio') {
			props = Builder.normalizeBuildProps(props, ['unit_classes']);
			if (props.classes.indexOf('form_checkbox') == -1 && props.classes.indexOf('form_radio') == -1) {
				props.classes.unshift('form_' + type);
			}
			props.unit_classes.unshift('form_unit');
			if(!props.attributes.checked) {
				delete props.attributes.checked;
			}
			props.attributes.tabindex = props.attributes.tabindex ? props.attributes.tabindex : -1;
			
			return tmpl('radio-checkbox', $.extend(props, {type: type}));
		} else {
			throw Error('Принимаемый аргумент type может быть либо "radio" либо "checkbox", придурок')
		}
	};
	/**
	 *
	 * @param {...buildProps} props
	 * @returns {jQuery}
	 */
	Builder.prototype.radio = function buildRadio(props) {
		var self = this;
		
		return $.makeSet([].map.call(arguments, function(arg) {
			return self.radioCheckbox('radio', arg)
		}));
	};
	/**
	 *
	 * @param {(Array<buildProps>|...buildProps)} props
	 * @returns {jQuery}
	 */
	Builder.prototype.checkbox = function buildCheckbox(props) {
		var self = this,
			_props = props instanceof Array ? props : arguments;
		
		return $.makeSet([].map.call(_props, function(arg) {
			return self.radioCheckbox('checkbox', arg);
		}));
	};
	/**
	 *
	 * @param {buildProps} props
	 * @param {string} props.name
	 * @param {(jQuery|buildProps)} props.units
	 * @return {jQuery}
	 */
	Builder.prototype.radioGroup = function(props) {
		var self = this,
			build_props = $.extend({}, Builder.normalizeBuildProps(props)),
			$radio_group;
		
		if (!(build_props.units instanceof jQuery)) {
			build_props.units = self.radio.apply(self, build_props.units.map(function(unit) {
				var item = $.extend(unit, {
					name: build_props.name
				});
				if (!item.id) {
					item.id = guid();
				}
				
				return item;
			}));
		}
		
		$radio_group = tmpl('radio-group', build_props);
		$radio_group.data(props.dataset);
		
		return $radio_group;
	};
	/**
	 *
	 * @param {(string|Element|jQuery)} text
	 * @param {HTMLDataset} [dataset]
	 * @param {HTMLAttributes} [attributes]
	 * @returns {jQuery}
	 */
	Builder.prototype.formHelpText = function buildFormHelpText(text, dataset, attributes) {
		return tmpl('form-helptext', Builder.normalizeBuildProps({
			text: text,
			dataset: dataset,
			attributes: attributes
		}));
	};
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
	 * @param {string} [props.label]
	 * @param {(string|jQuery)} [props.helptext]
	 * @param {HTMLDataset} [props.helptext_dataset]
	 * @param {HTMLAttributes} [props.helptext_attributes]
	 * @param {(Array<string>|string)} [props.unit_classes]
	 * @param {(Array<string>|string)} [props.label_classes]
	 * @returns {jQuery}
	 */
	Builder.prototype.formUnit = function buildFormUnit(props) {
		var self = this,
			INPUT_TYPES = [
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
				case 'radio':
					return self.radio(props);
				case 'checkbox':
					return self.checkbox(props);
				default:
					return tmpl('form-unit', Builder.normalizeBuildProps({
						unit_classes: props.unit_classes || [],
						label: props.label ? tmpl('label', Builder.normalizeBuildProps({
							id: props.id,
							label: props.label,
							label_classes: props.label_classes
						}, ['label_classes'])) : '',
						helptext: props.helptext ? self.formHelpText(props.helptext, props.helptext_dataset, props.helptext_attributes) : '',
						form_element: (function(props) {
							var classes = props.classes ? props.classes instanceof Array ? props.classes : props.classes.split(',') : [],
								defined_attributes = {
									id: props.id,
									name: props.name,
									required: props.required ? props.required : undefined,
									placeholder: props.placeholder,
									tabindex: props.tabindex
								};
							
							switch (props.type) {
								case 'date': {
									
									return self.dateSelect(
										props.name,
										(props.value ? moment(props.value).format(__LOCALE.DATE.DATE_FORMAT) : 'Дата'),
										props.value,
										$.extend({}, props.attributes, {
											required: props.required ? props.required : undefined
										}),
										classes,
										props.dataset
									);
								}
								case 'textarea': {
									
									return self.textarea(
										$.extend({}, props.attributes, defined_attributes),
										classes.concat('form_textarea'),
										props.value,
										props.dataset
									);
								}
								case 'time': {
									
									return self.input(
										$.extend({}, props.attributes, defined_attributes, {
											value: (props.value != null) ? props.value : undefined, placeholder: '23:59'
										}),
										classes.concat('form_input', '-time_input'),
										props.dataset
									).inputmask('hh:mm', {
										insertMode: false,
										clearIncomplete: true,
										placeholder: '  :  ',
										greedy: false,
										showMaskOnHover: false
									});
								}
								case 'number': {
									
									return self.inputNumber(
										$.extend({}, props.attributes, defined_attributes, {
											autocomplete: 'off', value: (props.value != null) ? props.value : undefined
										}),
										classes,
										props.dataset
									);
								}
								default: {
									
									return self.input(
										$.extend({}, props.attributes, defined_attributes, {
											type: !props.type || INPUT_TYPES.indexOf(props.type) === -1 ? 'text' : props.type,
											value: (props.value != null) ? props.value : undefined
										}),
										classes.concat('form_input'),
										props.dataset
									);
								}
							}
						})(props)
					}, ['unit_classes']));
			}
		}));
	};
	/**
	 *
	 * @param {string|Element|jQuery} message
	 * @param {buildProps} [props]
	 * @return {jQuery}
	 */
	Builder.prototype.cap = function buildTags(message, props) {
		if(!props)
			props = {};
		props = Builder.normalizeBuildProps(props);
		
		return tmpl('cap', $.extend({message: message}, props));
	};
	/**
	 *
	 * @param {(OneTag|Array<OneTag>|TagsCollection)} tags
	 * @param {buildProps} [props]
	 * @returns {jQuery}
	 */
	Builder.prototype.tags = function buildTags(tags, props) {
		props = Builder.normalizeBuildProps(props);
		
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
	};
	/**
	 *
	 * @param {OneOrder.EXTENDED_ORDER_STATUSES} order_status
	 *
	 * @return {jQuery}
	 */
	Builder.prototype.orderStatusBlock = function(order_status) {
		
		return tmpl('order-status', {
			name: localeFromNamespace(order_status, OneOrder.EXTENDED_ORDER_STATUSES, __LOCALE.TEXTS.TICKET_STATUSES),
			status: (function(order_status){
				switch (order_status) {
					case OneOrder.EXTENDED_ORDER_STATUSES.PAYED:
					case OneOrder.EXTENDED_ORDER_STATUSES.APPROVED:
					case OneOrder.EXTENDED_ORDER_STATUSES.WITHOUT_PAYMENT: {
						return 'success';
					}
					
					case OneOrder.EXTENDED_ORDER_STATUSES.IS_PENDING:
					case OneOrder.EXTENDED_ORDER_STATUSES.WAITING_FOR_PAYMENT: {
						return 'warning';
					}
					
					case OneOrder.EXTENDED_ORDER_STATUSES.REJECTED:
					case OneOrder.EXTENDED_ORDER_STATUSES.RETURNED_BY_CLIENT:
					case OneOrder.EXTENDED_ORDER_STATUSES.PAYMENT_CANCELED_AUTO:
					case OneOrder.EXTENDED_ORDER_STATUSES.RETURNED_BY_ORGANIZATION:
					case OneOrder.EXTENDED_ORDER_STATUSES.PAYMENT_CANCELED_BY_CLIENT: {
						return 'error';
					}
				}
			}(order_status))
		});
	};
	/**
	 *
	 * @param {jQuery} [$wrapper]
	 * @param {string} [direction]
	 * @return {jQuery}
	 */
	Builder.prototype.loaderBlock = function buildLoaderBlock($wrapper, direction) {
		return tmpl('loader-block', {loader: tmpl('loader')}, $wrapper, direction);
	};
	/**
	 *
	 * @param {jQuery} [$wrapper]
	 * @param {string} [direction]
	 * @return {jQuery}
	 */
	Builder.prototype.overlayLoader = function buildLoaderBlock($wrapper, direction) {
		return tmpl('loader-block', {
			classes: '-loader_overlay',
			loader: tmpl('loader')
		}, $wrapper, direction);
	};
	/**
	 *
	 * @param {Object<OneUser.ACCOUNTS, string>} [accounts_links]
	 * @param {buildProps} [props]
	 * @returns {jQuery}
	 */
	Builder.prototype.socialLinks = function buildSocialLinks(accounts_links, props) {
		var props_array = [],
			ICON_SLUGS = {
				VK: 'vk',
				GOOGLE: 'google-plus',
				FACEBOOK: 'facebook-official'
			};
		
		$.each(OneUser.ACCOUNTS, function(slug, account) {
			var acc_props = {
				slug: account,
				icon_slug: ICON_SLUGS[slug]
			};
			
			if(accounts_links.hasOwnProperty(account)){
				acc_props.html_tag = 'a';
				acc_props.attributes = {
					href: accounts_links[account],
					target: '_blank'
				};
			} else {
				acc_props.html_tag = 'span';
			}
			
			props_array.push(Builder.normalizeBuildProps($.extend(acc_props, props)));
		});
		
		return tmpl('user-social-links-wrapper', {links: tmpl('user-social-link', props_array)});
	};
	/**
	 *
	 * @param users
	 * @param {buildProps} [props]
	 * @param {(Array<string>|string)} [props.avatar_classes]
	 * @param {(Array<string>|string)} [props.tombstone_classes]
	 * @param {boolean} [props.is_link]
	 * @returns {jQuery}
	 */
	Builder.prototype.userTombstones = function buildUserTombstones(users, props) {
		var self = this;
		
		props = Builder.normalizeBuildProps(props, ['avatar_classes', 'tombstone_classes']);
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
				avatar: self.avatars(user, {
					classes: props.avatar_classes
				}),
				name: user.full_name ? user.full_name : [user.first_name, user.last_name].join(' ')
			}, props);
		}));
	};
	/**
	 *
	 * @param {(OneUser|UsersCollection|OneOrganization|OrganizationsCollection|Array)} entities
	 * @param {buildProps} [props]
	 * @param {boolean} [props.is_link]
	 * @param {__C.ENTITIES} [props.entity]
	 * @param {(Array<string>|string)} [props.avatar_classes]
	 * @param {(Array<string>|string)} [props.block_classes]
	 *
	 * @returns {jQuery}
	 */
	Builder.prototype.avatarBlocks = function buildAvatarBlocks(entities, props) {
		var self = this;
		
		props = Builder.normalizeBuildProps(props, ['avatar_classes', 'block_classes']);
		if (props.is_link) {
			props.html_tag = 'a';
			props.block_classes.push('link','Link');
		} else {
			props.html_tag = 'div';
		}
		
		return tmpl('avatar-block', (entities instanceof Array ? entities : [entities]).map(function(entity) {
			var name, href;
			
			if((props.entity && props.entity === __C.ENTITIES.USER) || entity instanceof OneUser || entity.first_name){
				name = entity.full_name ? entity.full_name : (entity.first_name + ' ' + entity.last_name);
				href = '/user/' + entity.id;
			} else {
				name = entity.short_name ? entity.short_name : entity.name;
				href = '/organization/' + entity.id;
			}
			
			return $.extend(true, {
				id: entity.id,
				avatar: self.avatars(entity, {
					classes: props.avatar_classes
				}),
				attributes: {
					href: href
				},
				name: name
			}, props);
		}));
	};
	/**
	 *
	 * @param {(string|number)} organization_id
	 * @param {(OneUser|UsersCollection|Array)} entities
	 * @param {buildProps} [props]
	 * @param {boolean} can_edit
	 *
	 * @returns {jQuery}
	 */
	Builder.prototype.staffAvatarBlocks = function(organization_id, entities, props, can_edit) {
		var self = this;
		
		return tmpl('staff-avatar-block', entities.map(function(entity) {
			
			return {
				avatar_block: self.avatarBlocks(entity, props),
				can_edit: can_edit ? '-can_edit' : ''
			}
		})).each(function(i, el) {
			var data = {
				user: entities[i]
			};
			
			if (props && props.dataset) {
				$.extend(data, props.dataset);
			}
			
			$(el).data(data);
		}).find('.RemoveStaff').on('click.RemoveStaff', function() {
			var $avatar_block = $(this).closest('.StaffAvatarBlock'),
				user = $avatar_block.data('user'),
				$removing = tmpl('staff-avatar-block-removing', {
					username: [user.first_name, user.last_name].join(' ')
				});
			
			OneOrganization.removeStaff(organization_id, user.id, user.role).done(function() {
				$avatar_block.after($removing);
				$avatar_block.detach();
				
				$removing.find('.ReturnStaff').on('click', function() {
					OneOrganization.addStaff(organization_id, user.id, user.role).done(function() {
						$removing.after($avatar_block);
						$removing.remove();
					});
				});
			});
		}).end();
	};
	/**
	 *
	 * @param {(number|string)} org_id
	 * @param {OneUser.ROLE} role
	 * @param {buildProps} props
	 * @returns {jQuery}
	 */
	Builder.prototype.addUserAvatarBlock = function(org_id, role, props) {
		var name;
		
		props = Builder.normalizeBuildProps(props, ['avatar_classes', 'block_classes']);
		props.block_classes.push('link', __C.CLASSES.HOOKS.ADD_STAFF, __C.CLASSES.HOOKS.CALL_MODAL);
		
		switch (role) {
			case OneUser.ROLE.ADMIN: {
				name = 'Добавить администратора';
				break;
			}
			case OneUser.ROLE.MODERATOR: {
				name = 'Добавить модератора';
				break;
			}
		}
		
		return tmpl('avatar-block', $.extend({
			html_tag: 'div',
			name: name,
			avatar: tmpl('avatar', {
				classes: props.avatar_classes,
				avatar_url: window.location.origin + '/app/img/add_user.svg'
			})
		}, props)).data({
			modal_type: 'add_staff',
			modal_org_id: org_id,
			modal_role: role
		});
	};
	/**
	 *
	 * @param {(OneUser|UsersCollection|OneOrganization|OrganizationsCollection|Array)} entities
	 * @param {buildProps} [props]
	 * @returns {jQuery|undefined}
	 */
	Builder.prototype.avatars = function buildAvatars(entities, props) {
		var map = function() {},
			tmp = [],
			output_entities;
		
		if(!entities || (entities instanceof Array && !entities.length))
			return;
		
		props = Builder.normalizeBuildProps(props);
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
				tmp = entities instanceof Array ? entities : [entities];
				
				map = tmp[0].avatar_url ? userMap : orgMap;
				break;
			}
		}
		output_entities = (entities instanceof Array) ? entities : [entities];
		
		return tmpl('avatar', output_entities.map(map));
	};
	/**
	 *
	 * @param {Array} entities
	 * @param {number} max_count
	 * @param {buildProps} [props]
	 * @param {boolean} [props.avatar_is_link]
	 * @param {number} [overall_avatars_count]
	 * @returns {jQuery}
	 */
	Builder.prototype.avatarCollection = function buildAvatarCollection(entities, max_count, props, overall_avatars_count) {
		var data = Builder.normalizeBuildProps(props, ['counter_classes']),
			left = max_count;
		
		data.dataset.max_amount = max_count;
		data.classes.push('-max_' + max_count);
		
		data.avatars = this.avatars(__APP.USER).add(this.avatars(entities.filter(function(entity) {
			if (__APP.USER.id == entity.id) {
				return false;
			}
			return !(left-- <= 0);
		})));
		
		data.more_avatars_count = ( (overall_avatars_count ? overall_avatars_count : entities.length) - max_count );
		if(data.more_avatars_count <= 0){
			data.counter_classes.push('-cast');
		}
		
		return tmpl('avatars-collection', data);
	};
	/**
	 *
	 * @param {(OneAbstractActivity|Array<OneAbstractActivity>|UsersActivitiesCollection)} activities
	 * @param {buildProps} [props]
	 * @return {jQuery}
	 */
	Builder.prototype.activity = function buildActivity(activities, props){
		var build = this instanceof Builder ? this : new Builder(),
			ICON_CLASSES = {};
		
		ICON_CLASSES[OneAbstractActivity.TYPES.SUBSCRIBE] = 'plus';
		ICON_CLASSES[OneAbstractActivity.TYPES.FAVE] = 'star';
		ICON_CLASSES[OneAbstractActivity.TYPES.UNSUBSCRIBE] = ICON_CLASSES[OneAbstractActivity.TYPES.UNFAVE] = 'minus';
		
		props = Builder.normalizeBuildProps(props, ['avatar_classes']);
		props.avatar_classes.push(__C.CLASSES.SIZES.X50, __C.CLASSES.UNIVERSAL_STATES.ROUNDED);
		
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
				creator_avatar: build.avatars(activity.user, {
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
	};
	/**
	 *
	 * @param {(OneOrganization|Array<OneOrganization>|OrganizationsCollection)} organizations
	 * @param {object} [additional_fields]
	 * @returns {jQuery}
	 */
	Builder.prototype.organizationItems = function buildOrganizationItems(organizations, additional_fields) {
		organizations = organizations instanceof Array ? organizations : [organizations];
		var self = this,
			orgs = organizations.map(function(org) {
				org.counter_classes = org.new_events_count ? [] : [__C.CLASSES.HIDDEN];
				return org;
			});
		return tmpl('organization-item', orgs.map(function(organization) {
			return $.extend(true, {
				avatar_block: self.avatarBlocks(organization, {
					entity: __C.ENTITIES.ORGANIZATION,
					avatar_classes: [__C.CLASSES.SIZES.X30]
				})
			}, organization, Builder.normalizeBuildProps(additional_fields, ['avatar_classes', 'block_classes', 'counter_classes']));
		}));
	};
	/**
	 *
	 * @param {(Array<OneOrganization>|OrganizationsCollection)} organizations
	 * @returns {jQuery}
	 */
	Builder.prototype.organizationCard = function buildOrganisationCard(organizations) {
		var self = this;
		
		return tmpl('organization-card', organizations.map(function(org) {
			return $.extend(true, {}, org, {
				background_image: (org.background_small_img_url || org.background_img_url) ? self.link({
					page: '/organization/'+org.id,
					classes: ['organization_unit_background'],
					attributes: {
						style: 'background-image: url('+(org.background_small_img_url || org.background_img_url)+')'
					}
				}) : '',
				avatar: self.avatars(org, {
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
				redact_org_button: (org.role === OneUser.ROLE.UNAUTH || org.role === OneUser.ROLE.USER) ? '' : self.link({
					classes: [
						'button',
						__C.CLASSES.SIZES.LOW,
						__C.CLASSES.COLORS.MARGINAL_PRIMARY,
						__C.CLASSES.ICON_CLASS,
						__C.CLASSES.ICONS.PENCIL,
						__C.CLASSES.UNIVERSAL_STATES.EMPTY,
						__C.CLASSES.HOOKS.RIPPLE
					],
					page: '/admin/organization/' + org.id + '/edit'
				})
			});
		}))
	};
	/**
	 *
	 * @param {Array<OneEvent>} events
	 * @param {OrganizationPage~EventType} type
	 * @returns {jQuery}
	 */
	Builder.prototype.eventBlocks = function buildEventBlocks(events, type) {
		var self = this;
		
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
				cover_width: 550,
				divider: different_day ? tmpl('divider', {
					title: m_event_date.calendar().capitalize()
				}) : '',
				action_buttons: $action_buttons,
				date: m_event_date.format(__C.DATE_FORMAT),
				avatars_collection: self.avatarCollection(event.favored, 3, {
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
	};
	/**
	 *
	 * @param {OneCategory|Array<OneCategory>} categories
	 * @returns {jQuery}
	 */
	Builder.prototype.organisationsCategoriesItems = function buildOrganisationsCategoriesItems(categories) {
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
	};
	/**
	 *
	 * @param {Array} subscribers
	 * @param {boolean} [last_is_fiend]
	 * @returns {jQuery}
	 */
	Builder.prototype.subscribers = function buildSubscribers(subscribers, last_is_fiend) {
		var self = this;
		
		return tmpl('subscriber', subscribers.map(function(subscriber, i) {
			var append_divider = (typeof last_is_fiend === 'undefined') || last_is_fiend !== subscriber.is_friend;
			
			last_is_fiend = subscriber.is_friend;
			return {
				divider: append_divider ? tmpl('subscriber-divider', {label: subscriber.is_friend ? 'Друзья' : 'Все подписчики'}) : '',
				avatar_block: self.avatarBlocks(subscriber, {
					is_link: true,
					entity: __C.ENTITIES.USER,
					avatar_classes: [
						__C.CLASSES.SIZES.X40,
						__C.CLASSES.UNIVERSAL_STATES.ROUNDED,
						__C.CLASSES.UNIVERSAL_STATES.BORDERED,
						__C.CLASSES.UNIVERSAL_STATES.SHADOWED
					],
					block_classes: ['subscriber']
				})
			};
		}));
	};
	/**
	 *
	 * @param {(OneEvent|Array<OneEvent>|EventsCollection)} events
	 * @returns {jQuery}
	 */
	Builder.prototype.eventCards = function buildEventCards(events) {
		var self = this,
			$events,
			_events = events instanceof Array ? events : [events];
		
		$events = tmpl('event-card', _events.map(function(event) {
			var card_cover_width = 405,
				avatars_collection_classes = [
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
			
			$header_buttons = $header_buttons.add(self.button({
				classes: [
					'feed_event_header_button',
					'feed_event_header_button_hide_event',
					__C.CLASSES.SIZES.LOW,
					__C.CLASSES.UNIVERSAL_STATES.EMPTY,
					'HideEvent'
				],
				dataset: {
					'event-id': event.id
				},
				title: '×'
			}));
			
			if (event.is_favorite) {
				avatars_collection_classes.push(__C.CLASSES.HOOKS.ADD_AVATAR.STATES.SHIFTED);
			}
			feed_event_infos.push({
				text: displayDateRange(event.dates[0].event_date, event.dates[event.dates.length - 1].event_date)
				      + (event.is_same_time ? ', ' + displayTimeRange(event.dates[0].start_time, event.dates[0].end_time) : '')
			});
			if (event.registration_required && event.registration_till) {
				feed_event_infos.push({text: 'Регистрация до ' + moment.unix(event.registration_till).calendar().toLowerCase()});
			}
			if (event.is_free) {
				feed_event_infos.push({text: 'Бесплатно'});
			} else {
				feed_event_infos.push({text: 'Цена от ' + (event.min_price ? formatCurrency(event.min_price) : 0) + ' руб.'});
			}
			
			return $.extend(true, {
				cover_width: card_cover_width,
				organization_avatar_block: self.avatarBlocks(organization, {
					block_classes: [__C.CLASSES.SIZES.SMALL],
					is_link: true,
					entity: __C.ENTITIES.ORGANIZATION
				}),
				action_button: $action_button,
				avatars_collection: self.avatarCollection(event.favored, 4, {
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
				feed_event_infos: tmpl('event-card-info', feed_event_infos),
				header_buttons: $header_buttons
			}, event);
		}));
		
		_events.forEach(function(event, i) {
			$events.eq(i).appear(function() {
				storeStat(event.id, __C.STATS.EVENT_ENTITY, __C.STATS.EVENT_VIEW);
			}, {accY: 100})
		});
		
		if(__APP.USER.isLoggedOut()){
			$events.find('.HideEvent').remove();
		}
		
		return $events;
	};
	/**
	 *
	 * @param {(RegistrationFieldsCollection|Array<RegistrationField>|RegistrationField)} fields
	 *
	 * @return {jQuery}
	 */
	Builder.prototype.registrationFields = function buildRegistrationFields(fields) {
		if (fields instanceof RegistrationField) {
			fields = [fields];
		} else if (!(fields instanceof Array)) {
			throw TypeError('Component builder accepts only RegistrationFieldsCollection, RegistrationField or array of RegistrationField object types');
		}
		
		var $fields = $(),
			name_fields = [],
			types_queue = [
				RegistrationField.TYPES.EMAIL,
				RegistrationField.TYPES.PHONE_NUMBER,
				RegistrationField.TYPES.ADDITIONAL_TEXT,
				RegistrationField.TYPES.CUSTOM,
				RegistrationField.TYPES.SELECT,
				RegistrationField.TYPES.SELECT_MULTI,
				RegistrationField.TYPES.EXTENDED_CUSTOM
			];
		
		if (fields.__types[RegistrationField.TYPES.FIRST_NAME].length || fields.__types[RegistrationField.TYPES.LAST_NAME].length) {
			if (fields.__types[RegistrationField.TYPES.LAST_NAME].length) {
				name_fields.push({
					name: 'Фамилия',
					value: fields.__types[RegistrationField.TYPES.LAST_NAME][0].value
				});
			}
			if (fields.__types[RegistrationField.TYPES.FIRST_NAME].length) {
				name_fields.push({
					name: 'Имя',
					value: fields.__types[RegistrationField.TYPES.FIRST_NAME][0].value
				});
			}
			$fields = $fields.add(tmpl('fields-wrapper', {
				classes: name_fields.length === 2 ? '-columns_2' : '',
				fields: tmpl('field', name_fields)
			}));
		}
		
		return $fields.add(tmpl('field', types_queue.reduce(function(batch, type) {
			if (type === RegistrationField.TYPES.FIRST_NAME || type === RegistrationField.TYPES.LAST_NAME) {
				return batch;
			}
			
			return batch.concat(fields.__types[type].map(function(field) {
				
				return {
					name: field.label || RegistrationField.DEFAULT_LABEL[type],
					value: (function(field) {
						switch (field.type) {
							case RegistrationFieldModel.TYPES.SELECT:
							case RegistrationFieldModel.TYPES.SELECT_MULTI: {
								
								return (field.values && field.values.length) ? field.values.map(function(value) {
									
									return value.value;
								}).join(', ') : '—'
							}
							default: {
								
								return field.value || '—'
							}
						}
					}(field))
				};
			}));
		}, [])));
	};
	
	/**
	 *
	 * @param {(OneExtendedTicket|Array<OneExtendedTicket>|ExtendedTicketsCollection)} tickets
	 * @return Array
	 */
	Builder.normalizeTicketProps = function(tickets) {
		
		return (tickets instanceof Array ? tickets : [tickets]).map(function(ticket) {
			var props = Builder.normalizeBuildProps({
				card_classes: [],
				title: ticket.event.title,
				location: ticket.event.location,
				status_name: ticket.status_name,
				status_type_code: ticket.status_type_code,
				ticket_type_name: ticket.ticket_type.name,
				image_horizontal_url: ticket.event.image_horizontal_url,
				image_horizontal_large_url: ticket.event.image_horizontal_large_url || ticket.event.image_horizontal_url,
				image_horizontal_medium_url: ticket.event.image_horizontal_medium_url
			}, ['card_classes']),	event_date;
			
			switch (props.status_type_code) {
				case OneExtendedTicket.TICKET_STATUSES.PAYED:
				case OneExtendedTicket.TICKET_STATUSES.APPROVED:
				case OneExtendedTicket.TICKET_STATUSES.WITHOUT_PAYMENT: {
					props.card_classes.push(__C.CLASSES.STATUS.SUCCESS);
					break;
				}
				case OneExtendedTicket.TICKET_STATUSES.IS_PENDING:
				case OneExtendedTicket.TICKET_STATUSES.WAITING_FOR_PAYMENT: {
					props.card_classes.push(__C.CLASSES.STATUS.PENDING);
					break;
				}
				case OneExtendedTicket.TICKET_STATUSES.REJECTED:
				case OneExtendedTicket.TICKET_STATUSES.RETURNED_BY_CLIENT:
				case OneExtendedTicket.TICKET_STATUSES.RETURNED_BY_ORGANIZATION: {
					props.card_classes.push(__C.CLASSES.STATUS.ERROR);
					break;
				}
			}
			
			switch (props.status_type_code) {
				case OneExtendedTicket.TICKET_STATUSES.IS_PENDING:
				case OneExtendedTicket.TICKET_STATUSES.WAITING_FOR_PAYMENT:
				case OneExtendedTicket.TICKET_STATUSES.RETURNED_BY_ORGANIZATION:
				case OneExtendedTicket.TICKET_STATUSES.RETURNED_BY_CLIENT:
				case OneExtendedTicket.TICKET_STATUSES.REJECTED: {
					props.card_classes.push(__C.CLASSES.DISABLED);
					break;
				}
				default: {
					props.card_classes.push(__C.CLASSES.HOOKS.CALL_MODAL);
					break;
				}
			}
			
			if (ticket.event.is_same_time) {
				event_date = ticket.event.dates[0];
				props.formatted_dates = displayDateRange(event_date.event_date, ticket.event.dates[ticket.event.dates.length - 1].event_date) + ', ' + displayTimeRange(event_date.start_time, event_date.end_time);
			} else {
				event_date = ticket.event.nearest_event_date;
				props.formatted_dates = displayDateRange(event_date, event_date);
			}
			
			return props;
		});
	};
	/**
	 *
	 * @param {(OneExtendedTicket|Array<OneExtendedTicket>|ExtendedTicketsCollection)} tickets
	 * @return {jQuery}
	 */
	Builder.prototype.ticketCards = function buildTicketCard(tickets) {
		
		return tmpl('ticket-card', Builder.normalizeTicketProps(tickets).map(function(ticket) {
			ticket.cover_width = 260;
			return ticket;
		})).each(function(i, ticket) {
			$(ticket).data({
				modal_type: __C.MODAL_TYPES.TICKET,
				tickets: tickets[i]
			});
		});
	};
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
	Builder.prototype.modal = function(props) {
		var $modal,
			normalized_props = Builder.normalizeBuildProps(props, ['content_classes']),
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
				close_button: this.button({
					classes: [__C.CLASSES.UNIVERSAL_STATES.EMPTY, '-modal_destroyer', __C.CLASSES.HOOKS.CLOSE_MODAL, __C.CLASSES.HOOKS.RIPPLE],
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
	};
	
	
	return Builder;
}());