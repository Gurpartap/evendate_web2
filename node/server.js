"use strict";

var
    http = require('http'),
    https = require('https'),
    winston = require('winston'),
    express = require("express"),
    app = express(),
    rest = require('restler'),
    async = require('async'),
    fs = require("fs"),
    moment = require("moment"),
    config = JSON.parse(fs.readFileSync('../v1-config.json')),
    Utils = require('./utils'),
    smtpTransport = require('nodemailer-smtp-transport'),
    nodemailer = require('nodemailer'),
    Mailer = require('./mailer.js'),
    MailScheduler = require('./mails_scheduler'),
    CronJob = require('cron').CronJob,
    ImagesResize = require('./image_resizer'),
    Notifications = require('./notifications'),
    ConstantsStorage = require('./constants'),
    Entities = require('./entities'),
    pg = require('pg'),
    qr = require('qr-image'),
    sql = require('sql'),
    args = process.argv.slice(2),
    crypto = require('crypto'),
    bodyParser = require('body-parser'),
    UpdateQueries = require('./UpdateQueries'),
    __rooms = {},
    logger = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)(),
            new winston.transports.File({filename: __dirname + '/debug.log', json: true})
        ],
        exceptionHandlers: [
            new (winston.transports.Console)(),
            new winston.transports.File({filename: __dirname + '/exceptions.log', json: true})
        ],
        exitOnError: false
    });

process.on('uncaughtException', function (err) {
    logger.info('Caught exception: ' + err);
});

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

