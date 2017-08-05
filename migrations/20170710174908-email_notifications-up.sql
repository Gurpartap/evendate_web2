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
    view_events.title                                                             AS event_title,
    view_events.id                                                                AS event_id,
    view_events.organization_id,
    view_events.image_horizontal_large_url,
    view_tickets_orders.uuid                                                      AS order_uuid,
    (view_tickets_orders.created_at +
     (events.booking_time * 3600)) - date_part('epoch', NOW() AT TIME ZONE 'UTC') AS time_to_pay,
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
         (events.booking_time * 3600)) - date_part('epoch', NOW() AT TIME ZONE 'UTC') BETWEEN 0 AND 3600;