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
			'registration_fields', {
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
			columnDefs: [
			],
			dom: 't<"data_tables_pagination"p>',
			language: {
				url: __LOCALE.DATATABLES_URL
			}
		});
		
		this.$wrapper.find('.OrdersTableSearch').on('input', function() {
			self.ordersTable.search(this.value).draw();
		});
	};
	
	AdminEventOrdersPage.prototype.init = function() {
		bindDropdown(this.$wrapper);
	};
	
	AdminEventOrdersPage.prototype.render = function() {
		var self = this,
			$header_buttons = $();
		
		$header_buttons = $header_buttons.add(new DropDown('export-formats', 'Выгрузка', {
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
			xlsx_href: '/api/v1/statistics/events/'+this.event.id+'/orders/export?format=xlsx',
			html_href: '/api/v1/statistics/events/'+this.event.id+'/orders/export?format=html'
		}));
		
		this.$wrapper.html(tmpl('admin-event-orders-page', {
			header_buttons: $header_buttons,
			loader: (this.$loader = __APP.BUILD.overlayLoader())
		}));
		
		this.orders.fetchAllOrders(this.orders_fields).done(function() {
			var $rows = tmpl('admin-event-orders-page-tr', self.orders.map(function(order) {
				
				return {
					uuid: order.uuid,
					number: formatTicketNumber(order.number),
					status: __APP.BUILD.orderStatusBlock(order.status_type_code),
					orderer: order.user.full_name,
					email: order.user.email,
					buy_time: moment.unix(order.created_at).format(__LOCALE.DATE.DATE_TIME_FORMAT)
				};
			}));
			
			$rows.find('.DataTableRowExpand').on('click.ExpandRow', function() {
				var $this = $(this),
					$tr = $this.closest('tr'),
					row = self.ordersTable.row( $tr ),
					$child_row,
					$collapsing_wrapper,
					$collapsing_content;
				
				if (!row.child.isShown()) {
					row.child( tmpl('admin-event-orders-page-table-child-row', {
						ticket_rows: tmpl('admin-event-orders-page-ticket-row', self.orders.getByID($tr.data('order_uuid')).tickets.map(function(ticket) {
							
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
			
			$rows.on('click.SelectRow', function(e) {
				var $this = $(this),
					data = $this.data();
				
				if (!$(e.target).hasClass('DataTableRowExpand')) {
					if (data.inspector && data.inspector.is_shown) {
						data.inspector.hide();
					} else {
						if (!(data.inspector instanceof OrderAppInspector)) {
							data.inspector = new OrderAppInspector(self.orders.getByID($this.data('order_uuid')), self.event);
							$this.data(data);
						}
						data.inspector.show();
					}
					$rows.not($this).removeClass('-selected');
					$this.toggleClass('-selected');
				}
			});
			
			if (!self.ordersTable) {
				self.initOrdersTable();
			}
			self.ordersTable.rows.add($rows).draw();
			
			self.$loader.remove();
			self.$wrapper.find('.OrdersTableWrapper').removeClass(__C.CLASSES.STATUS.DISABLED);
		});
		this.init();
	};
	
	return AdminEventOrdersPage;
}()));