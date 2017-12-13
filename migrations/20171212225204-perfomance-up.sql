--ORGANIZATIONS

DROP MATERIALIZED VIEW view_organizations CASCADE;


CREATE MATERIALIZED VIEW view_organizations AS
  SELECT DISTINCT
    organizations.id :: INT,
    organizations.description,
    organizations.id :: INT                 AS oid,
    organizations.images_domain || 'organizations_images/backgrounds/medium/' ||
    organizations.background_medium_img_url AS background_medium_img_url,
    organizations.images_domain || 'organizations_images/backgrounds/small/' ||
    organizations.background_small_img_url  AS background_small_img_url,
    organizations.images_domain || 'organizations_images/logos/medium/' ||
    organizations.img_medium_url            AS img_medium_url,
    organizations.images_domain || 'organizations_images/logos/small/' ||
    organizations.img_small_url             AS img_small_url,
    organizations.site_url,
    organizations.name,
    organizations.type_id :: INT,
    organizations.images_domain || 'organizations_images/logos/large/' ||
    organizations.img_url                   AS img_url,
    organizations.images_domain || 'organizations_images/backgrounds/large/' ||
    organizations.background_img_url        AS background_img_url,
    TRUE                                    AS status,
    organizations.short_name,
    organization_types.name                 AS type_name,
    organizations.default_address,
    organization_types."order" :: INT       AS organization_type_order,
    organization_types."id" :: INT          AS organization_type_id,
    DATE_PART(
        'epoch',
        organizations.updated_at) :: INT    AS updated_at,
    DATE_PART(
        'epoch',
        organizations.created_at) :: INT    AS created_at,
    (
      SELECT COUNT(
                 id) :: INT AS subscribed_count
      FROM
        subscriptions
      WHERE
        subscriptions.status
        =
        TRUE
        AND
        subscriptions.organization_id
        =
        organizations.id
    )                                       AS subscribed_count,

    organizations.vk_url_path,
    organizations.facebook_url_path,
    organizations.fts,
    organizations.facebook_url,
    organizations.vk_url,
    organizations.email,
    organizations.is_private,
    organizations.brand_color :: VARCHAR,
    organizations.city_id,
    cities.country_id,
    cities.en_name                          AS city_en_name,
    cities.local_name                       AS city_local_name,
    cities.timediff_seconds                 AS city_timediff_seconds,
    countries.en_name                       AS country_en_name,
    countries.local_name                    AS country_local_name,
    countries.language                      AS country_language,
    countries.language_short                AS country_language_short,
    organizations.brand_color_accent :: TEXT
  FROM organizations
    INNER JOIN organization_types ON organization_types.id = organizations.type_id AND organizations.status = TRUE
    INNER JOIN cities ON cities.id = organizations.city_id
    INNER JOIN countries ON countries.id = cities.country_id
  WHERE organizations.status = TRUE
        AND organizations.state_id = 1;


CREATE UNIQUE INDEX view_organizationsi
  ON view_organizations (id);

REFRESH MATERIALIZED VIEW CONCURRENTLY view_organizations;

