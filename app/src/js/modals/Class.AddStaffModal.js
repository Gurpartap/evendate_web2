/**
 * @requires Class.AbstractModal.js
 */
/**
 * @class
 * @extends AbstractModal
 */
AddStaffModal = extending(AbstractModal, (function() {
	/**
	 *
	 * @param {(number|string)} org_id
	 * @param {OneUser.ROLE} role
	 *
	 * @constructor
	 * @constructs AddStaffModal
	 */
	function AddStaffModal(org_id, role) {
		AbstractModal.call(this);
		this.org_id = org_id;
		this.organization = new OneOrganization(this.org_id);
		this.role = role;
	}
	
	/**
	 *
	 * @return {AddStaffModal}
	 */
	AddStaffModal.prototype.render = function() {
		this.content = tmpl('modal-add-staff-content', {
			modal_id: this.id,
			org_id: this.org_id,
			role: this.role
		});
		
		this.__render({
			width: 380,
			classes: [__C.CLASSES.FLOATING_MATERIAL, __C.CLASSES.MODAL_STATES.SIZE.TINY],
			content_classes: [__C.CLASSES.ALIGN.CENTER]
		});
		
		return this;
	};
	/**
	 *
	 * @return {AddStaffModal}
	 */
	AddStaffModal.prototype.init = function() {
		var self = this,
			$search_by_name_input = this.content.find('.SearchByName');
		
		bindRippleEffect(this.content);
		
		function format(user) {
			return __APP.BUILD.avatarBlocks(user, {
				avatar_classes: [__C.CLASSES.SIZES.X30, __C.CLASSES.UNIVERSAL_STATES.ROUNDED]
			}).outerHTML();
		}
		
		initSelect2($search_by_name_input, {
			width: '100%',
			placeholder: $search_by_name_input.attr('placeholder'),
			ajax: {
				url: '/api/v1/users/',
				dataType: 'JSON',
				data: function(searchTerm, pageNumber, context) {
					return {name: searchTerm};
				},
				results: function(remoteData, pageNumber, query) {
					var users = new UsersCollection();
					
					users.setData(remoteData.data);
					
					return {
						results: users,
						text: format
					};
				}
			},
			containerCssClass: '',
			dropdownCssClass: 'form_select2_drop',
			formatResult: format,
			formatSelection: format
		});
		
		this.content.find('.AddStaff').on('click', function() {
			var form_data = $(this).closest('form').serializeForm();
			
			self.organization.addStaff(form_data.user_id, form_data.role, function(user) {
				__APP.CURRENT_PAGE.$view.trigger('staff:add', [form_data.role, user]);
				self.hide();
			});
		});
		
		return this;
	};
	
	
	return AddStaffModal;
}()));