CREATE TABLE tickets_pricing_rule_types (
  id          SERIAL PRIMARY KEY,
  type_code   TEXT      NOT NULL UNIQUE,
  description TEXT      NULL     DEFAULT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP          DEFAULT NULL
);

INSERT INTO tickets_pricing_rule_types (id, type_code, description)
VALUES
  (1, 'tickets_count_between', ''),
  (2, 'order_sum_between', ''),
  (3, 'user_orders_count_between', ''),
  (4, 'user_orders_sum_between', '');

UPDATE tickets_pricing_rule_types
SET type_code = 'user_orders_sum_between'
WHERE id = 4;

-- ALTER TABLE ticket_orders DROP COLUMN ticket_pricing_rule_id;
-- DROP VIEW view_tickets_pricing_rules;
-- DROP TABLE tickets_pricing_rules;

CREATE TABLE tickets_pricing_rules (
  id                           SERIAL PRIMARY KEY,
  uuid                         TEXT UNIQUE        NOT NULL DEFAULT uuid_generate_v4(),
  name                         TEXT,
  event_id                     INT REFERENCES events (id),
  tickets_pricing_rule_type_id INT REFERENCES tickets_pricing_rule_types (id),
  effort                       NUMERIC            NOT NULL,
  is_fixed                     BOOLEAN                     DEFAULT FALSE,
  is_percentage                BOOLEAN                     DEFAULT TRUE,
  rule                         JSONB              NOT NULL,
  enabled                      BOOLEAN                     DEFAULT TRUE,
  created_at                   TIMESTAMP          NOT NULL DEFAULT NOW(),
  updated_at                   TIMESTAMP                   DEFAULT NULL,
  UNIQUE (uuid, event_id, rule, effort, is_fixed, is_percentage)
);

ALTER TABLE events
  ADD COLUMN apply_promocodes_and_pricing_rules BOOLEAN DEFAULT TRUE;

ALTER TABLE ticket_orders
  ADD COLUMN ticket_pricing_rule_id INT REFERENCES tickets_pricing_rules (id) DEFAULT NULL;

ALTER TABLE ticket_orders
  ADD COLUMN ticket_pricing_rule_discount NUMERIC DEFAULT NULL;

CREATE OR REPLACE VIEW view_tickets_pricing_rules AS
  SELECT
    tickets_pricing_rules.id,
    uuid,
    name,
    event_id,
    tickets_pricing_rule_type_id,
    tickets_pricing_rule_types.type_code,
    effort,
    is_percentage,
    is_fixed,
    rule,
    enabled,
    DATE_PART('epoch', tickets_pricing_rules.created_at) :: INT AS created_at,
    DATE_PART('epoch', tickets_pricing_rules.updated_at) :: INT AS updated_at
  FROM tickets_pricing_rules
    INNER JOIN tickets_pricing_rule_types
      ON tickets_pricing_rules.tickets_pricing_rule_type_id = tickets_pricing_rule_types.id;


