"use strict";

var
    http = require('http'),
    https = require('https'),
    winston = require('winston'),
    app = require("express"),
    mysql = require('mysql'),
    rest = require('restler'),
    fs = require("fs"),
    moment = require("moment"),
    config = JSON.parse(fs.readFileSync('../v1-config.json')),
    Utils = require('./utils'),
    smtpTransport = require('nodemailer-smtp-transport'),
    nodemailer = require('nodemailer'),
    CronJob = require('cron').CronJob,
    ImagesResize = require('./image_resizer'),
    Notifications = require('./notifications'),
    Entities = require('./entities'),
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
            new winston.transports.File({filename: __dirname + '/debug.log', json: true})
        ],
        exceptionHandlers: [
            new (winston.transports.Console)(),
            new winston.transports.File({filename: __dirname + '/exceptions.log', json: true})
        ],
        exitOnError: true
    }),
    cropper = new ImagesResize({logger: logger}),
    transporter = nodemailer.createTransport(smtpTransport({
        host: real_config.smtp.host,
        port: real_config.smtp.port,
        secure: false,
        auth: {
            user: real_config.smtp.user,
            pass: real_config.smtp.password
        }
    }));
var
    server,
    server2,
    io = null,
    io2 = null,
    URLs = {
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
            'POST_TO_WALL': 'https://api.vk.com/method/wall.post',
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
    };

try {
    fs.accessSync(real_config.https.key_path, fs.F_OK);
    fs.accessSync(real_config.https.cert_path, fs.F_OK);
    server = https.createServer({
        key: fs.readFileSync(real_config.https.key_path, 'utf8'),
        cert: fs.readFileSync(real_config.https.cert_path, 'utf8')
    }, app).listen(8443);

    server2 = http.createServer().listen(8080);

    io = require("socket.io").listen(server);
    io2 = require("socket.io").listen(server2);
} catch (e) {
    server = http.createServer().listen(8080);
    io = require("socket.io").listen(server);
    io2 = null;
}

sql.setDialect('postgres');

