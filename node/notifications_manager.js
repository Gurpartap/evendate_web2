var apn = require('apn'),
    rest = require('restler'),
    gcm,
    Utils = require('./utils'),
    GCM = require('gcm').GCM;

var DEVICE_TYPES = {
        IOS: 'ios',
        ANDROID: 'android'
    },
    ONE_SIGNAL_URL = {
        CREATE: 'https://onesignal.com/api/v1/notifications'
    };


function NotificationsManager(settings) {
    this.settings = settings;
    gcm = new GCM(settings.GCM.api_key);
}


NotificationsManager.prototype.create = function (notification, device) {

    var _this = this;
    var _text = Utils.replaceTags(notification.notification_type_text, notification);
    var note = {
        alert: _text,
        body: _text,
        icon: notification.image,
        payload: {
            type: 'event_notification',
            title: notification.title,
            event_id: notification.event_id,
            body: _text,
            icon: notification.image,
            organization_logo: notification.organization_logo_small_url
        },
        notification_id: notification.id
    };

    if (device.client_type == DEVICE_TYPES.IOS) {

        note.send = function (callback) {
            rest
                .postJson(ONE_SIGNAL_URL.CREATE, {
                        app_id: _this.settings.one_signal.app_id,
                        contents: {
                            en: note.alert,
                            ru: note.alert
                        },
                        buttons: [
                            {"id": "hide", "text": "Не показывать", "icon": null},
                            {"id": "favorite", "text": "В избранное", "icon": null}],
                        isIos: true,
                        include_player_ids: [device.device_token],
                        data: note.payload
                    })
                .on('complete', function (res) {
                    if (res instanceof Error) {
                        callback(res, null);
                    } else {
                        callback(null, res.id);
                    }
                });
        };
    } else if (device.client_type == DEVICE_TYPES.ANDROID) {
        note.send = function (callback) {
            var send_data = {};
            send_data['data.message'] = note.body;
            send_data['data.event_id'] = note.payload.event_id;
            send_data['data.image_url'] = note.payload.organization_logo;
            send_data['data.organization_id'] = note.payload.organization_id;
            // send_data['data.to'] = '';
            send_data.registration_id = device.device_token;
            console.log(device, send_data);
            gcm.send(send_data, function (err, messageId) {
                if (err) {
                    callback(err, null);
                } else {
                    console.log(messageId);
                    callback(null, messageId);
                }
            });
        };
    } else {
        note.send = function (callback) {
            callback(null, null);
        }
    }

    return note;
};

module.exports = NotificationsManager;