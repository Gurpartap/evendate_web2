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


function CropperModal(image_src, cropper_options) {
	if (image_src) {
		this.image_src = image_src;
		this.title = 'Кадрирование';
		this.content = tmpl('modal-cropper-content', {image_src: this.image_src});
		
		this.modal = tmpl('modal', {
			modal_type: 'CropperModal',
			modal_title: tmpl('modal-title', {title: this.title}),
			modal_content: this.content,
			modal_footer: tmpl('modal-footer', {
				footer_buttons: $()
					.add(tmpl('button', {classes: '-color_primary CropButton RippleEffect', title: 'Кадрировать'}))
					.add(tmpl('button', {classes: '-color_default DestroyCropButton RippleEffect', title: 'Отмена'}))
			})
		});
		this.cropper = this.modal.find('.Cropper');
		this.crop_button = this.modal.find('.CropButton');
		this.destroy_crop_button = this.modal.find('.DestroyCropButton');
		cropper_options = typeof cropper_options == 'object' ? cropper_options : {};
		this.options = $.extend({
			viewMode: 1,
			zoomable: false,
			zoomOnWheel: false
		}, cropper_options);
		Modal.pushModal(this);
	} else {
		throw Error('To initiate cropper you need to pass image source (image_src)')
	}
}
CropperModal.extend(Modal);


CropperModal.prototype.show = function() {
	var self = this;
	
	self.cropper.on('load', function() {
		self.cropper.cropper(self.options)
	}).attr('src', self.image_src);
	
	self.__superCall('show');
	
	self.modal.on('modal.beforeDestroy', function() {
		self.cropper.cropper('destroy');
		self.crop_button.off('click.Crop');
		self.destroy_crop_button.off('click.DestroyCrop');
	});
	
	self.crop_button.off('click.Crop').on('click.Crop', function() {
		self.crop();
		Modal.hide();
	});
	self.destroy_crop_button.off('click.DestroyCrop').on('click.DestroyCrop', function() {
		Modal.hide();
	});
};

CropperModal.prototype.crop = function() {
	var self = this;
	self.initer.trigger('crop', [self.cropper.cropper('getCroppedCanvas').toDataURL(), self.cropper.cropper('getData')]);
};


function MediaModal(src, format) {
	if (src) {
		this.src = src;
		this.format = format ? format : 'image';
		this.title = '';
		if (format == 'image') {
			this.content = tmpl('modal-image-media-content', {src: this.src});
		} else {
			
		}
		
		this.modal = tmpl('modal', {
			modal_type: 'MediaModal',
			modal_content_classes: '-no_padding ModalContent',
			modal_content: this.content
		});
		this.modal.on('modal.show', function() {
			Modal.modal_wrapper.addClass('-blackened');
		});
		this.modal.on('modal.close', function() {
			Modal.modal_wrapper.removeClass('-blackened');
		});
		Modal.pushModal(this);
	} else {
		throw Error('To open media you need to pass media source (src)')
	}
}
MediaModal.extend(Modal);

MediaModal.prototype.show = function() {
	var self = this,
		$window = $(window),
		window_max_w = $window.width() * 0.8,
		$media, real_w, real_h;
	
	self.modal.on('modal.show', function() {
		switch (this.format) {
			default:
			case 'image': {
				function onLoad() {
					real_w = $media.width();
					real_h = $media.height();
					
					self.modal.width((real_w > window_max_w) ? window_max_w : real_w);
					self.modal.height((real_w > window_max_w) ? (window_max_w * real_h / real_w) : real_h);
					$media.wrap($('<div>').addClass('img_holder'));
					self.adjustDestroyer();
				}
				
				$media = self.modal.find('img');
				if ($media.width()) {
					onLoad();
				} else {
					$media.on('load', onLoad)
				}
			}
		}
	});
	self.__superCall('show');
};


function MapModal(location, title) {
	if (location) {
		this.location = location;
		this.title = title ? title : 'Место проведения события';
		this.content = tmpl('modal-map-content', {location: this.location});
		
		this.modal = tmpl('modal', {
			modal_type: 'MapModal',
			modal_content_classes: '-no_padding',
			modal_title: tmpl('modal-title', {title: this.title}),
			modal_content: this.content
		});
		Modal.pushModal(this);
	} else {
		throw Error('To initiate map you need to pass location (location)')
	}
}
MapModal.extend(Modal);


/**
 * @abstract
 * @augments Modal
 * @param {(string|number)} entity_id
 * @param {string} title
 */
function AbstractUsersModal(entity_id, title) {
	this.title = title;
	this.entity_id = entity_id;
	this.entities_length = 30;
	this.disable_upload = false;
	this.users = new UsersCollection();
	this.is_first = true;
	
	this.modal = tmpl('modal', {
		modal_type: this.constructor.name,
		modal_content_classes: 'ModalContent',
		modal_title: tmpl('modal-title', {title: this.title})
	});
	this.content = this.modal.find('.ModalContent');
	
	if (this.constructor === AbstractUsersModal) {
		throw new Error("Can't instantiate abstract class!");
	}
}
AbstractUsersModal.extend(Modal);

AbstractUsersModal.prototype.show = function() {
	var self = this;
	
	Modal.modal_wrapper.data('block_scroll', false);
	Modal.modal_wrapper.on('scroll.uploadUsers', function() {
		if (!self.disable_upload) {
			if (Modal.modal_wrapper.height() + Modal.modal_wrapper.scrollTop() >= self.modal.height()) {
				if (!Modal.modal_wrapper.data('block_scroll')) {
					Modal.modal_wrapper.data('block_scroll', true);
					self.uploadUsers(function() {
						Modal.modal_wrapper.data('block_scroll', false);
						self.adjustDestroyer();
					});
				}
			}
		}
	});
	if (!this.users.length) {
		self.uploadUsers(function() {
			self.appear();
		});
		
	} else {
		self.appear();
	}
};

