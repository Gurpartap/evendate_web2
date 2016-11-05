function Modal(title, content) {
	this.title = title;
	this.content = content;
	this.modal = tmpl('modal', {
		modal_title: this.title ? tmpl('modal-title', {title: this.title}) : '',
		modal_content: content,
		modal_footer: tmpl('modal-footer', {
			footer_buttons: tmpl('button', {
				classes: '-color_primary CloseModal RippleEffect',
				title: 'OK'
			})
		})
	});
	
	Modal.pushModal(this);
}
Modal.last_id = 0;
Modal.modals = {};
Modal.active_modal = undefined;
Modal.modal_destroyer = $('.modal_destroyer');
Modal.modal_wrapper = $('.modal_wrapper');

Modal.pushModal = function(modal) {
	modal.id = ++Modal.last_id;
	Modal.modals[modal.id] = modal;
	var keys = Object.keys(Modal.modals);
	if (keys.length > 5) {
		Modal.modals[keys[0]].destroy();
	}
	Modal.modal_wrapper.append(modal.modal);
};

Modal.hide = function() {
	if (Modal.active_modal !== undefined) {
		Modal.active_modal.hide();
	}
	$('body').removeClass('-open_modal');
};

Modal.bindCallModal = function($parent) {
	$parent = $parent ? $parent : $('body');
	$parent.find('.CallModal').not('.-Handled_CallModal').each(function() {
		var $this = $(this),
			title = $this.data('modal_title'),
			modal,
			modal_id,
			modal_type = $this.data('modal_type');
		
		$this.on('click.CallModal', function() {
			modal_id = $this.data('modal_id');
			if (Modal.modals.hasOwnProperty(modal_id)) {
				Modal.modals[modal_id].show();
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
								if (Modal.modals.hasOwnProperty(modal_id)) {
									if (Modal.modals[modal_id].image_src == $this.data('source_img')) {
										Modal.modals[modal_id].show();
									} else {
										Modal.modals[modal_id].destroy();
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
					default: {
						modal = new Modal(title, $this.data('modal_content'));
						break;
					}
				}
				$this.data('modal_id', modal.id);
				modal.initer = $this;
				modal.show();
			}
		});
	}).addClass('-Handled_CallModal');
};

Modal.prototype.show = function() {
	this.appear();
};

Modal.prototype.appear = function() {
	var self = this;
	
	Modal.modal_wrapper.append(this.modal);
	$('body').addClass('-open_modal');
	
	if (Modal.active_modal !== undefined) {
		Modal.active_modal.hide();
	}
	Modal.active_modal = this;
	
	self.modal.addClass('-faded').removeClass(__C.CLASSES.NEW_HIDDEN);
	self.adjustDestroyer();
	self.modal.trigger('modal.show');
	setTimeout(function() {
		self.modal.removeClass('-faded');
	}, 200);
	
	Modal.modal_destroyer.off('click.CloseModal').on('click.CloseModal', function() {
		$(this).off('click.CloseModal');
		Modal.hide();
	});
	self.modal.find('.CloseModal').off('click.CloseModal').on('click.CloseModal', function() {
		Modal.hide();
	});
	$(document).on('keyup.CloseModal', function(event) {
		if (event.keyCode == 27) {
			$(this).off('keyup.CloseModal');
			Modal.hide();
		}
	});
};

Modal.prototype.hide = function() {
	this.disappear();
};

Modal.prototype.disappear = function() {
	var self = this;
	Modal.active_modal = undefined;
	self.modal.addClass('-faded');
	setTimeout(function() {
		self.modal.addClass(__C.CLASSES.NEW_HIDDEN);
		self.modal.trigger('modal.close');
	}, 200);
};

Modal.prototype.destroy = function() {
	this.hide();
	Modal.modal_wrapper.trigger('modal.beforeDestroy');
	this.modal.remove();
	for (var key in Modal.modals) {
		if (Modal.modals[key] == this) {
			delete Modal.modals[key];
		}
	}
	Modal.modal_wrapper.trigger('modal.afterDestroy');
};

Modal.prototype.adjustDestroyer = function() {
	var html_height = $('html').height(),
		modal_height = this.modal.height() + 200;
	Modal.modal_destroyer.height((modal_height > html_height) ? modal_height : html_height);
};