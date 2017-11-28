-- adds field for utm
ALTER TABLE ticket_orders
  ADD COLUMN utm_fields JSONB DEFAULT NULL;

-- adds field for utm
ALTER TABLE stat_events
  ADD COLUMN utm_fields JSONB DEFAULT NULL;

-- adds field for user-agent info
ALTER TABLE tokens
  ADD COLUMN user_agent_info JSONB DEFAULT NULL;

-- adds field for user-agent info
ALTER TABLE tokens
  ADD COLUMN user_agent TEXT DEFAULT NULL;

CREATE TABLE broadcasts (
  id                SERIAL PRIMARY KEY,
  uuid              TEXT UNIQUE                       NOT NULL DEFAULT uuid_generate_v4(),
  event_id          INT REFERENCES events (id)        NULL,
  organization_id   INT REFERENCES organizations (id) NULL,
  creator_id        INT REFERENCES users (id),
  is_email          BOOLEAN                                    DEFAULT FALSE,
  is_push           BOOLEAN                                    DEFAULT FALSE,
  is_sms            BOOLEAN                                    DEFAULT FALSE,
  title             TEXT                              NOT NULL,
  message_text      TEXT                                       DEFAULT NULL,
  url               TEXT                                       DEFAULT NULL,
  notification_time TIMESTAMP                                  DEFAULT NOW(),
  is_active         BOOLEAN                                    DEFAULT TRUE,
  done              BOOLEAN                                    DEFAULT FALSE,
  created_at        TIMESTAMP                         NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMP                                  DEFAULT NULL
);

CREATE OR REPLACE VIEW view_broadcasts
AS
  SELECT
    broadcasts.id,
    uuid,
    event_id,
    broadcasts.organization_id,
    COALESCE(broadcasts.organization_id, events.organization_id) AS owner_organization_id,
    is_email,
    is_push,
    is_sms,
    broadcasts.title,
    message_text,
    url,
    notification_time,
    is_active,
    done,
    DATE_PART('epoch', broadcasts.created_at) :: INT             AS created_at,
    DATE_PART('epoch', broadcasts.updated_at) :: INT             AS updated_at
  FROM broadcasts
    LEFT JOIN events ON broadcasts.event_id = events.id;


ALTER TABLE broadcasts
  ADD COLUMN subject TEXT DEFAULT NULL;

CREATE OR REPLACE VIEW view_broadcasts
AS
  SELECT
    broadcasts.id,
    uuid,
    event_id,
    broadcasts.organization_id,
    COALESCE(broadcasts.organization_id, events.organization_id) AS owner_organization_id,
    is_email,
    is_push,
    is_sms,
    broadcasts.title,
    message_text,
    url,
    notification_time,
    is_active,
    done,
    DATE_PART('epoch', broadcasts.created_at) :: INT             AS created_at,
    DATE_PART('epoch', broadcasts.updated_at) :: INT             AS updated_at,
    subject
  FROM broadcasts
    LEFT JOIN events ON broadcasts.event_id = events.id;

CREATE OR REPLACE VIEW view_stats_utm AS
  SELECT
    stat_events.utm_fields ->> 'utm_source'   AS utm_source,
    stat_events.utm_fields ->> 'utm_medium'   AS utm_medium,
    stat_events.utm_fields ->> 'utm_campaign' AS utm_campaign,
    stat_events.utm_fields ->> 'utm_content'  AS utm_content,
    stat_events.utm_fields ->> 'utm_term'     AS utm_term,
    COUNT(*)                                  AS open_count,
    ((SELECT COUNT(*)
      FROM view_tickets_orders
        INNER JOIN ticket_orders ON ticket_orders.id = view_tickets_orders.id
      WHERE view_tickets_orders.ticket_order_status_type = 'green'
            AND stat_events.event_id = view_tickets_orders.event_id
            AND (ticket_orders.utm_fields = stat_events.utm_fields OR
                 ticket_orders.created_at - stat_events.created_at < INTERVAL '1 days')
     ) / COUNT(*))                            AS conversion,
    (SELECT SUM(COALESCE(view_tickets_orders.final_sum, 0))
     FROM view_tickets_orders
       INNER JOIN ticket_orders ON ticket_orders.id = view_tickets_orders.id
     WHERE view_tickets_orders.ticket_order_status_type = 'green'
           AND stat_events.event_id = view_tickets_orders.event_id
           AND (ticket_orders.utm_fields = stat_events.utm_fields OR
                ticket_orders.created_at - stat_events.created_at < INTERVAL '1 days')
    )                                         AS orders_sum,
    event_id
  FROM events
    INNER JOIN stat_events ON stat_events.event_id = events.id
  WHERE
    stat_events.utm_fields IS NOT NULL
    AND utm_fields :: TEXT <> '{}'
  GROUP BY utm_source,
    utm_medium,
    utm_campaign,
    utm_content,
    utm_term,
    event_id,
    utm_fields;

