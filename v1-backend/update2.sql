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
    events.registration_required,
    events.registration_till,
    events.is_free,
    ((SELECT SUM(1) FROM (SELECT DISTINCT events_dates.start_time, events_dates.end_time
             FROM events_dates
     WHERE event_id = events.id AND status = TRUE) as sb) > 0):: BOOL
                                                                              AS is_same_time,
    events.organization_id :: INT,
    'http://evendate.ru/event.php?id=' || events.id                           AS link,
    TRUE                                                                      AS status,
    events.images_domain || 'event_images/large/' || events.image_vertical    AS image_vertical_url,
    events.images_domain || 'event_images/large/' || events.image_horizontal  AS image_horizontal_url,
    events.images_domain || 'event_images/large/' || events.image_vertical    AS image_vertical_large_url,
    events.images_domain || 'event_images/large/' || events.image_horizontal  AS image_horizontal_large_url,

    events.images_domain || 'event_images/square/' || events.image_vertical   AS image_square_vertical_url,
    events.images_domain || 'event_images/square/' || events.image_horizontal AS image_square_horizontal_url,

    events.images_domain || 'event_images/medium/' || events.image_horizontal   AS image_horizontal_medium_url,
    events.images_domain || 'event_images/medium/' || events.image_vertical AS image_vertical_medium_url,

    events.images_domain || 'event_images/small/' || events.image_vertical    AS image_vertical_small_url,
    events.images_domain || 'event_images/small/' || events.image_horizontal  AS image_horizontal_small_url,
    events.images_domain || 'event_images/vk/' || vk_posts.image_path         AS vk_image_url,
    view_organizations.img_medium_url                                         AS organization_logo_medium_url,
    view_organizations.img_url                                                AS organization_logo_large_url,
    view_organizations.img_small_url                                          AS organization_logo_small_url,
    view_organizations.name                                                   AS organization_name,
    organization_types.name                                                   AS organization_type_name,
    view_organizations.short_name                                             AS organization_short_name,
    (SELECT DATE_PART('epoch', MIN(events_dates.event_date)) :: INT
     FROM events_dates
     WHERE event_id = events.id AND events_dates.event_date > NOW() AND events_dates.status =
                                                                        TRUE) AS nearest_event_date,
    (SELECT DATE_PART('epoch', MIN(events_dates.event_date)) :: INT
     FROM events_dates
     WHERE event_id = events.id AND events_dates.status = TRUE)               AS first_event_date,
    (SELECT DATE_PART('epoch', MAX(events_dates.event_date)) :: INT
     FROM events_dates
     WHERE event_id = events.id AND events_dates.status = TRUE)               AS last_event_date,
    DATE_PART('epoch', events.created_at) :: INT                              AS created_at,
    DATE_PART('epoch', events.updated_at) :: INT                              AS updated_at,
    (SELECT COUNT(id) :: INT AS favored_count
     FROM favorite_events
     WHERE status = TRUE AND event_id =
                             events.id)                                       AS favored_users_count
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

