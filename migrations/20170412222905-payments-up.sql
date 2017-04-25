DROP TABLE tariffs CASCADE;
DROP TABLE organizations_payments CASCADE;
DROP TABLE organizations_tariffs CASCADE;

CREATE TABLE tariffs (
  id                                 SERIAL PRIMARY KEY,
  name                               TEXT,
  available_additional_notifications INT       DEFAULT 0,
  available_event_publications       INT       DEFAULT 10000,
  available_tickets_selling          INT       DEFAULT 0,
  available_telegram_bots            BOOLEAN   DEFAULT FALSE,
  available_slack_bots               BOOLEAN   DEFAULT FALSE,
  available_auditory_analytics       BOOLEAN   DEFAULT FALSE,
  available_in_city                  INT       DEFAULT NULL REFERENCES cities (id),
  price                              NUMERIC   DEFAULT 0,
  status                             BOOLEAN   DEFAULT TRUE,
  comment                            TEXT      DEFAULT NULL,
  is_default_for_city                BOOLEAN   DEFAULT FALSE,
  created_at                         TIMESTAMP DEFAULT NOW(),
  updated_at                         TIMESTAMP DEFAULT NULL
);

INSERT INTO tariffs (id, name, available_additional_notifications, available_event_publications, available_tickets_selling,
                     available_telegram_bots, available_slack_bots, available_auditory_analytics, available_in_city, comment, price, is_default_for_city)
VALUES (
  1, 'Базовый', 0, 10000, 0, FALSE, FALSE, FALSE, NULL, NULL, 0, FALSE),
  (2, 'Полный', 1, 10000, 100000, TRUE, TRUE, TRUE, NULL, NULL, 800, FALSE),
  (3, 'Базовый', 0, 5, 0, FALSE, FALSE, FALSE, 2, 'Базовый тариф для Саратова', 0, TRUE);

CREATE TABLE organizations_payments (
  id              SERIAL PRIMARY KEY,
  organization_id INT                NOT NULL REFERENCES organizations (id),
  user_id         INT                NOT NULL REFERENCES users (id),
  uuid            TEXT UNIQUE        NOT NULL DEFAULT uuid_generate_v4(),
  sum             NUMERIC,
  finished        BOOLEAN                     DEFAULT FALSE,
  aviso_data      JSONB                       DEFAULT NULL,
  payed_at        TIMESTAMP                   DEFAULT NOW(),
  created_at      TIMESTAMP                   DEFAULT NOW(),
  updated_at      TIMESTAMP                   DEFAULT NULL
);

CREATE TABLE organizations_tariffs (
  id         SERIAL PRIMARY KEY,
  payment_id INT       NOT NULL REFERENCES organizations_payments (id),
  tariff_id  INT       NOT NULL REFERENCES tariffs (id),
  since      TIMESTAMP NOT NULL,
  till       TIMESTAMP NOT NULL,
  comment    TEXT      DEFAULT NULL,
  status     BOOLEAN   DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NULL
);


CREATE OR REPLACE VIEW view_payments AS
  SELECT
    organization_id,
    user_id,
    sum,
    aviso_data,
    organizations_tariffs.till,
    organizations_tariffs.since,
    organizations_tariffs.status,
    organizations_tariffs.tariff_id,
    payment_id
  FROM organizations_payments
    INNER JOIN organizations_tariffs ON organizations_payments.id = organizations_tariffs.payment_id
    INNER JOIN tariffs ON organizations_tariffs.tariff_id = tariffs.id;


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
    DATE_PART('epoch', events.public_at :: TIMESTAMPTZ) :: INT                             AS public_at,
    (events.status = FALSE AND events.public_at IS NOT
                               NULL)                                                       AS is_delayed,
    events.status,
    events.canceled,
    events.canceled                                                                        AS is_canceled,
    vk_posts.group_id                                                                      AS vk_group_id,
    vk_posts.image_path                                                                    AS vk_image_path,
    vk_posts.message                                                                       AS vk_message,
    events.registration_required,
    DATE_PART('epoch', events.registration_till :: TIMESTAMPTZ) :: INT                     AS registration_till,
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
    'https://evendate.ru/event/' || events.id                                               AS link,
    events.images_domain || 'event_images/large/' || events.image_vertical                 AS image_vertical_url,
    events.images_domain || 'event_images/large/' || events.image_horizontal               AS image_horizontal_url,
    events.images_domain || 'event_images/large/' || events.image_vertical                 AS image_vertical_large_url,
    events.images_domain || 'event_images/large/' ||
    events.image_horizontal                                                                AS image_horizontal_large_url,

    events.images_domain || 'event_images/square/' || events.image_vertical                AS image_square_vertical_url,
    events.images_domain || 'event_images/square/' ||
    events.image_horizontal                                                                AS image_square_horizontal_url,

    events.images_domain || 'event_images/medium/' ||
    events.image_horizontal                                                                AS image_horizontal_medium_url,
    events.images_domain || 'event_images/medium/' || events.image_vertical                AS image_vertical_medium_url,

    events.images_domain || 'event_images/small/' || events.image_vertical                 AS image_vertical_small_url,
    events.images_domain || 'event_images/small/' ||
    events.image_horizontal                                                                AS image_horizontal_small_url,
    events.images_domain || 'event_images/vk/' || vk_posts.image_path                      AS vk_image_url,
    view_organizations.img_medium_url                                                      AS organization_logo_medium_url,
    view_organizations.img_url                                                             AS organization_logo_large_url,
    view_organizations.img_small_url                                                       AS organization_logo_small_url,
    view_organizations.name                                                                AS organization_name,
    organization_types.name                                                                AS organization_type_name,
    view_organizations.short_name                                                          AS organization_short_name,
    (SELECT DATE_PART('epoch',
                      MIN(start_time_utc)) :: INT
     FROM events_dates
     WHERE event_id = events.id AND events_dates.start_time_utc >= NOW() :: DATE AND events_dates.status =
                                                                                     TRUE) AS nearest_event_date,
    DATE_PART('epoch', events.first_event_date) :: INT                                     AS first_event_date,
    DATE_PART('epoch', events.last_event_date) :: INT                                      AS last_event_date,
    DATE_PART('epoch', events.created_at) :: INT                                           AS created_at,
    DATE_PART('epoch', events.updated_at) :: INT                                           AS updated_at,
    (SELECT COUNT(id) :: INT AS favored_count
     FROM favorite_events
     WHERE status = TRUE AND event_id =
                             events.id)                                                    AS favored_users_count,
    events.fts,
    events.registration_approvement_required,
    events.registration_limit_count,
    events.registration_locally,
    events.registered_count,
    (events.registration_locally = TRUE
     AND events.status = TRUE
     AND (events.registration_limit_count >
          COALESCE((SELECT view_events_tickets_sold.count
                    FROM view_events_tickets_sold
                    WHERE
                      view_events_tickets_sold.event_id = events.id), 0) :: INT OR
          events.registration_limit_count IS NULL)
     AND (DATE_PART('epoch', NOW()) :: INT < (DATE_PART('epoch', events.registration_till) :: INT) OR
          events.registration_till IS NULL))                                               AS registration_available,
    view_organizations.is_private                                                          AS organization_is_private,
    events.first_event_date                                                                AS first_event_date_dt,
    events.last_event_date                                                                 AS last_event_date_dt,
    DATE_PART('epoch', events.registration_since :: TIMESTAMPTZ) :: INT                    AS registration_since,
    events.ticketing_locally,
    events.is_online,
    view_organizations.city_id
  FROM events
    INNER JOIN view_organizations ON view_organizations.id = events.organization_id
    INNER JOIN organization_types ON organization_types.id = view_organizations.type_id
    LEFT JOIN vk_posts ON events.id = vk_posts.event_id
  WHERE view_organizations.status = TRUE;

