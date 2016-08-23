DROP VIEW view_events CASCADE;

CREATE OR REPLACE VIEW view_all_events AS
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
    DATE_PART('epoch', events.public_at) :: INT                                AS public_at,
    (events.status = FALSE AND events.public_at IS NOT
                               NULL)                                                   AS is_delayed,
    events.status,
    events.canceled,
    events.canceled                                                                    AS is_canceled,
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
    events.fts
  FROM events
    INNER JOIN view_organizations ON view_organizations.id = events.organization_id
    INNER JOIN organization_types ON organization_types.id = view_organizations.type_id
    LEFT JOIN vk_posts ON events.id = vk_posts.event_id
  WHERE view_organizations.status = TRUE;


CREATE VIEW view_events AS
  SELECT *
  FROM view_all_events
  WHERE status = TRUE;


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