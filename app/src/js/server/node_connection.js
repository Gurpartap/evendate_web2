if (window.location.hostname.indexOf('.test.evendate.ru') == -1) {
	window.socket = io.connect(window.location.protocol == 'https:' ? ':8443' : ':8080', {secure: window.location.protocol == 'https:'});
} else {
	window.socket = io({path: '/node/socket.io'});
}

socket.on('log', function (data) {
	console.log(data);
});

socket.on('image.getFromURLDone', function (response) {
	if (response.error) {
		showNotifier({text: response.error, status: false});
	} else {
		ImgLoader.handleImgUpload(ImgLoader.current_load_context, response.data, response.filename);
	}
});