AbstractUsersModal.prototype.hide = function() {
	Modal.modal_wrapper.data('block_scroll', false).off('scroll.uploadUsers');
	this.disappear();
	Modal.hide();
};

AbstractUsersModal.prototype.uploadUsers = function(callback) {};

AbstractUsersModal.prototype.buildUsers = function(users, $wrapper) {
	var $users = $(),
		last_is_fiends = false,
		self = this;
	
	if (typeof $wrapper != 'undefined') {
		last_is_fiends = $wrapper.find('.UserTombstone').eq(-1).data('is_friend') == 'true';
	}
	
	users.forEach(function(user, i) {
		if ((self.is_first && !i) || last_is_fiends != user.is_friend) {
			$users = $users.add(tmpl('modal-users-divider', {label: user.is_friend ? 'Друзья' : 'Все'}));
			last_is_fiends = user.is_friend;
		}
		
		$users = $users.add(__APP.BUILD.userTombstones(user, {
			tombstone_classes: ['UserTombstone'],
			is_link: true,
			dataset: {is_friend: user.is_friend}
		}));
	});
	$wrapper.append($users);
	return $users;
};

AbstractUsersModal.prototype.afterUpload = function(users) {
	var self = this,
		$new_users;
	if (users.length) {
		$new_users = this.buildUsers(users, this.content);
		this.content.append($new_users);
		this.is_first = false;
		this.entities_length = 10;
		this.adjustDestroyer();
		bindPageLinks(this.modal);
		$new_users.on('click.hideModal', function() {
			self.hide();
		});
	} else {
		this.disable_upload = true;
	}
};


/**
 *
 * @constructor
 * @augments AbstractUsersModal
 * @param {(number|string)} event_id
 * @param {string} [title='Добавили в избранное']
 */
function FavoredModal(event_id, title) {
	if (event_id) {
		AbstractUsersModal.apply(this, [event_id, title ? title : 'Добавили в избранное']);
		this.ajax_data = {
			fields: ['is_friend'],
			order_by: '-is_friend,first_name'
		};
		
		Modal.pushModal(this);
	} else {
		throw Error('To open favored modal you need to pass event_id');
	}
}
FavoredModal.extend(AbstractUsersModal);

FavoredModal.prototype.uploadUsers = function(callback) {
	var self = this;
	
	this.users.fetchEventFavorites(this.entity_id, this.entities_length, this.ajax_data, function(users) {
		self.afterUpload(users);
		if (callback && typeof callback == 'function') {
			callback(users);
		}
	});
};


/**
 *
 * @constructor
 * @augments AbstractUsersModal
 * @param {(string|number)} organization_id
 * @param {string} [title='Подписались']
 */
function SubscribersModal(organization_id, title) {
	if (organization_id) {
		AbstractUsersModal.apply(this, [organization_id, title ? title : 'Подписались']);
		this.entity_id = organization_id;
		this.ajax_data = {
			fields: ['is_friend'],
			order_by: '-is_friend,first_name'
		};
		
		Modal.pushModal(this);
	} else {
		throw Error('To open favored modal you need to pass organization_id');
	}
}

SubscribersModal.prototype.uploadUsers = function(callback) {
	var self = this;
	
	this.users.fetchOrganizationSubscribers(this.entity_id, this.entities_length, this.ajax_data, function(users) {
		self.afterUpload(users);
		if (callback && typeof callback == 'function') {
			callback(users);
		}
	});
};


/**
 *
 * @constructor
 * @augments AbstractUsersModal
 * @param {(string|number)} organization_id
 * @param {string} [title='Редаторы']
 * @param {OneUser.ROLE} [specific_role]
 */
function EditorsModal(organization_id, title, specific_role) {
	AbstractUsersModal.apply(this, [organization_id, title ? title : 'Редакторы']);
	this.ajax_data = {
		order_by: 'role,first_name'
	};
	
	if (specific_role) {
		this.ajax_data.roles = specific_role;
	}
	
	
	Modal.pushModal(this);
}
EditorsModal.extend(AbstractUsersModal);

EditorsModal.prototype.uploadUsers = function(callback) {
	var self = this;
	
	this.users.fetchOrganizationStaff(this.entity_id, this.entities_length, this.ajax_data, function(users) {
		self.afterUpload(users);
		if (callback && typeof callback == 'function') {
			callback(users);
		}
	});
};

EditorsModal.prototype.buildUsers = function(users, $wrapper) {
	var $users = $(),
		last_role = false,
		labels = {
			admin: 'Администраторы',
			moderator: 'Модераторы'
		},
		self = this;
	
	if (typeof $wrapper != 'undefined') {
		last_role = $wrapper.find('.UserTombstone').last().data('role');
	}
	
	users.forEach(function(user, i) {
		if ((self.is_first && !i) || last_role != user.role) {
			$users = $users.add(tmpl('modal-users-divider', {label: labels[user.role]}));
			last_role = user.role;
		}
		
		$users = $users.add(__APP.BUILD.userTombstones(user, {
			tombstone_classes: ['UserTombstone'],
			is_link: true,
			dataset: {role: user.role}
		}));
	});
	$wrapper.append($users);
	return $users;
};