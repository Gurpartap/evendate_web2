

var server = require('http'),
	io = require('socket.io')(server),
	winston = require('winston'),
	rest = require('restler'),
	mysql = require('mysql'),
	_fs = require("fs"),
	request = require('request'),
	moment = require("moment"),
	config = {},
	smtpTransport = require('nodemailer-smtp-transport'),
	nodemailer = require('nodemailer'),
	CronJob = require('cron').CronJob,
	NotificationsManager = require('./notifications_manager.js'),
	images_resize = require('./image_resizer.js');
	__rooms = {};

config = _fs.readFileSync('../config.json');
config = JSON.parse(config);

var config_index = process.env.ENV ? process.env.ENV : 'dev',
	real_config = config[config_index],
	connection = mysql.createPool(real_config.db),
	logger = new (winston.Logger)({
		transports: [
			new (winston.transports.Console)(),
			new winston.transports.File({ filename: __dirname + '/debug.log', json: false })
		],
		exceptionHandlers: [
			new (winston.transports.Console)(),
			new winston.transports.File({ filename: __dirname + '/exceptions.log', json: false })
		],
		exitOnError: false
	}),
	notifications_factory = new NotificationsManager(real_config),
	cropper = config_index == 'local' ? '' : new images_resize({}),
	transporter = nodemailer.createTransport(smtpTransport({
		host: real_config.smtp.host,
		port: real_config.smtp.port,
		secure: false,
		auth: {
			user: real_config.smtp.user,
			pass: real_config.smtp.password
		}
	}));
	var URLs = {
		"VK":{
			'GET_ACCESS_TOKEN': 'https://oauth.vk.com/access_token?client_id='+
				real_config.VK.APP_ID+
				'&client_secret=' +
				real_config.VK.SECURE_KEY +
				'&redirect_uri=http://' + real_config.domain + '/vkOauthDone.php?mobile=',
			'GET_FRIENDS_LIST': 'https://api.vk.com/method/friends.get',
			'GET_USER_INFO': 'https://api.vk.com/method/users.get'
		},
		"GOOGLE":{
			'GET_ACCESS_TOKEN': 'https://www.googleapis.com/oauth2/v1/tokeninfo',
			'GET_USER_INFO': 'https://www.googleapis.com/plus/v1/people/me',
			'GET_FRIENDS_LIST': "https://www.googleapis.com/plus/v1/people/me/people/visible"
		},
		"FACEBOOK":{
			'GET_ACCESS_TOKEN': 'https://graph.facebook.com/v2.3/oauth/access_token?'
				+ 'client_id=' + real_config.facebook.app_id
				+ '&client_secret=' + real_config.facebook.app_secret
				+ '&redirect_uri=http://' + real_config.domain + '/fbOauthDone.php?mobile=',
			'GET_USER_INFO': 'https://graph.facebook.com/me?fields=first_name,last_name,email,middle_name,picture&access_token=',
			'GET_FRIENDS_LIST': "https://graph.facebook.com/me/friends?access_token="
		}
	};

function replaceTags(text, object){
	for (var key in object){
		if (object.hasOwnProperty(key)){
			var value = object[key];
			var key_expr = new RegExp('{'+key+'}', 'gim');
			if (value == null){
				value = '';
			}
			text = text ? text.replace(key_expr, value) : '';
		}
	}
	var not_handled_keys = new RegExp(/\{.*?\}/gim);
	text = text ? text.replace(not_handled_keys, '') : '';
	return text;
}

