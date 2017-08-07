CREATE TABLE email_texts (
  id           SERIAL PRIMARY KEY,
  event_id     INT NOT NULL REFERENCES events (id) UNIQUE,
  payed        TEXT      DEFAULT NULL,
  approved     TEXT      DEFAULT NULL,
  not_approved TEXT      DEFAULT NULL,
  after_event  TEXT      DEFAULT NULL,
  created_at   TIMESTAMP DEFAULT NOW(),
  updated_at   TIMESTAMP DEFAULT NULL
);

ALTER TABLE "ticket_types"
  DROP CONSTRAINT ticket_types_start_after_ticket_type_uuid_fkey;

DELETE FROM notification_types
WHERE id = 1001;

INSERT INTO notification_types (id, type, timediff, text)
VALUES
  (100, 'notification-order-returned-by-organization', -1, 'Ваш заказ был отменен организатором');

INSERT INTO email_types (id, type_code, name, created_at)
VALUES (12, 'order_payed', 'Заказ успешно оплачен - {event_title}', NOW()),
  (13, 'order_approved', 'Заявка подтверждена - {event_title}', NOW()),
  (14, 'order_not_approved', 'Заявка отклонена - {event_title}', NOW()),
  (15, 'order_after_event', 'Спасибо, что поучаствовали в событии {event_title}', NOW()),
  (16, 'order_waiting_for_payment', 'Остался один час для оплаты заказа - {event_title}', NOW());


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
                                                AND NOW() AT TIME ZONE 'UTC' - ticket_orders.created_at >
                                                    (SELECT e.booking_time * '1 hour' :: INTERVAL
                                                     FROM events AS e
                                                     WHERE e.id = ticket_orders.event_id)
                                             THEN 5 :: INT -- payment canceled auto
                                           ELSE ticket_orders.order_status_id END);


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
    view_all_ticket_types.updated_at,
    view_all_ticket_types.amount,
    view_all_ticket_types.start_after_ticket_type_code,
    view_all_ticket_types.status,
    view_all_ticket_types.is_selling
  FROM view_all_ticket_types
  WHERE status = TRUE
        AND (type_code <> 'registration' OR type_code IS NULL)
        AND view_all_ticket_types.is_selling = TRUE;


CREATE OR REPLACE VIEW view_registration_field_values AS
  SELECT
    view_registration_form_fields.uuid                              AS form_field_uuid,
    view_registration_form_fields.label                             AS form_field_label,
    view_registration_form_fields.type                              AS form_field_type,
    view_registration_form_fields.field_type_id                     AS form_field_type_id,
    view_registration_form_fields.required                          AS form_field_required,
    COALESCE(registration_field_values.value,
             (SELECT string_agg
             (a.a ->> 'value', ', ')
              FROM (SELECT jsonb_array_elements((registration_field_values.values))) AS a(a)
              WHERE registration_field_values.values IS NOT NULL
                    AND registration_field_values.values != 'null')
    )                                                               AS value,
    registration_field_values.values :: JSONB,
    DATE_PART('epoch', registration_field_values.created_at) :: INT AS created_at,
    DATE_PART('epoch', registration_field_values.updated_at) :: INT AS updated_at,
    registration_field_values.ticket_order_id,
    view_tickets_orders.uuid                                        AS ticket_order_uuid,
    view_registration_form_fields.order_number
  FROM registration_field_values
    INNER JOIN view_registration_form_fields
      ON registration_field_values.registration_form_field_id = view_registration_form_fields.id
    INNER JOIN view_tickets_orders ON registration_field_values.ticket_order_id = view_tickets_orders.id;




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
         < COALESCE(vtt.amount_sum, 0)) :: BOOLEAN                                         AS ticketing_available,
    events.booking_time
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

DROP VIEW view_emails_waiting_for_payment;

CREATE OR REPLACE VIEW view_emails_waiting_for_payment AS
  SELECT
    view_events.title                                                             AS event_title,
    view_events.id                                                                AS event_id,
    view_events.organization_id,
    view_events.image_horizontal_large_url,
    view_tickets_orders.uuid                                                      AS order_uuid,
    (view_tickets_orders.created_at +
     (view_events.booking_time * 3600)) - date_part('epoch', NOW() AT TIME ZONE 'UTC') AS time_to_pay,
    "users"."email",
    users.first_name,
    (SELECT token
     FROM tokens
     WHERE user_id = users.id
     ORDER BY id DESC
     LIMIT 1)                                                                     AS token,
    (SELECT value
     FROM view_registration_field_values
     WHERE "view_registration_field_values"."ticket_order_id" = "view_tickets_orders"."id"
           AND "view_registration_field_values"."form_field_type" = 'email'
     ORDER BY value DESC
     LIMIT 1)                                                                     AS "form_email"
  FROM view_tickets_orders
    INNER JOIN view_events ON view_tickets_orders.event_id = view_events.id
    INNER JOIN users ON view_tickets_orders.user_id = users.id
  WHERE view_tickets_orders.status_type_code = 'waiting_for_payment'
        AND view_tickets_orders.uuid NOT IN (SELECT (data ->> 'order_uuid')
                                             FROM emails
                                             WHERE emails.email_type_id = 16 AND
                                                   data ->> 'order_uuid' = view_tickets_orders.uuid)
        AND
        (view_tickets_orders.created_at +
         (view_events.booking_time * 3600)) - date_part('epoch', NOW() AT TIME ZONE 'UTC') BETWEEN 0 AND 3600;


ALTER TABLE ticket_orders ADD COLUMN shop_sum_amount NUMERIC DEFAULT NULL;