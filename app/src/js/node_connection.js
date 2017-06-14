if (window.location.hostname.indexOf('.test.evendate.ru') == -1) {
	window.socket = io.connect(window.location.protocol == 'https:' ? ':8443' : ':8080', {secure: window.location.protocol == 'https:'});
} else {
	window.socket = io({path: '/node/socket.io'});
}

socket.on('auth', function (data) {
	var organization_info;
	
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
			
			if (res.status) {
				var search_data = searchToObject();
				if (search_data.redirect_to) {
					window.location.href = search_data.redirect_to;
				} else if (data.hasOwnProperty('mobile') && data.mobile == true) {
					window.location.href = '/mobileAuthDone.php?token=' + data.token + '&email=' + data.email;
				} else {
					try {
						organization_info = sessionStorage.getItem('organization_info');
					} catch (e) {
						organization_info = '';
					}
					if (organization_info) {
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

socket.on('image.getFromURLDone', function (response) {
	if (response.error) {
		showNotifier({text: response.error, status: false});
	} else {
		ImgLoader.handleImgUpload(ImgLoader.current_load_context, response.data, response.filename);
	}
});
