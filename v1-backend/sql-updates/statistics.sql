CREATE VIEW view_stat_notifications AS
  SELECT
    stat_notifications.id,
    stat_notifications.event_notification_id AS sheduled_id,
    stat_notifications.token_id,
    tokens.client_type,
    tokens.user_id,
    events_notifications.event_id,
    events_notifications.notification_time,
    notification_types.type
  FROM stat_notifications
    INNER JOIN events_notifications ON stat_notifications.event_notification_id = events_notifications.id
    INNER JOIN notification_types ON events_notifications.notification_type_id = notification_types.id
    INNER JOIN tokens ON stat_notifications.token_id = tokens.id
  UNION
  SELECT
    stat_users_notifications.id,
    stat_users_notifications.user_notification_id AS sheduled_id,

    stat_users_notifications.token_id,
    tokens.client_type,
    tokens.user_id,
    users_notifications.event_id,
    users_notifications.notification_time,
    notification_types.type
  FROM stat_users_notifications
    INNER JOIN users_notifications ON users_notifications.id = stat_users_notifications.user_notification_id
    INNER JOIN notification_types ON users_notifications.notification_type_id = notification_types.id
    INNER JOIN tokens ON stat_users_notifications.token_id = tokens.id;


CREATE TABLE stat_notifications_aggregated (
  id                  SERIAL PRIMARY KEY NOT NULL,
  event_id            BIGINT             NOT NULL  REFERENCES events (id),
  count               BIGINT,
  notifications_count BIGINT,
  updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE stat_events_aggregated (
  event_id     BIGINT NOT NULL  REFERENCES events (id),
  value        BIGINT,
  stat_type_id BIGINT REFERENCES stat_event_types (id),
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.stat_users
  ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE public.stat_organizations
  ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE public.stat_events
  ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;


CREATE OR REPLACE VIEW view_events AS
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
    events.canceled,
    vk_posts.group_id                                                                  AS vk_group_id,
    vk_posts.image_path                                                                AS vk_image_path,
    vk_posts.message                                                                   AS vk_message,
    events.registration_required,
    DATE_PART('epoch', events.registration_till) :: INT                                AS registration_till,
    events.is_free,
    ((SELECT SUM(counter)
      FROM (SELECT DISTINCT
              events_dates.start_time,
              events_dates.end_time,
              1 AS counter
            FROM events_dates
            WHERE event_id = events.id AND status = TRUE) AS sb) = 1) :: BOOL
                                                                                       AS is_same_time,
    events.organization_id :: INT,
    'http://evendate.ru/event.php?id=' || events.id                                    AS link,
    TRUE                                                                               AS status,
    events.images_domain || 'event_images/large/' || events.image_vertical             AS image_vertical_url,
    events.images_domain || 'event_images/large/' || events.image_horizontal           AS image_horizontal_url,
    events.images_domain || 'event_images/large/' || events.image_vertical             AS image_vertical_large_url,
    events.images_domain || 'event_images/large/' || events.image_horizontal           AS image_horizontal_large_url,

    events.images_domain || 'event_images/square/' || events.image_vertical            AS image_square_vertical_url,
    events.images_domain || 'event_images/square/' || events.image_horizontal          AS image_square_horizontal_url,

    events.images_domain || 'event_images/medium/' || events.image_horizontal          AS image_horizontal_medium_url,
    events.images_domain || 'event_images/medium/' || events.image_vertical            AS image_vertical_medium_url,

    events.images_domain || 'event_images/small/' || events.image_vertical             AS image_vertical_small_url,
    events.images_domain || 'event_images/small/' || events.image_horizontal           AS image_horizontal_small_url,
    events.images_domain || 'event_images/vk/' || vk_posts.image_path                  AS vk_image_url,
    view_organizations.img_medium_url                                                  AS organization_logo_medium_url,
    view_organizations.img_url                                                         AS organization_logo_large_url,
    view_organizations.img_small_url                                                   AS organization_logo_small_url,
    view_organizations.name                                                            AS organization_name,
    organization_types.name                                                            AS organization_type_name,
    view_organizations.short_name                                                      AS organization_short_name,
    (SELECT
       DATE_PART('epoch', MIN((events_dates.event_date :: DATE || ' ' || events_dates.start_time) :: TIMESTAMP)) :: INT
     FROM events_dates
     WHERE event_id = events.id AND events_dates.event_date >= NOW() :: DATE AND events_dates.status =
                                                                                 TRUE) AS nearest_event_date,
    (SELECT
       DATE_PART('epoch', MIN((events_dates.event_date :: DATE || ' ' || events_dates.start_time) :: TIMESTAMP)) :: INT
     FROM events_dates
     WHERE event_id = events.id AND events_dates.status = TRUE)                        AS first_event_date,
    (SELECT
       DATE_PART('epoch', MAX((events_dates.event_date :: DATE || ' ' || events_dates.start_time) :: TIMESTAMP)) :: INT
     FROM events_dates
     WHERE event_id = events.id AND events_dates.status = TRUE)                        AS last_event_date,
    DATE_PART('epoch', events.created_at) :: INT                                       AS created_at,
    DATE_PART('epoch', events.updated_at) :: INT                                       AS updated_at,
    (SELECT COUNT(id) :: INT AS favored_count
     FROM favorite_events
     WHERE status = TRUE AND event_id =
                             events.id)                                                AS favored_users_count,
    events.fts,
    stat_notifications_aggregated.count                                                AS notifications_sent
  FROM events
    INNER JOIN view_organizations ON view_organizations.id = events.organization_id
    INNER JOIN organization_types ON organization_types.id = view_organizations.type_id
    LEFT JOIN vk_posts ON events.id = vk_posts.event_id
    LEFT JOIN stat_notifications_aggregated ON events.id = stat_notifications_aggregated.event_id
  --LEFT JOIN events_tags ON events.id = events_tags.event_id
  --LEFT JOIN tags ON tags.id = events_tags.tag_id
  WHERE view_organizations.status = TRUE
        AND events.status = TRUE;


CREATE VIEW view_stat_events_aggregated AS
  SELECT
    event_id,
    value,
    stat_type_id,
    stat_events_aggregated.updated_at,
    stat_event_types.name
  FROM stat_events_aggregated
    INNER JOIN stat_event_types ON stat_events_aggregated.stat_type_id = stat_event_types.id;

