ALTER TABLE events ADD COLUMN "canceled" BOOLEAN DEFAULT FALSE NOT NULL;


ALTER TABLE public.notifications ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE notifications ADD COLUMN "message_id" TEXT DEFAULT NULL;

DROP VIEW view_events CASCADE;

CREATE VIEW view_events AS
  SELECT DISTINCT
    events.id :: INT,
    events.title,
    events.creator_id :: INT,
    events.description,
    events.detail_info_url,
    events.begin_time,
    events.end_time,
    events.latitude :: REAL,
    events.longitude :: REAL,
    events.location,
    events.min_price,
    events.public_at,
    events.disabled,
    events.canceled,
    vk_posts.group_id                                                                AS vk_group_id,
    vk_posts.image_path                                                              AS vk_image_path,
    vk_posts.message                                                                 AS vk_message,
    events.registration_required,
    DATE_PART('epoch', events.registration_till) :: INT                              AS registration_till,
    events.is_free,
    ((SELECT SUM(1)
      FROM (SELECT DISTINCT
              events_dates.start_time,
              events_dates.end_time
            FROM events_dates
            WHERE event_id = events.id AND status = TRUE) AS sb) > 0) :: BOOL
                                                                                     AS is_same_time,
    events.organization_id :: INT,
    'http://evendate.ru/event.php?id=' || events.id                                  AS link,
    TRUE                                                                             AS status,
    events.images_domain || 'event_images/large/' || events.image_vertical           AS image_vertical_url,
    events.images_domain || 'event_images/large/' || events.image_horizontal         AS image_horizontal_url,
    events.images_domain || 'event_images/large/' || events.image_vertical           AS image_vertical_large_url,
    events.images_domain || 'event_images/large/' || events.image_horizontal         AS image_horizontal_large_url,

    events.images_domain || 'event_images/square/' || events.image_vertical          AS image_square_vertical_url,
    events.images_domain || 'event_images/square/' || events.image_horizontal        AS image_square_horizontal_url,

    events.images_domain || 'event_images/medium/' || events.image_horizontal        AS image_horizontal_medium_url,
    events.images_domain || 'event_images/medium/' || events.image_vertical          AS image_vertical_medium_url,

    events.images_domain || 'event_images/small/' || events.image_vertical           AS image_vertical_small_url,
    events.images_domain || 'event_images/small/' || events.image_horizontal         AS image_horizontal_small_url,
    events.images_domain || 'event_images/vk/' || vk_posts.image_path                AS vk_image_url,
    view_organizations.img_medium_url                                                AS organization_logo_medium_url,
    view_organizations.img_url                                                       AS organization_logo_large_url,
    view_organizations.img_small_url                                                 AS organization_logo_small_url,
    view_organizations.name                                                          AS organization_name,
    organization_types.name                                                          AS organization_type_name,
    view_organizations.short_name                                                    AS organization_short_name,
    (SELECT DATE_PART('epoch', MIN(events_dates.event_date)) :: INT
     FROM events_dates
     WHERE event_id = events.id AND events_dates.event_date >= DATE(NOW()) AND events_dates.status =
                                                                               TRUE) AS nearest_event_date,
    (SELECT DATE_PART('epoch', MIN(events_dates.event_date)) :: INT
     FROM events_dates
     WHERE event_id = events.id AND events_dates.status = TRUE)                      AS first_event_date,
    (SELECT DATE_PART('epoch', MAX(events_dates.event_date)) :: INT
     FROM events_dates
     WHERE event_id = events.id AND events_dates.status = TRUE)                      AS last_event_date,
    DATE_PART('epoch', events.created_at) :: INT                                     AS created_at,
    DATE_PART('epoch', events.updated_at) :: INT                                     AS updated_at,
    (SELECT COUNT(id) :: INT AS favored_count
     FROM favorite_events
     WHERE status = TRUE AND event_id =
                             events.id)                                              AS favored_users_count
  FROM events
    INNER JOIN view_organizations ON view_organizations.id = events.organization_id
    INNER JOIN organization_types ON organization_types.id = view_organizations.type_id
    LEFT JOIN vk_posts ON events.id = vk_posts.event_id
  --LEFT JOIN events_tags ON events.id = events_tags.event_id
  --LEFT JOIN tags ON tags.id = events_tags.tag_id
  WHERE view_organizations.status = TRUE
        AND events.status = TRUE;