function sendNotifications(){

	if (config_index == 'test' || config_index == 'local') return;

	var q_get_events_notifications = 'SELECT DISTINCT ' +
			' events_notifications.*, events.organization_id,' +
			' events.title, organizations.short_name, organizations.notification_suffix, ' +
			' events.image_vertical, ' +
			' events.image_horizontal, ' +
			' events.organization_id, ' +
			' events.id as event_id, ' +
			' notification_types.type as notification_type_name,' +
			' notification_types.text as notification_type_text' +
			' FROM events_notifications' +
			' INNER JOIN events ON events_notifications.event_id = events.id' +
			' INNER JOIN notification_types ON notification_types.id = events_notifications.notification_type_id' +
			' INNER JOIN organizations ON organizations.id = events.organization_id' +
			' WHERE ' +
				' notification_time <= NOW() ' +
				' AND done = 0' +
				' AND events.status = 1',

		q_get_to_send_devices = 'SELECT DISTINCT tokens.*, users.notify_in_browser ' +
			' FROM tokens' +
			' INNER JOIN subscriptions ON subscriptions.user_id = tokens.user_id' +
			' INNER JOIN organizations ON organizations.id = subscriptions.organization_id' +
			' INNER JOIN users ON users.id = tokens.user_id' +
			' WHERE FROM_UNIXTIME(tokens.expires_on) >= NOW()' +
			' AND organizations.id = ?' +
			' AND subscriptions.status = 1' +
			' ORDER BY tokens.id DESC',
		q_ins_notification = 'INSERT INTO notifications(created_at, click_time, received, token_id, event_notification_id)' +
			' VALUES(NOW(), NULL, 0, ?, ?)';

	connection.query(q_get_events_notifications, function(err, rows){
		if (err){
			logger.error(err);
			return;
		}

		rows.forEach(function(event_notification){
			connection.query('UPDATE events_notifications SET done = 1 WHERE id = ' + connection.escape(event_notification.id), function(err){
				if (err){
					logger.error(err);
				}
			});
			if (event_notification['notification_type_name'] != 'notification-now'){
				event_notification['notification_suffix'] = event_notification['notification_suffix'].toLowerCase();
			}
			connection.query(q_get_to_send_devices, event_notification.organization_id, function(errors, devices){
				if (errors){
					logger.error(errors);
					return;
				}
				devices.forEach(function(device){
					connection.query(q_ins_notification, [device.id, event_notification.id], function(err, result){
						if (err)logger.error(err);
						var notification_id = result.insertId,
							_text = replaceTags(event_notification.notification_type_text, event_notification);
						var data = {
							device: device,
							note: {
								alert: _text,
								body: _text,
								icon: real_config.schema + real_config.domain + '/event_images/square/' + event_notification.image_vertical,
								payload: {
									type: 'event_notification',
									title: event_notification.title,
									event_id: event_notification.event_id,
									body: _text,
									icon: real_config.schema + real_config.domain + '/event_images/square/' + event_notification.image_vertical,
									organization_logo: real_config.schema + real_config.domain + '/organizations_images/small/' + event_notification.organization_id + '.png'
								}
							},
							type: device.client_type,
							notification_id: notification_id
						};


						if (device.client_type == 'browser'){
							if (device.notify_in_browser === 0) return;
							if (__rooms.hasOwnProperty(device.token) && __rooms[device.token].length > 0){
								var connections = __rooms[device.token];
								connections.forEach(function(socket_id){
									io.to(socket_id).emit('notification', data);
								});
							}
						}else{
							try{
								var notification = notifications_factory.create(data);
								notification.send(function(err){
									console.log(err);
								});
							}catch(e){
								logger.error(e);
								console.log(e.stack);
							}

						}
					});


				});
			});
		});
	});
}

function escapeArray(array){
	var _result = [];
	array.forEach(function(value){
		_result.push(connection.escape(value));
	});
	return _result.join(', ');
}

function getArrayDiff (a1, a2) {
	var a = [], diff = [];
	for (var i = 0; i < a1.length; i++) {
		a[a1[i]] = true;
	}
	for (i = 0; i < a2.length; i++) {
		if (a[a2[i]]) {
			delete a[a2[i]];
		} else {
			a[a2[i]] = true;
		}
	}
	for (var k in a) {
		if (a.hasOwnProperty(k)){
			diff.push(k);
		}
	}
	return diff;
}

