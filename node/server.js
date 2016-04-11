var server = require('http'),
    io = require('socket.io')(server),
    winston = require('winston'),
    mysql = require('mysql'),
    rest = require('restler'),
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
    crypto = require('crypto'),
    __rooms = {};

process.on('uncaughtException', function (err) {
    logger.info('Caught exception: ' + err);
});


var config_index = process.env.ENV ? process.env.ENV : 'dev',
    real_config = config[config_index],
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
            'GET_USER_INFO': 'https://api.vk.com/method/users.get',
            'GET_GROUPS_LIST': 'https://api.vk.com/method/groups.get',
            'GET_GROUPS_PART': '/method/groups.get',
            'POST_TO_WALL': 'http://api.vk.com/method/wall.post',
            'POST_TO_WALL_PART': '/method/wall.post',
            'GET_WALL_PHOTO_UPLOAD_SERVER': 'https://api.vk.com/method/photos.getWallUploadServer',
            'SAVE_WALL_PHOTO_UPLOAD': 'https://api.vk.com/method/photos.saveWallPhoto'
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
    EMIT_NAMES = {
        AUTH: {},
        VK_INTEGRATION: {
            GROUPS_TO_POST: 'vk.getGroupsToPost',
            GROUPS_TO_POST_DONE: 'vk.getGroupsToPostDone',
            POST_IT: 'vk.post',
            POST_ERROR: 'vk.post.error'
        },
        NOTIFICATIONS: {
            SEND: 'notifications.send'
        },
        UTILS: {}
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
    vk_posts = sql.define({
        name: 'vk_posts',
        columns: [
            'id',
            'creator_id',
            'event_id',
            'image_path',
            'message',
            'group_id'
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
    organizations = sql.define({
        name: 'organizations',
        columns: [
            'id',
            'img_url',
            'background_img_url',
            'background_medium_img_url',
            'background_small_img_url',
            'img_medium_url',
            'img_small_url'
        ]
    }),
    notifications = sql.define({
        name: 'notifications',
        columns: [
            'id',
            'event_notification_id',
            'token_id',
            'description',
            'created_at',
            'updated_at',
            'click_time',
            'received'
        ]
    }),
    view_notifications = sql.define({
        name: 'view_notifications',
        columns: [
            'uuid',
            'user_id',
            'event_id',
            'notification_time',
            'status',
            'notification_type_id',
            'notification_type',
            'done',
            'sent_time',
            'created_at',
            'updated_at'
        ]
    }),
    view_auto_notifications = sql.define({
        name: 'view_auto_notifications',
        columns: [
            'id',
            'event_id',
            'notification_type_id',
            'notification_time',
            'created_at',
            'updated_at',
            'status',
            'done',
            'new_status',
            'new_done',
            'organization_id',
            'title',
            'short_name',
            'notification_suffix',
            'image_square_vertical_url',
            'image_square_horizontal_url',
            'notification_type_name',
            'notification_type_text'
        ]
    }),
    subscriptions = sql.define({
        name: 'subscriptions',
        columns: [
            'id',
            'user_id',
            'organization_id',
            'status'
        ]
    }),
    events_notifications = sql.define({
        name: 'events_notifications',
        columns: [
            'id',
            'event_id',
            'notification_type_id',
            'notification_time',
            'created_at',
            'updated_at',
            'status',
            'done'
        ]
    }),
    view_auto_notifications_devices = sql.define({
        name: 'subscriptions',
        columns: [
            'id',
            'token',
            'user_id',
            'created_at',
            'updated_at',
            'token_type',
            'expires_on',
            'device_token',
            'client_type',
            'device_name',
            'refresh_token',
            'organization_id',
            'uuid',
            'notify_in_browser'
        ]
    }),
    view_events = sql.define({
        name: 'view_events',
        columns: [
            'id',
            'title',
            'creator_id',
            'description',
            'detail_info_url',
            'begin_time',
            'end_time',
            'latitude',
            'longitude',
            'location',
            'min_price',
            'public_at',
            'registration_required',
            'registration_till',
            'is_free',
            'is_same_time',
            'organization_id',
            'link',
            'status',
            'image_vertical_url',
            'image_horizontal_url',
            'image_vertical_large_url',
            'image_horizontal_large_url',
            'image_square_vertical_url',
            'image_square_horizontal_url',
            'image_horizontal_medium_url',
            'image_vertical_medium_url',
            'image_vertical_small_url',
            'image_horizontal_small_url',
            'vk_image_url',
            'organization_logo_medium_url',
            'organization_logo_large_url',
            'organization_logo_small_url',
            'organization_name',
            'organization_type_name',
            'organization_short_name',
            'nearest_event_date',
            'first_event_date',
            'last_event_date',
            'created_at',
            'updated_at',
            'favored_users_count'
        ]
    }),
    events = sql.define({
        name: 'events',
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

pg.connect(pg_conn_string, function (err, client, done) {

    var handleError = function (err, emit_name, callback) {
        if (!err || err == null) return false;

        logger.info(err);
        if (client) {
            done(client);
        }
        if (callback instanceof Function) {
            callback(err);
            return true;
        }
        if (emit_name) {
            socket.emit(emit_name, {error: err});
        }
        return true;
    };

    if (handleError(err)) return;

    function sendUserNotifications() {

    }

    function sendNotifications() {

        // if (config_index == 'test' || config_index == 'local')
        // 	return;

        var q_get_events_notifications =
                view_auto_notifications
                    .select(
                        view_auto_notifications.id,
                        view_auto_notifications.event_id,
                        view_auto_notifications.notification_type_id,
                        view_auto_notifications.notification_time,
                        view_auto_notifications.status,
                        view_auto_notifications.done,
                        view_auto_notifications.organization_id,
                        view_auto_notifications.title,
                        view_auto_notifications.short_name,
                        view_auto_notifications.notification_suffix,
                        view_auto_notifications.image_square_vertical_url,
                        view_auto_notifications.image_square_horizontal_url,
                        view_auto_notifications.notification_type_name,
                        view_auto_notifications.notification_type_text
                    )
                    .from(view_auto_notifications).limit(5).toQuery(),
            ins_values = {
                click_time: null,
                received: false,
                event_notification_id: null,
                token_id: null
            };

        client.query(q_get_events_notifications, function (err, rows) {
            if (handleError(err))return;

            rows.rows.forEach(function (event_notification) {

                var
                    q_get_to_send_devices = view_auto_notifications_devices.select(
                        view_auto_notifications_devices.id,
                        view_auto_notifications_devices.token,
                        view_auto_notifications_devices.user_id,
                        view_auto_notifications_devices.created_at,
                        view_auto_notifications_devices.updated_at,
                        view_auto_notifications_devices.token_type,
                        view_auto_notifications_devices.expires_on,
                        view_auto_notifications_devices.device_token,
                        view_auto_notifications_devices.client_type,
                        view_auto_notifications_devices.device_name,
                        view_auto_notifications_devices.refresh_token,
                        view_auto_notifications_devices.uuid,
                        view_auto_notifications_devices.notify_in_browser
                    ).where(view_auto_notifications_devices.organization_id.equals(event_notification.organization_id))
                        .toQuery(),
                    q_upd_events_notifications = events_notifications
                        .update({
                            done: true
                        })
                        .where(events_notifications.id.equals(event_notification.id)).toQuery();


                client.query(q_get_to_send_devices, function (errors, devices) {
                    if (handleError(errors))return;

                    devices.forEach(function (device) {

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
                                    icon: event_notification,
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
                                connections.forEach(function (socket_id) {
                                    io.to(socket_id).emit('notification', data);
                                });
                            }
                        } else {
                            try {
                                var notification = notifications_factory.create(data);
                                notification.send(function (err) {
                                    handleError(err);
                                });
                            } catch (e) {
                                handleError(e);
                                handleError(e.stack);
                            }

                        }

                        client.query(q_ins_notification, [device.id, event_notification.id], function (err, result) {
                            handleError(err);
                        });
                    });
                });
                client.query(q_upd_events_notifications, function (err) {
                    handleError(err);
                });
            });
        });
    }

    function resizeImages() {

        var IMAGES_PATH = '../' + real_config.images.events_path + '/',
            ORGANIZATIONS_IMAGES_PATH = '../' + real_config.images.organizations_images + '/',
            LARGE_IMAGES = 'large',
            MEDIUM_IMAGES = 'medium',
            SMALL_IMAGES = 'small',
            VERTICAL_IMAGES = 'vertical',
            HORIZONTAL_IMAGES = 'horizontal',
            SQUARE_IMAGES = 'square',
            BACKGROUND_IMAGES = 'backgrounds',
            LOGO_IMAGES = 'logos',
            q_get_changed_images = organizations
                .select(organizations.id, organizations.background_img_url, organizations.img_url)
                .from(organizations)
                .where(
                    organizations.background_img_url.notEquals(organizations.background_medium_img_url)
                )
                .or(
                    organizations.background_img_url.notEquals(organizations.background_small_img_url)
                )
                .or(
                    organizations.img_url.notEquals(organizations.img_medium_url)
                )
                .or(
                    organizations.img_url.notEquals(organizations.img_small_url)
                ).limit(3).toQuery();

        fs.readdir(IMAGES_PATH + LARGE_IMAGES, function (err, files) {
            if (err) {
                handleError(err);
                return;
            }


            getNotInFolder(IMAGES_PATH, files, MEDIUM_IMAGES, resizeImages);
            getNotInFolder(IMAGES_PATH, files, SMALL_IMAGES, resizeImages);
            getNotInFolder(IMAGES_PATH, files, SQUARE_IMAGES, function (size, diff) {
                diff = diff.splice(0, 100);
                diff.forEach(function (filename) {
                    cropper.cropToSquare({
                        source: IMAGES_PATH + LARGE_IMAGES + '/' + filename,
                        destination: IMAGES_PATH + SQUARE_IMAGES + '/' + filename
                    });
                })
            });
        });


        client.query(q_get_changed_images, function (err, result) {
            //if (config_index == 'local' || config_index == 'test' || config_index == 'test')
            return;
            if (handleError(err)) return;
            result.rows.forEach(function (obj) {

                var logo_img_path = ORGANIZATIONS_IMAGES_PATH + LOGO_IMAGES + '/' + LARGE_IMAGES + '/' + obj.img_url,
                    background_img_path = ORGANIZATIONS_IMAGES_PATH + BACKGROUND_IMAGES + '/' + LARGE_IMAGES + '/' + obj.background_img_url

                fs.stat(background_img_path, function (err, stats) {
                    if (handleError(err)) return;
                    if (stats.isFile() == false) {
                        handleError({
                            name: 'NOT_A_FILE',
                            path: background_img_path
                        });
                        return;
                    }
                    cropper.resizeFile({
                        source: background_img_path,
                        destination: ORGANIZATIONS_IMAGES_PATH + BACKGROUND_IMAGES + '/' + MEDIUM_IMAGES + '/' + obj.background_img_url,
                        type: 'organization',
                        orientation: BACKGROUND_IMAGES,
                        size: MEDIUM_IMAGES
                    });

                    cropper.resizeFile({
                        source: background_img_path,
                        destination: ORGANIZATIONS_IMAGES_PATH + BACKGROUND_IMAGES + '/' + SMALL_IMAGES + '/' + obj.background_img_url,
                        type: 'organization',
                        orientation: BACKGROUND_IMAGES,
                        size: SMALL_IMAGES
                    });


                    var q_upd_organization = organizations.update({
                        background_medium_img_url: obj.background_img_url,
                        background_small_img_url: obj.background_img_url
                    }).where(organizations.id.equals(obj.id)).toQuery();

                    client.query(q_upd_organization, handleError);
                });

                fs.stat(logo_img_path, function (err, stats) {
                    if (handleError(err)) return;
                    if (stats.isFile() == false) {
                        handleError({
                            name: 'NOT_A_FILE',
                            path: logo_img_path
                        });
                        return;
                    }
                    cropper.resizeFile({
                        source: logo_img_path,
                        destination: ORGANIZATIONS_IMAGES_PATH + BACKGROUND_IMAGES + '/' + MEDIUM_IMAGES + '/' + obj.background_img_url,
                        type: 'organization',
                        orientation: LOGO_IMAGES,
                        size: MEDIUM_IMAGES
                    });

                    cropper.resizeFile({
                        source: logo_img_path,
                        destination: ORGANIZATIONS_IMAGES_PATH + BACKGROUND_IMAGES + '/' + SMALL_IMAGES + '/' + obj.background_img_url,
                        type: 'organization',
                        orientation: LOGO_IMAGES,
                        size: SMALL_IMAGES
                    });


                    var q_upd_organization = organizations.update({
                        img_medium_url: obj.img_url,
                        img_small_url: obj.img_url
                    }).where(organizations.id.equals(obj.id)).toQuery();

                    client.query(q_upd_organization, handleError);
                });
            })
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


            client.query(q_get_images, function (err, result) {
                if (err) {
                    logger.error(err);
                    return;
                }
                var verticals = [],
                    horizontals = [];

                result.rows.forEach(function (item) {
                    verticals.push(item.image_vertical);
                    horizontals.push(item.image_horizontal);
                });

                diff = diff.splice(0, 100);

                diff.forEach(function (value) {
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

        function getNotInFolder(path, large_files, size, cb) {
            fs.readdir(path + size, function (err, files) {
                if (err) {
                    logger.error(err);
                    return;
                }
                cb(size, Utils.getArrayDiff(files, large_files));
            });
        }
    }

    function blurImages() {

        var downloadImage = function (uri, path, callback) {
            request.head(uri, function (err) {
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
            .limit(5)
            .toQuery();

        client.query(q_get_user_images, function (err, result) {
            if (err) {
                logger.error(err);
                return;
            }
            result.rows.forEach(function (image) {
                var img_path = '../' + real_config.images.user_images + '/default/' + image.id + '.jpg',
                    blurred_path = '../' + real_config.images.user_images + '/blurred/' + image.id + '.jpg';
                downloadImage(image.avatar_url, img_path, function () {
                    cropper.blurImage({
                        src: img_path,
                        dest: blurred_path
                    }, function (err) {
                        if (err) {
                            logger.log(err);
                            return;
                        }
                        var q_upd_user = users
                            .update({
                                blurred_image_url: users.avatar_url
                            }).where(users.id.equals(image.id)).toQuery();
                        client.query(q_upd_user, function (err) {
                            if (err) {
                                handleError(err);
                            }
                        })
                    });
                });
            });
        });
    }

    function getVkGroups(user_data, filter, cb) {
        var request_data = [
                'access_token=' + user_data.access_token,
                'extended=1',
                'fields=can_post,is_admin,admin_level,type',
                'filter=' + (filter == 'can_post' ? 'admin, editor, moder' : '')
            ],
            sig = crypto.createHash('md5').update(URLs.VK.GET_GROUPS_PART + '?' + request_data.join('&') + user_data.secret).digest("hex"),
            url = URLs.VK.GET_GROUPS_LIST + '?' + request_data.join('&') + '&sig=' + sig,
            req_params = {
                json: true,
                headers: {
                    'Accept-Language': 'ru,en-us'
                }
            };

        rest.get(url, req_params)
            .on('complete', function (result) {
                if (result instanceof Error) {
                    handleError(result);
                    this.retry(3000); // try again after 5 sec
                } else {
                    cb(result);
                }
            });

    }

    try {
        new CronJob('*/1 * * * *', function () {
            resizeImages();
            blurImages();
            sendUserNotifications();
        }, null, true);
    } catch (ex) {
        logger.error("CRON ERROR", "cron pattern not valid");
    }

    try {
        if (config_index == 'prod') {
            new CronJob('*/10 * * * *', function () {
                logger.info('Notifications start', 'START...' + new Date().toString());
                sendNotifications();
            }, null, true);
        }
    } catch (ex) {
        logger.error("CRON ERROR", "cron pattern not valid");
    }

    io.on('connection', function (socket) {

        var
            saveDataInDB = function (data) {
                socket.retry_count = 0;
                function getUIDValues() {
                    var result = {
                        google_uid: null,
                        facebook_uid: null,
                        vk_uid: null
                    };
                    switch (data.type) {
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

                if (UIDs.vk_uid != null) {
                    user_to_ins['vk_uid'] = UIDs.vk_uid;
                } else if (UIDs.facebook_uid != null) {
                    user_to_ins['facebook_uid'] = UIDs.facebook_uid;
                } else if (UIDs.google_uid != null) {
                    user_to_ins['google_uid'] = UIDs.google_uid;
                }

                client.query(q_get_user, function (err, result) {

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
                    }

                    client.query(q_user, function (user_err, ins_result) {

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

                        switch (data.type) {
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


                        var insertToken = function () {
                            var token_type = (data.oauth_data.hasOwnProperty('mobile') && data.oauth_data.mobile == 'true') ? 'mobile' : 'bearer',
                                token_time = token_type == 'mobile' ? moment().add(1, 'months').unix() : moment().add(10, 'days').unix(),
                                q_ins_token = tokens.insert({
                                    token: user_token,
                                    user_id: user.id,
                                    token_type: token_type,
                                    expires_on: token_time
                                }).returning('id').toQuery();

                            client.query(q_ins_token, function (err) {
                                if (handleError(err, 'CANT_INSERT_TOKEN')) {
                                    socket.emit('error.retry');
                                }
                                socket.emit('auth', {
                                    email: data.access_data.email,
                                    token: user_token,
                                    mobile: token_type == 'mobile',
                                    type: data.type
                                });
                            });
                        };


                        client.query(q_ins_sign_in.returning('id').toQuery(), function (sign_in_err, sign_in_result) {
                            if (handleError(sign_in_err)) {
                                logger.info(q_ins_sign_in.returning('id').toQuery().text);
                                socket.emit('error.retry');
                                return;
                            }

                            var q_ins_friends = '',
                                uid_key_name;

                            switch (data.type) {
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
                                data.friends_data.forEach(function (value) {
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
            getAccessToken = function (data, callback) {
                var req_params;
                switch (data.type) {
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
                            callback(null, data);
                        }
                        return;
                    }
                }


                rest.get(req_params.url, req_params)
                    .on('complete', function (result) {
                        if (result instanceof Error) {
                            handleError(result);
                            this.retry(3000); // try again after 5 sec
                        } else {
                            callback(null, result);
                        }
                    });

            },
            getUsersInfo = function (data, callback) {
                var req_params;

                switch (data.type) {
                    case 'vk':
                    {
                        req_params = {
                            url: URLs[data.type.toUpperCase()].GET_USER_INFO,
                            query: {
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
                            query: {
                                access_token: data.access_token,
                                fields: 'first_name,last_name,email,middle_name,picture,gender,about,education,books,events,movies,groups'
                            },
                            json: true
                        };
                        break;
                    }
                }

                rest.get(req_params.url, req_params)
                    .on('complete', function (result) {
                        if (result instanceof Error) {
                            handleError(result);
                            this.retry(3000); // try again after 5 sec
                        } else {
                            var e = {};
                            if (data.type == 'vk') {
                                if (result) {
                                    if (result.hasOwnProperty('response') == false) {
                                        e.text = 'THERE_IS_NO_RESPONSE';
                                    } else {
                                        e = null;
                                    }
                                } else {
                                    e.text = 'THERE_IS_NO_RESPONSE';
                                }
                            }
                            callback(e, result);
                        }

                    });
            },
            getFriendsList = function (data, callback) {
                var FRIENDS_COUNT = 50000,
                    req_params;


                switch (data.type) {
                    case 'vk':
                    {
                        req_params = {
                            url: URLs[data.type.toUpperCase()].GET_FRIENDS_LIST,
                            json: true,
                            query: {
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
                            query: {
                                'access_token': data.access_token
                            }
                        };
                        break;
                    }
                }
                rest.get(req_params.url, req_params)
                    .on('complete', function (result) {
                        if (result instanceof Error) {
                            handleError(result);
                            this.retry(3000); // try again after 5 sec
                        } else {
                            callback(null, result);
                        }
                    });
            },
            validateAccessToken = function (data, callback) {
                var req_params;
                switch (data.type) {
                    case 'facebook':
                    case 'vk':
                    {
                        if (callback instanceof Function) {
                            callback(null, data);
                            return;
                        }
                        break;
                    }
                    case 'google':
                    {
                        req_params = {
                            json: true,
                            url: URLs.GOOGLE.GET_ACCESS_TOKEN,
                            query: {
                                access_token: data.access_token
                            }
                        };
                        break;
                    }
                }


                rest.get(req_params.url, req_params)
                    .on('complete', function (result) {
                        if (result instanceof Error) {
                            handleError(result);
                            this.retry(3000); // try again after 5 sec
                        } else {
                            var e = null;
                            if (result.audience != real_config.google.web.client_id) {
                                e = {emit: 'TOKEN_CANT_BE_VERIFIED'};
                            }
                            callback(e, result);
                        }
                    });
            },
            afterAccessToken = function (oauth_data, access_data, retry_count) {
                validateAccessToken(access_data, function (validate_error) {
                    if (handleError(validate_error)) {
                        setTimeout(function () {
                            authTry(oauth_data, retry_count, access_data);
                        }, 1000 * retry_count);
                        return;
                    }
                    getUsersInfo(access_data, function (user_info_error, user_info) {

                        if (handleError(user_info_error)) {
                            setTimeout(function () {
                                authTry(oauth_data, retry_count, access_data);
                            }, 1000 * retry_count);
                            return;
                        }

                        if (oauth_data.type == 'vk') {
                            if (user_info.hasOwnProperty('response') == false || user_info.response.length == 0) {
                                setTimeout(function () {
                                    authTry(oauth_data, retry_count, access_data);
                                }, 1000 * retry_count);
                                return;
                            }
                            user_info = user_info.response[0];
                        }
                        user_info.type = oauth_data.type;
                        user_info.access_token = access_data.access_token;

                        getFriendsList(user_info, function (friends_error, friends_data) {
                            if (handleError(friends_error)) {
                                setTimeout(function () {
                                    authTry(oauth_data, retry_count, access_data);
                                }, 1000 * retry_count);
                                return;
                            }
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
            },
            authTry = function (oauth_data, retry_count, access_data) {
                console.log(oauth_data);
                socket.retry_count++;
                var timeout = 500;
                logger.info('Auth try: ' + socket.retry_count);
                if (socket.retry_count > 5) {
                    socket.emit('error.retry');
                } else if (socket.retry_count > 3) {
                    if (access_data == undefined) {
                        socket.emit('error.retry');
                        return;
                    }
                    if (access_data.hasOwnProperty('error')) {
                        afterAccessToken(oauth_data, access_data, socket.retry_count);
                    } else {
                        socket.emit('error.retry');
                    }
                } else {
                    getAccessToken(oauth_data, function (err, access_data) {
                        console.log(access_data);
                        if (handleError(err) || access_data == undefined || access_data.hasOwnProperty('error')) {
                            setTimeout(function () {
                                authTry(oauth_data, socket.retry_count);
                            }, timeout * socket.retry_count);
                            return;
                        }
                        access_data.type = oauth_data.type;
                        afterAccessToken(oauth_data, access_data, socket.retry_count);
                    })
                }
            };

        socket.on('auth.oauthDone', function (oauth_data) {
            socket.retry_count = 0;
            console.log('auth.oauthDone', oauth_data);
            try {
                authTry(oauth_data);
            } catch (e) {
                socket.emit('error.retry');
            }
        });

        socket.on('feedback', function (data) {
            logger.info(data);
            var html = '';
            for (var i in data) {
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
            }, function (err, info) {
                if (err) {
                    logger.info('EMAIL SEND ERROR', err);
                }
                logger.info('EMAIL_INFO', info);
            });
        });

        socket.on('session.set', function (token) {
            if (!__rooms.hasOwnProperty(token)) {
                __rooms[token] = [];
            }
            __rooms[token].push(socket.id);
            socket.token = token;
        });

        socket.on('disconnect', function () {
            if (__rooms.hasOwnProperty(socket.token)) {
                var index = __rooms[socket.token].indexOf(socket.id);
                __rooms[socket.token].splice(index, 1);
                if (__rooms[socket.token].length == 0) {
                    delete __rooms[socket.token];
                }
            }
        });

        socket.on('image.getFromURL', function (url) {
            Utils.downloadImageFromUrl(request, url, function (error, data, filename) {
                if (handleError(error)) return;
                socket.emit('image.getFromURLDone', {error: error, data: data, filename: filename});
            });
        });

        socket.on(EMIT_NAMES.NOTIFICATIONS.SEND, function () {
            sendNotifications();
        });

        socket.on('notification.received', function (data) {
            connection.query('UPDATE notifications ' +
                ' SET received = 1, ' +
                ' click_time = ' + (data.click_time ? connection.escape(data.click_time) : null) +
                ' WHERE id = ' + connection.escape(data.notification_id), function (err) {
                if (err) logger.error(err);
            })
        });

        socket.on(EMIT_NAMES.VK_INTEGRATION.GROUPS_TO_POST, function (user_id) {
            var q_get_user_data = vk_sign_in
                .select(vk_sign_in.id, vk_sign_in.secret, vk_sign_in.access_token)
                .from(vk_sign_in)
                .where(
                    vk_sign_in.user_id.equals(user_id)
                ).toQuery();

            client.query(q_get_user_data, function (err, result) {
                if (handleError(err, EMIT_NAMES.VK_INTEGRATION.GROUPS_TO_POST)) return;
                result.rows[0].user_id = user_id;
                socket.vk_user = result.rows[0];
                getVkGroups(result.rows[0], 'can_post', function (err, data) {
                    socket.emit(EMIT_NAMES.VK_INTEGRATION.GROUPS_TO_POST_DONE, {
                        error: err,
                        data: data
                    });
                });
            })
        });

        /**/
        socket.on(EMIT_NAMES.VK_INTEGRATION.POST_IT, function (data) {
            var request_data = [
                    'access_token=' + socket.vk_user.access_token,
                    'group_id=' + data.guid
                ],
                image_path = __dirname + '/../event_images/vk/',
                url = URLs.VK.GET_WALL_PHOTO_UPLOAD_SERVER + '?' + request_data.join('&'),
                filename_parts = data.image.filename.split('.'),
                extension = filename_parts[filename_parts.length - 1],
                filename = data.guid + '__' + Utils.makeId(20) + '.' + extension,
                base64 = data.image.base64.split(',')[1];
            fs.writeFile(image_path + filename, base64, 'base64', function (err) {
                if (handleError(err, EMIT_NAMES.VK_INTEGRATION.DATA_TO_POST)) return;

                rest.get(url, {
                        json: true,
                        headers: {
                            'Accept-Language': 'ru,en-us'
                        }
                    })
                    .on('complete', function (result) {
                        if (result instanceof Error) {
                            if (handleError(result, EMIT_NAMES.VK_INTEGRATION.POST_ERROR)) return;
                            this.retry(3000); // try again after 5 sec
                        } else {
                            fs.stat(image_path + filename, function (err, stats) {
                                rest
                                    .post(result.response.upload_url, {
                                        multipart: true,
                                        data: {
                                            "file1": rest.file(image_path + filename, null, stats.size, null, 'image/' + extension)
                                        }
                                    })
                                    .on("complete", function (upload_data) {

                                        if (upload_data instanceof Error) {
                                            if (handleError(result, EMIT_NAMES.VK_INTEGRATION.POST_ERROR)) return;
                                            this.retry(3000); // try again after 5 sec
                                        } else {

                                            upload_data = JSON.parse(upload_data);
                                            request_data.push('server=' + upload_data['server']);
                                            request_data.push('hash=' + upload_data['hash']);
                                            request_data.push('photo=' + upload_data['photo']);
                                            request_data.push('access_token=' + socket.vk_user.access_token);
                                            request_data.push('group_id=' + data.guid);

                                            rest
                                                .get(URLs.VK.SAVE_WALL_PHOTO_UPLOAD + '?' + request_data.join('&'))
                                                .on('complete', function (res_data) {


                                                    if (upload_data instanceof Error) {
                                                        if (handleError(result, EMIT_NAMES.VK_INTEGRATION.POST_ERROR)) return;
                                                        this.retry(3000); // try again after 5 sec
                                                    } else {
                                                        if (res_data.response.length == 0) {
                                                            handleError({name: 'CANT_SAVE_WALL_PHOTO'}, EMIT_NAMES.VK_INTEGRATION.POST_ERROR);
                                                            return;
                                                        }

                                                        var user_id = socket.vk_user.user_id,
                                                            q_ins_vk_post = vk_posts.insert({
                                                                creator_id: user_id,
                                                                image_path: filename,
                                                                message: data.message,
                                                                event_id: data.event_id,
                                                                group_id: data.guid
                                                            }).returning('id').toQuery();
                                                        client.query(q_ins_vk_post, function (err) {
                                                            if (handleError(err, EMIT_NAMES.VK_INTEGRATION.POST_ERROR)) return;

                                                            rest
                                                                .post(URLs.VK.POST_TO_WALL, {
                                                                    multipart: true,
                                                                    data: {
                                                                        owner_id: '-' + data.guid,
                                                                        from_group: 1,
                                                                        message: data.message,
                                                                        guid: data.event_id,
                                                                        attachments: [res_data.response[0].id, data.link ? data.link : ''].join(',')
                                                                    }
                                                                })
                                                                .on('complete', function (res) {
                                                                    if (res instanceof Error) {
                                                                        if (handleError(result, EMIT_NAMES.VK_INTEGRATION.POST_ERROR)) return;
                                                                        this.retry(3000); // try again after 5 sec
                                                                    }
                                                                });
                                                        })
                                                    }

                                                });
                                        }
                                    });
                            });
                        }
                    });
            });
        });
    });

    io.listen(8080);

});