CREATE OR REPLACE VIEW view_tickets_orders AS
  SELECT
    ticket_orders.id,
    ticket_orders.uuid,
    ticket_orders.user_id,
    ticket_orders.order_content,
    ticket_orders.event_id :: INT,
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
    st.payed,
    CASE WHEN COALESCE(ticket_orders.final_sum, money.sum) < 0
      THEN 0
    ELSE COALESCE(ticket_orders.final_sum, money.sum) END                                        AS final_sum,
    ticket_orders.promocode_id,
    ticket_orders.shop_sum_amount,
    CASE WHEN st.payed > 0
              AND ticket_orders.shop_sum_amount > 0
              AND COALESCE(ticket_orders.final_sum, money.sum) > 0
      THEN ROUND((
                   (COALESCE(ticket_orders.final_sum, money.sum) - ticket_orders.shop_sum_amount) /
                   COALESCE(ticket_orders.final_sum, money.sum) * 100
                 ), 2)
    ELSE NULL END                                                                                AS processing_commission,
    CASE WHEN (events.canceled AND (events.last_event_date + INTERVAL '120 days') > NOW())
      THEN 0 - ((COALESCE(ticket_orders.final_sum, money.sum) - ticket_orders.shop_sum_amount) *  2)
           - (COALESCE(ticket_orders.final_sum, money.sum) * 0.01) --events canceled
    ELSE
      FLOOR(ticket_orders.shop_sum_amount - (COALESCE(ticket_orders.final_sum, money.sum) * 0.01)
            - (CASE WHEN ticket_orders.order_status_id IN (3, 7) OR events.canceled
        THEN COALESCE(ticket_orders.final_sum, money.sum) - ticket_orders.shop_sum_amount
               ELSE 0
               END
            ))
    END                                                                                          AS withdraw_available,
    CASE WHEN st.payed > 0
              AND events.ticketing_locally = TRUE
      THEN (CASE
            WHEN aviso_data ->> 'paymentType' IS NOT NULL
              THEN aviso_data ->> 'paymentType'
            WHEN aviso_data ->> 'legal_entity' = 'true'
              THEN 'LEP'
            WHEN aviso_data ->> 'bitcoin' = 'true'
              THEN 'BTC'
            ELSE 'OTH' END)
    ELSE NULL END                                                                                AS payment_type,
    CASE WHEN st.payed > 0
              AND ticket_orders.shop_sum_amount > 0
              AND COALESCE(ticket_orders.final_sum, money.sum) > 0
      THEN (COALESCE(ticket_orders.final_sum, money.sum) - ticket_orders.shop_sum_amount
            + (CASE WHEN ticket_orders.order_status_id IN (3, 7) OR events.canceled
        THEN (COALESCE(ticket_orders.final_sum, money.sum) - ticket_orders.shop_sum_amount)
               ELSE 0
               END
            )
      )
    ELSE NULL END                                                                                AS processing_commission_value,
    CASE WHEN st.payed > 0
              AND ticket_orders.shop_sum_amount > 0
              AND COALESCE(ticket_orders.final_sum, money.sum) > 0
      THEN FLOOR(COALESCE(ticket_orders.final_sum, money.sum) * 0.01)
    ELSE NULL END                                                                                AS evendate_commission_value,
    (SELECT COUNT(*)
     FROM tickets
     WHERE tickets.ticket_order_id = ticket_orders.id)                                           AS tickets_count,
    tickets_orders_statuses.type                                                                    ticket_order_status_type,
    ticket_orders.ticket_pricing_rule_id,
    ticket_orders.ticket_pricing_rule_discount,
    (CASE WHEN ticket_orders.order_status_id IN (3, 7) OR events.canceled
      THEN (COALESCE(ticket_orders.final_sum, money.sum) - ticket_orders.shop_sum_amount)
     ELSE 0
     END
    )                                                                                            AS additional_commision,
    events.ticketing_locally
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
                 orders_payments.ticket_order_id,
                 orders_payments.aviso_data
               FROM orders_payments
               WHERE orders_payments.canceled = FALSE AND
                     orders_payments.finished = TRUE
               GROUP BY orders_payments.ticket_order_id, aviso_data) AS st(payed, ticket_order_id, aviso_data)
      ON st.ticket_order_id = ticket_orders.id
    INNER JOIN tickets_orders_statuses ON tickets_orders_statuses.id =
                                          (CASE
                                           WHEN events.registration_approvement_required IS TRUE
                                                AND
                                                COALESCE(ticket_orders.final_sum, money.sum) :: REAL = 0 :: REAL
                                                AND
                                                (ticket_orders.order_status_id = 4 OR
                                                 ticket_orders.order_status_id = 1)
                                             THEN 9 :: INT -- should not pay for tickets

                                           WHEN COALESCE(ticket_orders.final_sum, money.sum) :: REAL > 0 :: REAL
                                                AND st.payed > 0 AND (ticket_orders.order_status_id NOT IN (3, 7))
                                             THEN 2 :: INT -- payed for tickets

                                           WHEN COALESCE(ticket_orders.final_sum, money.sum) :: REAL > 0 :: REAL
                                                AND (st.payed = 0 OR st.payed IS NULL)
                                                AND NOW() AT TIME ZONE 'UTC' - ticket_orders.created_at >
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


CREATE OR REPLACE VIEW view_events AS
  SELECT *
  FROM view_all_events
  WHERE status = TRUE;
