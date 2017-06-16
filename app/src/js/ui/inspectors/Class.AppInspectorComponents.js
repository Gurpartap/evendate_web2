/**
 *
 * @class AppInspectorComponents
 */
AppInspectorComponents = (function() {
	/**
	 *
	 * @constructor
	 * @constructs AppInspectorComponents
	 */
	function AppInspectorComponents() {
		if (typeof AppInspectorComponents.instance === 'object')
			return AppInspectorComponents.instance;
		
		AppInspectorComponents.instance = this;
	}
	
	/**
	 *
	 * @param {OneUser} user
	 *
	 * @return {jQuery}
	 */
	AppInspectorComponents.prototype.avatarBlock = function(user) {
		return bindPageLinks(__APP.BUILD.avatarBlocks(user, {
			is_link: true,
			entity: __C.ENTITIES.USER,
			avatar_classes: [__C.CLASSES.SIZES.X50, __C.CLASSES.UNIVERSAL_STATES.ROUNDED]
		}));
	};
	/**
	 *
	 * @param {(*|string)} title
	 *
	 * @return {jQuery}
	 */
	AppInspectorComponents.prototype.title = function(title) {
		return tmpl('app-inspector-title', {
			title: title
		});
	};
	/**
	 *
	 * @param {(Array<OneTicket>|...OneTicket|EventsTicketsCollection)} ticket
	 *
	 * @return {jQuery}
	 */
	AppInspectorComponents.prototype.tickets = function(ticket) {
		var tickets;
		
		if (arguments.length > 1) {
			tickets = [].slice.call(arguments)
		} else {
			tickets = ticket instanceof Array ? ticket : [ticket]
		}
		
		return tmpl('app-inspector-ticket', tickets.map(function(ticket) {
			
			return {
				fields: tmpl('app-inspector-fields-wrapper', [
					{
						classes: '-columns_2',
						fields: tmpl('app-inspector-field', [
							{name: 'Номер', value: formatTicketNumber(ticket.number)},
							{name: 'Цена', value: ticket.price ? ticket.price : 'Бесплатно'}
						])
					},
					{
						classes: '-field_big',
						fields: tmpl('app-inspector-field', {name: 'Название', value: ticket.ticket_type.name})
					}
				]),
				footer: !ticket.checkout ? '' : tmpl('app-inspector-ticket-footer')
			};
		}));
	};
	/**
	 *
	 * @param {(RegistrationFieldsCollection|Array<RegistrationField>|RegistrationField)} fields
	 *
	 * @return {jQuery}
	 */
	AppInspectorComponents.prototype.registrationFields = function(fields) {
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
			$fields = $fields.add(tmpl('app-inspector-fields-wrapper', {
				classes: name_fields.length === 2 ? '-columns_2' : '',
				fields: tmpl('app-inspector-field', name_fields)
			}));
		}
		
		return $fields.add(tmpl('app-inspector-field', types_queue.reduce(function(batch, type) {
			if (type === RegistrationField.TYPES.FIRST_NAME || type === RegistrationField.TYPES.LAST_NAME) {
				return batch;
			}
			
			return batch.concat(fields.__types[type].map(function(field) {
				
				return {
					name: field.label || RegistrationField.DEFAULT_LABEL[type],
					value: field.value || '—'
				};
			}));
		}, [])));
	};
	/**
	 *
	 * @param {OneEvent} event
	 *
	 * @return {jQuery}
	 */
	AppInspectorComponents.prototype.event = function(event) {
		
		return bindPageLinks(tmpl('app-inspector-event', event));
	};
	
	return AppInspectorComponents;
}());