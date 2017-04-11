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
		
		$search_by_name_input.select2({
			width: '100%',
			placeholder: $search_by_name_input.attr('placeholder'),
			ajax: {
				url: '/api/v1/users/',
				dataType: 'JSON',
				data: function(searchTerm, pageNumber, context) {
					return {name: searchTerm};
				},
				results: function(remoteData, pageNumber, query) {
					return {
						results: remoteData.data.map(function(user) {
							return {
								id: user.id,
								text: [user.last_name, user.first_name, user.middle_name].join(' ').trim()
							}
						})
					};
				}
			},
			dropdownCssClass: "form_select2_drop"
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