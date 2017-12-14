/**
 * @requires Class.AdminEventPage.js
 */
/**
 *
 * @class AdminEventRequestsPage
 * @extends AdminEventPage
 */
AdminEventRequestsPage = extending(AdminEventPage, (function() {
	/**
	 *
	 * @class OneRequest
	 * @extends OneOrder
	 */
	var OneRequest = extending(OneOrder, (function() {
		/**
		 *
		 * @param {(string|number)} event_id
		 * @param {(string|number)} uuid
		 *
		 * @constructor
		 * @constructs OneRequest
		 */
		function OneRequest(event_id, uuid) {
			OneOrder.call(this, event_id, uuid);
		}
		
		OneRequest.fetchRequest = OneOrder.fetchOrder;
		/**
		 *
		 * @param {AJAXCallback} [success]
		 *
		 * @return {Promise}
		 */
		OneRequest.prototype.approveRequest = function(success) {
			
			return this.changeStatus(OneOrder.ORDER_STATUSES.APPROVED, success);
		};
		/**
		 *
		 * @param {AJAXCallback} [success]
		 *
		 * @return {Promise}
		 */
		OneRequest.prototype.rejectRequest = function(success) {
			
			return this.changeStatus(OneOrder.ORDER_STATUSES.REJECTED, success);
		};
		
		return OneRequest;
	}()));
	/**
	 *
	 * @class RequestsCollection
	 * @extends EventAllOrdersCollection
	 */
	var RequestsCollection = extending(EventAllOrdersCollection, (function() {
		/**
		 *
		 * @param {(string|number)} [event_id=0]
		 *
		 * @constructor
		 * @constructs EventAllOrdersCollection
		 *
		 * @property {(string|number)} event_id
		 * @property {Array<OneRequest>} new_requests
		 * @property {Array<OneRequest>} approved_requests
		 * @property {Array<OneRequest>} rejected_requests
		 */
		function RequestsCollection(event_id) {
			var self = this;
			
			EventAllOrdersCollection.call(this, event_id);
			
			Object.defineProperties(this, {
				new_requests: {
					get: function() {
						
						return self.filter(function(request) {
							
							return request.status_type_code === OneOrder.ORDER_STATUSES.IS_PENDING;
						});
					}
				},
				approved_requests: {
					get: function() {
						
						return self.filter(function(request) {
							
							return request.status_type_code === OneOrder.ORDER_STATUSES.APPROVED;
						});
					}
				},
				rejected_requests: {
					get: function() {
						
						return self.filter(function(request) {
							
							return request.status_type_code === OneOrder.ORDER_STATUSES.REJECTED;
						});
					}
				}
			});
		}
		
		RequestsCollection.prototype.collection_of = OneRequest;
		/**
		 *
		 * @param {(string|number)} event_id
		 * @param {AJAXData} [ajax_data]
		 * @param {AJAXCallback} [success]
		 *
		 * @return {Promise}
		 */
		RequestsCollection.fetchOrders = RequestsCollection.fetchRequests = EventAllOrdersCollection.fetchOrders;
		/**
		 *
		 * @param {(Fields|Array<string>|string)} [fields]
		 * @param {(Array<string>|string)} [order_by]
		 * @param {AJAXCallback} [success]
		 *
		 * @returns {Promise}
		 */
		RequestsCollection.prototype.fetchAllRequests = EventAllOrdersCollection.prototype.fetchAllOrders;
		
		return RequestsCollection;
	}()));
	
	/**
	 *
	 * @param {(string|number)} event_id
	 *
	 * @constructor
	 * @constructs AdminEventRequestsPage
	 *
	 * @property {Fuse} new_requests_fuse
	 * @property {Fuse} approved_requests_fuse
	 * @property {Fuse} rejected_requests_fuse
	 */
	function AdminEventRequestsPage(event_id) {
		var self = this,
			fuse_search_options = {
				shouldSort: true,
				threshold: 0.1,
				distance: 1000,
				keys: [
					'number',
					'user.full_name'
				]
			};
		
		AdminEventPage.call(this, event_id);
		
		this.event_fields.add('orders_count');
		
		this.requests = new RequestsCollection(event_id);
		this.requests_fields = new Fields(
			'created_at',
			'registration_fields', {
				user: {
					fields: new Fields('email')
				}
			}
		);
		
		this.$loader = $();
		this.$new_requests_list = $();
		this.$approved_requests_list = $();
		this.$rejected_requests_list = $();
		this.current_requests_list = 'new';
		
		
		this.$requests_detail = $();
		
		this.Tabs = $();
		
		Object.defineProperties(this, {
			page_title_obj: {
				get: function() {
					return [{
						title: 'Организации',
						page: '/admin'
					}, {
						title: self.event.organization_short_name,
						page: '/admin/organization/' + self.event.organization_id
					}, self.event.title + ' - заявки'];
				}
			},
			new_requests_fuse: {
				get: function() {
					
					return new Fuse(self.requests.new_requests, fuse_search_options)
				}
			},
			approved_requests_fuse: {
				get: function() {
					
					return new Fuse(self.requests.approved_requests, fuse_search_options)
				}
			},
			rejected_requests_fuse: {
				get: function() {
					
					return new Fuse(self.requests.rejected_requests, fuse_search_options)
				}
			}
		});
	}
	
	/**
	 *
	 * @param {Array<OneRequest>|OneRequest|RequestsCollection} requests
	 *
	 * @return {jQuery}
	 */
	AdminEventRequestsPage.prototype.requestItemBuilder = function(requests) {
		var self = this,
			_requests = requests instanceof Array ? requests : [requests],
		$request_items = tmpl('event-admin-request-item', _requests.map(function(request) {
			var buttons = [];
			
			if (request.status_type_code === OneOrder.ORDER_STATUSES.IS_PENDING || request.status_type_code === OneOrder.ORDER_STATUSES.APPROVED) {
				buttons.push({
					title: 'Отклонить',
					classes: [__C.CLASSES.COLORS.MARGINAL, 'RejectRequest']
				});
			}
			
			if (request.status_type_code === OneOrder.ORDER_STATUSES.IS_PENDING || request.status_type_code === OneOrder.ORDER_STATUSES.REJECTED) {
				buttons.push({
					title: 'Принять заявку',
					classes: [__C.CLASSES.COLORS.ACCENT, 'ApproveRequest']
				});
			}
			
			return {
				orderer_avatar: __APP.BUILD.avatars(request.user, {
					classes: [__C.CLASSES.SIZES.X30, __C.CLASSES.UNIVERSAL_STATES.ROUNDED]
				}),
				order_number: formatTicketNumber(request.number),
				request_time: request.m_created_at.format(__LOCALE.DATE.TIME_FORMAT),
				request_date: request.m_created_at.format('D MMMM'),
				orderer_full_name: request.user.full_name,
				action_buttons: __APP.BUILD.actionButton(buttons)
			};
		}));
		
		
		if ($request_items.length) {
			$request_items.each(function(i) {
				var $this = $(this),
					/**
					 * @type OneRequest
					 */
					request = _requests[i];
				
				$this.data('request', request);
				
				$this.on('click.SelectRequestItem', function(e) {
					var $target = $(e.target);
					
					if (!($target.closest('.ApproveRequest').length || $target.closest('.RejectRequest').length)) {
						self.selectRequestItem(this);
					}
				});
				
				$this.find('.ApproveRequest').on('click.ApproveRequest', function() {
					self.approveRequest($this);
				});
				
				$this.find('.RejectRequest').on('click.RejectRequest', function() {
					var $item;
					
					request.rejectRequest().then(function() {
						$item = self.requestItemBuilder(request);
						
						self.$rejected_requests_list.append($item);
						
						if ($this.hasClass('-item_selected')) {
							self.selectRequestItem($item);
						}
						$this.remove();
					});
				});
			});
		} else {
			$request_items = tmpl('event-admin-no-request-items');
		}
		
		return $request_items;
	};
	/**
	 *
	 * @param {(Element|jQuery)} element
	 */
	AdminEventRequestsPage.prototype.selectRequestItem = function(element) {
		var self = this,
			$element = element instanceof jQuery ? element : $(element),
			/**
			 * @type OneRequest
			 */
			request = $element.data('request');
		
		self.$wrapper.find('.RequestItem').not($element).removeClass('-item_selected');
		$element.addClass('-item_selected');
		
		self.$requests_detail.html(tmpl('event-admin-request-detail', {
			order_number: formatTicketNumber(request.number),
			orderer_full_name: request.user.full_name,
			orderer_avatar: __APP.BUILD.avatars(request.user, {
				classes: [
					__C.CLASSES.SIZES.X55,
					__C.CLASSES.UNIVERSAL_STATES.ROUNDED,
					__C.CLASSES.UNIVERSAL_STATES.BORDERED,
					__C.CLASSES.UNIVERSAL_STATES.SHADOWED
				]
			}),
			registration_fields: __APP.BUILD.registrationFields(request.registration_fields)
		}));
	};
	/**
	 *
	 * @param {(Element|jQuery)} element
	 */
	AdminEventRequestsPage.prototype.approveRequest = function(element) {
		var self = this,
			$element = element instanceof jQuery ? element : $(element),
			/**
			 * @type OneRequest
			 */
			request = $element.data('request'),
			$item;
		
		request.approveRequest().then(function() {
			$item = self.requestItemBuilder(request);
			
			self.$approved_requests_list.append($item);
			
			if ($element.hasClass('-item_selected')) {
				self.selectRequestItem($item);
			}
			$element.remove();
		});
	};
	
	AdminEventRequestsPage.prototype.init = function() {
		var self = this;
		
		bindTabs(this.$wrapper, false);
		this.Tabs = this.$wrapper.find('.Tabs').resolveInstance();
		
		this.$wrapper.find('.RequestsListScrollbar').scrollbar();
		this.$wrapper.find('.RequestDetailScrollbar').scrollbar();
		
		this.$wrapper.find('.ApproveAllRequests').on('click.ApproveAllRequests', function() {
			self.$new_requests_list.find('.RequestItem').each(function() {
				self.approveRequest(this);
			});
		});
		
		(function initSearch(page) {
			var $search_wrapper = page.$wrapper.find('.RequestsPageHeaderWrapper'),
				$search_input = page.$wrapper.find('.RequestsPageSearch');
			
			$search_input.on('keydown', function(e) {
				if (e.keyCode === 27) {
					$search_input.val('').blur();
				}
			}).on('input.Search', function() {
				var search_results = page[page.current_requests_list + '_requests_fuse'].search($(this).val());
				
				page['$' + page.current_requests_list + '_requests_list'].html(page.requestItemBuilder(search_results));
			}).on('blur.CloseSearchBar', function() {
				if ($search_input.val() === '') {
					$search_wrapper.removeClass('-open_search_bar');
					page['$' + page.current_requests_list + '_requests_list'].html(page.requestItemBuilder(page.requests[page.current_requests_list + '_requests']));
				}
			});
			
			page.$wrapper.find('.RequestsPageSearchButton').on('click.OpenSearchBar', function() {
				if (!$search_wrapper.hasClass('-open_search_bar')) {
					$search_wrapper.addClass('-open_search_bar');
				}
				if (!$search_input.is(':focus')) {
					$search_input.focus();
				}
			});
			
			page.Tabs.on('tabs:change', function() {
				$search_input.val('').blur();
			});
		})(this);
		
		this.Tabs.on('tabs:change', function() {
			self.current_requests_list = $(this).find('.Tab').filter('.'+__C.CLASSES.ACTIVE).data('requests_list_name');
		});
	};
	
	AdminEventRequestsPage.prototype.render = function() {
		var self = this;
		
		this.$wrapper.html(tmpl('event-admin-requests-page', {
			loader: (this.$loader = __APP.BUILD.loaderBlock()),
			request_detail: tmpl('event-admin-request-detail-no-select')
		}));
		
		this.$requests_detail = this.$wrapper.find('.RequestDetail');
		
		this.requests.fetchAllRequests(this.requests_fields).then(function() {
			var $lists;
			
			self.requests.sortBy('created_at');
			
			$lists = tmpl('event-admin-requests-lists', {
				new_requests: self.requestItemBuilder(self.requests.new_requests),
				approved_requests: self.requestItemBuilder(self.requests.approved_requests),
				rejected_requests: self.requestItemBuilder(self.requests.rejected_requests)
			});
			
			self.$loader.remove();
			
			self.$wrapper.find('.RequestsLists').html($lists);
			
			self.$wrapper.find('.OrdersTableWrapper').removeClass(__C.CLASSES.STATUS.DISABLED);
			
			self.$new_requests_list = $lists.find('.NewRequestsList');
			self.$approved_requests_list = $lists.find('.ApprovedRequestsList');
			self.$rejected_requests_list = $lists.find('.RejectedRequestsList');
			
			self.init();
		});
	};
	
	return AdminEventRequestsPage;
}()));