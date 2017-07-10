DROP TABLE orders_payments;

CREATE TABLE orders_payments (
  id              SERIAL PRIMARY KEY,
  ticket_order_id INT                NOT NULL REFERENCES ticket_orders (id),
  uuid            TEXT UNIQUE        NOT NULL DEFAULT uuid_generate_v4(),
  sum             NUMERIC,
  finished        BOOLEAN                     DEFAULT FALSE,
  canceled        BOOLEAN                     DEFAULT FALSE,
  aviso_data      JSONB                       DEFAULT NULL,
  payed_at        TIMESTAMP                   DEFAULT NULL,
  canceled_at     TIMESTAMP                   DEFAULT NULL,
  created_at      TIMESTAMP                   DEFAULT NOW(),
  updated_at      TIMESTAMP                   DEFAULT NULL,
  UNIQUE (ticket_order_id, finished, canceled)
);

ALTER TABLE events
  ADD COLUMN booking_time INT DEFAULT 1;


CREATE OR REPLACE VIEW view_tickets_orders AS
  SELECT
    ticket_orders.id,
    ticket_orders.uuid,
    ticket_orders.user_id,
    ticket_orders.order_content,
    ticket_orders.event_id,
    ticket_orders.is_canceled,
    DATE_PART('epoch', ticket_orders.payed_at) :: INT                                            AS payed_at,
    DATE_PART('epoch', ticket_orders.canceled_at) :: INT                                         AS canceled_at,
    DATE_PART('epoch', ticket_orders.created_at) :: INT                                          AS created_at,
    DATE_PART('epoch', ticket_orders.updated_at) :: INT                                          AS updated_at,
    tickets_orders_statuses.type_code                                                            AS status_type_code,
    tickets_orders_statuses.name                                                                 AS status_name,
    tickets_orders_statuses.id                                                                   AS status_id,
    RPAD(ticket_orders.id :: TEXT || '00' || reverse((ticket_orders.id * 1610) :: TEXT), 9, '0') AS number,
    money.sum,
    st.payed

  FROM ticket_orders
    INNER JOIN events ON events.id = ticket_orders.event_id
    LEFT JOIN (SELECT
                 SUM(tickets.price),
                 tickets.ticket_order_id
               FROM tickets
               WHERE tickets.status = TRUE
               GROUP BY tickets.ticket_order_id) AS money(sum, ticket_order_id)
      ON money.ticket_order_id = ticket_orders.id
    LEFT JOIN (SELECT
                 COUNT(id),
                 orders_payments.ticket_order_id
               FROM orders_payments
               WHERE orders_payments.canceled = FALSE AND
                     orders_payments.finished = TRUE
               GROUP BY orders_payments.ticket_order_id) AS st(payed, ticket_order_id)
      ON st.ticket_order_id = ticket_orders.id
    INNER JOIN tickets_orders_statuses ON tickets_orders_statuses.id =
                                          (CASE
                                           WHEN events.registration_approvement_required IS TRUE
                                                AND money.sum :: REAL = 0 :: REAL
                                                AND ticket_orders.order_status_id = 4
                                             THEN 9 :: INT -- should not pay for tickets

                                           WHEN money.sum :: REAL > 0 :: REAL
                                                AND st.payed > 0
                                             THEN 2 :: INT -- payed for tickets

                                           WHEN money.sum :: REAL > 0 :: REAL
                                                AND (st.payed = 0 OR st.payed IS NULL)
                                                AND NOW() - ticket_orders.created_at >
                                                    (SELECT e.booking_time * '1 hour' :: INTERVAL
                                                     FROM events AS e
                                                     WHERE e.id = ticket_orders.event_id)
                                             THEN 5 :: INT -- payment canceled auto
                                           ELSE ticket_orders.order_status_id END);


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
    DATE_PART('epoch', events.registration_since :: TIMESTAMPTZ) :: INT                    AS registration_since,
    events.ticketing_locally,
    events.is_online,
    view_organizations.city_id,
    (events.ticketing_locally = TRUE
     AND events.status = TRUE
     AND COALESCE(vtt.amount_sum :: INT, 0) > 0
     AND COALESCE((SELECT COUNT(id)
                   FROM view_sold_tickets
                   WHERE view_sold_tickets.event_id = events.id), 0)
         < COALESCE(vtt.amount_sum, 0)) :: BOOLEAN                                         AS ticketing_available
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


CREATE OR REPLACE VIEW view_events AS
  SELECT *
  FROM view_all_events
  WHERE status = TRUE;


ALTER TABLE ticket_types
  ADD UNIQUE (event_id, status, type_code);

ALTER TABLE ticket_types
  ADD COLUMN start_after_ticket_type_code VARCHAR(50);