function resizeImages(){

	var IMAGES_PATH = '../' + real_config.images.events_path + '/';
	var LARGE_IMAGES = 'large';
	var MEDIUM_IMAGES = 'medium';
	var SMALL_IMAGES = 'small';
	var VERTICAL_IMAGES = 'vertical';
	var HORIZONTAL_IMAGES = 'horizontal';
	var SQUARE_IMAGES = 'square';

	_fs.readdir(IMAGES_PATH + LARGE_IMAGES, function(err, files){
		if (err){
			logger.error(err);
			return;
		}
		getNotInFolder(files, MEDIUM_IMAGES, resizeImages);
		getNotInFolder(files, SMALL_IMAGES, resizeImages);
		getNotInFolder(files, SQUARE_IMAGES, function(size, diff){
			diff = diff.splice(0, 100);
			diff.forEach(function(filename){
				cropper.cropToSquare({
					source: IMAGES_PATH + LARGE_IMAGES + '/' + filename,
					destination: IMAGES_PATH + SQUARE_IMAGES + '/' + filename
				});
			})
		});
	});

	function resizeImages(size, diff){
		if (diff.length == 0) return;
		var q_get_images = 'SELECT image_vertical, image_horizontal ' +
			'FROM events ' +
			'WHERE image_vertical IN (' + escapeArray(diff) + ')' +
			'OR image_horizontal IN (' + escapeArray(diff) + ')';


		connection.query(q_get_images, function(err, rows) {
			if (err) {
				logger.error(err);
				return;
			}
			var verticals = [],
				horizontals = [];

			rows.forEach(function(item){
				verticals.push(item.image_vertical);
				horizontals.push(item.image_horizontal);
			});

			diff = diff.splice(0, 100);

			diff.forEach(function(value){
				var orientation;
				if (verticals.indexOf(value) != -1){
					orientation = VERTICAL_IMAGES;
				}else{
					orientation = HORIZONTAL_IMAGES;
				}
				cropper.resizeFile({
					source: IMAGES_PATH + LARGE_IMAGES + '/' + value,
					destination: IMAGES_PATH + size + '/' + value,
					orientation: orientation,
					size: size
				});
			});
		});
	}

	function getNotInFolder(large_files, size, cb){
		_fs.readdir(IMAGES_PATH + size, function(err, files) {
			if (err) {
				logger.error(err);
				return;
			}
			cb(size, getArrayDiff(files, large_files));
		});
	}
}

function blurImages(){

	var downloadImage = function(uri, path, callback){
		request.head(uri, function(err, res, body){
			if (err){
				logger.log(err);
				return;
			}
			request(uri).pipe(_fs.createWriteStream(path)).on('close', callback);
		});
	};

	var q_get_user_images = 'SELECT id, avatar_url ' +
		'   FROM users ' +
		'   WHERE ' +
		'   (users.blurred_image_url IS NULL OR users.blurred_image_url != avatar_url)' +
		'   AND users.avatar_url IS NOT NULL LIMIT 20';
	connection.query(q_get_user_images, function(err, rows){
		if (err){
			logger.error(err);
			return;
		}

		rows.forEach(function(image){
			var img_path = '../' + real_config.images.user_images + '/default/' + image.id + '.jpg',
				blurred_path = '../' + real_config.images.user_images + '/blurred/' + image.id + '.jpg';
			downloadImage(image.avatar_url, img_path, function(){
				cropper.blurImage({
					src: img_path,
					dest: blurred_path
				}, function(err){
					if (err){
						logger.log(err);
						return;
					}
					var q_upd_user = 'UPDATE users SET blurred_image_url = avatar_url WHERE id = ' + connection.escape(image.id);
					connection.query(q_upd_user, function(err){
						if (err){
							logger.error(err);
						}
					})
				});
			});
		});
	});
}

try {
	if (config_index != 'local'){
		new CronJob('*/2 * * * *', function(){
			logger.info('Resizing start', 'START... ' + new Date().toString());
			resizeImages();
			blurImages();
		}, null, true);
	}
} catch(ex) {
	logger.error("CRON ERROR","cron pattern not valid");
}

try {
	new CronJob('*/1 * * * *', function(){
		logger.info('Notifications start', 'START...' + new Date().toString());
		sendNotifications();
	}, null, true);
} catch(ex) {
	logger.error("CRON ERROR","cron pattern not valid");
}