CREATE VIEW view_subscriptions AS
  SELECT
    subscriptions.id,
    users.first_name,
    users.last_name,
    users.middle_name,
    users.id              AS user_id,
    users.avatar_url,
    view_organizations.id AS organization_id,
    view_organizations.description,
    view_organizations.oid,
    view_organizations.background_medium_img_url,
    view_organizations.background_small_img_url,
    view_organizations.img_medium_url,
    view_organizations.img_small_url,
    view_organizations.site_url,
    view_organizations.name,
    view_organizations.type_id,
    view_organizations.img_url,
    view_organizations.background_img_url,
    view_organizations.status,
    view_organizations.short_name,
    view_organizations.type_name,
    view_organizations.organization_type_order,
    view_organizations.organization_type_id,
    view_organizations.updated_at,
    view_organizations.created_at,
    view_organizations.subscribed_count
  FROM users
    INNER JOIN subscriptions ON subscriptions.user_id = users.id
    INNER JOIN view_organizations ON view_organizations.id = subscriptions.organization_id
  WHERE subscriptions.status = TRUE;

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
    DATE_PART('epoch', events.public_at :: TIMESTAMP) :: INT                               AS public_at,
    (events.status = FALSE AND events.public_at IS NOT
                               NULL)                                                       AS is_delayed,
    events.status,
    events.canceled,
    events.canceled                                                                        AS is_canceled,
    vk_posts.group_id                                                                      AS vk_group_id,
    vk_posts.image_path                                                                    AS vk_image_path,
    vk_posts.message                                                                       AS vk_message,
    events.registration_required,
    DATE_PART('epoch', events.registration_till :: TIMESTAMP) :: INT                       AS registration_till,
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
    'https://evendate.io/event/' || events.id                                              AS link,
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
    DATE_PART('epoch', events.registration_since :: TIMESTAMP) :: INT                      AS registration_since,
    events.ticketing_locally,
    events.is_online,
    view_organizations.city_id,
    (events.ticketing_locally = TRUE
     AND events.status = TRUE
     AND COALESCE(vtt.amount_sum :: INT, 0) > 0
     AND COALESCE((SELECT COUNT(id)
                   FROM view_sold_tickets
                   WHERE view_sold_tickets.event_id = events.id), 0)
         < COALESCE(vtt.amount_sum, 0)) :: BOOLEAN                                         AS ticketing_available,
    events.booking_time,
    events.accept_bitcoins,
    events.apply_promocodes_and_pricing_rules
  FROM events
    INNER JOIN view_organizations ON view_organizations.id = events.organization_id
    INNER JOIN organization_types ON organization_types.id = view_organizations.type_id
    LEFT JOIN vk_posts ON events.id = vk_posts.event_id
    LEFT JOIN (SELECT
                 SUM(ticket_types.amount),
                 event_id
               FROM ticket_types
               WHERE ((NOW() < sell_end_date AND NOW() > sell_start_date)
                      OR (sell_end_date IS NULL AND sell_start_date < NOW())
                      OR (sell_start_date IS NULL AND sell_end_date > NOW())
                      OR (sell_start_date IS NULL AND sell_end_date IS NULL)
                     )
                     AND ticket_types.status = TRUE
               GROUP BY event_id) AS vtt(amount_sum, event_id) ON vtt.event_id = events.id
  WHERE view_organizations.status = TRUE;


CREATE MATERIALIZED VIEW view_events
  AS
    SELECT *
    FROM view_all_events
    WHERE status = TRUE;

CREATE UNIQUE INDEX view_eventsi
  ON view_events (id);

REFRESH MATERIALIZED VIEW CONCURRENTLY view_events;

CREATE OR REPLACE VIEW view_emails_waiting_for_payment AS
  SELECT
    view_events.title                                                                  AS event_title,
    view_events.id                                                                     AS event_id,
    view_events.organization_id,
    view_events.image_horizontal_large_url,
    view_tickets_orders.uuid                                                           AS order_uuid,
    (view_tickets_orders.created_at +
     (view_events.booking_time * 3600)) - date_part('epoch', NOW() AT TIME ZONE 'UTC') AS time_to_pay,
    "users"."email",
    users.first_name,
    (SELECT token
     FROM tokens
     WHERE user_id = users.id
     ORDER BY id DESC
     LIMIT 1)                                                                          AS token,
    (SELECT value
     FROM view_registration_field_values
     WHERE "view_registration_field_values"."ticket_order_id" = "view_tickets_orders"."id"
           AND "view_registration_field_values"."form_field_type" = 'email'
     ORDER BY value DESC
     LIMIT 1)                                                                          AS "form_email"
  FROM view_tickets_orders
    INNER JOIN view_events ON view_tickets_orders.event_id = view_events.id
    INNER JOIN users ON view_tickets_orders.user_id = users.id
  WHERE view_tickets_orders.status_type_code = 'waiting_for_payment'
        AND view_tickets_orders.final_sum > 0
        AND view_tickets_orders.uuid NOT IN (SELECT (data ->> 'order_uuid')
                                             FROM emails
                                             WHERE emails.email_type_id = 16 AND
                                                   data ->> 'order_uuid' = view_tickets_orders.uuid)
        AND
        (view_tickets_orders.created_at +
         (view_events.booking_time * 3600)) - date_part('epoch', NOW() AT TIME ZONE 'UTC') BETWEEN 0 AND 3600;


