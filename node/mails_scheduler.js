let fs = require('fs');
let restler = require('restler');
let moment = require("moment");
let async = require("async");
let Utils = require("./utils");
const exporter = require('highcharts-export-server');

class MailScheduler {

    static getLastWeekStart() {
        let today = moment();
        let daystoLastMonday = 0 - (1 - today.isoWeekday()) + 7;

        return today.subtract(daystoLastMonday, 'days');
    }

    static getLastWeekEnd() {
        let lastMonday = MailScheduler.getLastWeekStart();
        return lastMonday.add(6, 'days');
    }


    static prepareHighchartsSettings(data) {
        let __C = {
                COLORS: {
                    PRIMARY: '#2e3b50',
                    MUTED: '#3e4d66',
                    MUTED_80: '#657184',
                    MUTED_50: '#9fa6b3',
                    MUTED_30: '#c5c9d1',
                    TEXT: '#4a4a4a',
                    ACCENT: '#f82969',
                    ACCENT_ALT: '#ff5f9e',
                    FRANKLIN: '#28be84',
                    FRANKLIN_ALT: '#23d792'
                },
            },
            normalized_series = [],
            FILL_COLORS = [
                ['rgba(35, 215, 146, 0.18)', 'rgba(101, 101, 101, 0.6)', 'rgba(101, 101, 101, 0.6)'],
                ['rgba(35, 215, 146, 0.09)', 'rgba(101, 101, 101, 0.6)', 'rgba(101, 101, 101, 0.6)']
            ];

        data.forEach(item => {
            normalized_series.push([item.value]);
        });

        return {
            chart: {
                backgroundColor: null,
                plotShadow: false,
                style: {
                    fontFamily: 'Helvetica',
                    fontSize: 'inherit'
                },
                type: 'areaspline',
                plotBackgroundColor: '#fcfcfc',
                plotBorderColor: '#ebebeb',
                plotBorderWidth: 1
            },
            colors: [__C.COLORS.FRANKLIN, __C.COLORS.MUTED_80, __C.COLORS.ACCENT, __C.COLORS.MUTED, __C.COLORS.MUTED_50, __C.COLORS.MUTED_30],
            title: false,
            legend: {
                enabled: false
            },
            plotOptions: {
                areaspline: {
                    fillOpacity: 0.5
                }
            },
            scrollbar: {enabled: false},
            navigator: {
                outlineColor: '#ebebeb',
                outlineWidth: 1,
                maskInside: false,
                maskFill: 'rgba(245, 245, 245, 0.66)',
                handles: {
                    backgroundColor: '#9fa7b6',
                    borderColor: '#fff'
                },
                xAxis: {
                    gridLineWidth: 0,
                }
            },
            xAxis: {
                gridLineWidth: 1,
                gridLineDashStyle: 'dash',
                categories: ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"]
                // type: 'datetime',
                // showEmpty: false,
                // tickPosition: 'inside',
                // dateTimeLabelFormats: {
                //     minute: '%H:%M',
                //     hour: '%H:%M',
                //     day: '%e',
                //     week: '%e %b',
                //     month: '%b %y',
                //     year: '%Y'
                // }
            },
            yAxis: {
                allowDecimals: false,
                floor: 0,
                min: 0,
                gridLineDashStyle: 'dash',
                opposite: false,
                title: {
                    text: false
                }
            },
            credits: {
                enabled: false
            },
            series: [
                {
                    data: normalized_series,
                    fillColor: {
                        linearGradient: {x1: 0, x2: 0, y1: 0, y2: 1},
                        stops: FILL_COLORS.map(function (colors_set, j) {
                            return [j, colors_set[0]];
                        })
                    }
                }
            ]
        };
    }

    static validateEmail(email) {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }


    handleError() {
        console.log(args);
    }

    constructor(client, errorHandler) {
        this.client = client;
        if (errorHandler instanceof Function) {
            this.handleError = errorHandler;
        }
    }