var config_index = process.env.ENV ? process.env.ENV : 'local',
    real_config = config[config_index],
    pg_conn_string = [
        'postgres://',
        real_config.db.user,
        ':', real_config.db.password,
        '@', real_config.db.host,
        ':', real_config.db.port,
        '/', real_config.db.database
    ].join(''),
    cropper = new ImagesResize({logger: logger}),
    CONSTANTS = ConstantsStorage,
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
    handleError = function (err, emit_name, callback, socket) {
        if (!err || err == null) return false;

        logger.error(err);
        console.trace();

        if (callback instanceof Function) {
            callback(err);
            return true;
        }
        if (emit_name && socket) {
            socket.emit(emit_name, {error: err});
        }
        return true;
    },
    URLs = ConstantsStorage.getUrls(real_config);

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

    if (err){
        console.log(err);
    }

    var checkNested = function (obj /*, level1, level2, ... levelN*/) {
            var args = Array.prototype.slice.call(arguments, 1);
            for (var i = 0; i < args.length; i++) {
                if (!obj || !obj.hasOwnProperty(args[i])) {
                    return false;
                }
                obj = obj[args[i]];
            }
            return true;
        },
        updateEventsStats = function () {
            var q_upd_stats = 'INSERT INTO stat_notifications_aggregated(event_id, notifications_count, updated_at)' +
                ' SELECT' +
                ' id as event_id,' +
                '     (SELECT COUNT(*)' +
                ' FROM stat_notifications' +
                ' INNER JOIN events_notifications ON stat_notifications.event_notification_id = events_notifications.id' +
                ' WHERE events_notifications.event_id = events.id) AS notifications_count,' +
                ' NOW() as updated_at' +
                ' FROM events' +
                ' ON CONFLICT (event_id) DO UPDATE SET  updated_at = NOW(),' +
                '     notifications_count = (SELECT COUNT(*)' +
                ' FROM stat_notifications' +
                ' INNER JOIN events_notifications ON stat_notifications.event_notification_id = events_notifications.id' +
                ' WHERE events_notifications.event_id = stat_notifications_aggregated.event_id);';

            client.query(q_upd_stats, [], function (err) {
                if (err) return logger.error(err);
            });
        },
        insertRecommendationsAccordance = function (data, callback) {
            var q_ins_user_upd_event = 'INSERT INTO recommendations_events (user_id, event_id, rating_favored_friends, ' +
                    ' rating_tags_in_favorites, rating_tags_in_hidden, rating_recent_created, ' +
                    ' rating_active_days, rating_texts_similarity, rating, updated_at)' +
                    ' SELECT DISTINCT $1::INT AS user_id, view_events.id::INT AS event_id, 0 AS rating_favored_friends, ' +
                    ' 0 AS rating_tags_in_favorites, 0 AS rating_tags_in_hidden, 0 AS rating_recent_created, ' +
                    ' 0 AS rating_active_days, 0 AS rating_texts_similarity, 0 AS rating, NOW() AS updated_at ' +
                    ' FROM view_events' +
                    ' ON CONFLICT (user_id, event_id) DO NOTHING',

                q_upd_user_upd_org = 'INSERT INTO recommendations_organizations (user_id, organization_id, rating_subscribed_friends, ' +
                    ' rating_active_events_count, rating_last_events_count, rating_subscribed_in_social_network, rating_texts_similarity, ' +
                    ' rating, updated_at)' +
                    ' SELECT $1::INT AS user_id, view_organizations.id::INT AS organization_id, 0 AS  rating_subscribed_friends, ' +
                    ' 0 AS rating_active_events_count, 0 AS rating_last_events_count, ' +
                    ' 0 AS rating_subscribed_in_social_network, 0 AS rating_texts_similarity, 0 AS rating, ' +
                    ' NOW() AS updated_at' +
                    ' FROM view_organizations' +
                    ' ON CONFLICT (user_id, organization_id) DO NOTHING',

                q_ins_events = 'INSERT INTO recommendations_events (user_id, event_id, rating_favored_friends, ' +
                    ' rating_tags_in_favorites, rating_tags_in_hidden, rating_recent_created, ' +
                    ' rating_active_days, rating_texts_similarity, rating, updated_at)' +
                    ' SELECT users.id AS user_id, $1::INT AS event_id, 0 AS rating_favored_friends, ' +
                    ' 0 AS rating_tags_in_favorites, 0 AS rating_tags_in_hidden, 0 AS rating_recent_created, ' +
                    ' 0 AS rating_active_days, 0 AS rating_texts_similarity, 0 AS rating, NOW() AS updated_at ' +
                    ' FROM users' +
                    ' ON CONFLICT (user_id, event_id) DO NOTHING',

                q_ins_organizations = 'INSERT INTO recommendations_organizations (user_id, organization_id, rating_subscribed_friends, ' +
                    ' rating_active_events_count, rating_last_events_count, rating_subscribed_in_social_network, rating_texts_similarity, ' +
                    ' rating, updated_at)' +
                    ' SELECT users.id AS user_id, $1::INT AS organization_id, 0 AS  rating_subscribed_friends, ' +
                    ' 0 AS rating_active_events_count, 0 AS rating_last_events_count, ' +
                    ' 0 AS rating_subscribed_in_social_network, 0 AS rating_texts_similarity, 0 AS rating, ' +
                    ' NOW() AS updated_at' +
                    ' FROM users' +
                    ' ON CONFLICT (user_id, organization_id) DO NOTHING';

            if (data.user_id) {
                async.parallel([
                    function (cb) {
                        client.query(q_ins_user_upd_event, [data.user_id], function (err) {
                            if (err) handleError(err);
                            cb();
                        });
                    },
                    function (cb) {
                        client.query(q_upd_user_upd_org, [data.user_id], function (err) {
                            if (err) handleError(err);
                            cb();
                        });
                    },
                ], callback);

            } else if (data.event_id) {
                client.query(q_ins_events, [data.event_id], function (err) {
                    if (err) handleError(err);
                    callback();
                });
            } else if (data.organization_id) {
                client.query(q_ins_organizations, [data.organization_id], function (err) {
                    if (err) handleError(err);
                    callback();
                });
            } else {
                callback();
            }
        };

    function publicDelayedEvents() {
        var q_upd_events = 'UPDATE events ' +
            ' SET ' +
            '   status = TRUE, ' +
            '   updated_at = NOW(),' +
            '   public_at = NULL ' +
            '   WHERE id IN ' +
            '       (SELECT id ' +
            '           FROM view_all_events ' +
            '           WHERE ' +
            '               is_canceled = FALSE ' +
            '               AND is_delayed = TRUE ' +
            '               AND public_at < date_part(\'epoch\', NOW())) ';
        client.query(q_upd_events, [], function (err) {
            if (err) logger.error(q_upd_events);
            if (err) logger.error(err);
        });
    }

    function updateEventsGeocodes(event_id) {

        client.query('SELECT id, location, location_updates FROM events ' +
            '   WHERE id = $1', [event_id], function (err, res) {
            if (handleError(err)) return;
            var queue = [],
                url = 'https://geocode-maps.yandex.ru/1.x/?';
            res.rows.forEach(function (event) {
                (function (_event) {
                    queue.push(function (callback) {
                        var _url = url + [
                                'format=json',
                                'results=1',
                                'geocode=' + encodeURIComponent(_event.location)
                            ].join('&');
                        rest.get(_url, {
                            json: true
                        })
                            .on('complete', function (rest_res) {
                                if (_event.location_updates == null) {
                                    _event.location_updates = 0;
                                }
                                var upd_data = {location_updates: ++_event.location_updates};
                                if (rest_res instanceof Error == false) {
                                    if (checkNested(rest_res, 'response', 'GeoObjectCollection', 'featureMember')) {
                                        if (rest_res['response']['GeoObjectCollection']['featureMember'].length > 0) {
                                            var feature_member = rest_res['response']['GeoObjectCollection']['featureMember'][0];
                                            if (checkNested(feature_member, 'GeoObject', 'Point', 'pos')) {
                                                var pos = feature_member['GeoObject']['Point']['pos'].split(' ');
                                                upd_data.latitude = pos[1];
                                                upd_data.longitude = pos[0];
                                            }
                                        }
                                    }
                                }
                                var q_upd_event = Entities.events
                                    .update(upd_data)
                                    .where(Entities.events.id.equals(_event.id))
                                    .toQuery();
                                client.query(q_upd_event, function (err) {
                                    handleError(err);
                                    callback(null);
                                });
                            })
                    })
                })(event);
            });
            async.parallelLimit(queue, 5);
        });

    }

    function updateRecommendations(data, cb) {
        if (!data) return cb();
        let organizations_text =
                "(SELECT" +
                " CASE" +
                " WHEN (SELECT LENGTH(users_interests_aggregated.aggregated_tsquery)" +
                " FROM users_interests_aggregated" +
                " WHERE users_interests_aggregated.user_id =" +
                "     view_users_organizations.user_id) BETWEEN 3 AND  130000" +
                " THEN" +
                " COALESCE((SELECT ts_rank_cd(\'{1.0, 0.7, 0.5, 0.3}\', vo.fts, query) :: REAL AS rank" +
                ' FROM view_organizations AS vo, to_tsquery(' +
                ' (SELECT' +
                ' users_interests_aggregated.aggregated_tsquery' +
                ' FROM users_interests_aggregated' +
                ' WHERE users_interests_aggregated.user_id =' +
                ' view_users_organizations.user_id) ' +
                ' ) AS query' +
                ' WHERE vo.id = view_users_organizations.organization_id) :: REAL, 0)' +
                ' ELSE 0' +
                ' END)',
            events_text = "(SELECT" +
                " CASE" +
                " WHEN (SELECT LENGTH(users_interests_aggregated.aggregated_tsquery)" +
                " FROM users_interests_aggregated" +
                " WHERE users_interests_aggregated.user_id =" +
                "     view_users_events.user_id) BETWEEN 3 AND 130000" +
                " THEN" +
                " COALESCE((SELECT ts_rank_cd('{1.0, 0.7, 0.5, 0.3}', ve.fts, query) :: REAL AS rank" +
                " FROM view_events AS ve," +
                "     to_tsquery((SELECT users_interests_aggregated.aggregated_tsquery" +
                " FROM users_interests_aggregated" +
                " WHERE users_interests_aggregated.user_id =" +
                "     view_users_events.user_id)) AS query" +
                " WHERE ve.id = view_users_events.event_id) :: REAL, 0)" +
                " ELSE 0" +
                " END)";

        let q_upd_events = UpdateQueries.upd_event_recommendations,
            q_upd_organizations = UpdateQueries.upd_org_recommendations,
            upd_events = false,
            upd_organizations = false,
            operations = [], events_args = [], orgs_args = [];

        q_upd_events = q_upd_events.replace("'{SIMILARITY_TEXT}'", data.events_update_texts === false ? 'rating_texts_similarity' : events_text);
        q_upd_organizations = q_upd_organizations.replace("'{SIMILARITY_TEXT}'", data.organizations_update_texts  === false ? 'rating_texts_similarity' : organizations_text);


        if (data.user_id) {
            q_upd_organizations = q_upd_organizations + ' AND view_users_organizations.user_id = $1';
            q_upd_organizations = q_upd_organizations.replace("'{WHERE_PLACEHOLDER}'", ' WHERE user_id = $2');

            q_upd_events = q_upd_events + ' AND view_users_events.user_id = $1';
            q_upd_events = q_upd_events.replace("'{WHERE_PLACEHOLDER}'", ' AND user_id = $2');

            upd_events = upd_organizations = true;
            events_args = [data.user_id, data.user_id];
            orgs_args = [data.user_id, data.user_id];
        } else if (data.event_id) {
            q_upd_events = q_upd_events + ' AND view_users_events.event_id = $1';
            q_upd_events = q_upd_events.replace("'{WHERE_PLACEHOLDER}'", ' AND event_id = $2');
            upd_events = true;
            events_args = [data.event_id, data.event_id];
        } else if (data.organization_id) {
            q_upd_organizations = q_upd_organizations + ' AND view_users_organizations.organization_id = $1';
            q_upd_organizations = q_upd_organizations.replace("'{WHERE_PLACEHOLDER}'", ' WHERE organization_id = $2');
            upd_organizations = true;
            events_args = [data.event_id, data.event_id];
        }

        if (upd_events) {
            operations.push(function (callback) {
                client.query(q_upd_events, events_args, function (err, result) {
                    // fs.writeFileSync('./q_upd_events' + Utils.makeId(10) + '.sql', q_upd_events + '\n\n' + JSON.stringify(events_args), {encoding: 'utf8'})
                    if (err) handleError({error: err, name: 'q_upd_events'});
                    callback(null);
                })
            });
        }
        if (upd_organizations) {
            operations.push(function (callback) {
                client.query(q_upd_organizations, orgs_args, function (err, result) {
                    // fs.writeFileSync('./q_upd_orgs' + Utils.makeId(10) + '.sql', q_upd_organizations + '\n\n' + JSON.stringify(orgs_args), {encoding: 'utf8'})
                    if (err) handleError({error: err, name: 'q_upd_organizations'});
                    callback(null);
                })
            })
        }
        async.parallel(operations, function (err, results) {
            cb(err, results);
        });
    }


    try {
        new CronJob('*/1 * * * *', function () {
            if (config_index == 'prod' || args.indexOf('--resize-images') !== -1) {
                cropper.resizeNew({
                    images: real_config.images,
                    client: client
                });
                cropper.downloadNew({
                    client: client,
                    images: real_config.images
                });
            }
            if (config_index == 'prod') {
                var notifications = new Notifications(real_config, client, logger);
                notifications.sendAutoNotifications();
                notifications.sendUsersNotifications();
            }
            publicDelayedEvents();
        }, null, true);
    } catch (ex) {
        logger.error(ex);
    }

    try {
        new CronJob('*/3 * * * *', function () {
            updateEventsStats();
        }, null, true);
    } catch (ex) {
        logger.error(ex);
    }


    /* Emails */
    try {
        new CronJob('0 * * * *', function () {
            let scheduler = new MailScheduler(client, handleError);
            scheduler.scheduleOrganizationRegistrationFailed();
        }, null, true);
    } catch (ex) {
        logger.error(ex);
    }
