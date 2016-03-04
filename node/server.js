var server = require('http'),
	io = require('socket.io')(server),
	winston = require('winston'),
	mysql = require('mysql'),
	fs = require("fs"),
	request = require('request'),
	moment = require("moment"),
	config = JSON.parse(fs.readFileSync('../v1-config.json')),
	Utils = require('./utils'),
	smtpTransport = require('nodemailer-smtp-transport'),
	nodemailer = require('nodemailer'),
	CronJob = require('cron').CronJob,
	NotificationsManager = require('./notifications_manager.js'),
	ImagesResize = require('./image_resizer.js'),
	pg = require('pg'),
	sql = require('sql'),
	__rooms = {};


var config_index = process.env.ENV ? process.env.ENV : 'dev',
	real_config = config[config_index],
	connection = mysql.createPool(real_config.mysql_db),
	pg_conn_string = [
		'postgres://',
		real_config.db.user,
		':', real_config.db.password,
		'@', real_config.db.host,
		':', real_config.db.port,
		'/', real_config.db.database
	].join(''),
	logger = new (winston.Logger)({
		transports: [
			new (winston.transports.Console)(),
			new winston.transports.File({filename: __dirname + '/debug.log', json: false})
		],
		exceptionHandlers: [
			new (winston.transports.Console)(),
			new winston.transports.File({filename: __dirname + '/exceptions.log', json: false})
		],
		exitOnError: false
	}),
	notifications_factory = new NotificationsManager(real_config),
	cropper = new ImagesResize({}),
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
		"VK": {
			'GET_ACCESS_TOKEN': 'https://oauth.vk.com/access_token?client_id=' +
			real_config.VK.APP_ID +
			'&client_secret=' +
			real_config.VK.SECURE_KEY +
			'&redirect_uri=http://' + real_config.domain + '/vkOauthDone.php?mobile=',
			'GET_FRIENDS_LIST': 'https://api.vk.com/method/friends.get',
			'GET_USER_INFO': 'https://api.vk.com/method/users.get'
		},
		"GOOGLE": {
			'GET_ACCESS_TOKEN': 'https://www.googleapis.com/oauth2/v1/tokeninfo',
			'GET_USER_INFO': 'https://www.googleapis.com/plus/v1/people/me',
			'GET_FRIENDS_LIST': "https://www.googleapis.com/plus/v1/people/me/people/visible"
		},
		"FACEBOOK": {
			'GET_ACCESS_TOKEN': 'https://graph.facebook.com/v2.3/oauth/access_token?'
			+ 'client_id=' + real_config.facebook.app_id
			+ '&client_secret=' + real_config.facebook.app_secret
			+ '&redirect_uri=http://' + real_config.domain + '/fbOauthDone.php?mobile=',
			'GET_USER_INFO': 'https://graph.facebook.com/me',
			'GET_FRIENDS_LIST': "https://graph.facebook.com/me/friends"
		}
	},
	users = sql.define({
		name: 'users',
		columns: [
			'id',
			'first_name',
			'last_name',
			'middle_name',
			'email',
			'token',
			'created_at',
			'updated_at',
			'avatar_url',
			'vk_uid',
			'facebook_uid',
			'google_uid',
			'show_to_friends',
			'notify_in_browser',
			'blurred_image_url',
			'gender',
			'avatar_url_max'
		]
	}),
	vk_sign_in = sql.define({
		name: 'vk_sign_in',
		columns: [
			'id',
			'user_id',
			'uid',
			'access_token',
			'expires_in',
			'secret',
			'created_at',
			'updated_at',
			'photo_50',
			'photo_100',
			'photo_max_orig'
		]
	}),
	google_sign_in = sql.define({
		name: 'google_sign_in',
		columns: [
			'id',
			'user_id',
			'google_id',
			'access_token',
			'expires_in',
			'etag',
			'created_at',
			'updated_at',
			'cover_photo_url'
		]
	}),
	tokens = sql.define({
		name: 'tokens',
		columns: [
			'id',
			'user_id',
			'token',
			'created_at',
			'updated_at',
			'token_type',
			'expires_on',
			'device_token',
			'client_type',
			'device_name'
		]
	}),
	facebook_sign_in = sql.define({
		name: 'facebook_sign_in',
		columns: [
			'id',
			'user_id',
			'uid',
			'access_token',
			'expires_in',
			'created_at',
			'updated_at'
		]
	}),
	events = sql.define({
		name: 'facebook_sign_in',
		columns: [
			'id',
			'creator_id',
			'organization_id',
			'title',
			'description',
			'location',
			'location_uri',
			'event_start_date',
			'event_type_id',
			'notifications_schema_json',
			'created_at',
			'updated_at',
			'latitude',
			'longitude',
			'event_end_date',
			'image_vertical',
			'detail_info_url',
			'begin_time',
			'end_time',
			'events_pkey',
			'image_horizontal',
			'location_object',
			'dates_range',
			'images_domain',
			'status',
			'fts',
			'registration_required',
			'registration_till',
			'public_at',
			'is_free'
		]
	});

