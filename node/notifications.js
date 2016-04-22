/**
 * Created by kardi on 14.04.2016.
 */

var NotificationsManager = require('./notifications_manager.js'),
    Entities = require('./entities'),
    Utils = require('./utils.js');

class Notifications {

    constructor(settings) {
        this.settings = settings;
        this.notifications = [];
    }

    getUsersNotifications() {

    }

    sendSystemNotifications() {
        var _this = this,
            view_auto_notifications = Entities.view_auto_notifications,
            events_notifications = Entities.events_notifications,
            q_get_events_notifications =
                view_auto_notifications
                    .select(
                        view_auto_notifications.id,
                        view_auto_notifications.event_id,
                        view_auto_notifications.notification_type_id,
                        view_auto_notifications.notification_time,
                        view_auto_notifications.status,
                        view_auto_notifications.done,
                        view_auto_notifications.organization_id,
                        view_auto_notifications.title,
                        view_auto_notifications.short_name,
                        view_auto_notifications.notification_suffix,
                        view_auto_notifications.image_square_vertical_url,
                        view_auto_notifications.image_square_horizontal_url,
                        view_auto_notifications.notification_type_name,
                        view_auto_notifications.notification_type_text
                    )
                    .from(view_auto_notifications).limit(5).toQuery();

        _this.settings.client.query(q_get_events_notifications, function (err, rows) {
            rows.rows.forEach(function (notification) {
                var view_auto_notifications_devices = _this.settings.view_auto_notifications_devices,
                    q_get_to_send_devices = view_auto_notifications_devices.select(
                        view_auto_notifications_devices.id,
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
                    ).where(view_auto_notifications_devices.organization_id.equals(notification.organization_id))
                        .toQuery(),
                    q_upd_events_notifications = events_notifications
                        .update({
                            done: true
                        })
                        .where(events_notifications.id.equals(notification.id)).toQuery();


                _this.settings.client.query(q_get_to_send_devices, function (errors, devices) {
                    if (errors) throw errors;

                    devices.forEach(function (device) {

                        var notification_id = 0,
                            _text = Utils.replaceTags(notification.notification_type_text, notification);
                        var data = {
                            device: device,
                            note: {
                                alert: _text,
                                body: _text,
                                icon: _this.settings.schema + _this.settings.domain + '/event_images/square/' + notification.image_vertical,
                                payload: {
                                    type: 'event_notification',
                                    title: notification.title,
                                    event_id: notification.event_id,
                                    body: _text,
                                    icon: notification,
                                    organization_logo: real_config.schema + real_config.domain + '/organizations_images/small/' + notification.organization_id + '.png'
                                }
                            },
                            type: device.client_type,
                            notification_id: notification_id
                        };


                        try {
                            var notification = notifications_factory.create(data);
                            notification.send(function (err) {
                                handleError(err);
                            });
                        } catch (e) {
                            _this.settings.logger.error(e);
                        }

                        var sent_notification;

                        _this.settings.client.query(q_ins_notification, [device.id, notification.id], function (err, result) {
                            handleError(err);
                        });
                    });
                });
                _this.settings.client.query(q_upd_events_notifications, function (err) {
                    handleError(err);
                });
            });
        })

    }

    send() {

    }

}


module.exterts = Notifications;