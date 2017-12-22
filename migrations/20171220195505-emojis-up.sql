-- Count UTMs for event page, not only for order page
CREATE OR REPLACE VIEW view_stats_utm AS
  SELECT DISTINCT ON (
    stat_events.utm_fields ->> 'utm_source',
    stat_events.utm_fields ->> 'utm_medium',
    stat_events.utm_fields ->> 'utm_campaign',
    stat_events.utm_fields ->> 'utm_content',
    stat_events.utm_fields ->> 'utm_term'
  )
    stat_events.utm_fields ->> 'utm_source'                    AS utm_source,
    stat_events.utm_fields ->> 'utm_medium'                    AS utm_medium,
    stat_events.utm_fields ->> 'utm_campaign'                  AS utm_campaign,
    stat_events.utm_fields ->> 'utm_content'                   AS utm_content,
    stat_events.utm_fields ->> 'utm_term'                      AS utm_term,
    (SELECT COUNT(*)
     FROM stat_events se
     WHERE se.utm_fields = stat_events.utm_fields
    )                                                          AS open_count,
    0 :: BIGINT                                                AS conversion,
    (SELECT COALESCE(SUM(view_tickets_orders.final_sum), 0)
     FROM view_tickets_orders
       INNER JOIN ticket_orders ON ticket_orders.id = view_tickets_orders.id
     WHERE view_tickets_orders.ticket_order_status_type = 'green'
           AND view_tickets_orders.event_id = stat_events.event_id
           AND (ticket_orders.utm_fields = stat_events.utm_fields OR
                ((ticket_orders.created_at - stat_events.created_at < INTERVAL '1 days')
                 AND ticket_orders.user_id = tokens.user_id))) AS orders_sum,
    event_id,
    (SELECT COUNT(view_tickets_orders.id)
     FROM view_tickets_orders
       INNER JOIN ticket_orders ON ticket_orders.id = view_tickets_orders.id
     WHERE view_tickets_orders.ticket_order_status_type = 'green'
           AND view_tickets_orders.event_id = stat_events.event_id
           AND (ticket_orders.utm_fields = stat_events.utm_fields OR
                ((ticket_orders.created_at - stat_events.created_at < INTERVAL '1 days')
                 AND ticket_orders.user_id = tokens.user_id)))
                                                               AS orders_count,
    (SELECT SUM(view_tickets_orders.tickets_count)
     FROM view_tickets_orders
       INNER JOIN ticket_orders ON ticket_orders.id = view_tickets_orders.id
     WHERE view_tickets_orders.ticket_order_status_type = 'green'
           AND view_tickets_orders.event_id = stat_events.event_id
           AND (ticket_orders.utm_fields = stat_events.utm_fields OR
                ((ticket_orders.created_at - stat_events.created_at < INTERVAL '1 days')
                 AND ticket_orders.user_id = tokens.user_id)))
                                                               AS tickets_count
  FROM events
    INNER JOIN stat_events ON stat_events.event_id = events.id
    INNER JOIN tokens ON stat_events.token_id = tokens.id
  WHERE
    stat_events.utm_fields IS NOT NULL
    AND utm_fields :: TEXT <> '{}';


DROP VIEW view_registration_field_values CASCADE;

CREATE MATERIALIZED VIEW view_registration_field_values AS
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
    view_registration_form_fields.order_number,
    view_tickets_orders.user_id,
    view_tickets_orders.event_id
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


SELECT *
FROM log_requests
ORDER BY id DESC
LIMIT 10;