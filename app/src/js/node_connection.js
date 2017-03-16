if (window.location.hostname.indexOf('.test.evendate.ru') == -1){
	window.socket = io.connect(window.location.protocol == 'https:' ? ':8443' : ':8080', {secure: window.location.protocol == 'https:'});
}else{
	window.socket = io({path: '/node/socket.io'});
}

socket.on('auth', function (data) {
	console.log(data);
	$.ajax({
		url: 'auth.php',
		type: 'POST',
		data: data,
		success: function (res) {
			
			if (yaCounter32442130) {
				switch (data.type) {
					case 'vk': {
						yaCounter32442130.reachGoal('VkAuthDone');
						break;
					}
					case 'facebook': {
						yaCounter32442130.reachGoal('FacebookAuthDone');
						break;
					}
					case 'google': {
						yaCounter32442130.reachGoal('GoogleAuthDone');
						break;
					}
				}
			}
			
			debugger;
			
			if (res.status) {
				if (data.hasOwnProperty('mobile') && data.mobile == true) {
					window.location.href = '/mobileAuthDone.php?token=' + data.token + '&email=' + data.email;
				} else {
					debugger;
					if (sessionStorage.getItem('organization_info')) {
						window.parent.location = '/add/organization';
					} else if (data.subscriptions_count == 0) {
						window.parent.location = '/onboarding';
					} else {
						window.parent.location = '/';
					}
				}
			} else {
				$('.panel-body.loader-demo').text(res.text);
				$('.panel-heading').hide();
			}
		}
	});
});

socket.on('log', function (data) {
	console.log(data);
});

socket.on('error.retry', function () {
	$('.panel-body.loader-demo').text('Во время загрузки данных произошла ошибка. Войдите с помощью другой социальной сети или попробуте чуть позже.');
	$('.panel-heading').hide();
});

socket.on('notification', function (data) {
	if (!Notify.needsPermission) {
		socket.emit('notification.received', {
			notification_id: data.notification_id
		});
		var myNotification = new Notify(data.note.payload.title, {
				body: data.note.body,
				icon: data.note.icon,
				tag: data.note.payload.event_id,
				timeout: 60,
				notifyClick: function () {
					$("<a>").attr("href", window.location.origin + '/event.php?id=' + data.note.payload.event_id).attr("target", "_blank")[0].click();
					socket.emit('notification.received', {
						notification_id: data.notification_id,
						click_time: moment().format(__C.DATE_FORMAT + ' HH:MM:SS')
					});
				}
			}
		);
		
		myNotification.show();
	} else if (Notify.isSupported()) {
		Notify.requestPermission();
	}
});

socket.on('image.getFromURLDone', function(response){
	if(response.error){
		showNotifier({text: response.error, status: false});
	} else {
		ImgLoader.handleImgUpload(ImgLoader.current_load_context, response.data, response.filename);
	}
});

socket.on('vk.getGroupsToPostDone', function(response){
	if(response.error){
		showNotifier({text: response.error, status: false});
	} else {
		var data = response.data.response,
			$groups = __APP.CURRENT_PAGE.$wrapper.find('#edit_event_vk_groups');
		if(data.length || data[0]){
			data.splice(0,1);
			data.forEach(function(option){
				$groups.append(tmpl('option', {
					val: option.gid,
					display_name: option.name,
					data: "data-img='"+option.photo+"'"
				}));
			});
			initSelect2($groups);
		} else {
			__APP.CURRENT_PAGE.$wrapper.find('#edit_event_to_public_vk').toggleStatus('disabled').prop('checked', false).trigger('change');
		}
	}
});

socket.on('vk.post.error', function(response){
	console.log(response);
	showNotifier({text: 'Не удалось опубликовать событие в группе vk. Пожалуйста, попробуйте еще раз.', status: false});
});
/*
socket.on('utils.registrationSaved', function (data) {
	var _data = $('#wizard-form').serializeForm();
	_data.uuid = data.uuid;
	cookies.setItem('open_add_organization', 1, Infinity);
	window.sessionStorage.setItem('organization_info', JSON.stringify(_data));
});*/