CREATE VIEW view_actions AS SELECT
                              stat_events.stat_type_id,
                              stat_events.event_id,
                              stat_event_types.name,
                              stat_event_types.entity,
                              stat_event_types.type_code,
                              tokens.user_id,
                              NULL                                                   AS organization_id,
                              DATE_PART('epoch', MAX(stat_events.created_at)) :: INT AS created_at
                            FROM stat_events
                              INNER JOIN stat_event_types ON stat_event_types.id = stat_events.stat_type_id
                              INNER JOIN tokens ON tokens.id = stat_events.token_id
                              INNER JOIN view_events ON view_events.id = stat_events.event_id
                            WHERE
                              view_events.status = TRUE
                              AND (stat_event_types.type_code = 'fave'
                                   OR stat_event_types.type_code = 'unfave')
                            GROUP BY stat_events.event_id, tokens.user_id, stat_events.stat_type_id,
                              stat_event_types.name,
                              stat_event_types.entity,
                              stat_event_types.type_code
                            UNION

                            SELECT
                              stat_organizations.stat_type_id,
                              NULL                                                          AS event_id,
                              stat_event_types.name,
                              stat_event_types.entity,
                              stat_event_types.type_code,
                              tokens.user_id,
                              stat_organizations.organization_id                            AS organization_id,
                              DATE_PART('epoch', MAX(stat_organizations.created_at)) :: INT AS created_at
                            FROM stat_organizations
                              INNER JOIN stat_event_types ON stat_event_types.id = stat_organizations.stat_type_id
                              INNER JOIN tokens ON tokens.id = stat_organizations.token_id
                              INNER JOIN view_organizations
                                ON view_organizations.id = stat_organizations.organization_id
                            WHERE (stat_event_types.type_code = 'subscribe'
                                   OR stat_event_types.type_code = 'unsubscribe')
                            GROUP BY stat_organizations.organization_id, tokens.user_id,
                              stat_organizations.stat_type_id, stat_event_types.name,
                              stat_event_types.entity,
                              stat_event_types.type_code;

INSERT INTO stat_event_types (name, entity, type_code, created_at)
VALUES
  ('Открытие уведомления', 'event', 'open_notification', NOW()),
  ('Скрытие уведомления', 'event', 'hide_notification', NOW()),
  ('Открытие карты', 'event', 'open_map', NOW());


CREATE VIEW view_auto_notifications AS
  SELECT DISTINCT
    events_notifications.*,
    view_events.organization_id,
    view_events.title,
    organizations.short_name,
    organizations.notification_suffix,
    view_events.image_square_vertical_url,
    view_events.image_square_horizontal_url,
    notification_types.type AS notification_type_name,
    notification_types.text AS notification_type_text
  FROM events_notifications
    INNER JOIN view_events ON events_notifications.event_id = view_events.id
    INNER JOIN notification_types ON notification_types.id = events_notifications.notification_type_id
    INNER JOIN organizations ON organizations.id = view_events.organization_id
  WHERE notification_time <= NOW() AND done = FALSE;

DROP VIEW view_auto_notifications_devices;

CREATE VIEW view_auto_notifications_devices AS
  SELECT DISTINCT
    tokens.*,
    users.notify_in_browser,
    organizations.id AS organization_id
  FROM tokens
    INNER JOIN subscriptions ON subscriptions.user_id = tokens.user_id
    INNER JOIN organizations ON organizations.id = subscriptions.organization_id
    INNER JOIN users ON users.id = tokens.user_id
                        AND subscriptions.status = TRUE
  ORDER BY tokens.id DESC;

DROP VIEW view_auto_favored_devices;

CREATE VIEW view_auto_favored_devices AS
  SELECT DISTINCT
    tokens.*,
    favorite_events.event_id,
    users.notify_in_browser
  FROM tokens
    INNER JOIN favorite_events ON favorite_events.user_id = tokens.user_id
    INNER JOIN users ON users.id = tokens.user_id
                        AND favorite_events.status = TRUE
  ORDER BY tokens.id DESC;


DROP VIEW view_users_notifications_devices;

CREATE VIEW view_users_notifications_devices AS
  SELECT DISTINCT
    tokens.*,
    users_notifications.id AS user_notification_id,
    users.notify_in_browser
  FROM tokens
    INNER JOIN users_notifications ON users_notifications.user_id = tokens.user_id
    INNER JOIN users ON users.id = tokens.user_id
                        AND users_notifications.status = TRUE
  ORDER BY tokens.id DESC;

DROP INDEX public.public_users_email1_idx CASCADE;
DROP INDEX public.public_users_email0_idx CASCADE;
DROP INDEX public.public_users_vk_uid2_idx CASCADE;
DROP INDEX public.public_users_google_uid4_idx CASCADE;
DROP INDEX public.public_users_facebook_uid3_idx CASCADE;