pg.connect(pg_conn_string, function (err, client, done) {

    var publicDelayedEvents = function(){
        var q_upd_events = 'UPDATE events SET status = TRUE, updated_at = NOW(), public_at = null ' +
            ' WHERE canceled = FALSE ' +
            ' AND status = FALSE' +
            ' AND public_at < NOW()';
        client.query(q_upd_events, [], function(err){
            console.log('DELAYED updated');
            if (err) logger.error(err);
        })
    };

    try {
        new CronJob('*/1 * * * *', function () {
            if (config_index == 'prod') {
                cropper.resizeNew({
                    images: real_config.images,
                    client: client
                });
                cropper.blurNew({
                    images: real_config.images,
                    client: client
                });
                var notifications = new Notifications(real_config, client, logger);
                notifications.sendAutoNotifications();
                notifications.sendUsersNotifications();
            }
            publicDelayedEvents();
        }, null, true);
    } catch (ex) {
        logger.error(ex);
    }

    var ioHandlers = function (socket) {

            socket.on('error', function (err) {
                logger.error(err);
            });

            var handleError = function (err, emit_name, callback) {
                    if (!err || err == null) return false;

                    logger.error(err);

                    if (callback instanceof Function) {
                        callback(err);
                        return true;
                    }
                    if (emit_name) {
                        socket.emit(emit_name, {error: err});
                    }
                    return true;
                },
                getVkGroups = function (user_data, filter) {
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
                                socket.emit(EMIT_NAMES.VK_INTEGRATION.GROUPS_TO_POST_DONE, {
                                    error: 'Произошла ошибка, мы не смогли получить список групп vk.com.',
                                    data: data
                                });
                            } else {
                                socket.emit(EMIT_NAMES.VK_INTEGRATION.GROUPS_TO_POST_DONE, {
                                    error: null,
                                    data: result
                                });
                            }
                        });

                },
                saveDataInDB = function (data) {
                    console.log(data);
                    var subscriptions_count = 0;
                    socket.retry_count = 0;
                    function getUIDValues() {
                        var result = {
                            google_uid: null,
                            facebook_uid: null,
                            vk_uid: null
                        };
                        switch (data.type) {
                            case 'vk': {
                                result.vk_uid = data.oauth_data.user_id;
                                break;
                            }

                            case 'google':
                            case 'facebook': {
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
                        users = Entities.users,
                        user_token = data.oauth_data.access_token + data.oauth_data.secret + Utils.makeId(),
                        q_get_user =
                            users
                                .select(users.id, users.vk_uid, users.facebook_uid, users.google_uid,
                                    '(SELECT COUNT(id) FROM subscriptions WHERE subscriptions.user_id = users.id AND subscriptions.status = TRUE) AS subscriptions_count')
                                .where(users.email.equals(data.oauth_data.email))
                                .or(users.vk_uid.isNotNull().and(users.vk_uid.equals(UIDs.vk_uid)))
                                .or(users.facebook_uid.isNotNull().and(users.facebook_uid.equals(UIDs.facebook_uid)))
                                .or(users.google_uid.isNotNull().and(users.google_uid.equals(UIDs.google_uid)))
                                .toQuery(),
                        user_to_ins = {
                            first_name: data.user_info.first_name,
                            last_name: data.user_info.last_name,
                            email: data.oauth_data.email,
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
                            is_new_user = result.rows.length == 0,
                            user;

                        if (is_new_user) {
                            q_user = users.insert(user_to_ins).returning('id').toQuery();
                        } else {
                            user = result.rows[0];
                            subscriptions_count = user.subscriptions_count;
                            q_user = users.update(user_to_ins).where(users.id.equals(user.id)).returning('id').toQuery();
                        }

                        client.query(q_user, function (user_err, ins_result) {

                            if (handleError(user_err)) {
                                if (data.oauth_data.hasOwnProperty('email') == false || !data.oauth_data.email) {
                                    socket.emit('vk.needEmail');
                                    return;
                                }
                                return;
                            }

                            if (is_new_user) {
                                user = {
                                    id: ins_result.rows[0].id,
                                    vk_uid: null,
                                    facebook_uid: null,
                                    google_uid: null
                                };
                            }

                            var q_ins_sign_in,
                                vk_sign_in = Entities.vk_sign_in,
                                google_sign_in = Entities.google_sign_in,
                                tokens = Entities.tokens,
                                facebook_sign_in = Entities.facebook_sign_in;

                            switch (data.type) {
                                case 'vk': {
                                    var vk_data = {
                                        uid: UIDs.vk_uid,
                                        user_id: user.id,
                                        access_token: data.oauth_data.access_token,
                                        expires_in: data.oauth_data.expires_in,
                                        secret: null,
                                        photo_50: data.user_info.photo_50,
                                        photo_100: data.user_info.photo_100,
                                        photo_max_orig: data.user_info.photo_max_orig
                                    };
                                    if (user.vk_uid != null) { // user already exists in vk_users table
                                        q_ins_sign_in = vk_sign_in.update(vk_data).where(vk_sign_in.user_id.equals(user.id));
                                    } else {
                                        q_ins_sign_in = vk_sign_in.insert(vk_data);
                                    }
                                    console.log(vk_data);
                                    break;
                                }
                                case 'google': {
                                    var google_data = {
                                        user_id: user.id,
                                        google_id: user.id,
                                        access_token: data.oauth_data.access_token,
                                        expires_in: data.oauth_data.expires_in,
                                        etag: data.user_info.etag,
                                        cover_photo_url: data.user_info.cover && data.user_info.cover.coverPhoto ? data.user_info.cover.coverPhoto.url : null
                                    };
                                    if (user.google_uid != null) {
                                        q_ins_sign_in = google_sign_in.update(google_data).where(google_sign_in.user_id.equals(user.id));
                                    } else {
                                        q_ins_sign_in = google_sign_in.insert(google_data);
                                    }
                                    console.log(google_data);
                                    break;
                                }
                                case 'facebook': {
                                    var facebook_data = {
                                        user_id: user.id,
                                        uid: UIDs.facebook_uid,
                                        access_token: data.oauth_data.access_token,
                                        expires_in: data.oauth_data.expires_in
                                    };
                                    if (user.facebook_uid != null) {
                                        q_ins_sign_in = facebook_sign_in.update(facebook_data).where(facebook_sign_in.user_id.equals(user.id));
                                    } else {
                                        q_ins_sign_in = facebook_sign_in.insert(facebook_data);
                                    }
                                    console.log(facebook_data);
                                    break;
                                }

                            }

                            var q_ins_interests = Entities.users_interests.insert({
                                user_id: user.id,
                                city: data.user_info.city,
                                education_university: data.user_info.university,
                                education_university_name: data.user_info.university_name,
                                education_faculty: data.user_info.faculty,
                                education_faculty_name: data.user_info.faculty_name,
                                education_graduation: data.user_info.graduation,
                                occupation_id: data.user_info.occupation.id,
                                occupation_name: data.user_info.occupation.name,
                                relation: data.user_info.relation,
                                personal_political: data.user_info.personal.political,
                                personal_smoking: data.user_info.personal.smoking,
                                personal_alcohol: data.user_info.personal.alcohol,
                                interests: data.user_info.interests,
                                movies: data.user_info.movies,
                                tv: data.user_info.tv,
                                books: data.user_info.books,
                                games: data.user_info.games,
                                about: data.user_info.about,
                                network_type: data.type
                            }).toQuery();

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
                                    if (handleError(err)) {
                                        authTry(data.oauth_data);
                                        return;
                                    }
                                    socket.emit('auth', {
                                        email: data.oauth_data.email,
                                        user_id: user.id,
                                        token: user_token,
                                        mobile: token_type == 'mobile',
                                        type: data.type,
                                        subscriptions_count: subscriptions_count
                                    });
                                });
                            };

                            client.query(q_ins_sign_in.returning('id').toQuery(), function (sign_in_err) {
                                if (handleError(sign_in_err)) {
                                    socket.emit('error.retry');
                                    return;
                                }


                                /* INSERTING FRIENDS LIST*/
                                var q_ins_friends = '',
                                    uid_key_name;

                                switch (data.type) {
                                    case 'vk': {
                                        q_ins_friends = "INSERT INTO vk_friends (user_id, friend_uid) VALUES ($1, $2) ON CONFLICT DO NOTHING";
                                        uid_key_name = 'uid';
                                        break;
                                    }
                                    case 'google': {
                                        q_ins_friends = "INSERT INTO google_friends (user_id, friend_uid) VALUES ($1, $2) ON CONFLICT DO NOTHING";
                                        uid_key_name = 'id';
                                        break;
                                    }
                                    case 'facebook': {
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

                                /* INSERTING GROUPS LIST*/
                                var q_ins_group, q_ins_membership;

                                switch (data.type) {
                                    case 'vk': {
                                        q_ins_group = "INSERT INTO vk_groups (gid, name, screen_name, description, photo) " +
                                            "   VALUES ($1, $2, $3, $4, $5) ON CONFLICT (gid) DO UPDATE SET name = $2, screen_name = $3, description = $4, photo = $5 RETURNING id";
                                        q_ins_membership = 'INSERT INTO vk_users_subscriptions(user_id, vk_group_id) VALUES($1, $2) ON CONFLICT DO NOTHING';
                                        break;
                                    }
                                    case 'facebook': {
                                        break;
                                    }
                                }

                                insertToken();
                                if (data.groups_data) {
                                    query_name = data.type + '_q_ins_groups';
                                    data.groups_data.forEach(function (value) {
                                        if (value.hasOwnProperty('gid') == false) return true;
                                        client.query({
                                            text: q_ins_group,
                                            name: query_name,
                                            values: [value.gid, value.name, value.screen_name, value.description, value.photo]
                                        }, function (err, result) {
                                            if (handleError(err)) return;
                                            if (result.rows.length != 1) return;
                                            client.query({
                                                text: q_ins_membership,
                                                name: 'insert_membership',
                                                values: [user.id, result.rows[0].id]
                                            }, handleError);
                                        });
                                    });
                                }

                                client.query(q_ins_interests.text + ' ON CONFLICT (user_id, network_type) DO UPDATE SET ' +
                                    ' city = $2, ' +
                                    ' education_university = $3, ' +
                                    ' education_university_name = $4, ' +
                                    ' education_faculty = $5, ' +
                                    ' education_faculty_name = $6, ' +
                                    ' education_graduation = $7, ' +
                                    ' occupation_id = $8, ' +
                                    ' occupation_name = $9, ' +
                                    ' relation = $10, ' +
                                    ' personal_political = $11, ' +
                                    ' personal_smoking = $12, ' +
                                    ' personal_alcohol = $13, ' +
                                    ' interests = $14, ' +
                                    ' movies = $15, ' +
                                    ' tv = $16, ' +
                                    ' books = $17, ' +
                                    ' games = $18, ' +
                                    ' about = $19'
                                    , q_ins_interests.values, function (err, result) {
                                        if (handleError(err)) return;
                                    });
                            });
                        });
                    });
                },
                getUsersInfo = function (data, callback) {
                    var req_params;

                    switch (data.type) {
                        case 'vk': {
                            req_params = {
                                url: URLs[data.type.toUpperCase()].GET_USER_INFO,
                                timeout: 5000,
                                query: {
                                    user_ids: data.user_id,
                                    fields: 'photo_50, sex, city, photo_100, photo_max, photo_max_orig, education, activities, occupation, relation, personal, interests, music, movies, tv, books, games, about',
                                    name_case: 'nom'
                                },
                                json: true,
                                headers: {
                                    'Accept-Language': 'ru,en-us'
                                }
                            };
                            break;
                        }
                        case 'google': {
                            req_params = {
                                url: URLs[data.type.toUpperCase()].GET_USER_INFO,
                                timeout: 5000,
                                json: true,
                                headers: {
                                    'Authorization': 'Bearer ' + data.access_token
                                }
                            };
                            break;
                        }
                        case 'facebook': {
                            req_params = {
                                url: URLs[data.type.toUpperCase()].GET_USER_INFO,
                                timeout: 5000,
                                query: {
                                    access_token: data.access_token,
                                    fields: 'first_name,last_name,email,middle_name,picture,gender,about,education,books,events,movies,groups'
                                },
                                json: true
                            };
                            break;
                        }
                    }

                    console.log('getting users info', req_params);
                    rest.get(req_params.url, req_params)
                        .on('complete', function (result) {
                            console.log('getting users info - DONE');
                            if (result instanceof Error) {
                                handleError(result);
                                callback(result, null);
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
                                } else {
                                    e = null;
                                }
                                callback(e, result);
                            }

                        });
                },
                authTry = function (oauth_data) {
                    if (socket.retry_count > 5) {
                        socket.emit('error.retry');
                    } else {
                        console.log(socket.retry_count);
                        socket.retry_count++;
                        getUsersInfo(oauth_data, function (user_info_error, user_info) {


                            if (handleError(user_info_error)) {
                                setTimeout(function () {
                                    authTry(oauth_data);
                                }, 500 * socket.retry_count);
                                return;
                            }

                            if (oauth_data.type == 'vk') {
                                if (user_info.hasOwnProperty('response') == false || user_info.response.length == 0) {
                                    setTimeout(function () {
                                        authTry(oauth_data);
                                    }, 500 * socket.retry_count);
                                    return;
                                }
                                user_info = user_info.response[0];
                            }
                            user_info.type = oauth_data.type;
                            user_info.access_token = oauth_data.access_token;
                            oauth_data.email = oauth_data.email ? oauth_data.email : user_info.email;
                            console.log('getting friends list start');
                            getFriendsList(user_info, function (friends_error, friends_data) {

                                console.log('getting list done');
                                if (handleError(friends_error)) {
                                    setTimeout(function () {
                                        authTry(oauth_data);
                                    }, 500 * retry_count);
                                    return;
                                }
                                if (oauth_data.type == 'vk') {
                                    friends_data = friends_data.response;
                                } else if (oauth_data.type == 'google') {
                                    oauth_data.email = user_info.emails[0].value;
                                    friends_data = friends_data.items;
                                } else if (oauth_data.type == 'facebook') {
                                    friends_data = friends_data.data;
                                    user_info.photo_100 = user_info.hasOwnProperty('picture') ? user_info.picture.data.url : '';
                                }

                                getGroupsList(user_info, function (groups_error, groups_data) {

                                    if (handleError(friends_error)) {
                                        setTimeout(function () {
                                            authTry(oauth_data);
                                        }, 500 * retry_count);
                                        return;
                                    }

                                    if (oauth_data.type == 'vk') {
                                        if (groups_data.hasOwnProperty('response')) {
                                            groups_data = groups_data.response;
                                        } else {
                                            groups_data = null;
                                        }
                                    }

                                    saveDataInDB(Utils.composeFullInfoObject({
                                        oauth_data: oauth_data,
                                        user_info: user_info,
                                        friends_data: friends_data,
                                        groups_data: groups_data,
                                        type: oauth_data.type
                                    }));
                                });
                            });
                        });
                    }
                },
                getGroupsList = function (data, callback) {
                    var GROUPS_COUNT = 1000,
                        req_params;

                    switch (data.type) {
                        case 'vk': {
                            req_params = {
                                url: URLs[data.type.toUpperCase()].GET_GROUPS_LIST,
                                json: true,
                                timeout: 5000,
                                query: {
                                    user_id: data.uid,
                                    extended: 1,
                                    fields: 'description, links',
                                    count: GROUPS_COUNT,
                                    access_token: data.access_token
                                }
                            };
                            break;
                        }
                        case 'google': {
                            callback(null, null);
                            return;
                        }
                        case 'facebook': {
                            callback(null, null);
                            return;
                        }
                    }
                    console.log('getting groups list', req_params);
                    rest.get(req_params.url, req_params)
                        .on('complete', function (result) {
                            console.log('getting groups list - done');
                            if (result instanceof Error) {
                                handleError(result);
                                callback(result, null);
                            } else {
                                callback(null, result);
                            }
                        });
                },
                getFriendsList = function (data, callback) {
                    var FRIENDS_COUNT = 50000,
                        req_params;

                    switch (data.type) {
                        case 'vk': {
                            req_params = {
                                url: URLs[data.type.toUpperCase()].GET_FRIENDS_LIST,
                                timeout: 5000,
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
                        case 'google': {
                            req_params = {
                                url: URLs[data.type.toUpperCase()].GET_FRIENDS_LIST,
                                timeout: 5000,
                                json: true,
                                headers: {
                                    'Authorization': 'Bearer ' + data.access_token
                                }
                            };
                            break;
                        }
                        case 'facebook': {
                            req_params = {
                                url: URLs[data.type.toUpperCase()].GET_FRIENDS_LIST,
                                timeout: 5000,
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
                                callback(result, null);
                            } else {
                                callback(null, result);
                            }
                        });
                };

            socket.on('auth.oauthDone', function (oauth_data) {
                socket.retry_count = 0;
                try {
                    console.log('trying');
                    authTry(oauth_data);
                } catch (e) {
                    handleError(e);
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
                    to: 'support@evendate.ru',
                    subject: 'Обратная связь!',
                    html: html
                }, function (err, info) {
                    if (err) {
                        handleError('EMAIL SEND ERROR', err);
                        handleError(html);
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
                Utils.downloadImageFromUrl(url, function (error, data, filename) {
                    if (handleError(error)) return;
                    socket.emit('image.getFromURLDone', {error: error, data: data, filename: filename});
                });
            });


            socket.on(EMIT_NAMES.NOTIFICATIONS.SEND, function () {
                if (config_index == 'local') {
                    var notifications = new Notifications(real_config, client, logger);
                    notifications.sendAutoNotifications();
                    notifications.sendUsersNotifications();
                }
            });

            socket.on(EMIT_NAMES.VK_INTEGRATION.GROUPS_TO_POST, function (user_id) {
                var vk_sign_in = Entities.vk_sign_in,
                    q_get_user_data = vk_sign_in
                        .select(vk_sign_in.id, vk_sign_in.secret, vk_sign_in.access_token)
                        .from(vk_sign_in)
                        .where(
                            vk_sign_in.user_id.equals(user_id)
                        ).toQuery();

                client.query(q_get_user_data, function (err, result) {
                    if (handleError(err, EMIT_NAMES.VK_INTEGRATION.GROUPS_TO_POST)) return;
                    result.rows[0].user_id = user_id;
                    socket.vk_user = result.rows[0];
                    getVkGroups(result.rows[0], 'can_post');
                });
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


                    if (handleError(err, EMIT_NAMES.VK_INTEGRATION.POST_ERROR)) return;

                    rest.get(url, {
                        json: true,
                        headers: {
                            'Accept-Language': 'ru,en-us'
                        }
                    })
                        .on('complete', function (result) {

                            if (result instanceof Error) {
                                handleError(result, EMIT_NAMES.VK_INTEGRATION.POST_ERROR);
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

                                            setTimeout(function () {


                                                if (upload_data instanceof Error) {
                                                    handleError(result, EMIT_NAMES.VK_INTEGRATION.POST_ERROR);
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

                                                            if (res_data instanceof Error) {
                                                                handleError(res_data, EMIT_NAMES.VK_INTEGRATION.POST_ERROR);
                                                            } else {
                                                                if (res_data.response.length == 0) {
                                                                    handleError({name: 'CANT_SAVE_WALL_PHOTO'}, EMIT_NAMES.VK_INTEGRATION.POST_ERROR);
                                                                    return;
                                                                }

                                                                var user_id = socket.vk_user.user_id,
                                                                    q_ins_vk_post = Entities.vk_posts.insert({
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
                                                                            data: {
                                                                                owner_id: '-' + data.guid,
                                                                                from_group: 1,
                                                                                message: data.message,
                                                                                access_token: socket.vk_user.access_token,
                                                                                guid: data.event_id,
                                                                                attachments: [res_data.response[0].id, data.link ? data.link : ''].join(',')
                                                                            }
                                                                        })
                                                                        .on('complete', function (res) {
                                                                            console.log(res);
                                                                            if (res instanceof Error) {
                                                                                handleError(result, EMIT_NAMES.VK_INTEGRATION.POST_ERROR);
                                                                            }
                                                                        });
                                                                })
                                                            }

                                                        });
                                                }
                                            }, 1500);
                                        });
                                });
                            }
                        });
                });
            });

            console.log('Started');
        };

    io.on('connection', ioHandlers);

    if (io2 != null){
        io2.on('connection', ioHandlers);
    }

});