//every monday at 8:30 am
    try {
        new CronJob('30 5 * * 1', function () {
            let scheduler = new MailScheduler(client, handleError);
            scheduler.scheduleWeeklyEmails();
        }, null, true);
    } catch (ex) {
        logger.error(ex);
    }

    try {
        new CronJob('*/1 * * * *', function () {
            let mailer = new Mailer(transporter, logger);
            if (config_index == 'prod' || args.indexOf('--send-emails-force') !== -1) {
                mailer.sendScheduled(client, handleError);
            }
        }, null, true);
    } catch (ex) {
        logger.error(ex);
    }


    if (args.indexOf('--schedule-emails-failed') !== -1) {
        let scheduler = new MailScheduler(client, handleError);
        scheduler.scheduleOrganizationRegistrationFailed();
    }

    if (args.indexOf('--schedule-emails-weekly') !== -1) {
        let scheduler = new MailScheduler(client, handleError);
        scheduler.scheduleWeeklyEmails();
    }
    if (args.indexOf('--send-emails-force') !== -1) {
        let mailer = new Mailer(transporter);
        mailer.sendScheduled(client, handleError);

    }

    var ioHandlers = function (socket) {

        socket.on(CONSTANTS.CONNECTION.ERROR, function (err) {
            logger.error(err);
        });

        var getVkGroups = function (user_data, filter) {
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
                            socket.emit(CONSTANTS.VK_INTEGRATION.GROUPS_TO_POST_DONE, {
                                error: 'Произошла ошибка, мы не смогли получить список групп vk.com.',
                                data: data
                            });
                        } else {
                            socket.emit(CONSTANTS.VK_INTEGRATION.GROUPS_TO_POST_DONE, {
                                error: null,
                                data: result
                            });
                        }
                    });

            },
            updateUsersInterestsAggregated = function (user_id, callback) {
                var q_get_interests = Entities.users_interests.select(
                    Entities.users_interests.star()
                    ).where(Entities.users_interests.user_id.equals(user_id)).toQuery(),
                    q_get_groups = Entities.vk_groups.select(
                        Entities.vk_groups.name,
                        Entities.vk_groups.description,
                        Entities.vk_groups.screen_name
                    ).from(
                        Entities.vk_groups
                            .join(Entities.vk_users_subscriptions).on(Entities.vk_users_subscriptions.vk_group_id.equals(Entities.vk_groups.id))
                    ).where(Entities.vk_users_subscriptions.user_id.equals(user_id)).toQuery(),
                    cleanData = function (str) {
                        if (typeof str !== 'string') return '';
                        str = str.replace(/<[^>]*>/gmi, ''); // remove tags
                        str = str.replace(/[^a-zA-Zа-яА-ЯёЁ\-\s]/gmi, ''); // remove NOT words
                        var str_items = str.split(/\s/gmi),
                            result_words = [];
                        str_items.forEach(function (word) {
                            word = word.trim();
                            if (typeof word == 'string' && word.length <= 3 && word.toUpperCase() != word) return true; //stop word
                            result_words.push(word);
                        });
                        return result_words.join(' ');
                    };


                client.query(q_get_interests, function (err, data) {
                    if (err) handleError({error: err, name: 'q_get_interests'});
                    var items = [],
                        items_length = 0,
                        interest_types = ['education_university_name', 'education_faculty_name',
                            'occupation_name', 'interests', 'movies', 'tv', 'books', 'games', 'about'];
                    data.rows.forEach(function (row) {
                        interest_types.forEach(function (type) {
                            if (typeof row[type] == 'string') {
                                let _clean = cleanData(row[type]);
                                items_length += _clean.length;
                                items.push(_clean);
                            }
                        });
                    });

                    client.query(q_get_groups, function (error, groups_data) {

                        if (error) handleError({error: error, name: 'q_get_groups'});
                        groups_data.rows.forEach(function (row) {
                            if (items_length >= 120000) return false;
                            let _clean_name = cleanData(row.name),
                                _clean_desc = cleanData(row.description);

                            items_length += _clean_name.length;
                            items_length += _clean_desc.length;

                            items.push(_clean_name);
                            items.push(_clean_desc);
                        });
                        var items_text = items.join(' '),
                            items_text_tsquery = items_text.trim().replace(/\s+/gmi, '|');

                        var q_ins_interests = 'INSERT INTO ' +
                            '   users_interests_aggregated (user_id, aggregated_text, aggregated_tsquery, updated_at)' +
                            ' VALUES($1, $2, $3, NOW())' +
                            ' ON CONFLICT(user_id) DO UPDATE ' +
                            ' SET aggregated_text = $4, aggregated_tsquery = $5, updated_at = NOW()';

                        client.query(q_ins_interests, [user_id, items_text, items_text_tsquery, items_text, items_text_tsquery], function (err, data) {
                            if (err) handleError({error: err, name: 'q_ins_interests'});
                            if (callback) callback(err);
                        });

                    });
                });
            },
            saveDataInDB = function (data) {
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

                        if (err) return handleError({error: user_err, name: 'q_user'});

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

                                updateUsersInterestsAggregated(user.id, function () {
                                    insertRecommendationsAccordance({user_id: user.id}, function () {
                                        updateRecommendations({
                                            user_id: user.id,
                                            organizations_update_texts: true,
                                            events_update_texts: false
                                        }, function () {
                                            socket.emit('auth', {
                                                email: data.oauth_data.email,
                                                user_id: user.id,
                                                token: user_token,
                                                mobile: token_type == 'mobile',
                                                type: data.type,
                                                subscriptions_count: subscriptions_count
                                            });
                                        });
                                    });
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

                rest.get(req_params.url, req_params)
                    .on('complete', function (result) {
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
                        getFriendsList(user_info, function (friends_error, friends_data) {

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
                let GROUPS_COUNT = 1000,
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
                rest.get(req_params.url, req_params)
                    .on('complete', function (result) {
                        if (result instanceof Error) {
                            handleError(result);
                            callback(result, null);
                        } else {
                            callback(null, result);
                        }
                    });
            },
            getFriendsList = function (data, callback) {
                let FRIENDS_COUNT = 50000,
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

        socket.on(CONSTANTS.AUTH.OAUTH_DONE, function (oauth_data) {
            socket.retry_count = 0;
            try {
                authTry(oauth_data);
            } catch (e) {
                handleError(e);
                socket.emit('error.retry');
            }
        });

        socket.on(CONSTANTS.UTILS.FEEDBACK, function (data) {
            let html = '';
            for (let i in data) {
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

        socket.on(CONSTANTS.UTILS.REGISTRATION_FINISHED, function (data) {

            let q_upd_registration = Entities.organization_registrations.update({
                finished: true
            }).where(Entities.organization_registrations.uuid.equals(data.uuid)).toQuery();

            client.query(q_upd_registration, handleError);

        });

        socket.on(CONSTANTS.UTILS.REGISTRATION_STARTED, function (data) {
            let html = '';
            for (let i in data) {
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

            let q_ins_registration = Entities.organization_registrations.insert({
                email: data.email,
                site_url: data.site_url,
                name: data.name
            }).returning('uuid').toQuery();

            client.query(q_ins_registration, function (err, res) {
                if (err) {
                    handleError('EMAIL SEND ERROR', err);
                }
                socket.emit('utils.registrationSaved', {
                    uuid: res.rows[0].uuid
                })
            });
        });

        socket.on(CONSTANTS.AUTH.SESSION_SET, function (token) {
            if (!__rooms.hasOwnProperty(token)) {
                __rooms[token] = [];
            }
            __rooms[token].push(socket.id);
            socket.token = token;
        });

        socket.on(CONSTANTS.CONNECTION.DISCONNECT, function () {
            if (__rooms.hasOwnProperty(socket.token)) {
                var index = __rooms[socket.token].indexOf(socket.id);
                __rooms[socket.token].splice(index, 1);
                if (__rooms[socket.token].length == 0) {
                    delete __rooms[socket.token];
                }
            }
        });

        socket.on(CONSTANTS.UTILS.GET_IMAGE_FROM_URL, function (url) {
            Utils.downloadImageFromUrl(url, function (error, data, filename) {
                if (handleError(error)) return;
                socket.emit('image.getFromURLDone', {error: error, data: data, filename: filename});
            });
        });

        socket.on(CONSTANTS.NOTIFICATIONS.SEND, function () {
            if (config_index == 'local') {
                var notifications = new Notifications(real_config, client, logger);
                notifications.sendAutoNotifications();
                notifications.sendUsersNotifications();
            }
        });

        socket.on(CONSTANTS.NOTIFICATIONS.UPDATE_STATS, function () {
            if (config_index == 'local') {
                updateEventsStats();
            }
        });

        socket.on(CONSTANTS.VK_INTEGRATION.GROUPS_TO_POST, function (user_id) {
            let vk_sign_in = Entities.vk_sign_in,
                q_get_user_data = vk_sign_in
                    .select(vk_sign_in.id, vk_sign_in.secret, vk_sign_in.access_token)
                    .from(vk_sign_in)
                    .where(
                        vk_sign_in.user_id.equals(user_id)
                    ).toQuery();

            client.query(q_get_user_data, function (err, result) {
                if (handleError(err, CONSTANTS.VK_INTEGRATION.GROUPS_TO_POST, function () {
                    }, socket)) return;
                result.rows[0].user_id = user_id;
                socket.vk_user = result.rows[0];
                getVkGroups(result.rows[0], 'can_post');
            });
        });

        socket.on(CONSTANTS.VK_INTEGRATION.POST_IT, function (data) {
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


                if (handleError(err, CONSTANTS.VK_INTEGRATION.POST_ERROR, function () {
                    }, socket)) return;

                rest.get(url, {
                    json: true,
                    headers: {
                        'Accept-Language': 'ru,en-us'
                    }
                })
                    .on('complete', function (result) {

                        if (result instanceof Error) {
                            handleError(result, CONSTANTS.VK_INTEGRATION.POST_ERROR, function () {
                            }, socket);
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
                                                handleError(result, CONSTANTS.VK_INTEGRATION.POST_ERROR, function () {
                                                }, socket);
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
                                                            handleError(res_data, CONSTANTS.VK_INTEGRATION.POST_ERROR, function () {
                                                            }, socket);
                                                        } else {
                                                            if (res_data.response.length == 0) {
                                                                handleError({name: 'CANT_SAVE_WALL_PHOTO'}, CONSTANTS.VK_INTEGRATION.POST_ERROR, function () {
                                                                }, socket);
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
                                                                if (handleError(err, CONSTANTS.VK_INTEGRATION.POST_ERROR, function () {
                                                                    }, socket)) return;

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
                                                                        if (res instanceof Error) {
                                                                            handleError(result, CONSTANTS.VK_INTEGRATION.POST_ERROR, function () {
                                                                            }, socket);
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

        socket.on(CONSTANTS.UTILS.UPDATE_IMAGES, function () {
            cropper.resizeNew({
                images: real_config.images,
                client: client
            }, function () {
                socket.emit(CONSTANTS.UTILS.UPDATE_IMAGES_DONE);
            });
        });

    };

    io.on('connection', ioHandlers);

    if (io2 != null) {
        io2.on('connection', ioHandlers);
    }


    /* All endpoints below are used for calls from PHP*/
    app.get('/utils/updateImages', function (req, res) {
        cropper.resizeNew({
            images: real_config.images,
            client: client
        }, function () {
            res.json({status: true});
        });
    });

    app.get('/utils/updateGeocodes', function (req, res) {
        if (config_index != 'prod') {
            console.log(req.params);
        }
        updateEventsGeocodes(req.params.event_id);
        res.json({status: true});
    });

    app.get('/utils/events/:id', function (req, res) {
        if (config_index != 'prod') {
            console.log(req.params);
        }
        try {
            updateEventsGeocodes(req.params.id);
        } catch (e) {
        }

        try {
            insertRecommendationsAccordance({event_id: req.params.id}, function () {
                updateRecommendations({event_id: req.params.id}, logger.info)
            });
        } catch (e) {
        }

        try {
            cropper.resizeNew({
                images: real_config.images,
                client: client
            }, function () {
                res.json({status: true});
            });
        } catch (e) {
        }

        try {
            let scheduler = new MailScheduler(client, handleError);
            scheduler.scheduleIfFirstEvent(req.params.id);
        } catch (e) {
        }


        console.log(req.query);
        if (req.query.is_new){
            try {
                rest.get('http://localhost:5000/events/' + req.params.id)
            } catch (e) {
            }
        }
    });

    app.get('/recommendations/events/:id', function (req, res) {
        insertRecommendationsAccordance({event_id: req.params.id}, function () {
            updateRecommendations({event_id: req.params.id}, logger.info)
        });
    });

    app.get('/recommendations/organizations/:id', function (req, res) {
        insertRecommendationsAccordance({organization_id: req.params.id}, function () {
            updateRecommendations({organization_id: req.params.id}, logger.info);
        });
        res.json({status: true});
    });

    app.get('/recommendations/users/:id', function (req, res) {
        insertRecommendationsAccordance({organization_id: req.params.id}, function () {
            updateRecommendations({user_id: req.params.id}, logger.info);
        });
    });


    app.get('/utils/qr/:event_id/:uuid', function (req, res) {
        var format = 'png',
            available_types = ['png', 'svg', 'pdf', 'eps'],
            headers = {
                png: 'image/png',
                svg: 'image/svg+xml',
                pdf: 'application/pdf',
                eps: 'application/postscript'
            },
            size = 10;
        if (checkNested(req, 'query', 'format')) {
            console.log(req.query.format);
            if (available_types.indexOf(req.query.format) != -1) {
                format = req.query.format;
            }
        }
        if (checkNested(req, 'query', 'size')) {
            size = parseInt(req.query.size);
            size = isNaN(size) ? 10 : size;
        }

        console.log({
            uuid: req.params.uuid,
            event_id: req.params.event_id,
        });

        var qr_svg = qr.image(JSON.stringify({
            uuid: req.params.uuid,
            event_id: req.params.event_id,
        }), {
            type: format,
            size: size
        });
        res.setHeader("content-type", headers[format]);
        qr_svg.pipe(res);
    });

    app.get('/utils/invitation-qr/:organization_id/:uuid', function (req, res) {
        var format = 'png',
            available_types = ['png', 'svg', 'pdf', 'eps'],
            headers = {
                png: 'image/png',
                svg: 'image/svg+xml',
                pdf: 'application/pdf',
                eps: 'application/postscript'
            },
            size = 10;
        if (checkNested(req, 'query', 'format')) {
            console.log(req.query.format);
            if (available_types.indexOf(req.query.format) != -1) {
                format = req.query.format;
            }
        }
        if (checkNested(req, 'query', 'size')) {
            size = parseInt(req.query.size);
            size = isNaN(size) ? 10 : size;
        }

        console.log({
            uuid: req.params.uuid,
            organization_id: req.params.organization_id,
        });

        var qr_svg = qr.image(JSON.stringify({
            uuid: req.params.uuid,
            organization_id: req.params.organization_id,
        }), {
            type: format,
            size: size
        });
        res.setHeader("content-type", headers[format]);
        qr_svg.pipe(res);
    });

    app.listen(8000, function () {
        console.log('Node listening on port 8000!');
    });

});