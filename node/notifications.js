/**
 * Created by kardi on 14.04.2016.
 */

"use strict";

var NotificationsManager = require('./notifications_manager.js'),
    Entities = require('./entities');

var ONLY_FOR_FAVORED = [
    'notification-event-canceled',
    'notification-event-changed-dates',
    'notification-event-changed-location',
    'notification-event-changed-registration',
    'notification-event-changed-price',
    'notification-event-registration-ending',
    'notification-one-day-registration-close'
];

class Notifications {

    constructor(settings, client, logger) {
        this.settings = settings;
        this.settings.client = client;
        this.logger = logger;
        this.notifications_manager = new NotificationsManager(settings);
    }

    getDevicesToSend(data, callback) {
        var view_auto_notifications_devices = Entities.view_auto_notifications_devices,
            view_auto_favored_devices = Entities.view_auto_favored_devices,
            view_users_notifications_devices = Entities.view_users_notifications_devices,
            q_get_to_send_devices;

        if (data.organization_id) { // auto notifications
            q_get_to_send_devices = view_auto_notifications_devices.select(
                view_auto_notifications_devices.id.distinct(),
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
            )
                .from(view_auto_notifications_devices)
                .where(view_auto_notifications_devices.organization_id.equals(data.organization_id))
                .toQuery()
        } else if (data.user_notification_id) {
            q_get_to_send_devices = view_users_notifications_devices.select(
                view_users_notifications_devices.id.distinct(),
                view_users_notifications_devices.token,
                view_users_notifications_devices.user_id,
                view_users_notifications_devices.created_at,
                view_users_notifications_devices.updated_at,
                view_users_notifications_devices.token_type,
                view_users_notifications_devices.expires_on,
                view_users_notifications_devices.device_token,
                view_users_notifications_devices.client_type,
                view_users_notifications_devices.device_name,
                view_users_notifications_devices.refresh_token,
                view_users_notifications_devices.uuid,
                view_users_notifications_devices.user_notification_id,
                view_users_notifications_devices.notify_in_browser
            )
                .from(view_users_notifications_devices)
                .where(view_users_notifications_devices.user_notification_id.equals(data.user_notification_id))
                .toQuery()
        } else if (data.event_id) { // auto notifications for favored users
            q_get_to_send_devices = view_auto_favored_devices.select(
                view_auto_favored_devices.id.distinct(),
                view_auto_favored_devices.token,
                view_auto_favored_devices.user_id,
                view_auto_favored_devices.created_at,
                view_auto_favored_devices.updated_at,
                view_auto_favored_devices.token_type,
                view_auto_favored_devices.expires_on,
                view_auto_favored_devices.device_token,
                view_auto_favored_devices.client_type,
                view_auto_favored_devices.device_name,
                view_auto_favored_devices.refresh_token,
                view_auto_favored_devices.uuid,
                view_auto_favored_devices.notify_in_browser
            ).where(view_auto_favored_devices.event_id.equals(data.event_id))
                .toQuery()
        }

        this.settings.client.query(q_get_to_send_devices, function (err, result) {
            callback(err, result.rows);
        });
    }

