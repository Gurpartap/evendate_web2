var rest = require('restler'),
    Utils = require('./utils');

var DEVICE_TYPES = {
        IOS: 'ios',
        BROWSER: 'browser',
        ANDROID: 'android'
    },
    ONE_SIGNAL_URL = {
        CREATE: 'https://onesignal.com/api/v1/notifications'
    },
    ANDROID_CHANNEL_IDS = {
        'events': 'ab2714b9-3eda-44b6-8b54-469ab5a3c838',
        'recommendations': 'ef3fedda-42f2-4002-8e0b-0a2b83207da0',
        'marketing': '26df66ba-9ffb-45b7-8ca5-b9f363fdfeb3',
        'friends': '291bde0e-694d-47c6-a200-65ec619adffd'
    };


function NotificationsManager(settings) {
    this.settings = settings;
}


NotificationsManager.prototype.create = function (notification, device, type, channel_type) {

    var _this = this;
    var _text = Utils.replaceTags(notification.notification_type_text, notification);
    var android_channel_id = channel_type ? ANDROID_CHANNEL_IDS[channel_type] : ANDROID_CHANNEL_IDS[type];
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
        android_channel_id: android_channel_id,
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
        data: note.payload,
        __client_type: device.client_type
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
        return note;
    }

    note.send = function (callback) {
        rest
            .postJson(ONE_SIGNAL_URL.CREATE, send_data)
            .on('complete', function (res) {
                if (res instanceof Error) {
                    callback(res, null, res);
                } else {
                    callback(null, res.id, res);
                }
            });
    };


    return note;
};

module.exports = NotificationsManager;