    scheduleOrganizationRegistrationFailed() {
        let handleError = this.handleError,
            _client = this.client,
            q_get_failed_registrations = fs.readFileSync('./emails/failed_registrations.sql', {encoding: 'utf8'});
        this.client.query(q_get_failed_registrations, [], function (err, res) {
            if (err) return handleError(err);
            let q_ins_failed = 'INSERT INTO emails(email_type_id, recipient, data)' +
                ' VALUES (2, $1, $2)';
            res.rows.forEach(recipient => {
                if (MailScheduler.validateEmail(recipient.email) == false) return;
                _client.query(q_ins_failed, [recipient.email, JSON.stringify({
                    name: recipient.name,
                    uuid: recipient.uuid
                })], handleError);
            })
        })
    }

    scheduleIfFirstEvent(event_id) {
        let handleError = this.handleError,
            _client = this.client,
            q_get_events_count = fs.readFileSync('./emails/first_event_check.sql', {encoding: 'utf8'});
        this.client.query(q_get_events_count, [event_id], function (err, res) {
            if (err) return handleError(err);
            let q_ins_first_event = 'INSERT INTO emails(email_type_id, recipient, data)' +
                ' VALUES (3, $1, $2)';
            res.rows.forEach(recipient => {
                if (recipient.organization_events_count == 0 && MailScheduler.validateEmail(recipient.organization_email)) {
                    _client.query(q_ins_first_event, [recipient.organization_email, JSON.stringify({})], handleError);
                }
                if (recipient.users_events_count == 0 && MailScheduler.validateEmail(recipient.creator_email)) {
                    _client.query(q_ins_first_event, [recipient.creator_email, JSON.stringify({})], handleError);
                }
            });
        });
    }