io.on('connection', function (socket){

	function makeId(){
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		for( var i=0; i < 64; i++ ){
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	}

	function handleError(err, code){
		console.log(err, code);
		throw err;
	}

	function saveDataInDB(data, callback){

		function getUIDValues(){
			var result = {
				google_uid: null,
				facebook_uid: null,
				vk_uid: null
			};
			switch (data.type){
				case 'vk': {
					result.vk_uid = data.access_data.user_id;
					break;
				}
				case 'facebook': {
					result.facebook_uid = data.user_info.id;
					break;
				}
				case 'google': {
					result.google_uid = data.user_info.id;
					break;
				}
			}
			return result;
		}

		var UIDs = getUIDValues(),
			user_token = data.access_data.access_token + data.access_data.secret + makeId(),
			q_ins_user = 'INSERT INTO users(first_name, last_name, email, token, avatar_url, vk_uid, facebook_uid, google_uid, created_at) ' +
				' VALUES(' +
					escapeArray([ data.user_info.first_name, data.user_info.last_name, data.access_data.email,
						user_token, data.user_info.photo_100, UIDs.vk_uid, UIDs.facebook_uid, UIDs.google_uid]) +
				', NOW()) ' +
				'ON DUPLICATE KEY UPDATE ' +
				'first_name = ' + connection.escape(data.user_info.first_name) + ', ' +
				'last_name = ' + connection.escape(data.user_info.last_name) + ', ' +
				'avatar_url = ' + connection.escape(data.user_info.photo_100) + ', ' +
				'vk_uid = ' + (UIDs.vk_uid != null ? connection.escape(UIDs.vk_uid) : ' vk_uid ') + ', ' +
				'facebook_uid = ' + (UIDs.facebook_uid != null ?connection.escape(UIDs.facebook_uid) : ' facebook_uid ') + ', ' +
				'google_uid = ' + (UIDs.google_uid != null ?connection.escape(UIDs.google_uid) : ' google_uid ') + ', ' +
				'token = ' + connection.escape(user_token);
		logger.info(q_ins_user);
		connection.query(q_ins_user, function(user_err, result){
			socket.emit('log', data);
			if (user_err) return handleError(user_err, 'CANT_INSERT_USER');
			var user_id = result.insertId,
				q_ins_sign_in = '';

			switch(data.type){
				case 'vk': {
					q_ins_sign_in = 'INSERT INTO vk_sign_in(uid, access_token, expires_in, secret, user_id, photo_50,' +
						'   photo_100, photo_max_orig, created_at) ' +
						'VALUES(' +
						escapeArray([ data.access_data.user_id, data.access_data.access_token, data.access_data.expires_in,
							data.access_data.secret, user_id, data.user_info.photo_50, data.user_info.photo_100,
							data.user_info.photo_orig_max]) +
						', NOW()) ' +
						'ON DUPLICATE KEY UPDATE ' +
						'access_token = ' + connection.escape(data.access_data.access_token) + ', ' +
						'expires_in = ' + connection.escape(data.access_data.expires_in) + ', ' +
						'photo_50 = ' + connection.escape(data.user_info.photo_50) + ', ' +
						'photo_100 = ' + connection.escape(data.user_info.photo_100) + ', ' +
						'photo_max_orig = ' + connection.escape(data.user_info.photo_orig_max) + ', ' +
						'secret = ' + connection.escape(data.access_data.secret);
					break;
				}
				case 'google':{
					var cover_photo_url = data.user_info.hasOwnProperty('cover') && data.user_info.cover.hasOwnProperty('coverPhoto') ? data.user_info.cover.coverPhoto.url: null;
					q_ins_sign_in = 'INSERT INTO google_sign_in(google_id, access_token, expires_in, etag, ' +
					' user_id, cover_photo_url, created_at) ' +
					'VALUES(' +
						escapeArray([
								data.user_info.id,
								data.oauth_data.access_token,
								data.oauth_data.expires_in,
								data.user_info.etag,
								user_id,
								cover_photo_url]
						) +
					', NOW()) ' +
					'ON DUPLICATE KEY UPDATE ' +
					'access_token = ' + connection.escape(data.oauth_data.access_token) + ', ' +
					'expires_in = ' + connection.escape(data.oauth_data.expires_in) + ', ' +
					'etag = ' + connection.escape(data.user_info.etag) + ', ' +
					'cover_photo_url = ' + connection.escape(cover_photo_url);
					break;
				}
				case 'facebook':{
					q_ins_sign_in = 'INSERT INTO facebook_sign_in(uid, access_token, expires_in' +
						',user_id, created_at) ' +
					'VALUES(' +
						escapeArray([
								data.user_info.id,
								data.access_data.access_token,
								data.access_data.expires_in,
								user_id]
						) +
					', NOW()) ' +
					'ON DUPLICATE KEY UPDATE ' +
					'access_token = ' + connection.escape(data.access_data.access_token) + ', ' +
					'expires_in = ' + connection.escape(data.access_data.expires_in)
					break;
				}

			}


			function insertToken(){
				var token_type = (data.oauth_data.hasOwnProperty('mobile') && data.oauth_data.mobile == 'true') ? 'mobile' : 'bearer',
					token_time = token_type == 'mobile' ? moment().add(1, 'months').unix() : moment().add(10, 'days').unix(),
					created_at = moment().unix(),
					expires_on = token_time,
					q_ins_token = 'INSERT INTO tokens(token, user_id, token_type, expires_on, created_at) VALUES(' +
						escapeArray([
							user_token,
							user_id,
							token_type,
							expires_on]
						) + ', FROM_UNIXTIME(' + created_at + ')) ';
				connection.query(q_ins_token, function(err){
					if (err) return handleError(err, 'CANT_INSERT_TOKEN');
					socket.emit('auth', {
						email: data.access_data.email,
						token: user_token,
						mobile: token_type == 'mobile',
						type: data.type
					});
				});
			}

			/*INSERT IN TYPE_sing_in TABLE*/
			connection.query(q_ins_sign_in, function(sign_in_err, result){
				if (sign_in_err) return handleError(sign_in_err, 'CANT_INSERT_SIGN_IN_INFO');

				var created_at = moment().format("YYYY-MM-DD HH:mm:ss"),
					q_ins_friends = '',
					values = [],
					uid_key_name;

				switch (data.type){
					case 'vk':{
						q_ins_friends = "INSERT INTO vk_friends (user_id, friend_uid, created_at) VALUES ? " +
							" ON DUPLICATE KEY UPDATE created_at = NOW()";
						uid_key_name = 'uid';
						break;
					}
					case 'google':{
						q_ins_friends = "INSERT INTO google_friends (user_id, friend_uid, created_at) VALUES ? " +
							" ON DUPLICATE KEY UPDATE created_at = NOW()";
						uid_key_name = 'id';
						break;
					}
					case 'facebook':{
						q_ins_friends = "INSERT INTO facebook_friends (user_id, friend_uid, created_at) VALUES ? " +
							" ON DUPLICATE KEY UPDATE created_at = NOW()";
						uid_key_name = 'id';
						break;
					}
				}

				if (!data.friends_data || data.friends_data.length == 0){
					socket.emit('auth', {
						email: data.access_data.email,
						token: user_token,
						mobile: data.oauth_data.hasOwnProperty('mobile') && data.oauth_data.mobile == 'true'
					});
					insertToken();
				}else{
					data.friends_data.forEach(function(value){
						values.push([user_id, value[uid_key_name], created_at]);
					});
					connection.query(q_ins_friends, [values], function(err){
						if (err) return handleError(err, 'CANT_INSERT_FRIENDS');
						insertToken();
					});
				}
			});
		});
	}

	function getAccessToken(data, callback){
		var _url,
			req_params;

		switch (data.type){
			case 'vk':{
				_url = URLs.VK.GET_ACCESS_TOKEN + (data.hasOwnProperty('mobile') && data.mobile == 'true') + '&code=' + data.code;
				req_params = {};
				break;
			}
			case 'google':{
				if (callback instanceof Function){
					callback(data);
				}
				return;
			}
			case 'facebook':{
				_url = URLs.FACEBOOK.GET_ACCESS_TOKEN + (data.hasOwnProperty('mobile') && data.mobile == 'true') + '&code=' + data.code;
				req_params = {};
				break;
			}
		}


		rest
			.get(_url, req_params)
			.on('complete', function(res){
				if (callback instanceof Function){
					callback(res);
				}
			});
	}

	function getUsersInfo(data, callback){
		var _url = URLs[data.type.toUpperCase()].GET_USER_INFO,
			req_params;

		switch (data.type){
			case 'vk':{
				req_params = {
					query: {
						user_ids: data.user_id,
						fields: 'photo_50, photo_100, photo_max_orig',
						name_case: 'nom'
					},
					headers: {
						'Accept-Language': 'ru,en-us'
					}
				};
				break;
			}
			case 'google':{
				req_params = {
					headers: {
						'Authorization': 'Bearer ' + data.access_token
					}
				};
				break;
			}
			case 'facebook':{
				_url += data.access_token;
				req_params = {};
				break;
			}
		}
		rest
			.get(_url, req_params)
			.on('complete', function(res){
				if (callback instanceof Function){
					callback(res);
				}
			});
	}

	function getFriendsList(data, callback){
		var FRIENDS_COUNT = 5000,
			_url = URLs[data.type.toUpperCase()].GET_FRIENDS_LIST,
			req_params;


		switch (data.type){
			case 'vk':{
				req_params = {
					query: {
						order: 'hints',
						user_id: data.uid,
						fields: 'city, domain',
						count: FRIENDS_COUNT
					}
				};
				break;
			}
			case 'google':{
				req_params = {
					headers: {
						'Authorization': 'Bearer ' + data.access_token
					}
				};
				break;
			}
			case 'facebook':{
				_url += data.access_token;
				break;
			}
		}
		rest
			.get(_url, req_params)
			.on('complete', function(data){
				if (callback instanceof Function){
					callback(data);
				}
			});
	}

	function validateAccessToken(data, callback){
		var _url,
			req_params;

		switch (data.type){
			case 'vk':{
				if (callback instanceof Function){
					callback(data);
					return;
				}
				break;
			}
			case 'google':{
				_url = URLs.GOOGLE.GET_ACCESS_TOKEN + '?access_token=' + data.access_token;
				req_params = {};
				break;
			}
			case 'facebook':{
				if (callback instanceof Function){
					callback(data);
					return;
				}
				break;
			}
		}
		rest
			.get(_url , req_params)
			.on('complete', function(res){
				if (res.audience != real_config.google.web.client_id){
					console.log('ACCESS_TOKEN_CANT_BE_VERIFIED');
				}else{
					if (callback instanceof Function){
						callback(res);
					}
				}
			})
	}

	socket.on('auth.oauthDone', function(oauth_data){
		function composeFullInfoObject(data){
			switch (data.type){
				case 'vk': {
					return data;
				}
				case 'google': {
					data.access_data.access_token = data.oauth_data.access_token;
					data.access_data.secret = '';
					data.access_data.email = data.user_info.emails[0].value;
					data.user_info.first_name = data.user_info.name.givenName;
					data.user_info.last_name = data.user_info.name.familyName;
					data.user_info.photo_100 = data.user_info.image.url;
					return data;
				}
				case 'facebook': {
					data.access_data.email = data.user_info.email;
					return data;
				}
			}
		}


		try{
			getAccessToken(oauth_data, function(access_data){
				access_data.type = oauth_data.type;
				validateAccessToken(access_data, function(){
					getUsersInfo(access_data, function(user_info){
						if (oauth_data.type == 'vk'){user_info = user_info.response[0];}
						user_info.type = oauth_data.type;
						user_info.access_token = access_data.access_token;

						getFriendsList(user_info, function(friends_data) {
							if (oauth_data.type == 'vk') {
								friends_data = friends_data.response;
								if (access_data.email == null) {
									socket.emit('vk.needEmail');
									return;
								}
							}else if (oauth_data.type == 'google') {
								friends_data = friends_data.items;
							}else if (oauth_data.type == 'facebook') {
								friends_data = friends_data.data;
								user_info.photo_100 = user_info.hasOwnProperty('picture') ? user_info.picture.data.url : '';
							}

							saveDataInDB(composeFullInfoObject({
								oauth_data: oauth_data,
								access_data: access_data,
								user_info: user_info,
								friends_data: friends_data,
								type: access_data.type
							}));
						});
					});
				});
			})
		}catch(e){
			socket.emit('error.retry');
		}
	});

	socket.on('feedback', function(data){
		logger.info(data);
		var html = '';
		for (var i in data){
			if (data.hasOwnProperty(i)){
				html += '<p><strong>' + i + ':</strong> ' + data[i] + '</p>';
			}
		}
		transporter.sendMail({
			debug: true,
			connectionTimeout: 50000,
			greetingTimeout: 50000,
			socketTimeout: 50000,
			from: 'feedback@evendate.ru',
			to: 'kardinal3094@gmail.com',
			subject: 'Обратная связь!',
			html: html
		}, function(err, info){
			if (err){
				logger.info('EMAIL SEND ERROR', err);
			}
			logger.info('EMAIL_INFO', info);
		});
	});

	socket.on('session.set', function(token){
		if (!__rooms.hasOwnProperty(token)){
			__rooms[token] = [];
		}
		__rooms[token].push(socket.id);
		socket.token = token;
	});

	socket.on('disconnect', function () {
		if (__rooms.hasOwnProperty(socket.token)){
			var index = __rooms[socket.token].indexOf(socket.id);
			__rooms[socket.token].splice(index, 1);
			if (__rooms[socket.token].length == 0){
				delete __rooms[socket.token];
			}
		}
	});

	socket.on('event.resizeImages', resizeImages);

	socket.on('sendNotifications', sendNotifications);

	socket.on('blurImages', blurImages);

	socket.on('notification.received', function(data){
		connection.query('UPDATE notifications ' +
			' SET received = 1, ' +
			' click_time = ' + (data.click_time ? connection.escape(data.click_time) : null) +
			' WHERE id = ' + connection.escape(data.notification_id), function(err){
			if (err) logger.error(err);
		})
	});
});

io.listen(8080);