ALTER TABLE public.events ADD image_vertical_resized TEXT DEFAULT NULL NULL;
ALTER TABLE public.events ADD image_horizontal_resized TEXT DEFAULT NULL NULL;

ALTER TABLE public.users ADD local_avatar_filename TEXT DEFAULT NULL NULL;

ALTER TABLE public.log_requests ADD exception_text TEXT DEFAULT NULL NULL;
ALTER TABLE public.log_requests ADD exception_trace TEXT DEFAULT NULL NULL;
ALTER TABLE public.log_requests ADD exception_file TEXT DEFAULT NULL NULL;
ALTER TABLE public.log_requests ADD exception_line TEXT DEFAULT NULL NULL;

DROP VIEW view_users;

ALTER TABLE public.organizations ADD email TEXT DEFAULT NULL  NULL;

CREATE VIEW view_users AS
  SELECT
    users.id,
    users.avatar_url,
    users.email,
    users.vk_uid,
    users.facebook_uid,
    users.google_uid,
    users.first_name,
    users.last_name,
    users.middle_name,
    users.gender,
    users.token,
    users.show_to_friends,
    users.blurred_image_url,
    users.local_avatar_filename
  FROM users;

INSERT INTO public.notification_types (id, type, timediff, text)
VALUES (7, 'notification-event-changed-dates', -1, 'У вашего избранного события {title} изменились даты ');
INSERT INTO public.notification_types (id, type, timediff, text) VALUES
  (8, 'notification-event-changed-location', -1, 'У вашего избранного события {title} изменилось место проведения');
INSERT INTO public.notification_types (id, type, timediff, text) VALUES
  (9, 'notification-event-changed-registration', -1,
   'У вашего избранного события {title} изменилась информация про регистрацию');
INSERT INTO public.notification_types (id, type, timediff, text) VALUES
  (10, 'notification-event-changed-price', -1, 'У вашего избранного события {title} изменилась информация про цену');
INSERT INTO public.notification_types (id, type, timediff, text)
VALUES (11, 'notification-event-registration-ending', -1, 'Остался последний день для регистрации на {title}');

INSERT INTO public.notification_types (id, type, timediff, text)
VALUES (12, 'notification-event-canceled', -1, 'Событие {title} отменено организатором');

INSERT INTO public.notification_types (id, type, timediff, text)
VALUES (13, 'users-notification', -1, '{title}');


DROP VIEW view_notifications;

CREATE VIEW view_notifications AS
  SELECT
    users_notifications.uuid,
    users_notifications.user_id,
    users_notifications.id as user_notification_id,
    NULL                                                             AS events_notification_id,
    users_notifications.event_id,
    DATE_PART('epoch', users_notifications.notification_time) :: INT AS notification_time,
    users_notifications.status,
    nt1.id                                                           AS notification_type_id,
    'users-notification'                                             AS notification_type,
    users_notifications.done,
    DATE_PART('epoch', users_notifications.sent_time) :: INT         AS sent_time,
    users_notifications.created_at,
    users_notifications.updated_at
  FROM users_notifications
    INNER JOIN notification_types nt1 ON nt1.type = 'users-notification'
  UNION
  SELECT
    NULL                                                              AS uuid,
    NULL                                                              AS user_id,
    NULL                                                              AS user_notification_id,
    events_notifications.id                                           AS events_notification_id,
    events_notifications.event_id,
    DATE_PART('epoch', events_notifications.notification_time) :: INT AS notification_time,
    events_notifications.status,
    events_notifications.notification_type_id,
    nt2.type                                                          AS notification_type,
    events_notifications.done,
    NULL                                                              AS sent_time,
    events_notifications.created_at,
    events_notifications.updated_at
  FROM events_notifications
    INNER JOIN notification_types nt2 ON events_notifications.notification_type_id = nt2.id;

ALTER TABLE notifications RENAME TO stat_notifications;

ALTER TABLE users_notifications ADD COLUMN notification_type_id INT DEFAULT 13 NOT NULL;
ALTER TABLE users_notifications ADD FOREIGN KEY (notification_type_id) REFERENCES notification_types (id);

CREATE TABLE stat_users_notifications (
  id                   SERIAL PRIMARY KEY NOT NULL,
  user_notification_id INT                NOT NULL,
  token_id             INT                NOT NULL,
  description          TEXT      DEFAULT NULL,
  created_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  click_time           TIMESTAMP DEFAULT NULL,
  received             BOOLEAN   DEFAULT FALSE,
  message_id           TEXT      DEFAULT NULL,
  FOREIGN KEY (user_notification_id) REFERENCES users_notifications (id),
  FOREIGN KEY (token_id) REFERENCES tokens (id)
);