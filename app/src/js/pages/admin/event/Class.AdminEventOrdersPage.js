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
	 * @property {OrdersCollection} orders
	 * @property {Fields} orders_fields
	 * @property {jQuery} $loader
	 * @property {DataTable.Api} ordersTable
	 */
	function AdminEventOrdersPage(event_id) {
		var self = this;
		
		AdminEventPage.call(this, event_id);
		
		this.orders = new OrdersCollection(event_id);
		this.orders_fields = new Fields('created_at', {
			user: {/*
				fields: new Fields('email')*/
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
			dom: '<"data_tables_pagination"p>t<"data_tables_pagination"p>',
			language: {
				url: __LOCALE.DATATABLES_URL
			}
		});
		
		this.$wrapper.find('.OrdersTableSearch').on('input', function() {
			self.ordersTable.search(this.value).draw();
		});
	};
	
	AdminEventOrdersPage.prototype.render = function() {
		var self = this;
		
		this.$wrapper.html(tmpl('admin-event-orders-page', {
			loader: (this.$loader = __APP.BUILD.overlayLoader())
		}));
		
		this.orders.fetchAllOrders(this.event.orders_count, this.orders_fields).done(function() {
			var $rows = tmpl('admin-event-orders-page-tr', self.orders.map(function(order) {
				
				return {
					uuid: order.uuid,
					number: order.uuid,
					status_type_code: order.status_type_code,
					status_text: localeFromNamespace(order.status_type_code, OneOrder.EXTENDED_ORDER_STATUSES, __LOCALE.TEXTS.TICKET_STATUSES),
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
						ticket_rows: tmpl('admin-event-orders-page-ticket-row', self.orders.getByUUID($tr.data('order_uuid')).tickets.map(function(ticket) {
							
							return $.extend({}, ticket, {
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
				var $this = $(this);
				
				if (!$(e.target).hasClass('DataTableRowExpand')) {
					$rows.not($this).removeClass('-selected');
					$this.toggleClass('-selected');
				}
			});
			
			if (!self.ordersTable) {
				self.initOrdersTable();
			}
			self.ordersTable.rows.add($rows).draw();/*
			try {
				self.ordersTable.rows().recalcHeight().columns.adjust().fixedColumns().relayout().draw();
			} catch (e) {
				__APP.reload();
			}*/
			
			self.$loader.remove();
			self.$wrapper.find('.OrdersTableWrapper').removeClass(__C.CLASSES.STATUS.DISABLED);
		});
	};
	
	return AdminEventOrdersPage;
}()));