INSERT INTO stat_event_types (name, entity, type_code)
VALUES
  ('Открытие письма', 'email_broadcast', 'open'),
  ('Переход по ссылке из письма', 'email_broadcast', 'open_link'),
  ('Открытие push уведомления', 'push_broadcast', 'open');


ALTER TABLE emails
  ADD COLUMN uuid TEXT UNIQUE NOT NULL DEFAULT uuid_generate_v4();


CREATE TABLE broadcasts_links (
  id           SERIAL PRIMARY KEY,
  uuid         TEXT UNIQUE                           NOT NULL DEFAULT uuid_generate_v4(),
  broadcast_id INT REFERENCES broadcasts (id)        NOT NULL,
  user_id      INT REFERENCES users (id)             NOT NULL,
  url          TEXT                                           DEFAULT NULL,
  created_at   TIMESTAMP                             NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMP                                      DEFAULT NULL
);


CREATE TABLE stat_email_broadcasts (
  id           SERIAL PRIMARY KEY,
  broadcast_id INT REFERENCES broadcasts (id)        NULL,
  created_at   TIMESTAMP                             NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMP                                      DEFAULT NULL
);

CREATE TABLE stat_push_broadcasts (
  id           SERIAL PRIMARY KEY,
  broadcast_id INT REFERENCES broadcasts (id)        NULL,
  created_at   TIMESTAMP                             NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMP                                      DEFAULT NULL
);

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
    view_registration_form_fields.order_number,
    view_tickets_orders.user_id,
    view_tickets_orders.event_id
  FROM registration_field_values
    INNER JOIN view_registration_form_fields
      ON registration_field_values.registration_form_field_id = view_registration_form_fields.id
    INNER JOIN view_tickets_orders ON registration_field_values.ticket_order_id = view_tickets_orders.id;


CREATE OR REPLACE VIEW view_broadcasts_event_email_recipients AS

SELECT
          DISTINCT ON (email)
          users.first_name,
          users.last_name,
          users.email,
          array_to_json(SELECT
                      json_build_object(view_registration_field_values.form_field_type, view_registration_field_values.value)
                      FROM view_registration_field_values
                      WHERE view_registration_field_values.user_id = users.id AND
                            view_registration_field_values.event_id = events.id) AS form_values,
          events.title,
          events.id                                                              AS event_id
        FROM events
          LEFT JOIN favorite_events ON favorite_events.event_id = events.id
          LEFT JOIN view_tickets_orders ON view_tickets_orders.event_id = events.id
          INNER JOIN users ON users.id = favorite_events.user_id AND favorite_events.status = TRUE;

CREATE OR REPLACE VIEW view_broadcasts_organization_email_recipients AS
  SELECT
    DISTINCT ON (users.email)
    users.first_name,
    users.last_name,
    users.email,
    view_organizations.name AS organization_name
  FROM subscriptions
    LEFT JOIN view_organizations ON view_organizations.id = subscriptions.organization_id
    INNER JOIN users ON users.id = subscriptions.user_id
  WHERE subscriptions.status = TRUE
        AND users.email IS NOT NULL;


SELECT *
FROM view_broadcasts_event_email_recipients
WHERE event_id = 6189;