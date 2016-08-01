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
            type: null,
            title: notification.title,
            event_id: notification.event_id,
            body: _text,
            icon: notification.image,
            organization_logo: notification.img_medium_url
        },
        notification_id: notification.id
    };

    if (device.client_type == DEVICE_TYPES.IOS) {
        if (note.payload.event_id) {
            note.payload.type = 'events';
        } else if (note.payload.organization_id) {
            note.payload.type = 'organizations';
        } else if (note.payload.user_id) {
            note.payload.type = 'users';
        }
        note.send = function (callback) {

            rest
                .postJson(ONE_SIGNAL_URL.CREATE, {
                    app_id: _this.settings.one_signal.app_id,
                    contents: {
                        en: note.alert,
                        ru: note.alert
                    },
                    ios_badgeType: 'Increase',
                    ios_badgeCount: 1,
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
            var type;
            if (note.payload.event_id){
                type = 'events';
            }else if (note.payload.organization_id){
                type = 'organizations';
            }else if (note.payload.user_id){
                type = 'users';
            }
            var send_data = {
                'data.message': note.body,
                'data.event_id': note.payload.event_id,
                'data.image_url': note.payload.organization_logo,
                'data.organization_id': note.payload.organization_id,
                'data.type': type,
                registration_id: device.device_token
            };

            // send_data['data.to'] = '';

            send_data.registration_id = device.device_token;
            gcm.send(send_data, function (err, messageId) {
                if (err) {
                    callback(err, null);
                } else {
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