CREATE OR REPLACE VIEW view_emails_after_event AS
  SELECT
    view_events.title       AS event_title,
    view_events.id          AS event_id,
    view_events.organization_id,
    email_texts.after_event AS after_event_text,
    "users"."email",
    users.first_name,
    (SELECT token
     FROM tokens
     WHERE user_id = users.id
     ORDER BY id DESC
     LIMIT 1)               AS token,
    (SELECT value
     FROM view_registration_field_values
     WHERE "view_registration_field_values"."ticket_order_id" = "ticket_orders"."id"
           AND "view_registration_field_values"."form_field_type" = 'email'
     ORDER BY value DESC
     LIMIT 1)               AS "form_email"
  FROM view_events
    LEFT JOIN email_texts ON email_texts.event_id = view_events.id
    INNER JOIN ticket_orders ON ticket_orders.event_id = view_events.id
    INNER JOIN users ON ticket_orders.user_id = users.id
  WHERE view_events.last_event_date_dt BETWEEN (NOW() - INTERVAL '1 hour') AND (NOW() + INTERVAL '1 hour')
        AND view_events.id NOT IN (SELECT (data ->> 'event_id') :: INT
                                   FROM emails
                                   WHERE emails.email_type_id = 15);

-- EVENTS --

CREATE OR REPLACE VIEW view_broadcasts_event_email_recipients AS
  SELECT
    DISTINCT ON (email)
    users.first_name,
    users.last_name,
    users.email,
    array_to_json(SELECT
                  json_build_object(view_registration_field_values.form_field_type,
                                    view_registration_field_values.value)
                  FROM view_registration_field_values
                  WHERE view_registration_field_values.user_id = users.id AND
                        view_registration_field_values.event_id = events.id) AS form_values,
    events.title,
    events.id                                                                AS event_id
  FROM events
    LEFT JOIN favorite_events ON favorite_events.event_id = events.id
    LEFT JOIN view_tickets_orders ON view_tickets_orders.event_id = events.id
    INNER JOIN users ON users.id = favorite_events.user_id AND favorite_events.status = TRUE;

CREATE OR REPLACE VIEW view_emails_after_event AS
  SELECT
    view_events.title       AS event_title,
    view_events.id          AS event_id,
    view_events.organization_id,
    email_texts.after_event AS after_event_text,
    "users"."email",
    users.first_name,
    (SELECT token
     FROM tokens
     WHERE user_id = users.id
     ORDER BY id DESC
     LIMIT 1)               AS token,
    (SELECT value
     FROM view_registration_field_values
     WHERE "view_registration_field_values"."ticket_order_id" = "ticket_orders"."id"
           AND "view_registration_field_values"."form_field_type" = 'email'
     ORDER BY value DESC
     LIMIT 1)               AS "form_email"
  FROM view_events
    LEFT JOIN email_texts ON email_texts.event_id = view_events.id
    INNER JOIN ticket_orders ON ticket_orders.event_id = view_events.id
    INNER JOIN users ON ticket_orders.user_id = users.id
  WHERE view_events.last_event_date_dt BETWEEN (NOW() - INTERVAL '1 hour') AND (NOW() + INTERVAL '1 hour')
        AND view_events.id NOT IN (SELECT (data ->> 'event_id') :: INT
                                   FROM emails
                                   WHERE emails.email_type_id = 15);