    scheduleWeeklyEmails() {
        //Set up a pool of PhantomJS workers
        exporter.initPool();
        let start = MailScheduler.getLastWeekStart().format('YYYY-MM-DD');
        let end = MailScheduler.getLastWeekEnd().format('YYYY-MM-DD');
        let folder_path = '/email_images/' + start + ' - ' + end + '/';
        try {
            fs.mkdirSync('..' + folder_path);
        } catch (e) {
        }

        let handleError = this.handleError,
            _client = this.client,
            q_get_organizations = fs.readFileSync('./emails/weekly_organizations.sql', {encoding: 'utf8'}),
            q_get_admins = fs.readFileSync('./emails/weekly_admins.sql', {encoding: 'utf8'}),
            q_get_new_subscribers = fs.readFileSync('./emails/weekly_new_subscribers.sql', {encoding: 'utf8'}),
            q_get_weekly_events_view_count = fs.readFileSync('./emails/weekly_events_view_count.sql', {encoding: 'utf8'}),
            q_get_weekly_notifications_sent = fs.readFileSync('./emails/weekly_notifications_sent.sql', {encoding: 'utf8'}),
            q_events_added = fs.readFileSync('./emails/weekly_events_added.sql', {encoding: 'utf8'}),
            q_ins_data = 'INSERT INTO emails(email_type_id, recipient, data)' +
                ' VALUES (5, $1, $2)',
            queue = [];

        this.client.query(q_get_organizations, [], function (err, res) {
            if (err) return handleError(err);

            res.rows.forEach(organization => {
                (() => {
                    queue.push((callback) => {
                        let data_getters = {
                            graph_data: (callback) => {
                                _client.query(q_get_weekly_events_view_count, [start, end, organization.id], function (graph_err, graph_result) {

                                    if (graph_err) {
                                        handleError(graph_err);
                                        callback(null);
                                    }

                                    let settings = MailScheduler.prepareHighchartsSettings(graph_result.rows);
                                    exporter.export({
                                        type: 'png',
                                        options: settings
                                    }, function (err, res) {
                                        //The export result is now in res.
                                        //If the output is not PDF or SVG, it will be base64 encoded (res.data).
                                        //If the output is a PDF or SVG, it will contain a filename (res.filename).

                                        //Kill the pool when we're done with it, and exit the application

                                        if (err) return callback(null, null);
                                        if (res.data == undefined) return callback(null, null);

                                        let base64Data = res.data.replace(/^data:image\/png;base64,/, "");
                                        let filename = "views-" + organization.id + "-week-" + Utils.makeId(7) + ".png";
                                        exporter.killPool();
                                        fs.writeFile('..' + folder_path + filename, base64Data, 'base64', function (err) {
                                            if (err) {
                                                console.log(err);
                                                callback(null, null);
                                            } else {
                                                callback(null, 'https://evendate.ru' + folder_path + filename);
                                            }

                                        });
                                    });
                                })

                            },
                            main_stats: (callback) => {
                                let url = 'http://localhost/api/v1/statistics/organizations/' + organization.id +
                                    '?fields=view,fave&scale=week&since=' + start + ' 00:00:01&to=' + end + ' 23:59:59';
                                restler
                                    .get(url,
                                        {
                                            headers: {
                                                'Authorization': organization.admin_token
                                            }
                                        })
                                    .on('complete', function (result) {
                                        if (result.status != true) {
                                            handleError(result.data);
                                        }
                                        callback(null, result.data);
                                    });
                            },
                            new_subscribers: (callback) => {
                                _client.query(q_get_new_subscribers, [organization.id, start, end], function (subs_err, subs_result) {
                                    if (subs_err) {
                                        handleError(subs_err);
                                        callback(null, []);
                                    }
                                    callback(null, subs_result.rows);
                                });
                            },
                            events_added: (callback) => {
                                _client.query(q_events_added, [organization.id, start, end], function (err, result) {
                                    if (err) {
                                        handleError(err);
                                        callback(null, 0);
                                    }
                                    if (result.rows.length == 1){
                                        callback(null, result.rows[0].events_added);
                                    }else{
                                        callback(null, 0);
                                    }
                                });
                            },
                            notifications_sent: (callback) => {
                                _client.query(q_get_weekly_notifications_sent, [organization.id, start, end], function (err, result) {
                                    if (err) {
                                        handleError(err);
                                        callback(null, []);
                                    }
                                    if (result.rows.length == 1){
                                        callback(null, result.rows[0].notifications_sent);
                                    }else{
                                        callback(null, 0);
                                    }                                });
                            },
                            emails_to_send: (callback) => {
                                _client.query(q_get_admins, [organization.id], function (err, result) {
                                    if (err) {
                                        handleError(err);
                                        callback(err, null);
                                    }
                                    let res_data = [];
                                    result.rows.forEach(data => {
                                        res_data.push(data.email);
                                    });
                                    callback(null, res_data);
                                })
                            }
                        };
                        let insert_data = [];

                        async.parallelLimit(data_getters, 3, function (err, results) {

                            if (results.emails_to_send != null && results.graph_data != null) {
                                if (results.emails_to_send.indexOf(organization.email) == -1) {
                                    results.emails_to_send.push(organization.email);
                                }
                                results.emails_to_send.forEach(email => {
                                    if (MailScheduler.validateEmail(email) == false) return true;
                                    insert_data.push(inner_cb => {
                                        _client.query(q_ins_data, [email, JSON.stringify({
                                            organization_id: organization.id,
                                            organization_short_name: organization.organization_short_name,
                                            new_subscribers_count: results.new_subscribers.length,
                                            subscribed: results.new_subscribers,
                                            events_added: results.events_added,
                                            notifications_sent: results.notifications_sent,
                                            main_stats: results.main_stats,
                                            graph_data_url: results.graph_data
                                        })], function (err) {
                                            if (err) {
                                                handleError(err);
                                            }
                                            inner_cb(null);
                                        });

                                    })
                                });
                            }

                            async.parallelLimit(insert_data, 3, function () {
                                callback(null);
                            });
                        });
                    })
                })();
            });

            async.parallelLimit(queue, 1, (err, results) => {
                if (err) handleError(err);
            })
        });
    }


    scheduleEventFinished() {

    }
}

module
    .exports = MailScheduler;