    sendUsersNotifications() {
        var _this = this,
            view_notifications = Entities.view_notifications,
            stat_users_notifications = Entities.stat_users_notifications;

        // there is bug in pg-lib which doesn't allow to use sql builder here
        _this.settings.client.query('SELECT view_notifications.*,' +
            ' view_events.organization_id,' +
            ' view_events.title,' +
            ' organizations.short_name,' +
            ' organizations.notification_suffix,' +
            ' view_events.image_square_vertical_url,' +
            ' view_events.image_square_horizontal_url,' +
            ' notification_types.type AS notification_type_name,' +
            ' notification_types.text AS notification_type_text' +
            ' FROM view_notifications ' +
            ' INNER JOIN view_events ON view_notifications.event_id = view_events.id' +
            ' INNER JOIN notification_types ON notification_types.id = view_notifications.notification_type_id' +
            ' INNER JOIN organizations ON organizations.id = view_events.organization_id' +
            ' WHERE ' +
            ' uuid IS NOT NULL' +
            ' AND view_notifications.done = FALSE' +
            ' AND view_notifications.status = TRUE' +
            ' AND view_notifications.notification_time <= DATE_PART(\'epoch\', NOW())::INT', function (err, res) {
            if (err) {
                _this.logger.error(err);
                return;
            }

            res.rows.forEach(function (notification) {

                _this.getDevicesToSend({user_notification_id: notification.user_notification_id}, function (errors, devices) {
                    if (errors) {
                        _this.logger.error(errors);
                        return
                    }
                    var q_upd_users_notifications = Entities.users_notifications
                        .update({
                            done: true
                        })
                        .where(Entities.users_notifications.id.equals(notification.user_notification_id))
                        .toQuery();

                    _this.settings.client.query(q_upd_users_notifications, function (err) {
                        if (err) _this.logger.error(errors);
                    });

                    devices.forEach(function (device) {

                        if (device.device_token == null) return true;

                        var note = _this.notifications_manager.create(notification, device);

                        note.send(function (err, message_id) {
                            if (err) return _this.logger.error(err);

                            var q_ins_notification = stat_users_notifications.insert({
                                user_notification_id: notification.user_notification_id,
                                token_id: device.id,
                                click_time: null,
                                received: true,
                                message_id: message_id
                            }).toQuery();

                            _this.settings.client.query(q_ins_notification, function (err) {
                                if (err) {
                                    _this.logger.error(err);
                                }
                            });
                        });
                    });
                })
            })
        });
    }

    sendAutoNotifications() {
        console.log('sendAutoNotifications');
        var _this = this,
            events_notifications = Entities.events_notifications,
            stat_notifications = Entities.stat_notifications;

        _this.settings.client.query('SELECT DISTINCT' +
            ' events_notifications.*,' +
            ' view_events.organization_id,' +
            ' view_events.title,' +
            ' organizations.short_name,' +
            ' organizations.notification_suffix,' +
            ' view_events.image_square_vertical_url,' +
            ' view_events.image_square_horizontal_url,' +
            ' organizations.images_domain || \'organizations_images/logos/medium/\' || organizations.img_medium_url AS img_medium_url,' +
            ' notification_types.type AS notification_type_name,' +
            ' notification_types.text AS notification_type_text' +
            ' FROM events_notifications' +
            ' INNER JOIN view_events ON events_notifications.event_id = view_events.id' +
            ' INNER JOIN notification_types ON notification_types.id = events_notifications.notification_type_id ' +
            ' INNER JOIN organizations ON organizations.id = view_events.organization_id' +
            ' WHERE notification_time <= NOW() AND done = FALSE LIMIT 5', function (err, result) {

            if (err){
                console.log('HERE IS ERROR');
                _this.logger.error(err);
            }

            result.rows.forEach(function (notification) {
                var data = {};

                if (ONLY_FOR_FAVORED.indexOf(notification.notification_type_name) === -1) {
                    data.organization_id = notification.organization_id;
                } else {
                    data.event_id = notification.event_id;
                }

                _this.getDevicesToSend(data, function (errors, devices) {
                    if (errors) {
                        _this.logger.error(errors);
                        return
                    }

                    var q_upd_events_notifications = events_notifications
                        .update({
                            done: true
                        })
                        .where(events_notifications.id.equals(notification.id))
                        .toQuery();

                    _this.settings.client.query(q_upd_events_notifications, function (err) {
                        if (err) _this.logger.error(errors);
                    });

                    devices.forEach(function (device) {

                        if (device.device_token == null) return true;

                        var note = _this.notifications_manager.create(notification, device);

                        note.send(function (err, message_id) {
                            if (err) return _this.logger.error(err);

                            var q_ins_notification = stat_notifications.insert({
                                event_notification_id: notification.id,
                                token_id: device.id,
                                click_time: null,
                                received: true,
                                message_id: message_id
                            }).toQuery();

                            _this.settings.client.query(q_ins_notification, function (err) {
                                if (err) {
                                    _this.logger.error(err);
                                }
                            });
                        });
                    });
                });


            });
        });
    }
}


module.exports = Notifications;