CREATE OR REPLACE VIEW view_emails_waiting_for_payment AS
  SELECT
    view_events.title                                                                  AS event_title,
    view_events.id                                                                     AS event_id,
    view_events.organization_id,
    view_events.image_horizontal_large_url,
    view_tickets_orders.uuid                                                           AS order_uuid,
    (view_tickets_orders.created_at +
     (view_events.booking_time * 3600)) - date_part('epoch', NOW() AT TIME ZONE 'UTC') AS time_to_pay,
    "users"."email",
    users.first_name,
    (SELECT token
     FROM tokens
     WHERE user_id = users.id
     ORDER BY id DESC
     LIMIT 1)                                                                          AS token,
    (SELECT value
     FROM view_registration_field_values
     WHERE "view_registration_field_values"."ticket_order_id" = "view_tickets_orders"."id"
           AND "view_registration_field_values"."form_field_type" = 'email'
     ORDER BY value DESC
     LIMIT 1)                                                                          AS "form_email"
  FROM view_tickets_orders
    INNER JOIN view_events ON view_tickets_orders.event_id = view_events.id
    INNER JOIN users ON view_tickets_orders.user_id = users.id
  WHERE view_tickets_orders.status_type_code = 'waiting_for_payment'
        AND view_tickets_orders.final_sum > 0
        AND view_tickets_orders.uuid NOT IN (SELECT (data ->> 'order_uuid')
                                             FROM emails
                                             WHERE emails.email_type_id = 16 AND
                                                   data ->> 'order_uuid' = view_tickets_orders.uuid)
        AND
        (view_tickets_orders.created_at +
         (view_events.booking_time * 3600)) - date_part('epoch', NOW() AT TIME ZONE 'UTC') BETWEEN 0 AND 3600;


CREATE OR REPLACE VIEW view_actions AS SELECT
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
                                         AND view_events.is_canceled = FALSE
                                         AND view_events.organization_is_private = FALSE
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
                                         INNER JOIN stat_event_types
                                           ON stat_event_types.id = stat_organizations.stat_type_id
                                         INNER JOIN tokens ON tokens.id = stat_organizations.token_id
                                         INNER JOIN view_organizations
                                           ON view_organizations.id = stat_organizations.organization_id
                                       WHERE (stat_event_types.type_code = 'subscribe'
                                              OR stat_event_types.type_code = 'unsubscribe')
                                             AND view_organizations.is_private = FALSE
                                       GROUP BY stat_organizations.organization_id, tokens.user_id,
                                         stat_organizations.stat_type_id, stat_event_types.name,
                                         stat_event_types.entity,
                                         stat_event_types.type_code;


CREATE OR REPLACE FUNCTION refresh_events_mat_view()
  RETURNS TRIGGER LANGUAGE plpgsql
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY view_events;
  RETURN NULL;
END $$;

CREATE OR REPLACE FUNCTION refresh_orgs_mat_view()
  RETURNS TRIGGER LANGUAGE plpgsql
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY view_organizations;
  RETURN NULL;
END $$;

DROP TRIGGER refresh_mat_view_orgs
ON organizations;
DROP TRIGGER refresh_mat_view_orgs
ON organization_types;
DROP TRIGGER refresh_mat_view_orgs
ON cities;
DROP TRIGGER refresh_mat_view_orgs
ON countries;

DROP TRIGGER refresh_mat_view
ON events;
DROP TRIGGER refresh_mat_view
ON organizations;
DROP TRIGGER refresh_mat_view
ON organization_types;

CREATE TRIGGER refresh_mat_view_orgs
  AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
  ON organizations
EXECUTE PROCEDURE refresh_orgs_mat_view();

CREATE TRIGGER refresh_mat_view_orgs
  AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
  ON organization_types
