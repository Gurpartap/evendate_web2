var rest = require('restler'),
    Utils = require('./utils');

var DEVICE_TYPES = {
        IOS: 'ios',
        BROWSER: 'browser',
        ANDROID: 'android'
    },
    ONE_SIGNAL_URL = {
        CREATE: 'https://onesignal.com/api/v1/notifications'
    };


function NotificationsManager(settings) {
    this.settings = settings;
}


NotificationsManager.prototype.create = function (notification, device, type) {

    var _this = this;
    var _text = Utils.replaceTags(notification.notification_type_text, notification);
    var note = {
        alert: _text,
        body: _text,
        icon: notification.image,
        payload: {
            type: type !== undefined ? type : null,
            title: notification.title,
            event_id: notification.event_id,
            body: _text,
            icon: notification.image,
            organization_logo: notification.img_medium_url
        },
        notification_id: notification.id
    };

    if (note.payload.recommendations_organizations) {
        note.payload.type = 'recommendations_organizations';
    }else if (note.payload.event_id) {
        note.payload.type = 'events';
    } else if (note.payload.organization_id) {
        note.payload.type = 'organizations';
    } else if (note.payload.user_id) {
        note.payload.type = 'users';
    }

    let send_data = {
        app_id: _this.settings.one_signal.app_id,
        contents: {
            en: note.alert,
            ru: note.alert
        },
        include_player_ids: [device.device_token],
        data: note.payload
    };

    if (device.client_type === DEVICE_TYPES.IOS) {
        send_data['ios_badgeType'] = 'Increase';
        send_data['ios_badgeCount'] = 1;
        send_data['isIos'] = true;
    } else if (device.client_type === DEVICE_TYPES.BROWSER) {
        send_data['isChromeWeb'] = true;
    } else if (device.client_type === DEVICE_TYPES.ANDROID) {
        send_data['isAndroid'] = true;
    } else {
        note.send = function (callback) {
            callback(null, null);
        };
        return;
    }

    note.send = function (callback) {
        rest
            .postJson(ONE_SIGNAL_URL.CREATE, send_data)
            .on('complete', function (res) {
                if (res instanceof Error) {
                    callback(res, null);
                } else {
                    callback(null, res.id);
                }
            });
    };


    return note;
};

module.exports = NotificationsManager;