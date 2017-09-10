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
    BTCCheker = require('./check_bitcoin_payments'),
    crypto = require('crypto'),
    bodyParser = require('body-parser'),
    UpdateQueries = require('./UpdateQueries'),
    __rooms = {},
    pdf_render = require('chrome-headless-render-pdf'),
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

    if (err) {
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
        btc_checker = new BTCCheker(),
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


    btc_checker.init(client, rest);

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
            operations = [],
            events_args = [],
            orgs_args = [];

        q_upd_events = q_upd_events.replace("'{SIMILARITY_TEXT}'", data.events_update_texts == false ? 'rating_texts_similarity' : events_text);
        q_upd_organizations = q_upd_organizations.replace("'{SIMILARITY_TEXT}'", data.organizations_update_texts == false ? 'rating_texts_similarity' : organizations_text);


        if (data.user_id) {
            q_upd_organizations = q_upd_organizations + ' AND view_users_organizations.user_id = $1';
            q_upd_organizations = q_upd_organizations.replace("'{WHERE_PLACEHOLDER}'", ' WHERE user_id = $2');

            q_upd_events = q_upd_events + ' AND view_users_events.user_id = $1';
            q_upd_events = q_upd_events.replace("'{WHERE_PLACEHOLDER}'", ' AND user_id = $2');

            upd_events = upd_organizations = true;
            upd_events = data.update_events == undefined ? upd_events : data.update_events;
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
            console.log('Updated', data);
            cb(err, results);
        });
    }

    function globalUpdateRecommendations() {
        let q = Entities.users.select(Entities.users.id).toQuery();
        client.query(q, function (err, users) {
            if (err) return handleError(err);
            let queue = [];
            users.rows.forEach(function (user) {
                queue.push(function (callback) {
                    console.log('Updating for user: ' + user.id);
                    updateRecommendations({user_id: user.id}, callback);
                });
            });
            async.series(queue, function (err, results) {
                if (err) handleError(err);
            })
        })
    }

    function updateAuditoryInterests() {
        let q = Entities.users.select(Entities.users.id).toQuery();
        client.query(q, function (err, users) {
            if (err) return handleError(err);
            let queue = [],
                q_ins_value = `INSERT INTO auditory_interests(tg_topic_id, user_id, value, created_at)
             VALUES($1, $2, $3, NOW()) ON CONFLICT (tg_topic_id, user_id) DO UPDATE SET 
             value = $3, updated_at = NOW()`,
                q_get_params = UpdateQueries.get_user_interests;
            users.rows.forEach(function (user) {
                queue.push(function (callback) {
                    client.query(q_get_params, [user.id], function (err, res) {
                        if (err) {
                            handleError(err);
                            callback(err);
                        }
                        let values_sum = 0;
                        res.rows.forEach(topic => {
                            values_sum += parseFloat(topic.value);
                        });

                        res.rows.forEach(topic => {
                            let _value = values_sum === 0 ? 0 : (parseFloat(topic.value) / values_sum) * 100;
                            client.query(q_ins_value, [topic.tg_topic_id, topic.user_id, _value]);
                        });
                        callback(null);
                    })
                });
            });
            async.parallelLimit(queue, 10, function (err, results) {
                if (err) handleError(err);
            })
        })

    }

    function updateSearchIndexes() {
        rest.get('http://localhost/api/v1/events/update/search')
            .on('complete', function (e) {
                console.log(e);
            });
        rest.get('http://localhost/api/v1/organizations/update/search')
            .on('complete', function (e) {
                console.log(e);
            });
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


    try {
        new CronJob('*/10 * * * *', function () {
            let scheduler = new MailScheduler(client, handleError);
            scheduler.scheduleAfterEvent();
        }, null, true);
    } catch (ex) {
        logger.error(ex);
    }

    try {
        new CronJob('*/10 * * * *', function () {
            let scheduler = new MailScheduler(client, handleError);
            scheduler.scheduleOrderWaitingPayment();
        }, null, true);
    } catch (ex) {
        logger.error(ex);
    }
    try {
        new CronJob('0 */1 * * *', function () {
            let notifications = new Notifications(real_config, client, logger);
            notifications.scheduleFriendInterestedIn();
        }, null, true);
    } catch (ex) {
        logger.error(ex);
    }
    try {
        new CronJob('30 */1 * * *', function () {
            let notifications = new Notifications(real_config, client, logger);
            notifications.send();
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

//every day at 4:30 am
    try {
        new CronJob('30 1 * * *', function () {
            globalUpdateRecommendations();
        }, null, true);
    } catch (ex) {
        logger.error(ex);
    }

//every day at 4:00 am
    try {
        new CronJob('00 1 * * *', function () {
            let notifications = new Notifications(real_config, client, logger);
            notifications.scheduleRecommendationsOrganizations();
        }, null, true);
    } catch (ex) {
        logger.error(ex);
    }

    try {
        new CronJob('30 14 * * *', function () {
            let notifications = new Notifications(real_config, client, logger);
            notifications.sendRecommendationsOrganizations();
        }, null, true);
    } catch (ex) {
        logger.error(ex);
    }

//every day at 3:30 am
    try {
        new CronJob('30 0 * * *', function () {
            updateAuditoryInterests();
        }, null, true);
    } catch (ex) {
        logger.error(ex);
    }

//every day at 5:30 am
    try {
        new CronJob('30 2 * * *', function () {
            updateSearchIndexes();
        }, null, true);
    } catch (ex) {
        logger.error(ex);
    }


    /*Every minute BEGIN*/

    try {
        new CronJob('*/1 * * * *', function () {
            btc_checker.updateStatuses();
        }, null, true);
    } catch (ex) {
        logger.error(ex);
    }

    try {
        new CronJob('*/1 * * * *', function () {
            let mailer = new Mailer(transporter, logger);
            if (config_index === 'prod' || args.indexOf('--send-emails-force') !== -1) {
                mailer.sendScheduled(client, handleError);
            }
        }, null, true);
    } catch (ex) {
        logger.error(ex);
    }


    try {
        new CronJob('*/1 * * * *', function () {
            if (config_index === 'prod' || args.indexOf('--resize-images') !== -1) {
                cropper.resizeNew({
                    images: real_config.images,
                    client: client
                });
                cropper.downloadNew({
                    client: client,
                    images: real_config.images
                });
            }
            if (config_index === 'prod') {
                var notifications = new Notifications(real_config, client, logger);
                notifications.sendAutoNotifications();
                notifications.sendUsersNotifications();
            }
            publicDelayedEvents();
        }, null, true);
    } catch (ex) {
        logger.error(ex);
    }

    /*Every minute END*/

    if (args.indexOf('--schedule-emails-failed') !== -1) {
        let scheduler = new MailScheduler(client, handleError);
        scheduler.scheduleOrganizationRegistrationFailed();
    }


    if (args.indexOf('--update-search-index') !== -1) {
        updateSearchIndexes();
    }

    if (args.indexOf('--schedule-emails-weekly') !== -1) {
        let scheduler = new MailScheduler(client, handleError);
        scheduler.scheduleWeeklyEmails();
    }

    if (args.indexOf('--send-emails-force') !== -1) {
        let mailer = new Mailer(transporter);
        mailer.sendScheduled(client, handleError);
    }

    if (args.indexOf('--check-btc') !== -1) {
        btc_checker.updateStatuses();
    }

    if (args.indexOf('--global-update-recommendations') !== -1) {
        globalUpdateRecommendations();
    }

    if (args.indexOf('--update-interests') !== -1) {
        updateAuditoryInterests();
    }

    if (args.indexOf('--schedule-after-event') !== -1) {
        let scheduler = new MailScheduler(client, handleError);
        scheduler.scheduleAfterEvent();
    }
    if (args.indexOf('--schedule-notification-new-orgs') !== -1) {
        let notifications = new Notifications(real_config, client, logger);
        notifications.scheduleRecommendationsOrganizations();
    }

    if (args.indexOf('--schedule-friend-interested-in') !== -1) {
        let notifications = new Notifications(real_config, client, logger);
        notifications.scheduleFriendInterestedIn();
    }

    if (args.indexOf('--send-notification-new-orgs') !== -1) {
        let notifications = new Notifications(real_config, client, logger);
        notifications.sendRecommendationsOrganizations();
    }

    if (args.indexOf('--send-friend-interested-in') !== -1) {
        let notifications = new Notifications(real_config, client, logger);
        notifications.sendFriendInterestedIn();
    }

    if (args.indexOf('--schedule-waiting-for-payment') !== -1) {
        let scheduler = new MailScheduler(client, handleError);
        scheduler.scheduleOrderWaitingPayment();
    }

    var ioHandlers = function (socket) {

        socket.on(CONSTANTS.CONNECTION.ERROR, function (err) {
            logger.error(err);
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
            // insertRecommendationsAccordance({event_id: req.params.id}, function () {
            //     updateRecommendations({event_id: req.params.id}, logger.info)
            // });
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
        if (req.query.is_new) {
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
        res.json({status: true});
        insertRecommendationsAccordance({organization_id: req.params.id}, function () {
            updateRecommendations({
                user_id: req.params.id,
                events_update_texts: req.query.update_texts,
                update_events: req.query.update_events,
                organizations_update_texts: req.query.update_texts
            }, (data) => {
                logger.info(data);
            });
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

    app.get('/utils/qr/bitcoin/', function (req, res) {
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


        var qr_svg = qr.image('bitcoin:' + req.query.address + '?amount=' + req.query.amount, {
            type: format,
            size: size
        });
        res.setHeader("content-type", headers[format]);
        qr_svg.pipe(res);
    });

    app.get('/utils/pdf/tickets/:uuid', function (req, res) {
        let uuid = req.params.uuid;
        let domain = process.env.ENV === 'prod' ? 'https://evendate.io/' : 'http://localhost/';

        pdf_render.generateSinglePdf(domain + 'print_ticket.php?uuid=' + uuid, '../email_files/' + uuid + '.pdf')
            .then(() => {
                res.json({status: true});
            })
            .catch(() => {
                res.json({status: false});
            });
    });

    app.get('/utils/pdf/events/:event_id/orders/:uuid', function (req, res) {
        let uuid = req.params.uuid;
        let event_id = req.params.event_id;
        let domain = process.env.ENV === 'prod' ? 'https://evendate.io/' : 'http://localhost/';

        console.log(domain + 'email_files/email-offer-template.php?event_id=' + event_id + '&uuid=' + uuid);

        pdf_render.generateSinglePdf(domain + 'email_files/email-offer-template.php?event_id=' + event_id + '&uuid=' + uuid, '../email_files/Evendate-Bill-' + uuid + '.pdf')
            .then(() => {
                res.json({status: true});
            })
            .catch((err) => {
                console.log(err);
                res.json({status: false});
            });
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


    app.get('/log', function (req, res) {
        console.log(req);
        res.json({status: true});
    });
    app.listen(8000, function () {
        console.log('Node listening on port 8000!');
    });

});