EXECUTE PROCEDURE refresh_orgs_mat_view();

CREATE TRIGGER refresh_mat_view_orgs
  AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
  ON cities
EXECUTE PROCEDURE refresh_orgs_mat_view();

CREATE TRIGGER refresh_mat_view_orgs
  AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
  ON countries
EXECUTE PROCEDURE refresh_orgs_mat_view();


CREATE TRIGGER refresh_mat_view
  AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
  ON events
EXECUTE PROCEDURE refresh_events_mat_view();

CREATE TRIGGER refresh_mat_view
  AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
  ON organizations
EXECUTE PROCEDURE refresh_events_mat_view();

CREATE TRIGGER refresh_mat_view
  AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
  ON organization_types
EXECUTE PROCEDURE refresh_events_mat_view();

--NETWORKING UPDATES
CREATE OR REPLACE VIEW view_networking_profiles AS
  SELECT
    users.id,
    u2.id                                                              AS for_id,
    COALESCE(users_profiles.first_name, users.first_name)              AS first_name,
    COALESCE(users_profiles.last_name, users.last_name)                AS last_name,
    COALESCE(users_profiles.avatar_url, users.avatar_url)              AS avatar_url,
    view_networking_access.event_id,
    view_networking_access.user_id,
    COALESCE(networking_goals.info, users_profiles.info)               AS info,
    COALESCE(networking_goals.looking_for, users_profiles.looking_for) AS looking_for,
    vk_url,
    facebook_url,
    twitter_url,
    linkedin_url,
    telegram_url,
    instagram_url,
    github_url,
    users_profiles.email,
    networking_goals.company_name,
    DATE_PART('epoch', networking_goals.created_at) :: INT             AS created_at,
    DATE_PART('epoch', networking_goals.updated_at) :: INT             AS updated_at,
    CASE WHEN networking_goals.info IS NOT NULL OR networking_goals.created_at IS NOT NULL
      THEN TRUE
    ELSE FALSE END                                                     AS signed_up,
    networking_requests.uuid IS NOT NULL                               AS request_exists,
    networking_requests.accept_status                                  AS request_status,
    networking_requests.uuid,
    networking_requests.uuid                                           AS request_uuid

  FROM users
    FULL OUTER JOIN users u2 ON 1 = 1
    LEFT JOIN view_networking_access ON view_networking_access.user_id = users.id
    LEFT JOIN users_profiles ON users.id = (
      CASE WHEN ((SELECT COUNT(*)
                  FROM networking_requests
                  WHERE networking_requests.recipient_user_id = users.id
                        AND networking_requests.sender_user_id = u2.id
                        AND networking_requests.status = TRUE
                        AND networking_requests.accept_status = TRUE) > 0) OR (users.id = u2.id)
        THEN users_profiles.user_id
      ELSE -1 END)

    LEFT JOIN networking_goals
      ON users.id = networking_goals.user_id AND networking_goals.event_id = view_networking_access.event_id
    LEFT JOIN networking_requests ON u2.id = networking_requests.recipient_user_id
                                     AND networking_requests.event_id = view_networking_access.event_id
                                     AND networking_requests.status = TRUE
                                     AND networking_requests.sender_user_id = users.id
  ORDER BY users.id;


CREATE OR REPLACE VIEW view_networking_contacts
  AS
    SELECT
      sender_user_id,
      recipient_user_id,
      message,
      view_networking_profiles.*
    FROM view_networking_requests
  INNER JOIN view_networking_profiles ON view_networking_profiles.for_id =
                                         view_networking_requests.recipient_user_id
  WHERE
    (view_networking_requests.recipient_user_id = 23 OR
      view_networking_requests.sender_user_id = 23)
      AND view_networking_requests.status = TRUE
      AND view_networking_requests.accept_status = TRUE;


SELECT * FROM recommendations_events
ORDER BY recommendations_events.event_id DESC LIMIT 100;