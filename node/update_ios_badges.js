/**
 * Created by kardi on 01.08.2016.
 */

var
    rest = require('restler'),
    pg = require('pg'),
    config = JSON.parse(fs.readFileSync('../v1-config.json')),
    sql = require('sql'),
    args = process.argv.slice(2),
    ONE_SIGNAL_URL = 'https://onesignal.com/api/v1/notifications';


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
    q_get_ios_devices = 'SELECT device_token ' +
        ' FROM tokens' +
        ' WHERE LOWER(client_type) = \'ios\'' +
        ' AND device_token IS NOT NULL ' +
        ' AND tokens.device_token != \'null\'' +
        ' AND user_id = 14',
    q_get_count = 'SELECT COUNT(view_events.id) :: INT AS users_unseen_count' +
        ' FROM view_events' +
        ' INNER JOIN subscriptions' +
        ' ON subscriptions.organization_id = view_events.organization_id' +
        ' AND subscriptions.user_id = $1' +
        ' AND subscriptions.status = TRUE' +
        ' WHERE view_events.last_event_date > DATE_PART(\'epoch\', NOW()) :: INT' +
        ' AND view_events.created_at > (SELECT DATE_PART(\'epoch\', stat_organizations.created_at) :: INT' +
        ' FROM stat_organizations' +
        ' INNER JOIN stat_event_types' +
        ' ON stat_organizations.stat_type_id = stat_event_types.id' +
        ' INNER JOIN tokens ON stat_organizations.token_id = tokens.id' +
        ' WHERE type_code = \'view\' AND organization_id = subscriptions.organization_id AND' +
        ' tokens.user_id = :user_id' +
        ' ORDER BY stat_organizations.created_at DESC' +
        ' LIMIT 1)' +
        ' AND view_events.id NOT IN (SELECT event_id' +
        ' FROM view_stat_events' +
        ' WHERE user_id = $1)';

pg.connect(pg_conn_string, function (err, client, done) {
    var user_id = args[0];
    client.query(q_get_ios_devices, [user_id], function (err, devices) {
        if (err) return console.log(err);
        if (devices.rows.length == 0) return console.log('NO_DEVICES');
        var device_tokens = [];
        devices.rows.forEach(function (device) {
            device_tokens.push(device.device_token);
        });
        client.query(q_get_count, [user_id], function (err, counter) {
            if (counter.rows.length == 0) return console.log('NO_COUNTER');
            rest
                .postJson(ONE_SIGNAL_URL, {
                    app_id: _this.settings.one_signal.app_id,
                    content_available: true,
                    ios_badgeType: 'SetTo',
                    ios_badgeCount: counter.rows[0].users_unseen_count,
                    isIos: true,
                    include_player_ids: device_tokens,
                    data: {}
                })
                .on('complete', function (res) {
                    if (res instanceof Error) {
                        console.log(res, null);
                    } else {
                        console.log(res, null);
                    }
                });
        });
    });
});