CREATE OR REPLACE VIEW view_all_ticket_types AS
  SELECT
    ticket_types.id,
    ticket_types.event_id,
    ticket_types.uuid,
    ticket_types.type_code,
    ticket_types.name,
    ticket_types.comment,
    ticket_types.price,
    DATE_PART('epoch', ticket_types.sell_start_date) :: INT AS sell_start_date,
    DATE_PART('epoch', ticket_types.sell_end_date) :: INT   AS sell_end_date,
    ticket_types.start_after_ticket_type_uuid,
    ticket_types.amount,
    ticket_types.min_count_per_user,
    ticket_types.max_count_per_user,
    ticket_types.promocode,
    ticket_types.promocode_effort,
    DATE_PART('epoch', ticket_types.created_at) :: INT      AS created_at,
    DATE_PART('epoch', ticket_types.updated_at) :: INT      AS updated_at,
    sold.count                                              AS sold_count,
    status,
    CASE
    WHEN start_after_ticket_type_code IS NOT NULL
      THEN (
        ((NOW() < sell_end_date AND NOW() > sell_start_date)
         OR (sell_end_date IS NULL AND sell_start_date < NOW())
         OR (sell_start_date IS NULL AND sell_end_date > NOW())
         OR (sell_start_date IS NULL AND sell_end_date IS NULL)
        ) = FALSE OR sold.count >= ticket_types.amount)
    ELSE ((NOW() < sell_end_date AND NOW() > sell_start_date)
          OR (sell_end_date IS NULL AND sell_start_date < NOW())
          OR (sell_start_date IS NULL AND sell_end_date > NOW())
          OR (sell_start_date IS NULL AND sell_end_date IS NULL)
         )
         AND (sold.count IS NULL OR sold.count < ticket_types.amount)
    END                                                     AS is_selling,
    ticket_types.start_after_ticket_type_code
  FROM ticket_types
    LEFT JOIN (SELECT
                 COALESCE(COUNT(tickets.id), 0),
                 tickets.ticket_type_id
               FROM tickets
                 INNER JOIN ticket_orders ON tickets.ticket_order_id = ticket_orders.id
               WHERE tickets.ticket_order_id NOT IN (3, 5, 6, 7)
               GROUP BY tickets.ticket_type_id) AS sold(count, ticket_type_id)
      ON sold.ticket_type_id = ticket_types.id;


CREATE OR REPLACE VIEW view_tickets AS
  SELECT
    tickets.id,
    tickets.user_id,
    tickets.ticket_type_id,
    tickets.ticket_order_id,
    tickets.status,
    tickets.checked_out,
    tickets.uuid,
    view_all_ticket_types.uuid                                                                                AS ticket_type_uuid,
    view_tickets_orders.uuid                                                                                  AS ticket_order_uuid,
    DATE_PART('epoch',
              tickets.created_at) :: INT                                                                      AS created_at,
    DATE_PART('epoch',
              tickets.updated_at) :: INT                                                                      AS updated_at,
    view_tickets_orders.event_id                                                                              AS event_id,
    (view_tickets_orders.status_type_code IN
     ('returned_by_organization', 'payment_canceled_auto', 'payment_canceled_by_client', 'returned_by_user') =
     TRUE) :: BOOLEAN                                                                                         AS is_canceled,
    (view_tickets_orders.status_type_code NOT IN
     ('returned_by_organization', 'payment_canceled_auto', 'payment_canceled_by_client', 'returned_by_user') =
     TRUE) :: BOOLEAN                                                                                         AS is_active,
    view_all_ticket_types.type_code,
    view_all_ticket_types.price,
    RPAD(tickets.id :: TEXT || '00' || reverse((view_tickets_orders.id * 16) :: TEXT), 9, '0') :: TEXT || ' ' AS number,
    tickets.checked_out                                                                                       AS checkout
  FROM tickets
    INNER JOIN view_tickets_orders ON view_tickets_orders.id = tickets.ticket_order_id
    INNER JOIN view_all_ticket_types ON view_all_ticket_types.id = tickets.ticket_type_id;


CREATE OR REPLACE VIEW view_sold_tickets AS
  SELECT
    tickets.id,
    tickets.ticket_type_id,
    ticket_orders.event_id
  FROM tickets
    INNER JOIN ticket_orders ON tickets.ticket_order_id = ticket_orders.id
  WHERE tickets.ticket_order_id NOT IN (3, 5, 6, 7)
  GROUP BY tickets.ticket_type_id, tickets.id, event_id;


CREATE OR REPLACE VIEW view_ticket_types AS
  SELECT
    view_all_ticket_types.id,
    view_all_ticket_types.event_id,
    view_all_ticket_types.uuid,
    view_all_ticket_types.type_code,
    view_all_ticket_types.name,
    view_all_ticket_types.comment,
    view_all_ticket_types.price,
    view_all_ticket_types.sell_start_date,
    view_all_ticket_types.sell_end_date,
    view_all_ticket_types.min_count_per_user,
    view_all_ticket_types.max_count_per_user,
    view_all_ticket_types.created_at,
    view_all_ticket_types.updated_at
  FROM view_all_ticket_types
  WHERE status = TRUE
        AND (type_code <> 'registration' OR type_code IS NULL)
        AND view_all_ticket_types.is_selling = TRUE;


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
                                         INNER JOIN stat_event_types ON stat_event_types.id = stat_organizations.stat_type_id
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