sql.setDialect('postgres');

pg.connect(pg_conn_string, function(err, client, done) {

	var handleError = function(err) {
		if (!err || err == null) return false;

		logger.info(err);
		if (client) {
			done(client);
		}
		return true;
	};

	if (handleError(err)) return;

	function sendNotifications() {

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
				' AND done = FALSE' +
				' AND events.status = TRUE',

			q_get_to_send_devices = 'SELECT DISTINCT tokens.*, users.notify_in_browser ' +
				' FROM tokens' +
				' INNER JOIN subscriptions ON subscriptions.user_id = tokens.user_id' +
				' INNER JOIN organizations ON organizations.id = subscriptions.organization_id' +
				' INNER JOIN users ON users.id = tokens.user_id' +
				' WHERE tokens.expires_on >= DATE_PART("epoch",NOW()) ::INT' +
				' AND organizations.id = $1' +
				' AND subscriptions.status = TRUE' +
				' ORDER BY tokens.id DESC',
			q_to_send_not_now_notification = 'SELECT DISTINCT tokens.*, users.notify_in_browser ' +
				' FROM tokens' +
				' INNER JOIN users ON users.id = tokens.user_id' +
				' INNER JOIN favorite_events ON favorite_events.user_id = users.id' +
				' WHERE tokens.expires_on >= >= DATE_PART("epoch",NOW()) ::INT' +
				' AND favorite_events.event_id = $1' +
				' AND favorite_events.status = 1' +
				' ORDER BY tokens.id DESC',
			q_ins_notification = 'INSERT INTO notifications(click_time, received, token_id, event_notification_id)' +
				' VALUES(NULL, FALSE, $1, $2)',
			q_data = null;

		client.query(q_get_events_notifications, function(err, rows) {
			if (err) {
				logger.error(err);
				return;
			}

			rows.forEach(function(event_notification) {

				if (event_notification['notification_type_name'] != 'notification-now') {
					event_notification['notification_suffix'] = Utils.lowerCaseFirstLetter(event_notification['notification_suffix']);
					q_get_to_send_devices = q_to_send_not_now_notification;
					q_data = [event_notification.event_id];
				} else {
					q_data = [event_notification.organization_id];
				}

				client.query('UPDATE events_notifications SET done = TRUE WHERE id = $1', [event_notification.id], function(err) {
					if (err) {
						logger.error(err);
					}
				});
				client.query(q_get_to_send_devices, q_data, function(errors, devices) {
					if (errors) {
						logger.error(errors);
						return;
					}
					devices.forEach(function(device) {

						if (err)logger.error(err);
						var notification_id = 0,
							_text = Utils.replaceTags(event_notification.notification_type_text, event_notification);
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


						if (device.client_type == 'browser') {
							if (device.notify_in_browser === 0) return;
							if (__rooms.hasOwnProperty(device.token) && __rooms[device.token].length > 0) {
								var connections = __rooms[device.token];
								connections.forEach(function(socket_id) {
									io.to(socket_id).emit('notification', data);
								});
							}
						} else {
							try {
								var notification = notifications_factory.create(data);
								notification.send(function(err) {
									handleError(err);
								});
							} catch(e) {
								handleError(e);
								handleError(e.stack);
							}

						}

						client.query(q_ins_notification, [device.id, event_notification.id], function(err, result) {
							handleError(err);
						});
					});
				});
			});
		});
	}

	function resizeImages() {

		var IMAGES_PATH = '../' + real_config.images.events_path + '/',
			LARGE_IMAGES = 'large',
			MEDIUM_IMAGES = 'medium',
			SMALL_IMAGES = 'small',
			VERTICAL_IMAGES = 'vertical',
			HORIZONTAL_IMAGES = 'horizontal',
			SQUARE_IMAGES = 'square';

		fs.readdir(IMAGES_PATH + LARGE_IMAGES, function(err, files) {
			if (err) {
				handleError(err);
				return;
			}
			getNotInFolder(files, MEDIUM_IMAGES, resizeImages);
			getNotInFolder(files, SMALL_IMAGES, resizeImages);
			getNotInFolder(files, SQUARE_IMAGES, function(size, diff) {
				diff = diff.splice(0, 100);
				diff.forEach(function(filename) {
					cropper.cropToSquare({
						source: IMAGES_PATH + LARGE_IMAGES + '/' + filename,
						destination: IMAGES_PATH + SQUARE_IMAGES + '/' + filename
					});
				})
			});
		});

		function resizeImages(size, diff) {
			if (diff.length == 0) return;

			var q_get_images =
				events
					.select(events.image_vertical, events.image_horizontal)
					.from(events)
					.where(
						events.image_vertical.in(diff)
					)
					.or(
						events.image_horizontal.in(diff)
					).toQuery();

			client.query(q_get_images, function(err, result) {
				if (err) {
					logger.error(err);
					return;
				}
				var verticals = [],
					horizontals = [];

				result.rows.forEach(function(item) {
					verticals.push(item.image_vertical);
					horizontals.push(item.image_horizontal);
				});

				diff = diff.splice(0, 100);

				diff.forEach(function(value) {
					var orientation;
					if (verticals.indexOf(value) != -1) {
						orientation = VERTICAL_IMAGES;
					} else {
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

		function getNotInFolder(large_files, size, cb) {
			fs.readdir(IMAGES_PATH + size, function(err, files) {
				if (err) {
					logger.error(err);
					return;
				}
				cb(size, Utils.getArrayDiff(files, large_files));
			});
		}
	}

	function blurImages() {

		var downloadImage = function(uri, path, callback) {
			request.head(uri, function(err) {
				if (err) {
					logger.log(err);
					return;
				}
				request(uri).pipe(fs.createWriteStream(path)).on('close', callback);
			});
		};

		var q_get_user_images = users
			.select(users.id, users.avatar_url)
			.from(users)
			.where(
				users.blurred_image_url.isNotNull().or(users.blurred_image_url.notEquals(users.avatar_url))
			)
			.and(users.avatar_url.isNotNull())
			.limit(30)
			.toQuery();

		client.query(q_get_user_images, function(err, result) {
			if (err) {
				logger.error(err);
				return;
			}

			result.rows.forEach(function(image) {
				var img_path = '../' + real_config.images.user_images + '/default/' + image.id + '.jpg',
					blurred_path = '../' + real_config.images.user_images + '/blurred/' + image.id + '.jpg';
				downloadImage(image.avatar_url, img_path, function() {
					cropper.blurImage({
						src: img_path,
						dest: blurred_path
					}, function(err) {
						if (err) {
							logger.log(err);
							return;
						}
						var q_upd_user = users
							.update({
								blurred_image_url: users.avatar_url
							}).where(users.id.equals(image.id));
						client.query(q_upd_user, function(err) {
							if (err) {
								handleError(err);
							}
						})
					});
				});
			});
		});
	}

	try {
		new CronJob('*/1 * * * *', function() {
			logger.info('Resizing start', 'START... ' + new Date().toString());
			resizeImages();
			blurImages();
		}, null, true);
	} catch(ex) {
		logger.error("CRON ERROR", "cron pattern not valid");
	}

	try {
		if (config_index == 'prod') {
			new CronJob('*/10 * * * *', function() {
				logger.info('Notifications start', 'START...' + new Date().toString());
				sendNotifications();
			}, null, true);
		}
	} catch(ex) {
		logger.error("CRON ERROR", "cron pattern not valid");
	}

	io.on('connection', function(socket) {

		var
			saveDataInDB = function(data) {
				function getUIDValues() {
					var result = {
						google_uid: null,
						facebook_uid: null,
						vk_uid: null
					};
					switch(data.type) {
						case 'vk':
						{
							result.vk_uid = data.access_data.user_id;
							break;
						}

						case 'google':
						case 'facebook':
						{
							result[data.type + '_uid'] = data.user_info.id;
							break;
						}
					}
					return result;
				}
				if (data.user_info.hasOwnProperty('sex')) {
					if (data.user_info.sex == 2) {
						data.user_info.gender = 'male';
					} else if (data.user_info.sex == 1) {
						data.user_info.gender = 'female';
					} else {
						data.user_info.gender = null;
					}
				}
				var UIDs = getUIDValues(),
					user_token = data.access_data.access_token + data.access_data.secret + Utils.makeId(),
					q_get_user =
						users
							.select(users.id, users.vk_uid, users.facebook_uid, users.google_uid)
							.where(users.email.equals(data.access_data.email))
							.or(users.vk_uid.isNotNull().and(users.vk_uid.equals(UIDs.vk_uid)))
							.or(users.facebook_uid.isNotNull().and(users.facebook_uid.equals(UIDs.facebook_uid)))
							.or(users.google_uid.isNotNull().and(users.google_uid.equals(UIDs.google_uid)))
							.toQuery(),
					user_to_ins = {
						first_name: data.user_info.first_name,
						last_name: data.user_info.last_name,
						email: data.access_data.email,
						token: user_token,
						avatar_url: data.user_info.photo_100,
						gender: data.user_info.gender
					};

				if (UIDs.vk_uid != null){
					user_to_ins['vk_uid'] = UIDs.vk_uid;
				}else if (UIDs.facebook_uid != null){
					user_to_ins['facebook_uid'] = UIDs.facebook_uid;
				}else if (UIDs.google_uid != null){
					user_to_ins['google_uid'] = UIDs.google_uid;
				}

				client.query(q_get_user, function(err, result) {

					if (handleError(err)) return;

					var q_user,
						q_user_mysql,
						is_new_user = result.rows.length == 0,
						user;

					if (is_new_user) {
						q_user = users.insert(user_to_ins).returning('id').toQuery();
					} else {
						user = result.rows[0];
						q_user = users.update(user_to_ins).where(users.id.equals(user.id)).returning('id').toQuery();
						q_user_mysql = 'UPDATE users SET' +
							' first_name = ' + connection.escape(data.user_info.first_name) + ',' +
							' last_name = ' + connection.escape(data.user_info.last_name) + ',' +
							' email = ' + connection.escape(data.access_data.email) + ',' +
							' token = ' + connection.escape(user_token) + ',' +
							' avatar_url = ' + connection.escape(data.user_info.photo_100) +
							(UIDs.vk_uid != null ? ', vk_uid = ' + connection.escape(UIDs.vk_uid) : '') +
							(UIDs.facebook_uid != null ? ', facebook_uid = ' + connection.escape(UIDs.facebook_uid) : '') +
							(UIDs.google_uid != null ? ', google_uid = ' + connection.escape(UIDs.google_uid) : '') +
							' WHERE id =' + connection.escape(user.id);
					}

					client.query(q_user, function(user_err, ins_result) {

						if(is_new_user){
							q_user_mysql = 'INSERT INTO users (id, first_name, last_name, email, token, avatar_url, vk_uid, facebook_uid, google_uid) ' +
								' VALUES (' + connection.escape(ins_result.rows[0].id) + ',' +
								' ' + connection.escape(data.user_info.first_name) + ',' +
								' ' + connection.escape(data.user_info.last_name) + ',' +
								' ' + connection.escape(data.access_data.email) + ',' +
								' ' + connection.escape(user_token) + ',' +
								' ' + connection.escape(data.user_info.photo_100) + ', ' +
								' ' + connection.escape(UIDs.vk_uid) + ', ' +
								' ' + connection.escape(UIDs.facebook_uid) + ', ' +
								' ' + connection.escape(UIDs.google_uid) + ')';
						}

						connection.query(q_user_mysql, function(err) {
							handleError(err);
						});

						if (handleError(user_err)) return;

						if (is_new_user) {
							user = {
								id: ins_result.rows[0].id,
								vk_uid: null,
								facebook_uid: null,
								google_uid: null
							};
						}

						var q_ins_sign_in;

						switch(data.type) {
							case 'vk':
							{
								var vk_data = {
									uid: data.access_data.user_id,
									access_token: data.access_data.access_token,
									expires_in: data.access_data.expires_in,
									secret: data.access_data.secret,
									photo_50: data.user_info.photo_50,
									photo_100: data.user_info.photo_100,
									photo_max_orig: data.user_info.photo_max_orig
								};
								if (user.vk_uid != null) { // user already exists in vk_users table
									q_ins_sign_in = vk_sign_in.update(vk_data).where(vk_sign_in.user_id.equals(user.id));
								} else {
									q_ins_sign_in = vk_sign_in.insert(vk_data);
								}
								break;
							}
							case 'google':
							{
									var google_data = {
										access_token: data.oauth_data.access_token,
										expires_in: data.oauth_data.expires_in,
										etag: data.user_info.etag,
										cover_photo_url: data.user_info.hasOwnProperty('cover') && data.user_info.cover.hasOwnProperty('coverPhoto') ? data.user_info.cover.coverPhoto.url : null,
									};
								if (user.google_uid != null) {
									q_ins_sign_in = google_sign_in.update(google_data).where(google_sign_in.user_id.equals(user.id));
								} else {
									q_ins_sign_in = google_sign_in.insert(google_data);
								}
								break;
							}
							case 'facebook':
							{
								var facebook_data = {
									uid: data.user_info.id,
									access_token: data.user_info.access_token,
									expires_in: data.access_data.expires_in
								};
								if (user.facebook_uid != null) {
									q_ins_sign_in = facebook_sign_in.update(facebook_data).where(facebook_sign_in.user_id.equals(user.id));
								} else {
									q_ins_sign_in = facebook_sign_in.insert(google_data);
								}
								break;
							}

						}


						var insertToken = function() {
							var token_type = (data.oauth_data.hasOwnProperty('mobile') && data.oauth_data.mobile == 'true') ? 'mobile' : 'bearer',
								token_time = token_type == 'mobile' ? moment().add(1, 'months').unix() : moment().add(10, 'days').unix(),
								q_ins_token = tokens.insert({
									token: user_token,
									user_id: user.id,
									token_type: token_type,
									expires_on: token_time
								}).returning('id').toQuery(),
								q_ins_token_mysql = 'INSERT INTO tokens(token, user_id, token_type, expires_on) VALUES(' +
									connection.escape(user_token) + ', ' +
									connection.escape(user.id) + ', ' +
									connection.escape(token_type) + ', ' +
									connection.escape(token_time) + ')';

							connection.query(q_ins_token_mysql, function(err) {
								handleError(err);
							});

							client.query(q_ins_token, function(err, res) {
								console.log(res);
								if (err) return handleError(err, 'CANT_INSERT_TOKEN');
								socket.emit('auth', {
									email: data.access_data.email,
									token: user_token,
									mobile: token_type == 'mobile',
									type: data.type
								});
							});
						};

						q_ins_sign_in = q_ins_sign_in.toQuery();

						client.query(q_ins_sign_in, function(sign_in_err, sign_in_result) {
							if (handleError(sign_in_err)) return;

							var q_ins_friends = '',
								uid_key_name;

							switch(data.type) {
								case 'vk':
								{
									q_ins_friends = "INSERT INTO vk_friends (user_id, friend_uid) VALUES ($1, $2) ON CONFLICT DO NOTHING";
									uid_key_name = 'uid';
									break;
								}
								case 'google':
								{
									q_ins_friends = "INSERT INTO google_friends (user_id, friend_uid) VALUES ($1, $2) ON CONFLICT DO NOTHING";
									uid_key_name = 'id';
									break;
								}
								case 'facebook':
								{
									q_ins_friends = "INSERT INTO facebook_friends (user_id, friend_uid) VALUES ($1, $2) ON CONFLICT DO NOTHING";
									uid_key_name = 'id';
									break;
								}
							}

							if (data.friends_data) {
								var query_name = data.type + '_q_ins_friends';
								data.friends_data.forEach(function(value) {
									client.query({
										text: q_ins_friends,
										name: query_name,
										values: [user.id, value[uid_key_name]]
									}, handleError);
								});
							}
							insertToken();
						});
					});
				});
			},
			getAccessToken = function(data, callback) {
				var req_params;
				switch(data.type) {
					case 'facebook':
					case 'vk':
					{
						req_params = {
							url: URLs[data.type.toUpperCase()].GET_ACCESS_TOKEN + (data.hasOwnProperty('mobile') && data.mobile == 'true') + '&code=' + data.code,
							json: true
						};
						logger.info('VK_GET_ACCESS_TOKEN', req_params);
						break;
					}
					case 'google':
					{
						if (callback instanceof Function) {
							callback(data);
						}
						return;
					}
				}


				request(req_params, function(e, i, res) {
					if (handleError(e)) return;
					if (callback instanceof Function) {
						callback(res);
					}
				});
			},
			getUsersInfo = function(data, callback) {
				var req_params;

				switch(data.type) {
					case 'vk':
					{
						req_params = {
							url: URLs[data.type.toUpperCase()].GET_USER_INFO,
							qs: {
								user_ids: data.user_id,
								fields: 'photo_50, sex, photo_100, photo_max, photo_max_orig, universities, education, activities, occupation, interests, music, movies, tv, books, games, about',
								name_case: 'nom'
							},
							json: true,
							headers: {
								'Accept-Language': 'ru,en-us'
							}
						};
						break;
					}
					case 'google':
					{
						req_params = {
							url: URLs[data.type.toUpperCase()].GET_USER_INFO,
							json: true,
							headers: {
								'Authorization': 'Bearer ' + data.access_token
							}
						};
						break;
					}
					case 'facebook':
					{
						req_params = {
							url: URLs[data.type.toUpperCase()].GET_USER_INFO,
							qs: {
								access_token: data.access_token,
								fields: 'first_name,last_name,email,middle_name,picture,gender,about,education,books,events,movies,groups'
							},
							json: true
						};
						break;
					}
				}
				request(req_params, function(e, i, res) {
					if (handleError(e)) return;

					if (callback instanceof Function) {
						callback(res);
					}
				});
			},
			getFriendsList = function(data, callback) {
				var FRIENDS_COUNT = 50000,
					req_params;


				switch(data.type) {
					case 'vk':
					{
						req_params = {
							url: URLs[data.type.toUpperCase()].GET_FRIENDS_LIST,
							json: true,
							qs: {
								order: 'hints',
								user_id: data.uid,
								fields: 'city, domain',
								count: FRIENDS_COUNT
							}
						};
						break;
					}
					case 'google':
					{
						req_params = {
							url: URLs[data.type.toUpperCase()].GET_FRIENDS_LIST,
							json: true,
							headers: {
								'Authorization': 'Bearer ' + data.access_token
							}
						};
						break;
					}
					case 'facebook':
					{
						req_params = {
							url: URLs[data.type.toUpperCase()].GET_FRIENDS_LIST,
							json: true,
							qs: {
								'access_token': data.access_token
							}
						};
						break;
					}
				}
				request(req_params, function(e, i, res) {
					if (handleError(e)) return;
					if (callback instanceof Function) {
						callback(res);
					}
				});
			},
			validateAccessToken = function(data, callback) {
				var req_params;
				switch(data.type) {
					case 'facebook':
					case 'vk':
					{
						if (callback instanceof Function) {
							logger.info(data.type + 'VALIDATE_ACCESS_TOKEN', data);
							callback(data);
							return;
						}
						break;
					}
					case 'google':
					{
						req_params = {
							json: true,
							url: URLs.GOOGLE.GET_ACCESS_TOKEN,
							qs: {
								access_token: data.access_token
							}
						};
						break;
					}
				}

				request(req_params, function(e, i, res) {
					if (handleError(e)) return;
					if (res.audience != real_config.google.web.client_id) {
						handleError({emit: 'TOKEN_CANT_BE_VERIFIED'});
					} else {
						if (callback instanceof Function) {
							callback(res);
						}
					}
				})
			};

		socket.on('auth.oauthDone', function(oauth_data) {
			try {
				getAccessToken(oauth_data, function(access_data) {
					access_data.type = oauth_data.type;

					validateAccessToken(access_data, function() {
						getUsersInfo(access_data, function(user_info) {

							if (oauth_data.type == 'vk') {
								logger.info('VK_USER_INFO_HAS_RESPONSE', user_info.hasOwnProperty('response'));
								logger.info('VK_USER_INFO_RESPONSE', user_info);
								user_info = user_info.response[0];
							}
							user_info.type = oauth_data.type;
							user_info.access_token = access_data.access_token;

							getFriendsList(user_info, function(friends_data) {
								if (oauth_data.type == 'vk') {
									friends_data = friends_data.response;
									if (access_data.email == null) {
										socket.emit('vk.needEmail');
										return;
									}
								} else if (oauth_data.type == 'google') {
									friends_data = friends_data.items;
								} else if (oauth_data.type == 'facebook') {
									friends_data = friends_data.data;
									user_info.photo_100 = user_info.hasOwnProperty('picture') ? user_info.picture.data.url : '';
								}
								saveDataInDB(Utils.composeFullInfoObject({
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
			} catch(e) {
				socket.emit('error.retry');
			}
		});

		socket.on('feedback', function(data) {
			logger.info(data);
			var html = '';
			for(var i in data) {
				if (data.hasOwnProperty(i)) {
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
			}, function(err, info) {
				if (err) {
					logger.info('EMAIL SEND ERROR', err);
				}
				logger.info('EMAIL_INFO', info);
			});
		});

		socket.on('session.set', function(token) {
			if (!__rooms.hasOwnProperty(token)) {
				__rooms[token] = [];
			}
			__rooms[token].push(socket.id);
			socket.token = token;
		});

		socket.on('disconnect', function() {
			if (__rooms.hasOwnProperty(socket.token)) {
				var index = __rooms[socket.token].indexOf(socket.id);
				__rooms[socket.token].splice(index, 1);
				if (__rooms[socket.token].length == 0) {
					delete __rooms[socket.token];
				}
			}
		});

		socket.on('image.getFromURL', function(url) {
			Utils.downloadImageFromUrl(request, url, function(error, data) {
				if (error) {
					handleError(error);
					return;
				}
				socket.emit('image.getFromURLDone', {error: error, data: data});
			});
		});

		socket.on('notification.received', function(data) {
			connection.query('UPDATE notifications ' +
				' SET received = 1, ' +
				' click_time = ' + (data.click_time ? connection.escape(data.click_time) : null) +
				' WHERE id = ' + connection.escape(data.notification_id), function(err) {
				if (err) logger.error(err);
			})
		});
	});

	io.listen(8080);

});