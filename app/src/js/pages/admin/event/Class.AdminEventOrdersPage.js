/**
 * @requires Class.AdminEventPage.js
 */
/**
 *
 * @class AdminEventOrdersPage
 * @extends AdminEventPage
 */
AdminEventOrdersPage = extending(AdminEventPage, (function() {
	/**
	 *
	 * @param {(string|number)} event_id
	 *
	 * @constructor
	 * @constructs AdminEventOrdersPage
	 *
	 * @property {EventAllOrdersCollection} orders
	 * @property {Fields} orders_fields
	 * @property {jQuery} $loader
	 * @property {DataTable.Api} ordersTable
	 */
	function AdminEventOrdersPage(event_id) {
		var self = this;
		
		AdminEventPage.call(this, event_id);
		
		this.orders = new EventAllOrdersCollection(event_id);
		this.orders_fields = new Fields(
			'created_at',
			'payment_type',
			'shop_sum_amount',
			'registration_fields',
			'promocode', {
				user: {
					fields: new Fields('email')
				},
				tickets: {
					fields: new Fields('ticket_type')
				}
			});
		
		this.event_fields.add('orders_count');
		this.$loader = $();
		
		this.ordersTable = null;
		
		Object.defineProperties(this, {
			page_title_obj: {
				get: function() {
					return [{
						title: 'Организации',
						page: '/admin'
					}, {
						title: self.event.organization_short_name,
						page: '/admin/organization/' + self.event.organization_id
					}, self.event.title + ' - заказы'];
				}
			}
		});
	}
	
	AdminEventOrdersPage.prototype.initOrdersTable = function() {
		var self = this;
		
		this.ordersTable = this.$wrapper.find('.OrdersTable').eq(0).DataTable({
			paging: true,
			select: true,
			columns: [
				{
					data: 'number',
					render: function(data, type, row) {
						
						return tmpl('admin-event-orders-page-row-expand-wrapper', {
							number: data
						}).outerHTML();
					}
				},
				{data: 'status'},
				{data: 'orderer'},
				{data: 'email'},
				{
					data: {
						_: 'buy_time.display',
						sort: 'buy_time.timestamp'
					}
				}
			],
			dom: 't<"data_tables_pagination"p>',
			language: {
				url: __LOCALE.DATATABLES_URL
			}
		});
		
		this.$wrapper.find('.OrdersTableSearch').on('input', function() {
			self.ordersTable.search(this.value + '|' + transl(this.value), true, false).draw();
		});
	};
	
	AdminEventOrdersPage.prototype.init = function() {
		bindDropdown(this.$wrapper);
	};
	
	AdminEventOrdersPage.prototype.render = function() {
		var self = this,
			$header_buttons = $();
		
		$header_buttons = $header_buttons.add(new DropDown('export-formats', 'Выгрузка билетов', {
			classes: [
				__C.CLASSES.SIZES.LOW,
				__C.CLASSES.ICON_CLASS,
				__C.CLASSES.ICONS.DOWNLOAD,
				__C.CLASSES.COLORS.MARGINAL_PRIMARY,
				__C.CLASSES.HOOKS.RIPPLE,
				__C.CLASSES.HOOKS.DROPDOWN_BUTTON
			]
		}, {
			width: 'self',
			position: {
				x: 'right',
				y: 5
			}
		}, {
			xlsx_href: '/api/v1' + ServerExports.ENDPOINT.EVENT_TICKETS.format({event_id: this.event.id}) + '?format=xlsx',
			html_href: '/api/v1' + ServerExports.ENDPOINT.EVENT_TICKETS.format({event_id: this.event.id}) + '?format=html'
		}));
		
		$header_buttons = $header_buttons.add(new DropDown('export-formats', 'Выгрузка заказов', {
			classes: [
				__C.CLASSES.SIZES.LOW,
				__C.CLASSES.ICON_CLASS,
				__C.CLASSES.ICONS.DOWNLOAD,
				__C.CLASSES.COLORS.MARGINAL_PRIMARY,
				__C.CLASSES.HOOKS.RIPPLE,
				__C.CLASSES.HOOKS.DROPDOWN_BUTTON
			]
		}, {
			width: 'self',
			position: {
				x: 'right',
				y: 5
			}
		}, {
			xlsx_href: '/api/v1' + ServerExports.ENDPOINT.EVENT_ORDERS.format({event_id: this.event.id}) + '?format=xlsx',
			html_href: '/api/v1' + ServerExports.ENDPOINT.EVENT_ORDERS.format({event_id: this.event.id}) + '?format=html'
		}));
		
		this.$wrapper.html(tmpl('admin-event-orders-page', {
			header_buttons: $header_buttons,
			statuses_help: __APP.BUILD.helpLink(HelpCenterConnection.ARTICLE.ORDER_STATUSES, 'Какие существуют статусы заказов'),
			loader: (this.$loader = __APP.BUILD.overlayLoader())
		}));
		
		this.orders.fetchAllOrders(this.orders_fields).done(function() {
			if (!self.ordersTable) {
				self.initOrdersTable();
			}
			
			self.ordersTable.rows.add(self.orders.map(function(order) {
				
				return {
					uuid: order.uuid,
					number: formatTicketNumber(order.number),
					status: __APP.BUILD.orderStatusBlock(order.status_type_code).outerHTML(),
					orderer: order.user.full_name,
					email: order.user.email,
					buy_time: {
						display: moment.unix(order.created_at).format(__LOCALE.DATE.DATE_TIME_FORMAT),
						timestamp: order.created_at
					}
				}
			})).draw();
			
			AbstractAppInspector.$wrapper.on('inspector:hide', function() {
				self.ordersTable.rows().deselect();
			});
			
			self.ordersTable.on('deselect', function(e, dt, type, indexes) {
				dt.rows(indexes).nodes().to$().removeClass('-selected');
				AbstractAppInspector.hideCurrent();
			});
			
			self.ordersTable.on('select', function(e, dt, type, indexes) {
				var row = dt.row(indexes[0]);
				
				(new OrderAppInspector(self.orders.getByID(row.data().uuid), self.event)).show();
				row.nodes().to$().addClass('-selected');
			});
			
			self.ordersTable.on('user-select', function(e, dt, type, indexes, original_event) {
				var row = dt.row(indexes[0][0][type]);
				
				if (!$(original_event.target).hasClass('DataTableRowExpand')) {
					if (row.nodes().to$().hasClass('-selected')) {
						row.deselect();
					} else {
						dt.rows().deselect();
						row.select();
					}
				}
				
				return false;
			});
			
			self.ordersTable.rows().nodes().to$().find('.DataTableRowExpand').on('click.ExpandRow', function() {
				var $this = $(this),
					$tr = $this.closest('tr'),
					row = self.ordersTable.row( $tr ),
					$child_row,
					$collapsing_wrapper,
					$collapsing_content;
				
				
				if (!row.child.isShown()) {
					row.child( tmpl('admin-event-orders-page-table-child-row', {
						ticket_rows: tmpl('admin-event-orders-page-ticket-row', self.orders.getByID(row.data().uuid).tickets.map(function(ticket) {
							
							return $.extend({}, ticket, {
								number: formatTicketNumber(ticket.number),
								ticket_type_name: ticket.ticket_type.name,
								price: ticket.price ? ticket.price : 'Бесплатно',
								used: ticket.checkout ? 'Билет использован' : ''
							});
						}))
					}) ).show();
					$tr.addClass('-has_child');
				}
				
				$child_row = row.child();
				$collapsing_wrapper = $child_row.find('.CollapsingWrapper');
				$collapsing_content = $child_row.find('.CollapsingContent');
				
				if ($collapsing_wrapper.height()) {
					$collapsing_wrapper.height(0).removeClass('-opened');
				} else {
					$collapsing_wrapper.height($collapsing_content.outerHeight()).addClass('-opened');
				}
				
				$this.toggleClass([__C.CLASSES.ACTIVE, __C.CLASSES.ICONS.PLUS, __C.CLASSES.ICONS.MINUS].join(' '));
			});
			
			self.$loader.remove();
			
			self.$wrapper.find('.OrdersTableWrapper').removeClass(__C.CLASSES.STATUS.DISABLED);
		});
		this.init();
	};
	
	return AdminEventOrdersPage;
}()));