CREATE OR REPLACE VIEW view_events AS
  SELECT *
  FROM view_all_events
  WHERE status = TRUE;

CREATE OR REPLACE VIEW view_organizations_tariffs AS
  SELECT
    organizations.id                                                                             AS organization_id,
    DATE_PART('epoch', COALESCE(view_payments.since, '2015-12-15 00:00:00' :: TIMESTAMP)) :: INT AS since,
    DATE_PART('epoch', COALESCE(view_payments.till, NULL)) :: INT                                AS till,
    COALESCE(view_payments.status, TRUE)                                                         AS status,
    COALESCE(view_payments.tariff_id,
             (SELECT id
              FROM tariffs
              WHERE is_default_for_city = TRUE
                    AND
                    organizations.city_id = available_in_city), 1)
      AS tariff_id,
    COALESCE(view_payments.payment_id,
             NULL)                                                                               AS payment_id,
    COALESCE(tariffs.available_additional_notifications,
             default_tariff.available_additional_notifications)                                  AS available_additional_notifications,
    COALESCE(tariffs.available_event_publications,
             default_tariff.available_event_publications)                                        AS available_event_publications,
    COALESCE(tariffs.available_tickets_selling,
             default_tariff.available_tickets_selling)                                           AS available_tickets_selling,
    COALESCE(tariffs.available_telegram_bots,
             default_tariff.available_telegram_bots)                                             AS available_telegram_bots,
    COALESCE(tariffs.available_slack_bots,
             default_tariff.available_slack_bots)                                                AS available_slack_bots,
    COALESCE(tariffs.available_auditory_analytics,
             default_tariff.available_auditory_analytics)                                        AS available_auditory_analytics,
    COALESCE(tariffs.available_in_city,
             default_tariff.available_in_city)                                                   AS available_in_city,
    COALESCE(tariffs.price, default_tariff.price)                                                AS price,
    COALESCE(tariffs.name, default_tariff.name)                                                  AS name
  FROM organizations
    LEFT JOIN view_payments ON organizations.id = view_payments.organization_id AND
                               view_payments.status = TRUE AND view_payments.till > NOW()
    LEFT JOIN tariffs ON tariffs.id = tariff_id
    LEFT JOIN (SELECT
                 id,
                 available_additional_notifications,
                 available_event_publications,
                 available_tickets_selling,
                 available_telegram_bots,
                 available_slack_bots,
                 available_auditory_analytics,
                 available_in_city,
                 price,
                 name
               FROM tariffs) AS default_tariff(id,
              available_additional_notifications,
              available_event_publications,
              available_tickets_selling,
              available_telegram_bots,
              available_slack_bots,
              available_auditory_analytics,
              available_in_city,
              price,
              name) ON COALESCE(view_payments.tariff_id,
                                (SELECT id
                                 FROM tariffs
                                 WHERE is_default_for_city = TRUE
                                       AND
                                       organizations.city_id = available_in_city), 1) = default_tariff.id;


INSERT INTO notification_types (id, type, timediff, text)
VALUES (999, 'notification-additional-for-organization', -1, '{short_name}: {title}');


